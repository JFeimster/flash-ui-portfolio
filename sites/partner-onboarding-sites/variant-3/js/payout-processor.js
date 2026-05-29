(function () {
    // -------------------------------------------------------------
    // MOONSHINE CAPITAL PARTNERS: COMMISSION LEDGER & CASHOUT ENGINE
    // FILE: js/payout-processor.js
    // -------------------------------------------------------------

    // --- State Management ---
    const LedgerState = {
        availableBalance: 12450.00,
        pendingBalance: 3120.00,
        payouts: [
            { id: "TXN-90821-MC", date: "2024-11-01", type: "RECURRING_COMM", amount: 4500.00, destination: "BANK_WIRE (...8829)", status: "CLEARED" },
            { id: "TXN-87102-MC", date: "2024-10-01", type: "PIPELINE_BONUS", amount: 7500.00, destination: "USDC (0x71C...a29)", status: "CLEARED" },
            { id: "TXN-10928-MC", date: "2024-11-12", type: "RECURRING_COMM", amount: 3120.00, destination: "SYSTEM_HOLD", status: "PENDING_CLEARANCE" }
        ],
        selectedMethod: "BANK" // "BANK" or "CRYPTO"
    };

    // --- DOM Injection ---
    document.addEventListener("DOMContentLoaded", () => {
        initializeLedgerUI();
    });

    function initializeLedgerUI() {
        const mainContainer = document.querySelector("main");
        if (!mainContainer) return;

        // 1. Create Ledger Section Container
        const ledgerSection = document.createElement("section");
        ledgerSection.id = "mc-ledger-section";
        ledgerSection.className = "col-span-1 lg:col-span-12 w-full bg-white brutalist-border brutalist-shadow-black p-6 md:p-8 mt-4";
        
        ledgerSection.innerHTML = `
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-black pb-4 mb-6 gap-4">
                <div>
                    <span class="text-xs font-black uppercase bg-black text-white px-2 py-0.5 tracking-wider">// TRANS_LEDGER_v4.0</span>
                    <h3 class="text-3xl font-black mt-2 tracking-tight">COMMISSIONS LEDGER & CASHOUT STATION</h3>
                </div>
                <div class="flex items-center gap-3">
                    <span class="inline-block w-3 h-3 bg-[#E2FF00] border border-black live-blink"></span>
                    <span class="text-xs font-mono font-black uppercase bg-[#E2FF00] text-black px-2 py-1 brutalist-border">LEDGER SECURED: SHA-256</span>
                </div>
            </div>

            <!-- Ledger Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Left: Table (Col-span 8) -->
                <div class="lg:col-span-8 overflow-x-auto">
                    <table class="w-full text-left border-collapse brutalist-border">
                        <thead>
                            <tr class="bg-black text-white font-mono text-xs uppercase border-b-4 border-black">
                                <th class="p-3">DATE</th>
                                <th class="p-3">TRANSACTION ID</th>
                                <th class="p-3">METHOD / SOURCE</th>
                                <th class="p-3 text-right">AMOUNT</th>
                                <th class="p-3 text-center">STATUS</th>
                            </tr>
                        </thead>
                        <tbody id="ledger-table-body" class="font-mono text-sm font-bold">
                            <!-- Injected dynamically -->
                        </tbody>
                    </table>
                </div>

                <!-- Right: Stats & Action Drawer (Col-span 4) -->
                <div class="lg:col-span-4 flex flex-col gap-4">
                    <!-- High-contrast available card -->
                    <div class="bg-[#E2FF00] p-6 brutalist-border brutalist-shadow-black flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 inline-block mb-2">LIQUIDITY BALANCE</span>
                            <span class="text-4xl md:text-5xl font-black block leading-none text-black font-mono" id="stats-available-balance">
                                $0.00
                            </span>
                        </div>
                        <p class="text-xs font-bold uppercase mt-4 text-gray-800 leading-none">// CONFIRMED AND READY TO CONVERT</p>
                    </div>

                    <!-- Pending clearance card -->
                    <div class="bg-black text-white p-6 brutalist-border flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-black uppercase tracking-widest bg-white text-black px-2 py-0.5 inline-block mb-2 text-[#FF0055]">UNDER AUDIT</span>
                            <span class="text-3xl font-black block leading-none text-[#FF0055] font-mono" id="stats-pending-balance">
                                $0.00
                            </span>
                        </div>
                        <p class="text-xs font-bold uppercase mt-4 text-gray-400 leading-none">// PENDING INTEGRATION VALIDATION</p>
                    </div>

                    <!-- Cashout CTA Trigger -->
                    <button onclick="window.PayoutProcessor.openModal()" class="w-full py-5 text-xl brutalist-btn brutalist-btn-pink brutalist-shadow-black text-white font-black uppercase tracking-wider flex items-center justify-center gap-3">
                        ⚡️ INITIATE ROUTING PROTOCOL
                    </button>
                </div>
            </div>
        `;

        mainContainer.appendChild(ledgerSection);

        // 2. Create Modal Element in Body
        const modalContainer = document.createElement("div");
        modalContainer.id = "mc-withdrawal-modal";
        modalContainer.className = "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden";
        modalContainer.innerHTML = `
            <div class="bg-white w-full max-w-2xl brutalist-border brutalist-shadow-pink overflow-hidden flex flex-col">
                <!-- Modal Header -->
                <div class="bg-black text-[#E2FF00] p-4 border-b-4 border-black flex justify-between items-center font-mono text-xs">
                    <span class="font-black">// ROUTING OVERLAY: WITHDRAWAL TERMINAL v2.11</span>
                    <button onclick="window.PayoutProcessor.closeModal()" class="bg-[#FF0055] text-white font-black p-1 hover:bg-white hover:text-black border border-black leading-none text-base">&times; CLOSE</button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 md:p-8 flex-grow">
                    <div class="mb-6">
                        <span class="text-xs font-black bg-[#E2FF00] text-black px-3 py-1 uppercase tracking-widest inline-block mb-2">FUNDS CLEARANCE CENTER</span>
                        <h2 class="text-3xl font-black leading-none uppercase">CONVERT AVAILABLE LIQUIDITY</h2>
                    </div>

                    <!-- Method Tabs -->
                    <div class="flex border-b-4 border-black mb-6">
                        <button onclick="window.PayoutProcessor.switchMethod('BANK')" id="modal-tab-bank" class="flex-1 py-3 font-black uppercase brutalist-border border-b-0 mr-1 text-center transition-all bg-black text-white">
                            🏦 BANK WIRE
                        </button>
                        <button onclick="window.PayoutProcessor.switchMethod('CRYPTO')" id="modal-tab-crypto" class="flex-1 py-3 font-black uppercase brutalist-border border-b-0 text-center transition-all bg-white text-black">
                            ⚡️ USDC INJECTION (ERC-20)
                        </button>
                    </div>

                    <!-- Input Forms -->
                    <form id="withdrawal-form" onsubmit="window.PayoutProcessor.handleFormSubmit(event)" class="flex flex-col gap-4">
                        
                        <!-- Common Amount Input -->
                        <div>
                            <label class="block text-xs font-black uppercase mb-1">WITHDRAWAL SUM (USD)</label>
                            <div class="relative">
                                <span class="absolute left-3 top-3 font-black text-xl">$</span>
                                <input type="number" id="withdraw-amount" required step="0.01" min="100" class="brutalist-input p-3 pl-8 w-full text-xl font-mono uppercase" placeholder="0.00">
                            </div>
                            <span class="text-xs text-gray-500 font-bold uppercase mt-1 block" id="modal-max-label"></span>
                        </div>

                        <!-- BANK WIRE INPUTS -->
                        <div id="method-container-bank" class="flex flex-col gap-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-black uppercase mb-1">ROUTING NUMBER (ABA)</label>
                                    <input type="text" id="bank-routing" class="brutalist-input p-3 w-full font-mono uppercase" placeholder="9 DIGIT IDENTIFIER">
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase mb-1">ACCOUNT NUMBER</label>
                                    <input type="text" id="bank-account" class="brutalist-input p-3 w-full font-mono uppercase" placeholder="ACCOUNT STRING">
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-black uppercase mb-1">RECIPIENT FULL NAME / ENTITY</label>
                                <input type="text" id="bank-name" class="brutalist-input p-3 w-full uppercase" placeholder="E.G. MOONSHINE PARTNER LLC">
                            </div>
                        </div>

                        <!-- CRYPTO INPUTS -->
                        <div id="method-container-crypto" class="flex flex-col gap-4 hidden">
                            <div>
                                <label class="block text-xs font-black uppercase mb-1">USDC TARGET ADDRESS (ETH / ERC-20 NETWORK)</label>
                                <input type="text" id="crypto-address" class="brutalist-input p-3 w-full font-mono uppercase" placeholder="E.G. 0x71C...3a29">
                                <span class="text-xs text-red-500 font-black uppercase mt-1 block">⚠️ VERIFY ERC-20 DESTINATION. WRONG CHAINS CAUSE ABSOLUTE LIQUIDITY loss.</span>
                            </div>
                        </div>

                        <!-- Warnings & Submission -->
                        <div class="bg-black text-white p-4 brutalist-border flex items-center gap-3 mt-2">
                            <span class="bg-[#FF0055] text-white text-xs font-black px-2 py-0.5 uppercase brutalist-border border-black live-blink">URGENT</span>
                            <p class="text-xs font-mono font-semibold text-gray-300 uppercase leading-normal">
                                All routing undergoes real-time KYC/AML clearance. Compliance checks usually conclude inside 15 operational minutes.
                            </p>
                        </div>

                        <div class="mt-4">
                            <button type="submit" class="w-full py-4 brutalist-btn brutalist-btn-accent text-lg font-black uppercase tracking-wider">
                                RUN CLEARANCE PROTOCOL →
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);

        // Render Initial state to UI
        renderUI();
    }

    // --- Dynamic Render Functions ---
    function renderUI() {
        renderStats();
        renderLedgerTable();
    }

    function renderStats() {
        const availEl = document.getElementById("stats-available-balance");
        const pendEl = document.getElementById("stats-pending-balance");
        const modalMaxLabel = document.getElementById("modal-max-label");

        if (availEl) availEl.innerText = `$${LedgerState.availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (pendEl) pendEl.innerText = `$${LedgerState.pendingBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (modalMaxLabel) {
            modalMaxLabel.innerText = `MAX QUANTITY AVAILABLE: $${LedgerState.availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
        }
    }

    function renderLedgerTable() {
        const tbody = document.getElementById("ledger-table-body");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (LedgerState.payouts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="p-6 text-center text-gray-500 uppercase font-black">// NO TRANSACTION REGISTRY METRICS FOUND</td>
                </tr>
            `;
            return;
        }

        LedgerState.payouts.forEach(txn => {
            const tr = document.createElement("tr");
            tr.className = "border-b border-gray-300 hover:bg-gray-50";

            // Determine status badges matching aesthetic
            let statusBadge = "";
            if (txn.status === "CLEARED") {
                statusBadge = `<span class="bg-[#E2FF00] text-black px-2 py-0.5 text-xs font-black brutalist-border border-black">CLEARED</span>`;
            } else if (txn.status === "PENDING_CLEARANCE") {
                statusBadge = `<span class="bg-gray-300 text-black px-2 py-0.5 text-xs font-black brutalist-border border-black">PENDING_CLEARANCE</span>`;
            } else if (txn.status === "LIQUIDATING") {
                statusBadge = `<span class="bg-[#FF0055] text-white px-2 py-0.5 text-xs font-black brutalist-border border-black live-blink">LIQUIDATING</span>`;
            }

            tr.innerHTML = `
                <td class="p-3 text-xs font-black">${txn.date}</td>
                <td class="p-3 text-xs font-black text-gray-500">${txn.id}</td>
                <td class="p-3">
                    <div class="text-xs font-black uppercase text-black">${txn.type}</div>
                    <div class="text-[10px] text-gray-400 font-semibold tracking-wider">${txn.destination}</div>
                </td>
                <td class="p-3 text-right text-xs font-black font-mono">$${txn.amount.toFixed(2)}</td>
                <td class="p-3 text-center">${statusBadge}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- Modal Controls & Submissions ---
    function openModal() {
        const modal = document.getElementById("mc-withdrawal-modal");
        if (modal) {
            modal.classList.remove("hidden");
            // Set max on open
            const amountInput = document.getElementById("withdraw-amount");
            if (amountInput) {
                amountInput.setAttribute("max", LedgerState.availableBalance);
                amountInput.value = "";
            }
        }
    }

    function closeModal() {
        const modal = document.getElementById("mc-withdrawal-modal");
        if (modal) {
            modal.classList.add("hidden");
        }
    }

    function switchMethod(method) {
        LedgerState.selectedMethod = method;

        const tabBank = document.getElementById("modal-tab-bank");
        const tabCrypto = document.getElementById("modal-tab-crypto");
        const containerBank = document.getElementById("method-container-bank");
        const containerCrypto = document.getElementById("method-container-crypto");

        const requiredBankInputs = ["bank-routing", "bank-account", "bank-name"];
        const requiredCryptoInputs = ["crypto-address"];

        if (method === "BANK") {
            tabBank.className = "flex-1 py-3 font-black uppercase brutalist-border border-b-0 mr-1 text-center transition-all bg-black text-white";
            tabCrypto.className = "flex-1 py-3 font-black uppercase brutalist-border border-b-0 text-center transition-all bg-white text-black";
            containerBank.classList.remove("hidden");
            containerCrypto.classList.add("hidden");

            // Manage required fields dynamically
            requiredBankInputs.forEach(id => document.getElementById(id).setAttribute("required", "true"));
            requiredCryptoInputs.forEach(id => document.getElementById(id).removeAttribute("required"));
        } else {
            tabBank.className = "flex-1 py-3 font-black uppercase brutalist-border border-b-0 mr-1 text-center transition-all bg-white text-black";
            tabCrypto.className = "flex-1 py-3 font-black uppercase brutalist-border border-b-0 text-center transition-all bg-black text-white";
            containerBank.classList.add("hidden");
            containerCrypto.classList.remove("hidden");

            // Manage required fields dynamically
            requiredBankInputs.forEach(id => document.getElementById(id).removeAttribute("required"));
            requiredCryptoInputs.forEach(id => document.getElementById(id).setAttribute("required", "true"));
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        
        const amount = parseFloat(document.getElementById("withdraw-amount").value);
        if (isNaN(amount) || amount <= 0) {
            alert("PROCESSING ERROR: ENTER A CORRECT CONVERSION LIQUIDITY METRIC.");
            return;
        }

        if (amount > LedgerState.availableBalance) {
            alert("INSUFFICIENT FUNDS: CHOSEN VALUE EXCEEDS THE LOGGED AVAILABILITY MATRIX.");
            return;
        }

        // Generate Transaction details
        let destinationText = "";
        if (LedgerState.selectedMethod === "BANK") {
            const r = document.getElementById("bank-routing").value;
            const a = document.getElementById("bank-account").value;
            destinationText = `BANK WIRE (RTN: ...${r.substring(Math.max(0, r.length - 4))}, ACCT: ...${a.substring(Math.max(0, a.length - 4))})`;
        } else {
            const addr = document.getElementById("crypto-address").value;
            destinationText = `USDC (ADDR: ${addr.substring(0, 5)}...${addr.substring(Math.max(0, addr.length - 4))})`;
        }

        // Deduct balance and update transaction ledger
        LedgerState.availableBalance -= amount;
        
        const newTxId = `TXN-${Math.floor(10000 + Math.random() * 90000)}-MC`;
        const dateStr = new Date().toISOString().slice(0, 10);

        LedgerState.payouts.unshift({
            id: newTxId,
            date: dateStr,
            type: "LIQUIDITY_CASHOUT",
            amount: amount,
            destination: destinationText,
            status: "LIQUIDATING"
        });

        // Trigger Success Simulation Notification
        alert(`[SYSTEM CONFIRMATION]\nROUTE SUCCESSFUL: TRANSACTION ${newTxId} ASSIGNED\nDESTINATION: ${destinationText}\nFUNDS MOVED TO CONVERSION QUEUE.`);

        // Refresh Ledger Graphics
        renderUI();
        closeModal();

        // Reset Inputs inside form
        document.getElementById("withdrawal-form").reset();
    }

    // --- Global Interface Exposure ---
    window.PayoutProcessor = {
        openModal: openModal,
        closeModal: closeModal,
        switchMethod: switchMethod,
        handleFormSubmit: handleFormSubmit,
        state: LedgerState
    };

})();