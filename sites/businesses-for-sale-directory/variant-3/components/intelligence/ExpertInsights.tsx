import React from 'react';

const ExpertInsights = () => {
  const reports = [
    {
      id: '001',
      category: 'Market Intelligence',
      title: 'The 2024 HVAC Consolidation Playbook',
      excerpt: 'Analyzing the aggressive roll-up strategies of private equity in the Sun Belt region and how independent operators are defending margins.',
      date: 'OCT 24',
      readingTime: '12 MIN',
      type: 'Whitepaper',
      highlight: '3.8x Average Entry Multiple'
    },
    {
      id: '002',
      category: 'Case Study',
      title: 'From Single Unit to $12M Portfolio',
      excerpt: 'A technical breakdown of the 18-month acquisition sequence used to dominate the Pacific Northwest commercial cleaning market.',
      date: 'SEP 24',
      readingTime: '15 MIN',
      type: 'Roll-up Strategy',
      highlight: '82% Revenue Growth'
    },
    {
      id: '003',
      category: 'SBA Financing',
      title: 'Leveraging 7(a) in High-Rate Environments',
      excerpt: 'Structuring deal terms to maintain debt service coverage ratios above 1.5x despite fluctuating federal benchmarks.',
      date: 'AUG 24',
      readingTime: '08 MIN',
      type: 'Lending Report',
      highlight: 'DSCR Optimization'
    }
  ];

  return (
    <section className="intelligence-container">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      
      <div className="intelligence-header">
        <div className="header-meta mono">/ / Internal Intelligence Bureau</div>
        <h2 className="section-title">The Ledger Editorial</h2>
        <p className="section-subtitle">
          Proprietary research and tactical briefings for the professional acquisition entrepreneur. 
          Limited distribution market intelligence.
        </p>
      </div>

      <div className="featured-report">
        <div className="featured-label mono">Featured Intelligence</div>
        <div className="featured-grid">
          <div className="featured-content">
            <span className="category-tag">Strategic Analysis</span>
            <h3 className="featured-title">Post-Industrial Arbitrage: The Rise of Specialized Waste Management</h3>
            <p className="featured-excerpt">
              Why unglamorous "dirty" businesses are commanding the highest risk-adjusted returns in the current micro-cap landscape. 
              A deep dive into route density and regulatory moats.
            </p>
            <div className="featured-footer">
              <button className="read-btn">Access Full Report</button>
              <span className="mono report-id">Report #IX-992</span>
            </div>
          </div>
          <div className="featured-callout">
            <div className="callout-box">
              <span className="callout-label mono">Current Sector Yield</span>
              <span className="callout-value">22.4%</span>
            </div>
            <div className="callout-box">
              <span className="callout-label mono">M&A Velocity</span>
              <span className="callout-value">+14%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="card-top">
              <span className="mono report-num">{report.id}</span>
              <span className="report-type mono">{report.type}</span>
            </div>
            <div className="card-body">
              <span className="report-cat">{report.category}</span>
              <h4 className="report-title">{report.title}</h4>
              <p className="report-excerpt">{report.excerpt}</p>
            </div>
            <div className="card-data-strip">
              <span className="data-point mono">{report.highlight}</span>
            </div>
            <div className="card-footer mono">
              <span>{report.date}</span>
              <span>{report.readingTime}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .intelligence-container {
          background-color: #050505;
          color: #F5F5F0;
          padding: 6rem 2rem;
          font-family: 'Inter', sans-serif;
          position: relative;
          border-top: 2px solid #1A1A1A;
        }

        .intelligence-container::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }

        .mono {
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 1px;
        }

        .intelligence-header {
          max-width: 800px;
          margin-bottom: 5rem;
        }

        .header-meta {
          color: #8E593E;
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4rem;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #888;
          max-width: 500px;
          line-height: 1.6;
        }

        /* Featured Section */
        .featured-report {
          border: 2px solid #F5F5F0;
          margin-bottom: 4rem;
          position: relative;
        }

        .featured-label {
          position: absolute;
          top: -12px;
          left: 2rem;
          background: #050505;
          padding: 0 1rem;
          color: #C1FF00;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
        }

        .featured-content {
          padding: 4rem 3rem;
          border-right: 2px solid #1A1A1A;
        }

        .category-tag {
          font-family: 'JetBrains Mono', monospace;
          color: #8E593E;
          font-size: 0.7rem;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: block;
        }

        .featured-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .featured-excerpt {
          color: #AAA;
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .featured-footer {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .read-btn {
          background: #F5F5F0;
          color: #050505;
          border: none;
          padding: 1rem 2.5rem;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .read-btn:hover {
          background: #C1FF00;
        }

        .report-id {
          color: #444;
        }

        .featured-callout {
          display: flex;
          flex-direction: column;
          background: #0F0F0F;
        }

        .callout-box {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-bottom: 1px solid #1A1A1A;
        }

        .callout-label {
          color: #666;
          margin-bottom: 0.5rem;
        }

        .callout-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 3rem;
          font-weight: 700;
          color: #C1FF00;
        }

        /* Reports Grid */
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .report-card {
          background: #0F0F0F;
          border: 1px solid #1A1A1A;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .report-card:hover {
          border-color: #8E593E;
          transform: translateY(-5px);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .report-num {
          color: #444;
        }

        .report-type {
          color: #C1FF00;
        }

        .report-cat {
          color: #8E593E;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          display: block;
        }

        .report-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .report-excerpt {
          font-size: 0.9rem;
          color: #777;
          line-height: 1.5;
          margin-bottom: 2rem;
        }

        .card-data-strip {
          margin-top: auto;
          background: #1A1A1A;
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
        }

        .data-point {
          color: #F5F5F0;
          font-weight: 700;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          color: #444;
        }

        @media (max-width: 900px) {
          .featured-grid {
            grid-template-columns: 1fr;
          }
          .featured-content {
            border-right: none;
            border-bottom: 2px solid #1A1A1A;
          }
          .section-title {
            font-size: 2.5rem;
          }
          .featured-callout {
            flex-direction: row;
          }
          .callout-box {
            border-right: 1px solid #1A1A1A;
          }
        }
      `}</style>
    </section>
  );
};

export default ExpertInsights;