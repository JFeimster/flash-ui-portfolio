import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Users, TrendingUp, Megaphone, ShieldAlert, Wallet } from 'lucide-react';

const ProjectionGraph = () => {
  // Base State
  const [currentCash, setCurrentCash] = useState(150000);
  const [monthlyRev, setMonthlyRev] = useState(25000);
  const [monthlyBurn, setMonthlyBurn] = useState(18000);
  
  // Scenario Toggles
  const [newHires, setNewHires] = useState(0);
  const [priceIncrease, setPriceIncrease] = useState(0); // percentage
  const [adSpendBoost, setAdSpendBoost] = useState(0);

  // Constants
  const HIRE_COST = 6500;
  const AD_REVENUE_MULTIPLIER = 2.5;

  const projectionData = useMemo(() => {
    let data = [];
    let rollingCash = currentCash;
    
    const adjustedRev = monthlyRev * (1 + priceIncrease / 100) + (adSpendBoost * AD_REVENUE_MULTIPLIER);
    const adjustedBurn = monthlyBurn + (newHires * HIRE_COST) + adSpendBoost;
    const monthlyNet = adjustedRev - adjustedBurn;

    for (let i = 0; i <= 12; i++) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() + i);
      const monthLabel = monthDate.toLocaleString('default', { month: 'short' });
      
      data.push({
        name: monthLabel,
        cash: Math.max(0, Math.round(rollingCash)),
        net: monthlyNet
      });
      
      rollingCash += monthlyNet;
    }
    return data;
  }, [currentCash, monthlyRev, monthlyBurn, newHires, priceIncrease, adSpendBoost]);

  const stats = useMemo(() => {
    const lastData = projectionData[projectionData.length - 1];
    const monthlyNet = projectionData[0].net;
    const runway = monthlyNet >= 0 ? Infinity : Math.abs(currentCash / monthlyNet);
    
    // Simple Readiness Logic
    let readinessScore = 65;
    if (monthlyNet > 0) readinessScore += 15;
    if (runway > 12) readinessScore += 10;
    if (runway < 4) readinessScore -= 30;
    
    return {
      runway: runway === Infinity ? '∞' : runway.toFixed(1),
      netFlow: monthlyNet,
      readiness: Math.min(100, Math.max(0, readinessScore))
    };
  }, [projectionData, currentCash]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#14171c', 
          border: '1px solid #1f242d', 
          padding: '12px',
          borderRadius: '4px',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          <p style={{ color: '#8a8f98', fontSize: '0.7rem', marginBottom: '4px' }}>{payload[0].payload.name} Forecast</p>
          <p style={{ color: '#00ff9d', fontWeight: '700' }}>${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      backgroundColor: '#0d0f14',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #1f242d',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <style>{`
        .slider-input {
          width: 100%;
          accent-color: #00ff9d;
          background: #1f242d;
          height: 4px;
          border-radius: 2px;
          appearance: none;
          margin: 12px 0;
        }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .control-card {
          background: #14171c;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #1f242d;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Scenario Modeling <span style={{ color: '#00ff9d' }}>Lab</span>
          </h2>
          <p style={{ color: '#8a8f98', fontSize: '0.9rem' }}>Simulate strategic moves and see the impact on your runway.</p>
        </div>
        <div className="mono" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase' }}>Funding Readiness</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: stats.readiness > 70 ? '#00ff9d' : '#ffb800' }}>
            {stats.readiness}/100
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        {/* Graph Area */}
        <div style={{ background: '#14171c', padding: '20px', borderRadius: '8px', border: '1px solid #1f242d' }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase' }}>Projected Runway</div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '600' }}>{stats.runway} <span style={{ fontSize: '0.8rem', color: '#555' }}>Months</span></div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase' }}>Monthly Net Cash</div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '600', color: stats.netFlow >= 0 ? '#00ff9d' : '#ff4d4d' }}>
                {stats.netFlow >= 0 ? '+' : ''}{stats.netFlow.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f242d" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#444" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#444" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#00ff9d', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="cash" 
                  stroke="#00ff9d" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCash)" 
                  animationDuration={1000}
                />
                <ReferenceLine y={0} stroke="#ff4d4d" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Controls Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="control-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Users size={16} color="#00ff9d" />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>New Hires</span>
              <span className="mono" style={{ marginLeft: 'auto', color: '#00ff9d' }}>+{newHires}</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" 
              value={newHires} 
              onChange={(e) => setNewHires(parseInt(e.target.value))}
              className="slider-input" 
            />
            <div style={{ fontSize: '0.7rem', color: '#444' }}>Est. cost: ${(newHires * HIRE_COST).toLocaleString()}/mo</div>
          </div>

          <div className="control-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <TrendingUp size={16} color="#ffb800" />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Price Increase</span>
              <span className="mono" style={{ marginLeft: 'auto', color: '#ffb800' }}>{priceIncrease}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="50" 
              value={priceIncrease} 
              onChange={(e) => setPriceIncrease(parseInt(e.target.value))}
              className="slider-input" 
            />
            <div style={{ fontSize: '0.7rem', color: '#444' }}>Impacts existing gross revenue.</div>
          </div>

          <div className="control-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Megaphone size={16} color="#00ff9d" />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Ad Spend Boost</span>
              <span className="mono" style={{ marginLeft: 'auto', color: '#00ff9d' }}>+${adSpendBoost}</span>
            </div>
            <input 
              type="range" 
              min="0" max="20000" step="1000"
              value={adSpendBoost} 
              onChange={(e) => setAdSpendBoost(parseInt(e.target.value))}
              className="slider-input" 
            />
            <div style={{ fontSize: '0.7rem', color: '#444' }}>Assumed {AD_REVENUE_MULTIPLIER}x ROAS.</div>
          </div>

          <div style={{ marginTop: 'auto', padding: '16px', borderLeft: '2px solid #00ff9d', background: 'rgba(0, 255, 157, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00ff9d', marginBottom: '4px' }}>
              <ShieldAlert size={14} />
              <span className="mono" style={{ fontSize: '0.7rem', fontWeight: '700' }}>AI INSIGHT</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#8a8f98', lineHeight: '1.4' }}>
              {stats.netFlow < 0 
                ? "Current trajectory leads to cash exhaustion within the year. Consider the Price Increase scenario to stabilize."
                : "Scenario is sustainable. Funding readiness is optimal for a Series A bridge."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionGraph;