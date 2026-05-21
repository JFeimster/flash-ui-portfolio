import React from 'react';

interface Alert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'OPTIMIZATION';
  title: string;
  description: string;
  timestamp: string;
  impact: string;
}

const alerts: Alert[] = [
  {
    id: 'SIG-902',
    type: 'CRITICAL',
    title: 'Runway Threshold Breach',
    description: 'Projected runway has dropped below the 4-month safety margin due to increased burn in Sales Ops.',
    timestamp: '12m ago',
    impact: '-1.2mo Runway'
  },
  {
    id: 'SIG-441',
    type: 'WARNING',
    title: 'Anomalous Cost Leak',
    description: 'AWS Cloudfront usage is 45% above historical baseline for this billing cycle. No corresponding traffic spike detected.',
    timestamp: '2h ago',
    impact: '$1,240 Est. Loss'
  },
  {
    id: 'SIG-109',
    type: 'OPTIMIZATION',
    title: 'SaaS Subscription Bloat',
    description: 'Identified 4 duplicate seat licenses for "Design-Pro-Tool" across different departments.',
    timestamp: '5h ago',
    impact: '+$320/mo Savings'
  },
  {
    id: 'SIG-055',
    type: 'WARNING',
    title: 'AR Collection Delay',
    description: 'Two Tier-1 invoices (Invoice #4401, #4402) are now 15 days past due. Cash flow impact imminent.',
    timestamp: '1d ago',
    impact: '$18,500 Locked'
  }
];

const SignalAlertList: React.FC = () => {
  return (
    <div className="signal-container">
      <style>{`
        .signal-container {
          background: #0d0f14;
          border: 1px solid #1f242d;
          border-radius: 8px;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          width: 100%;
          max-width: 500px;
          overflow: hidden;
        }

        .signal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #1f242d;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
        }

        .signal-header h3 {
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin: 0;
        }

        .signal-count {
          background: #ff4d4d;
          color: #000;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 2px;
        }

        .alert-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .alert-item {
          padding: 20px;
          border-bottom: 1px solid #1f242d;
          display: flex;
          gap: 16px;
          transition: background 0.2s;
          cursor: pointer;
        }

        .alert-item:hover {
          background: #14171c;
        }

        .alert-item:last-child {
          border-bottom: none;
        }

        .alert-indicator {
          width: 4px;
          height: 100%;
          min-height: 60px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .bg-critical { background: #ff4d4d; box-shadow: 0 0 10px rgba(255, 77, 77, 0.3); }
        .bg-warning { background: #ffb800; box-shadow: 0 0 10px rgba(255, 184, 0, 0.2); }
        .bg-optimization { background: #00ff9d; box-shadow: 0 0 10px rgba(0, 255, 157, 0.2); }

        .alert-content {
          flex-grow: 1;
        }

        .alert-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .alert-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #8a8f98;
        }

        .alert-time {
          font-size: 0.7rem;
          color: #444;
        }

        .alert-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 4px;
          color: #ffffff;
        }

        .alert-desc {
          font-size: 0.85rem;
          color: #8a8f98;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .alert-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-impact {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .text-critical { color: #ff4d4d; }
        .text-warning { color: #ffb800; }
        .text-optimization { color: #00ff9d; }

        .action-link {
          font-size: 0.75rem;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          opacity: 0.6;
          transition: 0.2s;
        }

        .action-link:hover {
          opacity: 1;
          color: #00ff9d;
        }
      `}</style>

      <div className="signal-header">
        <h3>Financial Signals</h3>
        <span className="signal-count">4 NEW</span>
      </div>

      <ul className="alert-list">
        {alerts.map((alert) => (
          <li key={alert.id} className="alert-item">
            <div className={`alert-indicator bg-${alert.type.toLowerCase()}`} />
            <div className="alert-content">
              <div className="alert-meta">
                <span className="alert-id">{alert.id}</span>
                <span className="alert-time">{alert.timestamp}</span>
              </div>
              <div className="alert-title">{alert.title}</div>
              <p className="alert-desc">{alert.description}</p>
              <div className="alert-footer">
                <span className={`alert-impact text-${alert.type.toLowerCase()}`}>
                  {alert.impact}
                </span>
                <a href="#" className="action-link">
                  INVESTIGATE <span>→</span>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SignalAlertList;