/**
 * Outreach Draft Studio: Clipboard & Generation Logic
 * Bridges the gap between data extraction and contact outreach.
 */

(function() {
    const searchBtn = document.querySelector('.search-btn');
    const sequenceList = document.querySelector('.sequence-list');
    const terminal = document.querySelector('.terminal-output');
    const statusDot = document.querySelector('.dot');
    const statusText = document.querySelector('.status-indicator span');

    // Configuration for the found target
    const targetData = {
        name: "Sarah Jenkins",
        role: "Lead Designer",
        company: "Aura Design Studio",
        location: "Brooklyn, NY"
    };

    const generateEmailDraft = (data) => {
        return `Subject: Collaboration / ${data.company}\n\nHi ${data.name},\n\nI've been following the projects coming out of ${data.company} in ${data.location}. Your work as ${data.role} particularly caught my eye.\n\nI'm reaching out because we're launching a new visualization tool designed specifically for high-end interior design firms. Given your design aesthetic, I'd love to get your feedback on it.\n\nBest regards,\n[Your Name]`;
    };

    const updateTerminal = (message, color = "inherit") => {
        const timestamp = new Date().toLocaleTimeString([], { hour12: false });
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span style="color: ${color}">${message}</span>
        `;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    };

    const injectResultCard = () => {
        const draftText = generateEmailDraft(targetData);
        
        const resultHTML = `
            <div id="outreach-studio" style="margin-top: 32px; padding: 24px; background: var(--bg-card); border: 1px solid var(--accent-primary); border-radius: 12px; animation: slideIn 0.4s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                        <span class="badge" style="margin-bottom: 8px;">Target Identified</span>
                        <h2 style="font-size: 18px; color: #fff; margin-bottom: 2px;">${targetData.name}</h2>
                        <p style="font-size: 12px; color: var(--accent-primary); font-family: var(--font-mono);">${targetData.role.toUpperCase()}</p>
                    </div>
                    <button id="copy-draft-btn" style="background: var(--bg-base); border: 1px solid var(--border-muted); color: var(--text-main); font-family: var(--font-mono); font-size: 11px; padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: var(--transition);">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        COPY DRAFT
                    </button>
                </div>
                
                <div style="background: #000; padding: 16px; border-radius: 8px; border: 1px solid var(--border-muted);">
                    <div style="font-family: var(--font-sans); font-size: 13px; color: var(--text-muted); line-height: 1.6; white-space: pre-wrap;" id="draft-content">${draftText}</div>
                </div>
                
                <div style="margin-top: 16px; display: flex; gap: 12px;">
                    <div style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">
                        SOURCE: NY_SOS_PUBLIC_RECORDS
                    </div>
                    <div style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">
                        CONFIDENCE: 98%
                    </div>
                </div>
            </div>

            <style>
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                #copy-draft-btn:hover {
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                }
                #copy-draft-btn.success {
                    background: var(--accent-primary);
                    color: #000;
                    border-color: var(--accent-primary);
                }
            </style>
        `;

        sequenceList.insertAdjacentHTML('beforeend', resultHTML);

        // Clipboard Logic
        const copyBtn = document.getElementById('copy-draft-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(draftText).then(() => {
                const originalContent = copyBtn.innerHTML;
                copyBtn.classList.add('success');
                copyBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    COPIED TO CLIPBOARD
                `;
                updateTerminal("Email draft copied to clipboard.", "#00ff88");
                
                setTimeout(() => {
                    copyBtn.classList.remove('success');
                    copyBtn.innerHTML = originalContent;
                }, 2000);
            });
        });
    };

    const runSequence = () => {
        searchBtn.disabled = true;
        searchBtn.style.opacity = "0.5";
        searchBtn.innerText = "PROCESSING...";

        // Simulate remaining steps completion
        const items = document.querySelectorAll('.sequence-item');
        
        setTimeout(() => {
            items[2].classList.add('active');
            updateTerminal("Querying Secretary of State database...");
        }, 800);

        setTimeout(() => {
            items[2].classList.remove('active');
            items[2].classList.add('completed');
            items[2].querySelector('.item-status-text').innerText = "✓ VERIFIED";
            items[2].querySelector('.item-status-text').style.color = "var(--accent-primary)";
            updateTerminal("Match found in corporate filings: Sarah Jenkins.", "#fff");
        }, 1800);

        setTimeout(() => {
            items[3].classList.add('active');
            items[3].querySelector('.item-status-text').innerText = "● MAPPING GRAPH...";
            updateTerminal("Cross-referencing LinkedIn profile with business address...");
        }, 2200);

        setTimeout(() => {
            items[3].classList.remove('active');
            items[3].classList.add('completed');
            items[3].querySelector('.item-status-text').innerText = "✓ SYNCED";
            items[3].querySelector('.item-status-text').style.color = "var(--accent-primary)";
            
            statusDot.classList.remove('active');
            statusDot.style.background = "var(--accent-primary)";
            statusText.innerText = "SEARCH COMPLETE";
            
            updateTerminal("Synthesis complete. Generating outreach profile...", "var(--accent-primary)");
            injectResultCard();
            
            searchBtn.innerText = "NEW SEARCH";
            searchBtn.disabled = false;
            searchBtn.style.opacity = "1";
        }, 3500);
    };

    searchBtn.addEventListener('click', function(e) {
        if (this.innerText === "INITIALIZE SEARCH") {
            runSequence();
        } else {
            window.location.reload();
        }
    });
})();