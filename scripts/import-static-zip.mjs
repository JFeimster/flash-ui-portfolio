#!/usr/bin/env node
// Source-backed incremental static ZIP intake. Preview by default; --apply writes only a new folder and additive metadata.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {inspect} from './preview-project-intake.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const args=process.argv.slice(2),apply=args.includes('--apply'),zip=args.find(x=>x.endsWith('.zip')),slug=args.find(x=>x.startsWith('--slug='))?.slice(7);
if(!zip||!slug){console.error('Usage: node scripts/import-static-zip.mjs /absolute/source.zip --slug=unique-slug [--apply]');process.exit(2);}
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error('Invalid slug');
const source=path.resolve(zip);if(!fs.existsSync(source))throw Error('Source ZIP unavailable');
const python=process.platform==='win32'?'py':'python3';
const inspectZip=String.raw`import zipfile,sys,json,hashlib
p=sys.argv[1]
with zipfile.ZipFile(p) as z:
 files=[x for x in z.infolist() if not x.is_dir()]
 bad=[x.filename for x in files if x.filename.startswith('/') or '..' in x.filename.split('/') or '\\' in x.filename or x.flag_bits & 1 or x.file_size>20000000]
 if bad: raise ValueError('Unsafe archive entries: '+str(bad[:5]))
 if len(files)>150 or sum(x.file_size for x in files)>50000000: raise ValueError('Archive exceeds import limits')
 names=[x.filename for x in files]
 html=[x for x in names if x=='index.html']
 if len(html)!=1: raise ValueError('Exactly one root index.html required')
 if any(n in ('package.json','next.config.js','next.config.ts') or n.startswith('node_modules/') for n in names): raise ValueError('Framework app; standalone audit required')
 print(json.dumps({'files':names,'sha256':hashlib.sha256(open(p,'rb').read()).hexdigest(),'entrySha256':hashlib.sha256(z.read('index.html')).hexdigest()}))
`;
let raw;try{raw=execFileSync(python,[...(process.platform==='win32'?['-3']:[]),'-c',inspectZip,source],{encoding:'utf8'});}catch(e){console.error(e.stderr?.toString()||e.message);process.exit(1);}
const evidence=JSON.parse(raw),dest='sites/'+slug,registry=read('data/site-registry.json'),routes=read('data/asset-route-resolution.json');
const record={title:slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),slug,category:'Imported Static Sites',type:'static-site',status:'portfolio-site',source:'source-archive:'+path.basename(source),path:dest,livePath:'/'+dest+'/',hasIndex:true,variantNumbers:[],notes:'Source-backed static ZIP import; verify production route after deployment.'};
const validation=inspect({...record,hasIndex:false},[registry,read('data/site-registry-static-extractions.json')],routes);
if(fs.existsSync(path.join(root,dest)))validation.errors.push('Destination exists; refusing overwrite');
if(validation.errors.length){console.error(JSON.stringify(validation,null,2));process.exit(1);}
const preview={mode:apply?'apply':'dry-run',record,source,archiveSha256:evidence.sha256,entrySha256:evidence.entrySha256,files:evidence.files};
console.log(JSON.stringify(preview,null,2));
if(!apply)process.exit(0);
const destAbs=path.join(root,dest);
fs.mkdirSync(destAbs,{recursive:true});
const extract=String.raw`import zipfile,sys,os
src,dest=sys.argv[1:]
with zipfile.ZipFile(src) as z:
 for item in z.infolist():
  if item.is_dir():continue
  p=os.path.join(dest,item.filename)
  os.makedirs(os.path.dirname(p),exist_ok=True)
  with z.open(item) as i,open(p,'wb') as o:o.write(i.read())
`;
try{
 execFileSync(python,[...(process.platform==='win32'?['-3']:[]),'-c',extract,source,destAbs]);
 const out=path.join(root,'data','batch-19c-approved-imports.json');
 const old=fs.existsSync(out)?JSON.parse(fs.readFileSync(out,'utf8')):{version:1,entries:[]};
 if(old.entries.some(x=>x.slug===slug||x.livePath===record.livePath))throw Error('Approved-import metadata collision');
 old.entries.push({...record,archiveSha256:evidence.sha256,entrySha256:evidence.entrySha256,files:evidence.files});
 fs.writeFileSync(out,JSON.stringify(old,null,2)+'\n');
 console.log('Extracted static files and wrote additive metadata. Canonical registry intentionally unchanged.');
}catch(e){fs.rmSync(destAbs,{recursive:true,force:true});throw e;}
