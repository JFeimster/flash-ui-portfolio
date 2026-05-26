import React, { useState } from 'react';

const BrokerContactTerminal = ({ 
  dealId = "DL-4092", 
  brokerName = "Marcus Vane", 
  firm = "OBSIDIAN M&A" 
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const swotData = [
    { type: "STRENGTH", label: "Market Dominance", desc: "65% local market share in HVAC specialty.", color: "var(--acid-green)" },
    { type: "WEAKNESS", label: "Tech Debt", desc: "Legacy ERP system requiring immediate migration.", color: "var(--blood-orange)" },
    { type: "OPPORTUNITY", label: "Expansion", desc: "Adjacent county contracts currently unserviced.", color: "var(--oxidized-copper)" },
    { type: "THREAT", label: "Labor Market", desc: "High churn rate for junior technicians.", color: "var(--blood-orange)" }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMessage("");
      alert("TERMINAL MESSAGE ENCRYPTED AND DISPATCHED.");
    }, 1500);
  };

  return (
    <div className="terminal-container">
      <style jsx>{`
        .terminal-container {
          background: var(--obsidian);
          color: var(--bone);
          font-family: 'Inter', sans-serif;
          border: 2px solid var(--graphite);
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 0;
          max-width: 1200px;
          margin: 2rem auto;
          position: relative;
        }

        .mono { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }

        /* Main Section */
        .main-panel {
          padding: 3rem;
          border-right: 2px solid var(--graphite);
        }

        .header-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--graphite);
          padding-bottom: 1rem;
        }

        .deal-status {
          font-size: 0.7rem;
          background: var(--acid-green);
          color: var(--obsidian);
          padding: 0.2rem 0.6rem;
          font-weight: 900;
        }

        h2 {
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: -1.5px;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }

        /* SWOT Grid */
        .swot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .swot-card {
          border: 1px solid var(--graphite);
          padding: 1.5rem;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        .swot-card::after {
          content: "";
          position: absolute;
          top: 0; right: 0;
          width: 4px; height: 100%;
          background: var(--card-color);
        }

        .swot-label {
          font-size: 0.6rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          display: block;
          color: var(--card-color);
        }

        .swot-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .swot-desc {
          font-size: 0.8rem;
          color: #888;
          line-height: 1.4;
        }

        /* Secure Portal Section */
        .data-portal {
          background: #0f0f0f;
          border: 1px solid var(--oxidized-copper);
          padding: 2rem;
          margin-top: 2rem;
        }

        .portal-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .portal-icon {
          width: 12px;
          height: 12px;
          background: var(--blood-orange);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        /* Sidebar Section */
        .sidebar {
          padding: 2rem;
          background: #080808;
          display: flex;
          flex-direction: column;
        }

        .broker-profile {
          margin-bottom: 2.5rem;
        }

        .avatar {
          width: 100%;
          aspect-ratio: 1;
          background: var(--graphite);
          filter: grayscale(100%) contrast(120%);
          margin-bottom: 1.5rem;
          border: 1px solid var(--bone);
          background-image: url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400');
          background-size: cover;
        }

        .broker-info h3 {
          font-size: 1.2rem;
          font-weight: 900;
          margin-bottom: 0.25rem;
        }

        .broker-info p {
          font-size: 0.7rem;
          color: #666;
          margin-bottom: 1rem;
        }

        /* Form */
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        textarea {
          background: var(--obsidian);
          border: 1px solid var(--graphite);
          color: var(--bone);
          padding: 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          min-height: 150px;
          resize: none;
          outline: none;
        }

        textarea:focus {
          border-color: var(--bone);
        }

        .nda-checkbox {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          cursor: pointer;
          font-size: 0.7rem;
          color: #888;
          margin: 1rem 0;
        }

        .nda-checkbox input {
          margin-top: 0.2rem;
        }

        .btn-send {
          background: var(--bone);
          color: var(--obsidian);
          border: none;
          padding: 1rem;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-send:hover {
          background: var(--acid-green);
        }

        .btn-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .terminal-container { grid-template-columns: 1fr; }
          .main-panel { border-right: none; border-bottom: 2px solid var(--graphite); padding: 1.5rem; }
        }
      `}</style>

      <div className="main-panel">
        <div className="header-strip">
          <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--oxidized-copper)' }}>Verification Node: 0x822...</span>
          <span className="deal-status mono">DEAL ACTIVE</span>
        </div>

        <h2 className="mono">Intelligence Tear-Sheet: {dealId}</h2>

        <div className="swot-grid">
          {swotData.map((item, i) => (
            <div key={i} className="swot-card" style={{ '--card-color': item.color } as React.CSSProperties}>
              <span className="swot-label mono">{item.type}</span>
              <h4 className="swot-title">{item.label}</h4>
              <p className="swot-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="data-portal">
          <div className="portal-header">
            <div className="portal-icon"></div>
            <h4 className="mono" style={{ fontSize: '0.9rem' }}>Secure Virtual Data Room</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '1.5rem' }}>
            Access to P&L statements, tax returns (3 yrs), employee rosters, and customer concentration reports is restricted to verified buyers with a signed NDA.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--graphite)' }}>
            <div style={{ background: '#151515', padding: '1rem', textAlign: 'center' }}>
              <span className="mono" style={{ fontSize: '0.6rem', color: '#555', display: 'block' }}>FILES</span>
              <span className="mono" style={{ fontSize: '0.9rem' }}>42 Units</span>
            </div>
            <div style={{ background: '#151515', padding: '1rem', textAlign: 'center' }}>
              <span className="mono" style={{ fontSize: '0.6rem', color: '#555', display: 'block' }}>SECURITY</span>
              <span className="mono" style={{ fontSize: '0.9rem', color: 'var(--acid-green)' }}>AES-256</span>
            </div>
            <div style={{ background: '#151515', padding: '1rem', textAlign: 'center' }}>
              <span className="mono" style={{ fontSize: '0.6rem', color: '#555', display: 'block' }}>LAST UPDATE</span>
              <span className="mono" style={{ fontSize: '0.9rem' }}>2H AGO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar">
        <div className="broker-profile">
          <div className="avatar"></div>
          <div className="broker-info">
            <span className="mono" style={{ color: 'var(--acid-green)', fontSize: '0.6rem', fontWeight: 900 }}>Verified Listing Agent</span>
            <h3>{brokerName}</h3>
            <p className="mono">{firm} / SENIOR PARTNER</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSendMessage}>
          <label className="mono" style={{ fontSize: '0.65rem', color: '#555' }}>Message Terminal</label>
          <textarea 
            placeholder="INQUIRE ABOUT DEAL DYNAMICS OR SCHEDULE PRE-SCREENING CALL..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          
          <label className="nda-checkbox">
            <input 
              type="checkbox" 
              checked={isVerified} 
              onChange={(e) => setIsVerified(e.target.checked)} 
              required
            />
            <span>I acknowledge the Irrevocable Non-Disclosure Agreement for listing {dealId}.</span>
          </label>

          <button 
            type="submit" 
            className="btn-send mono" 
            disabled={sending || !isVerified}
          >
            {sending ? "Encrypting..." : "Request Data Room Access"}
          </button>
        </form>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <div style={{ borderTop: '1px solid var(--graphite)', paddingBottom: '1rem' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444', fontSize: '0.6rem' }}>
            <span className="mono">ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
            <span className="mono">STATUS: ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerContactTerminal;