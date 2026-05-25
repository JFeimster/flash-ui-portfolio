document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    const sequenceView = document.querySelector('.sequence-view');
    const terminal = document.querySelector('.terminal-output');
    
    // Inject styles for the Draft Studio
    const style = document.createElement('style');
    style.textContent = `
        .results-container {
            padding: 32px;
            animation: fadeIn 0.4s ease-out;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .contact-card {
            background: var(--bg-card);
            border: 1px solid var(--border-muted);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 3px solid var(--accent-primary);
        }

        .contact-info h3 {
            font-size: 16px;
            color: #fff;
            margin-bottom: 4px;
        }

        .contact-info p {
            font-size: 12px;
            color: var(--text-muted);
            font-family: var(--font-mono);
        }

        .draft-workspace {
            flex-grow: 1;
            background: #080808;
            border: 1px solid var(--border-muted);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .draft-header {
            padding: 12px 20px;
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border-muted);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .draft-editor {
            padding: 24px;
            color: var(--text-main);
            font-family: var(--font-sans);
            line-height: 1.6;
            font-size: 14px;
            flex-grow: 1;
            white-space: pre-wrap;
            outline: none;
        }

        .token {
            color: var(--accent-primary);
            background: var(--accent-glow);
            padding: 2px 4px;
            border-radius: 4px;
            font-family: var(--font-mono);
            font-size: 12px;
        }

        .action-bar {
            padding: 16px 24px;
            border-top: 1px solid var(--border-muted);
            display: flex;
            gap: 12px;
        }

        .btn-secondary {
            background: transparent;
            border: 1px solid var(--border-muted);
            color: var(--text-main);
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: var(--transition);
        }

        .btn-secondary:hover {
            background: var(--border-muted);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .typing-cursor::after {
            content: "|";
            animation: blink 1s infinite;
        }

        @keyframes blink {
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    const mockData = {
        name: "Sarah Jenkins",
        title: "Founder & Lead Designer",
        company: "Aura Design Studio",
        location: "Brooklyn, NY",
        context: "Recent award for sustainable urban interiors"
    };

    function generateDraft(data) {
        return `Subject: Partnership Inquiry: ${data.company} x Outreach Studio

Hi ${data.name.split(' ')[0]},

I've been following ${data.company}'s trajectory in ${data.location}, specifically your ${data.context}. 

As the ${data.title}, I thought you'd be interested in how we're helping design firms bridge the gap between discovery and contact. Your recent work caught our eye, and I'd love to discuss a potential collaboration.

Best regards,
[Your Name]`;
    }

    function showDraftStudio() {
        sequenceView.innerHTML = `
            <div class="results-container">
                <div class="header-section" style="margin-bottom: 24px;">
                    <span class="badge">Draft Studio v1.0</span>
                    <h2 style="color: #fff; font-size: 18px;">Contact Found</h2>
                </div>

                <div class="contact-card">
                    <div class="contact-info">
                        <h3>${mockData.name}</h3>
                        <p>${mockData.title} • ${mockData.company}</p>
                    </div>
                    <div class="status-indicator">
                        <div class="dot active"></div>
                        <span style="font-size: 10px; color: var(--accent-primary)">VERIFIED</span>
                    </div>
                </div>

                <div class="draft-workspace">
                    <div class="draft-header">
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">AUTO-GENERATED DRAFT</span>
                        <span class="token">PERS_MOD_v4</span>
                    </div>
                    <div class="draft-editor" contenteditable="true"></div>
                    <div class="action-bar">
                        <button class="search-btn" style="margin: 0; padding: 8px 20px; width: auto;">COPY TO CLIPBOARD</button>
                        <button class="btn-secondary">REGENERATE</button>
                    </div>
                </div>
            </div>
        `;

        const editor = sequenceView.querySelector('.draft-editor');
        const fullText = generateDraft(mockData);
        let index = 0;

        // Simulate typing effect
        function typeWriter() {
            if (index < fullText.length) {
                editor.textContent += fullText.charAt(index);
                index++;
                setTimeout(typeWriter, 5);
            }
        }
        typeWriter();
    }

    searchBtn.addEventListener('click', () => {
        searchBtn.innerHTML = '<span class="typing-cursor">SYSTEM INITIALIZING...</span>';
        searchBtn.disabled = true;
        
        // Update Terminal Logs
        const logs = [
            "[14:02:11] Validating Secretary of State records...",
            "[14:02:12] Found registration ID: NY-99281-X",
            "[14:02:14] Cross-referencing LinkedIn profile patterns...",
            "[14:02:15] POSITIVE MATCH: Principal Officer Identified.",
            "[14:02:16] Finalizing identity payload..."
        ];

        logs.forEach((msg, i) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'log-line';
                line.innerHTML = `<span class="timestamp">[14:02:${11 + i}]</span><span style="color: var(--accent-primary)">${msg}</span>`;
                terminal.appendChild(line);
                terminal.scrollTop = terminal.scrollHeight;
            }, i * 600);
        });

        // Complete the search sequence
        setTimeout(() => {
            const items = document.querySelectorAll('.sequence-item');
            items.forEach(item => {
                item.classList.remove('active');
                item.classList.add('completed');
                const status = item.querySelector('.item-status-text');
                status.textContent = '✓ COMPLETE';
                status.style.color = 'var(--accent-primary)';
            });

            setTimeout(showDraftStudio, 1000);
        }, 3500);
    });
});