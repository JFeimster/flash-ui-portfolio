import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, stat, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const data = join(root, 'data');
const load = async file => JSON.parse(await readFile(join(data, file), 'utf8'));
const unique = values => new Set(values).size === values.length;
const localUrl = value => typeof value === 'string' && value.startsWith('/data/');
const listJson = async dir => (await readdir(join(data, dir))).filter(file => file.endsWith('.json')).map(file => join(dir, file));

test('all new JSON parses; derived and candidate files declare schema versions', async () => {
  const files = ['idea-source-index.json', 'prompt-source-crosswalk.json', 'idea-discovery-index.json', 'external-project-references.json', 'prompt-indexes/README.json', ...await listJson('candidate-imports')];
  for (const file of files) assert.equal(typeof (await load(file)).schema_version, 'string', file);
  for (const file of await listJson('prompt-indexes')) assert.ok(await load(file), file);
});

test('discovery maps one-to-one to the 169 canonical generator entries', async () => {
  const generator = await load('site-generator-prompts.json');
  const additions = await load('site-generator-prompt-additions.json');
  const ideas = await load('idea-discovery-index.json');
  const groups = await load('asset-groups.json');
  const catalogs = await load('site-generator-catalogs.json');
  assert.equal(generator.entry_count, 169);
  assert.equal(generator.entries.length, 169);
  assert.ok(unique(generator.entries.map(x => x.id)));
  assert.equal(additions.entries.length, 64);
  assert.ok(additions.entries.every(x => generator.entries.some(entry => entry.id === x.id)));
  assert.deepEqual(catalogs.designStyles.map(x => x.id), ['recommend','luxury-bento','neobrutalist','cyberpunk','futuristic-minimal','bioluminescent','retro-crt','grainy-risograph','industrial-blueprint','cinematic-dark-luxe','volumetric-spectral','custom']);
  assert.equal(ideas.entry_count, 169);
  assert.deepEqual(ideas.entries.map(x => x.id), generator.entries.map(x => x.id));
  const groupIds = new Set(groups.groups.map(x => x.groupId));
  for (const idea of ideas.entries) {
    assert.equal(idea.canonical_prompt_id, idea.id);
    assert.equal(idea.canonical_prompt_url, '/data/site-generator-prompts.json');
    assert.ok(['site-idea', 'design-template'].includes(idea.content_kind));
    assert.ok(!('prompt' in idea) && !('livePath' in idea));
    assert.ok(idea.related_site_group_ids.every(id => groupIds.has(id)));
  }
});

test('crosswalk and sparse external indexes retain referential provenance', async () => {
  const crosswalk = await load('prompt-source-crosswalk.json');
  const ideas = await load('idea-discovery-index.json');
  const externalIds = new Set(crosswalk.external_entries.map(x => x.external_prompt_id));
  assert.equal(crosswalk.entries.length, 169);
  assert.equal(crosswalk.external_entries.length, 305);
  assert.ok(unique([...externalIds]));
  assert.deepEqual(crosswalk.entries.map(x => x.generator_id), ideas.entries.map(x => x.id));
  assert.deepEqual(crosswalk.entries.map(x => x.external_prompt_ids), ideas.entries.map(x => x.related_external_prompt_ids));
  assert.ok(crosswalk.entries.every(x => x.source_id && x.external_prompt_ids.every(id => externalIds.has(id))));
  assert.ok(crosswalk.external_entries.every(x => x.source_id === 'flash-ui-prompts-external'));
  for (const [file, key] of [['category-index.json','categories'],['visual-style-index.json','visual_styles'],['brand-index.json','brands'],['cta-index.json','ctas']]) {
    const index = await load(`prompt-indexes/${file}`);
    const ids = index[key].flatMap(x => x.prompt_ids);
    assert.ok(unique(ids), file);
    assert.ok(ids.every(id => externalIds.has(id)), file);
    assert.ok(index[key].every(x => x.count === x.prompt_ids.length), file);
  }
});

test('source and candidate metadata remain public-safe and linked', async () => {
  const sources = await load('idea-source-index.json');
  const candidates = await Promise.all(['template-pattern','prompt-command','vertical-candidate'].map(x => load(`candidate-imports/${x}.json`)));
  assert.ok(unique(sources.sources.map(x => x.id)));
  assert.deepEqual(candidates.map(x => x.entry_count), [107, 12, 28]);
  for (const source of sources.sources) {
    if (source.local_path) assert.ok(localUrl(source.local_path));
    if (source.source_url) assert.match(source.source_url, /^https:\/\//);
  }
  for (const collection of candidates) {
    assert.ok(unique(collection.entries.map(x => x.id)));
    assert.ok(collection.entries.every(x => x.id && x.name && !('prompt' in x)));
    assert.ok(collection.entries.every(x => ['draft', 'candidate'].includes(x.status)));
  }
  assert.ok(candidates[2].entries.every(x => x.status === 'draft'));
  const refs = await load('external-project-references.json');
  assert.ok(refs.projects.every(x => x.repository_url.startsWith('https://github.com/JFeimster/')));
  assert.ok(refs.projects.every(x => !('livePath' in x)));
});

test('canonical site registry and every published route remain intact', async () => {
  const bytes = await readFile(join(data, 'site-registry.json'));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '1d85202d470667ff23fa0c5d5973a51da1269c09fd10e097cbf21fe2dbf939cc');
  const registry = JSON.parse(bytes);
  for (const site of registry) {
    if (!site.livePath?.startsWith('/sites/') || !site.hasIndex) continue;
    await stat(join(root, decodeURIComponent(site.livePath.slice(1)), 'index.html'));
  }
});
