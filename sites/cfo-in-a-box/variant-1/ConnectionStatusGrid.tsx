import React, { useState } from 'react';

const ConnectionStatusGrid = () => {
  const [connections, setConnections] = useState([
    { id: 1, name: 'Mercury Bank', type: 'Banking', status: 'connected', lastSync: '2m ago', icon: '🏦' },
    { id: 2, name: 'QuickBooks Online', type: 'Accounting', status: 'connected', lastSync: '1h ago', icon: '📊' },
    { id: 3, name: 'Gusto', type: 'Payroll', status: 'syncing', lastSync: 'Now', icon: '👥' },
    { id: 4, name: 'Stripe', type: 'Payments', status: 'error', lastSync: '12h ago', icon: '💳' }
  ]);

  const [automations, setAutomations] = useState([
    { id: 1, trigger: 'Burn Rate > $15k/mo', action: 'Notify Founder + Flag Expenses', active: true },
    { id: 2, trigger: 'Runway < 6 Months', action: 'Draft Funding Deck + Alert Advisor', active: true },
    { id: 3, trigger: 'Subscription Spike > 15%', action: 'Identify Cost Leak', active: false }
  ]);

  const styles = {
    wrapper: {
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px',
      minHeight: '100vh',
    },
    header: {
      marginBottom: '32px',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '800',
      letterSpacing: '-0.03em',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#8a8f98',
      fontSize: '0.9rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '48px',
    },
    card: {
      backgroundColor: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '8px',
      padding: '20px',
      position: 'relative',
      transition: '0.2s',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
    },
    iconBox: {
      fontSize: '1.5rem',
      background: '#14171c',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
    },
    statusBadge: {
      fontSize: '0.65rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      padding: '4px 8px',
      borderRadius: '4px',
      letterSpacing: '0.05em',
    },
    connected: { color: '#00ff9d', background: 'rgba(0, 255, 157, 0.1)', border: '1px solid #00ff9d' },
    syncing: { color: '#ffb800', background: 'rgba(255, 184, 0, 0.1)', border: '1px solid #ffb800' },
    error: { color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid #ff4d4d' },
    mono: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem',
      color: '#8a8f98',
    },
    automationSection: {
      background: '#14171c',
      borderRadius: '12px',
      border: '1px solid #1f242d',
      padding: '32px',
    },
    autoRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid #1f242d',
    },
    toggle: {
      width: '40px',
      height: '20px',
      borderRadius: '20px',
      position: 'relative',
      cursor: 'pointer',
      transition: '0.3s',
    },
    btn: {
      background: 'transparent',
      border: '1px solid #1f242d',
      color: '#ffffff',
      padding: '8px 16px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      cursor: 'pointer',
      fontWeight: '600',
    }
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={{ color: '#00ff9d', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase' }}>Engine Room</div>
        <h2 style={styles.title}>FinanceOps Integration Hub</h2>
        <p style={styles.subtitle}>Connect your business ecosystem and orchestrate autonomous financial triggers.</p>
      </header>

      <div style={styles.grid}>
        {connections.map((conn) => (
          <div key={conn.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.iconBox}>{conn.icon}</div>
              <span style={{ ...styles.statusBadge, ...styles[conn.status] }}>
                {conn.status}
              </span>
            </div>
            <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{conn.name}</h4>
            <div style={{ fontSize: '0.8rem', color: '#8a8f98', marginBottom: '16px' }}>{conn.type}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={styles.mono}>Last Sync: {conn.lastSync}</span>
              <button style={styles.btn}>Settings</button>
            </div>
          </div>
        ))}
        <div style={{ ...styles.card, border: '1px dashed #1f242d', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: '1.5rem', color: '#00ff9d', marginBottom: '8px' }}>+</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Add Integration</span>
        </div>
      </div>

      <div style={styles.automationSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>FinOps Automation Builder</h3>
          <button style={{ ...styles.btn, background: '#00ff9d', color: '#000', border: 'none' }}>+ New Recipe</button>
        </div>

        {automations.map((auto) => (
          <div key={auto.id} style={styles.autoRow}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>
                <span style={{ color: '#00ff9d', marginRight: '8px' }}>IF</span> {auto.trigger}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#8a8f98' }}>
                <span style={{ color: '#ffb800', marginRight: '8px' }}>THEN</span> {auto.action}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={styles.mono}>{auto.active ? 'ACTIVE' : 'PAUSED'}</span>
              <div 
                style={{ 
                  ...styles.toggle, 
                  backgroundColor: auto.active ? '#00ff9d' : '#1f242d' 
                }}
              >
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: '#fff', 
                  borderRadius: '50%', 
                  position: 'absolute', 
                  top: '2px', 
                  left: auto.active ? '22px' : '2px',
                  transition: '0.2s'
                }} />
              </div>
            </div>
          </div>
        ))}
        
        <div style={{ marginTop: '24px', padding: '12px', background: '#0d0f14', borderLeft: '3px solid #00ff9d', borderRadius: '0 4px 4px 0' }}>
          <span style={{ ...styles.mono, color: '#00ff9d' }}>&gt; HUB_STATUS: Monitoring 4 data streams. 2 active automations ready.</span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatusGrid;