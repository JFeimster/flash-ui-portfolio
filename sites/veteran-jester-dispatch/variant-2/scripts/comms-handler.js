document.addEventListener('DOMContentLoaded', () => {
    const intelForm = document.getElementById('intel-form');
    const sitrepDisplay = document.getElementById('sitrep-display');
    const terminalLog = document.getElementById('terminal-log');
    const commsStatus = document.getElementById('comms-status');

    // SITREP Data Feed
    const sitrepData = [
        "SITREP // 0400 HRS: Perimeter secure. Bureaucracy levels rising in sector 4.",
        "SITREP // 0630 HRS: Coffee reserves depleted. Morale remains ironically high.",
        "SITREP // 0915 HRS: New dispatch 'PowerPoint Warfare' has breached the firewall.",
        "SITREP // 1100 HRS: Freedom of speech exercise scheduled for high noon.",
        "SITREP // 1420 HRS: Tactical sarcasm deployed against corporate jargon.",
        "SITREP // 1745 HRS: Sunset alert. Stoicism protocols engaged."
    ];

    let currentSitrepIndex = 0;

    /**
     * Typewriter effect for SITREP updates
     */
    function updateSitrep() {
        if (!sitrepDisplay) return;

        const fullText = sitrepData[currentSitrepIndex];
        sitrepDisplay.textContent = '';
        let charIndex = 0;

        const typeInterval = setInterval(() => {
            if (charIndex < fullText.length) {
                sitrepDisplay.textContent += fullText.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    currentSitrepIndex = (currentSitrepIndex + 1) % sitrepData.length;
                    updateSitrep();
                }, 5000);
            }
        }, 40);
    }

    /**
     * Appends a line to the terminal log with timestamp
     */
    function appendTerminal(message, isAlert = false) {
        if (!terminalLog) return;
        
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        const logEntry = document.createElement('div');
        logEntry.className = 'typewriter';
        logEntry.style.fontSize = '0.8rem';
        logEntry.style.marginBottom = '5px';
        
        if (isAlert) {
            logEntry.style.color = 'var(--stencil-red)';
            logEntry.style.fontWeight = 'bold';
        }

        logEntry.textContent = `[${timestamp}] ${message}`;
        terminalLog.appendChild(logEntry);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    /**
     * Form Submission Handler
     */
    if (intelForm) {
        intelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = intelForm.querySelector('button');
            const originalBtnText = submitBtn.textContent;
            const formData = new FormData(intelForm);
            const intelType = formData.get('intel-type') || 'GENERAL';

            // Visual Transmission Sequence
            submitBtn.disabled = true;
            submitBtn.textContent = "ENCRYPTING...";
            appendTerminal(`INITIATING UPLOAD: ${intelType}_INTEL_PACKAGE`, true);

            setTimeout(() => {
                submitBtn.textContent = "TRANSMITTING...";
                appendTerminal("PACKET LEAKAGE WITHIN TOLERANCE...");
                
                setTimeout(() => {
                    // Final Success State
                    submitBtn.textContent = "TRANSMISSION SECURED";
                    appendTerminal("UPLOAD COMPLETE. CLEARING TRACKS.");
                    
                    // Add physical "RECEIVED" stamp to the form area
                    const stamp = document.createElement('div');
                    stamp.className = 'stamp';
                    stamp.textContent = 'INTEL FILED';
                    stamp.style.position = 'absolute';
                    stamp.style.top = '40%';
                    stamp.style.left = '50%';
                    stamp.style.transform = 'translate(-50%, -50%) rotate(-25deg)';
                    stamp.style.fontSize = '3rem';
                    stamp.style.zIndex = '100';
                    stamp.style.pointerEvents = 'none';
                    
                    intelForm.style.position = 'relative';
                    intelForm.appendChild(stamp);

                    // Reset form after delay
                    setTimeout(() => {
                        intelForm.reset();
                        stamp.style.transition = 'opacity 1s';
                        stamp.style.opacity = '0';
                        setTimeout(() => stamp.remove(), 1000);
                        
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                        if (commsStatus) commsStatus.textContent = "CHANNEL: STANDBY";
                    }, 4000);

                }, 1500);
            }, 1200);
        });
    }

    // Interactive Terminal Blinker
    function initTerminalBlinker() {
        if (!commsStatus) return;
        setInterval(() => {
            commsStatus.style.opacity = commsStatus.style.opacity === '0' ? '1' : '0';
        }, 800);
    }

    // Start Operations
    updateSitrep();
    initTerminalBlinker();
    appendTerminal("COMMS SYSTEM INITIALIZED. NO SIGN OF ENEMY INTERCEPT.");
});