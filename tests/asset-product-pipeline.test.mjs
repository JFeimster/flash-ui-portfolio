import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Batch 26 reuses existing package manifest and reuse workspace',()=>{const html=read('build/index.html'),js=read('assets/js/asset-product-pipeline.mjs');assert.match(js,/asset-packages\.json/);assert.match(js,/\/use-asset\//);assert.match(js,/missingFiles/);assert.match(js,/externalDependencies/);assert.match(html,/asset-product-pipeline\.mjs/);});
test('no fabricated operational integration or deployment claims',()=>{const js=read('assets/js/asset-product-pipeline.mjs');assert.match(js,/deployment not verified/);assert.match(js,/unverified/);});
