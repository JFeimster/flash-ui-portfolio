"""Additive local repair layer. Original registries and source files remain untouched."""
import base64,copy,csv,datetime,hashlib,html,io,ipaddress,json,os,pathlib,re,socket,threading,urllib.parse,urllib.request,zipfile
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parent
LOCK=threading.RLock(); JOB={'running':False,'message':'Ready','last_run':None,'done':0,'total':0,'results':[]}
STATE='command-center-repair-state.json'
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def read(n,default):
 try:return json.loads((ROOT/n).read_text(encoding='utf-8-sig'))
 except (OSError,ValueError):return copy.deepcopy(default)
def write(n,v):
 p=ROOT/n;t=p.with_suffix(p.suffix+'.tmp');t.write_text(json.dumps(v,ensure_ascii=False,indent=2),encoding='utf-8');t.replace(p)
def db():
 d=read(STATE,{});
 for k,v in {'sources':{},'projects':{},'fields':[],'values':{},'attachments':{},'changes':[]}.items():d.setdefault(k,v)
 return d
def url(u):
 try:
  p=urllib.parse.urlsplit(str(u).strip());return urllib.parse.urlunsplit((p.scheme.lower(),p.netloc.lower(),p.path.rstrip('/'),p.query,'')) if p.scheme.lower() in ('https','http') and p.hostname else ''
 except ValueError:return ''
def kind(u):
 p=urllib.parse.urlsplit(u);h=(p.hostname or '').lower();parts=p.path.strip('/').split('/')
 if h in ('github.com','www.github.com') and len(parts)>=2 and parts[0].lower() not in ('features','settings','topics','orgs','marketplace','login','signup'):return 'github'
 if h=='vercel.com' and len(parts)>=2 and parts[0] not in ('settings','integrations','dashboard'):return 'vercel_dashboard'
 if h.endswith(('.vercel.app','.replit.app','.github.io','.pages.dev','.chatgpt.site')):return 'production'
 return 'other'
def urls(v):
 out=[]
 if isinstance(v,str):
  if url(v):out.append(url(v))
 elif isinstance(v,list):
  for x in v:out+=urls(x)
 elif isinstance(v,dict):
  for k,x in v.items():
   if k.lower() in ('url','urls','links','github','github_url','github_repo','repo','repository','production','live_url','public_url','deployment_domain','vercel_dashboard','homepage','access_url','website','vercel','vercel_url'):
    if isinstance(x,str) and k.lower() in ('repo','github_repo','repository') and re.fullmatch(r'[\w.-]+/[\w.-]+',x):x='https://github.com/'+x
    if isinstance(x,str) and k.lower()=='deployment_domain' and re.fullmatch(r'[\w.-]+\.[\w.-]+',x):x='https://'+x
    out+=urls(x)
 return list(dict.fromkeys(out))
def typed(v):
 out={k:[] for k in ('github','vercel_dashboard','production','ai_studio','other')}
 if isinstance(v,dict):
  for k,a in v.items():
   for u in urls(a):
    t=kind(u)
    if t=='other' and k in ('production','website','live_url','public_url','homepage'):t='production'
    if u not in out[t]:out[t].append(u)
 else:
  for u in urls(v):out[kind(u)].append(u)
 return out
def combine(a,b):
 out=typed(a)
 for k,arr in typed(b).items():out[k]=list(dict.fromkeys(out[k]+arr))
 return out
def tree_merge(a,b):
 out=copy.deepcopy(a);out.setdefault('profiles',[])
 def merge(arr,incoming):
  for n in incoming:
   if not isinstance(n,dict):continue
   hit=next((x for x in arr if x.get('type')==n.get('type') and x.get('name')==n.get('name') and (n.get('type')!='url' or x.get('url')==n.get('url'))),None)
   if hit is None:arr.append(copy.deepcopy(n))
   elif n.get('type')=='folder':merge(hit.setdefault('children',[]),n.get('children',[]))
 merge(out['profiles'],b.get('profiles',[]));return out
