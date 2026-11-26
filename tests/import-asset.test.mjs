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
test('static directory plans exact route and fingerprints without writing',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-intake space '));
 try {fs.writeFileSync(path.join(dir,'index.html'),'<html><body>Fixture</body></html>');const result=run([`--source=${dir}`,'--slug=test-safe-import','--dry-run']);assert.equal(result.status,0,result.stderr);const report=JSON.parse(result.stdout);assert.equal(report.classification,'static');assert.equal(report.targetRoutes[0],'/sites/test-safe-import/');assert.equal(report.filesystemChanges[0].path,'sites/test-safe-import');assert.ok(report.entrySha256);assert.equal(fs.existsSync(path.join(root,'sites/test-safe-import')),false);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('missing relative assets and framework source require review',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-intake-'));
 try {fs.writeFileSync(path.join(dir,'index.html'),'<html><body><script src="missing.js"></script></body></html>');let result=JSON.parse(run([`--source=${dir}`,'--slug=test-missing']).stdout);assert.ok(result.missingRelativeAssets.includes('missing.js'));fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({dependencies:{next:'1'}}));result=JSON.parse(run([`--source=${dir}`,'--slug=test-framework']).stdout);assert.equal(result.classification,'framework');assert.ok(result.warnings.length);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('unsafe ZIP paths and misleading signatures are rejected before extraction',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-zip-'));
 try {const bad=path.join(dir,'bad.zip');const python=process.platform==='win32'?'py':'python3';const script="import zipfile,sys; z=zipfile.ZipFile(sys.argv[1],'w'); z.writestr('../escape.txt','bad'); z.writestr('index.html','<html><body>x</body></html>'); z.close()";assert.equal(spawnSync(python,[...(process.platform==='win32'?['-3']:[]),'-c',script,bad]).status,0);assert.notEqual(run([`--source=${bad}`,'--slug=test-zip']).status,0);fs.writeFileSync(bad,'not a zip');assert.notEqual(run([`--source=${bad}`,'--slug=test-zip']).status,0);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('external manifest stays additive and requires an HTTPS destination',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'flash-external-'));
 try {const file=path.join(dir,'project.json');fs.writeFileSync(file,JSON.stringify({slug:'test-external',name:'External',productionUrl:'https://example.com/'}));const result=JSON.parse(run([`--manifest=${file}`,'--mode=external']).stdout);assert.equal(result.classification,'external');assert.deepEqual(result.warnings,[]);assert.equal(result.filesAdded,0);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
