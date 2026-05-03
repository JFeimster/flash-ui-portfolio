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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --onyx: #121212;
            --navy: #1A1E29;
            --charcoal: #1E1E1E;
            --off-white: #F5F5F5;
            --silver: #A0A0A0;
            --gold: #C5A059;
            --gold-muted: #8E7341;
            --border: #2A2A2A;
            --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: var(--onyx);
            color: var(--off-white);
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            overflow-x: hidden;
        }

        h1, h2, h3 {
            font-family: 'Playfair Display', serif;
            font-weight: 400;
        }

        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        /* Navigation */
        nav {
            padding: 2rem 0;
            border-bottom: 1px solid var(--border);
        }

        .logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--off-white);
        }

        .logo span {
            color: var(--gold);
        }

        /* Hero Section */
        .hero {
            padding: 8rem 0 6rem;
            text-align: center;
        }

        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 3.75rem);
            line-height: 1.1;
            margin-bottom: 1.5rem;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--silver);
            max-width: 700px;
            margin: 0 auto 3rem;
            font-weight: 300;
        }

        .cta-group {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            align-items: center;
        }

        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            transition: var(--transition);
            border: 1px solid transparent;
        }

        .btn-primary {
            background-color: var(--gold);
            color: var(--onyx);
        }

        .btn-primary:hover {
            background-color: var(--gold-muted);
            transform: translateY(-2px);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--off-white);
            border-color: var(--border);
        }

        .btn-secondary:hover {
            background-color: var(--navy);
            border-color: var(--gold);
        }

        /* Section Styling */
        section {
            padding: 6rem 0;
            border-top: 1px solid var(--border);
        }

        .section-header {
            margin-bottom: 4rem;
        }

        .section-header h2 {
            font-size: 2.25rem;
            margin-bottom: 1rem;
        }

        .section-header p {
            color: var(--silver);
            font-size: 1.1rem;
        }

        /* Grid / Use Cases */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
        }

        .card {
            background-color: var(--navy);
            padding: 2.5rem;
            border: 1px solid var(--border);
            transition: var(--transition);
        }

        .card:hover {
            border-color: var(--gold);
        }

        .card h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--gold);
        }

        .card p {
            font-size: 0.95rem;
            color: var(--silver);
            font-weight: 300;
        }

        /* Why Attorneys Refer */
        .why-refer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .why-list {
            list-style: none;
        }

        .why-list li {
            position: relative;
            padding-left: 2rem;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }

        .why-list li::before {
            content: "—";
            position: absolute;
            left: 0;
            color: var(--gold);
        }

        /* How it Works */
        .steps {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            counter-reset: step-counter;
        }

        .step {
            position: relative;
        }

        .step::before {
            counter-increment: step-counter;
            content: counter(step-counter);
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            color: var(--charcoal);
            position: absolute;
            top: -1.5rem;
            left: 0;
            z-index: -1;
        }

        .step h4 {
            font-weight: 600;
            margin-bottom: 0.5rem;
            margin-top: 1rem;
        }

        /* Professional Boundaries */
        .boundaries {
            background-color: var(--charcoal);
            border-left: 3px solid var(--gold);
            padding: 3rem;
            margin: 4rem 0;
        }

        .boundaries p {
            font-size: 0.9rem;
            font-style: italic;
            color: var(--silver);
            max-width: 800px;
        }

        /* Partner Call to Action */
        .partner-section {
            background-color: var(--navy);
            padding: 5rem;
            text-align: center;
            border: 1px solid var(--border);
        }

        .partner-flex {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4rem;
            flex-wrap: wrap;
        }

        .qr-placeholder {
            width: 160px;
            height: 160px;
            background-color: white;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4px solid var(--gold);
        }

        .qr-placeholder div {
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(45deg, #eee, #eee 10px, #fff 10px, #fff 20px);
            position: relative;
        }

        .qr-placeholder div::after {
            content: "QR CODE";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.7rem;
            color: #000;
            font-weight: bold;
        }

        /* Footer */
        footer {
            padding: 4rem 0;
            border-top: 1px solid var(--border);
            font-size: 0.8rem;
            color: var(--silver);
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 2rem;
        }

        .compliance {
            max-width: 600px;
            line-height: 1.8;
        }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2.2rem; }
            .cta-group { flex-direction: column; width: 100%; }
            .btn { width: 100%; text-align: center; }
            .why-refer { grid-template-columns: 1fr; }
            .steps { grid-template-columns: 1fr 1fr; }
            .partner-flex { gap: 2rem; }
        }
    </style>
