/**
 * FLASH-UI // The Archive: FolderList Component
 * Manages localStorage-backed folders, prompt versioning, and tagging.
 */

class FolderList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.storageKey = 'flash_archive_v2';
        this.state = this.loadState();
        this.activeFolderId = this.state.folders.length > 0 ? this.state.folders[0].id : null;
        
        this.injectStyles();
        this.render();
    }

    loadState() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            folders: [
                { id: 'default', name: 'Main Archive', prompts: [] }
            ]
        };
    }

    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        this.render();
    }

    injectStyles() {
        if (document.getElementById('folder-list-styles')) return;
        const style = document.createElement('style');
        style.id = 'folder-list-styles';
        style.textContent = `
            .archive-layout {
                display: grid;
                grid-template-columns: 240px 1fr;
                gap: 20px;
                margin-top: 20px;
                min-height: 400px;
            }

            .folder-sidebar {
                border-right: 1px solid var(--border);
                padding-right: 20px;
            }

            .folder-item {
                padding: 10px 14px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 0.2s ease;
                margin-bottom: 4px;
                border: 1px solid transparent;
            }

            .folder-item:hover {
                background: var(--glass);
            }

            .folder-item.active {
                background: var(--accent-glow);
                border-color: var(--accent);
                color: var(--accent);
            }

            .prompt-stack {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 15px;
            }

            .archive-card {
                background: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .archive-card:hover {
                border-color: #444;
            }

            .tag-cloud {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .tag-pill {
                font-family: var(--font-mono);
                font-size: 0.65rem;
                padding: 2px 8px;
                border: 1px solid var(--border);
                border-radius: 4px;
                color: var(--text-dim);
            }

            .version-badge {
                font-size: 0.6rem;
                background: #222;
                padding: 1px 5px;
                border-radius: 3px;
                color: var(--accent);
            }

            .archive-actions {
                display: flex;
                gap: 8px;
                margin-top: auto;
            }

            .btn-mini {
                padding: 6px;
                font-size: 0.7rem;
                flex: 1;
            }

            .add-folder-btn {
                width: 100%;
                margin-bottom: 15px;
                background: var(--glass);
                border: 1px dashed var(--border);
                color: var(--text-dim);
                padding: 8px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.75rem;
            }

            .add-folder-btn:hover {
                border-color: var(--accent);
                color: var(--accent);
            }

            @media (max-width: 768px) {
                .archive-layout { grid-template-columns: 1fr; }
                .folder-sidebar { border-right: none; border-bottom: 1px solid var(--border); padding-bottom: 20px; }
            }
        `;
        document.head.appendChild(style);
    }

    addFolder() {
        const name = prompt("Enter folder name:");
        if (!name) return;
        const id = 'f_' + Date.now();
        this.state.folders.push({ id, name, prompts: [] });
        this.activeFolderId = id;
        this.saveState();
    }

    savePromptToArchive(promptData, tags = []) {
        const folder = this.state.folders.find(f => f.id === this.activeFolderId);
        if (!folder) return;

        const existingPromptIndex = folder.prompts.findIndex(p => p.title === promptData.title);

        if (existingPromptIndex > -1) {
            // Versioning
            const p = folder.prompts[existingPromptIndex];
            p.versions.push({
                content: p.content,
                timestamp: p.timestamp
            });
            p.content = promptData.content;
            p.timestamp = new Date().toISOString();
            p.tags = [...new Set([...p.tags, ...tags])];
        } else {
            folder.prompts.unshift({
                id: 'p_' + Date.now(),
                title: promptData.title,
                content: promptData.content,
                timestamp: new Date().toISOString(),
                versions: [],
                tags: tags
            });
        }
        this.saveState();
    }

    deletePrompt(id) {
        const folder = this.state.folders.find(f => f.id === this.activeFolderId);
        folder.prompts = folder.prompts.filter(p => p.id !== id);
        this.saveState();
    }

    render() {
        if (!this.container) return;

        const activeFolder = this.state.folders.find(f => f.id === this.activeFolderId) || this.state.folders[0];

        this.container.innerHTML = `
            <div class="archive-layout">
                <aside class="folder-sidebar">
                    <button class="add-folder-btn" onclick="archiveManager.addFolder()">+ NEW FOLDER</button>
                    <div id="folderList">
                        ${this.state.folders.map(f => `
                            <div class="folder-item ${f.id === this.activeFolderId ? 'active' : ''}" 
                                 onclick="archiveManager.setActiveFolder('${f.id}')">
                                <span>📁 ${f.name}</span>
                                <span style="font-size: 0.7rem; opacity: 0.5;">${f.prompts.length}</span>
                            </div>
                        `).join('')}
                    </div>
                </aside>
                <main class="prompt-view">
                    <div class="prompt-stack">
                        ${activeFolder.prompts.length === 0 ? 
                            `<div style="color: var(--text-dim); grid-column: 1/-1; text-align: center; padding: 40px; border: 1px dashed var(--border); border-radius: 12px;">
                                Folder is empty. Generate a prompt to fill the void.
                            </div>` : 
                            activeFolder.prompts.map(p => `
                            <div class="archive-card">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                    <div style="font-weight: 700; font-size: 0.9rem;">${p.title}</div>
                                    ${p.versions.length > 0 ? `<span class="version-badge">v${p.versions.length + 1}</span>` : ''}
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); height: 40px; overflow: hidden;">
                                    ${p.content.substring(0, 80)}...
                                </div>
                                <div class="tag-cloud">
                                    ${p.tags.map(t => `<span class="tag-pill">#${t}</span>`).join('')}
                                </div>
                                <div class="archive-actions">
                                    <button class="btn-outline btn-mini" onclick="archiveManager.loadIntoEditor('${p.id}')">LOAD</button>
                                    <button class="btn-outline btn-mini" style="color: #ff4d4d;" onclick="archiveManager.deletePrompt('${p.id}')">DELETE</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </main>
            </div>
        `;
    }

    setActiveFolder(id) {
        this.activeFolderId = id;
        this.render();
    }

    loadIntoEditor(promptId) {
        const folder = this.state.folders.find(f => f.id === this.activeFolderId);
        const prompt = folder.prompts.find(p => p.id === promptId);
        if (prompt && window.loadPromptManual) {
            window.loadPromptManual(prompt.content);
        } else if (prompt) {
            const output = document.getElementById('promptOutput');
            const section = document.getElementById('outputSection');
            if(output && section) {
                output.value = prompt.content;
                section.style.display = 'block';
                window.scrollTo({ top: section.offsetTop - 40, behavior: 'smooth' });
            }
        }
    }
}

// Initialization and Global Link
window.archiveManager = new FolderList('historyGrid');

// Bridge for existing UI
const originalSavePrompt = window.savePrompt;
window.savePrompt = function() {
    const content = document.getElementById('promptOutput').value;
    if (!content) return;
    
    const type = window.selectedType || 'Unknown Type';
    const title = `${type} - ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    
    // Extract tags from component manifest in the UI if possible
    const checkboxes = document.querySelectorAll('#sectionsGrid input:checked');
    const tags = Array.from(checkboxes).map(cb => cb.value.split(' ')[0].toLowerCase());
    
    window.archiveManager.savePromptToArchive({ title, content }, tags);
};