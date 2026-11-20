import {buildPackage,zipBytes,handoff} from './capability-factory-core.mjs';
const $=id=>document.getElementById(id);
let nodes=[],files=null,selected='',lastInput=null;
const fields=['name','mode','description','instructions','knowledge','contracts','mcpUrl'];
const state=(message,error=false)=>{$('status').textContent=message;$('status').classList.toggle('error',error)};
const input=()=>Object.fromEntries(fields.map(k=>[k,$(k).value]).concat([['assetId',selected]]));
function resetOutput(){files=null;lastInput=null;$('files').replaceChildren();$('filePreview').value='';$('handoffPreview').value='';$('zip').disabled=true;$('handoff').disabled=true}
function listAssets(){
 const q=$('assetSearch').value.trim().toLowerCase();
 const matches=nodes.filter(n=>!q||[n.name,n.type,n.summary,n.id].join(' ').toLowerCase().includes(q)).slice(0,120);
 const select=$('assetSelect');select.replaceChildren();
 for(const n of matches){const opt=document.createElement('option');opt.value=n.id;opt.textContent=n.name+' · '+n.type;select.append(opt)}
 $('assetStatus').textContent=matches.length+' matching public records. A record does not provide private source instructions.';
}
async function init(){
 try{
 const res=await fetch('/data/asset-graph.public.json',{cache:'no-store'});if(!res.ok)throw Error('Asset graph unavailable');
 const graph=await res.json();nodes=(graph.nodes||[]).filter(n=>['gpt','idea','github','tool'].includes(n.type));
 listAssets();
 }catch(e){$('assetStatus').textContent='Public asset graph unavailable. Custom source intake still works.';$('assetSelect').replaceChildren()}
}
$('assetSearch').addEventListener('input',listAssets);
$('assetSelect').addEventListener('change',()=>{
 const n=nodes.find(x=>x.id===$('assetSelect').value);if(!n)return;
 selected=n.id;$('name').value=n.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64);
 $('description').value=(n.summary||'').slice(0,250);
 // Public graph metadata is only a source pointer. It cannot substitute for source instructions.
 $('instructions').value='';
 resetOutput();state('Selected '+n.name+'. Paste complete authorized instructions to continue.');
});
$('mode').addEventListener('change',()=>{$('mcpField').hidden=$('mode').value!=='remote-mcp';resetOutput();state('Mode changed. Generate a new package.')});
for(const id of ['name','description','instructions','knowledge','contracts','mcpUrl']){
 $(id).addEventListener('input',()=>{if(files){resetOutput();state('Source or settings changed. Generate again before export.')}});
}
$('build').addEventListener('click',()=>{
 resetOutput();
 try{
  lastInput=input();files=buildPackage(lastInput);
  for(const path of Object.keys(files)){const opt=document.createElement('option');opt.value=path;opt.textContent=path;$('files').append(opt)}
  $('files').selectedIndex=0;$('filePreview').value=files[$('files').value];
  $('handoffPreview').value=handoff(lastInput,files);
  $('zip').disabled=false;$('handoff').disabled=false;
  state('Validated '+Object.keys(files).length+' files. Ready to download; no external action has occurred.');
 }catch(e){state(e.message,true)}
});
$('files').addEventListener('change',()=>{$('filePreview').value=files?.[$('files').value]||''});
$('zip').addEventListener('click',()=>{
 if(!files||!lastInput)return;
 try{const blob=zipBytes(files),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=lastInput.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-capability.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);state('ZIP downloaded. Package is not installed or deployed.')}catch(e){state('ZIP export failed: '+e.message,true)}
});
$('handoff').addEventListener('click',async()=>{
 if(!files)return;
 try{await navigator.clipboard.writeText($('handoffPreview').value);state('Handoff prompt copied. Attach the exported ZIP when using Plugin Creator.')}catch{state('Clipboard unavailable; select and copy the handoff text manually.',true)}
});
$('clear').addEventListener('click',()=>{for(const field of fields)$(field).value=field==='mode'?'skill':'';selected='';$('assetSearch').value='';$('mcpField').hidden=true;resetOutput();listAssets();state('Cleared. No files or accounts changed.')});
init();
