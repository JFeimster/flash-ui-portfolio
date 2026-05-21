let currentStep = 0;
    const totalSteps = 8;
    const selections = {};

    function updateProgress() {
        const percent = (currentStep / totalSteps) * 100;
        document.getElementById('progress-bar').style.width = percent + '%';
    }

    function nextStep() {
        document.querySelector(`.step#step-${currentStep}`).classList.remove('active');
        currentStep++;
        document.querySelector(`.step#step-${currentStep}`).classList.add('active');
        updateProgress();
        if (currentStep === totalSteps + 1) {
            calculateResult();
        }
    }

    function prevStep() {
        document.querySelector(`.step#step-${currentStep}`).classList.remove('active');
        currentStep--;
        document.querySelector(`.step#step-${currentStep}`).classList.add('active');
        updateProgress();
    }

    function selectOption(step, value) {
        selections[step] = value;
        
        // UI Feedback
        const cards = document.querySelectorAll(`#step-${step} .option-card`);
        cards.forEach(c => c.classList.remove('selected'));
        event.currentTarget.classList.add('selected');

        setTimeout(() => {
            if (currentStep === totalSteps) {
                calculateResult();
            } else {
                nextStep();
            }
        }, 300);
    }

    function calculateResult() {
        currentStep = 9; // result panel
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.getElementById('result-panel').classList.add('active');
        document.getElementById('progress-bar').style.width = '100%';

        const s = selections;
        let route = {
            name: "Working Capital",
            sub: "Optimized for established businesses needing growth capital.",
            why: "Your revenue and business history qualify you for standard working capital with competitive terms.",
            prep: ["4 Months Bank Statements", "Drivers License", "Tax ID / EIN", "Voided Business Check"]
        };

        // Logic Tree
        if (s[4] === 'real-estate') {
            route = {
                name: "Real Estate Funding",
                sub: "For fix-and-flip, bridge loans, or rental portfolio expansion.",
                why: "Since you indicated Real Estate as your purpose, we bypass daily-draw logic for asset-based financing.",
                prep: ["Project HUD Statement", "Property Address", "Experience Track Record", "Credit Report"]
            };
        } else if (s[4] === 'equipment') {
            route = {
                name: "Equipment Financing",
                sub: "Low-rate financing specifically for hardware, machinery, or vehicles.",
                why: "Funding is secured by the equipment itself, often leading to better rates and longer terms.",
                prep: ["Equipment Quote/Invoice", "Business Credit Report", "2 Years Tax Returns", "Application"]
            };
        } else if (s[5] === 'ecommerce' || s[4] === 'inventory') {
            route = {
                name: "E-commerce Funding",
                sub: "Revenue-based financing designed for high-volume online sellers.",
                why: "We look at your store's digital footprint and sales velocity rather than just credit scores.",
                prep: ["Store API Integration", "Last 3 Months P&L", "Inventory List", "Identity Verification"]
            };
        } else if (s[1] === 'personal' || s[2] === 'low') {
            route = {
                name: "Quick Micro-Funding",
                sub: "Fast, small-batch capital for gig workers and micro-businesses.",
                why: "Your profile is best suited for high-speed, lower-doc micro-funding to build initial momentum.",
                prep: ["Bank Connection (Plaid)", "Photo of ID", "Business Address", "Social Security Number"]
            };
        } else if (s[6] === 'poor' || s[8] === 'no') {
            route = {
                name: "Business Credit Prep",
                sub: "The rebuild path to get you 'funding ready' in 60-90 days.",
                why: "To get the best terms, we need to address credit or documentation gaps first through our nurture path.",
                prep: ["Current Credit Report", "Entity Formation Docs", "Utility Bill", "Business Phone Number"]
            };
        }

        // Render Result
        document.getElementById('final-route-name').innerText = route.name;
        document.getElementById('final-route-sub').innerText = route.sub;
        document.getElementById('why-fits').innerText = route.why;
        
        const prepList = document.getElementById('prep-items');
        prepList.innerHTML = '';
        route.prep.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            prepList.appendChild(li);
        });
    }

    function copyResult() {
        const text = `Moonshine Capital Match: ${document.getElementById('final-route-name').innerText}\n${document.getElementById('final-route-sub').innerText}`;
        navigator.clipboard.writeText(text);
        alert('Result copied to clipboard!');
    }