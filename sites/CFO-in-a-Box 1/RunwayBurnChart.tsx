import React from 'react';
import { TrendingDown, AlertTriangle, Zap, ArrowUpRight, Calendar } from 'lucide-react';

const RunwayBurnChart: React.FC = () => {
  const styles = {
    container: {
      background: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '12px',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      color: '#ffffff',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px',
    },
    titleGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      margin: 0,
    },
    subtitle: {
      fontSize: '0.8rem',
      color: '#8a8f98',
    },
    badge: {
      background: 'rgba(0, 255, 157, 0.1)',
      border: '1px solid #00ff9d',
      color: '#00ff9d',
      padding: '4px 10px',
      borderRadius: '4px',
      fontSize: '0.65rem',
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace",
      textTransform: 'uppercase' as const,
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '32px',
    },
    metricCard: {
      background: '#14171c',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #1f242d',
    },
    metricLabel: {
      fontSize: '0.7rem',
      textTransform: 'uppercase' as const,
      color: '#8a8f98',
      fontWeight: 600,
      letterSpacing: '0.05em',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    metricValue: {
      fontSize: '1.8rem',
      fontWeight: 800,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '-0.04em',
    },
    metricTrend: {
      fontSize: '0.75rem',
      fontWeight: 600,
      marginTop: '4px',
    },
    chartWrapper: {
      height: '160px',
      width: '100%',
      position: 'relative' as const,
      margin: '20px 0',
    },
    signalAlert: {
      marginTop: '24px',
      background: 'rgba(255, 77, 77, 0.03)',
      border: '1px solid rgba(255, 77, 77, 0.2)',
      borderLeft: '4px solid #ff4d4d',
      padding: '16px',
      borderRadius: '0 8px 8px 0',
    },
    signalTitle: {
      color: '#ff4d4d',
      fontSize: '0.75rem',
      fontWeight: 800,
      textTransform: 'uppercase' as const,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px',
    },
    signalBody: {
      fontSize: '0.85rem',
      color: '#8a8f98',
      lineHeight: '1.5',
    },
    actionRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    btnPrimary: {
      flex: 1,
      background: '#00ff9d',
      color: '#000',
      border: 'none',
      padding: '12px',
      borderRadius: '4px',
      fontWeight: 700,
      fontSize: '0.8rem',
      cursor: 'pointer',
    },
    btnSecondary: {
      flex: 1,
      background: 'transparent',
      color: '#fff',
      border: '1px solid #1f242d',
      padding: '12px',
      borderRadius: '4px',
      fontWeight: 600,
      fontSize: '0.8rem',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h3 style={styles.title}>Runway & Burn Analytics</h3>
          <span style={styles.subtitle}>Real-time liquidity forecasting</span>
        </div>
        <div style={styles.badge}>Live Sync: Active</div>
      </div>

      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>
            <Calendar size={12} /> Total Runway
          </div>
          <div style={styles.metricValue}>
            5.8<span style={{ fontSize: '0.9rem', color: '#555', marginLeft: '4px' }}>MO</span>
          </div>
          <div style={{ ...styles.metricTrend, color: '#ffb800' }}>
            -12% vs last month
          </div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>
            <TrendingDown size={12} /> Net Burn
          </div>
          <div style={styles.metricValue}>
            $18.4<span style={{ fontSize: '0.9rem', color: '#555', marginLeft: '4px' }}>K</span>
          </div>
          <div style={{ ...styles.metricTrend, color: '#ff4d4d' }}>
            Critical Increase
          </div>
        </div>
      </div>

      <div style={styles.chartWrapper}>
        <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 255, 157, 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 37.5, 75, 112.5, 150].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#1f242d" strokeWidth="1" strokeDasharray="4,4" />
          ))}

          {/* Area Path */}
          <path 
            d="M 0 20 Q 100 40, 200 80 T 400 130 L 400 150 L 0 150 Z" 
            fill="url(#chartGradient)" 
          />
          
          {/* Line Path */}
          <path 
            d="M 0 20 Q 100 40, 200 80 T 400 130" 
            fill="none" 
            stroke="#00ff9d" 
            strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* Markers */}
          <circle cx="200" cy="80" r="4" fill="#00ff9d" filter="drop-shadow(0 0 5px #00ff9d)" />
          
          <text x="10" y="15" fill="#8a8f98" fontSize="8" fontFamily="JetBrains Mono">CASH ON HAND</text>
          <text x="330" y="145" fill="#555" fontSize="8" fontFamily="JetBrains Mono">PROJECTION</text>
        </svg>
      </div>

      <div style={styles.signalAlert}>
        <div style={styles.signalTitle}>
          <AlertTriangle size={14} />
          <span>Financial Signal: Burn Anomaly</span>
        </div>
        <p style={styles.signalBody}>
          AI CFO detected a <span style={{color: '#fff', fontWeight: 600}}>22% spike</span> in software expenses.
          At current velocity, zero-cash date is <span style={{color: '#ff4d4d', fontWeight: 600}}>March 14th</span>.
          Optimization recommended for: "AWS-Production-Cluster".
        </p>
      </div>

      <div style={styles.actionRow}>
        <button style={styles.btnSecondary}>Download Report</button>
        <button style={styles.btnPrimary}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Zap size={14} /> Optimize Burn
          </div>
        </button>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        paddingTop: '16px', 
        borderTop: '1px solid #1f242d',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.7rem', color: '#444', fontFamily: 'JetBrains Mono' }}>MD5_HASH: AF882X_LIT</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff9d' }}></div>
            <span style={{ fontSize: '0.7rem', color: '#8a8f98', fontWeight: 600 }}>SYSTEMS_NOMINAL</span>
        </div>
      </div>
    </div>
  );
};

export default RunwayBurnChart;