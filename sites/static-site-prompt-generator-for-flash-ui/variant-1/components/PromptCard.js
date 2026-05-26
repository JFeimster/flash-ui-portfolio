/**
 * FLASH-UI // PromptCard Component
 * Part of the Prompt Nexus Community Gallery
 */

export const PromptCard = (promptData) => {
    const {
        id = '0',
        title = 'System Architect',
        author = 'Nexus_User',
        category = 'SaaS Minimalist',
        description = 'A high-fidelity layout optimized for data-heavy dashboard interfaces with minimal visual friction.',
        performance = '98.2',
        tags = ['Modern', 'Dashboard']
    } = promptData;

    return `
        <div class="card prompt-card" data-prompt-id="${id}" style="
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 320px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
        ">
            <!-- Background Accent Glow -->
            <div style="
                position: absolute;
                top: -50px;
                right: -50px;
                width: 100px;
                height: 100px;
                background: var(--accent-glow);
                filter: blur(40px);
                border-radius: 50%;
                opacity: 0.2;
                pointer-events: none;
            "></div>

            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                <div class="card-label" style="margin-bottom: 0;">${category}</div>
                <div style="
                    font-family: var(--font-mono);
                    font-size: 0.65rem;
                    color: var(--accent);
                    background: rgba(0, 242, 255, 0.05);
                    border: 1px solid rgba(0, 242, 255, 0.2);
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-weight: 700;
                ">
                    SCORE: ${performance}
                </div>
            </div>

            <h3 style="
                font-size: 1.4rem;
                font-weight: 700;
                color: #fff;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
            ">${title}</h3>

            <div style="
                font-family: var(--font-mono);
                font-size: 0.7rem;
                color: var(--text-dim);
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <span style="opacity: 0.4;">AUTHOR:</span>
                <span style="color: var(--accent); opacity: 0.9;">@${author}</span>
            </div>

            <p style="
                font-size: 0.9rem;
                color: var(--text-dim);
                line-height: 1.5;
                margin-bottom: 24px;
                flex-grow: 1;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            ">
                ${description}
            </p>

            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
                ${tags.map(tag => `
                    <span style="
                        font-family: var(--font-mono);
                        font-size: 0.6rem;
                        color: var(--text-dim);
                        background: var(--glass);
                        padding: 2px 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border);
                    ">#${tag}</span>
                `).join('')}
            </div>

            <div class="action-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: auto;">
                <button class="btn-outline" style="font-size: 0.7rem; padding: 10px; border-color: var(--border);">VIEW BLUEPRINT</button>
                <button class="btn-outline fork-btn" style="
                    font-size: 0.7rem; 
                    padding: 10px; 
                    border-color: var(--accent); 
                    color: var(--accent);
                    background: rgba(0, 242, 255, 0.02);
                ">FORK PROMPT</button>
            </div>

            <style>
                .prompt-card:hover {
                    border-color: var(--accent) !important;
                    transform: translateY(-6px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px var(--accent-glow);
                }
                
                .prompt-card:hover .card-label::before {
                    box-shadow: 0 0 15px var(--accent);
                    background: #fff;
                }

                .fork-btn:hover {
                    background: var(--accent) !important;
                    color: #000 !important;
                    box-shadow: 0 0 20px var(--accent-glow);
                }
            </style>
        </div>
    `;
};

// Default export for usage in gallery loops
export default PromptCard;