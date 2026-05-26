/**
 * PIPELINE-CONTROLLER.JS
 * Part of The War Room (Buyer Dashboard)
 * 
 * Handles Kanban state management, drag-and-drop interactions, 
 * and persistence for acquisition deal flow.
 */

const PipelineController = (function() {
    // Pipeline configuration
    const STAGES = [
        { id: 'research', label: 'INITIAL REVIEW', color: 'var(--bone)' },
        { id: 'diligence', label: 'DUE DILIGENCE', color: 'var(--oxidized-copper)' },
        { id: 'loi', label: 'LOI SENT', color: 'var(--copper-glow)' },
        { id: 'closed', label: 'CLOSED / LOI SIGNED', color: 'var(--acid-green)' }
    ];

    let pipelineData = JSON.parse(localStorage.getItem('dealPipeline')) || {};
    let activeDeals = [];

    // Inject Dashboard CSS
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            #war-room-overlay {
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                height: calc(100vh - 70px);
                background: var(--obsidian);
                z-index: 800;
                display: none;
                padding: 2rem;
                overflow-x: auto;
            }

            .war-room-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 2rem;
                border-bottom: 4px solid var(--bone);
                padding-bottom: 1rem;
            }

            .pipeline-grid {
                display: grid;
                grid-template-columns: repeat(4, minmax(300px, 1fr));
                gap: 1.5rem;
                height: 80%;
                min-width: 1200px;
            }

            .pipeline-column {
                background: var(--graphite);
                border: 1px solid var(--graphite-light);
                display: flex;
                flex-direction: column;
                min-height: 500px;
            }

            .column-header {
                padding: 1rem;
                border-bottom: 2px solid var(--bone);
                background: var(--graphite-light);
            }

            .column-title {
                font-family: 'JetBrains Mono', monospace;
                font-weight: 800;
                font-size: 0.75rem;
                display: flex;
                justify-content: space-between;
            }

            .drop-zone {
                flex: 1;
                padding: 1rem;
                transition: background 0.2s;
            }

            .drop-zone.drag-over {
                background: rgba(193, 255, 0, 0.05);
                outline: 2px dashed var(--acid-green);
            }

            .pipeline-card {
                background: var(--obsidian);
                border: 1px solid var(--graphite-light);
                padding: 1rem;
                margin-bottom: 1rem;
                cursor: grab;
                transition: transform 0.2s;
            }

            .pipeline-card:active { cursor: grabbing; }
            .pipeline-card:hover { border-color: var(--bone); }
            
            .pipeline-card h4 {
                font-size: 0.9rem;
                font-weight: 800;
                margin-bottom: 0.5rem;
            }

            .pipeline-card .meta {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.65rem;
                color: #777;
            }

            .war-room-toggle {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 1001;
                box-shadow: 8px 8px 0 var(--obsidian);
            }

            .empty-state {
                font-family: 'JetBrains Mono', monospace;
                color: #444;
                text-align: center;
                margin-top: 2rem;
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(style);
    };

    const init = () => {
        injectStyles();
        createOverlay();
        createToggleButton();
        refreshData();
    };

    const createOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'war-room-overlay';
        overlay.innerHTML = `
            <div class="war-room-header">
                <div>
                    <h2 class="mono" style="font-size: 2rem; line-height: 1;">THE WAR ROOM</h2>
                    <p class="mono" style="font-size: 0.7rem; color: var(--oxidized-copper);">ACTIVE ACQUISITION PIPELINE</p>
                </div>
                <div class="mono" style="font-size: 0.7rem; text-align: right;">
                    SESSION ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}<br>
                    READY TO DEPLOY CAPITAL
                </div>
            </div>
            <div class="pipeline-grid" id="pipelineGrid"></div>
        `;
        document.body.appendChild(overlay);
    };

    const createToggleButton = () => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-copper war-room-toggle mono';
        btn.innerHTML = 'MISSION CONTROL';
        btn.onclick = toggleDashboard;
        document.body.appendChild(btn);
    };

    const toggleDashboard = () => {
        const overlay = document.getElementById('war-room-overlay');
        const isVisible = overlay.style.display === 'block';
        overlay.style.display = isVisible ? 'none' : 'block';
        document.body.style.overflow = isVisible ? 'auto' : 'hidden';
        
        const btn = document.querySelector('.war-room-toggle');
        btn.innerHTML = isVisible ? 'MISSION CONTROL' : 'RETURN TO FEED';
        btn.classList.toggle('btn-primary');
        
        if (!isVisible) refreshData();
    };

    const refreshData = () => {
        // Sync with main dealData and localStorage saved items
        const savedIds = JSON.parse(localStorage.getItem('savedDeals')) || [];
        // dealData is assumed to be global from the base component
        if (typeof dealData !== 'undefined') {
            activeDeals = dealData.filter(d => savedIds.includes(d.id));
        }
        renderBoard();
    };

    const renderBoard = () => {
        const grid = document.getElementById('pipelineGrid');
        grid.innerHTML = '';

        STAGES.forEach(stage => {
            const stageDeals = activeDeals.filter(d => (pipelineData[d.id] || 'research') === stage.id);
            
            const col = document.createElement('div');
            col.className = 'pipeline-column';
            col.innerHTML = `
                <div class="column-header" style="border-top: 4px solid ${stage.color}">
                    <div class="column-title">
                        <span>${stage.label}</span>
                        <span>[${stageDeals.length}]</span>
                    </div>
                </div>
                <div class="drop-zone" id="dz-${stage.id}" data-stage="${stage.id}">
                    ${stageDeals.length === 0 ? '<div class="empty-state">NO ASSETS</div>' : ''}
                </div>
            `;
            grid.appendChild(col);

            const dz = col.querySelector('.drop-zone');
            
            // Drag and Drop Events
            dz.addEventListener('dragover', e => {
                e.preventDefault();
                dz.classList.add('drag-over');
            });

            dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));

            dz.addEventListener('drop', e => {
                e.preventDefault();
                dz.classList.remove('drag-over');
                const dealId = e.dataTransfer.getData('text/plain');
                updateDealStage(dealId, stage.id);
            });

            stageDeals.forEach(deal => {
                const card = document.createElement('div');
                card.className = 'pipeline-card brutalist-border';
                card.draggable = true;
                card.innerHTML = `
                    <h4>${deal.title}</h4>
                    <div class="meta">SDE: ${new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(deal.sde)}</div>
                    <div class="meta">MULT: ${deal.multiple}x</div>
                    <div style="margin-top:0.5rem; height:2px; width:100%; background:var(--graphite-light);"></div>
                `;

                card.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', deal.id);
                    card.style.opacity = '0.4';
                });

                card.addEventListener('dragend', () => {
                    card.style.opacity = '1';
                });

                dz.appendChild(card);
            });
        });
    };

    const updateDealStage = (dealId, stageId) => {
        pipelineData[dealId] = stageId;
        localStorage.setItem('dealPipeline', JSON.stringify(pipelineData));
        renderBoard();
        
        // Log to terminal style (optional visual feedback)
        console.log(`[SYSTEM] Deal #${dealId} moved to stage: ${stageId.toUpperCase()}`);
    };

    // Public API
    return {
        init: init,
        refresh: refreshData,
        toggle: toggleDashboard
    };
})();

// Auto-initialize when script loads
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    PipelineController.init();
} else {
    document.addEventListener('DOMContentLoaded', PipelineController.init);
}