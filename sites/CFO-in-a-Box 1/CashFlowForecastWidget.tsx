import React from 'react';
import { TrendingUp, AlertTriangle, Cpu, ArrowUpRight, ArrowDownRight, Zap, Calendar } from 'lucide-react';

const CashFlowForecastWidget: React.FC = () => {
  const forecastData = [
    { month: 'Oct', actual: 45000, projected: 45000, status: 'actual' },
    { month: 'Nov', actual: 48000, projected: 48000, status: 'actual' },
    { month: 'Dec', actual: 42000, projected: 42000, status: 'actual' },
    { month: 'Jan', actual: 0, projected: 38000, status: 'projected' },
    { month: 'Feb', actual: 0, projected: 31000, status: 'projected' },
    { month: 'Mar', actual: 0, projected: 26000, status: 'projected' },
  ];

  const styles = {
    container: {
      backgroundColor: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '12px',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
      maxWidth: '1000px',
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: '24px',
    },
    header: {
      gridColumn: 'span 2',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    badge: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.7rem',
      padding: '4px 8px',
      borderRadius: '4px',
      background: 'rgba(0, 255, 157, 0.1)',
      color: '#00ff9d',
      border: '1px solid #00ff9d',
      textTransform: 'uppercase' as const,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    chartContainer: {
      background: '#14171c',
      border: '1px solid #1f242d',
      borderRadius: '8px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    chartArea: {
      height: '180px',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px',
      paddingBottom: '20px',
      borderBottom: '1px solid #1f242d',
    },
    barWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '8px',
    },
    bar: (height: string, isProjected: boolean) => ({
      width: '100%',
      height,
      background: isProjected 
        ? 'repeating-linear-gradient(45deg, #1f242d, #1f242d 5px, #2a2f3a 5px, #2a2f3a 10px)' 
        : '#00ff9d',
      borderRadius: '4px 4px 0 0',
      boxShadow: isProjected ? 'none' : '0 0 15px rgba(0, 255, 157, 0.2)',
      transition: '0.3s ease',
      border: isProjected ? '1px dashed #8a8f98' : 'none',
    }),
    label: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.65rem',
      color: '#8a8f98',
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    signalCard: {
      background: '#14171c',
      padding: '16px',
      borderRadius: '8px',
      borderLeft: '3px solid #ff4d4d',
    },
    signalHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#ff4d4d',
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      marginBottom: '8px',
    },
    aiPanel: {
      background: 'linear-gradient(135deg, #14171c 0%, #0d0f14 100%)',
      border: '1px solid #1f242d',
      padding: '16px',
      borderRadius: '8px',
      position: 'relative' as const,
    },
    aiText: {
      fontSize: '0.85rem',
      lineHeight: '1.5',
      color: '#e0e0e0',
    },
    aiHeader: {
      fontFamily: "'JetBrains Mono', monospace",
      color: '#00ff9d',
      fontSize: '0.7rem',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginTop: 'auto',
    },
    metricBox: {
      background: '#14171c',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #1f242d',
    },
    metricLabel: {
      fontSize: '0.6rem',
      color: '#8a8f98',
      textTransform: 'uppercase' as const,
      fontWeight: 600,
      marginBottom: '4px',
    },
    metricValue: {
      fontSize: '1.1rem',
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace",
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Cash Flow Command</h2>
          <p style={{ color: '#8a8f98', fontSize: '0.85rem' }}>Real-time 6-month runway forecast</p>
        </div>
        <div style={styles.badge}>
          <Zap size={12} fill="#00ff9d" />
          Live Sync Active
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={styles.chartContainer}>
        <div style={styles.chartArea}>
          {forecastData.map((d, i) => (
            <div key={i} style={styles.barWrapper}>
              <div style={styles.bar(`${(d.projected / 50000) * 100}%`, d.status === 'projected')} />
              <span style={styles.label}>{d.month}</span>
            </div>
          ))}
        </div>
        <div style={styles.metricsGrid}>
          <div style={styles.metricBox}>
            <div style={styles.metricLabel}>Avg. Monthly Burn</div>
            <div style={styles.metricValue}>$12,400</div>
            <div style={{ fontSize: '0.7rem', color: '#ff4d4d', marginTop: '4px' }}>
              <ArrowUpRight size={10} inline /> 8% vs Last Month
            </div>
          </div>
          <div style={styles.metricBox}>
            <div style={styles.metricLabel}>Est. Runway</div>
            <div style={styles.metricValue}>5.2 Mo</div>
            <div style={{ fontSize: '0.7rem', color: '#00ff9d', marginTop: '4px' }}>
              Critical Threshold: 3 Mo
            </div>
          </div>
        </div>
      </div>

      {/* AI & Signals Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.signalCard}>
          <div style={styles.signalHeader}>
            <AlertTriangle size={14} />
            Financial Signal
          </div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Cost Leak Detected</p>
          <p style={{ fontSize: '0.75rem', color: '#8a8f98' }}>3 duplicate SaaS subscriptions identified (Estimated saving: $420/mo).</p>
        </div>

        <div style={styles.aiPanel}>
          <div style={styles.aiHeader}>
            <Cpu size={12} />
            AI_CFO_ANALYSIS
          </div>
          <p style={styles.aiText}>
            Projected cash dip in <span style={{ color: '#ffb800' }}>February</span> due to quarterly tax obligations. 
            Recommendation: Delay non-essential contractor hires until March to maintain {'>'}4 month runway buffer.
          </p>
        </div>

        <button style={{
          background: '#00ff9d',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          padding: '12px',
          fontWeight: 700,
          fontSize: '0.8rem',
          cursor: 'pointer',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          Run Scenario Model <TrendingUp size={16} />
        </button>
      </div>
    </div>
  );
};

export default CashFlowForecastWidget;