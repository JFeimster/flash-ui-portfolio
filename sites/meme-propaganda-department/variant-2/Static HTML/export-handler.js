class MemeExportHandler {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.config = {
            borderWidth: 8,
            black: '#000000',
            white: '#ffffff',
            red: '#ff0000',
            yellow: '#ffff00',
            fontPrimary: 'Archivo Black',
            fontSecondary: 'Space Mono'
        };
    }

    async generateMeme(imageSource, topText, bottomText, stickers = []) {
        const img = await this._loadImage(imageSource);
        
        // Set canvas dimensions to match image
        this.canvas.width = img.width;
        this.canvas.height = img.height;

        // 1. Draw Base Image
        this.ctx.drawImage(img, 0, 0);

        // 2. Apply Brutalist Border
        this.ctx.strokeStyle = this.config.black;
        this.ctx.lineWidth = this.config.borderWidth * 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        // 3. Add Typography
        if (topText) this._drawText(topText.toUpperCase(), 'top');
        if (bottomText) this._drawText(bottomText.toUpperCase(), 'bottom');

        // 4. Add Propaganda Stickers
        stickers.forEach(sticker => {
            this._drawSticker(sticker.text, sticker.x, sticker.y, sticker.color || this.config.red);
        });

        // 5. Random Glitch Pass (Subtle)
        this._applyGlitchLines();
    }

    _loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    _drawText(text, position) {
        const padding = 40;
        const fontSize = Math.floor(this.canvas.width * 0.08);
        this.ctx.font = `${fontSize}px "${this.config.fontPrimary}"`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = position === 'top' ? 'top' : 'bottom';

        const x = this.canvas.width / 2;
        const y = position === 'top' ? padding : this.canvas.height - padding;

        // Text Shadow / Offset for Brutalist look
        this.ctx.fillStyle = this.config.red;
        this.ctx.fillText(text, x + 4, y + 4);
        
        this.ctx.fillStyle = this.config.black;
        this.ctx.strokeStyle = this.config.white;
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }

    _drawSticker(text, x, y, bgColor) {
        const fontSize = Math.floor(this.canvas.width * 0.04);
        this.ctx.font = `${fontSize}px "${this.config.fontPrimary}"`;
        
        const metrics = this.ctx.measureText(text);
        const p = 15;
        const w = metrics.width + (p * 2);
        const h = fontSize + (p * 2);

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((Math.random() - 0.5) * 0.3); // Slight random rotation

        // Sticker Background
        this.ctx.fillStyle = this.config.black;
        this.ctx.fillRect(4, 4, w, h); // Shadow
        this.ctx.fillStyle = bgColor;
        this.ctx.strokeStyle = this.config.black;
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.strokeRect(0, 0, w, h);

        // Sticker Text
        this.ctx.fillStyle = bgColor === this.config.white ? this.config.black : this.config.white;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text.toUpperCase(), w / 2, h / 2 + 2);

        this.ctx.restore();
    }

    _applyGlitchLines() {
        const lineCount = 5;
        for (let i = 0; i < lineCount; i++) {
            const y = Math.random() * this.canvas.height;
            const h = Math.random() * 4;
            this.ctx.fillStyle = Math.random() > 0.5 ? this.config.red : this.config.yellow;
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillRect(0, y, this.canvas.width, h);
        }
        this.ctx.globalAlpha = 1.0;
    }

    export(filename = 'PROPAGANDA_ASSET.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
        
        console.log('%c ASSET DEPLOYED ', 'background: #ff0000; color: #ffffff; font-weight: bold;');
    }
}

// Global initialization for the Creator UI
window.MemeFactory = {
    handler: null,
    init: (elId) => {
        window.MemeFactory.handler = new MemeExportHandler(elId);
    },
    deploy: (img, top, bottom, stickers) => {
        if (!window.MemeFactory.handler) return;
        window.MemeFactory.handler.generateMeme(img, top, bottom, stickers);
    },
    download: () => {
        if (window.MemeFactory.handler) window.MemeFactory.handler.export();
    }
};