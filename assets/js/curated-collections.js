/**
 * Display-only grouping of preserved root HTML previews.
 * Does not rewrite canonical registry, variant migration maps, or original source routes.
 */
export function applyCuratedCollections(source, manifest) {
  if (!manifest || !Array.isArray(manifest.groups)) return source;
  const entries = (source.entries || []).map(item => ({ ...item }));
  const groups = [...(source.groups || [])];
  const normalize = value => String(value || "").replace(/^\/+/, "");
  const indexed = new Map(entries.map((entry, index) => [normalize(entry.sourcePath || entry.originalPath), index]));
  for (const collection of manifest.groups) {
    if (!collection.groupId || groups.some(group => group.groupId === collection.groupId)) continue;
    const picked = [];
    for (const item of collection.variants || []) {
      const key = normalize(item.sourcePath);
      const index = indexed.get(key);
      if (index == null) continue;
      const original = entries[index];
      if (original.canonicalGroupId && original.canonicalGroupId !== collection.groupId) continue;
      if (original.resolutionStatus !== "resolved" || !original.resolvedPath) continue;
      entries[index] = {
        ...original,
        canonicalGroupId: collection.groupId,
        variantNumber: item.number,
        title: item.title || original.title,
        description: item.description || original.description || "",
        curatedCollectionVariant: true
      };
      picked.push(item.number);
    }
    if (!picked.length) continue;
    groups.push({
      groupId: collection.groupId,
      displayTitle: collection.displayTitle,
      category: collection.category || "Experiments",
      description: collection.description || "",
      featuredPriority: collection.featuredPriority || 0,
      hubPath: collection.hubPath,
      curatedCollection: true,
      variantNumbers: picked,
      variantCount: picked.length
    });
  }
  return { ...source, groups, entries };
}
