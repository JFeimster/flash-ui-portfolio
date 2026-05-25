(function () {
  const MAX_WAIT_ATTEMPTS = 30;
  const WAIT_MS = 120;

  function slugify(value = "") {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeWhitespace(value = "") {
    return String(value).replace(/\s+/g, " ").trim();
  }

  function canonicalTitle(value = "") {
    return normalizeWhitespace(
      String(value)
        .replace(/^sites\s+/i, "")
        .replace(/^sites\//i, "")
        .replace(/\/index\.html$/i, "")
        .replace(/ index\.html$/i, "")
        .replace(/\.html$/i, "")
        .replace(/_/g, " ")
    );
  }

  function canonicalKey(value = "") {
    return slugify(canonicalTitle(value));
  }

  function isLegacyItem(item) {
    return item.status === "legacy-root" ||
      item.status === "legacy-root-folder" ||
      item.source === "existing-root-file" ||
      item.source === "existing-root-folder";
  }

  function isSitesItem(item) {
    return String(item.path || "").startsWith("sites/");
  }

  function buildGroupIndexes(groups) {
    const groupsById = new Map();
    const groupByKey = new Map();

    groups.forEach(group => {
      const normalized = {
        ...group,
        groupId: group.groupId || slugify(group.displayTitle || "group"),
        variantCount: group.variantCount || (Array.isArray(group.items) ? group.items.length : 0),
        items: Array.isArray(group.items) ? group.items : []
      };

      groupsById.set(normalized.groupId, normalized);
      [normalized.groupId, normalized.displayTitle, normalized.recommendedPrimary, ...normalized.items]
        .filter(Boolean)
        .forEach(value => {
          groupByKey.set(canonicalKey(value), normalized);
          groupByKey.set(slugify(value), normalized);
        });
    });

    return { groupsById, groupByKey };
  }

  function getItemKeys(item) {
    return [
      item.slug,
      item.title,
      item.path,
      item.displayMeta?.displayTitle,
      String(item.path || "").replace(/^sites\//, "")
    ].filter(Boolean);
  }

  function findGroup(item, indexes) {
    for (const value of getItemKeys(item)) {
      const group = indexes.groupsById.get(slugify(value)) || indexes.groupByKey.get(canonicalKey(value));
      if (group) return group;
    }
    return null;
  }

  function findHubPaths(items, groupsById) {
    const hubPaths = new Map();
    items.forEach(item => {
      const pathSlug = slugify(String(item.path || "").replace(/^sites\//, "").replace(/\/index\.html$/i, ""));
      if (groupsById.has(pathSlug) && item.livePath) hubPaths.set(pathSlug, item.livePath);
    });
    return hubPaths;
  }

  function suppressDuplicateRootCards(items) {
    const sitesKeys = new Set(
      items
        .filter(item => !isLegacyItem(item) && isSitesItem(item))
        .map(item => canonicalKey(item.displayMeta?.displayTitle || item.title || item.path))
        .filter(Boolean)
    );

    return items.filter(item => {
      if (!isLegacyItem(item)) return true;
      return !sitesKeys.has(canonicalKey(item.displayMeta?.displayTitle || item.title || item.path));
    });
  }

  function annotateItems(items, indexes, hubPaths) {
    return items.map(item => {
      const group = findGroup(item, indexes);
      if (!group) return item;

      const pathSlug = slugify(String(item.path || "").replace(/^sites\//, "").replace(/\/index\.html$/i, ""));
      const isHub = group.groupId === pathSlug;
      const currentDescription = item.description || item.displayMeta?.description || "";
      const groupNote = isHub
        ? `Variant hub for ${group.variantCount} ${group.displayTitle} variants.`
        : `Grouped under ${group.displayTitle}. Recommended primary: ${group.recommendedPrimary || "manual review"}.`;

      return {
        ...item,
        title: isHub ? group.displayTitle : item.title,
        category: item.category || group.category,
        groupId: group.groupId,
        groupTitle: group.displayTitle,
        groupType: group.groupType,
        variantCount: group.variantCount,
        recommendedPrimary: group.recommendedPrimary || "",
        variantHubPath: hubPaths.get(group.groupId) || "",
        isVariantHub: isHub,
        description: isHub
          ? `Canonical variant hub for ${group.displayTitle}. Compare all ${group.variantCount} variants without cluttering the main directory.`
          : currentDescription || groupNote,
        notes: [item.notes, groupNote].filter(Boolean).join(" ")
      };
    });
  }

  function patchCardHelpers(hubPaths) {
    if (window.__flashGroupingEnhancementsPatched) return;
    window.__flashGroupingEnhancementsPatched = true;

    if (typeof getViewerBadges === "function") {
      const originalGetViewerBadges = getViewerBadges;
      getViewerBadges = function patchedGetViewerBadges(item, displayTitle, nested, archive) {
        const badges = originalGetViewerBadges(item, displayTitle, nested, archive) || [];
        const add = (id, text) => {
          if (!badges.some(badge => badge.id === id)) badges.push({ id, label: text, text });
        };
        if (item.isVariantHub) add("variant-hub", "Variant Hub");
        if (item.groupId && !item.isVariantHub) add("variant-set", "Variant Set");
        if (item.recommendedPrimary && canonicalKey(displayTitle) === canonicalKey(item.recommendedPrimary)) add("recommended-primary", "Recommended Primary");
        return badges;
      };
    }

    if (typeof getAssetTypeLabel === "function") {
      const originalGetAssetTypeLabel = getAssetTypeLabel;
      getAssetTypeLabel = function patchedGetAssetTypeLabel(item) {
        if (item.isVariantHub) return "Variant Hub";
        if (item.groupId) return "Variant";
        return originalGetAssetTypeLabel(item);
      };
    }

    if (typeof getRecommendedUse === "function") {
      const originalGetRecommendedUse = getRecommendedUse;
      getRecommendedUse = function patchedGetRecommendedUse(item, displayTitle) {
        if (item.isVariantHub) return "Variant comparison";
        if (item.groupTitle) return `${item.groupTitle} variant`;
        return originalGetRecommendedUse(item, displayTitle);
      };
    }

    if (typeof getCardActions === "function") {
      const originalGetCardActions = getCardActions;
      getCardActions = function patchedGetCardActions(item, detailsId, deployable, nested, archive) {
        const base = originalGetCardActions(item, detailsId, deployable, nested, archive) || "";
        const hubPath = item.variantHubPath || (item.groupId ? hubPaths.get(item.groupId) : "");
        if (!hubPath || item.isVariantHub) return base;
        return `${base}<a class="btn subtle" href="${hubPath}" target="_blank" rel="noreferrer">Open Variant Hub</a>`;
      };
    }
  }

  async function enhance() {
    try {
      const response = await fetch("/data/asset-groups.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`asset-groups.json failed: ${response.status}`);
      const groupData = await response.json();
      const groups = Array.isArray(groupData.groups) ? groupData.groups : [];
      if (!groups.length) return;

      const indexes = buildGroupIndexes(groups);
      const hubPaths = findHubPaths(state.items || [], indexes.groupsById);
      patchCardHelpers(hubPaths);

      const deduped = suppressDuplicateRootCards(state.items || []);
      state.items = annotateItems(deduped, indexes, hubPaths).map(item => ({
        ...item,
        displayMeta: typeof getDisplayMeta === "function" ? getDisplayMeta(item) : item.displayMeta
      }));

      if (typeof renderShell === "function") renderShell();
      console.info(`Flash UI grouping enhancements loaded: ${groups.length} groups, ${hubPaths.size} active hubs.`);
    } catch (error) {
      console.warn("Flash UI grouping enhancements skipped.", error);
    }
  }

  function waitForRegistry(attempt = 0) {
    if (window.state?.items?.length || (typeof state !== "undefined" && state.items?.length)) {
      enhance();
      return;
    }
    if (attempt >= MAX_WAIT_ATTEMPTS) {
      console.warn("Flash UI grouping enhancements timed out waiting for registry items.");
      return;
    }
    window.setTimeout(() => waitForRegistry(attempt + 1), WAIT_MS);
  }

  waitForRegistry();
})();
