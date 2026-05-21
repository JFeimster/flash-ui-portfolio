/**
 * Moonshine Capital Affiliate Toolkit
 * Logic for dynamic embed code generation and clipboard management
 */

document.addEventListener('DOMContentLoaded', () => {
    const partnerIdField = document.getElementById('partner_id_input');
    const campaignIdField = document.getElementById('campaign_id_input');
    const sourceField = document.getElementById('source_input');
    const embedDisplay = document.getElementById('embed-code-preview');
    const copyTrigger = document.getElementById('copy-embed-btn');

    // The base component code to be modified
    const baseCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
            --bg-dark: #07080a;
            --card-bg: #111318;
            --card-border: #1f222c;
            --electric-blue: #00f2ff;
            --neon-green: #39ff14;
            --text-main: #ffffff;
            --text-muted: #8a8f9d;
            --accent-gradient: linear-gradient(135deg, #00f2ff 0%, #39ff14 100%);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: var(--bg-dark);
            color: var(--text-main);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        #moonshine-matcher-container {
            width: 100%;
            max-width: 850px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* Hero Section */
        .hero-section {
            padding: 60px 40px;
            text-align: center;
            background: radial-gradient(circle at top right, rgba(0, 242, 255, 0.05), transparent);
        }

        .hero-section h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 16px;
            letter-spacing: -1px;
        }

        .hero-section span.highlight {
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-section p {
            color: var(--text-muted);
            font-size: 1.1rem;
            max-width: 500px;
            margin: 0 auto 32px;
            line-height: 1.6;
        }

        /* Progress Bar */
        .progress-container {
            height: 4px;
            background: var(--card-border);
            width: 100%;
            position: relative;
        }

        #progress-bar {
            height: 100%;
            background: var(--accent-gradient);
            width: 0%;
            transition: width 0.5s ease;
            box-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
        }

        /* Form Logic Display */
        .step {
            display: none;
            padding: 40px;
            animation: fadeIn 0.4s ease-out;
        }

        .step.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .question-label {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 30px;
            display: block;
        }

        .options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }

        .option-card {
            background: #1a1d26;
            border: 1px solid var(--card-border);
            padding: 24px;
            border-radius: 16px;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .option-card:hover {
            border-color: var(--electric-blue);
            background: #212530;
            transform: translateY(-2px);
        }

        .option-card.selected {
            border-color: var(--neon-green);
            background: rgba(57, 255, 20, 0.05);
            box-shadow: 0 0 20px rgba(57, 255, 20, 0.1);
        }

        .option-title {
            font-weight: 600;
            font-size: 1.1rem;
        }

        /* Buttons */
        .cta-button {
            padding: 16px 32px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }

        .btn-primary {
            background: var(--accent-gradient);
            color: #000;
        }

        .btn-primary:hover {
            filter: brightness(1.1);
            transform: scale(1.02);
            box-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
        }

        .btn-outline {
            background: transparent;
            border: 1px solid var(--card-border);
            color: var(--text-main);
        }

        .btn-outline:hover {
            border-color: var(--text-muted);
        }

        .nav-controls {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Results Panel */
        #result-panel {
            padding: 0;
        }

        .result-header {
            padding: 40px;
            background: linear-gradient(to bottom, rgba(0, 242, 255, 0.1), transparent);
            text-align: center;
        }

        .route-badge {
            display: inline-block;
            padding: 6px 12px;
            background: rgba(0, 242, 255, 0.1);
            color: var(--electric-blue);
            border-radius: 100px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            margin-bottom: 16px;
            border: 1px solid rgba(0, 242, 255, 0.2);
        }

        .result-title {
            font-size: 2.5rem;
            margin-bottom: 12px;
        }

        .result-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            padding: 40px;
        }

        .info-block h4 {
            color: var(--neon-green);
            font-size: 0.8rem;
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }

        .info-block p {
            color: var(--text-muted);
            line-height: 1.5;
            font-size: 0.95rem;
        }

        .prep-list {
            list-style: none;
        }

        .prep-list li {
            padding: 8px 0;
            border-bottom: 1px solid var(--card-border);
            color: var(--text-main);
            display: flex;
            align-items: center;
            font-size: 0.9rem;
        }

        .prep-list li::before {
            content: "→";
            margin-right: 12px;
            color: var(--electric-blue);
        }

        .action-footer {
            padding: 40px;
            background: #0d0f14;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .copy-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 0.8rem;
            cursor: pointer;
            text-decoration: underline;
            margin-top: 10px;
        }

        /* Hidden affiliate fields */
        #affiliate-data { display: none; }

        @media (max-width: 768px) {
            .hero-section h1 { font-size: 2rem; }
            .result-grid { grid-template-columns: 1fr; }
            .options-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

<div id="moonshine-matcher-container">
    <div id="affiliate-data">
        <input type="hidden" name="partner_id" value="AFF-9982">
        <input type="hidden" name="campaign_id" value="DIRECT-WEB">
        <input type="hidden" name="source" value="widget-v1">
    </div>

    <div class="progress-container">
        <div id="progress-bar"></div>
    </div>

    <!-- STEP 0: HERO -->
    <div class="step active" id="step-0">
        <div class="hero-section">
            <div class="route-badge">AI ROUTE ENGINE V2.0</div>
            <h1>Find Your Best <span class="highlight">Funding Route</span></h1>
            <p>Not every business belongs in the same funding lane. Match the applicant to the path that makes the most sense in 60 seconds.</p>
            <button class="cta-button btn-primary" onclick="nextStep()">Start Route Match</button>
        </div>
    </div>

    <!-- STEP 1: Bank Account -->
    <div class="step" id="step-1">
        <span class="question-label">1. How do you handle your business banking?</span>
        <div class="options-grid">
            <div class="option-card" onclick="selectOption(1, 'business')">
                <div class="option-title">Business Checking</div>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Registered entity account</p>
            </div>
            <div class="option-card" onclick="selectOption(1, 'personal')">
                <div class="option-title">Personal / Gig Account</div>
                <p style="font-size: 0.8rem; color: var(--text-muted);">DBA or individual name</p>
            </div>
        </div>
        <div class="nav-controls">
            <button class="cta-button btn-outline" onclick="prevStep()">Back</button>
        </div>
    </div>

    <!-- STEP 2: Revenue -->
    <div class="step" id="step-2">
        <span class="question-label">2. Average monthly revenue?</span>
        <div class="options-grid">
            <div class="option-card" onclick="selectOption(2, 'low')">
                <div class="option-title">Under $5,000</div>
            </div>
            <div class="option-card" onclick="selectOption(2, 'mid')">
                <div class="option-title">$5,000 - $15,000</div>
            </div>
            <div class="option-card" onclick="selectOption(2, 'high')">
                <div class="option-title">$15,000 - $50,000</div>
            </div>
            <div class="option-card" onclick="selectOption(2, 'pro')">
                <div class="option-title">$50,000+</div>
            </div>
        </div>
        <div class="nav-controls">
            <button class="cta-button btn-outline" onclick="prevStep()">Back</button>
        </div>
    </div>

    <!-- STEP 3: Time in Biz -->
    <div class="step" id="step-3">
        <span class="question-label">3. Time in business?</span>
        <div class="options-grid">
            <div class="option-card" onclick="selectOption(3, 'startup')">
                <div class="option-title">0 - 6 Months</div>
            </div>
            <div class="option-card" onclick="selectOption(3, 'young')">
                <div class="option-title">6 - 12 Months</div>
            </div>
            <div class="option-card" onclick="selectOption(3, 'established')">
                <div class="option-title">1 - 2 Years</div>
            </div>
            <div class="option-card" onclick="selectOption(3, 'veteran')">
                <div class="option-title">2+ Years</div>
            </div>
        </div>
        <div class="nav-controls">
            <button class="cta-button btn-outline" onclick="prevStep()">Back</button>
        </div>
    </div>

    <!-- STEP 4: Purpose -->
    <div class="step" id="step-4">
        <span class="question-label">4. Primary funding purpose?</span>
        <div class="options-grid">
            <div class="option-card" onclick="selectOption(4, 'working-capital')">
                <div class="option-title">Working Capital</div>
            </div>
            <div class="option-card" onclick="selectOption(4, 'equipment')">
                <div class="option-title">Equipment / Vehicles</div>
            </div>
            <div class="option-card" onclick="selectOption(4, 'real-estate')">
                <div class="option-title">Real Estate Investment</div>
            </div>
            <div class="option-card" onclick="selectOption(4, 'inventory')">
                <div class="option-title">Inventory / E-com Ops</div>
            </div>
        </div>
        <div class="nav-controls">
            <button class="cta-button btn-outline" onclick="prevStep()">Back</button>
        </div>
    </div>

    <!-- STEP 5: Industry -->
    <div class="step" id="step-5">
        <span class="question-label">5. Which industry best fits?</span>
        <div class="options-grid">
            <div class="option-card" onclick="selectOption(5, 'ecommerce')">
                <div class="option-title">E-commerce</div>
            </div>
            <div class="option-card" onclick="selectOption(5, 'logistics')">
                <div class="option-title">Trucking / Logistics</div>
            </div>
            <div class="option-card" onclick="selectOption(5, 'realestate')">
                <div class="option-title">Real Estate</div>
            </div>
            <div class="option-card" onclick="selectOption(5, 'general')">
                <div class="option-title">General Service / Retail</div>
            </div>
        </div>
        <div class="nav-controls">
            <button class="cta-button btn-outline" onclick="prevStep()">Back</button>
        </div>
    </div>

    <!-- STEP 6: Credit -->
    <div class="step" id="step-6">
        <span class="question-label">6. Estimated personal credit score?</span>
        <div class="options-grid">
            <div class="option-card" onclick="selectOption(6, 'poor')">
                <div class="option-title">Below 580</div>
            </div>
            <div class="option-card" onclick="selectOption(6, 'fair')">
                <div class="option-title">580 - 660</div>
            </div>
            <div class="option-card" onclick="selectOption(6, 'good')">
                <div class="option-title">660 - 720</div>
            </div>
            <div class="option-card" onclick="selectOption(6, 'excellent')">
                <div class="option-title">720+</div>
            </div>
        </div>
        <div class="nav-controls">
            <button class="cta-button btn-outline" onclick="prevStep()">Back</button>
        </div>
    </div>

    <!-- STEP 7: Speed vs Terms -->
    <div class="step" id="step-7">
        <span class="question-label">7. What is your priority?</span>
        <div class="options-grid">
            <div class="option-card" onclick="selectOption(7, 'speed')">
                <div class="option-title">Speed of Funding</div>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Funds in < 24 hours</p>
            </div>
            <div class="option-card" onclick="selectOption(7, 'terms')">
                <div class="option-title">Lowest Rates</div>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Willing to wait for best terms</p>
            </div>
        </div>
        <div class="nav-controls">
            <button class="cta-button btn-outline" onclick="prevStep()">Back</button>
        </div>
    </div>

    <!-- STEP 8: Bank Statements -->
    <div class="step" id="step-8">
        <span class="question-label">8. Can you provide 3-4 months of bank statements?</span>
        <div class="options-grid">
            <div class="option-card" onclick="selectOption(8, 'yes')">
                <div class="option-title">Yes, I have them</div>
            </div>
            <div class="option-card" onclick="selectOption(8, 'no')">
                <div class="option-title">No / Not yet</div>
            </div>
        </div>
        <div class="nav-controls">
            <button class="cta-button btn-outline" onclick="prevStep()">Back</button>
        </div>
    </div>

    <!-- FINAL RESULTS -->
    <div class="step" id="result-panel">
        <div class="result-header">
            <div id="result-badge" class="route-badge">MATCH FOUND</div>
            <h2 class="result-title" id="final-route-name">Micro-Funding Path</h2>
            <p id="final-route-sub">The fastest way to get liquid for smaller business needs.</p>
        </div>

        <div class="result-grid">
            <div class="info-block">
                <h4>Why this fits</h4>
                <p id="why-fits">Based on your revenue and speed requirements, this route bypasses heavy documentation to get you capital within 24 hours.</p>
            </div>
            <div class="info-block">
                <h4>What to prepare</h4>
                <ul class="prep-list" id="prep-items">
                    <li>Government Issued ID</li>
                    <li>Voided Check</li>
                    <li>Last 3 months of bank data</li>
                </ul>
            </div>
        </div>

        <div class="action-footer">
            <button class="cta-button btn-primary" onclick="alert('Redirecting to Application...')">Apply Now</button>
            <div style="display: flex; gap: 10px;">
                <button class="cta-button btn-outline" style="flex: 1;" onclick="alert('Booking strategy call...')">Book Strategy Call</button>
                <button class="cta-button btn-outline" style="flex: 1;" onclick="alert('Sending prep plan...')">Start Prep Plan</button>
            </div>
            <button class="copy-btn" onclick="copyResult()">Copy result to clipboard</button>
        </div>
    </div>
</div>

<script>
    let currentStep = 0;
    const totalSteps = 8;
    const selections = {};

    function updateProgress() {
        const percent = (currentStep / totalSteps) * 100;
        document.getElementById('progress-bar').style.width = percent + '%';
    }

    function nextStep() {
        document.querySelector(\`.step#step-\${currentStep}\`).classList.remove('active');
        currentStep++;
        document.querySelector(\`.step#step-\${currentStep}\`).classList.add('active');
        updateProgress();
        if (currentStep === totalSteps + 1) {
            calculateResult();
        }
    }

    function prevStep() {
        document.querySelector(\`.step#step-\${currentStep}\`).classList.remove('active');
        currentStep--;
        document.querySelector(\`.step#step-\${currentStep}\`).classList.add('active');
        updateProgress();
    }

    function selectOption(step, value) {
        selections[step] = value;
        
        // UI Feedback
        const cards = document.querySelectorAll(\`#step-\${step} .option-card\`);
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
        const text = \`Moonshine Capital Match: \${document.getElementById('final-route-name').innerText}\\n\${document.getElementById('final-route-sub').innerText}\`;
        navigator.clipboard.writeText(text);
        alert('Result copied to clipboard!');
    }
<\/script>

</body>
</html>`;

    /**
     * Updates the code block whenever an input changes
     */
    function updateEmbedCode() {
        const pId = partnerIdField.value.trim() || 'AFF-9982';
        const cId = campaignIdField.value.trim() || 'DIRECT-WEB';
        const sId = sourceField.value.trim() || 'widget-v1';

        let updatedCode = baseCode
            .replace('value="AFF-9982"', `value="${pId}"`)
            .replace('value="DIRECT-WEB"', `value="${cId}"`)
            .replace('value="widget-v1"', `value="${sId}"`);

        if (embedDisplay) {
            embedDisplay.textContent = updatedCode;
        }
    }

    /**
     * Handles the clipboard action and visual feedback
     */
    async function handleCopy() {
        if (!embedDisplay) return;

        try {
            await navigator.clipboard.writeText(embedDisplay.textContent);
            
            // Visual feedback matching the theme
            const originalText = copyTrigger.textContent;
            copyTrigger.textContent = 'CODE COPIED!';
            copyTrigger.style.background = 'var(--neon-green)';
            copyTrigger.style.color = '#000';
            
            setTimeout(() => {
                copyTrigger.textContent = originalText;
                copyTrigger.style.background = '';
                copyTrigger.style.color = '';
            }, 2500);

        } catch (err) {
            console.error('Clipboard copy failed:', err);
            alert('Failed to copy. Please select the text manually.');
        }
    }

    // Event Listeners
    if (partnerIdField) partnerIdField.addEventListener('input', updateEmbedCode);
    if (campaignIdField) campaignIdField.addEventListener('input', updateEmbedCode);
    if (sourceField) sourceField.addEventListener('input', updateEmbedCode);
    if (copyTrigger) copyTrigger.addEventListener('click', handleCopy);

    // Initial generation
    updateEmbedCode();
});