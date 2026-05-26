import React from 'react';

const DocumentHealthCheck = () => {
  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          
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
          }

          .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
          .ready-score-glow {
            text-shadow: 0 0 20px var(--glow);
          }
          .progress-bar {
            height: 6px;
            background: var(--border);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 8px;
          }
          .progress-fill {
            height: 100%;
            background: var(--primary);
            transition: width 1s ease-in-out;
          }
          .status-tag {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
          }
          .status-clean { background: rgba(0, 255, 157, 0.1); color: var(--primary); border: 1px solid var(--primary); }
          .status-messy { background: rgba(255, 184, 0, 0.1); color: var(--secondary); border: 1px solid var(--secondary); }
          .status-missing { background: rgba(255, 77, 77, 0.1); color: var(--danger); border: 1px solid var(--danger); }
          
          .doc-card {
            background: var(--bg-surface);
            border: 1px solid var(--border);
            padding: 20px;
            border-radius: 8px;
            transition: 0.2s;
          }
          .doc-card:hover {
            border-color: #333;
            transform: translateY(-2px);
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Header Section */}
        <header style={styles.header}>
          <div>
            <div style={styles.badge}>Funding Readiness Portal</div>
            <h1 style={styles.title}>Document Health <span style={{color: 'var(--primary)'}}>&</span> Audit</h1>
            <p style={styles.subtitle}>Transforming your financial "crime scene" into a clean, investor-ready data room.</p>
          </div>
          <div style={styles.scoreContainer}>
            <div className="mono" style={styles.scoreLabel}>READINESS SCORE</div>
            <div className="ready-score-glow" style={styles.scoreValue}>72<span style={{fontSize: '1.5rem', color: '#444'}}>/100</span></div>
            <div className="mono" style={{color: 'var(--primary)', fontSize: '0.7rem'}}>+12pts from last month</div>
          </div>
        </header>

        <div style={styles.grid}>
          {/* Left Column: Health Audit */}
          <div style={styles.auditColumn}>
            <div style={styles.sectionHeader}>
              <h3 className="mono" style={{color: 'var(--text-main)'}}>FINANCIAL HYGIENE CHECKLIST</h3>
            </div>
            
            <div style={styles.docGrid}>
              <div className="doc-card">
                <div style={styles.cardTop}>
                  <span className="mono">01. P&L Statement (24mo)</span>
                  <span className="status-tag status-clean">Clean</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width: '95%'}}></div></div>
                <p style={styles.cardMeta}>Verified against bank sync. Monthly granularity active.</p>
              </div>

              <div className="doc-card">
                <div style={styles.cardTop}>
                  <span className="mono">02. Cap Table</span>
                  <span className="status-tag status-messy">Needs Work</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width: '45%', background: 'var(--secondary)'}}></div></div>
                <p style={styles.cardMeta}>Found 2 unallocated option pools. Documentation missing for SAFE #3.</p>
              </div>

              <div className="doc-card">
                <div style={styles.cardTop}>
                  <span className="mono">03. Corporate Tax Returns</span>
                  <span className="status-tag status-clean">Ready</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width: '100%'}}></div></div>
                <p style={styles.cardMeta}>2021, 2022, 2023 filings uploaded and indexed.</p>
              </div>

              <div className="doc-card">
                <div style={styles.cardTop}>
                  <span className="mono">04. Customer Contracts</span>
                  <span className="status-tag status-missing">Missing</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width: '5%', background: 'var(--danger)'}}></div></div>
                <p style={styles.cardMeta}>Required for Revenue Recognition audit. 0/12 files found.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Data Room Generator */}
          <div style={styles.sideColumn}>
            <div style={styles.generatorCard}>
              <h3 style={{marginBottom: '1rem'}}>Investor Data Room</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
                Automatically package your "Clean" documents into a structured, secure portal for VCs or Lenders.
              </p>
              
              <div style={styles.filePreview}>
                <div className="mono" style={styles.fileItem}>📁 Financial_Model_V4.xlsx</div>
                <div className="mono" style={styles.fileItem}>📁 Bylaws_Executed.pdf</div>
                <div className="mono" style={styles.fileItem}>📁 Q3_Reporting_Package.pdf</div>
              </div>

              <button style={styles.primaryBtn}>Generate Data Room Link</button>
              <div style={{textAlign: 'center', marginTop: '1rem'}}>
                <a href="#" className="mono" style={styles.ghostLink}>Preview Live Room</a>
              </div>
            </div>

            <div style={styles.aiPanel}>
              <div className="mono" style={{color: 'var(--primary)', marginBottom: '10px'}}>&gt; AI_AUDITOR_NOTICE</div>
              <p style={{fontSize: '0.85rem', lineHeight: '1.4'}}>
                Your "Burn Rate" consistency across Stripe vs. Bank Statements shows a 4% variance. 
                Investors will flag this. Recommend running a <span style={{color: 'var(--primary)'}}>Reconciliation Sprint</span> before sharing the Data Room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: '#050608',
    color: '#ffffff',
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '60px',
    borderBottom: '1px solid #1f242d',
    paddingBottom: '30px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    background: '#1f242d',
    color: '#00ff9d',
    border: '1px solid #00ff9d',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    letterSpacing: '-0.04em',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#8a8f98',
    fontSize: '1rem',
    maxWidth: '500px',
  },
  scoreContainer: {
    textAlign: 'right',
  },
  scoreLabel: {
    fontSize: '0.75rem',
    color: '#8a8f98',
    marginBottom: '4px',
  },
  scoreValue: {
    fontSize: '4rem',
    fontWeight: '800',
    lineHeight: '1',
    letterSpacing: '-0.05em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '40px',
  },
  sectionHeader: {
    marginBottom: '24px',
    borderLeft: '2px solid #00ff9d',
    paddingLeft: '16px',
  },
  docGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  cardMeta: {
    fontSize: '0.8rem',
    color: '#8a8f98',
    marginTop: '12px',
  },
  generatorCard: {
    background: '#0d0f14',
    border: '1px solid #1f242d',
    padding: '30px',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
  },
  filePreview: {
    background: '#050608',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '20px',
    border: '1px solid #1f242d',
  },
  fileItem: {
    fontSize: '0.75rem',
    color: '#8a8f98',
    marginBottom: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  primaryBtn: {
    width: '100%',
    padding: '14px',
    background: '#00ff9d',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  ghostLink: {
    fontSize: '0.75rem',
    color: '#8a8f98',
    textDecoration: 'none',
    borderBottom: '1px solid #333',
    paddingBottom: '2px',
  },
  aiPanel: {
    marginTop: '20px',
    background: 'linear-gradient(135deg, #14171c 0%, #0d0f14 100%)',
    borderLeft: '3px solid #00ff9d',
    padding: '20px',
    borderRadius: '0 8px 8px 0',
  },
};

export default DocumentHealthCheck;

```