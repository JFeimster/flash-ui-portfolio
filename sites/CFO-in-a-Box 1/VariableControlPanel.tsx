import React, { useState, useEffect } from 'react';

interface ScenarioMetrics {
  runway: string;
  readiness: number;
  monthlyBurn: number;
}

const VariableControlPanel: React.FC = () => {
  const [hires, setHires] = useState<number>(0);
  const [priceIncrease, setPriceIncrease] = useState<number>(0);
  const [adSpend, setAdSpend] = useState<number>(0);
  const [metrics, setMetrics] = useState<ScenarioMetrics>({
    runway: "5.8",
    readiness: 72,
    monthlyBurn: 42000
  });

  useEffect(() => {
    // Simulation Logic
    const baseRunway = 5.8;
    const baseReadiness = 72;
    const baseBurn = 42000;
    const hireCost = 8000;

    const newBurn = baseBurn + (hires * hireCost) + adSpend;
    const revenueImpact = (priceIncrease / 100) * 55000; // Assuming 55k base rev
    
    // Simplified Runway Calculation
    const currentCash = baseRunway * baseBurn;
    const calculatedRunway = currentCash / (newBurn - revenueImpact);
    
    // Readiness Logic
    let calculatedReadiness = baseReadiness;
    calculatedReadiness -= (hires * 3); // Hiring reduces short-term readiness (cash drain)
    calculatedReadiness += (priceIncrease * 1.5); // Better margins increase readiness
    calculatedReadiness += (adSpend > 5000 ? 5 : -2); // Significant spend implies growth mode

    setMetrics({
      runway: calculatedRunway > 0 ? calculatedRunway.toFixed(1) : "0.0",
      readiness: Math.min(100, Math.max(0, Math.round(calculatedReadiness))),
      monthlyBurn: newBurn
    });
  }, [hires, priceIncrease, adSpend]);

  const panelStyle: React.CSSProperties = {
    backgroundColor: '#0d0f14',
    border: '1px solid #1f242d',
    borderRadius: '12px',
    padding: '24px',
    color: '#ffffff',
    fontFamily: "'Inter', sans-serif",
    maxWidth: '800px',
    margin: '20px auto'
  };

  const sliderGroupStyle: React.CSSProperties = {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#8a8f98',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    justifyContent: 'space-between'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    accentColor: '#00ff9d',
    cursor: 'pointer'
  };

  const statGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '1px solid #1f242d'
  };

  const statCardStyle: React.CSSProperties = {
    background: '#14171c',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #1f242d'
  };

  return (
    <div style={panelStyle}>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
          Scenario Modeling <span style={{ color: '#00ff9d' }}>Lab</span>
        </h3>
        <p style={{ color: '#8a8f98', fontSize: '0.9rem' }}>
          Adjust levers to simulate the impact on your financial health before executing.
        </p>
      </div>

      <div style={sliderGroupStyle}>
        <div style={labelStyle}>
          <span>New Strategic Hires</span>
          <span style={{ color: '#00ff9d', fontFamily: 'JetBrains Mono' }}>+{hires} FTE</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={hires} 
          onChange={(e) => setHires(parseInt(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={sliderGroupStyle}>
        <div style={labelStyle}>
          <span>Price Optimization</span>
          <span style={{ color: '#00ff9d', fontFamily: 'JetBrains Mono' }}>+{priceIncrease}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="50" 
          value={priceIncrease} 
          onChange={(e) => setPriceIncrease(parseInt(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={sliderGroupStyle}>
        <div style={labelStyle}>
          <span>Monthly Ad Spend Scaling</span>
          <span style={{ color: '#00ff9d', fontFamily: 'JetBrains Mono' }}>+${adSpend.toLocaleString()}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="20000" 
          step="500"
          value={adSpend} 
          onChange={(e) => setAdSpend(parseInt(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={statGridStyle}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '0.7rem', color: '#8a8f98', fontWeight: 700, marginBottom: '8px' }}>PROJECTED RUNWAY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{metrics.runway} <span style={{ fontSize: '0.8rem', color: '#8a8f98' }}>mo</span></div>
          <div style={{ fontSize: '0.7rem', marginTop: '4px', color: parseFloat(metrics.runway) < 4 ? '#ff4d4d' : '#00ff9d' }}>
            {parseFloat(metrics.runway) < 4 ? '● High Risk' : '● Sustainable'}
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ fontSize: '0.7rem', color: '#8a8f98', fontWeight: 700, marginBottom: '8px' }}>FUNDING READINESS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00ff9d' }}>{metrics.readiness}<span style={{ fontSize: '0.8rem', color: '#444' }}>/100</span></div>
          <div style={{ fontSize: '0.7rem', marginTop: '4px', color: '#8a8f98' }}>
            Based on CAC/LTV & Burn
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ fontSize: '0.7rem', color: '#8a8f98', fontWeight: 700, marginBottom: '8px' }}>EST. MONTHLY BURN</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>${(metrics.monthlyBurn / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: '0.7rem', marginTop: '4px', color: '#ffb800', fontFamily: 'JetBrains Mono' }}>
            {hires > 0 ? '↑ Opex Heavy' : 'Stable'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', background: 'rgba(0, 255, 157, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #00ff9d' }}>
        <div style={{ fontFamily: 'JetBrains Mono', color: '#00ff9d', fontSize: '0.75rem', marginBottom: '4px' }}>&gt; AI_SIMULATION_INSIGHT</div>
        <p style={{ fontSize: '0.85rem', color: '#8a8f98', lineHeight: '1.4' }}>
          {parseFloat(metrics.runway) < 3 
            ? "WARNING: This scenario depletes cash reserves too rapidly. Consider scaling ad spend more conservatively or increasing price by at least 15% to offset new headcount."
            : "VIABLE: This scenario maintains healthy runway. The funding readiness score suggests you would be in a strong position to raise a bridge round within 4 months."}
        </p>
      </div>

      <button style={{
        width: '100%',
        marginTop: '24px',
        padding: '14px',
        backgroundColor: '#00ff9d',
        color: '#000',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: '0.2s'
      }}>
        Lock Scenario & Generate Report
      </button>
    </div>
  );
};

export default VariableControlPanel;
```