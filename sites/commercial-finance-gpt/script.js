const DATA_URLS = {
  siteMap: "data/site-map.json",
  libraries: "data/library-cards.json",
  buildPaths: "data/build-paths.json",
  batches: "data/batch-inventory.json",
  search: "data/search-index.json",
  downloads: "data/download-manifest.json"
};

const FALLBACK = {
  siteMap: {
    summary: { libraries: 8, batches: 89, files: 492, zipPackages: 89 },
    routes: [
      { path: "/", hash: "#home", label: "Home" },
      { path: "/libraries/", hash: "#libraries", label: "Libraries" },
      { path: "/downloads/", hash: "#downloads", label: "Downloads" },
      { path: "/search/", hash: "#search", label: "Search" },
      { path: "/validation/safety/", hash: "#safety", label: "Safety" },
      { path: "/roadmap/", hash: "#roadmap", label: "Roadmap" }
    ]
  },
  libraries: {
    libraries: [
      { slug: "knowledge-library", title: "Knowledge Library", layer: "Knowledge Layer", description: "Upload-ready Custom GPT knowledge files.", batches: 11, files: 71, zips: 11, fileTypes: ["md", "json"], useCase: "Upload Custom GPT Knowledge", cta: "Open Library" },
      { slug: "no-auth-actions", title: "No-Auth GPT Action Library", layer: "Action Layer", description: "Public/stateless action schemas and implementation docs.", batches: 14, files: 89, zips: 14, fileTypes: ["yaml", "json", "csv", "md"], useCase: "Launch public stateless Actions", cta: "Open Library" },
      { slug: "api-key-actions", title: "API-Key GPT Action Library", layer: "Action Layer", description: "Private backend actions and security operations.", batches: 14, files: 83, zips: 14, fileTypes: ["yaml", "json", "csv", "md"], useCase: "Build private operational backends", cta: "Open Library" }
    ]
  },
  buildPaths: { paths: [] },
  batches: { fields: [], rows: [] },
  search: { fields: [], rows: [] },
  downloads: { fields: [], rows: [] }
};

const state = {
  siteMap: null,
  libraries: [],
  buildPaths: [],
  batches: [],
  files: [],
  downloads: [],
  visibleFiles: 48,
  downloadCategory: "all"
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function fieldRowsToObjects(payload) {
  if (!payload || !Array.isArray(payload.rows) || !Array.isArray(payload.fields)) return [];
  return payload.rows.map(row => Object.fromEntries(payload.fields.map((field, index) => [field, row[index]])));
}

async function loadJson(key) {
  try {
    const response = await fetch(DATA_URLS[key], { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${DATA_URLS[key]}`);
    return await response.json();
  } catch (error) {
    console.warn(`Using embedded fallback for ${key}:`, error.message);
    return FALLBACK[key];
  }
}

function slugify(text) {
  return String(text || "")
    .replace(/\.(openapi\.yaml|openapi\.json|schema\.json|schema\.yaml|md|json|yaml|csv|example|zip)$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "asset";
}

function htmlEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}

function downloadPathFor(file) {
  return `downloads/individual-files/${file.librarySlug}/batch-${file.batch}/${file.filename}`;
}

function zipPathFor(file) {
  const batch = state.batches.find(item => item.librarySlug === file.librarySlug && item.batch === file.batch);
  return batch ? batch.zipPath : `downloads/zip-packages/${file.librarySlug}/batch-${file.batch}/`;
}

function augmentData() {
  const libraryBySlug = Object.fromEntries(state.libraries.map(item => [item.slug, item]));
  const batchByKey = Object.fromEntries(state.batches.map(item => [`${item.librarySlug}-${item.batch}`, item]));

  state.batches = state.batches.map(batch => ({
    ...batch,
    fileTypes: Array.isArray(batch.fileTypes) ? batch.fileTypes : String(batch.fileTypes || "").split(",").filter(Boolean)
  }));

  state.files = state.files.map(file => {
    const batch = batchByKey[`${file.librarySlug}-${file.batch}`] || {};
    const library = libraryBySlug[file.librarySlug] || {};
    const id = `${file.librarySlug}-batch-${file.batch}-${slugify(file.filename)}`;
    return {
      ...file,
      id,
      title: file.filename.replace(/_/g, " ").replace(/\.[^.]+$/, ""),
      libraryTitle: library.title || file.librarySlug,
      batchName: batch.name || `Batch ${file.batch}`,
      sourcePath: `${file.librarySlug}/batch-${file.batch}/${file.filename}`,
      downloadPath: downloadPathFor(file),
      zipPath: zipPathFor(file),
      siteRoute: `/libraries/${file.librarySlug}/batch-${file.batch}/files/${slugify(file.filename)}/`,
      tags: [file.extension, file.fileType, file.purpose, file.priority, file.authMode, file.risk].filter(Boolean)
    };
  });

  state.downloads = state.downloads.map(item => {
    const library = libraryBySlug[item.librarySlug] || {};
    return {
      ...item,
      libraryTitle: library.title || item.librarySlug,
      downloadPath: `downloads/zip-packages/${item.librarySlug}/batch-${item.batch}/${item.filename}`
    };
  });
}

function badge(label, className = "") {
  return `<span class="badge ${className}">${htmlEscape(label)}</span>`;
}

function extensionClass(ext) {
  return `type-${String(ext || "").toLowerCase()}`;
}

function riskClass(risk) {
  return risk === "High" ? "risk-high" : risk === "Medium" ? "risk-med" : "";
}

function priorityClass(priority) {
  return priority === "Critical" ? "priority-critical" : priority === "High" ? "priority-high" : "";
}

function renderLibraries() {
  const grid = $("#libraryGrid");
  const term = ($("#librarySearch")?.value || "").toLowerCase();
  const active = $(".chip.active[data-library-chip]")?.dataset.libraryChip || "all";

  const items = state.libraries.filter(lib => {
    const haystack = [lib.title, lib.layer, lib.description, lib.useCase, ...(lib.fileTypes || [])].join(" ").toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    const matchesLayer = active === "all" || lib.layer === active;
    return matchesTerm && matchesLayer;
  });

  grid.innerHTML = items.map(lib => `
    <article class="card reveal">
      <div class="card-meta">
        ${badge(lib.layer, "layer-badge")}
        ${badge(`${lib.batches} batches`)}
      </div>
      <h3>${htmlEscape(lib.title)}</h3>
      <p>${htmlEscape(lib.description)}</p>
      <div class="badge-row">${(lib.fileTypes || []).map(type => badge(type.toUpperCase(), extensionClass(type))).join("")}</div>
      <div class="card-kpi">
        <span>${lib.batches}<small>Batches</small></span>
        <span>${lib.files}<small>Files</small></span>
        <span>${lib.zips}<small>ZIPs</small></span>
      </div>
      <p><strong>Primary use:</strong> ${htmlEscape(lib.useCase)}</p>
      <div class="card-actions">
        <a class="btn btn-primary" href="#batches" data-library-jump="${htmlEscape(lib.slug)}">${htmlEscape(lib.cta || "Open Library")}</a>
        <button class="btn btn-ghost copy-btn" type="button" data-copy="/libraries/${htmlEscape(lib.slug)}/">Copy route</button>
      </div>
    </article>
  `).join("");

  attachCopyButtons();
  attachLibraryJumps();
  revealNow();
}

function renderBuildPaths() {
  const grid = $("#buildPathGrid");
  const paths = state.buildPaths.length ? state.buildPaths : [
    { title: "Fast Custom GPT Setup", riskLevel: "Medium", goal: "Upload Knowledge and Recommended Priority Packs first.", recommendedBatches: ["knowledge-library-batch-10", "recommended-files-batch-09"], startFiles: ["top_20_knowledge_pack_manifest.md"], nextStep: "Run compliance evals before Actions." },
    { title: "No-Auth Action Launch", riskLevel: "High", goal: "Install public/stateless Actions after copy review.", recommendedBatches: ["no-auth-actions-batch-10"], startFiles: ["no_auth_compliance_copy_review.openapi.yaml"], nextStep: "Validate copy review test cases." },
    { title: "API-Key Backend Build", riskLevel: "Critical", goal: "Build private action backends with secure server-side secrets.", recommendedBatches: ["api-key-actions-batch-14"], startFiles: ["api_key_security_guide.md"], nextStep: "Set confirmation rules and audit logs." },
    { title: "Schema + Deployment Hardening", riskLevel: "High", goal: "Validate OpenAPI, JSON Schema, YAML, testing, and deployment assets.", recommendedBatches: ["json-openapi-schemas-batch-11"], startFiles: ["json_schema_validation_report.json"], nextStep: "Run validation reports." }
  ];

  grid.innerHTML = paths.map(path => `
    <article class="path-card reveal">
      <div class="badge-row">
        ${badge(path.riskLevel, riskClass(path.riskLevel === "Critical" ? "High" : path.riskLevel))}
        ${badge("Launch Path", "layer-badge")}
      </div>
      <h3>${htmlEscape(path.title)}</h3>
      <p>${htmlEscape(path.goal)}</p>
      <p><strong>Recommended batches:</strong> ${htmlEscape((path.recommendedBatches || []).join(", "))}</p>
      <p><strong>Start files:</strong> ${htmlEscape((path.startFiles || []).join(", "))}</p>
      <p><strong>Next step:</strong> ${htmlEscape(path.nextStep)}</p>
    </article>
  `).join("");
  revealNow();
}

function populateFilters() {
  const libraryOptions = state.libraries.map(lib => [lib.slug, lib.title]);
  fillSelect("#libraryFilter", libraryOptions);
  fillSelect("#batchFilter", state.batches.map(batch => [`${batch.librarySlug}:${batch.batch}`, `${batch.libraryTitle || batch.librarySlug} · ${batch.batch}`]));
  fillSelect("#typeFilter", unique(state.files.map(file => file.fileType)).map(value => [value, value]));
  fillSelect("#purposeFilter", unique(state.files.map(file => file.purpose)).map(value => [value, value]));
  fillSelect("#priorityFilter", unique(state.files.map(file => file.priority)).map(value => [value, value]));
  fillSelect("#authFilter", unique(state.files.map(file => file.authMode)).map(value => [value, value]));
  fillSelect("#riskFilter", unique(state.files.map(file => file.risk)).map(value => [value, value]));
}

function fillSelect(selector, options) {
  const select = $(selector);
  if (!select) return;
  const first = select.querySelector("option")?.outerHTML || "<option value=''>All</option>";
  select.innerHTML = first + options.map(([value, label]) => `<option value="${htmlEscape(value)}">${htmlEscape(label)}</option>`).join("");
}

function filterFiles() {
  const term = ($("#fileSearch")?.value || "").toLowerCase();
  const library = $("#libraryFilter")?.value || "";
  const batch = $("#batchFilter")?.value || "";
  const type = $("#typeFilter")?.value || "";
  const purpose = $("#purposeFilter")?.value || "";
  const priority = $("#priorityFilter")?.value || "";
  const auth = $("#authFilter")?.value || "";
  const risk = $("#riskFilter")?.value || "";
  const priorityOnly = $("#priorityOnly")?.checked;
  const safetyOnly = $("#safetyOnly")?.checked;

  return state.files.filter(file => {
    const haystack = [file.filename, file.libraryTitle, file.batchName, file.fileType, file.purpose, file.priority, file.authMode, file.risk, file.deploymentRelevance, ...(file.tags || [])].join(" ").toLowerCase();
    const batchValue = `${file.librarySlug}:${file.batch}`;
    return (!term || haystack.includes(term))
      && (!library || file.librarySlug === library)
      && (!batch || batchValue === batch)
      && (!type || file.fileType === type)
      && (!purpose || file.purpose === purpose)
      && (!priority || file.priority === priority)
      && (!auth || file.authMode === auth)
      && (!risk || file.risk === risk)
      && (!priorityOnly || ["Critical", "High"].includes(file.priority))
      && (!safetyOnly || file.risk === "High" || /compliance|privacy|safe|security|review|confirmation|prohibited/i.test(file.filename + file.purpose));
  }).sort((a, b) => {
    const rank = value => value === "Critical" ? 0 : value === "High" ? 1 : 2;
    return rank(a.priority) - rank(b.priority) || a.filename.localeCompare(b.filename);
  });
}

function renderFiles() {
  const files = filterFiles();
  const grid = $("#fileGrid");
  $("#resultCount").textContent = `${files.length.toLocaleString()} files`;
  const visible = files.slice(0, state.visibleFiles);

  if (!visible.length) {
    grid.innerHTML = `<article class="file-card"><h3>No files matched</h3><p>Reset filters or search another layer.</p></article>`;
    return;
  }

  grid.innerHTML = visible.map(file => `
    <article class="file-card reveal">
      <div class="badge-row">
        ${badge(file.fileType, extensionClass(file.extension))}
        ${badge(file.authMode, "auth-badge")}
        ${badge(file.priority, priorityClass(file.priority))}
        ${badge(file.risk, riskClass(file.risk))}
      </div>
      <h3 class="file-name">${htmlEscape(file.filename)}</h3>
      <p>${htmlEscape(file.purpose)}</p>
      <p class="path-text">${htmlEscape(file.sourcePath)}</p>
      <div class="card-actions">
        <button class="btn btn-primary detail-btn" type="button" data-file-id="${htmlEscape(file.id)}">View Files</button>
        <button class="btn btn-ghost copy-btn" type="button" data-copy="${htmlEscape(file.siteRoute)}">Copy route</button>
      </div>
    </article>
  `).join("") + (files.length > state.visibleFiles ? `
    <article class="file-card">
      <h3>${files.length - state.visibleFiles} more matches</h3>
      <p>Load the next set without changing filters.</p>
      <button class="btn btn-secondary" type="button" id="loadMoreFiles">Load more files</button>
    </article>
  ` : "");

  attachFileDetails();
  attachCopyButtons();
  $("#loadMoreFiles")?.addEventListener("click", () => {
    state.visibleFiles += 48;
    renderFiles();
  });
  revealNow();
}

function renderBatches() {
  const grid = $("#batchGrid");
  const term = ($("#batchSearch")?.value || "").toLowerCase();
  const filtered = state.batches.filter(batch => {
    const haystack = [batch.libraryTitle, batch.name, batch.implementationCategory, batch.authMode, batch.safetyRelevance, batch.zip].join(" ").toLowerCase();
    return !term || haystack.includes(term);
  });

  grid.innerHTML = filtered.map(batch => `
    <article class="batch-card reveal">
      <div class="badge-row">
        ${badge(`Batch ${batch.batch}`)}
        ${badge(batch.implementationCategory, "layer-badge")}
        ${badge(batch.safetyRelevance, riskClass(batch.safetyRelevance))}
      </div>
      <h3>${htmlEscape(batch.name)}</h3>
      <p>${htmlEscape(batch.libraryTitle)}</p>
      <div class="card-kpi">
        <span>${batch.fileCount}<small>Files</small></span>
        <span>${(batch.fileTypes || []).join(", ").toUpperCase()}<small>Types</small></span>
        <span>${batch.updateCadence}<small>Review</small></span>
      </div>
      <p class="path-text">${htmlEscape(batch.zip)}</p>
      <div class="card-actions">
        <a class="btn btn-primary" href="#search" data-batch-jump="${htmlEscape(`${batch.librarySlug}:${batch.batch}`)}">View Files</a>
        <button class="btn btn-ghost copy-btn" type="button" data-copy="${htmlEscape(batch.route)}">Copy route</button>
      </div>
    </article>
  `).join("");

  attachCopyButtons();
  attachBatchJumps();
  revealNow();
}

function renderDownloads() {
  const tbody = $("#zipTableBody");
  const category = state.downloadCategory;
  const rows = state.downloads.filter(item => {
    const text = [item.title, item.filename, item.category, item.priority].join(" ").toLowerCase();
    if (category === "priority") return item.recommendedFirst === true || item.recommendedFirst === "true";
    if (category === "master") return /master|complete/.test(text);
    if (category === "schema") return /schema|openapi|yaml|json/.test(text);
    if (category === "safety") return /safety|compliance|risk|security/.test(text);
    return true;
  });

  tbody.innerHTML = rows.map(item => `
    <tr>
      <td><strong>${htmlEscape(item.title)}</strong><br><span class="path-text">${htmlEscape(item.filename)}</span></td>
      <td>${htmlEscape(item.libraryTitle)}</td>
      <td>${htmlEscape(item.batch)}</td>
      <td>${badge(item.priority, priorityClass(item.priority))}</td>
      <td>${badge(item.authMode, "auth-badge")}</td>
      <td>
        <a class="btn btn-primary" href="${htmlEscape(item.downloadPath)}" download>Download ZIP</a>
        <button class="btn btn-ghost copy-btn" type="button" data-copy="${htmlEscape(item.downloadPath)}">Copy path</button>
      </td>
    </tr>
  `).join("");
  attachCopyButtons();
}

function renderSafetyList() {
  const list = $("#safetyList");
  const safetyFiles = state.files.filter(file => file.risk === "High" || /compliance|privacy|safe|security|prohibited|confirmation|review/i.test(file.filename)).slice(0, 14);
  list.innerHTML = safetyFiles.map(file => `
    <div class="safety-item">
      <div>
        <strong>${htmlEscape(file.filename)}</strong>
        <p>${htmlEscape(file.libraryTitle)} · Batch ${htmlEscape(file.batch)} · ${htmlEscape(file.purpose)}</p>
      </div>
      <button class="btn btn-ghost detail-btn" type="button" data-file-id="${htmlEscape(file.id)}">Inspect</button>
    </div>
  `).join("");
  attachFileDetails();
}

function renderRoutes() {
  const grid = $("#routeGrid");
  const routes = state.siteMap.routes || [];
  grid.innerHTML = routes.map(route => `
    <article class="route-pill">
      <code>${htmlEscape(route.path)}</code>
      <button class="btn btn-ghost copy-btn" type="button" data-copy="${htmlEscape(route.path)}">Copy route</button>
    </article>
  `).join("");
  attachCopyButtons();
}

function openFileModal(file) {
  const modal = $("#fileModal");
  $("#modalTitle").textContent = file.filename;
  $("#modalBody").innerHTML = `
    <div class="detail-grid">
      <div><small>Library</small><span>${htmlEscape(file.libraryTitle)}</span></div>
      <div><small>Batch</small><span>${htmlEscape(file.batch)} · ${htmlEscape(file.batchName)}</span></div>
      <div><small>File type</small><span>${htmlEscape(file.fileType)}</span></div>
      <div><small>Purpose</small><span>${htmlEscape(file.purpose)}</span></div>
      <div><small>Recommended use</small><span>${htmlEscape(file.purpose)}</span></div>
      <div><small>Auth mode</small><span>${htmlEscape(file.authMode)}</span></div>
      <div><small>Risk / safety relevance</small><span>${htmlEscape(file.risk)}</span></div>
      <div><small>Deployment relevance</small><span>${htmlEscape(file.deploymentRelevance)}</span></div>
      <div><small>Source path</small><span>${htmlEscape(file.sourcePath)}</span></div>
      <div><small>Download link</small><span>${htmlEscape(file.downloadPath)}</span></div>
      <div><small>ZIP package link</small><span>${htmlEscape(file.zipPath)}</span></div>
      <div><small>Site route</small><span>${htmlEscape(file.siteRoute)}</span></div>
    </div>
    <p><strong>Safety notes:</strong> ${file.risk === "High" ? "Review before deployment; confirm no guaranteed outcomes, legal advice, or personalized financial advice." : "Operational draft asset; validate before production use."}</p>
    <div class="card-actions">
      <a class="btn btn-primary" href="${htmlEscape(file.downloadPath)}" download>Download file</a>
      <a class="btn btn-secondary" href="${htmlEscape(file.zipPath)}" download>Download ZIP package</a>
      <button class="btn btn-ghost copy-btn" type="button" data-copy="${htmlEscape(file.siteRoute)}">Copy file route</button>
    </div>
  `;
  attachCopyButtons();
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function attachFileDetails() {
  $$(".detail-btn").forEach(button => {
    button.addEventListener("click", () => {
      const file = state.files.find(item => item.id === button.dataset.fileId);
      if (file) openFileModal(file);
    }, { once: true });
  });
}

function attachCopyButtons() {
  $$(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(value);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy manually";
      }
      setTimeout(() => { button.textContent = button.dataset.copy?.includes("downloads") ? "Copy path" : "Copy route"; }, 1200);
    }, { once: true });
  });
}

function attachLibraryJumps() {
  $$("[data-library-jump]").forEach(link => {
    link.addEventListener("click", () => {
      const library = link.dataset.libraryJump;
      setTimeout(() => {
        $("#libraryFilter").value = library;
        state.visibleFiles = 48;
        renderFiles();
      }, 120);
    }, { once: true });
  });
}

function attachBatchJumps() {
  $$("[data-batch-jump]").forEach(link => {
    link.addEventListener("click", () => {
      const batch = link.dataset.batchJump;
      setTimeout(() => {
        $("#batchFilter").value = batch;
        state.visibleFiles = 48;
        renderFiles();
      }, 120);
    }, { once: true });
  });
}

function setupFilters() {
  ["fileSearch", "libraryFilter", "batchFilter", "typeFilter", "purposeFilter", "priorityFilter", "authFilter", "riskFilter", "priorityOnly", "safetyOnly"].forEach(id => {
    $(`#${id}`)?.addEventListener("input", () => {
      state.visibleFiles = 48;
      renderFiles();
    });
  });
  $("#resetFilters")?.addEventListener("click", () => {
    ["fileSearch", "libraryFilter", "batchFilter", "typeFilter", "purposeFilter", "priorityFilter", "authFilter", "riskFilter"].forEach(id => {
      const el = $(`#${id}`);
      if (el) el.value = "";
    });
    $("#priorityOnly").checked = false;
    $("#safetyOnly").checked = false;
    state.visibleFiles = 48;
    renderFiles();
  });
  $("#librarySearch")?.addEventListener("input", renderLibraries);
  $$("[data-library-chip]").forEach(chip => {
    chip.addEventListener("click", () => {
      $$("[data-library-chip]").forEach(item => item.classList.remove("active"));
      chip.classList.add("active");
      renderLibraries();
    });
  });
  $("#batchSearch")?.addEventListener("input", renderBatches);
  $("#showAllBatches")?.addEventListener("click", () => {
    $("#batchSearch").value = "";
    renderBatches();
  });
  $$("[data-download-category]").forEach(chip => {
    chip.addEventListener("click", () => {
      $$("[data-download-category]").forEach(item => item.classList.remove("active"));
      chip.classList.add("active");
      state.downloadCategory = chip.dataset.downloadCategory;
      renderDownloads();
    });
  });
}

