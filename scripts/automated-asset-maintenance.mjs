#!/usr/bin/env node
/* Resumable Batch 43–47 maintenance runner. All archive applies go through the safe transactional importer. */
import fs from 'node:fs';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = name => { const i = args.indexOf(`--${name}`); return i < 0 ? args.find(x => x.startsWith(`--${name}=`))?.slice(name.length + 3) : args[i + 1]; };
const apply = args.includes('--apply');
if (!apply) throw new Error('This maintenance run mutates additive catalogs and preview metadata. Re-run with --apply after confirming the branch and inputs.');
const batchResultsPath = path.resolve(option('batch42-results') || path.join(process.env.USERPROFILE || '', 'Downloads/flash-ui-batch42/batch-42-results.json'));
const batchManifestPath = path.resolve(option('batch42-manifest') || path.join(process.env.USERPROFILE || '', 'Downloads/flash-ui-batch42/flash-ui-static-dry-run.csv'));
const frameworkCsvPath = path.resolve(option('framework-review') || path.join(process.env.USERPROFILE || '', 'Downloads/flash-ui-framework-review.csv'));
const reportPath = path.join(root, 'data/automated-asset-maintenance-report.json');
const summaryPath = path.join(root, 'docs/automated-asset-maintenance-report.md');
const protectedHashes = {
  'data/site-registry.json': 'e455142af2cca5166a9e2e878f982672d73fe623ae7517b43c7c0a96d5fc1efe',
  'data/transferable-design-themes.json': '7b15a1ff22e02ccb2918559cbedcb2533f82de527d9109a2796f8435b72a2496'
};
const branch = spawnSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).stdout.trim();
if (apply && branch !== 'batch-43-47-automated-maintenance') throw new Error(`Apply requires the maintenance branch; current branch is ${branch}`);
for (const input of [batchResultsPath, batchManifestPath, frameworkCsvPath]) if (!fs.existsSync(input)) throw new Error(`Required maintenance input is missing: ${path.basename(input)}`);

