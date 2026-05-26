/**
 * Prism Scan | Search Analytics Dashboard Data
 * High-level overview metrics for Person-Finder Micro-Agent performance.
 */

const dashboardData = {
    overview: {
        totalSearches: 14208,
        successRate: 94.2,
        avgLatency: "11.4s",
        creditsRemaining: 4850,
        systemStatus: "OPTIMAL"
    },
    
    roleDistribution: [
        { role: "CEO / Founder", count: 3421, percentage: 24, color: "#00f2ff" },
        { role: "Director of Operations", count: 2560, percentage: 18, color: "#ff00ea" },
        { role: "Head of Engineering", count: 2130, percentage: 15, color: "#bcff00" },
        { role: "HR Manager", count: 1845, percentage: 13, color: "#e0e6ed" },
        { role: "Other", count: 4252, percentage: 30, color: "#7a869a" }
    ],

    weeklyPerformance: [
        { day: "MON", scans: 1200, success: 1150 },
        { day: "TUE", scans: 1500, success: 1420 },
        { day: "WED", scans: 1800, success: 1710 },
        { day: "THU", scans: 1400, success: 1320 },
        { day: "FRI", scans: 2100, success: 1980 },
        { day: "SAT", scans: 800, success: 750 },
        { day: "SUN", scans: 600, success: 580 }
    ],

    recentLookups: [
        {
            id: "PX-7821",
            name: "Sarah Jenkins",
            role: "Director of Operations",
            company: "Acme Dynamics",
            timestamp: "2023-10-27 14:20:11",
            link: "https://linkedin.com/in/sjenkins-ops-lead",
            confidence: 0.98,
            source: "SOS Registry + LinkedIn"
        },
        {
            id: "PX-7820",
            name: "Marcus Thorne",
            role: "CEO & Founder",
            company: "Specter Solutions",
            timestamp: "2023-10-27 13:45:02",
            link: "https://linkedin.com/in/mthorne-specter",
            confidence: 0.94,
            source: "Website About Page"
        },
        {
            id: "PX-7819",
            name: "Elena Rodriguez",
            role: "Head of Talent",
            company: "Vertex Logistics",
            timestamp: "2023-10-27 12:15:30",
            link: "https://linkedin.com/in/erodriguez-vertex",
            confidence: 0.91,
            source: "Chamber of Commerce"
        },
        {
            id: "PX-7818",
            name: "David Chen",
            role: "Chief Architect",
            company: "Quantum Cyber",
            timestamp: "2023-10-27 11:50:44",
            link: "https://linkedin.com/in/dchen-quantum",
            confidence: 0.89,
            source: "Google Dorking"
        },
        {
            id: "PX-7817",
            name: "Julian Vane",
            role: "Managing Director",
            company: "Nebula Holdings",
            timestamp: "2023-10-27 10:04:12",
            link: "https://linkedin.com/in/jvane-nebula",
            confidence: 0.96,
            source: "Team Directory Scrape"
        }
    ],

    agentNodes: [
        { name: "Prism-Alpha", location: "US-EAST", load: "42%", status: "online" },
        { name: "Prism-Bravo", location: "EU-WEST", load: "18%", status: "online" },
        { name: "Prism-Delta", location: "AP-SOUTH", load: "89%", status: "throttled" }
    ]
};

/**
 * Utility functions for Dashboard Visualization
 */
const DashboardUtils = {
    getSuccessRateColor: (rate) => {
        if (rate >= 90) return 'var(--accent-lime)';
        if (rate >= 75) return 'var(--accent-cyan)';
        return 'var(--accent-magenta)';
    },

    formatTimestamp: (ts) => {
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    getConfidenceGrade: (score) => {
        if (score > 0.95) return 'AAA';
        if (score > 0.85) return 'AA';
        return 'A-';
    }
};

// Export for use in dashboard UI
if (typeof module !== 'undefined') {
    module.exports = { dashboardData, DashboardUtils };
}