def library():
 tree=read('bookmark-library-seed.json',{'profiles':[]})
 for n in ('bookmarks-original.json','bookmark-library-user.json'):tree=tree_merge(tree,read(n,{'profiles':[]}))
 return tree
def project_list():
 merged={}
 for n in ('project-registry.json','project-registry-enriched.json'):
  raw=read(n,{})
  for p in raw.get('projects',[]) if isinstance(raw,dict) else raw:
   if isinstance(p,dict) and p.get('id'):merged[p['id']]={**merged.get(p['id'],{}),**p}
 if not merged:
  for p in read('project-registry-recovered.json',{}).get('projects',[]):merged[p['id']]=p
 d=db();ov=read('user-overrides.json',{});ov.setdefault('projects',{});ov.setdefault('links',{});ov.setdefault('saved_views',[]);ov.setdefault('associations',{})
 for pid,p in d['projects'].items():merged[pid]={**merged.get(pid,{}),**p,'id':pid}
 for pid,p in merged.items():
  p['links']=typed(ov['projects'][pid]['links']) if 'links' in ov['projects'].get(pid,{}) else combine(p.get('links',{}),ov['associations'].get(pid,[]))
  for k,v in {'name':pid,'tags':[],'source_folders':[],'technology':[],'bookmark_ids':[],'enrichment':{},'verification':{}}.items():p.setdefault(k,v)
  p['custom_properties']=d['values'].get(pid,{});p['attachments']=d['attachments'].get(pid,[])
 return list(merged.values()),ov
class Meta(HTMLParser):
 def __init__(self):super().__init__();self.meta={};self.title='';self.intitle=False
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='title':self.intitle=True
  if t=='meta':self.meta[a.get('name',a.get('property','')).lower()]=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.meta['canonical']=a.get('href','')
 def handle_endtag(self,t):
  if t=='title':self.intitle=False
 def handle_data(self,s):
  if self.intitle:self.title+=s
class PublicRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,req,fp,code,msg,headers,newurl):
  public_url(newurl);redirect=super().redirect_request(req,fp,code,msg,headers,newurl)
  if redirect and urllib.parse.urlsplit(req.full_url).hostname!=urllib.parse.urlsplit(newurl).hostname:redirect.remove_header('Authorization')
  return redirect
def public_url(u):
 p=urllib.parse.urlsplit(u)
 if p.scheme not in ('http','https') or not p.hostname or p.username or p.password:raise ValueError('A public HTTP(S) URL is required')
 for a in socket.getaddrinfo(p.hostname,p.port or (443 if p.scheme=='https' else 80),type=socket.SOCK_STREAM):
  if not ipaddress.ip_address(a[4][0]).is_global:raise ValueError('Private/local addresses are excluded from website verification')
def fetch(u,token=''):
 public_url(u);headers={'User-Agent':'AssetCommandCenter/5.1','Accept':'application/json' if 'api.github.com' in u else 'text/html,application/json'}
 if token:headers['Authorization']='Bearer '+token
 with urllib.request.build_opener(PublicRedirect()).open(urllib.request.Request(u,headers=headers),timeout=12) as r:return r.status,r.url,r.read(1500000).decode('utf-8','replace')
def records(v):
 if isinstance(v,list):return [x for x in v if isinstance(x,dict)]
 if isinstance(v,dict):
  found=[]
  for k in ('entries','projects','assets','repositories','deployments','routes'):
   if isinstance(v.get(k),list):found+=records(v[k])
  return found or [v]
 return []
def parse(name,raw):
 ext=pathlib.Path(name).suffix.lower();s=raw.decode('utf-8-sig','replace')
 if ext=='.json':return records(json.loads(s)),s
 if ext=='.csv':return list(csv.DictReader(io.StringIO(s))),s
 if ext in ('.html','.htm'):
  m=re.search(r'<script[^>]*id=["\x27]bookmark-data["\x27][^>]*>(.*?)</script>',s,re.S)
  if m:return records(json.loads(m.group(1))),s
 return [],s
