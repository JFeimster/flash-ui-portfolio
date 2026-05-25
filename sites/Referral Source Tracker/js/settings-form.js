/**
 * Availability & Preferences Settings
 * This script handles the interaction and state for defining standard working hours,
 * time zones, and buffer times, matching the design system of the scheduling component.
 */

(function() {
    const state = {
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        timezone: 'Pacific Time (UTC-8)',
        buffer: 15
    };

    const init = () => {
        const modal = document.querySelector('.modal');
        if (!modal) return;

        // Transition content to Settings Form
        renderSettings(modal);
        attachEvents(modal);
    };

    const renderSettings = (container) => {
        container.innerHTML = `
            <div class="header">
                <h2>Availability & Preferences</h2>
                <p>Configure your standard hours and buffer times for automated slot generation.</p>
            </div>

            <div class="section">
                <span class="label">Standard Work Week</span>
                <div class="time-grid" style="grid-template-columns: repeat(7, 1fr);">
                    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                        <div class="time-chip day-pill ${state.workingDays.includes(day) ? 'active' : ''}" data-day="${day}">
                            ${day.substring(0, 3)}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <span class="label">Working Hours</span>
                <div class="input-row">
                    <div class="input-pill">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>${state.startTime}</span>
                    </div>
                    <div class="input-pill">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>${state.endTime}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <span class="label">Default Time Zone</span>
                <div class="input-pill" style="width: 100%;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    <span>${state.timezone}</span>
                </div>
            </div>

            <div class="section">
                <span class="label">Meeting Buffer (Minutes)</span>
                <div class="time-grid">
                    ${[0, 15, 30, 45].map(min => `
                        <div class="time-chip buffer-pill ${state.buffer === min ? 'active' : ''}" data-buffer="${min}">
                            ${min === 0 ? 'None' : min + 'm'}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="footer">
                <button class="btn btn-secondary" onclick="window.location.reload()">Discard</button>
                <button class="btn btn-primary" id="save-settings">Update Preferences</button>
            </div>
        `;
    };

    const attachEvents = (container) => {
        // Toggle Working Days
        container.querySelectorAll('.day-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const day = pill.dataset.day;
                pill.classList.toggle('active');
                if (state.workingDays.includes(day)) {
                    state.workingDays = state.workingDays.filter(d => d !== day);
                } else {
                    state.workingDays.push(day);
                }
            });
        });

        // Select Buffer
        container.querySelectorAll('.buffer-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                container.querySelectorAll('.buffer-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state.buffer = parseInt(pill.dataset.buffer);
            });
        });

        // Save Animation
        const saveBtn = container.querySelector('#save-settings');
        saveBtn.addEventListener('click', () => {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Saving...';
            saveBtn.disabled = true;
            saveBtn.style.opacity = '0.7';

            setTimeout(() => {
                saveBtn.textContent = 'Settings Applied';
                saveBtn.style.background = '#10b981';
                saveBtn.style.color = '#fff';
                saveBtn.style.opacity = '1';

                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.background = 'var(--accent)';
                    saveBtn.style.color = 'var(--accent-text)';
                    saveBtn.disabled = false;
                }, 2000);
            }, 800);
        });
    };

    // Auto-initialize if a trigger exists or for demonstration
    document.addEventListener('DOMContentLoaded', () => {
        // In a real app, this might be triggered by a "Settings" link
        // For this static component addition, we attach it to a global window method
        window.loadAvailabilitySettings = init;
    });
})();