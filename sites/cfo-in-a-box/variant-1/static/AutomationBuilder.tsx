import React, { useState } from 'react';

const AutomationBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integrations' | 'automations'>('integrations');

  const styles = {
    container: {
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      padding: '40px',
    },
    header: {
      marginBottom: '40px',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      background: '#1f242d',
      color: '#00ff9d',
      border: '1px solid #00ff9d',
      marginBottom: '1rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#8a8f98',
      fontSize: '1rem',
    },
    hubGrid: {
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '32px',
      marginTop: '40px',
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    navItem: (active: boolean) => ({
      padding: '12px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 600,
      transition: '0.2s',
      backgroundColor: active ? '#14171c' : 'transparent',
      color: active ? '#00ff9d' : '#8a8f98',
      border: active ? '1px solid #1f242d' : '1px solid transparent',
    }),
    card: {
      background: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '12px',
      padding: '24px',
    },
    integrationGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    },
    connectorCard: {
      padding: '20px',
      background: '#14171c',
      border: '1px solid #1f242d',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    statusDot: (connected: boolean) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: connected ? '#00ff9d' : '#ff4d4d',
      boxShadow: connected ? '0 0 10px rgba(0, 255, 157, 0.5)' : 'none',
    }),
    mono: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.8rem',
      color: '#8a8f98',
    },
    automationRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: '#050608',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #1f242d',
      marginBottom: '12px',
    },
    input: {
      background: '#14171c',
      border: '1px solid #1f242d',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      outline: 'none',
    },
    btnPrimary: {
      background: '#00ff9d',
      color: '#000',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: '0.85rem',
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.badge}>Engine Room</div>
        <h1 style={styles.title}>FinanceOps Integration Hub</h1>
        <p style={styles.subtitle}>Connect your stack and build automated financial guardrails.</p>
      </header>

      <div style={styles.hubGrid}>
        <aside style={styles.sidebar}>
          <div 
            style={styles.navItem(activeTab === 'integrations')} 
            onClick={() => setActiveTab('integrations')}
          >
            Data Connectors
          </div>
          <div 
            style={styles.navItem(activeTab === 'automations')} 
            onClick={() => setActiveTab('automations')}
          >
            Automation Builder
          </div>
          <div style={{...styles.navItem(false), opacity: 0.5, cursor: 'not-allowed'}}>
            Activity Logs
          </div>
          <div style={{...styles.navItem(false), opacity: 0.5, cursor: 'not-allowed'}}>
            API Settings
          </div>
        </aside>

        <main>
          {activeTab === 'integrations' ? (
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem' }}>Active Connections</h3>
                <button style={styles.btnPrimary}>+ Add Connection</button>
              </div>
              
              <div style={styles.integrationGrid}>
                {[
                  { name: 'QuickBooks Online', status: 'Connected', lastSync: '2m ago', type: 'Accounting' },
                  { name: 'Plaid / Mercury', status: 'Connected', lastSync: '1h ago', type: 'Banking' },
                  { name: 'Gusto', status: 'Action Required', lastSync: 'N/A', type: 'Payroll' },
                  { name: 'Stripe', status: 'Connected', lastSync: '15m ago', type: 'Payments' }
                ].map((int, i) => (
                  <div key={i} style={styles.connectorCard}>
                    <div style={styles.statusDot(int.status === 'Connected')}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{int.name}</div>
                      <div style={styles.mono}>{int.type} • {int.lastSync}</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8a8f98', cursor: 'pointer' }}>Manage</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={styles.card}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem' }}>Automation Recipes</h3>
                <p style={{ color: '#8a8f98', fontSize: '0.85rem' }}>Trigger alerts or actions based on real-time financial thresholds.</p>
              </div>

              <div style={styles.automationRow}>
                <span style={styles.mono}>WHEN</span>
                <select style={styles.input}>
                  <option>Cash Runway</option>
                  <option>Monthly Burn</option>
                  <option>Expense Category</option>
                </select>
                <span style={styles.mono}>DROPS BELOW</span>
                <input type="text" style={{...styles.input, width: '80px'}} defaultValue="3" />
                <span style={styles.mono}>MONTHS, THEN</span>
                <select style={styles.input}>
                  <option>Notify Slack</option>
                  <option>Email Founder</option>
                  <option>Freeze Hiring</option>
                </select>
                <div style={{marginLeft: 'auto', display: 'flex', gap: '8px'}}>
                  <div style={{...styles.statusDot(true)}}></div>
                  <span style={{fontSize: '0.7rem', color: '#00ff9d'}}>ACTIVE</span>
                </div>
              </div>

              <div style={styles.automationRow}>
                <span style={styles.mono}>WHEN</span>
                <select style={styles.input}>
                  <option>Software Spend</option>
                  <option>Ad Spend</option>
                  <option>Travel</option>
                </select>
                <span style={styles.mono}>INCREASES BY</span>
                <input type="text" style={{...styles.input, width: '80px'}} defaultValue="15" />
                <span style={styles.mono}>% MoM, THEN</span>
                <select style={styles.input}>
                  <option>Create Cost Leak Alert</option>
                  <option>Notify Admin</option>
                </select>
                <div style={{marginLeft: 'auto', display: 'flex', gap: '8px'}}>
                  <div style={{...styles.statusDot(true)}}></div>
                  <span style={{fontSize: '0.7rem', color: '#00ff9d'}}>ACTIVE</span>
                </div>
              </div>

              <div style={{...styles.automationRow, opacity: 0.6, borderStyle: 'dashed'}}>
                <span style={{...styles.mono, width: '100%', textAlign: 'center', cursor: 'pointer'}}>+ Click to add new automation logic</span>
              </div>

              <div style={{ marginTop: '32px', padding: '20px', background: 'linear-gradient(90deg, #14171c, #0d0f14)', borderRadius: '8px', borderLeft: '3px solid #ffb800' }}>
                <div style={{...styles.mono, color: '#ffb800', marginBottom: '8px'}}>&gt; AI_OPTIMIZATION_ENGINE</div>
                <p style={{fontSize: '0.85rem', color: '#8a8f98'}}>Based on your QuickBooks data, I recommend setting an automation for <strong>"Cloud Infrastructure"</strong>. Costs have fluctuated by 30% in the last 60 days.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      ` }} />
    </div>
  );
};

export default AutomationBuilder;
```