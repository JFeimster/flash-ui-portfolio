/**
 * FLASH-UI // StorageManager.js
 * Centralized persistence layer for The Archive (User Dashboard).
 * Handles prompt versioning, folder hierarchies, and metadata tagging.
 */

class StorageManager {
    constructor() {
        this.DB_KEY = 'flash_archive_data';
        this.FOLDER_KEY = 'flash_folders_config';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.DB_KEY)) {
            localStorage.setItem(this.DB_KEY, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.FOLDER_KEY)) {
            localStorage.setItem(this.FOLDER_KEY, JSON.stringify([
                { id: 'root', name: 'Main Stack', color: '#00f2ff', icon: '◈' },
                { id: 'drafts', name: 'Drafts', color: '#888', icon: '⌇' }
            ]));
        }
    }

    /**
     * PROMPT CORE MANAGEMENT
     */

    savePrompt(promptPayload) {
        const archive = this.getArchive();
        const timestamp = new Date().toISOString();
        
        const newEntry = {
            id: promptPayload.id || `flsh_${Date.now()}`,
            parentId: promptPayload.parentId || null,
            version: promptPayload.version || 1,
            title: promptPayload.title || 'Untitled Operation',
            content: promptPayload.content,
            type: promptPayload.type,
            style: promptPayload.style,
            folderId: promptPayload.folderId || 'root',
            tags: promptPayload.tags || [],
            meta: {
                audience: promptPayload.audience,
                cta: promptPayload.cta,
                components: promptPayload.components || []
            },
            createdAt: timestamp,
            updatedAt: timestamp
        };

        // Handle Versioning: If saving an update to an existing prompt
        if (promptPayload.isNewVersion && promptPayload.parentId) {
            const siblings = archive.filter(p => p.parentId === promptPayload.parentId || p.id === promptPayload.parentId);
            newEntry.version = siblings.length + 1;
            newEntry.id = `flsh_${Date.now()}_v${newEntry.version}`;
        }

        archive.unshift(newEntry);
        localStorage.setItem(this.DB_KEY, JSON.stringify(archive));
        return newEntry;
    }

    getArchive() {
        return JSON.parse(localStorage.getItem(this.DB_KEY)) || [];
    }

    getPromptById(id) {
        return this.getArchive().find(p => p.id === id);
    }

    deletePrompt(id) {
        const filtered = this.getArchive().filter(p => p.id !== id);
        localStorage.setItem(this.DB_KEY, JSON.stringify(filtered));
    }

    /**
     * VERSION CONTROL
     */

    getVersionHistory(originalId) {
        return this.getArchive()
            .filter(p => p.id === originalId || p.parentId === originalId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    /**
     * FOLDER ARCHITECTURE
     */

    getFolders() {
        return JSON.parse(localStorage.getItem(this.FOLDER_KEY)) || [];
    }

    createFolder(name, color = '#7000ff') {
        const folders = this.getFolders();
        const newFolder = {
            id: `fld_${Date.now()}`,
            name: name,
            color: color,
            icon: '⊞'
        };
        folders.push(newFolder);
        localStorage.setItem(this.FOLDER_KEY, JSON.stringify(folders));
        return newFolder;
    }

    movePrompt(promptId, folderId) {
        const archive = this.getArchive();
        const index = archive.findIndex(p => p.id === promptId);
        if (index !== -1) {
            archive[index].folderId = folderId;
            archive[index].updatedAt = new Date().toISOString();
            localStorage.setItem(this.DB_KEY, JSON.stringify(archive));
        }
    }

    /**
     * TAGGING SYSTEM
     */

    updateTags(promptId, tagsArray) {
        const archive = this.getArchive();
        const index = archive.findIndex(p => p.id === promptId);
        if (index !== -1) {
            archive[index].tags = [...new Set(tagsArray)];
            localStorage.setItem(this.DB_KEY, JSON.stringify(archive));
        }
    }

    getUniqueTags() {
        const archive = this.getArchive();
        const tags = new Set();
        archive.forEach(p => p.tags.forEach(t => tags.add(t)));
        return Array.from(tags);
    }

    /**
     * SEARCH & FILTER
     */

    queryArchive(params = {}) {
        let results = this.getArchive();

        if (params.folderId) {
            results = results.filter(p => p.folderId === params.folderId);
        }

        if (params.tag) {
            results = results.filter(p => p.tags.includes(params.tag));
        }

        if (params.search) {
            const term = params.search.toLowerCase();
            results = results.filter(p => 
                p.title.toLowerCase().includes(term) || 
                p.content.toLowerCase().includes(term)
            );
        }

        return results;
    }

    /**
     * DATA INTEGRITY
     */

    exportVault() {
        const data = {
            version: "1.0.4",
            exportDate: new Date().toISOString(),
            payload: {
                prompts: this.getArchive(),
                folders: this.getFolders()
            }
        };
        return JSON.stringify(data, null, 2);
    }

    importVault(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.payload) {
                localStorage.setItem(this.DB_KEY, JSON.stringify(data.payload.prompts));
                localStorage.setItem(this.FOLDER_KEY, JSON.stringify(data.payload.folders));
                return true;
            }
        } catch (e) {
            console.error("StorageManager: Import Failed //", e);
            return false;
        }
    }
}

// Global instance for UI access
window.FlashStorage = new StorageManager();