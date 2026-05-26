const COMMAND_STYLES = `
    #command-center {
        position: fixed;
        top: 0;
        right: -100%;
        width: 100%;
        height: 100%;
        background: var(--obsidian);
        z-index: 2000;
        transition: right 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        display: flex;
        flex-direction: column;
        border-left: var(--border-width) solid var(--acid-green);
    }

    #command-center.active {
        right: 0;
    }

    .cc-header {
        padding: 2rem;
        border-bottom: var(--border-width) solid var(--graphite);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cc-grid {
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 0;
        flex-grow: 1;
        overflow: hidden;
    }

    .cc-main {
        padding: 2rem;
        overflow-y: auto;
        border-right: 1px solid var(--graphite);
    }

    .cc-sidebar {
        padding: 2rem;
        background: #080808;
        overflow-y: auto;
    }

    /* Kanban Style */
    .pipeline-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .pipeline-column {
        background: rgba(26, 26, 26, 0.5);
        border: 1px solid var(--graphite);
        min-height: 500px;
        padding: 1rem;
    }

    .column-header {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: var(--oxidized-copper);
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--graphite);
        display: flex;
        justify-content: space-between;
    }

    .pipeline-card {
        background: var(--panel);
        border: 1px solid var(--graphite);
        padding: 1rem;
        margin-bottom: 1rem;
        cursor: grab;
    }

    .pipeline-card h4 {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }

    .pipeline-card .price {
        color: var(--acid-green);
        font-family: 'JetBrains Mono';
        font-size: 0.8rem;
    }

    /* Notes Terminal */
    .note-terminal {
        background: #000;
        border: 1px solid var(--graphite);
        padding: 1rem;
        margin-top: 1rem;
    }

    .note-terminal textarea {
        width: 100%;
        background: transparent;
        border: none;
        color: var(--bone);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        resize: vertical;
        min-height: 100px;
        outline: none;
    }

    .cc-close {
        cursor: pointer;
        font-family: 'JetBrains Mono';
        font-size: 0.8rem;
        color: var(--blood-orange);
    }

    .alert-feed {
        margin-top: 2rem;
    }

    .alert-item {
        border-left: 2px solid var(--acid-green);
        padding: 0.75rem;
        background: var(--graphite);
        margin-bottom: 0.5rem;
        font-size: 0.7rem;
    }

    .alert-item span {
        display: block;
        color: #666;
        margin-bottom: 0.2rem;
    }

    .move-btn {
        background: none;
        border: 1px solid #333;
        color: #666;
        font-size: 0.6rem;
        padding: 0.2rem 0.4rem;
        cursor: pointer;
        margin-top: 0.5rem;
    }

    .move-btn:hover {
        border-color: var(--bone);
        color: var(--bone);
    }
`;

class DealFlowCommand {
    constructor() {
        this.stages = ['REVIEWING', 'DUE DILIGENCE', 'LOI SENT'];
        this.data = this.loadData();
        this.init();
    }

    loadData() {
        const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]');
        const pipeline = JSON.parse(localStorage.getItem('dealPipeline') || '{}');
        const notes = JSON.parse(localStorage.getItem('dealNotes') || '{}');
        
        // Ensure all saved deals are in pipeline
        saved.forEach(id => {
            if (!pipeline[id]) pipeline[id] = 'REVIEWING';
        });

