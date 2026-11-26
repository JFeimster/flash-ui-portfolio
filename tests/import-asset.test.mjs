import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(root,'scripts/import-asset.mjs');
const run=args=>spawnSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8'});
function isolated() {
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'flash-import-isolated-'));
 fs.mkdirSync(path.join(temp,'data'));fs.mkdirSync(path.join(temp,'sites'));
 const data={
  'site-registry.json':[], 'site-registry-static-extractions.json':[],
  'asset-groups.json':{groups:[]}, 'variant-route-contracts.json':{groups:[]},
  'asset-route-resolution.json':{entries:[],groups:[],generatedAt:'2026-01-01T00:00:00Z'}, 'asset-showcase.json':{projects:{}},
  'asset-previews.json':{projects:{}}, 'transferable-design-themes.json':{themes:[]}
 };
 for(const [name,value] of Object.entries(data))fs.writeFileSync(path.join(temp,'data',name),JSON.stringify(value));
 return temp;
}
test('static directory plans exact route and fingerprints without writing',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-intake space '));
 try {fs.writeFileSync(path.join(dir,'index.html'),'<html><body>Fixture</body></html>');const result=run([`--source=${dir}`,'--slug=test-safe-import','--dry-run']);assert.equal(result.status,0,result.stderr);const report=JSON.parse(result.stdout);assert.equal(report.classification,'static');assert.equal(report.targetRoutes[0],'/sites/test-safe-import/');assert.equal(report.filesystemChanges[0].path,'sites/test-safe-import');assert.ok(report.entrySha256);assert.equal(fs.existsSync(path.join(root,'sites/test-safe-import')),false);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('missing relative assets and framework source require review',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-intake-'));
 try {fs.writeFileSync(path.join(dir,'index.html'),'<html><body><script src="missing.js"></script></body></html>');let result=JSON.parse(run([`--source=${dir}`,'--slug=test-missing']).stdout);assert.ok(result.missingRelativeAssets.includes('missing.js'));fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({dependencies:{next:'1'}}));result=JSON.parse(run([`--source=${dir}`,'--slug=test-framework']).stdout);assert.equal(result.classification,'framework');assert.ok(result.warnings.length);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('dependency validation accepts local directory entrypoints and ignores CSS fragments and template tokens',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-intake-refs-'));
 try{
  fs.mkdirSync(path.join(dir,'about'));
  fs.writeFileSync(path.join(dir,'index.html'),'<html><body><a href="./about/">About</a><a href="[APPLICATION_LINK]">Apply</a><link rel="stylesheet" href="style.css"><script src="app.js"></script></body></html>');
  fs.writeFileSync(path.join(dir,'about/index.html'),'<html><body>About</body></html>');
  fs.writeFileSync(path.join(dir,'style.css'),'svg { mask: url(%23shape); } .icon { background: url("url("); }');
  fs.writeFileSync(path.join(dir,'app.js'),'const route = selectedLender?.["route"];');
  const result=JSON.parse(run([`--source=${dir}`,'--slug=test-safe-reference-scan']).stdout);
  assert.deepEqual(result.missingRelativeAssets,[]);
  assert.deepEqual(result.warnings,[]);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('unsafe ZIP paths and misleading signatures are rejected before extraction',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-zip-'));
 try {const bad=path.join(dir,'bad.zip');const python=process.platform==='win32'?'py':'python3';const script="import zipfile,sys; z=zipfile.ZipFile(sys.argv[1],'w'); z.writestr('../escape.txt','bad'); z.writestr('index.html','<html><body>x</body></html>'); z.close()";assert.equal(spawnSync(python,[...(process.platform==='win32'?['-3']:[]),'-c',script,bad]).status,0);assert.notEqual(run([`--source=${bad}`,'--slug=test-zip']).status,0);fs.writeFileSync(bad,'not a zip');assert.notEqual(run([`--source=${bad}`,'--slug=test-zip']).status,0);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('external manifest stays additive and requires an HTTPS destination',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-external-'));
 try {const file=path.join(dir,'project.json');fs.writeFileSync(file,JSON.stringify({slug:'test-external',name:'External',productionUrl:'https://example.com/'}));const result=JSON.parse(run([`--manifest=${file}`,'--mode=external']).stdout);assert.equal(result.classification,'external');assert.deepEqual(result.warnings,[]);assert.equal(result.filesAdded,0);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('static apply is idempotent and changes only isolated workspace',()=>{
 const temp=isolated(),source=path.join(temp,'source');fs.mkdirSync(source);
 try{
  fs.writeFileSync(path.join(source,'index.html'),'<html><body>Fixture</body></html>');
  fs.writeFileSync(path.join(source,'style.css'),'body { color: black }');
  const args=[`--repo-root=${temp}`,`--source=${source}`,'--slug=isolated-fixture','--apply'];
  let result=run(args);assert.equal(result.status,0,result.stderr);
  const report=JSON.parse(result.stdout);assert.equal(report.validation.route,'resolved');
  assert.equal(fs.existsSync(path.join(temp,'sites/isolated-fixture/index.html')),true);
  const approved=fs.readFileSync(path.join(temp,'data/batch-19c-approved-imports.json'));
  const routes=fs.readFileSync(path.join(temp,'data/asset-route-resolution.json'));
  result=run(args);assert.equal(result.status,0,result.stderr);
  assert.equal(JSON.parse(result.stdout).duplicateStatus,'already-imported');
  assert.deepEqual(fs.readFileSync(path.join(temp,'data/batch-19c-approved-imports.json')),approved);
  assert.deepEqual(fs.readFileSync(path.join(temp,'data/asset-route-resolution.json')),routes);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('failed apply rolls back copied destination and metadata in isolated workspace',()=>{
 const temp=isolated(),source=path.join(temp,'source');fs.mkdirSync(source);
 try{
  fs.writeFileSync(path.join(source,'index.html'),'<html><body>Fixture</body></html>');
  const routeFile=path.join(temp,'data/asset-route-resolution.json');
  const before=fs.readFileSync(routeFile);
  // An invalid ownership override forces the existing route generator to fail after staging.
  fs.writeFileSync(path.join(temp,'data/variant-route-contracts.json'),JSON.stringify({groups:[],sourceOwnershipOverrides:[{sourcePath:'missing.html',groupId:'missing',variantNumber:1}]}));
  const result=run([`--repo-root=${temp}`,`--source=${source}`,'--slug=rollback-fixture','--mode=static','--apply']);
  assert.notEqual(result.status,0);
  assert.equal(fs.existsSync(path.join(temp,'sites/rollback-fixture')),false);
  assert.deepEqual(fs.readFileSync(routeFile),before);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('grouped apply registers variant routes and canonical theme IDs',()=>{
 const temp=isolated(),source=path.join(temp,'group');fs.mkdirSync(source);
 try{
  fs.writeFileSync(path.join(temp,'data/transferable-design-themes.json'),JSON.stringify({themes:[{id:'dada-riot',name:'Dada Riot'}]}));
  fs.writeFileSync(path.join(source,'index.html'),'<html><body>Hub</body></html>');
  for(const number of [1,2]){const folder=path.join(source,'variant-'+number);fs.mkdirSync(folder);fs.writeFileSync(path.join(folder,'index.html'),'<html><body>Variant</body></html>');}
  fs.writeFileSync(path.join(source,'project.json'),JSON.stringify({name:'Grouped Fixture',variants:[{folder:'variant-1',designThemeIds:['dada-riot']},{folder:'variant-2',designThemeIds:['dada-riot']}]}));
  const result=run([`--repo-root=${temp}`,`--source=${source}`,'--slug=grouped-fixture','--apply']);
  assert.equal(result.status,0,result.stderr);
  const report=JSON.parse(result.stdout);assert.equal(report.validation.route,'resolved');assert.deepEqual(report.themeIds,['dada-riot']);
  const routeData=JSON.parse(fs.readFileSync(path.join(temp,'data/asset-route-resolution.json')));
  for(const number of [1,2])assert.ok(routeData.entries.some(x=>x.resolvedPath===`/sites/grouped-fixture/variant-${number}/`&&x.resolutionStatus==='resolved'));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('external and reusable tool registration enrich Catalog v2 without new routes',()=>{
 const temp=isolated(),manifest=path.join(temp,'external.json');
 try{
  fs.writeFileSync(manifest,JSON.stringify({slug:'external-fixture',name:'External fixture',category:'Tools',productionUrl:'https://example.com/tool',repositoryUrl:'https://github.com/example/tool',audiences:['Makers']}));
  let result=run([`--repo-root=${temp}`,`--manifest=${manifest}`,'--mode=external','--apply']);
  assert.equal(result.status,0,result.stderr);
  let showcase=JSON.parse(fs.readFileSync(path.join(temp,'data/asset-showcase.json')));
  assert.equal(showcase.projects['external-fixture'].catalog.schemaVersion,2);
  assert.equal(showcase.projects['external-fixture'].catalog.productCategory,'Tools');
  assert.equal(fs.readdirSync(path.join(temp,'sites')).length,0);
  fs.writeFileSync(manifest,JSON.stringify({slug:'tool-fixture',name:'Tool fixture',productionUrl:'https://example.com/other'}));
  result=run([`--repo-root=${temp}`,`--manifest=${manifest}`,'--mode=tool','--apply']);
  assert.equal(result.status,0,result.stderr);
  showcase=JSON.parse(fs.readFileSync(path.join(temp,'data/asset-showcase.json')));
  assert.equal(showcase.projects['tool-fixture'].catalog.productType,'reusable-tool');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('bulk dry run returns one consolidated report',()=>{
 const temp=isolated(),incoming=path.join(temp,'incoming');fs.mkdirSync(incoming);
 try{
  for(const id of ['first','second']){const dir=path.join(incoming,id);fs.mkdirSync(dir);fs.writeFileSync(path.join(dir,'index.html'),'<html><body>Fixture</body></html>');}
  const result=run([`--repo-root=${temp}`,`--bulk=${incoming}`]);
  assert.equal(result.status,0,result.stderr);
  const report=JSON.parse(result.stdout);assert.equal(report.total,2);assert.equal(report.succeeded,2);
  assert.equal(fs.readdirSync(path.join(temp,'sites')).length,0);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('ZIP apply validates and copies a wrapped static project in an isolated workspace',()=>{
 const temp=isolated(),archive=path.join(temp,'wrapped.zip');
 try{
  const python=process.platform==='win32'?'py':'python3';
  const script="import zipfile,sys; z=zipfile.ZipFile(sys.argv[1],'w'); z.writestr('wrapped/index.html','<html><head><link rel=\"stylesheet\" href=\"style.css\"></head><body>Fixture</body></html>'); z.writestr('wrapped/style.css','body { color: black }'); z.close()";
  assert.equal(spawnSync(python,[...(process.platform==='win32'?['-3']:[]),'-c',script,archive]).status,0);
  const result=run([`--repo-root=${temp}`,`--source=${archive}`,'--slug=wrapped-fixture','--apply']);
  assert.equal(result.status,0,result.stderr);
  const report=JSON.parse(result.stdout);assert.ok(report.archiveSha256);assert.equal(report.missingRelativeAssets.length,0);
  assert.equal(fs.existsSync(path.join(temp,'sites/wrapped-fixture/style.css')),true);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
