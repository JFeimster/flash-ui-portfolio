(function () {
    // Inject custom styles needed for the scorecard widget
    const styles = `
        .scorecard-glow-green {
            box-shadow: 0 0 25px rgba(57, 255, 20, 0.2);
        }
        .scorecard-glow-orange {
            box-shadow: 0 0 25px rgba(255, 87, 34, 0.2);
        }
        .scorecard-glow-blue {
            box-shadow: 0 0 25px rgba(41, 121, 255, 0.2);
        }
        .transition-all-300 {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Main Scorecard Engine Setup
    const ScorecardEngine = {
        currentStep: 1,
        totalSteps: 4,
        formData: {
            revenue: null,
            timeInBusiness: null,
            creditScore: null,
            industry: null
        },

        // Metric score mappings
        metrics: {
            revenue: {
                under10k: { score: 10, label: "Under $10k/mo" },
                tenToFiftyk: { score: 25, label: "$10k - $50k/mo" },
                fiftyToOneFiftyk: { score: 35, label: "$50k - $150k/mo" },
                overOneFiftyk: { score: 45, label: "$150k+/mo" }
            },
            timeInBusiness: {
                under6m: { score: 5, label: "Less than 6 Months" },
                sixToTwelvem: { score: 15, label: "6 - 12 Months" },
                oneToTwoy: { score: 25, label: "1 - 2 Years" },
                overTwoy: { score: 35, label: "2+ Years" }
            },
            creditScore: {
                poor: { score: 5, label: "Poor (< 600)" },
                fair: { score: 12, label: "Fair (600 - 659)" },
                good: { score: 20, label: "Good (660 - 719)" },
                excellent: { score: 25, label: "Excellent (720+)" }
            },
            industry: {
                ecommerce: { label: "E-Commerce & Digital" },
                contractor: { label: "Construction & Contracting" },
                retail: { label: "Retail & Hospitality" },
                professional: { label: "Professional Services" },
                realestate: { label: "Real Estate Investment" }
            }
        },

        init() {
            const root = document.getElementById("readiness-scorecard-root");
            if (!root) {
                console.warn("Moonshine Scorecard: Target element '#readiness-scorecard-root' not found.");
                return;
            }
            this.container = root;
            this.loadStoredProgress();
            this.render();
        },

        loadStoredProgress() {
            const stored = localStorage.getItem("moonshine_scorecard_data");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    this.formData = parsed;
                    // Skip to results if already filled out completely
                    if (parsed.revenue && parsed.timeInBusiness && parsed.creditScore && parsed.industry) {
                        this.currentStep = 5;
                    }
                } catch (e) {
                    console.error("Error parsing stored scorecard data", e);
                }
            }
        },

        saveProgress() {
            localStorage.setItem("moonshine_scorecard_data", JSON.stringify(this.formData));
        },

        reset() {
            this.formData = { revenue: null, timeInBusiness: null, creditScore: null, industry: null };
            this.currentStep = 1;
            localStorage.removeItem("moonshine_scorecard_data");
            this.render();
        },

        handleSelection(field, value) {
            this.formData[field] = value;
            this.saveProgress();
            this.nextStep();
        },

        nextStep() {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.render();
            } else if (this.currentStep === this.totalSteps) {
                // Generate results state
                this.currentStep = 5;
                this.render();
            }
        },

        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
                this.render();
            }
        },

        calculateResults() {
            const revVal = this.metrics.revenue[this.formData.revenue] ? this.metrics.revenue[this.formData.revenue].score : 0;
            const tibVal = this.metrics.timeInBusiness[this.formData.timeInBusiness] ? this.metrics.timeInBusiness[this.formData.timeInBusiness].score : 0;
            const credVal = this.metrics.creditScore[this.formData.creditScore] ? this.metrics.creditScore[this.formData.creditScore].score : 0;

            const totalPossible = 105;
            const totalScoreRaw = revVal + tibVal + credVal;
            const scorePercentage = Math.min(100, Math.round((totalScoreRaw / totalPossible) * 100));

            // Determine Grade
            let grade = "C";
            let statusText = "Requires Direct Underwriter Review";
            let colorClass = "text-signalOrange";
            let glowClass = "scorecard-glow-orange";
            let borderAccent = "border-t-signalOrange";

            if (scorePercentage >= 80) {
                grade = "A";
                statusText = "Excellent Fast-Track Standing";
                colorClass = "text-electricGreen";
                glowClass = "scorecard-glow-green";
                borderAccent = "border-t-electricGreen";
            } else if (scorePercentage >= 50) {
                grade = "B";
                statusText = "Strong Funding Match";
                colorClass = "text-cobaltBlue";
                glowClass = "scorecard-glow-blue";
                borderAccent = "border-t-cobaltBlue";
            }

            // Determine Optimal Routes
            const routes = [];
            if (this.formData.industry === "ecommerce" && scorePercentage >= 40) {
                routes.push({
                    title: "Revenue-Based Financing (RBF)",
                    desc: "Leverage your monthly sales volume for flexible repayment options that align with your digital cashflow cycles."
                });
            }
            if (this.formData.timeInBusiness === "overTwoy" && scorePercentage >= 70) {
                routes.push({
                    title: "SBA Fast-Track / Low-Rate Lines",
                    desc: "Eligible for premium tier bank-rate capital. Optimal for inventory purchases, growth hires, and real estate options."
                });
            }
            if (this.formData.revenue !== "under10k" && (this.formData.creditScore === "poor" || this.formData.creditScore === "fair")) {
                routes.push({
                    title: "Merchant Cash Advance (MCA) / Invoice Factoring",
                    desc: "Optimal pathway focusing directly on your asset receipts and merchant transaction volume over traditional credit limits."
                });
            }
            if (this.formData.industry === "contractor" && this.formData.timeInBusiness !== "under6m") {
                routes.push({
                    title: "Contract/Equipment Bridge Finance",
                    desc: "Custom milestone funding built on commercial contract invoices or heavy equipment acquisitions."
                });
            }
            if (routes.length === 0) {
                routes.push({
                    title: "Micro Business Line of Credit",
                    desc: "Flexible small-scale working capital line to begin establishing commercial credit lines under Moonshine monitoring."
                });
            }

            // Generate customized checklist
            const checklist = ["6 Months Official Bank Statements", "Voided Business Check"];
            if (this.formData.revenue === "fiftyToOneFiftyk" || this.formData.revenue === "overOneFiftyk" || this.formData.timeInBusiness === "overTwoy") {
                checklist.push("Last 2 Years Business Tax Returns");
                checklist.push("Recent Year-to-Date Profit & Loss Statement");
            }
            if (this.formData.industry === "ecommerce") {
                checklist.push("Digital Merchant Gateway API / Connect Verification Token");
            }
            if (this.formData.industry === "contractor") {
                checklist.push("Active Project Work backlog & Job Costs sheet");
            }
            if (this.formData.industry === "realestate") {
                checklist.push("Purchase & Sale Agreement or Asset Appraisal documents");
            }

            return {
                score: scorePercentage,
                grade,
                statusText,
                colorClass,
                glowClass,
                borderAccent,
                routes,
                checklist
            };
        },

        render() {
            this.container.innerHTML = "";
            
            // Build visual outer container mapping base style guide
            const widgetShell = document.createElement("div");
            widgetShell.className = "glass-panel rounded-xl border border-glassBorder overflow-hidden shadow-2xl relative w-full text-boneWhite font-sans transition-all-300";
            
            // Neon accent bar matching visual flow
            const topAccent = document.createElement("div");
            topAccent.className = "h-1 w-full bg-gradient-to-r from-electricGreen via-cobaltBlue to-signalOrange";
            widgetShell.appendChild(topAccent);

            const contentWrapper = document.createElement("div");
            contentWrapper.className = "p-6 md:p-8 space-y-6";

            // If we are showing progress steps (1 to 4)
            if (this.currentStep <= this.totalSteps) {
                // Render Step Progress Header
                const progressHeader = document.createElement("div");
                progressHeader.className = "flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-glassBorder pb-4 gap-2";
                
                const progressTitle = document.createElement("div");
                progressTitle.innerHTML = `
                    <span class="text-electricGreen font-mono text-[10px] uppercase tracking-widest block">// UNDERWRITING PROTOCOL</span>
                    <h3 class="font-display font-bold text-lg text-white">Interactive Funding Readiness Scorecard</h3>
                `;
                
                const stepIndicator = document.createElement("span");
                stepIndicator.className = "text-xs font-mono text-boneWhite/40 bg-graphiteGray px-3 py-1.5 rounded border border-glassBorder";
                stepIndicator.innerText = `STEP ${this.currentStep} OF ${this.totalSteps}`;

                progressHeader.appendChild(progressTitle);
                progressHeader.appendChild(stepIndicator);
                contentWrapper.appendChild(progressHeader);

                // Segmented progress bar
                const barContainer = document.createElement("div");
                barContainer.className = "w-full bg-matteBlack h-1.5 rounded-full overflow-hidden flex gap-1";
                for (let i = 1; i <= this.totalSteps; i++) {
                    const segment = document.createElement("div");
                    segment.className = `h-full flex-1 transition-all-300 ${i <= this.currentStep ? "bg-electricGreen shadow-[0_0_10px_rgba(57,255,20,0.5)]" : "bg-glassBorder"}`;
                    barContainer.appendChild(segment);
                }
                contentWrapper.appendChild(barContainer);

                // Step Specific Content
                const stepBody = document.createElement("div");
                stepBody.className = "py-4";

                if (this.currentStep === 1) {
                    stepBody.appendChild(this.renderStep1());
                } else if (this.currentStep === 2) {
                    stepBody.appendChild(this.renderStep2());
                } else if (this.currentStep === 3) {
                    stepBody.appendChild(this.renderStep3());
                } else if (this.currentStep === 4) {
                    stepBody.appendChild(this.renderStep4());
                }

                contentWrapper.appendChild(stepBody);

                // Footer Navigation Links
                const footerNav = document.createElement("div");
                footerNav.className = "flex justify-between items-center border-t border-glassBorder pt-6 mt-4";
                
                if (this.currentStep > 1) {
                    const prevBtn = document.createElement("button");
                    prevBtn.className = "border border-glassBorder hover:border-white text-boneWhite/80 px-5 py-2.5 rounded text-xs font-mono uppercase tracking-wider transition-all-300";
                    prevBtn.innerText = "← Back";
                    prevBtn.onclick = () => this.prevStep();
                    footerNav.appendChild(prevBtn);
                } else {
                    const placeholder = document.createElement("div");
                    footerNav.appendChild(placeholder);
                }

                const resetBtn = document.createElement("button");
                resetBtn.className = "text-[10px] font-mono text-boneWhite/30 hover:text-white uppercase tracking-wider transition-colors";
                resetBtn.innerText = "Reset Progress";
                resetBtn.onclick = () => this.reset();
                footerNav.appendChild(resetBtn);

                contentWrapper.appendChild(footerNav);

            } else {
                // Render Results Screen
                contentWrapper.appendChild(this.renderResults());
            }

            widgetShell.appendChild(contentWrapper);
            this.container.appendChild(widgetShell);
        },

        // Render functions for individual wizard step forms
        renderStep1() {
            const container = document.createElement("div");
            container.className = "space-y-4";
            container.innerHTML = `<p class="text-sm text-boneWhite/70 leading-relaxed">Select average verifiable monthly sales or receipts generated under your corporate operations:</p>`;
            
            const grid = document.createElement("div");
            grid.className = "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2";

            Object.keys(this.metrics.revenue).forEach(key => {
                const opt = this.metrics.revenue[key];
                const btn = document.createElement("button");
                const isSelected = this.formData.revenue === key;
                btn.className = `p-4 rounded-lg border text-left flex items-center justify-between transition-all-300 group ${isSelected ? "border-electricGreen bg-electricGreen/5" : "border-glassBorder hover:border-electricGreen hover:bg-white/5"}`;
                btn.innerHTML = `
                    <div>
                        <span class="block text-sm font-bold font-display ${isSelected ? "text-electricGreen" : "text-white group-hover:text-electricGreen"}">${opt.label}</span>
                        <span class="block text-[10px] font-mono text-boneWhite/40 uppercase mt-0.5">Base score weight: +${opt.score}</span>
                    </div>
                    <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all-300 ${isSelected ? "border-electricGreen bg-electricGreen" : "border-glassBorder"}">
                        ${isSelected ? '<div class="w-1.5 h-1.5 rounded-full bg-matteBlack"></div>' : ""}
                    </div>
                `;
                btn.onclick = () => this.handleSelection("revenue", key);
                grid.appendChild(btn);
            });

            container.appendChild(grid);
            return container;
        },

        renderStep2() {
            const container = document.createElement("div");
            container.className = "space-y-4";
            container.innerHTML = `<p class="text-sm text-boneWhite/70 leading-relaxed">How long has your business entity been operational and incorporated?</p>`;
            
            const grid = document.createElement("div");
            grid.className = "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2";

            Object.keys(this.metrics.timeInBusiness).forEach(key => {
                const opt = this.metrics.timeInBusiness[key];
                const btn = document.createElement("button");
                const isSelected = this.formData.timeInBusiness === key;
                btn.className = `p-4 rounded-lg border text-left flex items-center justify-between transition-all-300 group ${isSelected ? "border-cobaltBlue bg-cobaltBlue/5" : "border-glassBorder hover:border-cobaltBlue hover:bg-white/5"}`;
                btn.innerHTML = `
                    <div>
                        <span class="block text-sm font-bold font-display ${isSelected ? "text-cobaltBlue" : "text-white group-hover:text-cobaltBlue"}">${opt.label}</span>
                        <span class="block text-[10px] font-mono text-boneWhite/40 uppercase mt-0.5">Base score weight: +${opt.score}</span>
                    </div>
                    <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all-300 ${isSelected ? "border-cobaltBlue bg-cobaltBlue" : "border-glassBorder"}">
                        ${isSelected ? '<div class="w-1.5 h-1.5 rounded-full bg-matteBlack"></div>' : ""}
                    </div>
                `;
                btn.onclick = () => this.handleSelection("timeInBusiness", key);
                grid.appendChild(btn);
            });

            container.appendChild(grid);
            return container;
        },

        renderStep3() {
            const container = document.createElement("div");
            container.className = "space-y-4";
            container.innerHTML = `<p class="text-sm text-boneWhite/70 leading-relaxed">Select estimated FICO credit range of primary managing business owner(s):</p>`;
            
            const grid = document.createElement("div");
            grid.className = "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2";

            Object.keys(this.metrics.creditScore).forEach(key => {
                const opt = this.metrics.creditScore[key];
                const btn = document.createElement("button");
                const isSelected = this.formData.creditScore === key;
                btn.className = `p-4 rounded-lg border text-left flex items-center justify-between transition-all-300 group ${isSelected ? "border-signalOrange bg-signalOrange/5" : "border-glassBorder hover:border-signalOrange hover:bg-white/5"}`;
                btn.innerHTML = `
                    <div>
                        <span class="block text-sm font-bold font-display ${isSelected ? "text-signalOrange" : "text-white group-hover:text-signalOrange"}">${opt.label}</span>
                        <span class="block text-[10px] font-mono text-boneWhite/40 uppercase mt-0.5">Base score weight: +${opt.score}</span>
                    </div>
                    <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all-300 ${isSelected ? "border-signalOrange bg-signalOrange" : "border-glassBorder"}">
                        ${isSelected ? '<div class="w-1.5 h-1.5 rounded-full bg-matteBlack"></div>' : ""}
                    </div>
                `;
                btn.onclick = () => this.handleSelection("creditScore", key);
                grid.appendChild(btn);
            });

            container.appendChild(grid);
            return container;
        },

        renderStep4() {
            const container = document.createElement("div");
            container.className = "space-y-4";
            container.innerHTML = `<p class="text-sm text-boneWhite/70 leading-relaxed">What industry classification represents the core revenue source for the entity?</p>`;
            
            const grid = document.createElement("div");
            grid.className = "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2";

            Object.keys(this.metrics.industry).forEach(key => {
                const opt = this.metrics.industry[key];
                const btn = document.createElement("button");
                const isSelected = this.formData.industry === key;
                btn.className = `p-4 rounded-lg border text-left flex items-center justify-between transition-all-300 group ${isSelected ? "border-electricGreen bg-electricGreen/5" : "border-glassBorder hover:border-electricGreen hover:bg-white/5"}`;
                btn.innerHTML = `
                    <div>
                        <span class="block text-sm font-bold font-display ${isSelected ? "text-electricGreen" : "text-white group-hover:text-electricGreen"}">${opt.label}</span>
                    </div>
                    <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all-300 ${isSelected ? "border-electricGreen bg-electricGreen" : "border-glassBorder"}">
                        ${isSelected ? '<div class="w-1.5 h-1.5 rounded-full bg-matteBlack"></div>' : ""}
                    </div>
                `;
                btn.onclick = () => this.handleSelection("industry", key);
                grid.appendChild(btn);
            });

            container.appendChild(grid);
            return container;
        },

        // Process results state markup logic
        renderResults() {
            const data = this.calculateResults();

            // Set state variables in storage for persistence
            const resContainer = document.createElement("div");
            resContainer.className = "space-y-8";

            // Header of results sheet
            resContainer.innerHTML = `
                <div class="flex justify-between items-center border-b border-glassBorder pb-4">
                    <div>
                        <span class="text-electricGreen font-mono text-[10px] uppercase tracking-widest block">// UNDERWRITING DISCLOSURE</span>
                        <h3 class="font-display font-black text-xl text-white">Diagnostics Report Calculated</h3>
                    </div>
                    <button id="scorecard-reset-btn" class="bg-glassBorder hover:bg-white/10 text-boneWhite/80 px-4 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all-300">
                        Start Over
                    </button>
                </div>
            `;

            // Grid structure: Radial Score Panel (Left) & Route Breakdown (Right)
            const mainGrid = document.createElement("div");
            mainGrid.className = "grid grid-cols-1 lg:grid-cols-12 gap-8";

            // Left: Score Indicator Panel
            const scoreCardPanel = document.createElement("div");
            scoreCardPanel.className = "lg:col-span-4 p-6 bg-matteBlack/40 rounded-xl border border-glassBorder flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden";
            scoreCardPanel.innerHTML = `
                <div class="absolute -top-10 -left-10 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-xl ${data.glowClass}"></div>
                <span class="text-[10px] font-mono text-boneWhite/40 uppercase tracking-widest block">// PORTAL STAGE</span>
                <div class="relative w-36 h-36 rounded-full border-4 border-dashed border-glassBorder flex flex-col items-center justify-center mt-2">
                    <span class="text-[9px] font-mono text-boneWhite/50 block tracking-widest uppercase">READINESS</span>
                    <span class="text-5xl font-display font-black tracking-tight ${data.colorClass}">${data.score}%</span>
                    <span class="text-xs font-mono text-boneWhite/40 mt-1">GRADE: ${data.grade}</span>
                </div>
                <div class="pt-2">
                    <span class="bg-glassBorder text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">
                        ${data.statusText}
                    </span>
                </div>
            `;
            mainGrid.appendChild(scoreCardPanel);

            // Right: Recommended routes
            const routePanel = document.createElement("div");
            routePanel.className = "lg:col-span-8 space-y-4";
            routePanel.innerHTML = `<h4 class="font-display font-bold text-md text-white flex items-center gap-2">Optimal Underwriting Routes Found <span class="text-xs font-mono text-boneWhite/40">(${data.routes.length})</span></h4>`;

            data.routes.forEach(route => {
                const routeDiv = document.createElement("div");
                routeDiv.className = `p-4 bg-graphiteGray/20 rounded-lg border border-glassBorder hover:border-white/10 transition-colors`;
                routeDiv.innerHTML = `
                    <h5 class="text-white font-bold font-display text-sm flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full ${data.colorClass} inline-block"></span>
                        ${route.title}
                    </h5>
                    <p class="text-xs text-boneWhite/60 mt-1 leading-relaxed pl-3.5">${route.desc}</p>
                `;
                routePanel.appendChild(routeDiv);
            });

            mainGrid.appendChild(routePanel);
            resContainer.appendChild(mainGrid);

            // Document Checklist Section
            const docPanel = document.createElement("div");
            docPanel.className = "p-6 bg-graphiteGray/30 rounded-xl border border-glassBorder relative space-y-4";
            docPanel.innerHTML = `
                <div>
                    <span class="text-cobaltBlue font-mono text-[9px] tracking-widest uppercase block">// PARSING REQUIRED DOCUMENTS</span>
                    <h4 class="font-display font-bold text-white text-base">Your Custom Automated Document Checklist</h4>
                    <p class="text-xs text-boneWhite/50 leading-relaxed">Presenting these pre-qualification documents drastically speeds up partner underwriting turnaround schedules.</p>
                </div>
            `;

            const docList = document.createElement("div");
            docList.className = "grid grid-cols-1 md:grid-cols-2 gap-3 pt-2";

            // Saved ticked files in localStorage
            const savedTicked = JSON.parse(localStorage.getItem("moonshine_checklist_ticked")) || [];

            data.checklist.forEach((item, index) => {
                const isChecked = savedTicked.includes(item);
                const itemDiv = document.createElement("div");
                itemDiv.className = `p-3 rounded border text-xs flex items-center gap-3 cursor-pointer transition-all-300 ${isChecked ? "border-electricGreen bg-electricGreen/5 text-white" : "border-glassBorder hover:border-white/20 text-boneWhite/70"}`;
                
                itemDiv.innerHTML = `
                    <div class="w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? "bg-electricGreen border-electricGreen text-matteBlack" : "border-glassBorder text-transparent"}">
                        <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span class="font-mono">${item}</span>
                `;

                itemDiv.onclick = () => {
                    let ticked = JSON.parse(localStorage.getItem("moonshine_checklist_ticked")) || [];
                    if (ticked.includes(item)) {
                        ticked = ticked.filter(i => i !== item);
                        itemDiv.className = "p-3 rounded border border-glassBorder hover:border-white/20 text-xs flex items-center gap-3 cursor-pointer transition-all-300 text-boneWhite/70";
                        itemDiv.querySelector(".w-4").className = "w-4 h-4 rounded border border-glassBorder flex items-center justify-center text-transparent transition-colors";
                    } else {
                        ticked.push(item);
                        itemDiv.className = "p-3 rounded border border-electricGreen bg-electricGreen/5 text-xs flex items-center gap-3 cursor-pointer transition-all-300 text-white";
                        itemDiv.querySelector(".w-4").className = "w-4 h-4 rounded border bg-electricGreen border-electricGreen text-matteBlack flex items-center justify-center transition-colors";
                    }
                    localStorage.setItem("moonshine_checklist_ticked", JSON.stringify(ticked));
                };

                docList.appendChild(itemDiv);
            });

            docPanel.appendChild(docList);
            resContainer.appendChild(docPanel);

            // CTA block targeting application mapping variables
            const ctaBlock = document.createElement("div");
            ctaBlock.className = "flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-matteBlack border border-glassBorder rounded-xl";
            ctaBlock.innerHTML = `
                <div class="text-left space-y-1">
                    <h5 class="font-display font-bold text-white text-md">Underwriting Ready</h5>
                    <p class="text-xs text-boneWhite/40">Launch your active file assessment instantly with your scorecard grade (${data.grade}) pre-verified.</p>
                </div>
                <button id="scorecard-submit-desk-btn" class="w-full sm:w-auto bg-electricGreen hover:bg-white text-matteBlack font-display font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded transition-all-300 scorecard-glow-green text-center">
                    Submit to Underwriting Desk
                </button>
            `;
            resContainer.appendChild(ctaBlock);

            // Re-attach actions inside rendered frame
            setTimeout(() => {
                const rst = document.getElementById("scorecard-reset-btn");
                if (rst) rst.onclick = () => this.reset();

                const ctaSubmit = document.getElementById("scorecard-submit-desk-btn");
                if (ctaSubmit) {
                    ctaSubmit.onclick = () => {
                        alert(`Redirecting to custom partner funding queue... Profile Config: Score ${data.score}% | Grade ${data.grade}. Proceeding to submission gateway.`);
                    };
                }
            }, 50);

            return resContainer;
        }
    };

    // Auto run initialization
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => ScorecardEngine.init());
    } else {
        ScorecardEngine.init();
    }

    // Export globally
    window.MoonshineScorecard = ScorecardEngine;
})();