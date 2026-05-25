/**
 * js/search-filter.js
 * Purpose: Manages the Team Directory UI, search filtering, and modal integration.
 */

(function() {
    // 1. Injected Styles for the Team Directory
    const styles = `
        .directory-container {
            width: 100%;
            max-width: 1000px;
            margin: 40px auto;
            padding: 0 20px;
            color: var(--text-primary);
        }

        .directory-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            gap: 20px;
            flex-wrap: wrap;
        }

        .search-wrapper {
            position: relative;
            flex: 1;
            max-width: 400px;
        }

        .search-input {
            width: 100%;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px 16px 12px 44px;
            color: var(--text-primary);
            font-family: inherit;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s;
        }

        .search-input:focus {
            border-color: var(--text-secondary);
        }

        .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            pointer-events: none;
        }

        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }

        .profile-card {
            background: var(--modal-bg);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: transform 0.2s, border-color 0.2s;
        }

        .profile-card:hover {
            transform: translateY(-4px);
            border-color: var(--text-secondary);
        }

        .profile-avatar-wrapper {
            position: relative;
            margin-bottom: 16px;
        }

        .profile-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--surface);
        }

        .status-indicator {
            position: absolute;
            bottom: 4px;
            right: 4px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid var(--modal-bg);
        }

        .status-active { background: #10b981; }
        .status-busy { background: #f59e0b; }
        .status-away { background: #64748b; }

        .profile-name {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 4px 0;
        }

        .profile-role {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-bottom: 20px;
        }

        .schedule-btn {
            width: 100%;
            background: var(--surface);
            color: var(--text-primary);
            border: 1px solid var(--border);
            padding: 10px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .schedule-btn:hover {
            background: var(--text-primary);
            color: var(--accent-text);
        }

        /* Hide modal by default for directory view */
        .overlay { display: none; }
        .overlay.active { display: flex; }
    `;

    // 2. Mock Data
    const teamMembers = [
        { id: 1, name: "Sarah Jenkins", role: "Lead Designer", status: "active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
        { id: 2, name: "Michael Chen", role: "Senior Developer", status: "busy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
        { id: 3, name: "Elena Rodriguez", role: "Product Manager", status: "active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80" },
        { id: 4, name: "David Kim", role: "UX Researcher", status: "away", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80" },
        { id: 5, name: "Aisha Taylor", role: "QA Engineer", status: "active", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&h=120&q=80" },
        { id: 6, name: "James Wilson", role: "DevOps", status: "busy", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80" }
    ];

    // 3. Logic
    function init() {
        // Inject Styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Create Container
        const container = document.createElement('div');
        container.className = 'directory-container';
        container.innerHTML = `
            <div class="directory-header">
                <div class="search-wrapper">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" class="search-input" placeholder="Search team members...">
                </div>
            </div>
            <div class="team-grid" id="teamGrid"></div>
        `;

        document.body.prepend(container);

        const teamGrid = document.getElementById('teamGrid');
        const searchInput = container.querySelector('.search-input');
        const modal = document.querySelector('.overlay');
        const discardBtn = document.querySelector('.btn-secondary');

        // Render Cards
        function renderTeam(filter = "") {
            teamGrid.innerHTML = '';
            const filtered = teamMembers.filter(m => 
                m.name.toLowerCase().includes(filter.toLowerCase()) || 
                m.role.toLowerCase().includes(filter.toLowerCase())
            );

            filtered.forEach(member => {
                const card = document.createElement('div');
                card.className = 'profile-card';
                card.innerHTML = `
                    <div class="profile-avatar-wrapper">
                        <img src="${member.avatar}" class="profile-avatar" alt="${member.name}">
                        <div class="status-indicator status-${member.status}"></div>
                    </div>
                    <h3 class="profile-name">${member.name}</h3>
                    <p class="profile-role">${member.role}</p>
                    <button class="schedule-btn" data-id="${member.id}">Schedule Session</button>
                `;
                teamGrid.appendChild(card);
            });
        }

        // Pre-fill Modal
        function openScheduleModal(memberId) {
            const member = teamMembers.find(m => m.id == memberId);
            const avatarGroup = document.querySelector('.avatar-group');
            
            // Add member to the start of the avatar group
            const newAvatar = document.createElement('div');
            newAvatar.className = 'avatar temp-invitee';
            newAvatar.innerHTML = `<img src="${member.avatar}" alt="${member.name}">`;
            
            // Insert before the first child
            avatarGroup.insertBefore(newAvatar, avatarGroup.firstChild);

            modal.classList.add('active');
        }

        // Event Listeners
        searchInput.addEventListener('input', (e) => renderTeam(e.target.value));

        teamGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('schedule-btn')) {
                openScheduleModal(e.target.dataset.id);
            }
        });

        discardBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            // Clean up temporary invitees
            document.querySelectorAll('.temp-invitee').forEach(el => el.remove());
        });

        // Initial Render
        renderTeam();
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();