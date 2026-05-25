(function() {
    const style = document.createElement('style');
    style.textContent = `
        .benchmark-section {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px border-top: 1px solid var(--border);
            position: relative;
        }
        .benchmark-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .benchmark-header h2 {
            font-family: var(--font-mono);
            font-size: 10px;
            text-transform: uppercase;
            color: var(--text-dim);
            letter-spacing: 0.1em;
        }
        .market-context-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .benchmark-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .benchmark-meta {
            display: flex;
            justify-content: space-between;
            font-family: var(--font-mono);
            font-size: 9px;
            color: var(--text-dim);
            text-transform: uppercase;
        }
        .benchmark-track {
            height: 2px;
            background: #151515;
            width: 100%;
            position: relative;
            overflow: hidden;
        }
        .benchmark-bar {
            height: 100%;
            background: #333;
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease;
        }
        .benchmark-item.user-metric .benchmark-bar {
            background: var(--accent);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
        .benchmark-item.user-metric .benchmark-meta {
            color: var(--accent);
            font-weight: 700;
        }
        .benchmark-marker-line {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 1px;
            background: rgba(255,255,255,0.1);
            z-index: 1;
        }
    `;
    document.head.appendChild(style);

    const benchmarkContainer = document.createElement('div');
    benchmarkContainer.className = 'benchmark-section';
    benchmarkContainer.innerHTML = `
        <div class="benchmark-header">
            <h2>Market Comparison</h2>
        </div>
        <div class="market-context-grid" id="benchmark-list">
            <!-- Dynamic Content -->
        </div>
    `;

    const ltvDisplay = document.getElementById('ltv-calc');
    ltvDisplay.parentNode.insertBefore(benchmarkContainer, ltvDisplay);

    const benchmarks = [
        { id: 'b2c', label: 'B2C / Prosumer', target: 2.0 },
        { id: 'smb', label: 'SMB SaaS Target', target: 3.0 },
        { id: 'ent', label: 'Enterprise SaaS', target: 5.0 }
    ];

    function updateBenchmarks() {
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const churn = (parseFloat(document.getElementById('churn').value) || 0) / 100;
        const cac = parseFloat(document.getElementById('cac').value) || 1;
        const userRatio = churn > 0 ? (arpu / churn) / cac : 0;

        const maxScale = Math.max(6, userRatio + 1);
        const listContainer = document.getElementById('benchmark-list');
        
        let html = '';

        benchmarks.forEach(b => {
            const width = (b.target / maxScale) * 100;
            html += `
                <div class="benchmark-item">
                    <div class="benchmark-meta">
                        <span>${b.label}</span>
                        <span>${b.target.toFixed(1)}x</span>
                    </div>
                    <div class="benchmark-track">
                        <div class="benchmark-bar" style="width: ${width}%"></div>
                    </div>
                </div>
            `;
        });

        // User Metric Row
        const userWidth = (userRatio / maxScale) * 100;
        let statusColor = 'var(--danger)';
        if (userRatio >= 3) statusColor = 'var(--success)';
        else if (userRatio >= 1.5) statusColor = 'var(--warning)';

        html += `
            <div class="benchmark-item user-metric" style="margin-top: 8px;">
                <div class="benchmark-meta">
                    <span>Your Current Model</span>
                    <span style="color: ${statusColor}">${userRatio.toFixed(2)}x</span>
                </div>
                <div class="benchmark-track" style="height: 4px; background: #1a1a1a;">
                    <div class="benchmark-bar" style="width: ${userWidth}%; background: ${statusColor}"></div>
                </div>
            </div>
        `;

        listContainer.innerHTML = html;
    }

    const inputs = ['arpu', 'churn', 'cac'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateBenchmarks);
    });

    updateBenchmarks();
})();