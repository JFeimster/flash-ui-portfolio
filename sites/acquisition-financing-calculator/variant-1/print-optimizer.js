/**
 * Capital Architecture | Print Optimizer & Prospectus Generator
 * Version: 1.0.2-LUXE
 * Purpose: Transforms calculations into a high-fidelity print prospectus.
 */

(function() {
    const initPrintStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body {
                    background-color: white !important;
                    color: black !important;
                    padding: 0 !important;
                }
                .calc-container {
                    border: 2px solid #000 !important;
                    max-width: 100% !important;
                    width: 100% !important;
                    padding: 40px !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                }
                .btn-calculate, .print-trigger-btn {
                    display: none !important;
                }
                input {
                    color: black !important;
                    border-bottom: 1px solid #000 !important;
                }
                .progress-track {
                    border: 1px solid #000 !important;
                    background: #eee !important;
                    -webkit-print-color-adjust: exact;
                }
                .progress-fill {
                    background: #000 !important;
                    -webkit-print-color-adjust: exact;
                }
                .editorial-label {
                    color: #000 !important;
                    font-style: italic !important;
                }
                .percentage {
                    color: #000 !important;
                }
                .stats-footer {
                    border-top: 1px solid #000 !important;
                    opacity: 1 !important;
                    color: #000 !important;
                }
                .prospectus-watermark {
                    display: block !important;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 10rem;
                    color: rgba(0,0,0,0.03);
                    z-index: -1;
                    pointer-events: none;
                    text-transform: uppercase;
                    font-family: 'Inter', sans-serif;
                    font-weight: 900;
                }
            }
            .print-trigger-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: var(--verdigris);
                color: var(--black);
                border: 3px solid var(--bone-white);
                padding: 15px 25px;
                font-family: 'Inter', sans-serif;
                font-weight: 900;
                font-size: 0.8rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
            }
            .print-trigger-btn:hover {
                background: var(--acid-green);
                transform: scale(1.05);
            }
            .prospectus-watermark {
                display: none;
            }
            .signature-line {
                display: none;
            }
            @media print {
                .signature-line {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    margin-top: 100px;
                }
                .sig-box {
                    border-top: 1px solid #000;
                    padding-top: 10px;
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
            }
        `;
        document.head.appendChild(style);
    };

    const injectPrintElements = () => {
        const container = document.querySelector('.calc-container');
        
        // Add Watermark
        const watermark = document.createElement('div');
        watermark.className = 'prospectus-watermark';
        watermark.innerText = 'CONFIDENTIAL';
        document.body.appendChild(watermark);

        // Add Signature Lines for Print
        const sigSection = document.createElement('div');
        sigSection.className = 'signature-line';
        sigSection.innerHTML = `
            <div class="sig-box">Lead Underwriter Signature</div>
            <div class="sig-box">Sponsor Acceptance Date</div>
        `;
        container.appendChild(sigSection);

        // Add Print Button
        const printBtn = document.createElement('button');
        printBtn.className = 'print-trigger-btn';
        printBtn.innerText = 'Generate Prospectus PDF';
        printBtn.onclick = () => {
            const date = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const ref = 'CAP-' + Math.floor(Math.random() * 900000 + 100000);
            
            // Temporary update footer for print
            const footer = document.querySelector('.stats-footer');
            const originalFooter = footer.innerHTML;
            footer.innerHTML = `<span>Issued: ${date}</span><span>Ref: ${ref}</span><span>OFFICIAL PROSPECTUS</span>`;
            
            window.print();
            
            // Restore footer
            setTimeout(() => {
                footer.innerHTML = originalFooter;
            }, 500);
        };
        document.body.appendChild(printBtn);
    };

    const optimizeInputs = () => {
        // Ensure inputs are visible in print and formatted
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                input.setAttribute('value', input.value);
            });
        });
    };

    // Initialize
    initPrintStyles();
    injectPrintElements();
    optimizeInputs();

    console.log('Capital Architecture: Print Optimizer Loaded.');
})();