</head>
<body>

    <nav>
        <div class="container">
            <div class="logo">Moonshine <span>Capital</span></div>
        </div>
    </nav>

    <header class="hero">
        <div class="container">
            <h1>A Funding Resource for Business Clients Who Need a Practical Next Step.</h1>
            <p>Refer clients exploring working capital, equipment financing, acquisition-related capital, startup funding paths, or bank-decline alternatives.</p>
            <div class="cta-group">
                <a href="https://bit.ly/fundingwithdarwin" class="btn btn-primary">Refer a Client</a>
                <a href="#book-call" class="btn btn-secondary">Book a Partner Call</a>
            </div>
        </div>
    </header>

    <section id="use-cases">
        <div class="container">
            <div class="section-header">
                <h2>Strategic Use Cases</h2>
                <p>When capital becomes the obstacle to legal execution.</p>
            </div>
            <div class="grid">
                <div class="card">
                    <h3>Entity Formation</h3>
                    <p>Securing initial runway or startup capital for newly formed LLCs and Corporations.</p>
                </div>
                <div class="card">
                    <h3>M&A Activity</h3>
                    <p>Funding for acquisition-related costs, partnership buyouts, or asset purchases.</p>
                </div>
                <div class="card">
                    <h3>Equipment</h3>
                    <p>Specific financing for heavy machinery, medical tech, or specialized fleet upgrades.</p>
                </div>
                <div class="card">
                    <h3>Working Capital</h3>
                    <p>Stabilizing cash flow during growth phases or seasonal fluctuations.</p>
                </div>
                <div class="card">
                    <h3>Contract Support</h3>
                    <p>Mobilization capital to fulfill large government or commercial contracts.</p>
                </div>
                <div class="card">
                    <h3>Bank Alternatives</h3>
                    <p>Reliable paths for clients who don't meet traditional bank lending criteria.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="why-refer">
        <div class="container">
            <div class="why-refer">
                <div>
                    <div class="section-header">
                        <h2>Why Attorneys Partner With Us</h2>
                    </div>
                    <ul class="why-list">
                        <li><strong>Specialization:</strong> Your clients need capital, not more legal advice. We stay in our lane.</li>
                        <li><strong>Vetted Paths:</strong> Avoid the risk of clients falling into predatory online lending traps.</li>
                        <li><strong>Relationship Strength:</strong> Providing a resource for funding makes you a more holistic advisor.</li>
                        <li><strong>Professionalism:</strong> Our process mirrors the discretion and urgency required by legal counsel.</li>
                    </ul>
                </div>
                <div style="background-color: var(--navy); height: 100%; border: 1px solid var(--border); padding: 3rem; display: flex; align-items: center; justify-content: center;">
                    <blockquote style="font-family: 'Playfair Display', serif; font-size: 1.5rem; font-style: italic; text-align: center;">
                        "The goal isn't just to find money, but to find the right structure for the client's long-term viability."
                    </blockquote>
                </div>
            </div>
        </div>
    </section>

    <section id="how-it-works">
        <div class="container">
            <div class="section-header">
                <h2>The Referral Process</h2>
            </div>
            <div class="steps">
                <div class="step">
                    <h4>Introduction</h4>
                    <p>Submit client details through our secure portal or link.</p>
                </div>
                <div class="step">
                    <h4>Review</h4>
                    <p>We perform a high-level review of the business profile.</p>
                </div>
                <div class="step">
                    <h4>Analysis</h4>
                    <p>We identify the most viable funding paths available.</p>
                </div>
                <div class="step">
                    <h4>Execution</h4>
                    <p>Client chooses their path and moves to funding.</p>
                </div>
            </div>
        </div>
    </section>

    <div class="container">
        <div class="boundaries">
            <p><strong>Professional Boundaries Notice:</strong> Moonshine Capital is a commercial funding resource. We do not provide legal, tax, or accounting advice. All funding options are subject to individual business profiles and the specific criteria of the capital providers. We encourage all clients to review financial agreements with their legal counsel.</p>
        </div>
    </div>

    <section id="partner-cta">
        <div class="container">
            <div class="partner-section">
                <div class="partner-flex">
                    <div style="text-align: left; max-width: 500px;">
                        <h2 style="margin-bottom: 1rem;">Client Resource Materials</h2>
                        <p style="color: var(--silver); margin-bottom: 2rem;">Want a simple, professional referral handout to keep in your office or include in your new client onboarding packets?</p>
                        <a href="mailto:partners@moonshinecapital.com" class="btn btn-secondary">Request Partner Kit</a>
                    </div>
                    <div class="qr-placeholder">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="logo">Moonshine <span>Capital</span></div>
                <div class="compliance">
                    <p>&copy; 2023 Moonshine Capital. All rights reserved.</p>
                    <p style="margin-top: 1rem;">Moonshine Capital is a facilitator of commercial capital and does not act as a lender or broker for consumer purposes. This program is designed exclusively for business-to-business referrals targeting commercial entities and their legal representatives.</p>
                </div>
            </div>
        </div>
    </footer>

</body>
</html>
```