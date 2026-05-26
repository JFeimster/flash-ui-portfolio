import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Zap, 
  DollarSign, 
  Clock, 
  ShieldCheck,
  ArrowUpRight,
  Maximize2
} from 'lucide-react';

const MetricGrid: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: '#050608', 
      color: '#ffffff', 
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
      minHeight: '100vh'
    }}>
      {/* Financial Signal Alerts */}
      <div style={{ 
        background: 'rgba(255, 77, 77, 0.05)', 
        border: '1px solid rgba(255, 77, 77, 0.2)', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ 
          background: '#ff4d4d', 
          padding: '8px', 
          borderRadius: '4px', 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <AlertTriangle size={18} color="#000" />
        </div>
        <div style={{ flexGrow: 1 }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#ff4d4d' }}>PRIORITY SIGNAL: COST LEAK DETECTED</h4>
          <p style={{ fontSize: '0.8rem', color: '#8a8f98', margin: '4px 0 0' }}>
            Unusual 22% spike in Cloud Infrastructure costs. Detected 3 duplicate "Pro" licenses in your SaaS stack.
          </p>
        </div>
        <button style={{ 
          background: 'transparent', 
          border: '1px solid #ff4d4d', 
          color: '#ff4d4d', 
          padding: '6px 12px', 
          borderRadius: '4px', 
          fontSize: '0.75rem', 
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Resolve Now
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Burn Rate */}
        <div style={{ background: '#0d0f14', border: '1px solid #1f242d', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8a8f98', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Burn</span>
            <DollarSign size={16} color="#8a8f98" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>$24,402</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#ff4d4d', fontWeight: 600 }}>
            <TrendingUp size={14} /> 
            <span>+12% vs last month</span>
          </div>
        </div>

        {/* Runway */}
        <div style={{ background: '#0d0f14', border: '1px solid #1f242d', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8a8f98', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Runway</span>
            <Clock size={16} color="#8a8f98" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>5.4 <span style={{ fontSize: '1rem', color: '#8a8f98' }}>Months</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#ffb800', fontWeight: 600 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb800' }}></div>
            <span>Critical under 6 months</span>
          </div>
        </div>

        {/* Funding Readiness */}
        <div style={{ background: '#0d0f14', border: '2px solid #00ff9d', borderRadius: '12px', padding: '24px', boxShadow: '0 0 20px rgba(0, 255, 157, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#00ff9d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Readiness Score</span>
            <ShieldCheck size={16} color="#00ff9d" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px', color: '#00ff9d' }}>74<span style={{ fontSize: '1rem', color: '#8a8f98' }}>/100</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#00ff9d', fontWeight: 600 }}>
            <TrendingUp size={14} /> 
            <span>Strong improvement</span>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div style={{ background: '#0d0f14', border: '1px solid #1f242d', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8a8f98', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Cash Flow</span>
            <Zap size={16} color="#8a8f98" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>+$8,210</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#00ff9d', fontWeight: 600 }}>
            <TrendingUp size={14} /> 
            <span>Positive for 3 months</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Cash Flow Heatmap */}
        <div style={{ background: '#0d0f14', border: '1px solid #1f242d', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Cash Flow Heatmap (6-Month Forecast)</h3>
            <Maximize2 size={16} color="#8a8f98" style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', height: '180px', alignItems: 'flex-end' }}>
            {[0.4, 0.6, 0.9, 0.3, 0.8, 1].map((val, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ 
                  height: `${val * 120}px`, 
                  background: val > 0.5 ? '#00ff9d' : '#1f242d', 
                  borderRadius: '4px',
                  opacity: val,
                  transition: '0.3s'
                }}></div>
                <span style={{ 
                  textAlign: 'center', 
                  fontFamily: "'JetBrains Mono', monospace", 
                  fontSize: '0.65rem', 
                  color: '#8a8f98' 
                }}>M0{i+1}</span>
              </div>
            ))}
          </div>
          <div style={{ 
            marginTop: '20px', 
            paddingTop: '20px', 
            borderTop: '1px solid #1f242d', 
            display: 'flex', 
            justifyContent: 'space-between' 
          }}>
            <div style={{ fontSize: '0.8rem', color: '#8a8f98' }}>
              <span style={{ color: '#00ff9d', fontWeight: 700 }}>AI Note:</span> Cash reserves projected to peak in M06.
            </div>
            <div style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>
              Forecasted Liquidity: $152k
            </div>
          </div>
        </div>

        {/* AI CFO Sidebar */}
        <div style={{ background: '#14171c', border: '1px solid #1f242d', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00ff9d', fontSize: '0.7rem', marginBottom: '8px' }}>&gt; CFO_BRAIN_V2.1</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Advisor Insights</h3>
          </div>
          
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#0d0f14', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.5' }}>
              "Your burn rate is drifting above the 10% threshold. I recommend holding off on the next marketing hire until Q3 revenue stabilizes."
            </div>
            <div style={{ background: '#0d0f14', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.5', borderLeft: '3px solid #00ff9d' }}>
              "Funding Opportunity: Your current EBITDA margin qualifies you for a $50k low-interest line of credit. Shall I draft the application?"
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <input 
              type="text" 
              placeholder="Ask your CFO anything..." 
              style={{ 
                width: '100%', 
                background: '#050608', 
                border: '1px solid #1f242d', 
                padding: '12px', 
                borderRadius: '6px', 
                color: '#fff',
                fontSize: '0.85rem'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricGrid;