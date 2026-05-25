/**
 * csv-handler.js
 * Logic for Batch Processing Hub: Handles CSV parsing, queue management, 
 * and UI updates for the Person-Finder Micro-Agent.
 */

class BatchProcessor {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.currentIndex = 0;
        this.stats = { success: 0, failed: 0 };
        
        this.selectors = {
            btn: document.querySelector('.search-btn'),
            sidebar: document.querySelector('.input-sidebar'),
            sequenceList: document.querySelector('.sequence-list'),
            terminal: document.querySelector('.terminal-output'),
            statusText: document.querySelector('.status-indicator span'),
            badge: document.querySelector('.badge')
        };

        this.init();
    }

    init() {
        // Inject Batch Mode Toggle and File Input
        this.injectBatchUI();
        this.setupEventListeners();
    }

    injectBatchUI() {
        const batchHTML = `
            <div id="batch-controls" style="margin-top: 24px; padding-top: 24px; border-top: 1px dashed var(--border-muted);">
                <label>Batch Processing</label>
                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    <button id="upload-trigger" style="flex: 1; background: transparent; border: 1px solid var(--border-muted); color: var(--text-main); padding: 10px; border-radius: 8px; font-size: 12px; cursor: pointer; font-family: var(--font-mono); transition: var(--transition);">
                        UPLOAD CSV
                    </button>
                    <input type="file" id="csv-input" accept=".csv" style="display: none;">
                </div>
                <div id="queue-status" style="margin-top: 12px; font-size: 11px; color: var(--text-dim); font-family: var(--font-mono); display: none;">
                    QUEUE: <span id="queue-count" style="color: var(--accent-primary)">0</span> TARGETS LOADED
                </div>
            </div>
        `;
        this.selectors.sidebar.insertAdjacentHTML('beforeend', batchHTML);
    }

    setupEventListeners() {
        const uploadTrigger = document.getElementById('upload-trigger');
        const csvInput = document.getElementById('csv-input');

        uploadTrigger.addEventListener('click', () => csvInput.click());
        csvInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        uploadTrigger.addEventListener('mouseover', () => {
            uploadTrigger.style.borderColor = 'var(--accent-primary)';
            uploadTrigger.style.color = 'var(--accent-primary)';
        });
        uploadTrigger.addEventListener('mouseout', () => {
            if (!this.isProcessing) {
                uploadTrigger.style.borderColor = 'var(--border-muted)';
                uploadTrigger.style.color = 'var(--text-main)';
            }
        });

        this.selectors.btn.addEventListener('click', () => {
            if (this.queue.length > 0 && !this.isProcessing) {
                this.startBatch();
            }
        });
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            this.parseCSV(text);
        };
        reader.readAsText(file);
    }

    parseCSV(text) {
        const lines = text.split('\n');
        this.queue = lines
            .map(line => {
                const [name, url, city, industry] = line.split(',').map(s => s.trim());
                return name ? { name, url, city, industry } : null;
            })
            .filter(item => item !== null && item.name !== 'Business Name');

        document.getElementById('queue-status').style.display = 'block';
        document.getElementById('queue-count').innerText = this.queue.length;
        this.addLog(`Loaded ${this.queue.length} targets from CSV.`);
        this.selectors.btn.innerHTML = `<span>RUN BATCH SEARCH (${this.queue.length})</span>`;
    }

    async startBatch() {
        this.isProcessing = true;
        this.currentIndex = 0;
        this.selectors.btn.disabled = true;
        this.selectors.btn.style.opacity = '0.5';
        this.selectors.btn.style.cursor = 'not-allowed';
        this.selectors.badge.innerText = 'BATCH PROCESSOR ACTIVE';
        
        for (let i = 0; i < this.queue.length; i++) {
            this.currentIndex = i;
            await this.processEntry(this.queue[i]);
        }

        this.completeBatch();
    }

    async processEntry(entry) {
        // Update Sidebar Inputs to show current target
        const inputs = this.selectors.sidebar.querySelectorAll('input[type="text"]');
        if (inputs.length >= 2) {
            inputs[0].value = entry.name;
            inputs[1].value = entry.url || '';
        }

        this.addLog(`Switching target: ${entry.name}...`, '#fff');
        this.resetSequenceUI(entry.name);
        
        // Simulate step-by-step progress
        await this.simulateStep(0, 1500); // Website Intel
        await this.simulateStep(1, 2500); // Multi-Vector
        await this.simulateStep(2, 2000); // Registry
        await this.simulateStep(3, 1500); // Social Graph
        
        this.addLog(`Success: Decision makers extracted for ${entry.name}`, 'var(--accent-primary)');
        this.stats.success++;
    }

    simulateStep(index, duration) {
        return new Promise(resolve => {
            const items = document.querySelectorAll('.sequence-item');
            
            // Set current active
            items.forEach((item, i) => {
                item.className = 'sequence-item';
                if (i < index) item.classList.add('completed');
                if (i === index) item.classList.add('active');
            });

            const statusText = items[index].querySelector('.item-status-text');
            const originalText = statusText.innerText;
            statusText.innerText = '● ANALYZING...';
            statusText.style.color = 'var(--accent-primary)';

            setTimeout(() => {
                statusText.innerText = '✓ COMPLETE';
                items[index].classList.remove('active');
                items[index].classList.add('completed');
                resolve();
            }, duration);
        });
    }

    resetSequenceUI(name) {
        this.selectors.statusText.innerText = `AGENT SCANNING: ${name.toUpperCase()}`;
        const items = document.querySelectorAll('.sequence-item');
        items.forEach(item => {
            item.className = 'sequence-item';
            const status = item.querySelector('.item-status-text');
            status.innerText = '○ QUEUED';
            status.style.color = 'var(--text-dim)';
        });
    }

    addLog(message, color = 'var(--text-muted)') {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `
            <span class="timestamp">[${time}]</span>
            <span style="color: ${color}">${message}</span>
        `;
        this.selectors.terminal.prepend(line);
        
        // Keep logs clean
        if (this.selectors.terminal.childNodes.length > 20) {
            this.selectors.terminal.removeChild(this.selectors.terminal.lastChild);
        }
    }

    completeBatch() {
        this.isProcessing = false;
        this.selectors.btn.disabled = false;
        this.selectors.btn.style.opacity = '1';
        this.selectors.btn.style.cursor = 'pointer';
        this.selectors.btn.innerText = 'INITIALIZE NEW SEARCH';
        this.selectors.badge.innerText = 'BATCH COMPLETE';
        this.selectors.statusText.innerText = 'QUEUE EXHAUSTED';
        
        this.addLog(`BATCH FINISHED. Total: ${this.queue.length}, Success: ${this.stats.success}`, 'var(--accent-primary)');
        
        const dot = document.querySelector('.dot');
        dot.classList.remove('active');
        dot.style.background = 'var(--accent-primary)';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.personFinderBatch = new BatchProcessor();
});