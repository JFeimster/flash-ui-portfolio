#!/usr/bin/env python3
"""Asset Command Center v5. Local-only, standard-library, manual-first asset registry."""
import argparse, base64, concurrent.futures, csv, datetime, hashlib, html, io, json, os, pathlib, re, threading, urllib.parse, urllib.request, webbrowser, zipfile
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
ROOT=pathlib.Path(__file__).resolve().parent; MANAGED=ROOT/'managed-sources'; MANAGED.mkdir(exist_ok=True)
LOCK=threading.RLock(); JOB_LOCK=threading.Lock(); DEFAULT_SOURCE=r'C:\Users\jason\OneDrive\Desktop\JSON\Private & Shared\Registries'; MAX_UPLOAD=25*1024*1024; MAX_ZIP_FILES=500; MAX_ZIP_UNPACKED=80*1024*1024; MAX_DEPTH=8
STATUS={'running':False,'message':'Ready — saved local data loaded; Chrome is never imported automatically.','last_run':None}
def stamp(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def read_file(name,default):
 try:return json.loads((ROOT/name).read_text(encoding='utf-8'))
 except (OSError,json.JSONDecodeError):return default
def atomic(name,value):
 path=ROOT/name; tmp=path.with_name(path.name+'.tmp');tmp.write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8');tmp.replace(path)
def sha(raw):return hashlib.sha256(raw).hexdigest()
def safe_name(name):return re.sub(r'[^A-Za-z0-9._ -]+','_',pathlib.Path(name).name)[:180] or 'source'
def v5():
 base=read_file('asset-command-center-v5.json',{});changed=False
 for k,d in {'schema_version':5,'sources':{},'custom_fields':[],'custom_values':{},'attachments':{},'changes':[],'jobs':[],'chrome_scope':[],'schedules':{'file_indexing':False,'remote_enrichment':False},'locked_fields':{}}.items():
  if k not in base:base[k]=d;changed=True
 if changed:atomic('asset-command-center-v5.json',base)
 return base
def save_v5(data):atomic('asset-command-center-v5.json',data)
def registry():return read_file('project-registry-enriched.json',{'schema_version':2,'projects':[]})
def overrides():
 d=read_file('user-overrides.json',{'projects':{},'links':{},'saved_views':[],'associations':{}})
 for k,x in {'projects':{},'links':{},'saved_views':[],'associations':{}}.items():d.setdefault(k,x)
 return d
def norm_url(url):
 try:
  p=urllib.parse.urlsplit(str(url));return urllib.parse.urlunsplit((p.scheme.lower(),p.netloc.lower(),p.path.rstrip('/'),'', ''))
 except:return ''
def github_key(value):
 m=re.search(r'(?:github\.com[:/])([^/\s]+)/([^/#?\s]+)',str(value),re.I);return f'{m.group(1).lower()}/{m.group(2).removesuffix(".git").lower()}' if m else ''
def project_identifiers(p):
 ids={'github':set(),'urls':set(),'vercel':set()}
 for u in p.get('links',{}).get('github',[]):
  if github_key(u):ids['github'].add(github_key(u))
 for urls in p.get('links',{}).values():
  for u in urls if isinstance(urls,list) else []:
   n=norm_url(u)
   if n:ids['urls'].add(n)
   host=urllib.parse.urlsplit(str(u)).hostname or ''
   if host.endswith('.vercel.app'):ids['vercel'].add(host.lower())
 for k in ('github_url','github_repo','repo'):
  if github_key(p.get(k,'')):ids['github'].add(github_key(p[k]))
 for k in ('live_url','public_url','deployment_domain'):
  n=norm_url(p.get(k,''))
  if n:ids['urls'].add(n)
 return ids
# Chrome browsing is read-only. No call to this code occurs at startup.
def chrome_paths():
 root=pathlib.Path(os.environ.get('LOCALAPPDATA',''))/'Google'/'Chrome'/'User Data'
 return [] if not root.is_dir() else [p for p in sorted(root.glob('*/Bookmarks')) if p.parent.name=='Default' or p.parent.name.startswith('Profile ')]
def chrome_tree(raw,profile):
 def cv(n):return {'type':'url','id':n.get('id',''),'name':n.get('name',''),'url':n.get('url','')} if n.get('type')=='url' else {'type':'folder','id':n.get('id',''),'name':n.get('name',''),'children':[cv(x) for x in n.get('children',[])]}
 names=[('bookmark_bar','Bookmarks bar'),('other','Other bookmarks'),('synced','Mobile bookmarks')]
 return {'type':'folder','id':'profile:'+profile,'name':'Chrome: '+profile,'children':[{'type':'folder','id':k,'name':n,'children':[cv(x) for x in raw.get('roots',{}).get(k,{}).get('children',[])]} for k,n in names if k in raw.get('roots',{})]}
def discover_chrome():
 profiles=[];errors=[]
 for p in chrome_paths():
  try:profiles.append(chrome_tree(json.loads(p.read_text(encoding='utf-8')),p.parent.name))
  except Exception as e:errors.append(f'{p.parent.name}: {str(e)[:160]}')
 return {'schemaVersion':2,'profiles':profiles,'discovered_at':stamp(),'errors':errors}
def all_bookmarks(tree):
 out=[]
 def walk(n,path):
  if n.get('type')=='url':out.append({'id':n.get('id') or sha((n.get('url','')+'|'+ '/'.join(path)).encode())[:16],'title':n.get('name',''),'url':n.get('url',''),'path':path});return
  for x in n.get('children',[]):walk(x,path+[n.get('name','')])
 for p in tree.get('profiles',[]):walk(p,[])
 return out
def selected_bookmarks(tree,scopes):
 scopes=set(map(str,scopes));return [b for b in all_bookmarks(tree) if any('/'.join(b['path']).startswith(s) for s in scopes)] if scopes else []
def link_from_bookmark(b):
 url=b['url'];host=(urllib.parse.urlsplit(url).hostname or '').lower();parts=[x for x in urllib.parse.urlsplit(url).path.split('/') if x];platform='website';kind='website';slug=''
 if host=='github.com':platform='github';kind='repository';slug=parts[1].lower() if len(parts)>1 else ''
 elif host=='vercel.com':platform='vercel';kind='deployment_dashboard';slug=parts[0].lower() if parts else ''
 elif host.endswith('.vercel.app'):platform='production';kind='production';slug=host[:-11]
 return {**b,'canonical_url':norm_url(url),'host':host,'platform':platform,'kind':kind,'slug':slug,'source_folders':b['path']}
def reimport_chrome(scopes):
 tree=discover_chrome();atomic('chrome-bookmark-library.json',tree);links=[link_from_bookmark(x) for x in selected_bookmarks(tree,scopes)];db=registry();existing={p.get('id'):p for p in db.get('projects',[])};created=updated=0;grouped={}
 for link in links:grouped.setdefault((link['platform'],link['slug']) if link['slug'] else ('url',link['canonical_url']),[]).append(link)
 for (platform,key),rows in grouped.items():
  pid=('gh-'+key.replace('/','-')) if platform=='github' else ('site-'+sha(key.encode())[:12]);p=existing.get(pid)
  if not p:
   p={'id':pid,'name':rows[0]['title'] or key,'asset_type':'project_candidate','status':'unverified','links':{'github':[],'vercel_dashboard':[],'production':[],'other':[]},'technology':[],'source_folders':[],'tags':[],'verification':{'github':'pending','production':'pending'},'bookmark_ids':[],'match_confidence':'low'};db['projects'].append(p);existing[pid]=p;created+=1
  else:updated+=1
  for r in rows:
   dest='github' if r['platform']=='github' else 'vercel_dashboard' if r['platform']=='vercel' else 'production' if r['kind']=='production' else 'other';p['links'].setdefault(dest,[])
   if r['url'] not in p['links'][dest]:p['links'][dest].append(r['url'])
   folder=' / '.join(r['path'])
   if folder not in p.setdefault('source_folders',[]):p['source_folders'].append(folder)
   if r['id'] not in p.setdefault('bookmark_ids',[]):p['bookmark_ids'].append(r['id'])
 atomic('project-registry-enriched.json',db);atomic('project-links.json',{'schema_version':5,'links':links});state=v5();state['chrome_scope']=list(scopes);save_v5(state)
 history=read_file('import-history.json',[]);history.append({'id':sha(json.dumps(links,sort_keys=True).encode())[:12],'name':'Chrome manual reimport','source_type':'chrome_manual','selected_folders':list(scopes),'imported_at':stamp(),'bookmarks':len(links),'projects_created':created,'projects_updated':updated});atomic('import-history.json',history)
 return {'bookmarks':len(links),'created':created,'updated':updated,'scope':list(scopes)}
def text_from_xlsx(raw):
 out=[]
 with zipfile.ZipFile(io.BytesIO(raw)) as z:
  names=z.namelist()
  if len(names)>MAX_ZIP_FILES:raise ValueError('XLSX contains too many files')
  import xml.etree.ElementTree as ET;shared=[]
  if 'xl/sharedStrings.xml' in names:shared=[''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml'))]
  for name in names:
   if name.startswith('xl/worksheets/') and name.endswith('.xml'):
    for row in ET.fromstring(z.read(name)).iterfind('.//{*}row'):
     vals=[]
     for c in row.findall('{*}c'):
      v=c.find('{*}v');val=v.text if v is not None else ''
      if c.get('t')=='s' and val.isdigit() and int(val)<len(shared):val=shared[int(val)]
      vals.append(val)
     if vals:out.append(','.join(vals))
 return '\n'.join(out)
def parse_records(raw,name):
 ext=pathlib.Path(name).suffix.lower();text='';errors=[];collections=[]
 if ext=='.json':
  try:
   data=json.loads(raw.decode('utf-8-sig'))
   if isinstance(data,list):collections=[{'path':'$','count':len(data),'records':data}]
   elif isinstance(data,dict):
    for k,x in data.items():
     if isinstance(x,list) and (not x or all(isinstance(i,dict) for i in x)):collections.append({'path':k,'count':len(x),'records':x})
    if not collections:collections=[{'path':'$','count':1,'records':[data]}]
   text=json.dumps(data,ensure_ascii=False)[:500000]
  except Exception as e:errors.append('JSON parse error: '+str(e))
 elif ext=='.csv':
  try:text=raw.decode('utf-8-sig',errors='replace');rows=list(csv.DictReader(io.StringIO(text)));collections=[{'path':'rows','count':len(rows),'records':rows}]
  except Exception as e:errors.append('CSV parse error: '+str(e))
 elif ext in ('.md','.markdown','.html','.htm','.txt','.log'):text=raw.decode('utf-8',errors='replace')
 elif ext=='.xlsx':
  try:text=text_from_xlsx(raw);collections=[{'path':'xlsx_rows','count':len(text.splitlines()),'records':[]}]
  except Exception as e:errors.append('XLSX parse error: '+str(e))
 elif ext=='.zip':
  try:
   with zipfile.ZipFile(io.BytesIO(raw)) as z:
    infos=z.infolist();size=sum(i.file_size for i in infos)
    if len(infos)>MAX_ZIP_FILES or size>MAX_ZIP_UNPACKED:raise ValueError('ZIP exceeds safe file-count or unpacked-size limit')
    text='\n'.join(i.filename for i in infos if len(pathlib.PurePosixPath(i.filename).parts)<=MAX_DEPTH)
  except Exception as e:errors.append('ZIP parse error: '+str(e))
 else:errors.append('Unsupported file type')
 return {'text':text[:500000],'collections':collections,'errors':errors}
def store_source(filename,raw,source_path='',shared=True):
 if len(raw)>MAX_UPLOAD:raise ValueError('Source exceeds 25 MB local upload limit')
 key=sha(raw);state=v5();existing=state['sources'].get(key)
 if existing:return existing
 stored=f'{key[:16]}-{safe_name(filename)}';(MANAGED/stored).write_bytes(raw);parsed=parse_records(raw,filename)
 rec={'id':key,'name':safe_name(filename),'stored_name':stored,'source_path':source_path,'hash':key,'size':len(raw),'imported_at':stamp(),'shared':bool(shared),'parse_errors':parsed['errors'],'collections':[{'path':x['path'],'count':x['count'],'sample':x['records'][:3]} for x in parsed['collections']],'content':parsed['text'],'records':{x['path']:x['records'] for x in parsed['collections']}}
 state['sources'][key]=rec;save_v5(state);return rec
def scan_folder(folder):
 root=pathlib.Path(folder)
 if not root.is_dir():raise ValueError('Folder is unavailable. Select Registries.zip from Downloads or upload it instead.')
 found=[];ok={'.json','.csv','.md','.markdown','.html','.htm','.txt','.zip','.xlsx'}
 for p in root.rglob('*'):
  if p.is_file() and p.suffix.lower() in ok and len(p.relative_to(root).parts)<=MAX_DEPTH and p.stat().st_size<=MAX_UPLOAD:found.append(store_source(p.name,p.read_bytes(),str(p),True))
 return {'scanned':len(found),'sources':[{'id':x['id'],'name':x['name'],'parse_errors':x['parse_errors']} for x in found]}
def source_matches(record,projects):
 ids=project_identifiers(record);hits=[]
 for p in projects:
  pi=project_identifiers(p);e=[]
  if ids['github']&pi['github']:e.append('exact GitHub owner/repository')
  if ids['urls']&pi['urls']:e.append('exact normalized URL')
  if ids['vercel']&pi['vercel']:e.append('known Vercel domain')
  if e:hits.append({'project_id':p['id'],'evidence':e})
 return hits
def value_mapping(row):
 out={}
 for target,keys in {'name':['name','title','slug'],'description':['description','summary'],'github_url':['github_url','github_repo','repo'],'live_url':['live_url','public_url','url','deployment_domain'],'vercel_dashboard':['vercel_dashboard']}.items():
  for k in keys:
   if row.get(k) not in (None,''):out[target]=row[k];break
 return out
def apply_records(source_id,collection,indexes=None,apply=False):
 state=v5();src=state['sources'].get(source_id)
 if not src:raise ValueError('Unknown source')
 rows=src.get('records',{}).get(collection)
 if not isinstance(rows,list):raise ValueError('Select a record collection')
 if indexes is not None:rows=[rows[i] for i in indexes if isinstance(i,int) and 0<=i<len(rows)]
 projects=registry()['projects'];report=[]
 for i,row in enumerate(rows):
  if not isinstance(row,dict):continue
  matches=source_matches(row,projects);mapping=value_mapping(row);item={'index':i,'record':row,'matches':matches,'proposed':mapping,'status':'ambiguous' if len(matches)>1 else 'matched' if len(matches)==1 else 'unresolved'}
  if apply and len(matches)==1:
   pid=matches[0]['project_id'];ov=overrides();locked=set(state['locked_fields'].get(pid,[]));entry=ov['projects'].setdefault(pid,{});changes=[]
   for field,val in mapping.items():
    if field in locked or entry.get(field) not in (None,''):continue
    if field in ('github_url','live_url'):entry.setdefault('imported_links',[]).append(val)
    else:entry[field]=val
    changes.append({'field':field,'value':val})
   if changes:atomic('user-overrides.json',ov);state['changes'].append({'at':stamp(),'project_id':pid,'source_id':source_id,'previous':{},'changes':changes,'reversible':True});item['applied']=changes
  report.append(item)
 save_v5(state);return report
def page_metadata(url):
 if not re.match(r'^https?://',url,re.I):return {'url':url,'status':'invalid URL'}
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'AssetCommandCenter/5 local verification'})
  with urllib.request.urlopen(req,timeout=12) as r:
   raw=r.read(700000).decode('utf-8','replace');title=re.search(r'<title[^>]*>(.*?)</title>',raw,re.I|re.S);desc=re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',raw,re.I|re.S);canonical=re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']',raw,re.I|re.S);og=dict((m.group(1).lower(),html.unescape(m.group(2))) for m in re.finditer(r'<meta[^>]+property=["\']og:([^"\']+)["\'][^>]+content=["\'](.*?)["\']',raw,re.I|re.S))
   return {'url':url,'final_url':r.geturl(),'http_status':r.status,'reachable':True,'title':html.unescape(title.group(1).strip()) if title else '','meta_description':html.unescape(desc.group(1).strip()) if desc else '','canonical_url':canonical.group(1) if canonical else '','open_graph':og,'note':'Reachability is not proof of a working application.'}
 except Exception as e:return {'url':url,'reachable':False,'status':'error','error':str(e)[:300]}
