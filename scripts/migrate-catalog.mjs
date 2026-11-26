#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveThemes } from '../assets/js/catalog-core.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root,'data',name+'.json'),'utf8').replace(/^\uFEFF/,''));
const showcase = read('asset-showcase'), themes = read('transferable-design-themes'), contracts = read('variant-route-contracts');
const cohort = ['the-cac-payback-analyzer','embed-code-generator','the-gentleman-degenerate','jester-quotes','smb-financial-os','commission-estimator'];
const proposals = [];
for (const id of cohort) {
 const project = showcase.projects[id];
 if (!project) { proposals.push({id,status:'pending-source',proposed:{},warnings:['Not present on this source revision.']}); continue; }
 const evidence = (project.evidence || []).filter(p => fs.existsSync(path.join(root,p)));
 const proposed = {}, provenance = {};
 const set = (field,value,basis) => { if (project.catalog?.[field] == null || (Array.isArray(project.catalog[field]) && !project.catalog[field].length)) { proposed[field]=value; provenance[field]={sources:basis,confidence:'explicit'}; } };
 if (project.audience) set('audiences',[project.audience],['data/asset-showcase.json#projects/'+id+'/audience']);
 if (id === 'the-cac-payback-analyzer' && evidence.some(p => /type=["']number|<input/i.test(fs.readFileSync(path.join(root,p),'utf8'))) && /Calculator interfaces/i.test(project.description)) set('productType','calculator',evidence);
 if (id === 'embed-code-generator' && /embed|snippet/i.test(project.description)) set('productType','generator',['data/asset-showcase.json#projects/'+id+'/description',...evidence]);
 if (id === 'jester-quotes') {
   const editions = read('jester-quotes-editions');
   const variants = {};
   editions.forEach((edition,index) => { if (themes.themes.some(t => t.id === edition.id)) variants[`${id}--variant-${index+1}`] = {designThemeIds:[edition.id],provenance:{designThemeIds:{sources:[`data/jester-quotes-editions.json#${index}/id`],confidence:'explicit'}}}; });
   if (!project.catalog?.variants) set('variants',variants,['data/jester-quotes-editions.json']);
 }
 const contract = contracts.groups.find(g => g.groupId === id);
 const unresolved = [];
 if (contract) for (const variant of contract.variants) {
   // A visual title alone is not evidence of a canonical ID.
   const resolved = resolveThemes(variant.designThemeIds,themes);
   unresolved.push(...resolved.suggestions);
 }
 proposals.push({id,status:'reviewed-evidence',proposed:{schemaVersion:2,...proposed,provenance},evidence,themeSuggestions:unresolved,warnings:contract?.variants.some(v=>!v.designThemeIds) ? ['Variant titles are not canonical theme assignments. Verify theme manifests before migration.'] : []});
 if (process.argv.includes('--apply')) project.catalog = {...proposals.at(-1).proposed,...project.catalog,provenance:{...provenance,...project.catalog?.provenance}};
}
const report = {schemaVersion:2,policy:'Only explicit existing copy or source evidence; preserve user classifications. No title-based theme equivalence.',proposals};
fs.writeFileSync(path.join(root,'data/catalog-migration-review.json'),JSON.stringify(report,null,2)+'\n');
if (process.argv.includes('--apply')) fs.writeFileSync(path.join(root,'data/asset-showcase.json'),JSON.stringify(showcase,null,2)+'\n');
console.log(JSON.stringify({projects:proposals.length,applied:process.argv.includes('--apply'),report:'data/catalog-migration-review.json'}));
