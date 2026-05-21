import React, { useState } from 'react';

const HistoricalReviewArchive = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const memos = [
    {
      id: 'MEMO-042',
      date: 'Oct 20, 2023',
      period: 'Oct 13 — Oct 19',
      status: 'Complete',
      runway: '5.8 mo',
      netCash: '+$8,450',
      anomalies: 2,
      insight: 'Contractor expenses increased 22% this week. Subscription ROI check recommended.',
      trend: 'up'
    },
    {
      id: 'MEMO-041',
      date: 'Oct 13, 2023',
      period: 'Oct 06 — Oct 12',
      status: 'Complete',
      runway: '5.6 mo',
      netCash: '-$2,100',
      anomalies: 5,
      insight: 'Significant burn on AWS over-provisioning. 14% savings identified in infrastructure.',
      trend: 'down'
    },
    {
      id: 'MEMO-040',
      date: 'Oct 06, 2023',
      period: 'Sept 29 — Oct 05',
      status: 'Complete',
      runway: '6.1 mo',
      netCash: '+$12,200',
      anomalies: 1,
      insight: 'Q3 closing report shows 18% YoY growth. Funding readiness score updated to 74.',
      trend: 'up'
    },
    {
      id: 'MEMO-039',
      date: 'Sept 29, 2023',
      period: 'Sept 22 — Sept 28',
      status: 'Archived',
      runway: '5.2 mo',
      netCash: '+$4,300',
      anomalies: 3,
      insight: 'Payroll tax adjustment reflected. Cash reserves stable for upcoming hiring round.',
      trend: 'up'
    }
  ];

  return (
    <div style={{ backgroundColor: '#050608', color: '#ffffff', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '40px 20px' }}>
      <style>{`
        .archive-container { max-width: 1100px; margin: 0 auto; }
        .header-flex { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; border-bottom: 1px solid #1f242d; padding-bottom: 24px; }
        .title-area h2 { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px; }
        .title-area p { color: #8a8f98; font-size: 0.95rem; }
        
        .filter-bar { display: flex; gap: 12px; margin-bottom: 32px; }
        .filter-btn { background: transparent; border: 1px solid #1f242d; color: #8a8f98; padding: 6px 16px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .filter-btn.active { border-color: #00ff9d; color: #00ff9d; background: rgba(0, 255, 157, 0.05); }
        .filter-btn:hover { border-color: #8a8f98; }

        .memo-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .memo-card { background: #0d0f14; border: 1px solid #1f242d; border-radius: 8px; padding: 24px; display: grid; grid-template-columns: 180px 1fr 200px; gap: 32px; align-items: center; transition: 0.3s ease; }
        .memo-card:hover { border-color: #333; background: #14171c; transform: translateX(4px); }
        
        .memo-date { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #8a8f98; }
        .memo-id { color: #00ff9d; font-weight: 700; font-size: 1rem; margin-top: 4px; display: block; }
        
        .memo-summary h3 { font-size: 1.1rem; margin-bottom: 8px; font-weight: 600; }
        .insight-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #8a8f98; border-left: 2px solid #00ff9d; padding-left: 12px; margin-top: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        .memo-stats { display: flex; gap: 20px; text-align: right; justify-content: flex-end; }
        .stat-item { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.65rem; text-transform: uppercase; color: #8a8f98; font-weight: 700; margin-bottom: 4px; }
        .stat-value { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 0.9rem; }
        .stat-value.up { color: #00ff9d; }
        .stat-value.down { color: #ff4d4d; }

        .btn-view { background: #1f242d; color: #fff; border: none; padding: 10px 16px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; cursor: pointer; text-decoration: none; text-align: center; }
        .btn-view:hover { background: #2a313d; }
        
        .anomaly-badge { background: rgba(255, 184, 0, 0.1); color: #ffb800; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; margin-left: 8px; border: 1px solid rgba(255, 184, 0, 0.3); }

        @media (max-width: 850px) {
          .memo-card { grid-template-columns: 1fr; gap: 16px; }
          .memo-stats { justify-content: flex-start; text-align: left; margin-top: 16px; }
        }
      `}</style>

      <div className="archive-container">
        <header className="header-flex">
          <div className="title-area">
            <p style={{ color: '#00ff9d', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}>History & Audits</p>
            <h2>Strategy Memo Archive</h2>
            <p>A chronological record of your Friday Finance Rhythms and AI-generated insights.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button className="btn-view" style={{ background: 'transparent', border: '1px solid #1f242d' }}>Export All (CSV)</button>
             <button className="btn-view" style={{ background: '#00ff9d', color: '#000' }}>Schedule Next Review</button>
          </div>
        </header>

        <div className="filter-bar">
          {['All', '2023', '2022', 'Flagged', 'Drafts'].map((filter) => (
            <button 
              key={filter} 
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="memo-grid">
          {memos.map((memo) => (
            <div key={memo.id} className="memo-card">
              <div className="memo-info">
                <span className="memo-date">{memo.date}</span>
                <span className="memo-id">{memo.id}</span>
              </div>
              
              <div className="memo-summary">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h3>Week ending {memo.period.split('—')[1]}</h3>
                  {memo.anomalies > 0 && (
                    <span className="anomaly-badge">{memo.anomalies} ANOMALIES</span>
                  )}
                </div>
                <div className="insight-tag">
                  &gt; AI_SUMMARY: {memo.insight}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="memo-stats">
                  <div className="stat-item">
                    <span className="stat-label">Runway</span>
                    <span className="stat-value">{memo.runway}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Net Cash</span>
                    <span className={`stat-value ${memo.trend}`}>{memo.netCash}</span>
                  </div>
                </div>
                <button className="btn-view">View Full Memo</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '60px', padding: '32px', border: '1px dashed #1f242d', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#8a8f98', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace" }}>
            [ End of Archive — Last Synced: {new Date().toLocaleDateString()} ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoricalReviewArchive;