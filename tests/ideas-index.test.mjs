import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { buildIdeasIndex, buildPublicLibrary } from '../scripts/build-ideas-discovery.mjs';

const read = file => JSON.parse(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
const source = read('data/site-generator-prompts.json');
const index = read('data/ideas-discovery-index.json');
const metadata = read('data/ideas-metadata.json');
const links = read('data/asset-links.public.json');
const sites = read('data/site-registry.json');

test('generated index contains all current site ideas and no templates', () => {
  const expected = source.entries.filter(entry => entry.factory?.kind === 'site-idea');
  assert.equal(index.source_entry_count, source.entries.length);
  assert.equal(index.site_idea_count, expected.length);
  assert.equal(index.public_idea_count + index.hidden_idea_count, expected.length);
  assert.deepEqual(index, buildIdeasIndex(source, metadata, links, sites), 'checked-in index must match the canonical library');
  const sourceIds = new Set(expected.map(entry => entry.id));
  assert.ok(index.ideas.every(idea => sourceIds.has(idea.id)));
  assert.equal(new Set(index.ideas.map(idea => idea.id)).size, index.ideas.length);
});

test('public records contain useful basic metadata but no raw prompts', () => {
  for (const idea of index.ideas) {
    assert.ok(idea.title && idea.slug && idea.category && idea.asset_type && idea.summary);
    assert.equal(idea.prompt, undefined);
    assert.equal(idea.flash_ui_prompt, undefined);
    assert.equal(idea.source.registry, 'data/site-generator-prompts.json');
    assert.equal(idea.generator_url, `/generator/?idea=${encodeURIComponent(idea.id)}`);
    assert.equal(idea.detail_url, `/ideas/${idea.slug}/`);
    const page = new URL(`../ideas/${idea.slug}/index.html`, import.meta.url);
    const prompt = read(`data/idea-prompts/${idea.slug}.json`);
    assert.ok(fs.existsSync(page), `missing detail page for ${idea.id}`);
    assert.equal(prompt.id, idea.id);
    assert.equal(prompt.prompt, source.entries.find(entry => entry.id === idea.id).prompt);
  }
  assert.equal(new Set(index.ideas.map(idea => idea.slug)).size, index.ideas.length);
  assert.deepEqual(read('data/site-generator-public.json'), buildPublicLibrary(source, index));
});

test('new site ideas enter the public index with derived missing metadata', () => {
  const next = buildIdeasIndex({ entries: [
    ...source.entries,
    { id: 'new-example', name: 'New Example', prompt: 'PRIVATE PROMPT SENTINEL', factory: { kind: 'site-idea' } },
    { id: 'new-template', factory: { kind: 'design-template' } }
  ] });
  assert.equal(next.site_idea_count, index.site_idea_count + 1);
  assert.equal(next.public_idea_count, index.public_idea_count + 1);
  assert.equal(next.ideas.length, index.ideas.length + 1);
  assert.equal(next.ideas.at(-1).slug, 'new-example');
  assert.equal(next.ideas.at(-1).detail_url, '/ideas/new-example/');
  assert.equal(next.ideas.at(-1).summary, 'A proposed site idea concept in the site idea category.');
  assert.ok(!JSON.stringify(next).includes('PRIVATE PROMPT SENTINEL'));
  assert.ok(!next.ideas.some(idea => idea.id === 'new-template'));
});

test('explicit private and hidden controls omit records from public JSON', () => {
  const next = buildIdeasIndex({ entries: [
    { id: 'public-example', name: 'Public Example', factory: { kind: 'site-idea' } },
    { id: 'private-example', name: 'Private Example', private: true, factory: { kind: 'site-idea' } },
    { id: 'hidden-example', name: 'Hidden Example', publication: { visibility: 'hidden' }, factory: { kind: 'site-idea' } }
  ] });
  assert.equal(next.site_idea_count, 3);
  assert.equal(next.public_idea_count, 1);
  assert.equal(next.hidden_idea_count, 2);
  assert.deepEqual(next.ideas.map(idea => idea.id), ['public-example']);
  assert.ok(!JSON.stringify(next).includes('Private Example'));
  assert.ok(!JSON.stringify(next).includes('Hidden Example'));
  const publicLibrary = buildPublicLibrary({entries: [
    {id:'public-example',factory:{kind:'site-idea'}},
    {id:'private-example',private:true,factory:{kind:'site-idea'}}
  ]}, next);
  assert.deepEqual(publicLibrary.entries.map(entry => entry.id), ['public-example']);
});

test('duplicate IDs and slugs fail before routes are generated', () => {
  const entry = (id, slug) => ({id, name: id, factory: {kind: 'site-idea', output: {project_slug: slug}}});
  assert.throws(() => buildIdeasIndex({entries: [entry('a','first'), entry('a','second')]}), /Duplicate idea ID/);
  assert.throws(() => buildIdeasIndex({entries: [entry('a','same'), entry('b','same')]}), /Duplicate or invalid idea slug/);
});

test('asset links require public allowlisting and recorded provenance', () => {
  const one = {entries: [{id:'one', name:'One', factory:{kind:'site-idea'}}]};
  const manifest = {assets:[{id:'repo:public', public:true, kind:'github-repo', visibility:'public', repo_key:'example/public', title:'Public repo', url:'https://github.com/example/public'},
    {id:'repo:private', public:false, kind:'github-repo', visibility:'private', repo_key:'example/private', title:'Private repo', url:'https://github.com/example/private'}],
    relationships:[{idea_id:'one', asset_id:'repo:public', type:'source_repository', verification:'recorded', provenance:'Manual mapping'},
      {idea_id:'one', asset_id:'repo:private', type:'source_repository', verification:'recorded', provenance:'Manual mapping'}]};
  const result = buildIdeasIndex(one, {}, manifest);
  assert.equal(result.ideas[0].assets.length, 1);
  assert.equal(result.ideas[0].assets[0].title, 'Public repo');
  assert.ok(!JSON.stringify(result).includes('Private repo'));
});

test('all twelve imported prompt recipes have reusable instructions', () => {
  const recipes = read('data/prompt-recipes.public.json').recipes;
  assert.equal(recipes.length, 12);
  assert.equal(new Set(recipes.map(item => item.command)).size, 12);
  assert.ok(recipes.every(item => item.purpose && item.required_input && item.expected_output && item.instruction));
});

test('regeneration removes newly hidden pages and prompt payloads', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'flash-ui-idea-build-'));
  try {
    for (const directory of ['scripts', 'data', 'ideas']) fs.mkdirSync(path.join(temp, directory));
    fs.copyFileSync(new URL('../scripts/build-ideas-discovery.mjs', import.meta.url), path.join(temp, 'scripts/build-ideas-discovery.mjs'));
    fs.writeFileSync(path.join(temp, 'package.json'), '{"type":"module"}');
    fs.writeFileSync(path.join(temp, 'data/site-generator-prompts.json'), JSON.stringify({entries:[
      {id:'temporary',name:'Temporary',prompt:'SECRET SENTINEL',factory:{kind:'site-idea'}}
    ]}));
    const run = () => execFileSync(process.execPath, [path.join(temp, 'scripts/build-ideas-discovery.mjs')]);
    run();
    assert.ok(fs.existsSync(path.join(temp, 'ideas/temporary/index.html')));
    assert.ok(fs.existsSync(path.join(temp, 'data/idea-prompts/temporary.json')));
    fs.writeFileSync(path.join(temp, 'data/ideas-metadata.json'), JSON.stringify({ideas:{temporary:{visibility:'private'}}}));
    run();
    assert.ok(!fs.existsSync(path.join(temp, 'ideas/temporary/index.html')));
    assert.ok(!fs.existsSync(path.join(temp, 'data/idea-prompts/temporary.json')));
    assert.ok(!fs.readFileSync(path.join(temp, 'data/site-generator-public.json'), 'utf8').includes('SECRET SENTINEL'));
    assert.ok(!fs.readFileSync(path.join(temp, 'data/ideas-discovery-index.json'), 'utf8').includes('Temporary'));
  } finally {
    const resolved = fs.realpathSync(temp);
    if (!resolved.startsWith(fs.realpathSync(os.tmpdir()) + path.sep)) throw new Error('Temporary test path escaped the temp directory');
    fs.rmSync(resolved, {recursive:true, force:true});
  }
});
