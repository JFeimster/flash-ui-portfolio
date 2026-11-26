(function() {
    // Inject custom CSS styling for the Neobrutalist Scorecard
    const styles = `
        .mri-scorecard-wrapper {
            background: var(--bg-matte);
            border: 2px solid var(--chrome-border);
            padding: 2.5rem;
            position: relative;
            box-shadow: var(--shadow-neo);
            font-family: var(--font-sans);
            color: var(--bone-white);
            max-width: 1200px;
            margin: 2rem auto;
        }

        .mri-scorecard-wrapper * {
            box-sizing: border-box;
        }

        .mri-header {
            border-bottom: 2px solid var(--chrome-border);
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .mri-header h3 {
            font-size: 1.75rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin: 0;
        }

        .mri-badge {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            background: var(--graphite-gray);
            color: var(--electric-green);
            padding: 4px 10px;
            border: 1px solid var(--chrome-border-bright);
        }

        .mri-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 3rem;
        }

        @media (max-width: 968px) {
            .mri-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
        }

        /* Form styling */
        .mri-form-section {
            display: flex;
            flex-direction: column;
            gap: 1.75rem;
        }

        .mri-field-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .mri-label {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            justify-content: space-between;
        }

        .mri-label span.value {
            color: var(--electric-green);
            font-weight: 700;
        }

        /* Custom Slider */
        .mri-range {
            -webkit-appearance: none;
            width: 100%;
            height: 8px;
            background: var(--graphite-gray);
            border: 1px solid var(--chrome-border);
            outline: none;
        }

        .mri-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: var(--electric-green);
            border: 2px solid var(--bg-black);
            cursor: pointer;
            transition: transform 0.1s;
        }

        .mri-range::-webkit-slider-thumb:hover {
            transform: scale(1.15);
        }

        /* Segmented / Toggle Buttons */
        .mri-segments {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
        }

        .mri-segment-btn {
            background: var(--bg-black);
            border: 1px solid var(--chrome-border);
            color: var(--text-muted);
            font-family: var(--font-mono);
            font-size: 0.75rem;
            padding: 0.75rem 0.5rem;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        }

        .mri-segment-btn:hover {
            border-color: var(--chrome-border-bright);
            color: var(--bone-white);
        }

        .mri-segment-btn.active {
            background: var(--cobalt-blue);
            color: var(--bone-white);
            border-color: var(--bone-white);
            box-shadow: 2px 2px 0px var(--chrome-border);
        }

        /* Select styling */
        .mri-select {
            width: 100%;
            background: var(--bg-black);
            border: 1px solid var(--chrome-border);
            color: var(--bone-white);
            padding: 0.75rem 1rem;
            font-family: var(--font-sans);
            font-size: 0.9rem;
            outline: none;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml;utf8,<svg fill='%238E96A5' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
            background-repeat: no-repeat;
            background-position: right 10px fill-center;
            background-position-x: calc(100% - 12px);
            background-position-y: 50%;
        }

        .mri-select:focus {
            border-color: var(--electric-green);
        }

        /* Results / Display styling */
        .mri-results-col {
            background: var(--bg-black);
            border: 2px solid var(--chrome-border);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
        }

        .mri-gauge-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 2rem;
            position: relative;
        }

        .mri-svg-wrapper {
            position: relative;
            width: 200px;
            height: 120px;
        }

        .mri-gauge-bg {
            fill: none;
            stroke: var(--graphite-gray);
            stroke-width: 14;
            stroke-linecap: round;
        }

        .mri-gauge-fill {
            fill: none;
            stroke: var(--electric-green);
            stroke-width: 14;
            stroke-linecap: round;
            stroke-dasharray: 251.2;
            stroke-dashoffset: 251.2;
            transition: stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s;
        }

        .mri-gauge-val {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            font-family: var(--font-mono);
            font-size: 2rem;
            font-weight: 800;
            color: var(--bone-white);
            text-align: center;
        }

        .mri-gauge-val span {
            display: block;
            font-size: 0.65rem;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-top: -2px;
        }

        .mri-tier-info {
            text-align: center;
            margin-bottom: 1.5rem;
        }

        .mri-tier-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--electric-green);
            margin-bottom: 0.25rem;
        }

        .mri-tier-desc {
            font-size: 0.85rem;
            color: var(--text-muted);
            line-height: 1.4;
        }

        /* Dynamic matching programs list */
        .mri-programs-container {
            border-top: 1px solid var(--chrome-border);
            padding-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .mri-programs-header {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 1rem;
            display: block;
        }

        .mri-program-item {
            background: var(--bg-card);
            border: 1px solid var(--chrome-border);
            padding: 0.75rem 1rem;
            margin-bottom: 0.75rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: border-color 0.2s;
        }

        .mri-program-item:hover {
            border-color: var(--cobalt-blue);
        }

        .mri-program-name {
            font-size: 0.85rem;
            font-weight: 700;
        }

        .mri-program-details {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: var(--electric-green);
        }

        /* Custom dynamic actions */
        .mri-actions {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .mri-btn-cta {
            background: var(--electric-green);
            color: var(--bg-black);
            border: 2px solid var(--electric-green);
            font-family: var(--font-mono);
            font-weight: 700;
            font-size: 0.9rem;
            padding: 1rem;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            display: block;
        }

        .mri-btn-cta:hover {
            transform: translate(-2px, -2px);
            box-shadow: 4px 4px 0px var(--chrome-border-bright);
        }

        .mri-metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .mri-metric-tile {
            background: var(--bg-matte);
            border: 1px solid var(--chrome-border);
            padding: 0.5rem;
            font-size: 0.65rem;
            font-family: var(--font-mono);
            color: var(--text-muted);
        }

        .mri-metric-tile strong {
            display: block;
            color: var(--bone-white);
            font-size: 0.75rem;
            margin-top: 2px;
        }
    `;

    // Inject styles into the document head
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Main Scorecard Constructor Class
    class MoonshineScorecard {
        constructor(containerSelector) {
            this.container = document.querySelector(containerSelector);
            if (!this.container) return;

            // Default State
            this.state = {
                monthlyRevenue: 45000,
                timeInBusiness: '12_24', // Options: '0_6', '6_12', '12_24', '24_plus'
                creditBand: 'good', // Options: 'poor', 'fair', 'good', 'excellent'
                industry: 'saas' // Options: 'saas', 'ecommerce', 'logistics', 'contractors', 'realestate', 'other'
            };

            this.init();
        }

        init() {
            this.render();
            this.bindEvents();
            this.calculateScore();
        }

        render() {
            this.container.innerHTML = `
                <div class="mri-scorecard-wrapper">
                    <div class="mri-header">
                        <div>
                            <h3>Funding Readiness Scorecard</h3>
                        </div>
                        <span class="mri-badge">MOONSHINE CORE SYSTEM v1.2</span>
                    </div>

                    <div class="mri-grid">
                        <!-- Inputs Column -->
                        <div class="mri-form-section">
                            
                            <!-- Monthly Revenue Slider -->
                            <div class="mri-field-group">
                                <label class="mri-label">
                                    <span>Average Monthly Revenue</span>
                                    <span class="value" id="revenue-val">$45,000</span>
                                </label>
                                <input type="range" class="mri-range" id="mri-revenue" min="5000" max="250000" step="5000" value="45000">
                                <div style="display: flex; justify-content: space-between; font-size: 0.65rem; font-family: var(--font-mono); color: var(--text-muted);">
                                    <span>$5,000</span>
                                    <span>$125,000</span>
                                    <span>$250,000+</span>
                                </div>
                            </div>

                            <!-- Time In Business Segments -->
                            <div class="mri-field-group">
                                <label class="mri-label">Time In Business</label>
                                <div class="mri-segments" id="business-time-segments">
                                    <button class="mri-segment-btn" data-val="0_6">&lt; 6 Mos</button>
                                    <button class="mri-segment-btn" data-val="6_12">6-12 Mos</button>
                                    <button class="mri-segment-btn active" data-val="12_24">1-2 Yrs</button>
                                    <button class="mri-segment-btn" data-val="24_plus">2+ Yrs</button>
                                </div>
                            </div>

                            <!-- Credit Band Segments -->
                            <div class="mri-field-group">
                                <label class="mri-label">Estimated Personal Credit</label>
                                <div class="mri-segments" id="credit-segments">
                                    <button class="mri-segment-btn" data-val="poor" title="Under 580">&lt; 580</button>
                                    <button class="mri-segment-btn" data-val="fair" title="580 to 640">580-640</button>
                                    <button class="mri-segment-btn active" data-val="good" title="640 to 700">640-700</button>
                                    <button class="mri-segment-btn" data-val="excellent" title="Over 700">700+</button>
                                </div>
                            </div>

                            <!-- Industry Sector Dropdown -->
                            <div class="mri-field-group">
                                <label class="mri-label">Operational Market Segment</label>
                                <select class="mri-select" id="mri-industry">
                                    <option value="saas">SaaS / Enterprise Tech Services</option>
                                    <option value="ecommerce">Ecommerce / High-Scale Direct-to-Consumer</option>
                                    <option value="logistics">Transportation & Fleet Operations</option>
                                    <option value="contractors">Commercial Contracting & Specialty Trades</option>
                                    <option value="realestate">Real Estate & Asset Portfolios</option>
                                    <option value="other">B2B Professional Services / Other Industries</option>
                                </select>
                            </div>

                            <!-- Metrics Readout Tile Frame -->
                            <div class="mri-metrics-grid">
                                <div class="mri-metric-tile">
                                    Est. Annual Pace
                                    <strong id="metric-annual-run">$540k ARR</strong>
                                </div>
                                <div class="mri-metric-tile">
                                    Capital Route Class
                                    <strong id="metric-route-class">Unsecured Flow</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Results Column -->
                        <div class="mri-results-col">
                            <div>
                                <div class="mri-gauge-container">
                                    <div class="mri-svg-wrapper">
                                        <svg width="200" height="120" viewBox="0 0 200 120">
                                            <!-- Half circular paths -->
                                            <path class="mri-gauge-bg" d="M 20,110 A 80,80 0 0,1 180,110" />
                                            <path class="mri-gauge-fill" id="mri-gauge-stroke" d="M 20,110 A 80,80 0 0,1 180,110" />
                                        </svg>
                                        <div class="mri-gauge-val" id="mri-index-display">
                                            72
                                            <span>Readiness Index</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="mri-tier-info">
                                    <div class="mri-tier-title" id="mri-tier-name">Prime Tier</div>
                                    <div class="mri-tier-desc" id="mri-tier-description">Solid metrics matching our core institutional guidelines. Strong access to non-dilutive solutions.</div>
                                </div>

                                <div class="mri-programs-container">
                                    <span class="mri-programs-header">Matched Funding Routings</span>
                                    <div id="mri-matched-programs">
                                        <!-- Active programs populating dynamically -->
                                    </div>
                                </div>
                            </div>

                            <div class="mri-actions">
                                <a href="#request" class="mri-btn-cta" id="scorecard-main-cta">Secure Execution Route</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        bindEvents() {
            const revSlider = this.container.querySelector('#mri-revenue');
            const industrySelect = this.container.querySelector('#mri-industry');

            // Revenue slider change
            revSlider.addEventListener('input', (e) => {
                this.state.monthlyRevenue = parseInt(e.target.value, 10);
                this.container.querySelector('#revenue-val').textContent = 
                    this.state.monthlyRevenue >= 250000 
                        ? '$250,000+' 
                        : `$${this.state.monthlyRevenue.toLocaleString()}`;
                this.calculateScore();
            });

            // Business Time click segments
            const timeBtns = this.container.querySelectorAll('#business-time-segments .mri-segment-btn');
            timeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    timeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.state.timeInBusiness = btn.getAttribute('data-val');
                    this.calculateScore();
                });
            });

            // Credit segments click
            const creditBtns = this.container.querySelectorAll('#credit-segments .mri-segment-btn');
            creditBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    creditBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.state.creditBand = btn.getAttribute('data-val');
                    this.calculateScore();
                });
            });

            // Industry selection
            industrySelect.addEventListener('change', (e) => {
                this.state.industry = e.target.value;
                this.calculateScore();
            });

            // CTA action routing wrapper
            const ctaBtn = this.container.querySelector('#scorecard-main-cta');
            ctaBtn.addEventListener('click', (e) => {
                if (typeof window.triggerToast === 'function') {
                    window.triggerToast(`Simulating Partner Intake: Forwarding Score of ${this.state.calculatedScore}/100`);
                }
            });
        }

        calculateScore() {
            let score = 0;

            // 1. Revenue scoring: Max 40 points
            const rev = this.state.monthlyRevenue;
            if (rev < 15000) {
                score += 10;
            } else if (rev < 45000) {
                score += 20;
            } else if (rev < 95000) {
                score += 30;
            } else {
                score += 40;
            }

            // 2. Business Time scoring: Max 20 points
            if (this.state.timeInBusiness === '0_6') {
                score += 5;
            } else if (this.state.timeInBusiness === '6_12') {
                score += 10;
            } else if (this.state.timeInBusiness === '12_24') {
                score += 15;
            } else {
                score += 20;
            }

            // 3. Credit scoring: Max 25 points
            if (this.state.creditBand === 'poor') {
                score += 5;
            } else if (this.state.creditBand === 'fair') {
                score += 12;
            } else if (this.state.creditBand === 'good') {
                score += 20;
            } else {
                score += 25;
            }

            // 4. Industry modifier tuning: Max 15 points
            if (this.state.industry === 'saas' || this.state.industry === 'realestate') {
                score += 15;
            } else if (this.state.industry === 'logistics' || this.state.industry === 'ecommerce' || this.state.industry === 'contractors') {
                score += 12;
            } else {
                score += 8;
            }

            this.state.calculatedScore = score;
            this.updateOutputs(score);
        }

        updateOutputs(score) {
            // Update circular SVG gauge stroke
            // Total stroke length is around 251.2 (for half circle: R=80, circum=2*PI*80=502.6. Half-circum=251.2)
            const strokeMax = 251.2;
            const progress = score / 100;
            const offset = strokeMax - (progress * strokeMax);
            
            const fillStroke = this.container.querySelector('#mri-gauge-stroke');
            fillStroke.style.strokeDashoffset = offset;

            // Change progress color based on score health
            if (score < 40) {
                fillStroke.style.stroke = 'var(--signal-orange)';
            } else if (score < 75) {
                fillStroke.style.stroke = 'var(--cobalt-blue)';
            } else {
                fillStroke.style.stroke = 'var(--electric-green)';
            }

            // Update raw number display
            this.container.querySelector('#mri-index-display').innerHTML = `
                ${score}
                <span>Readiness Index</span>
            `;

            // Calculate runrate indicator
            const runRate = (this.state.monthlyRevenue * 12) / 1000;
            this.container.querySelector('#metric-annual-run').textContent = `$${runRate >= 1000 ? (runRate/1000).toFixed(1) + 'M' : runRate + 'k'} ARR`;

            // Classify route based on industry/profile
            let routeClass = 'Unsecured Flow';
            if (this.state.industry === 'realestate') {
                routeClass = 'Asset-Backed';
            } else if (this.state.industry === 'logistics') {
                routeClass = 'Invoice / Equipment';
            } else if (this.state.monthlyRevenue >= 100000 && score > 75) {
                routeClass = 'Tier 1 Executive';
            }
            this.container.querySelector('#metric-route-class').textContent = routeClass;

            // Tier evaluation & Dynamic recommendation content rendering
            const tierName = this.container.querySelector('#mri-tier-name');
            const tierDesc = this.container.querySelector('#mri-tier-description');
            const matchedContainer = this.container.querySelector('#mri-matched-programs');
            const ctaBtn = this.container.querySelector('#scorecard-main-cta');

            let programs = [];

            if (score < 45) {
                tierName.textContent = 'Early Phase Base';
                tierName.style.color = 'var(--signal-orange)';
                tierDesc.textContent = 'High operational potential. Best starting with our Sandbox/Micro options to rapidly scale track records.';
                ctaBtn.textContent = 'Explore Starter Tracks';

                programs = [
                    { name: 'Moonshine Sandbox Credit Line', rate: 'Up to $25,000' },
                    { name: 'Fast-Track Invoice Advance', rate: '90% Immediate Value' }
                ];
            } else if (score < 75) {
                tierName.textContent = 'Standard Strategic';
                tierName.style.color = 'var(--cobalt-blue)';
                tierDesc.textContent = 'Balanced operational records ready for optimized non-dilutive integration routes and revolving credit.';
                ctaBtn.textContent = 'Claim Dynamic Lines';

                // Tune based on industry choice
                if (this.state.industry === 'saas' || this.state.industry === 'ecommerce') {
                    programs = [
                        { name: 'Revenue-Based Growth Line', rate: 'Up to $250,000' },
                        { name: 'SaaS Run-Rate Accelerator', rate: '3.5x Monthly Value' }
                    ];
                } else if (this.state.industry === 'realestate') {
                    programs = [
                        { name: 'Portfolio Bridge Route', rate: 'Max $750,000' },
                        { name: 'Flexible Transaction Finance', rate: '75% LTV Cap' }
                    ];
                } else {
                    programs = [
                        { name: 'Prime Working Capital Flex', rate: 'Up to $150,000' },
                        { name: 'Active Business Line', rate: '6-Month Terms' }
                    ];
                }
            } else {
                tierName.textContent = 'Institutional Elite';
                tierName.style.color = 'var(--electric-green)';
                tierDesc.textContent = 'Outstanding operational parameters. Perfect fit for premium institutional routes and prime non-dilutive cash flow vaults.';
                ctaBtn.textContent = 'Trigger Instant Processing';

                if (this.state.industry === 'realestate') {
                    programs = [
                        { name: 'Premium Multi-Family Syndication Debt', rate: 'Up to $5,000,000' },
                        { name: 'Institutional Term Capital', rate: 'Low-Point Prime' }
                    ];
                } else {
                    programs = [
                        { name: 'Institutional Run-Rate Vault', rate: 'Up to $3,500,000' },
                        { name: 'Elite Revenue Syndication Line', rate: 'Non-Dilutive Cap' }
                    ];
                }
            }

            // Render matching program items
            matchedContainer.innerHTML = programs.map(p => `
                <div class="mri-program-item">
                    <span class="mri-program-name">${p.name}</span>
                    <span class="mri-program-details">${p.rate}</span>
                </div>
            `).join('');
        }
    }

    // Export interface globally
    window.MoonshineScorecard = MoonshineScorecard;

    // Self-initialize if standard target container exists in current document
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('moonshine-scorecard-app')) {
            new MoonshineScorecard('#moonshine-scorecard-app');
        }
    });
})();