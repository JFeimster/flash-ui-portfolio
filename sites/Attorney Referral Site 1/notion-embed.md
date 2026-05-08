### Generated UI Component

To use this in Notion:
1. Create a "/code" block
2. Set language to "HTML"
3. Paste the following:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Funding Referral Resource for Attorneys | Moonshine Capital</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --midnight: #0B0E14;
            --charcoal: #161B22;
            --navy-deep: #1c2533;
            --parchment: #F0EAD6;
            --parchment-muted: #A3A3A3;
            --gold: #C5A059;
            --gold-glow: rgba(197, 160, 89, 0.2);
            --border: rgba(255, 255, 255, 0.1);
            --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: var(--midnight);
            color: var(--parchment);
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3 {
            font-family: 'Playfair Display', serif;
            font-weight: 400;
            letter-spacing: -0.01em;
        }

        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        /* Navigation */
        nav {
            padding: 2rem 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
        }

        .logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--gold);
        }

        /* Hero Section */
        .hero {
            padding: 6rem 0 4rem;
            text-align: center;
        }

        .hero h1 {
            font-size: 3.5rem;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--parchment-muted);
            max-width: 700px;
            margin: 0 auto 2.5rem;
            font-weight: 300;
        }

        .cta-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: var(--transition);
            border-radius: 2px;
        }

        .btn-primary {
            background-color: var(--gold);
            color: var(--midnight);
            border: 1px solid var(--gold);
        }

        .btn-primary:hover {
            background-color: transparent;
            color: var(--gold);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--parchment);
            border: 1px solid var(--border);
        }

        .btn-secondary:hover {
            border-color: var(--gold);
            color: var(--gold);
        }

        /* Use Cases Grid */
        .section-label {
            text-transform: uppercase;
            color: var(--gold);
            font-size: 0.75rem;
            letter-spacing: 3px;
            display: block;
            margin-bottom: 1rem;
            text-align: center;
        }

        .grid-section {
            padding: 6rem 0;
            background-color: var(--charcoal);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
        }

        .use-case-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 3rem;
        }

        .card {
            background: var(--midnight);
            padding: 2.5rem;
            border: 1px solid var(--border);
            transition: var(--transition);
        }

        .card:hover {
            border-color: var(--gold);
            transform: translateY(-5px);
        }

        .card h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--gold);
        }

        .card p {
            font-size: 0.95rem;
            color: var(--parchment-muted);
        }

        /* Why Refer Section */
        .why-refer {
            padding: 8rem 0;
        }

        .split-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .benefit-list {
            list-style: none;
        }

        .benefit-item {
            margin-bottom: 2rem;
            padding-left: 2rem;
            position: relative;
        }

        .benefit-item::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0.5rem;
            width: 12px;
            height: 1px;
            background: var(--gold);
        }

        .benefit-item h4 {
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: var(--parchment);
        }

        .benefit-item p {
            color: var(--parchment-muted);
            font-size: 0.95rem;
        }

        /* How it Works */
        .how-it-works {
            padding: 6rem 0;
            background-color: var(--navy-deep);
            text-align: center;
        }

        .steps-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            margin-top: 4rem;
        }

        .step {
            position: relative;
        }

        .step-num {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            color: var(--gold);
            opacity: 0.3;
            margin-bottom: 1rem;
            display: block;
        }

        /* Boundaries Section */
        .boundaries {
            padding: 4rem;
            margin: 6rem auto;
            border: 1px solid var(--gold);
            max-width: 900px;
            background-color: rgba(197, 160, 89, 0.03);
        }

        .boundaries h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .boundaries p {
            font-size: 0.9rem;
            color: var(--parchment-muted);
            text-align: center;
            font-style: italic;
        }

        /* Partner CTA & QR */
        .partner-cta {
            padding: 6rem 0;
            text-align: center;
        }

        .qr-placeholder {
            width: 150px;
            height: 150px;
            border: 1px solid var(--gold);
            margin: 2rem auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--parchment-muted);
            background: white; /* Contrast for the QR spot */
            color: black;
        }

        /* Footer */
        footer {
            padding: 4rem 0;
            border-top: 1px solid var(--border);
            text-align: center;
            font-size: 0.8rem;
            color: var(--parchment-muted);
        }

        .compliance {
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.8;
        }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2.2rem; }
            .split-content, .steps-container { grid-template-columns: 1fr; }
            .cta-group { flex-direction: column; }
            .hero { padding: 4rem 0; }
        }
    </style>
