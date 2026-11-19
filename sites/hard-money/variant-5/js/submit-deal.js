/**
 * Capital_Vault | Multi-Lender Quote Request & Deal Broadcast Wizard
 * High-fidelity reactive Alpine.js pipeline integration
 */

(function () {
  // Inject required styles for custom file inputs, animations and responsive wizard layout
  const style = document.createElement('style');
  style.innerHTML = `
    .wizard-backdrop {
      background: rgba(4, 6, 12, 0.85);
      backdrop-filter: blur(12px);
    }
    .wizard-panel {
      background: rgba(13, 20, 35, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .step-dot.active {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
    }
    .term-badge {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
  `;
  document.head.appendChild(style);

  // Auto-inject Wizard Trigger FAB (Floating Action Button) and the modal structure into DOM
  const wizardContainer = document.createElement('div');
  wizardContainer.setAttribute('x-data', 'dealWizard()');
  wizardContainer.setAttribute('x-init', 'init()');
  wizardContainer.innerHTML = `
    <!-- Glowing FAB Bottom-Right Trigger -->
    <div class="fixed bottom-6 right-6 z-40">
      <button @click="openWizard()" class="group relative flex items-center space-x-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-brand-400/20">
        <!-- Pulse effect ring -->
        <span class="absolute inset-0 rounded-2xl bg-brand-500/20 animate-ping opacity-75 group-hover:opacity-100 transition duration-300"></span>
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <svg class="relative w-5 h-5 text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <span class="relative">Broadcast Deal Request</span>
      </button>
    </div>

    <!-- MAIN INTERACTIVE DIALOG MODAL -->
    <div class="fixed inset-0 z-50 overflow-y-auto" x-show="isOpen" x-cloak style="display: none;">
      <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <!-- Backdrop Blur -->
        <div class="fixed inset-0 wizard-backdrop transition-opacity" @click="closeWizard()"></div>

        <!-- Wizard Shell -->
        <div class="relative transform overflow-hidden rounded-3xl wizard-panel text-left transition-all sm:my-8 sm:w-full sm:max-w-4xl max-h-[90vh] flex flex-col">
          <!-- Subtle top color edge -->
          <div class="h-1.5 w-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500"></div>

          <!-- Header -->
          <div class="px-8 py-5 border-b border-gray-800/60 flex justify-between items-center bg-gray-950/40">
            <div>
              <h3 class="text-xl font-extrabold text-white font-display flex items-center space-x-2">
                <span>Multi-Lender Quote Broadcast</span>
                <span class="text-xs font-mono font-medium bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded border border-brand-500/20 uppercase tracking-widest">Live Pipeline</span>
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">Submit your deal metrics to top matched institutional capital vaults simultaneously</p>
            </div>
            <button @click="closeWizard()" class="p-2.5 rounded-xl bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Central body grid (Split Screen: Left Estimator / Right Lead Steps) -->
          <div class="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
            
            <!-- LEFT PANEL: Dynamic Real-time Term Sheet Underwriter (Instantly updates as user types/slides) -->
            <div class="lg:col-span-5 bg-[#080d17] p-8 border-r border-gray-800/40 flex flex-col justify-between space-y-6">
              <div>
                <span class="text-[10px] font-bold tracking-widest uppercase text-brand-400">Live Term Sheet Estimator</span>
                <h4 class="text-white font-bold text-lg mt-1 font-display">Calculated Scenario</h4>
                <p class="text-xs text-gray-500 mt-1">Estimates optimized instantly based on property parameters, exit strategy and borrower track record.</p>

                <!-- Financial Gauges -->
                <div class="space-y-4 mt-6">
                  <!-- Loan-to-Value Dynamic Bar -->
                  <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                      <span class="text-gray-400">Requested Loan-to-Value (LTV)</span>
                      <span class="text-white" :class="getLTV() > 80 ? 'text-rose-400' : 'text-brand-400'" x-text="getLTV() + '%'">0%</span>
                    </div>
                    <div class="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                      <div class="bg-gradient-to-r from-brand-600 to-indigo-500 h-2 rounded-full transition-all duration-300" :style="'width: ' + Math.min(getLTV(), 100) + '%'"></div>
                    </div>
                  </div>

                  <!-- Exit Feasibility Gauge -->
                  <div class="pt-2">
                    <div class="flex justify-between text-xs font-semibold mb-1">
                      <span class="text-gray-400">Exit Strategy Viability</span>
                      <span class="text-emerald-400" x-text="deal.exitStrategy ? deal.exitStrategy : 'Select Strategy'">Ready</span>
                    </div>
                    <div class="p-3 bg-gray-950 rounded-xl border border-gray-900/60 flex items-center space-x-3 text-xs">
                      <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p class="text-gray-400 leading-relaxed" x-text="getStrategyAnalysis()"></p>
                    </div>
                  </div>
                </div>

                <!-- Instant Projected Term Specifications Grid -->
                <div class="grid grid-cols-2 gap-3 mt-6">
                  <div class="p-3.5 rounded-2xl term-badge">
                    <span class="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Estimated Rate Range</span>
                    <p class="text-base font-extrabold text-white mt-1" x-text="estimateInterestRate()"></p>
                  </div>
                  <div class="p-3.5 rounded-2xl term-badge">
                    <span class="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Projected LTC Ratio</span>
                    <p class="text-base font-extrabold text-white mt-1" x-text="getLTC() + '%'"></p>
                  </div>
                  <div class="p-3.5 rounded-2xl term-badge col-span-2">
                    <span class="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Minimum Required Equity</span>
                    <p class="text-base font-extrabold text-emerald-400 mt-1" x-text="getRequiredEquity()"></p>
                  </div>
                </div>
              </div>

              <!-- Vault Status Banner -->
              <div class="pt-6 border-t border-gray-950 flex items-center justify-between text-[11px] text-gray-500">
                <span class="flex items-center space-x-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Pipeline Secured via TLS-2</span>
                </span>
                <span class="font-mono text-gray-400" x-text="getStepPercentage() + '% Complete'"></span>
              </div>
            </div>

            <!-- RIGHT PANEL: Dynamic Multi-Step Lead Wizard Interface -->
            <div class="lg:col-span-7 p-8 flex flex-col justify-between">
              
              <!-- STEP TIMELINE INDICATOR BAR -->
              <div class="flex items-center justify-between mb-8">
                <template x-for="step in totalSteps" :key="step">
                  <div class="flex items-center flex-1 last:flex-initial">
                    <div class="step-dot w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white transition-all duration-300"
                         :class="currentStep >= step ? 'active bg-brand-600' : 'bg-gray-900 text-gray-500 border border-gray-800'">
                      <span x-show="currentStep <= step" x-text="step"></span>
                      <svg x-show="currentStep > step" class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <!-- Connector Line -->
                    <div class="h-[2px] flex-1 mx-2 bg-gray-900 rounded" x-show="step < totalSteps">
                      <div class="h-full bg-brand-500 rounded transition-all duration-300" :style="'width: ' + (currentStep > step ? '100%' : '0%')"></div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- STEP WINDOW CONTROLS -->
              <div class="flex-1 flex flex-col justify-center">

                <!-- STEP 1: SCENARIO METRICS (BASICS) -->
                <div x-show="currentStep === 1" class="space-y-5">
                  <div class="space-y-1">
                    <h5 class="text-base font-extrabold text-white uppercase tracking-tight">Step 1: Deal Framework</h5>
                    <p class="text-xs text-gray-400">Establish geographic and operational parameters for your property transaction.</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Transaction Location (State)</label>
                      <select x-model="deal.state" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                        <option value="">Select Target State</option>
                        <template x-for="state in statesList" :key="state">
                          <option :value="state" x-text="state"></option>
                        </template>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Program Format</label>
                      <select x-model="deal.loanType" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                        <option value="Fix and Flip Loans">Fix and Flip</option>
                        <option value="Bridge Loans">Bridge / Short-Term</option>
                        <option value="Investment Property Loans">Long-Term Rental</option>
                        <option value="New Construction Loans">Ground-Up Construction</option>
                        <option value="Refinance / Cash Out Loans">Refinance / Cash-Out</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Collateral / Asset Class</label>
                    <select x-model="deal.propertyType" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                      <option value="Single Family">Single Family Residence</option>
                      <option value="Multi Family">Multi-Family Residential</option>
                      <option value="Apartment">Apartment Complex (5+ Units)</option>
                      <option value="Commercial">Commercial (Office, Retail)</option>
                      <option value="Industrial">Industrial Warehouse</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Subject Property Physical Address</label>
                    <input type="text" x-model="deal.address" placeholder="Street Address, City, Zip" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10 placeholder-gray-600">
                  </div>
                </div>

                <!-- STEP 2: TRANSACTION PARAMETERS (FINANCIALS) -->
                <div x-show="currentStep === 2" class="space-y-5">
                  <div class="space-y-1">
                    <h5 class="text-base font-extrabold text-white uppercase tracking-tight">Step 2: Pro-Forma Metrics</h5>
                    <p class="text-xs text-gray-400">Define requested transaction allocation, purchase price, and value specifications.</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Purchase Contract Price ($)</label>
                      <input type="number" x-model="deal.purchasePrice" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Rehab / Capex Budget ($)</label>
                      <input type="number" x-model="deal.rehabCost" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Requested Capital Outlay ($)</label>
                      <input type="number" x-model="deal.loanAmount" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Estimated Exit / ARV ($)</label>
                      <input type="number" x-model="deal.arv" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Capital Exit Strategy</label>
                    <select x-model="deal.exitStrategy" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                      <option value="Quick Sell / Flip">Liquidation via Retail Sale (Flip)</option>
                      <option value="Refinance">Conventional Refinance (DSCR Hold)</option>
                      <option value="Cash Out Outflow">Cash-Out Outflow Consolidation</option>
                    </select>
                  </div>
                </div>

                <!-- STEP 3: TRANSACTION MEDIA (UPLOADER) -->
                <div x-show="currentStep === 3" class="space-y-5">
                  <div class="space-y-1">
                    <h5 class="text-base font-extrabold text-white uppercase tracking-tight">Step 3: Property Visual Assets</h5>
                    <p class="text-xs text-gray-400">Improve placement probability and term accuracy by uploading photos or blueprints.</p>
                  </div>

                  <!-- Drag and Drop Area -->
                  <div class="border-2 border-dashed border-gray-800 rounded-2xl p-8 text-center bg-gray-950/20 hover:border-brand-500/50 transition-colors duration-200 cursor-pointer relative"
                       @dragover.prevent=""
                       @drop.prevent="handleDrop($event)">
                    <input type="file" multiple accept="image/*" @change="handleFileSelect($event)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    
                    <div class="space-y-3">
                      <div class="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/20 shadow-inner">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-white">Drag & drop photo assets here</p>
                        <p class="text-xs text-gray-500 mt-1">Accepts PNG, JPG format up to 10MB total</p>
                      </div>
                    </div>
                  </div>

                  <!-- Photo previews grid -->
                  <div class="grid grid-cols-4 gap-3 pt-2" x-show="photoPreviews.length > 0">
                    <template x-for="(src, idx) in photoPreviews" :key="idx">
                      <div class="relative group aspect-square rounded-xl overflow-hidden border border-gray-800 bg-gray-950">
                        <img :src="src" class="w-full h-full object-cover">
                        <button @click="removePhoto(idx)" class="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-500 hover:bg-rose-600 text-white transition shadow opacity-0 group-hover:opacity-100">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- STEP 4: LIQUID PROVIDERS (VAULT SELECTOR) -->
                <div x-show="currentStep === 4" class="space-y-5">
                  <div class="space-y-1">
                    <h5 class="text-base font-extrabold text-white uppercase tracking-tight">Step 4: Mapped Liquidity Vaults</h5>
                    <p class="text-xs text-gray-400">Below are directory capital partners matching your transaction parameters.</p>
                  </div>

                  <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    <template x-for="lender in matchedLenders" :key="lender.Lender">
                      <label class="flex items-center justify-between p-4 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-brand-500/30 transition cursor-pointer">
                        <div class="flex items-center space-x-3.5">
                          <input type="checkbox" :value="lender.Lender" x-model="deal.selectedLenders" class="rounded bg-gray-950 border-gray-800 text-brand-600 focus:ring-brand-500 w-4 h-4">
                          <div>
                            <p class="text-sm font-bold text-white" x-text="lender.Lender"></p>
                            <p class="text-xs text-brand-400 font-medium" x-text="lender.State + ' • ' + lender.LoanType"></p>
                          </div>
                        </div>
                        <span class="text-[10px] bg-brand-500/10 text-brand-300 border border-brand-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Matched</span>
                      </label>
                    </template>

                    <div x-show="matchedLenders.length === 0" class="text-center py-8 p-4 bg-gray-950 rounded-2xl border border-gray-900">
                      <p class="text-xs text-gray-500 uppercase tracking-widest font-mono">No Local Mappings Found</p>
                      <p class="text-xs text-gray-400 mt-2 max-w-sm mx-auto">We don't see localized vaults for your selected state, but we will automatically broadcast to National pipelines.</p>
                    </div>
                  </div>

                  <div class="flex justify-between items-center text-xs text-gray-500 pt-2">
                    <span x-text="deal.selectedLenders.length + ' / ' + Math.max(matchedLenders.length, 1) + ' Vaults Selected'"></span>
                    <button @click="selectAllMatched()" class="text-brand-400 font-bold hover:text-brand-300">Select All Available</button>
                  </div>
                </div>

                <!-- STEP 5: CONTACT & COMPLIANCE UNDERWRITING -->
                <div x-show="currentStep === 5" class="space-y-5">
                  <div class="space-y-1">
                    <h5 class="text-base font-extrabold text-white uppercase tracking-tight">Step 5: Signatory Underwriting</h5>
                    <p class="text-xs text-gray-400">Complete authentication requirements to securely initialize transaction broadcasts.</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">First Name</label>
                      <input type="text" x-model="deal.firstName" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Last Name</label>
                      <input type="text" x-model="deal.lastName" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Secure Institutional Email Address</label>
                      <input type="email" x-model="deal.email" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Phone</label>
                      <input type="tel" x-model="deal.phone" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Borrower Track Record (Completed Projects)</label>
                    <select x-model="deal.experienceCount" class="w-full glass-input text-sm rounded-xl px-4 py-3 text-white focus:outline-none bg-white/5 border border-white/10">
                      <option value="First Deal">First Deal (Entry Level Level)</option>
                      <option value="1-2 Deals">1-2 Tracked Deals (Intermediate)</option>
                      <option value="3-5 Deals">3-5 Tracked Deals (Seasoned)</option>
                      <option value="5+ Deals">5+ Tracked Deals (Institutional / Developer)</option>
                    </select>
                  </div>
                </div>

                <!-- SUBMITTING SIMULATION STATUS (Shows after submit button is triggered) -->
                <div x-show="isSubmitting" class="space-y-6 text-center py-12">
                  <div class="relative w-16 h-16 mx-auto">
                    <span class="absolute inset-0 rounded-full border-4 border-indigo-500/20"></span>
                    <span class="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></span>
                  </div>
                  <div>
                    <h6 class="text-white font-extrabold text-base">Broadcasting Scenario...</h6>
                    <p class="text-xs text-gray-500 mt-2 max-w-xs mx-auto">Generating synchronized pro-forma pipelines. Secured term proposals will populate shortly.</p>
                  </div>
                </div>

                <!-- SUBMISSION COMPLETE (SUCCESS VIEW) -->
                <div x-show="submissionSuccess" class="space-y-5 text-center py-8">
                  <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div class="space-y-1">
                    <h6 class="text-white font-extrabold text-xl">Broadcast Dispatched Successfully</h6>
                    <p class="text-xs text-emerald-400 font-semibold uppercase tracking-widest">Multi-Lender Handshake Established</p>
                    <p class="text-xs text-gray-400 max-w-md mx-auto pt-2">Lender desks have received your package. We will record the transaction logs and alert you immediately upon formal term execution.</p>
                  </div>
                  <div class="pt-4">
                    <button @click="closeWizard()" class="px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase transition">Close Matrix Control</button>
                  </div>
                </div>

              </div>

              <!-- BUTTON ACTION PIPELINES -->
              <div class="pt-8 border-t border-gray-800/40 mt-8 flex justify-between" x-show="!isSubmitting && !submissionSuccess">
                <button @click="prevStep()" class="px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-bold uppercase tracking-wider transition" :disabled="currentStep === 1" :class="currentStep === 1 ? 'opacity-40 cursor-not-allowed' : ''">
                  Previous Phase
                </button>
                
                <button @click="nextStep()" class="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-brand-500/15 flex items-center space-x-2">
                  <span x-text="currentStep === totalSteps ? 'Dispatch Pro-Forma' : 'Next Phase'"></span>
                  <svg x-show="currentStep !== totalSteps" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wizardContainer);

  // ALPINE CONTROLLER DEFINITION
  window.dealWizard = function () {
    return {
      isOpen: false,
      currentStep: 1,
      totalSteps: 5,
      deal: {
        address: '',
        state: '',
        propertyType: 'Single Family',
        loanType: 'Fix and Flip Loans',
        loanAmount: 180000,
        purchasePrice: 240000,
        rehabCost: 45000,
        arv: 350000,
        exitStrategy: 'Quick Sell / Flip',
        selectedLenders: [],
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        experienceCount: '1-2 Deals'
      },
      photoPreviews: [],
      matchedLenders: [],
      isSubmitting: false,
      submissionSuccess: false,

      statesList: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming'
      ],

      init() {
        // Automatically sync matched lenders when transaction details modify
        this.$watch('deal.state', () => this.evaluateMatches());
        this.$watch('deal.loanType', () => this.evaluateMatches());
      },

      openWizard() {
        this.isOpen = true;
        this.currentStep = 1;
        this.isSubmitting = false;
        this.submissionSuccess = false;
        this.evaluateMatches();
        this.dispatchAuditLog('Wizard Pipeline Initialized', 'Interlocking dynamic multi-lender state engine');
      },

      closeWizard() {
        this.isOpen = false;
      },

      nextStep() {
        if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this.dispatchAuditLog(`Progressed to step ${this.currentStep}`, 'Real-time term compiler refreshed');
        } else {
          this.submitDeal();
        }
      },

      prevStep() {
        if (this.currentStep > 1) {
          this.currentStep--;
        }
      },

      getStepPercentage() {
        return Math.round(((this.currentStep - 1) / this.totalSteps) * 100);
      },

      // Dynamic Real-time Calculations
      getLTV() {
        if (!this.deal.purchasePrice || !this.deal.loanAmount) return 0;
        return Math.round((this.deal.loanAmount / this.deal.purchasePrice) * 100);
      },

      getLTC() {
        const totalCost = Number(this.deal.purchasePrice) + Number(this.deal.rehabCost);
        if (!totalCost || !this.deal.loanAmount) return 0;
        return Math.round((this.deal.loanAmount / totalCost) * 100);
      },

      getRequiredEquity() {
        const totalCost = Number(this.deal.purchasePrice) + Number(this.deal.rehabCost);
        const equity = totalCost - Number(this.deal.loanAmount);
        if (equity <= 0) return '$0 (Leveraged)';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(equity);
      },

      estimateInterestRate() {
        let base = 8.5; // Starting base standard rate

        // Reduce rate for high collateral equity / lower LTV
        const ltv = this.getLTV();
        if (ltv < 60) base -= 1.0;
        else if (ltv < 75) base -= 0.5;

        // Reduce rate for highly experienced borrowers
        if (this.deal.experienceCount === '5+ Deals') base -= 1.0;
        else if (this.deal.experienceCount === '3-5 Deals') base -= 0.5;

        // Long-term rentals typically secure better rate margins than flips
        if (this.deal.loanType === 'Investment Property Loans') base -= 1.0;

        return `${base.toFixed(2)}% - ${(base + 2).toFixed(2)}%`;
      },

      getStrategyAnalysis() {
        if (!this.deal.exitStrategy) return 'Select an exit plan to calculate feasibility.';
        const ltv = this.getLTV();
        if (this.deal.exitStrategy === 'Quick Sell / Flip') {
          if (ltv > 85) return 'High exposure flip. Lower the requested loan amount to improve speed.';
          return 'Viable liquidated exit. Underwriters favor standard margins.';
        }
        if (this.deal.exitStrategy === 'Refinance') {
          const arv = Number(this.deal.arv);
          if (arv && (this.deal.loanAmount / arv) > 0.75) return 'Potential LTV friction on refinance exit.';
          return 'DSCR Hold friendly. Safe refinancing parameters.';
        }
        return 'Standard exit parameters detected.';
      },

      // Media Asset Pipelines
      handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
      },

      handleDrop(e) {
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
      },

      processFiles(files) {
        files.forEach(file => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
              this.photoPreviews.push(event.target.result);
              this.dispatchAuditLog('Asset visual attached', `Uploaded: ${file.name}`);
            };
            reader.readAsDataURL(file);
          }
        });
      },

      removePhoto(index) {
        this.photoPreviews.splice(index, 1);
      },

      // Capital directory matching logic
      evaluateMatches() {
        // Grab directory Alpine state if component initialized, else fall back to local database mapping
        const parentEl = document.querySelector('[x-data="lenderDirectory()"]');
        let rawLenders = [];
        if (parentEl && parentEl.__x) {
          rawLenders = parentEl.__x.$data.lenders;
        }

        // Fallback default list if loaded outside standard component directory
        if (!rawLenders || rawLenders.length === 0) {
          rawLenders = [
            { Lender: "Colony American Finance", State: "Alaska", LoanType: "Investment Property Loans" },
            { Lender: "Asset Avenue", State: "Alabama", LoanType: "Hard Money Loans" },
            { Lender: "Source Capital", State: "Arizona", LoanType: "Hard Money Loans" },
            { Lender: "Great Oak Capital", State: "Pennsylvania", LoanType: "Hard Money Loans" },
            { Lender: "CIVIC Private Money Lending", State: "Arizona", LoanType: "Hard Money Loans" },
            { Lender: "Corevest", State: "Alaska", LoanType: "Investment Property Loans" },
            { Lender: "Tidal Loans", State: "Texas", LoanType: "Hard Money Loans" }
          ];
        }

        // Filter matched vaults
        this.matchedLenders = rawLenders.filter(l => {
          const stateMatch = !this.deal.state || l.State === this.deal.state || l.LendingLocation === 'National';
          return stateMatch;
        });

        // Initialize state mapping with matching selections auto-checked
        this.deal.selectedLenders = this.matchedLenders.map(l => l.Lender);
      },

      selectAllMatched() {
        this.deal.selectedLenders = this.matchedLenders.map(l => l.Lender);
      },

      // Submit execution pipeline
      submitDeal() {
        if (!this.deal.firstName || !this.deal.email) {
          alert('Missing required underwriter information. Please fill out contact steps.');
          return;
        }

        this.isSubmitting = true;
        this.dispatchAuditLog('Broadcast transaction triggered', `Targeting ${this.deal.selectedLenders.length} specific capital streams`);

        // Simulating highly responsive transaction processing delay
        setTimeout(() => {
          this.isSubmitting = false;
          this.submissionSuccess = true;
          this.dispatchAuditLog('Pipeline broadcast executed', `Synchronized term sheets sent to standard pipeline.`);
        }, 3000);
      },

      // Helper to dynamically interact with primary Audit Trail logs in base HTML UI
      dispatchAuditLog(msg, details) {
        const parentEl = document.querySelector('[x-data="lenderDirectory()"]');
        if (parentEl && parentEl.__x) {
          parentEl.__x.$data.addAuditLog(msg, details);
        } else {
          console.log(`[Audit Trail] ${msg} : ${details}`);
        }
      }
    };
  };

})();