/**
 * Moonshine Capital Partners - Affiliate Analytics & Commission Dashboard
 * Custom Neo-Brutalist Chart Generator
 * 
 * Generates raw, ultra-bold, high-contrast bar charts, sparklines, and performance
 * visualizations matching the Moonshine Capital Partners brutalist design system.
 */

class MoonshineChartGenerator {
    constructor() {
        this.defaultOptions = {
            accentColor: '#ff4800',
            successColor: '#00ff66',
            textColor: '#ffffff',
            bgColor: '#000000',
            borderColor: '#ffffff',
            gridColor: '#222222',
            barGap: 8,
            showGrid: true,
            animate: true
        };
    }

    /**
     * Generates a fully responsive, raw, black-bordered monthly performance bar chart.
     * @param {string|HTMLElement} container - Target container element or selector
     * @param {Array<{label: string, value: number, secondaryValue?: number}>} data - Dataset to plot
     * @param {Object} options - Custom style options
     */
    renderBarChart(container, data, options = {}) {
        const target = typeof container === 'string' ? document.getElementById(container) : container;
        if (!target) return;

        const opts = { ...this.defaultOptions, ...options };
        target.innerHTML = ''; // Clear original content

        // Create main wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'w-full h-full flex flex-col justify-between font-mono relative select-none';
        
        // Find extreme limits for sizing
        const maxValue = Math.max(...data.map(d => d.value), 1);
        
        // Build raw grid template layout
        const chartArea = document.createElement('div');
        chartArea.className = 'relative flex-grow h-48 md:h-64 border-b-4 border-l-4 border-white flex items-end justify-between pt-8 pb-1 px-2 md:px-4 bg-zinc-950 overflow-hidden';
        
        // Draw grid lines
        if (opts.showGrid) {
            const gridCount = 4;
            for (let i = 1; i <= gridCount; i++) {
                const gridY = document.createElement('div');
                gridY.className = 'absolute left-0 right-0 border-t border-dashed border-zinc-800 pointer-events-none';
                gridY.style.top = `${(100 / (gridCount + 1)) * i}%`;
                
                // Value label for grid
                const gridLabel = document.createElement('span');
                gridLabel.className = 'absolute left-1 text-[10px] text-zinc-600 font-bold tracking-tight';
                gridLabel.style.top = '2px';
                gridLabel.innerText = `${Math.round((maxValue * (gridCount + 1 - i)) / (gridCount + 1))}`;
                gridY.appendChild(gridLabel);
                
                chartArea.appendChild(gridY);
            }
        }

        // Render Bars
        data.forEach((item, index) => {
            const barContainer = document.createElement('div');
            barContainer.className = 'flex flex-col items-center flex-grow group relative h-full justify-end';
            barContainer.style.margin = `0 ${opts.barGap / 2}px`;

            const percentage = (item.value / maxValue) * 100;

            // Bar segment
            const bar = document.createElement('div');
            bar.className = 'w-full border-4 border-black transition-all duration-500 relative cursor-pointer';
            bar.style.backgroundColor = opts.accentColor;
            bar.style.boxShadow = '4px -4px 0px rgba(255, 72, 0, 0.2)';
            
            // Set dynamic height with a minimal visible fallback
            if (opts.animate) {
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = `${Math.max(percentage, 3)}%`;
                }, index * 50);
            } else {
                bar.style.height = `${Math.max(percentage, 3)}%`;
            }

            // Hover interactions & tooltips
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-black text-xs font-black p-2 border-2 border-black hidden group-hover:block z-30 whitespace-nowrap neo-shadow';
            tooltip.innerHTML = `
                <div class="uppercase text-[10px] text-zinc-500 tracking-wider">${item.label}</div>
                <div class="text-sm font-bold">${opts.isCurrency ? '$' : ''}${item.value.toLocaleString()}</div>
                ${item.secondaryValue ? `<div class="text-[10px] text-[#ff4800]">// SIGNUPS: ${item.secondaryValue}</div>` : ''}
            `;
            barContainer.appendChild(tooltip);

            // Change color state on hover
            bar.addEventListener('mouseenter', () => {
                bar.style.backgroundColor = '#ffffff';
                bar.style.transform = 'translateY(-2px)';
            });
            bar.addEventListener('mouseleave', () => {
                bar.style.backgroundColor = opts.accentColor;
                bar.style.transform = 'translateY(0)';
            });

            barContainer.appendChild(bar);
            chartArea.appendChild(barContainer);
        });

        // X-Axis Labels
        const xAxis = document.createElement('div');
        xAxis.className = 'flex justify-between items-center pt-2 text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-widest px-2 md:px-4';
        data.forEach(item => {
            const labelSpan = document.createElement('span');
            labelSpan.className = 'flex-grow text-center truncate';
            labelSpan.innerText = item.label.substring(0, 3);
            xAxis.appendChild(labelSpan);
        });

        wrapper.appendChild(chartArea);
        wrapper.appendChild(xAxis);
        target.appendChild(wrapper);
    }

    /**
     * Generates a sleek, raw sparkline for mini performance metric tracking cards.
     * @param {string|HTMLElement} container - Target container element or selector
     * @param {number[]} dataPoints - Array of numbers to trace
     * @param {Object} options - Custom configurations
     */
    renderSparkline(container, dataPoints, options = {}) {
        const target = typeof container === 'string' ? document.getElementById(container) : container;
        if (!target) return;

        const opts = { ...this.defaultOptions, ...options };
        target.innerHTML = '';

        const width = target.clientWidth || 120;
        const height = target.clientHeight || 40;

        const max = Math.max(...dataPoints, 1);
        const min = Math.min(...dataPoints, 0);
        const range = max - min;

        // Create an raw inline SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.overflow = 'visible';

        const points = dataPoints.map((val, idx) => {
            const x = (idx / (dataPoints.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        // Draw shadow line (Brutalist offsets)
        const shadowPolyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        shadowPolyline.setAttribute('fill', 'none');
        shadowPolyline.setAttribute('stroke', '#000000');
        shadowPolyline.setAttribute('stroke-width', '4');
        shadowPolyline.setAttribute('points', points);
        shadowPolyline.style.transform = 'translate(2px, 2px)';

        // Draw primary visual line
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', opts.accentColor);
        polyline.setAttribute('stroke-width', '3');
        polyline.setAttribute('points', points);

        // Highlight latest point
        const lastX = width;
        const lastY = height - ((dataPoints[dataPoints.length - 1] - min) / range) * height;
        
        const endpointShadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endpointShadow.setAttribute('cx', lastX);
        endpointShadow.setAttribute('cy', lastY);
        endpointShadow.setAttribute('r', '5');
        endpointShadow.setAttribute('fill', '#000000');
        endpointShadow.style.transform = 'translate(1px, 1px)';

        const endpoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endpoint.setAttribute('cx', lastX);
        endpoint.setAttribute('cy', lastY);
        endpoint.setAttribute('r', '4');
        endpoint.setAttribute('fill', opts.successColor || '#00ff66');

        svg.appendChild(shadowPolyline);
        svg.appendChild(polyline);
        svg.appendChild(endpointShadow);
        svg.appendChild(endpoint);

        target.appendChild(svg);
    }
}

// Attach globally to window
window.MoonshineChartGenerator = new MoonshineChartGenerator();

// Self-Initialize / Demo runner if specific target containers exist
document.addEventListener('DOMContentLoaded', () => {
    const defaultData = [
        { label: 'JAN', value: 12000, secondaryValue: 8 },
        { label: 'FEB', value: 19000, secondaryValue: 12 },
        { label: 'MAR', value: 15000, secondaryValue: 11 },
        { label: 'APR', value: 27000, secondaryValue: 20 },
        { label: 'MAY', value: 34000, secondaryValue: 24 },
        { label: 'JUN', value: 45000, secondaryValue: 31 }
    ];

    const pipelineTarget = document.getElementById('pipeline-chart-container');
    if (pipelineTarget) {
        window.MoonshineChartGenerator.renderBarChart(pipelineTarget, defaultData, {
            accentColor: '#ff4800',
            isCurrency: true
        });
    }

    // Mini Sparkline Initializations
    const sparklineElements = document.querySelectorAll('[data-sparkline-values]');
    sparklineElements.forEach(elem => {
        try {
            const rawVals = elem.getAttribute('data-sparkline-values');
            const values = JSON.parse(rawVals);
            const color = elem.getAttribute('data-sparkline-color') || '#ff4800';
            window.MoonshineChartGenerator.renderSparkline(elem, values, {
                accentColor: color
            });
        } catch (e) {
            console.error('Failed processing sparkline configuration', e);
        }
    });
});