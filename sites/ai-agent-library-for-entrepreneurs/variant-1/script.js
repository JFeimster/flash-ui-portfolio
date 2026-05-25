(() => {
    const DIRECTORY_DATA_PATHS = [
        "../../../data/my-gpts-directory.json",
        "/data/my-gpts-directory.json"
    ];

    const RECOMMENDED_CATEGORIES = [
        "Funding & Capital",
        "Affiliate & Partner Growth",
        "Site Builders & UI",
        "Content & SEO",
        "Automation & API Ops",
        "FinanceOps & Cash Flow",
        "Business Buying & Valuation",
        "Community & Productization",
        "Creative & Media",
        "Prompt Engineering",
        "Personal Development",
        "Compliance & Disclosures",
        "Uncategorized"
    ];

    const state = {
        allItems: [],
        query: "",
        selectedCategory: "All",
        sortBy: "featured",
        showDrafts: false,
        loadError: false
    };

    const elements = {
        stats: null,
        search: null,
        sort: null,
        showDrafts: null,
        categories: null,
        grid: null,
        directoryState: null
    };

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        elements.stats = document.getElementById("directoryStats");
        elements.search = document.getElementById("searchInput");
        elements.sort = document.getElementById("sortSelect");
        elements.showDrafts = document.getElementById("showDraftsToggle");
        elements.categories = document.getElementById("categoryFilters");
        elements.grid = document.getElementById("agentGrid");
        elements.directoryState = document.getElementById("directoryState");

        if (!elements.stats || !elements.search || !elements.sort || !elements.showDrafts || !elements.categories || !elements.grid || !elements.directoryState) {
            return;
        }

        bindEvents();
        setDirectoryState("Loading GPT directory...");
        loadDirectoryData();
    }

    function bindEvents() {
        elements.search.addEventListener("input", (event) => {
            state.query = normalizeText(event.target.value).toLowerCase();
            render();
        });

        elements.sort.addEventListener("change", (event) => {
            state.sortBy = event.target.value;
            render();
        });

        elements.showDrafts.addEventListener("change", (event) => {
            state.showDrafts = Boolean(event.target.checked);
            render();
        });

        elements.categories.addEventListener("click", (event) => {
            const chip = event.target.closest("[data-category]");
            if (!chip) {
                return;
            }
            state.selectedCategory = chip.getAttribute("data-category") || "All";
            renderCategoryFilters();
            render();
        });
    }

    async function loadDirectoryData() {
        try {
            const rawData = await fetchDirectoryData();
            if (!Array.isArray(rawData)) {
                throw new Error("Directory payload is not an array.");
            }

            state.allItems = rawData.map((item, index) => normalizeItem(item, index));
            state.loadError = false;
            renderCategoryFilters();
            render();
        } catch (error) {
            state.loadError = true;
            state.allItems = [];
            elements.grid.innerHTML = "";
            updateStats(0, 0);
            setDirectoryState("Could not load GPT directory data. Please refresh and try again.", "error");
            console.error("GPT directory load failed:", error);
        }
    }

    async function fetchDirectoryData() {
        let lastError = null;

        for (const path of DIRECTORY_DATA_PATHS) {
            try {
                const response = await fetch(path, { cache: "no-store" });
                if (!response.ok) {
                    lastError = new Error("Failed request: " + path + " (" + response.status + ")");
                    continue;
                }
                return await response.json();
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error("Unable to fetch directory JSON.");
    }

    function normalizeItem(item, index) {
        const name = normalizeText(item && item.name) || "Untitled GPT " + (index + 1);
        const category = normalizeText(item && item.category) || "Uncategorized";
        const tags = toStringArray(item && item.tags);
        const audience = toStringArray(item && item.audience);
        const accessUrl = normalizeUrl(item && item.accessUrl);
        const visibility = normalizeText(item && item.visibility).toLowerCase();
        const status = deriveStatus(normalizeText(item && item.status).toLowerCase(), accessUrl, visibility);

        return {
            indexOrder: index,
            name,
            description: normalizeText(item && item.description) || "No description provided yet.",
            category,
            primaryUseCase: normalizeText(item && item.primaryUseCase) || "General business assistance",
            recommendedDirectorySection: normalizeText(item && item.recommendedDirectorySection) || category,
            tags,
            audience,
            status,
            accessUrl,
            profileImageUrl: normalizeUrl(item && item.profileImageUrl)
        };
    }

    function deriveStatus(rawStatus, accessUrl, visibility) {
        if (!accessUrl || rawStatus === "missing-url") {
            return "missing-url";
        }

        const isDraft = rawStatus === "draft-or-editor-link" || rawStatus === "draft" || visibility.indexOf("private") !== -1;
        return isDraft ? "draft-or-editor-link" : "active";
    }

    function renderCategoryFilters() {
        const categories = buildCategoryList();
        elements.categories.innerHTML = "";

        categories.forEach((category) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "cat-chip" + (category === state.selectedCategory ? " active" : "");
            button.textContent = category;
            button.setAttribute("data-category", category);
            elements.categories.appendChild(button);
        });
    }

    function buildCategoryList() {
        const dataCategories = new Set(state.allItems.map((item) => item.category).filter(Boolean));
        const ordered = ["All"];
        const used = new Set(["All"]);

        RECOMMENDED_CATEGORIES.forEach((category) => {
            if (!used.has(category)) {
                ordered.push(category);
                used.add(category);
            }
        });

        Array.from(dataCategories)
            .sort((a, b) => a.localeCompare(b))
            .forEach((category) => {
                if (!used.has(category)) {
                    ordered.push(category);
                    used.add(category);
                }
            });

        if (!used.has("Uncategorized")) {
            ordered.push("Uncategorized");
        }

        return ordered;
    }

    function render() {
        if (state.loadError) {
            return;
        }

        const items = getVisibleItems();
        renderCards(items);
        updateStats(items.length, state.allItems.length);

        if (!items.length) {
            setDirectoryState("No GPTs matched your current search and filters.");
            return;
        }

        clearDirectoryState();
    }

    function getVisibleItems() {
        const query = state.query;

        let items = state.allItems.filter((item) => {
            if (!state.showDrafts && item.status === "draft-or-editor-link") {
                return false;
            }
            if (state.selectedCategory !== "All" && item.category !== state.selectedCategory) {
                return false;
            }
            if (!query) {
                return true;
            }
            return matchesSearch(item, query);
        });

        items = sortItems(items, state.sortBy);
        return items;
    }

    function matchesSearch(item, query) {
        const haystack = [
            item.name,
            item.description,
            item.category,
            item.primaryUseCase,
            item.recommendedDirectorySection,
            item.tags.join(" "),
            item.audience.join(" ")
        ].join(" ").toLowerCase();

        return haystack.indexOf(query) !== -1;
    }

    function sortItems(items, sortBy) {
        const sorted = items.slice();

        if (sortBy === "az") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            return sorted;
        }

        if (sortBy === "category") {
            sorted.sort((a, b) => {
                const categoryCompare = a.category.localeCompare(b.category);
                return categoryCompare !== 0 ? categoryCompare : a.name.localeCompare(b.name);
            });
            return sorted;
        }

        if (sortBy === "active-first") {
            sorted.sort((a, b) => {
                const statusCompare = getStatusRank(a.status) - getStatusRank(b.status);
                return statusCompare !== 0 ? statusCompare : a.indexOrder - b.indexOrder;
            });
            return sorted;
        }

        sorted.sort((a, b) => a.indexOrder - b.indexOrder);
        return sorted;
    }

    function getStatusRank(status) {
        if (status === "active") {
            return 0;
        }
        if (status === "missing-url") {
            return 1;
        }
        return 2;
    }

    function renderCards(items) {
        elements.grid.innerHTML = "";

        items.forEach((item) => {
            elements.grid.appendChild(buildCard(item));
        });
    }

    function buildCard(item) {
        const card = document.createElement("article");
        card.className = "agent-card" + (item.status === "active" ? "" : " is-dimmed");

        const badge = document.createElement("span");
        badge.className = "status-badge status-" + item.status;
        badge.textContent = formatStatusLabel(item.status);
        card.appendChild(badge);

        card.appendChild(buildAvatar(item));

        const title = document.createElement("h3");
        title.textContent = item.name;
        card.appendChild(title);

        const description = document.createElement("p");
        description.textContent = item.description;
        card.appendChild(description);

        const metaList = document.createElement("div");
        metaList.className = "agent-meta-list";
        metaList.appendChild(buildMetaItem("Category", item.category));
        metaList.appendChild(buildMetaItem("Primary use case", item.primaryUseCase));
        metaList.appendChild(buildMetaItem("Directory section", item.recommendedDirectorySection));
        metaList.appendChild(buildMetaItem("Audience", item.audience.length ? item.audience.join(", ") : "General"));
        card.appendChild(metaList);

        const tagsRow = document.createElement("div");
        tagsRow.className = "tags-row";
        if (item.tags.length) {
            item.tags.slice(0, 6).forEach((tag) => {
                const pill = document.createElement("span");
                pill.className = "tag-pill";
                pill.textContent = "#" + tag;
                tagsRow.appendChild(pill);
            });
        } else {
            const emptyTag = document.createElement("span");
            emptyTag.className = "tag-pill";
            emptyTag.textContent = "#untagged";
            tagsRow.appendChild(emptyTag);
        }
        card.appendChild(tagsRow);

        const footer = document.createElement("div");
        footer.className = "card-footer";

        const categoryTag = document.createElement("span");
        categoryTag.className = "use-case-tag";
        categoryTag.textContent = item.category;
        footer.appendChild(categoryTag);

        footer.appendChild(buildActionElement(item));
        card.appendChild(footer);

        return card;
    }

    function buildAvatar(item) {
        const wrapper = document.createElement("div");
        wrapper.className = "agent-avatar";

        const fallback = document.createElement("div");
        fallback.className = "agent-icon fallback-avatar";
        fallback.textContent = getInitials(item.name);

        if (!item.profileImageUrl) {
            wrapper.appendChild(fallback);
            return wrapper;
        }

        const image = document.createElement("img");
        image.className = "agent-profile-image";
        image.src = item.profileImageUrl;
        image.alt = item.name + " profile image";
        image.loading = "lazy";
        image.referrerPolicy = "no-referrer";

        image.addEventListener("load", () => {
            fallback.style.display = "none";
        });

        image.addEventListener("error", () => {
            image.remove();
            fallback.style.display = "flex";
        });

        wrapper.appendChild(image);
        wrapper.appendChild(fallback);
        return wrapper;
    }

    function buildMetaItem(label, value) {
        const row = document.createElement("p");
        row.className = "meta-item";

        const metaLabel = document.createElement("span");
        metaLabel.className = "meta-label";
        metaLabel.textContent = label + ":";

        row.appendChild(metaLabel);
        row.appendChild(document.createTextNode(value));
        return row;
    }

    function buildActionElement(item) {
        if (item.status === "active" && item.accessUrl) {
            const link = document.createElement("a");
            link.className = "launch-btn";
            link.href = item.accessUrl;
            link.textContent = "Open GPT";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            return link;
        }

        const muted = document.createElement("span");
        muted.className = "launch-btn is-disabled";

        if (item.status === "draft-or-editor-link") {
            muted.textContent = "Editor/private link";
            return muted;
        }

        muted.textContent = "URL missing";
        return muted;
    }

    function formatStatusLabel(status) {
        if (status === "draft-or-editor-link") {
            return "draft-or-editor-link";
        }
        if (status === "missing-url") {
            return "missing-url";
        }
        return "active";
    }

    function updateStats(visibleCount, totalCount) {
        const activeCount = state.allItems.filter((item) => item.status === "active").length;
        const draftCount = state.allItems.filter((item) => item.status === "draft-or-editor-link").length;
        const missingUrlCount = state.allItems.filter((item) => item.status === "missing-url").length;
        const draftNote = !state.showDrafts && draftCount > 0 ? " Draft/editor links are hidden." : "";
        const missingNote = missingUrlCount > 0 ? " " + missingUrlCount + " item(s) have missing URLs." : "";

        elements.stats.textContent = "Showing " + visibleCount + " of " + totalCount + " GPTs. Active: " + activeCount + "." + draftNote + missingNote;
    }

    function setDirectoryState(message, type) {
        elements.directoryState.textContent = message;
        elements.directoryState.className = "directory-state is-visible";
        if (type === "error") {
            elements.directoryState.classList.add("is-error");
        }
    }

    function clearDirectoryState() {
        elements.directoryState.textContent = "";
        elements.directoryState.className = "directory-state";
    }

    function normalizeText(value) {
        return typeof value === "string" ? value.trim() : "";
    }

    function toStringArray(value) {
        if (Array.isArray(value)) {
            return value
                .map((item) => normalizeText(item))
                .filter(Boolean);
        }

        if (typeof value === "string") {
            return value
                .split(",")
                .map((item) => normalizeText(item))
                .filter(Boolean);
        }

        return [];
    }

    function normalizeUrl(value) {
        const text = normalizeText(value);
        if (!text) {
            return "";
        }

        try {
            const url = new URL(text);
            if (url.protocol === "http:" || url.protocol === "https:") {
                return url.toString();
            }
        } catch (error) {
            return "";
        }

        return "";
    }

    function getInitials(name) {
        const words = normalizeText(name).split(/\s+/).filter(Boolean);
        if (!words.length) {
            return "AI";
        }

        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        }

        return (words[0][0] + words[1][0]).toUpperCase();
    }
})();
