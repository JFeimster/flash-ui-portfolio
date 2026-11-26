/**
 * Moonshine Capital Partners - Affiliate Analytics & Performance Dashboard
 * Dynamic Brutalist SVG Charting Engine (Zero-Dependencies)
 * Matches Prism Logic / Toxic Volt Yellow / Hot Pink Aesthetic
 */

class MoonshineBrutalistCharts {
    constructor() {
        this.colors = {
            bg: '#FFFFFF',
            black: '#000000',
            volt: '#E2FF00',
            pink: '#FF0055',
            grayMuted: '#E5E7EB',
            gridColor: 'rgba(0, 0, 0, 0.08)'
        };
        
        this.fontFamily = "'Space Grotesk', sans-serif";
        this.init();
    }

    init() {
        // Initialize charts when DOM is fully prepared
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.boot());
        } else {
            this.boot();
        }

        // Handle structural responsiveness
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.boot(), 250);
        });
    }

    boot() {
        this.renderClicksChart();
        this.renderCommissionsChart();
        this.renderLeadStatusChart();
        this.setupLiveSimulation();
    }

    /**
     * Helper to clear previous svg instances inside target containers
     */
    clearContainer(id) {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = '';
            return container;
        }
        return null;
    }

    /**
     * CHART 1: Stark Brutalist Bar Chart (Unique Link Clicks over 7 Days)
     * Features offset black drop-shadows on every bar.
     */
    renderClicksChart() {
        const container = this.clearContainer('clicks-chart-container');
        if (!container) return;

        const data = [120, 280, 190, 420, 310, 540, 610];
        const labels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        
        const width = container.clientWidth || 500;
        const height = container.clientHeight || 300;
        const padding = 50;

        const svg = this.createSVGElement('svg', {
            width: '100%',
            height: '100%',
            viewBox: `0 0 ${width} ${height}`,
            style: 'background-color: #FFFFFF; font-family: ' + this.fontFamily
        });

        // Grid lines (Brutalist pattern grid)
        const gridSteps = 4;
        const maxVal = Math.max(...data) * 1.1;
        for (let i = 0; i <= gridSteps; i++) {
            const y = padding + (i * (height - 2 * padding) / gridSteps);
            const gridVal = Math.round(maxVal - (i * maxVal / gridSteps));
            
            // Grid line
            svg.appendChild(this.createSVGElement('line', {
                x1: padding,
                y1: y,
                x2: width - padding,
                y2: y,
                stroke: this.colors.black,
                'stroke-width': '1',
                'stroke-dasharray': '4 4'
            }));

            // Grid Label
            const text = this.createSVGElement('text', {
                x: padding - 10,
                y: y + 4,
                'text-anchor': 'end',
                'font-size': '10px',
                'font-weight': '900',
                fill: this.colors.black
            });
            text.textContent = gridVal;
            svg.appendChild(text);
        }

        // Render Bars with hard black shadows
        const numBars = data.length;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const barSpacing = chartWidth / numBars;
        const barWidth = barSpacing * 0.6;

        data.forEach((val, index) => {
            const x = padding + (index * barSpacing) + (barSpacing - barWidth) / 2;
            const barHeight = (val / maxVal) * chartHeight;
            const y = height - padding - barHeight;

            // 1. Black Hard Shadow Bar (Offset)
            svg.appendChild(this.createSVGElement('rect', {
                x: x + 6,
                y: y + 6,
                width: barWidth,
                height: barHeight,
                fill: this.colors.black
            }));

            // 2. Front Accent Bar
            const bar = this.createSVGElement('rect', {
                x: x,
                y: y,
                width: barWidth,
                height: barHeight,
                fill: this.colors.volt,
                stroke: this.colors.black,
                'stroke-width': '4',
                class: 'transition-all duration-200 cursor-pointer hover:fill-white'
            });

            // Interactive Tooltip binding
            bar.addEventListener('mouseenter', (e) => this.showTooltip(e, `${val} CLICKS`));
            bar.addEventListener('mouseleave', () => this.hideTooltip());
            
            svg.appendChild(bar);

            // Labels
            const labelText = this.createSVGElement('text', {
                x: x + barWidth / 2,
                y: height - padding + 20,
                'text-anchor': 'middle',
                'font-size': '11px',
                'font-weight': '900',
                fill: this.colors.black
            });
            labelText.textContent = labels[index];
            svg.appendChild(labelText);
        });

        // Base Axis Line
        svg.appendChild(this.createSVGElement('line', {
            x1: padding,
            y1: height - padding,
            x2: width - padding,
            y2: height - padding,
            stroke: this.colors.black,
            'stroke-width': '4'
        }));

        container.appendChild(svg);
    }

    /**
     * CHART 2: Stark Brutalist Line Chart (Commissions Earned Over Time)
     * Features thick vector paths, shadow paths, and bold coordinates.
     */
    renderCommissionsChart() {
        const container = this.clearContainer('commissions-chart-container');
        if (!container) return;

        const data = [1200, 1900, 1400, 3100, 4200, 3800, 5900, 7200];
        const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

        const width = container.clientWidth || 500;
        const height = container.clientHeight || 300;
        const padding = 50;

        const svg = this.createSVGElement('svg', {
            width: '100%',
            height: '100%',
            viewBox: `0 0 ${width} ${height}`,
            style: 'background-color: #FFFFFF; font-family: ' + this.fontFamily
        });

        const maxVal = Math.max(...data) * 1.1;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const stepX = chartWidth / (data.length - 1);

        // Gridlines
        const gridSteps = 4;
        for (let i = 0; i <= gridSteps; i++) {
            const y = padding + (i * chartHeight / gridSteps);
            const gridVal = Math.round(maxVal - (i * maxVal / gridSteps));

            svg.appendChild(this.createSVGElement('line', {
                x1: padding,
                y1: y,
                x2: width - padding,
                y2: y,
                stroke: this.colors.black,
                'stroke-width': '1',
                'stroke-dasharray': '4 4'
            }));

            const text = this.createSVGElement('text', {
                x: padding - 10,
                y: y + 4,
                'text-anchor': 'end',
                'font-size': '10px',
                'font-weight': '900',
                fill: this.colors.black
            });
            text.textContent = `$${gridVal}`;
            svg.appendChild(text);
        }

        // Construct point coordinates
        const points = data.map((val, i) => {
            return {
                x: padding + (i * stepX),
                y: height - padding - ((val / maxVal) * chartHeight)
            };
        });

        // 1. Generate Bold Black Offset Shadow Path
        let shadowPathD = `M ${points[0].x + 4} ${points[0].y + 4}`;
        for (let i = 1; i < points.length; i++) {
            shadowPathD += ` L ${points[i].x + 4} ${points[i].y + 4}`;
        }
        svg.appendChild(this.createSVGElement('path', {
            d: shadowPathD,
            fill: 'none',
            stroke: this.colors.black,
            'stroke-width': '6',
            'stroke-linejoin': 'miter',
            'stroke-linecap': 'square'
        }));

        // 2. Generate Main Hot Pink Line Path
        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }
        svg.appendChild(this.createSVGElement('path', {
            d: pathD,
            fill: 'none',
            stroke: this.colors.pink,
            'stroke-width': '4',
            'stroke-linejoin': 'miter',
            'stroke-linecap': 'square'
        }));

        // 3. Render Massive Square Nodes for data points
        points.forEach((pt, i) => {
            // Shadow anchor
            svg.appendChild(this.createSVGElement('rect', {
                x: pt.x - 6 + 3,
                y: pt.y - 6 + 3,
                width: '12',
                height: '12',
                fill: this.colors.black
            }));

            // Main Volt Anchor
            const node = this.createSVGElement('rect', {
                x: pt.x - 6,
                y: pt.y - 6,
                width: '12',
                height: '12',
                fill: this.colors.volt,
                stroke: this.colors.black,
                'stroke-width': '3',
                class: 'cursor-pointer hover:fill-white'
            });

            node.addEventListener('mouseenter', (e) => this.showTooltip(e, `$${data[i]} COMMISSION`));
            node.addEventListener('mouseleave', () => this.hideTooltip());

            svg.appendChild(node);

            // X Labels
            const labelText = this.createSVGElement('text', {
                x: pt.x,
                y: height - padding + 20,
                'text-anchor': 'middle',
                'font-size': '11px',
                'font-weight': '900',
                fill: this.colors.black
            });
            labelText.textContent = labels[i];
            svg.appendChild(labelText);
        });

        // Axis
        svg.appendChild(this.createSVGElement('line', {
            x1: padding,
            y1: height - padding,
            x2: width - padding,
            y2: height - padding,
            stroke: this.colors.black,
            'stroke-width': '4'
        }));

        container.appendChild(svg);
    }

    /**
     * CHART 3: Stark Horizontal Block Progress/Donut representation for Lead Conversions
     * Visualizing: Verification -> Underwriting -> Capital Cleared
     */
    renderLeadStatusChart() {
        const container = this.clearContainer('lead-status-chart-container');
        if (!container) return;

        const statuses = [
            { label: 'CONVERTED / PAID', count: 18, color: this.colors.volt },
            { label: 'UNDERWRITING', count: 12, color: this.colors.pink },
            { label: 'VERIFICATION', count: 6, color: '#FFFFFF' }
        ];

        const total = statuses.reduce((acc, curr) => acc + curr.count, 0);
        const width = container.clientWidth || 500;
        const height = container.clientHeight || 120;
        const padding = 20;

        const svg = this.createSVGElement('svg', {
            width: '100%',
            height: '100%',
            viewBox: `0 0 ${width} ${height}`,
            style: 'background-color: #FFFFFF; font-family: ' + this.fontFamily
        });

        const barWidth = width - 2 * padding;
        const barHeight = 36;
        const yPos = 20;

        let currentX = padding;

        statuses.forEach((status) => {
            const segmentWidth = (status.count / total) * barWidth;
            if (segmentWidth <= 0) return;

            // 1. Structural Solid Black Border segmented blocks
            const rect = this.createSVGElement('rect', {
                x: currentX,
                y: yPos,
                width: segmentWidth,
                height: barHeight,
                fill: status.color,
                stroke: this.colors.black,
                'stroke-width': '4'
            });

            rect.addEventListener('mouseenter', (e) => this.showTooltip(e, `${status.label}: ${status.count} LEADS (${Math.round((status.count/total)*100)}%)`));
            rect.addEventListener('mouseleave', () => this.hideTooltip());

            svg.appendChild(rect);

            // Label generation below segment block
            const labelX = currentX + segmentWidth / 2;
            const label = this.createSVGElement('text', {
                x: labelX,
                y: yPos + barHeight + 24,
                'text-anchor': 'middle',
                'font-size': '10px',
                'font-weight': '900',
                fill: this.colors.black
            });
            label.textContent = `${status.count} (${Math.round((status.count/total)*100)}%)`;
            svg.appendChild(label);

            const desc = this.createSVGElement('text', {
                x: labelX,
                y: yPos + barHeight + 38,
                'text-anchor': 'middle',
                'font-size': '8px',
                'font-weight': '700',
                fill: this.colors.black
            });
            desc.textContent = status.label;
            svg.appendChild(desc);

            currentX += segmentWidth;
        });

        container.appendChild(svg);
    }

    /**
     * Simulation Mechanism - Periodically fires synthetic performance actions 
     * to keep metrics visualizers active.
     */
    setupLiveSimulation() {
        setInterval(() => {
            const liveFeed = document.getElementById('live-dispatch-feed');
            if (liveFeed) {
                const events = [
                    'SYSTEM // DYNAMIC COOKIE RECONCILED FROM INJECTED REFS',
                    'PIPELINE // LEAD SIMULATION CLEARED BY DESK UNDERWRITER',
                    'TRANSACT // RECURRING BALANCE ACCRUAL TRIGGERED ON NODE v3.4',
                    'NETWORK // DYNAMIC TRAFFIC SURGE RECORDED FOR CODENAME',
                    'LEDGER // SYSTEM RECONCILED SUCCESS_GATE FOR ACTIVE CODES'
                ];
                const randEvent = events[Math.floor(Math.random() * events.length)];
                
                const logNode = document.createElement('p');
                logNode.className = 'text-[#E2FF00] font-mono text-[10px] leading-tight mb-1 animate-pulse';
                logNode.textContent = `> ${new Date().toISOString().slice(11, 19)}: ${randEvent}`;
                
                liveFeed.prepend(logNode);
                if (liveFeed.children.length > 5) {
                    liveFeed.removeChild(liveFeed.lastChild);
                }
            }
        }, 8000);
    }

    /**
     * Standard Dynamic Interactive Tooltip Render Unit
     */
    showTooltip(event, content) {
        let tooltip = document.getElementById('brutalist-chart-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'brutalist-chart-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = '#FFFFFF';
            tooltip.style.border = '4px solid #000000';
            tooltip.style.boxShadow = '4px 4px 0px 0px #000000';
            tooltip.style.padding = '8px 12px';
            tooltip.style.fontSize = '12px';
            tooltip.style.fontWeight = '900';
            tooltip.style.color = '#000000';
            tooltip.style.fontFamily = this.fontFamily;
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '99999';
            tooltip.style.textTransform = 'uppercase';
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
        
        const moveTooltip = (e) => {
            tooltip.style.left = `${e.pageX + 15}px`;
            tooltip.style.top = `${e.pageY + 15}px`;
        };
        
        event.target.addEventListener('mousemove', moveTooltip);
        moveTooltip(event);
    }

    hideTooltip() {
        const tooltip = document.getElementById('brutalist-chart-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    /**
     * XML Namespace SVG generator helper
     */
    createSVGElement(tag, attrs) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
        return el;
    }
}

// Auto-instantiate performance dashboard visualization suite
const MoonshineEngineInstance = new MoonshineBrutalistCharts();