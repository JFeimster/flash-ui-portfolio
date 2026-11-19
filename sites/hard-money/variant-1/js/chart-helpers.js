const CyberChartEngine = {
    // High-DPI canvas setup with correct device pixel ratio scaling
    setupCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Match element's display size
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        // Scale buffer for razor-sharp rendering on high-res displays
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        return { ctx, width: rect.width, height: rect.height, dpr };
    },

    // 1. NEON STORAGE DONUT CHART
    renderStorageDonut(canvasId, datasets) {
        const setup = this.setupCanvas(canvasId);
        if (!setup) return;
        const { ctx, width, height } = setup;

        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.min(width, height) * 0.4;
        const innerRadius = outerRadius * 0.72;

        const totalValue = datasets.reduce((sum, item) => sum + item.value, 0);
        let startAngle = -Math.PI / 2; // Start from top 12 o'clock

        // Clear view area
        ctx.clearRect(0, 0, width, height);

        // Draw segmented arcs
        datasets.forEach((segment) => {
            const sliceAngle = (segment.value / totalValue) * (Math.PI * 2);
            const endAngle = startAngle + sliceAngle;

            // Draw shadow glow for active segments
            if (segment.color !== '#1e293b') {
                ctx.save();
                ctx.shadowBlur = 15;
                ctx.shadowColor = segment.color;
                ctx.strokeStyle = segment.color;
                ctx.lineWidth = outerRadius - innerRadius;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.arc(centerX, centerY, (outerRadius + innerRadius) / 2, startAngle + 0.05, endAngle - 0.05);
                ctx.stroke();
                ctx.restore();
            }

            // Draw core segment solid color
            ctx.beginPath();
            ctx.arc(centerX, centerY, (outerRadius + innerRadius) / 2, startAngle + 0.04, endAngle - 0.04);
            ctx.strokeStyle = segment.color;
            ctx.lineWidth = outerRadius - innerRadius;
            ctx.lineCap = 'round';
            ctx.stroke();

            startAngle = endAngle;
        });

        // Add Center telemetry text HUD
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Percentage readout
        const firstActive = datasets[0] ? Math.round((datasets[0].value / totalValue) * 100) : 0;
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f0ff';
        ctx.fillText(`${firstActive}%`, centerX, centerY - 8);
        ctx.shadowBlur = 0;

        // Label readout
        ctx.font = '700 8px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('STABILIZED YIELD', centerX, centerY + 14);
    },

    // 2. INTERACTIVE CYBERNETIC LINE CHART
    renderActivityLine(canvasId, labels, dataPoints, options = {}) {
        const setup = this.setupCanvas(canvasId);
        if (!setup) return;
        const { ctx, width, height } = setup;

        const canvas = document.getElementById(canvasId);
        const padding = { top: 30, right: 20, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxVal = Math.max(...dataPoints, 100) * 1.15;
        const minVal = 0;

        // Interactive mouse state tracking
        if (!canvas.dataset.listenerInitialized) {
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                // Track matching x node projection
                const colWidth = chartWidth / (dataPoints.length - 1);
                let activeIdx = Math.round((mouseX - padding.left) / colWidth);
                activeIdx = Math.max(0, Math.min(dataPoints.length - 1, activeIdx));
                
                canvas.setAttribute('data-active-index', activeIdx);
                this.renderActivityLine(canvasId, labels, dataPoints, options);
            });

            canvas.addEventListener('mouseleave', () => {
                canvas.removeAttribute('data-active-index');
                this.renderActivityLine(canvasId, labels, dataPoints, options);
            });
            canvas.dataset.listenerInitialized = 'true';
        }

        const activeIndexStr = canvas.getAttribute('data-active-index');
        const activeIdx = activeIndexStr !== null ? parseInt(activeIndexStr, 10) : null;

        ctx.clearRect(0, 0, width, height);

        // Draw Matrix telemetry grid lines
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        const gridRows = 4;
        for (let i = 0; i <= gridRows; i++) {
            const y = padding.top + (chartHeight / gridRows) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            // Label generation
            const labelVal = Math.round(maxVal - ((maxVal - minVal) / gridRows) * i);
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#475569';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelVal >= 1000 ? `${(labelVal / 1000).toFixed(1)}M` : labelVal, padding.left - 12, y);
        }

        // Project coordinate math helpers
        const getX = (index) => padding.left + (chartWidth / (dataPoints.length - 1)) * index;
        const getY = (val) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

        // Generate glowing vector path
        ctx.beginPath();
        for (let i = 0; i < dataPoints.length; i++) {
            const x = getX(i);
            const y = getY(dataPoints[i]);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                // Smooth bezier control mapping
                const prevX = getX(i - 1);
                const prevY = getY(dataPoints[i - 1]);
                ctx.bezierCurveTo((prevX + x) / 2, prevY, (prevX + x) / 2, y, x, y);
            }
        }

        // Draw bottom gradient area drop under curve
        ctx.save();
        const areaGlow = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        areaGlow.addColorStop(0, 'rgba(0, 240, 255, 0.15)');
        areaGlow.addColorStop(1, 'rgba(189, 0, 255, 0)');
        ctx.lineTo(getX(dataPoints.length - 1), padding.top + chartHeight);
        ctx.lineTo(getX(0), padding.top + chartHeight);
        ctx.closePath();
        ctx.fillStyle = areaGlow;
        ctx.fill();
        ctx.restore();

        // Draw primary line stroke with bright cyber accent
        ctx.save();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f0ff';
        ctx.beginPath();
        for (let i = 0; i < dataPoints.length; i++) {
            const x = getX(i);
            const y = getY(dataPoints[i]);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = getX(i - 1);
                const prevY = getY(dataPoints[i - 1]);
                ctx.bezierCurveTo((prevX + x) / 2, prevY, (prevX + x) / 2, y, x, y);
            }
        }
        ctx.stroke();
        ctx.restore();

        // Build horizontal timeline label ticks
        dataPoints.forEach((val, i) => {
            const x = getX(i);
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = activeIdx === i ? '#00f0ff' : '#475569';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], x, padding.top + chartHeight + 20);

            // Inactive mini markers on line
            ctx.beginPath();
            ctx.arc(x, getY(val), 3, 0, Math.PI * 2);
            ctx.fillStyle = '#07090e';
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.5;
            ctx.fill();
            ctx.stroke();
        });

        // Draw Interactive Crosshair & HUD Overlay
        if (activeIdx !== null && activeIdx >= 0 && activeIdx < dataPoints.length) {
            const activeX = getX(activeIdx);
            const activeY = getY(dataPoints[activeIdx]);

            // Draw laser line guide
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(activeX, padding.top);
            ctx.lineTo(activeX, padding.top + chartHeight);
            ctx.stroke();
            ctx.setLineDash([]);

            // Primary tracking target element
            ctx.save();
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#bd00ff';
            ctx.beginPath();
            ctx.arc(activeX, activeY, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = '#bd00ff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Telemetry popup context box
            const boxW = 85;
            const boxH = 34;
            let boxX = activeX + 12;
            let boxY = activeY - 40;

            // Constrain box boundaries within canvas viewport limits
            if (boxX + boxW > width) boxX = activeX - boxW - 12;
            if (boxY < 5) boxY = activeY + 12;

            ctx.fillStyle = '#0e131f';
            ctx.strokeStyle = '#bd00ff';
            ctx.lineWidth = 1.5;
            ctx.fillRect(boxX, boxY, boxW, boxH);
            ctx.strokeRect(boxX, boxY, boxW, boxH);

            // Render value data string
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#cbd5e1';
            ctx.textAlign = 'left';
            ctx.fillText(`VAL: $${dataPoints[activeIdx].toLocaleString()}`, boxX + 6, boxY + 14);

            ctx.font = '8px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText(`INDEX: ${labels[activeIdx]}`, boxX + 6, boxY + 25);
        }
    },

    // 3. SECURED STACKED PIPELINE PROGRESS
    renderReviewProgress(canvasId, datasets) {
        const setup = this.setupCanvas(canvasId);
        if (!setup) return;
        const { ctx, width, height } = setup;

        const barH = 16;
        const barY = height / 2 - barH / 2;
        const total = datasets.reduce((sum, d) => sum + d.value, 0);

        ctx.clearRect(0, 0, width, height);

        // Draw structural dark rail track
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(0, barY, width, barH, 4);
        ctx.fill();

        let currentX = 0;

        datasets.forEach((dataset) => {
            const segmentW = (dataset.value / total) * width;
            if (segmentW <= 0) return;

            // Glow treatment on status segments
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = dataset.color;
            ctx.fillStyle = dataset.color;
            ctx.beginPath();
            ctx.roundRect(currentX, barY, segmentW, barH, 2);
            ctx.fill();
            ctx.restore();

            // Core solid fill pass
            ctx.fillStyle = dataset.color;
            ctx.beginPath();
            ctx.roundRect(currentX, barY, segmentW, barH, 2);
            ctx.fill();

            currentX += segmentW;
        });

        // Render micro percentage diagnostics text values underneath
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`TOTAL ENVELOPE VALUE: ${total} PACKETS`, 0, barY + barH + 18);
    }
};