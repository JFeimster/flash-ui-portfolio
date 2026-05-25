// Interactive state database of calculators
        const calculatorsData = {
            'business-loan': {
                title: 'Business Loan Payments',
                category: 'Borrower',
                tagClass: 'borrower',
                accentColor: 'cyan',
                inputs: [
                    { label: 'Capital Amount', min: 10000, max: 1000000, step: 5000, default: 150000, unit: '$', id: 'amount' },
                    { label: 'Annual Interest Rate', min: 3, max: 35, step: 0.25, default: 9.5, unit: '%', id: 'rate' },
                    { label: 'Amortization Period', min: 6, max: 60, step: 1, default: 24, unit: ' Mo', id: 'term' }
                ],
                flowNodeLeft: 'Requested Loan',
                flowNodeRight: 'Total Payable',
                outputPrimaryLabel: 'Est. Monthly Payment',
                outputSecondaryLabel: 'Total Capital Cost',
                calculate: (v1, v2, v3) => {
                    const principal = v1;
                    const monthlyRate = (v2 / 100) / 12;
                    const months = v3;
                    
                    let payment = 0;
                    if (monthlyRate === 0) {
                        payment = principal / months;
                    } else {
                        payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
                    }
                    
                    const totalPayable = payment * months;
                    const costOfCapital = totalPayable - principal;
                    
                    return {
                        primary: `$${payment.toLocaleString('en-US', {maximumFractionDigits: 2})}`,
                        secondary: `$${costOfCapital.toLocaleString('en-US', {maximumFractionDigits: 2})}`,
                        nodeLeft: `Recv. $${(principal/1000).toFixed(0)}K`,
                        nodeRight: `Payback $${(totalPayable/1000).toFixed(1)}K`
                    };
                }
            },
            'mca-factor': {
                title: 'MCA Factor Conversion',
                category: 'Borrower',
                tagClass: 'borrower',
                accentColor: 'orange',
                inputs: [
                    { label: 'Advance Amount', min: 5000, max: 500000, step: 2500, default: 50000, unit: '$', id: 'amount' },
                    { label: 'Factor Rate', min: 1.10, max: 1.50, step: 0.01, default: 1.18, unit: 'x', id: 'rate' },
                    { label: 'Expected Term Days', min: 60, max: 360, step: 5, default: 180, unit: ' Days', id: 'term' }
                ],
                flowNodeLeft: 'Cash Upfront',
                flowNodeRight: 'Funder Repayment',
                outputPrimaryLabel: 'Equivalent Est. APR',
                outputSecondaryLabel: 'Repayment Cap Owed',
                calculate: (v1, v2, v3) => {
                    const amount = v1;
                    const factor = v2;
                    const days = v3;
                    const totalPayable = amount * factor;
                    const totalCost = totalPayable - amount;
                    const interestPercentage = totalCost / amount;
                    const daysRatio = 365 / days;
                    const estAPR = interestPercentage * daysRatio * 100;
                    
                    return {
                        primary: `${estAPR.toFixed(1)}% APR`,
                        secondary: `$${totalPayable.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
                        nodeLeft: `Cash $${(amount/1000).toFixed(0)}K`,
                        nodeRight: `Pay $${(totalPayable/1000).toFixed(1)}K`
                    };
                }
            },
            'broker-commission': {
                title: 'Broker Commissions',
                category: 'Broker',
                tagClass: 'broker',
                accentColor: 'magenta',
                inputs: [
                    { label: 'Total Deal Volume', min: 25000, max: 2000000, step: 25000, default: 250000, unit: '$', id: 'amount' },
                    { label: 'Funder Commission Rate', min: 1, max: 15, step: 0.5, default: 6, unit: '%', id: 'rate' },
                    { label: 'Your Agent Share Split', min: 10, max: 100, step: 5, default: 70, unit: '%', id: 'term' }
                ],
                flowNodeLeft: 'Total Funder Commission',
                flowNodeRight: 'Your Agent Net Split',
                outputPrimaryLabel: 'Your Agent Revenue',
                outputSecondaryLabel: 'House Split Retained',
                calculate: (v1, v2, v3) => {
                    const volume = v1;
                    const pct = v2 / 100;
                    const split = v3 / 100;
                    
                    const totalCommission = volume * pct;
                    const agentCommission = totalCommission * split;
                    const houseCommission = totalCommission - agentCommission;
                    
                    return {
                        primary: `$${agentCommission.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
                        secondary: `$${houseCommission.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
                        nodeLeft: `Gross: $${(totalCommission/1000).toFixed(1)}K`,
                        nodeRight: `Agent: $${(agentCommission/1000).toFixed(1)}K`
                    };
                }
            },
            'revenue-financing': {
                title: 'Revenue Financing',
                category: 'Borrower',
                tagClass: 'borrower',
                accentColor: 'cyan',
                inputs: [
                    { label: 'Monthly Gross Revenue', min: 20000, max: 500000, step: 10000, default: 120000, unit: '$', id: 'amount' },
                    { label: 'Funding Requirement', min: 10000, max: 300000, step: 5000, default: 80000, unit: '$', id: 'rate' },
                    { label: 'Repayment Cap Multiple', min: 1.1, max: 1.4, step: 0.02, default: 1.25, unit: 'x', id: 'term' }
                ],
                flowNodeLeft: 'Advance Provided',
                flowNodeRight: 'Repayment Cap',
                outputPrimaryLabel: 'Total Fixed Repayment',
                outputSecondaryLabel: 'Est. Payback Cap',
                calculate: (v1, v2, v3) => {
                    const funding = v2;
                    const multiplier = v3;
                    const totalRepay = funding * multiplier;
                    
                    return {
                        primary: `$${totalRepay.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
                        secondary: `Cap Rate: ${multiplier}x`,
                        nodeLeft: `Funding $${(funding/1000).toFixed(0)}K`,
                        nodeRight: `Repay $${(totalRepay/1000).toFixed(1)}K`
                    };
                }
            },
            'funding-readiness': {
                title: 'Funding Readiness Core',
                category: 'Readiness',
                tagClass: 'readiness',
                accentColor: 'magenta',
                inputs: [
                    { label: 'Time In Business', min: 1, max: 120, step: 1, default: 24, unit: ' Mo', id: 'amount' },
                    { label: 'Owner FICO Score', min: 500, max: 850, step: 5, default: 680, unit: '', id: 'rate' },
                    { label: 'Avg Monthly Balances', min: 1000, max: 100000, step: 1000, default: 15000, unit: '$', id: 'term' }
                ],
                flowNodeLeft: 'Risk Profiler',
                flowNodeRight: 'Readiness Metrics',
                outputPrimaryLabel: 'Calculated Grade',
                outputSecondaryLabel: 'FICO Category Match',
                calculate: (v1, v2, v3) => {
                    const months = v1;
                    const credit = v2;
                    const balance = v3;
                    
                    let score = 0;
                    if (months >= 24) score += 30;
                    else if (months >= 12) score += 15;
                    
                    if (credit >= 720) score += 40;
                    else if (credit >= 650) score += 25;
                    else if (credit >= 600) score += 15;
                    
                    if (balance >= 20000) score += 30;
                    else if (balance >= 10000) score += 15;
                    else if (balance >= 5000) score += 5;
                    
                    let grade = 'HIGH RISK';
                    if (score >= 80) grade = 'GRADE A+ READY';
                    else if (score >= 60) grade = 'GRADE B (PRIME-ish)';
                    else if (score >= 40) grade = 'GRADE C (SUBPRIME)';
                    
                    let match = "B2B Factor Base";
                    if (credit > 700) match = "SBA Bank Rates";
                    else if (credit > 620) match = "Alternative Capital";
                    
                    return {
                        primary: grade,
                        secondary: match,
                        nodeLeft: `FICO Score ${credit}`,
                        nodeRight: `Time ${months}M`
                    };
                }
            },
            'credit-score': {
                title: 'Credit Score Estimator',
                category: 'Readiness',
                tagClass: 'readiness',
                accentColor: 'orange',
                inputs: [
                    { label: 'Trade Payment Lines', min: 1, max: 20, step: 1, default: 5, unit: ' lines', id: 'amount' },
                    { label: 'Years Active Accounts', min: 1, max: 15, step: 0.5, default: 3, unit: ' Yrs', id: 'rate' },
                    { label: 'Late Payments %', min: 0, max: 100, step: 5, default: 10, unit: '%', id: 'term' }
                ],
                flowNodeLeft: 'Accounts',
                flowNodeRight: 'Est Paydex Grade',
                outputPrimaryLabel: 'Estimated Paydex Score',
                outputSecondaryLabel: 'Risk Tier',
                calculate: (v1, v2, v3) => {
                    const lines = v1;
                    const years = v2;
                    const late = v3;
                    
                    let basePaydex = 80;
                    basePaydex -= (late * 0.4);
                    basePaydex += (lines * 1.5);
                    basePaydex += (years * 0.5);
                    basePaydex = Math.min(Math.max(Math.round(basePaydex), 30), 100);
                    
                    let tier = 'CRITICAL RISK';
                    if (basePaydex > 80) tier = 'LOW RISK';
                    else if (basePaydex > 70) tier = 'MODERATE RISK';
                    else if (basePaydex > 50) tier = 'ELEVATED RISK';
                    
                    return {
                        primary: `${basePaydex} / 100`,
                        secondary: tier,
                        nodeLeft: `A/R Days: ${(late * 0.3 + 12).toFixed(0)} Avg`,
                        nodeRight: `${lines} Trade Lines`
                    };
                }
            },
            'dscr': {
                title: 'DSCR Verification',
                category: 'Borrower',
                tagClass: 'borrower',
                accentColor: 'cyan',
                inputs: [
                    { label: 'Net Operating Income', min: 50000, max: 2000000, step: 25000, default: 350000, unit: '$', id: 'amount' },
                    { label: 'Annual Principal Payment', min: 20000, max: 1000000, step: 10000, default: 220000, unit: '$', id: 'rate' },
                    { label: 'Annual Interest Owed', min: 5000, max: 500000, step: 5000, default: 60000, unit: '$', id: 'term' }
                ],
                flowNodeLeft: 'Total Debt Service',
                flowNodeRight: 'Verification Ratio',
                outputPrimaryLabel: 'DSCR Ratio Metric',
                outputSecondaryLabel: 'Feasibility Level',
                calculate: (v1, v2, v3) => {
                    const noi = v1;
                    const debtService = v2 + v3;
                    const dscr = debtService > 0 ? (noi / debtService) : 0;
                    
                    let status = "DECLINED";
                    if (dscr >= 1.35) status = "SUPERIOR ACCEPTANCE";
                    else if (dscr >= 1.25) status = "STANDARD PRICING";
                    else if (dscr >= 1.15) status = "MARGINAL TIER";
                    
                    return {
                        primary: `${dscr.toFixed(2)}x`,
                        secondary: status,
                        nodeLeft: `NOI $${(noi/1000).toFixed(0)}K`,
                        nodeRight: `Debt $${(debtService/1000).toFixed(0)}K`
                    };
                }
            },
            'equipment': {
                title: 'Equipment Lease & ROI',
                category: 'Borrower',
                tagClass: 'borrower',
                accentColor: 'orange',
                inputs: [
                    { label: 'Equipment Invoice Value', min: 5000, max: 500000, step: 5000, default: 120000, unit: '$', id: 'amount' },
                    { label: 'Monthly Productivity Gain', min: 1000, max: 50000, step: 500, default: 8500, unit: '$', id: 'rate' },
                    { label: 'Expected Lease Months', min: 12, max: 84, step: 6, default: 48, unit: ' Mo', id: 'term' }
                ],
                flowNodeLeft: 'Expected Cost',
                flowNodeRight: 'Net Multiplier Benefit',
                outputPrimaryLabel: 'Est. Lease Payment',
                outputSecondaryLabel: 'Monthly Net Return',
                calculate: (v1, v2, v3) => {
                    const cost = v1;
                    const gain = v2;
                    const months = v3;
                    
                    // Simple estimate lease payment assuming ~8.5% interest
                    const r = 0.085 / 12;
                    const payment = (cost * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
                    const netBenefit = gain - payment;
                    
                    return {
                        primary: `$${payment.toLocaleString('en-US', {maximumFractionDigits: 0})}/mo`,
                        secondary: `$${netBenefit.toLocaleString('en-US', {maximumFractionDigits: 0})}/mo net`,
                        nodeLeft: `Lease payment: $${payment.toFixed(0)}`,
                        nodeRight: `Prod gain: +$${gain}`
                    };
                }
            },
            'factoring': {
                title: 'Invoice Factoring',
                category: 'Borrower',
                tagClass: 'borrower',
                accentColor: 'magenta',
                inputs: [
                    { label: 'Total Invoice Value', min: 10000, max: 1000000, step: 10000, default: 150000, unit: '$', id: 'amount' },
                    { label: 'Advance Rate Percentage', min: 70, max: 98, step: 1, default: 85, unit: '%', id: 'rate' },
                    { label: 'Factor Fee (per 30 days)', min: 0.5, max: 5, step: 0.1, default: 1.8, unit: '%', id: 'term' }
                ],
                flowNodeLeft: 'Immediate Advance Paid',
                flowNodeRight: 'Funder Reserve Out',
                outputPrimaryLabel: 'Upfront Cash Advanced',
                outputSecondaryLabel: 'Fee Cost Estimate',
                calculate: (v1, v2, v3) => {
                    const invoice = v1;
                    const advPercent = v2 / 100;
                    const feePercent = v3 / 100;
                    
                    const upfrontAdvance = invoice * advPercent;
                    const feeCost = invoice * feePercent;
                    const remainingReserve = invoice - upfrontAdvance - feeCost;
                    
                    return {
                        primary: `$${upfrontAdvance.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
                        secondary: `Est. Fee: $${feeCost.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
                        nodeLeft: `Cash $${(upfrontAdvance/1000).toFixed(0)}K`,
                        nodeRight: `Reserve $${(remainingReserve/1000).toFixed(0)}K`
                    };
                }
            }
        };

        // Active state variables
        let activeKey = 'business-loan';

        // Elements mapping
        const amountSlider = document.getElementById('amount-slider');
        const rateSlider = document.getElementById('rate-slider');
        const termSlider = document.getElementById('term-slider');
        
        const amountVal = document.getElementById('amount-val');
        const rateVal = document.getElementById('rate-val');
        const termVal = document.getElementById('term-val');

        const sandboxTitle = document.getElementById('sandbox-title');
        const sandboxTag = document.getElementById('sandbox-tag');
        const sandboxInputs = document.getElementById('sandbox-inputs');

        const flowNodeLeft = document.getElementById('flow-node-left');
        const flowNodeRight = document.getElementById('flow-node-right');

        const outputPrimary = document.getElementById('output-primary');
        const outputPrimaryLbl = document.getElementById('output-primary-lbl');
        const outputSecondary = document.getElementById('output-secondary');
        const outputSecondaryLbl = document.getElementById('output-secondary-lbl');

        const toast = document.getElementById('toast');
        const toastText = document.getElementById('toast-text');

        // Notification Helper
        function showNotification(text) {
            toastText.innerText = text;
            toast.classList.add('visible');
            setTimeout(() => {
                toast.classList.remove('visible');
            }, 3000);
        }

        // Initialize state indicators
        const stats = {
            stat1: 9,
            stat2: 100,
            stat3: 1
        };

        // Populate Sandbox dynamically based on Selected Tool
        function loadCalculator(key) {
            if(!calculatorsData[key]) return;
            activeKey = key;

            // Highlight in grid
            document.querySelectorAll('.tool-card').forEach(card => {
                card.classList.remove('selected-active');
                const cardActiveLabel = card.querySelector('.card-footer span:last-child');
                if (cardActiveLabel && cardActiveLabel.innerText === 'ACTIVE') {
                    cardActiveLabel.remove();
                }
            });

            // Find clicked card
            const cards = document.querySelectorAll('.tool-card');
            cards.forEach(card => {
                if (card.getAttribute('onclick').includes(`'${key}'`)) {
                    card.classList.add('selected-active');
                    const footer = card.querySelector('.card-footer');
                    const activeSpan = document.createElement('span');
                    activeSpan.style.fontSize = '11px';
                    activeSpan.style.fontWeight = '700';
                    activeSpan.style.color = 'var(--accent-orange)';
                    activeSpan.innerText = 'ACTIVE';
                    footer.appendChild(activeSpan);
                }
            });

            const config = calculatorsData[key];
            sandboxTitle.innerText = config.title;
            sandboxTag.innerText = config.category.toUpperCase();
            
            // Re-apply style class based on tag category
            sandboxTag.className = 'calc-badge';
            if (config.tagClass === 'broker') {
                sandboxTag.style.borderColor = 'var(--accent-cyan)';
                sandboxTag.style.color = 'var(--accent-cyan)';
                sandboxTag.style.background = 'rgba(0, 240, 255, 0.1)';
            } else if (config.tagClass === 'readiness') {
                sandboxTag.style.borderColor = 'var(--accent-magenta)';
                sandboxTag.style.color = 'var(--accent-magenta)';
                sandboxTag.style.background = 'rgba(255, 0, 122, 0.1)';
            } else {
                sandboxTag.style.borderColor = 'var(--accent-orange)';
                sandboxTag.style.color = 'var(--accent-orange)';
                sandboxTag.style.background = 'rgba(255, 92, 0, 0.1)';
            }

            // Build dynamic input controls inside Sandbox Panel
            sandboxInputs.innerHTML = '';
            config.inputs.forEach((input, index) => {
                const group = document.createElement('div');
                group.className = 'input-group';
                
                const labels = document.createElement('div');
                labels.className = 'input-label-container';
                
                const titleSpan = document.createElement('span');
                titleSpan.innerText = input.label;
                
                const valSpan = document.createElement('span');
                valSpan.className = 'input-val';
                valSpan.id = `dyn-val-${index}`;
                
                let initialFormatted = '';
                if (input.unit === '$') initialFormatted = `$${input.default.toLocaleString()}`;
                else if (input.unit === 'x') initialFormatted = `${input.default}x`;
                else initialFormatted = `${input.default}${input.unit}`;
                
                valSpan.innerText = initialFormatted;

                labels.appendChild(titleSpan);
                labels.appendChild(valSpan);

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = input.min;
                slider.max = input.max;
                slider.step = input.step;
                slider.value = input.default;
                slider.id = `dyn-slider-${index}`;
                slider.className = `range-slider ${index === 1 ? 'orange' : ''}`;

                // Add real-time event listener
                slider.addEventListener('input', (e) => {
                    const parsedVal = parseFloat(e.target.value);
                    if (input.unit === '$') {
                        valSpan.innerText = `$${parsedVal.toLocaleString('en-US', {maximumFractionDigits: 0})}`;
                    } else if (input.unit === 'x') {
                        valSpan.innerText = `${parsedVal}x`;
                    } else {
                        valSpan.innerText = `${parsedVal}${input.unit}`;
                    }
                    triggerCalculation();
                });

                group.appendChild(labels);
                group.appendChild(slider);
                sandboxInputs.appendChild(group);
            });

            // Re-apply static mapping node configurations
            outputPrimaryValueLabel = config.outputPrimaryLabel;
            outputSecondaryValueLabel = config.outputSecondaryLabel;
            
            outputPrimaryLbl.innerText = config.outputPrimaryLabel;
            outputSecondaryLbl.innerText = config.outputSecondaryLabel;

            triggerCalculation();
            showNotification(`Calculated: ${config.title}`);

            // Smooth scroll to terminal visualizer on smaller viewport triggers
            if(window.innerWidth < 1024) {
                document.getElementById('calculator-sandbox').scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Action function to calculate inputs dynamically on visual panels
        function triggerCalculation() {
            const config = calculatorsData[activeKey];
            const val0 = parseFloat(document.getElementById('dyn-slider-0').value);
            const val1 = parseFloat(document.getElementById('dyn-slider-1').value);
            const val2 = parseFloat(document.getElementById('dyn-slider-2').value);

            const results = config.calculate(val0, val1, val2);

            // Set Primary Outputs
            outputPrimary.innerText = results.primary;
            outputSecondary.innerText = results.secondary;

            // Update Dynamic flow chart paths
            flowNodeLeft.innerText = results.nodeLeft;
            flowNodeRight.innerText = results.nodeRight;
        }

        // Initialize default loaded component
        window.addEventListener('load', () => {
            loadCalculator('business-loan');
        });

        // Search engine optimization & filter listeners
        const filterBtns = document.querySelectorAll('.filter-btn');
        const toolCards = document.querySelectorAll('.tool-card');
        const searchInput = document.getElementById('toolSearch');

        function filterTools() {
            const searchTerm = searchInput.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

            toolCards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const desc = card.querySelector('p').innerText.toLowerCase();
                const category = card.dataset.category;
                
                const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
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

        // Core FAQ Dynamic Dropdown accordion
        document.querySelectorAll('.faq-question').forEach(q => {
            q.addEventListener('click', () => {
                const answer = q.nextElementSibling;
                const toggle = q.querySelector('.faq-toggle-icon');
                const isOpen = answer.style.display === 'block';
                
                // close all other items for high fidelity look
                document.querySelectorAll('.faq-answer').forEach(ans => ans.style.display = 'none');
                document.querySelectorAll('.faq-toggle-icon').forEach(t => t.innerText = '+');

                if (!isOpen) {
                    answer.style.display = 'block';
                    toggle.innerText = '-';
                    toggle.style.background = 'var(--accent-magenta)';
                    toggle.style.borderColor = '#000';
                    toggle.style.color = '#000';
                } else {
                    answer.style.display = 'none';
                    toggle.innerText = '+';
                    toggle.style.background = 'var(--bg-tertiary)';
                    toggle.style.color = 'var(--accent-cyan)';
                }
            });
        });