document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('.btn-start');
    const terminal = document.querySelector('.log-terminal');
    const sequenceItems = document.querySelectorAll('.sequence-item');
    const statusLabel = document.querySelector('.status-indicator span span');
    
    const logData = [
        "> Initializing Person-Finder Agent v2.4...",
        "> Establishing secure socket connection...",
        "> Parsing domain headers and meta-tags...",
        "> GET https://acme.com/about-us ... 200 OK",
        "> Extracting DOM nodes for team hierarchy...",
        "> Querying LinkedIn API for 'Decision Makers'...",
        "> FOUND: Sarah Jenkins (Operations Director)",
        "> Querying Secretary of State database...",
        "> FOUND: Marcus Thorne (Registered Agent)",
        "> Cross-referencing local directories (Austin)...",
        "> Validating phone patterns via Twilio...",
        "> SEARCH COMPLETE: Intelligence verified."
    ];

    let currentLogIndex = 0;
    let searchActive = false;

    function createCursor() {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        return cursor;
    }

    function updateTerminal(text) {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = text;
        
        // Remove existing cursor
        const oldCursor = terminal.querySelector('.cursor');
        if (oldCursor) oldCursor.remove();
        
        terminal.appendChild(line);
        terminal.appendChild(createCursor());
        terminal.scrollTop = terminal.scrollHeight;
    }

    function resetSequence() {
        sequenceItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');
            const badge = item.querySelector('.step-badge');
            if (badge) {
                if (index === 0) {
                    badge.textContent = 'Ready';
                    badge.style.background = 'var(--border)';
                    badge.style.color = 'var(--text-dim)';
                } else {
                    badge.remove();
                }
            }
        });
    }

    function startSequence() {
        if (searchActive) return;
        searchActive = true;
        
        // UI State Reset
        terminal.innerHTML = '';
        terminal.appendChild(createCursor());
        currentLogIndex = 0;
        statusLabel.textContent = 'ACTIVE SCANNING';
        statusLabel.style.color = 'var(--accent)';
        startBtn.style.opacity = '0.6';
        startBtn.innerText = 'Searching...';

        let step = 0;
        const totalSteps = sequenceItems.length;

        const processStep = () => {
            if (step >= totalSteps) {
                statusLabel.textContent = 'COMPLETED';
                statusLabel.style.color = 'var(--primary)';
                startBtn.style.opacity = '1';
                startBtn.innerHTML = `
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Re-Initialize Search
                `;
                searchActive = false;
                
                // Final reveal of pending card
                const pendingCard = document.querySelector('.contact-card[style*="dashed"]');
                if (pendingCard) {
                    pendingCard.style.opacity = '1';
                    pendingCard.style.borderStyle = 'solid';
                    pendingCard.innerHTML = `
                        <div class="contact-name">Marcus Thorne</div>
                        <div class="contact-title">Managing Partner</div>
                        <div class="contact-meta">
                            <div class="meta-item">SOS Record #88219</div>
                            <div class="meta-item">m.thorne@acme.corp</div>
                        </div>
                    `;
                }
                return;
            }

            // Update List Items
            sequenceItems.forEach(i => i.classList.remove('active'));
            const currentItem = sequenceItems[step];
            currentItem.classList.add('active');
            
            if (step > 0) {
                sequenceItems[step - 1].classList.add('completed');
                sequenceItems[step - 1].classList.remove('active');
            }

            // Update Badge
            let badge = currentItem.querySelector('.step-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'step-badge';
                currentItem.querySelector('.step-content').appendChild(badge);
            }
            badge.textContent = 'Processing...';
            badge.style.background = 'rgba(59, 130, 246, 0.1)';
            badge.style.color = 'var(--primary)';

            // Simulate Terminal Logs
            const logInterval = setInterval(() => {
                if (currentLogIndex < (step + 1) * 2 && currentLogIndex < logData.length) {
                    updateTerminal(logData[currentLogIndex]);
                    currentLogIndex++;
                } else {
                    clearInterval(logInterval);
                    badge.textContent = 'Success';
                    badge.style.background = 'rgba(16, 185, 129, 0.1)';
                    badge.style.color = 'var(--accent)';
                    step++;
                    setTimeout(processStep, 800);
                }
            }, 400);
        };

        processStep();
    }

    startBtn.addEventListener('click', startSequence);

    // Dynamic focus effects for inputs
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            updateTerminal(`> Input focus: ${input.placeholder}`);
        });
    });
});