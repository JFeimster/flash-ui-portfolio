#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (key, fallback) => { const i = args.indexOf(key); return i < 0 ? fallback : args[i + 1]; };
const inputDir = path.resolve(option('--input-dir', path.join(process.env.USERPROFILE || '', 'Downloads')));
const output = path.resolve(option('--output', path.join(root, 'data/asset-graph.public.json')));
const check = args.includes('--check');
const summaryOnly = args.includes('--summary');
const slug = value => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const safeText = value => String(value || '').replace(/[\r\n\t]+/g, ' ').replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[redacted]').trim().slice(0, 300);
const publicUrl = (value, host) => {
  try { const u = new URL(value); if (u.protocol !== 'https:' || (host && u.hostname !== host) || u.username || u.password) return null; u.search = ''; u.hash = ''; return u.href; }
  catch { return null; }
};
const localRoute = value => /^\/[a-z0-9/_-]*\/$/.test(value || '') ? value : null;
const read = file => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } };
const entries = data => Array.isArray(data) ? data : Array.isArray(data?.entries) ? data.entries : [];
const source = (name, fallback) => {
  const candidates = [path.join(inputDir, name), path.join(inputDir, 'registry.json', name), ...(fallback || [])];
  const found = candidates.find(fs.existsSync);
  if (!found) warnings.push(`Missing optional source: ${name}`);
  return { records: found ? entries(read(found)) : [], found: found || null };
};
const warnings = [];
const nodes = new Map();
const edges = new Map();
const addNode = node => { if (node?.id && !nodes.has(node.id)) nodes.set(node.id, node); };
const addEdge = (from, to, type, provenance, status = 'recorded') => {
  if (!nodes.has(from) || !nodes.has(to)) { warnings.push(`Unresolved ${type}: ${from} → ${to}`); return; }
  const edge = { from, to, type, provenance, confidence: status === 'verified' ? 1 : 0.8, status };
  edges.set(`${from}|${to}|${type}`, edge);
};

const sites = source('site-registry.json', [path.join(root, 'data/site-registry.json')]);
for (const r of sites.records) {
  const id = slug(r.slug);
  const route = localRoute(r.livePath);
  if (!id || !route || !r.hasIndex || !fs.existsSync(path.join(root, route, 'index.html'))) continue;
  addNode({ id: `site:${id}`, type: 'site', name: safeText(r.title), category: safeText(r.category), summary: '', url: route, route, maturity: 'built', source: 'site-registry', variants: Array.isArray(r.variantNumbers) ? r.variantNumbers.length : 0 });
}

const prompts = source('site-generator-prompts.json', [path.join(root, 'data/site-generator-prompts.json')]);
for (const r of prompts.records) {
  const id = slug(r.id);
  if (!id) continue;
  addNode({ id: `idea:${id}`, type: 'idea', name: safeText(r.name), category: safeText(r.type), summary: safeText(r.factory?.brief?.title ? `${r.brand || ''} · ${r.type || 'Idea'}` : r.type), audience: safeText(r.visitor_psychology), ecosystem: safeText(r.brand), url: '/generator/', route: '/generator/', maturity: 'prompt', source: 'site-generator-prompts' });
  if (nodes.has(`site:${id}`)) addEdge(`idea:${id}`, `site:${id}`, 'implements', 'exact canonical slug in portfolio and prompt registries');
}

const github = source('github-repos.registry.json');
for (const r of github.records) {
  if (r.visibility !== 'public' || r.hidden === true || r.duplicate === true) continue;
  const url = publicUrl(r.github_url, 'github.com');
  const u = url && new URL(url);
  if (!u || !/^\/[\w.-]+\/[\w.-]+\/?$/.test(u.pathname)) continue;
  const key = slug(u.pathname.slice(1));
  addNode({ id: `github:${key}`, type: 'github', name: safeText(r.name || u.pathname.split('/')[2]), summary: safeText(r.description), url, category: safeText(r.project_type), ecosystem: safeText(r.ecosystem), source: 'github-repos', maturity: 'repository' });
}