        return { saved, pipeline, notes };
    }

    saveData() {
        localStorage.setItem('dealPipeline', JSON.stringify(this.data.pipeline));
        localStorage.setItem('dealNotes', JSON.stringify(this.data.notes));
    }

    init() {
        // Inject Styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = COMMAND_STYLES;
        document.head.appendChild(styleSheet);

        // Create UI Structure
        const cc = document.createElement('div');
        cc.id = 'command-center';
        cc.innerHTML = `
            <div class="cc-header">
                <div>
                    <h2 class="mono" style="font-size: 1.5rem;">PERSONAL DEAL FLOW COMMAND</h2>
                    <p class="mono" style="font-size: 0.6rem; color: var(--oxidized-copper);">SECURE TERMINAL // OPERATOR: ANONYMOUS</p>
                </div>
                <div class="cc-close" id="closeCC">[ EXIT TERMINAL ]</div>
            </div>
            <div class="cc-grid">
                <div class="cc-main">
                    <h3 class="mono" style="font-size: 0.8rem; margin-bottom: 1rem;">// ACTIVE DEAL PIPELINE</h3>
                    <div class="pipeline-container" id="pipelineGrid"></div>
                </div>
                <div class="cc-sidebar">
                    <h3 class="mono" style="font-size: 0.8rem;">// SAVED FILTERS & ALERTS</h3>
                    <div class="alert-feed">
                        <div class="alert-item">
                            <span>MATCH FOUND - 2H AGO</span>
                            Precision HVAC & Cooling matches "Service Business > $400k SDE"
                        </div>
                        <div class="alert-item">
                            <span>SYSTEM UPDATE</span>
                            Laundromat Portfolio (Phoenix) price reduced by $50,000.
                        </div>
                    </div>
                    <div id="activeNoteArea" style="margin-top: 3rem;">
                        <h3 class="mono" style="font-size: 0.8rem;">// DEAL NOTES</h3>
                        <p style="font-size: 0.7rem; color: #444; margin-top: 1rem;">Select a deal from the pipeline to edit secure notes.</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(cc);

        // Add Nav Link
        const navLinks = document.querySelector('.nav-links');
        const cmdLink = document.createElement('a');
        cmdLink.href = '#';
        cmdLink.innerText = 'Command Center';
        cmdLink.style.color = 'var(--acid-green)';
        cmdLink.onclick = (e) => {
            e.preventDefault();
            this.refreshUI();
            cc.classList.add('active');
        };
        navLinks.prepend(cmdLink);

        document.getElementById('closeCC').onclick = () => cc.classList.remove('active');
        
        this.refreshUI();
    }

    updateDealStage(id, newStage) {
        this.data.pipeline[id] = newStage;
        this.saveData();
        this.refreshUI();
    }

    saveNote(id, note) {
        this.data.notes[id] = note;
        this.saveData();
    }

    openNoteEditor(id) {
        const deal = listings.find(l => l.id == id);
        const noteArea = document.getElementById('activeNoteArea');
        noteArea.innerHTML = `
            <h3 class="mono" style="font-size: 0.8rem;">// NOTES: ${deal.title}</h3>
            <div class="note-terminal">
                <textarea placeholder="LOG BROKER CALL FINDINGS, RISKS, AND NEXT STEPS..." id="noteInput">${this.data.notes[id] || ''}</textarea>
            </div>
            <p class="mono" style="font-size: 0.5rem; color: var(--acid-green); margin-top: 0.5rem;">Auto-saving to local vault...</p>
        `;
        
        document.getElementById('noteInput').oninput = (e) => {
            this.saveNote(id, e.target.value);
        };
    }

    refreshUI() {
        this.data = this.loadData();
        const grid = document.getElementById('pipelineGrid');
        grid.innerHTML = '';

        this.stages.forEach(stage => {
            const col = document.createElement('div');
            col.className = 'pipeline-column';
            const count = Object.values(this.data.pipeline).filter(s => s === stage).length;
            
            col.innerHTML = `
                <div class="column-header">
                    <span>${stage}</span>
                    <span>(${count})</span>
                </div>
                <div class="column-cards" id="stage-${stage.replace(/\s+/g, '-')}"></div>
            `;
            
            const cardContainer = col.querySelector('.column-cards');
            
            this.data.saved.forEach(id => {
                if (this.data.pipeline[id] === stage) {
                    const deal = listings.find(l => l.id == id);
                    if (!deal) return;

                    const card = document.createElement('div');
                    card.className = 'pipeline-card';
                    card.onclick = () => this.openNoteEditor(id);
                    card.innerHTML = `
                        <h4>${deal.title}</h4>
                        <div class="price">$${(deal.price / 1000).toFixed(0)}K</div>
                        <div style="display: flex; gap: 5px;">
                            ${stage !== 'REVIEWING' ? `<button class="move-btn" onclick="event.stopPropagation(); window.dealFlow.updateDealStage(${id}, '${this.stages[this.stages.indexOf(stage)-1]}')">←</button>` : ''}
                            ${stage !== 'LOI SENT' ? `<button class="move-btn" onclick="event.stopPropagation(); window.dealFlow.updateDealStage(${id}, '${this.stages[this.stages.indexOf(stage)+1]}')">→</button>` : ''}
                        </div>
                    `;
                    cardContainer.appendChild(card);
                }
            });
            
            grid.appendChild(col);
        });
    }
}

// Global initialization
window.dealFlow = new DealFlowCommand();

// Listen for storage changes from main window (e.g. saving a new deal)
window.addEventListener('storage', () => {
    window.dealFlow.refreshUI();
});