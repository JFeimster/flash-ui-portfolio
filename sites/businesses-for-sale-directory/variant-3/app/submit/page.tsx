"use client";

import React, { useState } from 'react';

export default function SubmitListing() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessName: '',
        industry: '',
        location: '',
        revenue: '',
        sde: '',
        askingPrice: '',
        description: '',
        sellerFinancing: false
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-[#050505]">
            <style jsx global>{`
                :root {
                    --obsidian: #050505;
                    --bone: #F5F5F0;
                    --acid-green: #C1FF00;
                    --oxidized-copper: #8E593E;
                    --blood-orange: #FF3D00;
                    --graphite: #1A1A1A;
                    --panel: #0F0F0F;
                    --noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }

                body::before {
                    content: "";
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: var(--noise);
                    opacity: 0.04;
                    pointer-events: none;
                    z-index: 9999;
                }

                .mono { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
                
                input, select, textarea {
                    background: var(--panel);
                    border: 2px solid var(--graphite);
                    color: var(--bone);
                    padding: 1.5rem;
                    font-family: 'JetBrains Mono', monospace;
                    width: 100%;
                    font-size: 1.1rem;
                    transition: border-color 0.2s;
                }

                input:focus {
                    outline: none;
                    border-color: var(--acid-green);
                }

                .step-indicator {
                    width: 12px;
                    height: 12px;
                    background: var(--graphite);
                }
                .step-indicator.active {
                    background: var(--acid-green);
                }

                .dropzone {
                    border: 2px dashed var(--graphite);
                    padding: 4rem 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .dropzone:hover {
                    border-color: var(--oxidized-copper);
                    background: #0a0a0a;
                }
            `}</style>

            {/* Navigation */}
            <nav className="flex justify-between items-center p-6 border-b-2 border-[#1A1A1A] sticky top-0 bg-[#050505] z-[100]">
                <a href="/" className="font-black text-2xl tracking-tighter uppercase">
                    OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
                </a>
                <div className="hidden md:flex gap-8 text-[0.7rem] font-bold uppercase tracking-widest">
                    <a href="#" className="hover:text-[#C1FF00]">Browse Deals</a>
                    <a href="#" className="hover:text-[#C1FF00]">Deal Analyzer</a>
                    <a href="#" className="text-[#C1FF00]">Submit Listing</a>
                </div>
                <div className="mono text-[0.7rem] text-[#C1FF00]">Status: Intake Open</div>
            </nav>

            <main className="max-w-4xl mx-auto py-16 px-6">
                <div className="mb-12">
                    <span className="mono text-[#8E593E] text-sm block mb-4">// THE MINT: INTAKE PORTAL</span>
                    <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                        List Your <br/>Enterprise.
                    </h1>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`step-indicator ${step >= i ? 'active' : ''}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-8 md:p-12 shadow-[20px_20px_0px_#1A1A1A]">
                    
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div>
                                <label className="mono text-[0.65rem] text-[#666] block mb-2 font-black">01. Asset Identification</label>
                                <input 
                                    type="text" 
                                    placeholder="BUSINESS LEGAL NAME OR ANONYMIZED TITLE"
                                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="mono text-[0.65rem] text-[#666] block mb-2 font-black">Industry Sector</label>
                                    <select onChange={(e) => setFormData({...formData, industry: e.target.value})}>
                                        <option>SELECT CATEGORY</option>
                                        <option>LOCAL SERVICE</option>
                                        <option>SAAS / DIGITAL</option>
                                        <option>ECOMMERCE</option>
                                        <option>MANUFACTURING</option>
                                        <option>AGENCY</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mono text-[0.65rem] text-[#666] block mb-2 font-black">Primary HQ Location</label>
                                    <input 
                                        type="text" 
                                        placeholder="CITY, STATE / REMOTE"
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={nextStep}
                                className="w-full bg-[#F5F5F0] text-[#050505] py-6 font-black uppercase text-sm hover:bg-[#C1FF00] transition-colors"
                            >
                                Continue to Financials
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="mono text-[0.65rem] text-[#666] block mb-2 font-black">Annual Revenue (LTM)</label>
                                    <input 
                                        type="number" 
                                        placeholder="$0.00"
                                        onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="mono text-[0.65rem] text-[#666] block mb-2 font-black">Annual SDE / EBITDA</label>
                                    <input 
                                        type="number" 
                                        placeholder="$0.00"
                                        onChange={(e) => setFormData({...formData, sde: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mono text-[0.65rem] text-[#666] block mb-2 font-black">Asking Price</label>
                                <input 
                                    type="number" 
                                    placeholder="$0.00"
                                    className="text-[#C1FF00]"
                                    onChange={(e) => setFormData({...formData, askingPrice: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center gap-4 border-2 border-[#1A1A1A] p-6">
                                <input 
                                    type="checkbox" 
                                    className="w-6 h-6 accent-[#C1FF00]"
                                    onChange={(e) => setFormData({...formData, sellerFinancing: e.target.checked})}
                                />
                                <label className="mono text-xs font-bold">Offer Seller Financing / Earn-out terms?</label>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={prevStep} className="w-1/3 border-2 border-[#F5F5F0] py-6 font-black uppercase text-sm">Back</button>
                                <button onClick={nextStep} className="w-2/3 bg-[#F5F5F0] text-[#050505] py-6 font-black uppercase text-sm hover:bg-[#C1FF00]">Next: Verification</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div>
                                <label className="mono text-[0.65rem] text-[#666] block mb-2 font-black">03. The Vault (Confidential)</label>
                                <p className="text-xs text-[#888] mb-4 uppercase font-bold tracking-wider">Upload P&L statements for the last 3 years and current YTD. High-quality data increases deal visibility by 400%.</p>
                                <div className="dropzone">
                                    <div className="mono text-xs text-[#8E593E] mb-2 font-black">Drag & Drop Financials</div>
                                    <div className="text-[0.6rem] text-[#444]">PDF, CSV, OR XLSX ONLY. ENCRYPTED UPLOAD.</div>
                                </div>
                            </div>
                            <div>
                                <label className="mono text-[0.65rem] text-[#666] block mb-2 font-black">Brief Executive Summary</label>
                                <textarea 
                                    rows={4} 
                                    placeholder="Describe the value proposition, competitive moats, and reason for sale..."
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={prevStep} className="w-1/3 border-2 border-[#F5F5F0] py-6 font-black uppercase text-sm">Back</button>
                                <button className="w-2/3 bg-[#C1FF00] text-[#050505] py-6 font-black uppercase text-sm shadow-[10px_10px_0px_#8E593E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                                    Submit to Registry
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-12 p-8 border-l-4 border-[#FF3D00] bg-[#111]">
                    <h4 className="mono text-[#FF3D00] text-xs font-black mb-2">Vetting Notice</h4>
                    <p className="text-[0.7rem] text-[#888] leading-relaxed uppercase">
                        All listings undergo a 48-hour verification process. Our analysts cross-reference SDE figures with uploaded tax documentation. Submissions with incomplete financials will be rejected from the private terminal.
                    </p>
                </div>
            </main>

            <footer className="border-t-2 border-[#1A1A1A] mt-24 p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <div className="font-black text-xl tracking-tighter uppercase mb-4">
                            OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
                        </div>
                        <p className="mono text-[0.6rem] text-[#444]">Secure Terminal Access: v2.04.1</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="flex flex-col gap-2 text-[0.6rem] font-black uppercase">
                            <span className="text-[#666] mb-2">Directory</span>
                            <a href="#">SaaS</a>
                            <a href="#">Local Svc</a>
                            <a href="#">Agency</a>
                        </div>
                        <div className="flex flex-col gap-2 text-[0.6rem] font-black uppercase">
                            <span className="text-[#666] mb-2">Legal</span>
                            <a href="#">NDA Template</a>
                            <a href="#">Terms</a>
                            <a href="#">Privacy</a>
                        </div>
                        <div className="flex flex-col gap-2 text-[0.6rem] font-black uppercase">
                            <span className="text-[#666] mb-2">Connect</span>
                            <a href="#">X / Twitter</a>
                            <a href="#">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}