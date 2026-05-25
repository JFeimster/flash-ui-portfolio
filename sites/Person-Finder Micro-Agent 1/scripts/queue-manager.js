/**
 * scripts/queue-manager.js
 * Handles Batch Processing and Progress Tracking for Person-Finder Micro-Agent
 */

class QueueManager {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.currentIndex = -1;
        this.steps = [
            "Domain Analysis",
            "Team Hierarchy Scraping",
            "LinkedIn Company Insight",
            "Google Recursive Search",
            "SOS / Business Registry",
            "Local Intelligence",
            "Email Pattern Discovery",
            "Social Media Footprint",
            "Final Validation"
        ];
        
        this.init();
    }

    init() {
        // Wait for DOM to ensure selectors are available
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindUI());
        } else {
            this.bindUI();
        }
    }

    bindUI() {
        this.terminal = document.querySelector('.log-terminal');
        this.sequenceList = document.querySelector('.sequence-list');
        this.resultsPanel = document.querySelector('.results-panel');
        this.statusContainer = document.querySelector('.status-indicator');
        this.startBtn = document.querySelector('.btn-start');

        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => {
                this.mockFileUpload();
            });
        }
    }

    mockFileUpload() {
        this.log("System: Upload detected. Processing 'business_leads_batch.csv'...");
        
        const mockData = [
            { name: "Cyberdyne Systems", website: "cyberdyne.io", location: "Sunnyvale, CA" },
            { name: "Initech Corp", website: "initech.com", location: "Austin, TX" },
            { name: "Weyland-Yutani", website: "weyland.corp", location: "London, UK" }
        ];

        this.queue = mockData;
        this.processQueue();
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        if (this.startBtn) {
            this.startBtn.disabled = true;
            this.startBtn.style.opacity = "0.5";
            this.startBtn.innerHTML = "Processing Batch...";
        }

        for (let i = 0; i < this.queue.length; i++) {
            this.currentIndex = i;
            await this.processBusiness(this.queue[i]);
        }

        this.isProcessing = false;
        this.updateStatus("IDLE / COMPLETED", "var(--text-dim)");
        this.log("System: All batch entries processed successfully.");
        
        if (this.startBtn) {
            this.startBtn.disabled = false;
            this.startBtn.style.opacity = "1";
            this.startBtn.innerHTML = "Initialize New Search";
        }
    }

    async processBusiness(business) {
        this.log(`Scanning: ${business.name}...`);
        this.updateStatus(`ACTIVE SCANNING: ${business.name}`, "var(--accent)");
        
        // Reset sequence list for the new business
        this.sequenceList.innerHTML = '';
        
        for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
            const stepItem = this.createSequenceItem(stepIdx + 1, this.steps[stepIdx]);
            this.sequenceList.appendChild(stepItem);
            
            // Auto-scroll sequence list
            this.sequenceList.scrollTop = this.sequenceList.scrollHeight;

            await this.performStep(stepItem, stepIdx);
        }

        this.addResult(business);
    }

    createSequenceItem(num, title) {
        const item = document.createElement('div');
        item.className = 'sequence-item';
        item.innerHTML = `
            <div class="step-number">${num.toString().padStart(2, '0')}</div>
            <div class="step-content">
                <div class="step-title">${title}</div>
                <div class="step-desc">Agent analyzing data points...</div>
                <div class="progress-track" style="width: 100%; height: 4px; background: var(--border); border-radius: 2px; margin-top: 8px; overflow: hidden;">
                    <div class="progress-fill" style="width: 0%; height: 100%; background: var(--primary); transition: width 0.2s ease;"></div>
                </div>
            </div>
        `;
        return item;
    }

    async performStep(element, idx) {
        element.classList.add('active');
        const fill = element.querySelector('.progress-fill');
        const desc = element.querySelector('.step-desc');
        
        // Simulated variable processing speeds
        const duration = 600 + Math.random() * 1000;
        const increments = 5;
        
        for (let i = 1; i <= increments; i++) {
            await new Promise(r => setTimeout(r, duration / increments));
            fill.style.width = `${(i / increments) * 100}%`;
        }

        element.classList.remove('active');
        element.classList.add('completed');
        element.style.opacity = "0.6";
        
        const badge = document.createElement('span');
        badge.className = 'step-badge';
        badge.style.background = "rgba(16, 185, 129, 0.1)";
        badge.style.color = "var(--accent)";
        badge.innerText = 'Verified';
        element.querySelector('.step-content').appendChild(badge);
        
        this.log(`Step ${idx + 1} complete for entry ${this.currentIndex + 1}`);
    }

    addResult(business) {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <div class="contact-name">${business.name} Lead</div>
            <div class="contact-title">Automated Discovery</div>
            <div class="contact-meta">
                <div class="meta-item">URL: ${business.website}</div>
                <div class="meta-item">LOC: ${business.location}</div>
            </div>
        `;
        // Insert at the top of the results panel but after the header
        const header = this.resultsPanel.querySelector('.results-header');
        header.after(card);
    }

    log(msg) {
        if (!this.terminal) return;
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `> ${msg}`;
        
        const cursor = this.terminal.querySelector('.cursor');
        if (cursor) {
            this.terminal.insertBefore(line, cursor);
        } else {
            this.terminal.appendChild(line);
        }
        
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    updateStatus(text, color) {
        if (this.statusContainer) {
            const label = this.statusContainer.querySelector('span');
            label.innerHTML = `AGENT STATUS: <span style="color:${color}">${text}</span>`;
        }
    }
}

// Global instance for console access or external triggers
window.queueManager = new QueueManager();