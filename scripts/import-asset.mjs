#!/usr/bin/env node
/** Additive project intake. All writes are planned before any destination is touched. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolveThemes, catalogFields} from '../assets/js/catalog-core.mjs';

const scriptRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const option=name=>{const i=args.indexOf('--'+name);return i<0?args.find(x=>x.startsWith('--'+name+'='))?.slice(name.length+3):args[i+1];};
const flag=name=>args.includes('--'+name);
const root=path.resolve(option('repo-root')||scriptRoot);
const rel=p=>path.relative(root,p).replaceAll('\\','/');
const read=(name,fallback)=>{const file=path.join(root,name);return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'')):structuredClone(fallback);};
const json=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const bytes=p=>fs.readFileSync(p);
const sha=p=>crypto.createHash('sha256').update(bytes(p)).digest('hex');
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');};
const slugify=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const list=x=>Array.isArray(x)?x:x==null?[]:[x];
const samePath=(a,b)=>path.resolve(a).toLowerCase()===path.resolve(b).toLowerCase();
const within=(p,base)=>samePath(p,base)||path.resolve(p).toLowerCase().startsWith(path.resolve(base).toLowerCase()+path.sep);
const url=x=>{try{const u=new URL(x);return u.protocol==='https:'?u.origin.toLowerCase()+u.pathname.replace(/\/$/,'').toLowerCase():'';}catch{return '';}};
const norm=x=>String(x||'').replaceAll('\\','/').replace(/\/$/,'').toLowerCase();
const manifestPath=option('manifest');
const sourceOption=option('source')||args.find(x=>/\.zip$/i.test(x));
const bulkOption=option('bulk');
const modeOption=option('mode')||'auto';
const apply=flag('apply');
const reportPath=option('report');
const previewBase=option('preview-base');
if(!['auto','static','grouped','existing','external','tool'].includes(modeOption))throw Error('Invalid --mode');
if(!sourceOption&&!manifestPath&&!bulkOption)throw Error('Usage: node scripts/import-asset.mjs --source "C:\\path\\project" [--manifest "C:\\path\\project.json"] [--slug id] [--mode static|grouped|existing|external|tool] [--apply] [--report "C:\\path\\report.json"] [--bulk "C:\\path\\incoming"] [--repo-root "C:\\path\\isolated-repo"] [--preview-base http://localhost:4173]');
if(reportPath&&!within(path.resolve(reportPath),root))throw Error('Report must be inside repository');

const approvedFile='data/batch-19c-approved-imports.json';
const showcaseFile='data/asset-showcase.json';
const contractFile='data/variant-route-contracts.json';
const routeFile='data/asset-route-resolution.json';
const previewFile='data/asset-previews.json';
const sourceSets=['data/site-registry.json','data/site-registry-static-extractions.json',approvedFile];
const themeMaster=read('data/transferable-design-themes.json',{themes:[]});
const arrayData=file=>{const value=read(file,[]);return Array.isArray(value)?value:list(value.entries||value.projects||value.items);};
const routeData=()=>read(routeFile,{entries:[],groups:[]});
const allRecords=()=>sourceSets.flatMap(file=>arrayData(file).map(item=>({...item,registrySource:file})));
const fingerprint=files=>crypto.createHash('sha256').update(JSON.stringify(files.map(f=>[f.path,f.sha256]))).digest('hex');

function filesUnder(dir) {
 const files=[];
 function visit(folder){for(const item of fs.readdirSync(folder,{withFileTypes:true})){const file=path.join(folder,item.name);if(item.isSymbolicLink())throw Error('Symlink source requires review: '+file);if(item.isDirectory())visit(file);else if(item.isFile())files.push({path:path.relative(dir,file).replaceAll('\\','/'),sha256:sha(file),size:fs.statSync(file).size});else throw Error('Unsupported source entry: '+file);}}
 visit(dir);
 if(files.length>3000||files.reduce((total,file)=>total+file.size,0)>200_000_000)throw Error('Source exceeds file count or size limit');
 return files.sort((a,b)=>a.path.localeCompare(b.path));
}
function stage(source) {
 if(!source)return {folder:null,cleanup:()=>{},archiveSha256:null};
 if(!fs.existsSync(source))throw Error('Source unavailable: '+source);
 if(fs.statSync(source).isDirectory())return {folder:source,cleanup:()=>{},archiveSha256:null};
 if(!/\.zip$/i.test(source))throw Error('Only ZIP archives or directories can be imported');
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'flash-asset-'));
 try {
  const python=process.platform==='win32'?'py':'python3';
  const output=execFileSync(python,[...(process.platform==='win32'?['-3']:[]),path.join(scriptRoot,'scripts/lib/safe-archive.py'),source,folder],{encoding:'utf8'});
  return {folder,cleanup:()=>fs.rmSync(folder,{recursive:true,force:true}),archiveSha256:JSON.parse(output).archiveSha256};
 }catch(e){fs.rmSync(folder,{recursive:true,force:true});throw e;}
}
function projectRoot(folder) {
 if(!folder)return null;
 if(fs.existsSync(path.join(folder,'index.html')))return folder;
 const dirs=fs.readdirSync(folder,{withFileTypes:true}).filter(x=>x.isDirectory());
 if(dirs.length===1&&fs.existsSync(path.join(folder,dirs[0].name,'index.html')))return path.join(folder,dirs[0].name);
 return folder;
}
function localRefs(file) {
 const body=fs.readFileSync(file,'utf8'), refs=[];
 if(/\.css$/i.test(file)){for(const m of body.matchAll(/(?:url\(\s*|@import\s+)(?:["']?)([^"'\)\s]+)["']?\s*\)?/gi))refs.push(m[1]);}
 else if(/\.html?$/i.test(file)){for(const m of body.matchAll(/\b(?:src|href|poster|data-src)\s*=\s*["']([^"']+)["']/gi))refs.push(m[1]);for(const m of body.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi))refs.push(...m[1].split(',').map(x=>x.trim().split(/\s+/)[0]));}
 else if(/\.[cm]?js$/i.test(file)){for(const m of body.matchAll(/\b(?:import|export)\s*(?:[^"']*?from\s*)?["'](\.[^"']+)["']/g))refs.push(m[1]);}
 return refs.filter(x=>x&&!/^(?:[a-z]+:|\/|#|data:|\/\/)/i.test(x));
}
function validateEntries(base, entries) {
 const missing=[], visited=new Set(), checked=[];
 function inspect(file){
  if(visited.has(file))return;visited.add(file);checked.push(path.relative(base,file).replaceAll('\\','/'));
  for(const ref of localRefs(file)){
   let target;
   try{target=path.resolve(path.dirname(file),decodeURIComponent(ref.split(/[?#]/)[0]));}catch{missing.push(ref);continue;}
   if(!within(target,base)){missing.push(ref+' (escapes project)');continue;}
   if(!fs.existsSync(target)||!fs.statSync(target).isFile()){missing.push(ref);continue;}
   if(/\.(?:html?|css|[cm]?js)$/i.test(target))inspect(target);
  }
 }
 for(const entry of entries){if(!fs.existsSync(entry)||!fs.statSync(entry).isFile())missing.push(path.relative(base,entry).replaceAll('\\','/')+' (entry missing)');else inspect(entry);}
 return {missing:[...new Set(missing)],checked};
}
function inventory() {
 const records=allRecords(), routes=routeData(), showcase=read(showcaseFile,{projects:{}}), groups=read('data/asset-groups.json',{groups:[]}), contracts=read(contractFile,{groups:[]});
 const external=read('data/project-links.json',{projects:[]});
 return {records,routes,showcase,groups:list(groups.groups),contracts:list(contracts.groups),external:list(external.projects)};
}
function duplicateEvidence(id, manifest, fp, inventory) {
 const matches=[], repo=url(manifest.repositoryUrl||manifest.repository), production=url(manifest.productionUrl);
 const add=(kind,source,value,owner)=>matches.push({kind,source,value,owner});
 for(const row of inventory.records){
  const owner=row.slug||row.projectId;
  if(owner===id)add('slug',row.registrySource,owner,owner);
  if(norm(row.path)===`sites/${id}`||norm(row.livePath)===`/sites/${id}`)add('route',row.registrySource,row.livePath||row.path,owner);
  if(fp&&row.sourceFingerprint===fp)add('fingerprint',row.registrySource,fp,owner);
  if(repo&&url(row.repositoryUrl||row.repository)===repo)add('repository',row.registrySource,repo,owner);
  if(production&&url(row.productionUrl)===production)add('production',row.registrySource,production,owner);
 }
 for(const row of inventory.routes.entries||[]){
  if(row.slug===id||row.canonicalGroupId===id)add('route-owner',routeFile,row.resolvedPath||row.slug);
  if(norm(row.resolvedPath)===`/sites/${id}`)add('route',routeFile,row.resolvedPath);
 }
 for(const row of [...inventory.groups,...inventory.contracts,...list(inventory.routes.groups)]){
  if(row.groupId===id)add('canonical-group','asset groups or contracts',id);
 }
 for(const [key,row] of Object.entries(inventory.showcase.projects||{})){
  if(key===id)add('catalog',showcaseFile,key,key);
  if(repo&&url(row.catalog?.repositoryUrl)===repo)add('repository',showcaseFile,repo,key);
  if(production&&url(row.catalog?.productionUrl)===production)add('production',showcaseFile,production,key);
  if(fp&&row.catalog?.sourceFingerprint===fp)add('fingerprint',showcaseFile,fp,key);
 }
 for(const row of inventory.external){if(repo&&url(row.repository_url||row.repositoryUrl)===repo)add('repository','data/project-links.json',repo,row.id);if(production&&url(row.production_url||row.productionUrl)===production)add('production','data/project-links.json',production,row.id);}
 return matches;
}
function catalogFrom(manifest,themeIds,variants,fp,previous={}) {
 const input={...manifest.catalog,...Object.fromEntries(catalogFields.filter(k=>manifest[k]!==undefined).map(k=>[k,manifest[k]]))};
 const catalog={...previous,...input,schemaVersion:2};
 for(const key of ['industries','audiences','capabilities','layoutStyles','distributionMethods','integrations','tags'])if(catalog[key]!==undefined)catalog[key]=[...new Set(list(catalog[key]).filter(Boolean))];
 if(themeIds.length)catalog.designThemeIds=themeIds;
 if(!catalog.productCategory&&manifest.category)catalog.productCategory=manifest.category;
 if(variants.length){catalog.variantCount=variants.length;catalog.variants={...previous.variants,...Object.fromEntries(variants.map(v=>[v.id,{...(previous.variants?.[v.id]||{}),designThemeIds:v.designThemeIds,themeIdentifier:v.themeIdentifier||null,description:v.description||''}]))};}
 if(fp)catalog.sourceFingerprint=fp;
 if(manifest.sourceRepository)catalog.repositoryUrl=manifest.sourceRepository;
 else if(manifest.repository&&!catalog.repositoryUrl)catalog.repositoryUrl=manifest.repository;
 return catalog;
}
function saveTransaction(changes,createDir,copyFrom,afterCopy) {
 const originals=new Map();
 for(const [file] of changes)originals.set(file,fs.existsSync(file)?bytes(file):null);
 let made=false;
 try{
  if(createDir){if(fs.existsSync(createDir))throw Error('Destination exists before apply');fs.mkdirSync(createDir);made=true;fs.cpSync(copyFrom,createDir,{recursive:true,force:false,errorOnExist:true});}
  for(const [file,value] of changes)write(file,value);
  if(afterCopy)afterCopy();
 }catch(error){
  if(made)fs.rmSync(createDir,{recursive:true,force:true});
  for(const [file,value] of originals){if(value===null)fs.rmSync(file,{force:true});else fs.writeFileSync(file,value);}
  throw error;
 }
}
async function capturePreview(id,entry,base,sourcePath) {
 if(!base)return {status:'pending',command:'node scripts/capture-previews.mjs'};
 const previews=read(previewFile,{version:2,projects:{}}),sourceFile=path.join(root,sourcePath);
 const sourceHash=fs.existsSync(sourceFile)?sha(sourceFile):null;
 const filename=path.join(root,'assets/previews',id+'.webp');
 if(previews.projects?.[id]?.sourceHash===sourceHash&&previews.projects[id].target===entry&&fs.existsSync(filename))return {status:'reused',image:previews.projects[id].image};
 const {chromium}=await import('playwright');
 const sharp=(await import('sharp')).default;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1,reducedMotion:'reduce'});
  const response=await page.goto(new URL(entry,base).href,{waitUntil:'networkidle',timeout:30000});
  if(!response?.ok())throw Error('Preview route HTTP '+(response?.status()||'unknown'));
  const png=await page.screenshot({type:'png',animations:'disabled'});
  fs.mkdirSync(path.dirname(filename),{recursive:true});
  await sharp(png).resize({width:960,withoutEnlargement:true}).webp({quality:77,effort:4}).toFile(filename);
  previews.projects||={};
  previews.projects[id]={...(previews.projects[id]||{}),image:'/assets/previews/'+id+'.webp',target:entry,sourcePath,sourceHash};
  write(path.join(root,previewFile),previews);return {status:'captured',image:previews.projects[id].image};
 }finally{await browser.close();}
}
async function importOne(sourceInput,manifestInput,slugInput,bulk=false) {
 const source=sourceInput?path.resolve(sourceInput):null;
 const staged=stage(source);
 try{
  const base=projectRoot(staged.folder);
  const manifest=manifestInput?json(path.resolve(manifestInput)):base&&fs.existsSync(path.join(base,'project.json'))?json(path.join(base,'project.json')):{};
  const project=manifest.project&&typeof manifest.project==='object'?{...manifest.project,...manifest}:{...manifest};
  const id=slugify(slugInput||project.slug||project.projectId||project.name||source&&path.basename(source,path.extname(source)));
  if(!id)throw Error('Project slug is required');
  const files=base?filesUnder(base):[],fp=files.length?fingerprint(files):null;
  const inside=source&&within(source,path.join(root,'sites'));
  const variantInputs=list(project.variants);
  const dirs=base?fs.readdirSync(base,{withFileTypes:true}).filter(x=>x.isDirectory()&&/^variant-[1-9]\d*$/.test(x.name)).map(x=>x.name):[];
  const variantNames=[...new Set([...dirs,...variantInputs.map(x=>typeof x==='string'?x:x.folder||x.path||x.id).filter(Boolean).map(x=>String(x).replaceAll('\\','/').split('/')[0])])].sort((a,b)=>Number(a.split('-')[1])-Number(b.split('-')[1]));
  const variants=variantNames.map((name,index)=>{const input=variantInputs.find(x=>typeof x==='object'&&[x.folder,x.path,x.id].some(p=>p&&String(p).startsWith(name)))||{};const themes=resolveThemes(input.designThemeIds||input.themeIds||input.themes||input.themeId||[],themeMaster);return {id:input.id&&String(input.id).startsWith(id)?input.id:`${id}--${name}`,number:Number(name.slice(8)),folder:name,path:`/sites/${id}/${name}/`,title:input.title||input.name||`${project.name||id} ${name}`,description:input.description||'',themeIdentifier:input.themeIdentifier||null,designThemeIds:themes.ids,themeSuggestions:themes.suggestions};});
  const declaredThemes=resolveThemes(project.designThemeIds||project.themeIds||project.themes||project.primaryThemeId||project.catalog?.designThemeIds||[],themeMaster);
  const allThemeIds=[...new Set([...declaredThemes.ids,...variants.flatMap(v=>v.designThemeIds)])];
  const themeSuggestions=[...declaredThemes.suggestions,...variants.flatMap(v=>v.themeSuggestions)];
  const packageFiles=files.filter(f=>/(^|\/)package\.json$|(^|\/)(next|vite)\.config\./i.test(f.path));
  const framework=packageFiles.some(f=>{if(!f.path.endsWith('package.json'))return true;try{const data=json(path.join(base,f.path));return ['next','react','vite','vue','svelte','astro'].some(x=>data.dependencies?.[x]||data.devDependencies?.[x]);}catch{return true;}});
  const entry=base&&path.join(base,'index.html'),hasEntry=entry&&fs.existsSync(entry);
  const mode=modeOption==='auto'?(project.productionUrl&&!source?'external':inside?'existing':variantNames.length>1?'grouped':framework?'framework':hasEntry?'static':'review'):modeOption;
  const entries=[...(hasEntry?[entry]:[]),...variants.map(v=>path.join(base,v.folder,'index.html'))];
  const validation=base?validateEntries(base,entries):{missing:[],checked:[]};
  const evidence=inventory(),matches=duplicateEvidence(id,project,fp,evidence),approved=read(approvedFile,{version:1,entries:[]});
  const same=approved.entries.find(x=>x.slug===id&&x.sourceFingerprint===fp&&fp);
  const prior=evidence.showcase.projects?.[id]||{};
  const nextCatalog=catalogFrom(project,allThemeIds,variants,fp,prior.catalog);
  if(mode==='tool')nextCatalog.productType='reusable-tool';
  const catalogUnchanged=JSON.stringify(prior.catalog||{})===JSON.stringify(nextCatalog);
  const warnings=[];
  if(mode==='review'||mode==='framework')warnings.push('Source requires manual review');
  if((mode==='static'||mode==='grouped')&&!hasEntry)warnings.push('Hub or static index.html is missing');
  if(mode==='grouped'&&variants.length<2)warnings.push('Grouped import requires at least two variants');
  if(mode==='existing'&&!inside)warnings.push('Existing mode requires a source inside repository sites/');
  if(mode==='external'&&(!url(project.productionUrl)||source))warnings.push('External mode requires a manifest-only HTTPS production URL');
  if(mode==='tool'&&!inside&&!url(project.productionUrl))warnings.push('Reusable tool must reference an existing sites/ source or HTTPS production URL');
  if(themeSuggestions.length)warnings.push('Unrecognized theme IDs require review');
  if(validation.missing.length)warnings.push('Missing relative dependencies: '+validation.missing.join('; '));
  const identityMatches=matches.filter(x=>x.owner!==id&&['repository','production','fingerprint'].includes(x.kind));
  if((mode==='static'||mode==='grouped')&&matches.length&&!same)warnings.push('Existing identity, route, source, repository, production URL, or fingerprint collision');
  if(identityMatches.length&&!same)warnings.push('Duplicate source identity requires review');
  const destRel=`sites/${id}`,dest=path.join(root,destRel);
  if((mode==='static'||mode==='grouped')&&fs.existsSync(dest)&&!same)warnings.push('Destination exists; refusing overwrite');
  const record={title:project.name||project.title||id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),slug:id,category:project.category||'Imported Static Sites',type:mode==='grouped'?'group-hub':'static-site',status:'portfolio-site',source:staged.archiveSha256?'source-archive:'+path.basename(source):'source-directory:'+source,path:destRel,livePath:`/sites/${id}/`,hasIndex:true,variantNumbers:variants.map(v=>v.number),sourceFingerprint:fp,entrySha256:hasEntry?sha(entry):null,archiveSha256:staged.archiveSha256,files:files.map(f=>f.path),repositoryUrl:project.repositoryUrl||project.repository||null,productionUrl:project.productionUrl||null};
  const previewData=read(previewFile,{projects:{}}),existingPreview=previewData.projects?.[id]||Object.values(previewData.projects||{}).find(x=>x.target===record.livePath);
  const idempotent=Boolean(same&&(catalogUnchanged||!Object.keys(project).length))||((mode==='existing'||mode==='external'||mode==='tool')&&catalogUnchanged);
  const changes=[];
  if(!idempotent&&!warnings.length){if((mode==='static'||mode==='grouped')&&!same){changes.push({action:'add',path:destRel},{action:'update',path:approvedFile},{action:'regenerate',path:routeFile});if(mode==='grouped')changes.push({action:'update',path:contractFile});}changes.push({action:'update',path:showcaseFile});}
  const report={mode:apply?'apply':'dry-run',source,projectId:id,classification:mode,duplicateStatus:idempotent?'already-imported':matches.length?'related-or-collision':'new',duplicateEvidence:matches,sourceFingerprint:fp,archiveSha256:staged.archiveSha256,entrySha256:record.entrySha256,filesAdded:mode==='static'||mode==='grouped'?files.length:0,existingFilesReused:mode==='existing'?files.length:0,variants,themeIds:allThemeIds,themeSuggestions,previewStatus:existingPreview?'existing':'missing',targetRoutes:mode==='external'?[project.productionUrl]:[record.livePath,...variants.map(v=>v.path)],missingRelativeAssets:validation.missing,warnings,filesystemChanges:changes,validation:{sourceFiles:files.length,checkedEntrypoints:validation.checked,sourceManifest:fp,entrypoint:Boolean(hasEntry)},catalog:nextCatalog};
  if(apply&&!idempotent){
   if(warnings.length)throw Error('Import blocked: '+warnings.join('; '));
   if((mode==='static'||mode==='grouped')&&!same){
    const nextApproved=structuredClone(approved);nextApproved.entries.push(record);
    const writes=[[path.join(root,approvedFile),nextApproved]];
    if(mode==='grouped'){
     const contracts=read(contractFile,{version:1,groups:[]});
     contracts.groups.push({groupId:id,displayTitle:record.title,hubPath:record.livePath,generateHubEntry:false,variants:variants.map(v=>({number:v.number,id:v.id,title:v.title,description:v.description,path:v.path,designThemeIds:v.designThemeIds}))});
     writes.push([path.join(root,contractFile),contracts]);
    }
    const showcase=structuredClone(evidence.showcase);showcase.projects||={};showcase.projects[id]={...prior,title:record.title,description:project.description||prior.description||'',catalog:nextCatalog};
    writes.push([path.join(root,showcaseFile),showcase]);
    // The route generator owns the derived route file. Snapshot it as part of this transaction.
    const routeAbs=path.join(root,routeFile),before=fs.existsSync(routeAbs)?bytes(routeAbs):null;
    try{
     saveTransaction(writes,dest,base,()=>{
      execFileSync('pwsh',['-NoProfile','-File',path.join(scriptRoot,'scripts/generate-route-resolution.ps1'),'-RepoRoot',root],{cwd:root,stdio:'pipe'});
      const generated=read(routeFile,{entries:[]});
      if(!generated.entries.some(x=>x.resolvedPath===record.livePath&&x.resolutionStatus==='resolved'))throw Error('Generated route missing');
      for(const variant of variants)if(!generated.entries.some(x=>x.resolvedPath===variant.path&&x.resolutionStatus==='resolved'))throw Error('Generated variant route missing: '+variant.path);
     });
    }catch(e){if(before===null)fs.rmSync(routeAbs,{force:true});else fs.writeFileSync(routeAbs,before);throw e;}
    report.validation.route='resolved';
   }else{
    const showcase=structuredClone(evidence.showcase);showcase.projects||={};showcase.projects[id]={...prior,title:prior.title||record.title,description:project.description||prior.description||'',catalog:nextCatalog};
    saveTransaction([[path.join(root,showcaseFile),showcase]]);
   }
   if(previewBase&&mode!=='external'){try{
    const captures=[await capturePreview(id,record.livePath,previewBase,`sites/${id}/index.html`)];
    for(const variant of variants)captures.push(await capturePreview(variant.id,variant.path,previewBase,`sites/${id}/${variant.folder}/index.html`));
    report.preview={status:captures.every(x=>x.status==='reused')?'reused':'captured',captures};
    report.previewStatus=report.preview.status;
   }catch(e){report.preview={status:'failed',reason:e.message};}}
   else report.preview={status:existingPreview?'existing':'pending',command:'node scripts/capture-previews.mjs'};
  }
  return report;
 }finally{staged.cleanup();}
}
async function main(){
 const results=[];
 if(bulkOption){
  const folder=path.resolve(bulkOption);if(!fs.existsSync(folder)||!fs.statSync(folder).isDirectory())throw Error('Bulk directory unavailable');
  for(const item of fs.readdirSync(folder,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
   if(!item.isDirectory()&&!/\.zip$/i.test(item.name))continue;
   try{results.push(await importOne(path.join(folder,item.name),null,null,true));}
   catch(e){results.push({source:path.join(folder,item.name),status:'failed',error:e.message});if(apply)break;}
  }
 }else results.push(await importOne(sourceOption,manifestPath,option('slug')));
 const report=bulkOption?{mode:apply?'apply':'dry-run',bulkDirectory:path.resolve(bulkOption),total:results.length,succeeded:results.filter(x=>!x.warnings?.length&&!x.error).length,blocked:results.filter(x=>x.warnings?.length||x.error).length,imports:results}:results[0];
 if(reportPath){const out=path.resolve(reportPath);if(!within(out,root))throw Error('Report must be inside repository');write(out,report);}
 console.log(JSON.stringify(report,null,2));
 if(bulkOption&&report.blocked)process.exitCode=1;
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
