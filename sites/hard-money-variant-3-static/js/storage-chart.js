/**
 * PRISM LOGIC // Workspace & Transfer Dashboard Telemetry Engine
 * File: js/storage-chart.js
 * 
 * Provides real-time interactive canvas visualizations for storage allocation,
 * historical transfer speeds, bandwidth metrics, and automated mock activity dispatchers.
 */

class PrismWorkspaceDashboard {
  constructor() {
    this.storageCanvas = document.getElementById('storageDonutCanvas');
    this.waveCanvas = document.getElementById('transferWaveCanvas');
    this.feedContainer = document.getElementById('prismActivityFeed');
    
    // Core metrics state
    this.metrics = {
      storage: {
        total: 15.0, // GB
        used: 4.25,  // GB
        categories: [
          { name: 'Media Assets', size: 2.1, color: '#ff2e93', glow: 'rgba(255, 46, 147, 0.4)' },
          { name: 'Documents & PDFs', size: 1.15, color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
          { name: 'Source Archives', size: 0.75, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
          { name: 'System Cache', size: 0.25, color: '#ffde43', glow: 'rgba(255, 222, 67, 0.4)' }
        ]
      },
      activeTransfers: [
        { id: 'TX-901', file: 'Prism_Logic_v2.4_Assets.zip', size: '420 MB', speed: '45 MB/s', progress: 78, status: 'active', color: '#00f0ff' },
        { id: 'TX-902', file: 'Q4_Underwriting_Matrix.xlsx', size: '12 MB', speed: '12 MB/s', progress: 100, status: 'completed', color: '#00ff87' },
        { id: 'TX-903', file: 'Architectural_Render_R3.exr', size: '1.4 GB', speed: '82 MB/s', progress: 32, status: 'active', color: '#ff2e93' }
      ],
      speedHistory: Array.from({ length: 40 }, () => Math.random() * 40 + 20) // Seed speed array
    };

    // UI Interactive States
    this.activeSegmentIndex = null;
    this.storageAnimProgress = 0;
    this.waveOffset = 0;

    this.init();
  }

  init() {
    // Canvas dimensions setup & resizing
    this.setupCanvases();
    window.addEventListener('resize', () => this.setupCanvases());

    // Event listeners for interaction
    if (this.storageCanvas) {
      this.storageCanvas.addEventListener('mousemove', (e) => this.handleStorageHover(e));
      this.storageCanvas.addEventListener('mouseleave', () => {
        this.activeSegmentIndex = null;
      });
    }

    // Begin Animation Loops
    this.animate();

    // Spawn activities periodically
    this.startActivitySim();
    this.renderActiveTransfers();
  }

  setupCanvases() {
    if (this.storageCanvas) {
      const rect = this.storageCanvas.parentElement.getBoundingClientRect();
      this.storageCanvas.width = rect.width * window.devicePixelRatio;
      this.storageCanvas.height = Math.max(rect.height, 220) * window.devicePixelRatio;
      this.storageCanvas.style.width = '100%';
      this.storageCanvas.style.height = '100%';
    }
    if (this.waveCanvas) {
      const rect = this.waveCanvas.parentElement.getBoundingClientRect();
      this.waveCanvas.width = rect.width * window.devicePixelRatio;
      this.waveCanvas.height = Math.max(rect.height, 120) * window.devicePixelRatio;
      this.waveCanvas.style.width = '100%';
      this.waveCanvas.style.height = '100%';
    }
  }

  // Draw Storage ring diagram with spectral glow effects
  drawStorageRing() {
    if (!this.storageCanvas) return;
    const ctx = this.storageCanvas.getContext('2d');
    const width = this.storageCanvas.width;
    const height = this.storageCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const logicalWidth = width / window.devicePixelRatio;
    const logicalHeight = height / window.devicePixelRatio;
    const centerX = logicalWidth * 0.4;
    const centerY = logicalHeight * 0.5;
    const radius = Math.min(logicalWidth, logicalHeight) * 0.35;
    const thickness = 16;

    // Smooth entry animation for slices
    if (this.storageAnimProgress < 1) {
      this.storageAnimProgress += 0.02;
    }

    let startAngle = -Math.PI / 2;
    const freeSpace = this.metrics.storage.total - this.metrics.storage.used;
    
    // Normalize percentages
    const totalAllocated = this.metrics.storage.categories.reduce((acc, cat) => acc + cat.size, 0);
    const chartSegments = [
      ...this.metrics.storage.categories,
      { name: 'Unused Overhead', size: freeSpace, color: 'rgba(30, 41, 59, 0.45)', glow: 'transparent', isFree: true }
    ];

    chartSegments.forEach((segment, index) => {
      const segmentPercentage = segment.size / this.metrics.storage.total;
      const angleDelta = segmentPercentage * Math.PI * 2 * this.storageAnimProgress;
      const endAngle = startAngle + angleDelta;

      const isHovered = this.activeSegmentIndex === index;
      const currentRadius = isHovered ? radius + 4 : radius;
      const currentThickness = isHovered ? thickness + 4 : thickness;

      // Draw glowing arc backplate
      if (!segment.isFree) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, startAngle, endAngle);
        ctx.strokeStyle = segment.color;
        ctx.lineWidth = currentThickness;
        ctx.lineCap = 'round';
        ctx.shadowColor = segment.color;
        ctx.shadowBlur = isHovered ? 25 : 12;
        ctx.globalAlpha = isHovered ? 0.9 : 0.6;
        ctx.stroke();
        ctx.restore();
      }

      // Draw physical crisp stroke segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, startAngle, endAngle);
      ctx.strokeStyle = segment.color;
      ctx.lineWidth = currentThickness;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw separator points
      startAngle = endAngle;
    });

    // Central Data Readout Interface
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${this.metrics.storage.used.toFixed(2)} GB`, centerX, centerY - 8);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`OF ${this.metrics.storage.total} GB MAX`, centerX, centerY + 12);

    // Draw Legend alongside on large containers
    if (logicalWidth > 260) {
      this.drawLegend(ctx, logicalWidth * 0.78, centerY, chartSegments);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  }

  drawLegend(ctx, startX, centerY, segments) {
    const spacing = 22;
    const totalHeight = segments.length * spacing;
    let currentY = centerY - totalHeight / 2 + 8;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    segments.forEach((seg, index) => {
      const isHovered = this.activeSegmentIndex === index;

      // Indicator color pill
      ctx.fillStyle = seg.color;
      ctx.beginPath();
      ctx.arc(startX - 12, currentY, isHovered ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
      ctx.font = isHovered ? 'bold 10px "Plus Jakarta Sans", sans-serif' : '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(seg.name, startX, currentY - 4);

      // Value metrics
      ctx.fillStyle = isHovered ? '#00f0ff' : 'rgba(255, 255, 255, 0.35)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`${seg.size.toFixed(2)} GB`, startX, currentY + 7);

      currentY += spacing;
    });
  }

  handleStorageHover(e) {
    const rect = this.storageCanvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (this.storageCanvas.width / rect.width) / window.devicePixelRatio;
    const mouseY = (e.clientY - rect.top) * (this.storageCanvas.height / rect.height) / window.devicePixelRatio;

    const logicalWidth = this.storageCanvas.width / window.devicePixelRatio;
    const logicalHeight = this.storageCanvas.height / window.devicePixelRatio;
    const centerX = logicalWidth * 0.4;
    const centerY = logicalHeight * 0.5;

    // Calculate angle from center
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(logicalWidth, logicalHeight) * 0.35;

    // Check if mouse is hovering in the interactive ring zone
    if (dist > radius - 20 && dist < radius + 20) {
      let angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) {
        angle += Math.PI * 2; // Normalize starting from top (-Math.PI/2)
      }
      
      const targetAngle = angle + Math.PI / 2;
      let cumulativeAngle = 0;
      const freeSpace = this.metrics.storage.total - this.metrics.storage.used;
      const chartSegments = [
        ...this.metrics.storage.categories,
        { name: 'Unused Overhead', size: freeSpace, color: 'rgba(30, 41, 59, 0.45)', isFree: true }
      ];

      for (let i = 0; i < chartSegments.length; i++) {
        const segAngle = (chartSegments[i].size / this.metrics.storage.total) * Math.PI * 2;
        if (targetAngle >= cumulativeAngle && targetAngle <= cumulativeAngle + segAngle) {
          this.activeSegmentIndex = i;
          return;
        }
        cumulativeAngle += segAngle;
      }
    }
    this.activeSegmentIndex = null;
  }

  // Draw smooth bandwidth line chart with shifting sine waves
  drawWaveChart() {
    if (!this.waveCanvas) return;
    const ctx = this.waveCanvas.getContext('2d');
    const width = this.waveCanvas.width;
    const height = this.waveCanvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const logicalWidth = width / window.devicePixelRatio;
    const logicalHeight = height / window.devicePixelRatio;

    // Shift wave anim offsets
    this.waveOffset += 0.04;

    // Update historical speeds subtly
    if (Math.random() < 0.1) {
      this.metrics.speedHistory.push(Math.random() * 35 + 30);
      this.metrics.speedHistory.shift();
    }

    // Grid Layout background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < logicalWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, logicalHeight);
      ctx.stroke();
    }
    for (let y = 0; y < logicalHeight; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(logicalWidth, y);
      ctx.stroke();
    }

    // Graph Area Base Mapping
    const points = [];
    const step = logicalWidth / (this.metrics.speedHistory.length - 1);
    
    this.metrics.speedHistory.forEach((speed, i) => {
      const x = i * step;
      // Map speed (0 to 100 MB/s) to height (leaving margin)
      const y = logicalHeight - 20 - (speed / 100) * (logicalHeight - 40);
      points.push({ x, y });
    });

    // 1. Draw Fill under the telemetry wave
    ctx.beginPath();
    ctx.moveTo(0, logicalHeight);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(logicalWidth, logicalHeight);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, logicalHeight);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // 2. Draw glowing primary line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.stroke();
    
    // Clear shadow configurations
    ctx.shadowBlur = 0;

    // 3. Draw live sine modulation stream overlay (futuristic spectral styling)
    ctx.beginPath();
    ctx.moveTo(0, logicalHeight * 0.5);
    for (let x = 0; x < logicalWidth; x++) {
      const y = logicalHeight * 0.55 + 
                Math.sin(x * 0.015 + this.waveOffset) * 12 * Math.cos(x * 0.004) + 
                Math.sin(x * 0.04 - this.waveOffset * 1.5) * 4;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255, 46, 147, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Speed indicator marker at endpoint
    const lastPt = points[points.length - 1];
    ctx.fillStyle = '#00ff87';
    ctx.shadowColor = '#00ff87';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(lastPt.x - 4, lastPt.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Display current speed
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${this.metrics.speedHistory[this.metrics.speedHistory.length - 1].toFixed(1)} MB/S`, logicalWidth - 8, lastPt.y - 8);

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  }

  // Generate live list layout for Active/Completed transfers
  renderActiveTransfers() {
    const listEl = document.getElementById('activeTransfersList');
    if (!listEl) return;

    listEl.innerHTML = this.metrics.activeTransfers.map(tx => {
      const isComplete = tx.progress >= 100;
      return `
        <div class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="w-2.5 h-2.5 rounded-full" style="background-color: ${tx.color}; box-shadow: 0 0 8px ${tx.color}"></div>
            <div class="truncate">
              <span class="text-white font-medium block truncate">${tx.file}</span>
              <span class="text-[10px] text-white/40 font-mono uppercase">${tx.id} • ${tx.size}</span>
            </div>
          </div>
          <div class="flex items-center space-x-4 shrink-0 text-right font-mono">
            <div>
              <span class="text-[10px] text-white/50 block">${isComplete ? 'VERIFIED' : tx.speed}</span>
              <span class="font-bold text-white">${tx.progress}%</span>
            </div>
            <div class="w-12 bg-white/5 rounded-full h-1 overflow-hidden relative">
              <div class="h-full rounded-full" style="background-color: ${tx.color}; width: ${tx.progress}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Simulated streaming progress updates
  animateProgressStream() {
    this.metrics.activeTransfers.forEach(tx => {
      if (tx.status === 'active') {
        tx.progress += Math.floor(Math.random() * 3) + 1;
        if (tx.progress >= 100) {
          tx.progress = 100;
          tx.status = 'completed';
          tx.color = '#00ff87'; // Green for completion
          this.pushActivity(`Completed compilation payload transfer for ${tx.file}`, 'SYSTEM');
        }
      }
    });
    this.renderActiveTransfers();
  }

  // Custom live feed system injection
  pushActivity(description, tag = 'DOWNLOAD') {
    if (!this.feedContainer) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const colors = {
      'DOWNLOAD': 'text-prism-blue border-prism-blue/20 bg-prism-blue/5',
      'PREVIEW': 'text-prism-purple border-prism-purple/20 bg-prism-purple/5',
      'SYSTEM': 'text-prism-green border-prism-green/20 bg-prism-green/5',
      'ALERT': 'text-prism-red border-prism-red/20 bg-prism-red/5'
    };

    const colorClass = colors[tag] || 'text-white/60 border-white/10 bg-white/5';

    const activityHTML = `
      <div class="p-3 bg-black/25 border border-white/5 rounded-xl flex items-start gap-3 text-xs animate-fadeIn">
        <span class="font-mono text-[9px] px-1.5 py-0.5 rounded border ${colorClass} shrink-0 mt-0.5">
          ${tag}
        </span>
        <div class="space-y-0.5 flex-1">
          <p class="text-white/80 font-sans">${description}</p>
          <span class="text-[9px] font-mono text-white/30 block">${timeString}</span>
        </div>
      </div>
    `;

    this.feedContainer.insertAdjacentHTML('afterbegin', activityHTML);

    // Limit active children counts to maintain performance
    while (this.feedContainer.children.length > 8) {
      this.feedContainer.lastElementChild.remove();
    }
  }

  startActivitySim() {
    const actions = [
      () => this.pushActivity("Underwriting Broker downloaded Bundle_NY-201.zip", "DOWNLOAD"),
      () => this.pushActivity("Prospecting Node from NV previewed PitchDeck_v4.pdf", "PREVIEW"),
      () => this.pushActivity("Optimized storage index nodes: Reclaimed 140 MB Cache", "SYSTEM"),
      () => this.pushActivity("Recipient requested direct handshake proposal link", "ALERT")
    ];

    // Seed initial lines
    actions.forEach(act => act());

    setInterval(() => {
      const idx = Math.floor(Math.random() * actions.length);
      actions[idx]();
    }, 9000);
  }

  // Global main animation loop
  animate() {
    this.drawStorageRing();
    this.drawWaveChart();

    if (Math.random() < 0.15) {
      this.animateProgressStream();
    }

    requestAnimationFrame(() => this.animate());
  }

  // Developer control interface triggers
  injectMockBundle(fileName, sizeGB) {
    if (this.metrics.storage.used + sizeGB > this.metrics.storage.total) {
      this.pushActivity("Workspace Storage Capacity Exhausted! Expand resource node.", "ALERT");
      return false;
    }

    // Append mock bundle sizes dynamically inside category index
    this.metrics.storage.categories[0].size += sizeGB * 0.6;
    this.metrics.storage.categories[1].size += sizeGB * 0.4;
    this.metrics.storage.used += sizeGB;
    this.storageAnimProgress = 0; // Trigger slide re-animation

    this.metrics.activeTransfers.unshift({
      id: `TX-${Math.floor(Math.random() * 900) + 100}`,
      file: fileName,
      size: `${(sizeGB * 1024).toFixed(0)} MB`,
      speed: `${Math.floor(Math.random() * 50) + 30} MB/s`,
      progress: 0,
      status: 'active',
      color: '#8b5cf6'
    });

    this.pushActivity(`Deployed new capital allocation bundle index: ${fileName}`, "SYSTEM");
    this.renderActiveTransfers();
    return true;
  }
}

// Auto-initialize dashboard workspace parameters on load
window.addEventListener('DOMContentLoaded', () => {
  window.prismDashboard = new PrismWorkspaceDashboard();
});