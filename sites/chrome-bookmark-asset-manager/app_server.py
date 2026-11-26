#!/usr/bin/env python3
"""Local-only Asset Command Center. Standard library; never serves on a public interface."""
import argparse,concurrent.futures,datetime,hashlib,json,os,pathlib,re,socket,threading,time,urllib.parse,urllib.request,urllib.error,webbrowser
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
ROOT=pathlib.Path(__file__).resolve().parent
LOCK=threading.RLock(); REFRESH_LOCK=threading.Lock(); STATUS={'running':False,'last_run':None,'message':'Ready'}
SELECTED=['All folders']; POLL_INTERVAL=0

def read(name,default=None):
 try:return json.loads((ROOT/name).read_text(encoding='utf-8'))
 except (FileNotFoundError,json.JSONDecodeError):return default

def write(name,obj):
 tmp=ROOT/(name+'.tmp');tmp.write_text(json.dumps(obj,ensure_ascii=False,indent=2),encoding='utf-8');tmp.replace(ROOT/name)

def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def chrome_sources():
 home=pathlib.Path(os.environ.get('LOCALAPPDATA',''))/'Google/Chrome/User Data'
 if not home.is_dir():return []
 return [p for p in sorted(home.glob('*/Bookmarks')) if p.parent.name=='Default' or p.parent.name.startswith('Profile ')] + ([home/'Default'/'Bookmarks'] if (home/'Default'/'Bookmarks').exists() and home/'Default'/'Bookmarks' not in list(home.glob('*/Bookmarks')) else [])

def to_tree(raw,profile):
 roots=raw.get('roots',{}); kids=[]
 for key,name in [('bookmark_bar','Bookmarks bar'),('other','Other bookmarks'),('synced','Mobile bookmarks')]:
  if key in roots:
   def convert(n):
    if n.get('type')=='url':return {'type':'url','name':n.get('name',''),'url':n.get('url','')}
    return {'type':'folder','name':n.get('name',''),'children':[convert(x) for x in n.get('children',[])]}
   kids.append({'type':'folder','name':name,'children':[convert(x) for x in roots[key].get('children',[])]})
 return {'type':'folder','name':'Chrome: '+profile,'children':kids}

def extract_selected(all_profiles):
 out=[]
 for root in all_profiles:
  for bar in root.get('children',[]):
   if bar.get('name')!='Bookmarks bar':continue
   children=[x for x in bar.get('children',[]) if x.get('type')=='folder' and x.get('name') in SELECTED]
   if children:out.append({'type':'folder','name':root['name'],'children':[{'type':'folder','name':bar['name'],'children':children}]})
 return {'schemaVersion':1,'profiles':out}

