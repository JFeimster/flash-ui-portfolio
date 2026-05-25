document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.querySelector('.btn-start');
    const sequenceItems = document.querySelectorAll('.sequence-item');
    const logTerminal = document.querySelector('.log-terminal');
    const resultsPanel = document.querySelector('.results-panel');
    const statusText = document.querySelector('.status-indicator span');
    const inputs = document.querySelectorAll('.input-group input');

    let isSearching = false;

    const logs = [
        "Initializing crawler engine v2.4...",
        "Targeting domain: {website}",
        "Fetching SSL certificate data...",
        "Analyzing meta-tags and header signatures...",
        "No direct leadership names found in metadata.",
        "Executing recursive directory traversal...",
        "Identifying pattern match: /about-us, /our-team",
        "Scraping HTML for <a> tags containing 'profile'...",
        "Cross-referencing with LinkedIn API...",
        "Detected 14 employees at {business}",
        "Filtering for 'Operations', 'Owner', 'CEO'...",
        "Executing Google Dork: site:linkedin.com {business} 'manager'",
        "Querying Secretary of State database...",
        "Found entity registration #TX-99201-B",
        "Officer found: Sarah Jenkins",
        "Validating contact authenticity...",
        "Scanning local Chamber of Commerce records...",
        "Discovery complete. Intelligence synced."
    ];

    const updateTerminal = (text) => {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `> ${text}`;
        
        // Remove cursor from previous line if exists
        const oldCursor = logTerminal.querySelector('.cursor');
        if (oldCursor) oldCursor.remove();

        logTerminal.appendChild(line);
        
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        line.appendChild(cursor);

        logTerminal.scrollTop = logTerminal.scrollHeight;
    };

    const setStepStatus = (index, status) => {
        const item = sequenceItems[index];
        if (!item) return;

        const badge = item.querySelector('.step-badge') || document.createElement('span');
        badge.className = 'step-badge';

        if (status === 'active') {
            sequenceItems.forEach(si => si.classList.remove('active'));
            item.classList.add('active');
            item.classList.remove('completed');
            badge.textContent = 'Processing...';
            badge.style.color = 'var(--primary)';
            badge.style.background = 'rgba(59,130,246,0.1)';
        } else if (status === 'completed') {
            item.classList.remove('active');
            item.classList.add('completed');
            badge.textContent = 'Success';
            badge.style.color = 'var(--accent)';
            badge.style.background = 'rgba(16,185,129,0.1)';
        }

        if (!item.querySelector('.step-badge')) {
            item.querySelector('.step-content').appendChild(badge);
        }
    };

    const resetUI = () => {
        sequenceItems.forEach((item, idx) => {
            item.classList.remove('active', 'completed');
            const badge = item.querySelector('.step-badge');
            if (badge) badge.remove();
        });
        logTerminal.innerHTML = '<div class="log-line">> Idle <span class="cursor"></span></div>';
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const startSearchSequence = async () => {
        if (isSearching) return;
        
        const business = inputs[0].value || "Acme Corp Industries";
        const website = inputs[1].value || "acme.com";

        isSearching = true;
        btnStart.disabled = true;
        btnStart.style.opacity = '0.5';
        btnStart.textContent = "Searching...";
        statusText.innerHTML = 'AGENT STATUS: <span style="color:var(--primary)">INITIALIZING</span>';

        resetUI();

        // Step 1: Domain Analysis
        setStepStatus(0, 'active');
        updateTerminal(logs[0]);
        await sleep(800);
        updateTerminal(logs[1].replace('{website}', website));
        await sleep(1000);
        updateTerminal(logs[4]);
        setStepStatus(0, 'completed');

        // Step 2: Team Hierarchy
        setStepStatus(1, 'active');
        updateTerminal(logs[5]);
        await sleep(1200);
        updateTerminal(logs[6]);
        setStepStatus(1, 'completed');

        // Step 3: LinkedIn
        setStepStatus(2, 'active');
        updateTerminal(logs[8]);
        await sleep(1500);
        updateTerminal(logs[9].replace('{business}', business));
        setStepStatus(2, 'completed');

        // Step 4: Google Dorking
        setStepStatus(3, 'active');
        updateTerminal(logs[11].replace('{business}', business));
        await sleep(1000);
        setStepStatus(3, 'completed');

        // Step 5: SOS Registry
        setStepStatus(4, 'active');
        updateTerminal(logs[12]);
        await sleep(1800);
        updateTerminal(logs[14]);
        
        // Inject second contact card
        const newCard = document.createElement('div');
        newCard.className = 'contact-card';
        newCard.innerHTML = `
            <div class="contact-name">Marcus Thorne</div>
            <div class="contact-title">Chief Executive Officer</div>
            <div class="contact-meta">
                <div class="meta-item">Verified Registry Match</div>
                <div class="meta-item">Direct Email Available</div>
            </div>
        `;
        resultsPanel.insertBefore(newCard, resultsPanel.lastElementChild);
        setStepStatus(4, 'completed');

        // Step 6: Local Intelligence
        setStepStatus(5, 'active');
        updateTerminal(logs[16]);
        await sleep(1000);
        updateTerminal(logs[17]);
        setStepStatus(5, 'completed');

        // Finalize
        statusText.innerHTML = 'AGENT STATUS: <span style="color:var(--accent)">TASK COMPLETE</span>';
        btnStart.disabled = false;
        btnStart.style.opacity = '1';
        btnStart.innerHTML = `
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            New Search
        `;
        isSearching = false;
    };

    btnStart.addEventListener('click', startSearchSequence);

    // Initial log message
    logTerminal.innerHTML = '<div class="log-line">> Ready for input <span class="cursor"></span></div>';
});