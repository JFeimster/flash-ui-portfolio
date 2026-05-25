/* Filtering Logic */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const toolCards = document.querySelectorAll('.tool-card');
        const searchInput = document.getElementById('toolSearch');

        function filterTools() {
            const searchTerm = searchInput.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

            toolCards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const description = card.querySelector('p').innerText.toLowerCase();
                const category = card.dataset.category;
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesFilter = activeFilter === 'all' || category === activeFilter;
                
                if (matchesSearch && matchesFilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterTools();
            });
        });

        searchInput.addEventListener('input', filterTools);

        /* Accordion Logic */
        document.querySelectorAll('.faq-question').forEach(q => {
            q.addEventListener('click', () => {
                const answer = q.nextElementSibling;
                const isOpen = answer.style.display === 'block';
                answer.style.display = isOpen ? 'none' : 'block';
                q.querySelector('span').innerText = isOpen ? '[+]' : '[-]';
                q.querySelector('span').style.color = isOpen ? 'var(--accent-cyan)' : 'var(--accent-magenta)';
            });
        });

        /* Dynamic Calculators Engine */
        const overlay = document.getElementById('calcOverlay');
        const backdrop = document.getElementById('backdrop');
        const calcName = document.getElementById('calcName');
        const calcBody = document.getElementById('calcBody');

        function openCalculator(type) {
            overlay.classList.add('active');
            backdrop.classList.add('active');
            document.body.style.overflow = 'hidden';

            switch(type) {
                case 'loan':
                    setupLoanCalc();
                    break;
                case 'revenue':
                    setupRevenueCalc();
                    break;
                case 'mca':
                    setupMcaCalc();
                    break;
                case 'commission':
                    setupCommissionCalc();
                    break;
                case 'readiness':
                    setupReadinessCalc();
                    break;
                case 'credit':
                    setupCreditCalc();
                    break;
                case 'dscr':
                    setupDscrCalc();
                    break;
                case 'equipment':
                    setupEquipmentCalc();
                    break;
                case 'factoring':
                    setupFactoringCalc();
                    break;
            }
        }

        function closeCalculator() {
            overlay.classList.remove('active');
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        /* 1. Loan Calculator Implementation */
        function setupLoanCalc() {
            calcName.innerText = "Business Loan Payments";
            calcBody.innerHTML = `
                <div class="calc-group">
                    <label class="calc-label">Loan Principal ($)</label>
                    <input type="number" id="inp_principal" class="calc-input" value="50000" oninput="runLoanCalc()">
                    <input type="range" class="calc-range" min="5000" max="500000" step="5000" value="50000" oninput="syncRangeValue('inp_principal', this.value); runLoanCalc();">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Annual Interest Rate (%)</label>
                    <input type="number" id="inp_rate" class="calc-input" value="8.5" step="0.1" oninput="runLoanCalc()">
                    <input type="range" class="calc-range" min="3" max="35" step="0.5" value="8.5" oninput="syncRangeValue('inp_rate', this.value); runLoanCalc();">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Term Length (Months)</label>
                    <input type="number" id="inp_term" class="calc-input" value="24" oninput="runLoanCalc()">
                    <input type="range" class="calc-range" min="6" max="72" step="6" value="24" oninput="syncRangeValue('inp_term', this.value); runLoanCalc();">
                </div>
                <div class="calc-results">
                    <h4 style="margin-bottom: 15px; text-transform: uppercase;">Estimated Outlay</h4>
                    <div class="calc-result-row">
                        <span>Monthly Payment</span>
                        <span class="calc-result-value" id="res_monthly">$0.00</span>
                    </div>
                    <div class="calc-result-row">
                        <span>Total Interest Cost</span>
                        <span class="calc-result-value" id="res_total_interest">$0.00</span>
                    </div>
                </div>
            `;
            runLoanCalc();
        }

        function runLoanCalc() {
            const p = parseFloat(document.getElementById('inp_principal').value) || 0;
            const r = (parseFloat(document.getElementById('inp_rate').value) || 0) / 100 / 12;
            const n = parseInt(document.getElementById('inp_term').value) || 1;

            let monthly = 0;
            if (r === 0) {
                monthly = p / n;
            } else {
                monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            }
            const totalPay = monthly * n;
            const totalInt = totalPay - p;

            document.getElementById('res_monthly').innerText = "$" + monthly.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('res_total_interest').innerText = "$" + Math.max(0, totalInt).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        /* 2. Revenue Financing Calculator */
        function setupRevenueCalc() {
            calcName.innerText = "Revenue Financing Estimator";
            calcBody.innerHTML = `
                <div class="calc-group">
                    <label class="calc-label">Gross Monthly Revenue ($)</label>
                    <input type="number" id="inp_gross" class="calc-input" value="80000" oninput="runRevenueCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Advance Needed ($)</label>
                    <input type="number" id="inp_advance" class="calc-input" value="40000" oninput="runRevenueCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Repayment Cap Multiplier (x)</label>
                    <input type="number" id="inp_multiplier" class="calc-input" value="1.25" step="0.05" oninput="runRevenueCalc()">
                </div>
                <div class="calc-results">
                    <h4 style="margin-bottom: 15px; text-transform: uppercase;">Financing Terms</h4>
                    <div class="calc-result-row">
                        <span>Total Payback Amount</span>
                        <span class="calc-result-value" id="res_payback">$0.00</span>
                    </div>
                    <div class="calc-result-row">
                        <span>Est. Payment Cap % of Revenue</span>
                        <span class="calc-result-value" id="res_share">8.00%</span>
                    </div>
                </div>
            `;
            runRevenueCalc();
        }

        function runRevenueCalc() {
            const adv = parseFloat(document.getElementById('inp_advance').value) || 0;
            const mult = parseFloat(document.getElementById('inp_multiplier').value) || 1;
            
            const payback = adv * mult;
            const estShare = (adv / payback) * 10; // Dynamic illustrative target metric

            document.getElementById('res_payback').innerText = "$" + payback.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('res_share').innerText = Math.min(25, Math.max(1, estShare)).toFixed(2) + "%";
        }

        /* 3. MCA Factor Rate to APR */
        function setupMcaCalc() {
            calcName.innerText = "MCA Factor Rate to APR Converter";
            calcBody.innerHTML = `
                <div class="calc-group">
                    <label class="calc-label">Advance Funding Amount ($)</label>
                    <input type="number" id="mca_adv" class="calc-input" value="25000" oninput="runMcaCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Factor Rate (e.g., 1.15 to 1.45)</label>
                    <input type="number" id="mca_factor" class="calc-input" value="1.20" step="0.01" oninput="runMcaCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Est. Days to Payoff</label>
                    <input type="number" id="mca_days" class="calc-input" value="180" oninput="runMcaCalc()">
                </div>
                <div class="calc-results">
                    <h4 style="margin-bottom: 15px; text-transform: uppercase;">True Economic Cost</h4>
                    <div class="calc-result-row">
                        <span>Total Repayment Fee</span>
                        <span class="calc-result-value" id="mca_fee">$0.00</span>
                    </div>
                    <div class="calc-result-row">
                        <span>Equivalent Annual APR (Est)</span>
                        <span class="calc-result-value" id="mca_apr">0.00%</span>
                    </div>
                </div>
            `;
            runMcaCalc();
        }

        function runMcaCalc() {
            const adv = parseFloat(document.getElementById('mca_adv').value) || 0;
            const factor = parseFloat(document.getElementById('mca_factor').value) || 1;
            const days = parseFloat(document.getElementById('mca_days').value) || 1;

            const totalRepay = adv * factor;
            const totalFee = totalRepay - adv;

            // Simplified standard MCA APR estimation: (Fee / Principal) * (365 / Term Days)
            let apr = 0;
            if(adv > 0 && days > 0) {
                apr = (totalFee / adv) * (365 / days) * 100;
            }

            document.getElementById('mca_fee').innerText = "$" + totalFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('mca_apr').innerText = apr.toFixed(2) + "%";
        }

        /* 4. Broker Commissions */
        function setupCommissionCalc() {
            calcName.innerText = "Broker Commissions Split Matrix";
            calcBody.innerHTML = `
                <div class="calc-group">
                    <label class="calc-label">Total Funded Deal Volume ($)</label>
                    <input type="number" id="bro_vol" class="calc-input" value="150000" oninput="runBroCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Total Commission Paid by Funder (%)</label>
                    <input type="number" id="bro_pct" class="calc-input" value="8" step="0.5" oninput="runBroCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Your Broker Share Split (%)</label>
                    <input type="number" id="bro_split" class="calc-input" value="70" oninput="runBroCalc()">
                </div>
                <div class="calc-results" style="box-shadow: 6px 6px 0px var(--accent-magenta);">
                    <h4 style="margin-bottom: 15px; text-transform: uppercase;">Commission Allocation</h4>
                    <div class="calc-result-row">
                        <span>Gross Commission Pool</span>
                        <span class="calc-result-value" id="bro_gross">$0.00</span>
                    </div>
                    <div class="calc-result-row">
                        <span>Your Take-home Payout</span>
                        <span class="calc-result-value" id="bro_net" style="color: var(--accent-magenta);">$0.00</span>
                    </div>
                </div>
            `;
            runBroCalc();
        }

        function runBroCalc() {
            const vol = parseFloat(document.getElementById('bro_vol').value) || 0;
            const rate = (parseFloat(document.getElementById('bro_pct').value) || 0) / 100;
            const split = (parseFloat(document.getElementById('bro_split').value) || 0) / 100;

            const gross = vol * rate;
            const net = gross * split;

            document.getElementById('bro_gross').innerText = "$" + gross.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('bro_net').innerText = "$" + net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        /* 5. Funding Readiness Checklist */
        function setupReadinessCalc() {
            calcName.innerText = "Funding Readiness Scorecard";
            calcBody.innerHTML = `
                <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">Toggle parameters to recalculate your banking tier readiness index score.</p>
                <div class="checklist-wrapper">
                    <div class="checklist-item checked" onclick="toggleChecklistItem(this)">
                        <div class="checklist-checkbox">✔</div>
                        <div class="checklist-text">
                            <h4>Operating History > 2 Years</h4>
                            <p>Meets standard minimum longevity parameters for commercial credit assessment.</p>
                        </div>
                    </div>
                    <div class="checklist-item" onclick="toggleChecklistItem(this)">
                        <div class="checklist-checkbox"></div>
                        <div class="checklist-text">
                            <h4>Debt Service Coverage > 1.25x</h4>
                            <p>Cash flows adequately offset all proposed standard payments.</p>
                        </div>
                    </div>
                    <div class="checklist-item checked" onclick="toggleChecklistItem(this)">
                        <div class="checklist-checkbox">✔</div>
                        <div class="checklist-text">
                            <h4>Perfect Entity Legal Standing</h4>
                            <p>Corporate filing has no flags, lien constraints, or tax notices.</p>
                        </div>
                    </div>
                    <div class="checklist-item" onclick="toggleChecklistItem(this)">
                        <div class="checklist-checkbox"></div>
                        <div class="checklist-text">
                            <h4>Owner Credit > 680 FICO</h4>
                            <p>Meets mainstream underwriting threshold targets.</p>
                        </div>
                    </div>
                    <div class="checklist-item" onclick="toggleChecklistItem(this)">
                        <div class="checklist-checkbox"></div>
                        <div class="checklist-text">
                            <h4>No Unresolved UCC-1 Liens</h4>
                            <p>Previous lenders have discharged priorities correctly.</p>
                        </div>
                    </div>
                </div>
                <div class="calc-results" style="box-shadow: 6px 6px 0px var(--accent-yellow);">
                    <div class="calc-result-row">
                        <span>Readiness Level Indicator</span>
                        <span class="calc-result-value" id="readiness_score">40% Readiness</span>
                    </div>
                </div>
            `;
            calculateReadiness();
        }

        function toggleChecklistItem(elem) {
            elem.classList.toggle('checked');
            const box = elem.querySelector('.checklist-checkbox');
            if(elem.classList.contains('checked')) {
                box.innerText = "✔";
            } else {
                box.innerText = "";
            }
            calculateReadiness();
        }

        function calculateReadiness() {
            const total = document.querySelectorAll('.checklist-item').length;
            const checked = document.querySelectorAll('.checklist-item.checked').length;
            const pct = Math.round((checked / total) * 100);
            
            let label = "Sub-Optimal Structure";
            if (pct >= 80) label = "Tier-1 Ready";
            else if (pct >= 50) label = "Conditional Fit";

            document.getElementById('readiness_score').innerText = `${pct}% (${label})`;
        }

        /* 6. Credit Score Estimator */
        function setupCreditCalc() {
            calcName.innerText = "Credit Score Estimator";
            calcBody.innerHTML = `
                <div class="calc-group">
                    <label class="calc-label">Existing Trade Lines / Accounts</label>
                    <input type="number" id="cred_lines" class="calc-input" value="3" oninput="runCreditCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Percentage of On-Time Payments</label>
                    <input type="number" id="cred_ontime" class="calc-input" value="95" max="100" min="0" oninput="runCreditCalc()">
                </div>
                <div class="calc-results">
                    <h4 style="margin-bottom: 15px; text-transform: uppercase;">Estimated Commercial Indexes</h4>
                    <div class="calc-result-row">
                        <span>Est Paydex Score (D&B)</span>
                        <span class="calc-result-value" id="cred_paydex">75</span>
                    </div>
                    <div class="calc-result-row">
                        <span>Risk Classification</span>
                        <span class="calc-result-value" id="cred_risk" style="color: var(--accent-magenta);">Moderate Risk</span>
                    </div>
                </div>
            `;
            runCreditCalc();
        }

        function runCreditCalc() {
            const pct = parseFloat(document.getElementById('cred_ontime').value) || 0;
            const lines = parseInt(document.getElementById('cred_lines').value) || 0;

            // Simplified calculation logic for illustrative Paydex scoring
            let paydex = Math.round((pct / 100) * 80);
            if(lines >= 5) paydex += 10;
            if(paydex > 100) paydex = 100;

            let risk = "High Risk";
            if (paydex > 80) risk = "Low Risk";
            else if (paydex > 60) risk = "Moderate Risk";

            document.getElementById('cred_paydex').innerText = paydex;
            document.getElementById('cred_risk').innerText = risk;
        }

        /* 7. DSCR Calculator */
        function setupDscrCalc() {
            calcName.innerText = "Debt Service Coverage Ratio (DSCR)";
            calcBody.innerHTML = `
                <div class="calc-group">
                    <label class="calc-label">Net Operating Income (Annual NOI)</label>
                    <input type="number" id="dscr_noi" class="calc-input" value="120000" oninput="runDscrCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Annual Debt Service</label>
                    <input type="number" id="dscr_debt" class="calc-input" value="95000" oninput="runDscrCalc()">
                </div>
                <div class="calc-results">
                    <h4 style="margin-bottom: 15px; text-transform: uppercase;">Lender Evaluation Matrix</h4>
                    <div class="calc-result-row">
                        <span>Resulting DSCR</span>
                        <span class="calc-result-value" id="dscr_ratio">1.26x</span>
                    </div>
                    <div class="calc-result-row">
                        <span>Lender Status</span>
                        <span class="calc-result-value" id="dscr_status">Approved Profile</span>
                    </div>
                </div>
            `;
            runDscrCalc();
        }

        function runDscrCalc() {
            const noi = parseFloat(document.getElementById('dscr_noi').value) || 0;
            const debt = parseFloat(document.getElementById('dscr_debt').value) || 1;

            const ratio = noi / debt;
            let status = "Needs Restructuring";
            if (ratio >= 1.25) status = "Strong Position";
            else if (ratio >= 1.15) status = "Marginal Approvals";

            document.getElementById('dscr_ratio').innerText = ratio.toFixed(2) + "x";
            document.getElementById('dscr_status').innerText = status;
        }

        /* 8. Equipment Financing */
        function setupEquipmentCalc() {
            calcName.innerText = "Equipment ROI & Lease Estimator";
            calcBody.innerHTML = `
                <div class="calc-group">
                    <label class="calc-label">Asset Price / Quote ($)</label>
                    <input type="number" id="eq_price" class="calc-input" value="75000" oninput="runEqCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Monthly Gross Revenue Gain via Equipment</label>
                    <input type="number" id="eq_gain" class="calc-input" value="4500" oninput="runEqCalc()">
                </div>
                <div class="calc-results">
                    <h4 style="margin-bottom: 15px; text-transform: uppercase;">Equipment Economics</h4>
                    <div class="calc-result-row">
                        <span>Est. Monthly Lease Outlay</span>
                        <span class="calc-result-value" id="eq_payment">$0.00</span>
                    </div>
                    <div class="calc-result-row">
                        <span>Net Monthly Return On Asset</span>
                        <span class="calc-result-value" id="eq_roi" style="color: var(--accent-cyan);">$0.00</span>
                    </div>
                </div>
            `;
            runEqCalc();
        }

        function runEqCalc() {
            const price = parseFloat(document.getElementById('eq_price').value) || 0;
            const gain = parseFloat(document.getElementById('eq_gain').value) || 0;

            // Simplified average commercial equipment leasing model: ~2.5% of asset price as monthly payment
            const payment = price * 0.024;
            const netRoi = gain - payment;

            document.getElementById('eq_payment').innerText = "$" + payment.toLocaleString(undefined, {maximumFractionDigits: 0});
            document.getElementById('eq_roi').innerText = "$" + netRoi.toLocaleString(undefined, {maximumFractionDigits: 0});
        }

        /* 9. Invoice Factoring */
        function setupFactoringCalc() {
            calcName.innerText = "Invoice Factoring Cost Estimator";
            calcBody.innerHTML = `
                <div class="calc-group">
                    <label class="calc-label">Gross Value of Invoices ($)</label>
                    <input type="number" id="fac_val" class="calc-input" value="100000" oninput="runFacCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Advance Rate Percentage (%)</label>
                    <input type="number" id="fac_adv" class="calc-input" value="85" oninput="runFacCalc()">
                </div>
                <div class="calc-group">
                    <label class="calc-label">Monthly Factoring Fee Rate (%)</label>
                    <input type="number" id="fac_fee" class="calc-input" value="2.5" step="0.1" oninput="runFacCalc()">
                </div>
                <div class="calc-results">
                    <h4 style="margin-bottom: 15px; text-transform: uppercase;">Advancing Cash Matrix</h4>
                    <div class="calc-result-row">
                        <span>Immediate Cash Advanced</span>
                        <span class="calc-result-value" id="fac_cash">$0.00</span>
                    </div>
                    <div class="calc-result-row">
                        <span>Monthly Factoring Fee Cost</span>
                        <span class="calc-result-value" id="fac_cost">$0.00</span>
                    </div>
                </div>
            `;
            runFacCalc();
        }

        function runFacCalc() {
            const val = parseFloat(document.getElementById('fac_val').value) || 0;
            const advRate = (parseFloat(document.getElementById('fac_adv').value) || 0) / 100;
            const feeRate = (parseFloat(document.getElementById('fac_fee').value) || 0) / 100;

            const cash = val * advRate;
            const cost = val * feeRate;

            document.getElementById('fac_cash').innerText = "$" + cash.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('fac_cost').innerText = "$" + cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        /* Helper to keep sliders synced with digital values on the fly */
        function syncRangeValue(targetId, val) {
            document.getElementById(targetId).value = val;
        }