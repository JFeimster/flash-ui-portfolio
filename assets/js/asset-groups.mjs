// Identity-grade relationships establish a product. Similar names alone never do.
const tidy = value => String(value || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function identityKey(node) {
  const title = tidy(node?.name).replace(/(?:^| )gpt(?:$| )/g, ' ').replace(/ +/g, ' ').trim();
  if (title.length < 7 || /^(?:project|template|site|tool|app|dashboard|generator|calculator|homepage|landing page)$/.test(title)) return '';
  return title;
}
export function isIdentityEdge(edge, byId) {
  if (!['verified', 'recorded'].includes(edge?.status)) return false;
  const from = byId.get(edge.from), to = byId.get(edge.to);
  if (!from || !to || from.id === to.id) return false;
  const types = new Set([from.type, to.type]);
  const explicit = String(edge.provenance || '').startsWith('asset-links:');
  if (edge.type === 'implements') {
    return types.has('idea') && types.has('site') &&
      (from.id.split(':')[1] === to.id.split(':')[1] || (explicit && edge.status === 'verified'));
  }
  if (edge.type === 'deployed_as') {
    return types.has('github') && types.has('vercel') &&
      (edge.provenance === 'vercel-projects.github_repo' || explicit);
  }
  if (edge.type === 'source_repository') {
    return types.has('github') && [...types].some(t => ['site', 'idea', 'tool', 'gpt'].includes(t)) && explicit;
  }
  // "powered_by" is a dependency, not automatically the same product.
  return false;
}
export function groupAssets(nodes, edges) {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const parents = new Map(nodes.map(n => [n.id, n.id]));
  const find = id => { let p = parents.get(id); if (!p) return null; if (p !== id) { p = find(p); parents.set(id, p); } return p; };
  const members = new Map(nodes.map(n => [n.id, new Set([n.type])]));
  const joins = [];
  // Sort edges so the same graph produces the same groups on every run.
  const candidates = edges.filter(e => isIdentityEdge(e, byId))
    .sort((a, b) => (a.from + '|' + a.to + '|' + a.type).localeCompare(b.from + '|' + b.to + '|' + b.type));
  for (const edge of candidates) {
    const a = find(edge.from), b = find(edge.to);
    if (!a || !b || a === b) continue;
    // Competing same-type sources are not interchangeable just because they point to one destination.
    const aTypes = members.get(a), bTypes = members.get(b);
    if ([...aTypes].some(type => bTypes.has(type))) continue;
    parents.set(b, a);
    members.set(a, new Set([...aTypes, ...bTypes]));
    members.delete(b);
    joins.push(edge);
  }
  const buckets = new Map();
  for (const n of nodes) { const id = find(n.id); const items = buckets.get(id) || []; items.push(n); buckets.set(id, items); }
  const weight = { site: 0, gpt: 1, idea: 2, github: 3, vercel: 4, template: 5, tool: 6, capability: 7 };
  return [...buckets.values()].map(items => {
    items.sort((a, b) => (weight[a.type] ?? 9) - (weight[b.type] ?? 9) || a.name.localeCompare(b.name));
    const first = items[0], ids = new Set(items.map(n => n.id));
    return { id: first.id, name: first.name, primary: first, members: items, ids,
      types: [...new Set(items.map(n => n.type))],
      summary: items.map(n => n.summary).find(Boolean) || '',
      matchCount: joins.filter(e => ids.has(e.from) && ids.has(e.to)).length };
  }).sort((a, b) => a.name.localeCompare(b.name));
}
// Unverified candidates are navigable, but never merged into a product.
export function possibleMatches(group, groups, suggested = []) {
  if (!group) return [];
  const matches = new Map();
  for (const other of groups) {
    if (other.id === group.id) continue;
    const sameName = group.members.some(a => {
      const key = identityKey(a);
      return key && other.members.some(b => a.type !== b.type && identityKey(b) === key);
    });
    if (sameName) matches.set(other.id, { group: other, status: 'suggested', provenance: 'Matching public display names; identity unconfirmed' });
  }
  for (const link of suggested) {
    if (link?.status !== 'suggested' || !link.from || !link.to) continue;
    const ownedFrom = group.ids.has(link.from), ownedTo = group.ids.has(link.to);
    if (ownedFrom === ownedTo) continue;
    const otherId = ownedFrom ? link.to : link.from;
    const other = groups.find(g => g.ids.has(otherId));
    if (other && other.id !== group.id) matches.set(other.id, {
      group: other, status: 'suggested',
      provenance: String(link.provenance || 'Proposed relationship; not confirmed')
    });
  }
  return [...matches.values()].sort((a, b) => a.group.name.localeCompare(b.group.name)).slice(0, 12);
}
