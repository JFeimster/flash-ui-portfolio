/**
 * Neo-Capital Markets | Interactive Cost & Dilution Simulation Engine
 * High-performance, cyber-brutalist financial math and dynamic SVG renderers.
 * Designed to seamlessly blend with the matrix aesthetics of Neo-Markets Core.
 */

window.NeoChartHelper = (function () {
    'use strict';

    // Core Theme Constants matching the Base Component Tailwind config
    const THEME = {
        black: '#000000',
        white: '#ffffff',
        darkBg: '#050508',
        cardBg: '#12121c',
        neoMagenta: '#ff007a',
        neoTeal: '#00f0ff',
        neoLime: '#39ff14',
        neoYellow: '#fffb00',
        gridColor: '#27272a',
        textMuted: '#a1a1aa'
    };

    /**
     * Financial Calculation Engines
     */
    const MathEngine = {
        /**
         * Calculates SaaS Revenue-Based Financing (RBF) Repayment Schedule
         * @param {number} principal - Total funding capital requested
         * @param {number} capMultiplier - Repayment cap (typically 1.1x to 1.5x)
         * @param {number} revSharePct - Monthly revenue share percentage (e.g. 5% = 0.05)
         * @param {number} projectedMonthlyRev - Baseline projected monthly revenue
         * @param {number} monthlyGrowthRate - Estimated MoM revenue growth rate (e.g. 1% = 0.01)
         */
        calculateRBF(principal, capMultiplier = 1.2, revSharePct = 0.08, projectedMonthlyRev = 500000, monthlyGrowthRate = 0.02) {
            const totalRepaymentCap = principal * capMultiplier;
            let remainingCap = totalRepaymentCap;
            let currentRevenue = projectedMonthlyRev;
            const schedule = [];
            let month = 1;
            const maxMonths = 60; // Max safety horizon

            while (remainingCap > 0 && month <= maxMonths) {
                const calculatedPayment = currentRevenue * revSharePct;
                const actualPayment = Math.min(calculatedPayment, remainingCap);
                remainingCap -= actualPayment;

                schedule.push({
                    month,
                    revenue: currentRevenue,
                    payment: actualPayment,
                    balance: remainingCap,
                    cumulativePaid: totalRepaymentCap - remainingCap
                });

                currentRevenue *= (1 + monthlyGrowthRate);
                month++;
            }

            return {
                totalPaid: totalRepaymentCap,
                multiple: capMultiplier,
                effectiveCost: totalRepaymentCap - principal,
                monthsToRepay: month - 1,
                schedule
            };
        },

        /**
         * Calculates Venture Debt Repayment Schedule (Amortized structure with interest-only period option)
         * @param {number} principal - Funding amount
         * @param {number} annualRate - Interest rate (e.g., 0.12 for 12%)
         * @param {number} termMonths - Amortization term in months
         * @param {number} interestOnlyMonths - Interest-only runway period
         * @param {number} warrantCoveragePct - Warrant coverage percentage (dilution impact calculation)
         * @param {number} valuationAtIssuance - Current company valuation for warrant strike calculation
         */
        calculateVentureDebt(principal, annualRate = 0.11, termMonths = 36, interestOnlyMonths = 6, warrantCoveragePct = 0.01, valuationAtIssuance = 25000000) {
            const monthlyRate = annualRate / 12;
            const amortizingMonths = termMonths - interestOnlyMonths;
            let balance = principal;
            const schedule = [];
            let totalInterest = 0;

            // Monthly payment logic for amortization using standard formula
            const monthlyAmortizedPayment = amortizingMonths > 0 
                ? (principal * monthlyRate * Math.pow(1 + monthlyRate, amortizingMonths)) / (Math.pow(1 + monthlyRate, amortizingMonths) - 1)
                : 0;

            for (let month = 1; month <= termMonths; month++) {
                let interestPayment = balance * monthlyRate;
                let principalPayment = 0;

                if (month <= interestOnlyMonths) {
                    principalPayment = 0;
                } else {
                    principalPayment = monthlyAmortizedPayment - interestPayment;
                }

                // Correct for rounding issues at the absolute end
                if (principalPayment > balance || month === termMonths) {
                    principalPayment = balance;
                    interestPayment = balance * monthlyRate;
                }

                balance -= principalPayment;
                totalInterest += interestPayment;

                schedule.push({
                    month,
                    payment: principalPayment + interestPayment,
                    principalPaid: principalPayment,
                    interestPaid: interestPayment,
                    balance: Math.max(0, balance),
                    cumulativePaid: (principal - balance) + totalInterest
                });
            }

            const warrantCost = principal * warrantCoveragePct;
            const warrantDilutionPct = (warrantCost / valuationAtIssuance) * 100;

            return {
                totalPaid: principal + totalInterest,
                totalInterest,
                warrantCost,
                warrantDilutionPct,
                effectiveCost: totalInterest + warrantCost,
                schedule
            };
        },

        /**
         * Calculates Venture Capital Equity Dilution over pricing rounds
         * @param {number} currentValuation - Current Pre-Money Valuation
         * @param {number} capitalToRaise - Proposed investment round size
         * @param {number} optionPoolPct - Allocated option pool expansion (e.g. 10% = 0.10)
         * @param {number} founderSharePct - Current total share owned by founders/existing team
         */
        calculateVCDilution(currentValuation, capitalToRaise, optionPoolPct = 0.10, founderSharePct = 1.0) {
            const postMoneyValuation = currentValuation + capitalToRaise;
            const newInvestorOwnership = capitalToRaise / postMoneyValuation;
            
            // New pool is integrated into pre-money valuation typically, diluting founders further
            const optionPoolFactor = optionPoolPct;
            const postRoundFounderOwnership = founderSharePct * (1 - newInvestorOwnership - optionPoolFactor);
            const postRoundOptionPool = optionPoolFactor * 100;
            const postRoundInvestor = newInvestorOwnership * 100;

            return {
                preMoney: currentValuation,
                postMoney: postMoneyValuation,
                investorOwnershipPct: postRoundInvestor,
                optionPoolPct: postRoundOptionPool,
                founderOwnershipPct: Math.max(0, postRoundFounderOwnership * 100),
                dilutionImpactPct: (1 - (postRoundFounderOwnership / founderSharePct)) * 100
            };
        }
    };

    /**
     * Cyber-Brutalist SVG Charts Generation Utilities
     */
    const GraphicEngine = {
        /**
         * Generates standard SVG header wrapper with cyber-brutalist styling
         */
        createSvgWrapper(width, height, content) {
            return `
                <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto select-none font-mono" xmlns="http://www.w3.org/2000/svg">
                    <style>
                        .axis-label { font-family: monospace; font-size: 10px; fill: ${THEME.textMuted}; font-weight: bold; }
                        .grid-line { stroke: ${THEME.gridColor}; stroke-width: 1.5; stroke-dasharray: 4 4; }
                        .border-line { stroke: ${THEME.black}; stroke-width: 4; }
                        .neon-text { font-family: monospace; font-size: 11px; font-weight: 900; }
                    </style>
                    <!-- Background Solid -->
                    <rect width="100%" height="100%" fill="${THEME.cardBg}" stroke="${THEME.black}" stroke-width="4" />
                    ${content}
                </svg>
            `;
        },

        /**
         * Renders an interactive Line Chart comparing capital repayment trends
         * @param {string} elementId - Target DOM container id
         * @param {Array} rbfSchedule - SaaS RBF data schedule
         * @param {Array} debtSchedule - Venture Debt data schedule
         * @param {number} originalPrincipal - Initial investment base for scale reference
         */
        renderRepaymentChart(elementId, rbfSchedule, debtSchedule, originalPrincipal) {
            const container = document.getElementById(elementId);
            if (!container) return;

            const width = 600;
            const height = 300;
            const padding = { top: 40, right: 30, bottom: 50, left: 75 };

            const chartWidth = width - padding.left - padding.right;
            const chartHeight = height - padding.top - padding.bottom;

            const maxMonths = Math.max(rbfSchedule.length, debtSchedule.length, 12);
            const maxVal = Math.max(
                ...rbfSchedule.map(d => d.cumulativePaid),
                ...debtSchedule.map(d => d.cumulativePaid),
                originalPrincipal * 1.5
            );

            // Helpers to convert data coords to SVG canvas pixels
            const getX = (m) => padding.left + ((m - 1) / (maxMonths - 1)) * chartWidth;
            const getY = (v) => padding.top + chartHeight - (v / maxVal) * chartHeight;

            // Generate structural grid overlay
            let gridLines = '';
            const yTicks = 5;
            for (let i = 0; i <= yTicks; i++) {
                const val = (maxVal / yTicks) * i;
                const y = getY(val);
                gridLines += `
                    <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="grid-line" />
                    <text x="${padding.left - 10}" y="${y + 4}" class="axis-label" text-anchor="end">$${(val / 1000).toFixed(0)}K</text>
                `;
            }

            const xTicks = Math.min(12, maxMonths);
            for (let i = 0; i < xTicks; i++) {
                const month = Math.round((maxMonths / (xTicks - 1)) * i) || 1;
                const x = getX(month);
                gridLines += `
                    <line x1="${x}" y1="${padding.top}" x2="${x}" y2="${height - padding.bottom}" class="grid-line" />
                    <text x="${x}" y="${height - padding.bottom + 20}" class="axis-label" text-anchor="middle">M${month}</text>
                `;
            }

            // Generate Path Lines
            const buildPath = (schedule, color) => {
                if (!schedule.length) return '';
                let pathStr = `M ${getX(1)} ${getY(0)}`;
                schedule.forEach(d => {
                    pathStr += ` L ${getX(d.month)} ${getY(d.cumulativePaid)}`;
                });
                return `
                    <path d="${pathStr}" fill="none" stroke="${THEME.black}" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter" />
                    <path d="${pathStr}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter" />
                `;
            };

            const rbfPath = buildPath(rbfSchedule, THEME.neoMagenta);
            const debtPath = buildPath(debtSchedule, THEME.neoTeal);

            // Brutalist Chart Header & Legend
            const headerMarkup = `
                <!-- Main Header Borders -->
                <rect x="0" y="0" width="${width}" height="32" fill="${THEME.black}" />
                <text x="15" y="21" class="neon-text" fill="${THEME.neoYellow}">⚡ REAL-TIME CUMULATIVE REPAYMENT SIMULATOR</text>
                
                <!-- Legend Blocks -->
                <g transform="translate(${width - 240}, 8)">
                    <!-- Path A (RBF) Legend -->
                    <rect x="0" y="2" width="12" height="12" fill="${THEME.neoMagenta}" stroke="${THEME.white}" stroke-width="1.5" />
                    <text x="18" y="12" class="axis-label" fill="${THEME.white}">RBF (PATH A)</text>
                    
                    <!-- Path B (Debt) Legend -->
                    <rect x="110" y="2" width="12" height="12" fill="${THEME.neoTeal}" stroke="${THEME.white}" stroke-width="1.5" />
                    <text x="128" y="12" class="axis-label" fill="${THEME.white}">DEBT (PATH B)</text>
                </g>

                <!-- Axis Borders -->
                <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="${THEME.black}" stroke-width="4" />
                <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="${THEME.black}" stroke-width="4" />
            `;

            // Final Composition injection
            container.innerHTML = GraphicEngine.createSvgWrapper(width, height, `
                ${gridLines}
                ${rbfPath}
                ${debtPath}
                ${headerMarkup}
            `);
        },

        /**
         * Renders a cyber-brutalist Stacked Allocation Bar Chart showing Cap Table Dilution
         * @param {string} elementId - Target DOM container id
         * @param {Object} vcData - VC dilution data object containing shares distribution
         */
        renderDilutionChart(elementId, vcData) {
            const container = document.getElementById(elementId);
            if (!container) return;

            const width = 600;
            const height = 180;
            const barY = 75;
            const barHeight = 40;
            const padX = 20;
            const barWidth = width - (padX * 2);

            const fW = (vcData.founderOwnershipPct / 100) * barWidth;
            const oW = (vcData.optionPoolPct / 100) * barWidth;
            const iW = (vcData.investorOwnershipPct / 100) * barWidth;

            const content = `
                <!-- Panel Header Bar -->
                <rect x="0" y="0" width="${width}" height="32" fill="${THEME.black}" />
                <text x="15" y="21" class="neon-text" fill="${THEME.neoTeal}">◆ CAP-TABLE EQUITY DILUTION POST-SERIES ALLOCATION</text>

                <!-- Brutalist Stacked Bar with Heavy Offset Shadows -->
                <g>
                    <!-- Stack Shadow Block -->
                    <rect x="${padX + 6}" y="${barY + 6}" width="${barWidth}" height="${barHeight}" fill="${THEME.black}" />
                    
                    <!-- Founders Segment -->
                    <rect x="${padX}" y="${barY}" width="${fW}" height="${barHeight}" fill="${THEME.neoLime}" stroke="${THEME.black}" stroke-width="3" />
                    
                    <!-- Option Pool Segment -->
                    <rect x="${padX + fW}" y="${barY}" width="${oW}" height="${barHeight}" fill="${THEME.neoYellow}" stroke="${THEME.black}" stroke-width="3" />
                    
                    <!-- VC Investors Segment -->
                    <rect x="${padX + fW + oW}" y="${barY}" width="${iW}" height="${barHeight}" fill="${THEME.neoMagenta}" stroke="${THEME.black}" stroke-width="3" />
                </g>

                <!-- Dynamic Percentage Callouts with Connector Terminals -->
                <g transform="translate(0, 145)">
                    <!-- Founder Label -->
                    <text x="${padX + fW/2}" y="12" class="axis-label text-center" text-anchor="middle" fill="${THEME.white}">
                        FOUNDERS: ${vcData.founderOwnershipPct.toFixed(1)}%
                    </text>
                    
                    <!-- Option Pool Label -->
                    <text x="${padX + fW + oW/2}" y="12" class="axis-label text-center" text-anchor="middle" fill="${THEME.white}">
                        POOL: ${vcData.optionPoolPct.toFixed(1)}%
                    </text>
                    
                    <!-- Investor Label -->
                    <text x="${padX + fW + oW + iW/2}" y="12" class="axis-label text-center" text-anchor="middle" fill="${THEME.white}">
                        INVESTORS: ${vcData.investorOwnershipPct.toFixed(1)}%
                    </text>
                </g>
            `;

            container.innerHTML = GraphicEngine.createSvgWrapper(width, height, content);
        }
    };

    // Public API exposing Core Engines and Layout Initializers
    return {
        Math: MathEngine,
        Graphics: GraphicEngine,
        Theme: THEME,

        /**
         * Orchestrated quick-start initializer hook to bind calculation changes
         * @param {Object} config - DOM bindings for live interactive update loops
         */
        bindSimulator({
            sliderId,
            valuationSliderId,
            repaymentContainerId,
            dilutionContainerId,
            metricsUpdateFn
        }) {
            const fundingSlider = document.getElementById(sliderId);
            const valSlider = document.getElementById(valuationSliderId);

            const performUpdate = () => {
                const currentFunding = parseFloat(fundingSlider?.value || 2500000);
                const currentValuation = parseFloat(valSlider?.value || 25000000);

                // Run simulation models dynamically
                const rbfResult = MathEngine.calculateRBF(currentFunding, 1.25, 0.08, 600000, 0.01);
                const debtResult = MathEngine.calculateVentureDebt(currentFunding, 0.12, 36, 6, 0.015, currentValuation);
                const vcResult = MathEngine.calculateVCDilution(currentValuation, currentFunding, 0.10, 1.0);

                // Render High-Performance SVGs
                if (repaymentContainerId) {
                    GraphicEngine.renderRepaymentChart(repaymentContainerId, rbfResult.schedule, debtResult.schedule, currentFunding);
                }
                if (dilutionContainerId) {
                    GraphicEngine.renderDilutionChart(dilutionContainerId, vcResult);
                }

                // Callback execution for extended DOM bindings & numerical displays
                if (typeof metricsUpdateFn === 'function') {
                    metricsUpdateFn({
                        rbfResult,
                        debtResult,
                        vcResult,
                        currentFunding,
                        currentValuation
                    });
                }
            };

            // Bind native UI slider inputs
            if (fundingSlider) {
                fundingSlider.addEventListener('input', performUpdate);
            }
            if (valSlider) {
                valSlider.addEventListener('input', performUpdate);
            }

            // Initial paint execution
            performUpdate();
        }
    };
})();