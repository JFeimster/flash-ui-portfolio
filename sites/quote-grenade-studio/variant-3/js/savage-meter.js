/**
 * SAVAGE METER v1.0
 * High-clearance text analyzer for Quote Grenade submissions
 */

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('savage-input');
    const barFill = document.getElementById('savage-bar-fill');
    const statusText = document.getElementById('savage-status');
    const countDisplay = document.getElementById('savage-count');

    // If terminal elements don't exist yet, wait or exit
    if (!input || !barFill || !statusText) return;

    const keywords = [
        'state', 'freedom', 'exit', 'code', 'build', 'die', 'tax',
        'weapon', 'shrapnel', 'fiat', 'prison', 'law', 'radical',
        'permissionless', 'obsolete', 'bureaucracy', 'decentralize',
        'network', 'rug', 'hallucination', 'consensus', 'beige',
        'truth', 'war', 'parasite', 'sovereign', 'anarchy', 'corrupt'
    ];

    /**
     * Logic for calculating "Savagery"
     */
    const updateMeter = () => {
        const text = input.value.trim();
        const length = text.length;
        let score = 0;

        if (length === 0) {
            render(0, 'WAITING FOR PAYLOAD...', '#000');
            return;
        }

        // 1. Length Optimization (Sweet spot is 20-80 chars)
        if (length > 15 && length < 90) {
            score += 40;
        } else if (length >= 90 && length < 160) {
            score += 20;
        } else {
            score += 5; // Too short is weak, too long is "beige"
        }

        // 2. Keyword Density
        const words = text.toLowerCase().split(/\W+/);
        let foundKeywords = 0;
        keywords.forEach(k => {
            if (words.includes(k)) foundKeywords++;
        });
        score += (foundKeywords * 15);

        // 3. Authority & Tone
        // All caps bonus (Aggression)
        if (text === text.toUpperCase() && length > 5) {
            score += 20;
        }
        
        // Punctuation (Punchiness)
        if (text.endsWith('.') || text.endsWith('!')) {
            score += 10;
        }

        // 4. Penalty for "Beige" words (Corporate speak)
        const beigeWords = ['synergy', 'optimize', 'alignment', 'stakeholder', 'circle back', 'leverage'];
        beigeWords.forEach(w => {
            if (words.includes(w)) score -= 30;
        });

        // Normalize 0-100
        score = Math.max(0, Math.min(score, 100));

        // Status Determination
        let label = 'NEGLIGIBLE';
        let color = '#000000';

        if (score > 85) {
            label = 'CRITICAL MASS / WEAPONIZED';
            color = '#FF0000';
        } else if (score > 60) {
            label = 'HIGH EXPLOSIVE';
            color = '#FF0000';
        } else if (score > 35) {
            label = 'CONTROVERSIAL / UNSTABLE';
            color = '#000000';
        } else {
            label = 'BEIGE / NON-THREAT';
            color = '#666666';
        }

        render(score, label, color);
        if (countDisplay) countDisplay.innerText = `${length}/280`;
    };

    /**
     * UI Rendering
     */
    const render = (score, label, color) => {
        barFill.style.width = `${score}%`;
        barFill.style.backgroundColor = color;
        statusText.innerText = label;
        statusText.style.color = color;

        // Visual feedback for high-tier grenades
        if (score > 85) {
            barFill.parentElement.style.animation = 'glitch-shake 0.15s infinite';
            input.style.borderColor = '#FF0000';
            input.style.color = '#FF0000';
        } else {
            barFill.parentElement.style.animation = 'none';
            input.style.borderColor = '#000000';
            input.style.color = '#000000';
        }
    };

    // Inject necessary CSS if not present for the meter animations
    if (!document.getElementById('savage-meter-styles')) {
        const style = document.createElement('style');
        style.id = 'savage-meter-styles';
        style.innerHTML = `
            @keyframes glitch-shake {
                0% { transform: translate(1px, 1px) rotate(0deg); }
                25% { transform: translate(-1px, -1px) rotate(0.5deg); }
                50% { transform: translate(-2px, 1px) rotate(-0.5deg); }
                75% { transform: translate(1px, -1px) rotate(0deg); }
                100% { transform: translate(-1px, 2px) rotate(0.5deg); }
            }
            #savage-bar-container {
                height: 30px;
                border: 4px solid #000;
                background: #fff;
                margin: 15px 0;
                position: relative;
                overflow: hidden;
            }
            #savage-bar-fill {
                height: 100%;
                width: 0%;
                background: #000;
                transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            }
            .savage-label {
                font-family: 'Archivo Black', sans-serif;
                font-size: 0.9rem;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            #savage-input {
                width: 100%;
                min-height: 120px;
                background: #fff;
                border: 4px solid #000;
                padding: 20px;
                font-family: 'Space Mono', monospace;
                font-size: 1.2rem;
                resize: none;
                outline: none;
                box-shadow: 8px 8px 0px #000;
                margin-bottom: 20px;
            }
            #savage-input:focus {
                background: #FDFCF0;
            }
        `;
        document.head.appendChild(style);
    }

    input.addEventListener('input', updateMeter);
    
    // Trigger initial state
    updateMeter();
});