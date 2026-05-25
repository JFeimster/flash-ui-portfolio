const calendarStyles = `
    .calendar-wrapper {
        width: 100%;
        max-width: 1200px;
        margin: 20px auto;
        padding: 0 20px;
        color: var(--text-primary);
    }
    .calendar-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
    }
    .nav-controls {
        display: flex;
        gap: 8px;
    }
    .nav-btn {
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--text-primary);
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .nav-btn:hover { background: var(--surface-hover); }
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: var(--border);
        border: 1px solid var(--border);
        border-radius: 16px;
        overflow: hidden;
    }
    .weekday {
        background: var(--modal-bg);
        padding: 16px;
        text-align: center;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--text-secondary);
        letter-spacing: 0.05em;
    }
    .day-cell {
        background: var(--modal-bg);
        min-height: 120px;
        padding: 12px;
        cursor: pointer;
        transition: background 0.2s;
        position: relative;
    }
    .day-cell:hover { background: var(--surface); }
    .day-cell.today { background: rgba(248, 250, 252, 0.03); }
    .day-cell.other-month { opacity: 0.3; }
    .day-num {
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 8px;
        display: block;
    }
    .event-pill {
        background: var(--surface-hover);
        border-left: 3px solid var(--accent);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-primary);
    }
    .view-tabs {
        display: flex;
        background: var(--surface);
        padding: 4px;
        border-radius: 10px;
        gap: 4px;
    }
    .tab {
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        color: var(--text-secondary);
    }
    .tab.active {
        background: var(--modal-bg);
        color: var(--text-primary);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
`;

class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.view = 'month';
        this.overlay = document.querySelector('.overlay');
        this.modal = document.querySelector('.modal');
        this.init();
    }

    init() {
        this.injectStyles();
        this.createLayout();
        this.render();
        this.bindEvents();
        this.overlay.style.display = 'none';
    }

    injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = calendarStyles;
        document.head.appendChild(styleSheet);
    }

    createLayout() {
        const wrapper = document.createElement('div');
        wrapper.className = 'calendar-wrapper';
        wrapper.innerHTML = `
            <div class="calendar-nav">
                <div>
                    <h1 id="currentMonthDisplay" style="margin:0; font-size: 1.5rem; font-weight: 600;"></h1>
                </div>
                <div class="nav-controls">
                    <div class="view-tabs">
                        <div class="tab" data-view="day">Day</div>
                        <div class="tab" data-view="week">Week</div>
                        <div class="tab active" data-view="month">Month</div>
                    </div>
                    <button class="nav-btn" id="prevBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button class="nav-btn" id="nextBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
            <div id="calendarGrid" class="calendar-grid"></div>
        `;
        document.body.prepend(wrapper);
    }

    render() {
        const grid = document.getElementById('calendarGrid');
        const monthDisplay = document.getElementById('currentMonthDisplay');
        grid.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        monthDisplay.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(this.currentDate);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const el = document.createElement('div');
            el.className = 'weekday';
            el.innerText = day;
            grid.appendChild(el);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        // Previous month padding
        for (let i = firstDay; i > 0; i--) {
            this.createDayCell(prevLastDate - i + 1, true, grid);
        }

        // Current month
        const today = new Date();
        for (let i = 1; i <= lastDate; i++) {
            const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
            this.createDayCell(i, false, grid, isToday);
        }

        // Next month padding
        const totalCells = grid.children.length - 7;
        const remaining = 42 - totalCells;
        for (let i = 1; i <= remaining; i++) {
            this.createDayCell(i, true, grid);
        }
    }

    createDayCell(num, isOther, container, isToday) {
        const cell = document.createElement('div');
        cell.className = `day-cell ${isOther ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
        cell.innerHTML = `<span class="day-num">${num}</span>`;
        
        if (!isOther && num % 7 === 0) {
            cell.innerHTML += `<div class="event-pill">Project Sync</div>`;
        }
        
        cell.onclick = () => this.toggleModal(true);
        container.appendChild(cell);
    }

    toggleModal(show) {
        this.overlay.style.display = show ? 'flex' : 'none';
        if (show) {
            this.modal.style.animation = 'none';
            this.modal.offsetHeight; // trigger reflow
            this.modal.style.animation = null;
        }
    }

    bindEvents() {
        document.getElementById('prevBtn').onclick = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        };

        document.getElementById('nextBtn').onclick = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        };

        document.querySelectorAll('.tab').forEach(tab => {
            tab.onclick = (e) => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.view = e.target.dataset.view;
                this.render();
            };
        });

        // Close modal handlers
        document.querySelector('.btn-secondary').onclick = () => this.toggleModal(false);
        document.querySelector('.btn-primary').onclick = () => this.toggleModal(false);
        
        this.overlay.onclick = (e) => {
            if (e.target === this.overlay) this.toggleModal(false);
        };

        const timeChips = document.querySelectorAll('.time-chip');
        timeChips.forEach(chip => {
            chip.onclick = () => {
                timeChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            };
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CalendarApp();
});