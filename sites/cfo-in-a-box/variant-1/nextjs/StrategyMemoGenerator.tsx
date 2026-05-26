import React, { useState } from 'react';

const StrategyMemoGenerator = () => {
  const [step, setStep] = useState(1);
  const [anomalies, setAnomalies] = useState([
    { id: 1, category: 'Software', vendor: 'AWS Cloud Services', amount: 1420.50, trend: '+24% vs last month', note: 'Unusually high data egress usage detected.', status: 'pending' },
    { id: 2, category: 'Marketing', vendor: 'Meta Ads', amount: 3200.00, trend: '-12% vs last month', note: 'Spend decreased but CAC remains stable.', status: 'pending' },
    { id: 3, category: 'Payroll', vendor: 'Gusto / Contractor', amount: 850.00, trend: 'New Transaction', note: 'New vendor detected. Categorize as OpEx?', status: 'pending' }
  ]);

  const [inputs, setInputs] = useState({
    awsReason: '',
    hiringStatus: 'on-track',
    weeklyWin: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '40px auto',
      backgroundColor: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      color: '#ffffff'
    },
    header: {
      padding: '32px',
      borderBottom: '1px solid #1f242d',
      background: 'linear-gradient(to bottom right, #14171c, #0d0f14)'
    },
    progress: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px'
    },
    progressStep: (active) => ({
      height: '4px',
      flex: 1,
      backgroundColor: active ? '#00ff9d' : '#1f242d',
      borderRadius: '2px',
      transition: '0.3s'
    }),
    badge: {
      backgroundColor: '#1f242d',
      color: '#00ff9d',
      fontSize: '0.7rem',
      fontWeight: '800',
      padding: '4px 10px',
      borderRadius: '4px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      border: '1px solid #00ff9d'
    },
    title: { fontSize: '1.75rem', fontWeight: 800, margin: '12px 0 4px', letterSpacing: '-0.02em' },
    subtitle: { color: '#8a8f98', fontSize: '0.95rem', marginBottom: '0' },
    content: { padding: '32px' },
    card: {
      backgroundColor: '#14171c',
      border: '1px solid #1f242d',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px'
    },
    mono: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' },
    label: { display: 'block', color: '#8a8f98', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '8px' },
    input: {
      width: '100%',
      backgroundColor: '#050608',
      border: '1px solid #1f242d',
      padding: '12px',
      color: '#fff',
      borderRadius: '4px',
      marginBottom: '20px',
      outline: 'none',
      fontSize: '0.9rem'
    },
    btn: {
      padding: '12px 24px',
      borderRadius: '4px',
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
      fontSize: '0.9rem',
      transition: '0.2s'
    },
    primaryBtn: { backgroundColor: '#00ff9d', color: '#000' },
    outlineBtn: { backgroundColor: 'transparent', border: '1px solid #1f242d', color: '#fff', marginRight: '12px' },
    memoText: {
      lineHeight: '1.8',
      color: '#d1d5db',
      fontSize: '1rem',
      whiteSpace: 'pre-wrap' as const,
      padding: '24px',
      backgroundColor: '#050608',
      borderLeft: '3px solid #00ff9d',
      borderRadius: '0 8px 8px 0'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.progress}>
          <div style={styles.progressStep(step >= 1)}></div>
          <div style={styles.progressStep(step >= 2)}></div>
          <div style={styles.progressStep(step >= 3)}></div>
        </div>
        <span style={styles.badge}>Weekly Review Rhythm</span>
        <h1 style={styles.title}>Friday Strategy Memo</h1>
        <p style={styles.subtitle}>Step {step} of 3: {step === 1 ? 'Anomalies' : step === 2 ? 'Executive Input' : 'Memo Finalization'}</p>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {step === 1 && (
          <div>
            <p style={{ marginBottom: '24px', color: '#8a8f98' }}>We've identified 3 financial anomalies this week. Review and clarify before we generate your memo.</p>
            {anomalies.map(item => (
              <div key={item.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ ...styles.mono, color: '#00ff9d', marginBottom: '4px' }}>{item.category} / {item.vendor}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${item.amount.toLocaleString()}</div>
                  </div>
                  <div style={{ color: item.trend.includes('+') ? '#ff4d4d' : '#00ff9d', fontWeight: 600, fontSize: '0.8rem' }}>{item.trend}</div>
                </div>
                <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#8a8f98' }}>{item.note}</p>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button style={{ ...styles.btn, ...styles.outlineBtn, padding: '6px 12px', fontSize: '0.75rem' }}>It's Correct</button>
                  <button style={{ ...styles.btn, ...styles.outlineBtn, padding: '6px 12px', fontSize: '0.75rem' }}>Need to Investigate</button>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'right', marginTop: '32px' }}>
              <button onClick={nextStep} style={{ ...styles.btn, ...styles.primaryBtn }}>Verify & Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={styles.card}>
              <label style={styles.label}>Regarding the AWS Spike:</label>
              <input 
                style={styles.input} 
                placeholder="e.g., Scaling for new beta launch..."
                value={inputs.awsReason}
                onChange={(e) => setInputs({...inputs, awsReason: e.target.value})}
              />
              
              <label style={styles.label}>Major Win this week:</label>
              <textarea 
                style={{ ...styles.input, height: '80px', resize: 'none' }} 
                placeholder="e.g., Closed the Miller account, optimized ad spend..."
                onChange={(e) => setInputs({...inputs, weeklyWin: e.target.value})}
              />

              <label style={styles.label}>Runway Confidence Score (1-10):</label>
              <select style={styles.input}>
                <option>8 - Very High</option>
                <option>5 - Moderate</option>
                <option>2 - Immediate Concern</option>
              </select>
            </div>
            <div style={{ textAlign: 'right', marginTop: '32px' }}>
              <button onClick={prevStep} style={{ ...styles.btn, ...styles.outlineBtn }}>Back</button>
              <button onClick={nextStep} style={{ ...styles.btn, ...styles.primaryBtn }}>Generate Memo</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={styles.mono}>ID: STRAT-MEMO-Q4-WK42</div>
              <button style={{ ...styles.btn, ...styles.outlineBtn, padding: '6px 12px', fontSize: '0.75rem' }}>Copy to Clipboard</button>
            </div>
            <div style={styles.memoText}>
<span style={{ color: '#00ff9d', fontWeight: 800 }}>EXECUTIVE SUMMARY: WEEK 42</span>
<br/><br/>
<span style={styles.mono}>[OVERVIEW]</span>
The business remains in a strong cash position with a forecasted runway of 5.8 months. Net cash flow for the week ended positive at +$8,450.

<span style={styles.mono}>[ANOMALY REPORT]</span>
- AWS expenses saw a 24% increase. Founder context: "{inputs.awsReason || 'Scaling operations'}"
- Meta Ads spend was throttled by 12% to preserve ROI as CAC hit ceiling. 

<span style={styles.mono}>[STRATEGIC WINS]</span>
- {inputs.weeklyWin || 'Operations stabilized across primary channels.'}

<span style={styles.mono}>[CFO RECOMMENDATION]</span>
Current burn is manageable, but the AWS spike needs monitoring. If data egress doesn't normalize by next Friday, we should evaluate moving to a committed use plan. Recommend proceeding with the new contractor hire as funding readiness remains at 72/100.
            </div>
            <div style={{ textAlign: 'right', marginTop: '32px' }}>
              <button onClick={() => setStep(1)} style={{ ...styles.btn, ...styles.outlineBtn }}>Restart Rhythm</button>
              <button style={{ ...styles.btn, ...styles.primaryBtn }}>Share with Stakeholders</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyMemoGenerator;