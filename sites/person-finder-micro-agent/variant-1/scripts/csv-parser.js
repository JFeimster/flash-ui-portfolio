/**
 * Person-Finder Micro-Agent
 * Batch Search Workspace: CSV Parser & Queue Manager
 * Version: 2.4.0
 */

class BatchSearchManager {
    constructor() {
        this.queue = [];
        this.currentIndex = -1;
        this.isProcessing = false;
        this.steps = [
            "Domain Analysis",
            "Team Hierarchy Scraping",
            "LinkedIn Company Insight",
            "Google Recursive Search",
            "SOS / Business Registry",
            "Local Intelligence",
            "AI Synthesis & Mapping",
            "Email Pattern Prediction",
            "CRM Export Validation"
        ];
        
        this.selectors = {
            fileInput: '#batch-upload',
            progressContainer: '.sequence-list',
            terminal: '.log-terminal',
            resultsPanel: '.results-panel',
            statusText: '.status-indicator span'
        };
    }

    /**
     * Parses raw CSV text into an array of business objects
     * @param {string} csvText 
     */
    parseCSV(csvText) {
        const lines = csvText.split(/\r?\n/);
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        return lines.slice(1)
            .filter(line => line.trim() !== '')
            .map(line => {
                const values = line.split(',');
                const entry = {};
                headers.forEach((header, i) => {
                    entry[header] = values[i] ? values[i].trim() : '';
                });
                return entry;
            });
    }

    /**
     * Initializes the UI for a new batch
     * @param {Array} data 
     */
    initQueue(data) {
        this.queue = data;
        this.currentIndex = 0;
        this.log(`Batch initialized: ${data.length} businesses loaded.`);
        this.updateGlobalStatus(`BATCH PROCESSING: ${this.queue.length} REMAINING`);
        this.renderQueueUI();
        this.processNext();
    }

    /**
     * Processes the next item in the queue
     */
    async processNext() {
        if (this.currentIndex >= this.queue.length) {
            this.isProcessing = false;
            this.log("Batch complete. All entities processed.");
            this.updateGlobalStatus("BATCH COMPLETE");
            return;
        }

        this.isProcessing = true;
        const currentItem = this.queue[this.currentIndex];
        this.log(`Starting sequence for: ${currentItem.business || 'Unknown Entity'}`);
        
        await this.runNineStepSequence(currentItem);
        
        this.currentIndex++;
        this.processNext();
    }

    /**
     * Simulates the 9-step search sequence
     * @param {Object} item 
     */
    async runNineStepSequence(item) {
        const container = document.querySelector(this.selectors.progressContainer);
        container.innerHTML = ''; // Clear for new item

        for (let i = 0; i < this.steps.length; i++) {
            const stepName = this.steps[i];
            const stepIndex = i + 1;
            
            // UI Update: Create Step Element
            const stepEl = this.createStepElement(stepIndex, stepName);
            container.appendChild(stepEl);
            stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Simulate Network/Processing Delay
            this.log(`Executing: ${stepName}...`);
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

            // Mark Step as Completed
            stepEl.classList.remove('active');
            stepEl.classList.add('completed');
            const badge = stepEl.querySelector('.step-badge');
            if (badge) {
                badge.innerText = "Verified";
                badge.style.background = "rgba(16, 185, 129, 0.1)";
                badge.style.color = "var(--accent)";
            }

            // Simulate finding a contact mid-way
            if (i === 4) this.injectMockResult(item);
        }
    }

    createStepElement(index, title) {
        const div = document.createElement('div');
        div.className = 'sequence-item active';
        div.innerHTML = `
            <div class="step-number">${index.toString().padStart(2, '0')}</div>
            <div class="step-content">
                <div class="step-title">${title}</div>
                <div class="step-desc">Agent analyzing localized data clusters for matches...</div>
                <span class="step-badge" style="color:var(--primary); background:rgba(59,130,246,0.1)">Processing...</span>
            </div>
        `;
        return div;
    }

    injectMockResult(item) {
        const resultsPanel = document.querySelector(this.selectors.resultsPanel);
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.style.animation = 'fadeIn 0.5s ease-out';
        
        const name = ["Alex Rivera", "Jordan Smith", "Casey Montgomery", "Taylor Vance"][Math.floor(Math.random() * 4)];
        
        card.innerHTML = `
            <div class="contact-name">${name}</div>
            <div class="contact-title">Principal @ ${item.business || 'Target Corp'}</div>
            <div class="contact-meta">
                <div class="meta-item">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    Profile Found
                </div>
            </div>
        `;
        
        const header = resultsPanel.querySelector('.results-header');
        header.after(card);
    }

    log(message) {
        const terminal = document.querySelector(this.selectors.terminal);
        if (terminal) {
            const line = document.createElement('div');
            line.className = 'log-line';
            line.innerHTML = `> [${new Date().toLocaleTimeString()}] ${message}`;
            terminal.prepend(line);
        }
    }

    updateGlobalStatus(text) {
        const status = document.querySelector(this.selectors.statusText);
        if (status) status.innerHTML = `<span style="color:var(--accent)">${text}</span>`;
    }

    renderQueueUI() {
        // Implementation for sidebar queue visualization
        this.log(`Queueing ${this.queue.length} records into workspace...`);
    }

    /**
     * Event listener for file upload
     */
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const data = this.parseCSV(text);
            this.initQueue(data);
        };
        reader.readAsText(file);
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    window.batchManager = new BatchSearchManager();
    
    // Wire up to a hidden input or the main start button for demo purposes
    const uploadBtn = document.createElement('input');
    uploadBtn.type = 'file';
    uploadBtn.id = 'batch-upload';
    uploadBtn.accept = '.csv';
    uploadBtn.style.display = 'none';
    document.body.appendChild(uploadBtn);

    uploadBtn.addEventListener('change', (e) => window.batchManager.handleFileUpload(e));

    // Optional: Transform "Initialize Search" button to trigger file picker if Shift is held
    const startBtn = document.querySelector('.btn-start');
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            if (e.shiftKey) {
                e.preventDefault();
                uploadBtn.click();
            }
        });
    }
});