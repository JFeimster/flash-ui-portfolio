/**
 * SCALE & EFFICIENCY SIMULATOR
 * Dimensioning Returns Projection for CAC Payback
 */

(function() {
    const container = document.querySelector('.analyzer-container');
    
    // Create and Inject Styles
    const styles = document.createElement('style');
    styles.textContent = `
        .forecast-card {
            margin-top: 40px;
            background: var(--bg-card);
            border: 1px solid var(--emerald-dim);
            border-radius: 20px;
            padding: 30px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .forecast-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 25px;
            border-bottom: 1px solid var(--circuit-line);
            padding-bottom: 15px;
        }

        .forecast-title h3 {
            font-family: 'JetBrains Mono', monospace;
            color: var(--emerald);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .forecast-title p {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--text-main);
        }

        .threshold-indicator {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--text-dim);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
        }

        .dot.bankable { background: var(--emerald); box-shadow: 0 0 10px var(--emerald); }

        #forecast-canvas {
            width: 100%;
            height: 240px;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            cursor: crosshair;
        }

        .projection-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 25px;
        }

        .p-stat {
            background: rgba(255,255,255,0.03);
            padding: 15px;
            border-radius: 12px;
            border-left: 3px solid var(--circuit-line);
        }

        .p-stat label {
            display: block;
            font-size: 0.6rem;
            color: var(--text-dim);
            text-transform: uppercase;
            margin-bottom: 5px;
            font-family: 'JetBrains Mono', monospace;
        }

        .p-stat span {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--text-main);
        }

        .limit-warning {
            color: var(--danger) !important;
        }
    `;
    document.head.appendChild(styles);

    // Create Card HTML
    const forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-card';
    forecastCard.innerHTML = `
        <div class="forecast-header">
            <div class="forecast-title">
                <h3>Efficiency Simulator</h3>
                <p>Scale vs. Payback Projection</p>
            </div>
            <div class="threshold-indicator">
                <span class="dot bankable"></span> 6-Month Bankability Limit
            </div>
        </div>
        <canvas id="forecast-canvas"></canvas>
        <div class="projection-stats">
            <div class="p-stat">
                <label>Max Scalable Spend</label>
                <span id="max-spend">$0</span>
            </div>
            <div class="p-stat">
                <label>Efficiency Floor</label>
                <span id="efficiency-floor">0%</span>
            </div>
            <div class="p-stat">
                <label>Scale Capacity</label>
                <span id="scale-capacity">0.0x</span>
            </div>
        </div>
    `;
    container.appendChild(forecastCard);

    const canvas = document.getElementById('forecast-canvas');
    const ctx = canvas.getContext('2d');
    const maxSpendEl = document.getElementById('max-spend');
    const floorEl = document.getElementById('efficiency-floor');
    const capacityEl = document.getElementById('scale-capacity');

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawProjection() {
        const baseSpend = parseFloat(document.getElementById('spend').value) || 0;
        const customers = parseFloat(document.getElementById('customers').value) || 0;
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const margin = parseFloat(document.getElementById('margin').value) || 0;

        if (!baseSpend || !customers) return;

        const baseCAC = baseSpend / customers;
        const cm = arpu * (margin / 100);
        const basePayback = baseCAC / cm;
        
        // Diminishing returns model: CAC increases as spend increases
        // CAC_new = CAC_base * (Spend_multiplier ^ 0.4)
        const points = [];
        const maxMult = 8;
        let limitSpend = baseSpend;
        let foundLimit = false;

        for (let i = 0; i <= 100; i++) {
            const mult = 1 + (i / 100) * (maxMult - 1);
            const currentSpend = baseSpend * mult;
            const projectedCAC = baseCAC * Math.pow(mult, 0.45);
            const projectedPayback = projectedCAC / cm;
            
            points.push({
                x: i,
                spend: currentSpend,
                payback: projectedPayback
            });

            if (projectedPayback <= 6) {
                limitSpend = currentSpend;
            } else if (!foundLimit && projectedPayback > 6) {
                foundLimit = true;
            }
        }

        // Clear Canvas
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);

        // Draw Grid
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
        ctx.lineWidth = 1;
        for(let i=0; i<5; i++) {
            const y = (h / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Draw 6-Month Threshold Line
        const thresholdY = h - (6 / 18) * h;
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, thresholdY);
        ctx.lineTo(w, thresholdY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Projection Curve
        ctx.beginPath();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';

        points.forEach((p, idx) => {
            const xPos = (p.x / 100) * w;
            const yPos = h - (Math.min(p.payback, 18) / 18) * h;
            
            if (idx === 0) ctx.moveTo(xPos, yPos);
            else ctx.lineTo(xPos, yPos);
        });
        ctx.stroke();

        // Gradient Fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0, 255, 136, 0.1)');
        grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fillStyle = grad;
        ctx.fill();

        // Update Stats
        maxSpendEl.textContent = `$${Math.round(limitSpend).toLocaleString()}`;
        const scaleCapacity = limitSpend / baseSpend;
        capacityEl.textContent = scaleCapacity.toFixed(1) + 'x';
        
        const efficiencyAtLimit = 100 / Math.pow(scaleCapacity, 0.45);
        floorEl.textContent = Math.round(efficiencyAtLimit) + '%';

        if (basePayback > 6) {
            maxSpendEl.classList.add('limit-warning');
            maxSpendEl.textContent = "INELASTIC";
        } else {
            maxSpendEl.classList.remove('limit-warning');
        }
    }

    // Hook into existing inputs
    const inputs = ['spend', 'customers', 'arpu', 'margin'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', drawProjection);
    });

    // Initial Draw
    setTimeout(drawProjection, 100);
})();