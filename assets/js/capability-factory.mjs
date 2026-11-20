import {buildPackage,zipBytes,handoff,validatePackage,sensitive,safeEndpoint} from './capability-factory-core.mjs';
import {prefillIdea,validateIdeas} from './capability-ideas-core.mjs';
import {validateFundingCollection,prefillFundingAgencyIdea} from './funding-agency-core.mjs';
import {DRAFT_KEY,starterIssues,projectedFiles,readiness,filterAssets,validateExamples,sanitizeDraft,nextVersion} from './capability-factory-ux-core.mjs';

const $=id=>document.getElementById(id);
const FIELDS=['name','mode','description','instructions','knowledge','contracts','mcpUrl','packageIdentity','version'];
let graph=[],examples=[],files=null,lastInput=null,selected='',sourceType='custom-source',filter='all',visibleLimit=20,currentStep=1;
const status=(s,error=false)=>{$('status').textContent=s;$('status').classList.toggle('error',error)};
const value=()=>({...Object.fromEntries(FIELDS.map(k=>[k,$(k).value])),assetId:selected,sourceType});
const clearExport=()=>{files=null;lastInput=null;$('files').replaceChildren();$('filePreview').value='';$('handoffPreview').value='';$('zip').disabled=true;$('handoff').disabled=true};
function setStep(n){
 currentStep=n;
 for(const pane of document.querySelectorAll('[data-pane]'))pane.hidden=Number(pane.dataset.pane)!==n;
 for(const button of document.querySelectorAll('.step-tab')){const active=Number(button.dataset.step)===n;button.classList.toggle('is-active',active);if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')}
 if(n===3&&!files)status('A package has not been generated. Return to configuration and run validation.');
}
const fieldValue=(id,s)=>{$(id).value=s??''};
function loadDraft(data,origin='custom-source'){
 const safe=sanitizeDraft(data);
 for(const name of FIELDS)fieldValue(name,safe[name]??(name==='mode'?'skill':name==='version'?'0.1.0':''));
 selected=safe.assetId||'';sourceType=safe.sourceType||origin;
 $('mcpField').hidden=$('mode').value!=='remote-mcp';clearExport();refreshPreview();
 $('sourceLabel').textContent=sourceType==='illustrative-example'?'Illustrative example — editable draft; NOT recovered GPT instructions':sourceType==='public-asset'?'Public asset metadata only — original instructions not included':sourceType==='library-concept'?'Concept-library draft — synthetic instructions, not recovered source':'Custom source — operator-provided instructions';
 status('Draft loaded. Review source and validation before exporting.');
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderExamples(){
 $('exampleGallery').replaceChildren();
 for(const e of examples){
  const button=document.createElement('button');button.type='button';button.className='example-card';button.innerHTML='<span class="example-kicker">SAMPLE · '+escapeHtml(e.mode)+'</span><strong>'+escapeHtml(e.name)+'</strong><span>'+escapeHtml(e.description)+'</span><span class="example-link">Use editable example ↗</span>';
  button.addEventListener('click',()=>{loadDraft({...e,knowledge:e.knowledge||'',contracts:e.contracts||'',version:'0.1.0',packageIdentity:'',assetId:''},'illustrative-example');setStep(2)});
  $('exampleGallery').append(button);
 }
}
function renderAssets(){
 const items=filterAssets(graph,$('assetSearch').value,filter,visibleLimit),all=filterAssets(graph,$('assetSearch').value,filter,Number.MAX_SAFE_INTEGER);
 $('assetCards').replaceChildren();
 for(const n of items){
  const button=document.createElement('button');button.className='asset-card';button.type='button';
  const desc=(n.summary||'Public metadata only; no full instructions available.').slice(0,130);
  button.innerHTML='<span class="asset-type">'+escapeHtml(n.type)+'</span><strong>'+escapeHtml(n.name)+'</strong><span>'+escapeHtml(desc)+'</span>';
  button.addEventListener('click',()=>{loadDraft({name:n.name,description:n.summary||'',mode:'skill',instructions:'',version:'0.1.0',assetId:n.id,sourceType:'public-asset'},'public-asset');$('assetSelect').value=n.id;setStep(2)});
  $('assetCards').append(button);
 }
 $('assetStatus').textContent=items.length+' of '+all.length+' public assets shown. A directory record cannot reconstruct private source instructions.';
 $('showMore').hidden=all.length<=items.length;
}
function refreshPreview(){
 const input=value(),issues=starterIssues(input),ready=readiness(input.mode);
 $('readiness').textContent=ready.title+' — '+ready.detail;
 $('readiness').dataset.state=ready.kind;
 const warnings=[];
 if(sourceType==='illustrative-example')warnings.push('Example instructions are synthetic, not recovered GPT source.');
 if(sourceType==='public-asset')warnings.push('Asset record contains metadata only; paste original instructions.');
 if(input.mode==='remote-mcp'&&input.mcpUrl&&!safeEndpoint(input.mcpUrl))warnings.push('Endpoint URL is invalid or illustrative.');
 if(sensitive([input.instructions,input.knowledge,input.contracts].join('\n')))warnings.push('Potential secret detected; export will be rejected.');
 $('validation').replaceChildren();
 const statusText=document.createElement('strong');statusText.textContent=issues.length?issues.length+' input requirement(s) remaining':'Required fields supplied; package has not been validated';$('validation').append(statusText);
 for(const s of [...issues,...warnings]){const p=document.createElement('p');p.textContent='• '+s;$('validation').append(p)}
 $('packageTree').replaceChildren();for(const path of projectedFiles(input)){const el=document.createElement('div');el.className='file-node';el.textContent='▣ '+path;$('packageTree').append(el)}
}
function onChange(){if(files){clearExport();status('Inputs changed. Generate again to export the updated package.')}refreshPreview()}
for(const id of FIELDS){$(id).addEventListener(id==='mode'?'change':'input',()=>{$('mcpField').hidden=$('mode').value!=='remote-mcp';onChange()})}
$('assetSearch').addEventListener('input',()=>{visibleLimit=20;renderAssets()});
for(const button of document.querySelectorAll('[data-type]'))button.addEventListener('click',()=>{filter=button.dataset.type;visibleLimit=20;for(const b of document.querySelectorAll('[data-type]')){const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))}renderAssets()});
$('showMore').addEventListener('click',()=>{visibleLimit+=20;renderAssets()});
for(const button of document.querySelectorAll('[data-step]'))button.addEventListener('click',()=>setStep(Number(button.dataset.step)));
for(const button of document.querySelectorAll('[data-next]'))button.addEventListener('click',()=>setStep(Number(button.dataset.next)));
for(const button of document.querySelectorAll('[data-back]'))button.addEventListener('click',()=>setStep(Number(button.dataset.back)));
$('build').addEventListener('click',()=>{
 clearExport();const input=value();const issues=starterIssues(input);
 if(issues.length){status(issues.join(' '),true);setStep(3);return}
 try{
  lastInput=input;files=buildPackage(input);
  const errors=validatePackage(files);if(errors.length)throw Error(errors.join('; '));
  for(const path of Object.keys(files)){const option=document.createElement('option');option.value=path;option.textContent=path;$('files').append(option)}
  $('files').selectedIndex=0;$('filePreview').value=files[$('files').value];$('handoffPreview').value=handoff(input,files);
  $('zip').disabled=false;$('handoff').disabled=false;
  status('Validated '+Object.keys(files).length+' package files. Download is ready; nothing installed or deployed.');
 }catch(error){status(error.message,true);files=null}
 setStep(3);
});
$('files').addEventListener('change',()=>{$('filePreview').value=files?.[$('files').value]||''});
$('zip').addEventListener('click',()=>{
 if(!files||!lastInput)return;
 try{const url=URL.createObjectURL(zipBytes(files)),a=document.createElement('a');a.href=url;a.download=(lastInput.packageIdentity||lastInput.name).toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-v'+(lastInput.version||'0.1.0')+'.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);status('ZIP downloaded. Export is not deployment.')}
 catch(e){status('ZIP export failed: '+e.message,true)}
});
$('handoff').addEventListener('click',async()=>{if(!files)return;try{await navigator.clipboard.writeText($('handoffPreview').value);status('Plugin Creator handoff copied.')}catch{status('Clipboard unavailable; copy handoff text manually.',true)}});
function reset(){loadDraft({name:'',mode:'skill',description:'',instructions:'',knowledge:'',contracts:'',mcpUrl:'',packageIdentity:'',version:'0.1.0',sourceType:'custom-source'});$('assetSearch').value='';filter='all';renderAssets();setStep(1)}
$('clear').addEventListener('click',reset);$('newProject').addEventListener('click',reset);
function getSaved(){try{const a=JSON.parse(localStorage.getItem(DRAFT_KEY)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
function updateSavedList(){const select=$('savedProjects'),last=select.value;select.replaceChildren();const empty=document.createElement('option');empty.value='';empty.textContent='Choose a saved draft…';select.append(empty);for(const d of getSaved()){const o=document.createElement('option');o.value=d.id;o.textContent=d.name+' · '+d.version;select.append(o)}if([...select.options].some(o=>o.value===last))select.value=last}
$('saveProject').addEventListener('click',()=>{
 const draft=sanitizeDraft(value());if(!draft.name.trim()){status('Enter a capability name before saving.',true);setStep(3);return}
 if(sensitive([draft.instructions,draft.knowledge,draft.contracts,draft.mcpUrl].join('\n'))){status('Sensitive value detected; local saving blocked.',true);setStep(3);return}
 try{
  const records=getSaved(),id=draft.packageIdentity||draft.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');const item={...draft,id,savedAt:new Date().toISOString()};
  const index=records.findIndex(d=>d.id===id);if(index>=0){if(records[index].version===draft.version){}records[index]=item}else records.push(item);
  localStorage.setItem(DRAFT_KEY,JSON.stringify(records.slice(-30)));updateSavedList();$('savedProjects').value=id;
  status('Saved locally in this browser only. Reopening preserves the same package identity.');setStep(3)
 }catch{status('Local storage unavailable or full; use ZIP export instead.',true);setStep(3)}
});
$('savedProjects').addEventListener('change',()=>{const draft=getSaved().find(d=>d.id===$('savedProjects').value);if(!draft)return;loadDraft(draft,'custom-source');fieldValue('version',nextVersion(draft.version));refreshPreview();setStep(2)});
async function loadData(){
 try{const [examplesResponse,graphResponse]=await Promise.all([fetch('/data/capability-examples.json'),fetch('/data/asset-graph.public.json')]);if(!examplesResponse.ok||!graphResponse.ok)throw Error('Could not load a catalog');const catalog=await examplesResponse.json(),assetGraph=await graphResponse.json();const errors=validateExamples(catalog);if(errors.length)throw Error(errors.join('; '));examples=catalog.entries;graph=(assetGraph.nodes||[]);renderExamples();renderAssets()}
 catch(error){$('assetStatus').textContent='Catalog unavailable: '+error.message+'. Manual source intake remains available.'}
 updateSavedList();refreshPreview()
}
async function prefillFromLibrary(){
 const params=new URLSearchParams(location.search);const id=params.get('fundingIdea')||params.get('idea');if(!id)return;
 try{
  let settings,title;
  if(params.has('fundingIdea')){
   const r=await fetch('/data/funding-agency-automation-ideas.json');if(!r.ok)throw Error('Funding ideas unavailable');const d=await r.json();const issues=validateFundingCollection(d);if(issues.length)throw Error(issues.join('; '));const idea=d.entries.find(x=>x.id===id);if(!idea)throw Error('Funding idea not found');settings=prefillFundingAgencyIdea(idea);title=idea.title;
  }else{
   const r=await fetch('/data/mcp-agent-product-ideas.json');if(!r.ok)throw Error('Product ideas unavailable');const d=await r.json();const issues=validateIdeas(d);if(issues.length)throw Error(issues.join('; '));const idea=d.entries.find(x=>x.id===id);if(!idea)throw Error('Product idea not found');settings=prefillIdea(idea);title=idea.title;
  }
  loadDraft({...settings,version:'0.1.0',sourceType:'library-concept'},'library-concept');setStep(2);
  const notice=$('ideaPrefillNotice');notice.hidden=false;notice.textContent='Loaded illustrative draft: '+title+' — review source and API requirements before exporting.';
 }catch(error){setStep(3);status(error.message,true)}
}
loadData();prefillFromLibrary();
