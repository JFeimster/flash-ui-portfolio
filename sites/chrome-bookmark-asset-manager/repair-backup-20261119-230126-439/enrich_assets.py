#!/usr/bin/env python3
"""Local, opt-in enrichment of the Chrome Bookmark Asset Manager. Python stdlib only."""
import argparse, concurrent.futures, datetime, hashlib, json, os, pathlib, re, shutil, socket, ssl, time, urllib.error, urllib.parse, urllib.request
from collections import Counter
ROOT=pathlib.Path(__file__).resolve().parent

def load(name): return json.loads((ROOT/name).read_text(encoding='utf-8'))
def save(name, value): (ROOT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
def fetch(url, headers=None, timeout=9, method='GET', maxbytes=140000):
    req=urllib.request.Request(url,headers={'User-Agent':'ChromeBookmarkAssetManager/2.0',**(headers or {})},method=method)
    try:
        with urllib.request.urlopen(req,timeout=timeout) as res:
            return {'status':res.status,'final_url':res.geturl(),'headers':dict(res.headers.items()),'body':res.read(maxbytes).decode('utf-8','replace') if method=='GET' else ''}
    except urllib.error.HTTPError as e: return {'status':e.code,'final_url':e.geturl(),'headers':dict(e.headers.items()),'body':''}
    except Exception as e: return {'status':None,'error':str(e)[:240]}

def safe_url(url):
    try:
        p=urllib.parse.urlsplit(url)
        if p.scheme not in ('http','https') or not p.hostname or p.username or p.password: return False
        # Prevent local/private-address requests (SSRF), including DNS-resolved internal targets.
        import ipaddress
        for family,_,_,_,addr in socket.getaddrinfo(p.hostname,None):
            ip=ipaddress.ip_address(addr[0].split('%')[0])
            if not ip.is_global: return False
        return True
    except Exception:return False

def health(item):
    url=item['url']; result={'url':url,'platform':item['platform'],'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    if not safe_url(url):return {**result,'status':'skipped_unsafe'}
    # GET rather than HEAD: many Vercel/other apps reject HEAD.
    r=fetch(url,maxbytes=85000); code=r.get('status'); body=r.get('body','')
    result.update({'http_status':code,'final_url':r.get('final_url'),'status':'reachable' if code and code<400 else 'http_error' if code else 'network_error'})
    if r.get('error'):result['error']=r['error']
    if code and code<400:
        indicators={'nextjs':['/_next/','__NEXT_DATA__','next-head-count'], 'astro':['astro-island','/_astro/'], 'vite':['/assets/index-','type="module"'], 'wordpress':['wp-content/','wp-json'], 'react':['react-dom','data-reactroot']}
        result['technology_signals']=[k for k,signs in indicators.items() if any(s.lower() in body.lower() for s in signs)]
        m=re.search(r'<title[^>]*>(.*?)</title>',body,re.I|re.S)
        if m:result['page_title']=re.sub(r'\s+',' ',re.sub('<[^>]+>','',m.group(1))).strip()[:180]
        if r.get('headers',{}).get('X-Powered-By'):result['x_powered_by']=r['headers']['X-Powered-By'][:100]
    return result

def github(repo_url,token):
    p=urllib.parse.urlsplit(repo_url);parts=p.path.strip('/').split('/')
    if len(parts)<2:return None
    owner,repo=parts[:2]; endpoint='https://api.github.com/repos/'+urllib.parse.quote(owner)+'/'+urllib.parse.quote(repo)
    headers={'Accept':'application/vnd.github+json'}
    if token:headers['Authorization']='Bearer '+token
    r=fetch(endpoint,headers=headers,maxbytes=200000)
    if r.get('status')!=200:return {'repository':owner+'/'+repo,'status':'not_verified','http_status':r.get('status'),'error':r.get('error')}
    try:
        d=json.loads(r['body']);return {'repository':d['full_name'],'status':'verified','description':d.get('description'),'homepage':d.get('homepage'),'language':d.get('language'),'topics':d.get('topics',[]),'updated_at':d.get('updated_at'),'default_branch':d.get('default_branch'),'archived':d.get('archived'),'private':d.get('private'),'html_url':d.get('html_url')}
    except Exception:return {'repository':owner+'/'+repo,'status':'parse_error'}

def screenshot(url, path):
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True)
            page=browser.new_page(viewport={'width':1280,'height':800},device_scale_factor=1)
            page.goto(url,wait_until='domcontentloaded',timeout=16000)
            page.screenshot(path=str(path),full_page=False)
            browser.close()
        return True
    except Exception:return False

def main():
    ap=argparse.ArgumentParser(description='Opt-in enrichment of existing offline project registry; no remote writes.')
    ap.add_argument('--check-web',action='store_true',help='Check public production sites over HTTPS')
    ap.add_argument('--github',action='store_true',help='Read public GitHub repository metadata (GITHUB_TOKEN optional)')
    ap.add_argument('--screenshots',action='store_true',help='Capture reachable public sites; requires Playwright + Chromium')
    ap.add_argument('--limit',type=int,default=0,help='Limit URLs per run (0=all)')
    ap.add_argument('--workers',type=int,default=8)
    args=ap.parse_args()
    registry=load('project-registry.json'); projects=registry['projects']; links=load('project-links.json')['links']
    old_health=load('link-health-report.json') if (ROOT/'link-health-report.json').exists() else {'results':[]}; old_gh=load('github-enrichment.json') if (ROOT/'github-enrichment.json').exists() else {'repositories':{}}
    checks=[]; gh_results={}; shots={}
    if args.check_web:
        targets=[];seen=set()
        for x in links:
            if x['platform'] in ('production',) and x['canonical_url'] not in seen:
                seen.add(x['canonical_url']);targets.append(x)
        if args.limit:targets=targets[:args.limit]
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(args.workers,16))) as pool:
            checks=list(pool.map(health,targets))
        merged={x['url']:x for x in old_health.get('results',[]) if x.get('url')}
        merged.update({x['url']:x for x in checks if x.get('url')})
        checks=list(merged.values())
        save('link-health-report.json',{'schema_version':2,'status':'checked','links_checked':len(checks),'results':checks})
    if args.github:
        urls=list(dict.fromkeys(u for p in projects for u in p['links'].get('github',[])))
        if args.limit:urls=urls[:args.limit]
        token=os.environ.get('GITHUB_TOKEN','')
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(args.workers,8))) as pool:
            gh_results=dict(zip(urls,pool.map(lambda u:github(u,token),urls)))
        merged_gh=old_gh.get('repositories',{}); merged_gh.update(gh_results); gh_results=merged_gh
        save('github-enrichment.json',{'schema_version':1,'repositories':gh_results})
    if not args.check_web:checks=old_health.get('results',[])
    if not args.github:gh_results=old_gh.get('repositories',{})
    check_by_url={x['url']:x for x in checks}
    for p in projects:
        p.setdefault('enrichment',{})
        p['enrichment']['github']=[gh_results[u] for u in p['links'].get('github',[]) if u in gh_results]
        p['enrichment']['health']=[check_by_url[u] for u in p['links'].get('production',[]) if u in check_by_url]
        tech=set(p.get('technology',[]))
        for h in p['enrichment']['health']:tech.update(h.get('technology_signals',[]))
        for g in p['enrichment']['github']:
            if g and g.get('language'):tech.add(g['language'])
        p['technology']=sorted(tech)
        if p['enrichment']['github'] and any(g and g.get('status')=='verified' for g in p['enrichment']['github']):p['verification']['github']='verified'
        if p['enrichment']['health']:
            p['verification']['production']='reachable' if any(h['status']=='reachable' for h in p['enrichment']['health']) else 'not_reachable'
        # Same-slug match remains a candidate, even when both endpoints independently verify.
    if args.screenshots:
        directory=ROOT/'screenshots';directory.mkdir(exist_ok=True)
        for p in projects:
            for u in p['links'].get('production',[])[:1]:
                if not safe_url(u):continue
                filename=hashlib.sha256(u.encode()).hexdigest()[:16]+'.png'
                if screenshot(u,directory/filename):p['enrichment']['screenshot']='screenshots/'+filename
    save('project-registry-enriched.json',{'schema_version':2,'projects':projects,'enriched_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
    # Compare to last snapshot without losing it. No Chrome, repo or deployment writes.
    snapshot=ROOT/'registry-snapshot.json'
    current={p['id']:{'links':p['links']} for p in projects}
    previous=json.loads(snapshot.read_text(encoding='utf-8')) if snapshot.exists() else {}
    delta={'added':sorted(set(current)-set(previous)),'removed':sorted(set(previous)-set(current)),'changed':sorted(k for k in current.keys()&previous.keys() if current[k]!=previous[k]),'baseline_created':not snapshot.exists()}
    save('registry-change-report.json',delta)
    snapshot.write_text(json.dumps(current,ensure_ascii=False,indent=2),encoding='utf-8')
    # Refresh embedded manager data without modifying the original source HTML.
    html_path=ROOT/'OPEN-BOOKMARK-LIBRARY-ASSET-MANAGER.html'
    html=html_path.read_text(encoding='utf-8')
    m=re.search(r'(<script id="am-data" type="application/json">)(.*?)(</script>)',html,re.S)
    if m:
        data=json.loads(m.group(2));data['projects']=projects
        new=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
        html=html[:m.start(2)]+new+html[m.end(2):]
    m3=re.search(r'(<script id="acc-v3-data" type="application/json">)(.*?)(</script>)',html,re.S)
    if m3:
        data3=json.loads(m3.group(2));data3['projects']=projects
        new3=json.dumps(data3,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
        html=html[:m3.start(2)]+new3+html[m3.end(2):]
        html_path.write_text(html,encoding='utf-8')
    print('Project registry enriched:',len(projects),'projects;',len(checks),'total stored site checks;',len(gh_results),'total stored GitHub records')
    print('Change report:',delta)
    print('Open:',html_path)
if __name__=='__main__':main()
