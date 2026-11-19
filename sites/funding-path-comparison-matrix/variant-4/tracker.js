(function() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracker);
    } else {
        initTracker();
    }

    function initTracker() {
        const container = document.querySelector('.max-w-7xl');
        if (!container) return;

        // 1. Create Tracker Section Layout
        const trackerSection = document.createElement('div');
        trackerSection.id = 'neo-funding-tracker';
        trackerSection.className = 'mt-16 space-y-8 border-t-4 border-black pt-12';
        
        trackerSection.innerHTML = `
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b-2 border-zinc-800">
                <div class="space-y-2">
                    <div class="inline-flex items-center gap-2">
                        <span class="px-2 py-0.5 text-[10px] font-mono font-black bg-neoYellow text-black border border-black uppercase tracking-wider">
                            LIVE PROTOCOL FEED
                        </span>
                        <span class="w-2 h-2 bg-neoLime rounded-full animate-ping"></span>
                    </div>
                    <h2 class="text-3xl font-black uppercase tracking-tight text-white">
                        APPLICATION <span class="text-neoTeal">PIPELINE</span> & STATUS
                    </h2>
                    <p class="text-xs text-zinc-400 font-semibold max-w-xl">
                        Monitor underwriting logs, progress metrics, and outstanding cryptographic tasks.
                    </p>
                </div>
                <div class="flex items-center gap-3 bg-zinc-950 p-2 border-2 border-black font-mono text-xs font-bold text-zinc-400">
                    <span class="text-neoMagenta">● OVERALL SLOTS:</span>
                    <span id="slot-counter" class="text-white">2 ACTIVE</span>
                </div>
            </div>

            <!-- Terminal Audit Log Widget -->
            <div class="bg-black border-4 border-black p-4 font-mono text-xs space-y-1 text-neoLime shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden h-28 overflow-y-auto" id="terminal-logs">
                <div class="absolute right-2 top-2 text-[10px] font-black text-zinc-700 select-none uppercase tracking-wider">LOG_STREAM</div>
                <div class="text-zinc-500 font-bold">[SYSTEM INITIATION CODE v4.1] Ready...</div>
                <div class="text-zinc-500 font-bold">[SYSTEM] Monitoring slider triggers and checkout ports.</div>
            </div>

            <!-- Kanban Board Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- COLUMN 1: INGESTION -->
                <div class="bg-zinc-950 border-4 border-black p-4 space-y-4 relative flex flex-col justify-between shadow-brutal-white-sm" id="col-stage-0">
                    <div>
                        <div class="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
                            <span class="font-black text-sm uppercase tracking-wider text-neoYellow font-mono">[01] INGESTION & TRIAGE</span>
                            <span class="px-2 py-0.5 bg-neoYellow text-black text-[10px] font-black border border-black font-mono card-count">0</span>
                        </div>
                        <div class="space-y-4 card-container" data-stage="0"></div>
                    </div>
                </div>

                <!-- COLUMN 2: UNDERWRITING -->
                <div class="bg-zinc-950 border-4 border-black p-4 space-y-4 relative flex flex-col justify-between shadow-brutal-white-sm" id="col-stage-1">
                    <div>
                        <div class="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
                            <span class="font-black text-sm uppercase tracking-wider text-neoTeal font-mono">[02] RISK UNDERWRITING</span>
                            <span class="px-2 py-0.5 bg-neoTeal text-black text-[10px] font-black border border-black font-mono card-count">0</span>
                        </div>
                        <div class="space-y-4 card-container" data-stage="1"></div>
                    </div>
                </div>

                <!-- COLUMN 3: FUND ROUTING -->
                <div class="bg-zinc-950 border-4 border-black p-4 space-y-4 relative flex flex-col justify-between shadow-brutal-white-sm" id="col-stage-2">
                    <div>
                        <div class="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
                            <span class="font-black text-sm uppercase tracking-wider text-neoLime font-mono">[03] CLEARING HOUSE</span>
                            <span class="px-2 py-0.5 bg-neoLime text-black text-[10px] font-black border border-black font-mono card-count">0</span>
                        </div>
                        <div class="space-y-4 card-container" data-stage="2"></div>
                    </div>
                </div>

            </div>
        `;

        container.appendChild(trackerSection);

        // 2. Application Pipeline State
        const pipelineData = [
            {
                id: 'tx-80921',
                type: 'SaaS Revenue-Based',
                amount: 1750000,
                stage: 1, // Risk Underwriting
                tasks: [
                    { text: 'Authenticate Stripe API integration', done: true },
                    { text: 'Verify bank deposit histories via Plaid', done: true },
                    { text: 'Approve historical growth matrix projections', done: false }
                ],
                latency: '3 Days Remaining',
                color: 'neoMagenta',
                themeShadow: 'shadow-brutal-pink'
            },
            {
                id: 'tx-33410',
                type: 'Growth Venture Debt',
                amount: 4500000,
                stage: 0, // Ingestion & Triage
                tasks: [
                    { text: 'Review corporate capitalization records', done: true },
                    { text: 'Assess audit & warrant coverage bounds', done: false },
                    { text: 'Secure board executive approvals', done: false }
                ],
                latency: '14 Days Remaining',
                color: 'neoTeal',
                themeShadow: 'shadow-brutal-teal'
            }
        ];

        // Logs helper
        function appendLog(text) {
            const terminal = document.getElementById('terminal-logs');
            if (terminal) {
                const now = new Date().toLocaleTimeString();
                const logDiv = document.createElement('div');
                logDiv.className = 'text-neoLime font-mono';
                logDiv.innerHTML = `<span class="text-zinc-600">[${now}]</span> ${text}`;
                terminal.appendChild(logDiv);
                terminal.scrollTop = terminal.scrollHeight;
            }
        }

        // 3. Render cards onto columns
        function renderPipeline() {
            const containers = document.querySelectorAll('.card-container');
            containers.forEach(c => c.innerHTML = '');

            pipelineData.forEach((app) => {
                const card = document.createElement('div');
                card.className = `bg-brutalCard border-4 border-black p-4 space-y-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${app.themeShadow}`;
                
                // Done tasks calculator
                const doneCount = app.tasks.filter(t => t.done).length;
                const totalCount = app.tasks.length;
                const progressPct = Math.round((doneCount / totalCount) * 100);

                // Build Checkboxes list
                let taskListHtml = '';
                app.tasks.forEach((task, idx) => {
                    taskListHtml += `
                        <label class="flex items-start gap-2.5 cursor-pointer text-[11px] select-none hover:text-white">
                            <input type="checkbox" data-app-id="${app.id}" data-task-idx="${idx}" class="task-checkbox mt-0.5 accent-neoLime border-2 border-black" ${task.done ? 'checked' : ''}>
                            <span class="${task.done ? 'line-through text-zinc-500 font-medium' : 'text-zinc-300 font-semibold'}">${task.text}</span>
                        </label>
                    `;
                });

                // Set Action Button label based on stage
                let actionBtnLabel = 'Advance Underwriting';
                if (app.stage === 0) actionBtnLabel = 'Push to Risk Audit';
                if (app.stage === 1) actionBtnLabel = 'Clear to Settlement';
                if (app.stage === 2) actionBtnLabel = 'Finalize Wire';

                card.innerHTML = `
                    <div class="flex justify-between items-start">
                        <span class="text-[10px] font-mono font-black px-2 py-0.5 bg-black text-white border border-zinc-700">
                            ${app.id}
                        </span>
                        <span class="text-xs font-mono font-black text-neoYellow">$${(app.amount / 1000000).toFixed(2)}M</span>
                    </div>

                    <div class="space-y-1">
                        <h4 class="text-base font-black text-white uppercase tracking-tight">${app.type}</h4>
                        <div class="flex justify-between text-[10px] font-mono text-zinc-400 font-bold">
                            <span>LATENCY ENGINE</span>
                            <span class="text-white">${app.latency}</span>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="space-y-1">
                        <div class="flex justify-between text-[10px] font-mono font-black text-zinc-500">
                            <span>AUDIT STATUS</span>
                            <span>${progressPct}%</span>
                        </div>
                        <div class="h-3 w-full bg-black border-2 border-black p-0.5">
                            <div class="h-full bg-neoLime" style="width: ${progressPct}%"></div>
                        </div>
                    </div>

                    <!-- Task List -->
                    <div class="border-t-2 border-zinc-900 pt-3 space-y-2">
                        <span class="text-[10px] font-mono font-black text-zinc-500 block">PENDING REQUIREMENTS:</span>
                        <div class="space-y-1.5">
                            ${taskListHtml}
                        </div>
                    </div>

                    <!-- Action Control Bar -->
                    <div class="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
                        <button class="move-btn py-1.5 px-2 bg-zinc-900 hover:bg-black text-white font-mono font-black text-[10px] uppercase border border-zinc-700 hover:border-white transition-all duration-150" data-app-id="${app.id}">
                            ${actionBtnLabel}
                        </button>
                        <button class="abort-btn py-1.5 px-2 bg-black hover:bg-red-900/40 text-red-500 font-mono font-black text-[10px] uppercase border border-zinc-800 hover:border-red-600 transition-all duration-150" data-app-id="${app.id}">
                            Abort Node
                        </button>
                    </div>
                `;

                // Target correct container index matching stage
                const columnContainer = document.querySelector(`.card-container[data-stage="${app.stage}"]`);
                if (columnContainer) {
                    columnContainer.appendChild(card);
                }
            });

            // Update column header counts
            [0, 1, 2].forEach(st => {
                const countBadge = document.querySelector(`#col-stage-${st} .card-count`);
                if (countBadge) {
                    const count = pipelineData.filter(app => app.stage === st).length;
                    countBadge.textContent = count;
                }
            });

            // Update global slot count
            const slots = document.getElementById('slot-counter');
            if (slots) {
                slots.textContent = `${pipelineData.length} ACTIVE PIPELINES`;
            }

            // Register checkbox events
            document.querySelectorAll('.task-checkbox').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const appId = e.target.dataset.appId;
                    const taskIdx = parseInt(e.target.dataset.taskIdx, 10);
                    const app = pipelineData.find(a => a.id === appId);
                    if (app) {
                        app.tasks[taskIdx].done = e.target.checked;
                        appendLog(`Updated check-state on task list of node <span class="text-white font-bold">${appId}</span>.`);
                        renderPipeline();
                    }
                });
            });

            // Register card action events
            document.querySelectorAll('.move-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const appId = e.target.dataset.appId;
                    const app = pipelineData.find(a => a.id === appId);
                    if (app) {
                        if (app.stage < 2) {
                            app.stage += 1;
                            // Alter latency message for simulated realism
                            if (app.stage === 1) app.latency = '2 Days Remaining';
                            if (app.stage === 2) app.latency = 'Hours Remaining';
                            appendLog(`Advanced pipeline node <span class="text-white font-bold">${appId}</span> to Stage [0${app.stage + 1}].`);
                        } else {
                            // Wire cleared! Remove app
                            appendLog(`🔥 SUCCESS: Clearing House authorized funding wire for <span class="text-white font-bold">${appId}</span>! Capital deployed.`);
                            const idx = pipelineData.indexOf(app);
                            pipelineData.splice(idx, 1);
                        }
                        renderPipeline();
                    }
                });
            });

            document.querySelectorAll('.abort-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const appId = e.target.dataset.appId;
                    const idx = pipelineData.findIndex(a => a.id === appId);
                    if (idx !== -1) {
                        appendLog(`⚠️ SYSTEM WARN: Aborted routing parameters for node <span class="text-neoMagenta font-bold">${appId}</span>. Assets purged.`);
                        pipelineData.splice(idx, 1);
                        renderPipeline();
                    }
                });
            });
        }

        // 4. Intercept baseline button actions to inject new nodes
        const btnA = document.getElementById('btn-path-a');
        const btnB = document.getElementById('btn-path-b');
        const btnC = document.getElementById('btn-path-c');
        const slider = document.getElementById('funding-slider');

        function createNewPipelineNode(type, themeColor, shadowClass, defaultTasks) {
            const currentAllocation = parseInt(slider.value, 10);
            const generatedId = 'tx-' + Math.floor(10000 + Math.random() * 90000);
            
            const newNode = {
                id: generatedId,
                type: type,
                amount: currentAllocation,
                stage: 0, // Starts at Ingestion & Triage
                tasks: defaultTasks.map(t => ({ text: t, done: false })),
                latency: type.includes('SaaS') ? '5 Days Remaining' : (type.includes('Debt') ? '21 Days Remaining' : '75 Days Remaining'),
                color: themeColor,
                themeShadow: shadowClass
            };

            pipelineData.unshift(newNode);
            appendLog(`Initialized structural routing protocols for <span class="text-white font-bold">${type}</span> allocation code <span class="text-neoTeal font-bold">${generatedId}</span> at amount $${(currentAllocation / 1000000).toFixed(2)}M.`);
            
            renderPipeline();
            
            // Smoothly scroll user down to the pipeline engine element
            trackerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (btnA) {
            btnA.addEventListener('click', (e) => {
                e.preventDefault();
                if (btnA.disabled) return;
                createNewPipelineNode('SaaS Revenue-Based', 'neoMagenta', 'shadow-brutal-pink', [
                    'Establish credentials handshake via Stripe api',
                    'Validate aggregate ARR coefficients',
                    'Check standard systemic failure buffer indices'
                ]);
            });
        }

        if (btnB) {
            btnB.addEventListener('click', (e) => {
                e.preventDefault();
                if (btnB.disabled) return;
                createNewPipelineNode('Growth Venture Debt', 'neoTeal', 'shadow-brutal-teal', [
                    'Authenticate institutional ledger credentials',
                    'Sign non-dilutive framework covenants',
                    'Establish warranty settlement ratio parameters'
                ]);
            });
        }

        if (btnC) {
            btnC.addEventListener('click', (e) => {
                e.preventDefault();
                if (btnC.disabled) return;
                createNewPipelineNode('SBA 7(a) Term Loan', 'neoYellow', 'shadow-brutal-yellow', [
                    'Upload IRS corporate tax returns (3Y)',
                    'Pass executive credit-matrix verification',
                    'Acknowledge personal primary security guarantee covenants'
                ]);
            });
        }

        // Initial paint execution
        renderPipeline();
        appendLog(`Pipeline visualization engine initialized. Operational.`);
    }
})();