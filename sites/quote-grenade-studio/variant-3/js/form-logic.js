document.addEventListener('DOMContentLoaded', () => {
    const payloadInput = document.getElementById('payload-input');
    const savageMeterFill = document.getElementById('savage-meter-fill');
    const savageStatus = document.getElementById('savage-status');
    const submitBtn = document.getElementById('submit-payload');
    const terminalOutput = document.getElementById('terminal-output');

    const keywords = [
        'exit', 'state', 'weapon', 'shrapnel', 'permissionless', 
        'sovereign', 'beige', 'fiat', 'code', 'rug', 
        'violence', 'opt-out', 'anarchy', 'law', 'prison', 'constitution'
    ];

    /**
     * Calculates the "Savagery" score based on brutalist linguistic criteria.
     */
    function calculateSavagery(text) {
        if (!text || text.trim().length === 0) return 0;
        
        let score = 0;
        const cleanText = text.trim();
        const words = cleanText.split(/\s+/);
        
        // 1. Length Logic (The "Punchiness" Factor)
        // Short, sharp sentences are more "savage" than long academic ones.
        if (words.length >= 3 && words.length <= 12) {
            score += 40; // Perfect length for a grenade
        } else if (words.length > 12 && words.length < 25) {
            score += 20; // Getting a bit wordy
        } else {
            score += 5; // Too short or too long (beige territory)
        }

        // 2. High-Clearance Keywords
        keywords.forEach(word => {
            if (cleanText.toLowerCase().includes(word)) {
                score += 15;
            }
        });

        // 3. Typographic Aggression (All Caps)
        const capsMatch = cleanText.match(/[A-Z]/g);
        const capsRatio = capsMatch ? capsMatch.length / cleanText.length : 0;
        if (capsRatio > 0.5) {
            score += 25;
        }

        // 4. Punctuation Impact
        if (cleanText.endsWith('!') || cleanText.endsWith('.')) {
            score += 10;
        }

        return Math.min(100, score);
    }

    /**
     * Updates the visual Savage Meter component
     */
    function updateMeter() {
        if (!payloadInput || !savageMeterFill || !savageStatus) return;

        const val = payloadInput.value;
        const score = calculateSavagery(val);
        
        // Update bar width
        savageMeterFill.style.width = `${score}%`;
        
        // Update styling and labels based on tiers
        if (score === 0) {
            savageStatus.innerText = "STATUS: NO PAYLOAD DETECTED";
            savageMeterFill.style.background = "#333";
        } else if (score < 35) {
            savageStatus.innerText = "STATUS: BEIGE / NPC DETECTED";
            savageMeterFill.style.background = "#666";
            savageStatus.style.color = "#666";
        } else if (score < 65) {
            savageStatus.innerText = "STATUS: CIVILIAN DISCOURSE";
            savageMeterFill.style.background = "var(--black)";
            savageStatus.style.color = "var(--black)";
        } else if (score < 90) {
            savageStatus.innerText = "STATUS: HIGH EXPLOSIVE";
            savageMeterFill.style.background = "var(--red)";
            savageStatus.style.color = "var(--red)";
        } else {
            savageStatus.innerText = "STATUS: RADIOACTIVE / CRITICAL";
            savageMeterFill.style.background = "#FF0000";
            savageStatus.style.color = "#FF0000";
            savageMeterFill.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.5)";
        }
    }

    /**
     * Simulates terminal-style output logging
     */
    function printTerminal(msg, type = 'info') {
        if (!terminalOutput) return;
        
        const line = document.createElement('div');
        line.style.padding = '4px 0';
        line.style.borderBottom = '1px solid #222';
        line.style.fontFamily = "'Space Mono', monospace";
        line.style.fontSize = "0.75rem";
        
        const timestamp = new Date().toLocaleTimeString([], { hour12: false });
        const prefix = type === 'error' ? '[!!]' : '[>>]';
        
        line.innerHTML = `<span style="color: #666">[${timestamp}]</span> <span style="color: ${type === 'error' ? 'var(--red)' : '#0F0'}">${prefix}</span> ${msg}`;
        
        terminalOutput.prepend(line);
        
        // Keep only last 8 entries
        if (terminalOutput.children.length > 8) {
            terminalOutput.lastChild.remove();
        }
    }

    // Event Listeners
    if (payloadInput) {
        payloadInput.addEventListener('input', updateMeter);
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const text = payloadInput.value.trim();
            
            if (text.length < 10) {
                printTerminal("ERROR: PAYLOAD TOO LIGHT. ADD SHRAPNEL.", "error");
                return;
            }

            const score = calculateSavagery(text);
            
            submitBtn.disabled = true;
            submitBtn.innerText = "ARMING...";
            
            // Mock submission delay
            setTimeout(() => {
                printTerminal("UPLOADING TO SECURE COMMUNITY FREQUENCY...");
                
                setTimeout(() => {
                    printTerminal(`PAYLOAD ACCEPTED. SAVAGERY: ${score}%`);
                    if (score > 80) {
                        printTerminal("CRITICAL IMPACT PREDICTED. POSTING TO PUBLIC FEED.");
                    }
                    
                    // Reset
                    payloadInput.value = "";
                    updateMeter();
                    submitBtn.disabled = false;
                    submitBtn.innerText = "SUBMIT PAYLOAD";
                    
                    // Visual feedback
                    document.body.style.backgroundColor = "var(--red)";
                    setTimeout(() => {
                        document.body.style.backgroundColor = "var(--cream)";
                    }, 100);

                }, 1200);
            }, 600);
        });
    }

    // Initial State
    printTerminal("TERMINAL ONLINE. AWAITING PAYLOAD.");
});