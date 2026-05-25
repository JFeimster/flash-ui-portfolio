/**
 * QueueManager.js
 * Logic for Batch Processing Hub - Person-Finder Micro-Agent
 */

class QueueManager {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.currentIndex = -1;
        this.stats = {
            completed: 0,
            total: 0
        };

        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.setupInitialState();
    }

    cacheDOM() {
        this.elements = {
            dropzone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('csv-upload'),
            queueList: document.getElementById('queue-items'),
            terminal: document.querySelector('.terminal-output'),
            startBtn: document.getElementById('start-queue-btn'),
            progressBar: document.querySelector('.progress-fill'),
            progressText: document.querySelector('.progress-status-text'),
            countBadge: document.getElementById('queue-count')
        };
    }

    bindEvents() {
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startBatch());
        }

        // Handle drag and drop visuals
        if (this.elements.dropzone) {
            this.elements.dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.elements.dropzone.style.borderColor = 'var(--accent-primary)';
                this.elements.dropzone.style.background = 'var(--accent-glow)';
            });

            this.elements.dropzone.addEventListener('dragleave', () => {
                this.elements.dropzone.style.borderColor = 'var(--border-muted)';
                this.elements.dropzone.style.background = 'transparent';
            });

            this.elements.dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length) this.processFile(files[0]);
            });
        }
    }

    setupInitialState() {
        this.log("System initialized. Awaiting batch input...", "var(--text-dim)");
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) this.processFile(file);
    }

    processFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
            
            this.queue = lines.map((line, index) => {
                const [name, website] = line.split(',').map(item => item.trim());
                return {
                    id: index,
                    name: name || "Unknown Entity",
                    website: website || "No URL provided",
                    status: 'queued'
                };
            });

            this.stats.total = this.queue.length;
            this.renderQueue();
            this.log(`Successfully imported ${this.queue.length} entities.`, "var(--accent-primary)");
            this.updateProgress();
        };
        reader.readAsText(file);
    }

    renderQueue() {
        if (!this.elements.queueList) return;

        this.elements.queueList.innerHTML = this.queue.map(item => `
            <div class="queue-item" id="item-${item.id}" data-status="${item.status}">
                <div class="item-meta">
                    <span class="item-name">${item.name}</span>
                    <span class="item-sub">${item.website}</span>
                </div>
                <div class="item-status">
                    <span class="status-text">${item.status.toUpperCase()}</span>
                    <div class="status-dot"></div>
                </div>
            </div>
        `).join('');

        if (this.elements.countBadge) {
            this.elements.countBadge.innerText = this.queue.length;
        }
    }

    async startBatch() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        this.elements.startBtn.disabled = true;
        this.elements.startBtn.innerText = "AGENT ACTIVE...";
        
        this.log("Booting Search Agent Clusters...", "#fff");

        for (let i = 0; i < this.queue.length; i++) {
            this.currentIndex = i;
            await this.processItem(this.queue[i]);
        }

        this.isProcessing = false;
        this.elements.startBtn.disabled = false;
        this.elements.startBtn.innerText = "RESTART BATCH";
        this.log("Batch complete. All threads terminated.", "var(--accent-primary)");
    }

    async processItem(item) {
        const row = document.getElementById(`item-${item.id}`);
        item.status = 'processing';
        this.updateItemUI(row, 'processing', 'SCANNING');
        
        this.log(`[Target ${item.id + 1}] Initiating deep scan for ${item.name}...`);
        
        // Simulating Agent Steps
        await this.wait(800);
        this.log(`Analyzing ${item.website} source code...`, "var(--text-muted)");
        
        await this.wait(1200);
        this.log(`Cross-referencing LinkedIn and Public Registries...`, "var(--text-muted)");
        
        await this.wait(1000);
        
        // Finalize
        item.status = 'completed';
        this.stats.completed++;
        this.updateItemUI(row, 'completed', 'FINISHED');
        this.updateProgress();
        this.log(`Match secured for ${item.name}. Decision maker identified.`, "var(--accent-primary)");
        
        // Auto-scroll the queue
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    updateItemUI(el, status, text) {
        if (!el) return;
        el.setAttribute('data-status', status);
        el.querySelector('.status-text').innerText = text;
    }

    updateProgress() {
        const percent = (this.stats.completed / this.stats.total) * 100 || 0;
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${percent}%`;
        }
        if (this.elements.progressText) {
            this.elements.progressText.innerText = `${this.stats.completed} / ${this.stats.total} PROCESSED`;
        }
    }

    log(message, color = null) {
        if (!this.elements.terminal) return;

        const line = document.createElement('div');
        line.className = 'log-line';
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        
        line.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span style="${color ? `color: ${color}` : ''}">${message}</span>
        `;

        this.elements.terminal.appendChild(line);
        this.elements.terminal.scrollTop = this.elements.terminal.scrollHeight;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    window.QueueHub = new QueueManager();
});