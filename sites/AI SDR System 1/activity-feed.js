/**
 * activity-feed.js
 * Part of Carbon Kinetic Campaign Command Center
 * Simulates real-time outbound activity and engine orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
    const logWindow = document.querySelector('.log-window');
    const statsVals = document.querySelectorAll('.stat-val');
    const workflowNodes = document.querySelectorAll('.step-node');
    const progressLine = document.querySelector('.connector-progress');

    const config = {
        cities: ['New York', 'London', 'Singapore', 'Austin', 'Berlin', 'Tokyo'],
        niches: ['Web3 Infrastructure', 'AI/ML Ops', 'Enterprise SaaS', 'Fintech', 'HealthTech'],
        names: ['Sarah Chen', 'Marcus Thorne', 'Elena Rodriguez', 'David Park', 'James Wilson', 'Sonia Gupta'],
        tags: ['SOURCE', 'RESEARCH', 'QUALIFY', 'AI', 'DRAFT', 'SYSTEM'],
        intervals: { log: 3500, stats: 8000, workflow: 5000 }
    };

    /**
     * Format current timestamp for log entries
     */
    const getTimestamp = () => {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    };

    /**
     * Add a new log entry to the UI
     */
    const addLogEntry = (tag, msg) => {
        if (!logWindow) return;

        // Remove the processing indicator if it exists
        const processingIndicator = logWindow.querySelector('div[style*="margin-top: 15px"]');
        if (processingIndicator) processingIndicator.remove();

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-5px)';
        entry.style.transition = 'all 0.4s ease-out';
        
        entry.innerHTML = `
            <span class="ts">[${getTimestamp()}]</span>
            <span class="tag" style="color: ${tag === 'SYSTEM' ? 'var(--text-dim)' : 'var(--accent)'}">${tag}</span>
            <span class="msg">${msg}</span>
        `;

        logWindow.appendChild(entry);
        
        // Trigger animation
        setTimeout(() => {
            entry.style.opacity = '0.8';
            entry.style.transform = 'translateX(0)';
        }, 50);

        // Append the processing indicator back
        const newIndicator = document.createElement('div');
        newIndicator.style = 'margin-top: 15px; color: var(--accent); font-size: 11px; display: flex; align-items: center;';
        newIndicator.innerHTML = '<span class="status-dot"></span> Processing lead queue...';
        logWindow.appendChild(newIndicator);

        // Auto-scroll
        logWindow.scrollTop = logWindow.scrollHeight;

        // Cleanup old entries to prevent memory leak/DOM bloat
        const entries = logWindow.querySelectorAll('.log-entry');
        if (entries.length > 20) {
            entries[0].remove();
        }
    };

    /**
     * Update Dashboard Stats randomly
     */
    const updateStats = () => {
        statsVals.forEach(val => {
            let currentStr = val.innerText.replace(/[^0-9.]/g, '');
            let current = parseFloat(currentStr);
            
            if (val.innerText.includes('%')) {
                // Percentage update
                const change = (Math.random() * 0.4 - 0.1).toFixed(1);
                const next = (parseFloat(current) + parseFloat(change)).toFixed(1);
                val.innerText = `${next}%`;
            } else if (val.innerText.includes('$')) {
                // Currency update
                const change = (Math.random() * 0.5).toFixed(1);
                const next = (parseFloat(current) + parseFloat(change)).toFixed(1);
                val.innerText = `$${next}k`;
            } else {
                // Integer update
                const change = Math.floor(Math.random() * 3);
                const next = Math.floor(current + change);
                val.innerText = next.toLocaleString();
            }
        });
    };

    /**
     * Cycle through workflow visualizer nodes
     */
    let activeStep = 3; // Starting at "Personalize" based on HTML
    const cycleWorkflow = () => {
        if (!workflowNodes.length) return;

        workflowNodes.forEach((node, idx) => {
            node.classList.remove('active');
            if (idx < activeStep) {
                node.classList.add('complete');
            } else {
                node.classList.remove('complete');
            }
        });

        workflowNodes[activeStep].classList.add('active');
        
        // Update progress line percentage
        if (progressLine) {
            const progress = (activeStep / (workflowNodes.length - 1)) * 100;
            progressLine.style.width = `${progress}%`;
        }

        activeStep = (activeStep + 1) % workflowNodes.length;
    };

    /**
     * Generate synthetic activity messages
     */
    const generateActivity = () => {
        const randName = config.names[Math.floor(Math.random() * config.names.length)];
        const randCity = config.cities[Math.floor(Math.random() * config.cities.length)];
        const randNiche = config.niches[Math.floor(Math.random() * config.niches.length)];
        
        const scenarios = [
            { tag: 'SOURCE', msg: `Identified ${randName} (${randNiche}) in ${randCity}` },
            { tag: 'RESEARCH', msg: `Analyzing LinkedIn signal for ${randName}...` },
            { tag: 'QUALIFY', msg: `Lead score updated: ${Math.floor(Math.random() * 20 + 80)}/100` },
            { tag: 'AI', msg: `Refining value proposition for ${randNiche} market` },
            { tag: 'SYSTEM', msg: `Rotating proxy node for ${randCity} regional sync` },
            { tag: 'DRAFT', msg: `Hyper-personalized sequence generated for ${randName}` }
        ];

        const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
        addLogEntry(pick.tag, pick.msg);
    };

    // Initialize Loops
    setInterval(generateActivity, config.intervals.log);
    setInterval(updateStats, config.intervals.stats);
    setInterval(cycleWorkflow, config.intervals.workflow);

    // Initial log
    setTimeout(() => {
        addLogEntry('SYSTEM', 'Command Center synchronization complete. Engine running optimal.');
    }, 1000);
});