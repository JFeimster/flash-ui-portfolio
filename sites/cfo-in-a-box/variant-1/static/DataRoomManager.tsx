import React, { useState } from 'react';

const DataRoomManager: React.FC = () => {
  const [readinessScore, setReadinessScore] = useState(72);
  
  const documents = [
    { id: 1, name: 'P&L Statement (Last 3 Years)', status: 'Verified', health: 95, type: 'Financial' },
    { id: 2, name: 'Balance Sheet Q3 2023', status: 'Warning', health: 45, type: 'Financial', issue: 'Unreconciled items detected' },
    { id: 3, name: 'Cap Table (Current)', status: 'Verified', health: 100, type: 'Legal' },
    { id: 4, name: 'Articles of Incorporation', status: 'Verified', health: 100, type: 'Governance' },
    { id: 5, name: 'Customer Contracts (>10k)', status: 'Action Required', health: 20, type: 'Sales', issue: '3 missing signatures' },
    { id: 6, name: 'Tax Returns (2022)', status: 'Verified', health: 98, type: 'Compliance' },
  ];

  return (
    <div style={{
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px',
      minHeight: '100vh'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          
          .card { background: #0d0f14; border: 1px solid #1f242d; border-radius: 8px; padding: 24px; }
          .primary-text { color: #00ff9d; }
          .secondary-text { color: #ffb800; }
          .danger-text { color: #ff4d4d; }
          .muted-text { color: #8a8f98; }
          .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
          
          .readiness-meter {
            height: 8px;
            background: #1f242d;
            border-radius: 4px;
            margin: 20px 0;
            overflow: hidden;
          }
          
          .readiness-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff4d4d, #ffb800, #00ff9d);
            transition: width 1s ease-in-out;
          }

          .doc-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .doc-table th { text-align: left; padding: 12px; color: #8a8f98; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid #1f242d; }
          .doc-table td { padding: 16px 12px; border-bottom: 1px solid #1f242d; font-size: 0.9rem; }
          
          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
          }
          
          .btn-glow {
            background: #00ff9d;
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s;
            box-shadow: 0 0 15px rgba(0, 255, 157, 0.15);
          }
          
          .btn-glow:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 255, 157, 0.3);
          }

          .ai-sidebar {
            border-left: 1px solid #1f242d;
            padding-left: 30px;
          }

          .health-tag {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
            border: 2px solid #1f242d;
          }
        `}
      </style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="mono primary-text" style={{ marginBottom: '8px' }}>// FUNDING_READY_PORTAL_V2</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Investor Data Room</h1>
            <p className="muted-text">Transforming your financial 'crime scene' into a due-diligence powerhouse.</p>
          </div>
          <button className="btn-glow">Generate Secure Investor Link</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
          
          {/* Main Content */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Document Health Audit</h3>
              <div className="mono muted-text">6 Files | 4.2 MB Total</div>
            </div>

            <table className="doc-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Health Score</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{doc.name}</div>
                      {doc.issue && <div className="danger-text mono" style={{ fontSize: '0.7rem', marginTop: '4px' }}>⚠ {doc.issue}</div>}
                    </td>
                    <td className="muted-text">{doc.type}</td>
                    <td>
                      <span className={`status-badge ${
                        doc.status === 'Verified' ? 'primary-text' : 
                        doc.status === 'Warning' ? 'secondary-text' : 'danger-text'
                      }`} style={{ border: '1px solid currentColor' }}>
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <div className="health-tag" style={{ 
                        borderColor: doc.health > 80 ? '#00ff9d' : doc.health > 40 ? '#ffb800' : '#ff4d4d',
                        color: doc.health > 80 ? '#00ff9d' : doc.health > 40 ? '#ffb800' : '#ff4d4d'
                      }}>
                        {doc.health}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Readiness Score Card */}
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="muted-text mono" style={{ fontSize: '0.7rem', marginBottom: '10px' }}>WEIGHTED READINESS</div>
              <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>
                {readinessScore}<span style={{ fontSize: '1rem', color: '#555' }}>/100</span>
              </div>
              <div className="readiness-meter">
                <div className="readiness-fill" style={{ width: `${readinessScore}%` }}></div>
              </div>
              <p style={{ fontSize: '0.8rem' }} className="muted-text">
                Your score is <span className="primary-text">B+</span>. Recommended to fix <span className="danger-text">2 critical issues</span> before reaching out to VCs.
              </p>
            </div>

            {/* AI Insights Panel */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #0d0f14 0%, #14171c 100%)', borderLeft: '3px solid #00ff9d' }}>
              <div className="mono primary-text" style={{ marginBottom: '12px', fontSize: '0.75rem' }}>&gt; AI_CFO_AUDIT_BOT</div>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                <p style={{ marginBottom: '10px' }}><strong>Major Conflict:</strong> Your Balance Sheet Q3 does not reconcile with bank export exports from Stripe.</p>
                <p style={{ marginBottom: '10px' }}><strong>Missing Item:</strong> No Intellectual Property assignment agreements found for founder group.</p>
                <p className="primary-text" style={{ fontWeight: 600 }}>Estimated +12 points upon resolution.</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ padding: '16px' }}>
              <h4 className="mono" style={{ fontSize: '0.7rem', marginBottom: '15px', color: '#8a8f98' }}>QUICK ACTIONS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button style={{ background: 'transparent', border: '1px solid #1f242d', color: '#fff', padding: '10px', borderRadius: '4px', textAlign: 'left', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Sync QuickBooks Online
                </button>
                <button style={{ background: 'transparent', border: '1px solid #1f242d', color: '#fff', padding: '10px', borderRadius: '4px', textAlign: 'left', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Request Doc Signatures
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRoomManager;