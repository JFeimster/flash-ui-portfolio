import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'data/site-generator-prompts.json');
const outputPath = path.join(root, 'data/ideas-discovery-index.json');
const metadataPath = path.join(root, 'data/ideas-metadata.json');
const linksPath = path.join(root, 'data/asset-links.public.json');
const publicLibraryPath = path.join(root, 'data/site-generator-public.json');
const promptDir = path.join(root, 'data/idea-prompts');
const routeManifestPath = path.join(root, 'data/ideas-generated-routes.json');
const readOptional = (file, fallback) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;

const text = value => typeof value === 'string' ? value.trim() : '';
const slugify = value => text(value).normalize('NFKD').toLowerCase()
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const titleCase = value => text(value).replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase());

// Hidden entries never enter the public JSON. These flags live on the canonical
// prompt entry; there is no second approval or content registry to maintain.
export function isHidden(entry) {
  const visibility = [entry.visibility, entry.publication?.visibility, entry.factory?.visibility]
    .map(value => text(value).toLowerCase());
  return entry.hidden === true || entry.private === true ||
    entry.publication?.hidden === true || entry.publication?.private === true ||
    visibility.some(value => value === 'hidden' || value === 'private');
}

function isAllowedPublicAsset(asset) {
  if (asset.public !== true || !text(asset.id) || !text(asset.title)) return false;
  let url;
  try { url = new URL(asset.url); } catch { return false; }
  if (url.protocol !== 'https:' || /\/(edit|settings|builder)(?:\/|$)/i.test(url.pathname)) return false;
  if (asset.kind === 'github-repo') return url.hostname === 'github.com' &&
    asset.visibility === 'public' && !!text(asset.repo_key || asset.repo_full_name);
  if (asset.kind === 'vercel-project') return !!text(asset.vercel_project_id);
  if (asset.kind === 'custom-gpt') return url.hostname === 'chatgpt.com' &&
    /^\/g\/g-[^/]+/.test(url.pathname) && !!text(asset.gpt_id || asset.registry_slug);
  return ['widget', 'calculator', 'plugin', 'mcp', 'api', 'webhook'].includes(asset.kind);
}

export function buildIdeasIndex(source, metadata = {}, links = {}, sites = []) {
  if (!Array.isArray(source.entries)) throw new Error('Prompt library must contain entries');
  const kinds = new Map();
  const seen = new Set();
  const slugs = new Set();
  const ideas = [];
  let siteIdeaCount = 0;
  let hiddenCount = 0;

  for (const entry of source.entries) {
    const kind = entry.factory?.kind || 'unknown';
    kinds.set(kind, (kinds.get(kind) || 0) + 1);
    if (kind !== 'site-idea') continue;
    siteIdeaCount++;
    const id = text(entry.id);
    if (!id) throw new Error('Site idea is missing an ID');
    if (seen.has(id)) throw new Error(`Duplicate idea ID: ${id}`);
    seen.add(id);
    if (isHidden(entry) || ['private', 'hidden'].includes(text(metadata.ideas?.[id]?.visibility).toLowerCase())) { hiddenCount++; continue; }

    const override = metadata.ideas?.[id] || {};
    const title = text(entry.name) || text(entry.factory?.brief?.title) || titleCase(id);
    const format = text(entry.type) || text(entry.format) || 'Site Idea';
    const archetype = text(entry.factory?.archetype) || 'other';
    const category = text(entry.category) || (archetype !== 'other' ? titleCase(archetype) : titleCase(format));
    const slug = slugify(entry.factory?.output?.project_slug || entry.slug || title || id) || slugify(id);
    if (!slug || slugs.has(slug)) throw new Error(`Duplicate or invalid idea slug: ${slug}`);
    slugs.add(slug);
    const summary = text(override.summary) || text(entry.description) || `A proposed ${format.toLowerCase()} concept in the ${category.toLowerCase()} category.`;
    const styleMatch = text(entry.prompt).match(/(?:Visual style|Design direction|Style):\s*([^\n.]{3,160})/i);
    const site = sites.find(item => item.slug === slug && item.hasIndex === true &&
      text(item.livePath).startsWith('/sites/') && fs.existsSync(path.join(root, text(item.livePath).slice(1), 'index.html')));
    const allowedRelations = new Set(['implements','inspired_by','variation_of','source_repository','deployed_as','related_tool','powered_by','potential_integration']);
    const explicit = (links.relationships || []).filter(link => link.idea_id === id &&
      allowedRelations.has(link.type) && ['verified', 'recorded'].includes(link.verification) && text(link.provenance) &&
      (links.assets || []).some(asset => asset.id === link.asset_id && isAllowedPublicAsset(asset)))
      .map(link => {
        const asset = links.assets.find(item => item.id === link.asset_id);
        return {id: text(asset.id), kind: text(asset.kind), title: text(asset.title), url: text(asset.url),
          relation: link.type, provenance: text(link.provenance), verification: link.verification,
          capability_type: text(asset.capability_type), integration_status: text(asset.integration_status),
          auth_required: asset.auth_required === true, documentation_url: text(asset.documentation_url)};
      });
    const assets = site ? [{ id: `site:${slug}`, kind: 'portfolio-site', title: site.title,
      url: site.livePath, relation: 'implements', provenance: 'Exact canonical slug match; local index.html exists',
      verification: 'recorded' }, ...explicit] : explicit;
    ideas.push({
      id, title, slug, category, asset_type: format, archetype, summary,
      brand: text(entry.factory?.brief?.brand) || text(entry.brand),
      target_audience: text(override.target_audience) || text(entry.factory?.brief?.audience) || text(entry.visitor_psychology),
      primary_cta: text(entry.factory?.brief?.primary_action) || text(entry.primary_cta),
      starter: text(entry.factory?.starter), workflow: text(entry.factory?.workflow),
      development_status: text(override.build_status) || 'proposed',
      planning_status: text(entry.factory?.planning?.status),
      design_style: text(override.design_style) || text(styleMatch?.[1]),
      design_style_source: text(override.design_style) ? 'editorial metadata' : styleMatch ? 'suggested from source prompt' : '',
      key_features: Array.isArray(override.key_features) ? override.key_features.filter(x => typeof x === 'string') : [],
      complexity: text(override.complexity), monetization: text(override.monetization),
      tool_opportunity: override.marketing_tool || null,
      integration_candidates: (entry.factory?.integration_candidates || []).map(x => ({id: text(x.id), mode: text(x.mode)})).filter(x => x.id),
      tags: [...new Set([format, archetype, ...(override.tags || [])].filter(x => typeof x === 'string' && x))],
      source: {registry: 'data/site-generator-prompts.json', id},
      prompt_url: `/data/idea-prompts/${slug}.json`, detail_url: `/ideas/${slug}/`,
      assets, portfolio_asset_ids: site ? [slug] : [], live_path: site?.livePath || null,
      generator_url: `/generator/?idea=${encodeURIComponent(id)}`
    });
  }

  return {
    schema_version: '1.2.0', id: 'flash-ui-ideas-discovery',
    source_registry: 'data/site-generator-prompts.json',
    description: 'Public site ideas derived from basic prompt-library metadata; raw prompts omitted.',
    publication_policy: 'Site ideas are public by default; explicitly private or hidden entries are excluded.',
    source_entry_count: source.entries.length, site_idea_count: siteIdeaCount,
    public_idea_count: ideas.length, hidden_idea_count: hiddenCount,
    ideas, kinds: Object.fromEntries(kinds)
  };
}