def new_job(kind,payload):
 state=v5();job={'id':sha((kind+stamp()).encode())[:14],'kind':kind,'status':'queued','created_at':stamp(),'progress':0,'total':0,'results':[],'cancelled':False,**payload};state['jobs'].append(job);save_v5(state);threading.Thread(target=run_job,args=(job['id'],),daemon=True).start();return job
def run_job(job_id):
 with JOB_LOCK:
  state=v5();job=next((x for x in state['jobs'] if x['id']==job_id),None)
  if not job:return
  job['status']='running';save_v5(state)
  try:
   if job['kind']=='verify':
    selected=set(job.get('project_ids',[]));tasks=[(p['id'],u) for p in registry()['projects'] if not selected or p['id'] in selected for u in p.get('links',{}).get('production',[])[:3]];job['total']=len(tasks);save_v5(state)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
     for pid,result in zip([x[0] for x in tasks],pool.map(lambda x:page_metadata(x[1]),tasks)):
      state=v5();job=next(x for x in state['jobs'] if x['id']==job_id)
      if job.get('cancelled'):job['status']='cancelled';save_v5(state);return
      job['results'].append({'project_id':pid,'result':result});job['progress']+=1;save_v5(state)
   elif job['kind']=='pipeline':
    results=apply_records(job.get('source_id'),job.get('collection'),apply=True);state=v5();job=next(x for x in state['jobs'] if x['id']==job_id);job['total']=len(results);job['progress']=len(results);job['results']=results;save_v5(state)
   state=v5();job=next(x for x in state['jobs'] if x['id']==job_id);job['status']='complete';job['completed_at']=stamp();save_v5(state)
  except Exception as e:
   state=v5();job=next((x for x in state['jobs'] if x['id']==job_id),None)
   if job:job['status']='failed';job['error']=str(e)[:500];save_v5(state)
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def respond(self,obj,status=200):
  raw=json.dumps(obj,ensure_ascii=False).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
 def payload(self):
  n=int(self.headers.get('Content-Length','0'))
  if n>MAX_UPLOAD*2:raise ValueError('Request is too large')
  return json.loads(self.rfile.read(n))
 def do_GET(self):
  path=urllib.parse.urlsplit(self.path).path
  if path=='/':
   raw=(ROOT/'index.html').read_bytes();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw);return
  if path=='/api/state':
   s=v5();self.respond({'projects':registry().get('projects',[]),'links':read_file('project-links.json',{'links':[]}).get('links',[]),'bookmarks':read_file('chrome-bookmark-library.json',read_file('bookmarks-original.json',{})),'overrides':overrides(),'imports':read_file('import-history.json',[]),'v5':s,'refresh':STATUS,'default_source':DEFAULT_SOURCE});return
  self.respond({'error':'not found'},404)
 def do_POST(self):
  try:
   path=urllib.parse.urlsplit(self.path).path;data=self.payload()
   if path=='/api/chrome/discover':
    tree=discover_chrome();atomic('chrome-bookmark-library.json',tree);self.respond({'ok':True,'tree':tree});return
   if path=='/api/chrome/reimport':self.respond({'ok':True,'summary':reimport_chrome(data.get('scopes',[]))});return
   if path=='/api/source/upload':
    results=[store_source(f.get('name','upload'),base64.b64decode(f.get('content','')),f.get('source_path',''),f.get('shared',True)) for f in data.get('files',[])];self.respond({'ok':True,'sources':[{'id':x['id'],'name':x['name'],'collections':x['collections'],'parse_errors':x['parse_errors']} for x in results]});return
   if path=='/api/source/scan':self.respond({'ok':True,'result':scan_folder(data.get('path',DEFAULT_SOURCE))});return
   if path=='/api/source/edit':
    s=v5();src=s['sources'].get(data.get('id'))
    if not src:raise ValueError('Unknown source')
    copy=store_source('edited-'+src['name'],str(data.get('content','')).encode(),'edited copy of '+src.get('source_path',''),src.get('shared',True));self.respond({'ok':True,'copy_id':copy['id']});return
   if path=='/api/source/match':self.respond({'ok':True,'report':apply_records(data['source_id'],data['collection'],data.get('indexes'),False)});return
   if path=='/api/source/apply':self.respond({'ok':True,'report':apply_records(data['source_id'],data['collection'],data.get('indexes'),True)});return
   if path=='/api/fields':
    s=v5();fields=s['custom_fields'];action=data.get('action')
    if action=='add':fields.append({'id':sha((data.get('name','')+stamp()).encode())[:12],'name':str(data.get('name',''))[:100],'type':data.get('type','text'),'options':data.get('options',[]),'retired':False})
    elif action=='retire':
     for f in fields:
      if f['id']==data.get('id'):f['retired']=True
    save_v5(s);self.respond({'ok':True,'fields':fields});return
   if path=='/api/project/custom':
    s=v5();pid=str(data['project_id']);s['custom_values'].setdefault(pid,{}).update(data.get('values',{}));save_v5(s);self.respond({'ok':True});return
   if path=='/api/attach':
    s=v5();pid=str(data['project_id']);s['attachments'].setdefault(pid,[]).append({'source_id':data['source_id'],'at':stamp()});save_v5(s);self.respond({'ok':True});return
   if path=='/api/job/start':self.respond({'ok':True,'job':new_job(data.get('kind'),data)});return
   if path=='/api/job/cancel':
    s=v5()
    for j in s['jobs']:
     if j['id']==data.get('id'):j['cancelled']=True
    save_v5(s);self.respond({'ok':True});return
   if path=='/api/search':
    q=str(data.get('q','')).lower();results=[];s=v5();ov=overrides()
    for p in registry()['projects']:
     if q and q in json.dumps([p,s['custom_values'].get(p.get('id'),{}),ov['projects'].get(p.get('id'),{})]).lower():results.append({'type':'project','id':p['id'],'title':p.get('name',p['id']),'match':'project fields'})
    for source in s['sources'].values():
     at=source.get('content','').lower().find(q)
     if q and at>=0:results.append({'type':'source','id':source['id'],'title':source['name'],'match':source.get('content','')[max(0,at-80):at+180]})
    for b in all_bookmarks(read_file('chrome-bookmark-library.json',{})):
     if q and q in json.dumps(b).lower():results.append({'type':'bookmark','id':b['id'],'title':b['title'],'url':b['url'],'match':' / '.join(b['path'])})
    self.respond({'ok':True,'results':results[:500]});return
   if path=='/api/save':
    d=overrides();kind=data.get('kind');pid=str(data.get('id',''))
    if kind=='project':
     allowed={'approved','rejected','reviewed','favorite','description','tags','name','notes','visibility','imported_links'};d['projects'][pid]={**d['projects'].get(pid,{}),**{k:v for k,v in data.get('value',{}).items() if k in allowed}}
    elif kind=='association':d['associations'][pid]=[str(x)[:2000] for x in data.get('urls',[])][:100]
    elif kind=='link':d['links'][pid]={**d['links'].get(pid,{}),**data.get('value',{})}
    else:raise ValueError('Invalid save kind')
    atomic('user-overrides.json',d);self.respond({'ok':True});return
   raise ValueError('not found')
  except Exception as e:self.respond({'error':str(e)},400)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--port',type=int,default=8765);ap.add_argument('--no-browser',action='store_true');args=ap.parse_args();v5()
 server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler);print(f'Asset Command Center v5: http://127.0.0.1:{args.port}/ | manual Chrome reimport only; local files only',flush=True)
 if not args.no_browser:threading.Timer(.5,lambda:webbrowser.open(f'http://127.0.0.1:{args.port}/')).start()
 try:server.serve_forever()
 except KeyboardInterrupt:pass
 finally:server.server_close()
if __name__=='__main__':main()
