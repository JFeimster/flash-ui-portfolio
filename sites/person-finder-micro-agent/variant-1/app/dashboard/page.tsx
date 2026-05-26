import React from 'react';

const Dashboard = () => {
  return (
    <div style={{
      backgroundColor: '#0a0c10',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-dark: #0a0c10;
          --bg-card: #11141b;
          --border: #1f242d;
          --primary: #3b82f6;
          --primary-glow: rgba(59, 130, 246, 0.5);
          --text-main: #e2e8f0;
          --text-dim: #94a3b8;
          --accent: #10b981;
          --warning: #f59e0b;
          --input-bg: #07090d;
        }

        .dashboard-container {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
        }

        .side-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-main);
        }

        .nav-item.active {
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
        }

        .stat-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
        }

        .history-table {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr auto;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-dim);
          letter-spacing: 0.1em;
          background: rgba(255,255,255,0.02);
        }

        .table-row {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr auto;
          align-items: center;
          transition: background 0.2s;
        }

        .table-row:hover {
          background: rgba(255,255,255,0.01);
        }

        .company-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .company-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .company-url {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-family: 'JetBrains Mono', monospace;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-active { background: rgba(59, 130, 246, 0.1); color: var(--primary); }
        .status-complete { background: rgba(16, 185, 129, 0.1); color: var(--accent); }
        .status-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }

        .btn-action {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .btn-action:hover {
          background: var(--border);
          border-color: var(--text-dim);
        }

        .pulse-small {
          width: 6px;
          height: 6px;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse-ring 1.5s infinite;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}} />

      <div className="dashboard-container">
        {/* Sidebar Nav */}
        <aside className="side-nav">
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
            <div style={{ width: '28px', height: '28px', background: '#3b82f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Finder Hub</span>
          </div>

          <div className="nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Monitoring
          </div>
          <div className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Search Logs
          </div>
          <div className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Verified Leads
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Micro-Agent Commander</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Real-time status of active search sequences and historical data.</p>
          </header>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Active Agents</div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>04</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Leads Verified</div>
              <div className="stat-value" style={{ color: 'var(--accent)' }}>1,492</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Discovery Rate</div>
              <div className="stat-value">91.4%</div>
            </div>
          </div>

          <div className="history-table">
            <div className="table-header">
              <div>Target Entity</div>
              <div>Search Status</div>
              <div>Intelligence</div>
              <div>Last Run</div>
              <div>Action</div>
            </div>

            {/* Row 1: Active */}
            <div className="table-row">
              <div className="company-info">
                <span className="company-name">Quantum Dynamics Ltd</span>
                <span className="company-url">quantum-dyn.io</span>
              </div>
              <div>
                <span className="status-pill status-active">
                  <div className="pulse-small"></div>
                  Crawling SOS
                </span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>2 Matches</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Just now</div>
              <button className="btn-action">View Live</button>
            </div>

            {/* Row 2: Success */}
            <div className="table-row">
              <div className="company-info">
                <span className="company-name">Global Logistics Hub</span>
                <span className="company-url">gl-hub.com</span>
              </div>
              <div>
                <span className="status-pill status-complete">Completed</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>5 Matches</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>2h ago</div>
              <button className="btn-action">Export</button>
            </div>

            {/* Row 3: Generic/Warning */}
            <div className="table-row">
              <div className="company-info">
                <span className="company-name">Austin Real Estate Group</span>
                <span className="company-url">austin-reg.com</span>
              </div>
              <div>
                <span className="status-pill status-warning">Low Signal</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: 'var(--warning)' }}>info@ only</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>5h ago</div>
              <button className="btn-action" style={{ color: 'var(--primary)', borderColor: 'rgba(59,130,246,0.3)' }}>Deep Rescan</button>
            </div>

            {/* Row 4: Success */}
            <div className="table-row">
              <div className="company-info">
                <span className="company-name">Silverstone Partners</span>
                <span className="company-url">silverstone.vc</span>
              </div>
              <div>
                <span className="status-pill status-complete">Completed</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>1 Match</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Yesterday</div>
              <button className="btn-action">Export</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;