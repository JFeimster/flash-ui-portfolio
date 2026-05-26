const SearchAuditLogger = {
    config: {
        containerSelector: '.terminal-output',
        types: {
            QUERY: { color: '#ffffff', prefix: 'QUERY', icon: '🔍' },
            SOURCE: { color: '#707070', prefix: 'SOURCE', icon: '🌐' },
            MATCH: { color: '#00ff88', prefix: 'MATCH', icon: '✅' },
            SCAN: { color: '#404040', prefix: 'SCAN', icon: '⚙️' },
            ERROR: { color: '#ff4444', prefix: 'ERROR', icon: '❌' }
        }
    },

    init() {
        this.container = document.querySelector(this.config.containerSelector);
        if (!this.container) return;
        
        // Clear existing static logs for the dynamic audit process
        this.container.innerHTML = '';
        this.injectStyles();
        this.startSequence();
    },

    injectStyles() {
        if (document.getElementById('log-renderer-styles')) return;
        const style = document.createElement('style');
        style.id = 'log-renderer-styles';
        style.textContent = `
            .audit-log-entry {
                display: flex;
                gap: 12px;
                margin-bottom: 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                line-height: 1.5;
                animation: logFadeIn 0.4s ease-out forwards;
                opacity: 0;
            }
            @keyframes logFadeIn {
                from { opacity: 0; transform: translateX(-4px); }
                to { opacity: 1; transform: translateX(0); }
            }
            .audit-ts { color: var(--text-dim); flex-shrink: 0; }
            .audit-type { font-weight: 700; flex-shrink: 0; min-width: 60px; }
            .audit-msg { color: var(--text-main); flex-grow: 1; }
            .audit-meta { 
                display: block; 
                color: var(--text-muted); 
                font-size: 10px; 
                margin-top: 2px;
                border-left: 1px solid var(--border-muted);
                padding-left: 8px;
            }
        `;
        document.head.appendChild(style);
    },

    renderRow(typeKey, message, meta = '') {
        const type = this.config.types[typeKey] || this.config.types.SCAN;
        const ts = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const row = document.createElement('div');
        row.className = 'audit-log-entry';
        row.innerHTML = `
            <span class="audit-ts">[${ts}]</span>
            <span class="audit-type" style="color: ${type.color}">${type.prefix}</span>
            <div class="audit-msg">
                ${message}
                ${meta ? `<span class="audit-meta">via ${meta}</span>` : ''}
            </div>
        `;

        this.container.appendChild(row);
        this.container.scrollTop = this.container.scrollHeight;
    },

    startSequence() {
        const sequence = [
            { t: 'SCAN', m: 'Initializing neural search for "Aura Design Studio"...', d: 500 },
            { t: 'QUERY', m: 'Executing: site:instagram.com "Aura Design Studio" Brooklyn', meta: 'Google Custom Search API', d: 1200 },
            { t: 'SOURCE', m: 'Analyzing profile @auradesign.bk for contact patterns', meta: 'Instagram Social Graph', d: 800 },
            { t: 'MATCH', m: 'Found: Sarah Jenkins (Creative Director)', meta: 'Bio Metadata extraction', d: 1500 },
            { t: 'QUERY', m: 'Executing: "Sarah Jenkins" "Aura Design" email OR contact', meta: 'Bing Search V7', d: 1000 },
            { t: 'SCAN', m: 'Cross-referencing Sarah Jenkins via NY Secretary of State...', d: 1200 },
            { t: 'MATCH', m: 'Confirmed: Sarah Jenkins listed as Registered Agent', meta: 'NY.gov Business Entity Search', d: 900 },
            { t: 'SOURCE', m: 'Pulling LinkedIn professional history for validation', meta: 'LinkedIn Public API', d: 2000 },
            { t: 'MATCH', m: 'Data Validated: 98% Confidence Score', d: 500 }
        ];

        let elapsed = 0;
        sequence.forEach(step => {
            elapsed += step.d;
            setTimeout(() => this.renderRow(step.t, step.m, step.meta), elapsed);
        });
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SearchAuditLogger.init());
} else {
    SearchAuditLogger.init();
}