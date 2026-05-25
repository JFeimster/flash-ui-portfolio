import React, { useState } from 'react';

const DataSyncLogs = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <div style={{
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <style>
        {`
          .hub-container { max-width: 1200px; margin: 0 auto; }
          .hub-header { margin-bottom: 40px; border-bottom: 1px solid #1f242d; padding-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          .hub-title h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 8px; }
          .hub-title p { color: #8a8f98; font-size: 0.95rem; }
          
          .grid-layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
          
          .sidebar-panel { display: flex; flex-direction: column; gap: 16px; }
          .panel-card { background: #0d0f14; border: 1px solid #1f242d; border-radius: 8px; padding: 20px; }
          .panel-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #8a8f98; letter-spacing: 0.05em; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
          .panel-label span { width: 6px; height: 6px; background: #00ff9d; border-radius: 50%; box-shadow: 0 0 8px rgba(0, 255, 157, 0.5); }
          
          .integration-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #14171c; border: 1px solid #1f242d; border-radius: 4px; margin-bottom: 8px; transition: 0.2s; cursor: pointer; }
          .integration-item:hover { border-color: #00ff9d; }
          .int-icon { width: 32px; height: 32px; background: #1f242d; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.7rem; }
          .int-info { flex: 1; }
          .int-name { font-size: 0.85rem; font-weight: 600; }
          .int-status { font-size: 0.7rem; color: #8a8f98; }
          .status-dot { width: 8px; height: 8px; border-radius: 50%; }
          
          .main-content { display: flex; flex-direction: column; gap: 24px; }
          
          .log-table { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; }
          .log-table th { text-align: left; padding: 12px; color: #8a8f98; border-bottom: 1px solid #1f242d; font-weight: 500; }
          .log-table td { padding: 12px; border-bottom: 1px solid #0d0f14; color: #ffffff; }
          .log-row:hover { background: rgba(255,255,255,0.02); }
          .status-tag { padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; }
          .status-success { background: rgba(0, 255, 157, 0.1); color: #00ff9d; }
          .status-warning { background: rgba(255, 184, 0, 0.1); color: #ffb800; }
          
          .automation-builder { background: #0d0f14; border: 1px solid #1f242d; border-radius: 8px; padding: 24px; }
          .logic-node { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
          .logic-box { background: #14171c; border: 1px solid #1f242d; padding: 8px 16px; border-radius: 4px; font-size: 0.85rem; font-weight: 500; }
          .logic-arrow { color: #8a8f98; font-size: 1.2rem; }
          .btn-add { background: transparent; border: 1px dashed #1f242d; color: #8a8f98; padding: 8px; border-radius: 4px; cursor: pointer; width: 100%; font-size: 0.8rem; }
          .btn-add:hover { border-color: #00ff9d; color: #00ff9d; }
          
          .sync-btn { background: #00ff9d; color: #000; border: none; padding: 10px 20px; border-radius: 4px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }
          .sync-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0, 255, 157, 0.2); }
          .sync-btn:disabled { background: #1f242d; color: #8a8f98; cursor: not-allowed; }

          @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
          .syncing-indicator { animation: pulse 1.5s infinite; color: #00ff9d; font-size: 0.7rem; font-weight: 700; margin-left: 10px; }
        `}
      </style>

      <div className="hub-container">
        <header className="hub-header">
          <div className="hub-title">
            <h1>FinanceOps Integration Hub</h1>
            <p>Engine room: Orchestrating data flow across your financial ecosystem.</p>
          </div>
          <button 
            className="sync-btn" 
            onClick={() => {
              setIsSyncing(true);
              setTimeout(() => setIsSyncing(false), 3000);
            }}
            disabled={isSyncing}
          >
            {isSyncing ? 'SYNCING ECOSYSTEM...' : 'FORCE GLOBAL RE-SYNC'}
          </button>
        </header>

        <div className="grid-layout">
          <div className="sidebar-panel">
            <div className="panel-card">
              <div className="panel-label"><span></span> Active Connections</div>
              
              <div className="integration-item">
                <div className="int-icon" style={{color: '#2ca01c'}}>QBO</div>
                <div className="int-info">
                  <div className="int-name">QuickBooks Online</div>
                  <div className="int-status">Connected • 12m ago</div>
                </div>
              </div>

              <div className="integration-item">
                <div className="int-icon" style={{color: '#6772e5'}}>STR</div>
                <div className="int-info">
                  <div className="int-name">Stripe Analytics</div>
                  <div className="int-status">Connected • 2h ago</div>
                </div>
              </div>

              <div className="integration-item">
                <div className="int-icon" style={{color: '#00d1ff'}}>PLD</div>
                <div className="int-info">
                  <div className="int-name">Plaid (Chase Bank)</div>
                  <div className="int-status" style={{color: '#ffb800'}}>Action Required</div>
                </div>
              </div>

              <div className="integration-item" style={{opacity: 0.5}}>
                <div className="int-icon">XR</div>
                <div className="int-info">
                  <div className="int-name">Xero Accounting</div>
                  <div className="int-status">Not Configured</div>
                </div>
              </div>
            </div>

            <div className="panel-card">
              <div className="panel-label" style={{color: '#8a8f98'}}>Data Health Score</div>
              <div style={{fontSize: '1.5rem', fontWeight: 800, color: '#00ff9d'}}>98.4%</div>
              <div style={{fontSize: '0.7rem', color: '#8a8f98', marginTop: '4px'}}>3,402 points verified today</div>
            </div>
          </div>

          <div className="main-content">
            <div className="automation-builder">
              <div className="panel-label">FinOps Automation Builder</div>
              
              <div className="logic-node">
                <div className="logic-box" style={{borderColor: '#00ff9d'}}>IF [Cash_Runway] &lt; [3 Months]</div>
                <div className="logic-arrow">→</div>
                <div className="logic-box">TRIGGER [Slack_Alert]</div>
                <div className="logic-box">CHANNEL [#finance-ops]</div>
              </div>

              <div className="logic-node">
                <div className="logic-box" style={{borderColor: '#ffb800'}}>IF [Expense_Item] &gt; [$500.00]</div>
                <div className="logic-arrow">→</div>
                <div className="logic-box">TAG [High_Priority]</div>
                <div className="logic-box">NOTIFY [Founder_Direct]</div>
              </div>

              <button className="btn-add">+ Add New FinOps Trigger</button>
            </div>

            <div className="panel-card" style={{padding: '0'}}>
              <div style={{padding: '20px', borderBottom: '1px solid #1f242d', display: 'flex', justifyContent: 'space-between'}}>
                <div className="panel-label" style={{margin: 0}}>Real-time Sync Logs</div>
                {isSyncing && <span className="syncing-indicator">INGESTING PACKETS...</span>}
              </div>
              <table className="log-table">
                <thead>
                  <tr>
                    <th>TIMESTAMP (UTC)</th>
                    <th>SOURCE</th>
                    <th>EVENT_ID</th>
                    <th>STATUS</th>
                    <th>LATENCY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="log-row">
                    <td>2023-10-27 14:02:44</td>
                    <td>Plaid_API</td>
                    <td>txn_ingest_9902</td>
                    <td><span className="status-tag status-success">SUCCESS</span></td>
                    <td>142ms</td>
                  </tr>
                  <tr className="log-row">
                    <td>2023-10-27 14:02:41</td>
                    <td>QBO_Auth</td>
                    <td>token_refresh_auth</td>
                    <td><span className="status-tag status-success">SUCCESS</span></td>
                    <td>89ms</td>
                  </tr>
                  <tr className="log-row">
                    <td>2023-10-27 13:58:12</td>
                    <td>Stripe_Webhook</td>
                    <td>evt_charge_succeeded</td>
                    <td><span className="status-tag status-success">SUCCESS</span></td>
                    <td>45ms</td>
                  </tr>
                  <tr className="log-row">
                    <td>2023-10-27 13:45:00</td>
                    <td>FinOps_Engine</td>
                    <td>runway_recalc_q4</td>
                    <td><span className="status-tag status-warning">LATENCY_WARN</span></td>
                    <td>1.2s</td>
                  </tr>
                  <tr className="log-row">
                    <td>2023-10-27 13:30:05</td>
                    <td>Plaid_API</td>
                    <td>acc_balance_sync</td>
                    <td><span className="status-tag status-success">SUCCESS</span></td>
                    <td>210ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSyncLogs;
```