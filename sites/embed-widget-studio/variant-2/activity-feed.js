const style = document.createElement('style');
style.textContent = `
    .dashboard-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
        font-family: 'Inter', sans-serif;
    }
    .metrics-bar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
    }
    .metric-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 20px;
        border-radius: 12px;
        position: relative;
        overflow: hidden;
    }
    .metric-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--accent-blue);
        opacity: 0.5;
    }
    .metric-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.8rem;
        font-weight: 600;
        margin: 8px 0;
        color: var(--text-main);
    }
    .metric-label {
        font-size: 0.75rem;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .activity-feed-panel {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
    }
    .feed-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255,255,255,0.02);
    }
    .feed-body {
        max-height: 500px;
        overflow-y: auto;
    }
    .activity-row {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
        transition: background 0.2s ease;
    }
    .activity-row:hover {
        background: rgba(255,255,255,0.03);
    }
    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        flex-shrink: 0;
    }
    .icon-lead { background: rgba(57, 255, 20, 0.1); border: 1px solid var(--accent-green); color: var(--accent-green); }
    .icon-click { background: rgba(0, 242, 255, 0.1); border: 1px solid var(--accent-blue); color: var(--accent-blue); }
    .icon-imp { background: rgba(139, 148, 158, 0.1); border: 1px solid var(--text-dim); color: var(--text-dim); }
    
    .activity-content { flex-grow: 1; }
    .activity-title { font-size: 0.9rem; font-weight: 600; color: var(--text-main); }
    .activity-meta { font-size: 0.75rem; color: var(--text-dim); }
    .activity-value { font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: var(--accent-green); text-align: right; }
    
    .live-pulse {
        width: 8px;
        height: 8px;
        background: var(--accent-green);
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
        box-shadow: 0 0 8px var(--accent-green);
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

class ActivityFeed {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = {
            metrics: {
                impressions: '42,801',
                ctr: '4.2%',
                leads: '156',
                commissions: '$12,450.00'
            },
            activities: [
                { type: 'lead', title: 'New Funding Application', meta: 'Partner: Acme SEO • 2m ago', value: '+$45.00' },
                { type: 'click', title: 'Widget Click-through', meta: 'Blog Sidebar • 14m ago', value: '' },
                { type: 'imp', title: 'Widget Impression', meta: 'London, UK • 18m ago', value: '' },
                { type: 'lead', title: 'Route Matcher Completion', meta: 'Resource Center • 34m ago', value: '+$12.50' },
                { type: 'imp', title: 'Widget Impression', meta: 'New York, US • 41m ago', value: '' },
                { type: 'click', title: 'Apply CTA Clicked', meta: 'Email Footer • 1h ago', value: '' }
            ]
        };
        this.init();
    }

    init() {
        if (!this.container) return;
        this.render();
        this.startSimulatedFeed();
    }

    render() {
        this.container.innerHTML = `
            <div class="dashboard-container">
                <div class="metrics-bar">
                    ${this.createMetricCard('Total Impressions', this.data.metrics.impressions)}
                    ${this.createMetricCard('Click-Through Rate', this.data.metrics.ctr)}
                    ${this.createMetricCard('Conversion Leads', this.data.metrics.leads)}
                    ${this.createMetricCard('Earned Commissions', this.data.metrics.commissions)}
                </div>
                
                <div class="activity-feed-panel">
                    <div class="feed-header">
                        <h3 style="font-size: 1rem; font-weight: 600;">Real-Time Activity</h3>
                        <div style="display: flex; align-items: center; font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em;">
                            <span class="live-pulse"></span> Live System Status
                        </div>
                    </div>
                    <div class="feed-body" id="feed-items">
                        ${this.data.activities.map(a => this.createActivityRow(a)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createMetricCard(label, value) {
        return `
            <div class="metric-card">
                <div class="metric-label">${label}</div>
                <div class="metric-value">${value}</div>
            </div>
        `;
    }

    createActivityRow(activity) {
        let iconClass = 'icon-imp';
        let svg = '◈';
        if (activity.type === 'lead') { iconClass = 'icon-lead'; svg = '✓'; }
        if (activity.type === 'click') { iconClass = 'icon-click'; svg = '↗'; }

        return `
            <div class="activity-row">
                <div class="activity-icon ${iconClass}">${svg}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-meta">${activity.meta}</div>
                </div>
                <div class="activity-value">${activity.value}</div>
            </div>
        `;
    }

    startSimulatedFeed() {
        setInterval(() => {
            const types = ['lead', 'click', 'imp'];
            const type = types[Math.floor(Math.random() * types.length)];
            const newAct = {
                type: type,
                title: type === 'lead' ? 'Automated Lead Verify' : type === 'click' ? 'Inbound Widget Click' : 'External Impression',
                meta: `Regional Node • Just Now`,
                value: type === 'lead' ? '+$' + (Math.random() * 50).toFixed(2) : ''
            };
            
            this.data.activities.unshift(newAct);
            if (this.data.activities.length > 15) this.data.activities.pop();
            
            const feedItems = document.getElementById('feed-items');
            if (feedItems) {
                feedItems.insertAdjacentHTML('afterbegin', this.createActivityRow(newAct));
                if (feedItems.children.length > 15) feedItems.lastElementChild.remove();
            }
        }, 8000);
    }
}

// Global initialization
window.MoonshineDashboard = ActivityFeed;const style = document.createElement('style');
style.textContent = `
    .dashboard-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
        font-family: 'Inter', sans-serif;
    }
    .metrics-bar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
    }
    .metric-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 20px;
        border-radius: 12px;
        position: relative;
        overflow: hidden;
    }
    .metric-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--accent-blue);
        opacity: 0.5;
    }
    .metric-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.8rem;
        font-weight: 600;
        margin: 8px 0;
        color: var(--text-main);
    }
    .metric-label {
        font-size: 0.75rem;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .activity-feed-panel {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
    }
    .feed-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255,255,255,0.02);
    }
    .feed-body {
        max-height: 500px;
        overflow-y: auto;
    }
    .activity-row {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
        transition: background 0.2s ease;
    }
    .activity-row:hover {
        background: rgba(255,255,255,0.03);
    }
    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        flex-shrink: 0;
    }
    .icon-lead { background: rgba(57, 255, 20, 0.1); border: 1px solid var(--accent-green); color: var(--accent-green); }
    .icon-click { background: rgba(0, 242, 255, 0.1); border: 1px solid var(--accent-blue); color: var(--accent-blue); }
    .icon-imp { background: rgba(139, 148, 158, 0.1); border: 1px solid var(--text-dim); color: var(--text-dim); }
    
    .activity-content { flex-grow: 1; }
    .activity-title { font-size: 0.9rem; font-weight: 600; color: var(--text-main); }
    .activity-meta { font-size: 0.75rem; color: var(--text-dim); }
    .activity-value { font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: var(--accent-green); text-align: right; }
    
    .live-pulse {
        width: 8px;
        height: 8px;
        background: var(--accent-green);
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
        box-shadow: 0 0 8px var(--accent-green);
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

class ActivityFeed {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = {
            metrics: {
                impressions: '42,801',
                ctr: '4.2%',
                leads: '156',
                commissions: '$12,450.00'
            },
            activities: [
                { type: 'lead', title: 'New Funding Application', meta: 'Partner: Acme SEO • 2m ago', value: '+$45.00' },
                { type: 'click', title: 'Widget Click-through', meta: 'Blog Sidebar • 14m ago', value: '' },
                { type: 'imp', title: 'Widget Impression', meta: 'London, UK • 18m ago', value: '' },
                { type: 'lead', title: 'Route Matcher Completion', meta: 'Resource Center • 34m ago', value: '+$12.50' },
                { type: 'imp', title: 'Widget Impression', meta: 'New York, US • 41m ago', value: '' },
                { type: 'click', title: 'Apply CTA Clicked', meta: 'Email Footer • 1h ago', value: '' }
            ]
        };
        this.init();
    }

    init() {
        if (!this.container) return;
        this.render();
        this.startSimulatedFeed();
    }

    render() {
        this.container.innerHTML = `
            <div class="dashboard-container">
                <div class="metrics-bar">
                    ${this.createMetricCard('Total Impressions', this.data.metrics.impressions)}
                    ${this.createMetricCard('Click-Through Rate', this.data.metrics.ctr)}
                    ${this.createMetricCard('Conversion Leads', this.data.metrics.leads)}
                    ${this.createMetricCard('Earned Commissions', this.data.metrics.commissions)}
                </div>
                
                <div class="activity-feed-panel">
                    <div class="feed-header">
                        <h3 style="font-size: 1rem; font-weight: 600;">Real-Time Activity</h3>
                        <div style="display: flex; align-items: center; font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em;">
                            <span class="live-pulse"></span> Live System Status
                        </div>
                    </div>
                    <div class="feed-body" id="feed-items">
                        ${this.data.activities.map(a => this.createActivityRow(a)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createMetricCard(label, value) {
        return `
            <div class="metric-card">
                <div class="metric-label">${label}</div>
                <div class="metric-value">${value}</div>
            </div>
        `;
    }

    createActivityRow(activity) {
        let iconClass = 'icon-imp';
        let svg = '◈';
        if (activity.type === 'lead') { iconClass = 'icon-lead'; svg = '✓'; }
        if (activity.type === 'click') { iconClass = 'icon-click'; svg = '↗'; }

        return `
            <div class="activity-row">
                <div class="activity-icon ${iconClass}">${svg}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-meta">${activity.meta}</div>
                </div>
                <div class="activity-value">${activity.value}</div>
            </div>
        `;
    }

    startSimulatedFeed() {
        setInterval(() => {
            const types = ['lead', 'click', 'imp'];
            const type = types[Math.floor(Math.random() * types.length)];
            const newAct = {
                type: type,
                title: type === 'lead' ? 'Automated Lead Verify' : type === 'click' ? 'Inbound Widget Click' : 'External Impression',
                meta: `Regional Node • Just Now`,
                value: type === 'lead' ? '+$' + (Math.random() * 50).toFixed(2) : ''
            };
            
            this.data.activities.unshift(newAct);
            if (this.data.activities.length > 15) this.data.activities.pop();
            
            const feedItems = document.getElementById('feed-items');
            if (feedItems) {
                feedItems.insertAdjacentHTML('afterbegin', this.createActivityRow(newAct));
                if (feedItems.children.length > 15) feedItems.lastElementChild.remove();
            }
        }, 8000);
    }
}

// Global initialization
window.MoonshineDashboard = ActivityFeed;