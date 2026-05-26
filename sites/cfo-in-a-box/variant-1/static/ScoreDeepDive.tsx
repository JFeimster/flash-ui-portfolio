import React, { useState } from 'react';

const ScoreDeepDive: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const readinessMetrics = [
    { label: 'Financial Health', score: 85, weight: '40%', status: 'optimal' },
    { label: 'Documentation Quality', score: 42, weight: '30%', status: 'critical' },
    { label: 'Growth Velocity', score: 68, weight: '20%', status: 'warning' },
    { label: 'Market Benchmarking', score: 91, weight: '10%', status: 'optimal' },
  ];

  const documentAudit = [
    { name: 'Trailing 12-Month P&L', status: 'Clean', date: '2 days ago', type: 'Financial' },
    { name: 'Balance Sheet (Current)', status: 'Messy', date: '1 month ago', type: 'Financial' },
    { name: 'Cap Table / Equity Map', status: 'Missing', date: 'N/A', type: 'Legal' },
    { name: 'Article of Incorporation', status: 'Clean', date: '2023', type: 'Legal' },
    { name: 'Tax Returns (3 Years)', status: 'Pending', date: 'In Review', type: 'Compliance' },
  ];

  return (
    <div style={{
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px',
      minHeight: '100vh',
      lineHeight: '1.6'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .card { background: #0d0f14; border: 1px solid #1f242d; border-radius: 8px; padding: 24px; }
        .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
        .text-primary { color: #00ff9d; }
        .text-muted { color: #8a8f98; }
        .text-danger { color: #ff4d4d; }
        .text-warning { color: #ffb800; }
        .grid { display: grid; gap: 24px; }
        .flex { display: flex; align-items: center; }
        .badge { padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; border: 1px solid #1f242d; }
        .progress-bg { height: 6px; background: #1f242d; border-radius: 3px; width: 100%; margin-top: 8px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; }
        .btn-primary { background: #00ff9d; color: #000; padding: 12px 24px; border-radius: 4px; font-weight: 700; border: none; cursor: pointer; transition: 0.3s; }
        .btn-primary:hover { box-shadow: 0 0 20px rgba(0, 255, 157, 0.3); transform: translateY(-1px); }
        .audit-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .audit-table th { text-align: left; padding: 12px; font-size: 0.75rem; color: #8a8f98; text-transform: uppercase; border-bottom: 1px solid #1f242d; }
        .audit-table td { padding: 16px 12px; font-size: 0.9rem; border-bottom: 1px solid #1f242d; }
      `}</style>

      {/* Header Section */}
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '40px', alignItems: 'flex-end' }}>
        <div>
          <div className="badge" style={{ borderColor: '#00ff9d', color: '#00ff9d', marginBottom: '12px' }}>Funding Readiness Portal</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>Capital Readiness Score</h1>
          <p className="text-muted">Analysis of 142 financial signals and document integrity markers.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono text-muted" style={{ marginBottom: '4px' }}>CURRENT STATUS</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#00ff9d', lineHeight: 1 }}>72<span style={{ fontSize: '1.2rem', color: '#1f242d' }}>/100</span></div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        {/* Left Column: Weighted Metrics & Audit */}
        <div className="grid">
          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Score Breakdown</h3>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {readinessMetrics.map((m) => (
                <div key={m.label}>
                  <div className="flex" style={{ justifyContent: 'space-between' }}>
                    <span className="mono" style={{ fontSize: '0.75rem' }}>{m.label} <span className="text-muted">({m.weight})</span></span>
                    <span className={m.status === 'critical' ? 'text-danger' : m.status === 'warning' ? 'text-warning' : 'text-primary'}>
                      {m.score}%
                    </span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ 
                      width: `${m.score}%`, 
                      backgroundColor: m.status === 'critical' ? '#ff4d4d' : m.status === 'warning' ? '#ffb800' : '#00ff9d' 
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Document Health Audit</h3>
              <span className="mono text-danger" style={{ fontSize: '0.7rem' }}>● 2 CRITICAL ISSUES</span>
            </div>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {documentAudit.map((doc) => (
                  <tr key={doc.name}>
                    <td>{doc.name}</td>
                    <td>
                      <span style={{ 
                        color: doc.status === 'Clean' ? '#00ff9d' : doc.status === 'Messy' ? '#ffb800' : '#ff4d4d',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="text-muted mono">{doc.type}</td>
                    <td className="text-muted">{doc.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Insights & Data Room */}
        <div className="grid" style={{ alignContent: 'start' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #0d0f14 0%, #14171c 100%)', borderLeft: '4px solid #00ff9d' }}>
            <div className="mono text-primary" style={{ marginBottom: '12px' }}>&gt; INVESTOR_POV_INSIGHT</div>
            <p style={{ fontSize: '0.9rem', color: '#e0e0e0', marginBottom: '16px' }}>
              Your financial hygiene in "Growth Velocity" is attracting positive flags, but your "Documentation Quality" is a deal-breaker. 
              Institutional lenders will pause at the missing Cap Table. 
            </p>
            <div style={{ fontSize: '0.85rem', color: '#ffb800', fontWeight: 600 }}>
              Action: Generate a Pro-Forma Cap Table to boost score by +12 points.
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ fontSize: '2rem' }}>📦</div>
            <div>
              <h4 style={{ marginBottom: '8px' }}>Investor Data Room</h4>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Package your "Clean" documents into a secure, encrypted vault for DD.</p>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => setIsGenerating(false), 2000);
              }}
            >
              {isGenerating ? 'GENERTING LINK...' : 'GENERATE DATA ROOM'}
            </button>
            <div className="mono" style={{ fontSize: '0.65rem', color: '#444' }}>
              SECURED VIA AES-256 ENCRYPTION
            </div>
          </div>

          <div className="card" style={{ borderStyle: 'dashed', opacity: 0.6 }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Lender Matching</h4>
            <p style={{ fontSize: '0.8rem' }}>Based on your score of 72, you qualify for 4 Tier-2 debt providers.</p>
            <a href="#" className="text-primary mono" style={{ fontSize: '0.75rem', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>VIEW MATCHES →</a>
          </div>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #1f242d' }}>
        <p className="mono text-muted" style={{ fontSize: '0.7rem', textAlign: 'center' }}>
          WEIGHTED READINESS ALGORITHM V4.2 // LAST CALCULATED: {new Date().toLocaleTimeString()} // CFO-IN-A-BOX PRO MODULE
        </p>
      </div>
    </div>
  );
};

export default ScoreDeepDive;