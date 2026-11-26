let currentStep = 0;
let scores = { b: 0, f: 0 };

function nextStep(step) {
    // Record Score from previous step
    if(step > 1 && step <= 4) {
        const radios = document.getElementsByName('q' + (step - 1));
        for (let r of radios) {
            if (r.checked) scores[r.value]++;
        }
    }
    
    document.querySelectorAll('.v-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + step).classList.add('active');
    
    // Progress fill (simulated for 3 steps + landing + result)
    document.getElementById('v-progress-fill').style.width = (step * 25) + '%';
    currentStep = step;
}

function prevStep(step) {
    document.querySelectorAll('.v-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + step).classList.add('active');
    currentStep = step;
}

function showResults() {
    // Collect final question
    const radios = document.getElementsByName('q3');
    for (let r of radios) {
        if (r.checked) scores[r.value]++;
    }

    document.querySelectorAll('.v-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-results').classList.add('active');
    document.getElementById('v-progress-fill').style.width = '100%';

    const isFunding = scores.f >= scores.b;
    const badge = document.getElementById('res-badge');
    const title = document.getElementById('res-title');
    const text = document.getElementById('res-text');
    const reasoning = document.getElementById('res-reasoning');
    const scoreVal = document.getElementById('res-score');
    const resourceBox = document.getElementById('resource-links');
    const mainBtn = document.getElementById('main-cta-btn');

    if(isFunding) {
        badge.className = "v-badge badge-funding";
        badge.innerText = "Recommendation: Seek Capital";
        title.innerText = "Institutional Funding Path";
        scoreVal.innerText = Math.floor(65 + (scores.f * 10)) + "%";
        scoreVal.style.color = "var(--v-blue)";
        text.innerText = "Your model suggests high capital intensity and a competitive market. Accelerating now is the logical choice to maximize long-term equity value.";
        reasoning.innerText = "A 'Winner-Take-All' environment penalizes organic scaling. By trading a portion of equity for capital, you leverage external resources to build a defensible moat faster than the market standard.";
        
        resourceBox.innerHTML = `
            <a href="#" class="v-resource-item"><strong>Series A Readiness Checklist</strong><span>Benchmark your metrics vs. VC expectations.</span></a>
            <a href="#" class="v-resource-item"><strong>Pitch Deck Framework</strong><span>How to communicate your unfair advantage.</span></a>
        `;
        mainBtn.innerText = "Start Funding Application";
        mainBtn.style.background = "var(--v-blue)";
    } else {
        badge.className = "v-badge badge-bootstrap";
        badge.innerText = "Recommendation: Bootstrap";
        title.innerText = "Profit-First Growth Path";
        scoreVal.innerText = Math.floor(65 + (scores.b * 10)) + "%";
        scoreVal.style.color = "var(--v-green)";
        text.innerText = "Your business shows strong fundamentals that don't require external dilution. Control and sustainability are your primary competitive advantages.";
        reasoning.innerText = "Maintaining 100% ownership allows for extreme agility and long-term optionality. At your current burn rate and market speed, capital would likely create more noise than signal.";
        
        resourceBox.innerHTML = `
            <a href="#" class="v-resource-item"><strong>Lean Scaling Guide</strong><span>Optimize unit economics for organic growth.</span></a>
            <a href="#" class="v-resource-item"><strong>Debt as a Tool</strong><span>Non-dilutive funding options for future use.</span></a>
        `;
        mainBtn.innerText = "Access Bootstrapper Community";
        mainBtn.style.background = "var(--v-green)";
        
        // Adjust modeler for bootstrap-friendly numbers
        document.getElementById('val-boot-nw').innerText = "$25M";
        document.getElementById('val-fund-nw').innerText = "$18M";
    }
}