def fingerprint(x):return hashlib.sha256(json.dumps(x,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
def load_chrome():
 profiles=[]
 for path in chrome_sources():
  try:profiles.append(to_tree(json.loads(path.read_text(encoding='utf-8')),path.parent.name))
  except (OSError,json.JSONDecodeError):continue
 return {'schemaVersion':1,'profiles':profiles} if profiles else None

def collect_links(tree):
 rows=[]
 def walk(n,path):
  if isinstance(n,list):
   for x in n:walk(x,path)
  elif n.get('type')=='url':
   url=n.get('url',''); p=urllib.parse.urlsplit(url);host=(p.hostname or '').lower();parts=[s for s in p.path.split('/') if s]; plat='website';slug='';kind='reference'
   if host=='github.com':
    plat='github';kind='repository'
    if len(parts)>1 and parts[0].lower() not in ('topics','orgs','features','settings','marketplace'):slug=parts[1].lower()
   elif host=='vercel.com':
    plat='vercel';kind='deployment_dashboard'
    if len(parts)>1 and parts[0] not in ('dashboard','settings','integrations'):slug=parts[1].lower()
   elif host.endswith('.vercel.app'):
    plat='production';kind='production';slug=host[:-11] # remove .vercel.app
   elif host.endswith('.replit.app'):
    plat='replit';kind='production';slug=host.split('.')[0]
   elif host=='replit.com':
    plat='replit';kind='workspace';slug=parts[1].lower() if len(parts)>1 and parts[0].startswith('@') else ''
   elif 'aistudio.google.com' in host or host=='ai.studio':plat='ai_studio';kind='prototype'
   elif 'chatgpt.com' in host:plat='chatgpt'
   elif 'notion.' in host:plat='notion'
   elif host in ('github.io',) or host.endswith('.github.io') or host.endswith('.pages.dev') or host.endswith('.chatgpt.site'):plat='website';kind='production'
   if kind=='reference' and plat=='website':kind='website'
   norm=urllib.parse.urlunsplit((p.scheme.lower(),p.netloc.lower(),p.path.rstrip('/'),'', ''))
   rid=hashlib.sha256((url+'|'+('/'.join(path))).encode()).hexdigest()[:14]
   rows.append({'id':rid,'title':n.get('name') or host,'url':url,'canonical_url':norm,'host':host,'platform':plat,'kind':kind,'source_folders':path,'slug':slug,'category':'reference' if plat in ('chatgpt','notion') else 'candidate'})
  else:
   name=n.get('name','');npath=path+[name] if name else path
   walk(n.get('children',[]),npath)
 walk(tree.get('profiles',[]),[])
 return rows

def build(tree,source):
 links=collect_links(tree);group={};matched=set()
 for r in links:
  if r['slug'] and r['platform'] in ('github','vercel','production','replit'):
   group.setdefault(r['slug'],[]).append(r);matched.add(r['id'])
 projects=[]
 for slug,arr in sorted(group.items()):
  dest={'github':[],'vercel_dashboard':[],'production':[],'ai_studio':[],'other':[]}
  for r in arr:
   key='github' if r['platform']=='github' else 'vercel_dashboard' if r['platform']=='vercel' else 'production' if r['kind']=='production' else 'other'
   if r['url'] not in dest[key]:dest[key].append(r['url'])
  plats=set(r['platform'] for r in arr)
  projects.append({'id':slug,'name':slug.replace('-',' ').title(),'asset_type':'project_candidate','status':'unverified','links':dest,'technology':[],'source_folders':sorted(set(' / '.join(r['source_folders']) for r in arr)),'tags':sorted(plats),'verification':{'github':'pending','production':'pending','match':'candidate_same_slug' if len(plats)>1 else 'single_platform'},'bookmark_ids':sorted(set(r['id'] for r in arr)),'match_confidence':'medium' if len(plats)>1 else 'low'})
 canon={}
 for r in links:canon.setdefault(r['canonical_url'],[]).append(r)
 dups=[{'canonical_url':u,'occurrences':len(a),'bookmark_ids':[x['id'] for x in a]} for u,a in canon.items() if len(a)>1]
 unmatched=[r for r in links if r['id'] not in matched]
 old=read('project-registry-enriched.json',{'projects':[]}); prior={p['id']:p for p in old['projects']}
 for p in projects:
  prev=prior.get(p['id'])
  if prev:
   p['enrichment']=prev.get('enrichment',{});p['technology']=prev.get('technology',[])
   for k in ('github','production'):
    if prev.get('verification',{}).get(k) not in (None,'pending'):p['verification'][k]=prev['verification'][k]
 # Save derived data without touching user edits
 write('bookmarks-original.json',tree);write('project-links.json',{'schema_version':2,'links':links});write('project-registry.json',{'schema_version':2,'projects':projects});write('project-registry-enriched.json',{'schema_version':2,'projects':projects,'enriched_at':now()});write('unmatched-links.json',{'links':unmatched});write('duplicate-candidates.json',{'duplicates':dups})
 summary={'id':fingerprint(tree)[:12],'name':source,'imported_at':now(),'source_type':'chrome_live' if source.startswith('Chrome') else 'json_export','selected_folders':SELECTED,'bookmarks':len(links),'projects':len(projects),'folders':sum(1 for _ in iterate_folders(tree))}
 history=read('import-history.json',[])
 if not history or history[-1]['id']!=summary['id']:history.append(summary);write('import-history.json',history)
 return summary

def iterate_folders(n):
 if isinstance(n,list):
  for x in n:yield from iterate_folders(x)
 elif isinstance(n,dict):
  if n.get('type')=='folder':yield n
  yield from iterate_folders(n.get('profiles',[]))
  yield from iterate_folders(n.get('children',[]))

def refresh_external():
 import enrich_assets
 import concurrent.futures
 current=read('project-registry-enriched.json',{'projects':[]});projects=current['projects']; links=read('project-links.json',{'links':[]})['links']; health_cache=read('link-health-report.json',{'results':[]});hc={r.get('url'):r for r in health_cache.get('results',[])}
 gh_cache=read('github-enrichment.json',{'repositories':{}}).get('repositories',{})
 urls=list(dict.fromkeys(u for p in projects for u in p.get('links',{}).get('production',[])))
 repos=list(dict.fromkeys(u for p in projects for u in p.get('links',{}).get('github',[])))
 # Safe bounded reads; only public production URLs. No API token stored locally.
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
  for item in pool.map(enrich_assets.health,[{'url':u,'platform':'production'} for u in urls]):hc[item['url']]=item
  for u,g in zip(repos,pool.map(lambda u:enrich_assets.github(u,os.environ.get('GITHUB_TOKEN','')),repos)):gh_cache[u]=g
 for p in projects:
  checks=[hc[u] for u in p['links']['production'] if u in hc]; gh=[gh_cache[u] for u in p['links']['github'] if u in gh_cache]
  p['enrichment']={'health':checks,'github':gh};p['technology']=sorted(set(p.get('technology',[])+[t for x in checks for t in x.get('technology_signals',[])]+[g['language'] for g in gh if isinstance(g,dict) and g.get('language')]))
  p['verification']['production']='reachable' if any(x.get('status')=='reachable' for x in checks) else 'not_reachable' if checks else 'pending'
  p['verification']['github']='verified' if any(isinstance(g,dict) and g.get('status')=='verified' for g in gh) else 'not_verified' if gh else 'pending'
 write('project-registry-enriched.json',{'schema_version':2,'projects':projects,'enriched_at':now()});write('link-health-report.json',{'schema_version':2,'status':'checked','links_checked':len(hc),'results':list(hc.values())});write('github-enrichment.json',{'repositories':gh_cache});return f'Checked {len(urls)} production URLs and {len(repos)} repository URLs'

def run_refresh(check_links=False,source='manual'):
 if not REFRESH_LOCK.acquire(blocking=False):return {'ok':False,'message':'Refresh already running'}
 STATUS.update(running=True,message='Refreshing...',last_run=now())
 try:
  tree=load_chrome()
  if tree:
   cur=read('bookmarks-original.json',{}); change=fingerprint(tree)!=fingerprint(cur)
   if change:summary=build(tree,'Chrome profiles — Folder + Vibe');message=f"Imported {summary['bookmarks']} bookmarks, {summary['projects']} candidates. "
   else:message='Chrome folders unchanged. '
  else:message='Chrome bookmark files not available; retained last import. '
  if check_links:message+=refresh_external()+'. '
  STATUS.update(message=message,last_run=now());return {'ok':True,'message':message}
 except Exception as e:
  STATUS.update(message='Refresh error: '+str(e)[:300]);return {'ok':False,'message':STATUS['message']}
 finally:STATUS['running']=False;REFRESH_LOCK.release()

class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def response(self,obj,status=200):
  raw=json.dumps(obj,ensure_ascii=False).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
 def payload(self):
  size=int(self.headers.get('Content-Length','0'))
  if size>30000000:raise ValueError('Upload too large')
  return json.loads(self.rfile.read(size))
 def do_GET(self):
  path=urllib.parse.urlsplit(self.path).path
  from repair_runtime import route
  if route(self,path,'GET'):return
  if path=='/':
   raw=(ROOT/'index.html').read_bytes();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw);return
  if path=='/api/state':
   self.response({'projects':read('project-registry-enriched.json',{'projects':[]})['projects'],'links':read('project-links.json',{'links':[]})['links'],'bookmarks':read('bookmarks-original.json',{}),'duplicates':read('duplicate-candidates.json',{'duplicates':[]})['duplicates'],'overrides':read('user-overrides.json',{'projects':{},'links':{},'saved_views':[],'associations':{}}),'imports':read('import-history.json',[]),'refresh':STATUS});return
  self.response({'error':'not found'},404)
 def do_POST(self):
  path=urllib.parse.urlsplit(self.path).path
  from repair_runtime import route
  if route(self,path,'POST'):return
  try:
   data=self.payload()
   if path=='/api/save':
    if data.get('kind') not in ('project','link','view','association'):raise ValueError('Invalid kind')
    with LOCK:
     db=read('user-overrides.json',{'projects':{},'links':{},'saved_views':[],'associations':{}})
     kind=data['kind'];pid=str(data.get('id',''))[:200]
     if kind in ('project','link'):
      if not pid:raise ValueError('Missing ID')
      entry=data.get('value',{});allow=('approved','rejected','reviewed','favorite','description','tags','name','notes','visibility')
      db[kind+'s'][pid]={**db[kind+'s'].get(pid,{}),**{k:v for k,v in entry.items() if k in allow}}
     elif kind=='view':
      name=str(data.get('name','')).strip()[:100]
      if not name:raise ValueError('Missing view name')
      db['saved_views']=[v for v in db['saved_views'] if v.get('name')!=name]+[{'name':name,'filters':data.get('filters',{})}]
     else:
      if not pid:raise ValueError('Missing project ID')
      urls=data.get('urls',[])
      if not isinstance(urls,list) or len(urls)>100:raise ValueError('Invalid URLs')
      db['associations'][pid]=[str(u)[:2000] for u in urls]
     write('user-overrides.json',db)
    self.response({'ok':True});return
   if path=='/api/import':
    tree=data.get('bookmarks');name=str(data.get('name','Manual JSON'))[:120]
    if not isinstance(tree,dict) or not isinstance(tree.get('profiles'),list):raise ValueError('Expected JSON with profiles array')
    summary=build(extract_selected(tree['profiles']),name)
    self.response({'ok':True,'summary':summary});return
   if path=='/api/refresh':
    if STATUS['running']:self.response({'ok':False,'message':'Refresh in progress'});return
    mode=bool(data.get('checks',False))
    threading.Thread(target=run_refresh,kwargs={'check_links':mode},daemon=True).start()
    self.response({'ok':True,'message':'Refresh started; dashboard will update when complete'});return
   self.response({'error':'not found'},404)
  except Exception as e:self.response({'error':str(e)},400)

def monitor(stop):
 while not stop.wait(POLL_INTERVAL):run_refresh(check_links=False,source='poll')

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--port',type=int,default=8765);ap.add_argument('--no-browser',action='store_true');ap.add_argument('--no-sync',action='store_true');args=ap.parse_args()
 # Never bind to all addresses
 server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler);stop=threading.Event()
 print(f'Asset Command Center repair: http://127.0.0.1:{args.port}/ | Chrome reimport is manual',flush=True)
 if not args.no_browser:threading.Timer(.7,lambda:webbrowser.open(f'http://127.0.0.1:{args.port}/')).start()
 try:server.serve_forever()
 except KeyboardInterrupt:pass
 finally:stop.set();server.server_close()
if __name__=='__main__':main()
