/**
 * Moonshine Capital - Business Readiness & Prep Portal Logic
 * Specifically designed for the 'Business Credit Prep' and 'Not Ready' tracks.
 * Matches the neon-cyberpunk aesthetic of the AI Route Engine.
 */

const readinessPortal = {
    categories: [
        {
            title: "Phase 1: Legal Foundation",
            items: [
                { id: "entity_reg", text: "Registered Legal Entity", tip: "Ensure you have an LLC, S-Corp, or C-Corp. No 'DBA' personal bankings." },
                { id: "ein_letter", text: "IRS SS-4 Confirmation Letter", tip: "Lenders need the official EIN assignment letter to verify your TIN." },
                { id: "bus_address", text: "Physical Business Address", tip: "Avoid PO Boxes. Virtual offices are okay if they provide a unique suite number." }
            ]
        },
        {
            title: "Phase 2: Financial Identity",
            items: [
                { id: "bus_checking", text: "Business Checking (Primary)", tip: "Must have at least 3 months of consistent activity with a >$1,000 average balance." },
                { id: "nav_setup", text: "Business Credit Monitoring", tip: "Set up Nav or Experian Business to track your commercial scores." },
                { id: "clean_books", text: "Bookkeeping Records (P&L)", tip: "Keep digital records via QuickBooks or similar for funding over $100k." }
            ]
        },
        {
            title: "Phase 3: Tradeline Building",
            items: [
                { id: "net_30", text: "3 Active Net-30 Vendors", tip: "Suppliers like Uline, Grainger, or Quill that report to D&B and Experian." },
                { id: "secured_card", text: "Secured Business Credit Card", tip: "Boosts your commercial credit score without requiring high personal credit." },
                { id: "utility_link", text: "Utility Data Reporting", tip: "Link your business phone or electric bill to your credit profile." }
            ]
        }
    ],

    init() {
        // Load completion state from local storage
        this.state = JSON.parse(localStorage.getItem('moonshine_readiness_state')) || {};
        this.renderPortal();
    },

    saveState() {
        localStorage.setItem('moonshine_readiness_state', JSON.stringify(this.state));
    },

    toggleItem(id) {
        this.state[id] = !this.state[id];
        this.saveState();
        this.renderPortal();
    },

    calculateProgress() {
        const totalItems = this.categories.reduce((sum, cat) => sum + cat.items.length, 0);
        const completedItems = Object.values(this.state).filter(val => val === true).length;
        return Math.round((completedItems / totalItems) * 100);
    },

    renderPortal() {
        const container = document.getElementById('moonshine-matcher-container');
        if (!container) return;

        const progress = this.calculateProgress();

        const portalHTML = `
            <div id="readiness-portal-view" style="animation: fadeIn 0.4s ease-out;">
                <!-- Header Area -->
                <div class="hero-section" style="padding: 40px; border-bottom: 1px solid var(--card-border);">
                    <div class="route-badge">PREP PORTAL V2.1</div>
                    <h1 style="font-size: 2.2rem; margin-bottom: 8px;">Business <span class="highlight">Readiness</span> Roadmap</h1>
                    <p style="font-size: 0.95rem; max-width: 600px; margin: 0 auto;">Follow this checklist to bridge the gap between "Not Ready" and "Fully Funded."</p>
                    
                    <div style="margin-top: 32px; max-width: 500px; margin-left: auto; margin-right: auto;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">
                            <span style="color: var(--electric-blue);">CURRENT FUNDABILITY</span>
                            <span style="color: var(--neon-green);">${progress}%</span>
                        </div>
                        <div class="progress-container" style="background: rgba(255,255,255,0.05); height: 10px; border-radius: 20px;">
                            <div id="prep-progress-bar" style="width: ${progress}%; height: 100%; background: var(--accent-gradient); border-radius: 20px; box-shadow: 0 0 15px rgba(57, 255, 20, 0.3); transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                        </div>
                    </div>
                </div>

                <!-- Checklist Content -->
                <div style="padding: 30px; display: grid; gap: 32px;">
                    ${this.categories.map(cat => `
                        <div class="category-block">
                            <h3 style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; border-left: 3px solid var(--electric-blue); padding-left: 12px;">${cat.title}</h3>
                            <div style="display: grid; gap: 12px;">
                                ${cat.items.map(item => {
                                    const isDone = this.state[item.id];
                                    return `
                                        <div class="option-card ${isDone ? 'selected' : ''}" 
                                             onclick="readinessPortal.toggleItem('${item.id}')"
                                             style="display: flex; flex-direction: row; align-items: center; gap: 20px; padding: 18px; border-radius: 12px; cursor: pointer;">
                                            <div style="width: 24px; height: 24px; border-radius: 6px; border: 2px solid ${isDone ? 'var(--neon-green)' : 'var(--card-border)'}; display: flex; align-items: center; justify-content: center; background: ${isDone ? 'var(--neon-green)' : 'transparent'}; transition: all 0.3s;">
                                                ${isDone ? '<svg viewBox="0 0 24 24" width="16" height="16" stroke="#000" stroke-width="3" fill="none"><path d="M20 6L9 17l-5-5"/></svg>' : ''}
                                            </div>
                                            <div style="flex: 1;">
                                                <div class="option-title" style="font-size: 1rem; ${isDone ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${item.text}</div>
                                                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${item.tip}</p>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Sticky Action Footer -->
                <div class="action-footer" style="border-top: 1px solid var(--card-border); background: rgba(13, 15, 20, 0.8); backdrop-filter: blur(10px);">
                    <div style="display: flex; gap: 12px;">
                        <button class="cta-button btn-primary" style="flex: 2;" onclick="alert('Connecting to Funding Specialist...')">Manual Review Request</button>
                        <button class="cta-button btn-outline" style="flex: 1;" onclick="location.reload()">Reset Matcher</button>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-muted); text-align: center; margin-top: 10px;">Your progress is saved automatically on this device.</p>
                </div>
            </div>
        `;

        container.innerHTML = portalHTML;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

/**
 * Integration Hook: 
 * Replaces the default alert on the 'Start Prep Plan' button in the base component.
 * To use: Add readinessPortal.init() to your result logic.
 */
window.launchPrepPortal = function() {
    readinessPortal.init();
};

// Global entry for the existing button's onclick
document.addEventListener('click', function(e) {
    if (e.target.innerText === 'START PREP PLAN') {
        launchPrepPortal();
    }
});

// Initial Hash Check for direct deep-linking
if (window.location.hash === '#prep-portal') {
    readinessPortal.init();
}