function setupNav() {
  const toggle = $("#menuToggle");
  const mobileNav = $("#mobileNav");
  toggle?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#mobileNav a").forEach(link => link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  }));

  const navLinks = [...$$(".desktop-nav a"), ...$$(".side-nav a")];
  const sections = navLinks.map(link => $(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach(section => observer.observe(section));
}

function animateCounters() {
  $$("[data-count]").forEach(el => {
    const target = Number(el.dataset.count || "0");
    let current = 0;
    const steps = 36;
    const inc = target / steps;
    const tick = () => {
      current += inc;
      if (current >= target) {
        el.textContent = target === 492 ? "492+" : target.toLocaleString();
        return;
      }
      el.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }
  window.revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.08 });
}

function revealNow() {
  $$(".reveal").forEach(el => {
    if (window.revealObserver) window.revealObserver.observe(el);
    else el.classList.add("visible");
  });
}

async function init() {
  const [siteMap, libraries, buildPaths, batches, search, downloads] = await Promise.all([
    loadJson("siteMap"),
    loadJson("libraries"),
    loadJson("buildPaths"),
    loadJson("batches"),
    loadJson("search"),
    loadJson("downloads")
  ]);

  state.siteMap = siteMap;
  state.libraries = libraries.libraries || [];
  state.buildPaths = buildPaths.paths || [];
  state.batches = fieldRowsToObjects(batches);
  state.files = fieldRowsToObjects(search);
  state.downloads = fieldRowsToObjects(downloads);
  augmentData();

  setupReveal();
  renderLibraries();
  renderBuildPaths();
  populateFilters();
  renderFiles();
  renderBatches();
  renderDownloads();
  renderSafetyList();
  renderRoutes();
  setupFilters();
  setupNav();
  animateCounters();

  $("#closeModal")?.addEventListener("click", () => $("#fileModal").close());
}

document.addEventListener("DOMContentLoaded", init);
