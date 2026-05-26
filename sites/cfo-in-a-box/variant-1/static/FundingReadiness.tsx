import React, { useState } from 'react';

const FundingReadiness = () => {
  const [activeTab, setActiveTab] = useState('audit');

  const styles = `
    .portal-root {
      background-color: #050608;
      color: #ffffff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      padding-bottom: 100px;
    }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    
    .nav {
      border-bottom: 1px solid #1f242d;
      padding: 1.5rem 0;
      background: rgba(5, 6, 8, 0.8);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo {
      font-weight: 800;
      font-size: 1.25rem;
      letter-spacing: -0.04em;
    }
    .logo span { color: #00ff9d; }

    .header-section {
      padding: 60px 0 40px;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      background: #1f242d;
      color: #00ff9d;
      border: 1px solid #00ff9d;
      margin-bottom: 1rem;
    }

    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
    .grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }

    .card {
      background: #0d0f14;
      border: 1px solid #1f242d;
      border-radius: 8px;
      padding: 24px;
      position: relative;
    }

    .score-value {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1;
      margin: 10px 0;
      color: #00ff9d;
    }

    .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
    
    .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #8a8f98;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .status-bar {
      height: 6px;
      background: #1f242d;
      border-radius: 3px;
      margin: 12px 0;
      overflow: hidden;
    }

    .status-fill {
      height: 100%;
      background: #00ff9d;
      box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
    }

    .audit-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .audit-table th {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #1f242d;
      color: #8a8f98;
      font-size: 0.8rem;
    }

    .audit-table td {
      padding: 16px 12px;
      border-bottom: 1px solid #1f242d;
      font-size: 0.9rem;
    }

    .status-tag {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .status-ready { background: rgba(0, 255, 157, 0.1); color: #00ff9d; }
    .status-warning { background: rgba(255, 184, 0, 0.1); color: #ffb800; }
    .status-danger { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; }

    .btn {
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      border: none;
      transition: 0.2s;
    }

    .btn-primary { background: #00ff9d; color: #000; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0, 255, 157, 0.2); }
    
    .btn-outline { background: transparent; border: 1px solid #1f242d; color: #fff; }
    .btn-outline:hover { background: #1f242d; }

    .ai-insight {
      background: linear-gradient(90deg, #14171c, #0d0f14);
      border-left: 3px solid #00ff9d;
      padding: 20px;
      margin-top: 24px;
      border-radius: 0 8px 8px 0;
    }

    .dataroom-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: #14171c;
      border: 1px solid #1f242d;
      margin-bottom: 8px;
      border-radius: 4px;
    }

    .text-gradient {
      background: linear-gradient(135deg, #fff 0%, #888 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @media (max-width: 768px) {
      .grid-3, .grid-2 { grid-template-columns: 1fr; }
    }
  `;

  return (
    <div className="portal-root">
      <style>{styles}</style>
      
      <nav className="nav">
        <div className="container">
          <div className="logo">CFO-IN-A-<span>BOX</span> / PORTAL</div>
        </div>
      </nav>

      <main className="container">
        <div className="header-section">
          <div className="badge">Investor Relations Mode</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }} className="text-gradient">
            Funding Readiness Command
          </h1>
          <p style={{ color: '#8a8f98' }}>Clean your "crime scene" financials and prepare for due diligence.</p>
        </div>

        <div className="grid-3">
          <div className="card">
            <div className="label">Readiness Score</div>
            <div className="score-value">72<span style={{ fontSize: '1rem', color: '#444' }}>/100</span></div>
            <div className="status-bar"><div className="status-fill" style={{ width: '72%' }}></div></div>
            <div className="mono" style={{ color: '#00ff9d' }}>Rank: Series A Eligible</div>
          </div>
          
          <div className="card">
            <div className="label">Document Health</div>
            <div className="score-value">84<span style={{ fontSize: '1rem', color: '#444' }}>%</span></div>
            <div className="status-bar"><div className="status-fill" style={{ width: '84%' }}></div></div>
            <div className="mono" style={{ color: '#8a8f98' }}>12/15 Core Docs Verified</div>
          </div>

          <div className="card">
            <div className="label">Data Room Status</div>
            <div style={{ margin: '20px 0' }}>
              <div className="mono" style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Vault-01 SECURED</div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Copy Investor Link</button>
            </div>
            <div className="mono" style={{ fontSize: '0.7rem', color: '#444' }}>Last updated: 2 hours ago</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="label" style={{ color: '#fff', fontSize: '1rem' }}>Financial Document Audit</h3>
              <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Scan New Docs</button>
            </div>
            
            <table className="audit-table">
              <thead>
                <tr>
                  <th>DOCUMENT</th>
                  <th>FORMAT</th>
                  <th>INTEGRITY</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Clean P&L (LTM)</td>
                  <td className="mono">PDF/XLS</td>
                  <td>98%</td>
                  <td><span className="status-tag status-ready">VERIFIED</span></td>
                </tr>
                <tr>
                  <td>Cap Table (Current)</td>
                  <td className="mono">CARTA_EXP</td>
                  <td>100%</td>
                  <td><span className="status-tag status-ready">VERIFIED</span></td>
                </tr>
                <tr>
                  <td>Tax Returns (2023)</td>
                  <td className="mono">PDF_SCAN</td>
                  <td>45%</td>
                  <td><span className="status-tag status-danger">MESSY DATA</span></td>
                </tr>
                <tr>
                  <td>Burn Analysis</td>
                  <td className="mono">AI_GEN</td>
                  <td>92%</td>
                  <td><span className="status-tag status-ready">VERIFIED</span></td>
                </tr>
                <tr>
                  <td>Accounts Receivable</td>
                  <td className="mono">XERO_SYNC</td>
                  <td>76%</td>
                  <td><span className="status-tag status-warning">RECONCILING</span></td>
                </tr>
              </tbody>
            </table>

            <div className="ai-insight">
              <div className="mono" style={{ color: '#00ff9d', marginBottom: '8px' }}>&gt; CFO_AUDIT_BOT: CRITICAL_FINDING</div>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                Your 2023 Tax Returns are showing a discrepancy vs internal books. 
                <span style={{ color: '#00ff9d' }}> Action Required:</span> Reconcile the $12.4k difference in 'Owner Draw' before opening the Data Room to external VCs.
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="label" style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px' }}>Investor Data Room</h3>
            
            <div className="dataroom-item">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff9d' }}></div>
                <div className="mono">Financial_Model_v4.xlsx</div>
              </div>
              <span className="label" style={{ fontSize: '0.6rem' }}>820 KB</span>
            </div>

            <div className="dataroom-item">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff9d' }}></div>
                <div className="mono">Cap_Table_Summary.pdf</div>
              </div>
              <span className="label" style={{ fontSize: '0.6rem' }}>1.2 MB</span>
            </div>

            <div className="dataroom-item">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#444' }}></div>
                <div className="mono" style={{ opacity: 0.5 }}>Customer_Contracts.zip</div>
              </div>
              <span className="status-tag status-warning">ENCRYPTING</span>
            </div>

            <div style={{ marginTop: '30px' }}>
              <div className="label" style={{ marginBottom: '12px' }}>Access Log (Last 24h)</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: '#8a8f98' }}>
                • Sequoia_Cap_Analyst viewed P&L<br />
                • Index_Ventures_Bot indexed model<br />
                • 14 Unidentified pings blocked
              </div>
            </div>

            <button className="btn btn-outline" style={{ width: '100%', marginTop: '40px' }}>
              Generate Audit PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FundingReadiness;