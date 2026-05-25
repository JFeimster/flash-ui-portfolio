import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquare, ArrowRight, ShieldAlert, Sparkles, TrendingUp, Clock } from 'lucide-react';

interface Anomaly {
  id: string;
  category: string;
  merchant: string;
  amount: number;
  expectedAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'flagged';
  note: string;
}

const AnomalyApprovalList: React.FC = () => {
  const [step, setStep] = useState(1);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: '1',
      category: 'Software / SaaS',
      merchant: 'AWS / Amazon Web Services',
      amount: 1450.80,
      expectedAmount: 850.00,
      reason: '71% increase vs. trailing 3-month average',
      status: 'pending',
      note: ''
    },
    {
      id: '2',
      category: 'Contractors',
      merchant: 'Upwork Global',
      amount: 4200.00,
      expectedAmount: 0,
      reason: 'New vendor detected. No previous transaction history.',
      status: 'pending',
      note: ''
    },
    {
      id: '3',
      category: 'Marketing',
      merchant: 'Meta Ads',
      amount: 2800.00,
      expectedAmount: 2500.00,
      reason: 'Spend increased while attribution ROI dropped by 12%',
      status: 'pending',
      note: ''
    }
  ]);

  const updateStatus = (id: string, status: 'approved' | 'flagged') => {
    setAnomalies(anomalies.map(a => a.id === id ? { ...a, status } : a));
  };

  const updateNote = (id: string, note: string) => {
    setAnomalies(anomalies.map(a => a.id === id ? { ...a, note } : a));
  };

  const totalFlagged = anomalies.filter(a => a.status === 'flagged').length;
  const totalProcessed = anomalies.filter(a => a.status !== 'pending').length;

  return (
    <div style={{
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 20px',
      minHeight: '100vh'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .mono { font-family: 'JetBrains Mono', monospace; }
        .primary-glow { box-shadow: 0 0 20px rgba(0, 255, 157, 0.15); }
        .card-gradient { background: linear-gradient(135deg, #0d0f14 0%, #14171c 100%); }
        
        input::placeholder { color: #444; }
        
        .step-indicator {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        
        .step-dot {
          height: 4px;
          width: 40px;
          border-radius: 2px;
          background: #1f242d;
        }
        
        .step-dot.active {
          background: #00ff9d;
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span className="mono" style={{ color: '#00ff9d', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                &gt; Friday Finance Rhythm
              </span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.03em' }}>
                Weekly Anomaly Review
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ color: '#8a8f98', fontSize: '0.75rem' }}>WEEK ENDING</div>
              <div style={{ fontWeight: 600 }}>OCT 27, 2023</div>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ 
              background: 'rgba(0, 255, 157, 0.05)', 
              border: '1px solid #00ff9d33', 
              padding: '16px', 
              borderRadius: '8px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              <Sparkles size={20} color="#00ff9d" />
              <p style={{ fontSize: '0.9rem', color: '#00ff9d' }}>
                AI detected <strong>3 anomalies</strong> requiring your input to calibrate the monthly forecast.
              </p>
            </div>

            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="card-gradient" style={{ 
                border: '1px solid #1f242d', 
                borderRadius: '12px', 
                overflow: 'hidden',
                transition: '0.3s',
                borderColor: anomaly.status === 'approved' ? '#00ff9d44' : anomaly.status === 'flagged' ? '#ff4d4d44' : '#1f242d'
              }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '0.7rem', color: '#8a8f98', textTransform: 'uppercase' }}>{anomaly.category}</span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{anomaly.merchant}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${anomaly.amount.toLocaleString()}</div>
                      <div className="mono" style={{ fontSize: '0.75rem', color: '#ffb800' }}>
                        {anomaly.expectedAmount > 0 ? `+ $${(anomaly.amount - anomaly.expectedAmount).toFixed(2)} vs trend` : 'First-time spend'}
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    background: '#050608', 
                    padding: '12px 16px', 
                    borderRadius: '6px', 
                    borderLeft: '3px solid #ffb800',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <AlertCircle size={14} color="#ffb800" />
                      <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffb800' }}>ANOMALY_LOG:</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#8a8f98' }}>{anomaly.reason}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ position: 'relative' }}>
                        <MessageSquare size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: '#444' }} />
                        <input 
                          type="text" 
                          placeholder="Add context (e.g. 'Project Phoenix infrastructure scale')" 
                          value={anomaly.note}
                          onChange={(e) => updateNote(anomaly.id, e.target.value)}
                          style={{
                            width: '100%',
                            background: '#050608',
                            border: '1px solid #1f242d',
                            padding: '10px 12px 10px 36px',
                            color: 'white',
                            fontSize: '0.85rem',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => updateStatus(anomaly.id, 'flagged')}
                        style={{
                          background: anomaly.status === 'flagged' ? '#ff4d4d' : 'transparent',
                          border: '1px solid #ff4d4d',
                          color: anomaly.status === 'flagged' ? 'black' : '#ff4d4d',
                          padding: '10px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                        <ShieldAlert size={14} /> Flag
                      </button>
                      <button 
                        onClick={() => updateStatus(anomaly.id, 'approved')}
                        style={{
                          background: anomaly.status === 'approved' ? '#00ff9d' : 'transparent',
                          border: '1px solid #00ff9d',
                          color: anomaly.status === 'approved' ? 'black' : '#00ff9d',
                          padding: '10px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                        <CheckCircle2 size={14} /> Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setStep(2)}
                disabled={totalProcessed < anomalies.length}
                style={{
                  background: totalProcessed < anomalies.length ? '#1f242d' : '#00ff9d',
                  color: totalProcessed < anomalies.length ? '#444' : '#000',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: totalProcessed < anomalies.length ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: '0.2s'
                }}>
                Generate Weekly Memo <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card-gradient" style={{ border: '1px solid #1f242d', borderRadius: '12px', padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="mono" style={{ color: '#00ff9d', fontSize: '0.8rem', marginBottom: '8px' }}>&gt; DRAFTING_PLAIN_ENGLISH_SUMMARY</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Weekly Strategy Memo</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: '#050608', padding: '20px', borderRadius: '8px', border: '1px solid #1f242d' }}>
                <div className="mono" style={{ color: '#8a8f98', fontSize: '0.7rem', marginBottom: '8px' }}>CASH POSITION</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$142,405.22</div>
                <div style={{ color: '#ff4d4d', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> -$8,420 vs last week
                </div>
              </div>
              <div style={{ background: '#050608', padding: '20px', borderRadius: '8px', border: '1px solid #1f242d' }}>
                <div className="mono" style={{ color: '#8a8f98', fontSize: '0.7rem', marginBottom: '8px' }}>EST. RUNWAY</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>6.2 Months</div>
                <div style={{ color: '#00ff9d', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> Stabilized
                </div>
              </div>
            </div>

            <div className="mono" style={{ color: '#8a8f98', lineHeight: '1.8', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '20px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Summary:</span> This week saw a slight acceleration in burn due to infrastructure scaling. Revenue remains steady at the $42k/mo baseline.
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Key Anomalies Handled:</span>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                  {anomalies.map(a => (
                    <li key={a.id} style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}>
                      <span style={{ color: a.status === 'approved' ? '#00ff9d' : '#ff4d4d' }}>[{a.status.toUpperCase()}]</span>
                      <span>
                        {a.merchant}: ${a.amount.toLocaleString()} — {a.note || 'No additional context provided.'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '20px', background: 'rgba(255, 184, 0, 0.05)', borderLeft: '3px solid #ffb800', borderRadius: '0 8px 8px 0' }}>
                <span style={{ color: '#ffb800', fontWeight: 600 }}>AI CFO Insight:</span>
                <p style={{ marginTop: '8px', color: '#ccc' }}>
                  "If the AWS spend is a permanent baseline for Project Phoenix, your runway will contract from 6.2 to 5.8 months by end of year. Suggest auditing Meta Ads ROI next week to recoup the $2,800 efficiency loss."
                </p>
              </div>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #1f242d',
                  padding: '16px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                Edit Context
              </button>
              <button 
                style={{
                  flex: 2,
                  background: '#00ff9d',
                  color: '#000',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0, 255, 157, 0.2)'
                }}>
                Sign Off & Export Memo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyApprovalList;

```