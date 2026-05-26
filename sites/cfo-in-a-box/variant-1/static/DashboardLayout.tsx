import React, { useState } from 'react';

const DashboardLayout: React.FC = () => {
  const [chatInput, setChatInput] = useState("");

  const styles = `
    :root {
      --bg-deep: #050608;
      --bg-card: #0d0f14;
      --bg-surface: #14171c;
      --primary: #00ff9d;
      --secondary: #ffb800;
      --danger: #ff4d4d;
      --text-main: #ffffff;
      --text-muted: #8a8f98;
      --border: #1f242d;
      --glow: rgba(0, 255, 157, 0.15);
      --font-mono: 'JetBrains Mono', monospace;
    }

    .dashboard-wrapper {
      display: grid;
      grid-template-columns: 240px 1fr 340px;
      height: 100vh;
      background-color: var(--bg-deep);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      overflow: hidden;
    }

    /* Left Sidebar */
    .sidebar {
      background: var(--bg-card);
      border-right: 1px solid var(--border);
      padding: 24px;
      display: flex;
      flex-direction: column;
    }

    .logo {
      font-weight: 800;
      font-size: 1.1rem;
      letter-spacing: -0.04em;
      margin-bottom: 40px;
    }

    .logo span { color: var(--primary); }

    .nav-group { margin-bottom: 32px; }
    .nav-label { 
      font-size: 0.65rem; 
      text-transform: uppercase; 
      color: #444; 
      font-weight: 700; 
      margin-bottom: 12px; 
      letter-spacing: 0.05em;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      border-radius: 6px;
      margin-bottom: 4px;
      transition: 0.2s;
    }

    .nav-item:hover { background: var(--bg-surface); color: var(--text-main); }
    .nav-item.active { background: var(--bg-surface); color: var(--primary); font-weight: 600; }

    /* Main Content Area */
    .main-content {
      overflow-y: auto;
      padding: 32px;
      background: linear-gradient(180deg, #080a0f 0%, #050608 100%);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .header h1 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
    .date-badge { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); }

    /* Signal Alerts */
    .signal-strip {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
    }

    .signal-card {
      flex: 1;
      background: rgba(255, 77, 77, 0.05);
      border: 1px solid rgba(255, 77, 77, 0.2);
      padding: 16px;
      border-radius: 8px;
      display: flex;
      gap: 12px;
    }

    .signal-card.warning {
      background: rgba(255, 184, 0, 0.05);
      border: 1px solid rgba(255, 184, 0, 0.2);
    }

    .signal-icon { font-size: 1.2rem; }
    .signal-body h4 { font-size: 0.85rem; margin-bottom: 4px; }
    .signal-body p { font-size: 0.75rem; color: var(--text-muted); }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      padding: 24px;
      border-radius: 12px;
    }

    .stat-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
    .stat-value { font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
    .stat-sub { font-family: var(--font-mono); font-size: 0.75rem; }

    /* Heatmap Area */
    .heatmap-section {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }

    .heatmap-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .heatmap-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 8px;
    }

    .heatmap-col { display: flex; flex-direction: column; gap: 8px; align-items: center; }
    .heatmap-box {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 4px;
      background: var(--bg-surface);
    }

    .heatmap-box.high { background: var(--primary); opacity: 0.8; }
    .heatmap-box.med { background: var(--primary); opacity: 0.4; }
    .heatmap-box.low { background: var(--primary); opacity: 0.1; }
    .heatmap-label { font-size: 0.6rem; color: var(--text-muted); margin-top: 8px; font-family: var(--font-mono); }

    /* AI Chat Sidebar */
    .ai-cfo-bar {
      background: var(--bg-card);
      border-left: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }

    .ai-header {
      padding: 24px;
      border-bottom: 1px solid var(--border);
    }

    .ai-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--primary);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: var(--primary);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--primary);
    }

    .chat-history {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .msg { font-size: 0.85rem; line-height: 1.5; }
    .msg.ai { color: var(--text-main); border-left: 2px solid var(--primary); padding-left: 12px; }
    .msg.user { color: var(--text-muted); text-align: right; }

    .chat-input-area {
      padding: 24px;
      border-top: 1px solid var(--border);
    }

    .chat-input-wrapper {
      position: relative;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
    }

    .chat-input-wrapper textarea {
      background: transparent;
      border: none;
      color: white;
      width: 100%;
      resize: none;
      font-family: inherit;
      font-size: 0.85rem;
      outline: none;
    }

    .mono { font-family: var(--font-mono); }
    .up { color: var(--primary); }
    .down { color: var(--danger); }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-wrapper">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">CFO-IN-A-<span>BOX</span></div>
          
          <div className="nav-group">
            <div className="nav-label">Command</div>
            <a href="#" className="nav-item active">
              <span>📊</span> Dashboard
            </a>
            <a href="#" className="nav-item">
              <span>📉</span> Cash Flow
            </a>
            <a href="#" className="nav-item">
              <span>🔮</span> Scenario Builder
            </a>
          </div>

          <div className="nav-group">
            <div className="nav-label">Health</div>
            <a href="#" className="nav-item">
              <span>🛡️</span> Funding Readiness
            </a>
            <a href="#" className="nav-item">
              <span>🔍</span> Cost Leaks
            </a>
          </div>

          <div className="nav-group" style={{ marginTop: 'auto' }}>
            <a href="#" className="nav-item">
              <span>⚙️</span> Settings
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="header">
            <div>
              <h1>Command Center</h1>
              <div className="date-badge">SYSTEM_STATUS: OPERATIONAL // OCT 24, 2023</div>
            </div>
            <button className="nav-item" style={{ border: '1px solid var(--border)' }}>
              Export Report
            </button>
          </header>

          {/* Financial Signals */}
          <div className="signal-strip">
            <div className="signal-card">
              <span className="signal-icon">🚨</span>
              <div className="signal-body">
                <h4>High-Priority: Cost Leak</h4>
                <p>Detected $420/mo in redundant SaaS subscriptions (Zoom/Meet overlap).</p>
              </div>
            </div>
            <div className="signal-card warning">
              <span className="signal-icon">⚠️</span>
              <div className="signal-body">
                <h4>Runway Alert</h4>
                <p>Burn increased 12% this month. Runway adjusted to 5.2 months.</p>
              </div>
            </div>
          </div>

          {/* Core Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Monthly Burn</div>
              <div className="stat-value">$14,240</div>
              <div className="stat-sub down">↑ 12% vs last month</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Net Runway</div>
              <div className="stat-value">6.2 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>mo</span></div>
              <div className="stat-sub up">Critical threshold: 3.0 mo</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cash on Hand</div>
              <div className="stat-value">$88,432</div>
              <div className="stat-sub mono" style={{ color: '#555' }}>Settled: $82,100</div>
            </div>
          </div>

          {/* Heatmap Section */}
          <section className="heatmap-section">
            <div className="heatmap-header">
              <div className="nav-label" style={{ margin: 0 }}>Cash Flow Velocity (12 Months)</div>
              <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>[ VIEW DETAILED LEDGER ]</div>
            </div>
            <div className="heatmap-grid">
              {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => (
                <div key={month} className="heatmap-col">
                  <div className="heatmap-box high"></div>
                  <div className="heatmap-box med"></div>
                  <div className="heatmap-box low"></div>
                  <div className="heatmap-box med"></div>
                  <div className="heatmap-label">{month}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* AI CFO Sidebar */}
        <aside className="ai-cfo-bar">
          <div className="ai-header">
            <div className="ai-status">
              <div className="status-dot"></div>
              <span>AI CFO ONLINE</span>
            </div>
            <h3 style={{ marginTop: '8px', fontSize: '1rem' }}>Financial Advisor</h3>
          </div>

          <div className="chat-history">
            <div className="msg ai">
              Good morning. I've analyzed your Q3 spending. You are currently spending 22% more on "Professional Services" than projected. Would you like to see the breakdown?
            </div>
            <div className="msg user">
              Yes, and tell me how that affects my Q1 hiring plan.
            </div>
            <div className="msg ai">
              Based on the current burn, if you proceed with the 2 engineering hires in January, your runway will drop to 4.1 months by March. I recommend delaying the second hire until MRR hits $25k.
            </div>
          </div>

          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <textarea 
                placeholder="Ask your CFO anything..." 
                rows={3}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#444' }}>CMD+ENTER TO SEND</span>
                <button style={{ background: 'var(--primary)', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}>SEND</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default DashboardLayout;