const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
async function hashFile(file) { const hash = crypto.createHash('sha256'); for await (const chunk of createReadStream(file)) hash.update(chunk); return hash.digest('hex'); }
const inputIdentity = { batch42Results: sha(batchResultsPath), batch42Manifest: sha(batchManifestPath), frameworkReview: sha(frameworkCsvPath) };
const writeAtomic = (file, value) => {
  const full = path.join(root, file), temp = `${full}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, full);
};
function parseCsv(text) {
  const rows = []; let row = [], value = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"' && text[i + 1] === '"') { value += '"'; i++; } else if (c === '"') quoted = false; else value += c; }
    else if (c === '"') quoted = true;
    else if (c === ',') { row.push(value); value = ''; }
    else if (c === '\n') { row.push(value.replace(/\r$/, '')); rows.push(row); row = []; value = ''; }
    else value += c;
  }
  if (value || row.length) { row.push(value.replace(/\r$/, '')); rows.push(row); }
  const [headers, ...records] = rows;
  return records.filter(item => item.length === headers.length).map(item => Object.fromEntries(headers.map((header, index) => [header, item[index]])));
}
function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, windowsHide: true, ...options });
  if (result.error) throw result.error;
  return result;
}
function runAsync(command, commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { cwd: root, windowsHide: true, ...options });
    let stdout = '', stderr = '';
    child.stdout?.setEncoding('utf8').on('data', chunk => { stdout += chunk; });
    child.stderr?.setEncoding('utf8').on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', status => resolve({ status, stdout, stderr }));
  });
}
function npmJson(result, label) {
  if (result.status !== 0) throw new Error(`${label} failed (${result.status}): ${(result.stderr || result.stdout || '').slice(-4000)}`);
  return JSON.parse(result.stdout.trim());
}
function reportSave() { writeAtomic('data/automated-asset-maintenance-report.json', state); }
function defer(slug, archive, reason) {
  const entry = { slug, archive: path.basename(archive), reason };
  const index = state.deferredArchives.findIndex(item => item.slug === slug);
  if (index < 0) state.deferredArchives.push(entry); else state.deferredArchives[index] = entry;
}

const previous = fs.existsSync(reportPath) ? readJson('data/automated-asset-maintenance-report.json') : null;
const currentResolution = readJson('data/asset-route-resolution.json');
const currentRoutes = new Set((currentResolution.entries || []).filter(x => x.resolutionStatus === 'resolved').map(x => x.resolvedPath));
const state = previous?.schemaVersion === 1 && previous.baseCommit === run('git', ['merge-base', 'HEAD', 'origin/main']).stdout.trim() && JSON.stringify(previous.inputIdentity) === JSON.stringify(inputIdentity) ? previous : {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  baseCommit: run('git', ['rev-parse', 'origin/main']).stdout.trim(),
  inputIdentity,
  inputs: { batch42Results: path.basename(batchResultsPath), batch42Manifest: path.basename(batchManifestPath), frameworkReview: path.basename(frameworkCsvPath) },
  productionSmoke: null,
  recoveredArchives: [],
  deferredArchives: [],
  framework: { examined: 0, cataloged: 0, unresolved: [], classifications: {} },
  routeResolution: null,
  preview: null,
  localValidation: null,
  tests: null,
  protectedFiles: null
};

function currentProtectedHashes() {
  return Object.fromEntries(Object.entries(protectedHashes).map(([file, expected]) => [file, { expected, actual: sha(path.join(root, file)) }]));
}
function assertProtected() {
  for (const [file, item] of Object.entries(currentProtectedHashes())) if (item.actual !== item.expected) throw new Error(`Protected file changed during maintenance: ${file}`);
}
const beforeProtected = currentProtectedHashes();
for (const [file, item] of Object.entries(beforeProtected)) if (item.actual !== item.expected) throw new Error(`Protected file changed before maintenance: ${file}`);

// Production validation runs before candidate imports. Its result is retained so a resumed run does not probe un-deployed additions.
if (!state.productionSmoke) {
  let existingSmoke = null;
  try { existingSmoke = readJson('data/live-path-smoke-test.json'); } catch {}
  const recentSmoke = existingSmoke && /flash-ui-portfolio\.vercel\.app/i.test(existingSmoke.baseUrl || '') &&
    Number.isFinite(Date.parse(existingSmoke.generatedAt)) && Date.now() - Date.parse(existingSmoke.generatedAt) < 2 * 60 * 60 * 1000 &&
    existingSmoke.totalCandidateUrls > 0 && existingSmoke.totalFailed === 0 && existingSmoke.totalManualReview === 0;
  if (recentSmoke) state.productionSmoke = existingSmoke;
  else {
    const smoke = run('pwsh', ['-NoProfile', '-File', path.join(root, 'scripts/live-path-smoke-test.ps1')]);
    if (smoke.status !== 0) throw new Error(`Canonical production smoke test failed: ${(smoke.stderr || smoke.stdout || '').slice(-3000)}`);
    state.productionSmoke = readJson('data/live-path-smoke-test.json');
  }
  if (state.productionSmoke.totalFailed || state.productionSmoke.totalManualReview) throw new Error('Production smoke test found a failure or manual-review route. Stop before changing routes.');
  reportSave();
}

// Phase A: only the 29 rows that the prior Batch 42 report marked blocked are eligible.
const batchResults = JSON.parse(fs.readFileSync(batchResultsPath, 'utf8').replace(/^\uFEFF/, ''));
if (!Array.isArray(batchResults)) throw new Error('Batch 42 results must be an array.');
const blocked = batchResults.filter(item => item.status === 'blocked');
if (blocked.length !== 29) throw new Error(`Expected the known 29 blocked candidates, found ${blocked.length}; refusing a broader import.`);
const manifest = parseCsv(fs.readFileSync(batchManifestPath, 'utf8').replace(/^\uFEFF/, ''));
const manifestBySlug = new Map(manifest.map(row => [row.proposed_slug, row]));
const seenSourceHashes = new Map();
for (const item of blocked) {
  state.deferredArchives = state.deferredArchives.filter(existing => existing.slug !== item.slug);
  const row = manifestBySlug.get(item.slug);
  if (!row || path.resolve(row.path).toLowerCase() !== path.resolve(item.source).toLowerCase()) {
    defer(item.slug, item.source, 'Blocked result has no matching import-manifest row.');
    reportSave();
    continue;
  }
  if (!fs.existsSync(row.path)) {
    defer(item.slug, row.path, 'Source archive is unavailable.');
    reportSave();
    continue;
  }
  const actualHash = await hashFile(row.path);
  if (actualHash.toLowerCase() !== row.sha256.toLowerCase()) {
    defer(item.slug, row.path, 'Source archive hash differs from the reviewed manifest.');
    reportSave();
    continue;
  }
  seenSourceHashes.set(item.slug, actualHash);
  if (state.recoveredArchives.some(x => x.slug === item.slug && x.archiveSha256 === actualHash)) continue;
  const args = [`--source=${row.path}`, `--slug=${row.proposed_slug}`, '--mode=static', '--dry-run'];
  const dry = run(process.execPath, ['scripts/import-asset.mjs', ...args]);
  if (dry.status !== 0) {
    const error = `${dry.stderr || dry.stdout || ''}`;
    const protectedRejection = /Unsafe archive path|exceeds size or compression-ratio limit|Source exceeds file count or size limit/i.test(error);
    if (!protectedRejection) throw new Error(`Unexpected dry-run failure for ${item.slug}: ${error.slice(-2500)}`);
    defer(item.slug, row.path, protectedRejection ? 'Archive remains blocked by traversal, file-count, size, or compression-ratio protections.' : 'Importer failed.');
    reportSave();
    continue;
  }
  let plan;
  try { plan = JSON.parse(dry.stdout.trim()); } catch { throw new Error(`Importer returned unreadable dry-run output for ${item.slug}`); }
  const safeToApply = ['static', 'grouped'].includes(plan.classification) && plan.validation?.entrypoint && !(plan.warnings || []).length && ['new', 'already-imported'].includes(plan.duplicateStatus);
  if (!safeToApply) {
    defer(item.slug, row.path, (plan.warnings || []).join('; ') || `Needs review (${plan.classification}; ${plan.duplicateStatus}).`);
    reportSave();
    continue;
  }
  if (plan.duplicateStatus === 'already-imported') {
    state.recoveredArchives.push({ slug: item.slug, archive: path.basename(row.path), archiveSha256: actualHash, result: 'already-imported' });
    reportSave();
    continue;
  }
  const destination = path.join(root, 'sites', row.proposed_slug);
  if (fs.existsSync(destination)) {
    defer(item.slug, row.path, 'Destination appeared before apply; importer will not overwrite it.');
    reportSave();
    continue;
  }
  const applied = run(process.execPath, ['scripts/import-asset.mjs', `--source=${row.path}`, `--slug=${row.proposed_slug}`, '--mode=static', '--apply']);
  if (applied.status !== 0) throw new Error(`Unexpected transactional apply failure for ${item.slug}; halted: ${(applied.stderr || applied.stdout || '').slice(-3000)}`);
  const application = npmJson(applied, `Importer apply ${item.slug}`);
  if (application.validation?.route !== 'resolved') throw new Error(`Apply did not confirm a resolved route for ${item.slug}`);
  assertProtected();
  state.recoveredArchives.push({ slug: item.slug, archive: path.basename(row.path), archiveSha256: actualHash, result: application.duplicateStatus });
  reportSave();
}

// Phase B: inspect only the 83 archives named by the approved framework review CSV. No archive is extracted or built.
const frameworkRows = parseCsv(fs.readFileSync(frameworkCsvPath, 'utf8').replace(/^\uFEFF/, ''));
if (frameworkRows.length !== 83) throw new Error(`Expected 83 reviewed framework candidates, found ${frameworkRows.length}.`);
const python = process.platform === 'win32' ? 'py' : 'python3';
const pythonArgs = process.platform === 'win32' ? ['-3'] : [];
const inspector = path.join(root, 'scripts/lib/inspect-framework-archive.py');
async function boundedMap(items, concurrency, fn) {
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) { const current = items[index++]; await fn(current); }
  }));
}
const inspections = new Map();
await boundedMap(frameworkRows, 6, async row => {
  if (!row.path || !fs.existsSync(row.path)) { inspections.set(row.path, { status: 'deferred', frameworks: [], packages: [], entrypoints: [], reason: 'archive unavailable' }); return; }
  if (row.sha256 && (await hashFile(row.path)).toLowerCase() !== row.sha256.toLowerCase()) { inspections.set(row.path, { status: 'deferred', frameworks: [], packages: [], entrypoints: [], reason: 'archive hash differs from review CSV' }); return; }
  const result = await runAsync(python, [...pythonArgs, inspector, row.path], { stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) { inspections.set(row.path, { status: 'deferred', frameworks: [], packages: [], entrypoints: [], reason: 'bounded archive metadata inspection failed' }); return; }
  inspections.set(row.path, JSON.parse(result.stdout.trim()));
});

const showcase = readJson('data/asset-showcase.json');
showcase.projects ||= {};
const groupsData = readJson('data/asset-groups.json');
const routeData = readJson('data/asset-route-resolution.json');
const routeGroups = new Set((routeData.groups || []).map(x => x.groupId));
const normalize = value => String(value || '').toLowerCase().replace(/\.(zip|html?)$/i, '').replace(/\b(?:next\.?js|nextjs|react|vite|vue|svelte|wix|static|framework|source|production|export|app)\b/g, ' ').replace(/\b(?:version|variant|v)\s*[-_. ]*\d+\b/g, ' ').replace(/\b\d{10,}\b/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
const generic = new Set(['flash', 'ui', 'site', 'sites', 'web', 'website', 'starter', 'main', 'build', 'template', 'project', 'tool', 'zip', 'index']);
const tokens = value => normalize(value).split(' ').filter(word => word.length > 2 && !generic.has(word));
const targetMap = new Map();
function addTarget(id, title, aliases = [], groupId = '') {
  if (!id) return;
  const current = targetMap.get(id) || { id, title: title || id, aliases: new Set(), groupId };
  for (const alias of [id, title, ...aliases]) if (alias) current.aliases.add(String(alias));
  if (groupId) current.groupId = groupId;
  targetMap.set(id, current);
}
for (const [id, project] of Object.entries(showcase.projects)) addTarget(id, project.title, [project.slug, ...(project.evidence || [])]);
for (const entry of routeData.entries || []) {
  const id = entry.canonicalGroupId || entry.slug;
  const group = (groupsData.groups || []).find(x => x.groupId === id);
  addTarget(id, entry.title, [entry.slug, group?.displayTitle, ...(group?.items || [])], entry.canonicalGroupId || '');
}
for (const group of groupsData.groups || []) addTarget(group.groupId, group.displayTitle, [group.recommendedPrimary, ...(group.items || [])], group.groupId);
for (const groupId of routeGroups) if (!targetMap.has(groupId)) addTarget(groupId, groupId, [], groupId);
function sourceIdentifiers(row, inspected) {
  const pieces = [];
  if (row.existing_site_slug) pieces.push(row.existing_site_slug);
  if (row.html_entry) pieces.push(row.html_entry.split(/[\\/]/)[0]);
  const parts = String(row.path || '').replaceAll('\\', '/').split('/').filter(Boolean);
  pieces.push(...parts.slice(-4, -1), path.basename(row.path || '', '.zip'));
  for (const pkg of inspected.packages || []) if (pkg.name) pieces.push(pkg.name.replace(/^@[^/]+\//, ''));
  return [...new Set(pieces.map(normalize).filter(Boolean))];
}
function associate(row, inspected) {
  const ids = sourceIdentifiers(row, inspected);
  const scored = new Map();
  for (const target of targetMap.values()) {
    let best = 0, evidence = '';
    for (const alias of target.aliases) {
      const normalizedAlias = normalize(alias);
      if (!normalizedAlias) continue;
      for (const source of ids) {
        if (source === normalizedAlias) { best = Math.max(best, 100); evidence = `normalized-exact:${normalizedAlias}`; continue; }
        if (source.length >= 7 && (source.includes(normalizedAlias) || normalizedAlias.includes(source))) { const score = 85 + Math.min(source.length, normalizedAlias.length) / 100; if (score > best) { best = score; evidence = `normalized-identifier:${source}`; } }
        const a = new Set(tokens(source)), b = new Set(tokens(normalizedAlias));
        const overlap = [...a].filter(x => b.has(x)).length;
        const ratio = overlap / Math.max(1, new Set([...a, ...b]).size);
        const score = overlap >= 2 && ratio >= 0.72 ? 70 + ratio : 0;
        if (score > best) { best = score; evidence = `token-match:${source}`; }
      }
    }
    if (best) scored.set(target.id, { target, score: best, evidence });
  }
  const matches = [...scored.values()].sort((a, b) => b.score - a.score);
  if (!matches.length || matches.length > 1 && matches[0].score === matches[1].score) return null;
  return matches[0];
}
const unresolvedFrameworks = [];
const classifiedCounts = {};
let mappedFrameworks = 0;
for (const row of frameworkRows) {
  const inspected = inspections.get(row.path) || { status: 'deferred', frameworks: [], packages: [], entrypoints: [], reason: 'missing inspection result' };
  let detected = [...(inspected.frameworks || [])];
  const nameText = String(row.path).replaceAll('\\', '/').toLowerCase();
  if (!detected.length) {
    if (/next(?:\.js|js)/i.test(nameText) || row.classification === 'nextjs-review') detected = ['Next.js'];
    else if (/react|vite/i.test(nameText)) detected = ['React/Vite'];
    else if (/vue|nuxt/i.test(nameText)) detected = ['Vue'];
    else if (/svelte/i.test(nameText)) detected = ['Svelte'];
    else if (/wix/i.test(nameText)) detected = ['Wix'];
    else if ((row.html_entry || inspected.entrypoints?.length) || row.classification === 'static-review') detected = ['Static HTML'];
    else detected = ['Other'];
  }
  for (const framework of detected) classifiedCounts[framework] = (classifiedCounts[framework] || 0) + 1;
  const nameOnlyInspection = inspected.status !== 'inspected' && detected.some(name => name !== 'Other');
  if (inspected.status !== 'inspected' && !nameOnlyInspection) { unresolvedFrameworks.push({ archive: path.basename(row.path), reason: inspected.reason || 'archive metadata deferred', frameworks: detected }); continue; }
  const match = associate(row, inspected);
  if (!match) { unresolvedFrameworks.push({ archive: path.basename(row.path), reason: 'No unique existing project or family match from archive name, identifiers, package metadata, or catalog evidence.', frameworks: detected }); continue; }
  const { target, evidence } = match;
  if (!showcase.projects[target.id]) {
    if (!target.groupId || !routeGroups.has(target.groupId)) { unresolvedFrameworks.push({ archive: path.basename(row.path), reason: 'Matched group has no existing resolved route or showcase record.', frameworks: detected }); continue; }
    showcase.projects[target.id] = { title: target.title, description: '', catalog: { schemaVersion: 2, provenance: { frameworkImplementations: { sources: ['flash-ui-framework-review.csv'], confidence: 'metadata-match' } } } };
  }
  const project = showcase.projects[target.id];
  project.catalog ||= { schemaVersion: 2 };
  project.catalog.frameworkImplementations ||= [];
  const archiveName = path.basename(row.path);
  const archiveSha256 = row.sha256.toLowerCase();
  const implementationId = crypto.createHash('sha256').update(`${archiveSha256}|${archiveName}`).digest('hex').slice(0, 24);
  const packages = (inspected.packages || []).map(pkg => ({ name: pkg.name, version: pkg.version, path: pkg.path }));
  const implementation = { id: implementationId, name: archiveName.replace(/\.zip$/i, ''), frameworks: detected, packageMetadata: packages, archiveName, archiveSha256, sourceManifest: 'flash-ui-framework-review.csv', inspectionStatus: inspected.status, association: { projectId: target.id, groupId: target.groupId || null, method: evidence }, reviewClassification: row.classification };
  const existing = project.catalog.frameworkImplementations.findIndex(item => item.id === implementationId);
  if (existing < 0) project.catalog.frameworkImplementations.push(implementation);
  else project.catalog.frameworkImplementations[existing] = implementation;
  const architecture = new Set(Array.isArray(project.catalog.architecture) ? project.catalog.architecture : project.catalog.architecture ? [project.catalog.architecture] : []);
  for (const framework of detected) architecture.add(framework);
  project.catalog.architecture = [...architecture].sort();
  project.catalog.provenance ||= {};
  project.catalog.provenance.frameworkImplementations = { sources: ['flash-ui-framework-review.csv', ...(packages.length ? ['archive package.json'] : [])], confidence: nameOnlyInspection ? 'archive-name' : 'metadata-match' };
  mappedFrameworks++;
}
if (apply) writeAtomic('data/asset-showcase.json', showcase);
const familyCounts = new Map();
for (const project of Object.values(showcase.projects)) for (const implementation of project.catalog?.frameworkImplementations || []) {
  const family = implementation.association?.groupId;
  if (family) familyCounts.set(family, (familyCounts.get(family) || 0) + 1);
}
state.framework = { examined: frameworkRows.length, cataloged: mappedFrameworks, classifications: classifiedCounts, groupedFamilies: [...familyCounts].filter(([, count]) => count > 1).length, groupedImplementations: [...familyCounts].reduce((sum, [, count]) => sum + (count > 1 ? count : 0), 0), unresolved: unresolvedFrameworks };
reportSave();

// Phase C: the existing resolver is the authority; it resolves only locally evidenced routes.
const resolve = run('pwsh', ['-NoProfile', '-File', path.join(root, 'scripts/generate-route-resolution.ps1'), '-RepoRoot', root]);
if (resolve.status !== 0) throw new Error(`Route resolution failed: ${(resolve.stderr || resolve.stdout || '').slice(-3000)}`);
assertProtected();
state.routeResolution = JSON.parse(resolve.stdout.trim());
const resolvedData = readJson('data/asset-route-resolution.json');
state.routeResolution.unresolvedEntries = (resolvedData.entries || []).filter(x => ['unresolved', 'missing-entrypoint', 'invalid-entrypoint'].includes(x.resolutionStatus)).map(x => ({ title: x.title, slug: x.slug, status: x.resolutionStatus, originalPath: x.originalPath, sourceFile: x.sourceFile, reason: x.resolutionReason }));
reportSave();

// Phase D: capture with a local static server; existing caches are checked by Pillow and reused.
const importedIds = [...new Set(batchResults.filter(item => item.status === 'imported').map(item => item.applied?.projectId || item.slug))];
const server = spawn(python, [...(process.platform === 'win32' ? ['-3'] : []), '-m', 'http.server', '4173', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore', windowsHide: true });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error('Local preview server exited before becoming ready.');
    try { const response = await fetch('http://127.0.0.1:4173/'); if (response.ok) { ready = true; break; } } catch {}
    await delay(250);
  }
  if (!ready) throw new Error('Local preview server did not become ready on port 4173.');
  const capture = run(process.execPath, ['scripts/capture-previews.mjs'], { env: { ...process.env, PREVIEW_BASE_URL: 'http://127.0.0.1:4173', PREVIEW_CONCURRENCY: '6', PREVIEW_PRIORITY_IDS: importedIds.join(',') } });
  if (capture.status !== 0) throw new Error(`Preview capture failed systemically: ${(capture.stderr || capture.stdout || '').slice(-3000)}`);
  state.preview = readJson('data/preview-capture-report.json');
  reportSave();
  const local = run('pwsh', ['-NoProfile', '-File', path.join(root, 'scripts/local-route-smoke-test.ps1'), '-BaseUrl', 'http://127.0.0.1:4173']);
  if (local.status !== 0) throw new Error(`Local route validation failed: ${(local.stderr || local.stdout || '').slice(-3000)}`);
  state.localValidation = { status: 'passed', summary: local.stdout.trim().split(/\r?\n/).slice(-12) };
  reportSave();
} finally { server.kill(); }

// Phase E uses the existing Asset Explorer details and Catalog architecture filter.
// Framework metadata is stored in asset-showcase.catalog, never in a parallel registry.

// Phase F: local routes first, then the existing automated suite once.
const testFiles = fs.readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.test.mjs')).map(name => `tests/${name}`);
const suite = run(process.execPath, ['--test', ...testFiles]);
if (suite.status !== 0) throw new Error(`Automated test suite failed: ${(suite.stdout || suite.stderr || '').slice(-5000)}`);
state.tests = { status: 'passed', summary: suite.stdout.trim().split(/\r?\n/).slice(-12) };

const afterProtected = currentProtectedHashes();
for (const [file, item] of Object.entries(afterProtected)) if (item.actual !== item.expected) throw new Error(`Protected file changed during maintenance: ${file}`);
state.protectedFiles = afterProtected;
state.generatedAt = new Date().toISOString();
state.unresolvedExceptionCount = state.deferredArchives.length + state.framework.unresolved.length + state.routeResolution.unresolvedEntries.length + state.preview.failures.length + state.preview.duplicateDestinations.length;
reportSave();

const md = [
  '# Automated Asset Maintenance — Batches 43–47', '',
  `- Recovered blocked archives: ${state.recoveredArchives.filter(x => x.result !== 'already-imported').length}`,
  `- Cataloged framework implementations: ${state.framework.cataloged}/${state.framework.examined}`,
  `- Project families with grouped implementations: ${state.framework.groupedFamilies}`,
  `- Framework implementations grouped: ${state.framework.groupedImplementations}`,
  `- Previews generated: ${state.preview.captured}`,
  `- Unresolved exceptions: ${state.unresolvedExceptionCount}`,
  `- Production smoke: ${state.productionSmoke.totalPassed}/${state.productionSmoke.totalCandidateUrls} passed; ${state.productionSmoke.totalFailed} failed`,
  `- Local routes: ${state.localValidation.status}`,
  `- Tests: ${state.tests.status}`,
  '', '## Deferred archives', '',
  ...(state.deferredArchives.length ? state.deferredArchives.map(item => `- ${item.slug} (${item.archive}): ${item.reason}`) : ['None.']),
  '', '## Unresolved framework associations and metadata scans', '',
  ...(state.framework.unresolved.length ? state.framework.unresolved.map(item => `- ${item.archive}: ${item.reason}`) : ['None.']),
  '', '## Unresolved route-resolution entries', '',
  ...(state.routeResolution.unresolvedEntries.length ? state.routeResolution.unresolvedEntries.map(item => `- ${item.status}: ${item.title} — ${item.originalPath} (${item.reason})`) : ['None.']),
  '', '## Preview capture failures', '',
  ...(state.preview.failures.length ? state.preview.failures.map(item => `- ${item.id} — ${item.route}: ${item.reason}`) : ['None.']),
  ''
].join('\n');
fs.writeFileSync(summaryPath, md);
console.log(JSON.stringify({
  recoveredAssets: state.recoveredArchives.filter(x => x.result !== 'already-imported').length,
  frameworkImplementations: state.framework.cataloged,
  projectFamiliesGrouped: state.framework.groupedFamilies,
  frameworkVariationsGrouped: state.framework.groupedImplementations,
  previewsGenerated: state.preview.captured,
  unresolvedExceptions: state.unresolvedExceptionCount,
  productionSmoke: `${state.productionSmoke.totalPassed}/${state.productionSmoke.totalCandidateUrls}`,
  tests: state.tests.status
}, null, 2));