def add_source(d,name,raw):
 if len(raw)>20_000_000:raise ValueError('File exceeds 20 MB limit')
 sid=hashlib.sha256(name.encode()+raw).hexdigest()[:20]
 if sid in d['sources']:return sid
 rows,text=parse(name,raw);folder=ROOT/'command-center-attachments';folder.mkdir(exist_ok=True)
 (folder/(sid+'.bin')).write_bytes(raw)
 d['sources'][sid]={'id':sid,'name':name,'hash':hashlib.sha256(raw).hexdigest(),'indexed_at':now(),'records':rows,'text':text,'size':len(raw)}
 return sid
def index_blob(d,name,raw):
 results=[]
 if name.lower().endswith('.zip'):
  with zipfile.ZipFile(io.BytesIO(raw)) as z:
   if sum(x.file_size for x in z.infolist())>80_000_000:raise ValueError('ZIP exceeds 80 MB expanded limit')
   for item in z.infolist():
    if item.is_dir() or pathlib.PurePosixPath(item.filename).is_absolute() or '..' in pathlib.PurePosixPath(item.filename).parts:continue
    if pathlib.Path(item.filename).suffix.lower() in ('.json','.csv','.md','.txt','.html','.htm'):
     try:results.append({'id':add_source(d,name+' / '+item.filename,z.read(item)),'name':item.filename,'ok':True})
     except Exception as e:results.append({'name':item.filename,'error':str(e)})
 else:results.append({'id':add_source(d,name,raw),'name':name,'ok':True})
 return results
URL_KEYS={'url','github_url','github_repo','repo','repository','live_url','public_url','deployment_domain','vercel_dashboard','homepage','website','access_url'}
def identifiers(v):
 ids=set()
 for u in urls(v):
  p=urllib.parse.urlsplit(u);k=kind(u)
  if k=='github':ids.add('gh:'+'/'.join(p.path.strip('/').lower().split('/')[:2]).removesuffix('.git'))
  elif k=='vercel_dashboard':ids.add('vc:'+'/'.join(p.path.strip('/').lower().split('/')[:2]))
  elif p.path in ('','/'):ids.add('web:'+(p.hostname or '').lower())
  else:ids.add(u)
 return ids
def fill_project(d,p,ov):
 pid=p['id'];effective={**p,**ov.get('projects',{}).get(pid,{})};key=identifiers(p['links']);matches=[]
 for s in d['sources'].values():
  for r in s['records']:
   if key & identifiers(r):matches.append((s,r))
 changes=[];patch=d['projects'].setdefault(pid,{})
 for s,r in matches:
  for field in ('description','category','brand_owner','intended_use','status','stack','target_user','monetization'):
   val=r.get(field)
   if val and val!='—' and not effective.get(field):
    patch[field]=val;effective[field]=val;changes.append({'project':pid,'field':field,'value':val,'source':s['name'],'at':now()})
  p['links']=combine(p['links'],{k:v for k,v in r.items() if k in URL_KEYS or k=='links'})
 patch['links']=p['links'];patch['source_matches']=[{'source':s['name'],'record':r.get('id',r.get('name',''))} for s,r in matches];d['changes']+=changes;d['changes']=d['changes'][-2000:]
 return len(matches),changes
