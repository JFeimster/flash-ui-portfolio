import React from 'react';
import './styles.css';

export default function Page() {
  return (
    <main className="min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: `
<nav>
        <div class="container">
            <div class="logo">CFO-IN-A-<span>BOX</span></div>
            <div class="nav-links flex">
                <a href="#">How It Works</a>
                <a href="#">Features</a>
                <a href="#">Use Cases</a>
                <a href="#">Pricing</a>
                <a href="#">Resources</a>
            </div>
            <div class="nav-btns flex">
                <a href="#" class="btn btn-outline">Try Free GPT</a>
                <a href="#" class="btn btn-primary">Get Financial Clarity</a>
            </div>
        </div>
    </nav>

    <main>
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <div class="badge">AI-Powered Finance Command Center</div>
                <h1>CFO-level clarity<br><span class="text-gradient">without CFO-level payroll.</span></h1>
                <p>Upload your financials and get cash flow forecasts, burn rate analysis, and plain-English financial guidance before the bank account starts screaming.</p>
                <div class="hero-ctas flex">
                    <a href="#" class="btn btn-primary" style="padding: 16px 32px; font-size: 1rem;">Get My Financial Snapshot</a>
                    <a href="#" class="btn btn-outline" style="padding: 16px 32px; font-size: 1rem;">Try the Free GPT</a>
                </div>
                <div class="trust-line">Built for founders who are done flying blind</div>
            </div>
        </section>

        <!-- Dashboard Preview -->
        <div class="container" style="position: relative; z-index: 5;">
            <div class="dashboard-mockup">
                <div class="db-sidebar">
                    <div class="db-nav-item active">Dashboard</div>
                    <div class="db-nav-item">Cash Flow Analysis</div>
                    <div class="db-nav-item">Scenario Builder</div>
                    <div class="db-nav-item">Funding Readiness</div>
                    <div class="db-nav-item" style="margin-top: 40px; opacity: 0.5;">Settings</div>
                </div>
                <div class="db-content">
                    <div class="db-main-grid">
                        <div class="db-card">
                            <div class="db-label">Funding Readiness</div>
                            <div class="db-value" style="color: var(--primary);">72<span style="font-size: 0.8rem; color: #555;"> / 100</span></div>
                            <div class="db-trend up">Good (+4%)</div>
                        </div>
                        <div class="db-card">
                            <div class="db-label">Monthly Runway</div>
                            <div class="db-value">5.8 <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-muted);">mo</span></div>
                            <div class="db-trend down" style="color: var(--secondary);">Stabilizing</div>
                        </div>
                        <div class="db-card">
                            <div class="db-label">Net Cash Flow</div>
                            <div class="db-value">+\$8,450</div>
                            <div class="db-trend up">↑ 12% vs LY</div>
                        </div>
                    </div>
                    <div class="db-chart-area flex" style="align-items: flex-end; gap: 8px;">
                        <div style="flex: 1; height: 60%; background: #1f242d; border-radius: 2px;"></div>
                        <div style="flex: 1; height: 75%; background: #1f242d; border-radius: 2px;"></div>
                        <div style="flex: 1; height: 45%; background: #1f242d; border-radius: 2px;"></div>
                        <div style="flex: 1; height: 90%; background: var(--primary); border-radius: 2px; box-shadow: 0 0 15px var(--glow);"></div>
                        <div style="flex: 1; height: 82%; background: #1f242d; border-radius: 2px;"></div>
                        <div style="flex: 1; height: 65%; background: #1f242d; border-radius: 2px;"></div>
                        <div class="mono" style="position: absolute; top: 15px; right: 15px; color: var(--text-muted);">Forecast: Q4 Growth</div>
                    </div>
                    <div class="db-ai-panel" style="margin-top: 16px;">
                        <div class="mono" style="color: var(--primary); margin-bottom: 8px;">&gt; AI CFO_INSIGHT_042</div>
                        <p>Cash flow is positive, but contractor expenses increased 22% this month. Funding readiness is decent, but documentation needs cleanup. Recommend renegotiating software stack before EOM.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Problem Section -->
        <section>
            <div class="container">
                <div class="section-header">
                    <h2>Most owners don’t need more spreadsheets. <br><span class="text-gradient">They need financial signal.</span></h2>
                </div>
                <div class="pain-grid grid">
                    <div class="pain-card">
                        <h4>You know revenue, but not runway.</h4>
                        <p>The bank balance looks fine today, but you have no idea if you'll survive a slow quarter.</p>
                    </div>
                    <div class="pain-card">
                        <h4>Your P&L says profit, but your bank account says panic.</h4>
                        <p>Tracking paper profit is easy. Managing real-world cash flow is where the war is won.</p>
                    </div>
                    <div class="pain-card">
                        <h4>Your documents look like a crime scene.</h4>
                        <p>You want funding or a loan, but the thought of opening your books makes you want to hide.</p>
                    </div>
                    <div class="pain-card">
                        <h4>Decisions based on vibes.</h4>
                        <p>Hiring, spending, and growth shouldn't be a coin toss. It should be a calculation.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section style="background: var(--bg-card);">
            <div class="container">
                <div class="section-header" style="text-align: center;">
                    <h2>Upload. Analyze. Act.</h2>
                </div>
                <div class="step-grid grid">
                    <div class="step-card">
                        <div class="step-num">01</div>
                        <h3>Upload Financials</h3>
                        <p>Sync your bank, drop your P&L spreadsheets, or export from Stripe. We handle the messy data ingestion.</p>
                    </div>
                    <div class="step-card">
                        <div class="step-num">02</div>
                        <h3>Get CFO Analysis</h3>
                        <p>Our AI processes every transaction to map burn, runway, cost leaks, and funding readiness scores.</p>
                    </div>
                    <div class="step-card">
                        <div class="step-num">03</div>
                        <h3>Make Better Decisions</h3>
                        <p>Know exactly what to cut, who to hire, and when you're ready to raise capital without the "spreadsheet goblin" stress.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Core Features -->
        <section>
            <div class="container">
                <div class="section-header">
                    <h2>Your financial command center.</h2>
                </div>
                <div class="feature-grid grid">
                    <div class="feature-card">
                        <h3>Cash Flow Forecast</h3>
                        <p>Visual mapping of incoming and outgoing capital so you can spot "tight zones" 3 months before they hit.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Burn Rate + Runway</h3>
                        <p>No more guessing. Know exactly how much time you have left at your current spend level.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Funding Readiness</h3>
                        <p>An objective score showing how lenders and investors see your business health right now.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Cost Leak Detection</h3>
                        <p>Identify zombie subscriptions, bloated SaaS stacks, and ROI-negative expenses automatically.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Scenario Modeling</h3>
                        <p>"What happens if I hire two developers?" "What if I lose my biggest client?" Model it before it happens.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Weekly Financial Review</h3>
                        <p>A repeatable rhythm to keep you in control. Stop checking your bank balance like it's a Magic 8 Ball.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section style="background: #000;">
            <div class="container">
                <div class="section-header" style="text-align: center;">
                    <h2>Start with the GPT. <br>Grow into a financial operating system.</h2>
                </div>
                <div class="price-grid grid">
                    <div class="price-card">
                        <h3>Free GPT</h3>
                        <p>For DIY clarity.</p>
                        <div class="cost">\$0<span>/mo</span></div>
                        <ul>
                            <li>CFO-in-a-Box GPT access</li>
                            <li>Manual file uploads</li>
                            <li>Basic cash flow check</li>
                            <li>Weekly review prompts</li>
                        </ul>
                        <a href="#" class="btn btn-outline">Try Free</a>
                    </div>
                    <div class="price-card">
                        <h3>Starter Lab</h3>
                        <p>For the builder.</p>
                        <div class="cost">\$49<span>/mo</span></div>
                        <ul>
                            <li>Private group access</li>
                            <li>Notion/Sheets Templates</li>
                            <li>Prompt Vault access</li>
                            <li>Monthly AMA Clinic</li>
                        </ul>
                        <a href="#" class="btn btn-outline">Join Lab</a>
                    </div>
                    <div class="price-card featured">
                        <div class="recommend-tag">FOUNDER FAVORITE</div>
                        <h3>Founder OS</h3>
                        <p>For the operator.</p>
                        <div class="cost">\$499<span>/mo</span></div>
                        <ul>
                            <li>Full FinOps Automation</li>
                            <li>Monthly Auto-Reporting</li>
                            <li>Cash Flow Dashboard</li>
                            <li>Alerts & Cost Leak Scans</li>
                            <li>Stripe & Bank Sync</li>
                        </ul>
                        <a href="#" class="btn btn-primary">Install Founder OS</a>
                    </div>
                    <div class="price-card">
                        <h3>Advisor Desk</h3>
                        <p>For high stakes.</p>
                        <div class="cost">\$1,500<span>/mo</span></div>
                        <ul>
                            <li>Everything in Founder OS</li>
                            <li>Human-in-the-loop review</li>
                            <li>Monthly Advisory Memo</li>
                            <li>Bi-weekly Strategy Call</li>
                            <li>Direct Decision Support</li>
                        </ul>
                        <a href="#" class="btn btn-outline">Add Support</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Use Cases -->
        <section>
            <div class="container">
                <div class="section-header">
                    <h2>Built for the decisions that keep owners up at night.</h2>
                </div>
                <div class="use-case-grid grid">
                    <div class="use-case-card">Can I afford to hire?</div>
                    <div class="use-case-card">Should I cut expenses?</div>
                    <div class="use-case-card">Am I ready for funding?</div>
                    <div class="use-case-card">How much runway?</div>
                    <div class="use-case-card">What if revenue drops?</div>
                    <div class="use-case-card">Increase ad spend?</div>
                    <div class="use-case-card">Can I take on debt?</div>
                    <div class="use-case-card">Weekly review rhythm?</div>
                </div>
            </div>
        </section>

        <!-- Lead Magnet -->
        <section>
            <div class="container">
                <div class="lead-section text-center" style="text-align: center;">
                    <h2>Get your free financial snapshot.</h2>
                    <p>Answer 6 questions and see where your business stands.</p>
                    <form class="snapshot-form grid">
                        <div class="form-group">
                            <label>Business Type</label>
                            <select><option>SaaS / Tech</option><option>Agency / Service</option><option>Ecommerce</option></select>
                        </div>
                        <div class="form-group">
                            <label>Monthly Revenue</label>
                            <input type="text" placeholder="\$0.00">
                        </div>
                        <div class="form-group">
                            <label>Current Cash Balance</label>
                            <input type="text" placeholder="\$0.00">
                        </div>
                        <div class="form-group">
                            <label>Biggest Financial Concern</label>
                            <select><option>Runway / Burn</option><option>Funding Readiness</option><option>Cost Control</option></select>
                        </div>
                        <div class="form-group" style="grid-column: span 2;">
                            <button type="button" class="btn btn-primary" style="width: 100%;">Generate My Snapshot</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        <!-- Final CTA -->
        <section style="text-align: center; border-top: none;">
            <div class="container">
                <h2 style="font-size: 3.5rem;">Stop guessing. Start operating.</h2>
                <p style="font-size: 1.25rem; margin-bottom: 2.5rem;">Financial clarity for owners who are done flying blind.</p>
                <div class="flex" style="justify-content: center; gap: 1rem;">
                    <a href="#" class="btn btn-primary" style="padding: 18px 40px;">Get Founder OS</a>
                    <a href="#" class="btn btn-outline" style="padding: 18px 40px;">Chat with the GPT</a>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <div class="footer-grid grid">
                <div class="footer-col">
                    <div class="logo" style="margin-bottom: 1.5rem;">CFO-IN-A-<span>BOX</span></div>
                    <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 300px;">Providing the financial visibility small business owners need to build sustainable, funding-ready companies.</p>
                </div>
                <div class="footer-col">
                    <h5>Product</h5>
                    <ul>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Use Cases</a></li>
                        <li><a href="#">Free GPT</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h5>Resources</h5>
                    <ul>
                        <li><a href="#">Cash Flow Guide</a></li>
                        <li><a href="#">Funding Checklist</a></li>
                        <li><a href="#">Review Templates</a></li>
                        <li><a href="#">Cost Cutting Lab</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h5>Company</h5>
                    <ul>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Terms</a></li>
                    </ul>
                </div>
            </div>
            <p class="disclaimer">
                DISCLAIMER: CFO-in-a-Box provides business planning and financial decision-support tools. We are not a licensed CPA firm, law firm, or investment advisor. Our tools provide directional analysis and should not be used as the sole basis for tax, legal, accounting, or investment decisions. We do not guarantee funding approval from any third-party lender or investor.
            </p>
        </div>
    </footer>
      ` }} />
    </main>
  );
}