export function filterAssets(nodes, edges, filters) {
  const linked = new Set(edges.flatMap(e => [e.from, e.to]));
  const q = (filters.q || '').trim().toLowerCase();
  return nodes.filter(n => {
    if (filters.type && n.type !== filters.type) return false;
    if (filters.ecosystem && n.ecosystem !== filters.ecosystem) return false;
    if (filters.category && n.category !== filters.category) return false;
    if (filters.maturity && n.maturity !== filters.maturity) return false;
    if (filters.linkage === 'linked' && !linked.has(n.id)) return false;
    if (filters.linkage === 'unlinked' && linked.has(n.id)) return false;
    if (filters.saved && !filters.saved.has(n.id)) return false;
    if (filters.collection === 'built-ideas' && !(n.type === 'idea' && linked.has(n.id))) return false;
    if (filters.collection === 'widgets' && !(n.type === 'site' && /widget|calculator|generator/i.test(n.category + ' ' + n.name))) return false;
    if (filters.collection === 'variations' && !(n.type === 'site' && n.variants > 1)) return false;
    if (filters.collection === 'repos-no-deploy' && !(n.type === 'github' && !edges.some(e => e.from === n.id && e.type === 'deployed_as'))) return false;
    if (filters.collection === 'vercel-repos' && !(n.type === 'vercel' && edges.some(e => e.to === n.id && e.type === 'deployed_as'))) return false;
    if (filters.collection === 'gpts' && n.type !== 'gpt') return false;
    return !q || [n.name,n.summary,n.category,n.ecosystem,n.audience,n.maturity,n.type].filter(Boolean).join(' ').toLowerCase().includes(q);
  });
}