def enrich(ids,network):
 JOB.update(running=True,done=0,total=len(ids),results=[],message='Filling project information',last_run=now())
 try:
  for pid in ids:
   if JOB.get('cancel'):break
   with LOCK:
    d=db();ps,ov=project_list();p=next((p for p in ps if p['id']==pid),None)
    if not p:continue
    count,changes=fill_project(d,p,ov);write(STATE,d)
   outcome={'id':pid,'matches':count,'filled':len(changes),'checks':[]}
   if network:
    for k in ('github','production'):
     for u in p['links'].get(k,[])[:2]:
      if JOB.get('cancel'):break
      try:
       if k=='github':
        path='/'.join(urllib.parse.urlsplit(u).path.strip('/').split('/')[:2]);code,final,text=fetch('https://api.github.com/repos/'+path,os.environ.get('GITHUB_TOKEN',''));g=json.loads(text);result={'url':u,'status':'verified','description':g.get('description'),'language':g.get('language'),'topics':g.get('topics',[]),'archived':g.get('archived'),'homepage':g.get('homepage'),'checked_at':now()}
       else:
        code,final,text=fetch(u);m=Meta();m.feed(text);result={'url':u,'status':'reachable','http_status':code,'final_url':final,'title':m.title.strip(),'description':m.meta.get('description',m.meta.get('og:description','')),'meta':m.meta,'checked_at':now()}
       with LOCK:
        d=db();patch=d['projects'].setdefault(pid,{});patch.setdefault('enrichment',copy.deepcopy(p.get('enrichment',{})));bucket='github' if k=='github' else 'health';arr=patch['enrichment'].setdefault(bucket,[]);arr[:]=[x for x in arr if x.get('url')!=u];arr.append(result)
        effective={**p,**patch,**ov.get('projects',{}).get(pid,{})}
        if not effective.get('description') and result.get('description'):patch['description']=result['description'];d['changes'].append({'project':pid,'field':'description','source':u,'value':result['description'],'at':now()})
        if k=='github':patch['technology']=sorted(set(p.get('technology',[])+([result['language']] if result.get('language') else [])))
        write(STATE,d)
       outcome['checks'].append(result)
      except Exception as e:outcome['checks'].append({'url':u,'error':str(e)[:240]})
   JOB['done']+=1;JOB['results'].append(outcome);JOB['message']=f"Processed {JOB['done']} / {JOB['total']}"
  JOB['message']='Cancelled; completed results retained' if JOB.get('cancel') else 'Complete — results saved'
 except Exception as e:JOB['message']='Job failed: '+str(e)
 finally:JOB['running']=False;JOB['cancel']=False

