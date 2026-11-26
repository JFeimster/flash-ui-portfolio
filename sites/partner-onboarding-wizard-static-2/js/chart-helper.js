/**
 * Moonshine Capital — Partner Onboarding & Affiliate Platform
 * Custom Neo-Brutalist Interactive Charting Engine & Telemetry Helpers
 * File: js/chart-helper.js
 * 
 * Designed to render high-impact, stark, high-contrast analytics visualization
 * matching the brand's layout: heavy borders, bold colors, zero anti-aliased curves.
 */

class MoonshineChart {
  constructor(canvasId, data, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Core styling definitions mapped to Moonshine root theme
    this.theme = {
      accent: '#FF5100', // Cyber Blaze Orange
      accentLight: '#FF8F5A',
      accentMuted: '#FFD2C0',
      dark: '#000000',
      bg: '#FFFFFF',
      bgAlt: '#F3F3F3',
      gridColor: '#E0E0E0',
      fontFamily: "'Archivo', sans-serif"
    };

    this.data = data; // Array of objects: { label: "JAN 01", value: 120 }
    this.options = Object.assign({
      yMin: 0,
      padding: { top: 40, right: 30, bottom: 40, left: 60 },
      gridRows: 5,
      drawGrid: true,
      drawArea: true,
      metricUnit: ''
    }, options);

    this.hoverIndex = -1;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.draw();
    });

    // Handle high-impact hover effects
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());

    this.draw();
  }

  resizeCanvas() {
    const rect = this.canvas.parentNode.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = (this.canvas.dataset.height || 320) * window.devicePixelRatio;
    this.canvas.style.width = '100%';
    this.canvas.style.height = `${this.canvas.dataset.height || 320}px`;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  getMetrics() {
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    const pad = this.options.padding;
    const chartWidth = width - pad.left - pad.right;
    const chartHeight = height - pad.top - pad.bottom;

    const values = this.data.map(d => d.value);
    const maxVal = Math.max(...values, 10);
    const yMax = Math.ceil(maxVal * 1.15); // Add headroom

    return { width, height, pad, chartWidth, chartHeight, yMax };
  }

  getCoords(index, val, metrics) {
    const { pad, chartWidth, chartHeight, yMax } = metrics;
    const x = pad.left + (index / (this.data.length - 1)) * chartWidth;
    const y = pad.top + chartHeight - (val / yMax) * chartHeight;
    return { x, y };
  }

  draw() {
    const metrics = this.getMetrics();
    const { width, height, pad, chartWidth, chartHeight, yMax } = metrics;

    this.ctx.clearRect(0, 0, width, height);

    // Stark Neo-Brutalist Background Canvas Fill
    this.ctx.fillStyle = this.theme.bg;
    this.ctx.fillRect(0, 0, width, height);

    // Draw Gridlines (Blocky, Raw style)
    if (this.options.drawGrid) {
      this.ctx.strokeStyle = this.theme.gridColor;
      this.ctx.lineWidth = 2;
      for (let i = 0; i <= this.options.gridRows; i++) {
        const yVal = (i / this.options.gridRows) * yMax;
        const coords = this.getCoords(0, yVal, metrics);
        
        this.ctx.beginPath();
        this.ctx.moveTo(pad.left, coords.y);
        this.ctx.lineTo(pad.left + chartWidth, coords.y);
        this.ctx.stroke();

        // Label on Y-axis
        this.ctx.fillStyle = this.theme.dark;
        this.ctx.font = `900 11px ${this.theme.fontFamily}`;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${this.options.metricUnit}${Math.round(yVal)}`, pad.left - 12, coords.y + 4);
      }
    }

    // Draw X-axis Labels
    this.data.forEach((item, index) => {
      const coords = this.getCoords(index, item.value, metrics);
      this.ctx.fillStyle = this.theme.dark;
      this.ctx.font = `900 10px ${this.theme.fontFamily}`;
      this.ctx.textAlign = 'center';
      
      // Rotate labels slightly for brutalist layout accentuation if data size is heavy
      const labelInterval = Math.ceil(this.data.length / 8);
      if (index % labelInterval === 0) {
        this.ctx.fillText(item.label.toUpperCase(), coords.x, pad.top + chartHeight + 24);
      }
    });

    // Draw Shaded Under Area (Flat Neo-Brutalist Block Shadow)
    if (this.options.drawArea && this.data.length > 0) {
      this.ctx.beginPath();
      const startCoords = this.getCoords(0, 0, metrics);
      this.ctx.moveTo(startCoords.x, startCoords.y);

      this.data.forEach((item, index) => {
        const coords = this.getCoords(index, item.value, metrics);
        this.ctx.lineTo(coords.x, coords.y);
      });

      const endCoords = this.getCoords(this.data.length - 1, 0, metrics);
      this.ctx.lineTo(endCoords.x, endCoords.y);
      this.ctx.closePath();
      
      this.ctx.fillStyle = this.theme.accentMuted;
      this.ctx.fill();
      
      // Brutalist Slash Hatching pattern overlay
      this.ctx.save();
      this.ctx.clip();
      this.ctx.strokeStyle = 'rgba(255, 81, 0, 0.15)';
      this.ctx.lineWidth = 1;
      const stripeSpacing = 12;
      for (let i = -height; i < width + height; i += stripeSpacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i + height, height);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    // Heavy Stark Outline Border for the main graph region
    this.ctx.strokeStyle = this.theme.dark;
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(pad.left, pad.top, chartWidth, chartHeight);

    // Render Data Line (Solid thick straight segments, absolutely zero smoothing)
    if (this.data.length > 0) {
      this.ctx.beginPath();
      this.data.forEach((item, index) => {
        const coords = this.getCoords(index, item.value, metrics);
        if (index === 0) {
          this.ctx.moveTo(coords.x, coords.y);
        } else {
          this.ctx.lineTo(coords.x, coords.y);
        }
      });
      this.ctx.strokeStyle = this.theme.accent;
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    }

    // Render Square Interactive Data Points
    this.data.forEach((item, index) => {
      const coords = this.getCoords(index, item.value, metrics);
      
      // If hovered, enlarge & colorize dramatically
      const isHovered = index === this.hoverIndex;
      const size = isHovered ? 12 : 8;
      
      this.ctx.fillStyle = isHovered ? this.theme.accent : this.theme.bg;
      this.ctx.strokeStyle = this.theme.dark;
      this.ctx.lineWidth = 3;
      
      // Render as square nodes
      this.ctx.fillRect(coords.x - size / 2, coords.y - size / 2, size, size);
      this.ctx.strokeRect(coords.x - size / 2, coords.y - size / 2, size, size);
    });

    // Draw Live Tooltip block if active
    if (this.hoverIndex >= 0 && this.hoverIndex < this.data.length) {
      const activeItem = this.data[this.hoverIndex];
      const coords = this.getCoords(this.hoverIndex, activeItem.value, metrics);
      this.drawTooltip(activeItem, coords.x, coords.y);
    }
  }

  drawTooltip(item, x, y) {
    this.ctx.save();
    
    const textLabel = `${item.label}: ${this.options.metricUnit}${item.value.toLocaleString()}`;
    this.ctx.font = `900 12px ${this.theme.fontFamily}`;
    const textWidth = this.ctx.measureText(textLabel).width;
    
    const boxW = textWidth + 24;
    const boxH = 34;
    const boxX = Math.max(this.options.padding.left, Math.min(x - boxW / 2, this.canvas.width / window.devicePixelRatio - this.options.padding.right - boxW));
    const boxY = y - boxH - 15;

    // Solid stark drop shadow first (No blur)
    this.ctx.fillStyle = this.theme.dark;
    this.ctx.fillRect(boxX + 4, boxY + 4, boxW, boxH);

    // Front box panel
    this.ctx.fillStyle = '#FFDD00'; // High Contrast Yellow Warning style for Tooltip
    this.ctx.strokeStyle = this.theme.dark;
    this.ctx.lineWidth = 3;
    this.ctx.fillRect(boxX, boxY, boxW, boxH);
    this.ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Text metrics rendering inside Tooltip
    this.ctx.fillStyle = this.theme.dark;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(textLabel.toUpperCase(), boxX + boxW / 2, boxY + boxH / 2 + 1);

    this.ctx.restore();
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const metrics = this.getMetrics();
    
    // Find closest data node based on mapping metrics
    let closestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < this.data.length; i++) {
      const coords = this.getCoords(i, this.data[i].value, metrics);
      const distance = Math.abs(mouseX - coords.x);
      if (distance < minDistance && distance < 40) { // Hover window range
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== this.hoverIndex) {
      this.hoverIndex = closestIndex;
      this.draw();
    }
  }

  handleMouseLeave() {
    this.hoverIndex = -1;
    this.draw();
  }
}

/**
 * UTILITY & TELEMETRY CONTROLLER
 * Includes dynamic tracking engine link components, marketing campaign builders,
 * and standard UI event binds.
 */
const MoonshineTelemetry = {
  // Generates campaign-specific query parameter mappings dynamically
  generateComplexURL(baseKey, params = {}) {
    const cleanKey = baseKey.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    let url = `https://moonshine.capital/?ref=${cleanKey}`;
    
    const activeParams = [];
    if (params.utm_source) activeParams.push(`utm_source=${encodeURIComponent(params.utm_source)}`);
    if (params.utm_medium) activeParams.push(`utm_medium=${encodeURIComponent(params.utm_medium)}`);
    if (params.utm_campaign) activeParams.push(`utm_campaign=${encodeURIComponent(params.utm_campaign)}`);
    
    if (activeParams.length > 0) {
      url += `&${activeParams.join('&')}`;
    }
    return url;
  },

  // Updates the visual widget state properties across the main panel
  refreshQuickLinkGenerator(elementIds, stateKey) {
    const inputKeyEl = document.getElementById(elementIds.inputKey);
    const utmSourceEl = document.getElementById(elementIds.utmSource);
    const outputEl = document.getElementById(elementIds.outputUrl);
    
    if (!inputKeyEl || !outputEl) return;

    const baseVal = inputKeyEl.value.trim() || stateKey || 'partner-demo';
    const cleanBase = baseVal.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    
    const params = {
      utm_source: utmSourceEl ? utmSourceEl.value.trim() : ''
    };

    const finalUrl = this.generateComplexURL(cleanBase, params);
    outputEl.value = finalUrl;
  }
};

// Global initializer namespace hook for downstream application structures
window.MoonshineChart = MoonshineChart;
window.MoonshineTelemetry = MoonshineTelemetry;