#!/usr/bin/env python3
"""Extract already-committed static ZIP and register its live route; idempotent."""
import json,zipfile,pathlib,hashlib
root=pathlib.Path(__file__).resolve().parents[1]
archive=root/'sites/SMB Financial OS.zip'
dest=root/'sites/smb-financial-os'
with zipfile.ZipFile(archive) as z:
    files=[i for i in z.infolist() if not i.is_dir()]
    assert {i.filename for i in files}=={'index.html','style.css','script.js'}, 'Unexpected source archive layout'
    for i in files:
        assert i.file_size<1_000_000 and not pathlib.PurePosixPath(i.filename).is_absolute()
        target=dest/i.filename
        if target.exists():
            assert target.read_bytes()==z.read(i), 'Existing extracted file differs; refusing overwrite'
        else:
            dest.mkdir(parents=True,exist_ok=True)
            target.write_bytes(z.read(i))
def load(p):return json.loads((root/p).read_text(encoding='utf-8'))
def save(p,d):(root/p).write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
slug='smb-financial-os';live='/sites/'+slug+'/';src='sites/'+slug+'/index.html'
reg=load('data/site-registry.json')
if not any(x.get('slug')==slug for x in reg):
    reg.append({'title':'SMB Financial OS','slug':slug,'category':'Funding Tools','type':'static-site','status':'portfolio-site','source':'sites/SMB Financial OS.zip','path':'sites/'+slug,'livePath':live,'hasIndex':True,'variantNumbers':[],'notes':'Deployed original Flash UI static export.'})
    save('data/site-registry.json',reg)
routes=load('data/asset-route-resolution.json')
if not any(x.get('slug')==slug for x in routes['entries']):
    routes['entries'].append({'title':'SMB Financial OS','slug':slug,'category':'Funding Tools','type':'static-site','source':'sites/SMB Financial OS.zip','sourceFile':src,'originalPath':live,'resolvedPath':live,'canonicalGroupId':slug,'resolutionStatus':'resolved','resolutionReason':'Original static ZIP extracted to deployed index.html','productionVerification':'pending','entrypointEvidence':{'originalPathExists':True,'originalEntrypointExists':True,'resolvedEntrypointExists':True,'evidence':[src]},'notes':'Original static export','variantNumbers':[],'sourcePath':src,'sourceUrl':'https://github.com/JFeimster/flash-ui-portfolio/blob/main/'+src})
    routes['summary']['resolved']=routes['summary'].get('resolved',0)+1
    save('data/asset-route-resolution.json',routes)
show=load('data/asset-showcase.json')
show['projects'].setdefault(slug,{'title':'SMB Financial OS','description':'Original Flash UI financial workspace prototype.','audience':'Small business operators','purpose':'Explore the original financial workspace interface.','evidence':[src]})
save('data/asset-showcase.json',show)
catalog=load('data/batch-19c-source-catalog.json')
for e in catalog['entries']:
    if e['id']=='19c-005':
        e['existingGroup']=slug;e['existingRoute']=live;e['repositoryPresence']='deployed-static-source';e['sourceAvailableInRepository']=True
save('data/batch-19c-source-catalog.json',catalog)
print('SMB Financial OS extracted and indexed at',live)
