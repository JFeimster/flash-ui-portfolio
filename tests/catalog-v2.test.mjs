import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { normalizeCatalog, matchesCatalog, sortCatalog, themePreview, resolveThemes } from '../assets/js/catalog-core.mjs';
const { applyCuratedCollections } = await import('data:text/javascript;base64,' + fs.readFileSync(new URL('../assets/js/curated-collections.js',import.meta.url)).toString('base64'));
const read = name => JSON.parse(fs.readFileSync(new URL('../data/'+name+'.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
const themes = {themes:[{id:'first',name:'First',aliases:['documented']},{id:'second',name:'Second'}]};
const fixture = () => ({ themes, routes:{groups:[{groupId:'group',displayTitle:'Group',hubPath:'/sites/group/'}],entries:[{slug:'group',type:'group-hub',canonicalGroupId:'group',resolvedPath:'/sites/group/',resolutionStatus:'resolved'},...[1,2].map(n => ({slug:'group-'+n,canonicalGroupId:'group',variantNumber:n,resolutionStatus:'resolved',resolvedPath:`/sites/group/variant-${n}/`}))]},showcase:{projects:{group:{catalog:{designThemeIds:['similar'],defaultVariantId:'missing',variants:{'group--variant-1':{designThemeIds:['first']},'group--variant-2':{designThemeIds:['second']}}}}}},previews:{projects:{second:{familyId:'group',target:'/sites/group/variant-2/',image:'/assets/previews/second.webp'}}}});
test('normalization is pure and deterministic; group membership owns counts and defaults',()=>{
 const source=fixture(), before=JSON.stringify(source), a=normalizeCatalog(source);
 assert.equal(a.length,1); assert.equal(a[0].count,2); assert.equal(a[0].catalog.defaultVariantId,null); assert.equal(a[0].invalidDefaultVariant,true);
 assert.deepEqual(a[0].catalog.designThemeIds,['first','second']); assert.equal(a[0].themeSuggestions[0].value,'similar');
 assert.deepEqual(normalizeCatalog(source),a); assert.equal(JSON.stringify(source),before);
});
test('themes require IDs or documented aliases; matching preview preserves canonical route',()=>{
 assert.deepEqual(resolveThemes(['documented','First','unknown'],themes).ids,['first']);
 const row=normalizeCatalog(fixture())[0];
 for(const id of ['first','second']) assert.ok(matchesCatalog(row,{designThemeIds:id}));
 const selected=themePreview(row,'second'); assert.equal(selected.path,row.path); assert.equal(selected.image,'/assets/previews/second.webp'); assert.equal(selected.previewTarget,'/sites/group/variant-2/');
});
test('metadata search, intersected filters, missing dates and stable tie sorting',()=>{
 const [row]=normalizeCatalog(fixture()); row.catalog.capabilities=['Planning'];
 assert.ok(matchesCatalog(row,{q:'planning',capabilities:'Planning'})); assert.ok(!matchesCatalog(row,{q:'planning',lifecycle:'live'}));
 const dated={...row,id:'dated',catalog:{...row.catalog,createdAt:'2025-01-01'}};
 assert.equal(sortCatalog([row,dated],'created')[0].id,'dated');
 assert.equal(sortCatalog([row,{...row,id:'aaa'}],'updated')[0].id,'aaa');
});
test('framework implementation metadata is searchable and filterable through architecture',()=>{
 const source=fixture();
 source.showcase.projects.group.catalog.architecture=['Next.js'];
 source.showcase.projects.group.catalog.frameworkImplementations=[{id:'impl-next',name:'nextjs.zip',frameworks:['Next.js'],packageMetadata:[{name:'next',version:'15'}]}];
 const [row]=normalizeCatalog(source);
 assert.ok(matchesCatalog(row,{architecture:'Next.js'}));
 assert.ok(matchesCatalog(row,{q:'nextjs.zip'}));
 assert.equal(row.catalog.frameworkImplementations[0].packageMetadata[0].version,'15');
});
test('real catalog preserves all previously visible destinations and canonical group identities',()=>{
 const routes=applyCuratedCollections(read('asset-route-resolution'),read('curated-collections'));
 const rows=normalizeCatalog({routes,showcase:read('asset-showcase'),previews:read('asset-previews'),themes:read('transferable-design-themes'),registry:read('site-registry'),groups:read('asset-groups'),contracts:read('variant-route-contracts')});
 for(const group of routes.groups) assert.equal(rows.filter(r=>r.id===group.groupId).length,1);
 const destinations=new Set(rows.flatMap(r=>[r.path,...r.members.map(e=>e.resolvedPath)]));
 for(const e of routes.entries.filter(e=>e.resolutionStatus==='resolved'&&e.resolvedPath)) assert.ok(destinations.has(e.resolvedPath),e.resolvedPath);
 assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
});
