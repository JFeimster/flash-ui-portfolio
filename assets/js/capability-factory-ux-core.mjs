// Pure UI helpers for Batch 28.1. Packaging/export remains in capability-factory-core.mjs.
export const DRAFT_KEY='flash-ui-capability-drafts-v1';
export const MODES=['skill','remote-mcp','mcp-scaffold','agent','webhook'];
export const categories=['gpt','github','idea','tool'];
export function starterIssues(input){
 const errors=[];
 if(!(input.name||'').trim())errors.push('Capability name is required.');
 if(!(input.instructions||'').trim())errors.push('Add source instructions or select an illustrative example.');
 if(input.mode==='remote-mcp'&&!(input.mcpUrl||'').trim())errors.push('Enter an existing remote MCP endpoint.');
 if(!/^\d+\.\d+\.\d+$/.test(input.version||'0.1.0'))errors.push('Use version MAJOR.MINOR.PATCH.');
 return errors;
}
export function projectedFiles(input){
 const slug=String(input.packageIdentity||input.name||'capability').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'capability';
 const paths=['plugin.json'];
 if(['skill','remote-mcp','agent'].includes(input.mode))paths.push('skills/'+slug+'/SKILL.md');
 if(input.mode==='remote-mcp')paths.push('mcp.json');
 if(input.mode==='mcp-scaffold')paths.push('MCP-SCAFFOLD.md');
 if(input.mode==='agent')paths.push('agents/openai.yaml');
 if(input.mode==='webhook')paths.push('WEBHOOK-CONTRACT.md');
 return [...paths,'COMPATIBILITY.md','README.md'];
}
export function readiness(mode){
 if(mode==='remote-mcp')return {title:'Existing connection required',detail:'Provide a real HTTPS MCP endpoint. Connectivity, permissions and OAuth remain unverified.',kind:'connection'};
 if(mode==='mcp-scaffold')return {title:'Backend implementation required',detail:'Server scaffolding only; real schemas, credentials, implementation and hosting still needed.',kind:'service'};
 if(mode==='webhook')return {title:'Backend implementation required',detail:'This is a contract; no event subscriptions or endpoints are activated.',kind:'service'};
 if(mode==='agent')return {title:'Agent runtime required',detail:'Agent spec and portable skill are exported, but no model or runtime is provisioned.',kind:'service'};
 return {title:'Self-contained instructions',detail:'Portable skill package; you still need to install it explicitly in a supported client.',kind:'standalone'};
}
export function filterAssets(nodes,query='',type='all',limit=24){
 const q=query.trim().toLowerCase();return nodes.filter(n=>categories.includes(n.type)&&(type==='all'||n.type===type)&&(!q||[n.name,n.summary,n.id,n.type].join(' ').toLowerCase().includes(q))).slice(0,limit);
}
export function validateExamples(data){
 const errors=[];if(data?.schema!=='flash-ui-capability-examples/v1'||!Array.isArray(data.entries))return ['Invalid examples catalog'];
 const ids=new Set();
 for(const x of data.entries){if(!x.id||ids.has(x.id))errors.push('Missing or duplicate example ID');ids.add(x.id);if(!x.name||!MODES.includes(x.mode)||!x.instructions||x.sourceType!=='illustrative-example')errors.push('Invalid example '+x.id)}
 return errors;
}
export function sanitizeDraft(d){
 const allowed=['name','mode','description','instructions','knowledge','contracts','mcpUrl','version','packageIdentity','assetId','sourceType'];
 const out={};for(const k of allowed)if(typeof d?.[k]==='string')out[k]=d[k].slice(0,k==='instructions'?30000:5000);
 if(!MODES.includes(out.mode))out.mode='skill';return out;
}
export function nextVersion(value){
 const m=/^(\d+)\.(\d+)\.(\d+)$/.exec(value||'');return m?m[1]+'.'+m[2]+'.'+(Number(m[3])+1):'0.1.1';
}