const vercel = source('vercel-projects.registry.json');
for (const r of vercel.records) {
  if (r.visibility === 'private' || r.hidden === true || r.duplicate === true) continue;
  const url = publicUrl(r.public_url);
  const id = slug(r.vercel_project_id || r.id);
  if (!url || !id || !/\.vercel\.app$/.test(new URL(url).hostname)) continue;
  addNode({ id: `vercel:${id}`, type: 'vercel', name: safeText(r.name), summary: '', url, category: 'Recorded project URL', source: 'vercel-projects', maturity: 'recorded', urlStatus: 'unknown' });
  const repo = String(r.github_repo || '').trim().toLowerCase();
  const repoId = `github:${slug(repo)}`;
  if (repo && nodes.has(repoId)) addEdge(repoId, `vercel:${id}`, 'deployed_as', 'vercel-projects.github_repo', 'recorded');
  else if (repo) warnings.push(`Review Vercel repository reference for ${id}: no matching public repository`);
}

const gpts = source('custom-gpts.registry.json');
for (const r of gpts.records) {
  if (r.visibility === 'private' || r.hidden === true || r.duplicate === true) continue;
  const url = publicUrl(r.access_url, 'chatgpt.com');
  const match = url && new URL(url).pathname.match(/^\/g\/(g-[a-z0-9]+)(?:-[^/]*)?\/?$/i);
  if (!match) continue;
  addNode({ id: `gpt:${match[1].toLowerCase()}`, type: 'gpt', name: safeText(r.name), summary: safeText(r.description), url, category: 'Recorded GPT link', source: 'custom-gpts', maturity: 'recorded' });
}

const commands = source('flash-ui-prompt-commands.registry.json');
for (const r of commands.records) {
  const id = slug(r.id);
  if (!id) continue;
  addNode({ id: `tool:${id}`, type: 'tool', name: safeText(r.name), summary: safeText(r.purpose), category: 'Prompt recipe', source: 'flash-ui-prompt-commands', maturity: 'recipe' });
}

// Optional, additive relation manifest; only exact IDs already present are accepted.
const relations = source('asset-relations.json', [path.join(root, 'data/asset-relations.json')]);
for (const r of entries(read(relations.found || ''))) {
  if (!['implements','source_repository','deployed_as','variation_of','derived_from','related_tool','powered_by','potential_integration'].includes(r.type)) continue;
  if (!['verified','recorded','suggested','unknown'].includes(r.status)) continue;
  if (r.status === 'suggested' || r.status === 'unknown') continue;
  const evidence = publicUrl(r.evidence_url, 'github.com');
  addEdge(r.from, r.to, r.type, evidence || 'reviewed asset-relations manifest', r.status === 'verified' && !evidence ? 'recorded' : r.status);
}

const graph = { schema: 'flash-ui-public-asset-graph/v1', generatedFrom: ['site-registry','site-generator-prompts',...['github-repos','vercel-projects','custom-gpts','flash-ui-prompt-commands'].filter(x => ({'github-repos':github,'vercel-projects':vercel,'custom-gpts':gpts,'flash-ui-prompt-commands':commands})[x].found)], nodes: [...nodes.values()].sort((a,b) => a.id.localeCompare(b.id)), edges: [...edges.values()].sort((a,b) => `${a.from}|${a.to}|${a.type}`.localeCompare(`${b.from}|${b.to}|${b.type}`)) };
const serialized = JSON.stringify(graph, null, 2) + '\n';
const forbidden = /vercel\.com\/|chatgpt\.com\/gpts\/editor|ghp_[A-Za-z0-9]+|sk-[A-Za-z0-9]{20,}|@(?:gmail|outlook|yahoo)\.com/i;
if (forbidden.test(serialized)) throw new Error('Public graph leakage check failed');
const counts = Object.fromEntries([...new Set(graph.nodes.map(n => n.type))].map(type => [type, graph.nodes.filter(n => n.type === type).length]));
console.log(JSON.stringify({ inputDir, counts, edges: graph.edges.length, sourceCounts: { sites: sites.records.length, prompts: prompts.records.length, github: github.records.length, vercel: vercel.records.length, gpts: gpts.records.length, commands: commands.records.length }, warnings: warnings.slice(0, 20), warningCount: warnings.length }, null, 2));
const reviewOutput = option('--review-output', null);
if (reviewOutput && !check) { const target = path.resolve(reviewOutput); fs.mkdirSync(path.dirname(target), { recursive:true }); fs.writeFileSync(target, JSON.stringify({ warnings, counts }, null, 2) + '\n'); }
if (check) { if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== serialized) process.exitCode = 1; }
else if (!summaryOnly) { fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, serialized); }
