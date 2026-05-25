/**
 * trend-chart-logic.js
 * Visualizes the LTV:CAC ratio over time with high-performance Canvas rendering
 * Styled to match the SaaS Diagnostic UI theme.
 */

const TrendDashboard = {
    colors: {
        cyan: '#00f2ff',
        purple: '#9d00ff',
        green: '#00ff88',
        red: '#ff0055',
        textDim: '#94a3b8',
        gridLines: 'rgba(255, 255, 255, 0.05)'
    },

    initTrendChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        
        // Data points (Historical LTV:CAC Ratios)
        const data = [1.2, 1.8, 1.5, 2.4, 3.1, 4.2, 3.8, 4.5, 5.2, 4.9, 5.8, 6.2];
        const labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = parent.clientWidth * dpr;
            canvas.height = parent.clientHeight * dpr;
            ctx.scale(dpr, dpr);
            this.draw(ctx, data, labels, parent.clientWidth, parent.clientHeight);
        };

        window.addEventListener('resize', resize);
        resize();
    },

    draw(ctx, data, labels, width, height) {
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        const maxVal = Math.max(...data) * 1.2;
        
        ctx.clearRect(0, 0, width, height);

        // Draw Grid
        ctx.strokeStyle = this.colors.gridLines;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
        }
        ctx.stroke();

        // Create Path
        const points = data.map((val, i) => ({
            x: padding + (i * (chartWidth / (data.length - 1))),
            y: (height - padding) - ((val / maxVal) * chartHeight)
        }));

        // Draw Gradient Area
        const areaGradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        areaGradient.addColorStop(0, 'rgba(0, 242, 255, 0.15)');
        areaGradient.addColorStop(1, 'rgba(157, 0, 255, 0)');
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padding);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, height - padding);
        ctx.closePath();
        ctx.fillStyle = areaGradient;
        ctx.fill();

        // Draw Line with Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 242, 255, 0.5)';
        ctx.strokeStyle = this.colors.cyan;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();

        // Draw Data Points
        ctx.shadowBlur = 0;
        points.forEach((p, i) => {
            const isLast = i === points.length - 1;
            ctx.fillStyle = isLast ? this.colors.green : this.colors.cyan;
            ctx.beginPath();
            ctx.arc(p.x, p.y, isLast ? 6 : 4, 0, Math.PI * 2);
            ctx.fill();
            
            if (isLast) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Draw Labels (Sparse)
            if (i % 2 === 0) {
                ctx.fillStyle = this.colors.textDim;
                ctx.font = '700 10px "Space Grotesk"';
                ctx.textAlign = 'center';
                ctx.fillText(labels[i], p.x, height - 15);
            }
        });

        // Current Value Tag
        const lastPoint = points[points.length - 1];
        ctx.fillStyle = '#fff';
        ctx.font = '800 12px "Space Grotesk"';
        ctx.textAlign = 'left';
        ctx.fillText(`${data[data.length - 1].toFixed(1)}:1`, lastPoint.x + 12, lastPoint.y + 4);
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // If a container doesn't exist, this logic allows the UI to scale 
    // to a trend view if a canvas element with id 'trendChart' is injected.
    TrendDashboard.initTrendChart('trendChart');
});