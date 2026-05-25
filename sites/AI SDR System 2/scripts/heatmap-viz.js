/**
 * Obsidian SDR Engine - Performance Heatmap Visualization
 * Optimized for static data-driven analytics within the 'Analyze' component.
 */

(function() {
    const styles = `
        .heatmap-container {
            margin-top: 1.5rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            animation: fadeIn 0.8s ease-out;
        }

        .heatmap-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 1.25rem;
        }

        .heatmap-title {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.15rem;
            color: var(--text-secondary);
        }

        .heatmap-legend {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .legend-box {
            width: 8px;
            height: 8px;
            border-radius: 1px;
        }

        .heatmap-grid {
            display: grid;
            grid-template-columns: 70px repeat(6, 1fr);
            gap: 4px;
        }

        .heatmap-cell {
            height: 28px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.03);
            transition: all 0.2s ease;
            cursor: pointer;
            position: relative;
        }

        .heatmap-cell:hover {
            transform: scale(1.05);
            z-index: 10;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
            outline: 1px solid rgba(255, 255, 255, 0.3);
        }

        .heatmap-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.55rem;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            text-transform: uppercase;
        }

        .axis-label {
            justify-content: center;
            padding-bottom: 6px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            color: #000;
            padding: 4px 8px;
            border-radius: 2px;
            font-size: 0.6rem;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .heatmap-cell:hover .tooltip {
            opacity: 1;
        }
    `;

    const DATA = {
        niches: ['SaaS', 'Fintech', 'Health', 'Web3', 'AI Infra'],
        cities: ['SF', 'NYC', 'LDN', 'AUS', 'SGP', 'BER'],
        matrix: [
            [0.8, 0.6, 0.4, 0.9, 0.3, 0.5],
            [0.4, 0.9, 0.7, 0.2, 0.5, 0.4],
            [0.2, 0.3, 0.5, 0.4, 0.8, 0.7],
            [0.9, 0.4, 0.6, 0.8, 0.2, 0.3],
            [0.7, 0.8, 0.9, 0.5, 0.6, 0.8]
        ]
    };

    function initHeatmap() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const container = document.createElement('div');
        container.className = 'heatmap-container';

        const header = `
            <div class="heatmap-header">
                <div class="heatmap-title">Geographic ROI Distribution</div>
                <div class="heatmap-legend">
                    <span style="font-size: 0.5rem; color: #555;">LOW</span>
                    <div class="legend-box" style="background: rgba(255,255,255,0.05)"></div>
                    <div class="legend-box" style="background: rgba(255,255,255,0.3)"></div>
                    <div class="legend-box" style="background: rgba(255,255,255,0.6)"></div>
                    <div class="legend-box" style="background: rgba(255,255,255,1)"></div>
                    <span style="font-size: 0.5rem; color: #555;">HIGH</span>
                </div>
            </div>
        `;

        let gridHTML = '<div class="heatmap-grid">';
        
        // Header Row
        gridHTML += '<div></div>'; // Corner
        DATA.cities.forEach(city => {
            gridHTML += `<div class="heatmap-label axis-label">${city}</div>`;
        });

        // Data Rows
        DATA.niches.forEach((niche, i) => {
            gridHTML += `<div class="heatmap-label">${niche}</div>`;
            DATA.matrix[i].forEach(val => {
                const opacity = val * 0.9 + 0.1;
                const percentage = Math.floor(val * 100);
                gridHTML += `
                    <div class="heatmap-cell" style="background: rgba(255, 255, 255, ${opacity})">
                        <div class="tooltip">${percentage}% ROI</div>
                    </div>`;
            });
        });

        gridHTML += '</div>';
        container.innerHTML = header + gridHTML;

        // Target the area before analytics-strip
        const analyticsStrip = document.querySelector('.analytics-strip');
        if (analyticsStrip) {
            analyticsStrip.parentNode.insertBefore(container, analyticsStrip);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeatmap);
    } else {
        initHeatmap();
    }
})();