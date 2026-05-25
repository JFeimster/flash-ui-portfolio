<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --emerald: #10b981;
            --black: #010101;
            --dark-gray: #0a0a0a;
            --border: #1a1a1a;
        }

        body {
            background-color: var(--black);
            color: var(--emerald);
            font-family: 'JetBrains Mono', monospace;
            overflow-x: hidden;
        }

        .scanline {
            width: 100%;
            height: 100px;
            z-index: 10;
            background: linear-gradient(0deg, rgba(16, 185, 129, 0) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(16, 185, 129, 0) 100%);
            opacity: 0.1;
            position: absolute;
            bottom: 100%;
            animation: scanline 8s linear infinite;
            pointer-events: none;
        }

        @keyframes scanline {
            0% { bottom: 100%; }
            100% { bottom: -100px; }
        }

        .terminal-grid {
            background-image: radial-gradient(var(--border) 1px, transparent 1px);
            background-size: 30px 30px;
        }

        .bento-card {
            background: rgba(10, 10, 10, 0.8);
            border: 1px solid var(--border);
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .bento-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 0%;
            background: var(--emerald);
            transition: height 0.3s ease;
        }

        .bento-card:hover::before {
            height: 100%;
        }

        .asset-card {
            border: 1px solid var(--border);
            background: #050505;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .asset-card:hover {
            border-color: var(--emerald);
            background: rgba(16, 185, 129, 0.02);
        }

        .asset-card.selected {
            border-color: var(--emerald);
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
        }

        .glitch-header {
            text-shadow: 2px 0 #000, -2px 0 #10b98122;
            letter-spacing: 0.2em;
        }

        .btn-compile {
            background: var(--emerald);
            color: var(--black);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }

        .btn-compile:disabled {
            background: #1a1a1a;
            color: #444;
            cursor: not-allowed;
        }

        .console-log {
            font-size: 10px;
            color: var(--emerald);
            opacity: 0.8;
            line-height: 1.6;
        }

        input, select {
            background: #050505 !important;
            border: 1px solid var(--border) !important;
            color: var(--emerald) !important;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--black); }
        ::-webkit-scrollbar-thumb { background: var(--border); }

        @keyframes blink {
            50% { opacity: 0; }
        }
        .cursor { animation: blink 1s infinite; }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8 terminal-grid relative">
    <div class="scanline"></div>

    <!-- Header Section -->
    <header class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6">
        <div class="relative">
            <div class="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Asset Distribution Protocol // 88-DIST</div>
            <h1 class="text-3xl md:text-4xl font-bold glitch-header italic">
                DIGITAL ASSET <span class="text-white">COMPILER</span>
            </h1>
            <div class="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
                <span>AUTH: ADMIN_LEVEL_4</span>
                <span class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_var(--emerald)]"></span> VAULT SECURE</span>
                <span>NODE: DIST-HUB-01</span>
            </div>
        </div>
        <div class="text-right hidden md:block">
            <div class="text-xs opacity-40">RESOURCES REPOSITORY</div>
            <div class="text-lg font-bold">V.1.0.4-DIST</div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left: Configuration & Templates -->
        <section class="lg:col-span-8 space-y-6">
            <div class="bento-card p-6">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-6 bg-emerald-500"></div>
                        <h2 class="text-lg font-bold uppercase tracking-wider">Asset Selection</h2>
                    </div>
                    <span class="text-[10px] opacity-40 italic">4 TEMPLATES AVAILABLE</span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Template Item -->
                    <div class="asset-card p-4 rounded group" onclick="selectTemplate(this, 'MC-DECK-24')">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-2 bg-emerald-500/10 rounded">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="1.5"></path></svg>
                            </div>
                            <span class="text-[9px] border border-emerald-500/30 px-2 py-0.5 rounded uppercase">Deck</span>
                        </div>
                        <h3 class="font-bold text-sm text-emerald-100 group-hover:text-emerald-400 transition-colors">Strategic Pitch Deck</h3>
                        <p class="text-[10px] opacity-50 mt-1 uppercase">v4.0.2 // investor-ready.pptx</p>
                    </div>

                    <div class="asset-card p-4 rounded group" onclick="selectTemplate(this, 'MC-BAN-728')">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-2 bg-emerald-500/10 rounded">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="1.5"></path></svg>
                            </div>
                            <span class="text-[9px] border border-emerald-500/30 px-2 py-0.5 rounded uppercase">Banner</span>
                        </div>
                        <h3 class="font-bold text-sm text-emerald-100 group-hover:text-emerald-400 transition-colors">Affiliate Leaderboard</h3>
                        <p class="text-[10px] opacity-50 mt-1 uppercase">728x90 px // dynamic-id.png</p>
                    </div>

                    <div class="asset-card p-4 rounded group" onclick="selectTemplate(this, 'MC-BAN-SQ')">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-2 bg-emerald-500/10 rounded">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" stroke-width="1.5"></path></svg>
                            </div>
                            <span class="text-[9px] border border-emerald-500/30 px-2 py-0.5 rounded uppercase">Banner</span>
                        </div>
                        <h3 class="font-bold text-sm text-emerald-100 group-hover:text-emerald-400 transition-colors">Social Engagement Sq</h3>
                        <p class="text-[10px] opacity-50 mt-1 uppercase">1080x1080 px // marketing.png</p>
                    </div>

                    <div class="asset-card p-4 rounded group" onclick="selectTemplate(this, 'MC-LEGAL-REF')">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-2 bg-emerald-500/10 rounded">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="1.5"></path></svg>
                            </div>
                            <span class="text-[9px] border border-emerald-500/30 px-2 py-0.5 rounded uppercase">Legal</span>
                        </div>
                        <h3 class="font-bold text-sm text-emerald-100 group-hover:text-emerald-400 transition-colors">Referral Agreement</h3>
                        <p class="text-[10px] opacity-50 mt-1 uppercase">standard // terms-signed.pdf</p>
                    </div>
                </div>
            </div>

            <div class="bento-card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-2 h-6 bg-emerald-500"></div>
                    <h2 class="text-lg font-bold uppercase tracking-wider">Compilation Parameters</h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-[10px] uppercase mb-2 opacity-60">Target Partner ID</label>
                        <input type="text" id="targetId" placeholder="MC-XXX-XXXX" class="w-full p-3 text-sm focus:outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="block text-[10px] uppercase mb-2 opacity-60">Custom Tag (Optional)</label>
                        <input type="text" id="customTag" placeholder="E.G. CAMPAIGN_SUMMER" class="w-full p-3 text-sm focus:outline-none focus:border-emerald-500">
                    </div>
                    <div class="md:col-span-2">
                        <button id="compileBtn" onclick="runCompiler()" class="btn-compile w-full py-4 flex items-center justify-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            Execute Asset Compilation
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Right: Real-time Terminal Output -->
        <section class="lg:col-span-4 flex flex-col gap-6">
            <div class="bento-card flex-grow flex flex-col p-6">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-2 h-6 bg-white"></div>
                    <h2 class="text-lg font-bold uppercase tracking-wider text-white">System Logs</h2>
                </div>
                
                <div id="terminalConsole" class="flex-grow bg-black/50 border border-emerald-500/20 rounded p-4 font-mono overflow-y-auto space-y-2">
                    <div class="console-log">[SYS] DIST_PROTOCOL READY...</div>
                    <div class="console-log">[SYS] AWAITING INPUT PARAMETERS...<span class="cursor">_</span></div>
                </div>
            </div>

            <div id="downloadCard" class="bento-card p-6 opacity-30 transition-opacity">
                <h3 class="text-xs font-bold uppercase mb-4 opacity-60 italic">Compiled Output</h3>
                <div class="bg-emerald-500/5 border border-dashed border-emerald-500/30 rounded p-4 flex flex-col items-center gap-3">
                    <div id="fileName" class="text-[11px] font-bold">---.ZIP</div>
                    <a id="downloadBtn" href="#" class="w-full text-center py-2 border border-emerald-500 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500 hover:text-black transition-all pointer-events-none">DOWNLOAD ARCHIVE</a>
                </div>
            </div>
        </section>
    </main>

    <script>
        let selectedTemplateId = null;

        function selectTemplate(element, id) {
            document.querySelectorAll('.asset-card').forEach(card => card.classList.remove('selected'));
            element.classList.add('selected');
            selectedTemplateId = id;
            log(`[USER] SELECTED TEMPLATE: ${id}`);
        }

        function log(message) {
            const consoleObj = document.getElementById('terminalConsole');
            const newLog = document.createElement('div');
            newLog.className = 'console-log';
            const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
            newLog.innerText = `[${timestamp}] ${message}`;
            consoleObj.appendChild(newLog);
            consoleObj.scrollTop = consoleObj.scrollHeight;
        }

        async function runCompiler() {
            const partnerId = document.getElementById('targetId').value.toUpperCase();
            
            if (!selectedTemplateId) {
                log(`[ERROR] NO TEMPLATE SELECTED`);
                return;
            }
            if (!partnerId) {
                log(`[ERROR] PARTNER_ID REQUIRED FOR INJECTION`);
                return;
            }

            const btn = document.getElementById('compileBtn');
            btn.disabled = true;
            btn.innerText = "COMPILING SOURCE...";

            log(`[INIT] ACCESSING TEMPLATE: ${selectedTemplateId}`);
            await wait(800);
            log(`[PROC] INJECTING METADATA FOR ${partnerId}`);
            await wait(1200);
            log(`[PROC] RE-RENDERING ASSET LAYERS...`);
            await wait(1000);
            log(`[PROC] PACKAGING ENCRYPTED BLOB...`);
            await wait(1000);
            log(`[SUCCESS] ARCHIVE GENERATED SUCCESSFULLY`);

            const downloadCard = document.getElementById('downloadCard');
            const downloadBtn = document.getElementById('downloadBtn');
            const fileNameDisp = document.getElementById('fileName');

            downloadCard.style.opacity = "1";
            fileNameDisp.innerText = `${selectedTemplateId}_${partnerId}.ZIP`;
            downloadBtn.classList.remove('pointer-events-none');
            
            btn.disabled = false;
            btn.innerText = "Execute Asset Compilation";
        }

        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Initialize clock in logs
        setInterval(() => {
            if (Math.random() > 0.98) log(`[SYS] HEARTBEAT: NODE DIST-HUB-01 ACTIVE`);
        }, 5000);
    </script>
</body>
</html></html>