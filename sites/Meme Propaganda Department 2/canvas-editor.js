class MemeFactory {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.img = null;
        this.textTop = "";
        this.textBottom = "";
        this.stickers = [];
        this.glitchIntensity = 0;
        
        this.config = {
            fontPrimary: 'Archivo Black',
            fontSecondary: 'Space Mono',
            colors: {
                red: '#ff0000',
                yellow: '#ffff00',
                black: '#000000',
                white: '#ffffff'
            }
        };

        this.init();
    }

    init() {
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.drawPlaceholder();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const upload = document.getElementById('meme-upload');
        if (upload) {
            upload.addEventListener('change', (e) => this.handleUpload(e));
        }

        const topInput = document.getElementById('text-top');
        if (topInput) {
            topInput.addEventListener('input', (e) => {
                this.textTop = e.target.value;
                this.render();
            });
        }

        const bottomInput = document.getElementById('text-bottom');
        if (bottomInput) {
            bottomInput.addEventListener('input', (e) => {
                this.textBottom = e.target.value;
                this.render();
            });
        }

        const glitchBtn = document.getElementById('glitch-trigger');
        if (glitchBtn) {
            glitchBtn.addEventListener('click', () => {
                this.glitchIntensity = 15;
                this.render();
                setTimeout(() => {
                    this.glitchIntensity = 0;
                    this.render();
                }, 200);
            });
        }

        const downloadBtn = document.getElementById('meme-download');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.download());
        }

        const stickerBtns = document.querySelectorAll('.sticker-btn');
        stickerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.addSticker(btn.dataset.text);
            });
        });
    }

    handleUpload(e) {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.img = new Image();
            this.img.onload = () => this.render();
            this.img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    addSticker(text) {
        this.stickers.push({
            text: text,
            x: Math.random() * (this.canvas.width - 200) + 100,
            y: Math.random() * (this.canvas.height - 200) + 100,
            rotation: (Math.random() - 0.5) * 0.5
        });
        this.render();
    }

    drawPlaceholder() {
        this.ctx.fillStyle = this.config.colors.white;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = this.config.colors.black;
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = this.config.colors.black;
        this.ctx.font = `bold 30px ${this.config.fontSecondary}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('UPLOAD ASSET FOR PROPAGANDA', this.canvas.width / 2, this.canvas.height / 2);
    }

    applyGlitch() {
        if (this.glitchIntensity <= 0) return;

        for (let i = 0; i < this.glitchIntensity; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const w = Math.random() * this.canvas.width;
            const h = Math.random() * 50;
            
            const slice = this.ctx.getImageData(x, y, w, h);
            this.ctx.putImageData(slice, x + (Math.random() - 0.5) * 20, y);
            
            this.ctx.fillStyle = Math.random() > 0.5 ? this.config.colors.red : this.config.colors.yellow;
            this.ctx.globalAlpha = 0.2;
            this.ctx.fillRect(0, y, this.canvas.width, 2);
            this.ctx.globalAlpha = 1.0;
        }
    }

    drawBrutalText(text, x, y, isBottom) {
        if (!text) return;
        
        const fontSize = 70;
        this.ctx.font = `${fontSize}px "${this.config.fontPrimary}"`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = isBottom ? 'bottom' : 'top';
        
        const padding = 20;
        const textWidth = this.ctx.measureText(text.toUpperCase()).width;
        
        // Black box background
        this.ctx.fillStyle = this.config.colors.black;
        const boxY = isBottom ? y - fontSize - padding : y;
        this.ctx.fillRect((this.canvas.width - textWidth) / 2 - padding, boxY, textWidth + padding * 2, fontSize + padding);
        
        // White text
        this.ctx.fillStyle = this.config.colors.white;
        this.ctx.fillText(text.toUpperCase(), x, isBottom ? y - padding/2 : y + padding/2);
    }

    drawSticker(sticker) {
        this.ctx.save();
        this.ctx.translate(sticker.x, sticker.y);
        this.ctx.rotate(sticker.rotation);
        
        this.ctx.font = `24px "${this.config.fontPrimary}"`;
        const textWidth = this.ctx.measureText(sticker.text).width;
        const p = 10;
        
        // Shadow
        this.ctx.fillStyle = this.config.colors.black;
        this.ctx.fillRect(4, 4, textWidth + p*2, 40);
        
        // Box
        this.ctx.fillStyle = this.config.colors.red;
        this.ctx.strokeStyle = this.config.colors.black;
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(0, 0, textWidth + p*2, 40);
        this.ctx.strokeRect(0, 0, textWidth + p*2, 40);
        
        // Text
        this.ctx.fillStyle = this.config.colors.white;
        this.ctx.fillText(sticker.text, p, 28);
        
        this.ctx.restore();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.img) {
            // Draw image maintaining aspect ratio (cover)
            const ratio = Math.max(this.canvas.width / this.img.width, this.canvas.height / this.img.height);
            const nw = this.img.width * ratio;
            const nh = this.img.height * ratio;
            this.ctx.drawImage(this.img, (this.canvas.width - nw) / 2, (this.canvas.height - nh) / 2, nw, nh);
        } else {
            this.drawPlaceholder();
        }

        // Draw stickers
        this.stickers.forEach(s => this.drawSticker(s));

        // Draw Brutalist Text
        this.drawBrutalText(this.textTop, this.canvas.width / 2, 40, false);
        this.drawBrutalText(this.textBottom, this.canvas.width / 2, this.canvas.height - 40, true);

        // Border
        this.ctx.strokeStyle = this.config.colors.black;
        this.ctx.lineWidth = 12;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        this.applyGlitch();
    }

    download() {
        const link = document.createElement('a');
        link.download = `propaganda-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.memeFactory = new MemeFactory('factoryCanvas');
});