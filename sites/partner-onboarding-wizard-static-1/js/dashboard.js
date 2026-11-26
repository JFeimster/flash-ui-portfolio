/**
 * Moonshine Capital Partners - Affiliate Analytics & Commission Dashboard
 * Highly interactive, high-contrast, Neo-Brutalist design interface.
 */

(function () {
    // Dashboard state management
    const state = {
        partnerId: 'WILD_CAT_01',
        metrics: {
            clicks: 14820,
            signups: 412,
            conversionRate: 2.78,
            totalEarnings: 58450.00,
            pendingPayouts: 12200.00
        },
        utmSource: 'TWITTER_MC',
        utmMedium: 'BIO_LINK',
        monthlyData: [
            { month: 'OCT', clicks: 8200, signups: 190, commissions: 22000 },
            { month: 'NOV', clicks: 11000, signups: 280, commissions: 34000 },
            { month: 'DEC', clicks: 13400, signups: 350, commissions: 48000 },
            { month: 'JAN', clicks: 14820, signups: 412, commissions: 58450 }
        ],
        recentEvents: [
            { id: 'TX-9022', type: 'CONVERSION', company: 'NEXUS STEEL LLC', commission: '$4,800.00', time: '12 MINS AGO', status: 'SUCCESS' },
            { id: 'TX-9021', type: 'SIGNUP', company: 'APEX LOGISTICS', commission: '--', time: '1 HOUR AGO', status: 'ACTIVE' },
            { id: 'TX-9020', type: 'CLICK', company: 'IP: 184.22.109.5', commission: '--', time: '2 HOURS AGO', status: 'REDIRECTED' },
            { id: 'TX-9019', type: 'CONVERSION', company: 'ORION CONTRACTING', commission: '$6,400.00', time: '5 HOURS AGO', status: 'SUCCESS' },
            { id: 'TX-9018', type: 'CONVERSION', company: 'ZEPHYR LABS LTD', commission: '$1,000.00', time: '1 DAY AGO', status: 'SUCCESS' }
        ]
    };

    // Initialize Dashboard UI
    function initDashboard() {
        const dashboardContainer = document.getElementById('moonshine-dashboard') || createFallbackContainer();
        renderDashboardStructure(dashboardContainer);
        setupEventListeners();
        startLiveFeedSimulator();
    }

    // Creates container dynamically if none is provided in standard mounting point
    function createFallbackContainer() {
        let container = document.getElementById('moonshine-dashboard');
        if (!container) {
            container = document.createElement('div');
            container.id = 'moonshine-dashboard';
            container.className = "w-full text-[#ffffff] select-none font-sans";
            document.body.appendChild(container);
        }
        return container;
    }

    // Render HTML components with precise Neo-Brutalist styling matching the base design
    function renderDashboardStructure(container) {
        container.innerHTML = `
            <div class="space-y-8 animate-fade-in p-1 md:p-4">
                
                <!-- HEADER BAR -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white text-black p-6 border-4 border-black neo-shadow-white relative overflow-hidden">
                    <div class="absolute right-0 top-0 bg-[#ff4800] text-white font-black px-4 py-1 text-xs uppercase tracking-widest border-l-4 border-b-4 border-black">
                        OPERATIONAL HUB
                    </div>
                    <div>
                        <span class="text-xs font-mono font-bold text-zinc-500">// AFFILIATE LEDGER / PARTNER PORTAL</span>
                        <h1 class="text-3xl md:text-5xl font-black tracking-tight uppercase">
                            ANALYTICS & <span class="text-[#ff4800] underline decoration-4 decoration-black">PAYOUTS</span>
                        </h1>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="bg-[#00ff66] text-black font-mono font-black text-xs px-3 py-1 border-2 border-black tracking-widest animate-pulse flex items-center gap-1.5">
                            <span class="inline-block w-2.5 h-2.5 bg-black rounded-full"></span> LIVE STREAMING
                        </div>
                        <div class="bg-black text-white font-mono text-xs px-3 py-1 border-2 border-white">
                            SESSION: <span id="sess-part-id" class="text-[#ff4800] font-black">${state.partnerId}</span>
                        </div>
                    </div>
                </div>

                <!-- METRICS GRID -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- CLICKS -->
                    <div class="bg-black text-white border-4 border-white p-6 relative neo-shadow-white flex flex-col justify-between">
                        <span class="text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest block mb-4">// UNIQUE HOPS</span>
                        <div>
                            <div class="text-5xl font-black tracking-tighter" id="metric-clicks">${state.metrics.clicks.toLocaleString()}</div>
                            <span class="text-xs font-mono text-[#00ff66] font-bold block mt-2">▲ 14.8% THIS CYCLE</span>
                        </div>
                        <div class="absolute right-3 bottom-3 text-zinc-800 font-mono text-6xl font-black -z-10">01</div>
                    </div>

                    <!-- SIGNUPS -->
                    <div class="bg-black text-white border-4 border-white p-6 relative neo-shadow-white flex flex-col justify-between">
                        <span class="text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest block mb-4">// DEALS LOGGED</span>
                        <div>
                            <div class="text-5xl font-black tracking-tighter text-[#ff4800]" id="metric-signups">${state.metrics.signups}</div>
                            <span class="text-xs font-mono text-zinc-400 font-bold block mt-2">Target conversions ready</span>
                        </div>
                        <div class="absolute right-3 bottom-3 text-zinc-800 font-mono text-6xl font-black -z-10">02</div>
                    </div>

                    <!-- CONVERSION RATE -->
                    <div class="bg-black text-white border-4 border-white p-6 relative neo-shadow-white flex flex-col justify-between">
                        <span class="text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest block mb-4">// PIPELINE RATIO</span>
                        <div>
                            <div class="text-5xl font-black tracking-tighter" id="metric-conversion">${state.metrics.conversionRate}%</div>
                            <span class="text-xs font-mono text-[#00ff66] font-bold block mt-2">⚡ 0.8% ABOVE TARGET</span>
                        </div>
                        <div class="absolute right-3 bottom-3 text-zinc-800 font-mono text-6xl font-black -z-10">03</div>
                    </div>

                    <!-- COMMISSION ACCRUED -->
                    <div class="bg-[#ff4800] text-black border-4 border-black p-6 relative neo-shadow flex flex-col justify-between">
                        <span class="text-xs font-mono text-black font-black uppercase tracking-widest block mb-4">// NET COMMS (PAID)</span>
                        <div>
                            <div class="text-4xl md:text-5xl font-black tracking-tighter" id="metric-earnings">$${state.metrics.totalEarnings.toLocaleString()}</div>
                            <span class="bg-black text-white text-xs font-mono font-bold px-2 py-0.5 inline-block mt-2">PENDING: $${state.metrics.pendingPayouts.toLocaleString()}</span>
                        </div>
                        <div class="absolute right-3 bottom-3 text-black opacity-10 font-mono text-6xl font-black -z-10">04</div>
                    </div>
                </div>

                <!-- MAIN WORKSPACE: LINKS + CHARTS -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    <!-- LEFT COLUMN: GENERATOR & PAYOUT ACTIONS (7 COLS) -->
                    <div class="lg:col-span-7 flex flex-col gap-6">
                        
                        <!-- DYNAMIC LINK GENERATOR -->
                        <div class="bg-[#ffffff] text-black border-4 border-black p-6 neo-shadow relative">
                            <h3 class="text-2xl font-black uppercase mb-2 tracking-tight">ENGINES PLATFORM // LINK BUILDER</h3>
                            <p class="text-sm text-zinc-600 font-bold mb-6">Append custom parameters to segment and trace traffic entry routes precisely.</p>
                            
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-wider text-black mb-1">CAMPAIGN SOURCE (UTM_SOURCE)</label>
                                    <input type="text" id="input-utm-source" value="${state.utmSource}" class="w-full bg-black text-white font-mono p-3 border-4 border-black focus:outline-none focus:border-[#ff4800] uppercase text-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-wider text-black mb-1">CAMPAIGN MEDIUM (UTM_MEDIUM)</label>
                                    <input type="text" id="input-utm-medium" value="${state.utmMedium}" class="w-full bg-black text-white font-mono p-3 border-4 border-black focus:outline-none focus:border-[#ff4800] uppercase text-sm">
                                </div>

                                <!-- Live Link Output Viewport -->
                                <div class="border-4 border-dashed border-[#ff4800] p-4 bg-zinc-950 text-white mt-6">
                                    <span class="block text-xs font-mono text-[#ff4800] mb-2">// DYNAMIC ROUTING TARGET LINK</span>
                                    <div class="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center">
                                        <div class="font-mono text-xs md:text-sm font-black break-all select-all flex-grow pr-4" id="constructed-link-display">
                                            https://moonshine.capital/?aff=${state.partnerId}&utm_source=${state.utmSource}&utm_medium=${state.utmMedium}
                                        </div>
                                        <button id="btn-copy-link" class="w-full md:w-auto shrink-0 bg-[#ff4800] hover:bg-[#00ff66] text-black hover:text-black font-black text-xs uppercase py-2.5 px-5 border-2 border-black transition-colors whitespace-nowrap active:translate-y-1">
                                            COPY ROUTE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- WITHDRAWAL INITIATION PANEL -->
                        <div class="bg-black text-white border-4 border-white p-6 neo-shadow-white relative">
                            <h3 class="text-2xl font-black uppercase text-[#ff4800] tracking-tight mb-2">// COMMENCE PAYOUT RESOLUTION</h3>
                            <p class="text-xs font-mono text-zinc-400 mb-6">Authorized funds transfer executing directly to source ledger wallets.</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div id="payout-opt-usdc" class="payout-card cursor-pointer border-4 border-[#ff4800] p-4 bg-zinc-950 text-center hover:bg-zinc-900 transition-colors" onclick="selectPayoutMethod('USDC')">
                                    <span class="block font-black text-lg text-white">USDC</span>
                                    <span class="block text-[10px] font-mono text-zinc-500 mt-2">SOL / ETH WALLET</span>
                                </div>
                                <div id="payout-opt-wire" class="payout-card cursor-pointer border-4 border-white p-4 bg-zinc-950 text-center hover:bg-zinc-900 transition-colors" onclick="selectPayoutMethod('WIRE')">
                                    <span class="block font-black text-lg text-white">DIRECT WIRE</span>
                                    <span class="block text-[10px] font-mono text-zinc-500 mt-2">1-2 BUSINESS DAYS</span>
                                </div>
                                <div id="payout-opt-ach" class="payout-card cursor-pointer border-4 border-white p-4 bg-zinc-950 text-center hover:bg-zinc-900 transition-colors" onclick="selectPayoutMethod('ACH')">
                                    <span class="block font-black text-lg text-white">ACH</span>
                                    <span class="block text-[10px] font-mono text-zinc-500 mt-2">NO EXTRA FEES</span>
                                </div>
                            </div>

                            <div class="mt-6 flex flex-col md:flex-row gap-4 items-center">
                                <div class="w-full md:w-1/2">
                                    <label class="block text-xs font-mono text-zinc-400 mb-1">AMOUNT TO CLEAR ($)</label>
                                    <input type="number" id="input-payout-amount" value="12200" max="12200" class="w-full bg-zinc-950 text-[#00ff66] font-mono font-black text-xl p-3 border-4 border-white focus:outline-none">
                                </div>
                                <div class="w-full md:w-1/2 pt-5">
                                    <button id="btn-request-payout" class="w-full bg-[#00ff66] hover:bg-white text-black font-black text-sm uppercase py-4 border-4 border-black active:translate-y-1 transition-all">
                                        EXECUTE TRANSFER 📡
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- RIGHT COLUMN: PERFORMANCE CHART + LIVE ACTIVITY FEED (5 COLS) -->
                    <div class="lg:col-span-5 flex flex-col gap-6">
                        
                        <!-- MONTHLY PERFORMANCE BAR CHART -->
                        <div class="bg-black text-white border-4 border-white p-6 neo-shadow-white">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-xl font-black uppercase">// DEALS CLOSED ($K)</h3>
                                <span class="bg-white text-black text-[10px] font-mono font-black px-2 py-0.5 uppercase">L4M_PERF</span>
                            </div>

                            <!-- Bar chart element rendering -->
                            <div class="flex items-end justify-between h-48 border-b-4 border-white px-2 pt-4 relative">
                                <div class="absolute inset-x-0 top-1/2 border-t border-dashed border-zinc-800 pointer-events-none"></div>
                                <div class="absolute inset-x-0 top-1/4 border-t border-dashed border-zinc-800 pointer-events-none"></div>
                                
                                ${state.monthlyData.map(data => {
                                    const percentage = (data.commissions / 60000) * 100;
                                    return `
                                        <div class="flex flex-col items-center flex-grow group">
                                            <div class="w-12 bg-[#ff4800] border-4 border-black hover:bg-[#00ff66] transition-colors relative" style="height: ${percentage}px;">
                                                <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-mono font-black px-1 border border-black z-20 whitespace-nowrap">
                                                    $${(data.commissions / 1000).toFixed(1)}k
                                                </div>
                                            </div>
                                            <span class="text-[10px] font-mono font-black mt-2 text-zinc-400">${data.month}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- LIVE RECENT EVENT LOGS -->
                        <div class="bg-white text-black border-4 border-black p-6 neo-shadow relative flex-grow flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-xl font-black uppercase">// TRANSACTION LOG</h3>
                                    <span class="blink inline-block bg-[#00ff66] border-2 border-black w-3 h-3 rounded-full"></span>
                                </div>
                                
                                <div class="space-y-3 font-mono text-xs overflow-y-auto max-h-[220px]" id="activity-log-feed">
                                    ${state.recentEvents.map(ev => `
                                        <div class="border-b-2 border-dashed border-zinc-300 pb-2 flex justify-between items-start gap-2">
                                            <div>
                                                <span class="font-black text-black uppercase bg-zinc-200 px-1 text-[10px]">${ev.type}</span>
                                                <span class="font-black block text-black uppercase text-sm mt-0.5">${ev.company}</span>
                                                <span class="text-zinc-500 text-[10px]">${ev.time}</span>
                                            </div>
                                            <div class="text-right">
                                                <span class="font-black text-black block">${ev.commission !== '--' ? ev.commission : ''}</span>
                                                <span class="font-black text-[10px] text-[#ff4800]">${ev.status}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- ALERTS DISPATCH TOASTER -->
                <div id="toast-notif" class="fixed bottom-6 right-6 bg-[#00ff66] text-black border-4 border-black px-6 py-4 neo-shadow font-black uppercase tracking-wider text-sm hidden z-50">
                    EVENT LOGGED IN FILE SYSTEM ⚡
                </div>

            </div>
        `;
    }

    // Capture and handle action listeners
    function setupEventListeners() {
        const sourceInput = document.getElementById('input-utm-source');
        const mediumInput = document.getElementById('input-utm-medium');
        const copyBtn = document.getElementById('btn-copy-link');
        const payoutBtn = document.getElementById('btn-request-payout');

        // Dynamically update link constructed dynamically
        function updateLink() {
            state.utmSource = sourceInput.value.trim().toUpperCase().replace(/[^A-Z0-9-_]/g, '');
            state.utmMedium = mediumInput.value.trim().toUpperCase().replace(/[^A-Z0-9-_]/g, '');
            
            const linkDisplay = document.getElementById('constructed-link-display');
            linkDisplay.innerText = `https://moonshine.capital/?aff=${state.partnerId}&utm_source=${state.utmSource}&utm_medium=${state.utmMedium}`;
        }

        if (sourceInput && mediumInput) {
            sourceInput.addEventListener('input', updateLink);
            mediumInput.addEventListener('input', updateLink);
        }

        // Action Copy Click
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const url = document.getElementById('constructed-link-display').innerText;
                navigator.clipboard.writeText(url).then(() => {
                    triggerToast('AFFILIATE LINK DISPATCHED TO CLIPBOARD');
                    copyBtn.innerText = 'COPIED!';
                    copyBtn.className = copyBtn.className.replace('bg-[#ff4800]', 'bg-white');
                    setTimeout(() => {
                        copyBtn.innerText = 'COPY ROUTE';
                        copyBtn.className = copyBtn.className.replace('bg-white', 'bg-[#ff4800]');
                    }, 1200);
                });
            });
        }

        // Action Pay out requested
        if (payoutBtn) {
            payoutBtn.addEventListener('click', () => {
                const amtInput = document.getElementById('input-payout-amount');
                const requestedAmount = parseFloat(amtInput.value);

                if (isNaN(requestedAmount) || requestedAmount <= 0) {
                    alert('SPECIFY VALID CAPITAL TOTAL FOR PAYOUT');
                    return;
                }
                if (requestedAmount > state.metrics.pendingPayouts) {
                    alert('REQUEST EXCEEDS AVAILABLE BALANCE CAP PARAMETERS.');
                    return;
                }

                state.metrics.pendingPayouts -= requestedAmount;
                state.metrics.totalEarnings += requestedAmount;

                // Sync GUI displays instantly
                document.getElementById('metric-earnings').innerText = `$${state.metrics.totalEarnings.toLocaleString()}`;
                document.getElementById('input-payout-amount').value = 0;
                
                // Redraw status or log transaction
                const logs = document.getElementById('activity-log-feed');
                const newTx = `
                    <div class="border-b-2 border-dashed border-zinc-300 pb-2 flex justify-between items-start gap-2 animate-pulse">
                        <div>
                            <span class="font-black text-white uppercase bg-black px-1 text-[10px]">PAYOUT</span>
                            <span class="font-black block text-black uppercase text-sm mt-0.5">DIRECT BANK SETTLEMENT</span>
                            <span class="text-zinc-500 text-[10px]">JUST NOW</span>
                        </div>
                        <div class="text-right">
                            <span class="font-black text-black block">-$${requestedAmount.toLocaleString()}</span>
                            <span class="font-black text-[10px] text-[#00ff66]">DISPATCHED</span>
                        </div>
                    </div>
                `;
                logs.insertAdjacentHTML('afterbegin', newTx);
                
                triggerToast('PAYOUT INITIATED PROTOCOL ACTIVE 📡');
            });
        }
    }

    // Toggle interactive payout selection visual states
    window.selectPayoutMethod = function(method) {
        document.querySelectorAll('.payout-card').forEach(card => {
            card.className = "payout-card cursor-pointer border-4 border-white p-4 bg-zinc-950 text-center hover:bg-zinc-900 transition-colors";
        });
        const activeCard = document.getElementById(`payout-opt-${method.toLowerCase()}`);
        if (activeCard) {
            activeCard.className = "payout-card cursor-pointer border-4 border-[#ff4800] p-4 bg-zinc-950 text-center hover:bg-zinc-900 transition-colors";
            triggerToast(`PAYOUT SYSTEM SECURED TO: ${method}`);
        }
    }

    // Simulated streaming leads updates in feed log to make dashboard feel alive
    function startLiveFeedSimulator() {
        const rawCompanies = ['AEROFLOT GLOBAL', 'COBALT INFRASERVICE', 'APEX DRYCLEAN', 'VOLT NETWORKS Inc.', 'SIRIUS AUTOMATION'];
        const logFeed = document.getElementById('activity-log-feed');
        if (!logFeed) return;

        setInterval(() => {
            const isClick = Math.random() > 0.4;
            const targetCompany = rawCompanies[Math.floor(Math.random() * rawCompanies.length)];
            const uniqueId = `TX-${Math.floor(9023 + Math.random() * 900)}`;
            
            let htmlLog = '';
            if (isClick) {
                // Click update
                state.metrics.clicks += 1;
                document.getElementById('metric-clicks').innerText = state.metrics.clicks.toLocaleString();
                htmlLog = `
                    <div class="border-b-2 border-dashed border-zinc-300 pb-2 flex justify-between items-start gap-2">
                        <div>
                            <span class="font-black text-black uppercase bg-zinc-200 px-1 text-[10px]">CLICK</span>
                            <span class="font-black block text-black uppercase text-sm mt-0.5">IP: ${Math.floor(Math.random()*150)+50}.22.109.${Math.floor(Math.random()*250)}</span>
                            <span class="text-zinc-500 text-[10px]">JUST NOW</span>
                        </div>
                        <div class="text-right">
                            <span class="font-black text-black block">--</span>
                            <span class="font-black text-[10px] text-[#ff4800]">ROUTE OK</span>
                        </div>
                    </div>
                `;
            } else {
                // Lead SignUp
                state.metrics.signups += 1;
                document.getElementById('metric-signups').innerText = state.metrics.signups;
                htmlLog = `
                    <div class="border-b-2 border-dashed border-zinc-300 pb-2 flex justify-between items-start gap-2 animate-pulse">
                        <div>
                            <span class="font-black text-black uppercase bg-black text-white px-1 text-[10px]">LEAD RECEIVED</span>
                            <span class="font-black block text-black uppercase text-sm mt-0.5">${targetCompany}</span>
                            <span class="text-zinc-500 text-[10px]">JUST NOW</span>
                        </div>
                        <div class="text-right">
                            <span class="font-black text-black block">--</span>
                            <span class="font-black text-[10px] text-[#00ff66]">QUALIFYING</span>
                        </div>
                    </div>
                `;
            }

            // Keep pipeline limit 10
            if (logFeed.children.length > 8) {
                logFeed.removeChild(logFeed.lastElementChild);
            }
            logFeed.insertAdjacentHTML('afterbegin', htmlLog);

        }, 12000); // Trigger every 12s for high tempo feed feeling
    }

    // Trigger floating Neo-Brutalist toast alerts
    function triggerToast(message) {
        const toast = document.getElementById('toast-notif');
        if (toast) {
            toast.innerText = message;
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 2500);
        }
    }

    // Self-bootloader
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }
})();