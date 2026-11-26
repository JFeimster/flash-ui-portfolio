const questions = [
            { q: "What is your primary objective for the next 24 months?", a: [
                { t: "Sustainable profitability and control", v: "b" },
                { t: "Aggressive market share acquisition", v: "f" }
            ]},
            { q: "How crowded is your current market landscape?", a: [
                { t: "Niche or emerging with low competition", v: "b" },
                { t: "Winner-take-all with heavy incumbents", v: "f" }
            ]},
            { q: "What is your comfort level with external governance?", a: [
                { t: "High - I want experienced board guidance", v: "f" },
                { t: "Low - I want absolute final say on product", v: "b" }
            ]},
            { q: "Your product's capital intensity is...", a: [
                { t: "Low - We can build with sweat equity", v: "b" },
                { t: "High - Requires R&D, hardware, or large sales teams", v: "f" }
            ]},
            { q: "What is your ideal exit timeline?", a: [
                { t: "10+ years or a legacy business", v: "b" },
                { t: "3-7 years via acquisition or IPO", v: "f" }
            ]},
            { q: "How fast does your industry move?", a: [
                { t: "Incremental - Relationships matter most", v: "b" },
                { t: "Exponential - Speed is a moat", v: "f" }
            ]},
            { q: "What is your current monthly burn?", a: [
                { t: "Profitable or break-even", v: "b" },
                { t: "Heavily cash-flow negative", v: "f" }
            ]},
            { q: "How much of your equity are you willing to trade?", a: [
                { t: "0-10% maximum", v: "b" },
                { t: "20-50% for high growth resources", v: "f" }
            ]},
            { q: "Your hiring needs are...", a: [
                { t: "Lean - Small team of generalists", v: "b" },
                { t: "Rapid - Need 20+ specialized hires now", v: "f" }
            ]},
            { q: "The 'Opportunity Cost' of moving slowly is...", a: [
                { t: "Manageable - The market will wait", v: "b" },
                { t: "Fatal - Competitors will lock the market", v: "f" }
            ]}
        ];

        let currentStep = 0;
        let scores = { b: 0, f: 0 };

        function startQuiz() {
            document.getElementById('view-landing').classList.remove('active');
            document.getElementById('view-quiz').classList.add('active');
            renderQuestion();
        }

        function renderQuestion() {
            const q = questions[currentStep];
            document.getElementById('qNumber').innerText = `Question ${currentStep + 1} of 10`;
            document.getElementById('qText').innerText = q.q;
            document.getElementById('progressBar').style.width = `${((currentStep + 1) / 10) * 100}%`;
            
            const grid = document.getElementById('optionsGrid');
            grid.innerHTML = '';
            
            q.a.forEach(opt => {
                const div = document.createElement('div');
                div.className = 'option-card';
                div.innerHTML = `<div class="dot"></div><span>${opt.t}</span>`;
                div.onclick = () => selectOption(opt.v);
                grid.appendChild(div);
            });
        }

        function selectOption(val) {
            scores[val]++;
            if (currentStep < questions.length - 1) {
                currentStep++;
                renderQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            document.getElementById('view-quiz').classList.remove('active');
            document.getElementById('view-results').classList.add('active');
            document.getElementById('progressBar').style.width = `100%`;

            const bPerc = (scores.b / 10) * 100;
            const fPerc = (scores.f / 10) * 100;

            document.getElementById('score-bootstrap').innerText = `${bPerc}%`;
            document.getElementById('score-funding').innerText = `${fPerc}%`;
            
            // Scenario Modeler Logic (Math-based logic reveal)
            // Bootstrap results in higher ownership but slower market cap
            // Funding results in lower ownership but potentially larger absolute market cap
            document.getElementById('bar-bootstrap').style.width = `${Math.max(20, bPerc - 10)}%`;
            document.getElementById('bar-funding').style.width = `${Math.max(20, fPerc + 10)}%`;

            const container = document.getElementById('ctaContainer');
            
            if (scores.f > scores.b) {
                document.getElementById('recommendationTitle').innerText = "Calculated Path: Strategic Funding";
                document.getElementById('recommendationText').innerText = "Your model suggests high capital intensity and a narrow market window. Venture capital or private equity will provide the necessary 'fuel' to capture the territory before incumbents react.";
                document.getElementById('badge-funding').style.display = 'block';
                container.innerHTML = `
                    <button class="btn-primary" style="background:var(--funding-blue)">Apply for Funding Analysis</button>
                    <button class="btn-outline" onclick="location.reload()">Recalculate</button>
                `;
            } else {
                document.getElementById('recommendationTitle').innerText = "Calculated Path: The Bootstrap Route";
                document.getElementById('recommendationText').innerText = "Profitability and control are your moats. By growing organically, you maintain 100% optionality. We've prepared a nurture sequence to help you optimize cash flow while keeping funding as a future lever.";
                document.getElementById('badge-bootstrap').style.display = 'block';
                container.innerHTML = `
                    <button class="btn-primary" style="background:var(--bootstrap-green)">Access Bootstrap Blueprint</button>
                    <button class="btn-outline" onclick="location.reload()">Recalculate</button>
                `;
            }
        }