const auditLogs = [
    {
        timestamp: "14:02:01.442",
        source: "DOM_CRAWLER",
        query: "GET /about, /team, /contact",
        status: "SUCCESS",
        result: "Found 'About Us' link. Processing text blocks...",
        confidence: "HIGH"
    },
    {
        timestamp: "14:02:03.110",
        source: "NLP_EXTRACTOR",
        query: "EXTRACT(PEOPLE, ROLES) FROM innerHTML",
        status: "SUCCESS",
        result: "Entity identified: 'Sarah Jenkins', Role: 'Lead Designer'",
        confidence: "MEDIUM"
    },
    {
        timestamp: "14:02:05.891",
        source: "GOOGLE_DORK",
        query: 'site:linkedin.com "Aura Design Studio" (owner OR founder)',
        status: "HIT",
        result: "LinkedIn Profile: /in/sarah-jenkins-brooklyn",
        confidence: "HIGH"
    },
    {
        timestamp: "14:02:06.221",
        source: "SOS_REGISTRY",
        query: "SEARCH NY_DOS 'Aura Design Studio'",
        status: "SUCCESS",
        result: "Registered Agent: Sarah Jenkins. Address: 142 Berry St, Brooklyn.",
        confidence: "CERTAIN"
    },
    {
        timestamp: "14:02:08.005",
        source: "FB_GRAPH_API",
        query: "PAGE_LOOKUP 'Aura Design Studio'",
        status: "SUCCESS",
        result: "Matched phone +1 718-555-0192 to Sarah Jenkins.",
        confidence: "HIGH"
    }
];

const traceStyles = `
    .trace-trigger {
        position: absolute;
        bottom: 24px;
        right: 32px;
        background: transparent;
        border: 1px solid var(--text-dim);
        color: var(--text-muted);
        padding: 6px 12px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 10px;
        cursor: pointer;
        transition: var(--transition);
        z-index: 10;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .trace-trigger:hover {
        border-color: var(--accent-primary);
        color: var(--accent-primary);
        background: var(--accent-glow);
    }

    .audit-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    .audit-overlay.active {
        opacity: 1;
        pointer-events: all;
    }

    .audit-modal {
        width: 90%;
        max-width: 800px;
        max-height: 80vh;
        background: var(--bg-surface);
        border: 1px solid var(--border-muted);
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 30px 60px rgba(0,0,0,0.8);
    }

    .audit-modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-muted);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .audit-modal-header h2 {
        font-size: 14px;
        font-family: var(--font-mono);
        color: var(--accent-primary);
        margin: 0;
    }

    .close-trace {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 20px;
    }

    .audit-table-container {
        overflow-y: auto;
        padding: 16px;
    }

    .audit-table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--font-mono);
        font-size: 11px;
    }

    .audit-table th {
        text-align: left;
        color: var(--text-dim);
        padding: 12px;
        border-bottom: 1px solid var(--border-muted);
        text-transform: uppercase;
    }

    .audit-table td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.03);
        color: var(--text-muted);
        vertical-align: top;
    }

    .source-tag {
        color: #fff;
        background: #222;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
    }

    .query-text {
        color: var(--accent-primary);
    }

    .confidence-high { color: #00ff88; }
    .confidence-medium { color: #ffcc00; }
    .confidence-certain { color: #0088ff; }
`;

function initializeSourceTrace() {
    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = traceStyles;
    document.head.appendChild(styleSheet);

    // Create Trigger Button
    const sequenceView = document.querySelector('.sequence-view');
    if (sequenceView) {
        const trigger = document.createElement('button');
        trigger.className = 'trace-trigger';
        trigger.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>Audit Search Trace';
        sequenceView.appendChild(trigger);

        // Create Modal Structure
        const overlay = document.createElement('div');
        overlay.className = 'audit-overlay';
        overlay.innerHTML = `
            <div class="audit-modal">
                <div class="audit-modal-header">
                    <h2><span style="opacity:0.5">></span> SEARCH_AUDIT_LOG_V1</h2>
                    <button class="close-trace">&times;</button>
                </div>
                <div class="audit-table-container">
                    <table class="audit-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Source</th>
                                <th>Query / Vector</th>
                                <th>Extraction</th>
                                <th>Conf.</th>
                            </tr>
                        </thead>
                        <tbody id="audit-body">
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const auditBody = document.getElementById('audit-body');
        auditLogs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.timestamp}</td>
                <td><span class="source-tag">${log.source}</span></td>
                <td class="query-text">${log.query}</td>
                <td>${log.result}</td>
                <td class="confidence-${log.confidence.toLowerCase()}">${log.confidence}</td>
            `;
            auditBody.appendChild(row);
        });

        // Event Listeners
        trigger.addEventListener('click', () => overlay.classList.add('active'));
        overlay.querySelector('.close-trace').addEventListener('click', () => overlay.classList.remove('active'));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeSourceTrace); 
if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeSourceTrace();
}