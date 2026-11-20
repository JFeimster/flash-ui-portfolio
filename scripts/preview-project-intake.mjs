#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
export function inspect(record, registries, routeData) {
 const errors = [];
 const slug = String(record?.slug || '');
 if (!record || typeof record !== 'object' || Array.isArray(record)) return { valid:false, errors:['Provide one JSON project object.'] };
 if (!String(record.title || '').trim()) errors.push('title is required');
 if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push('slug must be lowercase kebab-case');
 if (!['group-hub','static-site','standalone-app','archive'].includes(record.type)) errors.push('type must identify group-hub, static-site, standalone-app, or archive');
 if (!String(record.source || '').trim()) errors.push('source provenance is required');
 if (!/^sites\/[a-z0-9-]+(?:\/variant-[1-9][0-9]*)?$/.test(String(record.path || '')) || String(record.path).includes('..')) errors.push('path must be a safe sites/ path');
 if (!/^\/sites\/[a-z0-9-]+(?:\/variant-[1-9][0-9]*)?\/$/.test(record.livePath || '')) errors.push('livePath must be a normalized /sites/slug/ route');
 if (record.livePath !== '/' + record.path + '/') errors.push('path and livePath must agree');
 if (record.type === 'standalone-app' && record.hasIndex === true) errors.push('standalone app cannot be automatically classified as static from hasIndex');
 const records = registries.flatMap(group => Array.isArray(group) ? group : Array.isArray(group?.entries) ? group.entries : []).filter(x=>x && typeof x==='object');
 if (records.some(x=>x.slug===slug || x.livePath===record.livePath || x.path===record.path)) errors.push('existing registry slug, route, or filesystem path collision');
 const entries = Array.isArray(routeData?.entries) ? routeData.entries : Object.values(routeData?.entries || {});
 if (entries.some(x=>x.slug===slug || x.resolvedPath===record.livePath || x.sourceFile===record.path+'/index.html')) errors.push('existing route resolution collision');
 if (record.type !== 'standalone-app' && record.hasIndex === true && !fs.existsSync(path.join(root,record.path||'', 'index.html'))) errors.push('declared index.html is absent from repository');
 return {valid:errors.length===0,errors,preview:{title:record.title,slug,type:record.type,status:record.status||'proposed',source:record.source,path:record.path,livePath:record.livePath,hasIndex:record.hasIndex===true,variantNumbers:record.variantNumbers||[],notes:record.notes||'',action:'preview-only; no registry mutation'}};
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
 const file = process.argv[2];
 if (!file) { console.error('Usage: node scripts/preview-project-intake.mjs project.json'); process.exitCode=2; }
 else {
 try {
 const proposal=JSON.parse(fs.readFileSync(path.resolve(file),'utf8'));
 const result=inspect(proposal,[read('data/site-registry.json'),read('data/site-registry-static-extractions.json')],read('data/asset-route-resolution.json'));
 console.log(JSON.stringify(result,null,2));if (!result.valid) process.exitCode=1;
 } catch(e) {console.error(e.message);process.exitCode=1;}
 }
}
