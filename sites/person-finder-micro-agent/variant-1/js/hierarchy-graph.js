/**
 * Hierarchy Graph Visualization
 * Component: Company Intelligence Detail - Team Map
 * Matches: Person-Finder Micro-Agent v2.4 Theme
 */

class HierarchyGraph {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.data = {
            company: "Acme Corp Industries",
            sos_status: "Active / Good Standing",
            nodes: [
                { id: 1, name: "Marcus Vane", title: "President / CEO", type: "sos", level: 0, social: "linkedin" },
                { id: 2, name: "Sarah Jenkins", title: "Operations Director", type: "verified", level: 1, social: "linkedin" },
                { id: 3, name: "David Chen", title: "Registered Agent", type: "sos", level: 1, social: "none" },
                { id: 4, name: "Elena Rodriguez", title: "Product Head", type: "lead", level: 2, social: "twitter" },
                { id: 5, name: "Thomas Wright", title: "HR Manager", type: "lead", level: 2, social: "none" }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 4 },
                { source: 2, target: 5 }
            ]
        };

        this.init();
    }

    init() {
        this.injectStyles();
        this.render();
        this.animate();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .hierarchy-wrapper {
                width: 100%;
                height: 100%;
                position: relative;
                background: #0a0c10;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                font-family: 'Inter', sans-serif;
            }

            .graph-header {
                padding: 15px 20px;
                border-bottom: 1px solid #1f242d;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(17, 20, 27, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10;
            }

            .graph-title {
                font-size: 0.8rem;
                font-weight: 700;
                letter-spacing: 0.1em;
                color: #94a3b8;
                text-transform: uppercase;
            }

            .sos-chip {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                padding: 4px 10px;
                border-radius: 4px;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }

            .canvas-area {
                flex-grow: 1;
                position: relative;
                cursor: grab;
            }

            .node {
                position: absolute;
                width: 180px;
                background: #11141b;
                border: 1px solid #1f242d;
                border-radius: 8px;
                padding: 12px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 2;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            }

            .node:hover {
                border-color: #3b82f6;
                transform: translateY(-2px);
                box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
            }

            .node.type-sos { border-left: 3px solid #10b981; }
            .node.type-verified { border-left: 3px solid #3b82f6; }
            .node.type-lead { border-left: 3px solid #94a3b8; }

            .node-name {
                font-size: 0.85rem;
                font-weight: 600;
                color: #e2e8f0;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .node-title {
                font-size: 0.7rem;
                color: #94a3b8;
                font-family: 'JetBrains Mono', monospace;
            }

            .node-tag {
                display: inline-block;
                margin-top: 8px;
                font-size: 0.6rem;
                text-transform: uppercase;
                padding: 2px 6px;
                border-radius: 3px;
                background: #1f242d;
            }

            .connection-line {
                position: absolute;
                background: #1f242d;
                height: 1px;
                transform-origin: 0 0;
                z-index: 1;
                pointer-events: none;
            }

            .scan-line {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, #3b82f6, transparent);
                opacity: 0.3;
                animation: scan 4s linear infinite;
                z-index: 3;
            }

            @keyframes scan {
                0% { top: 0%; }
                100% { top: 100%; }
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'hierarchy-wrapper';
        
        wrapper.innerHTML = `
            <div class="graph-header">
                <div class="graph-title">Organization Intelligence Map</div>
                <div class="sos-chip">SOS VERIFIED: ${this.data.sos_status}</div>
            </div>
            <div class="canvas-area" id="graph-canvas">
                <div class="scan-line"></div>
            </div>
        `;

        this.container.appendChild(wrapper);
        const canvas = wrapper.querySelector('#graph-canvas');

        // Layout Constants
        const startX = 50;
        const startY = 60;
        const colWidth = 240;
        const rowHeight = 120;

        // Create Nodes
        const renderedNodes = {};
        this.data.nodes.forEach(node => {
            const nodeEl = document.createElement('div');
            nodeEl.className = `node type-${node.type}`;
            
            // Basic positioning logic based on level
            const x = startX + (node.level * colWidth);
            const y = startY + (this.data.nodes.filter(n => n.level === node.level).indexOf(node) * rowHeight);
            
            nodeEl.style.left = `${x}px`;
            nodeEl.style.top = `${y}px`;
            
            nodeEl.innerHTML = `
                <div class="node-name">${node.name}</div>
                <div class="node-title">${node.title}</div>
                <div class="node-tag">${node.type === 'sos' ? 'Registry Data' : 'Crawler Found'}</div>
            `;
            
            canvas.appendChild(nodeEl);
            renderedNodes[node.id] = { el: nodeEl, x, y };
        });

        // Create Connection Lines
        this.data.links.forEach(link => {
            const source = renderedNodes[link.source];
            const target = renderedNodes[link.target];
            
            const x1 = source.x + 180;
            const y1 = source.y + 35;
            const x2 = target.x;
            const y2 = target.y + 35;

            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            const line = document.createElement('div');
            line.className = 'connection-line';
            line.style.width = `${length}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}deg)`;
            
            canvas.appendChild(line);
        });
    }

    animate() {
        // Placeholder for potential interactive features (drag, zoom, or data updates)
        console.log("Hierarchy Intelligence Graph Initialized");
    }
}

// Auto-initialize if the module is loaded
document.addEventListener('DOMContentLoaded', () => {
    // This looks for a specific container in the expanded view
    const graphContainer = document.querySelector('.intelligence-graph-container');
    if (graphContainer) {
        new HierarchyGraph('.intelligence-graph-container');
    }
});
