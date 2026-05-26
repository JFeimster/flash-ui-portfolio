import React, { useState, useEffect } from 'react';

const ScenarioLab = () => {
  const [hires, setHires] = useState(0);
  const [marketingSpend, setMarketingSpend] = useState(0);
  const [priceAdjustment, setPriceAdjustment] = useState(0);
  
  const [metrics, setMetrics] = useState({
    runway: 5.8,
    fundingScore: 72,
    burnRate: 12500,
    projectedGrowth: 4.2
  });

  useEffect(() => {
    // Basic simulation logic
    const baseRunway = 5.8;
    const baseScore = 72;
    const baseBurn = 12500;
    
    const additionalBurn = (hires * 5500) + marketingSpend;
    const revenueImpact = (priceAdjustment * 1500); // Rough estimation
    
    const newBurn = baseBurn + additionalBurn;
    const newRunway = Math.max(0, (baseRunway * baseBurn) / (newBurn - revenueImpact));
    const newScore = Math.min(100, baseScore + (priceAdjustment * 2) + (marketingSpend > 0 ? 3 : 0) - (hires > 2 ? 5 : 0));

    setMetrics({
      runway: parseFloat(newRunway.toFixed(1)),
      fundingScore: Math.round(newScore),
      burnRate: newBurn,
      projectedGrowth: 4.2 + (marketingSpend / 1000) + (priceAdjustment * 0.5)
    });
  }, [hires, marketingSpend, priceAdjustment]);

  return (
    <div style={{
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px',
      minHeight: '100vh'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          
          .lab-container {
            max-width: 1100px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 32px;
          }

          .control-panel {
            background: #0d0f14;
            border: 1px solid #1f242d;
            padding: 32px;
            border-radius: 12px;
          }

          .output-panel {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .metric-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .metric-card {
            background: #14171c;
            border: 1px solid #1f242d;
            padding: 24px;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
          }

          .metric-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: #00ff9d;
            opacity: 0.3;
          }

          .label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            text-transform: uppercase;
            color: #8a8f98;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
          }

          .value {
            font-size: 2.5rem;
            font-weight: 800;
            letter-spacing: -0.04em;
          }

          .unit {
            font-size: 1rem;
            color: #8a8f98;
            margin-left: 4px;
            font-weight: 400;
          }

          .slider-group {
            margin-bottom: 32px;
          }

          .slider-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }

          .slider-header span:first-child {
            font-weight: 600;
            font-size: 0.9rem;
          }

          .slider-header span:last-child {
            font-family: 'JetBrains Mono', monospace;
            color: #00ff9d;
            font-size: 0.85rem;
          }

          input[type=range] {
            width: 100%;
            height: 4px;
            background: #1f242d;
            border-radius: 2px;
            appearance: none;
            outline: none;
          }

          input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background: #00ff9d;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 255, 157, 0.4);
          }

          .ai-insight {
            background: linear-gradient(90deg, #14171c, #0d0f14);
            border-left: 3px solid #00ff9d;
            padding: 20px;
            border-radius: 0 8px 8px 0;
            font-size: 0.9rem;
            line-height: 1.5;
            color: #d1d5db;
          }

          .chart-mock {
            background: #14171c;
            border: 1px solid #1f242d;
            height: 240px;
            border-radius: 8px;
            padding: 24px;
            display: flex;
            align-items: flex-end;
            gap: 12px;
          }

          .bar {
            flex: 1;
            background: #1f242d;
            border-radius: 4px 4px 0 0;
            transition: height 0.4s ease;
          }

          .btn-primary {
            background: #00ff9d;
            color: #000;
            padding: 14px;
            border: none;
            border-radius: 4px;
            font-weight: 700;
            width: 100%;
            cursor: pointer;
            margin-top: 12px;
            transition: 0.2s;
          }

          .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(0, 255, 157, 0.2);
          }
        `}
      </style>

      <div className="lab-container">
        <aside className="control-panel">
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Scenario Lab</h2>
            <p style={{ color: '#8a8f98', fontSize: '0.85rem' }}>Stress-test your business decisions in a safe sandbox.</p>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span>New Hires</span>
              <span>{hires} FTEs</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" step="1" 
              value={hires} 
              onChange={(e) => setHires(parseInt(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span>Addtl. Marketing Spend</span>
              <span>+${marketingSpend}/mo</span>
            </div>
            <input 
              type="range" 
              min="0" max="25000" step="1000" 
              value={marketingSpend} 
              onChange={(e) => setMarketingSpend(parseInt(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span>Pricing Change</span>
              <span>{priceAdjustment > 0 ? '+' : ''}{priceAdjustment}%</span>
            </div>
            <input 
              type="range" 
              min="-20" max="50" step="5" 
              value={priceAdjustment} 
              onChange={(e) => setPriceAdjustment(parseInt(e.target.value))}
            />
          </div>

          <button className="btn-primary">Apply to Master Plan</button>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#444', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Changes only affect this simulation
          </p>
        </aside>

        <main className="output-panel">
          <div className="metric-grid">
            <div className="metric-card">
              <div className="label">Projected Runway</div>
              <div className="value" style={{ color: metrics.runway < 3 ? '#ff4d4d' : '#ffffff' }}>
                {metrics.runway}<span className="unit">mo</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="label">Funding Readiness</div>
              <div className="value" style={{ color: '#00ff9d' }}>
                {metrics.fundingScore}<span className="unit">/100</span>
              </div>
            </div>
          </div>

          <div className="chart-mock">
            <div className="bar" style={{ height: '40%' }}></div>
            <div className="bar" style={{ height: '45%' }}></div>
            <div className="bar" style={{ height: '38%' }}></div>
            <div className="bar" style={{ height: '55%', background: '#1f242d' }}></div>
            <div className="bar" style={{ height: `${Math.min(90, metrics.projectedGrowth * 10)}%`, background: '#00ff9d', boxShadow: '0 0 15px rgba(0,255,157,0.2)' }}></div>
            <div className="bar" style={{ height: `${Math.min(95, metrics.projectedGrowth * 11)}%`, background: 'rgba(0,255,157,0.4)' }}></div>
            <div style={{ position: 'absolute', right: '40px', bottom: '110px', fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8a8f98' }}>
              PROJECTION: NEXT 3 MONTHS
            </div>
          </div>

          <div className="ai-insight">
            <div style={{ fontFamily: 'JetBrains Mono', color: '#00ff9d', fontSize: '0.75rem', marginBottom: '8px' }}>
              &gt; SIMULATION_ANALYSIS_REPORT
            </div>
            {metrics.runway < 4 ? (
              <p>Warning: This aggressive hiring plan drops your runway below the 4-month danger zone. Unless you see a conversion lift of >15% from marketing, you will need to initiate a fundraise within 30 days.</p>
            ) : (
              <p>Scenario is sustainable. The price increase offsets the new hire overhead while maintaining a healthy funding readiness score. Recommended: Proceed with the {hires > 0 ? 'first hire' : 'price adjustment'} immediately.</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #1f242d', borderRadius: '8px' }}>
              <div className="label">New Burn Rate</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>${metrics.burnRate.toLocaleString()}/mo</div>
            </div>
            <div style={{ padding: '20px', border: '1px solid #1f242d', borderRadius: '8px' }}>
              <div className="label">Growth Velocity</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffb800' }}>+{metrics.projectedGrowth.toFixed(1)}%</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScenarioLab;