import React, { useState } from 'react';

const SecuritySettings: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);

  const css = `
    .hub-container {
      background-color: #050608;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      padding: 2rem;
      min-height: 100vh;
    }

    .hub-header {
      margin-bottom: 3rem;
      border-bottom: 1px solid #1f242d;
      padding-bottom: 1.5rem;
    }

    .hub-header h1 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.04em;
    }

    .hub-header p {
      color: #8a8f98;
      font-size: 0.95rem;
      margin-top: 0.5rem;
    }

    .grid-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .card {
      background: #0d0f14;
      border: 1px solid #1f242d;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00ff9d;
      box-shadow: 0 0 10px rgba(0, 255, 157, 0.4);
    }

    /* Integration List */
    .integration-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: #14171c;
      border: 1px solid #1f242d;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }

    .integration-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .integration-icon {
      width: 32px;
      height: 32px;
      background: #1f242d;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.7rem;
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #8a8f98;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #1f242d;
      background: transparent;
      color: #fff;
      transition: 0.2s;
    }

    .btn-sm:hover {
      background: #1f242d;
    }

    .btn-primary-sm {
      background: #00ff9d;
      color: #000;
      border: none;
    }

    /* Automation Builder */
    .automation-builder {
      border-left: 2px solid #00ff9d;
      padding-left: 1.5rem;
    }

    .trigger-node {
      background: #14171c;
      padding: 1rem;
      border: 1px dashed #1f242d;
      border-radius: 4px;
      margin: 10px 0;
      position: relative;
    }

    .trigger-node::after {
      content: '↓';
      position: absolute;
      bottom: -20px;
      left: 20px;
      color: #00ff9d;
    }

    .action-node {
      background: rgba(0, 255, 157, 0.05);
      border: 1px solid #00ff9d;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 25px;
    }

    /* API Keys Section */
    .key-display {
      background: #050608;
      border: 1px solid #1f242d;
      padding: 0.75rem;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
    }

    .toggle-switch input { opacity: 0; width: 0; height: 0; }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #1f242d;
      transition: .4s;
      border-radius: 20px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider { background-color: #00ff9d; }
    input:checked + .slider:before { transform: translateX(20px); }

    .badge-secure {
      font-size: 0.65rem;
      padding: 2px 6px;
      background: rgba(0, 255, 157, 0.1);
      color: #00ff9d;
      border: 1px solid #00ff9d;
      border-radius: 3px;
    }
  `;

  return (
    <div className="hub-container">
      <style>{css}</style>
      
      <header className="hub-header">
        <h1>FinanceOps Integration Hub</h1>
        <p>Manage the engine room of your financial data ecosystem and automated triggers.</p>
      </header>

      <div className="grid-layout">
        <div className="main-col">
          {/* Active Connections */}
          <section className="card">
            <div className="card-title">
              <div className="status-dot"></div>
              Active Data Pipelines
            </div>
            
            <div className="integration-row">
              <div className="integration-info">
                <div className="integration-icon">CH</div>
                <div>
                  <div style={{fontWeight: 600, fontSize: '0.9rem'}}>Chase Business Checking</div>
                  <div className="mono">ID: ****9920 • Last sync: 4m ago</div>
                </div>
              </div>
              <button className="btn-sm">Configure</button>
            </div>

            <div className="integration-row">
              <div className="integration-info">
                <div className="integration-icon" style={{color: '#2ca01c'}}>QB</div>
                <div>
                  <div style={{fontWeight: 600, fontSize: '0.9rem'}}>QuickBooks Online</div>
                  <div className="mono">Connected to: Entity_Main_LLC</div>
                </div>
              </div>
              <button className="btn-sm">Configure</button>
            </div>

            <div className="integration-row">
              <div className="integration-info">
                <div className="integration-icon" style={{color: '#ed5f5f'}}>GS</div>
                <div>
                  <div style={{fontWeight: 600, fontSize: '0.9rem'}}>Gusto Payroll</div>
                  <div className="mono">Pending: Q3 Tax Documents</div>
                </div>
              </div>
              <button className="btn-sm btn-primary-sm">Resolve</button>
            </div>

            <button className="btn-sm" style={{width: '100%', marginTop: '1rem', borderStyle: 'dashed'}}>
              + Add New Integration (Stripe, Mercury, Plaid)
            </button>
          </section>

          {/* FinOps Automation Builder */}
          <section className="card">
            <div className="card-title">Automation Builder</div>
            <div className="automation-builder">
              <p className="mono" style={{marginBottom: '1rem'}}>TRIGGER_WORKFLOW_01</p>
              <div className="trigger-node">
                <div style={{fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase'}}>If Logic:</div>
                <div style={{fontWeight: 600}}>Monthly Burn Exceeds $45,000</div>
              </div>
              <div className="action-node">
                <div style={{fontSize: '0.7rem', color: '#00ff9d', textTransform: 'uppercase'}}>Then Action:</div>
                <div style={{fontWeight: 600}}>Ping Slack #finance-ops + Freeze "Growth_Exp" Ledger</div>
              </div>
            </div>
            <button className="btn-sm" style={{marginTop: '1.5rem'}}>Deploy New Automation</button>
          </section>
        </div>

        <div className="sidebar-col">
          {/* Security Overview */}
          <section className="card">
            <div className="card-title">Security Node</div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
              <span style={{fontSize: '0.85rem'}}>Multi-Factor Auth</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={mfaEnabled} onChange={() => setMfaEnabled(!mfaEnabled)} />
                <span className="slider"></span>
              </label>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
              <span style={{fontSize: '0.85rem'}}>IP Whitelisting</span>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>

            <div style={{borderTop: '1px solid #1f242d', paddingTop: '1rem'}}>
              <div className="mono" style={{marginBottom: '0.5rem'}}>PUBLIC_API_KEY</div>
              <div className="key-display">
                <span className="mono" style={{fontSize: '0.7rem'}}>pk_live_4492...x921</span>
                <span className="badge-secure">Copy</span>
              </div>
            </div>

            <div style={{marginTop: '1rem'}}>
              <div className="mono" style={{marginBottom: '0.5rem'}}>SECRET_ROLL_KEY</div>
              <div className="key-display">
                <span className="mono" style={{fontSize: '0.7rem'}}>••••••••••••••••</span>
                <span className="badge-secure">Reveal</span>
              </div>
            </div>

            <button className="btn-sm" style={{width: '100%', marginTop: '1.5rem', borderColor: '#ff4d4d', color: '#ff4d4d'}}>
              Rotate All API Keys
            </button>
          </section>

          {/* System Logs */}
          <section className="card" style={{padding: '1rem'}}>
            <div className="card-title" style={{fontSize: '0.8rem'}}>Access Logs</div>
            <div className="mono" style={{fontSize: '0.65rem', lineHeight: '1.8'}}>
              <div style={{color: '#00ff9d'}}>[14:02:11] Sync Success: Plaid_Link</div>
              <div>[13:55:04] Webhook Received: Gusto_Tax</div>
              <div>[12:20:19] Auth: User_Admin_01 logged in</div>
              <div style={{color: '#ffb800'}}>[11:04:33] Warning: High Latency QBO</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;