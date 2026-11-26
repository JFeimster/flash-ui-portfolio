const moonshineSupportData = {
    faqs: [
        {
            q: "HOW LONG UNTIL DEALS ARE SIGNED AND ROUTED?",
            a: "Our typical closing cycle is under 48 hours. Once you submit a qualified target with solid monthly revenues ($20K+), our automated underwriting system triggers high-speed credit alignment instantly."
        },
        {
            q: "HOW DO I CASH OUT MY COMMISSION BALANCE?",
            a: "Commissions are processed every Friday at 16:00 UTC. You can register your payout coordinate (USDC-ERC20, Direct Wire, or ACH Ledger) inside your dashboard profile. Zero holding periods."
        },
        {
            q: "WHAT IF ANOTHER PARTNER SUBMITS THE SAME LEAD?",
            a: "First-injection rules apply. Our ledger timestamps lead submission down to the millisecond. If a lead exists active in another pipeline, our system blocks double-entry to preserve absolute attribution."
        },
        {
            q: "CAN I RUN CO-BRANDED LANDING PAGES?",
            a: "Absolutely. Once you scale past 5 closed deals, our engineering team deploys a dedicated custom subdomain mapped directly to your affiliate endpoint with customized branding parameters."
        }
    ],
    videos: [
        {
            id: "vid-1",
            title: "01 // OVERRIDING TRADITIONAL BRIDGE CAPITAL",
            duration: "04:12",
            desc: "Learn how to position Moonshine's high-speed capital pipeline against slow corporate lenders. Master the fast-close script.",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" // Safe generic mock embed
        },
        {
            id: "vid-2",
            title: "02 // ADVANCED LEAD EXTRACTION & SCRAPING",
            duration: "08:45",
            desc: "How to extract high-value targets from public commercial databases and cross-reference them with active credit indicators.",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
        },
        {
            id: "vid-3",
            title: "03 // UNLOCKING 4% COMMISSIONS ON SEVENTY-K DEALS",
            duration: "06:30",
            desc: "A breakdown of raw tier multipliers. Learn how to package deals to maximize total transaction sizing and secure maximum payout cuts.",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
        }
    ]
};

// Initial state
let tickets = JSON.parse(localStorage.getItem('moonshine_tickets')) || [
    {
        id: "TKT-8801",
        subject: "AFFILIATE ENDPOINT LATENCY VERIFICATION",
        category: "TECHNICAL",
        status: "RESOLVED",
        timestamp: "2 hours ago",
        messages: [
            { sender: "YOU", text: "Testing direct link propagation speeds. Confirming server-side caching." },
            { sender: "MARCUS (DIRECTOR)", text: "Verified route. Propagation latency is logged at 12ms. You are clear for high-traffic campaigns." }
        ]
    }
];

// Initialize Support System
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('moonshine-support-root');
    if (root) {
        renderSupportUI(root);
    } else {
        // Fallback: Bind events to static elements if they exist manually
        bindManualEvents();
    }
    
    // Global continuous processes
    startSystemMonitor();
});

function renderSupportUI(container) {
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full max-w-7xl mx-auto text-white">
            
            <!-- LEFT COLUMN: KNOWLEDGE HUB (7 COLS) -->
            <div class="lg:col-span-7 bg-black border-4 border-white neo-shadow-white p-6 space-y-8 flex flex-col justify-between">
                
                <!-- Section Header -->
                <div class="space-y-2">
                    <div class="inline-block bg-[#ff4800] text-black text-xs font-black px-3 py-1 uppercase tracking-widest">
                        PARTNER RESOURCES // MASTER NODE
                    </div>
                    <h2 class="text-4xl font-black tracking-tight uppercase">KNOWLEDGE DRILL HUB</h2>
                    <p class="text-zinc-400 font-bold text-sm tracking-tight">// IMMERSE YOURSELF IN LIQUIDITY PIPELINE SYSTEMS</p>
                </div>

                <!-- Stark Brutalist Video Player Area -->
                <div class="border-4 border-white bg-zinc-950 p-4 space-y-4">
                    <span class="block text-xs font-mono text-[#ff4800] tracking-widest uppercase">// SECURE TRAINING STREAM ACTIVE</span>
                    <div class="relative aspect-video bg-black border-4 border-black flex items-center justify-center overflow-hidden">
                        <iframe id="main-video-iframe" class="absolute inset-0 w-full h-full hidden" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <div id="video-placeholder" class="z-10 text-center p-6 space-y-4">
                            <span class="text-5xl block animate-bounce">⚡</span>
                            <h3 id="placeholder-title" class="text-2xl font-black uppercase text-[#ff4800]">SELECT TRAINING PARADIGM</h3>
                            <p id="placeholder-desc" class="text-xs font-mono text-zinc-400 max-w-md mx-auto">Click one of the primary intelligence logs below to boot secure video transmission stream.</p>
                        </div>
                    </div>
                    
                    <!-- Video Selector Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                        ${moonshineSupportData.videos.map(vid => `
                            <button onclick="playTrainingVideo('${vid.id}')" id="btn-${vid.id}" class="video-btn bg-black hover:bg-[#ff4800] hover:text-black text-left p-3 border-2 border-white transition-all flex flex-col justify-between h-28 group">
                                <span class="font-black text-xs block text-[#ff4800] group-hover:text-black tracking-tighter">${vid.duration}</span>
                                <span class="font-bold text-xs uppercase leading-tight line-clamp-2 mt-1 text-white group-hover:text-black">${vid.title}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- FAQ Accordion Area -->
                <div class="space-y-4 border-t-4 border-white pt-6">
                    <h3 class="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                        <span class="text-[#ff4800]">//</span> FREQUENT INITIATION QUERIES
                    </h3>
                    <div class="space-y-3">
                        ${moonshineSupportData.faqs.map((faq, idx) => `
                            <div class="border-4 border-white bg-zinc-950">
                                <button onclick="toggleAccordion(${idx})" class="w-full flex justify-between items-center p-4 bg-zinc-950 hover:bg-zinc-900 transition-colors text-left font-black text-sm uppercase tracking-tight text-white">
                                    <span>${faq.q}</span>
                                    <span id="faq-arrow-${idx}" class="text-[#ff4800] text-xl transition-transform duration-200">+</span>
                                </button>
                                <div id="faq-answer-${idx}" class="hidden p-4 border-t-2 border-white bg-black text-xs font-mono text-zinc-300 leading-relaxed">
                                    ${faq.a}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

            </div>

            <!-- RIGHT COLUMN: SUPPORT TICKET PORTAL & LIVE OPERATOR (5 COLS) -->
            <div class="lg:col-span-5 flex flex-col gap-6">
                
                <!-- System Status Dashboard Component -->
                <div class="bg-black border-4 border-white p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="w-4 h-4 rounded-none bg-[#00ff66] border-2 border-black animate-ping"></span>
                        <div class="font-mono text-xs">
                            <span class="block text-white font-black uppercase tracking-wider">SYSTEM MONITOR: ONLINE</span>
                            <span class="text-[#00ff66] font-bold" id="monitor-latency">LATENCY: 12ms // ALL STATIONS GO</span>
                        </div>
                    </div>
                    <span class="bg-[#00ff66] text-black font-black text-[10px] px-2 py-0.5 tracking-widest uppercase">SECURED</span>
                </div>

                <!-- Main Ticket Generation Engine -->
                <div class="bg-white text-black border-4 border-white neo-shadow-white p-6 space-y-6 flex-grow flex flex-col justify-between">
                    <div class="space-y-4">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="bg-black text-[#ff4800] text-xs font-black px-2 py-0.5 uppercase tracking-widest">GATEWAY</span>
                                <h3 class="text-3xl font-black uppercase tracking-tight mt-1">SUPPORT DISPATCH</h3>
                            </div>
                            <span class="text-xs font-mono text-zinc-500">// SEV_1 ACCESS</span>
                        </div>

                        <!-- Ticket Submission Form -->
                        <form id="support-ticket-form" onsubmit="submitNewTicket(event)" class="space-y-3">
                            <div>
                                <label class="block text-xs font-black uppercase tracking-wider text-black mb-1">ISSUE CATEGORY *</label>
                                <select id="tkt-category" class="w-full bg-white text-black font-black p-3 border-4 border-black focus:outline-none focus:bg-[#ff4800] uppercase text-xs">
                                    <option value="PAYOUT & LEDGER">PAYOUT & LEDGER RECONCILIATION</option>
                                    <option value="TECHNICAL INTEGRATION">TECHNICAL FUNNEL / LINK TRAFFIC</option>
                                    <option value="DEAL UNDERWRITING">DEAL STRUCTURE / CRITICAL CAPITAL</option>
                                    <option value="PARTNER PROFILE">ACCOUNT MODIFICATION</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-xs font-black uppercase tracking-wider text-black mb-1">DIRECT SUMMARY BRIEF *</label>
                                <input required id="tkt-subject" type="text" placeholder="E.G., ENDPOINT REDIRECT FAILING ON IPV6" 
                                    class="w-full bg-white text-black font-black p-3 border-4 border-black focus:outline-none focus:bg-zinc-100 uppercase text-xs placeholder-zinc-400">
                            </div>

                            <div>
                                <label class="block text-xs font-black uppercase tracking-wider text-black mb-1">RAW SITUATIONAL INTEL *</label>
                                <textarea required id="tkt-message" rows="3" placeholder="PROVIDE FULL LOG DETAILS AND RAW TELEMETRY DATA HERE..." 
                                    class="w-full bg-white text-black font-black p-3 border-4 border-black focus:outline-none focus:bg-zinc-100 uppercase text-xs placeholder-zinc-400"></textarea>
                            </div>

                            <button type="submit" class="w-full bg-[#ff4800] hover:bg-black hover:text-[#ff4800] text-black font-black text-sm uppercase py-4 tracking-widest border-4 border-black transition-all">
                                INJECT SUPPORT TICKET TO LEDGER 📡
                            </button>
                        </form>
                    </div>

                    <!-- Dynamic Ticket Log Panel -->
                    <div class="border-t-4 border-black pt-6 mt-6 space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="font-black text-xs uppercase tracking-widest text-zinc-500">// TRANSMITTED TICKET LOG</span>
                            <span class="bg-black text-white font-mono text-[10px] px-2 py-0.5" id="ticket-count">ACTIVE DEPLOYS: 1</span>
                        </div>
                        <div id="dynamic-ticket-list" class="space-y-2 max-h-52 overflow-y-auto pr-1">
                            <!-- Injected dynamically -->
                        </div>
                    </div>
                </div>

                <!-- Direct Affiliate Manager Live Feed -->
                <div class="bg-black border-4 border-white p-4 space-y-4 font-mono text-xs">
                    <div class="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 bg-[#00ff66]"></span>
                            <span class="text-[#ff4800] font-black uppercase tracking-wider">MARCUS_DIRECTOR_HQ</span>
                        </div>
                        <span class="text-zinc-500 uppercase">DIRECT ENCRYPTED</span>
                    </div>

                    <div id="manager-chat-container" class="h-44 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                        <div class="text-zinc-500 text-center uppercase tracking-widest text-[10px] py-1">// HANDSHAKE INITIATED //</div>
                        <p class="leading-relaxed"><span class="text-[#00ff66] font-bold">MARCUS:</span> Partner welcome. If you are preparing high volume traffic nodes, transmit your specs here. I monitor this terminal directly.</p>
                    </div>

                    <div class="flex gap-2 pt-2 border-t border-zinc-800">
                        <input type="text" id="manager-chat-input" placeholder="PROMPT OPERATOR..." 
                            class="bg-zinc-950 text-white focus:outline-none p-3 border-2 border-white w-full uppercase placeholder-zinc-700 text-xs focus:border-[#ff4800]"
                            onkeydown="if(event.key === 'Enter') sendDirectMessage()">
                        <button onclick="sendDirectMessage()" class="bg-[#ff4800] hover:bg-white text-black font-black px-4 py-2 border-2 border-black transition-colors">SEND</button>
                    </div>
                </div>

            </div>
        </div>
    `;

    // Render original ticket logs
    updateTicketListUI();
}

// TRAINING VIDEO SECTOR LOGIC
function playTrainingVideo(vidId) {
    const video = moonshineSupportData.videos.find(v => v.id === vidId);
    if (!video) return;

    // Remove active highlight from all buttons
    document.querySelectorAll('.video-btn').forEach(btn => {
        btn.classList.remove('bg-[#ff4800]', 'text-black');
        btn.classList.add('bg-black', 'text-white');
    });

    // Set active style to target button
    const activeBtn = document.getElementById(`btn-${vidId}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-black', 'text-white');
        activeBtn.classList.add('bg-[#ff4800]', 'text-black');
    }

    // Swapping visual state
    const placeholder = document.getElementById('video-placeholder');
    const iframe = document.getElementById('main-video-iframe');
    
    if (placeholder && iframe) {
        placeholder.classList.add('hidden');
        iframe.classList.remove('hidden');
        iframe.src = video.url;
    }
}

// FAQ ACCORDION LOGIC
function toggleAccordion(idx) {
    const content = document.getElementById(`faq-answer-${idx}`);
    const arrow = document.getElementById(`faq-arrow-${idx}`);
    
    if (content && arrow) {
        const isHidden = content.classList.contains('hidden');
        
        // Close all accordions first
        moonshineSupportData.faqs.forEach((_, i) => {
            const otherContent = document.getElementById(`faq-answer-${i}`);
            const otherArrow = document.getElementById(`faq-arrow-${i}`);
            if (otherContent && otherArrow) {
                otherContent.classList.add('hidden');
                otherArrow.innerText = '+';
                otherArrow.classList.remove('text-white');
                otherArrow.classList.add('text-[#ff4800]');
            }
        });

        if (isHidden) {
            content.classList.remove('hidden');
            arrow.innerText = '-';
            arrow.classList.remove('text-[#ff4800]');
            arrow.classList.add('text-white');
        }
    }
}

// TICKET LOGS LOGIC
function submitNewTicket(event) {
    event.preventDefault();
    
    const category = document.getElementById('tkt-category').value;
    const subject = document.getElementById('tkt-subject').value.trim().toUpperCase();
    const message = document.getElementById('tkt-message').value.trim().toUpperCase();

    if (!subject || !message) return;

    const tktId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
        id: tktId,
        subject,
        category,
        status: "OPEN",
        timestamp: "Just now",
        messages: [
            { sender: "YOU", text: message }
        ]
    };

    tickets.unshift(newTicket);
    localStorage.setItem('moonshine_tickets', JSON.stringify(tickets));

    // Reset inputs
    document.getElementById('tkt-subject').value = '';
    document.getElementById('tkt-message').value = '';

    updateTicketListUI();
    simulateTicketResolution(tktId);
}

function updateTicketListUI() {
    const listContainer = document.getElementById('dynamic-ticket-list');
    const ticketCounter = document.getElementById('ticket-count');
    
    if (!listContainer) return;

    if (ticketCounter) {
        ticketCounter.innerText = `ACTIVE DEPLOYS: ${tickets.length}`;
    }

    listContainer.innerHTML = tickets.map(t => {
        let statusBadgeClass = "bg-green-100 text-green-800";
        if (t.status === "OPEN") statusBadgeClass = "bg-[#ff4800] text-black blink";
        if (t.status === "ASSIGNED") statusBadgeClass = "bg-blue-100 text-blue-800";

        return `
            <div class="border-2 border-black p-3 bg-white text-black space-y-1 text-xs">
                <div class="flex justify-between items-center">
                    <span class="font-black text-xs text-[#ff4800]">${t.id}</span>
                    <span class="text-[9px] font-mono text-zinc-500 uppercase">${t.timestamp}</span>
                </div>
                <div class="font-black text-sm tracking-tight leading-none uppercase truncate">${t.subject}</div>
                <div class="flex justify-between items-center pt-2">
                    <span class="text-[9px] bg-black text-white px-1.5 py-0.5 font-mono uppercase">${t.category}</span>
                    <span class="font-black text-[10px] px-1.5 py-0.5 border-2 border-black ${statusBadgeClass}">${t.status}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Simulate agent assignment and resolution to highlight real-time interactive fidelity
function simulateTicketResolution(ticketId) {
    setTimeout(() => {
        const tktIndex = tickets.findIndex(t => t.id === ticketId);
        if (tktIndex !== -1) {
            tickets[tktIndex].status = "ASSIGNED";
            tickets[tktIndex].timestamp = "1 min ago";
            updateTicketListUI();
            
            // Post direct system notification in partner chat too
            injectChatSystemNotification(`AGENT APPOINTED TO TARGET ${ticketId}. ANALYZING SPECIFICATIONS.`);
        }
    }, 4500);

    setTimeout(() => {
        const tktIndex = tickets.findIndex(t => t.id === ticketId);
        if (tktIndex !== -1) {
            tickets[tktIndex].status = "RESOLVED";
            tickets[tktIndex].timestamp = "Just resolved";
            tickets[tktIndex].messages.push({
                sender: "MARCUS (DIRECTOR)",
                text: "INTEL DEPLOYED. TARGET RESOLVED SUCCESSFULLY. ALL CHANNELS RETURNING 100% SUCCESS RATE."
            });
            updateTicketListUI();
            
            injectChatSystemNotification(`TARGET ${ticketId} STATUS: DEPLOYED_SUCCESS. CHECK LEDGER.`);
        }
    }, 12000);
}

// CHAT TERMINAL MECHANICS
function sendDirectMessage() {
    const input = document.getElementById('manager-chat-input');
    const container = document.getElementById('manager-chat-container');
    if (!input || !container) return;

    const message = input.value.trim().toUpperCase();
    if (!message) return;

    // Display user message
    container.innerHTML += `<p class="leading-relaxed"><span class="text-white font-bold">YOU:</span> ${message}</p>`;
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Realistic partner manager reply
    setTimeout(() => {
        let reply = "PROMPT ANALYZED. CONFIRM TARGET SPECS TO AUTHORIZE FURTHER PARAMETERS.";
        
        if (message.includes('COMMISSION') || message.includes('PAYOUT') || message.includes('PAY')) {
            reply = "DIRECT WALLET LEDGER PROTOCOLS DISPATCH ON FRIDAYS WITHOUT DEVIATION. ENSURE ACCURATE ROUTING PARAMS INSIDE ACC_SET.";
        } else if (message.includes('TRAFFIC') || message.includes('API') || message.includes('ENDPOINT')) {
            reply = "API PATHWAYS ARE SECURED WITH HIGH-SPEED SSH PARAMS. EXAMINE COMPONENT PHASE 2 FOR YOUR SPECIFIC SLUG ENDPOINT.";
        } else if (message.includes('HELP') || message.includes('ERROR') || message.includes('FAIL')) {
            reply = "SUBMIT A SECURE TICKET GATEWAY INSTANTLY WITH CORRESPONDING ERROR LOGS FOR SPEEDY INFRASTRUCTURE ASSESSMENT.";
        } else if (message.includes('DEAL') || message.includes('LEAD') || message.includes('CAPITAL')) {
            reply = "UNDERWRITING ENGINE CONFIRMS CLOSURE VELOCITY IN LESS THAN 48 HOURS. ENSURE RAW REVENUES ARE INTACT.";
        }

        container.innerHTML += `<p class="leading-relaxed"><span class="text-[#00ff66] font-bold">MARCUS:</span> ${reply}</p>`;
        container.scrollTop = container.scrollHeight;
    }, 1000);
}

function injectChatSystemNotification(text) {
    const container = document.getElementById('manager-chat-container');
    if (container) {
        container.innerHTML += `<p class="text-zinc-500 uppercase text-[9px] tracking-wider font-bold">// SYS_UPDATE: ${text}</p>`;
        container.scrollTop = container.scrollHeight;
    }
}

// SYSTEM MONITOR METRICS SIMULATION
function startSystemMonitor() {
    setInterval(() => {
        const latencyEl = document.getElementById('monitor-latency');
        if (latencyEl) {
            const randomLatency = Math.floor(8 + Math.random() * 8);
            latencyEl.innerText = `LATENCY: ${randomLatency}ms // ALL STATIONS GO`;
        }
    }, 4000);
}

// Manual element fallback binding support
function bindManualEvents() {
    // FAQ binds if present
    document.querySelectorAll('.faq-trigger').forEach((trigger, idx) => {
        trigger.addEventListener('click', () => toggleAccordion(idx));
    });
}