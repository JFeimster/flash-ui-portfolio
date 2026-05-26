/**
 * Outreach Draft Studio: template-editor.js
 * Bridges the gap between discovery and contact.
 */

(function() {
    const styles = `
        .studio-overlay {
            animation: fadeIn 0.3s ease-out;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .studio-header {
            padding: 24px 32px;
            border-bottom: 1px solid var(--border-muted);
            background: rgba(255,255,255,0.02);
        }

        .studio-content {
            padding: 32px;
            flex-grow: 1;
            overflow-y: auto;
        }

        .draft-card {
            background: var(--bg-card);
            border: 1px solid var(--border-muted);
            border-radius: 12px;
            padding: 24px;
            position: relative;
        }

        .draft-field {
            margin-bottom: 20px;
        }

        .draft-field label {
            color: var(--accent-primary);
            font-size: 10px;
            margin-bottom: 6px;
        }

        .draft-input {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 1px solid var(--border-muted);
            color: #fff;
            font-family: var(--font-sans);
            font-size: 15px;
            padding: 8px 0;
            outline: none;
            transition: var(--transition);
        }

        .draft-input:focus {
            border-bottom-color: var(--accent-primary);
        }

        .draft-body {
            width: 100%;
            height: 240px;
            background: #080808;
            border: 1px solid var(--border-muted);
            border-radius: 8px;
            color: var(--text-main);
            font-family: var(--font-sans);
            font-size: 14px;
            line-height: 1.6;
            padding: 16px;
            resize: none;
            margin-top: 12px;
            outline: none;
        }

        .draft-body:focus {
            border-color: var(--accent-primary);
        }

        .variable-pill {
            display: inline-block;
            background: var(--accent-glow);
            color: var(--accent-primary);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: var(--font-mono);
            font-size: 11px;
            margin: 0 2px;
        }

        .studio-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }

        .btn-secondary {
            background: transparent;
            border: 1px solid var(--border-muted);
            color: var(--text-main);
            padding: 10px 20px;
            border-radius: var(--radius);
            font-family: var(--font-mono);
            font-size: 12px;
            cursor: pointer;
            transition: var(--transition);
        }

        .btn-secondary:hover {
            background: var(--border-muted);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .found-tag {
            font-family: var(--font-mono);
            font-size: 10px;
            background: #1a1a1a;
            color: var(--accent-primary);
            padding: 4px 8px;
            border-radius: 4px;
            margin-bottom: 16px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
    `;

    const injectStyles = () => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };

    const createEditorHTML = (data) => `
        <div class="studio-overlay">
            <div class="studio-header">
                <div class="found-tag">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                    PROFILES SYNCED
                </div>
                <h2 style="font-size: 18px; color: #fff;">Outreach Draft Studio</h2>
                <p class="subtitle" style="margin-top: 4px;">Contextual email generated for ${data.name}</p>
            </div>

            <div class="studio-content">
                <div class="draft-card">
                    <div class="draft-field">
                        <label>RECIPIENT</label>
                        <input type="text" class="draft-input" value="${data.email}">
                    </div>
                    <div class="draft-field">
                        <label>SUBJECT LINE</label>
                        <input type="text" class="draft-input" value="Question for ${data.company} | ${data.role}">
                    </div>
                    <label style="font-size: 10px; color: var(--accent-primary); text-transform: uppercase;">Message Body</label>
                    <textarea class="draft-body">Hi ${data.firstName},

I was looking into ${data.company}'s recent work in ${data.industry} and came across your profile. As the ${data.role}, I imagine you're focused on scaling your ${data.location} operations.

I'd love to discuss how our cross-platform intelligence can help Aura Design Studio surface even more decision makers. 

Best,
[Your Name]</textarea>

                    <div class="studio-actions">
                        <button class="search-btn" style="margin-top: 0; width: auto; padding: 10px 24px;">
                            COPY DRAFT
                        </button>
                        <button class="btn-secondary">
                            SAVE TO CRM
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const initialize = () => {
        injectStyles();
        const searchBtn = document.querySelector('.search-btn');
        const mainSequence = document.querySelector('.sequence-view');

        if (!searchBtn || !mainSequence) return;

        searchBtn.addEventListener('click', () => {
            searchBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin">
                    <circle cx="12" cy="12" r="10" opacity="0.2"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                </svg>
                PROCESSING...
            `;
            
            // Simulation of agent finishing
            setTimeout(() => {
                const personData = {
                    name: "Sarah Jenkins",
                    firstName: "Sarah",
                    role: "Lead Designer",
                    company: "Aura Design Studio",
                    location: "Brooklyn",
                    industry: "Interior Design",
                    email: "s.jenkins@auradesign.io"
                };

                mainSequence.innerHTML = createEditorHTML(personData);
                searchBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    START NEW SEARCH
                `;
                
                // Add functionality to copy button
                const copyBtn = mainSequence.querySelector('.search-btn');
                copyBtn.addEventListener('click', () => {
                    const body = mainSequence.querySelector('.draft-body').value;
                    navigator.clipboard.writeText(body);
                    copyBtn.innerText = "COPIED TO CLIPBOARD!";
                    setTimeout(() => { copyBtn.innerText = "COPY DRAFT"; }, 2000);
                });

            }, 2500);
        });
    };

    // Run initialization
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);
})();