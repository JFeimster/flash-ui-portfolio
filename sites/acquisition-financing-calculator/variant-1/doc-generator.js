(function() {
    const container = document.querySelector('.calc-container');
    if (!container) return;

    // Create Architect Section
    const architectSection = document.createElement('div');
    architectSection.className = 'doc-architect';
    Object.assign(architectSection.style, {
        marginTop: '80px',
        borderTop: 'var(--border-width) solid var(--bone-white)',
        paddingTop: '60px'
    });

    const htmlContent = `
        <div class="header">
            <h2 style="font-family: 'DM Serif Display', serif; font-size: 3rem; text-transform: uppercase; line-height: 0.9; letter-spacing: -1px;">Term Sheet<br>Architect</h2>
        </div>

        <div class="input-wrapper" style="margin-bottom: 30px; background: var(--black); padding: 0;">
            <label style="margin-bottom: 15px;">Protective Covenants</label>
            <textarea id="covenantsInput" style="
                width: 100%; 
                background: var(--black); 
                border: 4px solid var(--bone-white); 
                color: var(--bone-white); 
                padding: 25px; 
                font-family: 'Inter', sans-serif; 
                font-size: 1rem; 
                line-height: 1.6; 
                min-height: 220px; 
                outline: none; 
                resize: vertical;
                text-transform: uppercase;
                letter-spacing: 1px;
            ">1. MINIMUM DSCR OF 1.25X MAINTAINED QUARTERLY.\n2. NO ADDITIONAL SENIOR DEBT WITHOUT SELLER CONSENT.\n3. ANNUAL AUDITED STATEMENTS REQUIRED WITHIN 90 DAYS.</textarea>
        </div>

        <div class="input-wrapper" style="margin-bottom: 40px; background: var(--black); padding: 0;">
            <label>Legal Jurisdiction</label>
            <input type="text" id="jurisdiction" value="DELAWARE, USA" style="font-size: 1.5rem; border-bottom: 2px solid var(--verdigris); padding-bottom: 10px;">
        </div>

        <button class="btn-calculate" id="btnExecute" style="background-color: var(--acid-green); margin-bottom: 20px;">
            Execute Letter of Intent
        </button>

        <div id="loiOutput" style="
            display: none; 
            border: 2px solid var(--verdigris); 
            padding: 40px; 
            margin-top: 40px; 
            background: #0d0d0d;
            position: relative;
        ">
            <div style="position: absolute; top: -15px; right: 20px; background: var(--verdigris); color: var(--black); padding: 5px 15px; font-weight: 900; font-size: 0.6rem; letter-spacing: 2px;">DRAFT_CONFIDENTIAL</div>
            <h3 style="font-family: 'DM Serif Display', serif; font-size: 1.8rem; margin-bottom: 20px; color: var(--acid-green);">PROPOSED CAPITAL STRUCTURE</h3>
            <div id="summaryContent" style="font-family: 'Inter', sans-serif; font-size: 0.85rem; line-height: 2; color: var(--bone-white); text-transform: uppercase;"></div>
        </div>
    `;

    architectSection.innerHTML = htmlContent;
    container.appendChild(architectSection);

    // Event Logic
    const btn = document.getElementById('btnExecute');
    const output = document.getElementById('loiOutput');
    const summary = document.getElementById('summaryContent');

    btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = 'var(--bone-white)';
        btn.style.boxShadow = '0 10px 0 var(--verdigris)';
        btn.style.transform = 'translateY(-2px)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'var(--acid-green)';
        btn.style.boxShadow = 'none';
        btn.style.transform = 'translateY(0)';
    });

    btn.addEventListener('click', () => {
        const sbaVal = document.getElementById('sba-val').innerText;
        const sellerVal = document.getElementById('seller-val').innerText;
        const downVal = document.getElementById('downPayment').value;
        const covenants = document.getElementById('covenantsInput').value;
        const jurisdiction = document.getElementById('jurisdiction').value;

        summary.innerHTML = `
            <div style="border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 15px;">
                <span style="color: var(--verdigris)">Senior Debt:</span> ${sbaVal}<br>
                <span style="color: var(--verdigris)">Seller Carry:</span> ${sellerVal}<br>
                <span style="color: var(--verdigris)">Equity Contribution:</span> ${downVal}%
            </div>
            <div style="margin-bottom: 15px;">
                <span style="color: var(--verdigris)">Protective Covenants:</span><br>
                <div style="opacity: 0.8; margin-top: 10px;">${covenants.replace(/\n/g, '<br>')}</div>
            </div>
            <div>
                <span style="color: var(--verdigris)">Governing Law:</span> ${jurisdiction}
            </div>
        `;

        output.style.display = 'block';
        output.scrollIntoView({ behavior: 'smooth', block: 'end' });
        
        // Visual Feedback
        btn.innerText = "LOI GENERATED";
        setTimeout(() => {
            btn.innerText = "Execute Letter of Intent";
        }, 3000);
    });
})();