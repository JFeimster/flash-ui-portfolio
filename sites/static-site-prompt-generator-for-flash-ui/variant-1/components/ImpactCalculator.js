/**
 * FLASH-UI // ImpactCalculator.js
 * Part of the Prompt Alchemy Optimization Suite
 */

class ImpactCalculator {
    constructor(config = {}) {
        this.targetContainer = config.containerSelector || '.bento-grid';
        this.keywords = [
            'layout', 'component', 'typography', 'palette', 'ux', 'ui', 'responsive',
            'grid', 'flex', 'neon', 'glassmorphism', 'minimal', 'brutalist', 'atomic',
            'interaction', 'animation', 'state', 'hierarchy', 'contrast', 'padding'
        ];
        this.initStyles();
    }

    initStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .impact-card {
                grid-column: span 12;
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: 30px;
                background: linear-gradient(145deg, #0d0d0d 0%, #050505 100%);
                border: 1px dashed var(--border);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .impact-card.active {
                border: 1px solid var(--accent);
                box-shadow: 0 0 30px rgba(0, 242, 255, 0.05);
            }

            .score-orbit {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-right: 1px solid var(--border);
                padding-right: 30px;
            }

            .score-value {
                font-size: 4rem;
                font-weight: 700;
                font-family: var(--font-mono);
                color: var(--accent);
                text-shadow: 0 0 20px var(--accent-glow);
                line-height: 1;
            }

            .score-label {
                font-size: 0.7rem;
                color: var(--text-dim);
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-top: 10px;
            }

            .analysis-metrics {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .metric-item {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .metric-label {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                font-family: var(--font-mono);
            }

            .metric-bar-bg {
                height: 4px;
                background: #1a1a1a;
                border-radius: 2px;
                overflow: hidden;
            }

            .metric-bar-fill {
                height: 100%;
                background: var(--accent);
                width: 0%;
                transition: width 0.8s ease-out;
                box-shadow: 0 0 10px var(--accent);
            }

            .feedback-engine {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid var(--border);
            }

            .feedback-chip {
                display: inline-block;
                font-size: 0.65rem;
                padding: 4px 8px;
                background: var(--glass);
                border: 1px solid var(--border);
                color: var(--text-dim);
                border-radius: 4px;
                margin-right: 8px;
                margin-bottom: 8px;
            }

            .feedback-chip.positive {
                border-color: var(--accent);
                color: var(--accent);
            }

            @media (max-width: 768px) {
                .impact-card { grid-template-columns: 1fr; }
                .score-orbit { border-right: none; border-bottom: 1px solid var(--border); padding-right: 0; padding-bottom: 20px; }
            }
        `;
        document.head.appendChild(style);
    }

    calculateImpact(prompt) {
        if (!prompt) return { score: 0, metrics: { clarity: 0, density: 0, structure: 0 }, tips: [] };

        const words = prompt.toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);
        
        // 1. Clarity (Length vs Word Diversity)
        const clarity = Math.min(100, (words.length / 100) * 40 + (uniqueWords.size / words.length) * 60);

        // 2. Keyword Density
        const foundKeywords = this.keywords.filter(k => prompt.toLowerCase().includes(k));
        const density = Math.min(100, (foundKeywords.length / 8) * 100);

        // 3. Structural Integrity (Special chars, lines, casing)
        const hasBullets = /[-*•]/.test(prompt);
        const hasSections = /[:\n]/.test(prompt);
        const hasCasing = /[A-Z]/.test(prompt);
        const structure = (hasBullets * 35) + (hasSections * 35) + (hasCasing * 30);

        const score = Math.round((clarity * 0.3) + (density * 0.4) + (structure * 0.3));

        let tips = [];
        if (words.length < 50) tips.push("Increase depth");
        if (foundKeywords.length < 4) tips.push("Add technical terms");
        if (!hasBullets) tips.push("Use list format");
        if (score > 80) tips.push("Optimal Fidelity");

        return { score, metrics: { clarity, density, structure }, tips };
    }

    updateUI(prompt) {
        const results = this.calculateImpact(prompt);
        let container = document.getElementById('impactCalculatorUI');

        if (!container) {
            container = document.createElement('div');
            container.id = 'impactCalculatorUI';
            container.className = 'card impact-card';
            const outputCard = document.querySelector('.output-card');
            outputCard.parentNode.insertBefore(container, outputCard);
        }

        container.classList.add('active');
        container.innerHTML = `
            <div class="score-orbit">
                <div class="score-value">${results.score}</div>
                <div class="score-label">Impact Quotient</div>
            </div>
            <div class="analysis-metrics">
                <div class="card-label">Optimization Engine</div>
                
                <div class="metric-item">
                    <div class="metric-label"><span>Clarity</span><span>${Math.round(results.metrics.clarity)}%</span></div>
                    <div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${results.metrics.clarity}%"></div></div>
                </div>

                <div class="metric-item">
                    <div class="metric-label"><span>Keyword Density</span><span>${Math.round(results.metrics.density)}%</span></div>
                    <div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${results.metrics.density}%"></div></div>
                </div>

                <div class="metric-item">
                    <div class="metric-label"><span>Structural Integrity</span><span>${Math.round(results.metrics.structure)}%</span></div>
                    <div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${results.metrics.structure}%"></div></div>
                </div>

                <div class="feedback-engine">
                    ${results.tips.map(tip => `
                        <span class="feedback-chip ${tip === 'Optimal Fidelity' ? 'positive' : ''}">
                            ${tip}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Global initialization for integration
window.impactCalculator = new ImpactCalculator();

// Patch the original generatePrompt function to trigger analysis
const originalGeneratePrompt = window.generatePrompt;
window.generatePrompt = function() {
    originalGeneratePrompt();
    const prompt = document.getElementById('promptOutput').value;
    window.impactCalculator.updateUI(prompt);
};