class VersionHistory {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.storageKey = 'flash_archive_v1';
        this.state = this.loadData();
        this.activeFolderId = 'root';
        this.activePromptId = null;
        
        this.injectStyles();
        this.render();
    }

    loadData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {
            folders: [{ id: 'root', name: 'Main Archive', icon: '📁' }],
            prompts: []
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        this.render();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .archive-dashboard {
                display: grid;
                grid-template-columns: 240px 1fr 300px;
                gap: 1px;
                background: var(--border);
                border: 1px solid var(--border);
                border-radius: 16px;
                overflow: hidden;
                height: 700px;
                margin-top: 40px;
            }

            .archive-sidebar { background: var(--bg); padding: 20px; }
            .archive-main { background: #080808; padding: 20px; overflow-y: auto; }
            .archive-inspector { background: var(--bg); padding: 20px; border-left: 1px solid var(--border); }

            .archive-title {
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: var(--accent);
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .folder-item {
                padding: 10px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                color: var(--text-dim);
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
            }

            .folder-item:hover { background: var(--glass); color: #fff; }
            .folder-item.active { background: var(--accent-glow); color: var(--accent); border: 1px solid var(--accent); }

            .prompt-list-item {
                background: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .prompt-list-item:hover { border-color: var(--accent); transform: translateX(5px); }
            .prompt-list-item.active { border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }

            .prompt-meta {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }

            .tag-cloud { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
            .tag {
                font-size: 0.6rem;
                padding: 2px 8px;
                background: var(--glass);
                border: 1px solid var(--border);
                border-radius: 4px;
                color: var(--text-dim);
            }

            .version-timeline {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .version-node {
                position: relative;
                padding-left: 20px;
                border-left: 1px solid var(--border);
                padding-bottom: 15px;
            }

            .version-node::before {
                content: '';
                position: absolute;
                left: -4px;
                top: 0;
                width: 7px;
                height: 7px;
                background: var(--border);
                border-radius: 50%;
            }

            .version-node.latest::before { background: var(--accent); box-shadow: 0 0 8px var(--accent); }

            .version-date { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); }
            .version-preview {
                font-size: 0.75rem;
                background: var(--glass);
                padding: 8px;
                border-radius: 4px;
                margin-top: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .btn-action {
                background: transparent;
                border: 1px solid var(--border);
                color: var(--text-main);
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.7rem;
                cursor: pointer;
                font-family: var(--font-mono);
            }

            .btn-action:hover { border-color: var(--accent); color: var(--accent); }

            .empty-state {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--text-dim);
                text-align: center;
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(style);
    }

    createPrompt(title, content, tags = []) {
        const newPrompt = {
            id: 'p' + Date.now(),
            folderId: this.activeFolderId,
            title: title || 'Untitled Project',
            tags: tags,
            versions: [{
                timestamp: new Date().toISOString(),
                content: content
            }]
        };
        this.state.prompts.unshift(newPrompt);
        this.activePromptId = newPrompt.id;
        this.saveData();
    }

    addVersion(promptId, content) {
        const prompt = this.state.prompts.find(p => p.id === promptId);
        if (prompt) {
            prompt.versions.unshift({
                timestamp: new Date().toISOString(),
                content: content
            });
            this.saveData();
        }
    }

    render() {
        if (!this.container) return;

        const filteredPrompts = this.state.prompts.filter(p => p.folderId === this.activeFolderId);
        const activePrompt = this.state.prompts.find(p => p.id === this.activePromptId);

        this.container.innerHTML = `
            <div class="archive-dashboard">
                <!-- Sidebar: Folders -->
                <aside class="archive-sidebar">
                    <div class="archive-title">Archive Folders</div>
                    ${this.state.folders.map(f => `
                        <div class="folder-item ${this.activeFolderId === f.id ? 'active' : ''}" 
                             onclick="flashArchive.setActiveFolder('${f.id}')">
                            <span>${f.icon}</span> ${f.name}
                        </div>
                    `).join('')}
                    <button class="btn-action" style="width: 100%; margin-top: 20px;" onclick="flashArchive.newFolder()">+ New Folder</button>
                </aside>

                <!-- Main: Prompt List -->
                <main class="archive-main">
                    <div class="archive-title">Stored Blueprints (${filteredPrompts.length})</div>
                    ${filteredPrompts.length === 0 ? `
                        <div class="empty-state">
                            <div style="font-size: 2rem; margin-bottom: 10px; opacity: 0.2;">📂</div>
                            This sector is empty.<br>Save a prompt to begin indexing.
                        </div>
                    ` : filteredPrompts.map(p => `
                        <div class="prompt-list-item ${this.activePromptId === p.id ? 'active' : ''}" 
                             onclick="flashArchive.setActivePrompt('${p.id}')">
                            <div class="prompt-meta">
                                <div style="font-weight: 700;">${p.title}</div>
                                <div style="font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim);">
                                    v${p.versions.length}.0
                                </div>
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-dim); line-height: 1.2; height: 2.4em; overflow: hidden;">
                                ${p.versions[0].content.substring(0, 80)}...
                            </div>
                            <div class="tag-cloud">
                                ${p.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </main>

                <!-- Inspector: Versioning & Meta -->
                <section class="archive-inspector">
                    <div class="archive-title">System Inspector</div>
                    ${activePrompt ? `
                        <div style="margin-bottom: 25px;">
                            <label style="font-size: 0.6rem; color: var(--text-dim);">PROJECT TITLE</label>
                            <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px;">${activePrompt.title}</div>
                            
                            <div style="display: flex; gap: 8px;">
                                <button class="btn-action" onclick="flashArchive.copyLatest()">Restore Latest</button>
                                <button class="btn-action" onclick="flashArchive.deletePrompt('${activePrompt.id}')">Purge</button>
                            </div>
                        </div>

                        <label style="font-size: 0.6rem; color: var(--text-dim); margin-bottom: 15px; display: block;">VERSION HISTORY</label>
                        <div class="version-timeline">
                            ${activePrompt.versions.map((v, i) => `
                                <div class="version-node ${i === 0 ? 'latest' : ''}">
                                    <div class="version-date">${new Date(v.timestamp).toLocaleString()}</div>
                                    <div class="version-preview">${v.content}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-state">Select a file to view<br>technical telemetry.</div>
                    `}
                </section>
            </div>
        `;
    }

    setActiveFolder(id) {
        this.activeFolderId = id;
        this.activePromptId = null;
        this.render();
    }

    setActivePrompt(id) {
        this.activePromptId = id;
        this.render();
    }

    newFolder() {
        const name = prompt("Enter folder name:");
        if (name) {
            this.state.folders.push({
                id: 'f' + Date.now(),
                name: name,
                icon: '📁'
            });
            this.saveData();
        }
    }

    deletePrompt(id) {
        if (confirm("Confirm permanent deletion from archive?")) {
            this.state.prompts = this.state.prompts.filter(p => p.id !== id);
            this.activePromptId = null;
            this.saveData();
        }
    }

    copyLatest() {
        const prompt = this.state.prompts.find(p => p.id === this.activePromptId);
        if (prompt) {
            const output = document.getElementById('promptOutput');
            if (output) {
                output.value = prompt.versions[0].content;
                document.getElementById('outputSection').style.display = 'block';
                window.scrollTo({ top: output.offsetTop - 100, behavior: 'smooth' });
            }
        }
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    // Create a container for the archive if it doesn't exist
    const historySection = document.querySelector('.history');
    const archiveContainer = document.createElement('div');
    archiveContainer.id = 'flashArchiveContainer';
    historySection.parentNode.insertBefore(archiveContainer, historySection);
    
    window.flashArchive = new VersionHistory('flashArchiveContainer');

    // Override the base savePrompt function
    window.savePrompt = () => {
        const content = document.getElementById('promptOutput').value;
        const type = document.querySelector('.option-tile.active').dataset.value;
        if (!content) return;

        // Check if we are updating an existing prompt or creating a new one
        if (window.flashArchive.activePromptId) {
            window.flashArchive.addVersion(window.flashArchive.activePromptId, content);
        } else {
            window.flashArchive.createPrompt(`${type} - Project`, content, [type.toLowerCase().replace(' ', '-')]);
        }
        
        const btn = document.querySelector('[onclick="savePrompt()"]');
        btn.innerText = "STORED IN VAULT";
        setTimeout(() => btn.innerText = "Save to Vault", 2000);
    };
});