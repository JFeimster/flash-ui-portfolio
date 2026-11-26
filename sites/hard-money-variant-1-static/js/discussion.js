// Contextual Team Discussion Hub - Integrates seamlessly with Dynamic Edge Registry
// Programmatically injects and handles high-fidelity interactive chat, annotations, and deal tagging

(function() {
    // 1. STYLES INJECTION
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        /* Discussion Drawer UI Styling */
        #discussionDrawer {
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.8);
        }
        #discussionDrawer.open {
            transform: translateX(0);
        }
        .cyber-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .cyber-scrollbar::-webkit-scrollbar-track {
            background: #07090e;
        }
        .cyber-scrollbar::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 2px;
        }
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #bd00ff;
        }
        .avatar-glow-purple {
            box-shadow: 0 0 8px rgba(189, 0, 255, 0.4);
        }
        .avatar-glow-cyan {
            box-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
        }
        .avatar-glow-emerald {
            box-shadow: 0 0 8px rgba(5, 255, 196, 0.4);
        }
    `;
    document.head.appendChild(styleSheet);

    // 2. MOCK DATA & ACTIVE CONTEXT
    const teamMembers = [
        { name: "Sarah Connor", role: "Lead Underwriter", avatar: "SC", color: "cyber-purple", glow: "avatar-glow-purple" },
        { name: "Alex Mercer", role: "Capital Markets Director", avatar: "AM", color: "cyber-accent", glow: "avatar-glow-cyan" },
        { name: "Devon Vance", role: "Originations VP", avatar: "DV", color: "cyber-emerald", glow: "avatar-glow-emerald" }
    ];

    let discussions = [
        {
            id: 1,
            lenderId: 1, // Apex Velocity Capital
            messages: [
                { sender: "Sarah Connor", role: "Lead Underwriter", text: "Apex cleared the desk audit under 24 hours last week. Great option if speed index is critical.", time: "10:42 AM" },
                { sender: "Alex Mercer", role: "Capital Markets Director", text: "Agreed. Just note their rate deck is solid at 8.99% but points scale quick if sponsors lack track records.", time: "11:05 AM" }
            ]
        },
        {
            id: 2,
            lenderId: 2, // Fortress Commercial Trust
            messages: [
                { sender: "Devon Vance", role: "Originations VP", text: "Fortress is processing the mixed-use portfolio in NY. Strict structural parameters.", time: "Yesterday" },
                { sender: "Sarah Connor", role: "Lead Underwriter", text: "Ensure the raw land portion stays below 15% of collateral value or they will force a carve-out.", time: "Yesterday" }
            ]
        }
    ];

    let activeLenderContext = null; 

    // 3. UI GENERATION & INJECTION
    const drawerHtml = `
        <!-- Floating Discussion Toggle Button -->
        <button id="discussionToggle" class="fixed bottom-6 right-6 z-40 bg-[#0e131f] border border-cyber-purple/60 hover:border-cyber-accent text-slate-100 p-3.5 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(189,0,255,0.4)] transition-all duration-300 flex items-center justify-center">
            <span class="absolute -top-1 -right-1 flex h-4 w-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-purple opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-cyber-purple text-[9px] font-mono font-bold items-center justify-center text-white">!</span>
            </span>
            <svg class="w-6 h-6 text-cyber-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
            </svg>
        </button>

        <!-- Slide-out Sidebar Discussion Panel -->
        <div id="discussionDrawer" class="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#07090e]/95 border-l border-cyber-border/80 z-50 flex flex-col justify-between backdrop-blur-md">
            <!-- Header -->
            <div class="p-5 border-b border-cyber-border bg-black/40 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-cyber-purple animate-pulse"></span>
                    <h3 class="font-mono text-sm font-bold uppercase tracking-widest text-slate-200">COLLABORATION EDGE</h3>
                </div>
                <button id="discussionClose" class="text-slate-400 hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- Context Banner -->
            <div id="activeContextBanner" class="px-5 py-3 bg-cyber-card border-b border-cyber-border/40 flex flex-col gap-1.5">
                <span class="text-[10px] font-mono text-slate-500 uppercase">ACTIVE DISCUSSIONS SYSTEM</span>
                <div class="flex items-center justify-between">
                    <span id="contextTitle" class="text-xs font-mono font-bold text-cyber-accent">GLOBAL HANDSHAKE KERNEL</span>
                    <button id="clearContextBtn" class="hidden text-[10px] font-mono text-cyber-purple hover:text-white underline">Detach context</button>
                </div>
            </div>

            <!-- Messages List -->
            <div id="chatMessageList" class="flex-1 p-5 overflow-y-auto space-y-4 cyber-scrollbar">
                <!-- Programmatically populated messages go here -->
            </div>

            <!-- Quick Suggestions Tag Toolbar -->
            <div class="px-5 py-2 border-t border-cyber-border/30 bg-black/20 flex flex-wrap gap-1.5 items-center">
                <span class="text-[9px] font-mono text-slate-500 uppercase mr-1">Suggested Targets:</span>
                <button onclick="insertTag('@sarah')" class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/20 transition-all">@Sarah</button>
                <button onclick="insertTag('@alex')" class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/20 transition-all">@Alex</button>
                <button onclick="insertTag('@devon')" class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald hover:bg-cyber-emerald/20 transition-all">@Devon</button>
            </div>

            <!-- Input Form Box -->
            <form id="chatForm" onsubmit="submitChatMessage(event)" class="p-4 border-t border-cyber-border bg-[#0e131f] flex flex-col gap-3">
                <div class="relative">
                    <textarea id="chatInput" placeholder="Route a secure team note... Use @ name to target" required rows="2"
                        class="w-full bg-black/60 border border-cyber-border rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-accent resize-none placeholder-slate-500"></textarea>
                </div>
                <div class="flex justify-between items-center">
                    <button type="button" id="annotateTrigger" class="text-[11px] font-mono text-slate-400 hover:text-cyber-accent flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                        Attach Compare Queue
                    </button>
                    <button type="submit" class="bg-gradient-to-r from-cyber-purple to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white font-mono font-bold text-xs uppercase py-1.5 px-4 edge-clip tracking-wide flex items-center gap-1">
                        <span>SEND</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    `;

    // Inject drawer container elements
    const portal = document.createElement("div");
    portal.id = "discussionPortal";
    portal.innerHTML = drawerHtml;
    document.body.appendChild(portal);

    // 4. INTERACTION EVENT LISTENERS
    const toggleBtn = document.getElementById("discussionToggle");
    const closeBtn = document.getElementById("discussionClose");
    const drawer = document.getElementById("discussionDrawer");
    const clearCtxBtn = document.getElementById("clearContextBtn");
    const annotateTrigger = document.getElementById("annotateTrigger");

    toggleBtn.addEventListener("click", () => drawer.classList.add("open"));
    closeBtn.addEventListener("click", () => drawer.classList.remove("open"));

    clearCtxBtn.addEventListener("click", () => {
        setLenderContext(null);
    });

    annotateTrigger.addEventListener("click", () => {
        if (typeof compareList !== "undefined" && compareList.length > 0) {
            const input = document.getElementById("chatInput");
            const namesList = compareList.map(id => {
                const lender = lendersDatabase.find(l => l.id === id);
                return lender ? lender.name : "";
            }).filter(Boolean).join(", ");
            
            input.value = `Discussing Benchmark Package containing [${namesList}]: ` + input.value;
            input.focus();
        } else {
            alert("No active comparisons in Compare Queue. Please check 'Compare' on a registry lender card first.");
        }
    });

    // Capture "Get Terms" clicks or specific details clicks to change chat context automatically
    const originalOpenDetailsModal = window.openDetailsModal;
    window.openDetailsModal = function(lenderId) {
        if (originalOpenDetailsModal) {
            originalOpenDetailsModal(lenderId);
        }
        // Auto sync context to chat drawer
        setLenderContext(lenderId);
    };

    // Global toggle contextual lender updates
    window.setLenderContext = function(lenderId) {
        const titleEl = document.getElementById("contextTitle");
        const clearBtn = document.getElementById("clearContextBtn");

        if (!lenderId) {
            activeLenderContext = null;
            titleEl.innerText = "GLOBAL HANDSHAKE KERNEL";
            titleEl.className = "text-xs font-mono font-bold text-cyber-accent";
            clearBtn.classList.add("hidden");
        } else {
            const lender = lendersDatabase.find(l => l.id === lenderId);
            if (lender) {
                activeLenderContext = lender;
                titleEl.innerText = lender.name.toUpperCase();
                titleEl.className = "text-xs font-mono font-bold text-cyber-emerald";
                clearBtn.classList.remove("hidden");
                
                // Open drawer automatically when focused
                drawer.classList.add("open");
            }
        }
        renderChatMessages();
    };

    // Handle suggested target tagging
    window.insertTag = function(tag) {
        const input = document.getElementById("chatInput");
        input.value = tag + " " + input.value;
        input.focus();
    };

    // Render active discussion threads
    function renderChatMessages() {
        const feed = document.getElementById("chatMessageList");
        feed.innerHTML = "";

        // Collect matching messages
        let activeMessages = [];
        if (activeLenderContext) {
            const disc = discussions.find(d => d.lenderId === activeLenderContext.id);
            if (disc) {
                activeMessages = disc.messages;
            }
        } else {
            // Aggregate global messages or show base info
            discussions.forEach(d => {
                const lender = lendersDatabase.find(l => l.id === d.lenderId);
                const lenderName = lender ? lender.name : "System Source";
                d.messages.forEach(msg => {
                    activeMessages.push({
                        ...msg,
                        subhead: `Re: ${lenderName}`
                    });
                });
            });
        }

        if (activeMessages.length === 0) {
            feed.innerHTML = `
                <div class="py-12 text-center">
                    <svg class="w-8 h-8 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <p class="font-mono text-xs text-slate-500">NO SECURED COMMUNICATIONS ROUTED</p>
                    <p class="text-[10px] text-slate-600 mt-1">Start the thread below to broadcast to key teams.</p>
                </div>
            `;
            return;
        }

        activeMessages.forEach(msg => {
            const senderProfile = teamMembers.find(t => t.name === msg.sender) || {
                avatar: "SYS",
                color: "slate-500",
                glow: ""
            };

            const item = document.createElement("div");
            item.className = "flex gap-3 items-start border-b border-cyber-border/20 pb-3";
            item.innerHTML = `
                <div class="h-8 w-8 rounded bg-black border border-cyber-border/80 flex items-center justify-center text-xs font-mono font-bold text-slate-200 ${senderProfile.glow}">
                    ${senderProfile.avatar}
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-xs font-bold text-slate-200">${msg.sender}</span>
                            <span class="text-[9px] font-mono text-slate-500 uppercase ml-1.5">${msg.role || 'System'}</span>
                        </div>
                        <span class="text-[9px] font-mono text-slate-500">${msg.time}</span>
                    </div>
                    ${msg.subhead ? `<div class="text-[9px] font-mono text-cyber-accent uppercase tracking-wider mb-1 mt-0.5">${msg.subhead}</div>` : ""}
                    <p class="text-xs text-slate-400 mt-1 leading-relaxed font-light">${msg.text}</p>
                </div>
            `;
            feed.appendChild(item);
        });

        // Scroll to bottom
        feed.scrollTop = feed.scrollHeight;
    }

    // Submit user message
    window.submitChatMessage = function(e) {
        e.preventDefault();
        const input = document.getElementById("chatInput");
        const val = input.value.trim();
        if (!val) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newMsg = {
            sender: "Operator (You)",
            role: "Deal Sponsor Principal",
            text: val,
            time: timestamp
        };

        const targetLenderId = activeLenderContext ? activeLenderContext.id : 1; // Default to Apex if no context select

        let disc = discussions.find(d => d.lenderId === targetLenderId);
        if (!disc) {
            disc = { lenderId: targetLenderId, messages: [] };
            discussions.push(disc);
        }

        disc.messages.push(newMsg);
        renderChatMessages();

        input.value = "";

        // Simulate interactive smart underwriter reply
        setTimeout(() => {
            const responders = [
                {
                    sender: "Sarah Connor",
                    role: "Lead Underwriter",
                    text: `Packet trace logged. I'll flag this structured run on ${activeLenderContext ? activeLenderContext.name : 'Apex Velocity'} to check for leverage alignment.`
                },
                {
                    sender: "Alex Mercer",
                    role: "Capital Markets Director",
                    text: "Reviewing spatial point allocations now. We need the debt-yield ratio from the local market tracker before committing."
                }
            ];

            const replyData = responders[Math.floor(Math.random() * responders.length)];
            const autoReply = {
                sender: replyData.sender,
                role: replyData.role,
                text: replyData.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            disc.messages.push(autoReply);
            renderChatMessages();
        }, 1800);
    };

    // Init display
    renderChatMessages();

})();