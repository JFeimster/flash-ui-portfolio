/** Optional showcase.catalog contract. Route evidence owns identity and destinations;
 * explicit catalog fields own classification; legacy copy is fallback only. Pure inputs. */
export const catalogFields = ['productCategory','productSubcategory','productType','industries','audiences','capabilities','designThemeIds','layoutStyles','lifecycle','architecture','distributionMethods','repositoryUrl','productionUrl','integrations','variantCount','defaultVariantId','tags','createdAt','updatedAt'];
const arrays = new Set(['industries','audiences','capabilities','designThemeIds','layoutStyles','distributionMethods','integrations','tags']);
const list = value => Array.isArray(value) ? value : value ? [value] : [];
const unique = values => [...new Set(values.filter(Boolean))].sort();
const validRoute = e => e.resolutionStatus === 'resolved' && e.resolvedPath;
export function resolveThemes(values, master = {}) {
  const themes = master.themes || [];
  const ids = [], unresolved = [];
  for (const value of list(values)) {
    const theme = themes.find(t => t.id === value || list(t.aliases).includes(value));
    if (theme) ids.push(theme.id); else unresolved.push(value);
  }
  return { ids: unique(ids), suggestions: unique(unresolved).map(value => ({ value, status: 'unresolved', candidates: themes.filter(t => t.name?.toLowerCase() === String(value).toLowerCase()).map(t => t.id) })) };
}
export function normalizeCatalog({ routes = {}, showcase = {}, previews = {}, themes = {}, registry = [], groups = {}, contracts = {}, external = {} } = {}) {
  const entries = routes.entries || [], definitions = [...new Map([...(groups.groups || []), ...(routes.groups || [])].map(g => [g.groupId,g])).values()];
  const records = [], covered = new Set(), seenPaths = new Set();
  const make = (id, members, group) => {
    const copy = showcase.projects?.[id] || {}, explicit = copy.catalog || {}, preview = previews.projects?.[id] || {};
    const variants = [...new Map(members.filter(e => e.variantNumber && validRoute(e)).map(e => [e.variantNumber,e])).values()].sort((a,b) => a.variantNumber-b.variantNumber).map(e => {
      const contract = contracts.groups?.find(g => g.groupId === id)?.variants?.find(v => v.number === e.variantNumber && v.path === e.resolvedPath);
      const variantId = contract?.id || `${id}--variant-${e.variantNumber}`;
      const meta = explicit.variants?.[variantId] || {};
      const resolved = resolveThemes(meta.designThemeIds || contract?.designThemeIds || e.designThemeIds, themes);
      const capture = Object.values(previews.projects || {}).find(p => p.target === e.resolvedPath && (!p.familyId || p.familyId === id));
      return { ...e, id: variantId, designThemeIds: resolved.ids, themeSuggestions: resolved.suggestions, preview: capture ? {...capture} : e.screenshot ? {image:e.screenshot,target:e.resolvedPath} : null };
    });
    const hub = members.find(e => e.type === 'group-hub') || members.find(e => e.resolvedPath === group?.hubPath);
    const item = hub || variants[0] || members[0] || {};
    const ref = external.projects?.find(p => p.id === id);
    const base = registry.find(e => e.slug === id) || {};
    const catalog = {schemaVersion: 2, ...Object.fromEntries(catalogFields.map(key => [key, arrays.has(key) ? [] : null])), ...structuredClone(explicit)};
    catalog.productCategory ??= group?.category || item.category || base.category || null;
    catalog.audiences = list(catalog.audiences).length ? list(catalog.audiences) : list(copy.audience);
    catalog.repositoryUrl ??= ref?.repository_url || null;
    catalog.productionUrl ??= ref?.production_url || null;
    const resolved = resolveThemes(catalog.designThemeIds, themes);
    catalog.designThemeIds = unique([...resolved.ids,...variants.flatMap(v => v.designThemeIds)]);
    catalog.variantCount = variants.length;
    catalog.defaultVariantId = variants.some(v => v.id === explicit.defaultVariantId) ? explicit.defaultVariantId : null;
    const path = group ? variants.length === 1 ? variants[0].resolvedPath : group.curatedCollection && variants.length ? group.hubPath : validRoute(hub || {}) ? hub.resolvedPath : variants[0]?.resolvedPath || (validRoute(item) ? item.resolvedPath : '') : validRoute(item) ? item.resolvedPath : catalog.productionUrl || '';
    const defaultVariant = variants.find(v => v.id === catalog.defaultVariantId) || variants[0];
    return {id, title:copy.title || group?.displayTitle || String(item.title || id).replace(/^sites\s+/i,'').replace(/\s*index\.html$/i,'').replace(/\.html$/i,'').replace(/[-_]+/g,' ').trim(), description:copy.description || group?.description || item.description || '', category:catalog.productCategory || 'Experiments', audience:copy.audience || '', purpose:copy.purpose || '', industry:copy.industry || '', priority:copy.featuredPriority || group?.featuredPriority || 0, item:structuredClone(item), members:structuredClone(members), variants, count:variants.length, path, previewPath:defaultVariant?.resolvedPath || '', previewTarget:preview.target || defaultVariant?.resolvedPath || path, image:preview.image || '', visualStyle:preview.style || '', tone:preview.tone || 'mint', catalog, themeSuggestions:[...resolved.suggestions,...variants.flatMap(v => v.themeSuggestions)], invalidDefaultVariant: Boolean(explicit.defaultVariantId && !catalog.defaultVariantId)};
  };
  for (const group of definitions) {
    const members = entries.filter(e => e.canonicalGroupId === group.groupId);
    members.forEach(e => covered.add(e));
    const row = make(group.groupId,members,group); records.push(row);
    if (row.path) seenPaths.add(row.path);
  }
  for (const e of entries) {
    if (covered.has(e) || (e.resolvedPath && seenPaths.has(e.resolvedPath))) continue;
    if (e.resolvedPath) seenPaths.add(e.resolvedPath);
    const row = make(e.slug,[e]);
    // Legacy route inventory can contain repeated slugs; retain distinct routes.
    if (records.some(r => r.id === row.id)) row.id += `:${e.originalPath || e.resolvedPath}`;
    records.push(row);
  }
  for (const ref of external.projects || []) {
    if (!ref.production_url || records.some(r => r.id === ref.id || r.path === ref.production_url)) continue;
    records.push(make(ref.id,[{slug:ref.id,title:ref.name,resolutionStatus:'external',type:'external'}]));
  }
  return records;
}
export function matchesCatalog(row, filters = {}) {
  const metadata = row.catalog || {};
  const query = String(filters.q || '').trim().toLowerCase();
  if (query && ![row.title,row.description,row.purpose,row.audience,row.industry,...Object.values(metadata).flat(3),...(row.members || []).flatMap(e => [e.title,e.description])].map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(' ').toLowerCase().includes(query)) return false;
  for (const key of catalogFields) {
    const value = filters[key];
    if (value && value !== 'All' && !list(metadata[key]).some(item => (typeof item === 'object' ? item.id || item.name : item) === value)) return false;
  }
  return true;
}
export function sortCatalog(rows, sort = 'featured', query = '') {
  const date = value => { const n = Date.parse(value || ''); return Number.isFinite(n) ? n : -Infinity; };
  const rank = r => r.title.toLowerCase().includes(query.toLowerCase()) ? 2 : r.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
  return [...rows].sort((a,b) => {
    let n = 0;
    if (sort === 'variants') n = b.count-a.count;
    if (sort === 'featured') n = (a.priority || Infinity)-(b.priority || Infinity);
    if (sort === 'created' || sort === 'updated') n = date(b.catalog[`${sort}At`])-date(a.catalog[`${sort}At`]);
    if (sort === 'relevance') n = rank(b)-rank(a);
    return (Number.isNaN(n) ? 0 : n) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
  });
}
export function themePreview(row, themeId) {
  const variant = row.variants?.find(v => v.designThemeIds.includes(themeId) && v.preview?.image);
  return variant ? {...row,image:variant.preview.image,previewTarget:variant.resolvedPath} : row;
}
