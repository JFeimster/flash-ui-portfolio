"use client";

import React, { useMemo } from 'react';

interface ProjectionProps {
  sde: number;
  debtService: number;
  purchasePrice: number;
  downPayment: number;
  growthRate?: number;
}

const ProjectionCharts: React.FC<ProjectionProps> = ({
  sde = 450000,
  debtService = 180000,
  purchasePrice = 1200000,
  downPayment = 120000,
  growthRate = 0.05
}) => {
  const years = [0, 1, 2, 3, 4, 5];
  
  const projections = useMemo(() => {
    return years.map(year => {
      const projectedSDE = sde * Math.pow(1 + growthRate, year);
      const postDebtCashFlow = projectedSDE - debtService;
      const dscr = projectedSDE / debtService;
      const cumulativeCashFlow = (postDebtCashFlow * year); // Simplified
      return {
        year,
        sde: projectedSDE,
        cashFlow: postDebtCashFlow,
        dscr: dscr.toFixed(2),
        roi: ((postDebtCashFlow / downPayment) * 100).toFixed(1)
      };
    });
  }, [sde, debtService, growthRate, downPayment]);

  const maxVal = Math.max(...projections.map(p => p.sde)) * 1.1;
  const chartHeight = 200;
  const chartWidth = 600;

  const getPoints = (key: 'sde' | 'cashFlow') => {
    return projections.map((p, i) => {
      const x = (i / (years.length - 1)) * chartWidth;
      const y = chartHeight - (p[key] / maxVal) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="analyzer-visuals" style={{
      background: 'var(--panel)',
      border: 'var(--border-width) solid var(--graphite)',
      padding: '2rem',
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <div>
          <h3 style={{ color: 'var(--bone)', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            // 5-YEAR CASH FLOW PROJECTION
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '2px', background: 'var(--acid-green)' }}></div>
              <span style={{ fontSize: '0.6rem', color: '#888' }}>SDE (OPERATING INCOME)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '2px', background: 'var(--blood-orange)' }}></div>
              <span style={{ fontSize: '0.6rem', color: '#888' }}>POST-DEBT CASH FLOW</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>AVG. DSCR</span>
          <span style={{ color: 'var(--acid-green)', fontSize: '1.5rem', fontWeight: 900 }}>
            {(sde / debtService).toFixed(2)}x
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: `${chartHeight}px`, marginBottom: '1rem' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line
              key={tick}
              x1="0" y1={chartHeight * tick}
              x2={chartWidth} y2={chartHeight * tick}
              stroke="var(--graphite)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
          
          {/* Debt Service Floor Line */}
          <line 
            x1="0" y1={chartHeight - (debtService / maxVal) * chartHeight}
            x2={chartWidth} y2={chartHeight - (debtService / maxVal) * chartHeight}
            stroke="#333"
            strokeWidth="1"
          />

          {/* SDE Line */}
          <polyline
            fill="none"
            stroke="var(--acid-green)"
            strokeWidth="3"
            points={getPoints('sde')}
            style={{ transition: 'all 0.3s' }}
          />

          {/* Cash Flow Line */}
          <polyline
            fill="none"
            stroke="var(--blood-orange)"
            strokeWidth="3"
            points={getPoints('cashFlow')}
            style={{ transition: 'all 0.3s' }}
          />

          {/* Data Points */}
          {projections.map((p, i) => (
            <circle
              key={i}
              cx={(i / (years.length - 1)) * chartWidth}
              cy={chartHeight - (p.sde / maxVal) * chartHeight}
              r="4"
              fill="var(--obsidian)"
              stroke="var(--acid-green)"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(6, 1fr)', 
        borderTop: '1px solid var(--graphite)',
        paddingTop: '1rem'
      }}>
        {projections.map((p, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '0.6rem', color: '#444' }}>YEAR {p.year}</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--bone)', fontWeight: 700 }}>
              {p.roi}% <span style={{ fontSize: '0.5rem', color: '#666' }}>ROI</span>
            </span>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: 'rgba(193, 255, 0, 0.03)', 
        border: '1px solid var(--graphite)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.55rem', color: '#666', textTransform: 'uppercase' }}>Sensitivity Margin</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--acid-green)' }}>+12.4% BREAKEVEN</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.55rem', color: '#666', textTransform: 'uppercase' }}>Principal Paydown (Y1)</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--bone)' }}>$42,500</span>
          </div>
        </div>
        <button style={{
          background: 'transparent',
          border: '1px solid var(--oxidized-copper)',
          color: 'var(--oxidized-copper)',
          fontSize: '0.6rem',
          padding: '0.4rem 0.8rem',
          cursor: 'pointer',
          fontWeight: 900,
          textTransform: 'uppercase'
        }}>
          Export Stress Test
        </button>
      </div>

      <style jsx>{`
        .analyzer-visuals {
          position: relative;
          overflow: hidden;
        }
        .analyzer-visuals::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.02) 2px,
            rgba(255,255,255,0.02) 4px
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default ProjectionCharts;