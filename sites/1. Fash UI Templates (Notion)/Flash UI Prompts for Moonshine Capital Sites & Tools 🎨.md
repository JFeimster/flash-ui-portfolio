# 🎨 Flash UI Prompts for Moonshine Capital Sites & Tools

## Marketing Website Variants

- **Cinematic Dark Luxe Marketing Site**
    
    ```jsx
    Design a "Cinematic Dark Luxe" marketing website for Moonshine Capital, a premium alternative financing marketplace.
    
    VISUAL STYLE: Elite, Cinematic, Luxury. Deep black (#0a0a0a), charcoal (#1a1a1a), gold spotlight (#d4af37), platinum accents (#e5e4e2). Dramatic lighting, film grain texture overlay, ultra-wide aspect ratios.
    
    LAYOUT STRUCTURE:
    
    HERO SECTION:
    - Full-viewport cinematic video background (abstract liquid gold, money flowing)
    - Dramatic headline: "Capital Meets Vision" with gold gradient
    - Floating subheadline: "Alternative Financing for Ambitious Entrepreneurs"
    - Dual CTA: "Get Funded" (gold button) + "Become a Partner" (ghost button)
    - Scroll indicator with smooth animation
    
    VALUE PROPOSITION SECTION:
    - Split screen: left shows pain points (traditional banking rejection), right shows solution (instant funding)
    - Animated counter showcasing: "$500M+ Funded | 10,000+ Businesses | 80+ Funding Partners"
    - Luxury card grid highlighting 6 core services with hover reveals
    
    SOCIAL PROOF CINEMATIC:
    - Dark testimonial carousel with client video clips
    - Brand trust strip: partner logos with gold separators
    - "Success Stories" reel with before/after revenue metrics
    
    PRODUCT SHOWCASE:
    - Horizontal scroll gallery of funding products
    - Each product card: cinematic image, dramatic copy, instant quote CTA
    - Categories: Business Capital, Revenue-Based, Asset-Backed, Non-Dilutive Growth, Startup, E-commerce, SaaS, Business Credit
    
    PARTNER CTA SECTION:
    - Dramatic full-width banner: "Build Your Funding Empire"
    - Income potential calculator with gold highlights
    - Three-tier partner program showcase with luxury card design
    
    FOOTER:
    - Premium dark footer with gold accents
    - Multi-column: Products, Partners, Resources, Company, Legal
    - Social proof metrics integrated
    - Newsletter signup with gold submit button
    
    DESIGN REQUIREMENTS:
    - Smooth parallax scrolling throughout
    - Cinematic transitions between sections
    - Premium micro-interactions on all interactive elements
    - Gold particle effects on hover
    - High-contrast typography (serif headlines, sans body)
    - Mobile-first responsive with maintained luxury feel
    ```
    

- **Editorial Bento Grid Marketing Site**
    
    ```jsx
    Design an "Editorial Bento Grid" marketing website for Moonshine Capital.
    
    VISUAL STYLE: Magazine-quality, Editorial, Modular. White (#ffffff), soft gray (#f5f5f5), accent blue (#2563eb), rich black (#1a1a1a). CSS Grid masonry layout, asymmetrical blocks, generous white space.
    
    LAYOUT STRUCTURE:
    
    HERO BENTO GRID:
    - Asymmetrical CSS Grid (6 columns × 4 rows)
    - Large headline block (spans 4 columns): "Alternative Financing, Redefined"
    - Stats block (2×2): Animated funding metrics
    - CTA block (2×1): "Explore Funding Options" button
    - Image block (2×2): High-quality business imagery
    - Testimonial snippet block (2×1)
    - Partner logos block (6×1)
    
    SERVICES BENTO SECTION:
    - 8 service cards in bento grid layout (varying sizes)
    - Each card: Icon, title, description, "Learn More" link
    - Hover effect: card expands slightly, reveals more detail
    - Categories represented: Business Capital, Revenue-Based, Asset-Backed, Non-Dilutive, Startup, E-commerce, SaaS, Credit Building
    
    EDITORIAL CONTENT BLOCKS:
    - Large feature article block: "The Future of Alternative Financing"
    - Smaller blog post teasers in 3-column grid
    - Pull quotes in colored blocks breaking up content
    - Statistics callouts in accent color blocks
    - Video embed block showcasing platform
    
    HOW IT WORKS BENTO:
    - Visual step-by-step in modular blocks
    - Alternating block sizes creating visual rhythm
    - Illustrations in some blocks, copy in others
    - CTA block at end: "Start Your Application"
    
    PARTNER OPPORTUNITY SECTION:
    - Split bento: left side shows partner benefits, right shows income calculator
    - Tiered program blocks stacked vertically
    - Success story blocks interspersed
    - Large "Join Network" CTA block
    
    PROOF SECTION:
    - Client testimonial blocks (varying sizes)
    - Company logo blocks
    - Trust badges and certifications
    - Case study preview blocks linking to full stories
    
    FOOTER BENTO:
    - Multi-block footer with clear visual hierarchy
    - Newsletter signup block (prominent)
    - Quick links blocks (organized by category)
    - Contact info block with social icons
    - Legal/compliance block
    
    DESIGN REQUIREMENTS:
    - Fully responsive bento grid (reflows on mobile)
    - Smooth hover states on all blocks
    - Consistent 8px spacing system
    - Typography hierarchy: Large display serif, medium sans headlines, body sans
    - Subtle shadows and borders defining blocks
    - High-quality imagery throughout
    ```
    

