#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {inspect} from './preview-project-intake.mjs';
import {resolveThemes} from '../assets/js/catalog-core.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p.endsWith('.json')?p:p+'.json'),'utf8').replace(/^\uFEFF/,''));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,data)=>fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n');
const arg=(name)=>process.argv.slice(2).find(x=>x.startsWith('--'+name+'='))?.slice(name.length+3);
const sourceArg=arg('source')||process.argv.slice(2).find(x=>/\.zip$/i.test(x));
const manifestArg=arg('manifest'), reportArg=arg('report');
const apply=process.argv.includes('--apply'), modeArg=arg('mode')||'auto';
if(!['auto','static','grouped','existing','external','tool'].includes(modeArg))throw Error('Invalid mode');
if(!sourceArg && !manifestArg)throw Error('Usage: node scripts/import-asset.mjs --source=<directory-or-zip> [--manifest=project.json] [--slug=id] [--mode=auto|static|grouped|existing|external|tool] [--dry-run|--apply] [--report=path]');
const source=sourceArg?path.resolve(sourceArg):null;
if(source && !fs.existsSync(source))throw Error('Source unavailable');
const manifest=manifestArg?JSON.parse(fs.readFileSync(path.resolve(manifestArg),'utf8')):source&&fs.statSync(source).isDirectory()&&fs.existsSync(path.join(source,'project.json'))?JSON.parse(fs.readFileSync(path.join(source,'project.json'),'utf8')):{};
const slug=(arg('slug')||manifest.slug||manifest.projectId||manifest.name||source&&path.basename(source,path.extname(source))||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error('Invalid slug');
let staged=null, stageBase=null;
const cleanup=()=>{if(stageBase)fs.rmSync(stageBase,{recursive:true,force:true});};
function main(){
try {
 let archiveSha256=null;
 if(source&&fs.statSync(source).isFile()) {
  stageBase=fs.mkdtempSync(path.join(os.tmpdir(),'flash-asset-'));
  const python=process.platform==='win32'?'py':'python3';
  const output=execFileSync(python,[...(process.platform==='win32'?['-3']:[]),path.join(root,'scripts/lib/safe-archive.py'),source,stageBase],{encoding:'utf8'});
  archiveSha256=JSON.parse(output).archiveSha256;staged=stageBase;
 } else staged=source;
 let files=[];
 function walk(dir,base=dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isSymbolicLink())throw Error('Symlink source requires review');if(item.isDirectory())walk(full,base);else files.push({path:path.relative(base,full).replaceAll('\\','/'),sha256:hash(full),size:fs.statSync(full).size});}}
 if(staged)walk(staged);
 files.sort((a,b)=>a.path.localeCompare(b.path));
 const wrappers=[staged,...(staged&&fs.readdirSync(staged,{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>path.join(staged,x.name))||[])].filter(Boolean);
 const roots=wrappers.filter(p=>fs.existsSync(path.join(p,'index.html')));
 const variants=staged?fs.readdirSync(staged,{withFileTypes:true}).filter(x=>x.isDirectory()&&/^variant-[1-9]\d*$/.test(x.name)&&fs.existsSync(path.join(staged,x.name,'index.html'))).map(x=>({id:x.name,number:Number(x.name.slice(8)),path:`/sites/${slug}/${x.name}/`})).sort((a,b)=>a.number-b.number):[];
 const packageFiles=files.filter(f=>/(^|\/)package\.json$|(^|\/)(next|vite)\.config\./i.test(f.path));
 const likelyFramework=packageFiles.some(f=>{if(!f.path.endsWith('package.json'))return true;try{const data=JSON.parse(fs.readFileSync(path.join(staged,f.path),'utf8'));return ['next','react','vite','vue','svelte','astro'].some(x=>data.dependencies?.[x]||data.devDependencies?.[x]);}catch{return true;}});
 const inside=source&&path.resolve(source).toLowerCase().startsWith(path.join(root,'sites').toLowerCase()+path.sep);
 const mode=modeArg==='auto'?(manifest.productionUrl&&!source?'external':inside?'existing':variants.length>1?'grouped':likelyFramework?'framework':roots.length===1?'static':'review'):modeArg;
 const entryRoot=roots[0]||staged;
 const entry=entryRoot&&fs.existsSync(path.join(entryRoot,'index.html'))?path.join(entryRoot,'index.html'):null;
 const fingerprint=crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex');
 const themeMaster=read('data/transferable-design-themes');
 const themeInput=manifest.designThemeIds||manifest.themeIds||manifest.primaryThemeId||[];
 const theme=resolveThemes(themeInput,themeMaster);
 const registry=read('data/site-registry');const approvedPath='data/batch-19c-approved-imports.json';const approved=fs.existsSync(path.join(root,approvedPath))?read(approvedPath):{version:1,entries:[]};
 const routes=read('data/asset-route-resolution');const showcase=read('data/asset-showcase');
 const destRel=`sites/${slug}`,dest=path.join(root,destRel);
 const existing=registry.concat(approved.entries).filter(x=>x.slug===slug||x.path===destRel||x.livePath===`/sites/${slug}/`);
 const collision=routes.entries.filter(x=>x.slug===slug||x.resolvedPath===`/sites/${slug}/`);
 const same=approved.entries.find(x=>x.slug===slug&&x.sourceFingerprint===fingerprint);
 const warnings=[];
 if(mode==='review'||mode==='framework'||roots.length>1)warnings.push('Source requires manual review; no automatic apply');
 if(mode==='static'&&!entry)warnings.push('Static entrypoint missing');
 if(mode==='existing'&&!inside)warnings.push('Existing mode requires a portfolio sites directory');
 if(mode==='external'&&!/^https:\/\//.test(manifest.productionUrl||''))warnings.push('External mode requires an HTTPS production URL in the manifest');
 if(mode==='external'&&source)warnings.push('External mode accepts a manifest only');
 if(mode==='tool')warnings.push('Tool source requires an explicit packaging review');
 if(mode==='grouped'&&(!entry||variants.length<2))warnings.push('Grouped source requires hub and at least two variant entrypoints');
 if(theme.suggestions.length)warnings.push('Unrecognized theme labels require review');
 if((existing.length||collision.length)&&!same&&mode!=='existing')warnings.push('Existing identity or route collision');
 if(fs.existsSync(dest)&&mode!=='existing'&&!same)warnings.push('Destination exists; refusing overwrite');
 const sourceFiles=files.map(f=>f.path);const missing=[];
 if(entry){const html=fs.readFileSync(entry,'utf8');for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)){const value=match[1];if(/^(?:https?:|\/|#|data:|mailto:|tel:|javascript:)/i.test(value))continue;const local=path.resolve(path.dirname(entry),decodeURIComponent(value.split(/[?#]/)[0]));if(!local.startsWith(entryRoot+path.sep)||!fs.existsSync(local))missing.push(value);}}
 if(missing.length)warnings.push('Missing relative assets: '+missing.join(', '));
 const record={title:manifest.name||manifest.title||slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),slug,category:manifest.category||'Imported Static Sites',type:mode==='grouped'?'group-hub':'static-site',status:'portfolio-site',source:archiveSha256?'source-archive:'+path.basename(source):'source-directory:'+source,path:destRel,livePath:`/sites/${slug}/`,hasIndex:true,variantNumbers:variants.map(v=>v.number),sourceFingerprint:fingerprint,entrySha256:entry?hash(entry):null,archiveSha256,files:sourceFiles};
 if(mode==='static'||mode==='grouped'){const validation=inspect({...record,hasIndex:false},[registry,approved.entries],routes);if(validation.errors.length)warnings.push(...validation.errors);}
 const changes=[];
 if(!same&&!warnings.length){if(mode==='static'||mode==='grouped'){changes.push({action:'add',path:destRel}, {action:'update',path:approvedPath},{action:'regenerate',path:'data/asset-route-resolution.json'});if(mode==='grouped')changes.push({action:'update',path:'data/variant-route-contracts.json'});}if(mode==='existing'||mode==='external')changes.push({action:'update',path:'data/asset-showcase.json'});}
 const report={mode:apply?'apply':'dry-run',source,sourceFingerprint:fingerprint,archiveSha256,entrySha256:record.entrySha256,projectId:slug,classification:mode,duplicateStatus:same?'already-imported':existing.length||collision.length?'related-or-collision':'new',filesAdded:mode==='static'||mode==='grouped'?files.length:0,existingFilesReused:mode==='existing'?files.length:0,variants,themeIds:theme.ids,themeSuggestions:theme.suggestions,previewStatus:read('data/asset-previews').projects?.[slug]?'existing':'missing',targetRoutes:variants.length?record.livePath?[record.livePath,...variants.map(v=>v.path)]:[]:[record.livePath],missingRelativeAssets:missing,warnings,filesystemChanges:changes,validation:{sourceFiles:files.length,sourceManifest:fingerprint,entrypoint:Boolean(entry)}};
 if(reportArg){const out=path.resolve(reportArg);if(!out.startsWith(root+path.sep))throw Error('Report must be inside repository');write(out,report);}
 console.log(JSON.stringify(report,null,2));
 if(!apply||same)return;
 if(warnings.length)throw Error('Import blocked: '+warnings.join('; '));
 if(mode==='external'||mode==='existing') {
  const copy=showcase.projects[slug]||{};const catalog={...copy.catalog,schemaVersion:2};
  if(manifest.repository||manifest.repositoryUrl)catalog.repositoryUrl=manifest.repositoryUrl||manifest.repository;
  if(manifest.productionUrl)catalog.productionUrl=manifest.productionUrl;
  if(theme.ids.length)catalog.designThemeIds=theme.ids;
  showcase.projects[slug]={...copy,title:copy.title||record.title,catalog};write(path.join(root,'data/asset-showcase.json'),showcase);return;
 }
 const originals=new Map();const remember=p=>originals.set(p,fs.existsSync(p)?fs.readFileSync(p):null);
 const approvedAbs=path.join(root,approvedPath),routeAbs=path.join(root,'data/asset-route-resolution.json'),contractAbs=path.join(root,'data/variant-route-contracts.json');
 for(const p of [approvedAbs,routeAbs,contractAbs])remember(p);
 try {
  if(hash(entry)!==record.entrySha256)throw Error('Source entry changed before apply');
  if(mode==='grouped'){
   const contracts=read('data/variant-route-contracts');if(contracts.groups.some(g=>g.groupId===slug))throw Error('Group contract exists');
   contracts.groups.push({groupId:slug,displayTitle:record.title,hubPath:record.livePath,generateHubEntry:true,variants:variants.map(v=>({number:v.number,title:record.title+' '+v.number,path:v.path}))});write(contractAbs,contracts);
  }
  fs.mkdirSync(dest,{recursive:false});fs.cpSync(entryRoot,dest,{recursive:true,force:false,errorOnExist:true});
  approved.entries.push(record);write(approvedAbs,approved);
  execFileSync('pwsh',['-NoProfile','-File',path.join(root,'scripts/generate-route-resolution.ps1'),'-RepoRoot',root],{cwd:root,stdio:'pipe'});
  const generated=read('data/asset-route-resolution');if(!generated.entries.some(x=>x.resolvedPath===record.livePath&&x.resolutionStatus==='resolved'))throw Error('Generated route missing');
  report.validation.route='resolved';if(reportArg)write(path.resolve(reportArg),report);
 }catch(error){fs.rmSync(dest,{recursive:true,force:true});for(const [p,bytes] of originals){if(bytes===null)fs.rmSync(p,{force:true});else fs.writeFileSync(p,bytes);}throw error;}
}finally{cleanup();}
}
main();
