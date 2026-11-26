const questions = [
        {
            q: "What is your primary growth objective?",
            options: [
                { text: "Sustainable profitability & long-term control", score: -2 },
                { text: "Rapid market capture & industry dominance", score: 2 }
            ]
        },
        {
            q: "How large is your Total Addressable Market (TAM)?",
            options: [
                { text: "Niche or specialized ($10M - $100M)", score: -1 },
                { text: "Massive or global ($1B+)", score: 2 }
            ]
        },
        {
            q: "How capital-intensive is your product development?",
            options: [
                { text: "Low (Service-based or simple software)", score: -1 },
                { text: "High (Deep tech, hardware, or complex R&D)", score: 2 }
            ]
        },
        {
            q: "What is your stance on company ownership?",
            options: [
                { text: "I want to retain 100% of the decision making", score: -2 },
                { text: "I'm willing to trade equity for expertise and speed", score: 2 }
            ]
        },
        {
            q: "How aggressive is your competition?",
            options: [
                { text: "Few competitors; I can grow at my own pace", score: -1 },
                { text: "Winner-take-all market; heavy competition", score: 2 }
            ]
        },
        {
            q: "What is your expected timeline to exit?",
            options: [
                { text: "10+ years or a 'forever' business", score: -1 },
                { text: "3-7 years with a clear acquisition target", score: 1 }
            ]
        },
        {
            q: "How much personal runway do you have?",
            options: [
                { text: "Sufficient for 12+ months", score: -1 },
                { text: "Need to hire and scale immediately", score: 1 }
            ]
        },
        {
            q: "How proven is your business model?",
            options: [
                { text: "Still experimenting with unit economics", score: -1 },
                { text: "Scalable model; just needs more fuel (capital)", score: 2 }
            ]
        },
        {
            q: "Which risk keeps you up at night?",
            options: [
                { text: "Losing control and being fired from my company", score: -2 },
                { text: "Being out-spent and becoming irrelevant", score: 2 }
            ]
        },
        {
            q: "Do you have an existing network of investors?",
            options: [
                { text: "No, and I don't want to spend time pitching", score: -1 },
                { text: "Yes, or I am ready to commit to the fundraising process", score: 1 }
            ]
        }
    ];

    let currentStep = 0;
    let totalScore = 0;

    function startQuiz() {
        document.getElementById('view-landing').classList.remove('active');
        document.getElementById('view-quiz').classList.add('active');
        document.getElementById('progressContainer').style.display = 'block';
        showQuestion();
    }

    function showQuestion() {
        const q = questions[currentStep];
        document.getElementById('stepIndicator').innerText = `Question ${currentStep + 1} of ${questions.length}`;
        document.getElementById('questionText').innerText = q.q;
        
        const grid = document.getElementById('optionsGrid');
        grid.innerHTML = '';
        
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span>${opt.text}</span> <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="9 5l7 7-7 7"></path></svg>`;
            btn.onclick = () => selectOption(opt.score);
            grid.appendChild(btn);
        });

        const progress = ((currentStep) / questions.length) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }

    function selectOption(score) {
        totalScore += score;
        currentStep++;
        
        if (currentStep < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        document.getElementById('view-quiz').classList.remove('active');
        document.getElementById('view-results').classList.add('active');
        document.getElementById('progressBar').style.width = `100%`;

        const badge = document.getElementById('resultBadge');
        const title = document.getElementById('resultTitle');
        const reasoning = document.getElementById('resultReasoning');
        const fulcrum = document.getElementById('fulcrumPoint');
        const ctaTitle = document.getElementById('ctaTitle');
        const ctaDesc = document.getElementById('ctaDescription');
        const ctaBtn = document.getElementById('ctaButton');

        // Logic: Score > 0 means Funding, Score <= 0 means Bootstrap
        if (totalScore > 2) {
            badge.className = 'badge badge-funding';
            badge.innerText = 'Recommendation: Funding';
            title.innerText = 'Your business is primed for Institutional Capital.';
            reasoning.innerText = 'Your objectives align with a high-growth, venture-scale model. The math suggests that trading equity for speed will result in a larger terminal value for your remaining stake.';
            fulcrum.style.left = '80%';
            
            ctaTitle.innerText = "Ready to Pitch?";
            ctaDesc.innerText = "Connect with our network of VCs and Angel investors looking for your profile.";
            ctaBtn.innerText = "Access Funding Application";
        } else {
            badge.className = 'badge badge-bootstrap';
            badge.innerText = 'Recommendation: Bootstrap';
            title.innerText = 'A lean, Bootstrap approach is your best path.';
            reasoning.innerText = 'You value control and have a business model that can sustain itself through cash flow. By avoiding dilution, you maintain full optionality for your future.';
            fulcrum.style.left = '20%';

            ctaTitle.innerText = "Master Your Operations";
            ctaDesc.innerText = "Get our 'Profit-First' growth sequence to scale to $10M ARR without a single pitch deck.";
            ctaBtn.innerText = "Get the Nurture Sequence";
            
            // Plant the seed for funding later
            const p = document.createElement('p');
            p.style.fontSize = '0.8rem';
            p.style.marginTop = '15px';
            p.style.opacity = '0.7';
            p.innerText = "Note: If your MRR hits $50k+, we can unlock bridge funding options for you.";
            document.getElementById('ctaSection').appendChild(p);
        }
    }