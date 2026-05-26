/**
 * scripts/source-validator.js
 * Handles the Source Verification and Detail View for found contacts.
 * Matches the visual language of the Person-Finder Micro-Agent.
 */

(function() {
    const UI = {
        mainPanel: document.querySelector('.main-panel'),
        workspace: document.querySelector('.workspace'),
        contactCards: document.querySelectorAll('.contact-card')
    };

    const styles = `
        .validator-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-card);
            z-index: 100;
            display: grid;
            grid-template-columns: 1fr 350px;
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .validator-content {
            padding: 32px;
            overflow-y: auto;
            border-right: 1px solid var(--border);
        }

        .validator-sidebar {
            padding: 24px;
            background: rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .back-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-dim);
            font-size: 0.8rem;
            cursor: pointer;
            margin-bottom: 24px;
            background: none;
            border: none;
            transition: color 0.2s;
        }

        .back-btn:hover { color: var(--primary); }

        .evidence-grid {
            display: grid;
            gap: 16px;
            margin-top: 24px;
        }

        .evidence-card {
            background: var(--input-bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
        }

        .evidence-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .source-tag {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            padding: 2px 8px;
            background: rgba(59, 130, 246, 0.1);
            color: var(--primary);
            border-radius: 4px;
        }

        .confidence-meter {
            height: 4px;
            background: var(--border);
            border-radius: 2px;
            margin-top: 8px;
            overflow: hidden;
        }

        .confidence-fill {
            height: 100%;
            background: var(--accent);
        }

        .manual-notes {
            width: 100%;
            background: var(--input-bg);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 12px;
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            font-size: 0.85rem;
            resize: none;
            height: 120px;
        }

        .manual-notes:focus {
            outline: none;
            border-color: var(--primary);
        }

        .status-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255,255,255,0.03);
            padding: 12px;
            border-radius: 6px;
            border: 1px solid var(--border);
        }

        .toggle-switch {
            width: 36px;
            height: 20px;
            background: var(--accent);
            border-radius: 10px;
            position: relative;
            cursor: pointer;
        }

        .toggle-knob {
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 3px;
            right: 3px;
        }

        .btn-save {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            margin-top: auto;
        }
    `;

    const injectStyles = () => {
        const sheet = document.createElement('style');
        sheet.innerHTML = styles;
        document.head.appendChild(sheet);
    };

    const createValidatorView = (contactName, contactTitle) => {
        const overlay = document.createElement('div');
        overlay.className = 'validator-overlay';
        overlay.innerHTML = `
            <div class="validator-content">
                <button class="back-btn" id="close-validator">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                    Back to Dashboard
                </button>
                
                <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 4px;">${contactName}</h2>
                <p style="color: var(--primary); font-family: 'JetBrains Mono'; font-size: 0.9rem; margin-bottom: 32px;">${contactTitle}</p>

                <h3 class="results-header">Source Intelligence Evidence</h3>
                <div class="evidence-grid">
                    <div class="evidence-card">
                        <div class="evidence-header">
                            <span class="source-tag">LINKEDIN RECRUITER</span>
                            <span style="font-size: 0.75rem; color: var(--text-dim)">Match: 98%</span>
                        </div>
                        <p style="font-size: 0.85rem; line-height: 1.5;">Found "Sarah Jenkins" listed as current Operations Director. Matching employment dates with company profile start-year.</p>
                        <div class="confidence-meter"><div class="confidence-fill" style="width: 98%"></div></div>
                    </div>

                    <div class="evidence-card">
                        <div class="evidence-header">
                            <span class="source-tag">TX SEC. OF STATE</span>
                            <span style="font-size: 0.75rem; color: var(--text-dim)">Match: 100%</span>
                        </div>
                        <p style="font-size: 0.85rem; line-height: 1.5;">Public filing #80233412 lists subject as Registered Agent and Director. Data verified against recent annual report.</p>
                        <div class="confidence-meter"><div class="confidence-fill" style="width: 100%"></div></div>
                    </div>

                    <div class="evidence-card">
                        <div class="evidence-header">
                            <span class="source-tag">DORKING: GOOGLE</span>
                            <span style="font-size: 0.75rem; color: var(--text-dim)">Match: 65%</span>
                        </div>
                        <p style="font-size: 0.85rem; line-height: 1.5;">Mentioned in Austin Business Journal (2023) regarding facility relocation project.</p>
                        <div class="confidence-meter"><div class="confidence-fill" style="width: 65%"></div></div>
                    </div>
                </div>
            </div>
            
            <div class="validator-sidebar">
                <div class="results-header">Validation Controls</div>
                
                <div class="status-toggle">
                    <span style="font-size: 0.85rem; font-weight: 500;">Verification Status</span>
                    <div class="toggle-switch">
                        <div class="toggle-knob"></div>
                    </div>
                </div>

                <div class="input-group">
                    <label>Internal Notes</label>
                    <textarea class="manual-notes" placeholder="Add manual insights or override reason..."></textarea>
                </div>

                <div class="input-group">
                    <label>Last Verified</label>
                    <div style="font-family: 'JetBrains Mono'; font-size: 0.75rem; color: var(--text-dim)">
                        ${new Date().toISOString().split('T')[0]} @ Agent v2.4
                    </div>
                </div>

                <button class="btn-save">Commit Changes</button>
            </div>
        `;
        return overlay;
    };

    const init = () => {
        injectStyles();

        UI.contactCards.forEach(card => {
            if (card.querySelector('.contact-name').innerText === 'Pending...') return;
            
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const name = card.querySelector('.contact-name').innerText;
                const title = card.querySelector('.contact-title').innerText;
                
                const validator = createValidatorView(name, title);
                UI.mainPanel.style.position = 'relative';
                UI.mainPanel.appendChild(validator);

                document.getElementById('close-validator').addEventListener('click', () => {
                    validator.style.animation = 'slideIn 0.2s reverse';
                    setTimeout(() => validator.remove(), 180);
                });
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();