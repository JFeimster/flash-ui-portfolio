import React from 'react';

export default function IntelligenceReport({ params }: { params: { slug: string } }) {
  // Mock data for the intelligence report
  const reportData = {
    title: "The 2024 SBA 7(a) Liquidity Crunch: Navigating High-Interest Roll-ups",
    subtitle: "A strategic overview of debt-service coverage ratios in a high-rate environment for lower middle-market acquisitions.",
    issue: "VOL. 012",
    classification: "CONFIDENTIAL / INTERNAL USE",
    date: "OCTOBER 14, 2024",
    author: "LEAD ANALYST: OXIDIZED RESEARCH GROUP",
    content: [
      {
        type: "lead",
        text: "The landscape of acquisition entrepreneurship has undergone a fundamental shift. As the 'Silver Tsunami' of retiring business owners accelerates, the cost of capital has introduced a friction point unseen in the previous decade of zero-interest rate policy."
      },
      {
        type: "paragraph",
        text: "In this environment, the traditional 3x SDE multiple is no longer a given. Sellers are facing a reality where buyers must account for debt service that consumes nearly 40% of operating cash flow on day one. Our research indicates that successful closings in Q3 2024 have increasingly relied on structured earn-outs and seller notes to bridge the valuation gap created by 11.5% SBA interest rates."
      },
      {
        type: "data-callout",
        title: "MARKET DYNAMICS: DEBT VS EQUITY",
        metrics: [
          { label: "Avg. SBA Spread", value: "P + 3.00%" },
          { label: "DSCR Floor", value: "1.25x" },
          { label: "Equity Injection", value: "10-15%" },
          { label: "Seller Carry Avg", value: "12.5%" }
        ]
      },
      {
        type: "paragraph",
        text: "Furthermore, the industrial services sector has shown remarkable resilience. While SaaS multiples have compressed, boring, 'un-sexy' businesses—HVAC, medical waste, and heavy equipment rental—continue to command premium attention because of their tangible asset bases and recurring contract revenue."
      }
    ]
  };

  return (
    <div className="intelligence-page">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

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

        .intelligence-page {
            background-color: var(--obsidian);
            color: var(--bone);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            position: relative;
        }

        .intelligence-page::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: var(--noise);
            opacity: 0.04;
            pointer-events: none;
            z-index: 9999;
        }

        .mono { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
        .serif { font-family: 'Libre Baskerville', serif; }

        /* Navigation */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 2px solid var(--graphite);
            background: var(--obsidian);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo {
            font-weight: 900;
            font-size: 1.5rem;
            letter-spacing: -1px;
            color: var(--bone);
            text-decoration: none;
        }

        .logo span { color: var(--oxidized-copper); }

        .report-header {
            padding: 6rem 2rem 4rem 2rem;
            border-bottom: 2px solid var(--graphite);
            max-width: 1200px;
            margin: 0 auto;
        }

        .report-meta {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            font-size: 0.75rem;
            border-bottom: 1px solid var(--graphite);
            padding-bottom: 1rem;
        }

        .meta-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .meta-label { color: #666; font-weight: 900; }
        .meta-value { color: var(--oxidized-copper); }

        h1 {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            line-height: 1.1;
            margin-bottom: 2rem;
            color: var(--bone);
        }

        .subtitle {
            font-size: 1.5rem;
            color: #888;
            max-width: 800px;
            line-height: 1.4;
            margin-bottom: 3rem;
        }

        .content-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 4rem 2rem;
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 4rem;
        }

        .article-body {
            font-size: 1.2rem;
            line-height: 1.8;
            color: #CCC;
        }

        .lead-text {
            font-size: 1.6rem;
            color: var(--bone);
            font-style: italic;
            margin-bottom: 3rem;
            padding-left: 2rem;
            border-left: 4px solid var(--oxidized-copper);
        }

        .paragraph {
            margin-bottom: 2rem;
        }

        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .data-box {
            background: var(--panel);
            border: 2px solid var(--bone);
            padding: 2rem;
            position: sticky;
            top: 140px;
        }

        .data-box h3 {
            font-family: 'JetBrains Mono';
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
            color: var(--acid-green);
            border-bottom: 1px solid var(--graphite);
            padding-bottom: 0.5rem;
        }

        .metric-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            font-family: 'JetBrains Mono';
            font-size: 0.8rem;
        }

        .metric-val {
            color: var(--bone);
            font-weight: 700;
        }

        .metric-lbl {
            color: #666;
        }

        .classification-stamp {
            border: 1px solid var(--blood-orange);
            color: var(--blood-orange);
            padding: 0.5rem 1rem;
            display: inline-block;
            font-family: 'JetBrains Mono';
            font-weight: 900;
            font-size: 0.7rem;
            margin-bottom: 1rem;
            transform: rotate(-2deg);
        }

        footer {
            padding: 6rem 2rem;
            background: #000;
            border-top: 2px solid var(--graphite);
            margin-top: 4rem;
        }

        @media (max-width: 1000px) {
            .content-container { grid-template-columns: 1fr; }
            .sidebar { order: -1; }
            .data-box { position: static; }
        }
      `}} />

      <nav>
        <a href="/" className="logo">OXIDIZED<span>LEDGER</span></a>
        <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--acid-green)' }}>
          INTELLIGENCE TERMINAL // LEVEL 4 ACCESS
        </div>
      </nav>

      <header className="report-header">
        <div className="classification-stamp">{reportData.classification}</div>
        
        <div className="report-meta mono">
          <div className="meta-item">
            <span className="meta-label">ISSUE</span>
            <span className="meta-value">{reportData.issue}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">DATE</span>
            <span className="meta-value">{reportData.date}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">AUTHOR</span>
            <span className="meta-value">O.R.G. ANALYST</span>
          </div>
        </div>

        <h1 className="serif">{reportData.title}</h1>
        <p className="subtitle">{reportData.subtitle}</p>
      </header>

      <main className="content-container">
        <article className="article-body">
          {reportData.content.map((block, idx) => {
            if (block.type === 'lead') {
              return <p key={idx} className="lead-text serif">{block.text}</p>;
            }
            if (block.type === 'paragraph') {
              return <p key={idx} className="paragraph serif">{block.text}</p>;
            }
            return null;
          })}
          
          <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--graphite)', border: '1px solid #333' }}>
            <h4 className="mono" style={{ marginBottom: '1rem', color: 'var(--oxidized-copper)' }}>End of Segment Analysis</h4>
            <p className="serif" style={{ fontSize: '1rem', fontStyle: 'italic' }}>
              The next report in this series will focus on the tactical use of Forfeiture Clauses in mid-market asset sales.
            </p>
          </div>
        </article>

        <aside className="sidebar">
          {reportData.content.filter(b => b.type === 'data-callout').map((block, idx) => (
            <div key={idx} className="data-box">
              <h3>{block.title}</h3>
              {block.metrics?.map((m, i) => (
                <div key={i} className="metric-row">
                  <span className="metric-lbl">{m.label}</span>
                  <span className="metric-val">{m.value}</span>
                </div>
              ))}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--graphite)', paddingTop: '1rem' }}>
                <p className="mono" style={{ fontSize: '0.6rem', color: '#444', lineHeight: 1.4 }}>
                  SOURCE: OXIDIZED LEDGER PROPRIETARY DATASET 2024. CALCULATIONS BASED ON WEIGHTED MEAN ACROSS 42 SECTORS.
                </p>
              </div>
            </div>
          ))}

          <div style={{ padding: '1rem', border: '1px dashed var(--graphite)' }}>
            <span className="mono" style={{ fontSize: '0.65rem', display: 'block', marginBottom: '1rem' }}>Related Documents:</span>
            <ul className="mono" style={{ fontSize: '0.7rem', listStyle: 'none', color: var(--oxidized-copper) }}>
              <li style={{ marginBottom: '0.5rem' }}>&gt; 2024_Q3_HVAC_ROLLUP.PDF</li>
              <li style={{ marginBottom: '0.5rem' }}>&gt; SELLER_FINANCE_STRUCTURES.XLS</li>
              <li>&gt; DEBT_COVERAGE_MAP.IMG</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer>
        <div className="content-container" style={{ padding: 0 }}>
          <div>
            <a href="#" className="logo">OXIDIZED<span>LEDGER</span></a>
            <p className="mono" style={{ fontSize: '0.7rem', marginTop: '1rem', color: '#444' }}>
              &copy; 2024 ALL RIGHTS RESERVED. PRIVATE DISTRIBUTION ONLY.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="mono" style={{ background: 'var(--bone)', color: 'var(--obsidian)', padding: '1rem 2rem', border: 'none', fontWeight: 900, cursor: 'pointer' }}>
              DOWNLOAD FULL REPORT (PDF)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const var_oxidized_copper = '#8E593E'; // Helper for the inline style string above if needed for direct JS reference
```