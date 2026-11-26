// Node 18+; no dependencies. Run: node scripts/generate-public-registry.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,v)=>fs.writeFileSync(path.join(root,p),v);
function makePublic(master,manifest){
const byId=new Map(master.assets.map(x=>[x.id,x]));
const allowed=new Set(["/","/editions/","/blueprint/","/playbooks/","/ai-lab/","/automations/","/tools/","/partners/","/resources/","/field-notes/","/start/","/about/"]);
function safeUrl(s){if(typeof s!=="string")return false;if(/^\/(?!\/)[a-z0-9/_\-.]*$/i.test(s)&&!s.includes("..")&&!s.startsWith("/registry"))return true;const m=s.match(/^https:\/\/([a-z0-9.-]+)(?:\/[^\s]*)?$/i);if(!m)return false;const h=m[1].toLowerCase();return !/[?&](?:token|signature|x-amz-credential)=/i.test(s)&&(["www.linkedin.com","tally.so","chatgpt.com","youtu.be","www.distilledfunding.com","tools.distilledfunding.com"].includes(h)||h.endsWith(".vercel.app"))}
const project=e=>({id:e.id,title:e.title,description:e.description,kind:e.kind,routes:e.routes,label:e.label,url:e.url});
const assets=[...manifest.entries.map(e=>{const s=byId.get(e.id);if(!s)throw Error("Unknown master record "+e.id);if(!e.local&&(!s.live_url||["internal","private","restricted"].includes(s.access_level)))throw Error("Restricted or missing URL "+e.id);return project({...e,url:e.local||s.live_url})}),...manifest.supplements.map(project)];
const seen=new Set();for(const a of assets){if(seen.has(a.id)||!safeUrl(a.url)||!a.routes.every(r=>allowed.has(r)))throw Error("Invalid public record "+a.id);seen.add(a.id)}
for(const u of Object.values(manifest.publication))if(!safeUrl(u))throw Error("Invalid publication link");
return {version:manifest.version,publication:{...manifest.publication},assets};
}
function renderPage(html,route,data){
const prefix=route==="/"?"./":"../";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const href=s=>esc(s.startsWith("/")?prefix+s.slice(1):s);
const ext=s=>s.startsWith("https://")?' target="_blank" rel="noopener noreferrer"':"";
const titles={"/":"READ. BUILD. EXECUTE.","/editions/":"THE EDITORIAL DESK.","/blueprint/":"BUILD WITH THE EXISTING STACK.","/playbooks/":"OPERATING PLAYBOOKS IN PRACTICE.","/ai-lab/":"OPEN THE AI TOOLKIT.","/automations/":"WORKFLOWS IN THE WILD.","/tools/":"OPEN THE TOOLBOX.","/partners/":"PARTNER INFRASTRUCTURE.","/resources/":"THE CONNECTED RESOURCE VAULT.","/field-notes/":"THE BUILD LOG.","/start/":"TAKE THE NEXT STEP.","/about/":"FOLLOW THE PUBLICATION."};
const cards=data.assets.filter(a=>a.routes.includes(route)).map(a=>`<a class="tile" href="${href(a.url)}"${ext(a.url)}><span class="tile-kicker">${esc(a.label)}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><span class="tile-arrow">${a.kind==="edition"?"COMPANION ↗":"OPEN ↗"}</span></a>`).join("");
const section=`<!-- registry:begin --><section class="content-section" id="registry-catalog"><div class="section-cap"><span>THE BLUEPRINT / CONNECTED RESOURCES</span><h2>${titles[route]}</h2></div><div class="grid thirds">${cards}</div><p class="fineprint">External application availability and features may change. Educational resources are not funding offers or guaranteed outcomes.</p></section><!-- registry:end -->`;
const marker=/<!-- registry:begin -->[\s\S]*?<!-- registry:end -->/;
const placeholder={"/":"CURRENT EDITORIAL DESK.","/editions/":"THE ARCHIVE, MINUS THE FAKE ISSUES.","/tools/":"MORE UTILITIES TO CONNECT.","/resources/":"OTHER KNOWLEDGE SOURCES TO INVENTORY.","/field-notes/":"BUILD IN PUBLIC. WITHOUT PRETENDING THE BUILD IS DONE."};
let out=html;
if(marker.test(out))out=out.replace(marker,()=>section);else{const hit=[...out.matchAll(/<section class="content-section"[^>]*>[\s\S]*?<\/section>/g)].find(m=>placeholder[route]&&m[0].includes("<h2>"+placeholder[route]+"</h2>"));out=hit?out.replace(hit[0],()=>section):out.replace("</main>",`<div class="shell">${section}</div></main>`);}
const sub=`<!-- newsletter:begin --><a class="button outline" href="${href(data.publication.subscribe)}"${ext(data.publication.subscribe)}>SUBSCRIBE ON LINKEDIN ↗</a><!-- newsletter:end -->`;
const subMarker=/<!-- newsletter:begin -->[\s\S]*?<!-- newsletter:end -->/;
if(subMarker.test(out))out=out.replace(subMarker,()=>sub);else if(route==="/")out=out.replace('<div class="hero-stamp">',sub+'<div class="hero-stamp">');else out=out.replace('<div class="footer-links">','<div class="footer-links">'+sub);
return out.replaceAll("All three design studies","All six design studies");
}
const data=makePublic(JSON.parse(read('registry/blueprint-assets.master.json')),JSON.parse(read('registry/public-release.json')));
const extractConcepts=function(master){return master.assets.filter(a=>["tool","funnel","portal"].includes(a.asset_type)&&!a.live_url).map(a=>({id:a.id,title:a.title,kind:a.asset_type,status:"concept",description:"Development concept — no working application is linked yet."}));};
const renderConcepts=function(data){
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const cards=data.toolConcepts.map(a=>`<article class="tile concept-item" data-kind="${esc(a.kind)}"><span class="tile-kicker">CONCEPT / ${esc(a.kind.toUpperCase())}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p></article>`).join("");
return `<!-- concepts:begin --><section class="content-section" id="tool-concepts"><div class="section-cap"><span>THE BUILD BACKLOG / ${data.toolConcepts.length} IDEAS</span><h2>THE NEXT WAVE OF FUNDING TOOLS.</h2></div><p>Explore the development catalog: calculators, funnels and portals that could become useful agency assets. Concepts are not live applications.</p><div class="filter-bar"><label for="concept-search">SEARCH CONCEPTS</label><input id="concept-search" type="search" placeholder="Search the build catalog…"><select id="concept-kind" aria-label="Filter concept type"><option value="all">All types</option><option value="tool">Tools</option><option value="funnel">Funnels</option><option value="portal">Portals</option></select></div><p id="concept-count" aria-live="polite">${data.toolConcepts.length} concepts</p><div class="grid thirds" id="concept-grid">${cards}</div></section><script src="../assets/js/tool-concepts.js" defer></script><!-- concepts:end -->`;
};
const patchConcepts=function(html,data){const block=renderConcepts(data),marker=/<!-- concepts:begin -->[\s\S]*?<!-- concepts:end -->/;return marker.test(html)?html.replace(marker,()=>block):html.replace("</main>",'<div class="shell">'+block+'</div></main>');};
data.toolConcepts=JSON.parse(read('registry/public-release.json')).includeToolConcepts?extractConcepts(JSON.parse(read('registry/blueprint-assets.master.json'))):[];
const output={ 'data/blueprint-public.json':JSON.stringify(data,null,2)+'\n' };
for(const r of ["/","/editions/","/blueprint/","/playbooks/","/ai-lab/","/automations/","/tools/","/partners/","/resources/","/field-notes/","/start/","/about/"]){const p=r==='/'?'index.html':r.slice(1)+'index.html';output[p]=renderPage(read(p),r,data);}
output['tools/index.html']=patchConcepts(output['tools/index.html'],data);
if(process.argv.includes('--check')){for(const [p,v] of Object.entries(output))if(read(p)!==v)throw Error('Generated file is stale: '+p);console.log('Registry is current.');}else{for(const [p,v] of Object.entries(output))write(p,v);console.log('Generated '+data.assets.length+' public records across 12 routes.');}
