document.addEventListener('DOMContentLoaded', () => {
    const quoteInput = document.getElementById('chamber-quote');
    const meterFill = document.getElementById('censorship-fill');
    const meterStatus = document.getElementById('censorship-status');
    const submissionForm = document.getElementById('submission-chamber-form');
    const submitBtn = document.getElementById('chamber-submit');

    /**
     * Satirical Censorship Meter Logic
     * As the user provides more 'lethal' (longer/detailed) input, 
     * the censorship 'safety' systems fail.
     */
    if (quoteInput && meterFill && meterStatus) {
        quoteInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            // Censorship level starts at 100% and drops to 0% at 120 characters
            let level = Math.max(0, 100 - (length * 0.83));
            
            meterFill.style.width = `${level}%`;
            
            // Visual state updates based on 'threat level'
            if (level > 75) {
                meterStatus.innerText = "STATUS: CENSORSHIP ACTIVE (BEIGE DETECTED)";
                meterFill.style.background = "var(--red)";
            } else if (level > 40) {
                meterStatus.innerText = "STATUS: FILTERS DEGRADING...";
                meterFill.style.background = "#000";
            } else if (level > 0) {
                meterStatus.innerText = "STATUS: CRITICAL FIREWALL BREACH";
                meterFill.style.background = "#000";
                meterStatus.style.color = "var(--black)";
            } else {
                meterStatus.innerText = "STATUS: TOTAL SOVEREIGNTY ACHIEVED // UNFILTERED";
                meterFill.style.background = "#00ff00"; // Radical Green
                meterStatus.style.color = "var(--red)";
                
                // Add a small shake to the form when sovereignty is reached
                submissionForm.style.animation = "shake 0.2s ease-in-out infinite";
                setTimeout(() => {
                    submissionForm.style.animation = "none";
                }, 400);
            }
        });
    }

    /**
     * Submission Handling
     * Simulates a data upload to a 'decentralized' node
     */
    if (submissionForm) {
        submissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (quoteInput.value.length < 10) {
                alert("ERROR: INSIGHT TOO BEIGE. INCREASE POTENCY.");
                return;
            }

            // Visual feedback for 'transmission'
            submitBtn.innerText = "TRANSMITTING TO THE VOID...";
            submitBtn.disabled = true;
            submitBtn.style.cursor = "wait";
            submitBtn.style.opacity = "0.6";

            // Artificial delay to simulate "Encryption"
            setTimeout(() => {
                const parent = submissionForm.parentElement;
                parent.style.transition = "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)";
                
                // Transform form into success state
                parent.innerHTML = `
                    <div style="
                        background: var(--black); 
                        color: var(--white); 
                        padding: 60px 40px; 
                        border: var(--border); 
                        text-align: center;
                        animation: shake 0.4s ease-in-out;
                    ">
                        <h2 style="font-family: 'Syne', sans-serif; font-size: 3rem; margin-bottom: 20px;">GRENADE CACHED.</h2>
                        <p style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; margin-bottom: 30px;">
                            YOUR THOUGHT FRAGMENT HAS BEEN ANONYMIZED AND DISTRIBUTED ACROSS THE PROTOCOL.
                        </p>
                        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; opacity: 0.7;">
                            TX_ID: ${Math.random().toString(36).substring(2, 15).toUpperCase()}
                        </div>
                        <button onclick="location.reload()" class="btn" style="margin-top: 40px; width: 100%;">ARM ANOTHER</button>
                    </div>
                `;
            }, 1200);
        });
    }
});