- Source Code 1
    
    ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Moonshine Capital | Swiss Bento</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Newsreader:ital,wght@1,400;1,600&display=swap" rel="stylesheet">
        <style>
            :root {
                --white: #ffffff;
                --bg: #fafafa;
                --blue: #2563eb;
                --black: #1a1a1a;
                --grid-gap: 8px;
            }
            body {
                font-family: 'Inter', sans-serif;
                background: var(--bg);
                color: var(--black);
                margin: 0;
                padding: var(--grid-gap);
                -webkit-font-smoothing: antialiased;
            }
            .container { max-width: 1600px; margin: 0 auto; }
            .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--grid-gap); grid-auto-flow: dense; }
            .tile {
                background: var(--white);
                padding: 40px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                border-radius: 4px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            }
            .tile-blue { background: var(--blue); color: white; }
            .tile-black { background: var(--black); color: white; }
    
            .w-8 { grid-column: span 8; }
            .w-4 { grid-column: span 4; }
            .w-6 { grid-column: span 6; }
            .w-3 { grid-column: span 3; }
            .h-2 { grid-row: span 2; }
            .h-3 { grid-row: span 3; }
    
            h1 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 5rem; letter-spacing: -3px; line-height: 0.95; }
            .italic { font-family: 'Newsreader', serif; font-style: italic; font-weight: 400; }
            .label { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 20px; font-weight: 700; color: var(--blue); }
            .btn { display: inline-block; padding: 15px 30px; border: 1px solid var(--black); text-decoration: none; color: inherit; font-weight: 700; transition: 0.2s; }
            .btn:hover { background: var(--black); color: white; }
    
            .img-fit { padding: 0; overflow: hidden; }
            .img-fit img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
            .img-fit:hover img { transform: scale(1.05); }
    
            @media (max-width: 1024px) {
                .w-8, .w-4, .w-6, .w-3 { grid-column: span 12; }
                h1 { font-size: 3rem; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="grid">
                <!-- Row 1 -->
                <div class="tile w-8 h-2">
                    <div class="label">Editorial Intro</div>
                    <h1>Alternative Financing, <span class="italic">Redefined</span> for the Next Era.</h1>
                    <p style="max-width: 500px; font-size: 1.2rem; margin-top: 40px;">Institutional scale meets startup speed. We provide the capital that traditional banks fear to lend.</p>
                </div>
                <div class="tile w-4 h-3 tile-blue">
                    <div>
                        <div class="label" style="color: white; opacity: 0.8;">Active Metrics</div>
                        <div style="font-size: 6rem; font-weight: 700; line-height: 1;">1.2B</div>
                        <p style="font-size: 1.5rem;">Total pipeline capacity for Q4 2024.</p>
                    </div>
                    <a href="#" style="color: white; font-weight: 700;">VIEW DASHBOARD →</a>
                </div>
    
                <!-- Row 2 -->
                <div class="tile w-4 h-2 img-fit">
                    <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80" alt="Workspace">
                </div>
                <div class="tile w-4 h-2">
                    <div class="label">The Mission</div>
                    <p class="italic" style="font-size: 1.8rem;">"Our goal is to decouple growth from dilution, allowing founders to own their future while scaling at lightning speed."</p>
                </div>
    
                <!-- Services -->
                <div class="tile w-3 tile-black">
                    <h3>Non-Dilutive</h3>
                    <p>Keep your equity.</p>
                </div>
                <div class="tile w-3">
                    <h3>Revenue Based</h3>
                    <p>Pay as you grow.</p>
                </div>
                <div class="tile w-3 tile-blue">
                    <h3>SaaS Credit</h3>
                    <p>Tech-native debt.</p>
                </div>
                <div class="tile w-3">
                    <h3>Asset-Backed</h3>
                    <p>Leverage strength.</p>
                </div>
    
                <!-- Editorial -->
                <div class="tile w-6 h-2">
                    <div class="label">Featured Article</div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 20px;">The Death of the Traditional Term Sheet</h2>
                    <p>Why modern companies are fleeing institutional banks for more agile, revenue-linked alternatives...</p>
                    <a href="#" class="btn" style="margin-top: 30px;">READ FULL STORY</a>
                </div>
                <div class="tile w-6 h-2 img-fit">
                    <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80" alt="Office">
                </div>
            </div>
        </div>
    </body>
    </html>
    ```
    
    ```html
    
    ```
    
- Source Code 2
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Moonshine Capital | Brutalist Bento</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Instrument+Serif&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #ffffff;
                --accent: #2563eb;
                --black: #000000;
                --gray: #f2f2f2;
                --border: 2px solid #000000;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: 'Space Grotesk', sans-serif;
                background-color: var(--bg);
                padding: 20px;
            }
            .serif { font-family: 'Instrument Serif', serif; font-size: 1.2em; }
            .container { max-width: 1400px; margin: 0 auto; }
            
            .bento-grid {
                display: grid;
                grid-template-columns: repeat(12, 1fr);
                grid-auto-rows: minmax(100px, auto);
                gap: 10px;
            }
            .block {
                border: var(--border);
                padding: 24px;
                display: flex;
                flex-direction: column;
                transition: background 0.2s;
            }
            .block:hover { background: var(--gray); }
            
            /* Grid Logic */
            .h-1 { grid-column: span 8; grid-row: span 4; background: var(--black); color: white; }
            .h-2 { grid-column: span 4; grid-row: span 2; background: var(--accent); color: white; }
            .h-3 { grid-column: span 4; grid-row: span 2; border-color: var(--accent); }
            .s-box { grid-column: span 3; grid-row: span 3; }
            .img-placeholder { background: #eee url('https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=800&q=80') center/cover; filter: grayscale(1); }
            
            h1 { font-family: 'Instrument Serif', serif; font-size: 5vw; line-height: 0.9; text-transform: uppercase; }
            .cta-btn { font-size: 1.5rem; text-transform: uppercase; font-weight: 700; display: inline-block; margin-top: auto; text-decoration: none; color: inherit; }
            .metric { font-size: 4rem; font-weight: 700; letter-spacing: -2px; }
    
            @media (max-width: 768px) {
                .bento-grid { display: flex; flex-direction: column; }
                h1 { font-size: 3rem; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="bento-grid">
                <!-- Hero -->
                <div class="block h-1">
                    <p class="serif">Moonshine Capital</p>
                    <h1 style="margin-top: 40px;">The Capital<br>Standard</h1>
                    <a href="#" class="cta-btn" style="color: var(--accent);">Apply Now →</a>
                </div>
                <div class="block h-2">
                    <div class="metric">92%</div>
                    <p>Retention Rate among series A startups using our credit facility.</p>
                </div>
                <div class="block h-3">
                    <p class="serif">Expertise</p>
                    <p style="font-size: 1.1rem; margin-top: 10px;">Institutional knowledge meets digital agility. We fund the innovators.</p>
                </div>
    
                <!-- Mid Row -->
                <div class="block img-placeholder" style="grid-column: span 4; grid-row: span 4;"></div>
                <div class="block s-box" style="background: var(--accent); color: white;">
                    <h3>SaaS Funding</h3>
                    <p>Unlock future ARR today.</p>
                </div>
                <div class="block s-box">
                    <h3>E-Comm</h3>
                    <p>Scalable inventory credit.</p>
                </div>
                <div class="block s-box" style="grid-column: span 5; border-left: 10px solid black;">
                    <p class="serif" style="font-size: 1.5rem;">"Moonshine didn't just give us a check; they gave us a roadmap to $100M ARR."</p>
                    <p style="margin-top: 20px; font-weight: 700;">— Sarah Chen, CEO of Velocity</p>
                </div>
    
                <!-- Partner -->
                <div class="block" style="grid-column: span 12; background: #000; color: #fff; padding: 60px;">
                    <h2 style="font-size: 3rem; text-align: center;">JOIN THE NETWORK. GET PAID.</h2>
                </div>
            </div>
        </div>
    </body>
    </html>
    ```
    
- Source Code 3
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Moonshine Capital | Editorial Bento</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            :root {
                --white: #ffffff;
                --soft-gray: #f5f5f5;
                --accent-blue: #2563eb;
                --rich-black: #1a1a1a;
                --border-color: #e5e5e5;
                --spacing: 8px;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: 'Inter', sans-serif;
                background-color: var(--soft-gray);
                color: var(--rich-black);
                line-height: 1.5;
                padding: 40px 20px;
            }
            h1, h2, h3, .serif { font-family: 'Playfair Display', serif; }
            .container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
            
            /* Bento Grid System */
            .bento-grid { display: grid; gap: 16px; grid-template-columns: repeat(6, 1fr); }
            .block { background: var(--white); padding: 32px; border: 1px solid var(--border-color); position: relative; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
            .block:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.05); }
    
            /* Hero Specifics */
            .hero-headline { grid-column: span 4; grid-row: span 2; display: flex; flex-direction: column; justify-content: flex-end; }
            .hero-headline h1 { font-size: 4.5rem; line-height: 1.1; margin-bottom: 16px; }
            .stats-block { grid-column: span 2; grid-row: span 2; background: var(--rich-black); color: var(--white); text-align: center; display: flex; flex-direction: column; justify-content: center; }
            .stats-val { font-size: 3rem; font-weight: 700; color: var(--accent-blue); }
            .cta-block { grid-column: span 2; grid-row: span 1; background: var(--accent-blue); color: var(--white); display: flex; align-items: center; justify-content: center; cursor: pointer; text-decoration: none; font-weight: 600; }
            .img-block { grid-column: span 2; grid-row: span 2; background: #ddd url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80') center/cover; }
            .testi-snippet { grid-column: span 2; grid-row: span 1; font-style: italic; border-left: 4px solid var(--accent-blue); }
            .logo-strip { grid-column: span 6; display: flex; justify-content: space-between; align-items: center; padding: 20px; opacity: 0.6; filter: grayscale(1); }
    
            /* Services */
            .services-header { grid-column: span 6; padding: 20px 0; }
            .service-card { grid-column: span 2; min-height: 200px; display: flex; flex-direction: column; gap: 12px; }
            .service-card.large { grid-column: span 3; }
            .service-card .icon { font-size: 2rem; }
            .service-card a { color: var(--accent-blue); text-decoration: none; font-weight: 600; margin-top: auto; }
    
            /* Responsive */
            @media (max-width: 900px) {
                .bento-grid { grid-template-columns: repeat(2, 1fr); }
                .hero-headline, .stats-block, .img-block, .service-card, .logo-strip { grid-column: span 2; }
                .hero-headline h1 { font-size: 2.5rem; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <nav style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
                <h2 style="letter-spacing: -1px;">MOONSHINE CAPITAL</h2>
                <div style="display: flex; gap: 24px; font-weight: 500; font-size: 0.9rem;">
                    <span>FUNDING</span><span>PARTNERS</span><span>RESOURCES</span>
                </div>
            </nav>
    
            <header class="bento-grid">
                <div class="block hero-headline">
                    <h1>Alternative Financing, Redefined</h1>
                    <p>Empowering the next generation of digital commerce through strategic capital and data-driven insights.</p>
                </div>
                <div class="block stats-block">
                    <div class="stats-val">$450M+</div>
                    <div style="opacity: 0.8; font-size: 0.9rem;">Capital Deployed 2023</div>
                </div>
                <div class="block cta-block">
                    Explore Funding Options →
                </div>
                <div class="block img-block"></div>
                <div class="block testi-snippet">
                    "The most seamless funding experience we've had in 5 years of scaling."
                </div>
                <div class="block logo-strip">
                    <span>SaaS Weekly</span> <span>FinTech Daily</span> <span>Global VC</span> <span>The Ledger</span>
                </div>
            </header>
    
            <section class="bento-grid">
                <div class="services-header"><h2 style="font-size: 2.5rem;">Our Capital Programs</h2></div>
                <div class="block service-card large">
                    <div class="icon">📈</div>
                    <h3>Revenue-Based Financing</h3>
                    <p>Flexible capital that scales with your monthly recurring revenue. No equity dilution.</p>
                    <a href="#">Learn More</a>
                </div>
                <div class="block service-card">
                    <div class="icon">🏢</div>
                    <h3>Asset-Backed Loans</h3>
                    <p>Leverage your balance sheet for lower rates.</p>
                    <a href="#">Learn More</a>
                </div>
                <div class="block service-card">
                    <div class="icon">📦</div>
                    <h3>E-commerce Funding</h3>
                    <p>Inventory and marketing financing for high-growth brands.</p>
                    <a href="#">Learn More</a>
                </div>
                <div class="block service-card large">
                    <div class="icon">⚡</div>
                    <h3>SaaS Acceleration</h3>
                    <p>Bridge the gap between product-market fit and scale with specialized tech credit.</p>
                    <a href="#">Learn More</a>
                </div>
            </section>
    
            <footer class="bento-grid" style="margin-top: 60px;">
                <div class="block" style="grid-column: span 3; background: var(--rich-black); color: white;">
                    <h3 style="margin-bottom: 12px;">Stay informed.</h3>
                    <input type="email" placeholder="Email address" style="width: 100%; padding: 12px; background: #333; border: none; color: white; margin-bottom: 12px;">
                    <button style="background: var(--accent-blue); color: white; border: none; padding: 12px 24px; cursor: pointer;">Subscribe</button>
                </div>
                <div class="block" style="grid-column: span 3;">
                    <p style="font-size: 0.8rem; color: #666;">© 2024 Moonshine Capital Partners. All rights reserved. Investment banking services provided by MC Securities, LLC. Member FINRA/SIPC.</p>
                </div>
            </footer>
        </div>
    </body>
    </html>
    ```
    

- **Neo-Brutalist Marketing Site**
    
    ```jsx
    Design a "Neo-Brutalist" marketing website for Moonshine Capital.
    
    VISUAL STYLE: Raw, Bold, Unapologetic. Stark black (#000000), pure white (#ffffff), electric accent (#00ff00 or #ff00ff). Thick borders (4-8px), hard shadows, monospace typography, no gradients, maximum contrast.
    
    LAYOUT STRUCTURE:
    
    HERO SECTION:
    - Brutal full-screen block with thick black border
    - Headline in massive monospace caps: "GET FUNDED. NOW."
    - Subheadline in smaller monospace: "Alternative financing for businesses banks reject"
    - Two huge rectangular buttons: "APPLY" (black bg, white text) and "PARTNER" (white bg, black text)
    - Hard drop shadow on all elements (10px offset, no blur)
    
    VALUE BLOCKS:
    - Grid of 6 rectangular blocks (3×2 on desktop)
    - Each block: thick border, hard shadow, single color background
    - Rotated headline text (90 degrees)
    - Hover: block shifts position aggressively
    - Services: BUSINESS CAPITAL | REVENUE-BASED | ASSET-BACKED | NON-DILUTIVE | STARTUP | ECOMMERCE
    
    STATS BAR:
    - Full-width horizontal bar with thick top/bottom borders
    - Stats in huge monospace numbers with labels
    - "$500M+ FUNDED // 10K+ BUSINESSES // 80+ PARTNERS"
    - Scrolling marquee effect
    
    PRODUCT GRID:
    - Brutalist card grid (no rounded corners)
    - Each card: product name in caps, price range, thick border, offset shadow
    - Cards stack slightly offset creating depth
    - Click reveals modal with full product details
    - Modal: full-screen takeover, escape-key close
    
    HOW IT WORKS:
    - Numbered list in huge monospace (1. 2. 3. 4.)
    - Each step in separate bordered block
    - Connecting lines between blocks (thick, straight)
    - Final block: "START" button
    
    PARTNER CTA SECTION:
    - Aggressive full-width banner
    - "BUILD YOUR EMPIRE" in massive caps
    - Income calculator in brutalist form design
    - Submit button: oversized, hard shadow, hover shift
    
    TESTIMONIALS:
    - Stacked quote blocks with thick borders
    - Monospace quotes, attribution in caps
    - Random rotation angles (-3deg, 2deg, -1deg)
    - Hover: straightens and enlarges
    
    FOOTER:
    - Full-width black block with white text
    - Multi-column links (thick vertical separators)
    - Social icons: simple black squares with white logos
    - Copyright in monospace caps
    
    DESIGN REQUIREMENTS:
    - Zero border radius anywhere
    - All shadows: hard-edged, no blur, 8-12px offset
    - Typography: Monospace for all text
    - Hover states: aggressive position shifts or color inversions
    - No smooth transitions (instant state changes or very fast)
    - High contrast accessibility maintained
    - Mobile: stacked blocks maintain brutalist aesthetic
    ```
    

- Source Code 1
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          :root{--pink:#ff00ff;--black:#000000;--white:#ffffff}*{margin:0;padding:0;box-sizing:border-box;font-family:monospace;border-radius:0 !important}body{background:var(--black);color:var(--white)}section{border:4px solid var(--white);margin:20px;background:var(--black);box-shadow:12px 12px 0px var(--pink)}h1,h2,h3{text-transform:uppercase}.hero{padding:100px 50px;min-height:80vh;display:flex;flex-direction:column;justify-content:center}.massive-text{font-size:12vw;line-height:0.8;color:var(--white);-webkit-text-stroke:2px var(--pink)}.btn-container{margin-top:50px;display:flex;gap:30px}.huge-btn{padding:30px 60px;font-size:2rem;border:6px solid var(--white);background:var(--pink);color:var(--black);box-shadow:10px 10px 0px var(--white);transition:0.05s;text-decoration:none;font-weight:bold}.huge-btn:hover{box-shadow:none;transform:translate(10px,10px)}.value-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:4px solid var(--white)}.value-box{border:4px solid var(--white);height:300px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;transition:0.1s}.value-box:hover{background:var(--white);color:var(--black)}.how-it-works{display:flex;flex-direction:column;gap:0}.step{padding:40px;border-bottom:4px solid var(--white);display:flex;align-items:center;gap:40px}.step-num{font-size:6rem;font-weight:900;color:var(--pink)}.testimonial-area{padding:100px 50px;overflow:hidden}.quote-card{background:var(--white);color:var(--black);padding:40px;border:8px solid var(--black);margin-bottom:40px;width:fit-content;transition:0.2s}.quote-card:nth-child(1){transform:rotate(-2deg)}.quote-card:nth-child(2){transform:rotate(3deg);margin-left:auto}.quote-card:hover{transform:rotate(0deg) scale(1.1)}
        </style>
      </head>
      <body>
        <section class="hero">
          <h1 class="massive-text">GET<br />FUNDED.</h1>
          <p style="font-size:2rem">OUTSIDE THE SYSTEM.</p>
          <div class="btn-container">
            <a href="#" class="huge-btn">APPLY NOW</a
            ><a href="#" class="huge-btn" style="background:var(--white)"
              >PARTNER</a
            >
          </div>
        </section>
        <section class="value-grid">
          <div class="value-box">
            <h2>01</h2>
            <h3>REVENUE-BASED</h3>
          </div>
          <div class="value-box" style="background:var(--pink);color:#000">
            <h2>02</h2>
            <h3>NON-DILUTIVE</h3>
          </div>
          <div class="value-box">
            <h2>03</h2>
            <h3>ASSET-BACKED</h3>
          </div>
          <div class="value-box">
            <h2>04</h2>
            <h3>STARTUP</h3>
          </div>
          <div class="value-box">
            <h2>05</h2>
            <h3>ECOMMERCE</h3>
          </div>
          <div class="value-box">
            <h2>06</h2>
            <h3>MARKETING</h3>
          </div>
        </section>
        <section class="how-it-works">
          <div class="step">
            <div class="step-num">1</div>
            <div>
              <h3>CONNECT DATA</h3>
              <p>Secure read-only access to your accounts.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div>
              <h3>GET OFFER</h3>
              <p>Algorithm-driven funding in 24 hours.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div>
              <h3>USE FUNDS</h3>
              <p>Scale your empire without limits.</p>
            </div>
          </div>
        </section>
        <div class="testimonial-area">
          <div class="quote-card">
            "THEY GAVE US $2M WHEN WELLS FARGO SAID NO."<br />- CEO, TECHCORP
          </div>
          <div class="quote-card">
            "BRUTALLY HONEST. INSANELY FAST."<br />- FOUNDER, GLOWUP
          </div>
        </div>
      </body>
    </html>
    ```
    
- Source Code 2
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');:root{--black:#000000;--white:#ffffff;--accent:#00ff00;--border-w:6px;--shadow-offset:10px}*{margin:0;padding:0;box-sizing:border-box;font-family:'Space Mono',monospace;cursor:crosshair}body{background:var(--white);color:var(--black);overflow-x:hidden}button{cursor:pointer;border-radius:0}.brut-border{border:var(--border-w) solid var(--black);box-shadow:var(--shadow-offset) var(--shadow-offset) 0px var(--black)}.brut-btn{padding:20px 40px;font-weight:700;font-size:1.5rem;text-transform:uppercase;transition:transform 0.05s}.brut-btn:hover{transform:translate(-4px,-4px);box-shadow:calc(var(--shadow-offset) + 4px) calc(var(--shadow-offset) + 4px) 0px var(--black)}.brut-btn:active{transform:translate(2px,2px);box-shadow:5px 5px 0px var(--black)}header{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2rem;text-align:center;border-bottom:var(--border-w) solid var(--black)}.hero-title{font-size:clamp(3rem,10vw,8rem);line-height:0.9;margin-bottom:1rem}.marquee{background:var(--accent);border-top:var(--border-w) solid var(--black);border-bottom:var(--border-w) solid var(--black);padding:20px 0;overflow:hidden;white-space:nowrap}.marquee-content{display:inline-block;animation:scroll 20s linear infinite;font-size:2rem;font-weight:700}@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.grid-values{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));background:var(--black);gap:var(--border-w);padding:var(--border-w)}.value-block{background:var(--white);height:400px;display:flex;padding:2rem;position:relative;overflow:hidden;transition:0.1s}.value-block:hover{background:var(--accent);transform:translate(-8px,-8px)}.vertical-text{writing-mode:vertical-rl;text-orientation:mixed;font-size:2.5rem;font-weight:700;margin-right:1rem}.stats-bar{padding:3rem;background:var(--white);display:flex;justify-content:space-around;flex-wrap:wrap;gap:2rem}.stat-item h2{font-size:4rem}.product-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2rem;padding:4rem}.card{background:var(--white);padding:2rem;position:relative}.card:nth-child(even){margin-top:20px;margin-left:20px}section{padding:4rem 2rem}footer{background:var(--black);color:var(--white);padding:4rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem}
        </style>
      </head>
      <body>
        <header>
          <div class="brut-border" style="padding:4rem;background:var(--white)">
            <h1 class="hero-title">GET FUNDED.<br />NOW.</h1>
            <p style="font-size:1.5rem;margin:2rem 0">
              Alternative financing for businesses banks reject
            </p>
            <div
              style="display:flex;gap:2rem;justify-content:center;flex-wrap:wrap"
            >
              <button
                class="brut-btn"
                style="background:var(--black);color:var(--white)"
              >
                APPLY</button
              ><button
                class="brut-btn"
                style="background:var(--white);color:var(--black)"
              >
                PARTNER
              </button>
            </div>
          </div>
        </header>
        <div class="marquee">
          <div class="marquee-content">
            $500M+ FUNDED // 10K+ BUSINESSES // 80+ PARTNERS // $500M+ FUNDED //
            10K+ BUSINESSES // 80+ PARTNERS //
          </div>
        </div>
        <div class="grid-values">
          <div class="value-block">
            <div class="vertical-text">BUSINESS CAPITAL</div>
            <p>Fast liquidity for scaling operations.</p>
          </div>
          <div class="value-block">
            <div class="vertical-text">REVENUE-BASED</div>
            <p>Pay as you grow, not fixed dates.</p>
          </div>
          <div class="value-block">
            <div class="vertical-text">ASSET-BACKED</div>
            <p>Leverage what you own for more.</p>
          </div>
          <div class="value-block">
            <div class="vertical-text">NON-DILUTIVE</div>
            <p>Keep your equity. We take zero.</p>
          </div>
          <div class="value-block">
            <div class="vertical-text">STARTUP</div>
            <p>Seed stage and beyond funding.</p>
          </div>
          <div class="value-block">
            <div class="vertical-text">ECOMMERCE</div>
            <p>Inventory and marketing spend.</p>
          </div>
        </div>
        <section class="product-grid">
          <div class="card brut-border">
            <h3>BRIDGE LOAN</h3>
            <p>$50K - $2M</p>
          </div>
          <div class="card brut-border" style="background:var(--accent)">
            <h3>SAAS LINE</h3>
            <p>$100K - $5M</p>
          </div>
          <div class="card brut-border">
            <h3>CREDIT MAX</h3>
            <p>$10K - $500K</p>
          </div>
        </section>
        <footer>
          <div>
            <h3>MOONSHINE CAPITAL</h3>
            <p>©2024 NO RIGHTS RESERVED.</p>
          </div>
          <div>
            <h4>LINKS</h4>
            <p>APPLY</p>
            <p>DOCS</p>
            <p>API</p>
          </div>
          <div>
            <h4>SOCIAL</h4>
            <p>TWITTER</p>
            <p>GITHUB</p>
          </div>
        </footer>
      </body>
    </html>
    ```
    
- **AI Directory / Marketplace Site**
    
    ```jsx
    Design an "AI Directory / Marketplace" website for Moonshine Capital funding products.
    
    VISUAL STYLE: Tech-forward, Clean, Data-driven. Light mode base (#fafafa), card white (#ffffff), primary purple (#7c3aed), secondary blue (#3b82f6). Modern sans-serif, plenty of filtering UI, search-first design.
    
    LAYOUT STRUCTURE:
    
    HEADER:
    - Sticky header with Moonshine Capital logo
    - Large search bar (center): "Search 80+ funding products..."
    - Filter toggles: Business Type | Funding Amount | Speed | Credit Score
    - User account icon (top right)
    
    HERO SEARCH SECTION:
    - Prominent search hero: "Find Your Perfect Funding Match"
    - Smart search with autocomplete suggestions
    - Popular searches: "SaaS Funding", "Bad Credit", "Next-Day Cash"
    - Category quick-filters below search
    
    FILTER SIDEBAR (Left):
    - Collapsible filter panel
    - Categories: Product Type, Amount Range, Time to Fund, Credit Requirements, Industry
    - Checkbox filters with result counts
    - "Apply Filters" and "Clear All" buttons
    
    PRODUCT GRID (Main):
    - Responsive card grid (3 columns desktop, 1 mobile)
    - Each product card:
      - Provider logo and rating (5 stars)
      - Product name and tagline
      - Key specs: Amount range, Time to fund, Min credit score
      - Features list (checkmarks)
      - "Learn More" and "Apply Now" buttons
      - "Save" heart icon
    - Sorting options: Relevance, Speed, Amount, Rating
    
    PRODUCT DETAIL MODAL:
    - Overlay modal when "Learn More" clicked
    - Full product information
    - Detailed eligibility requirements
    - Application process breakdown
    - Reviews and testimonials
    - Direct "Apply Now" CTA
    
    COMPARISON TOOL:
    - Sticky bottom bar: "Compare Products"
    - Select up to 3 products for side-by-side comparison
    - Comparison view: detailed feature matrix
    - Clear winner highlighting
    
    PARTNER SPOTLIGHT SECTION:
    - Featured funding partners (carousel)
    - Partner benefits and specializations
    - "View All Partners" link to full directory
    
    RESOURCES SECTION:
    - Educational content cards
    - "How to Choose Funding", "Application Tips", "Credit Building"
    - Blog posts and guides
    - Video tutorials
    
    FOOTER:
    - Comprehensive footer
    - Product categories
    - Partner programs
    - Resources and support
    - Legal and compliance
    
    DESIGN REQUIREMENTS:
    - Fast, responsive filtering (instant results)
    - Skeleton loaders during data fetch
    - Accessibility-first design
    - Mobile-optimized touch targets
    - Breadcrumb navigation
    - Pagination or infinite scroll
    - Save/bookmark functionality (requires account)
    - Share product links
    ```
    

## Partner & Affiliate Tools

- **Partner Dashboard (Dark Mode)**
    
    ```jsx
    Design a "Partner Dashboard" for Moonshine Capital affiliate network.
    
    VISUAL STYLE: Professional, Data-rich, Dark Mode. Dark navy (#0f172a), slate (#1e293b), card dark (#1e293b), accent gold (#fbbf24), success green (#10b981), white text (#f8fafc).
    
    LAYOUT STRUCTURE:
    
    SIDEBAR NAVIGATION (Left):
    - Moonshine Capital logo at top
    - User profile section with avatar and name
    - Navigation items with icons:
      - Dashboard (home icon)
      - Leads (users icon)
      - Commissions (dollar icon)
      - Reports (chart icon)
      - Marketing (megaphone icon)
      - Training (book icon)
      - Support (help icon)
      - Settings (gear icon)
    - Collapse/expand toggle
    
    HEADER (Top):
    - Welcome message: "Welcome back, [Name]"
    - Quick actions: "New Lead" button, "Resources" dropdown
    - Notifications bell (with count badge)
    - Profile dropdown
    
    DASHBOARD OVERVIEW:
    - Key metrics row (4 cards):
      - Total Commissions (this month)
      - Active Leads (in pipeline)
      - Funded Deals (this month)
      - Conversion Rate (percentage)
    - Each card: Large number, trend indicator (up/down arrow), comparison to last month
    
    PERFORMANCE CHART:
    - Line chart: Commission earned over time (last 6 months)
    - Toggle: Monthly / Weekly / Daily view
    - Hover tooltips showing exact values
    
    LEADS PIPELINE TABLE:
    - Recent leads with status
    - Columns: Client Name, Business Type, Amount Requested, Status, Date Submitted, Actions
    - Status badges: New (blue), Contacted (yellow), Submitted (orange), Funded (green)
    - Action buttons: View Details, Add Note, Mark Funded
    - Pagination controls
    
    COMMISSION BREAKDOWN:
    - Pie chart showing commission by product type
    - Business Capital, Revenue-Based, Asset-Backed, etc.
    - Clickable segments for detailed breakdown
    
    QUICK ACTIONS PANEL:
    - Card with buttons:
      - Submit New Lead
      - Generate Affiliate Link
      - Download Marketing Materials
      - Request Payout
      - Schedule Training
    
    RECENT ACTIVITY FEED:
    - Timeline of recent actions
    - Lead submissions, funded deals, commission payments
    - Timestamps and details
    - "View All Activity" link
    
    LEADERBOARD WIDGET:
    - Top 10 partners this month
    - Rank, Name, Deals Funded, Commissions Earned
    - "See Full Leaderboard" link
    
    DESIGN REQUIREMENTS:
    - Fully responsive (sidebar collapses to hamburger on mobile)
    - Real-time data updates
    - Interactive charts and graphs
    - Export functionality (CSV, PDF)
    - Dark mode optimized for reduced eye strain
    - Loading states and skeleton screens
    - Error handling and empty states
    ```
    
- **Affiliate Tracking & Link Generator**
    
    ```jsx
    Design an "Affiliate Tracking & Link Generator" tool for Moonshine Capital partners.
    
    VISUAL STYLE: Clean, Functional, Modern. Light base (#f9fafb), white cards (#ffffff), primary blue (#3b82f6), success green (#10b981), chart colors (multi).
    
    LAYOUT STRUCTURE:
    
    HEADER SECTION:
    - Page title: "Affiliate Link Generator & Tracker"
    - Breadcrumb: Dashboard › Marketing › Link Generator
    - Quick stats bar: Total Clicks, Conversions, Earnings (this month)
    
    LINK GENERATOR PANEL:
    - Form to create new affiliate link:
      - Destination URL dropdown (funding products, landing pages, resources)
      - Campaign Name input
      - UTM Parameters (auto-generated, editable): Source, Medium, Campaign, Content
      - Custom slug (optional)
    - "Generate Link" button
    - Output: Shortened affiliate URL with copy button
    - QR code generator toggle
    
    LINK LIBRARY:
    - Table of all generated links
    - Columns: Link Name, Short URL, Destination, Created Date, Clicks, Conversions, Revenue
    - Search and filter: by campaign, date range, performance
    - Bulk actions: Archive, Delete, Export
    - Sort by: Most Clicks, Highest Converting, Newest
    
    PERFORMANCE ANALYTICS:
    - Line chart: Clicks and conversions over time
    - Date range selector: Last 7 days, 30 days, 90 days, Custom
    - Breakdown by:
      - Traffic source (social, email, website, paid)
      - Device type (desktop, mobile, tablet)
      - Geographic location (map visualization)
    
    CONVERSION FUNNEL:
    - Visual funnel showing:
      - Link Clicks
      - Landing Page Views
      - Applications Started
      - Applications Submitted
      - Funded Deals
    - Conversion rates at each stage
    - Identify drop-off points
    
    TOP PERFORMING LINKS:
    - Card carousel showing top 5 links
    - Each card: Link name, clicks, conversion rate, revenue
    - Quick copy button
    - "View Details" link
    
    CAMPAIGN MANAGER:
    - Organize links into campaigns
    - Campaign overview cards: Name, Total Links, Total Clicks, Total Revenue
    - Create, edit, archive campaigns
    - Campaign-level reporting
    
    SHARING TOOLS:
    - Social media share buttons with auto-populated messaging
    - Email template generator with affiliate link embedded
    - Embeddable widgets for websites
    
    PAYOUT TRACKER:
    - Commission earned from each link
    - Pending payouts vs. paid out
    - Payment history table
    - Request payout button (if threshold met)
    
    DESIGN REQUIREMENTS:
    - Real-time click tracking (updates without refresh)
    - Copy-to-clipboard functionality
    - Export reports (PDF, CSV, Excel)
    - Mobile-responsive tables (horizontal scroll or card view)
    - Tooltips explaining metrics
    - Color-coded performance indicators
    - Empty states with helpful guidance
    ```
    
- **FinOps & Management Dashboard**
    
    ```jsx
    Design a "FinOps & Management Dashboard" for Moonshine Capital operations team.
    
    VISUAL STYLE: Enterprise, Data-dense, Professional. Light mode (#ffffff), subtle gray (#f3f4f6), primary navy (#1e40af), alert red (#ef4444), success green (#10b981).
    
    LAYOUT STRUCTURE:
    
    EXECUTIVE SUMMARY (Top):
    - Key business metrics in large cards (5 across):
      - Total Funding Volume (this month, YTD)
      - Applications Processed
      - Approval Rate (%)
      - Average Deal Size
      - Active Partners
    - Each card: primary metric, trend indicator, comparison period
    
    FINANCIAL OVERVIEW:
    - Revenue chart (bar/line combo)
      - Total revenue by month (bars)
      - Target line overlay
      - Toggle: Revenue, Commissions Paid, Net Profit
    - Key financial metrics below chart:
      - Gross Revenue, Commission Expense, Net Revenue, Profit Margin
    
    FUNDING PIPELINE:
    - Kanban board or funnel view
    - Stages: Applied, Under Review, Approved, Funded, Declined
    - Deal cards with key info: Business Name, Amount, Product Type, Days in Stage
    - Drag-and-drop to move deals
    - Filter by: Partner, Product, Date Range, Amount
    
    PARTNER PERFORMANCE TABLE:
    - Sortable table of all partners
    - Columns: Partner Name, Deals Submitted, Funded Deals, Conversion Rate, Total Revenue, Commission Paid, Tier/Status
    - Search and advanced filters
    - Export to Excel/CSV
    - Row actions: View Profile, Message, Adjust Commission
    
    PRODUCT PERFORMANCE:
    - Table or card view showing each funding product
    - Metrics: Applications, Approvals, Funding Volume, Avg Time to Close, Partner Adoption
    - Compare products side-by-side
    - Identify underperforming products
    
    OPERATIONAL METRICS:
    - Grid of operational KPIs:
      - Avg Time to Approval
      - Avg Time to Funding
      - Application Abandonment Rate
      - Support Tickets Resolved
      - System Uptime
    - Real-time updates
    
    PARTNER PAYOUTS:
    - Upcoming payouts (by date)
    - Filter: Pending, Scheduled, Completed
    - Bulk approve payouts
    - Individual payout details
    - Generate payout reports
    
    COMPLIANCE & RISK:
    - Alerts panel showing:
      - High-risk applications
      - Compliance issues
      - Fraud alerts
      - Audit requirements
    - Priority levels: Critical, High, Medium, Low
    - Acknowledge and resolve workflows
    
    ACTIVITY LOG:
    - Real-time feed of system activity
    - Filterable by: User, Action Type, Date/Time
    - Events: New Applications, Funded Deals, Partner Signups, Payout Requests
    - Audit trail for compliance
    
    REPORTS SECTION:
    - Pre-built report templates:
      - Monthly Executive Summary
      - Partner Performance Report
      - Product Analysis Report
      - Financial Statements
    - Custom report builder
    - Schedule automated reports (email delivery)
    
    ADMIN TOOLS:
    - User management (add/edit partners, staff)
    - Product catalog management (add/edit funding products)
    - Commission structure editor
    - System settings and configurations
    
    DESIGN REQUIREMENTS:
    - Role-based access control (different views for different users)
    - Real-time data synchronization
    - Responsive tables (collapsible columns on mobile)
    - Export functionality throughout
    - Advanced filtering and search
    - Bulk actions where applicable
    - Loading states and error handling
    - Audit logging on all administrative actions
    ```
    

## Community & Engagement Tools

- **Funding Marketplace Directory**
    
    ```jsx
    Design a "Funding Marketplace Directory" for Moonshine Capital.
    
    VISUAL STYLE: Clean, Accessible, Trust-building. White background (#ffffff), light gray (#f5f5f5), brand blue (#2563eb), trust green (#10b981), clear hierarchy.
    
    LAYOUT STRUCTURE:
    
    HERO SECTION:
    - Large headline: "Find Your Funding Match"
    - Subheadline: "80+ funding partners, 1 simple search"
    - Prominent search bar with smart suggestions
    - Category pills: Business Capital, Revenue-Based, Asset-Backed, Startup, E-commerce, SaaS, Credit Building, View All
    
    FEATURED PRODUCTS (Carousel):
    - Rotating carousel of 5-6 featured funding products
    - Each slide: Product image, name, key benefits, "Learn More" button
    - Auto-advance with pause on hover
    - Navigation dots
    
    CATEGORY GRID:
    - 8 category cards in responsive grid
    - Each card: Icon, category name, number of products, "Browse" button
    - Hover effect: slight elevation, color shift
    
    POPULAR PRODUCTS:
    - Grid of most-viewed or best-converting products
    - Each product card:
      - Provider logo
      - Product name and tagline
      - Key specs: Amount range, approval time, credit requirement
      - Star rating and review count
      - "View Details" and "Apply" buttons
    - Load more / pagination
    
    FILTER & SORT:
    - Left sidebar or top bar filters:
      - Funding type checkboxes
      - Amount range slider
      - Time to funding (same day, next day, within week, etc.)
      - Credit score requirement
      - Industry specialization
    - Sort dropdown: Relevance, Speed, Amount, Rating
    
    COMPARISON TOOL:
    - "Compare Products" checkbox on each card
    - Sticky comparison bar at bottom
    - Side-by-side comparison view (modal or new page)
    - Feature matrix with checkmarks
    
    PARTNER SPOTLIGHT:
    - Section highlighting 3-4 key funding partners
    - Partner logo, brief description, specialties, "View Products" link
    
    EDUCATIONAL CONTENT:
    - "Funding Guides" section
    - Article cards: thumbnails, titles, excerpts
    - Topics: "How to Choose", "Credit Requirements", "Application Tips"
    
    TRUST SIGNALS:
    - Trust badge strip: "80+ Partners | $500M+ Funded | 10K+ Businesses Served"
    - Client testimonials carousel
    - Industry certifications and affiliations
    
    FOOTER:
    - Comprehensive footer navigation
    - Product categories
    - Partner programs
    - Resources
    - Company info
    - Contact and support
    
    DESIGN REQUIREMENTS:
    - Instant search results (AJAX)
    - Responsive grid (4 cols desktop, 2 tablet, 1 mobile)
    - Lazy loading for images
    - Accessibility: keyboard navigation, ARIA labels, screen reader support
    - SEO-optimized (semantic HTML, meta tags, structured data)
    - Fast page load (under 3 seconds)
    - Clear CTAs throughout
    ```
    
- **Community Forum / Discussion Board**
    
    ```jsx
    Design a "Community Forum / Discussion Board" for Moonshine Capital network.
    
    VISUAL STYLE: Community-focused, Modern, Engaging. Light mode base (#ffffff), accent blue (#3b82f6), secondary purple (#8b5cf6), warm grays, friendly sans-serif.
    
    LAYOUT STRUCTURE:
    
    HEADER:
    - Moonshine Capital logo + "Community Forum"
    - Search bar: "Search discussions..."
    - Navigation: Home, Categories, Leaderboard, Rules, My Posts
    - User avatar with dropdown: Profile, Settings, Logout
    - Notification bell (with count)
    
    SIDEBAR (Left):
    - Categories list:
      - 🚀 Getting Started
      - 💰 Funding Success Stories
      - 🤝 Partner Strategies
      - 📊 Credit Building Tips
      - 🎯 Lead Generation
      - 💻 Tech & Tools
      - 🎓 Training & Resources
      - ❓ General Discussion
    - Each category: icon, name, unread post count
    - "Create New Post" prominent button
    
    MAIN FEED:
    - Filter tabs: Hot, New, Top (today/week/month), Unanswered
    - Discussion list items:
      - User avatar
      - Post title (clickable)
      - Preview of first few lines
      - Meta info: Category, Author, Time posted, View count, Reply count
      - Tags if applicable
      - Upvote/like count
    - Pagination or infinite scroll
    
    DISCUSSION THREAD VIEW:
    - Original post at top:
      - User info (avatar, username, join date, post count, reputation)
      - Full post content (with formatting: bold, italic, lists, images, links)
      - Timestamp
      - Actions: Like, Reply, Share, Report, Bookmark
    - Replies nested below:
      - Threaded or flat view toggle
      - Sort: Oldest, Newest, Most Likes
      - Each reply: same structure as original post
      - Quote reply option
    - Rich text editor for new replies (formatting toolbar, emoji picker, file upload)
    
    SIDEBAR (Right):
    - "Related Discussions" widget
    - "Top Contributors" this week (avatars, names, post counts)
    - "Trending Tags" cloud
    - Ad space or promotional banner (Partner Program CTA)
    
    CREATE POST MODAL:
    - Post title input
    - Category selector
    - Rich text editor (formatting, media upload)
    - Tags input (suggestions as you type)
    - Preview before posting
    - "Post" and "Save Draft" buttons
    
    USER PROFILE PAGE:
    - User info: avatar, username, bio, join date, location
    - Stats: Posts, Replies, Likes Received, Reputation Score
    - Recent activity feed
    - Badges/achievements earned
    - Follow button (if not own profile)
    
    LEADERBOARD PAGE:
    - Top contributors (by posts, replies, likes)
    - Filter by time period: This week, This month, All time
    - Gamification: badges, levels, rewards
    
    MODERATION TOOLS (for admins/mods):
    - Flag review queue
    - Pin/unpin posts
    - Lock/unlock threads
    - Edit/delete content
    - Ban users
    - Category management
    
    DESIGN REQUIREMENTS:
    - Real-time updates (new posts, replies without refresh)
    - Markdown or WYSIWYG editor for formatting
    - Emoji reactions (👍 ❤️ 😂 🎉 🤔)
    - Mention users with @username autocomplete
    - File/image upload (with preview)
    - Mobile-optimized (collapsible sidebar, touch-friendly)
    - Notifications for replies, mentions, likes
    - Spam protection and rate limiting
    - SEO-friendly URLs for discussions
    ```
    
- **Private Facebook-Style Groups Hub**
    
    ```jsx
    Design a "Private Groups Hub" (Facebook-style) for Moonshine Capital community.
    
    VISUAL STYLE: Social, Welcoming, Familiar. Light blue background (#e7f3ff), white cards (#ffffff), primary blue (#1877f2), accent green (#42b72a), friendly sans-serif.
    
    LAYOUT STRUCTURE:
    
    HEADER:
    - Moonshine Capital logo + "Community Groups"
    - Search: "Search groups and posts..."
    - Navigation: Home, Groups, Events, Notifications, Messages
    - User profile icon with dropdown
    
    LEFT SIDEBAR:
    - User profile summary (avatar, name, "View Profile")
    - Your Groups section:
      - List of groups you've joined
      - Each with: group icon, name, unread count
      - "+ Discover New Groups" link
    - Quick links:
      - Events
      - Saved posts
      - Members directory
    
    MAIN FEED:
    - Post composer at top:
      - "What's on your mind, [Name]?"
      - Buttons: Photo/Video, Poll, Event
      - Privacy selector: Public / Group-specific
    - Feed of posts from all joined groups:
      - User avatar and name
      - Group name (if cross-posting)
      - Timestamp
      - Post content (text, images, videos, links, polls)
      - Engagement buttons: Like, Comment, Share
      - Comment count and preview of top comment
    - Infinite scroll
    
    RIGHT SIDEBAR:
    - "Suggested Groups" widget
      - Group cards with: icon, name, member count, "Join" button
    - "Upcoming Events" widget
    - "Group Announcements" from admins
    
    GROUP PAGE VIEW:
    - Cover photo and group icon
    - Group name and description
    - Member count and privacy status (Private/Public)
    - Action buttons: Joined (checkmark), Invite, Share, More (dropdown)
    - Tabs: Discussion, Members, Events, Media, Files
    - Discussion tab: dedicated feed for this group only
    - Members tab: searchable member list with ability to message or view profiles
    - Events tab: calendar view and list of group events
    - Media tab: grid of photos/videos shared in group
    - Files tab: shared documents and resources
    
    POST DETAIL VIEW:
    - Full post with all comments expanded
    - Nested comments (reply to comment)
    - Comment sorting: Most Relevant, Newest, Oldest
    - Rich text comment editor
    - Reactions (beyond Like: Love, Haha, Wow, Sad, Angry)
    
    CREATE GROUP MODAL:
    - Group name input
    - Group description (rich text)
    - Privacy setting: Public / Private / Secret
    - Cover photo upload
    - Category selection
    - Invite initial members (search directory)
    
    GROUP SETTINGS (for admins):
    - Member approval queue (for private groups)
    - Moderator management (add/remove)
    - Post approval settings
    - Group rules editor
    - Scheduled posts
    - Insights/analytics (post reach, engagement, member growth)
    
    EVENTS FEATURE:
    - Create event within group
    - Event details: Title, Date/Time, Location (virtual or physical), Description
    - RSVP options: Going, Maybe, Can't Go
    - Event discussion thread
    - Reminders before event
    
    NOTIFICATIONS:
    - Real-time notifications for:
      - New posts in your groups
      - Comments on your posts
      - Mentions (@your name)
      - Group invitations
      - Event reminders
    - Notification settings per group (All posts, Highlights, Off)
    
    DESIGN REQUIREMENTS:
    - Familiar Facebook-like UX (minimal learning curve)
    - Real-time updates (new posts, comments, likes)
    - Rich media support (images, videos, GIFs, documents)
    - Responsive design (mobile app feel)
    - Privacy controls (who can see posts, who can join)
    - Content moderation tools
    - Accessibility features
    - Push notifications (if web app or PWA)
    ```
    

## Account Management & Onboarding

- **User Account Portal**
    
    ```jsx
    Design a "User Account Portal" for Moonshine Capital clients and partners.
    
    VISUAL STYLE: Clean, Professional, Trustworthy. White base (#ffffff), light gray (#f7f7f7), brand navy (#1e40af), success green (#10b981), clear hierarchy.
    
    LAYOUT STRUCTURE:
    
    SIDEBAR NAVIGATION:
    - User profile section:
      - Avatar (clickable to change)
      - Name and account type (Client / Partner / Admin)
      - Account status badge (Active, Pending, etc.)
    - Navigation menu:
      - 🏠 Dashboard
      - 👤 Profile
      - 💳 Applications (for clients) / Leads (for partners)
      - 💰 Funding History / Commissions
      - 📄 Documents
      - ⚙️ Settings
      - 🔐 Security
      - 💬 Messages
      - 🎓 Resources
      - ❓ Help & Support
    
    DASHBOARD (HOME):
    - Welcome message: "Welcome back, [Name]"
    - Quick action cards:
      - "Apply for Funding" / "Submit New Lead"
      - "View Documents"
      - "Contact Support"
    - Status overview:
      - For Clients: Active applications, funding status, next steps
      - For Partners: Active leads, pending commissions, recent activity
    - Recent activity timeline
    - Notifications panel
    
    PROFILE PAGE:
    - Profile information form:
      - Personal: Name, Email, Phone, Date of Birth
      - Business: Company Name, EIN, Industry, Business Address
      - Banking: Account details for payouts (partners)
    - Avatar upload
    - "Save Changes" button
    - Account verification status (if applicable)
    
    APPLICATIONS / LEADS PAGE:
    - For Clients:
      - List of all funding applications
      - Status: Draft, Submitted, Under Review, Approved, Funded, Declined
      - Each item: Product name, amount, date submitted, status badge, "View Details"
      - Filter by status, date
      - "Start New Application" button
    - For Partners:
      - List of all submitted leads
      - Status: New, Contacted, Submitted, Funded
      - Each item: Client name, product, amount, date, status, actions
      - Filter and search
      - "Submit New Lead" button
    
    APPLICATION DETAIL VIEW (Clients):
    - Application summary card
    - Required documents checklist (with upload buttons)
    - Communication log (messages with underwriter/support)
    - Status updates timeline
    - Next steps / action items
    
    FUNDING HISTORY / COMMISSIONS:
    - For Clients:
      - Table of funded deals: date, product, amount, term, status (active/paid off)
      - Payment schedule
      - Statements and invoices (downloadable)
    - For Partners:
      - Commission history: date, client, deal size, commission amount, status (pending/paid)
      - Total earnings: This month, This year, Lifetime
      - Payout schedule
      - Request payout button (if balance exceeds threshold)
    
    DOCUMENTS PAGE:
    - Organized folder structure
    - Upload area (drag-and-drop or browse)
    - Document list: name, type, size, upload date, actions (view, download, delete)
    - Filter by document type (Tax docs, Financial statements, Contracts, etc.)
    - Secure document storage notice
    
    SETTINGS PAGE:
    - Account settings:
      - Email preferences (notifications, newsletters)
      - Communication preferences (email, SMS, phone)
      - Timezone and language
    - Notification settings:
      - Toggle notifications by type (application updates, commission payments, messages, etc.)
    - Privacy settings
    
    SECURITY PAGE:
    - Change password form
    - Two-factor authentication (enable/disable)
    - Active sessions list (with "Sign out other devices" option)
    - Login history / audit log
    - Security questions setup
    
    MESSAGES:
    - Inbox / Sent / Archived tabs
    - Message list: sender, subject, date, read/unread status
    - Message thread view (conversation style)
    - Compose new message (to support or assigned rep)
    - Attachments support
    
    RESOURCES:
    - Knowledge base articles
    - Video tutorials
    - FAQs
    - Download marketing materials (partners)
    - Downloadable guides and templates
    
    HELP & SUPPORT:
    - FAQs accordion
    - Submit support ticket form (with priority selection)
    - Live chat widget (if available)
    - Contact information (phone, email)
    - Schedule consultation button
    
    DESIGN REQUIREMENTS:
    - Fully responsive (mobile-friendly sidebar collapses to hamburger)
    - Secure authentication (OAuth or similar)
    - Session timeout warnings
    - Data encryption for sensitive information
    - Accessibility compliant (WCAG 2.1 AA)
    - Loading states and progress indicators
    - Clear error messages and validation
    - Confirmation dialogs for important actions
    - Auto-save on forms (prevent data loss)
    ```
    

- **Partner Onboarding Wizard**
    
    ```jsx
    Design a "Partner Onboarding Wizard" for new Moonshine Capital affiliates.
    
    VISUAL STYLE: Welcoming, Progressive, Clean. White background (#ffffff), accent purple (#8b5cf6), progress indicators, friendly illustrations, clear CTAs.
    
    LAYOUT STRUCTURE:
    
    WELCOME SCREEN:
    - Hero section:
      - Large welcome headline: "Welcome to Moonshine Capital Partners!"
      - Subheadline: "Let's get you set up in just a few minutes"
      - Illustration or video (onboarding overview)
    - What to expect:
      - Icons showing steps: Account Setup → Profile Creation → Training → Go Live
      - Estimated time: "5-10 minutes"
    - "Let's Get Started" large button
    
    PROGRESS INDICATOR (Top):
    - Visual progress bar showing current step
    - Step numbers and labels:
      - 1. Account Info
      - 2. Business Details
      - 3. Banking Info
      - 4. Agreement
      - 5. Training
    - Completed steps show checkmarks
    
    STEP 1: ACCOUNT INFORMATION:
    - Form fields:
      - Full Name
      - Email Address (pre-filled if signed up)
      - Phone Number
      - Password (with strength indicator)
      - Confirm Password
    - "Continue" button
    - "Save and finish later" link
    
    STEP 2: BUSINESS DETAILS:
    - Form fields:
      - Business Name (or "Operating as Individual")
      - Business Structure (sole proprietor, LLC, corporation, etc.)
      - EIN / Tax ID (optional at this stage)
      - Business Website (optional)
      - Social Media Profiles (optional: LinkedIn, Facebook, Instagram)
      - How did you hear about us? (dropdown)
    - Previous / Continue buttons
    
    STEP 3: BANKING INFORMATION:
    - Explanation: "Where should we send your commissions?"
    - Form fields:
      - Bank Name
      - Account Holder Name
      - Account Number
      - Routing Number
      - Account Type (Checking / Savings)
    - Security notice: "Your information is encrypted and secure"
    - Option: "I'll add this later" (skip for now)
    - Previous / Continue buttons
    
    STEP 4: PARTNER AGREEMENT:
    - Agreement document (scrollable):
      - Terms and Conditions
      - Commission structure
      - Partner responsibilities
    - Checkboxes:
      - "I have read and agree to the Partner Agreement"
      - "I agree to the Privacy Policy"
    - E-signature capture
    - Previous / Accept & Continue buttons
    
    STEP 5: INITIAL TRAINING:
    - Welcome video from founder or team (3-5 minutes)
    - Quick training modules (accordion or tabs):
      - How the platform works
      - Submitting your first lead
      - Commission structure explained
      - Best practices
    - Downloadable resources:
      - Partner Handbook (PDF)
      - Quick Start Guide
      - Marketing Materials
    - "Mark as Complete and Continue" button
    
    COMPLETION SCREEN:
    - Celebration illustration or confetti animation
    - "You're All Set!" headline
    - Summary of what's next:
      - "Your account is under review (up to 24 hours)"
      - "Check your email for login credentials"
      - "Access your dashboard and start submitting leads"
    - CTA buttons:
      - "Go to Dashboard"
      - "Submit Your First Lead"
      - "Explore Resources"
    
    SIDEBAR (Persistent Throughout):
    - Customer support contact info
    - "Need help?" chat bubble
    - Progress checklist (mini version)
    - "Save and exit" option
    
    DESIGN REQUIREMENTS:
    - Auto-save on every step (no data loss if they leave)
    - Field validation (real-time and on submit)
    - Clear error messages
    - Back button always available
    - Skip optional steps
    - Mobile-responsive (multi-step forms work well on mobile)
    - Accessibility (keyboard navigation, screen reader support)
    - Option to upload documents (ID, business license) later
    - Email confirmation sent after completion
    - Confirmation emails at each major step
    ```
    

- Source Code 1
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            :root { --accent: #8b5cf6; }
            .bg-accent { background-color: var(--accent); }
            .text-accent { color: var(--accent); }
            .border-accent { border-color: var(--accent); }
            .progress-line { height: 2px; flex-grow: 1; background: #e5e7eb; position: relative; top: 15px; }
            .progress-line.active { background: var(--accent); }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
        </style>
    </head>
    <body class="bg-white font-sans text-slate-800">
        <div class="flex min-h-screen">
            <!-- Sidebar (Fixed) -->
            <aside class="w-80 bg-slate-50 border-r border-slate-100 flex flex-col p-8 hidden lg:flex">
                <div class="mb-12">
                    <div class="flex items-center gap-2 mb-8">
                        <div class="w-8 h-8 bg-accent rounded-lg"></div>
                        <span class="font-bold text-xl tracking-tight">Moonshine Capital</span>
                    </div>
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Your Progress</h3>
                    <div class="space-y-6">
                        <div class="flex items-center gap-4 text-accent">
                            <div class="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center text-xs font-bold">1</div>
                            <span class="font-medium">Account Info</span>
                        </div>
                        <div class="flex items-center gap-4 text-slate-400">
                            <div class="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-xs font-bold">2</div>
                            <span class="font-medium">Business Details</span>
                        </div>
                        <div class="flex items-center gap-4 text-slate-400">
                            <div class="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-xs font-bold">3</div>
                            <span class="font-medium">Banking Info</span>
                        </div>
                    </div>
                </div>
                
                <div class="mt-auto">
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <p class="text-sm font-medium mb-1">Need help?</p>
                        <p class="text-xs text-slate-500 mb-3">Our partner support team is here to assist you.</p>
                        <button class="w-full py-2 text-xs font-semibold bg-slate-100 rounded-lg hover:bg-slate-200 transition">Chat with us</button>
                    </div>
                    <button class="mt-4 text-xs text-slate-400 hover:text-slate-600">Save and exit</button>
                </div>
            </aside>
    
            <!-- Main Content -->
            <main class="flex-1 flex flex-col">
                <!-- Top Progress Bar (Mobile/Tablet visible) -->
                <div class="p-6 border-b border-slate-50 lg:hidden">
                    <div class="flex justify-between items-center mb-2 text-xs font-bold text-slate-400">
                        <span>STEP 1 OF 5</span>
                        <span class="text-accent">20%</span>
                    </div>
                    <div class="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div class="w-1/5 h-full bg-accent"></div>
                    </div>
                </div>
    
                <div class="max-w-3xl w-full mx-auto p-8 md:p-16">
                    <!-- Step Content: Account Information -->
                    <div id="step-1">
                        <header class="mb-10">
                            <h1 class="text-3xl font-bold mb-3">Welcome to Moonshine Capital Partners!</h1>
                            <p class="text-slate-500">Let's get you set up in just a few minutes. (Est: 5-10 mins)</p>
                        </header>
    
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-sm font-semibold">Full Name</label>
                                <input type="text" placeholder="John Doe" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none transition">
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-semibold">Email Address</label>
                                <input type="email" value="john@example.com" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none transition">
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-semibold">Phone Number</label>
                                <input type="tel" placeholder="+1 (555) 000-0000" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none transition">
                            </div>
                            <div class="space-y-2 md:col-span-2">
                                <label class="text-sm font-semibold">Password</label>
                                <input type="password" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none transition">
                                <div class="h-1 w-full bg-slate-100 rounded-full mt-2">
                                    <div class="w-3/4 h-full bg-green-500 rounded-full"></div>
                                </div>
                                <p class="text-xs text-slate-400">Strength: Strong</p>
                            </div>
                        </div>
    
                        <div class="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
                            <button class="w-full md:w-auto px-10 py-4 bg-accent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition transform hover:-translate-y-0.5 active:scale-95">Continue</button>
                            <a href="#" class="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-4">Save and finish later</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
    ```
    
- Source Code 2
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            :root { --accent: #8b5cf6; }
            .btn-primary { background: var(--accent); color: white; border-radius: 0.75rem; padding: 0.75rem 2rem; font-weight: 600; transition: all 0.2s; }
            .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
            .step-active { color: var(--accent); font-weight: 700; border-bottom: 3px solid var(--accent); }
            .step-done { color: #10b981; }
        </style>
    </head>
    <body class="bg-[#fcfcfd] min-h-screen flex flex-col">
        <!-- Navigation / Progress Bar -->
        <nav class="bg-white border-b border-slate-100">
            <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <div class="font-black text-xl text-slate-900 tracking-tighter italic">MOONSHINE</div>
                <div class="hidden md:flex gap-8 h-full">
                    <div class="flex items-center step-done gap-2 text-sm"><span>✓ Account</span></div>
                    <div class="flex items-center step-active gap-2 text-sm"><span>2. Business</span></div>
                    <div class="flex items-center text-slate-300 gap-2 text-sm"><span>3. Banking</span></div>
                    <div class="flex items-center text-slate-300 gap-2 text-sm"><span>4. Agreement</span></div>
                    <div class="flex items-center text-slate-300 gap-2 text-sm"><span>5. Training</span></div>
                </div>
                <button class="text-slate-400 hover:text-slate-900 text-sm font-medium">Support</button>
            </div>
        </nav>
    
        <!-- Main Body -->
        <div class="flex-1 flex items-center justify-center p-6">
            <div class="bg-white w-full max-w-2xl rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-50">
                <h2 class="text-2xl font-bold mb-2">Business Details</h2>
                <p class="text-slate-500 mb-8">Tell us a bit more about how you operate your business.</p>
    
                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-sm font-bold">Business Name</label>
                            <input type="text" placeholder="Operating as Individual" class="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-accent focus:outline-none">
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold">Business Structure</label>
                            <select class="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-accent focus:outline-none appearance-none bg-slate-50">
                                <option>Sole Proprietor</option>
                                <option>LLC</option>
                                <option>Corporation</option>
                            </select>
                        </div>
                    </div>
    
                    <div class="space-y-2">
                        <label class="text-sm font-bold">Business Website <span class="text-slate-400 font-normal">(Optional)</span></label>
                        <input type="url" placeholder="https://..." class="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-accent focus:outline-none">
                    </div>
    
                    <div class="space-y-2">
                        <label class="text-sm font-bold">How did you hear about us?</label>
                        <select class="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-accent focus:outline-none appearance-none bg-slate-50">
                            <option>Social Media</option>
                            <option>Referral</option>
                            <option>Event/Webinar</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
    
                <div class="mt-12 flex items-center justify-between">
                    <button class="text-slate-400 font-bold hover:text-slate-600">Previous</button>
                    <button class="btn-primary">Continue to Banking</button>
                </div>
            </div>
        </div>
    </body>
    </html>
    ```
    
- Source Code 3
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            :root { --accent: #8b5cf6; }
            .step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: white; border: 2px solid #e2e8f0; color: #94a3b8; transition: all 0.3s; }
            .step-circle.active { border-color: var(--accent); color: var(--accent); box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1); }
            .step-circle.complete { background: var(--accent); border-color: var(--accent); color: white; }
            .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px); }
        </style>
    </head>
    <body class="bg-[#fafafa] text-slate-900">
        <!-- Persistent Sidebar Overlay -->
        <div class="fixed bottom-6 right-6 z-50">
            <button class="w-14 h-14 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition active:scale-95">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </button>
        </div>
    
        <!-- Step 3 Content: Banking -->
        <div class="max-w-4xl mx-auto px-4 py-12">
            <div class="mb-12 flex justify-between items-center relative">
                <div class="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
                <div class="step-circle complete">✓</div>
                <div class="step-circle complete">✓</div>
                <div class="step-circle active font-bold">3</div>
                <div class="step-circle">4</div>
                <div class="step-circle">5</div>
            </div>
    
            <div class="grid lg:grid-cols-5 gap-12">
                <div class="lg:col-span-3">
                    <h1 class="text-4xl font-extrabold tracking-tight mb-4">Banking Information</h1>
                    <p class="text-lg text-slate-500 mb-8">Where should we send your commissions? We support all major US and International banks.</p>
    
                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2 space-y-2">
                                <label class="text-xs font-bold text-slate-400 uppercase">Account Holder Name</label>
                                <input type="text" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none">
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-400 uppercase">Bank Name</label>
                                <input type="text" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none">
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-400 uppercase">Account Type</label>
                                <select class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none">
                                    <option>Checking</option>
                                    <option>Savings</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-400 uppercase">Routing Number</label>
                                <input type="text" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none">
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-400 uppercase">Account Number</label>
                                <input type="password" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none">
                            </div>
                        </div>
    
                        <div class="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                            <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                            <p class="text-xs text-blue-700 leading-relaxed">Your information is encrypted and secure. We use bank-level 256-bit encryption to protect your data.</p>
                        </div>
    
                        <div class="flex items-center justify-between pt-8 border-t">
                            <button class="px-6 py-3 font-semibold text-slate-500">Back</button>
                            <div class="flex gap-4">
                                <button class="px-6 py-3 font-semibold text-slate-400 hover:text-slate-600">Skip for now</button>
                                <button class="px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:shadow-purple-200 transition">Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-12">
                        <h4 class="font-bold mb-4">Onboarding Steps</h4>
                        <div class="space-y-4">
                            <div class="flex items-center gap-3 text-sm text-green-500 font-medium">
                                <span class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[10px]">✓</span>
                                Account Setup
                            </div>
                            <div class="flex items-center gap-3 text-sm text-green-500 font-medium">
                                <span class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[10px]">✓</span>
                                Business Profile
                            </div>
                            <div class="flex items-center gap-3 text-sm text-accent font-bold">
                                <span class="w-2 h-2 rounded-full bg-accent"></span>
                                Banking Information
                            </div>
                            <div class="flex items-center gap-3 text-sm text-slate-400">
                                <span class="w-2 h-2 rounded-full bg-slate-200"></span>
                                Partner Agreement
                            </div>
                            <div class="flex items-center gap-3 text-sm text-slate-400">
                                <span class="w-2 h-2 rounded-full bg-slate-200"></span>
                                Initial Training
                            </div>
                        </div>
                        <div class="mt-8 pt-6 border-t">
                            <p class="text-xs text-slate-400">Auto-saving...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    ```
    

## Specialized Tools

- **Funding Calculator & Pre-Qualification Tool**
    
    ```jsx
    Design a "Funding Calculator & Pre-Qualification Tool" for Moonshine Capital.
    
    VISUAL STYLE: Interactive, Calculator-focused, Results-driven. Clean white (#ffffff), brand blue (#2563eb), success green (#10b981), clear number displays, slider interactions.
    
    LAYOUT STRUCTURE:
    
    HERO SECTION:
    - Headline: "See What You Qualify For in 60 Seconds"
    - Subheadline: "No impact on your credit score"
    - Trust badges: "Secure" | "Confidential" | "Free"
    
    CALCULATOR INTERFACE:
    
    STEP 1 - FUNDING NEEDS:
    - Large headline: "How much funding do you need?"
    - Amount slider (or input):
      - Range: $5,000 - $500,000+
      - Large display of selected amount
      - Drag slider or type amount
    - Radio buttons: "Purpose of funding"
      - Working Capital
      - Equipment Purchase
      - Expansion
      - Inventory
      - Marketing
      - Debt Consolidation
      - Other
    - "Next Step" button
    
    STEP 2 - BUSINESS INFO:
    - Questions (progressive disclosure):
      - "How long have you been in business?"
        - Dropdown: < 6 months, 6-12 months, 1-2 years, 2-5 years, 5+ years
      - "What is your average monthly revenue?"
        - Slider: $0 - $500,000+
      - "What is your credit score range?"
        - Buttons: Excellent (750+), Good (650-749), Fair (550-649), Poor (<550), Not Sure
      - "What industry are you in?"
        - Searchable dropdown with common industries
    - Previous / Next buttons
    
    STEP 3 - CONTACT INFO:
    - "Get Your Custom Funding Options"
    - Form fields:
      - First Name
      - Last Name
      - Email
      - Phone Number
      - Business Name (optional)
    - Checkbox: "I agree to receive funding options via email and phone"
    - "See My Options" button (prominent)
    
    RESULTS PAGE:
    
    QUALIFICATION SUMMARY:
    - Large headline: "Great News! You Pre-Qualify for Up to [Amount]"
    - Or: "Here are your best funding options"
    - Summary card:
      - Estimated funding amount
      - Estimated approval time
      - Credit score required
      - Best product match
    
    RECOMMENDED PRODUCTS:
    - 3-5 product cards matching their profile
    - Each card:
      - Product name and provider logo
      - Amount range (with their qualified amount highlighted)
      - Time to funding
      - Key features (bullet points)
      - APR or rate info
      - "Apply Now" button
      - "Learn More" link
    - Sorting: Best Match, Fastest Funding, Highest Amount
    
    COMPARISON TABLE:
    - Side-by-side comparison of top 3 products
    - Rows: Amount, Speed, Credit Req, Fees, Term, Collateral
    - Checkmarks and X marks for quick comparison
    
    NEXT STEPS SECTION:
    - "What happens next?"
    - Timeline visualization:
      - Apply Now → Instant Decision → Receive Funds
      - Time estimates for each step
    - CTA: "Complete Full Application"
    
    EDUCATIONAL SIDEBAR:
    - "Understanding Your Options" widget
    - Links to articles:
      - "Revenue-Based Funding Explained"
      - "How to Improve Your Approval Odds"
      - "Comparing Funding Products"
    - Glossary of terms
    
    ALTERNATIVE OPTIONS:
    - "Didn't see what you need?"
    - Links to:
      - Explore All Products
      - Speak with a Funding Advisor (book consultation)
      - Credit Building Resources (if score is limiting factor)
    
    SAVE/SHARE RESULTS:
    - "Email My Results" button
    - PDF download option
    - Share link (if they want to discuss with partner)
    
    DESIGN REQUIREMENTS:
    - Real-time calculations (instant results)
    - Progress saving (if they leave and come back)
    - No hard credit pull (soft inquiry only, or just pre-qualification logic)
    - Mobile-optimized slider interactions
    - Accessibility (keyboard controls for sliders)
    - Clear disclaimers about pre-qualification vs. approval
    - TCPA compliance for phone number collection
    - Secure data transmission (SSL)
    - Lead captured and routed to appropriate partner/product
    - Follow-up email automation triggered
    ```
    
- **Broker Commission Calculator**
    
    ```jsx
    Design a "Broker Commission Calculator" for Moonshine Capital partners.
    
    VISUAL STYLE: Financial, Motivational, Clear. White background (#ffffff), money green (#10b981), gold accent (#f59e0b), clean number displays, motivational messaging.
    
    LAYOUT STRUCTURE:
    
    HERO SECTION:
    - Headline: "Calculate Your Earning Potential"
    - Subheadline: "See exactly how much you can earn as a Moonshine Capital partner"
    - Illustration of money/growth
    
    CALCULATOR INTERFACE:
    
    INPUT SECTION:
    - Card with form inputs:
      
      "How many deals do you plan to close per month?"
      - Number input or slider (1-50+)
      - Visual indicator: "Conservative" (1-5), "Moderate" (6-15), "Aggressive" (16+)
      
      "What's your average deal size?"
      - Dropdown or slider: $10K, $25K, $50K, $100K, $250K, $500K+
      
      "Which products do you focus on?" (affects commission rate)
      - Checkboxes:
        - Business Capital (base rate)
        - Revenue-Based Funding (higher rate)
        - Asset-Backed (medium rate)
        - SaaS/E-commerce (higher rate)
        - Business Credit (recurring income potential)
      - Default: "All Products" for average calculation
    
    RESULTS DISPLAY:
    
    EARNINGS SUMMARY (Large, Prominent):
    - Monthly Commission: $X,XXX
    - Annual Commission: $XX,XXX
    - Lifetime Earnings (3 years): $XXX,XXX
    - Animated counter that updates as inputs change
    
    EARNINGS BREAKDOWN:
    - Pie chart showing commission by product type
    - Table below:
      - Product Type | Deals/Month | Avg Deal Size | Commission Rate | Monthly Earnings
    
    INCOME SCENARIOS:
    - Toggle between: Conservative, Realistic, Optimistic
    - Adjusts calculations automatically
    - Shows range: "You could earn between $X,XXX and $XX,XXX per month"
    
    COMPARISON SECTION:
    - "How does this compare?"
    - Visual comparison:
      - Average part-time income: $X,XXX
      - Average full-time income: $XX,XXX
      - Top 10% earners: $XXX,XXX
      - YOUR potential: highlighted
    
    GROWTH PROJECTION:
    - Line chart showing income growth over 12-36 months
    - Assumes increasing deal volume and repeat clients
    - Toggle: Monthly / Annually / 3-Year Projection
    
    BONUS EARNINGS:
    - "Don't forget about bonuses!"
    - Additional income opportunities:
      - Recurring commissions (business credit products)
      - Tiered bonuses (volume milestones)
      - Team overrides (if applicable to partner program)
    - Add bonus toggle to calculator
    
    PARTNER TIER SIMULATION:
    - "What tier could you reach?"
    - Show tier structure:
      - Bronze: 1-10 deals/month → X% commission
      - Silver: 11-25 deals/month → X+1% commission
      - Gold: 26-50 deals/month → X+2% commission
      - Platinum: 50+ deals/month → X+3% commission + bonuses
    - Highlight tier they'd reach with current inputs
    
    CALL-TO-ACTION SECTION:
    - "Ready to start earning?"
    - Buttons:
      - "Become a Partner" (primary CTA)
      - "Speak with Recruiter"
      - "Download Partner Brochure"
    
    REALISTIC EXPECTATIONS DISCLAIMER:
    - "Your results may vary"
    - Transparent messaging about typical ramp-up time
    - Link to "Partner Success Stories" for real examples
    
    SHARE RESULTS:
    - "Share your potential earnings"
    - Social sharing (pre-populated with results)
    - Email results to yourself
    
    DESIGN REQUIREMENTS:
    - Real-time calculation updates (instant feedback)
    - Smooth animations on number changes
    - Mobile-responsive (sliders work well on touch)
    - No login required (public tool)
    - Accurate commission rate data (pulled from actual program)
    - Optional: capture email to send full report and follow up with recruitment
    - Motivational copy throughout (aspirational but realistic)
    - Clear disclaimers about earnings not guaranteed
    ```
    
- **Credit Score Simulator & Builder Roadmap**
    
    ```jsx
    Design a "Credit Score Simulator & Builder Roadmap" tool for Moonshine Capital.
    
    VISUAL STYLE: Educational, Progress-focused, Empowering. Clean white (#ffffff), score colors (red/orange/yellow/green gradient), progress bars, milestone visuals.
    
    LAYOUT STRUCTURE:
    
    HERO SECTION:
    - Headline: "Build Business Credit Without Touching Personal Credit"
    - Subheadline: "See your path to $50K+ in credit in 90 days"
    - Trust message: "No personal credit checks or guarantees"
    
    CURRENT STATUS INPUT:
    
    STARTING POINT QUESTIONS:
    - "Do you have a business entity?"
      - Yes (EIN established) / No (guidance to start)
    - "How old is your business?"
      - Dropdown: Just starting, < 6 months, 6-12 months, 1-2 years, 2+ years
    - "Do you have a business bank account?"
      - Yes / No
    - "Do you have a business phone and address?"
      - Yes / No
    - "Current business credit score (if known)"
      - Input or "I don't know"
    
    CREDIT BUILDER ROADMAP:
    
    VISUAL TIMELINE (Progressive):
    - Horizontal or vertical timeline with milestones
    - Each milestone: checkmark or locked icon
    
    PHASE 1: FOUNDATION (Days 1-30):
    - Tasks:
      - ☐ Establish EIN (if not done)
      - ☐ Open business bank account
      - ☐ Get business phone number (dedicated line)
      - ☐ Register D-U-N-S number
      - ☐ Set up business address (physical or virtual)
      - ☐ Build simple business website
    - Credit Impact: Foundation established
    - Estimated Timeline: 1-2 weeks
    - "Start Phase 1" button
    
    PHASE 2: VENDOR CREDIT (Days 30-60):
    - Tasks:
      - ☐ Apply for 5 Tier 1 vendor accounts (no PG required)
      - ☐ Make purchases and pay on time
      - ☐ Get vendor credit lines (Uline, Quill, Grainger examples)
      - ☐ Ensure vendors report to credit bureaus
    - Credit Impact: Initial credit history established
    - Estimated Credit Available: $5,000 - $15,000
    - Estimated Timeline: 30-45 days
    - "View Recommended Vendors" link
    
    PHASE 3: RETAIL CREDIT (Days 60-90):
    - Tasks:
      - ☐ Apply for retail business credit cards (Staples, Home Depot, etc.)
      - ☐ Use cards and maintain low utilization (<30%)
      - ☐ Pay off balances monthly
    - Credit Impact: Diversified credit mix
    - Estimated Credit Available: $15,000 - $35,000
    - Estimated Timeline: 15-30 days
    
    PHASE 4: REVOLVING CREDIT (Days 90+):
    - Tasks:
      - ☐ Apply for business credit cards (Amex, Chase, etc.)
      - ☐ Apply for small business lines of credit
      - ☐ Continue perfect payment history
    - Credit Impact: Major credit lines without PG
    - Estimated Credit Available: $50,000 - $150,000+
    - Estimated Timeline: Ongoing
    
    CREDIT SCORE SIMULATOR:
    
    SCORE PROJECTIONS:
    - Visual gauge showing:
      - Starting Score: [Your current score or "Not Established"]
      - 30-Day Projected Score
      - 60-Day Projected Score
      - 90-Day Projected Score
    - Color-coded: Red (Poor) → Orange (Fair) → Yellow (Good) → Green (Excellent)
    
    SCENARIO MODELING:
    - Toggles: "What if I..."
      - Pay everything on time vs. miss a payment (impact visualization)
      - Keep utilization below 30% vs. max out cards
      - Add more accounts vs. fewer accounts
    - Real-time score adjustment based on scenarios
    
    CREDIT LIMIT PROJECTION:
    - Bar chart or progress bar
    - "Total Available Business Credit"
    - Starting: $0
    - After 30 days: $5K - $15K
    - After 60 days: $15K - $35K
    - After 90 days: $50K - $150K+
    - Factors affecting: business age, payment history, account mix
    
    ACTION PLAN DASHBOARD:
    
    PERSONALIZED TASK LIST:
    - Based on their starting point
    - Prioritized tasks with:
      - Task name
      - Why it matters
      - Estimated time to complete
      - Impact on credit score/limit
      - "Mark Complete" checkbox
    - Progress bar showing overall completion
    
    RESOURCES SECTION:
    - Downloadable guides:
      - "Business Credit Building Blueprint" (PDF)
      - "Vendor Account Application Checklist"
      - "Credit Monitoring Best Practices"
    - Video tutorials for each phase
    - Links to recommended services (business formation, virtual office, etc.)
    
    RECOMMENDED PRODUCTS:
    - "Accelerate Your Credit Building"
    - Moonshine Capital products that help:
      - Business credit lines (for purchasing from vendors)
      - Credit monitoring services (affiliate)
      - Business formation services (affiliate)
    - Each with: description, benefit, "Learn More" button
    
    PROGRESS TRACKING:
    - User can create account to save progress
    - Dashboard showing:
      - Current phase
      - Tasks completed
      - Next milestones
      - Estimated credit score
    - Email reminders for next steps
    
    SUCCESS METRICS:
    - "Based on your progress, you're on track to reach:"
    - $XX,XXX in available credit by [date]
    - Credit score of XXX by [date]
    - Motivational messaging
    
    DESIGN REQUIREMENTS:
    - Interactive and engaging (gamified feel)
    - Clear visual hierarchy (timeline easy to follow)
    - Mobile-responsive (touch-friendly checkboxes)
    - Save progress (account creation optional but encouraged)
    - Educational tooltips explaining terms (D-U-N-S, PG, utilization, etc.)
    - Realistic projections based on actual data
    - Compliance disclaimers (results may vary)
    - CTA to Moonshine Capital products strategically placed
    - Email automation: send reminders and next steps
    ```
    

- Business Loan Affiliate Pillar 1
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            :root {
                --navy: #0F172A; --gold: #EAB308; --green: #22C55E;
            }
            * { box-sizing: border-box; }
            body { font-family: 'Inter', system-ui, sans-serif; margin: 0; color: #334155; }
            .header-sticky { position: sticky; top: 0; background: white; border-bottom: 1px solid #f1f1f1; padding: 20px; display: flex; justify-content: space-between; align-items: center; z-index: 100; }
            .section-padding { padding: 80px 20px; }
            .container { max-width: 1200px; margin: 0 auto; }
            .split-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; background: #0F172A; color: white; padding: 100px 5%; }
            .success-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px; }
            .check-list { list-style: none; padding: 0; }
            .check-list li { padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px; }
            .badge-bar { background: #f8fafc; padding: 20px; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; border-radius: 12px; }
            .proof-stat { text-align: center; }
            .proof-stat h4 { font-size: 2rem; color: var(--navy); margin: 0; }
            @media (max-width: 768px) { .split-hero { grid-template-columns: 1fr; } .success-grid { grid-template-columns: 1fr; } }
        </style>
    </head>
    <body>
        <div class="header-sticky">
            <div style="font-weight: 900; color: var(--navy);">MOONSHINE <span style="color:var(--gold)">CAPITAL</span></div>
            <button style="background:var(--navy); color:white; border:none; padding:10px 20px; border-radius:5px;">Get Started</button>
        </div>
    
        <section class="split-hero">
            <div>
                <h1 style="font-size: 3.5rem; line-height: 1;">Earn Daily Commissions in B2B Financing</h1>
                <p style="font-size: 1.2rem; color: #94A3B8;">Turn your network into a revenue stream. We provide the tools for you to build a scalable funding agency with residual income.</p>
                <button style="background: var(--green); color: white; padding: 20px 40px; border: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; margin-top: 20px;">Apply to Join the Network</button>
            </div>
            <div style="background: #1e293b; height: 400px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-style: italic; color: #64748b;">
                [Image: Diverse Professional Agents in Modern Workspace]
            </div>
        </section>
    
        <div class="container section-padding">
            <div class="badge-bar">
                <div class="proof-stat"><h4>500+</h4><p>Active Partners</p></div>
                <div class="proof-stat"><h4>$2M+</h4><p>Commissions Paid</p></div>
                <div class="proof-stat"><h4>10K+</h4><p>Businesses Funded</p></div>
            </div>
    
            <div class="success-grid">
                <div>
                    <h2 style="color: var(--green);">✅ What You Need to Succeed</h2>
                    <ul class="check-list">
                        <li>Willingness to learn our proven system</li>
                        <li>Access to a network of business owners</li>
                        <li>Basic tech skills (Email & CRM)</li>
                        <li>Consistency and hustle mentality</li>
                    </ul>
                </div>
                <div>
                    <h2 style="color: #ef4444;">❌ Why People Fail</h2>
                    <ul class="check-list">
                        <li>Expecting results without effort</li>
                        <li>Treating this as a hobby, not a business</li>
                        <li>Not following the training modules</li>
                        <li>Fear of prospecting or relationship building</li>
                    </ul>
                </div>
            </div>
        </div>
    
        <section style="background: #f8fafc;" class="section-padding">
            <div class="container">
                <h2 style="text-align: center; margin-bottom: 50px;">Related Resources</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <a href="#" style="text-decoration: none; color: var(--navy); font-weight: bold; padding: 20px; background: white; border-radius: 8px;">How to Become a Broker in 2026 →</a>
                    <a href="#" style="text-decoration: none; color: var(--navy); font-weight: bold; padding: 20px; background: white; border-radius: 8px;">MLM vs ISO: Which is Best? →</a>
                    <a href="#" style="text-decoration: none; color: var(--navy); font-weight: bold; padding: 20px; background: white; border-radius: 8px;">Top Lead Gen Strategies →</a>
                </div>
            </div>
        </section>
    </body>
    </html>
    ```
    
- Business Loan Affiliate Pillar 2
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            :root {
                --navy: #0A192F;
                --success: #10B981;
                --gold: #F59E0B;
                --slate: #64748B;
                --white: #FFFFFF;
                --light-bg: #F8FAFC;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
            body { background: var(--white); color: var(--navy); line-height: 1.6; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
            header { background: var(--navy); padding: 15px 0; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .nav-flex { display: flex; justify-content: space-between; align-items: center; }
            .logo { color: var(--white); font-weight: 800; font-size: 1.5rem; text-decoration: none; }
            .btn { padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none; transition: 0.3s; display: inline-block; cursor: pointer; border: none; }
            .btn-primary { background: var(--success); color: white; }
            .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
            .hero { background: radial-gradient(circle at top right, #112240, var(--navy)); color: white; padding: 100px 0 160px; position: relative; overflow: hidden; }
            .hero::before { content: ''; position: absolute; inset: 0; background-image: url('data:image/svg+xml,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" /></svg>'); }
            .hero-content { max-width: 800px; position: relative; }
            .hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.1; margin-bottom: 24px; }
            .hero p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 32px; }
            .hero-btns { display: flex; gap: 15px; flex-wrap: wrap; }
            .qualifier-box { background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); padding: 40px; margin-top: -80px; position: relative; z-index: 10; border-top: 5px solid var(--gold); }
            .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 80px 0; }
            .card { padding: 40px; border-radius: 12px; border: 1px solid #E2E8F0; transition: 0.3s; }
            .card:hover { border-color: var(--success); transform: translateY(-5px); }
            .card h3 { color: var(--navy); margin-bottom: 15px; }
            .commission { display: inline-block; background: #ECFDF5; color: var(--success); padding: 4px 12px; border-radius: 20px; font-weight: 700; margin-bottom: 20px; }
            .table-container { overflow-x: auto; margin: 80px 0; }
            table { width: 100%; border-collapse: collapse; text-align: left; }
            th, td { padding: 20px; border-bottom: 1px solid #E2E8F0; }
            th { background: var(--light-bg); }
            .highlight-cell { background: #FFFBEB; border-left: 2px solid var(--gold); }
            @media (max-width: 768px) { .hero { padding: 60px 0 100px; } .hero-btns .btn { width: 100%; text-align: center; } }
        </style>
    </head>
    <body>
        <header>
            <div class="container nav-flex">
                <a href="#" class="logo">MOONSHINE <span style="color:var(--gold)">CAPITAL</span></a>
                <a href="#apply" class="btn btn-primary">Start Earning Today</a>
            </div>
        </header>
    
        <section class="hero">
            <div class="container hero-content">
                <h1>Build Your Own Funding Empire: Earn While You Empower Businesses</h1>
                <p>Join 500+ independent agents earning daily commissions by connecting businesses with fast, flexible funding—no experience required.</p>
                <div class="hero-btns">
                    <a href="#" class="btn btn-primary">Start Earning Today</a>
                    <a href="#" class="btn" style="background: rgba(255,255,255,0.1); color: white;">Watch How It Works</a>
                </div>
                <div style="margin-top: 40px; display: flex; gap: 20px; opacity: 0.8; font-size: 0.9rem;">
                    <span>✓ Zero Upfront Costs</span> | <span>✓ Daily Payouts</span> | <span>✓ Full Training Included</span>
                </div>
            </div>
        </section>
    
        <div class="container">
            <div class="qualifier-box">
                <h2 style="margin-bottom: 30px;">Is This Right for You?</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
                    <div>
                        <h4 style="color: var(--success)">✅ Best For</h4>
                        <p style="font-size: 0.9rem">Entrepreneurs, consultants, MLM veterans, side hustlers.</p>
                    </div>
                    <div>
                        <h4 style="color: var(--gold)">💰 Earning Potential</h4>
                        <p style="font-size: 1.2rem; font-weight: 800;">$500–$5K+ per deal</p>
                        <p style="font-size: 0.8rem; color: var(--slate)">Unlimited deals per month</p>
                    </div>
                    <div>
                        <h4 style="color: var(--navy)">⏱ Time Investment</h4>
                        <p style="font-size: 0.9rem">Part-time (10 hrs/week) or Full-time</p>
                    </div>
                </div>
            </div>
    
            <div class="grid-3">
                <div class="card">
                    <h3>Affiliate Partner</h3>
                    <span class="commission">10–15% Commission</span>
                    <p style="margin-bottom: 20px;">You want passive income with minimal effort. Share referral links, we handle the rest.</p>
                    <a href="#" class="btn btn-primary" style="width: 100%; text-align: center;">Become an Affiliate</a>
                </div>
                <div class="card" style="border-color: var(--gold); background: #FFFDF7;">
                    <h3>Independent Agent (ISO)</h3>
                    <span class="commission">20–40% Commission</span>
                    <p style="margin-bottom: 20px;">You want to build a real business and higher commissions. Source clients and guide apps.</p>
                    <a href="#" class="btn btn-primary" style="width: 100%; text-align: center;">Join as an Agent</a>
                </div>
                <div class="card">
                    <h3>Agency Builder (MLM)</h3>
                    <span class="commission">Overrides + Residuals</span>
                    <p style="margin-bottom: 20px;">Build and train your own funding agency. Earn from your success and your team's success.</p>
                    <a href="#" class="btn btn-primary" style="width: 100%; text-align: center;">Build Your Agency</a>
                </div>
            </div>
    
            <div class="table-container">
                <h2 style="text-align: center; margin-bottom: 40px;">How We Compare</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Traditional Job</th>
                            <th>Other MLMs</th>
                            <th class="highlight-cell">Moonshine Capital</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Income Ceiling</td><td>Capped</td><td>Variable</td><td class="highlight-cell">Unlimited</td></tr>
                        <tr><td>Upfront Costs</td><td>None</td><td>$500 - $2K</td><td class="highlight-cell">$0 (Free)</td></tr>
                        <tr><td>Payout Speed</td><td>Bi-weekly</td><td>Monthly</td><td class="highlight-cell">Daily/Weekly</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    ```
    

# Flash UI Prompts for Moonshine Capital Pillar Pages

Below are custom prompts optimized for Google AI Studio Flash UI to generate niche landing pages for each of your Moonshine Capital pillar pages. Each prompt follows the wireframe structure from your reference materials and includes specific instructions for layout, content blocks, and conversion-focused copy.

---

## 1. Business Loan Affiliate / Partner Programs Pillar

```
Design a high-conversion "Business Loan Affiliate / Partner Hub" landing page for Moonshine Capital, a funding marketplace and network marketing agency.

VISUAL STYLE: Professional, Trust-Building, Opportunity-Driven. Navy Blue primary, Success Green accents, Gold highlights for earnings/commissions. Clean sans-serif typography, generous white space, subtle fintech circuit patterns.

BRAND CONTEXT: Moonshine Capital (distilledfunding.com) specializes in alternative financing with a hybrid MLM/ISO model. We recruit independent agents and train them to build their own funding agencies while offering embedded financing for B2B clients.

LAYOUT STRUCTURE (Mobile-First, Responsive):

HERO SECTION:
- H1 Headline: "Build Your Own Funding Empire: Earn While You Empower Businesses"
- Subheadline: "Join 500+ independent agents earning daily commissions by connecting businesses with fast, flexible funding—no experience required."
- Dual CTA Buttons: "Start Earning Today" (Primary) + "Watch How It Works" (Secondary)
- Trust Badges: "Zero Upfront Costs" | "Daily Payouts" | "Full Training Included"
- Hero Image: Diverse group of confident agents with laptops, modern co-working space aesthetic

AT-A-GLANCE QUALIFIER BOX:
Title: "Is This Right for You?"
- ✅ Best For: Entrepreneurs, consultants, MLM veterans, side hustlers, anyone with a network
- ❌ Not For: People seeking get-rich-quick schemes or unwilling to learn
- 💰 Earning Potential: $500–$5K+ per deal (unlimited deals per month)
- ⏱ Time Investment: Part-time (10 hrs/week) or Full-time
- 📚 Training: Free onboarding + ongoing mentorship

OPTIONS / PARTNERSHIP MODELS (3-Card Grid):
Card 1: "Affiliate Partner"
- When It Fits: You want passive income with minimal effort
- What You Do: Share referral links, we handle the rest
- Commission: 10–15% per funded deal
- CTA: "Become an Affiliate"

Card 2: "Independent Agent (ISO)"
- When It Fits: You want to build a real business and higher commissions
- What You Do: Source clients, guide applications, close deals
- Commission: 20–40% per funded deal + residuals
- CTA: "Join as an Agent"

Card 3: "Agency Builder (MLM)"
- When It Fits: You want to recruit and earn from your team's success
- What You Do: Build and train your own funding agency
- Earnings: Your commissions + 5–10% override on team deals
- CTA: "Build Your Agency"

REQUIREMENTS & DISQUALIFIERS:
Section Title: "What You Need to Succeed"
✅ What Matters Most:
- Willingness to learn (we provide all training)
- Access to a network (online or offline)
- Basic tech skills (email, video calls, CRM)
- Hustle mentality and consistency

❌ Common Reasons People Don't Succeed:
- Expecting instant results without effort
- Not following the proven system
- Unwilling to prospect or build relationships
- Treating it as a hobby instead of a business

COMPARE ALTERNATIVES (Table):
| Feature | Traditional Job | MLM (Other Companies) | Moonshine Capital Partnership |
| Income Ceiling | Capped Salary | Variable, Product-Dependent | Unlimited, Service-Based |
| Upfront Costs | None | $500–$2K Starter Kits | $0 (Free to Join) |
| Training | Minimal | Varies | Comprehensive, Ongoing |
| Payout Speed | Bi-weekly/Monthly | Monthly | Daily/Weekly |
| Residual Income | Rare | Common | Yes (on renewals) |

DECISION TREE SECTION:
Title: "Your Recommended Next Step"
Visual: Flowchart with 3 paths

Path 1: ✅ I'm Ready to Apply Now
- "You're confident and ready to start earning. Let's get you onboarded."
- CTA: "Join the Network" (leads to application form)

Path 2: 🧰 I Need to Prep First
- "You want to learn more or improve your skills. We've got you covered."
- Resources: Free training videos, partner success stories, FAQ
- CTA: "Access Free Training"

Path 3: ☎️ I Want to Talk to Someone
- "You have questions or want personalized guidance. Let's chat."
- CTA: "Book a 15-Min Call" (Calendly embed)

FAQ SECTION (Accordion, 10 Questions):
1. How much can I realistically earn as a partner?
2. Do I need experience in finance or sales?
3. What's the difference between an affiliate and an independent agent?
4. How long does it take to get my first commission?
5. Are there any upfront costs or monthly fees?
6. What kind of training and support do you provide?
7. Can I do this part-time while keeping my job?
8. How do I find clients or generate leads?
9. What if a client I refer gets denied for funding?
10. How does the MLM/agency builder model work?

RELATED GUIDES (Internal Links Hub):
- "How to Become a Business Loan Broker in 2026"
- "MLM vs ISO: Which Partnership Model Is Right for You?"
- "Top 10 Lead Generation Strategies for Funding Brokers"
- "Success Stories: Agents Earning $10K+ Per Month"
- "The Complete Guide to Alternative Financing Products"

FINAL CTA SECTION:
Headline: "Ready to Build Your Funding Empire?"
Subheadline: "Join hundreds of partners who quit their 9-to-5 and now earn on their own terms."
Primary CTA: "Start Your Application"
Secondary CTA: "Download the Partner Guide (PDF)"
Trust Signal: "No credit card required. Zero risk. Join today."

PROOF ELEMENTS:
- Partner testimonials with photos and earnings screenshots
- "500+ Active Partners" | "$2M+ Paid in Commissions" | "10K+ Businesses Funded"
- Logos of affiliate partners (David Allen Capital, ROKFI, 7 Figures Funding, etc.)

DESIGN REQUIREMENTS:
- Fully responsive (mobile-first)
- Smooth scroll animations on section reveals
- Hover effects on cards and CTAs
- Consistent spacing (80px section padding, 32px between elements)
- High-contrast text for accessibility
- Sticky header with CTA button
- Multiple CTAs throughout (above fold, mid-page, bottom)
- Trust signals and social proof integrated naturally

SEO REQUIREMENTS:
- Primary Keyword: "business loan affiliate program"
- Secondary Keywords: "funding broker opportunity", "MLM funding agency", "ISO partnership", "passive income alternative financing"
- Meta Description: "Join Moonshine Capital's affiliate network and earn daily commissions by connecting businesses with fast funding. Free training, zero upfront costs, unlimited earning potential."
- Schema Markup: FAQPage, Organization, Review (for testimonials)

OUTPUT FORMAT: Static HTML + CSS (or Next.js components) ready for deployment to Vercel or Wix.
```

---

## 2. Funding Calculators & Tools Pillar (Lead Magnet Engine)

```
Design an interactive "Funding Calculators & Tools Hub" for Moonshine Capital that serves as a lead generation engine.

VISUAL STYLE: Fintech, Data-Driven, Interactive. Clean white background, Primary Blue (#2563eb), Success Green (#10b981), Chart Orange (#f59e0b). Modern sans-serif (Inter/SF Pro), data visualization aesthetics, subtle grid patterns.

BRAND CONTEXT: Moonshine Capital helps businesses find the right funding fast. This pillar page showcases free calculators and tools that qualify leads while providing immediate value.

LAYOUT STRUCTURE:

HERO SECTION:
- H1: "Free Funding Tools: See What You Qualify For in 60 Seconds"
- Subheadline: "No credit check. No commitment. Just instant insights into your funding options."
- Featured Calculator Widget: Embedded "Funding Eligibility Calculator" (interactive)
- Input Fields: Monthly Revenue, Time in Business, Industry, Credit Score Range
- Output: Estimated Funding Amount + Speed + Product Recommendations
- CTA: "Get Your Full Funding Report" (captures email)

AT-A-GLANCE BOX:
Title: "Why Use Our Tools?"
- ✅ 100% Free, No Hidden Costs
- ✅ Instant Results (No Waiting)
- ✅ No Impact on Credit Score
- ✅ Personalized Recommendations
- ✅ Compare 80+ Lenders at Once

TOOLS GRID (6 Interactive Calculators):

Tool 1: "Funding Eligibility Calculator"
- What It Does: Estimates how much you can qualify for based on revenue and time in business
- Best For: Any business seeking capital
- CTA: "Check My Eligibility"

Tool 2: "Payment Estimator"
- What It Does: Calculates monthly or daily payments for different loan amounts and terms
- Best For: Businesses comparing repayment options
- CTA: "Estimate My Payments"

Tool 3: "Revenue-Based Funding Calculator"
- What It Does: Shows how RBF repayment works based on your sales fluctuations
- Best For: Seasonal businesses, e-commerce, gig workers
- CTA: "Calculate RBF Terms"

Tool 4: "Breakeven Analysis Tool"
- What It Does: Determines how much funding you need to reach profitability
- Best For: Startups, businesses planning expansion
- CTA: "Find My Breakeven"

Tool 5: "Credit Builder Roadmap"
- What It Does: Creates a personalized plan to improve business credit in 90 days
- Best For: Businesses with low/no credit history
- CTA: "Build My Credit Plan"

Tool 6: "ROI Calculator for Business Loans"
- What It Does: Calculates expected return on investment for funded projects
- Best For: Businesses evaluating funding necessity
- CTA: "Calculate My ROI"

HOW IT WORKS (4 Steps):
1. Choose Your Tool: Pick the calculator that matches your question
2. Enter Your Info: Quick inputs (2-3 fields, takes 30 seconds)
3. Get Instant Results: See your numbers immediately
4. Take Action: Apply for funding, download your report, or book a consult

COMPARISON TABLE:
Title: "Which Tool Should You Use?"
| Your Question | Recommended Tool | Time to Complete | Output |
| How much can I get? | Eligibility Calculator | 30 sec | Funding range |
| What will payments be? | Payment Estimator | 45 sec | Payment schedule |
| Should I use RBF? | RBF Calculator | 1 min | Repayment scenarios |
| Do I need funding? | Breakeven Tool | 2 min | Capital gap analysis |
| How do I build credit? | Credit Roadmap | 3 min | 90-day action plan |
| Is this loan worth it? | ROI Calculator | 2 min | Break-even timeline |

REQUIREMENTS SECTION:
Title: "What You Need to Use These Tools"
✅ Basic Business Info:
- Monthly revenue (estimate is fine)
- Time in business
- Industry type
- Credit score range (optional)

❌ What You DON'T Need:
- Tax returns
- Financial statements
- Bank logins
- Social Security number

DECISION TREE:
Title: "What Should You Do Next?"

Path 1: ✅ Apply for Funding Now
- "You know what you need. Let's get you funded."
- CTA: "Start Application"

Path 2: 🧰 Learn More First
- "You want to understand your options better."
- Resources: Funding guides, product comparisons, case studies
- CTA: "Explore Funding Options"

Path 3: ☎️ Talk to a Funding Specialist
- "You have specific questions or a complex situation."
- CTA: "Book a Free Consult"

FAQ SECTION (10 Questions):
1. Are these calculators really free?
2. Will using these tools affect my credit score?
3. How accurate are the funding estimates?
4. What happens after I get my results?
5. Do I have to apply for funding after using a calculator?
6. Can I use these tools if I have bad credit?
7. How do you protect my information?
8. Can I save my results or share them?
9. What if my business is too new to qualify?
10. Do you offer tools for specific industries?

RELATED GUIDES (Internal Links):
- "How Much Funding Does My Business Really Need?"
- "Understanding Your Funding Eligibility: A Complete Guide"
- "Revenue-Based Financing vs. Term Loans: Which Is Right for You?"
- "Building Business Credit from Scratch (90-Day Plan)"
- "The True Cost of Business Loans: APR vs. Factor Rate Explained"

FINAL CTA:
Headline: "Stop Guessing. Start Knowing."
Subheadline: "Use our free tools to get clarity on your funding options in minutes."
Primary CTA: "Try All Tools Free"
Secondary CTA: "Get Personalized Funding Advice"

PROOF ELEMENTS:
- "50K+ Businesses Have Used Our Tools"
- "Average Funding Amount: $75K"
- "4.9/5 Star Rating (1,200+ Reviews)"
- Trust badges: SSL Secure, No Credit Impact, GDPR Compliant

DESIGN REQUIREMENTS:
- Interactive calculator widgets (real-time calculations, no page reload)
- Progress bars and visual feedback for inputs
- Responsive design (tools work seamlessly on mobile)
- Smooth animations on result reveals
- Downloadable PDFs for results
- Email capture integrated naturally (not intrusive)
- Sticky sidebar with "Quick Tools" nav
- High contrast for form fields and CTAs

TECHNICAL REQUIREMENTS:
- Calculator logic: JavaScript or React components
- Lead capture: Form submissions trigger webhook to CRM
- Analytics: Track tool usage, completion rates, conversions
- A/B testing: Test different CTA copy and tool order

SEO REQUIREMENTS:
- Primary Keyword: "business funding calculator"
- Secondary Keywords: "loan payment estimator", "funding eligibility calculator", "revenue-based financing calculator", "business credit builder tool"
- Meta Description: "Use Moonshine Capital's free funding calculators to see what you qualify for in 60 seconds. No credit check, instant results, personalized recommendations."
- Schema Markup: SoftwareApplication, FAQPage, HowTo

OUTPUT FORMAT: Interactive HTML/CSS/JS or React components with API integration for lead capture.
```

---

## 3. Same-Day / Instant Funding Pillar

```
Design an urgent, high-conversion "Same-Day Business Funding" pillar page for Moonshine Capital targeting businesses that need cash immediately.

VISUAL STYLE: High-Urgency, Fast-Paced, Trustworthy. Primary Red-Orange (#ef4444) for urgency, Trust Blue (#3b82f6), Success Green (#22c55e), Dark Gray (#1f2937) text. Bold typography, speed-themed icons (lightning bolts, clocks), countdown aesthetics.

BRAND CONTEXT: Moonshine Capital specializes in alternative financing that moves at the speed of business—not banks. This page targets gig workers, contractors, e-commerce sellers, and any business facing urgent cash needs.

LAYOUT STRUCTURE:

HERO SECTION:
- H1: "Need Cash Today? Get Up to $250K in Your Account by 5 PM"
- Subheadline: "No tax returns. No collateral. No endless paperwork. Just fast money when you need it most."
- Countdown Timer: "Apply in the next [X hours] for same-day funding"
- Primary CTA: "Get Funded Today" (glowing, pulsing button)
- Secondary CTA: "See How Fast It Works" (video modal)
- Trust Badges: "Approved in Minutes" | "Funds in Hours" | "No Hard Credit Pull"
- Hero Visual: Business owner relieved, receiving "APPROVED" notification on phone

AT-A-GLANCE QUALIFIER BOX:
Title: "Can You Get Same-Day Funding?"
- ✅ Best For: Urgent expenses, payroll gaps, inventory restocks, emergency repairs
- ❌ Not For: Startups under 3 months, businesses with $0 monthly revenue
- 💰 Funding Range: $5K–$250K (same-day approval up to $100K)
- ⏱ Speed: Approved in 10 minutes, funded in 2–6 hours
- 📋 Requirements: 3+ months in business, $10K+ monthly revenue, active bank account

OPTIONS / SAME-DAY PRODUCTS (4-Card Grid):

Card 1: "Instant Business Cash Advance"
- Amount: $5K–$100K
- Speed: 2–4 hours
- Best For: Emergency expenses, payroll, materials
- Repayment: Daily percentage of sales
- Approval Rate: 85%
- CTA: "Apply Now"

Card 2: "Same-Day Line of Credit"
- Amount: $10K–$250K
- Speed: 4–6 hours
- Best For: Ongoing cash flow needs
- Repayment: Revolving credit, pay only on drawn funds
- Approval Rate: 70%
- CTA: "Check Eligibility"

Card 3: "Fast Invoice Factoring"
- Amount: Up to 90% of invoice value
- Speed: 1–3 hours
- Best For: B2B businesses waiting on payments
- Repayment: Client pays invoice directly
- Approval Rate: 90%
- CTA: "Factor My Invoices"

Card 4: "Quick Equipment Financing"
- Amount: $10K–$500K
- Speed: 4–6 hours (for pre-approved equipment)
- Best For: Trucks, machinery, tools, tech
- Repayment: Weekly/monthly
- Approval Rate: 75%
- CTA: "Finance Equipment"

REQUIREMENTS & DISQUALIFIERS:
Section Title: "What You Need for Same-Day Approval"

✅ Minimum Requirements:
- 3+ months in business (some options accept newer)
- $10K+ monthly revenue (average)
- Active business bank account
- Basic documentation (bank statements, ID)

❌ Common Denial Reasons:
- Negative daily balances (30+ days)
- Too many recent NSF fees
- Revenue doesn't match stated amount
- Active bankruptcies or liens
- Unverifiable business identity

COMPARISON TABLE:
Title: "Same-Day Funding vs. Traditional Loans"
| Feature | Bank Loan | SBA Loan | Same-Day Funding (Us) |
| Approval Time | 2–6 weeks | 30–90 days | 10 minutes |
| Funding Speed | 1–4 weeks | 6–12 weeks | 2–6 hours |
| Credit Score | 680+ required | 650+ required | 500+ accepted |
| Collateral | Often required | Often required | Not required |
| Tax Returns | Always required | Always required | Not required |
| Approval Rate | 25% | 35% | 80%+ |

DECISION TREE:
Title: "Get Funded in 3 Steps"

Path 1: ✅ Apply Now (Fastest)
- "You need money today and meet minimum requirements."
- Process: 2-min application → instant pre-approval → funding in hours
- CTA: "Start Application"

Path 2: 🧰 Check Eligibility First
- "You're unsure if you qualify and want to check without impacting credit."
- Tool: Soft pull eligibility checker
- CTA: "Check Without Applying"

Path 3: ☎️ Call for Urgent Funding
- "It's after hours or you need help with a complex situation."
- Hotline: "Call [Phone Number] for 24/7 Urgent Funding"
- CTA: "Call Now"

FAQ SECTION (12 Questions):
1. How fast can I really get funded?
2. What's the catch? Is same-day funding a scam?
3. What if I have bad credit?
4. Do you require tax returns or financial statements?
5. How much does same-day funding cost?
6. Can I get same-day funding on weekends?
7. What if I need more than $100K same-day?
8. Will this hurt my credit score?
9. What happens if I can't repay on time?
10. Can startups get same-day funding?
11. What industries do you work with?
12. How is this different from a payday loan?

RELATED GUIDES (Internal Links):
- "The True Cost of Same-Day Business Funding"
- "How to Qualify for Instant Funding with Bad Credit"
- "Bank Statements Only: What Lenders Look For"
- "Revenue-Based Financing Explained (Daily Repayment Guide)"
- "Emergency Business Funding: When Speed Matters Most"

FINAL CTA SECTION:
Headline: "Your Business Can't Wait. Neither Should You."
Subheadline: "Join 10,000+ businesses that got funded the same day they applied."
Primary CTA: "Get Funded Today"
Secondary CTA: "Speak to a Funding Specialist"
Urgency Element: "Only [X] same-day slots left today"

PROOF ELEMENTS:
- Real-time ticker: "John D. in Miami just got approved for $45K"
- Success metrics: "87% approval rate" | "Average funding time: 3.5 hours"
- Testimonial video: Business owner sharing same-day funding story
- Trust seals: BBB Accredited, Norton Secured, TrustPilot 4.8/5

DESIGN REQUIREMENTS:
- Urgent color scheme (reds, oranges) balanced with trust colors (blues)
- Countdown timer (creates urgency but not fake scarcity)
- Real-time application tracker ("Step 1 of 3 Complete")
- Fast-loading page (optimized for mobile)
- Sticky CTA bar on scroll
- Multiple CTAs (every 1.5 screen scrolls)
- Minimal distractions (no exit links in header)

PSYCHOLOGICAL TRIGGERS:
- Urgency: "Get funded today" repeated throughout
- Scarcity: "Limited same-day slots" (must be truthful)
- Social Proof: Live application ticker, testimonials
- Authority: "80+ lender network", BBB rating
- Trust: "No hidden fees", transparent pricing

SEO REQUIREMENTS:
- Primary Keyword: "same day business funding"
- Secondary Keywords: "instant business loan", "fast business cash", "emergency business funding", "business loan no tax returns"
- Meta Description: "Get same-day business funding up to $250K. Approved in 10 minutes, funded in hours. No tax returns, no collateral, bad credit OK. Apply now."
- Schema Markup: FinancialProduct, FAQPage, Review

OUTPUT FORMAT: High-converting HTML/CSS/JS landing page optimized for speed and mobile-first design.
```

---

## 4. Startup Funding (0–24 Months) Pillar

```
Design a realistic, education-focused "Startup Funding Guide" pillar page for Moonshine Capital that sets proper expectations for early-stage businesses.

VISUAL STYLE: Startup-Friendly, Honest, Educational. Primary Purple (#8b5cf6), Growth Green (#10b981), Caution Yellow (#fbbf24), Clean White. Modern, approachable typography, startup aesthetic (think Product Hunt/Indie Hackers), illustrations over stock photos.

BRAND CONTEXT: Most startups get rejected by traditional lenders. This page educates founders on what funding is actually available for 0–24 month businesses and guides them to viable options.

LAYOUT STRUCTURE:

HERO SECTION:
- H1: "Startup Funding That Actually Works (Not the BS You've Been Told)"
- Subheadline: "Banks will reject you. VCs will ghost you. Here's what actually gets funded in your first 2 years."
- CTA Duo: "See What I Qualify For" + "Download Startup Funding Playbook (PDF)"
- Trust Signal: "Real talk for founders: We've helped 2,000+ startups get their first capital"
- Hero Visual: Founder working late, determined expression, laptop glowing

AT-A-GLANCE REALITY CHECK BOX:
Title: "The Startup Funding Truth"
- ✅ Best For: Founders with revenue ($5K+/month), personal credit 600+, or strong business plan
- ❌ Not For: Pre-revenue ideas, founders with bad personal credit and no assets
- 💰 Realistic Range: $5K–$100K (first 6 months), $25K–$250K (6–24 months)
- ⏱ Timeline: 1–4 weeks for most options
- 📚 Reality: You'll likely start with personal credit, bootstrap, then graduate to business funding

STARTUP FUNDING OPTIONS (5-Card Grid):

Card 1: "Personal Credit Stacking"
- What It Is: Using 0% business credit cards strategically
- Who Qualifies: 650+ personal credit, new business
- Amount: $10K–$100K total (across 3–5 cards)
- Pros: Fast, no revenue required, 0% interest for 12–18 months
- Cons: Requires personal guarantee, impacts personal credit
- CTA: "Learn Credit Stacking"

Card 2: "Secured Business Loans"
- What It Is: Loans backed by personal assets (home equity, savings, equipment)
- Who Qualifies: Asset owners, any credit score
- Amount: $10K–$500K
- Pros: High approval rate, lower interest
- Cons: Risk of losing collateral
- CTA: "Explore Secured Loans"

Card 3: "Revenue-Based Financing (6+ Months)"
- What It Is: Funding based on your monthly sales
- Who Qualifies: $10K+/month revenue, 6+ months in business
- Amount: $10K–$250K
- Pros: No collateral, flexible repayment
- Cons: Higher cost, requires consistent revenue
- CTA: "Check RBF Eligibility"

Card 4: "Microloans &amp; Grants"
- What It Is: Small loans ($500–$50K) from nonprofits, CDFIs, local programs
- Who Qualifies: Varies (often underserved founders)
- Amount: $500–$50K
- Pros: Low interest, mission-driven lenders
- Cons: Lengthy application, limited amounts
- CTA: "Find Microloans"

Card 5: "Friends, Family &amp; Crowdfunding"
- What It Is: Raising capital from your network or the public
- Who Qualifies: Anyone with a compelling story
- Amount: $5K–$100K+
- Pros: No credit check, flexible terms
- Cons: Can strain relationships, time-consuming
- CTA: "Crowdfunding Guide"

REQUIREMENTS BY STAGE:
Section Title: "What You Need at Each Stage"

Stage 1: Pre-Revenue (Idea Stage)
- Funding Options: Personal savings, F&amp;F, grants, crowdfunding
- Credit Needed: N/A (no business funding yet)
- Reality: Most startups bootstrap or use personal credit

Stage 2: 0–6 Months (Early Traction)
- Funding Options: Personal credit cards, microloans, secured loans
- Credit Needed: 600+ personal credit
- Revenue: $5K+/month helps but not always required
- Reality: You're proving the concept, not scaling yet

Stage 3: 6–12 Months (Revenue Validation)
- Funding Options: RBF, business lines of credit, invoice factoring
- Credit Needed: 600+ personal or 1+ year business credit history
- Revenue: $10K+/month minimum
- Reality: Now you can access "real" business funding

Stage 4: 12–24 Months (Growth Mode)
- Funding Options: Term loans, SBA microloans, larger RBF deals
- Credit Needed: 640+ personal, established business credit
- Revenue: $20K+/month
- Reality: You're fundable but still not "bankable"

COMPARISON TABLE:
Title: "Startup Funding Options Compared"
| Option | Amount | Speed | Credit | Revenue | Pros | Cons |
| Personal Credit Cards | $10K–$100K | 1 week | 650+ | Not required | 0% APR, fast | Personal risk |
| Secured Loans | $10K–$500K | 2–4 weeks | Any | Not required | High approval | Collateral required |
| RBF (6+ months) | $10K–$250K | 1–2 weeks | 600+ | $10K+/mo | No collateral | Expensive |
| Microloans | $500–$50K | 4–8 weeks | 580+ | Varies | Low rates | Slow, small |
| Bank Loan (18+ mo) | $50K–$500K | 4–8 weeks | 680+ | $50K+/mo | Best rates | Hard to qualify |

DECISION TREE:
Title: "Your Startup Funding Roadmap"

Path 1: ✅ I Have Revenue ($10K+/Month)
- "You have traction. Let's get you growth capital."
- Recommended: RBF, business line of credit, invoice factoring
- CTA: "Apply for Growth Funding"

Path 2: 🧰 I'm Pre-Revenue or Under $10K/Month
- "You're in build mode. Let's fund this smartly without debt."
- Recommended: Personal credit stacking, microloans, crowdfunding
- CTA: "Explore Bootstrap Strategies"

Path 3: ☎️ I Have Assets but No Revenue
- "You can secure funding with collateral while you build revenue."
- Recommended: Secured loans, home equity line
- CTA: "Talk to a Secured Loan Specialist"

FAQ SECTION (12 Questions):
1. Can I get a business loan with no revenue?
2. Will startup funding require a personal guarantee?
3. How much can I borrow in my first year?
4. What credit score do I need for startup funding?
5. Are there grants for startups?
6. Should I use personal credit cards for my startup?
7. What's the difference between a microloan and a business loan?
8. How do I build business credit as a startup?
9. Can I get funding if I have bad personal credit?
10. What do lenders look for in a startup business plan?
11. How long does it take to get approved?
12. What if I get denied for funding?

RELATED GUIDES (Internal Links):
- "The Complete Guide to Credit Stacking for Startups"
- "How to Build Business Credit from Day One"
- "Startup Funding Mistakes That Kill Businesses"
- "Bank Statements Only Loans: What Startups Need to Know"
- "Revenue-Based Financing for E-Commerce Startups"

FINAL CTA SECTION:
Headline: "Stop Waiting for the Perfect Investor. Fund Your Vision Now."
Subheadline: "2,000+ founders trusted us to get their first capital. You're next."
Primary CTA: "Get Funded as a Startup"
Secondary CTA: "Download Free Startup Funding Guide"

PROOF ELEMENTS:
- Founder testimonials: "I got $50K in my first 6 months using credit stacking"
- Success metrics: "Average first funding: $35K" | "75% of startups get approved"
- Case studies: "How Sarah went from $0 to $100K in funding in 90 days"

DESIGN REQUIREMENTS:
- Honest, no-BS tone throughout
- Educational focus (not just selling)
- Clear stage-based guidance
- Visual roadmap or flowchart
- Mobile-optimized (founders are on-the-go)
- Downloadable resources (PDFs, checklists)

EDUCATIONAL CONTENT:
- Realistic expectations vs. myths
- Warning about predatory lenders
- Credit stacking walkthrough
- Business credit building timeline

SEO REQUIREMENTS:
- Primary Keyword: "startup business funding"
- Secondary Keywords: "business loans for new businesses", "startup funding no revenue", "business credit for startups", "0% business credit cards"
- Meta Description: "Realistic startup funding guide for 0–24 month businesses. Learn what actually works: credit stacking, RBF, microloans, and more. No BS, just real options."
- Schema Markup: HowTo, FAQPage, Article

OUTPUT FORMAT: Educational pillar page with interactive elements and downloadable resources.
```

---

## 5. Acquisition Financing / Buying a Business Pillar (ETA)

```
Design a sophisticated "Business Acquisition Financing" pillar page for Moonshine Capital targeting aspiring entrepreneurs who want to buy existing businesses (Entrepreneurship Through Acquisition).

VISUAL STYLE: Executive, Strategic, Premium. Deep Navy (#1e3a8a), Gold Accents (#f59e0b), Success Green (#059669), Professional Gray (#475569). Elegant serif headings, sans-serif body, upscale business aesthetic.

BRAND CONTEXT: Moonshine Capital specializes in acquisition financing for ETA (Entrepreneurship Through Acquisition). This page educates searchers and buyers on how to finance business purchases without huge down payments.

LAYOUT STRUCTURE:

HERO SECTION:
- H1: "Buy Your Dream Business Without Draining Your Bank Account"
- Subheadline: "Acquisition financing for entrepreneurs ready to skip the startup grind and buy proven cash flow."
- CTA Duo: "Get Pre-Qualified for Acquisition Financing" + "Download Deal Financing Guide"
- Trust Signal: "$150M+ in Acquisition Deals Funded"
- Hero Visual: Professional examining business documents, laptop with financial models, confident expression

AT-A-GLANCE QUALIFIER BOX:
Title: "Is Acquisition Financing Right for You?"
- ✅ Best For: Buyers with 10–20% down payment, buying businesses $100K–$10M, strong personal credit (680+)
- ❌ Not For: Buyers with no capital, buying distressed businesses, no industry experience
- 💰 Typical Structure: 10–20% down, seller financing 10–30%, lender financing 60–80%
- ⏱ Timeline: 30–90 days from LOI to close
- 📋 Requirements: Business plan, personal financials, target business due diligence

ACQUISITION FINANCING OPTIONS (4-Card Grid):

Card 1: "SBA 7(a) Change of Ownership Loan"
- Amount: Up to $5M (90% financing)
- Down Payment: 10% (can include seller note)
- Terms: 10–25 years, low fixed rates (7–9%)
- Best For: Main Street businesses ($500K–$5M purchase price)
- Approval Time: 45–90 days
- CTA: "Learn About SBA 7(a)"

Card 2: "Conventional Business Acquisition Loan"
- Amount: $100K–$10M+
- Down Payment: 20–30%
- Terms: 5–15 years, variable rates (8–12%)
- Best For: Larger acquisitions, strong financials
- Approval Time: 30–60 days
- CTA: "Explore Conventional Loans"

Card 3: "Seller Financing (Note)"
- Amount: 10–50% of purchase price
- Down Payment: Built into deal structure
- Terms: Negotiable (typically 3–7 years)
- Best For: Every deal (reduces cash needed)
- Approval Time: Negotiation-dependent
- CTA: "Seller Note Strategies"

Card 4: "Asset-Based Lending (ABL)"
- Amount: Based on business assets (inventory, equipment, AR)
- Down Payment: 10–20%
- Terms: Flexible, typically 3–7 years
- Best For: Asset-heavy businesses (manufacturing, distribution)
- Approval Time: 20–45 days
- CTA: "ABL Acquisition Financing"

REQUIREMENTS BY DEAL SIZE:
Section Title: "Financing Requirements by Business Size"

Small Business ($100K–$500K):
- Down Payment: 10–20% ($10K–$100K)
- Credit Score: 650+ personal
- Lender Options: SBA microloan, seller financing, personal loan
- Reality: Often 50%+ seller financed

Main Street ($500K–$2M):
- Down Payment: 10–15% ($50K–$300K)
- Credit Score: 680+ personal
- Lender Options: SBA 7(a), conventional acquisition loan
- Reality: SBA is king in this range

Lower Middle Market ($2M–$10M):
- Down Payment: 15–25% ($300K–$2.5M)
- Credit Score: 700+ personal, strong business plan
- Lender Options: Conventional, SBA, mezzanine debt
- Reality: Requires experienced buyer or operating partner

COMPARISON TABLE:
Title: "Acquisition Financing Methods Compared"
| Method | Down Payment | Interest Rate | Approval Time | Best For |
| SBA 7(a) | 10% | 7–9% fixed | 45–90 days | Main Street businesses |
| Conventional | 20–30% | 8–12% variable | 30–60 days | Larger deals, strong buyers |
| Seller Note | 0% (built in) | Negotiable | N/A | Every deal (reduces cash) |
| Asset-Based | 10–20% | 9–14% | 20–45 days | Asset-heavy businesses |
| Home Equity | Varies | 5–8% | 2–4 weeks | Small deals, bootstrap |

DECISION TREE:
Title: "Your Acquisition Financing Path"

Path 1: ✅ I Have 10–20% Down &amp; Strong Credit (680+)
- "You're ready to buy. Let's structure your deal."
- Recommended: SBA 7(a) + seller note
- CTA: "Get Pre-Qualified"

Path 2: 🧰 I Have Less Than 10% Down
- "You need creative financing or a smaller target."
- Recommended: Seller financing heavy deals, co-buyer, or smaller business
- CTA: "Explore Low Down Payment Strategies"

Path 3: ☎️ I Found My Business but Need Financing Advice
- "Let's structure the optimal financing for your specific deal."
- CTA: "Book Acquisition Financing Consult"

FAQ SECTION (12 Questions):
1. How much down payment do I need to buy a business?
2. Can I use SBA loans to buy a business?
3. What is seller financing and how does it work?
4. How do I qualify for acquisition financing?
5. Can I buy a business with bad credit?
6. What's the difference between buying assets vs. stock?
7. How long does acquisition financing take?
8. Can I buy a business in a different industry?
9. What if the business isn't profitable yet?
10. Do I need to put up personal collateral?
11. Can I finance a franchise purchase?
12. What happens if the deal falls through?

RELATED GUIDES (Internal Links):
- "The Complete Guide to SBA 7(a) Loans for Business Acquisition"
- "How to Structure a Business Acquisition Deal (Buyer's Guide)"
- "Seller Financing: How to Negotiate a Win-Win Note"
- "Buying a Business with No Money: Myth or Reality?"
- "Due Diligence Checklist for Business Buyers"
- "ETA (Entrepreneurship Through Acquisition) Explained"

FINAL CTA SECTION:
Headline: "Ready to Become a Business Owner?"
Subheadline: "We've financed 500+ business acquisitions. Let's make yours next."
Primary CTA: "Get Pre-Qualified for Acquisition Financing"
Secondary CTA: "Download Deal Financing Calculator"
Trust Signal: "No obligation. Confidential consultation."

PROOF ELEMENTS:
- Buyer testimonials: "I bought a $2M business with only $200K down"
- Deal case studies: "How John acquired a $1.5M HVAC company using SBA 7(a)"
- Success metrics: "$150M+ funded" | "Average deal size: $1.2M" | "85% close rate"

DESIGN REQUIREMENTS:
- Professional, executive aesthetic (not salesy)
- Educational focus (guide the buyer)
- Deal structure visualizations (charts, diagrams)
- Downloadable resources (checklists, calculators)
- Mobile-optimized but desktop-focused (buyers research on computers)

EDUCATIONAL CONTENT:
- SBA 7(a) walkthrough (requirements, process, timeline)
- Seller note negotiation tactics
- Deal structure examples (70/20/10 splits, etc.)
- Common acquisition financing mistakes

TRUST SIGNALS:
- "Certified SBA Preferred Lender Partner"
- "500+ Successful Acquisitions"
- BBB A+ Rating
- Testimonials from business buyers

SEO REQUIREMENTS:
- Primary Keyword: "business acquisition financing"
- Secondary Keywords: "SBA loan to buy a business", "seller financing business purchase", "how to finance a business acquisition", "buying a business loan"
- Meta Description: "Finance your business acquisition with 10–20% down. SBA 7(a) loans, seller financing, and creative deal structures. Get pre-qualified in 48 hours."
- Schema Markup: FinancialProduct, FAQPage, HowTo, Article

OUTPUT FORMAT: Premium pillar page with deal calculators, downloadable guides, and consultation booking.
```

---

## General Implementation Notes

For all prompts above, ensure you provide these additional contexts when using Flash UI:

- **Brand Voice:** Moonshine Capital speaks plainly, avoids corporate jargon, and treats readers like smart people who've been lied to by banks. Tone is confident, helpful, and slightly rebellious.
- **Color Palette:** Navy Blue (#1e40af), Success Green (#10b981), Warning Orange (#f59e0b), Trust Blue (#3b82f6), Clean White (#ffffff), Dark Text (#1f2937)
- **CTAs to Use:** "Get Funded Now", "Check Eligibility", "Book Free Consult", "Download Guide", "Apply in 2 Minutes", "Talk to a Specialist"
- **Trust Signals:** Always include social proof (testimonials, metrics, logos), security badges (SSL, BBB, Norton), and guarantees (no hidden fees, no hard credit pull)
- **Mobile-First:** Every page must be fully responsive and optimized for mobile (60%+ of traffic)
- **Conversion Optimization:** Multiple CTAs (above fold, mid-page, bottom), minimal exit links, sticky header with CTA button, chatbot for immediate questions
- **SEO Best Practices:** Include schema markup (FAQ, HowTo, FinancialProduct), internal linking strategy, meta descriptions under 155 characters, primary keyword in H1 and URL

Deploy these pages to Vercel or Wix following the architecture outlined in your reference materials. Each pillar should link to 10–15 supporting blog posts and receive links back from those posts to establish topical authority.

- Startup Funding Pillar 1
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .pill { border-radius: 99px; padding: 4px 12px; font-size: 0.75rem; font-weight: bold; }
            .bg-purple { background-color: #8b5cf6; }
            .border-purple { border-color: #8b5cf6; }
        </style>
    </head>
    <body class="bg-white">
        <section class="max-w-7xl mx-auto px-6 py-20">
            <div class="grid lg:grid-cols-12 gap-12 items-center">
                <div class="lg:col-span-7">
                    <h1 class="text-7xl font-bold tracking-tight mb-8">The Founder's Guide to <span class="text-purple-600">Real Capital.</span></h1>
                    <p class="text-2xl text-gray-500 mb-8">We cut through the noise to show you exactly how to fund a 0-24 month startup when the banks say no.</p>
                    <div class="flex gap-4">
                        <button class="bg-purple text-white px-8 py-4 rounded-xl font-bold">Get Funded</button>
                        <button class="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold">Playbook (PDF)</button>
                    </div>
                </div>
                <div class="lg:col-span-5 border-4 border-black p-8 rounded-3xl">
                    <h3 class="font-bold text-xl mb-6 flex items-center gap-2"><span class="w-3 h-3 bg-red-500 rounded-full"></span> Live Reality Check</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between py-2 border-b font-medium"><span>Typical Score Needed</span> <span>600+</span></div>
                        <div class="flex justify-between py-2 border-b font-medium"><span>Approval Rate</span> <span class="text-emerald-500">75%</span></div>
                        <div class="flex justify-between py-2 border-b font-medium"><span>Funding Time</span> <span>1-4 Weeks</span></div>
                        <div class="flex justify-between py-2 border-b font-medium"><span>Average First Round</span> <span>$35,000</span></div>
                    </div>
                </div>
            </div>
        </section>
    
        <section class="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
            <h2 class="text-3xl font-bold mb-10">Startup Funding Options Compared</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b-2 border-slate-200">
                            <th class="pb-4 font-bold">Option</th>
                            <th class="pb-4 font-bold">Amount</th>
                            <th class="pb-4 font-bold">Speed</th>
                            <th class="pb-4 font-bold">Credit</th>
                            <th class="pb-4 font-bold">Pros</th>
                            <th class="pb-4 font-bold">Cons</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <tr class="hover:bg-white transition">
                            <td class="py-6 font-bold text-purple-600">Personal Credit Stacking</td>
                            <td class="py-6">$10K–$100K</td>
                            <td class="py-6">1 Week</td>
                            <td class="py-6 text-xs bg-purple-50 rounded text-center">650+</td>
                            <td class="py-6">0% APR, Fast</td>
                            <td class="py-6 text-red-500">Personal Risk</td>
                        </tr>
                        <tr class="hover:bg-white transition">
                            <td class="py-6 font-bold text-purple-600">Secured Loans</td>
                            <td class="py-6">$10K–$500K</td>
                            <td class="py-6">2-4 Weeks</td>
                            <td class="py-6 text-xs bg-slate-200 rounded text-center">Any</td>
                            <td class="py-6">High Approval</td>
                            <td class="py-6 text-red-500">Collateral</td>
                        </tr>
                        <tr class="hover:bg-white transition">
                            <td class="py-6 font-bold text-purple-600">RBF (6+ mo)</td>
                            <td class="py-6">$10K–$250K</td>
                            <td class="py-6">1-2 Weeks</td>
                            <td class="py-6 text-xs bg-slate-200 rounded text-center">600+</td>
                            <td class="py-6">No Collateral</td>
                            <td class="py-6 text-red-500">Expensive</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    
        <section class="max-w-3xl mx-auto px-6 py-20">
            <h2 class="text-3xl font-bold mb-10">Common Questions</h2>
            <div class="space-y-6">
                <details class="group border-b pb-4 cursor-pointer">
                    <summary class="font-bold flex justify-between items-center">Can I get a business loan with no revenue? <span class="text-purple-600">+</span></summary>
                    <p class="mt-4 text-gray-600">Yes, via personal credit stacking or secured loans. Traditional business loans usually require revenue, but these early-stage alternatives focus on personal creditworthiness or assets.</p>
                </details>
                <details class="group border-b pb-4 cursor-pointer">
                    <summary class="font-bold flex justify-between items-center">Will startup funding require a personal guarantee? <span class="text-purple-600">+</span></summary>
                    <p class="mt-4 text-gray-600">Almost certainly. In the first 2 years, lenders look to the founder to back the loan since the business doesn't have enough history.</p>
                </details>
            </div>
        </section>
    
        <div class="bg-[#8b5cf6] py-10">
            <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-white">
                <div class="text-2xl font-bold mb-4 md:mb-0">Fund your vision today.</div>
                <button class="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold shadow-lg">Apply Now</button>
            </div>
        </div>
    </body>
    </html>
    ```
    
- Startup Funding Pillar 2
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Inter', sans-serif; background-color: #f9fafb; color: #1f2937; }
            .bg-purple-main { background-color: #8b5cf6; }
            .text-purple-main { color: #8b5cf6; }
            .bg-growth-green { background-color: #10b981; }
            .bg-caution-yellow { background-color: #fbbf24; }
            .card-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
            .stage-card:hover { transform: translateY(-4px); transition: all 0.3s ease; }
        </style>
    </head>
    <body>
        <header class="bg-white border-b py-4">
            <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div class="font-extrabold text-2xl tracking-tight">MOONSHINE <span class="text-purple-main">CAPITAL</span></div>
                <nav class="space-x-8 text-sm font-medium text-gray-600">
                    <a href="#" class="hover:text-purple-600">Guides</a>
                    <a href="#" class="hover:text-purple-600">Success Stories</a>
                    <a href="#" class="bg-purple-main text-white px-4 py-2 rounded-lg">Get Funded</a>
                </nav>
            </div>
        </header>
    
        <section class="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
            <div class="md:w-1/2">
                <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Real Talk for Founders</span>
                <h1 class="text-5xl font-extrabold mt-4 leading-tight">Startup Funding That Actually Works <span class="text-purple-main">(Not the BS You've Been Told)</span></h1>
                <p class="text-xl text-gray-600 mt-6">Banks will reject you. VCs will ghost you. Here's what actually gets funded in your first 2 years.</p>
                <div class="flex gap-4 mt-8">
                    <button class="bg-growth-green text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition">See What I Qualify For</button>
                    <button class="border-2 border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition">Download Playbook (PDF)</button>
                </div>
                <div class="mt-8 flex items-center gap-3 text-sm text-gray-500 italic">
                    <span class="flex -space-x-2">
                        <div class="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                        <div class="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                        <div class="w-8 h-8 rounded-full bg-gray-500 border-2 border-white"></div>
                    </span>
                    We've helped 2,000+ startups get their first capital
                </div>
            </div>
            <div class="md:w-1/2 relative">
                <div class="w-full aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div class="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent"></div>
                    <div class="absolute bottom-8 left-8 text-white z-10">
                        <div class="text-2xl font-bold">$35,000</div>
                        <div class="text-sm opacity-80">Average First Funding</div>
                    </div>
                    <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover" alt="Founder working late">
                </div>
            </div>
        </section>
    
        <section class="max-w-4xl mx-auto px-6 mb-20">
            <div class="bg-white border-2 border-black rounded-2xl p-8 card-shadow">
                <div class="flex items-center gap-2 mb-6">
                    <div class="w-4 h-4 rounded-full bg-caution-yellow"></div>
                    <h2 class="text-2xl font-bold uppercase tracking-tight">The Startup Funding Truth</h2>
                </div>
                <div class="grid md:grid-cols-2 gap-8">
                    <ul class="space-y-3">
                        <li class="flex items-start gap-2">✅ <span class="font-medium">Best For:</span> Founders with revenue ($5K+), 600+ Credit, or Strong Plan</li>
                        <li class="flex items-start gap-2">❌ <span class="font-medium">Not For:</span> Pre-revenue ideas with bad credit and no assets</li>
                        <li class="flex items-start gap-2">⏱ <span class="font-medium">Timeline:</span> 1–4 weeks for most options</li>
                    </ul>
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p class="text-sm italic text-gray-600">"You'll likely start with personal credit, bootstrap, then graduate to business funding."</p>
                        <div class="mt-4 font-bold text-purple-main">$5K – $250K Realistic Range</div>
                    </div>
                </div>
            </div>
        </section>
    
        <section class="max-w-7xl mx-auto px-6 py-12">
            <h3 class="text-3xl font-bold mb-8">Funding Options for 0–24 Months</h3>
            <div class="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                <!-- Card 1 -->
                <div class="bg-white border rounded-2xl p-6 flex flex-col h-full">
                    <div class="text-sm font-bold text-purple-main mb-2">Personal Credit Stacking</div>
                    <p class="text-xs text-gray-500 flex-grow mb-4">Using 0% business credit cards strategically.</p>
                    <div class="text-sm mb-4"><strong>Quals:</strong> 650+ Credit</div>
                    <div class="text-lg font-bold mb-4">$10K–$100K</div>
                    <button class="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">Learn More</button>
                </div>
                <!-- Card 2 -->
                <div class="bg-white border rounded-2xl p-6 flex flex-col h-full">
                    <div class="text-sm font-bold text-purple-main mb-2">Secured Loans</div>
                    <p class="text-xs text-gray-500 flex-grow mb-4">Loans backed by personal assets (home, equipment).</p>
                    <div class="text-sm mb-4"><strong>Quals:</strong> Asset Owner</div>
                    <div class="text-lg font-bold mb-4">$10K–$500K</div>
                    <button class="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">Explore</button>
                </div>
                <!-- Repeat for others -->
                <div class="bg-white border rounded-2xl p-6 flex flex-col h-full">
                    <div class="text-sm font-bold text-purple-main mb-2">Revenue Financing</div>
                    <p class="text-xs text-gray-500 flex-grow mb-4">Based on your monthly sales performance.</p>
                    <div class="text-sm mb-4"><strong>Quals:</strong> $10K/mo Rev</div>
                    <div class="text-lg font-bold mb-4">$10K–$250K</div>
                    <button class="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">Check RBF</button>
                </div>
                <div class="bg-white border rounded-2xl p-6 flex flex-col h-full">
                    <div class="text-sm font-bold text-purple-main mb-2">Microloans & Grants</div>
                    <p class="text-xs text-gray-500 flex-grow mb-4">Small loans from nonprofits and local programs.</p>
                    <div class="text-sm mb-4"><strong>Quals:</strong> Varies</div>
                    <div class="text-lg font-bold mb-4">$500–$50K</div>
                    <button class="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">Find Now</button>
                </div>
                <div class="bg-white border rounded-2xl p-6 flex flex-col h-full">
                    <div class="text-sm font-bold text-purple-main mb-2">Family & Crowd</div>
                    <p class="text-xs text-gray-500 flex-grow mb-4">Raising from network or the public.</p>
                    <div class="text-sm mb-4"><strong>Quals:</strong> Great Story</div>
                    <div class="text-lg font-bold mb-4">$5K–$100K+</div>
                    <button class="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">View Guide</button>
                </div>
            </div>
        </section>
    
        <section class="bg-gray-900 text-white py-20 mt-20">
            <div class="max-w-7xl mx-auto px-6 text-center">
                <h2 class="text-4xl font-extrabold mb-4">Stop Waiting for the Perfect Investor.</h2>
                <p class="text-xl text-gray-400 mb-8">2,000+ founders trusted us to get their first capital. You're next.</p>
                <div class="flex flex-col md:flex-row justify-center gap-4">
                    <button class="bg-growth-green px-10 py-4 rounded-xl font-bold text-lg">Get Funded as a Startup</button>
                    <button class="border border-gray-700 px-10 py-4 rounded-xl font-bold text-lg">Download Free Guide</button>
                </div>
            </div>
        </section>
    </body>
    </html>
    ```
    
- Startup Funding Pillar 3
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            :root {
                --primary: #8b5cf6; --success: #10b981; --warn: #fbbf24;
            }
            .bg-gradient-primary { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); }
            .timeline-line { width: 2px; background: #e5e7eb; position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); }
        </style>
    </head>
    <body class="bg-white font-sans text-slate-900">
        <section class="relative bg-slate-50 overflow-hidden pt-20 pb-32">
            <div class="max-w-6xl mx-auto px-6 text-center relative z-10">
                <h1 class="text-6xl font-black text-slate-950 mb-6 italic tracking-tighter">REAL STARTUP FUNDING.</h1>
                <p class="text-2xl text-slate-600 max-w-2xl mx-auto mb-10">We're tired of seeing founders get rejected by banks. Here's what actually gets funded in the first 24 months.</p>
                <div class="flex justify-center gap-6">
                    <a href="#" class="bg-[#8b5cf6] text-white px-8 py-5 rounded-2xl font-bold shadow-xl shadow-purple-200 hover:scale-105 transition">See My Options</a>
                    <a href="#" class="bg-white border-2 border-slate-200 px-8 py-5 rounded-2xl font-bold">Get the Playbook</a>
                </div>
            </div>
        </section>
    
        <section class="py-24 max-w-5xl mx-auto px-6">
            <h2 class="text-3xl font-bold text-center mb-16 underline decoration-[#fbbf24] decoration-4 underline-offset-8">What You Need at Each Stage</h2>
            <div class="relative">
                <div class="timeline-line hidden md:block"></div>
                <div class="space-y-12">
                    <!-- Stage 1 -->
                    <div class="flex flex-col md:flex-row items-center gap-8 relative">
                        <div class="md:w-1/2 md:text-right">
                            <h3 class="text-xl font-extrabold text-purple-600">Stage 1: Pre-Revenue</h3>
                            <p class="text-slate-500">Most startups bootstrap or use personal credit here.</p>
                        </div>
                        <div class="w-8 h-8 rounded-full bg-purple-500 z-10 hidden md:block border-4 border-white shadow"></div>
                        <div class="md:w-1/2 bg-slate-50 p-6 rounded-2xl">
                            <div class="font-bold mb-2">Options:</div>
                            <p class="text-sm">Savings, F&F, Crowdfunding, Grants.</p>
                        </div>
                    </div>
                    <!-- Stage 2 -->
                    <div class="flex flex-col md:flex-row-reverse items-center gap-8 relative">
                        <div class="md:w-1/2 md:text-left">
                            <h3 class="text-xl font-extrabold text-purple-600">Stage 2: 0–6 Months</h3>
                            <p class="text-slate-500">Proving the concept, not scaling yet.</p>
                        </div>
                        <div class="w-8 h-8 rounded-full bg-purple-500 z-10 hidden md:block border-4 border-white shadow"></div>
                        <div class="md:w-1/2 bg-slate-50 p-6 rounded-2xl">
                            <div class="font-bold mb-2">Options:</div>
                            <p class="text-sm">Credit Cards, Microloans, Secured Loans.</p>
                        </div>
                    </div>
                    <!-- Stage 3 -->
                    <div class="flex flex-col md:flex-row items-center gap-8 relative">
                        <div class="md:w-1/2 md:text-right">
                            <h3 class="text-xl font-extrabold text-purple-600">Stage 3: 6–12 Months</h3>
                            <p class="text-slate-500">Revenue validation: Now you can access "real" business funding.</p>
                        </div>
                        <div class="w-8 h-8 rounded-full bg-purple-500 z-10 hidden md:block border-4 border-white shadow"></div>
                        <div class="md:w-1/2 bg-slate-50 p-6 rounded-2xl">
                            <div class="font-bold mb-2">Options:</div>
                            <p class="text-sm">RBF, Lines of Credit, Factoring.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    
        <section class="bg-slate-50 py-24">
            <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-center text-3xl font-bold mb-12">Decision Tree: Your Roadmap</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white p-10 rounded-3xl border-2 border-slate-100 text-center hover:border-purple-500 transition">
                        <div class="text-4xl mb-4">✅</div>
                        <div class="font-black text-xl mb-4">I Have Revenue ($10K+)</div>
                        <p class="text-slate-500 text-sm mb-6">You have traction. Recommended: RBF or Lines of Credit.</p>
                        <button class="text-[#10b981] font-bold">Apply for Growth Capital &rarr;</button>
                    </div>
                    <div class="bg-white p-10 rounded-3xl border-2 border-slate-100 text-center hover:border-purple-500 transition">
                        <div class="text-4xl mb-4">🧰</div>
                        <div class="font-black text-xl mb-4">Pre-Revenue / Low Rev</div>
                        <p class="text-slate-500 text-sm mb-6">Let's fund this smartly without predatory debt.</p>
                        <button class="text-[#10b981] font-bold">Explore Bootstrap Strategies &rarr;</button>
                    </div>
                    <div class="bg-white p-10 rounded-3xl border-2 border-slate-100 text-center hover:border-purple-500 transition">
                        <div class="text-4xl mb-4">☎️</div>
                        <div class="font-black text-xl mb-4">I Have Assets</div>
                        <p class="text-slate-500 text-sm mb-6">Secure funding with collateral while you build revenue.</p>
                        <button class="text-[#10b981] font-bold">Talk to a Specialist &rarr;</button>
                    </div>
                </div>
            </div>
        </section>
    
        <footer class="bg-white py-12 border-t">
            <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between">
                <div class="font-bold mb-6">Moonshine Capital</div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div class="flex flex-col space-y-2">
                        <div class="font-bold text-sm mb-2">Education</div>
                        <a href="#" class="text-sm text-slate-500">Credit Stacking Guide</a>
                        <a href="#" class="text-sm text-slate-500">Build Business Credit</a>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <div class="font-bold text-sm mb-2">Funding</div>
                        <a href="#" class="text-sm text-slate-500">Microloans</a>
                        <a href="#" class="text-sm text-slate-500">RBF Loans</a>
                    </div>
                </div>
            </div>
        </footer>
    </body>
    </html>
    ```
    
- Startup Funding Pillar 4 (Neo-Brutalist)
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Space Grotesk', sans-serif; }
            .brutalist-card { border: 4px solid #000; box-shadow: 8px 8px 0px 0px #000; transition: all 0.2s; }
            .brutalist-card:hover { transform: translate(-2px, -2px); box-shadow: 12px 12px 0px 0px #000; }
            .brutalist-btn { border: 3px solid #000; box-shadow: 4px 4px 0px 0px #000; }
            .brutalist-btn:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px 0px #000; }
        </style>
    </head>
    <body class="bg-[#f1f1f1] text-black">
        <section class="pt-20 pb-32 border-b-4 border-black bg-yellow-400">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <h1 class="text-7xl font-black mb-6 uppercase tracking-tight">REAL STARTUP FUNDING.</h1>
                <p class="text-2xl font-bold max-w-2xl mx-auto mb-10 border-2 border-black bg-white p-4">We're tired of seeing founders get rejected by banks. Here's what actually gets funded.</p>
                <div class="flex justify-center gap-6">
                    <a href="#" class="brutalist-btn bg-black text-white px-8 py-5 font-black uppercase text-lg">See My Options</a>
                    <a href="#" class="brutalist-btn bg-white text-black px-8 py-5 font-black uppercase text-lg">Get the Playbook</a>
                </div>
            </div>
        </section>
    
        <section class="py-24 max-w-5xl mx-auto px-6">
            <h2 class="text-4xl font-black uppercase mb-16 inline-block bg-white border-4 border-black px-4 py-2">What You Need at Each Stage</h2>
            <div class="space-y-12">
                <div class="brutalist-card bg-purple-400 p-8 flex flex-col md:flex-row gap-8 items-center">
                    <div class="md:w-1/2"><h3 class="text-2xl font-black uppercase">Stage 1: Pre-Revenue</h3><p class="font-bold">Bootstrapping and personal credit domain.</p></div>
                    <div class="md:w-1/2 bg-white border-2 border-black p-4 font-bold">Savings, F&F, Crowdfunding, Grants.</div>
                </div>
                <div class="brutalist-card bg-cyan-400 p-8 flex flex-col md:flex-row gap-8 items-center">
                    <div class="md:w-1/2"><h3 class="text-2xl font-black uppercase">Stage 2: 0–6 Months</h3><p class="font-bold">Proving the concept, not scaling yet.</p></div>
                    <div class="md:w-1/2 bg-white border-2 border-black p-4 font-bold">Credit Cards, Microloans, Secured Loans.</div>
                </div>
            </div>
        </section>
    
        <section class="bg-white border-t-4 border-black py-24">
            <div class="max-w-6xl mx-auto px-6">
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="brutalist-card bg-green-400 p-10 text-center">
                        <div class="text-6xl mb-4">✅</div>
                        <div class="font-black text-2xl mb-4 uppercase">I Have Revenue</div>
                        <button class="font-black underline uppercase">Apply Now &rarr;</button>
                    </div>
                    <div class="brutalist-card bg-orange-400 p-10 text-center">
                        <div class="text-6xl mb-4">🧰</div>
                        <div class="font-black text-2xl mb-4 uppercase">Pre-Revenue</div>
                        <button class="font-black underline uppercase">Strategies &rarr;</button>
                    </div>
                    <div class="brutalist-card bg-blue-400 p-10 text-center">
                        <div class="text-6xl mb-4">☎️</div>
                        <div class="font-black text-2xl mb-4 uppercase">I Have Assets</div>
                        <button class="font-black underline uppercase">Talk To Us &rarr;</button>
                    </div>
                </div>
            </div>
        </section>
    </body>
    </html>
    ```
    

[go.distilledfunding.com](http://go.distilledfunding.com/) = funnels

[tools.distilledfunding.com](http://tools.distilledfunding.com/) = tool directory + embed pages

[partners.distilledfunding.com](http://partners.distilledfunding.com/) = partner portal / onboarding