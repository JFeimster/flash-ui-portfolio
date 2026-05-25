const leadershipData = [
    {
        id: "MB-001",
        title: "Extreme Ownership of the Void",
        objective: "Maintain operational integrity when communication lines fail and the 'Plan' evaporates.",
        execution: "Leadership isn't about the script; it's about the silence between the lines. When the shit hits the fan, you don't find your character; you fall to the level of your training.",
        status: "OPERATIONAL",
        priority: "CRITICAL"
    },
    {
        id: "MB-002",
        title: "The Decisive Decentralization",
        objective: "Empower ground-level assets to execute intent without waiting for bureaucratic permission.",
        execution: "If you have to ask for permission to save the mission, you've already lost. Trust your team with the 'Why' and let them figure out the 'How'.",
        status: "DELEGATED",
        priority: "HIGH"
    },
    {
        id: "MB-003",
        title: "Violence of Action in Voids",
        objective: "Overcome analysis paralysis in high-stakes entrepreneurial environments.",
        execution: "A mediocre plan executed with 100% conviction beats a perfect plan executed with 10% doubt. In the gap between thought and action, the enemy wins.",
        status: "ACTIVE",
        priority: "IMMEDIATE"
    },
    {
        id: "MB-004",
        title: "Logistics of Loyalty",
        objective: "Securing the long-term commitment of high-value personnel.",
        execution: "Loyalty is a two-way supply chain. If you aren't providing the emotional and tactical ammunition your squad needs, don't be surprised when they run out of fire for you.",
        status: "REDACTED",
        priority: "CORE"
    }
];

function createWarRoomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .war-room-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }

        .mission-brief-card {
            background: #fdfdfd;
            border: 1px solid #333;
            padding: 30px;
            position: relative;
            box-shadow: 5px 5px 0px var(--olive-dark);
            font-family: 'Courier Prime', monospace;
        }

        .mission-brief-card::after {
            content: "UNCLASSIFIED // FOR SQUAD EYES ONLY";
            position: absolute;
            bottom: 10px;
            right: 15px;
            font-size: 0.6rem;
            opacity: 0.4;
            letter-spacing: 1px;
        }

        .brief-header {
            border-bottom: 2px solid var(--ink);
            margin-bottom: 15px;
            padding-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .brief-id {
            font-family: 'Special Elite', cursive;
            background: var(--ink);
            color: var(--paper);
            padding: 2px 8px;
            font-size: 0.9rem;
        }

        .brief-priority {
            color: var(--stamp-red);
            font-weight: bold;
            font-size: 0.8rem;
            text-transform: uppercase;
        }

        .brief-title {
            font-family: 'Roboto Slab', serif;
            font-weight: 900;
            font-size: 1.3rem;
            text-transform: uppercase;
            margin-bottom: 15px;
            color: var(--olive-dark);
        }

        .brief-label {
            font-weight: bold;
            text-decoration: underline;
            margin-right: 5px;
            font-size: 0.85rem;
        }

        .brief-content {
            font-size: 0.95rem;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .status-stamp {
            display: inline-block;
            border: 2px solid var(--stamp-red);
            color: var(--stamp-red);
            padding: 2px 10px;
            font-family: 'Special Elite', cursive;
            font-size: 0.8rem;
            transform: rotate(-5deg);
            margin-top: 10px;
            opacity: 0.8;
        }

        @media (max-width: 600px) {
            .war-room-grid { grid-template-columns: 1fr; }
        }
    `;
    document.head.appendChild(style);
}

function renderWarRoom() {
    const container = document.querySelector('.dossier-container');
    if (!container) return;

    const warRoomSection = document.createElement('section');
    warRoomSection.id = 'war-room';
    warRoomSection.innerHTML = `
        <h2 class="section-title">The War Room</h2>
        <p style="margin-bottom: 30px; max-width: 800px; font-style: italic;">
            Strategic intel for leadership and entrepreneurship. These aren't suggestions; they're tactical mandates for surviving the corporate and creative trenches.
        </p>
        <div class="war-room-grid" id="briefs-target"></div>
    `;

    // Insert before the subscribe section or at the end
    const subscribeSection = document.querySelector('.subscribe-section');
    if (subscribeSection) {
        container.insertBefore(warRoomSection, subscribeSection);
    } else {
        container.appendChild(warRoomSection);
    }

    const target = document.getElementById('briefs-target');
    leadershipData.forEach(brief => {
        const card = document.createElement('div');
        card.className = 'mission-brief-card';
        card.innerHTML = `
            <div class="brief-header">
                <span class="brief-id">${brief.id}</span>
                <span class="brief-priority">PRIORITY: ${brief.priority}</span>
            </div>
            <h3 class="brief-title">${brief.title}</h3>
            <div class="brief-content">
                <span class="brief-label">OBJECTIVE:</span> ${brief.objective}
            </div>
            <div class="brief-content">
                <span class="brief-label">EXECUTION:</span> ${brief.execution}
            </div>
            <div class="status-stamp">${brief.status}</div>
        `;
        target.appendChild(card);
    });
}

// Initialize components
createWarRoomStyles();
document.addEventListener('DOMContentLoaded', renderWarRoom);