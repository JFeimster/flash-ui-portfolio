/**
 * Prism Scan | Sequence Manager Logic
 * Handles customization, reordering, and industry-specific logic for search sequences.
 */

const SequenceManager = (() => {
    // State: Default search steps
    let steps = [
        { id: 'web-parse', label: 'WEBSITE ABOUT PAGE PARSING', active: true, industryWeights: {} },
        { id: 'team-scrape', label: 'TEAM DIRECTORY SCRAPE', active: true, industryWeights: {} },
        { id: 'contact-node', label: 'CONTACT NODE EXTRACTION', active: true, industryWeights: {} },
        { id: 'linkedin-agg', label: 'LINKEDIN COMPANY DATA AGGREGATION', active: true, industryWeights: {} },
        { id: 'google-dork', label: 'GOOGLE DORKING: EXECUTIVE MATCH', active: true, industryWeights: {} },
        { id: 'sos-registry', label: 'SECRETARY OF STATE REGISTRY SEARCH', active: true, industryWeights: { 'Legal': 1.5, 'Finance': 1.2 } },
        { id: 'meta-data', label: 'FACEBOOK BUSINESS META-DATA', active: true, industryWeights: { 'Retail': 1.5, 'Hospitality': 1.8 } },
        { id: 'chamber-lookup', label: 'LOCAL CHAMBER DIRECTORY LOOKUP', active: true, industryWeights: { 'Services': 1.3 } },
        { id: 'third-party', label: 'BBB / YELP / THIRD-PARTY VERIFICATION', active: true, industryWeights: { 'Logistics': 1.1, 'Construction': 1.4 } }
    ];

    // Industry templates for custom search strings
    const industryTemplates = {
        'Logistics': { prefix: 'OP_DIRECTOR', focus: 'Supply Chain' },
        'Finance': { prefix: 'COMPLIANCE_OFFICER', focus: 'Risk Management' },
        'Retail': { prefix: 'STORE_OWNER', focus: 'Operations' },
        'Tech': { prefix: 'CTO_FOUNDER', focus: 'Engineering' }
    };

    /**
     * Initializes the manager by rendering the current sequence into the UI
     */
    const init = () => {
        const seqList = document.getElementById('seqList');
        if (!seqList) return;

        renderUI();
        injectConfigStyles();
    };

    /**
     * Renders the sequence items with interactive controls
     */
    const renderUI = () => {
        const seqList = document.getElementById('seqList');
        seqList.innerHTML = '';

        steps.forEach((step, index) => {
            const li = document.createElement('li');
            li.className = `sequence-item ${step.active ? '' : 'disabled'}`;
            li.style.cursor = 'pointer';
            li.setAttribute('draggable', 'true');
            li.dataset.index = index;

            li.innerHTML = `
                <div class="step-dot" style="${step.active ? '' : 'background: #333;'}"></div>
                <div class="sequence-text" style="flex-grow: 1;">
                    <span style="display: block;">${step.label}</span>
                    <span style="font-size: 8px; color: var(--accent-cyan); opacity: 0.6;">
                        ${step.active ? 'ACTIVE' : 'BYPASSED'} • PRIORITY: ${100 - (index * 5)}
                    </span>
                </div>
                <div class="controls" style="display: flex; gap: 8px; font-size: 10px;">
                    <span onclick="SequenceManager.toggleStep(${index})" style="color: var(--accent-magenta);">[TOGGLE]</span>
                </div>
            `;

            // Drag and Drop Events
            li.addEventListener('dragstart', handleDragStart);
            li.addEventListener('dragover', handleDragOver);
            li.addEventListener('drop', handleDrop);

            seqList.appendChild(li);
        });
    };

    /**
     * Toggles a search source on or off
     */
    const toggleStep = (index) => {
        steps[index].active = !steps[index].active;
        renderUI();
        const msg = steps[index].active ? `Enabled ${steps[index].id}` : `Bypassed ${steps[index].id}`;
        if (typeof log === 'function') log(`CONFIG_UPDATE: ${msg}`);
    };

    /**
     * Reorders steps based on industry sector or manual input
     */
    const setIndustryProfile = (industry) => {
        if (!industryTemplates[industry]) return;
        
        // Boost relevant sources based on industry weights
        steps.sort((a, b) => {
            const weightA = a.industryWeights[industry] || 1.0;
            const weightB = b.industryWeights[industry] || 1.0;
            return weightB - weightA;
        });

        renderUI();
        if (typeof log === 'function') log(`SEQUENCE_OPTIMIZED: Sector match found for [${industry.toUpperCase()}]`);
    };

    /**
     * Drag and Drop Logic
     */
    let dragSrcIndex = null;

    function handleDragStart(e) {
        dragSrcIndex = this.dataset.index;
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        if (e.preventDefault) e.preventDefault();
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) e.stopPropagation();
        const targetIndex = this.dataset.index;

        if (dragSrcIndex !== targetIndex) {
            const temp = steps[dragSrcIndex];
            steps.splice(dragSrcIndex, 1);
            steps.splice(targetIndex, 0, temp);
            renderUI();
        }
        return false;
    }

    /**
     * Injects additional styles for the configurator UI
     */
    const injectConfigStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .sequence-item.disabled { opacity: 0.2; }
            .sequence-item:hover { background: rgba(255,255,255,0.05); }
            .sequence-item[draggable="true"] { cursor: grab; }
            .sequence-item[draggable="true"]:active { cursor: grabbing; }
        `;
        document.head.appendChild(style);
    };

    /**
     * Getter for active sequence to be used by the main scanner
     */
    const getActiveSequence = () => steps.filter(s => s.active);

    // Expose public API
    return {
        init,
        toggleStep,
        setIndustryProfile,
        getActiveSequence,
        getSteps: () => steps
    };
})();

// Hook into the existing UI
document.addEventListener('DOMContentLoaded', () => {
    SequenceManager.init();

    // Attach listener to industry input
    const indInput = document.getElementById('bizInd');
    if (indInput) {
        indInput.addEventListener('change', (e) => {
            SequenceManager.setIndustryProfile(e.target.value);
        });
    }

    // Override the global startScan to use the dynamic sequence
    const originalStartScan = window.startScan;
    window.startScan = async function() {
        // Redefine items selector for the scan loop to use current DOM state
        // This ensures the loop follows the customized/reordered list
        const name = document.getElementById('bizName').value || "TARGET_ENTITY";
        const status = document.getElementById('status');
        const scanline = document.getElementById('scanline');
        const resultCard = document.getElementById('resultCard');
        const terminal = document.getElementById('terminal');

        const activeItems = document.querySelectorAll('.sequence-item:not(.disabled)');
        
        // Reset
        document.querySelectorAll('.sequence-item').forEach(i => {
            i.classList.remove('active', 'complete');
        });
        resultCard.style.display = 'none';
        terminal.innerHTML = '';
        
        status.innerText = "Scanning...";
        status.className = "status-badge"; 
        status.style.color = "var(--accent-cyan)";
        status.style.borderColor = "var(--accent-cyan)";
        status.style.background = "rgba(0, 242, 255, 0.1)";
        scanline.style.display = "block";

        if (typeof log === 'function') log(`Initializing optimized sequence for: ${name}`);

        for(let i=0; i < activeItems.length; i++) {
            activeItems[i].classList.add('active');
            const stepName = activeItems[i].querySelector('.sequence-text span').innerText;
            if (typeof log === 'function') log(`Querying: ${stepName}...`);
            
            await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
            
            activeItems[i].classList.remove('active');
            activeItems[i].classList.add('complete');
            
            // Random injection logic
            if(i === 1 && typeof log === 'function') log(`> Identifying node clusters...`);
            if(i === 3 && typeof log === 'function') log(`> Metadata handshake verified.`);
        }

        status.innerText = "Scan Complete";
        status.style.color = "var(--accent-lime)";
        status.style.borderColor = "var(--accent-lime)";
        status.style.background = "rgba(188, 255, 0, 0.1)";
        scanline.style.display = "none";
        
        if (typeof log === 'function') log(`Sequence logic concluded. Compiling target dossier.`);
        
        resultCard.style.display = 'block';
        document.getElementById('foundName').innerText = "Sarah Jenkins";
        document.getElementById('foundRole').innerText = "Director of Operations • " + name;
    };
});