export function writeIdeaRoutes(index) {
  fs.mkdirSync(promptDir, { recursive: true });
  const previous = readOptional(routeManifestPath, { slugs: [] });
  const current = new Set(index.ideas.map(idea => idea.slug));
  for (const old of previous.slugs || []) {
    if (!/^[a-z0-9-]+$/.test(old) || current.has(old)) continue;
    const page = path.join(root, 'ideas', old, 'index.html');
    if (fs.existsSync(page) && fs.readFileSync(page, 'utf8').includes('generated-by: build-ideas-discovery')) {
      fs.rmSync(page);
      if (fs.readdirSync(path.dirname(page)).length === 0) fs.rmdirSync(path.dirname(page));
    }
    const prompt = path.join(promptDir, `${old}.json`);
    if (fs.existsSync(prompt)) fs.rmSync(prompt);
  }
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const byId = new Map(source.entries.map(entry => [entry.id, entry]));
  for (const idea of index.ideas) {
    const directory = path.join(root, 'ideas', idea.slug);
    fs.mkdirSync(directory, { recursive: true });
    const html = `<!doctype html>\n<!-- generated-by: build-ideas-discovery -->\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>${escapeHtml(idea.title)} · Flash UI Ideas</title><meta name="description" content="${escapeHtml(idea.summary)}"><link rel="stylesheet" href="/assets/css/ideas-workbench-base.css"><link rel="stylesheet" href="/assets/css/idea-detail.css"></head><body data-idea-id="${escapeHtml(idea.id)}"><a class="skip" href="#main">Skip to idea</a><header class="masthead"><nav class="shell nav" aria-label="Main navigation"><a class="brand" href="/ideas/">FLASH UI <span>/ IDEAS</span></a><div><a href="/ideas/">All ideas</a><a href="/generator/">Site Generator</a><a href="/sites/">Sites</a></div></nav></header><main class="shell" id="main"><div id="idea-detail" aria-live="polite"><p>Loading idea…</p></div></main><footer class="shell footer">Flash UI · Concept details are proposals, not deployment claims.</footer><script src="/assets/js/idea-detail.js" defer></script></body></html>\n`;
    fs.writeFileSync(path.join(directory, 'index.html'), html);
    fs.writeFileSync(path.join(promptDir, `${idea.slug}.json`), JSON.stringify({id: idea.id, prompt: byId.get(idea.id).prompt || ''}) + '\n');
  }
  fs.writeFileSync(routeManifestPath, JSON.stringify({schema_version: '1.0.0', slugs: [...current]}, null, 2) + '\n');
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const index = buildIdeasIndex(source, readOptional(metadataPath, {}), readOptional(linksPath, {}), readOptional(path.join(root, 'data/site-registry.json'), []));
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2) + '\n');
  writeIdeaRoutes(index);
  fs.writeFileSync(publicLibraryPath, JSON.stringify(buildPublicLibrary(source, index), null, 2) + '\n');
  console.log(`Indexed ${index.source_entry_count} library entries; ${index.public_idea_count} public site ideas; ${index.hidden_idea_count} hidden. Kinds: ${JSON.stringify(index.kinds)}`);
}

export function buildPublicLibrary(source, index) {
  const visible = new Set(index.ideas.map(idea => idea.id));
  const entries = source.entries.filter(entry => !isHidden(entry) &&
    (entry.factory?.kind !== 'site-idea' || visible.has(entry.id)));
  return {...source, entries, entry_count: entries.length};
}
