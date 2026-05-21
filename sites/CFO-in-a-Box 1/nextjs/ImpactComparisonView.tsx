import React, { useState, useMemo } from 'react';

/**
 * ImpactComparisonView.tsx
 * Scenario Modeling Lab component for CFO-in-a-Box
 */

interface ScenarioState {
  newHires: number;
  priceIncrease: number;
  adSpend: number;
  churnChange: number;
}

const ImpactComparisonView: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioState>({
    newHires: 0,
    priceIncrease: 0,
    adSpend: 0,
    churnChange: 0,
  });

  // Base Financials (From Current Dashboard State)
  const baseData = {
    monthlyRev: 85000,
    monthlyExp: 76550,
    cashOnHand: 440000,
    currentScore: 72,
    avgSalary: 8500, // Monthly
  };

  const calculations = useMemo(() => {
    const additionalBurn = (scenario.newHires * baseData.avgSalary) + scenario.adSpend;
    const revenueImpact = (baseData.monthlyRev * (scenario.priceIncrease / 100)) + (scenario.adSpend * 1.8); // 1.8x ROAS assumption
    
    const projectedRev = baseData.monthlyRev + revenueImpact;
    const projectedExp = baseData.monthlyExp + additionalBurn;
    const projectedNet = projectedRev - projectedExp;
    
    const baseNet = baseData.monthlyRev - baseData.monthlyExp;
    
    // Runway Calc
    const baseRunway = baseNet < 0 ? Math.abs(baseData.cashOnHand / baseNet) : 60; // 60 = "Infinite" for display
    const projectedRunway = projectedNet < 0 ? Math.abs(baseData.cashOnHand / projectedNet) : 60;

    // Funding Readiness Score Logic
    let scoreDelta = 0;
    scoreDelta += (projectedNet > baseNet ? 5 : -8);
    scoreDelta += (scenario.newHires > 0 ? 3 : 0); // Hiring is growth signal
    scoreDelta += (projectedRunway < 6 ? -15 : 5);
    
    const projectedScore = Math.min(Math.max(baseData.currentScore + scoreDelta, 0), 100);

    return {
      baseNet,
      projectedNet,
      baseRunway,
      projectedRunway,
      projectedScore,
      netImpact: projectedNet - baseNet
    };
  }, [scenario]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div style={{
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem',
      borderRadius: '12px',
      border: '1px solid #1f242d',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #1f242d', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', background: '#1f242d', color: '#00ff9d', border: '1px solid #00ff9d', marginBottom: '1rem' }}>
          Lab / Scenario Sandbox
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Impact <span style={{ background: 'linear-gradient(135deg, #fff 0%, #888 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Comparison</span>
        </h2>
        <p style={{ color: '#8a8f98', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Simulate major business pivots. See how hiring, pricing, and spend affect your metrics before you pull the trigger.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }}>
        
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#0d0f14', padding: '24px', borderRadius: '8px', border: '1px solid #1f242d' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8a8f98', marginBottom: '12px', textTransform: 'uppercase' }}>New Headcount</label>
            <input 
              type="range" min="0" max="10" step="1" 
              value={scenario.newHires}
              onChange={(e) => setScenario({...scenario, newHires: parseInt(e.target.value)})}
              style={{ width: '100%', accentColor: '#00ff9d' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
              <span>0</span>
              <span style={{ color: '#00ff9d' }}>+{scenario.newHires} FTEs</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8a8f98', marginBottom: '12px', textTransform: 'uppercase' }}>Price Increase (%)</label>
            <input 
              type="range" min="0" max="50" step="5" 
              value={scenario.priceIncrease}
              onChange={(e) => setScenario({...scenario, priceIncrease: parseInt(e.target.value)})}
              style={{ width: '100%', accentColor: '#00ff9d' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
              <span>0%</span>
              <span style={{ color: '#00ff9d' }}>+{scenario.priceIncrease}%</span>
              <span>50%</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8a8f98', marginBottom: '12px', textTransform: 'uppercase' }}>Monthly Ad Spend (USD)</label>
            <input 
              type="range" min="0" max="50000" step="5000" 
              value={scenario.adSpend}
              onChange={(e) => setScenario({...scenario, adSpend: parseInt(e.target.value)})}
              style={{ width: '100%', accentColor: '#00ff9d' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
              <span>$0</span>
              <span style={{ color: '#00ff9d' }}>{formatCurrency(scenario.adSpend)}</span>
              <span>$50k</span>
            </div>
          </div>

          <button 
            onClick={() => setScenario({ newHires: 0, priceIncrease: 0, adSpend: 0, churnChange: 0 })}
            style={{ marginTop: '20px', padding: '12px', background: 'transparent', border: '1px solid #1f242d', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Reset Simulation
          </button>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Net Burn Card */}
            <div style={{ background: '#14171c', padding: '24px', borderRadius: '8px', border: '1px solid #1f242d' }}>
              <div style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Monthly Net Cash Flow</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatCurrency(calculations.projectedNet)}
                </span>
                <span style={{ fontSize: '0.85rem', color: calculations.netImpact >= 0 ? '#00ff9d' : '#ff4d4d' }}>
                  {calculations.netImpact >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(calculations.netImpact))}
                </span>
              </div>
            </div>

            {/* Score Card */}
            <div style={{ background: '#14171c', padding: '24px', borderRadius: '8px', border: '1px solid #1f242d' }}>
              <div style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Projected Funding Readiness</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#00ff9d', fontFamily: "'JetBrains Mono', monospace" }}>
                  {calculations.projectedScore}
                  <span style={{ fontSize: '0.9rem', color: '#444' }}> / 100</span>
                </span>
                <span style={{ fontSize: '0.85rem', color: calculations.projectedScore >= baseData.currentScore ? '#00ff9d' : '#ff4d4d' }}>
                  ({calculations.projectedScore - baseData.currentScore >= 0 ? '+' : ''}{calculations.projectedScore - baseData.currentScore})
                </span>
              </div>
            </div>
          </div>

          {/* Runway Visualization */}
          <div style={{ background: '#14171c', padding: '24px', borderRadius: '8px', border: '1px solid #1f242d' }}>
            <div style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase', fontWeight: 600, marginBottom: '20px' }}>Runway Impact (Months)</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#8a8f98' }}>Current (Baseline)</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{calculations.baseRunway === 60 ? 'Default / Profitable' : calculations.baseRunway.toFixed(1) + ' mo'}</span>
                </div>
                <div style={{ height: '8px', background: '#1f242d', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(calculations.baseRunway / 60) * 100}%`, height: '100%', background: '#8a8f98' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600 }}>Projected Scenario</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00ff9d' }}>
                    {calculations.projectedRunway === 60 ? 'Unlimited (Cash Flow Positive)' : calculations.projectedRunway.toFixed(1) + ' mo'}
                  </span>
                </div>
                <div style={{ height: '8px', background: '#1f242d', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(calculations.projectedRunway / 60) * 100}%`, 
                    height: '100%', 
                    background: '#00ff9d',
                    boxShadow: '0 0 10px rgba(0, 255, 157, 0.4)'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Integration */}
          <div style={{ background: 'linear-gradient(90deg, #14171c, #0d0f14)', borderLeft: '3px solid #00ff9d', padding: '20px', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00ff9d', fontSize: '0.75rem', marginBottom: '8px' }}>&gt; AI SCENARIO_ANALYSIS_INIT</div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#ffffff' }}>
              {calculations.projectedNet < 0 
                ? `Hiring ${scenario.newHires} FTEs decreases your runway by ${Math.abs(calculations.baseRunway - calculations.projectedRunway).toFixed(1)} months. Ensure ROAS on your ${formatCurrency(scenario.adSpend)} ad spend exceeds 2.1x to remain cash-neutral.`
                : `Simulation shows a net profit increase of ${formatCurrency(calculations.netImpact)}. This pivot strengthens your funding readiness score by ${(calculations.projectedScore - baseData.currentScore).toFixed(0)} points, placing you in the top 15% of peers for your revenue bracket.`
              }
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImpactComparisonView;