import React, { useState } from 'react';

const WeeklyReviewWizard = () => {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({
    contractorContext: '',
    marketingSpike: '',
    hiringOutlook: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const styles = {
    container: {
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px',
      borderRadius: '12px',
      border: '1px solid #1f242d',
      maxWidth: '800px',
      margin: '0 auto',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      background: '#1f242d',
      color: '#00ff9d',
      border: '1px solid #00ff9d',
      marginBottom: '1.5rem',
    },
    header: {
      fontSize: '2rem',
      fontWeight: '800',
      letterSpacing: '-0.03em',
      marginBottom: '1rem',
    },
    subtext: {
      color: '#8a8f98',
      marginBottom: '2rem',
    },
    card: {
      background: '#0d0f14',
      border: '1px solid #1f242d',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '20px',
    },
    mono: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.85rem',
      color: '#00ff9d',
    },
    input: {
      width: '100%',
      background: '#14171c',
      border: '1px solid #1f242d',
      padding: '12px',
      color: 'white',
      borderRadius: '4px',
      marginTop: '10px',
      fontSize: '0.9rem',
    },
    btnPrimary: {
      background: '#00ff9d',
      color: '#000',
      padding: '12px 24px',
      borderRadius: '4px',
      fontWeight: '700',
      border: 'none',
      cursor: 'pointer',
    },
    btnSecondary: {
      background: 'transparent',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '4px',
      fontWeight: '600',
      border: '1px solid #1f242d',
      marginRight: '12px',
      cursor: 'pointer',
    },
    anomalyTag: {
      color: '#ff4d4d',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      background: 'rgba(255, 77, 77, 0.1)',
      padding: '2px 8px',
      borderRadius: '4px',
      marginLeft: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.badge}>Step {step} of 4: Friday Finance Rhythm</div>
      
      {step === 1 && (
        <div className="step-content">
          <h2 style={styles.header}>Weekly Pulse Check</h2>
          <p style={styles.subtext}>We've analyzed your bank sync from the last 7 days. Here is the high-level summary before we dive into the details.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={styles.card}>
              <div style={{ color: '#8a8f98', fontSize: '0.75rem', fontWeight: '600' }}>CASH OUTFLOW</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>$12,430.22</div>
              <div style={{ color: '#ff4d4d', fontSize: '0.8rem' }}>+14% vs last week</div>
            </div>
            <div style={styles.card}>
              <div style={{ color: '#8a8f98', fontSize: '0.75rem', fontWeight: '600' }}>NEW REVENUE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>$18,900.00</div>
              <div style={{ color: '#00ff9d', fontSize: '0.8rem' }}>↑ Healthy velocity</div>
            </div>
          </div>
          <button style={styles.btnPrimary} onClick={nextStep}>Review Anomalies</button>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h2 style={styles.header}>Spikes & Anomalies</h2>
          <p style={styles.subtext}>The AI flagged these 3 transactions as outside your 90-day average. Provide context to refine your forecast.</p>
          
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={styles.mono}>UPWORK_GLOBAL_Srvc</span>
              <span style={{ fontWeight: '700' }}>$4,200.00 <span style={styles.anomalyTag}>3x AVG</span></span>
            </div>
            <label style={{ fontSize: '0.8rem', color: '#8a8f98' }}>What was this for?</label>
            <input 
              style={styles.input} 
              placeholder="e.g. One-time website redesign" 
              value={inputs.contractorContext}
              onChange={(e) => setInputs({...inputs, contractorContext: e.target.value})}
            />
          </div>

          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={styles.mono}>META_ADS_MENLO_PK</span>
              <span style={{ fontWeight: '700' }}>$1,850.00 <span style={styles.anomalyTag}>SPIKE</span></span>
            </div>
            <label style={{ fontSize: '0.8rem', color: '#8a8f98' }}>Is this the new baseline for ad spend?</label>
            <input 
              style={styles.input} 
              placeholder="e.g. Scaling for Q4 launch" 
              value={inputs.marketingSpike}
              onChange={(e) => setInputs({...inputs, marketingSpike: e.target.value})}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <button style={styles.btnSecondary} onClick={prevStep}>Back</button>
            <button style={styles.btnPrimary} onClick={nextStep}>Update Runway</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <h2 style={styles.header}>Forward Outlook</h2>
          <p style={styles.subtext}>Your current runway is <b style={{color: '#fff'}}>6.2 months</b>. Are there any major upcoming expenses not yet in the system?</p>
          
          <div style={styles.card}>
            <h4 style={{ marginBottom: '12px' }}>Upcoming Hiring</h4>
            <select style={styles.input}>
              <option>No new hires planned for next 30 days</option>
              <option>1-2 new hires ($10k-$15k additional burn)</option>
              <option>Aggressive scaling (3+ hires)</option>
            </select>
          </div>

          <div style={styles.card}>
            <h4 style={{ marginBottom: '12px' }}>Strategic Note</h4>
            <textarea 
              style={{...styles.input, height: '80px', resize: 'none'}} 
              placeholder="Any other updates for the board or your own records?"
              value={inputs.hiringOutlook}
              onChange={(e) => setInputs({...inputs, hiringOutlook: e.target.value})}
            ></textarea>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button style={styles.btnSecondary} onClick={prevStep}>Back</button>
            <button style={styles.btnPrimary} onClick={nextStep}>Generate Memo</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="step-content">
          <h2 style={styles.header}>Strategy Memo Generated</h2>
          <p style={styles.subtext}>Your 'Plain-English' financial summary is ready for review.</p>
          
          <div style={{ ...styles.card, borderLeft: '4px solid #00ff9d', background: '#14171c' }}>
            <div style={{ ...styles.mono, marginBottom: '15px' }}>&gt; SUBJECT: WEEKLY_FINANCIAL_RECAP_OCT_27</div>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#e0e0e0' }}>
              <p style={{ marginBottom: '12px' }}>
                <b>Executive Summary:</b> We ended the week with a net positive position, though cash outflow increased by 14%. 
                This was primarily driven by a one-time contractor expense for <i>{inputs.contractorContext || "unspecified services"}</i>.
              </p>
              <p style={{ marginBottom: '12px' }}>
                <b>Burn & Runway:</b> Current monthly burn is stabilizing at $42k. With $260k in the bank, our runway extends to 
                April 2024. The Meta Ads spike of $1,850 is noted as <i>{inputs.marketingSpike || "a potential new baseline"}</i>.
              </p>
              <p style={{ marginBottom: '12px' }}>
                <b>Action Items:</b> Based on this week's data, we are clear to proceed with the Q4 marketing scale, 
                but should defer the second engineering hire until November to maintain a 6-month buffer.
              </p>
              <p style={{ ...styles.mono, marginTop: '20px', color: '#8a8f98' }}>// Generated by CFO-in-a-Box AI</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ ...styles.btnPrimary, flex: 1 }}>Copy to Slack/Email</button>
            <button style={{ ...styles.btnSecondary, flex: 1 }} onClick={() => setStep(1)}>Restart Rhythm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReviewWizard;