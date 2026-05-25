import React, { useState } from 'react';
import { 
  Zap, 
  Settings, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Plus, 
  Bell, 
  ArrowRight,
  BarChart3,
  CreditCard,
  Briefcase,
  AlertTriangle,
  Slack,
  Mail
} from 'lucide-react';

const IntegrationsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connections' | 'automation'>('connections');

  const integrations = [
    { name: 'QuickBooks', type: 'Accounting', status: 'Connected', icon: <Database size={20} />, lastSync: '12 mins ago' },
    { name: 'Xero', type: 'Accounting', status: 'Disconnected', icon: <Database size={20} />, lastSync: '-' },
    { name: 'Mercury', type: 'Banking', status: 'Connected', icon: <CreditCard size={20} />, lastSync: '1 hour ago' },
    { name: 'Stripe', type: 'Payments', status: 'Connected', icon: <Zap size={20} />, lastSync: 'Live' },
    { name: 'Gusto', type: 'Payroll', status: 'Connected', icon: <Briefcase size={20} />, lastSync: '2 days ago' },
    { name: 'Plaid', type: 'Data', status: 'Connected', icon: <ShieldCheck size={20} />, lastSync: 'Live' },
  ];

  const automations = [
    { trigger: 'Burn Rate > $15,000/mo', action: 'Notify #finance-ops Slack', status: true },
    { trigger: 'Cash Runway < 4 Months', action: 'Generate Emergency P&L', status: true },
    { trigger: 'Expense > $2,000 (Single)', action: 'Request Founder Approval', status: false },
  ];

  const styles = {
    container: {
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px',
      minHeight: '100vh',
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
      letterSpacing: '-0.04em',
      marginBottom: '10px',
    },
    subtitle: {
      color: '#8a8f98',
      fontSize: '1rem',
      maxWidth: '600px',
    },
    tabContainer: {
      display: 'flex',
      gap: '20px',
      borderBottom: '1px solid #1f242d',
      marginBottom: '32px',
    },
    tab: (active: boolean) => ({
      padding: '12px 24px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: active ? '#00ff9d' : '#8a8f98',
      borderBottom: active ? '2px solid #00ff9d' : '2px solid transparent',
      transition: '0.2s',
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px',
    },
    card: {
      background: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '8px',
      padding: '24px',
      transition: '0.3s',
    },
    mono: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.8rem',
    },
    statusIndicator: (status: string) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: status === 'Connected' ? '#00ff9d' : '#ff4d4d',
      display: 'inline-block',
      marginRight: '8px',
    }),
    automationBuilder: {
      background: '#14171c',
      borderRadius: '12px',
      border: '1px solid #1f242d',
      padding: '32px',
      marginTop: '20px',
    },
    triggerBox: {
      background: '#050608',
      border: '1px solid #1f242d',
      padding: '16px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
    },
    actionArrow: {
      color: '#00ff9d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
    },
    btnPrimary: {
      background: '#00ff9d',
      color: '#000',
      padding: '10px 20px',
      borderRadius: '4px',
      fontWeight: 700,
      fontSize: '0.85rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>System Hub</div>
        <h1 style={styles.title}>FinanceOps Engine Room</h1>
        <p style={styles.subtitle}>
          Connect your financial stack and build autonomous triggers to protect your runway and automate reporting.
        </p>
      </div>

      <div style={styles.tabContainer}>
        <div 
          style={styles.tab(activeTab === 'connections')} 
          onClick={() => setActiveTab('connections')}
        >
          API Connections
        </div>
        <div 
          style={styles.tab(activeTab === 'automation')} 
          onClick={() => setActiveTab('automation')}
        >
          Automation Builder
        </div>
      </div>

      {activeTab === 'connections' ? (
        <div style={styles.grid}>
          {integrations.map((item, idx) => (
            <div key={idx} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ color: '#00ff9d' }}>{item.icon}</div>
                <div style={{ ...styles.mono, color: '#8a8f98' }}>{item.type}</div>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <span style={styles.statusIndicator(item.status)}></span>
                <span style={{ fontSize: '0.85rem', color: item.status === 'Connected' ? '#fff' : '#8a8f98' }}>
                  {item.status}
                </span>
              </div>
              <div style={{ borderTop: '1px solid #1f242d', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#8a8f98' }}>Last Sync: {item.lastSync}</span>
                <button style={{ background: 'transparent', border: 'none', color: '#8a8f98', cursor: 'pointer' }}>
                  <Settings size={16} />
                </button>
              </div>
            </div>
          ))}
          <div style={{ ...styles.card, borderStyle: 'dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Plus size={32} color="#1f242d" style={{ marginBottom: '12px' }} />
            <span style={{ fontSize: '0.9rem', color: '#8a8f98' }}>Add New Integration</span>
          </div>
        </div>
      ) : (
        <div>
          <div style={styles.automationBuilder}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Active FinOps Triggers</h3>
              <button style={styles.btnPrimary}><Plus size={16} /> New Rule</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {automations.map((rule, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={styles.triggerBox}>
                    <AlertTriangle size={18} color="#ffb800" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase' }}>If Trigger</div>
                      <div style={{ ...styles.mono, fontSize: '0.9rem' }}>{rule.trigger}</div>
                    </div>
                  </div>
                  <div style={styles.actionArrow}><ArrowRight size={20} /></div>
                  <div style={{ ...styles.triggerBox, borderLeft: '3px solid #00ff9d' }}>
                    <Zap size={18} color="#00ff9d" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase' }}>Then Execute</div>
                      <div style={{ ...styles.mono, fontSize: '0.9rem' }}>{rule.action}</div>
                    </div>
                  </div>
                  <div style={{ marginLeft: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '20px', 
                      background: rule.status ? '#00ff9d' : '#1f242d', 
                      borderRadius: '20px',
                      position: 'relative',
                      cursor: 'pointer'
                    }}>
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        background: rule.status ? '#000' : '#8a8f98', 
                        borderRadius: '50%', 
                        position: 'absolute', 
                        top: '2px', 
                        right: rule.status ? '2px' : '22px',
                        transition: '0.2s'
                      }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <Slack size={24} style={{ marginBottom: '12px', color: '#8a8f98' }} />
              <div style={{ fontSize: '0.85rem' }}>Slack Alerts</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <Mail size={24} style={{ marginBottom: '12px', color: '#8a8f98' }} />
              <div style={{ fontSize: '0.85rem' }}>Executive Summaries</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <BarChart3 size={24} style={{ marginBottom: '12px', color: '#8a8f98' }} />
              <div style={{ fontSize: '0.85rem' }}>Webhook Outbound</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '60px', padding: '24px', borderTop: '1px solid #1f242d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(0,255,157,0.1)', borderRadius: '4px' }}>
            <RefreshCw size={18} color="#00ff9d" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Auto-Sync Active</div>
            <div style={{ fontSize: '0.75rem', color: '#8a8f98' }}>Polling 14 data sources every 15 minutes</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ ...styles.mono, color: '#8a8f98', background: '#14171c', padding: '4px 8px', borderRadius: '4px' }}>ENC_AES_256</div>
          <div style={{ ...styles.mono, color: '#8a8f98', background: '#14171c', padding: '4px 8px', borderRadius: '4px' }}>SOC2_COMPLIANT</div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsHub;