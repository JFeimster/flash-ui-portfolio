/**
 * js/dashboard.js
 * Logic for the Meeting Dashboard Hub and Scheduling Component
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dashboard State
    const state = {
        meetings: [
            { id: 1, title: 'Weekly Sprint Sync', time: '10:30 AM', duration: '45m', type: 'Engineering', avatars: 3 },
            { id: 2, title: 'Product Discovery', time: '01:00 PM', duration: '60m', type: 'Design', avatars: 5 },
            { id: 3, title: 'Client Onboarding', time: '04:00 PM', duration: '30m', type: 'Sales', avatars: 2 }
        ],
        selectedTime: '13:00'
    };

    // DOM Selectors
    const modalOverlay = document.querySelector('.overlay');
    const timeChips = document.querySelectorAll('.time-chip');
    const confirmBtn = document.querySelector('.btn-primary');
    const discardBtn = document.querySelector('.btn-secondary');
    const addParticipantBtn = document.querySelector('.add-btn');

    /**
     * Modal Visibility Controls
     */
    const toggleModal = (show) => {
        if (!modalOverlay) return;
        
        if (show) {
            modalOverlay.style.display = 'flex';
            modalOverlay.style.opacity = '0';
            setTimeout(() => {
                modalOverlay.style.opacity = '1';
                modalOverlay.style.transition = 'opacity 0.2s ease';
            }, 10);
        } else {
            modalOverlay.style.opacity = '0';
            setTimeout(() => {
                modalOverlay.style.display = 'none';
            }, 200);
        }
    };

    /**
     * Dashboard Feed Interaction
     * Generates and manages the "hub" cards based on state
     */
    const initDashboardFeed = () => {
        const feedContainer = document.getElementById('dashboard-feed');
        if (!feedContainer) return;

        feedContainer.innerHTML = state.meetings.map(meeting => `
            <div class="meeting-card" style="
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 16px;
                padding: 24px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                        <span style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">${meeting.type}</span>
                        <h3 style="margin: 4px 0 0; color: var(--text-primary); font-size: 1.1rem; font-weight: 600;">${meeting.title}</h3>
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 500;">
                        ${meeting.time}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="avatar-group">
                        ${Array(Math.min(meeting.avatars, 3)).fill(0).map((_, i) => `
                            <div class="avatar" style="width: 24px; height: 24px; border-width: 1.5px;">
                                <img src="https://i.pravatar.cc/150?u=${meeting.id}${i}" alt="User">
                            </div>
                        `).join('')}
                        ${meeting.avatars > 3 ? `<div class="avatar" style="width: 24px; height: 24px; font-size: 0.6rem; border-width: 1.5px; background: var(--surface-hover);">+${meeting.avatars - 3}</div>` : ''}
                    </div>
                    <span style="color: var(--text-secondary); font-size: 0.75rem;">${meeting.duration}</span>
                </div>
            </div>
        `).join('');

        // Add hover effects via JS to maintain clean card logic
        const cards = feedContainer.querySelectorAll('.meeting-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.borderColor = 'var(--text-secondary)';
                card.style.background = 'var(--surface-hover)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.borderColor = 'var(--border)';
                card.style.background = 'var(--surface)';
            });
        });
    };

    /**
     * Modal Event Listeners
     */
    
    // Time Chip selection
    timeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            timeChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.selectedTime = chip.innerText;
        });
    });

    // Confirm button animation and logic
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            confirmBtn.style.opacity = '0.6';
            confirmBtn.innerText = 'Scheduling...';
            
            setTimeout(() => {
                console.log('Meeting Scheduled:', {
                    time: state.selectedTime,
                    date: document.querySelector('.input-pill span')?.innerText
                });
                toggleModal(false);
                confirmBtn.style.opacity = '1';
                confirmBtn.innerText = 'Confirm Meeting';
            }, 800);
        });
    }

    // Modal close triggers
    if (discardBtn) discardBtn.addEventListener('click', () => toggleModal(false));
    
    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) toggleModal(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleModal(false);
    });

    // Handle "Add Participant" button animation
    if (addParticipantBtn) {
        addParticipantBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addParticipantBtn.style.transform = 'scale(0.9)';
            setTimeout(() => addParticipantBtn.style.transform = 'scale(1)', 100);
        });
    }

    /**
     * Initialization
     */
    initDashboardFeed();

    // Export toggle for external dashboard buttons
    window.openScheduleModal = () => toggleModal(true);
});