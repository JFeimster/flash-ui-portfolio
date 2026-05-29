const MoonshineLeaderboard = (() => {
    // Simulated initial data for the leaderboard
    let affiliates = [
        { rank: 1, id: "WOLF_STREET", deals: 42, volume: 5200000, commission: 208000, tier: "APEX LIQUIDATOR" },
        { rank: 2, id: "LIQUIDITY_CHASE", deals: 29, volume: 3850000, commission: 154000, tier: "GOLDEN WHALE" },
        { rank: 3, id: "CAPITAL_BEAST", deals: 18, volume: 2100000, commission: 84000, tier: "GOLDEN WHALE" },
        { rank: 4, id: "MONEYMINDED_902", deals: 14, volume: 1850000, commission: 74000, tier: "SILVER SHARK" },
        { rank: 5, id: "MOONRUNNER_44", deals: 8, volume: 950000, commission: 38000, tier: "SILVER SHARK" },
        { rank: 6, id: "YOUR-ID", deals: 3, volume: 350000, commission: 14000, tier: "BRONZE RUNNER", isUser: true }
    ];

    // Contest details
    const contest = {
        name: "MARCH MADNESS REFERRAL BLITZ",
        grandPrize: "$50,000 USD WALLET DRIFT",
        endsInSeconds: 11 * 24 * 3600 + 14 * 3600 + 32 * 60 + 15, // 11d 14h 32m 15s
        targetVolume: 10000000,
        currentVolume: 7250000
    };

    // Reward Tiers configuration
    const rewardTiers = [
        { id: "bronze", name: "BRONZE RUNNER", target: "1 Deal Routed", reward: "Custom Discord Access + Raw Terminal Sticker Pack", status: "unlocked", color: "#00ff66" },
        { id: "silver", name: "SILVER SHARK", target: "5 Deals Routed", reward: "2% Commission Base Rate Upgrade", status: "active", color: "#ffffff" },
        { id: "gold", name: "GOLDEN WHALE", target: "15 Deals Routed", reward: "4% Commission Base + Custom Landing Funnel Dev Support", status: "locked", color: "#ff4800" },
        { id: "apex", name: "APEX LIQUIDATOR", target: "50 Deals Routed", reward: "Dedicated Account Coordinator + VIP Access to Private Liquidity Pools", status: "locked", color: "#ff00ea" }
    ];

    // Live news flash simulator updates
    const liveActions = [
        "WOLF_STREET locked a fresh $450k deal using endpoint routes.",
        "CAPITAL_BEAST claimed SILVER SHARK upgrade successfully.",
        "MONEYMINDED_902 initiated a route mapping request for $100k.",
        "SYSTEM: Global pool target approaching next milestone.",
        "MOONRUNNER_44 just pushed pipeline assets valued at $220k.",
        "SYSTEM: New affiliate secure channel logged."
    ];

    let timerInterval = null;
    let feedInterval = null;

    // Helper to format currency
    function formatCurrency(num) {
        return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Initialize custom leaderboard injection
    function init() {
        // Append custom styles for the leaderboard dashboard to head
        const style = document.createElement('style');
        style.innerHTML = `
            .badge-pulse {
                animation: badge-glow 2s infinite alternate;
            }
            @keyframes badge-glow {
                from { box-shadow: 0 0 5px rgba(255, 72, 0, 0.5); }
                to { box-shadow: 0 0 20px rgba(255, 72, 0, 0.9); }
            }
        `;
        document.head.appendChild(style);

        // Intercept standard dashboard launcher
        window.resetToDashboard = () => {
            const workspace = document.querySelector('main');
            if (workspace) {
                renderDashboard(workspace);
            } else {
                alert("Dashboard rendering engine target missing.");
            }
        };
    }

    // Main Renderer
    function renderDashboard(container) {
        // Clear background glitch artifacts/decorations or hide steps
        container.innerHTML = "";

        // Dynamically match user ID to custom input value from Step 2 if set
        const registeredIdElement = document.getElementById('affiliate-preview');
        const registeredId = (registeredIdElement && registeredIdElement.innerText !== "YOUR-ID") 
            ? registeredIdElement.innerText 
            : "WILD_CAT_01";

        // Update local user record
        const userAffiliate = affiliates.find(a => a.isUser);
        if (userAffiliate) {
            userAffiliate.id = registeredId;
        }

        // Layout Shell
        const dashboardHTML = `
            <!-- Dashboard Main Grid -->
            <div class="relative z-10 space-y-6 w-full">
                
                <!-- HEADER BAR -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-white pb-4 gap-4">
                    <div>
                        <div class="inline-block bg-[#00ff66] text-black text-xs font-black px-3 py-1 uppercase tracking-widest mb-1">
                            OPERATIONAL AREA: HIGH EXPOSURE BATTLEGROUND
                        </div>
                        <h2 class="text-4xl font-black uppercase tracking-tight">
                            AFFILIATE <span class="text-[#ff4800]">BATTLEGROUND</span> Hub
                        </h2>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="MoonshineLeaderboard.simulateDeal()" class="bg-[#ff4800] hover:bg-white text-black font-black text-xs py-2 px-4 border-2 border-black tracking-widest uppercase neo-btn">
                            SIMULATE LIVE DEAL ⚡
                        </button>
                        <button onclick="MoonshineLeaderboard.exitDashboard()" class="bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs py-2 px-4 border-2 border-zinc-800 tracking-widest uppercase">
                            EXIT TO PORTAL
                        </button>
                    </div>
                </div>

                <!-- CONTEST TRACKER (Gamified Contest Highlight) -->
                <div class="border-4 border-white bg-zinc-950 p-6 relative overflow-hidden">
                    <!-- Ribbon -->
                    <div class="absolute top-0 right-0 bg-[#ff4800] text-black font-black px-4 py-2 text-xs uppercase tracking-widest border-b-4 border-l-4 border-white">
                        $50,000 POOL ACTIVE
                    </div>

                    <div class="space-y-4">
                        <div>
                            <span class="text-xs font-mono text-[#ff4800] uppercase font-bold">// CHAMPIONSHIP EVENT</span>
                            <h3 class="text-3xl font-black uppercase leading-tight tracking-tight mt-1 text-white">
                                ${contest.name}
                            </h3>
                            <p class="text-xs text-zinc-400 font-mono mt-1">
                                Lock referral targets and scale commissions. Grand prize: <span class="text-[#00ff66] font-bold">${contest.grandPrize}</span> injected directly to top-routed ledger.
                            </p>
                        </div>

                        <!-- Progress Section -->
                        <div class="space-y-2">
                            <div class="flex justify-between text-xs font-mono font-bold">
                                <span class="text-zinc-400">// CURRENT GLOBAL VOLUME ROUTED</span>
                                <span class="text-[#00ff66]" id="contest-progress-text"></span>
                            </div>
                            <div class="w-full bg-zinc-900 border-4 border-white h-8 relative">
                                <div id="contest-progress-bar" class="bg-[#ff4800] h-full border-r-4 border-white transition-all duration-500" style="width: 0%"></div>
                                <div class="absolute inset-0 flex items-center justify-center font-mono text-xs font-black text-white mix-blend-difference uppercase">
                                    Target Milestone: ${formatCurrency(contest.targetVolume)}
                                </div>
                            </div>
                        </div>

                        <!-- Countdown Clock -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 border-4 border-white p-3 bg-black">
                            <div class="text-center">
                                <span class="block text-2xl font-black text-[#ff4800]" id="clock-days">00</span>
                                <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Days</span>
                            </div>
                            <div class="text-center border-l-2 border-zinc-800">
                                <span class="block text-2xl font-black text-[#ff4800]" id="clock-hours">00</span>
                                <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Hours</span>
                            </div>
                            <div class="text-center border-l-2 border-zinc-800">
                                <span class="block text-2xl font-black text-[#ff4800]" id="clock-minutes">00</span>
                                <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Minutes</span>
                            </div>
                            <div class="text-center border-l-2 border-zinc-800">
                                <span class="block text-2xl font-black text-white blink" id="clock-seconds">00</span>
                                <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Seconds</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MIDDLE ROW: REWARD TIERS (Gamified Badges) & LIVE ACTIVITY TERMINAL -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    <!-- REWARD TIERS (7 Cols) -->
                    <div class="lg:col-span-7 bg-zinc-950 border-4 border-white p-5 space-y-4">
                        <h4 class="font-black text-sm uppercase tracking-widest text-zinc-400">// YOUR BADGE PROGRESSION</h4>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="badges-container">
                            <!-- Dynamic Badges will render here -->
                        </div>
                    </div>

                    <!-- LIVE INCIDENT REPORT / ACTIVITY FEED (5 Cols) -->
                    <div class="lg:col-span-5 bg-black border-4 border-white p-5 flex flex-col justify-between h-[340px]">
                        <div>
                            <div class="flex justify-between items-center border-b border-zinc-800 pb-2 mb-3">
                                <span class="font-black text-xs uppercase tracking-widest text-zinc-400">// RAW LOG STREAM</span>
                                <span class="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-ping"></span>
                            </div>
                            <div id="live-incident-feed" class="space-y-3 font-mono text-xs overflow-y-auto h-[220px] text-zinc-400 pr-2">
                                <!-- Dynamic feed injections -->
                            </div>
                        </div>
                        <div class="text-[10px] text-zinc-600 font-mono text-right border-t border-zinc-900 pt-2">
                            SYSTEM: FEED SYNCHRONIZED REALTIME
                        </div>
                    </div>
                </div>

                <!-- MAIN LEADERBOARD SECTION -->
                <div class="bg-zinc-950 border-4 border-white p-6 space-y-4">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <span class="text-xs font-mono text-[#ff4800] font-bold">// SECURE LEDGER STATUS</span>
                            <h3 class="text-2xl font-black uppercase leading-tight mt-1 text-white">Top Flow Generators</h3>
                        </div>
                        <!-- Search Box -->
                        <div class="w-full md:w-auto">
                            <input type="text" id="leaderboard-search" oninput="MoonshineLeaderboard.handleSearch()" placeholder="FILTER CO-CONSPIRATORS..." 
                                class="w-full bg-black text-white font-mono text-xs uppercase p-3 border-2 border-white focus:outline-none focus:border-[#ff4800] placeholder-zinc-700">
                        </div>
                    </div>

                    <!-- Leaderboard Table Container -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr class="border-b-4 border-white font-mono text-xs uppercase text-zinc-400 bg-black">
                                    <th class="p-3">Rank</th>
                                    <th class="p-3">Partner ID</th>
                                    <th class="p-3">Active Badge</th>
                                    <th class="p-3 text-right">Deals Closed</th>
                                    <th class="p-3 text-right">Volume Routed</th>
                                    <th class="p-3 text-right text-[#00ff66]">Est. Commission</th>
                                </tr>
                            </thead>
                            <tbody id="leaderboard-rows" class="font-mono text-sm">
                                <!-- Dynamic rows -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-zinc-500 border-t-2 border-zinc-800 pt-4">
                    <span>SECURE DIRECTORY ROUTE ACTIVE</span>
                    <span>ALL VOLUMES RECORDED INSTANTLY IN THE LEDGER</span>
                </div>
            </div>
        `;

        container.innerHTML = dashboardHTML;

        // Populate elements
        updateProgressBar();
        setupClockTimer();
        renderBadges();
        renderTable();
        startFeedSimulation();
    }

    // Dynamic rendering of reward tier cards
    function renderBadges() {
        const container = document.getElementById("badges-container");
        if (!container) return;

        container.innerHTML = rewardTiers.map(tier => {
            let statusBadge = "";
            let borderStyle = "border-2 border-zinc-800 opacity-60";
            let bgGlowClass = "";

            if (tier.status === "unlocked") {
                statusBadge = `<span class="bg-[#00ff66] text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm">✓ UNLOCKED</span>`;
                borderStyle = "border-4 border-[#00ff66]";
            } else if (tier.status === "active") {
                statusBadge = `<span class="bg-[#ff4800] text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm animate-pulse">⚡ TARGET ACTIVATED</span>`;
                borderStyle = "border-4 border-white badge-pulse";
            } else {
                statusBadge = `<span class="bg-zinc-800 text-zinc-500 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">🔒 LOCKED</span>`;
                borderStyle = "border-2 border-zinc-800 bg-zinc-950/50";
            }

            return `
                <div onclick="MoonshineLeaderboard.showTierDetails('${tier.id}')" class="p-4 ${borderStyle} flex flex-col justify-between h-40 cursor-pointer hover:bg-zinc-900 transition-all">
                    <div>
                        <div class="flex justify-between items-start gap-2">
                            <span class="font-black text-sm uppercase text-white tracking-wide">${tier.name}</span>
                            ${statusBadge}
                        </div>
                        <span class="block text-[10px] font-mono text-zinc-400 mt-2">// GOAL: ${tier.target}</span>
                        <p class="text-xs text-zinc-300 font-mono mt-2 line-clamp-2">Reward: ${tier.reward}</p>
                    </div>
                    <div class="text-[9px] font-mono text-zinc-600 uppercase tracking-widest text-right mt-2">
                        Click details
                    </div>
                </div>
            `;
        }).join('');
    }

    // Modal/Alert tier details logic
    function showTierDetails(tierId) {
        const tier = rewardTiers.find(t => t.id === tierId);
        if (!tier) return;
        alert(`REWARD PROTOCOL DETAILS:\n\nTIER: ${tier.name}\nGOAL: ${tier.target}\nSTATUS: ${tier.status.toUpperCase()}\n\nREWARD DETAILS:\n${tier.reward}`);
    }

    // Dynamic rendering of main leaderboard grid table
    function renderTable(filterQuery = "") {
        const tbody = document.getElementById("leaderboard-rows");
        if (!tbody) return;

        // Sort by Volume Routed DESC
        const sorted = [...affiliates].sort((a, b) => b.volume - a.volume);

        // Map and update ranks after sort
        sorted.forEach((item, idx) => {
            item.rank = idx + 1;
        });

        const query = filterQuery.trim().toUpperCase();
        const filtered = sorted.filter(item => item.id.toUpperCase().includes(query) || item.tier.toUpperCase().includes(query));

        tbody.innerHTML = filtered.map(item => {
            const rowClass = item.isUser 
                ? "bg-[#ff4800]/20 border-l-4 border-[#ff4800] text-white" 
                : "hover:bg-zinc-900 border-b border-zinc-900 text-zinc-300";
            
            const highlightName = item.isUser 
                ? `<span class="bg-[#ff4800] text-black font-black px-2 py-0.5 mr-2">[YOU]</span>${item.id}` 
                : item.id;

            return `
                <tr class="${rowClass} font-mono text-xs">
                    <td class="p-3 font-black text-sm text-white flex items-center gap-2">
                        <span class="w-6 h-6 rounded-none flex items-center justify-center border border-zinc-700 bg-black ${item.rank <= 3 ? 'text-[#ff4800] font-black' : 'text-zinc-500'}">
                            ${item.rank}
                        </span>
                    </td>
                    <td class="p-3 font-black">${highlightName}</td>
                    <td class="p-3"><span class="text-[10px] font-black tracking-wide uppercase px-2 py-0.5 border border-zinc-700 bg-zinc-950">${item.tier}</span></td>
                    <td class="p-3 text-right font-black">${item.deals}</td>
                    <td class="p-3 text-right font-black">${formatCurrency(item.volume)}</td>
                    <td class="p-3 text-right font-black text-[#00ff66]">${formatCurrency(item.commission)}</td>
                </tr>
            `;
        }).join('');
    }

    // Search input handler
    function handleSearch() {
        const input = document.getElementById("leaderboard-search");
        if (input) {
            renderTable(input.value);
        }
    }

    // Manage standard countdown clock logic
    function setupClockTimer() {
        let left = contest.endsInSeconds;
        
        function updateClockDisplay() {
            if (left <= 0) {
                left = 0;
                clearInterval(timerInterval);
            }

            const days = Math.floor(left / (24 * 3600));
            const hours = Math.floor((left % (24 * 3600)) / 3600);
            const minutes = Math.floor((left % 3600) / 60);
            const seconds = Math.floor(left % 60);

            const dEl = document.getElementById("clock-days");
            const hEl = document.getElementById("clock-hours");
            const mEl = document.getElementById("clock-minutes");
            const sEl = document.getElementById("clock-seconds");

            if (dEl) dEl.innerText = days.toString().padStart(2, "0");
            if (hEl) hEl.innerText = hours.toString().padStart(2, "0");
            if (mEl) mEl.innerText = minutes.toString().padStart(2, "0");
            if (sEl) sEl.innerText = seconds.toString().padStart(2, "0");
        }

        updateClockDisplay();
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            left--;
            updateClockDisplay();
        }, 1000);
    }

    // Setup active progress mechanics
    function updateProgressBar() {
        const textEl = document.getElementById("contest-progress-text");
        const barEl = document.getElementById("contest-progress-bar");

        if (textEl && barEl) {
            const percentage = Math.min((contest.currentVolume / contest.targetVolume) * 100, 100);
            textEl.innerText = `${formatCurrency(contest.currentVolume)} / ${formatCurrency(contest.targetVolume)} (${percentage.toFixed(1)}%)`;
            
            // Trigger animation frame transition
            setTimeout(() => {
                barEl.style.width = `${percentage}%`;
            }, 100);
        }
    }

    // Auto streaming simulation engine
    function startFeedSimulation() {
        const feed = document.getElementById("live-incident-feed");
        if (!feed) return;

        // Prefill feed with standard elements
        feed.innerHTML = liveActions.map(action => `<p class="border-b border-zinc-900 pb-1 text-zinc-500">// ${action}</p>`).join('');
        feed.scrollTop = feed.scrollHeight;

        clearInterval(feedInterval);
        feedInterval = setInterval(() => {
            const randomUser = affiliates[Math.floor(Math.random() * affiliates.length)].id;
            const amounts = [150000, 250000, 500000, 800000];
            const dealValue = amounts[Math.floor(Math.random() * amounts.length)];
            
            const logs = [
                `${randomUser} mapped new traffic to target nodes.`,
                `${randomUser} closed fresh contract routing ${formatCurrency(dealValue)}.`,
                `Ledger accepted submission flow of ${formatCurrency(dealValue)} from ${randomUser}.`,
                `CONTEST: Community pool total increased by ${formatCurrency(dealValue)}.`
            ];

            const selectedLog = logs[Math.floor(Math.random() * logs.length)];

            // Dynamically update states
            contest.currentVolume += Math.floor(dealValue * 0.15); // Add up a portion to overall community tracker
            updateProgressBar();

            // Inject message to DOM
            feed.innerHTML += `<p class="border-b border-zinc-900 pb-1 text-[#00ff66]">// ${selectedLog}</p>`;
            feed.scrollTop = feed.scrollHeight;

            // Trim logs if they are excessive
            if (feed.childNodes.length > 30) {
                feed.removeChild(feed.firstChild);
            }
        }, 8000);
    }

    // Button trigger to manually simulate user deals & scale progress bars
    function simulateDeal() {
        const userNode = affiliates.find(a => a.isUser);
        if (userNode) {
            userNode.deals += 1;
            userNode.volume += 125000;
            userNode.commission = userNode.volume * 0.04;

            // Automatically scale up the reward badge state dynamically if criteria met
            if (userNode.deals >= 5 && userNode.deals < 15) {
                userNode.tier = "SILVER SHARK";
                rewardTiers[0].status = "unlocked";
                rewardTiers[1].status = "unlocked";
                rewardTiers[2].status = "active";
            } else if (userNode.deals >= 15) {
                userNode.tier = "GOLDEN WHALE";
                rewardTiers[2].status = "unlocked";
                rewardTiers[3].status = "active";
            }

            // Push notification message in live stream feed
            const feed = document.getElementById("live-incident-feed");
            if (feed) {
                feed.innerHTML += `<p class="border-b border-zinc-900 pb-1 text-white font-black">// SUCCESS: YOU closed a deal worth $125,000! Your stats synced to ledger.</p>`;
                feed.scrollTop = feed.scrollHeight;
            }

            // Sync targets
            contest.currentVolume += 125000;
            updateProgressBar();
            renderBadges();
            renderTable();
        }
    }

    // Teardown intervals to prevent leaking
    function destroy() {
        clearInterval(timerInterval);
        clearInterval(feedInterval);
    }

    // Return to basic layout
    function exitDashboard() {
        destroy();
        // Redirect back to main dashboard welcome screen
        if (typeof window.goToStep === 'function') {
            window.goToStep(5);
        } else {
            location.reload();
        }
    }

    return {
        init,
        simulateDeal,
        showTierDetails,
        handleSearch,
        exitDashboard,
        destroy
    };
})();

// Self-Initialize on script injection
MoonshineLeaderboard.init();