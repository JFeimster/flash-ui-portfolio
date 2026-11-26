document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. STATE & STORAGE MANAGEMENT
    // ---------------------------------------------------------
    const STORAGE_KEY = 'MOONSHINE_LEADS_DATABASE';
    
    // Default system seed targets to populate table immediately
    const SEED_LEADS = [
        {
            id: 'MS-8912',
            company: 'APEX LOGISTICS INC.',
            capital: '500,000',
            email: 'CONTACT@APEXLOGISTICS.COM',
            intel: 'NEEDS FLEET ACQUISITION FINANCE IN 10 DAYS.',
            status: 'IN DISCUSSION',
            timestamp: getFormattedDate(-2)
        },
        {
            id: 'MS-4402',
            company: 'NEO-SYNAPSE AI LABS',
            capital: '1,250,000',
            email: 'DEALS@NEO-SYNAPSE.IO',
            intel: 'GPU CLUSTER DEPLOYMENT FUNDING SECURED FROM SECONDARY ASSETS.',
            status: 'CLOSED-WON',
            timestamp: getFormattedDate(-1)
        },
        {
            id: 'MS-1090',
            company: 'KRONOS HEAVY INDUSTRIES',
            capital: '250,000',
            email: 'OPS@KRONOS-METAL.COM',
            intel: 'INVOICE FACTORING LINE FOR SUPPLY SHIPMENTS.',
            status: 'CONTACTED',
            timestamp: getFormattedDate(0)
        }
    ];

    let leads = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (leads.length === 0) {
        leads = SEED_LEADS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }

    // Helper: Formatted date string
    function getFormattedDate(offsetDays = 0) {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`;
    }

    // ---------------------------------------------------------
    // 2. UI INJECTION: LEAD TRACKING GRID & CONTROLS
    // ---------------------------------------------------------
    const step3Container = document.getElementById('step-3');
    if (step3Container) {
        // Construct the tracking table HTML structure matching raw neo-brutalist theme
        const trackerContainer = document.createElement('div');
        trackerContainer.className = 'border-4 border-white bg-zinc-950 p-6 space-y-6 mt-8 relative overflow-hidden';
        trackerContainer.innerHTML = `
            <!-- Decorator corner stamp -->
            <div class="absolute top-0 right-0 bg-[#00ff66] text-black font-black px-3 py-1 text-xs uppercase tracking-widest border-b-4 border-l-4 border-white">
                LIVE LEDGER
            </div>

            <div class="space-y-2">
                <span class="text-xs font-mono text-[#00ff66] block tracking-widest">// SECURE ROUTING SYSTEM CHANNEL</span>
                <h3 class="text-2xl md:text-3xl font-black uppercase tracking-tight">Your Submitted Leads Pipeline</h3>
                <p class="text-zinc-400 text-xs font-mono">
                    Real-time status updates from our underwriting pool. Keep targets warm while status transitions.
                </p>
            </div>

            <!-- Table Wrapper -->
            <div class="overflow-x-auto border-4 border-white">
                <table class="w-full text-left border-collapse min-w-[600px]" id="leads-table">
                    <thead>
                        <tr class="bg-white text-black font-black border-b-4 border-white">
                            <th class="p-3 uppercase text-xs tracking-widest font-mono">TARGET ID</th>
                            <th class="p-3 uppercase text-xs tracking-widest font-mono">COMPANY / PIPELINE</th>
                            <th class="p-3 uppercase text-xs tracking-widest font-mono">CAPITAL REQUEST</th>
                            <th class="p-3 uppercase text-xs tracking-widest font-mono">LIVE STATUS</th>
                            <th class="p-3 uppercase text-xs tracking-widest font-mono">TIMESTAMP</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-4 divide-white bg-black font-mono text-xs uppercase" id="leads-table-body">
                        <!-- Dynamic lead rows loaded here -->
                    </tbody>
                </table>
            </div>

            <!-- System Action Simulation Controllers -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <button id="btn-stimulate-pipeline" class="bg-[#ff4800] hover:bg-white text-black font-black p-3 border-4 border-black neo-shadow uppercase tracking-widest text-xs transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
                    ⚡ SIMULATE PIPELINE VELOCITY (DRIVE DEAL STATES)
                </button>
                <button id="btn-reset-leads" class="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-4 border-zinc-700 p-3 font-black uppercase tracking-widest text-xs transition-all">
                    // RESET TO FACTORY DEMO PIPELINE
                </button>
            </div>
        `;

        // Inject below the form in step-3
        step3Container.appendChild(trackerContainer);
    }

    // ---------------------------------------------------------
    // 3. LEAD TABLE RENDERING & STATUS STYLING
    // ---------------------------------------------------------
    function renderLeadsTable() {
        const tbody = document.getElementById('leads-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (leads.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="p-8 text-center text-zinc-500 font-mono tracking-widest uppercase">
                        [ NO ROUTED TARGETS DETECTED. SUBMIT THE FORM ABOVE TO INITIALIZE PIPELINE ]
                    </td>
                </tr>
            `;
            return;
        }

        leads.forEach(lead => {
            let statusBadgeClass = '';
            
            // Map statuses to high-contrast Neo-Brutalist Badges
            switch (lead.status) {
                case 'SUBMITTED':
                    statusBadgeClass = 'bg-zinc-800 text-zinc-300 border-2 border-zinc-500';
                    break;
                case 'CONTACTED':
                    statusBadgeClass = 'bg-[#ff4800] text-black font-black border-2 border-black';
                    break;
                case 'IN DISCUSSION':
                    statusBadgeClass = 'bg-yellow-400 text-black font-black border-2 border-black';
                    break;
                case 'CLOSED-WON':
                    statusBadgeClass = 'bg-[#00ff66] text-black font-black border-2 border-black animate-pulse';
                    break;
                case 'DEAD_END':
                    statusBadgeClass = 'bg-red-600 text-white font-mono border-2 border-white';
                    break;
                default:
                    statusBadgeClass = 'bg-white text-black border-2 border-black';
            }

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-zinc-900 transition-colors border-b-4 border-white';
            tr.innerHTML = `
                <td class="p-3 font-black text-white border-r-4 border-white">${lead.id}</td>
                <td class="p-3 border-r-4 border-white">
                    <span class="block font-black text-white text-sm">${lead.company}</span>
                    <span class="block text-zinc-500 text-[10px] lowercase break-all">${lead.email}</span>
                </td>
                <td class="p-3 font-black text-white text-sm border-r-4 border-white">$${lead.capital}</td>
                <td class="p-3 border-r-4 border-white">
                    <span class="inline-block px-3 py-1 font-mono font-bold text-[10px] tracking-wider uppercase ${statusBadgeClass}">
                        ${lead.status}
                    </span>
                </td>
                <td class="p-3 text-zinc-400 text-[10px]">${lead.timestamp}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ---------------------------------------------------------
    // 4. FORM HIJACK & AGGRESSIVE FIELD VALIDATION
    // ---------------------------------------------------------
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        // Disconnect old submission handler to manage programmatically
        leadForm.removeAttribute('onsubmit');
        
        // Find inputs
        const companyInput = leadForm.querySelector('input[type="text"][placeholder*="APEX"]');
        const capitalInput = leadForm.querySelector('input[type="text"][placeholder*="500,000"]');
        const emailInput = leadForm.querySelector('input[type="email"]');
        const intelTextarea = leadForm.querySelector('textarea');

        // Dynamic visual keyup triggers for aggressive states
        [companyInput, capitalInput, emailInput].forEach(input => {
            if (!input) return;
            input.addEventListener('focus', () => {
                input.className = "w-full bg-black text-white font-black p-3 border-4 border-[#ff4800] focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800 transition-all";
            });
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.className = "w-full bg-black text-white font-black p-3 border-4 border-[#00ff66] focus:outline-none uppercase placeholder-zinc-800 transition-all";
                } else {
                    input.className = "w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800 transition-all";
                }
            });
        });

        // Submit Listener
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let validationFailed = false;

            // Reset dynamic validation look
            [companyInput, capitalInput, emailInput].forEach(inp => {
                if (inp) inp.classList.remove('border-red-600', 'bg-red-950/20');
            });

            // Perform robust validations
            if (!companyInput || companyInput.value.trim() === '') {
                markInvalid(companyInput);
                validationFailed = true;
            }

            const cleanCapital = capitalInput ? capitalInput.value.replace(/[^0-9]/g, '') : '';
            if (!capitalInput || cleanCapital === '' || isNaN(cleanCapital)) {
                markInvalid(capitalInput);
                validationFailed = true;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
                markInvalid(emailInput);
                validationFailed = true;
            }

            if (validationFailed) {
                // Log alert in chat console immediately
                triggerSystemTerminalMessage("CRITICAL: Lead submission rejected. Verify your required inputs are properly capitalized and configured!");
                return;
            }

            // Capital formatting
            const formattedCapital = Number(cleanCapital).toLocaleString();

            // Store new lead state
            const targetId = 'MS-' + Math.floor(1000 + Math.random() * 9000);
            const newLead = {
                id: targetId,
                company: companyInput.value.trim().toUpperCase(),
                capital: formattedCapital,
                email: emailInput.value.trim().toUpperCase(),
                intel: intelTextarea ? intelTextarea.value.trim().toUpperCase() : 'NO ADDITIONAL RAW INTEL',
                status: 'SUBMITTED',
                timestamp: getFormattedDate(0)
            };

            leads.unshift(newLead);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

            // Rerender
            renderLeadsTable();

            // Clear out inputs gracefully
            leadForm.reset();
            [companyInput, capitalInput, emailInput].forEach(inp => {
                if (inp) inp.className = "w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800";
            });

            // Alert the system dashboard / terminal log
            triggerSystemTerminalMessage(`LEAD REGISTERED // SUCCESS ROUTE KEY: ${targetId}. INJECTED INTO COMMERCE UNDERWRITING POOL.`);

            // Shake simulation response to UI or navigate
            setTimeout(() => {
                if (typeof goToStep === 'function') {
                    // Navigate forward to step 4 as expected by the checklist workflow
                    goToStep(4);
                }
            }, 1000);
        });
    }

    function markInvalid(element) {
        if (!element) return;
        element.className = "w-full bg-black text-white font-black p-3 border-4 border-red-600 bg-red-950/20 focus:outline-none uppercase placeholder-zinc-800 animate-bounce";
    }

    // ---------------------------------------------------------
    // 5. SYSTEM PIPELINE SIMULATOR ENGINE (Interactivity)
    // ---------------------------------------------------------
    const btnStimulate = document.getElementById('btn-stimulate-pipeline');
    if (btnStimulate) {
        btnStimulate.addEventListener('click', () => {
            if (leads.length === 0) {
                triggerSystemTerminalMessage("SYS_ERR: Pipeline is totally dried up. Register a target company first.");
                return;
            }

            // Progression pipeline state path
            const statusTransitions = {
                'SUBMITTED': 'CONTACTED',
                'CONTACTED': 'IN DISCUSSION',
                'IN DISCUSSION': 'CLOSED-WON',
                'CLOSED-WON': 'DEAD_END',
                'DEAD_END': 'SUBMITTED'
            };

            // Shift statuses sequentially to prove tracking state features
            leads = leads.map(lead => {
                const nextState = statusTransitions[lead.status] || 'SUBMITTED';
                return {
                    ...lead,
                    status: nextState,
                    timestamp: getFormattedDate(0)
                };
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
            renderLeadsTable();

            triggerSystemTerminalMessage("STIMULATOR PULSE INJECTED // PIPELINE VELOCITY ACCELERATED. DEAL STAGES HAVE SHIFTED.");
        });
    }

    const btnReset = document.getElementById('btn-reset-leads');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm('CONFIRM RESET: Restore leads pipeline database to system factory defaults?')) {
                leads = SEED_LEADS;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
                renderLeadsTable();
                triggerSystemTerminalMessage("LEDGER DATABASE REBUILT // RESTORED SYSTEM SEEDS.");
            }
        });
    }

    // Helper: Push automated terminal logs to MoonshineHQ Terminal inside the layout
    function triggerSystemTerminalMessage(message) {
        const chat = document.getElementById('chat-messages');
        if (chat) {
            chat.innerHTML += `<p><span class="text-[#ff4800] font-bold">SYSTEM_LEDGER:</span> ${message}</p>`;
            chat.scrollTop = chat.scrollHeight;
        } else {
            console.log(`[Moonshine System Terminal] ${message}`);
        }
    }

    // ---------------------------------------------------------
    // 6. INIT RUNS
    // ---------------------------------------------------------
    renderLeadsTable();
});