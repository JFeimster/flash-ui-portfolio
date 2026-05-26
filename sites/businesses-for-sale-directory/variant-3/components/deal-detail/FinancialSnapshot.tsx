import React, { useState } from 'react';

const FinancialSnapshot = () => {
  const [isAccessRequested, setIsAccessRequested] = useState(false);

  const financialData = [
    { year: '2021', rev: 2.1, sde: 0.38 },
    { year: '2022', rev: 2.8, sde: 0.42 },
    { year: '2023', rev: 3.5, sde: 0.45 },
  ];

  const maxRev = 4; // for scaling

  return (
    <div className="financial-snapshot-container" style={{
      backgroundColor: '#050505',
      color: '#F5F5F0',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem',
      border: '2px solid #1A1A1A',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header / Meta */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        borderBottom: '2px solid #F5F5F0',
        paddingBottom: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            color: '#8E593E', 
            fontSize: '0.8rem',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            CASE NO. 8832-TX // CONFIDENTIAL TEAR-SHEET
          </span>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 900, 
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            lineHeight: 1
          }}>
            Financial <span style={{ color: '#C1FF00' }}>Intelligence</span>
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            backgroundColor: '#FF3D00', 
            color: '#F5F5F0', 
            padding: '0.25rem 0.75rem', 
            fontSize: '0.7rem', 
            fontWeight: 900,
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '0.5rem'
          }}>
            HIGH CONFIDENCE DATA
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: "'JetBrains Mono', monospace" }}>
            LAST UPDATED: 24.OCT.23
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1px', 
        backgroundColor: '#1A1A1A',
        border: '1px solid #1A1A1A',
        marginBottom: '3rem'
      }}>
        {[
          { label: 'Growth Rate (YoY)', value: '+24.2%', color: '#C1FF00' },
          { label: 'SDE Margin', value: '12.8%', color: '#F5F5F0' },
          { label: 'OpEx Ratio', value: '62.4%', color: '#F5F5F0' },
          { label: 'Debt Coverage', value: '3.2x', color: '#C1FF00' }
        ].map((kpi, i) => (
          <div key={i} style={{ backgroundColor: '#0F0F0F', padding: '1.5rem' }}>
            <span style={{ 
              display: 'block', 
              fontSize: '0.65rem', 
              color: '#666', 
              textTransform: 'uppercase', 
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: '0.5rem'
            }}>{kpi.label}</span>
            <span style={{ 
              fontSize: '1.8rem', 
              fontWeight: 900, 
              color: kpi.color,
              fontFamily: "'JetBrains Mono', monospace"
            }}>{kpi.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Visual Analytics */}
        <section>
          <h3 style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: '0.9rem', 
            marginBottom: '1.5rem',
            borderLeft: '4px solid #8E593E',
            paddingLeft: '1rem'
          }}>HISTORICAL REVENUE & EARNINGS (USD MM)</h3>
          
          <div style={{ 
            height: '300px', 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: '2rem', 
            padding: '2rem',
            backgroundColor: '#0F0F0F',
            border: '1px solid #1A1A1A',
            position: 'relative'
          }}>
            {financialData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', width: '100%', gap: '4px', alignItems: 'flex-end', height: '200px' }}>
                  <div style={{ 
                    height: `${(d.rev / maxRev) * 100}%`, 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #F5F5F0',
                    width: '60%' 
                  }}></div>
                  <div style={{ 
                    height: `${(d.sde / maxRev) * 100}%`, 
                    backgroundColor: '#C1FF00', 
                    width: '40%' 
                  }}></div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}>{d.year}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', border: '1px solid #F5F5F0' }}></div> GROSS REVENUE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: '#C1FF00' }}></div> SDE (EARNINGS)
            </div>
          </div>
        </section>

        {/* SWOT Analysis */}
        <section>
          <h3 style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: '0.9rem', 
            marginBottom: '1.5rem',
            borderLeft: '4px solid #8E593E',
            paddingLeft: '1rem'
          }}>OPERATIONAL SWOT</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1px', 
            backgroundColor: '#F5F5F0',
            border: '1px solid #F5F5F0'
          }}>
            {[
              { t: 'STRENGTHS', c: 'High recurring revenue, Proprietary IP', bg: '#0F0F0F' },
              { t: 'WEAKNESSES', c: 'Customer concentration (Top 3 = 40%)', bg: '#0F0F0F' },
              { t: 'OPPORTUNITIES', c: 'Adjacent market expansion, SaaS pivot', bg: '#0F0F0F' },
              { t: 'THREATS', c: 'Rising cost of materials, Regulatory shifts', bg: '#0F0F0F' }
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: item.bg, padding: '1rem' }}>
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.6rem', 
                  fontWeight: 900, 
                  color: i > 1 ? '#C1FF00' : '#8E593E',
                  marginBottom: '0.5rem'
                }}>{item.t}</span>
                <p style={{ fontSize: '0.75rem', color: '#BBB', lineHeight: 1.3 }}>{item.c}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Risk Terminal */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        border: '2px solid #FF3D00', 
        backgroundColor: 'rgba(255, 61, 0, 0.05)',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '-12px', 
          left: '20px', 
          backgroundColor: '#FF3D00', 
          color: '#F5F5F0', 
          padding: '0 10px', 
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          fontWeight: 900
        }}>RISK_ASSESSMENT_V.2</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#FF3D00', display: 'block', marginBottom: '0.5rem' }}>[CRITICAL] LEASE TERMS</span>
            <p style={{ fontSize: '0.85rem', color: '#F5F5F0' }}>Facility lease expires in 14 months. Renewal options are currently under negotiation but not guaranteed at current rates.</p>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#FF3D00', display: 'block', marginBottom: '0.5rem' }}>[WARNING] KEY MAN RISK</span>
            <p style={{ fontSize: '0.85rem', color: '#F5F5F0' }}>Founding technician holds 15% of client relationships. Post-acquisition retention plan is mandatory for deal closure.</p>
          </div>
        </div>
      </div>

      {/* Data Room Access */}
      <div style={{ 
        marginTop: '3rem', 
        backgroundColor: '#F5F5F0', 
        color: '#050505', 
        padding: '3rem', 
        textAlign: 'center',
        border: '2px solid #F5F5F0'
      }}>
        <h4 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 900, 
          textTransform: 'uppercase', 
          marginBottom: '1rem',
          letterSpacing: '-0.5px'
        }}>Secure Data Room Entrance</h4>
        <p style={{ 
          maxWidth: '600px', 
          margin: '0 auto 2rem', 
          fontSize: '0.9rem',
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          Access P&L statements, tax returns (3Y), employee contracts, and customer aging reports. Verification of funds and signed NDA required.
        </p>
        <button 
          onClick={() => setIsAccessRequested(true)}
          style={{
            backgroundColor: '#050505',
            color: '#F5F5F0',
            border: 'none',
            padding: '1.5rem 3rem',
            fontSize: '1rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C1FF00'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#050505'}
        >
          {isAccessRequested ? 'REQUEST PENDING...' : 'VERIFY & ENTER DATA ROOM'}
        </button>
      </div>

      <style jsx>{`
        .financial-snapshot-container::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.02;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default FinancialSnapshot;