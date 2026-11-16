#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = path.join(root, 'data');
const externalRoot = process.env.FLASH_UI_PROMPTS_SOURCE;
if (!externalRoot) throw new Error('Set FLASH_UI_PROMPTS_SOURCE to a checked-out flash-ui-prompts/data directory.');
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(data, file), `${JSON.stringify(value, null, 2)}\n`);
const normal = (value) => String(value || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const prompts = read(path.join(data, 'site-generator-prompts.json'));
const additions = read(path.join(data, 'site-generator-prompt-additions.json'));
const external = read(path.join(externalRoot, 'master-flash-ui-prompts.json'));
const groups = read(path.join(data, 'asset-groups.json'));
if (prompts.entries.length !== 169 || new Set(prompts.entries.map(x => x.id)).size !== 169) throw new Error('Generator baseline changed; review before rebuilding.');
if (external.items.length !== 305 || new Set(external.items.map(x => x.id)).size !== 305) throw new Error('External source baseline changed; review before rebuilding.');
const externalByTitle = new Map();
const generatorByTitle = new Map();
for (const entry of prompts.entries) generatorByTitle.set(normal(entry.name), [...(generatorByTitle.get(normal(entry.name)) || []), entry.id]);
for (const item of external.items) {
  const title = normal(item.name);
  externalByTitle.set(title, [...(externalByTitle.get(title) || []), item.id]);
}
const additionIds = new Set(additions.entries.map(x => x.id));
const groupIds = new Set(groups.groups.map(x => x.groupId));
const sourceUrl = 'https://github.com/JFeimster/flash-ui-prompts/blob/main/data/master-flash-ui-prompts.json';

write('prompt-source-crosswalk.json', {
  schema_version: 'flash-ui-prompt-source-crosswalk/v1',
  generator_source: '/data/site-generator-prompts.json',
  external_source: sourceUrl,
  match_policy: 'Normalized exact title only; all matches are candidates pending semantic review. Unmatched titles are not promoted.',
  entries: prompts.entries.map(entry => ({
    generator_id: entry.id,
    generator_name: entry.name,
    external_prompt_ids: externalByTitle.get(normal(entry.name)) || [],
    status: externalByTitle.has(normal(entry.name)) ? 'title-match-candidate' : 'unmatched',
    source_id: additionIds.has(entry.id) ? 'notion-prompt-library-additions' : 'flash-ui-project-factory',
    match_basis: externalByTitle.has(normal(entry.name)) ? 'normalized-exact-title' : null,
  })),
  external_entries: external.items.map(item => ({
    external_prompt_id: item.id,
    external_name: item.name,
    generator_ids: generatorByTitle.get(normal(item.name)) || [],
    status: generatorByTitle.has(normal(item.name)) ? 'title-match-candidate' : 'unmatched-external-candidate',
    source_id: 'flash-ui-prompts-external',
  })),
});

write('idea-discovery-index.json', {
  schema_version: 'flash-ui-idea-discovery/v1',
  derived_from: '/data/site-generator-prompts.json',
  entry_count: prompts.entries.length,
  entries: prompts.entries.map(entry => ({
    id: entry.id,
    name: entry.name,
    content_kind: entry.factory?.kind || null,
    brand: entry.brand || null,
    category: entry.factory?.archetype || null,
    style_tags: [],
    primary_cta: entry.primary_cta || null,
    source_id: additionIds.has(entry.id) ? 'notion-prompt-library-additions' : 'flash-ui-project-factory',
    related_site_group_ids: groupIds.has(entry.id) ? [entry.id] : [],
    related_external_prompt_ids: externalByTitle.get(normal(entry.name)) || [],
    external_match_status: externalByTitle.has(normal(entry.name)) ? 'title-match-candidate' : 'unmatched',
    canonical_prompt_id: entry.id,
    canonical_prompt_url: `/data/site-generator-prompts.json`,
    source_provenance: additionIds.has(entry.id)
      ? '/data/site-generator-prompt-additions.json'
      : 'flash-ui-prompts.registry.json + flash-ui-project-factory.registry.json',
  })),
});

const indexSpecs = [
  ['category-index.json', 'categories'],
  ['visual-style-index.json', 'visual_styles'],
  ['brand-index.json', 'brands'],
  ['cta-index.json', 'ctas'],
];
const validExternalIds = new Set(external.items.map(x => x.id));
fs.mkdirSync(path.join(data, 'prompt-indexes'), { recursive: true });
for (const [file, key] of indexSpecs) {
  const source = read(path.join(externalRoot, file));
  const seen = new Set();
  for (const bucket of source[key]) {
    if (bucket.count !== bucket.prompt_ids.length) throw new Error(`${file}: count mismatch`);
    for (const id of bucket.prompt_ids) {
      if (!validExternalIds.has(id) || seen.has(id)) throw new Error(`${file}: stale or repeated ID ${id}`);
      seen.add(id);
    }
  }
  fs.writeFileSync(path.join(data, 'prompt-indexes', file), `${JSON.stringify(source, null, 2)}\n`);
}
write('prompt-indexes/README.json', {
  schema_version: 'flash-ui-external-prompt-indexes/v1',
  source: sourceUrl,
  reference_collection_count: 305,
  taxonomy_policy: 'Source labels are discovery metadata only. They do not alter the 12 stable generator designStyles options.',
  files: indexSpecs.map(([file, key]) => ({ file, key, source_url: `https://github.com/JFeimster/flash-ui-prompts/blob/main/data/${file}` })),
});

const registryRoot = process.env.FLASH_UI_NOTION_REGISTRY_SOURCE;
if (registryRoot) {
  fs.mkdirSync(path.join(data, 'candidate-imports'), { recursive: true });
  for (const [file, url, kind] of [
    ['flash-ui-template-patterns.registry.json', 'https://app.notion.com/p/31790a78dab1412388e4fef97e9a3ea5', 'template-pattern'],
    ['flash-ui-prompt-commands.registry.json', 'https://app.notion.com/p/5b1c129cc1244fcea6f8ad2a61e37611', 'prompt-command'],
    ['flash-ui-vertical-prompts.registry.json', 'https://app.notion.com/p/fc9bf9e14d0040309a371949a852538c', 'vertical-candidate'],
  ]) {
    const registry = read(path.join(registryRoot, file));
    const entries = registry.entries.map(x => ({
      id: x.id,
      name: x.name,
      status: Object.values(x).some(v => typeof v === 'string' && /\bTODO\b/i.test(v)) ? 'draft' : 'candidate',
      source_file: x.source_file || null,
    }));
    if (new Set(entries.map(x => x.id)).size !== entries.length) throw new Error(`${file}: duplicate IDs`);
    write(`candidate-imports/${kind}.json`, {
      schema_version: 'flash-ui-candidate-import/v1',
      kind,
      source_id: registry.id,
      source_url: url,
      source_file: file,
      source_visibility: registry.visibility,
      import_policy: 'Metadata only. Review source content and rights before any generator or deployed-site promotion.',
      entry_count: entries.length,
      entries,
    });
  }
}
console.log('Built 169 discovery entries, 169 crosswalk rows, four validated source indexes, and candidate metadata.');
