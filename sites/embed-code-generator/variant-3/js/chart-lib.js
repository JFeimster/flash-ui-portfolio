/**
 * Moonshine Capital | Charting Library v1.0
 * Lightweight Canvas-based visualizations for Partner Performance Dashboard.
 */

const MS_THEME = {
    blue: '#00f0ff',
    green: '#39ff14',
    border: '#26262b',
    textMuted: '#52525b',
    textPrimary: '#f4f4f5',
    bgElevated: '#16161a'
};

class MSChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.init();
    }

    init() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        this.width = rect.width;
        this.height = rect.height;
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * Renders a smooth trend line (Sparkline)
     */
    renderSparkline(data, color = MS_THEME.blue) {
        const { ctx, width, height } = this;
        ctx.clearRect(0, 0, width, height);

        const padding = 5;
        const usableWidth = width - padding * 2;
        const usableHeight = height - padding * 2;
        const max = Math.max(...data) || 1;
        const step = usableWidth / (data.length - 1);

        // Path
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        data.forEach((val, i) => {
            const x = padding + (i * step);
            const y = height - padding - ((val / max) * usableHeight);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Area Fill
        ctx.lineTo(padding + (data.length - 1) * step, height);
        ctx.lineTo(padding, height);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, this.hexToRgba(color, 0.2));
        gradient.addColorStop(1, this.hexToRgba(color, 0));
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    /**
     * Renders a circular progress indicator (Donut)
     */
    renderDonut(percentage, label, color = MS_THEME.green) {
        const { ctx, width, height } = this;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 8;

        ctx.clearRect(0, 0, width, height);

        // Track
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = MS_THEME.border;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Progress
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * (percentage / 100));
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Label
        ctx.fillStyle = MS_THEME.textPrimary;
        ctx.font = '600 12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, centerX, centerY - 2);
        
        ctx.fillStyle = MS_THEME.textMuted;
        ctx.font = '400 8px Inter';
        ctx.fillText(label.toUpperCase(), centerX, centerY + 10);
    }

    /**
     * Renders a bar-style activity chart
     */
    renderActivity(data) {
        const { ctx, width, height } = this;
        ctx.clearRect(0, 0, width, height);

        const barGap = 6;
        const barWidth = (width / data.length) - barGap;
        const max = Math.max(...data) || 1;

        data.forEach((val, i) => {
            const barHeight = (val / max) * (height - 10);
            const x = i * (barWidth + barGap);
            const y = height - barHeight;

            // Bar background
            ctx.fillStyle = MS_THEME.bgElevated;
            ctx.fillRect(x, 0, barWidth, height);

            // Active fill
            const gradient = ctx.createLinearGradient(0, y, 0, height);
            gradient.addColorStop(0, MS_THEME.blue);
            gradient.addColorStop(1, MS_THEME.green);
            
            ctx.fillStyle = gradient;
            ctx.roundRect ? ctx.beginPath() : null;
            if (ctx.roundRect) {
                ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
                ctx.fill();
            } else {
                ctx.fillRect(x, y, barWidth, barHeight);
            }
        });
    }
}

// Global initialization helper for dashboard
window.initDashboardCharts = () => {
    // Example Impression Trend
    const impressions = new MSChart('impressionsChart');
    if (impressions.canvas) impressions.renderSparkline([30, 45, 32, 60, 85, 70, 95], MS_THEME.blue);

    // Example Conversion Rate
    const ctr = new MSChart('ctrChart');
    if (ctr.canvas) ctr.renderDonut(12.5, 'CTR', MS_THEME.green);

    // Example Volume Activity
    const activity = new MSChart('activityChart');
    if (activity.canvas) activity.renderActivity([40, 70, 55, 90, 65, 80, 100, 45, 60, 85]);
};

// Handle resize to prevent blurring
window.addEventListener('resize', () => {
    if (window.initDashboardCharts) window.initDashboardCharts();
});