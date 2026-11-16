#!/usr/bin/env node
// Regenerate the public title-level idea directory without changing either source registry.
// Optional: FLASH_UI_PROMPTS_SOURCE=/path/to/flash-ui-prompts/data node scripts/build-ideas-v2.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = path.join(root, 'data');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const norm = s => String(s || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const cut = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
const canonical = read(path.join(data, 'site-generator-prompts.json')).entries;
const index = read(path.join(data, 'idea-discovery-index.json')).entries;
const remote = process.env.FLASH_UI_PROMPTS_SOURCE;
const source = remote ? path.join(remote, 'master-flash-ui-prompts.json') : path.join(data, 'external-prompt-library.json');
const external = read(source);
if (canonical.length !== 169 || index.length !== 169 || external.items.length !== 305) throw Error('Unexpected prompt source counts; reconcile before rebuilding');
if (new Set(canonical.map(x => x.id)).size !== 169 || new Set(external.items.map(x => x.id)).size !== 305) throw Error('Duplicate source IDs');
const byTitle = new Map();
for (const item of external.items) { const k = norm(item.name), a = byTitle.get(k) || []; a.push(item); byTitle.set(k, a); }
const canonicalTitles = new Set(canonical.map(x => norm(x.name)));
const byId = new Map(index.map(x => [x.id, x]));
const entries = [];
for (const item of canonical) {
  const extras = byTitle.get(norm(item.name)) || [], primary = extras[0] || {}, info = byId.get(item.id) || {};
  entries.push({
    id:item.id,name:item.name,source:'canonical',kind:item.factory?.kind||'site-idea',type:item.type||'Site idea',
    category:item.factory?.archetype||item.type||'Site idea',brand:item.brand||primary.brand||'',visual_style:primary.visual_style||'',
    use_case:primary.use_case||'',source_group:primary.group_name||'',primary_cta:item.primary_cta||primary.primary_cta||'',
    summary:cut(primary.use_case||item.prompt,230),
    search_text:cut([item.name,item.type,item.brand,item.visitor_psychology,item.primary_cta,item.prompt,primary.visual_style,primary.use_case,primary.group_name].join(' '),1500).toLowerCase(),
    canonical_prompt_id:item.id,external_prompt_ids:extras.map(x=>x.id),related_site_group_ids:info.related_site_group_ids||[],
    match_status:extras.length?'title-match-candidate':'canonical-only'
  });
}
let internalVariants = 0;
for (const [title,items] of byTitle) {
  if (canonicalTitles.has(title)) continue;
  const first=items[0]; if (items.length > 1) internalVariants++;
  entries.push({
    id:'external:'+first.id,name:first.name,source:'external',kind:'site-idea',type:first.type||'Site idea',
    category:first.type||'Site idea',brand:first.brand||'',visual_style:first.visual_style||'',use_case:first.use_case||'',
    source_group:first.group_name||'',primary_cta:first.primary_cta||'',summary:cut(first.use_case||first.flash_ui_prompt,230),
    search_text:cut([first.name,first.type,first.visual_style,first.visitor_psychology,first.primary_cta,first.use_case,first.flash_ui_prompt,first.group_name].join(' '),1500).toLowerCase(),
    canonical_prompt_id:null,external_prompt_ids:items.map(x=>x.id),related_site_group_ids:[],
    match_status:items.length>1?'internal-title-variants':'external-only'
  });
}
const result = {
  schema_version:'flash-ui-idea-directory/v2',
  policy:'Unique title-level concepts; canonical generator entries take precedence. Matching by normalized title is not semantic equivalence. Source variants remain available and no published site is inferred.',
  generated_from:{canonical:'/data/site-generator-prompts.json',external:'/data/external-prompt-library.json',
    external_origin:'https://github.com/JFeimster/flash-ui-prompts/blob/main/data/master-flash-ui-prompts.json',
    external_blob_sha:'4105d8eedacc9c7d6481a09b056dacea12c50973'},
  counts:{canonical:169,external_prompts:305,external_distinct_titles:byTitle.size,
    canonical_title_matches:[...canonicalTitles].filter(x=>byTitle.has(x)).length,
    matched_external_prompts:external.items.filter(x=>canonicalTitles.has(norm(x.name))).length,
    external_only_concepts:entries.filter(x=>x.source==='external').length,
    visible_concepts:entries.length,internal_external_title_variants:internalVariants},
  entries
};
if (result.counts.visible_concepts!==370 || result.counts.matched_external_prompts!==103) throw Error('Title reconciliation changed; review before publishing');
if (remote) fs.writeFileSync(path.join(data,'external-prompt-library.json'),JSON.stringify(external,null,2)+'\n');
fs.writeFileSync(path.join(data,'idea-directory.json'),JSON.stringify(result,null,2)+'\n');
console.log('Built '+entries.length+' unique idea cards from 169 canonical and 305 external prompts.');
