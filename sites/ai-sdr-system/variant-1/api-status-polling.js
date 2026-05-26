/**
 * api-status-polling.js
 * Carbon Kinetic | AI SDR Engine
 * Handles real-time polling simulation, status monitoring, and UI updates for the Integration Hub.
 */

const KINETIC_HUB = {
    services: [
        { id: 'openai', name: 'OpenAI GPT-4o', status: 'active', latency: '142ms' },
        { id: 'gemini', name: 'Google Gemini 1.5', status: 'active', latency: '98ms' },
        { id: 'notion', name: 'Notion DB', status: 'active', latency: '45ms' },
        { id: 'gmail', name: 'Gmail API', status: 'active', latency: '32ms' },
        { id: 'appsscript', name: 'Apps Script Runtime', status: 'standby', latency: '0ms' }
    ],

    init() {
        this.logContainer = document.querySelector('.log-window');
        this.statsValues = document.querySelectorAll('.stat-val');
        this.statusDots = document.querySelectorAll('.status-dot');
        this.latencyDisplay = Array.from(document.querySelectorAll('span'))
            .find(el => el.textContent.includes('Lat:'));

        this.startPolling();
        this.bindEvents();
        this.addLog('HUB', 'Centralized API Monitor initialized.', 'success');
    },

    addLog(tag, msg, type = 'info') {
        if (!this.logContainer) return;

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        let color = 'var(--accent)';
        if (type === 'success') color = 'var(--success)';
        if (type === 'error') color = '#ff4444';

        entry.innerHTML = `
            <span class="ts">[${timeStr}]</span>
            <span class="tag" style="color: ${color}">${tag}</span>
            <span class="msg">${msg}</span>
        `;

        this.logContainer.prepend(entry);
        
        if (this.logContainer.children.length > 25) {
            this.logContainer.lastElementChild.remove();
        }
    },

    updateLatency() {
        if (this.latencyDisplay) {
            const ms = Math.floor(Math.random() * (32 - 18 + 1)) + 18;
            this.latencyDisplay.textContent = `Lat: ${ms}ms`;
        }
    },

    updateStats() {
        this.statsValues.forEach(stat => {
            if (stat.textContent.includes('%')) {
                let val = parseFloat(stat.textContent);
                val += (Math.random() - 0.5) * 0.2;
                stat.textContent = val.toFixed(1) + '%';
            } else if (stat.textContent.includes('$')) {
                let val = parseFloat(stat.textContent.replace('$', '').replace('k', ''));
                val += Math.random() * 0.01;
                stat.textContent = '$' + val.toFixed(1) + 'k';
            }
        });
    },

    checkServiceStatus() {
        const service = this.services[Math.floor(Math.random() * this.services.length)];
        const isHealthy = Math.random() > 0.05;

        if (!isHealthy) {
            this.addLog(service.id.toUpperCase(), `Heartbeat timeout for ${service.name}. Attempting reconnection...`, 'error');
            setTimeout(() => {
                this.addLog(service.id.toUpperCase(), `Connection re-established via US-EAST-1 tunnel.`, 'success');
            }, 3000);
        } else if (Math.random() > 0.7) {
            this.addLog(service.id.toUpperCase(), `Syncing schema for ${service.name}... 0 errors detected.`, 'info');
        }
    },

    startPolling() {
        // High frequency UI updates
        setInterval(() => this.updateLatency(), 2000);
        
        // Medium frequency stats updates
        setInterval(() => this.updateStats(), 4500);

        // Low frequency service health checks
        setInterval(() => this.checkServiceStatus(), 8000);
    },

    bindEvents() {
        // Interaction listener for icons to simulate "Test Connection"
        const icons = document.querySelectorAll('.int-icon');
        icons.forEach(icon => {
            icon.addEventListener('click', () => {
                const name = icon.getAttribute('title') || 'API';
                icon.style.transform = 'scale(1.2)';
                this.addLog('AUTH', `Manual re-authentication triggered for ${name}...`, 'info');
                
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                    this.addLog('AUTH', `Session verified. Token expires in 3599s.`, 'success');
                }, 800);
            });
            icon.style.cursor = 'pointer';
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => KINETIC_HUB.init());