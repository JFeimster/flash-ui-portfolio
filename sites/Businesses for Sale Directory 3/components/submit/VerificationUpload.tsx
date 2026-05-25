import React, { useState, useCallback } from 'react';

const VerificationUpload = () => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    plStatement: null,
    taxReturns: null,
    operationalNarrative: null,
  });

  const [metrics, setMetrics] = useState({
    revenue: '',
    sde: '',
    ebitda: '',
    addBacks: ''
  });

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetrics(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="verification-portal">
      <style jsx>{`
        .verification-portal {
          --obsidian: #050505;
          --bone: #F5F5F0;
          --acid-green: #C1FF00;
          --oxidized-copper: #8E593E;
          --blood-orange: #FF3D00;
          --graphite: #1A1A1A;
          --panel: #0F0F0F;
          --border-width: 2px;
          --noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          
          background-color: var(--obsidian);
          color: var(--bone);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          padding: 4rem 2rem;
          position: relative;
        }

        .verification-portal::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: var(--noise);
          opacity: 0.04;
          pointer-events: none;
          z-index: 1;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .mono { 
          font-family: 'JetBrains Mono', monospace; 
          text-transform: uppercase; 
        }

        .header {
          border-bottom: var(--border-width) solid var(--bone);
          padding-bottom: 2rem;
          margin-bottom: 3rem;
        }

        .step-label {
          color: var(--oxidized-copper);
          font-size: 0.8rem;
          letter-spacing: 2px;
          margin-bottom: 1rem;
          display: block;
        }

        h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900;
          line-height: 0.9;
          text-transform: uppercase;
          letter-spacing: -2px;
        }

        .portal-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
        }

        .upload-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .upload-card {
          background: var(--panel);
          border: var(--border-width) solid var(--graphite);
          padding: 2rem;
          position: relative;
          transition: border-color 0.2s;
        }

        .upload-card:hover {
          border-color: var(--oxidized-copper);
        }

        .upload-card.has-file {
          border-color: var(--acid-green);
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: space-between;
        }

        .card-desc {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 1.5rem;
          max-width: 400px;
        }

        .file-input-wrapper {
          position: relative;
          height: 60px;
          border: 1px dashed var(--graphite);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
        }

        .file-input-wrapper:hover {
          background: rgba(255,255,255,0.02);
        }

        input[type="file"] {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .metrics-panel {
          background: var(--graphite);
          padding: 2rem;
          border: var(--border-width) solid var(--graphite);
          align-self: start;
        }

        .panel-label {
          font-size: 0.7rem;
          color: var(--acid-green);
          margin-bottom: 1.5rem;
          display: block;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          font-size: 0.6rem;
          color: #888;
          margin-bottom: 0.5rem;
          font-weight: 900;
        }

        .input-group input {
          width: 100%;
          background: var(--obsidian);
          border: 1px solid #333;
          padding: 0.8rem;
          color: var(--bone);
          font-family: 'JetBrains Mono';
          font-size: 1rem;
          outline: none;
        }

        .input-group input:focus {
          border-color: var(--bone);
        }

        .btn-submit {
          width: 100%;
          background: var(--acid-green);
          color: var(--obsidian);
          border: none;
          padding: 1.5rem;
          font-size: 1rem;
          font-weight: 900;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 1rem;
          transition: transform 0.1s, opacity 0.2s;
        }

        .btn-submit:hover {
          opacity: 0.9;
        }

        .btn-submit:active {
          transform: scale(0.98);
        }

        .status-tag {
          font-size: 0.6rem;
          padding: 2px 6px;
          background: var(--oxidized-copper);
          color: var(--bone);
        }

        .verified-check {
          color: var(--acid-green);
        }

        @media (max-width: 900px) {
          .portal-grid {
            grid-template-columns: 1fr;
          }
          .metrics-panel {
            order: -1;
          }
        }
      `}</style>

      <div className="container">
        <header className="header">
          <span className="step-label mono">Phase 02 // Asset Verification</span>
          <h1>The Mint: Data Intake</h1>
        </header>

        <div className="portal-grid">
          <div className="upload-section">
            {/* P&L Statement */}
            <div className={`upload-card ${files.plStatement ? 'has-file' : ''}`}>
              <div className="card-title">
                <span>P&L Statements (TTM)</span>
                {files.plStatement && <span className="verified-check mono">READY</span>}
              </div>
              <p className="card-desc">Provide detailed Profit and Loss statements for the last 36 months of operation.</p>
              <div className="file-input-wrapper">
                <span className="mono" style={{fontSize: '0.7rem'}}>
                  {files.plStatement ? files.plStatement.name : 'Click to upload PDF / XLSX'}
                </span>
                <input type="file" onChange={(e) => handleFileChange('plStatement', e)} />
              </div>
            </div>

            {/* Tax Returns */}
            <div className={`upload-card ${files.taxReturns ? 'has-file' : ''}`}>
              <div className="card-title">
                <span>Tax Returns (3 Years)</span>
                {files.taxReturns && <span className="verified-check mono">READY</span>}
              </div>
              <p className="card-desc">Verified Federal Tax Returns are required for SBA-eligible listing status.</p>
              <div className="file-input-wrapper">
                <span className="mono" style={{fontSize: '0.7rem'}}>
                  {files.taxReturns ? files.taxReturns.name : 'Click to upload PDF'}
                </span>
                <input type="file" onChange={(e) => handleFileChange('taxReturns', e)} />
              </div>
            </div>

            {/* Operational Narrative */}
            <div className={`upload-card ${files.operationalNarrative ? 'has-file' : ''}`}>
              <div className="card-title">
                <span>Operational Narrative</span>
                {files.operationalNarrative && <span className="verified-check mono">READY</span>}
              </div>
              <p className="card-desc">A brief document explaining the business model, key staff, and growth opportunities.</p>
              <div className="file-input-wrapper">
                <span className="mono" style={{fontSize: '0.7rem'}}>
                  {files.operationalNarrative ? files.operationalNarrative.name : 'Click to upload DOCX / PDF'}
                </span>
                <input type="file" onChange={(e) => handleFileChange('operationalNarrative', e)} />
              </div>
            </div>
          </div>

          <aside className="metrics-panel">
            <span className="panel-label mono">Core Financials</span>
            
            <div className="input-group">
              <label className="mono">Gross Annual Revenue</label>
              <input 
                type="text" 
                name="revenue" 
                placeholder="$0.00" 
                value={metrics.revenue}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label className="mono">Annual SDE (Seller Disc. Earnings)</label>
              <input 
                type="text" 
                name="sde" 
                placeholder="$0.00" 
                value={metrics.sde}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label className="mono">Adjusted EBITDA</label>
              <input 
                type="text" 
                name="ebitda" 
                placeholder="$0.00" 
                value={metrics.ebitda}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label className="mono">Total Add-Backs</label>
              <input 
                type="text" 
                name="addBacks" 
                placeholder="$0.00" 
                value={metrics.addBacks}
                onChange={handleInputChange}
              />
            </div>

            <div style={{marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1.5rem'}}>
              <p className="mono" style={{fontSize: '0.6rem', color: '#555', marginBottom: '1rem'}}>
                BY SUBMITTING, YOU CERTIFY THE ACCURACY OF ALL DATA UNDER THE TERMS OF THE OXIDIZED LEDGER SELLER AGREEMENT.
              </p>
              <button className="btn-submit">Initialize Verification</button>
            </div>
          </aside>
        </div>

        <footer style={{marginTop: '4rem', color: '#444', fontSize: '0.7rem'}} className="mono">
          <span style={{color: var(--oxidized-copper)}}>STATUS:</span> SECURE_ENCRYPTION_ACTIVE // SYSTEM_PORT: 8080
        </footer>
      </div>
    </div>
  );
};

export default VerificationUpload;