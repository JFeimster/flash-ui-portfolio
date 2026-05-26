import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  Database, 
  Plus, 
  Settings, 
  ShieldCheck, 
  Zap, 
  AlertTriangle,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';

const SourceMappingTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connections' | 'mapping' | 'automation'>('connections');

  const styles = `
    .source-mapping-container {
      background-color: #050608;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      padding: 2rem;
      min-height: 100vh;
    }

    .hub-header {
      margin-bottom: 2rem;
      border-bottom: 1px solid #1f242d;
      padding-bottom: 1.5rem;
    }

    .hub-title {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.04em;
    }

    .hub-title span {
      color: #00ff9d;
    }

    .nav-tabs {
      display: flex;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .nav-tab {
      background: none;
      border: none;
      color: #8a8f98;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0.5rem 0;
      position: relative;
    }

    .nav-tab.active {
      color: #00ff9d;
    }

    .nav-tab.active::after {
      content: '';
      position: absolute;
      bottom: -1.5rem;
      left: 0;
      width: 100%;
      height: 2px;
      background: #00ff9d;
      box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
    }

    .integration-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .source-card {
      background: #0d0f14;
      border: 1px solid #1f242d;
      border-radius: 8px;
      padding: 1.5rem;
      transition: 0.2s;
    }

    .source-card:hover {
      border-color: #00ff9d;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 4px;
      background: #14171c;
    }

    .status-online { color: #00ff9d; border: 1px solid rgba(0, 255, 157, 0.2); }
    .status-pending { color: #ffb800; border: 1px solid rgba(255, 184, 0, 0.2); }

    .mapping-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: #0d0f14;
      border-radius: 8px;
      overflow: hidden;
    }

    .mapping-table th {
      text-align: left;
      padding: 1rem;
      font-size: 0.75rem;
      color: #8a8f98;
      text-transform: uppercase;
      background: #14171c;
    }

    .mapping-table td {
      padding: 1rem;
      border-bottom: 1px solid #1f242d;
      font-size: 0.85rem;
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #00ff9d;
    }

    .automation-builder {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .logic-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #14171c;
      padding: 1rem;
      border-radius: 6px;
      border-left: 3px solid #00ff9d;
    }

    .input-field {
      background: #050608;
      border: 1px solid #1f242d;
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .btn-action {
      background: #00ff9d;
      color: #000;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.75rem;
      cursor: pointer;
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid #1f242d;
      color: #8a8f98;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.75rem;
      cursor: pointer;
    }
  `;

  return (
    <div className="source-mapping-container">
      <style>{styles}</style>
      
      <header className="hub-header">
        <div className="hub-title">FINOPS <span>INTEGRATION HUB</span></div>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            DATA CONNECTIONS
          </button>
          <button 
            className={`nav-tab ${activeTab === 'mapping' ? 'active' : ''}`}
            onClick={() => setActiveTab('mapping')}
          >
            FIELD MAPPING
          </button>
          <button 
            className={`nav-tab ${activeTab === 'automation' ? 'active' : ''}`}
            onClick={() => setActiveTab('automation')}
          >
            AUTOMATION BUILDER
          </button>
        </nav>
      </header>

      {activeTab === 'connections' && (
        <div className="integration-grid">
          <div className="source-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700 }}>QuickBooks Online</div>
              <div className="status-badge status-online">Connected</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#8a8f98', marginBottom: '1.5rem' }}>
              Primary accounting source. Syncing P&L, Balance Sheet, and COGS data.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono">Last sync: 12m ago</span>
              <button className="btn-secondary"><RefreshCw size={12} style={{ marginRight: '4px' }} /> Resync</button>
            </div>
          </div>

          <div className="source-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700 }}>Mercury Bank</div>
              <div className="status-badge status-online">Connected</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#8a8f98', marginBottom: '1.5rem' }}>
              Real-time cash balance and transaction monitoring via Plaid.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono">Last sync: 2m ago</span>
              <button className="btn-secondary"><RefreshCw size={12} style={{ marginRight: '4px' }} /> Resync</button>
            </div>
          </div>

          <div className="source-card" style={{ borderStyle: 'dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '160px' }}>
            <Plus size={24} style={{ color: '#00ff9d', marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Add New Data Source</div>
            <p style={{ fontSize: '0.7rem', color: '#8a8f98' }}>Stripe, ADP, Gusto, or CSV</p>
          </div>
        </div>
      )}

      {activeTab === 'mapping' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Source Field Mapping</h3>
              <p style={{ fontSize: '0.8rem', color: '#8a8f98' }}>Normalize disparate data schemas into your unified FinOps model.</p>
            </div>
            <button className="btn-action">Save Schema</button>
          </div>
          
          <table className="mapping-table">
            <thead>
              <tr>
                <th>Source Field (External)</th>
                <th></th>
                <th>Target Variable (Internal)</th>
                <th>Transformation</th>
                <th>Validation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="mono">qbo.line_items.amount</span></td>
                <td><ArrowRight size={14} color="#00ff9d" /></td>
                <td><span style={{ fontWeight: 600 }}>gross_revenue</span></td>
                <td><span className="status-badge">Summation</span></td>
                <td><CheckCircle2 size={14} color="#00ff9d" /></td>
              </tr>
              <tr>
                <td><span className="mono">mercury.tx.description</span></td>
                <td><ArrowRight size={14} color="#00ff9d" /></td>
                <td><span style={{ fontWeight: 600 }}>expense_category</span></td>
                <td><span className="status-badge">AI Classifier</span></td>
                <td><CheckCircle2 size={14} color="#00ff9d" /></td>
              </tr>
              <tr>
                <td><span className="mono">stripe.payouts.net</span></td>
                <td><ArrowRight size={14} color="#00ff9d" /></td>
                <td><span style={{ fontWeight: 600 }}>net_cash_inflow</span></td>
                <td><span className="status-badge">Direct Map</span></td>
                <td><CheckCircle2 size={14} color="#00ff9d" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="automation-builder">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Trigger-Action Protocols</h3>
            <p style={{ fontSize: '0.8rem', color: '#8a8f98' }}>Automate financial hygiene and defensive maneuvers.</p>
          </div>

          <div className="logic-row">
            <Zap size={18} color="#00ff9d" />
            <div style={{ fontSize: '0.85rem' }}>
              IF <select className="input-field"><option>Monthly Burn Rate</option></select>
              IS GREATER THAN <input type="text" className="input-field" style={{ width: '80px' }} defaultValue="$45,000" />
            </div>
            <ArrowRight size={14} color="#8a8f98" />
            <div style={{ fontSize: '0.85rem' }}>
              THEN <select className="input-field"><option>Alert Slack: #finance-ops</option></select>
            </div>
          </div>

          <div className="logic-row" style={{ borderLeftColor: '#ffb800' }}>
            <Activity size={18} color="#ffb800" />
            <div style={{ fontSize: '0.85rem' }}>
              IF <select className="input-field"><option>Runway Forecast</option></select>
              DROPS BELOW <input type="text" className="input-field" style={{ width: '80px' }} defaultValue="4 Months" />
            </div>
            <ArrowRight size={14} color="#8a8f98" />
            <div style={{ fontSize: '0.85rem' }}>
              THEN <select className="input-field"><option>Generate Scenario: "Deep Cuts"</option></select>
            </div>
          </div>

          <div className="logic-row" style={{ borderLeftColor: '#ff4d4d' }}>
            <AlertTriangle size={18} color="#ff4d4d" />
            <div style={{ fontSize: '0.85rem' }}>
              IF <select className="input-field"><option>Vendor Payment</option></select>
              EXCEEDS <input type="text" className="input-field" style={{ width: '80px' }} defaultValue="200%" /> OF AVG
            </div>
            <ArrowRight size={14} color="#8a8f98" />
            <div style={{ fontSize: '0.85rem' }}>
              THEN <select className="input-field"><option>Flag for Fraud Review</option></select>
            </div>
          </div>

          <button className="btn-secondary" style={{ borderStyle: 'dashed', marginTop: '1rem', padding: '1rem' }}>
            <Plus size={14} style={{ marginRight: '8px' }} /> Add Automation Trigger
          </button>
        </div>
      )}

      <footer style={{ marginTop: '4rem', padding: '2rem', background: '#0d0f14', border: '1px solid #1f242d', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(0, 255, 157, 0.1)', padding: '1rem', borderRadius: '50%' }}>
          <ShieldCheck color="#00ff9d" size={24} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Security Protocol: Active</h4>
          <p style={{ fontSize: '0.75rem', color: '#8a8f98' }}>All connections use AES-256 encryption. Read-only permissions requested by default. SOC2 Type II Compliant processing.</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn-secondary">Security Log</button>
        </div>
      </footer>
    </div>
  );
};

export default SourceMappingTool;