</head>
<body>

    <nav class="container">
        <div class="logo">Moonshine Capital</div>
        <div>
            <a href="https://bit.ly/fundingwithdarwin" class="btn btn-secondary" style="padding: 0.6rem 1.2rem; font-size: 0.75rem;">Partner Login</a>
        </div>
    </nav>

    <header class="hero container">
        <span class="section-label">Referral Program</span>
        <h1>A Funding Resource for Business Clients Who Need a Practical Next Step.</h1>
        <p>Refer clients exploring working capital, equipment financing, acquisition-related capital, startup funding paths, or bank-decline alternatives.</p>
        <div class="cta-group">
            <a href="https://bit.ly/fundingwithdarwin" class="btn btn-primary">Refer a Client</a>
            <a href="#book-call" class="btn btn-secondary">Book a Partner Call</a>
        </div>
    </header>

    <section class="grid-section">
        <div class="container">
            <span class="section-label">Deployment Scenarios</span>
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">Common Use Cases</h2>
            <div class="use-case-grid">
                <div class="card">
                    <h3>New Formations</h3>
                    <p>Guidance for newly registered LLCs or Corporations seeking initial startup runway.</p>
                </div>
                <div class="card">
                    <h3>Acquisitions</h3>
                    <p>Capital for partnership buyouts or small business M&A transactions.</p>
                </div>
                <div class="card">
                    <h3>Equipment</h3>
                    <p>Financing for high-value machinery, medical tools, or specialized hardware.</p>
                </div>
                <div class="card">
                    <h3>Working Capital</h3>
                    <p>Solving cash flow gaps during seasonal shifts or rapid growth phases.</p>
                </div>
                <div class="card">
                    <h3>Contract Mobilization</h3>
                    <p>Funding to fulfill large government or corporate contracts before payment cycles hit.</p>
                </div>
                <div class="card">
                    <h3>Bank Declines</h3>
                    <p>Providing alternatives for clients who fall just outside traditional lending criteria.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="why-refer container">
        <div class="split-content">
            <div>
                <span class="section-label" style="text-align: left;">The Advantage</span>
                <h2 style="font-size: 2.8rem; margin: 1.5rem 0;">Why Attorneys Refer to Moonshine</h2>
            </div>
            <div class="benefit-list">
                <div class="benefit-item">
                    <h4>Non-Legal Advisory</h4>
                    <p>When clients need capital logic, not legal counsel. We fill the gap between the law and the bank.</p>
                </div>
                <div class="benefit-item">
                    <h4>Avoid "Online Noise"</h4>
                    <p>Protect your clients from predatory lenders and high-interest digital traps with a vetted partner.</p>
                </div>
                <div class="benefit-item">
                    <h4>Relationship Strength</h4>
                    <p>Position yourself as a comprehensive advisor who solves the "how do we pay for this" question.</p>
                </div>
                <div class="benefit-item">
                    <h4>Restrained Approach</h4>
                    <p>We respect your client relationship. No aggressive sales, just clear funding exploration.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="how-it-works">
        <div class="container">
            <span class="section-label">The Process</span>
            <h2 style="font-size: 2.5rem;">How it Works</h2>
            <div class="steps-container">
                <div class="step">
                    <span class="step-num">01</span>
                    <h3>Introduction</h3>
                    <p style="color: var(--parchment-muted); font-size: 0.9rem; margin-top: 1rem;">Direct the client to our brief intake form.</p>
                </div>
                <div class="step">
                    <span class="step-num">02</span>
                    <h3>Application</h3>
                    <p style="color: var(--parchment-muted); font-size: 0.9rem; margin-top: 1rem;">Client provides core business and funding profile.</p>
                </div>
                <div class="step">
                    <span class="step-num">03</span>
                    <h3>Review</h3>
                    <p style="color: var(--parchment-muted); font-size: 0.9rem; margin-top: 1rem;">Our team audits the file for eligible funding paths.</p>
                </div>
                <div class="step">
                    <span class="step-num">04</span>
                    <h3>Next Steps</h3>
                    <p style="color: var(--parchment-muted); font-size: 0.9rem; margin-top: 1rem;">Matched options are presented for client review.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="container">
        <div class="boundaries">
            <h2>Professional Boundaries</h2>
            <p>Moonshine Capital is a commercial funding resource. We do not provide legal, tax, or accounting advice. All funding options are subject to specific business profiles, creditworthiness, and provider-specific criteria. We encourage all clients to review final terms with their legal counsel.</p>
        </div>
    </section>

    <section class="partner-cta container">
        <span class="section-label">Resources</span>
        <h2 style="font-size: 2.2rem; margin-bottom: 1rem;">Want a simple referral handout for your clients?</h2>
        <p style="color: var(--parchment-muted); margin-bottom: 2rem;">Scan the code or click below to receive a digital partner packet.</p>
        
        <div class="qr-placeholder">
            QR Code Placeholder
        </div>

        <div class="cta-group">
            <a href="https://bit.ly/fundingwithdarwin" class="btn btn-primary">Download Handout</a>
            <a id="book-call" href="#" class="btn btn-secondary">Schedule Discovery Call</a>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="logo" style="font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.6;">Moonshine Capital</div>
            <div class="compliance">
                &copy; 2023 Moonshine Capital. For professional partner use only. Moonshine Capital is not a lender but a facilitator of commercial capital resources. This is not a commitment to lend. Financing available to commercial entities only. Equal Opportunity Resource. 
            </div>
        </div>
    </footer>

    <script>
        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>
```