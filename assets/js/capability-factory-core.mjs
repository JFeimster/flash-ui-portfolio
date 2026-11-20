export const PLUGIN_SCHEMA='https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
export const MCP_SCHEMA='https://agent-plugins.org/schemas/1.0.0/mcp.schema.json';
export const slug=s=>String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64);
export function safePath(path){return typeof path==='string' && path.length>0 && !path.startsWith('/') && !path.includes('\\') && !path.split('/').some(x=>!x||x==='.'||x==='..') && !/[\u0000-\u001f]/.test(path);}
export function safeEndpoint(input){
  try{const u=new URL(input);return !u.username&&!u.password&&!u.hash&&((u.protocol==='https:')||(u.protocol==='http:'&&['localhost','127.0.0.1','::1','[::1]'].includes(u.hostname)))&&!/(?:^|\.)example\.(?:com|org|net)$|^(?:your-|placeholder)/i.test(u.hostname)}
  catch{return false}
}
export function sensitive(text){
  return /(?:sk-(?:proj-)?[a-z0-9_-]{12,}|gh[pousr]_[a-z0-9]{12,}|github_pat_[a-z0-9_]{12,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["']?[^\s"']{8,})/i.test(text);
}
export function redact(text){
 return String(text).replace(/sk-(?:proj-)?[a-z0-9_-]{12,}|gh[pousr]_[a-z0-9]{12,}|github_pat_[a-z0-9_]{12,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["']?[^\s"']{8,}/gi,'[REDACTED]');
}
const json=(value)=>JSON.stringify(value,null,2)+'\n';
export function validatePackage(files){
 const errors=[];
 if(!files||!files['plugin.json'])errors.push('Missing root plugin.json');
 for(const [path,content] of Object.entries(files||{})){
  if(!safePath(path))errors.push('Unsafe path: '+path);
  if(sensitive(content))errors.push('Sensitive value in '+path);
  if(path.endsWith('.json'))try{JSON.parse(content)}catch{errors.push('Invalid JSON: '+path)}
 }
 if(files?.['plugin.json'])try{const p=JSON.parse(files['plugin.json']);if(p.$schema!==PLUGIN_SCHEMA||!p.name||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.name))errors.push('Invalid plugin manifest');if(Object.keys(p).some(k=>!['$schema','name','version','description','author','homepage','repository','license','keywords','extensions'].includes(k)))errors.push('Unsupported manifest field')}catch{}
 for(const [path,content] of Object.entries(files||{}))if(path.endsWith('/SKILL.md')&&!/^---\nname:\s*[a-z0-9-]+\ndescription:\s*.+\n---\n/m.test(content))errors.push('Invalid skill frontmatter: '+path);
 if(files?.['mcp.json'])try{const m=JSON.parse(files['mcp.json']);if(m.$schema!==MCP_SCHEMA||!m.mcpServers||Object.keys(m).some(k=>!['$schema','mcpServers'].includes(k)))errors.push('Invalid MCP config');for(const s of Object.values(m.mcpServers||{}))if(!['streamable-http','sse'].includes(s.type)||!safeEndpoint(s.url)||Object.keys(s).some(k=>!['type','url'].includes(k)))errors.push('Invalid or unverified MCP endpoint')}catch{}
 return errors;
}
export function buildPackage(input){
 const name=slug(input.name),mode=input.mode||'skill',source=(input.instructions||'').trim();
 if(!name)throw Error('Enter a package name.');
 if(!source)throw Error('Paste source instructions before generating a package.');
 if(sensitive(source))throw Error('Source contains possible credentials. Remove them before exporting.');
 if(input.mcpUrl&&!safeEndpoint(input.mcpUrl))throw Error('Remote MCP URL must be a real HTTPS endpoint (or loopback HTTP), not a placeholder.');
 const files={},title=(input.name||name).replace(/[\r\n]/g,' ').trim();
 files['plugin.json']=json({$schema:PLUGIN_SCHEMA,name,version:'0.1.0',description:(input.description||'Portable capability package based on operator-supplied source instructions').slice(0,250)});
 const notes=['# Compatibility and deployment notes','','Source asset: '+(input.assetId||'Custom source'),'Mode: '+mode,'Status: source-based package; not installed, deployed, or executed.','','## Required verification','- Compare exported instructions against original GPT/source, knowledge files, and privacy expectations.','- Confirm any OAuth scopes and connected accounts with the actual provider.','- Test every action on a staging system before deployment.','- Existing plugin identity should be reused on later updates; do not install duplicates.','- Generated packages do not transfer private GPT knowledge automatically.'];
 if(input.knowledge)notes.push('','## Knowledge inventory',redact(input.knowledge));
 if(input.contracts)notes.push('','## API/tool contracts',redact(input.contracts));
 if(mode==='skill'||mode==='agent'||mode==='remote-mcp'){
  const skill=name;
  files['skills/'+skill+'/SKILL.md']='---\nname: '+skill+'\ndescription: '+(input.description||'Perform the supplied capability workflow.').replace(/[\r\n:]/g,' ').slice(0,180)+'\n---\n\n# '+title+'\n\n'+source+'\n';
 }
 if(mode==='remote-mcp'){
  if(!input.mcpUrl)throw Error('Enter an existing, confirmed remote MCP endpoint.');
  files['mcp.json']=json({$schema:MCP_SCHEMA,mcpServers:{[name]:{type:'streamable-http',url:input.mcpUrl}}});
  notes.push('- Endpoint syntax validated, but connectivity and ownership are NOT verified in this browser.');
 }
 if(mode==='mcp-scaffold'){
  files['MCP-SCAFFOLD.md']='# MCP/API server scaffold — NOT DEPLOYED\n\n## Source behavior\n\n'+source+'\n\n## Implementation checklist\n- Design tool names and input/output schemas from real API documentation.\n- Add authorization, input validation, error handling, rate limits, and audit logging.\n- Implement and host a real MCP server.\n- Only then add verified mcp.json connection details.\n';
 }
 if(mode==='agent'){
  files['agents/openai.yaml']='name: '+name+'\ndescription: '+JSON.stringify(input.description||'Operator-supplied agent specification')+'\ninstructions: |\n'+source.split('\n').map(x=>'  '+x).join('\n')+'\n';
  notes.push('- agents/openai.yaml is a platform-specific draft, not part of the portable Agent Plugins core contract.');
 }
 if(mode==='webhook'){
  files['WEBHOOK-CONTRACT.md']='# Webhook contract — NOT ACTIVE\n\n## Intended behavior\n\n'+source+'\n\n## Implement before use\n- Select actual provider URL and HTTP method.\n- Define a versioned JSON event schema.\n- Authenticate signatures and reject replays.\n- Add idempotency, retries, observability and secure secret storage.\n';
 }
 files['COMPATIBILITY.md']=notes.join('\n')+'\n';
 files['README.md']='# '+title+'\n\nGenerated portable package or scaffold from operator-supplied source material.\n\nNo plugin installation, API deployment, MCP connection, or webhook subscription was performed.\n\nSee COMPATIBILITY.md for missing inputs and deployment requirements.\n';
 const errors=validatePackage(files);
 if(errors.length)throw Error(errors.join('; '));
 return files;
}
// Small dependency-free ZIP writer (stored entries, UTF-8 paths). Reimportable by standard unzip tools.
const encoder=new TextEncoder();
const crc32=bytes=>{let crc=0xffffffff;for(const b of bytes){crc^=b;for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return(crc^0xffffffff)>>>0};
const u16=(v)=>[v&255,(v>>>8)&255],u32=(v)=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];
export function zipBytes(files){
 const parts=[],central=[];let offset=0;
 for(const [path,content] of Object.entries(files)){
  if(!safePath(path))throw Error('Unsafe ZIP path');
  const n=encoder.encode(path),b=encoder.encode(content),crc=crc32(b);
  const local=Uint8Array.from([...u32(0x04034b50),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(b.length),...u32(b.length),...u16(n.length),...u16(0),...n]);
  parts.push(local,b);
  central.push(Uint8Array.from([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(b.length),...u32(b.length),...u16(n.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...n]));
  offset+=local.length+b.length;
 }
 const centralSize=central.reduce((sum,x)=>sum+x.length,0),count=central.length;
 const end=Uint8Array.from([...u32(0x06054b50),...u16(0),...u16(0),...u16(count),...u16(count),...u32(centralSize),...u32(offset),...u16(0)]);
 return new Blob([...parts,...central,end],{type:'application/zip'});
}
export function handoff(input,files){return 'Create or update the ChatGPT plugin named '+slug(input.name)+'. Use the attached exported ZIP as source. Preserve the existing plugin identity if one exists. Review COMPATIBILITY.md, validate each skill and any MCP transport, ask for missing source/permissions, and DO NOT invent endpoints, credentials, tool behavior, or mark scaffolds as deployed. Do not publish/install or change external state without my separate explicit authorization.\n\nFiles:\n'+Object.keys(files).join('\n');}
