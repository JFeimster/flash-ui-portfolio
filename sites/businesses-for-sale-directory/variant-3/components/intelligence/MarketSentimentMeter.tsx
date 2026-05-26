import React, { useState, useEffect } from 'react';

const MarketSentimentMeter = () => {
  const [sentiment, setSentiment] = useState(68); // 0-100 scale

  const getStatus = (val: number) => {
    if (val > 75) return { label: 'Aggressive Expansion', color: 'var(--acid-green)' };
    if (val > 50) return { label: 'Cautious Optimism', color: 'var(--bone)' };
    if (val > 25) return { label: 'Asset Consolidation', color: 'var(--oxidized-copper)' };
    return { label: 'Liquidity Preservation', color: 'var(--blood-orange)' };
  };

  const status = getStatus(sentiment);

  return (
    <div className="sentiment-container">
      <style jsx>{`
        .sentiment-container {
          background: #0a0a0a;
          border: 2px solid #1a1a1a;
          padding: 2.5rem;
          color: #F5F5F0;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .sentiment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
          border-bottom: 1px solid #1a1a1a;
          padding-bottom: 1.5rem;
        }

        .report-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8E593E;
        }

        .title-group h2 {
          font-family: 'Times New Roman', serif; /* Luxury Editorial Feel */
          font-size: 2.5rem;
          font-style: italic;
          font-weight: 400;
          margin: 0.5rem 0;
          letter-spacing: -1px;
        }

        .meter-track {
          height: 4px;
          background: #1a1a1a;
          width: 100%;
          position: relative;
          margin: 4rem 0 2rem 0;
        }

        .meter-fill {
          position: absolute;
          height: 100%;
          background: ${status.color};
          width: ${sentiment}%;
          transition: width 1.5s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .meter-handle {
          position: absolute;
          top: -8px;
          left: ${sentiment}%;
          width: 20px;
          height: 20px;
          background: #050505;
          border: 2px solid ${status.color};
          transform: translateX(-50%);
          z-index: 2;
        }

        .labels {
          display: flex;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          color: #444;
          text-transform: uppercase;
          margin-top: 1rem;
        }

        .sentiment-data-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .data-point {
          border-left: 1px solid #1a1a1a;
          padding-left: 1rem;
        }

        .data-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: #666;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .data-value {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .brutalist-callout {
          margin-top: 2rem;
          background: #F5F5F0;
          color: #050505;
          padding: 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          display: inline-block;
          font-weight: 900;
          text-transform: uppercase;
        }

        .status-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: ${status.color};
          border: 1px solid ${status.color};
          padding: 0.25rem 0.75rem;
          margin-top: 1rem;
          display: inline-block;
        }
      `}</style>

      <div className="sentiment-header">
        <div className="title-group">
          <span className="report-meta">Intelligence Report / Vol. 24-03</span>
          <h2>The Oxidized Index</h2>
          <div className="status-badge">{status.label}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="data-label">Market Heat Score</span>
          <span style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'JetBrains Mono', color: 'var(--acid-green)' }}>
            {sentiment}
          </span>
        </div>
      </div>

      <div className="meter-container">
        <div className="meter-track">
          <div className="meter-fill"></div>
          <div className="meter-handle"></div>
        </div>
        <div className="labels">
          <span>Stagnant</span>
          <span>Equilibrium</span>
          <span>Overheated</span>
        </div>
      </div>

      <div className="sentiment-data-grid">
        <div className="data-point">
          <span className="data-label">Avg. Service Multiples</span>
          <span className="data-value">3.24x</span>
        </div>
        <div className="data-point">
          <span className="data-label">Debt Cost (SBA 7a)</span>
          <span className="data-value">11.25%</span>
        </div>
        <div className="data-point">
          <span className="data-label">Dry Powder Index</span>
          <span className="data-value">High</span>
        </div>
      </div>

      <div className="brutalist-callout">
        Proprietary Sentiment Analysis: Buy-Side Demand Up 14% MoM
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#888', lineHeight: '1.6', maxWidth: '600px' }}>
        Current conditions favor strategic consolidators with existing operational infrastructure. 
        High interest rates are filtering out speculative "tourist" buyers, leaving a high-quality 
        inventory of service-based assets for disciplined acquirers.
      </p>
    </div>
  );
};

export default MarketSentimentMeter;