(function () {
    // Financial State & Dummy Ledger Ledger Data
    const state = {
        currentBalance: 742.50,
        threshold: 1000.00,
        payoutMethod: 'USDC_TRC20',
        payoutAddress: 'TUp7K1e9Gv8Wq2Yy4Zz3X9A1F4G7H9',
        history: [
            { id: 'TX-9082', date: '2023-11-20', amount: 1450.00, method: 'USDC_TRC20', status: 'COMPLETED' },
            { id: 'TX-8911', date: '2023-10-31', amount: 890.00, method: 'BANK_WIRE', status: 'COMPLETED' },
            { id: 'TX-7402', date: '2023-09-15', amount: 2100.00, method: 'USDC_ERC20', status: 'COMPLETED' },
            { id: 'TX-6120', date: '2023-08-01', amount: 350.00, method: 'BTC_MAINNET', status: 'COMPLETED' }
        ]
    };

    // Auto-mount helper when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('payouts-ledger');
        if (container) {
            initialize(container);
        }
    });

    /**
     * Mounts the Brutalist Payouts & Commissions Ledger UI inside a target element
     * @param {HTMLElement|string} targetElement - Container element or ID selector
     */
    function initialize(targetElement) {
        const container = typeof targetElement === 'string' 
            ? document.getElementById(targetElement) 
            : targetElement;

        if (!container) return;

        // Apply clean reset class layouts if needed
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <!-- Left panel: Chunky progress bar and ledger table (8 cols) -->
                <div class="lg:col-span-8 flex flex-col justify-between gap-6">
                    
                    <!-- THRESHOLD METRIC CARD -->
                    <div class="bg-zinc-950 p-6 border-4 border-white neo-shadow-white space-y-4">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                            <div>
                                <span class="text-xs font-mono text-zinc-400 block tracking-widest">// CURRENT CYCLE ACCUMULATION</span>
                                <h3 class="text-4xl md:text-6xl font-black text-white tracking-tight" id="balance-display">$${state.currentBalance.toFixed(2)}</h3>
                            </div>
                            <div class="md:text-right">
                                <span class="text-xs font-mono text-zinc-400 block tracking-widest">THRESHOLD ROUTE</span>
                                <h4 class="text-2xl font-black text-[#ff4800]">$${state.threshold.toFixed(2)}</h4>
                            </div>
                        </div>

                        <!-- Heavy Progress Bar Container -->
                        <div class="border-4 border-white bg-black p-1 h-12 flex items-center relative overflow-hidden select-none">
                            <div id="progress-indicator-fill" class="bg-[#00ff66] h-full transition-all duration-700 ease-out border-r-4 border-black" style="width: ${Math.min((state.currentBalance / state.threshold) * 100, 100)}%"></div>
                            <span id="progress-text" class="absolute inset-0 flex items-center justify-center font-mono font-black text-xs md:text-sm text-white mix-blend-difference tracking-widest">
                                ${((state.currentBalance / state.threshold) * 100).toFixed(1)}% TO AUTOMATIC CONTRACT RELEASE
                            </span>
                        </div>

                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-[#00ff66] flex items-center gap-1">
                                <span class="inline-block w-2.5 h-2.5 bg-[#00ff66] blink"></span>
                                ROUTE ACTIVE: FAST TRACK PROTOCOL IN EFFECT
                            </span>
                            <span class="text-zinc-500 hidden sm:inline">NEXT RECONCILIATION: FRIDAY 00:00 UTC</span>
                        </div>
                    </div>

                    <!-- LEDGER TRANSACTION TABLE -->
                    <div class="border-4 border-white bg-black flex-grow flex flex-col justify-between">
                        <div>
                            <!-- Table Header stamp -->
                            <div class="bg-white text-black p-4 font-black text-sm uppercase tracking-widest flex justify-between items-center border-b-4 border-white">
                                <span class="flex items-center gap-2">
                                    <span class="w-3 h-3 bg-[#ff4800] inline-block"></span>
                                    PAST DISBURSEMENTS REGISTRY
                                </span>
                                <span class="bg-[#00ff66] text-black text-[10px] font-mono px-2 py-0.5 border-2 border-black font-black">
                                    LEDGER_SYNCHRONIZED
                                </span>
                            </div>

                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse font-mono text-xs">
                                    <thead>
                                        <tr class="border-b-4 border-white bg-zinc-950 text-zinc-400">
                                            <th class="p-4 uppercase tracking-wider font-black">TX ID</th>
                                            <th class="p-4 uppercase tracking-wider font-black">DATE SECURED</th>
                                            <th class="p-4 uppercase tracking-wider font-black">CLEARING AMOUNT</th>
                                            <th class="p-4 uppercase tracking-wider font-black">CHANNELS</th>
                                            <th class="p-4 uppercase tracking-wider font-black">STATUS</th>
                                            <th class="p-4 uppercase tracking-wider font-black text-right">AUDIT TRAIL</th>
                                        </tr>
                                    </thead>
                                    <tbody id="payout-table-body" class="divide-y-2 divide-zinc-900 bg-black text-white">
                                        <!-- Dynamic rendering via loadTable -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Ledger Total Info banner -->
                        <div class="bg-zinc-950 p-4 border-t-4 border-white flex justify-between items-center text-xs font-mono">
                            <span class="text-zinc-500">TOTAL SECURED OUTFLOW FOR AFFILIATE:</span>
                            <span class="text-[#00ff66] font-black text-sm" id="total-payouts-display"></span>
                        </div>
                    </div>
                </div>

                <!-- Right panel: Update payout routing channels form (4 cols) -->
                <div class="lg:col-span-4">
                    <div class="bg-[#ffffff] text-[#000000] p-6 border-4 border-white neo-shadow-white flex flex-col justify-between h-full relative overflow-hidden min-h-[450px]">
                        <!-- Decorative raw background watermark -->
                        <div class="absolute -bottom-10 -right-10 text-9xl font-black text-zinc-100 select-none tracking-tighter pointer-events-none transform -rotate-12 uppercase">
                            VAL
                        </div>

                        <div class="relative z-10 space-y-6">
                            <div>
                                <span class="bg-black text-[#ff4800] text-xs font-black px-3 py-1 uppercase tracking-widest inline-block mb-2">
                                    VAL ROUTING VAULT
                                </span>
                                <h3 class="text-3xl font-black uppercase tracking-tight leading-none">
                                    RE-ROUTE DISBURSEMENTS
                                </h3>
                                <p class="text-xs text-zinc-600 font-bold mt-2">
                                    Customize secure pipelines to bypass intermediate clearing banks. Update routing parameters to hot-route directly to source.
                                </p>
                            </div>

                            <!-- Stark Payout Update Form -->
                            <form id="payout-method-form" class="space-y-4">
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">
                                        // DISBURSE CHANNEL
                                    </label>
                                    <select id="method-select" class="w-full bg-white text-black font-black p-3 border-4 border-black focus:outline-none focus:border-[#ff4800] uppercase text-sm rounded-none">
                                        <option value="USDC_TRC20">USDC (TRC20 Network)</option>
                                        <option value="USDC_ERC20">USDC (ERC20 Network)</option>
                                        <option value="BANK_WIRE">US Bank Wire Transfer (FEDWIRE)</option>
                                        <option value="BTC_MAINNET">Bitcoin (On-Chain Mainnet)</option>
                                    </select>
                                </div>

                                <div>
                                    <label id="address-input-label" class="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">
                                        // WALLET DESTINATION KEY
                                    </label>
                                    <input type="text" id="address-input" 
                                        class="w-full bg-white text-black font-mono font-bold p-3 border-4 border-black focus:outline-none focus:border-[#ff4800] text-sm uppercase rounded-none placeholder-zinc-400"
                                        required>
                                </div>

                                <div class="pt-2">
                                    <button type="submit" class="w-full bg-[#ff4800] hover:bg-black hover:text-white text-black font-black text-sm uppercase py-4 tracking-widest border-4 border-black neo-shadow-accent transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rounded-none">
                                        COMMIT VAULT ROUTING CHANGE 📡
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Form security footstamp -->
                        <div class="relative z-10 mt-6 border-t-2 border-black pt-4 text-[10px] font-mono text-zinc-500 uppercase leading-relaxed">
                            WARNING: Altering your route locks disbursements for 24 hours. Multi-sig security protocols track connection configurations.
                        </div>
                    </div>
                </div>
            </div>

            <!-- SUCCESS TOAST NOTIFICATION -->
            <div id="payouts-toast" class="fixed bottom-6 right-6 bg-[#00ff66] text-black border-4 border-black p-4 font-black text-xs uppercase tracking-wider hidden z-50 neo-shadow">
                <span class="mr-2">⚡</span> ROUTING VAULT UPDATED SECURELY
            </div>
        `;

        // Cache elements
        const form = container.querySelector('#payout-method-form');
        const methodSelect = container.querySelector('#method-select');
        const addressInput = container.querySelector('#address-input');
        const addressLabel = container.querySelector('#address-input-label');

        // Initial setup
        loadTable(container);
        updateFormLabels(methodSelect.value, addressLabel, addressInput);

        // Bind interactive events
        methodSelect.addEventListener('change', (e) => {
            updateFormLabels(e.target.value, addressLabel, addressInput);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Save state
            state.payoutMethod = methodSelect.value;
            state.payoutAddress = addressInput.value.trim();

            // Trigger visual response feedback
            showToast(container);
            
            // Trigger customized terminal event inside sidebar if terminal script exists
            const terminalEventMsg = `ROUTE CHANNELS REDEPLOYED TO [${state.payoutMethod}]`;
            if (window.dispatchEvent) {
                const event = new CustomEvent('payoutRouteUpdated', { detail: terminalEventMsg });
                window.dispatchEvent(event);
            }
        });
    }

    /**
     * Updates label based on selected payout channel
     */
    function updateFormLabels(method, labelEl, inputEl) {
        if (method === 'BANK_WIRE') {
            labelEl.innerText = '// ABA ROUTING & ACCOUNT NUMBER';
            inputEl.placeholder = 'ROUTE-123456789 ACCOUNT-9876543210';
        } else if (method.startsWith('USDC')) {
            labelEl.innerText = '// WALLET DESTINATION KEY (USDC)';
            inputEl.placeholder = 'ENTER SECURE WALLET HASH';
        } else {
            labelEl.innerText = '// BITCOIN ADDRESS (MAINNET)';
            inputEl.placeholder = 'ENTER BTC SECURE ON-CHAIN ADDRESS';
        }

        // Hydrate from current state if methods align
        if (method === state.payoutMethod) {
            inputEl.value = state.payoutAddress;
        } else {
            inputEl.value = '';
        }
    }

    /**
     * Renders records into past disbursements table
     */
    function loadTable(container) {
        const tbody = container.querySelector('#payout-table-body');
        if (!tbody) return;

        let runningPayoutTotal = 0;

        tbody.innerHTML = state.history.map(tx => {
            runningPayoutTotal += tx.amount;
            return `
                <tr class="hover:bg-zinc-900 transition-colors">
                    <td class="p-4 font-black text-white tracking-widest">${tx.id}</td>
                    <td class="p-4 text-zinc-400">${tx.date}</td>
                    <td class="p-4 text-[#00ff66] font-black tracking-tight">$${tx.amount.toFixed(2)}</td>
                    <td class="p-4 text-zinc-300 font-mono text-[10px] tracking-wide">${tx.method}</td>
                    <td class="p-4">
                        <span class="bg-[#00ff66] text-black font-black px-2 py-0.5 text-[10px] uppercase border border-black">
                            ${tx.status}
                        </span>
                    </td>
                    <td class="p-4 text-right">
                        <button onclick="window.PayoutsLedger.downloadReceipt('${tx.id}')" 
                            class="bg-white hover:bg-[#ff4800] text-black font-black px-3 py-1.5 border-2 border-black uppercase text-[10px] tracking-wider transition-all duration-75 active:translate-y-[2px]">
                            RECEIPT ↓
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        const totalDisplay = container.querySelector('#total-payouts-display');
        if (totalDisplay) {
            totalDisplay.innerText = `$${runningPayoutTotal.toFixed(2)} USD`;
        }
    }

    /**
     * Triggers simulated browser file download for audit trail / receipt text
     */
    function downloadReceipt(txId) {
        const tx = state.history.find(t => t.id === txId);
        if (!tx) {
            alert('CRITICAL ERROR: REGISTER_NOT_FOUND');
            return;
        }

        const rawReceiptTemplate = `
============================================================
              M O O N S H I N E   C A P I T A L
                   ONBOARDING PIPELINE
============================================================
AFFILIATE AUDIT TRAIL RECORD - TX IDENTIFIER: ${tx.id}
============================================================
RELEASE SEQUENCE RECORD : SECURE-ROUTE-COMPLETED
SYSTEM RUN DATE         : ${tx.date}
CLEARANCE LEVEL         : HARD_SETTLED
DISBURSEMENT METRIC     : SUCCESS_ACH_USDC_SYNC

RECONCILIATION SUMMARY:
------------------------------------------------------------
COMMISSION VOLUMES CASH : $${tx.amount.toFixed(2)} USD
SETTLEMENT ROUTE        : ${tx.method}
VAULT ROUTE STAMP       : SECURE-MC-SESSION-v1-LOCK
AUTHORIZED ACCESS       : MOONSHINE LEDGER LEDGER CORE

STATEMENT OF UNDERSTANDING:
All transfers executed dynamically are calculated as Net-4% 
of aggregate source values. These assets are deemed strictly 
cleared to specified wallets on record. No transaction fees 
have been deferred to the target partner.
============================================================
SECURE AUTH_SIGNATURE: MD5_3c48a7b8e1f0e9b8823f05a91eeff1
MOONSHINE CAPITAL PARTNERS SYSTEMS © 2023 ALL RIGHTS RESERVED
============================================================
        `;

        const blob = new Blob([rawReceiptTemplate.trim()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MOONSHINE_LEDGER_RECEIPT_${tx.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Visual confirmation action
     */
    function showToast(container) {
        const toast = container.querySelector('#payouts-toast');
        if (!toast) return;

        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // Export module globally for hook accessibility
    window.PayoutsLedger = {
        init: initialize,
        downloadReceipt: downloadReceipt,
        state: state
    };
})();