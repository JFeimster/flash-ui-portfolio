document.addEventListener('DOMContentLoaded', () => {
    /**
     * Meeting Dashboard & Modal Controller
     * Handles the scheduling flow and dashboard interactions
     */

    const elements = {
        overlay: document.querySelector('.overlay'),
        modal: document.querySelector('.modal'),
        timeChips: document.querySelectorAll('.time-chip'),
        confirmBtn: document.querySelector('.btn-primary'),
        discardBtn: document.querySelector('.btn-secondary'),
        addParticipantBtn: document.querySelector('.add-btn'),
        datePicker: document.querySelector('.input-pill')
    };

    // State management
    const state = {
        selectedTime: '13:00',
        selectedDate: 'October 24, 2023',
        isSubmitting: false
    };

    /**
     * Initialize Time Selection
     */
    const initTimeSelection = () => {
        elements.timeChips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (state.isSubmitting) return;

                // Update UI
                elements.timeChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                // Update State
                state.selectedTime = chip.textContent;
                
                // Haptic-like feedback effect
                chip.style.transform = 'scale(0.95)';
                setTimeout(() => chip.style.transform = 'scale(1)', 100);
            });
        });
    };

    /**
     * Handle Modal Close
     */
    const closeModal = () => {
        if (state.isSubmitting) return;

        elements.overlay.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.3s';
        elements.modal.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s';
        
        elements.overlay.style.opacity = '0';
        elements.overlay.style.backdropFilter = 'blur(0px)';
        elements.modal.style.transform = 'translateY(20px) scale(0.95)';

        setTimeout(() => {
            elements.overlay.style.display = 'none';
            // In a real app, we might reset the form or redirect to the dashboard view
        }, 300);
    };

    /**
     * Handle Meeting Confirmation
     */
    const handleConfirm = async () => {
        if (state.isSubmitting) return;

        state.isSubmitting = true;
        const originalText = elements.confirmBtn.textContent;
        
        // UI Loading State
        elements.confirmBtn.style.width = `${elements.confirmBtn.offsetWidth}px`;
        elements.confirmBtn.innerHTML = `<span style="opacity: 0.7">Scheduling...</span>`;
        elements.confirmBtn.style.opacity = '0.8';
        elements.confirmBtn.style.cursor = 'not-allowed';
        elements.discardBtn.style.opacity = '0.5';
        elements.discardBtn.style.cursor = 'not-allowed';

        // Simulate Network Request
        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            
            // Success State
            elements.confirmBtn.innerHTML = `✓ Scheduled`;
            elements.confirmBtn.style.background = '#10b981';
            elements.confirmBtn.style.color = '#ffffff';

            setTimeout(() => {
                closeModal();
                // Reset for future use
                setTimeout(() => {
                    state.isSubmitting = false;
                    elements.confirmBtn.textContent = originalText;
                    elements.confirmBtn.style = '';
                    elements.discardBtn.style = '';
                }, 500);
            }, 800);

        } catch (error) {
            console.error('Failed to schedule meeting:', error);
            state.isSubmitting = false;
            elements.confirmBtn.textContent = 'Try Again';
        }
    };

    /**
     * Event Listeners
     */
    const initEvents = () => {
        // Confirm action
        elements.confirmBtn?.addEventListener('click', handleConfirm);

        // Discard action
        elements.discardBtn?.addEventListener('click', closeModal);

        // Click outside modal to close
        elements.overlay?.addEventListener('click', (e) => {
            if (e.target === elements.overlay) closeModal();
        });

        // Add participant interaction
        elements.addParticipantBtn?.addEventListener('click', () => {
            console.log('Dashboard: Opening participant directory...');
            // Logic to expand list or show searchable dropdown
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.overlay.style.display !== 'none') {
                closeModal();
            }
        });

        // Date picker interaction
        elements.datePicker?.addEventListener('click', () => {
            console.log('Dashboard: Triggering native/custom date selection');
        });
    };

    // Execute initialization
    initTimeSelection();
    initEvents();

    /**
     * Dashboard Integration helper
     * In a full implementation, this would populate the "Meeting Feed"
     */
    window.scheduleNewMeeting = () => {
        elements.overlay.style.display = 'flex';
        elements.overlay.style.opacity = '1';
        elements.overlay.style.backdropFilter = 'blur(12px)';
        elements.modal.style.transform = 'translateY(0) scale(1)';
    };
});