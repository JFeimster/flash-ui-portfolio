(function () {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLedger);
    } else {
        initLedger();
    }

    function initLedger() {
        // 1. Inject Step 6 (Ledger & Revenue) into the sidebar checklist dynamically
        const step5Link = document.getElementById('step-link-5');
        if (step5Link && step5Link.parentNode) {
            const step6Link = document.createElement('div');
            step6Link.id = 'step-link-6';
            step6Link.className = "flex items-center gap-4 p-3 bg-white text-black border-4 border-black cursor-pointer transition-all hover:bg-zinc-100";
            step6Link.innerHTML = `
                <span class="step-num bg-zinc-200 text-black font-black w-8 h-8 flex items-center justify-center border-2 border-black">06</span>
                <span class="font-bold text-sm tracking-tight uppercase text-zinc-400">LEDGER & PAYOUTS</span>
            `;
            step5Link.parentNode.appendChild(step6Link);

            // Add click listener for sidebar step 6
            step6Link.addEventListener('click', () => {
                goToLedgerWorkspace();
            });
        }

        // 2. Intercept resetToDashboard to launch our glorious Ledger instead of step 1
        window.resetToDashboard = function () {
            goToLedgerWorkspace();
            triggerTerminalOnStep(6);
        };

        // 3. Inject global CSS for custom Ledger elements if needed
        const style = document.createElement('style');
        style.innerHTML = `
            .neo-ledger-input {
                background-color: #000000;
                color: #00ff66;
                font-family: monospace;
                border: 4px solid #ffffff;
                padding: 12px;
                font-weight: 900;
                width: 100%;
                text-transform: uppercase;
            }
            .neo-ledger-input:focus {
                outline: none;
                border-color: #ff4800;
            }
            .status-badge {
                padding: 2px 8px;
                font-weight: 900;
                text-transform: uppercase;
                border: 2px solid #000000;
                display: inline-block;
            }
        `;
        document.head.appendChild(style);
    }

    // Interactive data states
    let unpaidBalance = 12450.00;
    let lifetimeEarnings = 84120.00;
    let paymentMethod = 'USDC';
    let paymentDetails = '0x71C...B29';

    const transactions = [
        { id: "TX-9082", date: "2023-10-24", company: "APEX LOGISTICS INC.", volume: 500000, rate: 4, amount: 20000, status: "PENDING" },
        { id: "TX-8911", date: "2023-10-18", company: "NEXUS COLD STORAGE", volume: 150000, rate: 3, amount: 4500, status: "PROCESSED" },
        { id: "TX-8742", date: "2023-10-10", company: "VORTEX HEAVY HAUL", volume: 1200000, rate: 4, amount: 48000, status: "COMPLETED" },
        { id: "TX-8490", date: "2023-09-28", company: "GRIDLOCK PROPERTIES", volume: 300000, rate: 3.5, amount: 11620, status: "COMPLETED" }
    ];

    // Transition Workspace to the Ledger View
    window.goToLedgerWorkspace = function () {
        // Set all sidebar links to inactive/completed depending on position
        for (let i = 1; i <= 5; i++) {
            const link = document.getElementById(`step-link-${i}`);
            if (link) {
                const badge = link.querySelector('.step-num');
                const text = link.querySelector('span:last-child');
                link.className = "flex items-center gap-4 p-3 bg-zinc-900 text-zinc-500 border-4 border-zinc-800 transition-all";
                if (badge) {
                    badge.className = "step-num bg-[#00ff66] text-black font-black w-8 h-8 flex items-center justify-center border-2 border-black";
                    badge.innerText = "✓";
                }
                if (text) {
                    text.className = "font-bold text-sm tracking-tight uppercase line-through text-zinc-600";
                }
            }
        }

        // Highlight Step 6 link in sidebar
        const step6Link = document.getElementById('step-link-6');
        if (step6Link) {
            step6Link.className = "flex items-center gap-4 p-3 bg-black text-white neo-border transition-all";
            const badge = step6Link.querySelector('.step-num');
            const text = step6Link.querySelector('span:last-child');
            if (badge) {
                badge.className = "step-num bg-[#ff4800] text-black font-black w-8 h-8 flex items-center justify-center border-2 border-black";
                badge.innerText = "06";
            }
            if (text) {
                text.className = "font-bold text-sm tracking-tight uppercase text-white";
            }
        }

        // Hide onboarding step panels
        document.querySelectorAll('.step-panel').forEach(panel => {
            panel.classList.add('hidden');
        });

        // Find or build the Ledger Panel
        let ledgerPanel = document.getElementById('ledger-panel');
        if (!ledgerPanel) {
            ledgerPanel = document.createElement('div');
            ledgerPanel.id = 'ledger-panel';
            ledgerPanel.className = 'step-panel space-y-8';
            const container = document.querySelector('main .relative.z-10');
            if (container) {
                container.appendChild(ledgerPanel);
            }
        } else {
            ledgerPanel.classList.remove('hidden');
        }

        // Update step indicator
        const stepIndicator = document.getElementById('current-step-indicator');
        if (stepIndicator) {
            stepIndicator.innerText = "6";
        }

        renderLedgerContent();
    };

    function renderLedgerContent() {
        const ledgerPanel = document.getElementById('ledger-panel');
        if (!ledgerPanel) return;

        ledgerPanel.innerHTML = `
            <!-- HEADER -->
            <div class="space-y-4">
                <div class="inline-block bg-[#ff4800] text-black text-xs font-black px-3 py-1 uppercase tracking-widest">
                    PHASE 06 // CAPITAL CONTROL LEDGER
                </div>
                <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase select-none">
                    PARTNER <span class="text-[#ff4800]">REVENUE</span> SYSTEM
                </h1>
                <p class="text-zinc-300 font-bold max-w-2xl border-l-4 border-[#00ff66] pl-4">
                    Monitor audited transactions, adjust payout destinations, and generate raw financial records. Settled weekly every Friday.
                </p>
            </div>

            <!-- METRICS PANEL -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-black text-white p-6 border-4 border-white neo-shadow-white relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                    <span class="text-xs font-mono text-zinc-400 block">// UNPAID COMMISSIONS</span>
                    <span class="text-4xl md:text-5xl font-black text-[#00ff66] tracking-tight block mt-4" id="ledger-unpaid">
                        $${unpaidBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div class="mt-4 flex justify-between items-center text-[10px] font-mono text-[#ff4800]">
                        <span class="blink">● READY TO DISBURSE</span>
                        <button onclick="triggerInstantDisbursement()" class="bg-white text-black font-black px-2 py-0.5 hover:bg-[#ff4800] hover:text-white border-2 border-black">REQUEST NOW</button>
                    </div>
                </div>

                <div class="bg-black text-white p-6 border-4 border-white neo-shadow-white flex flex-col justify-between min-h-[160px]">
                    <span class="text-xs font-mono text-zinc-400 block">// NEXT DISTRIBUTION</span>
                    <span class="text-4xl md:text-5xl font-black text-white tracking-tight block mt-4 uppercase">
                        FRI_17:00
                    </span>
                    <span class="text-xs font-mono text-zinc-500 block mt-4">// AUTOMATIC WIRE RELEASE</span>
                </div>

                <div class="bg-[#ff4800] text-black p-6 border-4 border-black neo-shadow flex flex-col justify-between min-h-[160px]">
                    <span class="text-xs font-mono text-black font-bold block">// LIFETIME GENERATED</span>
                    <span class="text-4xl md:text-5xl font-black text-black tracking-tight block mt-4" id="ledger-lifetime">
                        $${lifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span class="text-xs font-mono text-black font-bold block mt-4">// COMBINED VOLUME TRACED</span>
                </div>
            </div>

            <!-- MAIN WORKSPACE SPLIT (LEDGER & CONFIG) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <!-- TRANSACTIONS TABLE (8 Cols) -->
                <div class="lg:col-span-8 bg-zinc-950 p-4 border-4 border-white space-y-4">
                    <div class="flex justify-between items-center border-b-4 border-white pb-3">
                        <h3 class="font-black text-lg tracking-wider text-white uppercase">// TRANSACTION AUDIT LOG</h3>
                        <button onclick="injectDemoLead()" class="bg-white text-black font-black px-3 py-1 text-xs uppercase hover:bg-[#ff4800] hover:text-black neo-border">
                            + FORCE INJECT DEAL
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left font-mono text-xs border-collapse">
                            <thead>
                                <tr class="bg-white text-black font-black uppercase text-xs">
                                    <th class="p-2 border-2 border-black">TXID</th>
                                    <th class="p-2 border-2 border-black">COMPANY</th>
                                    <th class="p-2 border-2 border-black">VOLUME</th>
                                    <th class="p-2 border-2 border-black">COMM</th>
                                    <th class="p-2 border-2 border-black">STATUS</th>
                                </tr>
                            </thead>
                            <tbody id="ledger-tbody">
                                ${transactions.map(tx => `
                                    <tr class="border-b border-zinc-800 hover:bg-zinc-900">
                                        <td class="p-2 font-bold text-zinc-400">${tx.id}</td>
                                        <td class="p-2 text-white font-black uppercase">${tx.company}</td>
                                        <td class="p-2 text-zinc-300">$${tx.volume.toLocaleString()}</td>
                                        <td class="p-2 text-[#00ff66] font-bold">$${tx.amount.toLocaleString()}</td>
                                        <td class="p-2">
                                            <span class="status-badge ${getStatusClasses(tx.status)}">${tx.status}</span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- CONFIG SETTINGS (4 Cols) -->
                <div class="lg:col-span-4 bg-zinc-950 p-4 border-4 border-white flex flex-col justify-between space-y-4">
                    <div class="space-y-2">
                        <h3 class="font-black text-lg tracking-wider text-[#ff4800] uppercase">// DISBURSEMENT CONFIG</h3>
                        <p class="text-[11px] font-mono text-zinc-400 uppercase leading-snug">
                            Choose your preferred routing terminal. Changes take effect on next audit cycle.
                        </p>
                    </div>

                    <!-- Payment Type Buttons -->
                    <div class="grid grid-cols-3 border-4 border-white text-center font-black text-xs">
                        <button onclick="setPaymentType('WIRE')" id="pay-wire" class="pay-btn p-2 border-r-2 border-white hover:bg-zinc-800 transition-all text-white">WIRE</button>
                        <button onclick="setPaymentType('ACH')" id="pay-ach" class="pay-btn p-2 border-r-2 border-white hover:bg-zinc-800 transition-all text-white">ACH</button>
                        <button onclick="setPaymentType('USDC')" id="pay-usdc" class="pay-btn p-2 hover:bg-zinc-800 transition-all text-white">USDC</button>
                    </div>

                    <!-- Payment Input Terminal -->
                    <div class="bg-black p-3 border-2 border-white space-y-2">
                        <label class="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider" id="payment-label">USDC WALLET ADDRESS</label>
                        <input type="text" id="payment-field" class="w-full bg-black text-[#00ff66] font-mono font-bold text-xs p-2 border border-zinc-700 uppercase focus:outline-none focus:border-[#ff4800]" value="${paymentDetails}">
                    </div>

                    <button onclick="savePaymentConfig()" class="w-full bg-[#00ff66] text-black font-black py-3 uppercase text-xs tracking-widest neo-btn">
                        LOCK DISBURSEMENT DESTINATION
                    </button>
                </div>
            </div>

            <!-- BACK TO ONBOARDING FLOATING BUTTON -->
            <div class="flex gap-4 pt-4 border-t-4 border-white">
                <button onclick="goToStep(1)" class="bg-zinc-800 hover:bg-zinc-700 text-white font-black text-lg uppercase py-4 px-8 tracking-widest neo-btn">
                    ← RETRACT TO ONBOARDING
                </button>
            </div>
        `;

        highlightPaymentButtons();
    }

    function getStatusClasses(status) {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500 text-black border-yellow-600';
            case 'PROCESSED':
                return 'bg-[#ff4800] text-black border-[#bf3600]';
            case 'COMPLETED':
                return 'bg-[#00ff66] text-black border-[#00bf4c]';
            default:
                return 'bg-zinc-500 text-white';
        }
    }

    // Interactive Functions for Ledger Dashboard
    window.setPaymentType = function (type) {
        paymentMethod = type;
        const label = document.getElementById('payment-label');
        const input = document.getElementById('payment-field');

        if (type === 'WIRE') {
            label.innerText = 'BANK SWIFT / ROUTING TRANSIT NUMBER';
            input.value = 'SWIFT: MOONSHNY33XXX';
        } else if (type === 'ACH') {
            label.innerText = 'ACCOUNT NUMBER / ROUTING SLIP';
            input.value = 'ACC: 99018274619 - ROUT: 021000021';
        } else {
            label.innerText = 'USDC WALLET ADDRESS (ERC-20)';
            input.value = '0x71C...B29';
        }

        highlightPaymentButtons();
        logTerminalEvent(`PAYMENT MECHANIC PRE-CONFIGURED TO ${type}`);
    };

    function highlightPaymentButtons() {
        document.querySelectorAll('.pay-btn').forEach(btn => {
            btn.className = "pay-btn p-2 border-r-2 border-white hover:bg-zinc-800 transition-all text-white bg-black";
        });

        // Add special active class to the current type
        const wireBtn = document.getElementById('pay-wire');
        const achBtn = document.getElementById('pay-ach');
        const usdcBtn = document.getElementById('pay-usdc');

        if (paymentMethod === 'WIRE' && wireBtn) wireBtn.className = "pay-btn p-2 border-r-2 border-white bg-[#ff4800] text-black font-black";
        if (paymentMethod === 'ACH' && achBtn) achBtn.className = "pay-btn p-2 border-r-2 border-white bg-[#ff4800] text-black font-black";
        if (paymentMethod === 'USDC' && usdcBtn) {
            usdcBtn.className = "pay-btn p-2 bg-[#ff4800] text-black font-black";
            // Check if boundary is required
            usdcBtn.classList.add('border-l-2', 'border-white');
        }
    }

    window.savePaymentConfig = function () {
        const inputVal = document.getElementById('payment-field').value.trim();
        if (!inputVal) {
            alert('CRITICAL ERROR: Destination ledger address cannot be left empty.');
            return;
        }
        paymentDetails = inputVal;
        alert(`DISBURSEMENT PARADIGM SECURED.\nCHANNEL: ${paymentMethod}\nADDRESS: ${paymentDetails}`);
        logTerminalEvent(`SUCCESS: SENSITIVE LEDGER ADDR RE-ROUTE STAMPED [${paymentMethod}]`);
    };

    window.triggerInstantDisbursement = function () {
        if (unpaidBalance <= 0) {
            alert('LEDGER BALANCED: No pending liquid commissions available to disburse.');
            return;
        }

        const confirmClaim = confirm(`CONFIRM HIGH-VELOCITY LIQUIDATION OF $${unpaidBalance.toLocaleString()} TO [${paymentMethod}: ${paymentDetails}]?`);
        if (!confirmClaim) return;

        alert(`EXECUTION ORDER PLACED.\nDisbursing funds instantly. High velocity pipeline processing. please monitor transaction ledger.`);
        
        // Update variables
        lifetimeEarnings += unpaidBalance;
        unpaidBalance = 0;

        // Render updates on page
        const unpaidDisplay = document.getElementById('ledger-unpaid');
        const lifetimeDisplay = document.getElementById('ledger-lifetime');
        if (unpaidDisplay) unpaidDisplay.innerText = "$0.00";
        if (lifetimeDisplay) lifetimeDisplay.innerText = `$${lifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        logTerminalEvent(`SYSTEM EXECUTION: INSTANT PAYOUT DISPATCHED.`);
    };

    window.injectDemoLead = function () {
        const randomNames = ["CYBERDYNE SYSTEMS", "TYRELL CORP", "WEYLAND-YUTANI", "ACME INDUSTRIAL", "OSCORP INDUSTRIES"];
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
        const volume = Math.floor(Math.random() * 800000) + 100000;
        const amount = Math.floor(volume * 0.04);
        const txId = "TX-" + (Math.floor(Math.random() * 9000) + 1000);
        const dateStr = new Date().toISOString().split('T')[0];

        const newTx = {
            id: txId,
            date: dateStr,
            company: randomName,
            volume: volume,
            rate: 4,
            amount: amount,
            status: "PENDING"
        };

        transactions.unshift(newTx);
        unpaidBalance += amount;

        // Re-render
        renderLedgerContent();
        logTerminalEvent(`INBOUND TARGET DETECTED: ${randomName} // ESCROWED: $${amount.toLocaleString()}`);
    };

    function logTerminalEvent(text) {
        const chat = document.getElementById('chat-messages');
        if (chat) {
            chat.innerHTML += `<p><span class="text-[#ff4800] font-bold">LEDGER_SYS:</span> ${text.toUpperCase()}</p>`;
            chat.scrollTop = chat.scrollHeight;
        }
    }
})();