const advisorData = {
    'working-capital': {
        name: 'Jameson Reed',
        title: 'Commercial Growth Specialist',
        specialty: 'High-Volume Working Capital',
        bio: 'Specializing in scaling established service and retail brands through strategic capital injection.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
        calendarLink: 'https://calendly.com/moonshine-reed/growth-strategy'
    },
    'real-estate-funding': {
        name: 'Marcus Thorne',
        title: 'Asset-Based Lending Director',
        specialty: 'Real Estate & Bridge Loans',
        bio: 'Expert in navigating HUD statements, fix-and-flip financing, and multi-unit portfolio expansion.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        calendarLink: 'https://calendly.com/moonshine-marcus/re-strategy'
    },
    'equipment-financing': {
        name: 'Sloan Whitaker',
        title: 'Logistics & Infrastructure Lead',
        specialty: 'Heavy Equipment & Fleet Leasing',
        bio: 'Helping logistics and construction firms secure mission-critical hardware with minimal down payments.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
        calendarLink: 'https://calendly.com/moonshine-sloan/equipment'
    },
    'e-commerce-funding': {
        name: 'Sarah Chen',
        title: 'Digital Revenue Strategist',
        specialty: 'Inventory & Ad-Spend Scaling',
        bio: 'Leveraging data-driven insights to fund high-velocity Amazon, Shopify, and TikTok Shop brands.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
        calendarLink: 'https://calendly.com/moonshine-sarah/ecom-acceleration'
    },
    'quick-micro-funding': {
        name: 'Elena Rodriguez',
        title: 'Micro-Funding Lead',
        specialty: 'Gig-Economy & Small-Batch Capital',
        bio: 'Focusing on rapid liquidity for sole proprietors and startups needing immediate momentum.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        calendarLink: 'https://calendly.com/moonshine-elena/micro-strategy'
    },
    'business-credit-prep': {
        name: 'Derrick Vance',
        title: 'Credit Architect',
        specialty: 'Entity Structuring & Rebuilding',
        bio: 'Transforming "non-fundable" businesses into prime bankable assets within 60 to 90 days.',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
        calendarLink: 'https://calendly.com/moonshine-derrick/prep-path'
    }
};

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function initializeAdvisorContext() {
    const rawRoute = getUrlParam('route') || 'working-capital';
    const routeKey = slugify(rawRoute);
    const advisor = advisorData[routeKey] || advisorData['working-capital'];

    // Update DOM elements with specialist data
    const elements = {
        name: document.getElementById('advisor-name'),
        title: document.getElementById('advisor-title'),
        specialty: document.getElementById('advisor-specialty'),
        bio: document.getElementById('advisor-bio'),
        image: document.getElementById('advisor-image'),
        bookingBtn: document.getElementById('advisor-booking-cta'),
        routeDisplay: document.getElementById('matched-route-name')
    };

    if (elements.name) elements.name.innerText = advisor.name;
    if (elements.title) elements.title.innerText = advisor.title;
    if (elements.specialty) elements.specialty.innerText = advisor.specialty;
    if (elements.bio) elements.bio.innerText = advisor.bio;
    if (elements.image) elements.image.src = advisor.image;
    if (elements.routeDisplay) elements.routeDisplay.innerText = rawRoute.replace(/-/g, ' ').toUpperCase();
    
    if (elements.bookingBtn) {
        elements.bookingBtn.href = advisor.calendarLink;
        elements.bookingBtn.onclick = (e) => {
            console.log(`Lead engaging with specialist: ${advisor.name} for route: ${routeKey}`);
        };
    }

    // Apply styles to match Base Component theme
    document.querySelectorAll('.advisor-highlight').forEach(el => {
        el.style.color = 'var(--electric-blue)';
        el.style.fontFamily = "'JetBrains Mono', monospace";
    });
}

document.addEventListener('DOMContentLoaded', initializeAdvisorContext);

// Export for module support if needed
if (typeof module !== 'undefined') {
    module.exports = { advisorData, initializeAdvisorContext };
}