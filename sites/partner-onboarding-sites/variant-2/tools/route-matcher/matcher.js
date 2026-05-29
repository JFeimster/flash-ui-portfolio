class FundingRouteMatcher {
    constructor(options = {}) {
        this.containerId = options.containerId || 'route-matcher-root';
        this.partnerId = options.partnerId || this.getPartnerIdFromURL() || 'default-partner';
        this.theme = options.theme || 'dark';
        this.onCTAClick = options.onCTAClick || null;
        
        this.container = document.getElementById(this.containerId);
        
        this.state = {
            step: 1,
            inputs: {
                timeInBusiness: '12-24', // '0-6', '6-12', '12-24', '24+'
                monthlyRevenue: 25000,
                creditScore: 680,
                industry: 'retail' // 'retail', 'ecommerce', 'construction', 'services', 'other'
            },
            score: 0,
            matches: []
        };

        this.fundingRoutes = [
            {
                id: 'sba-7a',
                name: 'SBA 7(a) Loan Pipeline',
                badge: 'Low Rate / High Spec',
                description: 'The gold standard for long-term growth, working capital, and structural equipment expansion.',
                route: 'SBA Funding Pathway',
                minCredit: 680,
                minTime: 24, // months
                minRevenue: 30000,
                interestRate: '6.5% - 9%',
                averageClose: '30-45 Days',
                color: 'var(--electric-green)',
                icon: '🏛️'
            },
            {
                id: 'line-of-credit',
                name: 'Revolving Business Line of Credit',
                badge: 'Ultimate Flexibility',
                description: 'Access continuous capital on demand. Only pay interest on the exact amounts you draw down.',
                route: 'Flexible Credit Facility',
                minCredit: 620,
                minTime: 12,
                minRevenue: 15000,
                interestRate: '8% - 18%',
                averageClose: '3-7 Business Days',
                color: 'var(--cobalt-blue)',
                icon: '🔄'
            },
            {
                id: 'revenue-financing',
                name: 'Revenue-Based Line & MCA',
                badge: 'High-Velocity Scaling',
                description: 'Fast non-dilutive advances structured directly against your ongoing credit card receipts and merchant sales.',
                route: 'Merchant Capital Access',
                minCredit: 520,
                minTime: 6,
                minRevenue: 10000,
                interestRate: '1.10 - 1.35 Factor',
                averageClose: '24-48 Hours',
                color: 'var(--signal-orange)',
                icon: '⚡'
            },
            {
                id: 'credit-builder',
                name: 'Corporate Credit Prep Stack',
                badge: 'No Personal Guarantee Pathway',
                description: 'Sequentially build your corporate credit index profile to unlock tier-1 capabilities without PG exposure.',
                route: 'Tier 1/2 Credit Alignment',
                minCredit: 0,
                minTime: 0,
                minRevenue: 0,
                interestRate: 'N/A (Strategic)',
                averageClose: '30-60 Days (Prep Cycle)',
                color: 'var(--chrome-accent)',
                icon: '🛡️'
            }
        ];

        if (this.container) {
            this.injectStyles();
            this.init();
        } else {
            console.warn(`FundingRouteMatcher: Container element '#${this.containerId}' not found.`);
        }
    }

    getPartnerIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('partner') || params.get('ref');
    }

    injectStyles() {
        if (document.getElementById('route-matcher-styles')) return;

        const style = document.createElement('style');
        style.id = 'route-matcher-styles';
        style.textContent = `
            #${this.containerId} {
                --matte-black: #0B0F17;
                --deep-gray: #121824;
                --graphite: #1E293B;
                --bone-white: #F9FAF1;
                --electric-green: #00FF66;
                --signal-orange: #FF5722;
                --cobalt-blue: #2563EB;
                --chrome-accent: #9CA3AF;
                --glass-bg: rgba(18, 24, 36, 0.75);
                --glass-border: rgba(255, 255, 255, 0.08);
                --neon-glow: 0 0 20px rgba(0, 255, 102, 0.15);
                
                font-family: 'Plus Jakarta Sans', sans-serif;
                color: var(--bone-white);
                background: var(--glass-bg);
                backdrop-filter: blur(16px);
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                padding: 32px;
                max-width: 800px;
                margin: 0 auto;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
            }

            #${this.containerId} * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            .frm-header {
                border-bottom: 1px solid var(--glass-border);
                padding-bottom: 20px;
                margin-bottom: 28px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
            }

            .frm-title-block h3 {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--bone-white);
                margin-bottom: 4px;
            }

            .frm-title-block p {
                font-size: 0.85rem;
                color: var(--chrome-accent);
            }

            .frm-badge-mono {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.75rem;
                color: var(--electric-green);
                background: rgba(0, 255, 102, 0.1);
                border: 1px solid rgba(0, 255, 102, 0.25);
                padding: 4px 10px;
                border-radius: 4px;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }

            .frm-form-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-bottom: 32px;
            }

            @media (max-width: 640px) {
                .frm-form-grid {
                    grid-template-columns: 1fr;
                }
            }

            .frm-form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .frm-label {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 0.85rem;
                font-weight: 600;
                color: var(--bone-white);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                display: flex;
                justify-content: space-between;
            }

            .frm-label span.frm-value-display {
                color: var(--electric-green);
                font-family: 'JetBrains Mono', monospace;
            }

            .frm-select, .frm-input-range {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--glass-border);
                color: var(--bone-white);
                padding: 12px 16px;
                border-radius: 6px;
                font-family: inherit;
                font-size: 0.95rem;
                outline: none;
                transition: all 0.2s;
                width: 100%;
            }

            .frm-select:focus {
                border-color: var(--electric-green);
            }

            .frm-input-range {
                -webkit-appearance: none;
                height: 6px;
                padding: 0;
                background: var(--graphite);
                border: none;
                cursor: pointer;
            }

            .frm-input-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--electric-green);
                box-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
                transition: transform 0.1s;
            }

            .frm-input-range::-webkit-slider-thumb:hover {
                transform: scale(1.2);
            }

            .frm-actions {
                display: flex;
                justify-content: flex-end;
                border-top: 1px solid var(--glass-border);
                padding-top: 24px;
                margin-top: 24px;
                gap: 12px;
            }

            .frm-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 12px 24px;
                font-family: 'Space Grotesk', sans-serif;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                border-radius: 4px;
                border: none;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                font-size: 0.85rem;
            }

            .frm-btn-primary {
                background: var(--electric-green);
                color: var(--matte-black);
                border: 2px solid var(--electric-green);
                box-shadow: 4px 4px 0px 0px rgba(0, 255, 102, 0.2);
            }

            .frm-btn-primary:hover {
                transform: translate(-2px, -2px);
                box-shadow: 6px 6px 0px 0px var(--electric-green);
            }

            .frm-btn-secondary {
                background: transparent;
                color: var(--bone-white);
                border: 2px solid var(--glass-border);
            }

            .frm-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: var(--bone-white);
            }

            /* Step 2: Scoring View Styles */
            .frm-results-grid {
                display: grid;
                grid-template-columns: 0.8fr 1.2fr;
                gap: 32px;
            }

            @media (max-width: 768px) {
                .frm-results-grid {
                    grid-template-columns: 1fr;
                }
            }

            .frm-score-card {
                background: rgba(0, 0, 0, 0.25);
                border: 1px solid var(--glass-border);
                border-radius: 8px;
                padding: 24px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .frm-gauge-wrapper {
                position: relative;
                width: 140px;
                height: 140px;
                margin-bottom: 16px;
            }

            .frm-gauge-svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }

            .frm-gauge-bg {
                fill: none;
                stroke: var(--graphite);
                stroke-width: 10;
            }

            .frm-gauge-fill {
                fill: none;
                stroke: var(--electric-green);
                stroke-width: 10;
                stroke-linecap: round;
                stroke-dasharray: 408; /* 2 * PI * r (r=65) */
                stroke-dashoffset: 408;
                transition: stroke-dashoffset 1s ease-out;
            }

            .frm-gauge-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1.8rem;
                font-weight: 700;
                color: var(--bone-white);
            }

            .frm-readiness-label {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                margin-bottom: 8px;
                color: var(--chrome-accent);
            }

            .frm-readiness-desc {
                font-size: 0.8rem;
                color: var(--chrome-accent);
                line-height: 1.4;
            }

            .frm-matches-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .frm-match-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--glass-border);
                border-radius: 6px;
                padding: 16px;
                display: flex;
                gap: 16px;
                transition: all 0.2s;
                position: relative;
            }

            .frm-match-card:hover {
                border-color: rgba(255, 255, 255, 0.15);
                background: rgba(255, 255, 255, 0.04);
            }

            .frm-match-icon {
                font-size: 1.5rem;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid var(--glass-border);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .frm-match-info {
                flex-grow: 1;
            }

            .frm-match-title-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
                flex-wrap: wrap;
                gap: 6px;
            }

            .frm-match-name {
                font-family: 'Space Grotesk', sans-serif;
                font-weight: 700;
                font-size: 1rem;
                color: var(--bone-white);
            }

            .frm-match-badge {
                font-size: 0.7rem;
                font-family: 'JetBrains Mono', monospace;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 600;
            }

            .frm-match-desc {
                font-size: 0.8rem;
                color: var(--chrome-accent);
                line-height: 1.4;
                margin-bottom: 12px;
            }

            .frm-match-specs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                background: rgba(0, 0, 0, 0.15);
                padding: 8px 12px;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.02);
            }

            .frm-spec-item {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .frm-spec-label {
                font-size: 0.65rem;
                color: var(--chrome-accent);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .frm-spec-val {
                font-size: 0.75rem;
                font-family: 'JetBrains Mono', monospace;
                font-weight: 700;
                color: var(--bone-white);
            }

            /* Tooltip or Partner Track Indicator */
            .frm-partner-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
                color: var(--chrome-accent);
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .frm-partner-tag span {
                color: var(--signal-orange);
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);
    }

    init() {
        this.render();
    }

    render() {
        if (this.state.step === 1) {
            this.renderForm();
        } else {
            this.renderResults();
        }
    }

    renderForm() {
        const formattedRev = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(this.state.inputs.monthlyRevenue);
        
        this.container.innerHTML = `
            <div class="frm-header">
                <div class="frm-title-block">
                    <h3>Funding Route Matcher</h3>
                    <p>Underwriting Engine Diagnostic Workspace</p>
                </div>
                <span class="frm-badge-mono">System Matcher v2.0</span>
            </div>

            <div class="frm-form-grid">
                <div class="frm-form-group">
                    <label class="frm-label" for="frm-time">Time In Business</label>
                    <select class="frm-select" id="frm-time">
                        <option value="0-6" ${this.state.inputs.timeInBusiness === '0-6' ? 'selected' : ''}>Pre-Revenue / Under 6 Months</option>
                        <option value="6-12" ${this.state.inputs.timeInBusiness === '6-12' ? 'selected' : ''}>6 to 12 Months</option>
                        <option value="12-24" ${this.state.inputs.timeInBusiness === '12-24' ? 'selected' : ''}>1 to 2 Years</option>
                        <option value="24+" ${this.state.inputs.timeInBusiness === '24+' ? 'selected' : ''}>2+ Years (Established)</option>
                    </select>
                </div>

                <div class="frm-form-group">
                    <label class="frm-label" for="frm-industry">Industry Sector</label>
                    <select class="frm-select" id="frm-industry">
                        <option value="retail" ${this.state.inputs.industry === 'retail' ? 'selected' : ''}>Retail / Brick & Mortar</option>
                        <option value="ecommerce" ${this.state.inputs.industry === 'ecommerce' ? 'selected' : ''}>Ecommerce / SaaS / Digital</option>
                        <option value="construction" ${this.state.inputs.industry === 'construction' ? 'selected' : ''}>Construction & Trades</option>
                        <option value="services" ${this.state.inputs.industry === 'services' ? 'selected' : ''}>Professional Services</option>
                        <option value="other" ${this.state.inputs.industry === 'other' ? 'selected' : ''}>General SMB / Other</option>
                    </select>
                </div>

                <div class="frm-form-group">
                    <label class="frm-label" for="frm-revenue">
                        Monthly Revenue
                        <span class="frm-value-display" id="frm-rev-val">${formattedRev}</span>
                    </label>
                    <input class="frm-input-range" type="range" id="frm-revenue" min="2000" max="250000" step="2000" value="${this.state.inputs.monthlyRevenue}">
                </div>

                <div class="frm-form-group">
                    <label class="frm-label" for="frm-credit">
                        Personal Credit Score
                        <span class="frm-value-display" id="frm-credit-val">${this.state.inputs.creditScore}</span>
                    </label>
                    <input class="frm-input-range" type="range" id="frm-credit" min="500" max="850" step="5" value="${this.state.inputs.creditScore}">
                </div>
            </div>

            <div class="frm-actions">
                <div class="frm-partner-tag" style="margin-right: auto;">
                    Tracking ID: <span>${this.partnerId}</span>
                </div>
                <button class="frm-btn frm-btn-primary" id="frm-calculate-btn">Calculate Best Routes</button>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const revSlider = this.container.querySelector('#frm-revenue');
        const creditSlider = this.container.querySelector('#frm-credit');
        const timeSelect = this.container.querySelector('#frm-time');
        const industrySelect = this.container.querySelector('#frm-industry');
        const calculateBtn = this.container.querySelector('#frm-calculate-btn');

        revSlider.addEventListener('input', (e) => {
            this.state.inputs.monthlyRevenue = parseInt(e.target.value);
            const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(this.state.inputs.monthlyRevenue);
            this.container.querySelector('#frm-rev-val').textContent = formatted;
        });

        creditSlider.addEventListener('input', (e) => {
            this.state.inputs.creditScore = parseInt(e.target.value);
            this.container.querySelector('#frm-credit-val').textContent = this.state.inputs.creditScore;
        });

        calculateBtn.addEventListener('click', () => {
            this.state.inputs.timeInBusiness = timeSelect.value;
            this.state.inputs.industry = industrySelect.value;
            this.calculateResults();
        });
    }

    calculateResults() {
        let score = 0;
        
        // Time in Business points
        const timePoints = { '0-6': 10, '6-12': 25, '12-24': 40, '24+': 60 };
        score += timePoints[this.state.inputs.timeInBusiness] || 10;

        // Revenue points
        if (this.state.inputs.monthlyRevenue >= 150000) score += 40;
        else if (this.state.inputs.monthlyRevenue >= 50000) score += 30;
        else if (this.state.inputs.monthlyRevenue >= 20000) score += 20;
        else if (this.state.inputs.monthlyRevenue >= 10000) score += 10;
        else score += 5;

        // Credit points
        if (this.state.inputs.creditScore >= 720) score += 40;
        else if (this.state.inputs.creditScore >= 660) score += 30;
        else if (this.state.inputs.creditScore >= 600) score += 15;
        else score += 5;

        // Cap maximum diagnostic score
        this.state.score = Math.min(Math.round((score / 140) * 100), 100);

        // Filter / Sort Matches based on rules
        const months = { '0-6': 3, '6-12': 9, '12-24': 18, '24+': 36 }[this.state.inputs.timeInBusiness];
        
        this.state.matches = this.fundingRoutes.map(route => {
            let alignment = 'Low Compatibility';
            let color = 'var(--chrome-accent)';
            let scoreFactor = 0;

            if (this.state.inputs.creditScore >= route.minCredit) scoreFactor += 30;
            if (months >= route.minTime) scoreFactor += 40;
            if (this.state.inputs.monthlyRevenue >= route.minRevenue) scoreFactor += 30;

            if (scoreFactor >= 90) {
                alignment = 'Elite Match';
                color = 'var(--electric-green)';
            } else if (scoreFactor >= 60) {
                alignment = 'Good Match';
                color = 'var(--cobalt-blue)';
            } else if (route.id === 'credit-builder') {
                alignment = 'Suggested Step';
                color = 'var(--signal-orange)';
            }

            return { ...route, alignment, color };
        }).sort((a, b) => {
            const priority = { 'Elite Match': 3, 'Good Match': 2, 'Suggested Step': 1, 'Low Compatibility': 0 };
            return priority[b.alignment] - priority[a.alignment];
        });

        this.state.step = 2;
        this.render();
    }

    renderResults() {
        let label = 'Action Required';
        let desc = 'Your current operating baseline matches setup preparation rules. Start with core credit diagnostics.';
        
        if (this.state.score >= 80) {
            label = 'Elite Funding Ready';
            desc = 'Outstanding underwriting indicators. You qualify directly for prime rate-controlled pathways.';
        } else if (this.state.score >= 50) {
            label = 'Standard Fit';
            desc = 'Solid transaction history profiles. Ready for selective revolving capital lines.';
        }

        this.container.innerHTML = `
            <div class="frm-header">
                <div class="frm-title-block">
                    <h3>Diagnostic Diagnostics & Matching Pipelines</h3>
                    <p>Tracked attribution parameters to Partner Workspace: <strong>${this.partnerId}</strong></p>
                </div>
                <span class="frm-badge-mono" style="color: var(--signal-orange); border-color: rgba(255, 87, 34, 0.25); background: rgba(255, 87, 34, 0.1);">Diagnostic Output</span>
            </div>

            <div class="frm-results-grid">
                <div class="frm-score-card">
                    <span class="frm-readiness-label">Ready Index Score</span>
                    <div class="frm-gauge-wrapper">
                        <svg class="frm-gauge-svg" viewBox="0 0 140 140">
                            <circle class="frm-gauge-bg" cx="70" cy="70" r="65"></circle>
                            <circle class="frm-gauge-fill" id="frm-gauge-circle" cx="70" cy="70" r="65"></circle>
                        </svg>
                        <div class="frm-gauge-text">${this.state.score}%</div>
                    </div>
                    <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; color: var(--electric-green); margin-bottom: 8px;">${label}</h4>
                    <p class="frm-readiness-desc">${desc}</p>
                </div>

                <div class="frm-matches-container">
                    ${this.state.matches.map(match => `
                        <div class="frm-match-card">
                            <div class="frm-match-icon">${match.icon}</div>
                            <div class="frm-match-info">
                                <div class="frm-match-title-row">
                                    <h4 class="frm-match-name">${match.name}</h4>
                                    <span class="frm-match-badge" style="color: ${match.color}; border: 1px solid ${match.color}; background: rgba(255,255,255,0.02);">${match.alignment}</span>
                                </div>
                                <p class="frm-match-desc">${match.description}</p>
                                <div class="frm-match-specs">
                                    <div class="frm-spec-item">
                                        <span class="frm-spec-label">EST. INTEREST RATE</span>
                                        <span class="frm-spec-val" style="color: var(--electric-green);">${match.interestRate}</span>
                                    </div>
                                    <div class="frm-spec-item">
                                        <span class="frm-spec-label">EST. CLOSE TARGET</span>
                                        <span class="frm-spec-val">${match.averageClose}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="frm-actions">
                <button class="frm-btn frm-btn-secondary" id="frm-reset-btn">Adjust Profile Metrics</button>
                <button class="frm-btn frm-btn-primary" id="frm-cta-btn">Submit Structured Underwriting File</button>
            </div>
        `;

        // Animate Circle Gauge
        setTimeout(() => {
            const circle = this.container.querySelector('#frm-gauge-circle');
            if (circle) {
                const radius = 65;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (this.state.score / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
        }, 100);

        this.bindResultsEvents();
    }

    bindResultsEvents() {
        const resetBtn = this.container.querySelector('#frm-reset-btn');
        const ctaBtn = this.container.querySelector('#frm-cta-btn');

        resetBtn.addEventListener('click', () => {
            this.state.step = 1;
            this.render();
        });

        ctaBtn.addEventListener('click', (e) => {
            if (typeof this.onCTAClick === 'function') {
                this.onCTAClick(this.state.inputs, this.partnerId);
            } else {
                // Default high-converting fallback
                alert(`Redirecting to structured application pipeline for Partner ID: "${this.partnerId}" with readiness indicators preserved (Score: ${this.state.score}%)`);
                window.location.href = `https://distilledfunding.com/partners?ref=${encodeURIComponent(this.partnerId)}&score=${this.state.score}`;
            }
        });
    }
}
window.FundingRouteMatcher = FundingRouteMatcher;
