/**
 * QUOTE GRENADE | THE FORGE
 * Logic for the Custom Creator UI
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const forgeInput = document.getElementById('forge-input');
    const fontSizeSlider = document.getElementById('forge-font-size');
    const previewCard = document.getElementById('card');
    const previewText = document.getElementById('quote-text');
    const exportBtn = document.getElementById('forge-export');
    const patternButtons = document.querySelectorAll('.pattern-btn');

    // State
    let currentPattern = 'none';

    const patterns = {
        none: {
            bg: '#F5F5DC',
            color: '#000000',
            draw: (ctx, w, h) => {
                ctx.fillStyle = '#F5F5DC';
                ctx.fillRect(0, 0, w, h);
            }
        },
        stripes: {
            bg: '#FFFFFF',
            color: '#000000',
            draw: (ctx, w, h) => {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = '#EEEEEE';
                ctx.lineWidth = 10;
                for (let i = -w; i < w + h; i += 20) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i + h, h);
                    ctx.stroke();
                }
            }
        },
        brutal: {
            bg: '#FF0000',
            color: '#FFFFFF',
            draw: (ctx, w, h) => {
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(0, 0, w, h);
            }
        },
        dark: {
            bg: '#000000',
            color: '#FFFFFF',
            draw: (ctx, w, h) => {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, w, h);
            }
        }
    };

    // Initialize Preview
    function updatePreview() {
        const text = forgeInput.value || "YOUR THOUGHT HERE";
        const size = fontSizeSlider.value;
        
        previewText.textContent = text;
        previewText.style.fontSize = `${size}px`;
        
        // Update visual styles based on pattern
        const theme = patterns[currentPattern];
        previewCard.style.backgroundColor = theme.bg;
        previewCard.style.color = theme.color;
        
        if (currentPattern === 'stripes') {
            previewCard.style.backgroundImage = 'repeating-linear-gradient(45deg, #eee, #eee 10px, #fff 10px, #fff 20px)';
        } else {
            previewCard.style.backgroundImage = 'none';
        }
    }

    // Pattern Selection
    patternButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            patternButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPattern = btn.dataset.pattern;
            updatePreview();
        });
    });

    // Input Listeners
    forgeInput.addEventListener('input', updatePreview);
    fontSizeSlider.addEventListener('input', updatePreview);

    // Canvas Export Logic
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lines = [];

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        const totalHeight = lines.length * lineHeight;
        let startY = y - (totalHeight / 2) + (lineHeight / 2);

        for (let k = 0; k < lines.length; k++) {
            ctx.fillText(lines[k].trim(), x, startY);
            startY += lineHeight;
        }
    }

    async function exportToImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const W = 1080;
        const H = 1080;
        canvas.width = W;
        canvas.height = H;

        const theme = patterns[currentPattern];
        const text = forgeInput.value || "YOUR THOUGHT HERE";
        const fontSize = parseInt(fontSizeSlider.value) * 2.5; // Scale for high res

        // Wait for fonts
        await document.fonts.load(`${fontSize}px "Archivo Black"`);
        await document.fonts.load(`400px "Archivo Black"`);

        // 1. Background
        theme.draw(ctx, W, H);

        // 2. Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 20;
        ctx.strokeRect(10, 10, W-20, H-20);

        // 3. Quote Mark Decal
        ctx.font = '400px "Archivo Black"';
        ctx.fillStyle = currentPattern === 'brutal' || currentPattern === 'dark' 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(255,0,0,0.1)';
        ctx.textAlign = 'left';
        ctx.fillText('"', 40, 300);

        // 4. Main Text
        ctx.fillStyle = theme.color;
        ctx.textAlign = 'center';
        ctx.font = `bold ${fontSize}px "Space Grotesk"`;
        if (text.length < 40) ctx.font = `bold ${fontSize}px "Archivo Black"`;
        
        wrapText(ctx, text.toUpperCase(), W/2, H/2, W - 200, fontSize * 1.2);

        // 5. Footer branding
        ctx.font = 'bold 24px "Space Grotesk"';
        ctx.fillStyle = theme.color;
        ctx.fillText('GENERATED AT QUOTEGRENADE.COM', W/2, H - 60);

        // Trigger Download
        const link = document.createElement('a');
        link.download = `grenade-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportToImage);
    }

    // Init
    updatePreview();
});