def route(h,path,method):
 if not path.startswith('/api/') and path not in ('/repair.js','/bookmark-library'):return False
 host=h.headers.get('Host','').split(':',1)[0].lower()
 if host not in ('127.0.0.1','localhost'):
  h.response({'error':'Localhost access only'},403);return True
 # Protect mutating localhost endpoints against cross-origin browser requests.
 if method=='POST':
  origin=h.headers.get('Origin');host=h.headers.get('Host','')
  if origin and origin not in ('http://'+host,'https://'+host):h.response({'error':'Cross-origin request blocked'},403);return True
 try:
  if method=='GET':
   if path in ('/repair.js','/bookmark-library'):
    if path=='/repair.js':raw=(ROOT/'repair.js').read_bytes();mime='application/javascript'
    else:
     text=(ROOT/'bookmark-library.html').read_text(encoding='utf-8');tree=library()
     def count(n,t):return (1 if n.get('type')==t else 0)+sum(count(c,t) for c in n.get('children',[]))
     tree['urlCount']=sum(count(n,'url') for n in tree['profiles']);tree['folderCount']=sum(count(n,'folder') for n in tree['profiles'])
     text=re.sub(r'(<script[^>]*id="bookmark-data"[^>]*>).*?(</script>)',lambda m:m.group(1)+json.dumps(tree,ensure_ascii=False).replace('<','\\u003c')+m.group(2),text,flags=re.S)
     text=text.replace('</body>',"<script>const b=document.createElement('button');b.textContent='Add selected to Projects';b.onclick=()=>parent.postMessage({action:'add-bookmarks',rows:flat()},location.origin);document.getElementById('export-json').parentElement.append(b);</script></body>");raw=text.encode();mime='text/html'
    h.send_response(200);h.send_header('Content-Type',mime+'; charset=utf-8');h.send_header('Content-Length',str(len(raw)));h.end_headers();h.wfile.write(raw);return True
   if path=='/api/state':
    with LOCK:
     ps,ov=project_list();d=db();h.response({'projects':ps,'links':read('project-links.json',{}).get('links',[]),'bookmarks':{},'duplicates':read('duplicate-candidates.json',{}).get('duplicates',[]),'overrides':ov,'imports':read('import-history.json',[]),'refresh':JOB,'fields':d['fields'],'sources':[{k:v for k,v in s.items() if k not in ('text','records')}|{'count':len(s['records'])} for s in d['sources'].values()],'changes':d['changes'][-100:]})
    return True
   if path.startswith('/api/source/'):
    sid=path.rsplit('/',1)[-1];s=db()['sources'].get(sid)
    if not s:raise ValueError('Source not found')
    h.response(s);return True
   return False
  if path not in ('/api/save','/api/refresh','/api/import') and not path.startswith('/api/utility/'):return False
  data=h.payload()
  with LOCK:
   d=db()
   if path=='/api/save':
    ov=read('user-overrides.json',{});pid=str(data.get('id',''));k=data.get('kind');v=data.get('value',{})
    if k in ('project','link'):
     if not pid:raise ValueError('Missing record ID')
     if not isinstance(v,dict):raise ValueError('Invalid record')
     ov.setdefault(k+'s',{}).setdefault(pid,{}).update({f:x for f,x in v.items() if f in ('name','description','notes','tags','approved','rejected','reviewed','favorite','visibility','links')})
    elif k=='association':ov.setdefault('associations',{})[pid]=[u for u in data.get('urls',[]) if url(u)]
    elif k=='view':ov['saved_views']=[x for x in ov.get('saved_views',[]) if x.get('name')!=data['name']]+[{'name':data['name'],'filters':data['filters']}]
    else:raise ValueError('Unknown save action')
    write('user-overrides.json',ov);h.response({'ok':True});return True
   if path=='/api/refresh':
    if data.get('checks'):data={'ids':[p['id'] for p in project_list()[0]],'network':True};path='/api/utility/enrich'
    else:
     from app_server import load_chrome
     tree=load_chrome()
     if not tree:raise ValueError('No readable Chrome profiles found. Saved full library retained.')
     write('bookmark-library-user.json',tree_merge(library(),tree));JOB['message']='All Chrome folders imported; project records preserved';h.response({'ok':True,'message':JOB['message']});return True
   if path=='/api/import':
    tree=data.get('bookmarks')
    if not isinstance(tree,dict) or not isinstance(tree.get('profiles'),list):raise ValueError('Expected a bookmark profiles array')
    write('bookmark-library-user.json',tree_merge(library(),tree));h.response({'ok':True});return True
   if path=='/api/utility/index':
    result=[]
    if data.get('bundle'):result=index_blob(d,'Registries.zip',(ROOT/'Registries.zip').read_bytes())
    elif 'content' in data:result=index_blob(d,str(data.get('name','upload.txt')),base64.b64decode(data['content'],validate=True))
    else:
     source=pathlib.Path(data.get('path','')).expanduser()
     if not str(data.get('path','')).strip() or not source.exists():raise ValueError('Select an existing file or folder')
     candidates=source.rglob('*') if source.is_dir() else [source]
     for p in candidates:
      if p.is_file() and p.suffix.lower() in ('.json','.csv','.md','.txt','.html','.htm','.zip'):
       try:result+=index_blob(d,str(p),p.read_bytes())
       except Exception as e:result.append({'name':str(p),'error':str(e)})
       if len(result)>=1000:break
    write(STATE,d);h.response({'ok':True,'results':result});return True
   if path=='/api/utility/field':
    name=str(data.get('name','')).strip();typ=data.get('type','text');options=data.get('options',[])
    if not name:raise ValueError('Name the property')
    if typ not in ('text','longtext','url','number','boolean','date','select','multi-select'):raise ValueError('Unsupported type')
    if any(x['name'].lower()==name.lower() for x in d['fields']):raise ValueError('Property already exists')
    fid='field-'+hashlib.sha256(name.lower().encode()).hexdigest()[:12];d['fields'].append({'id':fid,'name':name,'type':typ,'options':options});write(STATE,d);h.response({'ok':True});return True
   if path=='/api/utility/values':
    pid=data['id'];vals=data['values'];clean={}
    for f in d['fields']:
     if f['id'] not in vals:continue
     v=vals[f['id']]
     if f['type']=='number':v=None if v=='' or v is None else float(v)
     if f['type']=='boolean' and not isinstance(v,bool):raise ValueError('Invalid boolean')
     if f['type']=='url' and v and not url(v):raise ValueError('Invalid property URL')
     clean[f['id']]=v
    d['values'].setdefault(pid,{}).update(clean);write(STATE,d);h.response({'ok':True});return True
   if path=='/api/utility/attach':
    if data['source'] not in d['sources']:raise ValueError('Index or upload a source first')
    arr=d['attachments'].setdefault(data['id'],[])
    if data.get('remove'):arr[:]=[x for x in arr if x!=data['source']]
    elif data['source'] not in arr:arr.append(data['source'])
    write(STATE,d);h.response({'ok':True});return True
   if path=='/api/utility/search':
    q=str(data.get('q','')).lower();hits=[]
    for s in d['sources'].values():
     pos=(s['name']+'\n'+s['text']).lower().find(q)
     if q and pos>=0:hits.append({'id':s['id'],'name':s['name'],'snippet':(s['name']+'\n'+s['text'])[max(0,pos-80):pos+350],'count':len(s['records'])})
    h.response({'hits':hits});return True
   if path=='/api/utility/add-bookmarks':
    ps,ov=project_list();known={u:p['id'] for p in ps for u in urls(p['links'])};added=0
    for row in data.get('rows',[]):
     u=url(row.get('url',''))
     if not u or u in known:continue
     pid='bookmark-'+hashlib.sha256(u.encode()).hexdigest()[:14];d['projects'][pid]={'id':pid,'name':row.get('title') or u,'links':typed([u]),'source_folders':[row.get('folder','Selected bookmarks')],'tags':[]};known[u]=pid;added+=1
    write(STATE,d);h.response({'ok':True,'added':added});return True
   if path=='/api/utility/complete-source':
    source=d['sources'].get(data['source'])
    if not source:raise ValueError('Source not found')
    ps,ov=project_list();out=[];filled=0
    for row in source['records']:
     row=copy.deepcopy(row);candidates=[p for p in ps if identifiers(p['links']) & identifiers(row)]
     if len(candidates)==1:
      p=candidates[0];effective={**p,**ov['projects'].get(p['id'],{})}
      for field in ('description','name','tags','technology'):
       if not row.get(field) and effective.get(field):row[field]=effective[field];filled+=1
     out.append(row)
    h.response({'entries':out,'filled':filled,'source':source['name']});return True
   if path=='/api/utility/import-source':
    source=d['sources'].get(data['source'])
    if not source:raise ValueError('Source not found')
    ps,ov=project_list();added=0;matched=0
    for row in source['records']:
     links=typed({k:v for k,v in row.items() if k in URL_KEYS or k=='links'})
     if not urls(links):continue
     candidates=[p for p in ps if identifiers(p['links']) & identifiers(links)]
     if candidates:matched+=1;continue
     pid='source-'+hashlib.sha256(json.dumps(sorted(urls(links))).encode()).hexdigest()[:14]
     if pid in d['projects']:continue
     d['projects'][pid]={'id':pid,'name':row.get('name',row.get('title',pid)),'description':row.get('description',''),'links':links,'source_folders':[source['name']],'tags':[]};added+=1
     ps.append(d['projects'][pid])
    write(STATE,d);h.response({'ok':True,'added':added,'existing':matched});return True
   if path=='/api/utility/enrich':
    if JOB['running']:raise ValueError('A job is already running')
    ids=data.get('ids',[]);ids=list(dict.fromkeys(ids));JOB.update(running=True,cancel=False,total=len(ids),done=0,results=[],message='Starting')
    threading.Thread(target=enrich,args=(ids,bool(data.get('network'))),daemon=True).start();h.response({'ok':True});return True
   if path=='/api/utility/cancel':JOB['cancel']=True;h.response({'ok':True});return True
   if path=='/api/utility/source-copy':
    text=str(data.get('text',''));name=pathlib.Path(data.get('name','edited.json')).name;sid=add_source(d,'Edited / '+name,text.encode());write(STATE,d);h.response({'ok':True,'id':sid});return True
  h.response({'error':'Unknown action'},404);return True
 except Exception as e:h.response({'error':str(e)[:500]},400);return True
