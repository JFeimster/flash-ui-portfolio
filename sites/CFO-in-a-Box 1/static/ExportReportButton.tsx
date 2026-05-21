import React, { useState } from 'react';
import { FileText, ChevronRight, AlertCircle, CheckCircle2, Download, Loader2, X } from 'lucide-react';

const ExportReportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'anomalies' | 'input' | 'generating' | 'final'>('intro');
  const [userInput, setUserInput] = useState('');

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 6, 8, 0.9)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    },
    modal: {
      backgroundColor: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      position: 'relative' as const,
      boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
    },
    header: {
      padding: '24px',
      borderBottom: '1px solid #1f242d',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    content: {
      padding: '32px'
    },
    footer: {
      padding: '24px',
      borderTop: '1px solid #1f242d',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      background: '#1f242d',
      color: '#00ff9d',
      border: '1px solid #00ff9d',
      marginBottom: '1rem'
    },
    anomalyCard: {
      background: '#14171c',
      border: '1px solid #1f242d',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start'
    },
    memoPreview: {
      background: '#050608',
      borderLeft: '3px solid #00ff9d',
      padding: '24px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.9rem',
      lineHeight: '1.6',
      color: '#ffffff'
    }
  };

  const handleNext = () => {
    if (step === 'intro') setStep('anomalies');
    else if (step === 'anomalies') setStep('input');
    else if (step === 'input') {
      setStep('generating');
      setTimeout(() => setStep('final'), 2500);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{
          padding: '10px 20px',
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          border: 'none',
          backgroundColor: '#00ff9d',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <FileText size={16} />
        Friday Finance Rhythm
      </button>

      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.header}>
              <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                WEEKLY REVIEW <span style={{ color: '#00ff9d' }}>& STRATEGY MEMO</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8a8f98', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.content}>
              {step === 'intro' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={styles.badge}>Step 01: The Rhythm</div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Ready for your Weekly Review?</h2>
                  <p style={{ color: '#8a8f98', marginBottom: '2rem' }}>
                    We'll analyze this week's movement, flag anomalies, and prepare a strategy memo for your stakeholders.
                  </p>
                  <div style={{ background: '#14171c', padding: '20px', borderRadius: '8px', textAlign: 'left' }}>
                    <div style={{ color: '#00ff9d', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', marginBottom: '8px' }}>&gt; SESSION_PREP</div>
                    <ul style={{ list-style: 'none', color: '#8a8f98', fontSize: '0.85rem' }}>
                      <li style={{ marginBottom: '8px' }}>• 142 New transactions ingested</li>
                      <li style={{ marginBottom: '8px' }}>• Payroll reconciled for EOM</li>
                      <li>• 2 Anomalies detected in SaaS spend</li>
                    </ul>
                  </div>
                </div>
              )}

              {step === 'anomalies' && (
                <div>
                  <div style={styles.badge}>Step 02: Anomalies</div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Unusual Activity Detected</h3>
                  
                  <div style={styles.anomalyCard}>
                    <AlertCircle color="#ffb800" size={24} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>AWS Spend Spike (+24%)</div>
                      <p style={{ color: '#8a8f98', fontSize: '0.8rem' }}>Infrastructure costs rose to $4,200 vs $3,380 average. Possible unoptimized instance or new deployment?</p>
                    </div>
                  </div>

                  <div style={styles.anomalyCard}>
                    <AlertCircle color="#ffb800" size={24} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Unknown Subscription: "Linear.app"</div>
                      <p style={{ color: '#8a8f98', fontSize: '0.8rem' }}>New monthly charge of $120. This was not in last month's ledger.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 'input' && (
                <div>
                  <div style={styles.badge}>Step 03: Founder Input</div>
                  <h3 style={{ marginBottom: '1rem' }}>Context is King</h3>
                  <p style={{ color: '#8a8f98', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Any major wins or upcoming changes we should include in the memo?
                  </p>
                  <textarea 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="e.g. We closed the Enterprise deal. Hiring a new PM next month. AWS spike was for the staging environment migration."
                    style={{
                      width: '100%',
                      height: '120px',
                      background: '#050608',
                      border: '1px solid #1f242d',
                      borderRadius: '8px',
                      padding: '16px',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>
              )}

              {step === 'generating' && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Loader2 size={48} className="animate-spin" style={{ color: '#00ff9d', margin: '0 auto 20px' }} />
                  <h3>Synthesizing Strategy Memo...</h3>
                  <p style={{ color: '#8a8f98', fontSize: '0.85rem', marginTop: '12px', fontFamily: 'JetBrains Mono' }}>
                    Analyzing cash flow patterns + founder context...
                  </p>
                </div>
              )}

              {step === 'final' && (
                <div>
                  <div style={styles.badge}>Step 04: Final Memo</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Strategic Review: Week 42</h3>
                    <CheckCircle2 color="#00ff9d" size={24} />
                  </div>
                  
                  <div style={styles.memoPreview}>
                    <div style={{ fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid #1f242d', paddingBottom: '8px' }}>
                      Executive Summary
                    </div>
                    <p style={{ marginBottom: '12px' }}>
                      Cash position remains strong at $142k. Burn increased slightly due to AWS migration, but project ROI justifies the spend. 
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>Key Action:</strong> Renegotiate Linear seats (currently over-provisioned) and finalize PM job description.
                    </p>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#00ff9d' }}>
                      &gt; Forecasted Runway: 7.2 Months
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.footer}>
              {step !== 'generating' && (
                <>
                  <button 
                    onClick={() => setIsOpen(false)}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      border: '1px solid #1f242d',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleNext}
                    style={{
                      padding: '10px 24px',
                      background: '#00ff9d',
                      border: 'none',
                      color: '#000',
                      fontWeight: 700,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {step === 'final' ? (
                      <>
                        <Download size={16} />
                        Export Memo
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </>
  );
};

export default ExportReportButton;
```