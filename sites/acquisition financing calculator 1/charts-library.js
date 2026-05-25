const IndustryBenchmark = (function() {
    const sectorData = [
        { industry: 'HVAC Services', multiple: 4.2, risk: 'Low', depth: '#43B3AE' },
        { industry: 'Pest Control', multiple: 4.8, risk: 'Low', depth: '#3A9D98' },
        { industry: 'Plumbing & Rooter', multiple: 3.9, risk: 'Med', depth: '#318882' },
        { industry: 'Landscape Maint.', multiple: 3.2, risk: 'Low', depth: '#28726D' },
        { industry: 'Roofing & Exterior', multiple: 2.8, risk: 'High', depth: '#1F5D58' },
        { industry: 'Commercial Janitorial', multiple: 2.5, risk: 'Med', depth: '#164743' }
    ];

    const styles = `
        .benchmark-container {
            margin-top: 80px;
            border-top: var(--border-width) solid var(--bone-white);
            padding-top: 60px;
        }

        .benchmark-header {
            margin-bottom: 40px;
        }

        .benchmark-title {
            font-family: 'DM Serif Display', serif;
            font-size: 3rem;
            color: var(--bone-white);
            text-transform: uppercase;
            line-height: 1;
            margin-bottom: 10px;
        }

        .heatmap-grid {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background-color: var(--bone-white);
            border: 2px solid var(--bone-white);
            margin-bottom: 40px;
        }

        .heatmap-row {
            display: flex;
            height: 60px;
            background-color: var(--black);
            align-items: center;
            position: relative;
            transition: all 0.3s ease;
        }

        .heatmap-row:hover {
            filter: brightness(1.2);
        }

        .heatmap-bar {
            height: 100%;
            display: flex;
            align-items: center;
            padding-left: 20px;
            position: relative;
        }

        .heatmap-label {
            font-family: 'Inter', sans-serif;
            font-weight: 900;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--bone-white);
            z-index: 2;
        }

        .heatmap-value {
            position: absolute;
            right: 20px;
            font-family: 'DM Serif Display', serif;
            font-size: 1.8rem;
            color: var(--acid-green);
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
        }

        .benchmark-card {
            background-color: var(--bone-white);
            padding: 25px;
            color: var(--black);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 180px;
            border-left: 12px solid var(--oxidized-dark);
        }

        .card-meta {
            font-size: 0.6rem;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.6;
        }

        .card-industry {
            font-family: 'DM Serif Display', serif;
            font-size: 1.4rem;
            margin: 10px 0;
            line-height: 1.1;
        }

        .card-stat {
            font-size: 2.5rem;
            font-weight: 900;
            letter-spacing: -2px;
            display: flex;
            align-items: baseline;
            gap: 5px;
        }

        .card-stat span {
            font-size: 0.8rem;
            letter-spacing: 0;
            opacity: 0.5;
        }

        @media (max-width: 600px) {
            .benchmark-title { font-size: 2rem; }
            .heatmap-value { font-size: 1.2rem; }
        }
    `;

    function injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    function render(containerId) {
        const mountPoint = document.getElementById(containerId);
        if (!mountPoint) return;

        injectStyles();

        let html = `
            <div class="benchmark-container">
                <div class="benchmark-header">
                    <h2 class="benchmark-title">Industry Multiples<br>Benchmark</h2>
                    <p style="font-size: 0.8rem; opacity: 0.7; max-width: 400px;">Current SDE (Seller Discretionary Earnings) multiples across core service sectors. Optimized for asset-light acquisitions.</p>
                </div>

                <div class="heatmap-grid">
                    ${sectorData.map(item => `
                        <div class="heatmap-row">
                            <div class="heatmap-bar" style="width: ${(item.multiple / 6) * 100}%; background-color: ${item.depth};">
                                <span class="heatmap-label">${item.industry}</span>
                            </div>
                            <span class="heatmap-value">${item.multiple.toFixed(1)}x</span>
                        </div>
                    `).join('')}
                </div>

                <div class="cards-grid">
                    ${sectorData.map(item => `
                        <div class="benchmark-card">
                            <div class="card-meta">${item.risk} Risk / 2024 Index</div>
                            <div class="card-industry">${item.industry}</div>
                            <div class="card-stat">${item.multiple.toFixed(2)}<span>SDE MULTIPLE</span></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        mountPoint.innerHTML = html;
    }

    return { render };
})();

// Initialize component on load
document.addEventListener('DOMContentLoaded', () => {
    const calcContainer = document.querySelector('.calc-container');
    if (calcContainer) {
        const benchmarkMount = document.createElement('div');
        benchmarkMount.id = 'industry-benchmark-mount';
        calcContainer.appendChild(benchmarkMount);
        IndustryBenchmark.render('industry-benchmark-mount');
    }
});