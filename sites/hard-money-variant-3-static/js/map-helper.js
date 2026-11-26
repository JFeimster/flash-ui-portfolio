class PrismSecurityMap {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`PrismSecurityMap: Canvas element with ID "${canvasId}" not found.`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.options = Object.assign({
      themeColors: {
        black: '#030712',
        charcoal: '#0b0f19',
        slate: '#1e293b',
        red: '#ff2e93',
        blue: '#00f0ff',
        green: '#00ff87',
        yellow: '#ffde43',
        purple: '#8b5cf6'
      },
      onNodeHover: null,
      onNodeClick: null
    }, options);

    this.nodes = [];
    this.streams = [];
    this.originNode = {
      id: 'origin-prism',
      name: 'Prism Logic Secure Vault',
      ip: '10.0.12.254',
      location: 'US-EAST (Primary Secure Node)',
      x: 0.35, // Normalized coordinates (0 to 1)
      y: 0.38,
      status: 'active',
      isOrigin: true
    };

    this.hoveredNode = null;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate Initial Security Audit Nodes
    this.nodes = [
      {
        id: 'node-1',
        name: 'Apex Capital Endpoint',
        ip: '185.190.140.22',
        location: 'London, UK',
        x: 0.52,
        y: 0.32,
        status: 'secure',
        attachment: 'apex_deal_sheet_v4.pdf',
        timestamp: '2024-11-04 14:22:18',
        attempts: 1,
        revoked: false
      },
      {
        id: 'node-2',
        name: 'Obsidian Risk Terminal',
        ip: '98.137.11.162',
        location: 'San Francisco, US',
        x: 0.18,
        y: 0.42,
        status: 'secure',
        attachment: 'underwriting_matrix_direct.xlsx',
        timestamp: '2024-11-04 15:45:10',
        attempts: 2,
        revoked: false
      },
      {
        id: 'node-3',
        name: 'Lumina Trust Gateway',
        ip: '203.0.113.88',
        location: 'Tokyo, JP',
        x: 0.82,
        y: 0.45,
        status: 'secure',
        attachment: 'portfolio_yield_models.xml',
        timestamp: '2024-11-04 15:52:01',
        attempts: 1,
        revoked: false
      },
      {
        id: 'node-4',
        name: 'Anonymous Crawler (Suspicious)',
        ip: '45.227.254.12',
        location: 'N/A (Proxy-Routed)',
        x: 0.68,
        y: 0.62,
        status: 'warning',
        attachment: 'apex_deal_sheet_v4.pdf',
        timestamp: '2024-11-04 16:01:44',
        attempts: 14,
        revoked: false
      },
      {
        id: 'node-5',
        name: 'Intercepted Node (Access Denied)',
        ip: '198.51.100.4',
        location: 'Frankfurt, DE',
        x: 0.58,
        y: 0.38,
        status: 'blocked',
        attachment: 'confidential_lender_matrix_v2.4.csv',
        timestamp: '2024-11-04 16:10:12',
        attempts: 4,
        revoked: true
      }
    ];

    // Trigger initial streams
    this.nodes.forEach(node => {
      if (!node.revoked) {
        this.createStream(this.originNode, node);
      }
    });

    // Handle mouse move for tooltips and hover animations
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.handleMouseClick(e));

    // Start render loop
    this.render();
  }

  resize() {
    if (this.canvas) {
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = this.canvas.parentElement.clientHeight || 300;
    }
  }

  createStream(source, target) {
    this.streams.push({
      source,
      target,
      progress: 0,
      speed: 0.006 + Math.random() * 0.008,
      color: target.status === 'warning' ? this.options.themeColors.yellow : 
             target.status === 'blocked' ? this.options.themeColors.red : this.options.themeColors.blue
    });
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = null;
    const allNodes = [this.originNode, ...this.nodes];

    for (let node of allNodes) {
      const nx = node.x * this.canvas.width;
      const ny = node.y * this.canvas.height;
      const dist = Math.hypot(mx - nx, my - ny);

      if (dist < 15) {
        found = node;
        break;
      }
    }

    if (found !== this.hoveredNode) {
      this.hoveredNode = found;
      this.canvas.style.cursor = found ? 'pointer' : 'default';
      if (this.options.onNodeHover) {
        this.options.onNodeHover(found);
      }
    }
  }

  handleMouseClick(e) {
    if (this.hoveredNode && this.options.onNodeClick) {
      this.options.onNodeClick(this.hoveredNode);
    }
  }

  revokeNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.revoked = true;
      node.status = 'blocked';
      // Clear associated active streams
      this.streams = this.streams.filter(s => s.target.id !== nodeId);
      this.updateUI();
    }
  }

  grantNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.revoked = false;
      node.status = 'secure';
      this.createStream(this.originNode, node);
      this.updateUI();
    }
  }

  addLogEntry(nodeData) {
    const id = 'node-' + (this.nodes.length + 1);
    const newNode = {
      id,
      name: nodeData.name || 'External Requester',
      ip: nodeData.ip || '0.0.0.0',
      location: nodeData.location || 'Unknown Location',
      x: nodeData.x || (0.2 + Math.random() * 0.6),
      y: nodeData.y || (0.2 + Math.random() * 0.6),
      status: nodeData.status || 'secure',
      attachment: nodeData.attachment || 'unknown_document.dat',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      attempts: 1,
      revoked: false
    };

    this.nodes.unshift(newNode);
    if (!newNode.revoked) {
      this.createStream(this.originNode, newNode);
    }
    this.updateUI();
  }

  updateUI() {
    // Redraw the standard table listing/metrics if they are bound in the DOM
    const logsContainer = document.getElementById('auditLogsContainer');
    if (logsContainer) {
      logsContainer.innerHTML = this.nodes.map(n => `
        <tr class="border-b border-white/5 bg-black/10 hover:bg-white/5 transition duration-150">
          <td class="p-4 font-mono text-xs text-white">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full ${n.status === 'secure' ? 'bg-prism-green' : n.status === 'warning' ? 'bg-prism-yellow' : 'bg-prism-red'}"></span>
              <span>${n.ip}</span>
            </div>
          </td>
          <td class="p-4 text-xs font-semibold text-white/90">${n.name}</td>
          <td class="p-4 text-xs text-white/60 font-mono">${n.location}</td>
          <td class="p-4 text-xs text-prism-blue font-mono">${n.attachment}</td>
          <td class="p-4 text-xs text-white/40 font-mono">${n.timestamp}</td>
          <td class="p-4 text-right">
            <button onclick="toggleNodeAccess('${n.id}')" class="px-3 py-1 text-[10px] font-mono rounded border transition ${n.revoked ? 'bg-prism-red/20 text-prism-red border-prism-red/30 hover:bg-prism-red/35' : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'}">
              ${n.revoked ? 'REVOKED (UNBLOCK)' : 'REVOKE ACCESS'}
            </button>
          </td>
        </tr>
      `).join('');
    }

    const secureCount = document.getElementById('secureLogsCount');
    if (secureCount) {
      secureCount.textContent = this.nodes.filter(n => n.status === 'secure').length;
    }
    const alertCount = document.getElementById('alertLogsCount');
    if (alertCount) {
      alertCount.textContent = this.nodes.filter(n => n.status === 'warning' || n.status === 'blocked').length;
    }
  }

  // Draw simulated spectral chromatic lines (Prism signature styling)
  drawSpectralLine(x1, y1, x2, y2, progress, baseColor) {
    // We draw slightly offset RGB channels to create physical chromatic aberration
    const offsets = [
      { color: 'rgba(255, 46, 147, 0.45)', dx: -1.5, dy: -1 }, // Pink / Red
      { color: 'rgba(0, 240, 255, 0.65)', dx: 0, dy: 0 },       // Cyan
      { color: 'rgba(0, 255, 137, 0.45)', dx: 1.5, dy: 1 }      // Green
    ];

    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 - 40; // curve arc amplitude

    offsets.forEach(offset => {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.quadraticCurveTo(cx + offset.dx, cy + offset.dy, x2, y2);
      this.ctx.strokeStyle = offset.color;
      this.ctx.lineWidth = offset.dx === 0 ? 1.5 : 1;
      this.ctx.stroke();
    });

    // Drawing the physical transmission wave packet
    if (progress > 0 && progress < 1) {
      // Calculate coordinates on bezier curve
      const t = progress;
      const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
      const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

      this.ctx.shadowColor = baseColor;
      this.ctx.shadowBlur = 12;
      this.ctx.fillStyle = baseColor;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Subtle Cyber-Grid Map Coordinates Layer
    this.ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    this.ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // 2. Render Connection Streams
    this.streams.forEach(stream => {
      const sx = stream.source.x * this.canvas.width;
      const sy = stream.source.y * this.canvas.height;
      const tx = stream.target.x * this.canvas.width;
      const ty = stream.target.y * this.canvas.height;

      this.drawSpectralLine(sx, sy, tx, ty, stream.progress, stream.color);

      // Increment wave progression loop
      stream.progress += stream.speed;
      if (stream.progress > 1) {
        stream.progress = 0;
        // Introduce small random variations to speed for organics
        stream.speed = 0.006 + Math.random() * 0.008;
      }
    });

    // 3. Render Nodes
    const allNodes = [this.originNode, ...this.nodes];
    allNodes.forEach(node => {
      const nx = node.x * this.canvas.width;
      const ny = node.y * this.canvas.height;

      const isHovered = this.hoveredNode && this.hoveredNode.id === node.id;
      
      // Node Pulse Animation
      const pulseSpeed = node.isOrigin ? 0.002 : 0.005;
      const scale = 1 + Math.sin(Date.now() * pulseSpeed) * (isHovered ? 0.35 : 0.15);

      // Pulse ring outer glow
      this.ctx.beginPath();
      this.ctx.arc(nx, ny, (node.isOrigin ? 12 : 8) * scale, 0, Math.PI * 2);
      let ringColor = 'rgba(0, 240, 255, 0.2)';
      if (node.status === 'warning') ringColor = 'rgba(255, 222, 67, 0.2)';
      if (node.status === 'blocked') ringColor = 'rgba(255, 46, 147, 0.2)';
      this.ctx.fillStyle = ringColor;
      this.ctx.fill();

      // Inner core dot
      this.ctx.beginPath();
      this.ctx.arc(nx, ny, node.isOrigin ? 6 : 4, 0, Math.PI * 2);
      let coreColor = this.options.themeColors.blue;
      if (node.status === 'warning') coreColor = this.options.themeColors.yellow;
      if (node.status === 'blocked') coreColor = this.options.themeColors.red;
      this.ctx.fillStyle = coreColor;
      this.ctx.fill();

      // Origin distinctive target cursor
      if (node.isOrigin) {
        this.ctx.strokeStyle = this.options.themeColors.blue;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(nx, ny, 16 * scale, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      // Quick visual tags (IPs/Vault Names)
      if (node.isOrigin || isHovered) {
        this.ctx.font = '9px monospace';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.name, nx, ny - 20);
        this.ctx.fillStyle = node.isOrigin ? this.options.themeColors.blue : 'rgba(255,255,255,0.4)';
        this.ctx.fillText(node.ip || '', nx, ny - 10);
      }
    });

    // 4. Custom Hover Tooltip Window
    if (this.hoveredNode && !this.hoveredNode.isOrigin) {
      const node = this.hoveredNode;
      const tx = node.x * this.canvas.width;
      const ty = node.y * this.canvas.height;

      // Tooltip position offsets
      const tw = 190;
      const th = 110;
      let tpx = tx + 15;
      let tpy = ty - th / 2;

      // Keep inside bounds
      if (tpx + tw > this.canvas.width) tpx = tx - tw - 15;
      if (tpy + th > this.canvas.height) tpy = this.canvas.height - th - 10;
      if (tpy < 10) tpy = 10;

      // Draw Glass Panel
      this.ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
      this.ctx.strokeStyle = node.status === 'blocked' ? this.options.themeColors.red : this.options.themeColors.blue;
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.roundRect(tpx, tpy, tw, th, 8);
      this.ctx.fill();
      this.ctx.stroke();

      // Tooltip Contents
      this.ctx.textAlign = 'left';
      this.ctx.font = 'bold 10px sans-serif';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(node.name, tpx + 12, tpy + 20);

      this.ctx.font = '9px monospace';
      this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
      this.ctx.fillText(`IP: ${node.ip}`, tpx + 12, tpy + 36);
      this.ctx.fillText(`LOC: ${node.location}`, tpx + 12, tpy + 48);
      
      this.ctx.fillStyle = this.options.themeColors.blue;
      this.ctx.fillText(`DOC: ${node.attachment}`, tpx + 12, tpy + 64);
      
      this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
      this.ctx.fillText(`TIME: ${node.timestamp}`, tpx + 12, tpy + 76);

      // Access status badge inside tooltip
      const badgeY = tpy + 90;
      this.ctx.fillStyle = node.status === 'secure' ? 'rgba(0, 255, 135, 0.15)' : 'rgba(255, 46, 147, 0.15)';
      this.ctx.beginPath();
      this.ctx.roundRect(tpx + 12, badgeY - 7, 70, 12, 3);
      this.ctx.fill();

      this.ctx.font = 'bold 8px monospace';
      this.ctx.fillStyle = node.status === 'secure' ? this.options.themeColors.green : this.options.themeColors.red;
      this.ctx.fillText(node.status === 'secure' ? '● ACCESS TRUSTED' : '● EXPIRED/BLOCKED', tpx + 16, badgeY + 2);

      this.ctx.font = '8px monospace';
      this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
      this.ctx.fillText('CLICK TO TOGGLE', tpx + 105, badgeY + 2);
    }

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', () => this.resize());
  }
}

// Global scope initialization helper binding
window.PrismSecurityMap = PrismSecurityMap;