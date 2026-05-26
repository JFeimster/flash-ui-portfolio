import React, { useState, useEffect } from 'react';

const DecisionSummaryCard: React.FC = () => {
  const [headcount, setHeadcount] = useState(0);
  const [priceIncrease, setPriceIncrease] = useState(0);
  const [adSpend, setAdSpend] = useState(0);

  // Base metrics
  const baseRunway = 5.8;
  const baseReadiness = 72;
  const baseBurn = 42000;
  const baseRevenue = 55000;

  // Impact Calculations
  const newBurn = baseBurn + (headcount * 8500) + (adSpend);
  const newRevenue = baseRevenue * (1 + (priceIncrease / 100)) + (adSpend * 1.2);
  const netImpact = newRevenue - newBurn - (baseRevenue - baseBurn);
  
  const runwayImpact = (baseRunway * (baseBurn / (newBurn || 1))).toFixed(1);
  const readinessImpact = Math.min(100, Math.max(0, baseReadiness + (priceIncrease * 0.8) - (headcount * 4) + (adSpend > 0 ? 2 : 0))).toFixed(0);

  const styles = {
    card: {
      backgroundColor: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '12px',
      padding: '24px',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      maxWidth: '1000px',
      margin: '20px auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      borderBottom: '1px solid #1f242d',
      paddingBottom: '16px',
    },
    monoLabel: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.7rem',
      color: '#00ff9d',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr',
      gap: '32px',
    },
    inputSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    label: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#8a8f98',
    },
    slider: {
      width: '100%',
      accentColor: '#00ff9d',
      cursor: 'pointer',
    },
    resultsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    },
    metricCard: {
      backgroundColor: '#14171c',
      border: '1px solid #1f242d',
      padding: '16px',
      borderRadius: '8px',
    },
    metricValue: {
      fontSize: '1.75rem',
      fontWeight: 800,
      marginTop: '4px',
    },
    metricLabel: {
      fontSize: '0.7rem',
      color: '#8a8f98',
      textTransform: 'uppercase' as const,
      fontWeight: 700,
    },
    aiPanel: {
      gridColumn: 'span 2',
      background: 'linear-gradient(90deg, #14171c, #0d0f14)',
      borderLeft: '3px solid #00ff9d',
      padding: '16px',
      fontSize: '0.85rem',
      marginTop: '16px',
      borderRadius: '0 8px 8px 0',
    },
    badge: {
      fontSize: '0.65rem',
      padding: '2px 6px',
      borderRadius: '4px',
      marginLeft: '8px',
      fontWeight: 700,
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.monoLabel}>Scenario Modeling Lab</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Decision Simulator</h3>
        </div>
        <button style={{ 
          background: 'transparent', 
          border: '1px solid #1f242d', 
          color: '#fff', 
          padding: '6px 12px', 
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: 'pointer'
        }}>Reset Variables</button>
      </div>

      <div style={styles.grid}>
        <div style={styles.inputSection}>
          <div style={styles.inputGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={styles.label}>New Headcount (Avg $8.5k/mo)</label>
              <span style={{ color: '#00ff9d', fontWeight: 700 }}>+{headcount}</span>
            </div>
            <input 
              type="range" min="0" max="10" step="1" 
              value={headcount} 
              onChange={(e) => setHeadcount(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={styles.label}>Price Increase (%)</label>
              <span style={{ color: '#00ff9d', fontWeight: 700 }}>{priceIncrease}%</span>
            </div>
            <input 
              type="range" min="0" max="50" step="5" 
              value={priceIncrease} 
              onChange={(e) => setPriceIncrease(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={styles.label}>Monthly Ad Spend Boost</label>
              <span style={{ color: '#00ff9d', fontWeight: 700 }}>+${adSpend.toLocaleString()}</span>
            </div>
            <input 
              type="range" min="0" max="25000" step="1000" 
              value={adSpend} 
              onChange={(e) => setAdSpend(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        </div>

        <div style={styles.resultsSection}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Projected Runway</div>
            <div style={styles.metricValue}>
              {runwayImpact} <span style={{ fontSize: '0.9rem', color: '#8a8f98', fontWeight: 400 }}>mo</span>
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: parseFloat(runwayImpact) < baseRunway ? '#ff4d4d' : '#00ff9d',
              fontWeight: 600,
              marginTop: '4px'
            }}>
              {parseFloat(runwayImpact) < baseRunway ? '↓' : '↑'} {Math.abs(parseFloat(runwayImpact) - baseRunway).toFixed(1)}mo change
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Funding Readiness</div>
            <div style={styles.metricValue}>
              {readinessImpact}<span style={{ fontSize: '0.8rem', color: '#333' }}>/100</span>
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: parseInt(readinessImpact) < baseReadiness ? '#ff4d4d' : '#00ff9d',
              fontWeight: 600,
              marginTop: '4px'
            }}>
              {parseInt(readinessImpact) < baseReadiness ? '↓' : '↑'} {Math.abs(parseInt(readinessImpact) - baseReadiness)}pts change
            </div>
          </div>

          <div style={styles.aiPanel}>
            <div style={{ ...styles.monoLabel, marginBottom: '8px' }}>{`> AI_SCENARIO_ANALYSIS`}</div>
            <p style={{ color: '#8a8f98', lineHeight: '1.4' }}>
              {netImpact < 0 
                ? `Warning: This decision increases monthly burn by $${Math.abs(netImpact).toLocaleString()}. Your runway drops below 6 months. Consider implementing the price increase first to offset hiring costs.`
                : `Insight: Positive trade-off detected. The revenue growth from pricing and ad spend outpaces the new headcount cost, improving your funding readiness score by ${Math.abs(parseInt(readinessImpact) - baseReadiness)} points.`
              }
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          backgroundColor: '#00ff9d',
          color: '#000',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '0.85rem'
        }}>
          Apply to Financial Roadmap
        </button>
      </div>
    </div>
  );
};

export default DecisionSummaryCard;