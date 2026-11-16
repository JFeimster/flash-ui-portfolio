// Group equivalent public asset records for display without changing their canonical IDs.
const tidy = value => String(value || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function identityKey(node) {
  let title = tidy(node.name).replace(/(?:^| )gpt(?:$| )/g,' ').replace(/ +/g,' ').trim();
  if (title.length < 7 || /^(?:project|template|site|tool|app|dashboard|generator|calculator|homepage|landing page)$/.test(title)) return '';
  return title;
}
export function groupAssets(nodes, edges) {
  const byId = new Map(nodes.map(n => [n.id,n]));
  const parents = new Map(nodes.map(n => [n.id,n.id]));
  const find = id => { let p=parents.get(id); if(!p)return null; if(p!==id){ p=find(p); parents.set(id,p); } return p; };
  const join = (a,b) => { const x=find(a),y=find(b); if(x&&y&&x!==y) parents.set(y,x); };
  const durable = new Set(['implements','deployed_as','source_repository','powered_by']);
  for(const e of edges) if(durable.has(e.type) && ['recorded','verified'].includes(e.status)) join(e.from,e.to);
  const names=new Map();
  for(const n of nodes){const key=identityKey(n);if(key){const a=names.get(key)||[];a.push(n);names.set(key,a)}}
  const matches=[];
  for(const [key,a] of names){
    if(a.length<2||new Set(a.map(n=>n.type)).size!==a.length)continue;
    for(let i=1;i<a.length;i++){join(a[0].id,a[i].id);matches.push([a[0].id,a[i].id,key]);}
  }
  const buckets=new Map();
  for(const n of nodes){const id=find(n.id);const a=buckets.get(id)||[];a.push(n);buckets.set(id,a)}
  const weight={site:0,gpt:1,idea:2,github:3,vercel:4,template:5,tool:6,capability:7};
  const groups=[...buckets.values()].map(members=>{
    members.sort((a,b)=>(weight[a.type]??9)-(weight[b.type]??9)||a.name.localeCompare(b.name));
    const first=members[0],groupIds=new Set(members.map(n=>n.id));
    return {id:first.id,name:first.name,primary:first,members,ids:groupIds,types:[...new Set(members.map(n=>n.type))],
      summary:members.map(n=>n.summary).find(Boolean)||'',matchCount:matches.filter(m=>groupIds.has(m[0])&&groupIds.has(m[1])).length};
  });
  return groups.sort((a,b)=>a.name.localeCompare(b.name));
}
