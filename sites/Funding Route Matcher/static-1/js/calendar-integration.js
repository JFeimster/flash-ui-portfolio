/**
 * calendar-integration.js
 * Part of the Strategic Advisor Booking Page
 * Dynamically handles advisor assignment and booking interactions based on Route Engine results.
 */

const ADVISOR_ROSTER = {
    'real-estate': {
        name: "Sarah Chen",
        title: "Real Estate Asset Specialist",
        bio: "Expert in bridge loans and multi-family portfolio restructuring with over 12 years in private equity.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
        specialty: "Asset-Based Lending"
    },
    'ecommerce': {
        name: "Marcus Thorne",
        title: "E-commerce Growth Architect",
        bio: "Specializes in revenue-based financing and supply chain capital for high-velocity DTC brands.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
        specialty: "Revenue Velocity"
    },
    'equipment': {
        name: "Jake Miller",
        title: "Equipment & Logistics Lead",
        bio: "Focused on heavy machinery leasing and fleet expansion strategies for transport and construction.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
        specialty: "Lease/Purchase Logic"
    },
    'micro-funding': {
        name: "Elena Rodriguez",
        title: "Micro-Capital Strategist",
        bio: "Dedicated to helping solopreneurs and gig-economy businesses scale from seed to operational maturity.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300",
        specialty: "Gig & Solo Ops"
    },
    'credit-prep': {
        name: "David Vance",
        title: "Entity & Credit Consultant",
        bio: "Specialist in business credit building and entity structuring to maximize future fundability.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300",
        specialty: "Fundability Rebuild"
    },
    'working-capital': {
        name: "Michael Scott",
        title: "Senior Capital Strategist",
        bio: "General business funding expert specializing in working capital and mid-term growth debt.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
        specialty: "Standard Ops Funding"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const routeKey = urlParams.get('route') || 'working-capital';
    const advisor = ADVISOR_ROSTER[routeKey] || ADVISOR_ROSTER['working-capital'];

    populateAdvisorUI(advisor);
    generateBookingGrid();
    setupEventListeners();
});

function populateAdvisorUI(advisor) {
    const nameEl = document.getElementById('advisor-name');
    const titleEl = document.getElementById('advisor-title');
    const bioEl = document.getElementById('advisor-bio');
    const imgEl = document.getElementById('advisor-image');
    const specialtyEl = document.getElementById('advisor-specialty-badge');

    if (nameEl) nameEl.innerText = advisor.name;
    if (titleEl) titleEl.innerText = advisor.title;
    if (bioEl) bioEl.innerText = advisor.bio;
    if (imgEl) imgEl.src = advisor.image;
    if (specialtyEl) specialtyEl.innerText = `SPECIALIST: ${advisor.specialty}`;
}

function generateBookingGrid() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;

    const today = new Date();
    const times = ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"];
    
    // Generate next 3 business days
    let daysFound = 0;
    let offset = 1;
    
    while (daysFound < 3) {
        let date = new Date();
        date.setDate(today.getDate() + offset);
        
        // Skip weekends
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            const col = document.createElement('div');
            col.className = 'calendar-day-col';
            col.style.display = 'flex';
            col.style.flexDirection = 'column';
            col.style.gap = '10px';

            const header = document.createElement('div');
            header.style.textAlign = 'center';
            header.style.padding = '10px 0';
            header.style.borderBottom = '1px solid var(--card-border)';
            header.style.marginBottom = '10px';
            header.innerHTML = `
                <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div style="font-weight: 700; font-size: 1.1rem;">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            `;
            col.appendChild(header);

            times.forEach(time => {
                const btn = document.createElement('button');
                btn.className = 'time-slot-btn';
                btn.innerText = time;
                btn.style.cssText = `
                    background: #1a1d26;
                    border: 1px solid var(--card-border);
                    color: var(--text-main);
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.8rem;
                    transition: all 0.2s ease;
                `;
                
                btn.onmouseover = () => { if(!btn.classList.contains('selected')) btn.style.borderColor = 'var(--electric-blue)'; };
                btn.onmouseout = () => { if(!btn.classList.contains('selected')) btn.style.borderColor = 'var(--card-border)'; };
                
                btn.onclick = (e) => selectSlot(e.target, date, time);
                col.appendChild(btn);
            });

            grid.appendChild(col);
            daysFound++;
        }
        offset++;
    }
}

function selectSlot(el, date, time) {
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.background = '#1a1d26';
        btn.style.borderColor = 'var(--card-border)';
        btn.style.color = 'var(--text-main)';
    });

    el.classList.add('selected');
    el.style.background = 'rgba(57, 255, 20, 0.1)';
    el.style.borderColor = 'var(--neon-green)';
    el.style.color = 'var(--neon-green)';

    const submitBtn = document.getElementById('final-book-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = `Confirm Call: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ ${time}`;
        submitBtn.style.opacity = '1';
    }
}

function setupEventListeners() {
    const form = document.getElementById('booking-form');
    const finalBtn = document.getElementById('final-book-btn');

    if (finalBtn) {
        finalBtn.onclick = (e) => {
            e.preventDefault();
            finalBtn.innerText = "RESERVING...";
            finalBtn.style.pointerEvents = "none";
            
            // Simulation of submission
            setTimeout(() => {
                showSuccessState();
            }, 1800);
        };
    }
}

function showSuccessState() {
    const container = document.getElementById('moonshine-matcher-container');
    if (!container) return;

    container.innerHTML = `
        <div style="padding: 80px 40px; text-align: center; animation: fadeIn 0.5s ease-out;">
            <div style="width: 64px; height: 64px; background: var(--neon-green); border-radius: 50%; margin: 0 auto 32px; display: flex; align-items: center; justify-content: center;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h1 style="font-size: 2.5rem; margin-bottom: 16px;">Session Secured.</h1>
            <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 500px; margin: 0 auto 40px;">
                Your specialist has been notified. A Zoom invitation and your <b>Route Prep Checklist</b> have been sent to your inbox.
            </p>
            <div style="background: #0d0f14; border: 1px solid var(--card-border); padding: 30px; border-radius: 20px; text-align: left; max-width: 450px; margin: 0 auto;">
                <h4 style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--electric-blue); margin-bottom: 15px; letter-spacing: 1px;">PRE-CALL REQUIREMENTS:</h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px;">
                    <li style="font-size: 0.9rem; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--neon-green)">→</span> Link your bank data via the secure portal
                    </li>
                    <li style="font-size: 0.9rem; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--neon-green)">→</span> Have a digital copy of your Gov ID ready
                    </li>
                    <li style="font-size: 0.9rem; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--neon-green)">→</span> Ensure all decision makers are present
                    </li>
                </ul>
            </div>
            <button onclick="window.location.reload()" class="cta-button btn-outline" style="margin-top: 40px;">Back to Dashboard</button>
        </div>
    `;
}