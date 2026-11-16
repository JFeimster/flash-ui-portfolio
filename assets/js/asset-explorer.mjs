import { filterAssets } from './asset-explorer-core.mjs';
const labels = { idea: 'Ideas', site: 'Sites', github: 'Repos', vercel: 'Vercel Projects', tool: 'Tools / Widgets', gpt: 'GPTs', capability: 'Plugins / MCP / API' };
const params = new URLSearchParams(location.search);
const $ = id => document.getElementById(id);
const el = (tag, className, content) => { const n = document.createElement(tag); if (className) n.className = className; if (content != null) n.textContent = content; return n; };
const safeUrl = url => { try { const u = new URL(url, location.origin); return (url.startsWith('/') && !url.startsWith('//') && u.origin === location.origin) || (url.startsWith('https://') && u.protocol === 'https:') ? u.href : null; } catch { return null; } };
let graph = { nodes: [], edges: [] };
let active = params.get('asset') || '';
let saved = new Set();
try { saved = new Set(JSON.parse(localStorage.getItem('flash-ui-ecosystem-saved') || '[]')); } catch { saved = new Set(); }
let dense = localStorage.getItem('flash-ui-ecosystem-dense') === '1';
let onlySaved = false;
let pageSize = 80;

function state() { return { q: $('search').value, type: params.get('type') || '', ecosystem: $('ecosystem').value, category: $('category').value, maturity: $('maturity').value, linkage: $('linkage').value, collection: params.get('collection') || '', saved: onlySaved ? saved : null }; }
function sync() {
  for (const [key, value] of Object.entries({ q: $('search').value, type: params.get('type') || '', ecosystem: $('ecosystem').value, category: $('category').value, maturity: $('maturity').value, linkage: $('linkage').value, collection: params.get('collection') || '', sort: $('sort').value, asset: active })) value ? params.set(key, value) : params.delete(key);
  history.replaceState(null, '', `${location.pathname}${params.size ? '?' + params : ''}`);
}
function optionList(id, values, fallback) { const select = $(id); [...new Set(values.filter(Boolean))].sort().forEach(v => { const o = el('option', '', v); o.value = v; select.append(o); }); select.value = params.get(id) || ''; if (!select.value) select.value = fallback || ''; }
function button(label, selected, click) { const b = el('button', selected ? 'selected' : '', label); b.type = 'button'; b.setAttribute('aria-pressed', String(selected)); b.addEventListener('click', click); return b; }
function setupFilters() {
  optionList('ecosystem', graph.nodes.map(n => n.ecosystem)); optionList('category', graph.nodes.map(n => n.category)); optionList('maturity', graph.nodes.map(n => n.maturity));
  $('search').value = params.get('q') || ''; $('linkage').value = params.get('linkage') || ''; $('sort').value = params.get('sort') || 'name';
  const types = [['','All'],...Object.entries(labels).filter(([type]) => graph.nodes.some(n => n.type === type))];
  for (const [type,label] of types) $('typeFilters').append(button(label, (params.get('type') || '') === type, () => { type ? params.set('type',type) : params.delete('type'); render(); }));
  const collections = [['','All assets'],['built-ideas','Ideas with builds'],['widgets','Widgets & calculators'],['variations','Site variations'],['repos-no-deploy','Repos without recorded deployment'],['vercel-repos','Vercel + public repo'],['gpts','Recorded GPT links']];
  for (const [key,label] of collections) $('collections').append(button(label, (params.get('collection') || '') === key, () => { key ? params.set('collection',key) : params.delete('collection'); render(); }));
  ['search','ecosystem','category','maturity','linkage','sort'].forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', render));
  $('viewToggle').addEventListener('click', () => { dense = !dense; localStorage.setItem('flash-ui-ecosystem-dense',dense ? '1':'0'); render(); });
  $('savedOnly').addEventListener('click', () => { onlySaved = !onlySaved; render(); });
  $('reset').addEventListener('click', () => { params.delete('type'); params.delete('collection'); ['search','ecosystem','category','maturity','linkage'].forEach(id => $(id).value = ''); onlySaved = false; render(); });
}
function link(label, url) { const safe = safeUrl(url); if (!safe) return null; const a = el('a','action',label); a.href = safe; if (!url.startsWith('/')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; }
function showDetail() {
  const box = $('detail'); box.replaceChildren(); const n = graph.nodes.find(x => x.id === active);
  if (!n) { box.append(el('p','state','Select an asset to see its source and related records.')); return; }
  box.append(el('p','eyebrow',labels[n.type] || n.type), el('h2','',n.name));
  if (n.summary) box.append(el('p','summary',n.summary));
  const meta = el('dl','meta'); for (const [k,v] of [['Source',n.source],['Category',n.category],['Maturity',n.maturity],['URL status',n.urlStatus]]) if (v) { meta.append(el('dt','',k),el('dd','',v)); } box.append(meta);
  const actions = el('div','detail-actions');
  const primary = link(n.type === 'idea' ? 'Remix prompt' : n.type === 'vercel' ? 'Visit recorded URL' : n.type === 'github' ? 'Open repo' : n.type === 'gpt' ? 'Open GPT' : n.type === 'site' ? 'Open site' : 'Open source',n.url);
  if (primary) actions.append(primary);
  actions.append(button(saved.has(n.id) ? '★ Saved' : '☆ Save',saved.has(n.id),() => { saved.has(n.id) ? saved.delete(n.id) : saved.add(n.id); localStorage.setItem('flash-ui-ecosystem-saved',JSON.stringify([...saved])); render(); }));
  actions.append(button('Copy reference',false,async () => { await navigator.clipboard.writeText(n.id); })); box.append(actions);
  const related = graph.edges.filter(e => e.from === n.id || e.to === n.id);
  box.append(el('h3','','Known relationships'));
  if (!related.length) { box.append(el('p','state','No confirmed or recorded links in the current sources.')); return; }
  const list = el('ul','relations'); for (const e of related) { const other = graph.nodes.find(x => x.id === (e.from === n.id ? e.to : e.from)); if (!other) continue; const li = el('li'); li.append(button(other.name,false,() => { active = other.id; render(); })); li.append(el('span','',`${e.type.replaceAll('_',' ')} · ${e.status}`),el('small','',e.provenance)); list.append(li); } box.append(list);
}
function render() {
  sync(); document.querySelectorAll('#typeFilters button').forEach((b,i) => { const type = i ? Object.entries(labels).filter(([t]) => graph.nodes.some(n => n.type === t))[i-1]?.[0] : ''; b.classList.toggle('selected',(params.get('type') || '') === type); b.setAttribute('aria-pressed',String((params.get('type') || '') === type)); });
  document.querySelectorAll('#collections button').forEach((b,i) => { const keys = ['','built-ideas','widgets','variations','repos-no-deploy','vercel-repos','gpts']; b.classList.toggle('selected',(params.get('collection') || '') === keys[i]); });
  $('viewToggle').setAttribute('aria-pressed',String(dense)); $('savedOnly').setAttribute('aria-pressed',String(onlySaved));
  const count = id => graph.edges.filter(e => e.from === id || e.to === id).length;
  let items = filterAssets(graph.nodes,graph.edges,state()); const sort = $('sort').value; items.sort((a,b) => sort === 'links' ? count(b.id)-count(a.id) || a.name.localeCompare(b.name) : sort === 'type' ? a.type.localeCompare(b.type) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
  $('visibleCount').textContent = `${items.length} of ${graph.nodes.length} assets`;
  $('totalCount').textContent = `${graph.nodes.length} assets · ${graph.edges.length} recorded links`;
  const list = $('resultsList'); list.replaceChildren(); list.classList.toggle('dense',dense); list.setAttribute('aria-busy','false');
  if (!items.length) list.append(el('p','state','No assets match these filters. Try another search or clear filters.'));
  for (const n of items.slice(0,pageSize)) { const row = el('button','asset-row'); row.type = 'button'; row.classList.toggle('active',active === n.id); row.append(el('span','asset-type',labels[n.type] || n.type)); const body = el('span','asset-body'); body.append(el('strong','',n.name)); if (n.summary && !dense) body.append(el('small','',n.summary)); row.append(body,el('span','asset-links',count(n.id) ? `${count(n.id)} ${count(n.id) === 1 ? 'link' : 'links'}` : '—')); row.addEventListener('click',() => { active = n.id; render(); if (matchMedia('(max-width: 1050px)').matches) $('detail').scrollIntoView({behavior:'smooth'}); }); list.append(row); }
  if (items.length > pageSize) list.append(button(`Show more (${items.length - pageSize} remaining)`,false,() => { pageSize += 80; render(); }));
  showDetail();
}
try { const response = await fetch('/data/asset-graph.public.json'); if (!response.ok) throw Error(`HTTP ${response.status}`); graph = await response.json(); setupFilters(); render(); }
catch { $('resultsList').replaceChildren(el('p','state','The asset catalog could not be loaded. Refresh the page to try again.')); $('totalCount').textContent = 'Catalog unavailable'; }
