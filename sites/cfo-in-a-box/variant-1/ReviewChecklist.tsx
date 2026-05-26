import React, { useState } from 'react';

const ReviewChecklist = () => {
  const [step, setStep] = useState(1);
  const [anomalies, setAnomalies] = useState([
    { id: 1, vendor: 'AWS Cloud Services', amount: 1450.00, status: 'unusual', note: '22% higher than last month' },
    { id: 2, vendor: 'Starbucks / Travel', amount: 42.50, status: 'flagged', note: 'Categorize as Sales or Personal?' },
    { id: 3, vendor: 'Unidentified Stripe Payout', amount: 8400.00, status: 'pending', note: 'Matches Invoice #844?' }
  ]);

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
    header: {
      marginBottom: '32px',
      borderBottom: '1px solid #1f242d',
      paddingBottom: '20px',
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
      marginBottom: '1rem',
    },
    stepIndicator: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
    },
    dot: (active: boolean) => ({
      height: '4px',
      flex: 1,
      backgroundColor: active ? '#00ff9d' : '#1f242d',
      borderRadius: '2px',
      transition: '0.3s',
    }),
    card: {
      background: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px',
    },
    mono: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.8rem',
      color: '#00ff9d',
    },
    anomalyRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: '1px solid #14171c',
    },
    btnPrimary: {
      backgroundColor: '#00ff9d',
      color: '#000',
      padding: '12px 24px',
      borderRadius: '4px',
      fontWeight: '700',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    btnOutline: {
      backgroundColor: 'transparent',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '4px',
      fontWeight: '600',
      border: '1px solid #1f242d',
      cursor: 'pointer',
      marginRight: '12px',
    },
    input: {
      width: '100%',
      background: '#050608',
      border: '1px solid #1f242d',
      padding: '12px',
      color: '#fff',
      borderRadius: '4px',
      marginTop: '8px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>Friday Finance Rhythm</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Weekly Strategy Review</h2>
        <p style={{ color: '#8a8f98', marginTop: '8px' }}>Step {step} of 4: Surfacing week-over-week anomalies</p>
      </div>

      <div style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((i) => <div key={i} style={styles.dot(step >= i)} />)}
      </div>

      {step === 1 && (
        <div className="step-content">
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Verify Transaction Flags</h3>
            <p style={{ color: '#8a8f98', fontSize: '0.9rem', marginBottom: '20px' }}>AI detected 3 items requiring founder input before generating the memo.</p>
            
            {anomalies.map((item) => (
              <div key={item.id} style={styles.anomalyRow}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.vendor}</div>
                  <div style={{ fontSize: '0.75rem', color: '#ffb800' }}>{item.note}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>${item.amount.toFixed(2)}</div>
                  <div style={styles.mono}>FIX STATUS</div>
                </div>
              </div>
            ))}
          </div>
          <button style={styles.btnPrimary} onClick={() => setStep(2)}>Confirm All Items</button>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h3 style={{ marginBottom: '16px' }}>Contextual Insights</h3>
          <p style={{ color: '#8a8f98', fontSize: '0.9rem', marginBottom: '20px' }}>What was the primary focus of spending this week?</p>
          <div style={styles.card}>
            <label style={{ fontSize: '0.75rem', color: '#8a8f98', fontWeight: 600, textTransform: 'uppercase' }}>Founder Notes</label>
            <textarea 
              style={{ ...styles.input, height: '100px', resize: 'none' }} 
              placeholder="e.g., Heavy ad spend due to Q4 campaign launch, or one-time equipment purchase..."
            />
          </div>
          <button style={styles.btnOutline} onClick={() => setStep(1)}>Back</button>
          <button style={styles.btnPrimary} onClick={() => setStep(3)}>Next: Runway Check</button>
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <h3 style={{ marginBottom: '16px' }}>Scenario Validation</h3>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#8a8f98' }}>Projected Burn</span>
              <span style={{ fontWeight: 700 }}>$12,400 /mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8a8f98' }}>Est. Runway</span>
              <span style={{ color: '#00ff9d', fontWeight: 700 }}>7.2 Months</span>
            </div>
          </div>
          <p style={{ color: '#8a8f98', fontSize: '0.85rem', marginBottom: '20px' }}>Does this align with your hiring plan for next month?</p>
          <button style={styles.btnOutline} onClick={() => setStep(2)}>Back</button>
          <button style={styles.btnPrimary} onClick={() => setStep(4)}>Generate Final Memo</button>
        </div>
      )}

      {step === 4 && (
        <div className="step-content">
          <div style={{ ...styles.card, borderLeft: '4px solid #00ff9d' }}>
            <div style={{ ...styles.mono, marginBottom: '12px' }}>&gt; DRAFT_FINANCIAL_MEMO_WK42.md</div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#e0e0e0' }}>
              <p><strong>Executive Summary:</strong> Cash position remains strong at $84k. Revenue trended 4% up this week, primarily driven by SaaS renewals.</p>
              <br />
              <p><strong>Action Items:</strong> The AWS spike ($1.4k) needs DevOps review. We are currently on track to hit 8 months of runway if we delay the Senior Dev hire until November.</p>
              <br />
              <p><strong>Health Score:</strong> 78/100 (Stable)</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ ...styles.btnPrimary, flex: 1 }}>Share with Stakeholders</button>
            <button style={{ ...styles.btnOutline, flex: 1, marginRight: 0 }}>Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewChecklist;