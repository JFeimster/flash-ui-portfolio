// MOONSHINE CAPITAL PARTNERS: VIDEO ACCORDION & LIVE SUPPORT TERMINAL INTEGRATION v1.5
// DESIGN SPEC: NEO-BRUTALIST / PRISM LOGIC BLACK-VOLT-PINK AESTHETIC

(function() {
    // Web Audio API Synthesizer for Retro Brutalist Feedback
    let audioCtx = null;
    function playBeep(freq, duration, type = 'square', volume = 0.1) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Web Audio blocked or unsupported
        }
    }

    // Dynamic Style Injection for the Terminal Component
    function injectStyles() {
        const styleId = "moonshine-terminal-styles";
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            .terminal-glow {
                box-shadow: 0 0 15px rgba(226, 255, 0, 0.2);
            }
            .chat-msg-entry {
                animation: slideInUp 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
            }
            @keyframes slideInUp {
                from { transform: translateY(10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .accordion-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.2s cubic-bezier(0, 1, 0, 1);
            }
            .accordion-content.open {
                max-height: 1000px;
                transition: max-height 0.3s cubic-bezier(1, 0, 1, 0);
            }
            .btn-blink-active {
                animation: fastBlink 0.3s infinite alternate;
            }
            @keyframes fastBlink {
                0% { background-color: #E2FF00; color: #000; }
                100% { background-color: #000; color: #E2FF00; }
            }
        `;
        document.head.appendChild(style);
    }

    // Master Data Store for Masterclass and Support Logs
    const masterclassData = {
        videos: [
            {
                id: "vid-1",
                title: "01 // PIPELINE INGESTION ARCHITECTURE",
                duration: "08:42",
                desc: "Deep dive into the Moonshine routing core. Understand high-speed tracking cookies, server-to-server postbacks, and transaction attribution hooks.",
                streamUrl: "Ingestion Engine status: operational",
                fileSize: "142 MB"
            },
            {
                id: "vid-2",
                title: "02 // CONVERTING HIGH-VOLUME CORPORATE DEBT",
                duration: "14:15",
                desc: "How to qualify targets seeking $5M - $20M+ liquidity profiles. Positioning bridge capital offerings to bypass standard banking resistance layers.",
                streamUrl: "Underwriting rules: loaded",
                fileSize: "210 MB"
            },
            {
                id: "vid-3",
                title: "03 // DYNAMIC SETTLEMENTS & USDC LIQUIDITY",
                duration: "10:05",
                desc: "Comprehensive onboarding for payout customization. Setup immediate wire routing structures or high-velocity stablecoin transaction endpoints.",
                streamUrl: "USDC clearance ledger: verified",
                fileSize: "165 MB"
            },
            {
                id: "vid-4",
                title: "04 // EXPLOITING THE DYNAMIC ASSET ENGINE",
                duration: "07:50",
                desc: "Utilize real-time term sheet analytics metrics to scale outbound targeted performance flows automatically.",
                streamUrl: "API integration framework: ready",
                fileSize: "98 MB"
            }
        ],
        faqs: [
            {
                question: "WHAT IS THE ABSOLUTE MINIMUM SETTLEMENT THRESHOLD?",
                answer: "ZERO MINIMUMS. WE DO NOT LOCK YOUR HARD-EARNED INFLOWS. ONCE THE PIPELINE LEDGER SECURES AUDITED TRANSACTIONS, DISPATCHES TRIGGER WITHIN 24 BUSINESS HOURS."
            },
            {
                question: "HOW LONG DO CONVERSION COOKIES PERSIST ON THE INGESTION ENGINE?",
                answer: "COOKIES PERSIST FOR 365 CALENDAR DAYS. USER IDENTIFICATION ATTRIBUTION REMAINS LOCKED TO YOUR UNIQUE CODENAME TAG EXCLUSIVELY."
            },
            {
                question: "CAN WE MERGE EXPORTED LEADS DIRECTLY VIA MOONSHINE REWRITE API?",
                answer: "YES. ACCESS THE SYSTEM STATUS LEDGER IN THE FOOTER TO DEPLOY RAW JSON DIRECTLY INTO THE INGESTION API PORT."
            }
        ],
        botReplies: [
            "DEVIATION REPORT ANALYZED. EXECUTING SYSTEM OPTIMIZATION CODES.",
            "ALERT: HIGH LIQUIDITY FLOW ENCOUNTERED. PROGRAM MANAGER NOTIFIED.",
            "DIRECT ACCESS WIRE ESTABLISHED. INPUT NEXT CODENAME FOR PIPELINE INGESTION.",
            "ROUTING LOGS VERIFIED. ALL COOKIES RECONCILED. PREPARE PORTAL COMMISSIONS.",
            "TECHNICAL DISPATCH DEPLOYED. STANDBY BY THE LEDGER CONSOLE."
        ]
    };

    // UI HTML Template Construction
    function getHTMLTemplate() {
        return `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-7xl mx-auto mt-8 mb-12">
            
            <!-- Left Side: Interactive Video Masterclass Console (7 Columns) -->
            <section class="lg:col-span-7 bg-white brutalist-border brutalist-shadow-black p-6 flex flex-col justify-between">
                <div>
                    <!-- Header -->
                    <div class="border-b-4 border-black pb-4 mb-6 flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <span class="text-xs font-black uppercase bg-black text-[#E2FF00] px-2 py-0.5">// ACADEMY CORE</span>
                            <h3 class="text-2xl md:text-3xl font-black mt-1">AFFILIATE MASTERCLASS</h3>
                        </div>
                        <span class="text-xs font-mono font-bold bg-[#FF0055] text-white px-2 py-1 brutalist-border border-black">LIVE FEED ACTIVE</span>
                    </div>

                    <!-- Simulated Visual Video Player / Audio Visualizer Canvas -->
                    <div class="bg-black brutalist-border p-1 relative overflow-hidden mb-6 group">
                        <div class="w-full aspect-video bg-neutral-900 flex flex-col items-center justify-center relative p-4">
                            <!-- Visualizer Background -->
                            <canvas id="terminal-visualizer" class="absolute inset-0 w-full h-full opacity-60 pointer-events-none"></canvas>
                            
                            <!-- Video Metadata Overlay -->
                            <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-10 font-mono text-[10px] text-gray-400">
                                <span class="bg-black/80 px-2 py-0.5 border border-[#E2FF00] text-[#E2FF00]" id="player-feed-tag">SOURCE: STREAM_01_INGESTION</span>
                                <span class="bg-black/80 px-2 py-0.5 border border-black" id="player-fps">60.0 FPS // LIVE</span>
                            </div>

                            <!-- Central Play Button / Playback State -->
                            <div class="z-10 flex flex-col items-center text-center">
                                <button id="visualizer-play-btn" class="w-16 h-16 bg-[#E2FF00] hover:bg-[#FF0055] text-black hover:text-white brutalist-border rounded-full flex items-center justify-center transition-all duration-100 shadow-lg transform active:scale-95">
                                    <span id="play-icon" class="text-2xl font-black ml-1">▶</span>
                                </button>
                                <span class="text-white font-black uppercase tracking-widest text-sm mt-4 bg-black px-3 py-1 border border-white" id="player-title">01 // PIPELINE INGESTION ARCHITECTURE</span>
                                <span class="text-[#E2FF00] font-mono text-xs mt-2" id="player-status">&lt; READY TO SIMULATE COMPRESSION &gt;</span>
                            </div>

                            <!-- Bottom Progress Bar -->
                            <div class="absolute bottom-0 left-0 right-0 h-2 bg-neutral-800 pointer-events-auto cursor-pointer" id="player-progress-bar">
                                <div id="player-progress-fill" class="h-full bg-[#E2FF00] w-0 transition-all duration-150"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Video Selector Accordion Block -->
                    <div class="flex flex-col gap-3" id="video-playlist">
                        ${masterclassData.videos.map((vid, idx) => `
                            <button data-id="${vid.id}" class="video-accordion-trigger w-full text-left brutalist-border bg-white text-black p-4 flex justify-between items-center hover:bg-gray-50 transition-all cursor-pointer ${idx === 0 ? 'bg-[#fafdf0] border-l-[12px] border-l-[#E2FF00]' : ''}">
                                <div class="flex-1 pr-4">
                                    <span class="text-xs font-mono font-bold text-gray-500 uppercase block mb-1">MODULE 0${idx + 1} (${vid.duration})</span>
                                    <span class="text-md md:text-lg font-black uppercase tracking-tight block">${vid.title}</span>
                                    <p class="accordion-desc text-xs text-gray-600 font-semibold mt-2 hidden leading-relaxed">${vid.desc}</p>
                                </div>
                                <span class="w-10 h-10 flex items-center justify-center font-black bg-black text-[#E2FF00] text-sm brutalist-border border-black flex-shrink-0 group-hover:bg-[#FF0055]">
                                    →
                                </span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="border-t-4 border-black pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span class="text-xs font-black uppercase tracking-wider text-gray-500">// HANDBOOK MANUAL RESOURCE SUITE v1.2</span>
                    <button id="download-handbook-btn" class="w-full sm:w-auto px-6 py-4 brutalist-btn bg-black text-white hover:text-[#E2FF00] flex items-center justify-center gap-2">
                        📁 DOWNLOAD ALL DOCUMENTATION (42MB)
                    </button>
                </div>
            </section>

            <!-- Right Side: FAQ Dropdowns & Direct Support Terminal (5 Columns) -->
            <section class="lg:col-span-5 flex flex-col gap-6 w-full">
                
                <!-- FAQ Accordion Module -->
                <div class="bg-white p-6 brutalist-border brutalist-shadow-pink">
                    <div class="border-b-4 border-black pb-4 mb-4">
                        <span class="text-xs font-black uppercase bg-[#FF0055] text-white px-2 py-0.5">COMPLIANCE PROTOCOL</span>
                        <h4 class="text-2xl font-black mt-1">PROGRAM KNOWLEDGE</h4>
                    </div>

                    <div class="flex flex-col gap-3">
                        ${masterclassData.faqs.map((faq, idx) => `
                            <div class="faq-item brutalist-border bg-white">
                                <button class="faq-trigger w-full text-left p-4 font-black uppercase text-sm md:text-md flex justify-between items-center bg-black text-white hover:text-[#E2FF00] transition-colors">
                                    <span>${faq.question}</span>
                                    <span class="faq-icon text-lg font-black ml-2">+</span>
                                </button>
                                <div class="accordion-content bg-white">
                                    <div class="p-4 border-t-4 border-black font-semibold text-xs md:text-sm text-gray-800 leading-relaxed bg-[#fbfbfb]">
                                        ${faq.answer}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Aggressive Support Terminal Live Chat -->
                <div class="bg-black text-[#E2FF00] p-6 brutalist-border brutalist-shadow-black flex flex-col justify-between min-h-[420px]">
                    <div>
                        <!-- Chat Header -->
                        <div class="flex justify-between items-center border-b border-[#E2FF00] pb-3 mb-4">
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 bg-red-500 rounded-none border border-[#E2FF00] live-blink"></span>
                                <h4 class="text-md font-black uppercase tracking-wider text-white">OPS CONSOLE v3.4</h4>
                            </div>
                            <span class="text-[10px] font-mono bg-[#E2FF00] text-black px-1.5 py-0.5 font-bold">DIRECT CHANNEL</span>
                        </div>

                        <!-- System Warning -->
                        <div class="bg-neutral-900 border border-[#FF0055] p-3 text-xs font-mono text-white mb-4">
                            <span class="text-[#FF0055] font-black">[WARNING: SECURE PORTAL]</span>
                            <p class="text-[11px] text-gray-400 mt-1 leading-normal">ANY INGESTION FAILS OR DEVIATION REPORTS FILED HERE GO DIRECTLY TO ON-CALL LIQUIDITY ENGINEERS.</p>
                        </div>

                        <!-- Messages Stream -->
                        <div id="terminal-stream" class="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-2 text-xs font-mono mb-4">
                            <div class="text-gray-400 text-[10px] select-none">// SESSION INITIALIZED AT ${new Date().toLocaleTimeString()}</div>
                            <div class="chat-msg-entry">
                                <span class="text-white font-black">[PROGRAM_MANAGER]:</span>
                                <span class="text-gray-300">SYSTEM READY FOR TARGET INPUTS. SECURE COMMISSIONS ENGINE STABILIZED. FEEDBACK DISPATCH STREAM OPEN.</span>
                            </div>
                        </div>
                    </div>

                    <!-- Direct Chat Input & Controls -->
                    <div>
                        <div class="flex gap-2">
                            <input type="text" id="terminal-chat-input" placeholder="ENTER MESSAGE OR COMMAND..." class="w-full bg-neutral-900 border-2 border-[#E2FF00] text-white p-3 font-mono text-xs uppercase focus:outline-none focus:bg-neutral-800">
                            <button id="terminal-chat-send" class="px-5 bg-[#E2FF00] text-black hover:bg-[#FF0055] hover:text-white font-black text-xs uppercase brutalist-border border-[#E2FF00] transition-colors">
                                SUBMIT
                            </button>
                        </div>
                        <div class="flex justify-between items-center mt-3 text-[9px] font-mono text-gray-500">
                            <span>ROUTE: DISPATCH_DEVIATION_CORE_1</span>
                            <span>CTRL+ENTER TO DISPATCH</span>
                        </div>
                    </div>
                </div>

            </section>
        </div>
        `;
    }

    // Interactive Core Initializer
    function initializeTerminal() {
        injectStyles();
        
        // Find or build containing element
        let targetContainer = document.getElementById("video-accordion-terminal");
        if (!targetContainer) {
            // If the element doesn't exist, we create a container after the main wizard grid to seamlessly enhance the UX
            const mainGrid = document.querySelector("main");
            if (mainGrid) {
                targetContainer = document.createElement("div");
                targetContainer.id = "video-accordion-terminal";
                targetContainer.className = "w-full px-4 md:px-0";
                mainGrid.parentNode.insertBefore(targetContainer, mainGrid.nextSibling);
            } else {
                return; // Fallback if structure deviates completely
            }
        }

        targetContainer.innerHTML = getHTMLTemplate();

        // Canvas Visualizer Variables
        const canvas = document.getElementById("terminal-visualizer");
        const ctx = canvas ? canvas.getContext("2d") : null;
        let animationFrameId = null;
        let isPlaying = false;
        let playProgress = 0;
        let activeVideoIndex = 0;

        // Resize Canvas to fit simulated screen
        function resizeCanvas() {
            if (!canvas) return;
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Simulated Sound Analyzer Visualizer loop
        function drawVisualizer() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const sliceWidth = canvas.width / 40;
            const time = Date.now() * 0.004;

            for (let i = 0; i < 40; i++) {
                let amplitude = isPlaying ? Math.sin(time + i * 0.15) * 45 + 50 : Math.sin(i * 0.1) * 3 + 4;
                if (isPlaying && Math.random() > 0.85) amplitude *= 1.35; // raw jitter effect

                ctx.fillStyle = isPlaying ? (i % 2 === 0 ? "#E2FF00" : "#FF0055") : "#333333";
                
                // Draw Raw blocky bar chart spectrums (brutalist vibe)
                const barHeight = Math.max(2, (amplitude / 100) * (canvas.height - 40));
                const x = i * sliceWidth + 2;
                const y = canvas.height - barHeight - 10;
                
                ctx.fillRect(x, y, sliceWidth - 4, barHeight);
                
                // Dot trails
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(x, y - 4, sliceWidth - 4, 2);
            }

            if (isPlaying) {
                playProgress += 0.15;
                if (playProgress >= 100) {
                    playProgress = 0;
                    togglePlayback(false);
                    playBeep(440, 0.1, "sine");
                }
                const progressFill = document.getElementById("player-progress-fill");
                if (progressFill) progressFill.style.width = `${playProgress}%`;
            }

            animationFrameId = requestAnimationFrame(drawVisualizer);
        }

        // Playback Management
        function togglePlayback(forceState = null) {
            isPlaying = forceState !== null ? forceState : !isPlaying;
            const playIcon = document.getElementById("play-icon");
            const playerStatus = document.getElementById("player-status");
            const playBtn = document.getElementById("visualizer-play-btn");

            if (isPlaying) {
                playIcon.innerText = "■";
                playerStatus.innerText = "< PIPELINE DECOMPRESSION IN PROGRESS... >";
                playBtn.classList.add("btn-blink-active");
                playBeep(600, 0.15, "square");
                setTimeout(() => playBeep(850, 0.1, "sawtooth"), 100);
            } else {
                playIcon.innerText = "▶";
                playerStatus.innerText = "< STREAM SUSPENDED >";
                playBtn.classList.remove("btn-blink-active");
                playBeep(250, 0.25, "sawtooth");
            }
        }

        const playBtn = document.getElementById("visualizer-play-btn");
        if (playBtn) {
            playBtn.addEventListener("click", () => togglePlayback());
        }

        // ProgressBar interaction
        const progressBar = document.getElementById("player-progress-bar");
        if (progressBar) {
            progressBar.addEventListener("click", (e) => {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                playProgress = (clickX / rect.width) * 100;
                const progressFill = document.getElementById("player-progress-fill");
                if (progressFill) progressFill.style.width = `${playProgress}%`;
                playBeep(500, 0.05, "sine");
            });
        }

        // Video Playlist Accordion Interactivity
        const playlistTriggers = document.querySelectorAll(".video-accordion-trigger");
        playlistTriggers.forEach((trigger, index) => {
            trigger.addEventListener("click", () => {
                playBeep(520, 0.08, "sine");

                // Toggle class indicators on triggers
                playlistTriggers.forEach(t => {
                    t.classList.remove("bg-[#fafdf0]", "border-l-[12px]", "border-l-[#E2FF00]");
                    const desc = t.querySelector(".accordion-desc");
                    if (desc) desc.classList.add("hidden");
                });

                trigger.classList.add("bg-[#fafdf0]", "border-l-[12px]", "border-l-[#E2FF00]");
                const activeDesc = trigger.querySelector(".accordion-desc");
                if (activeDesc) activeDesc.classList.remove("hidden");

                // Update Visualizer details
                activeVideoIndex = index;
                const targetVid = masterclassData.videos[index];
                document.getElementById("player-title").innerText = targetVid.title;
                document.getElementById("player-feed-tag").innerText = `SOURCE: STREAM_0${index + 1}_${targetVid.id.toUpperCase()}`;
                
                // Reset Video Progress
                playProgress = 0;
                const progressFill = document.getElementById("player-progress-fill");
                if (progressFill) progressFill.style.width = `0%`;

                // Auto-start playback simulation on selection
                togglePlayback(true);
            });
        });

        // Toggle first accordion description to open on load
        if (playlistTriggers[0]) {
            const initialDesc = playlistTriggers[0].querySelector(".accordion-desc");
            if (initialDesc) initialDesc.classList.remove("hidden");
        }

        // FAQ Accoridon Toggle
        const faqTriggers = document.querySelectorAll(".faq-trigger");
        faqTriggers.forEach(trigger => {
            trigger.addEventListener("click", () => {
                const content = trigger.nextElementSibling;
                const icon = trigger.querySelector(".faq-icon");
                const isOpen = content.classList.contains("open");

                // Close all FAQs first
                document.querySelectorAll(".accordion-content").forEach(c => {
                    c.classList.remove("open");
                    const triggerBtn = c.previousElementSibling;
                    if (triggerBtn) {
                        const triggerIcon = triggerBtn.querySelector(".faq-icon");
                        if (triggerIcon) triggerIcon.innerText = "+";
                    }
                });

                if (!isOpen) {
                    content.classList.add("open");
                    if (icon) icon.innerText = "−";
                    playBeep(320, 0.05, "sine");
                } else {
                    if (icon) icon.innerText = "+";
                    playBeep(240, 0.05, "sine");
                }
            });
        });

        // Chat Terminal Logic
        const chatInput = document.getElementById("terminal-chat-input");
        const chatSend = document.getElementById("terminal-chat-send");
        const chatStream = document.getElementById("terminal-stream");

        function addMessageToStream(sender, text, isUser = false) {
            const entry = document.createElement("div");
            entry.className = "chat-msg-entry";
            if (isUser) {
                entry.innerHTML = `<span class="text-[#E2FF00] font-black">[YOU]:</span> <span class="text-white uppercase">${text}</span>`;
            } else {
                entry.innerHTML = `<span class="text-[#FF0055] font-black">[${sender}]:</span> <span class="text-gray-300 uppercase">${text}</span>`;
            }
            if (chatStream) {
                chatStream.appendChild(entry);
                chatStream.scrollTop = chatStream.scrollHeight;
            }
        }

        function dispatchChatMessage() {
            if (!chatInput) return;
            const text = chatInput.value.trim();
            if (text === "") return;

            playBeep(800, 0.05, "square");
            addMessageToStream("USER", text, true);
            chatInput.value = "";

            // Simulate immediate terminal response
            setTimeout(() => {
                playBeep(500, 0.08, "sawtooth");
                const replies = masterclassData.botReplies;
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                addMessageToStream("SYSTEM_DISPATCH", randomReply, false);
            }, 800 + Math.random() * 600);
        }

        if (chatSend) {
            chatSend.addEventListener("click", dispatchChatMessage);
        }
        if (chatInput) {
            chatInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    dispatchChatMessage();
                }
            });
        }

        // Quick Download Resource button logic
        const downloadBtn = document.getElementById("download-handbook-btn");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", () => {
                playBeep(900, 0.3, "sine");
                alert("[SYSTEM TRANSACTION COMPLETED]\nMOONSHINE_CAPITAL_COMPLIANCE_PACK_V1.2.ZIP DEPLOYED TO TARGET DIRECTORY.");
            });
        }

        // Initialize Loop
        drawVisualizer();
    }

    // Auto load terminal upon compilation completion
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeTerminal);
    } else {
        initializeTerminal();
    }
})();