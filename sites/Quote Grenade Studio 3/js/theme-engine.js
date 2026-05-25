(function() {
    const quoteCard = document.getElementById('card');
    const quoteText = document.getElementById('quote-text');
    const quoteCat = document.getElementById('quote-cat');
    const generatorBox = document.querySelector('.generator-box');

    // Create and Inject Studio UI
    const studioContainer = document.createElement('section');
    studioContainer.id = 'blast-radius-studio';
    studioContainer.style.cssText = `
        margin-top: 60px;
        padding: 40px;
        border: 4px solid var(--black);
        background: white;
        box-shadow: 12px 12px 0px var(--black);
    `;

    studioContainer.innerHTML = `
        <h2 style="font-family: 'Archivo Black', sans-serif; font-size: 1.5rem; margin-bottom: 30px; border-bottom: 4px solid var(--black); display: inline-block; padding-bottom: 5px;">
            BLAST RADIUS VISUALIZER
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
            <div>
                <p style="font-weight: bold; margin-bottom: 15px; font-size: 0.9rem;">SELECT FREQUENCY:</p>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-small theme-btn" data-theme="high-alert" style="background: var(--red); color: white; flex: 1;">HIGH ALERT RED</button>
                    <button class="btn btn-small theme-btn" data-theme="deep-state" style="background: var(--black); color: var(--red); flex: 1;">DEEP STATE BLACK</button>
                </div>
            </div>
            <div>
                <p style="font-weight: bold; margin-bottom: 15px; font-size: 0.9rem;">SHRAPNEL SCALE:</p>
                <input type="range" id="font-scale" min="1.2" max="5" step="0.1" value="2.5" style="width: 100%; height: 10px; accent-color: var(--red); cursor: pointer;">
            </div>
            <div style="display: flex; align-items: flex-end;">
                <button id="download-png" class="btn btn-main" style="width: 100%; font-size: 1.2rem; padding: 15px;">EXPORT PNG</button>
            </div>
        </div>
    `;

    generatorBox.after(studioContainer);

    // Logic: Theme Switching
    const themeButtons = studioContainer.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            if (theme === 'high-alert') {
                quoteCard.style.backgroundColor = '#FF0000';
                quoteCard.style.color = '#FFFFFF';
                quoteCard.style.boxShadow = '12px 12px 0px #000000';
                quoteText.style.webkitTextStroke = '1px black';
            } else {
                quoteCard.style.backgroundColor = '#000000';
                quoteCard.style.color = '#FF0000';
                quoteCard.style.boxShadow = '12px 12px 0px #FF0000';
                quoteText.style.webkitTextStroke = '0px';
            }
        });
    });

    // Logic: Font Scaling
    const fontScaleInput = document.getElementById('font-scale');
    fontScaleInput.addEventListener('input', (e) => {
        quoteText.style.fontSize = `${e.target.value}rem`;
    });

    // Logic: PNG Download via Canvas
    const downloadBtn = document.getElementById('download-png');
    downloadBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;

        const cardStyles = window.getComputedStyle(quoteCard);
        const textStyles = window.getComputedStyle(quoteText);
        const bgColor = cardStyles.backgroundColor;
        const textColor = textStyles.color;
        
        // Draw Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 30;
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

        // Draw Branding
        ctx.fillStyle = textColor;
        ctx.font = '700 24px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('QUOTE GRENADE // PULL THE PIN', canvas.width / 2, 80);
        ctx.fillText(quoteCat.innerText, canvas.width / 2, 120);

        // Draw Quote Text
        const words = quoteText.innerText.replace(/"/g, '').split(' ');
        const fontSize = parseInt(textStyles.fontSize) * 3;
        ctx.font = `900 ${fontSize}px "Archivo Black"`;
        ctx.textBaseline = 'middle';
        
        const maxWidth = 900;
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            let testLine = currentLine + word + ' ';
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);

        const lineHeight = fontSize * 1.1;
        const startY = (canvas.height / 2) - ((lines.length - 1) * lineHeight / 2);

        lines.forEach((line, i) => {
            ctx.fillText(line.trim(), canvas.width / 2, startY + (i * lineHeight));
        });

        // Bottom Branding
        ctx.font = '700 20px "Space Mono"';
        ctx.fillText('NO BEIGE OPINIONS ALLOWED.', canvas.width / 2, canvas.height - 80);

        // Download Action
        const link = document.createElement('a');
        link.download = `quote-grenade-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
})();