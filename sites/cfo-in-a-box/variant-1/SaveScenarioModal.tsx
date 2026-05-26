import React, { useState } from 'react';

const SaveScenarioModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (scenario: any) => void;
  currentImpact: {
    runway: string;
    readiness: number;
    variables: string[];
  };
}> = ({ isOpen, onClose, onSave, currentImpact }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

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
      padding: '20px',
    },
    modal: {
      backgroundColor: '#0d0f14',
      border: '1px solid #1f242d',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '500px',
      padding: '32px',
      boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 800,
      color: '#ffffff',
      letterSpacing: '-0.03em',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#8a8f98',
      fontSize: '0.9rem',
    },
    formGroup: {
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    label: {
      fontSize: '0.75rem',
      fontWeight: 700,
      color: '#8a8f98',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
    input: {
      backgroundColor: '#050608',
      border: '1px solid #1f242d',
      padding: '12px',
      color: '#ffffff',
      borderRadius: '4px',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    impactBox: {
      backgroundColor: '#14171c',
      border: '1px solid #1f242d',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
    },
    impactGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginTop: '12px',
    },
    statLabel: {
      fontSize: '0.7rem',
      color: '#8a8f98',
      textTransform: 'uppercase' as const,
      marginBottom: '4px',
    },
    statValue: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#00ff9d',
    },
    variableTag: {
      display: 'inline-block',
      padding: '4px 8px',
      backgroundColor: '#1f242d',
      color: '#00ff9d',
      fontSize: '0.7rem',
      borderRadius: '4px',
      marginRight: '6px',
      marginBottom: '6px',
      fontFamily: "'JetBrains Mono', monospace",
    },
    footer: {
      display: 'flex',
      gap: '12px',
      marginTop: '32px',
    },
    btnPrimary: {
      flex: 1,
      backgroundColor: '#00ff9d',
      color: '#000000',
      border: 'none',
      padding: '14px',
      borderRadius: '4px',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    btnOutline: {
      flex: 1,
      backgroundColor: 'transparent',
      color: '#ffffff',
      border: '1px solid #1f242d',
      padding: '14px',
      borderRadius: '4px',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: '0.9rem',
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Commit Scenario</h2>
          <p style={styles.subtitle}>Save this sandbox configuration to your growth roadmap.</p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Scenario Name</label>
          <input 
            style={styles.input} 
            placeholder="e.g., Q3 Expansion + New Lead Gen"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Strategic Notes</label>
          <textarea 
            style={{...styles.input, minHeight: '80px', resize: 'none'}} 
            placeholder="Why are we testing this model?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={styles.impactBox}>
          <label style={styles.label}>Projected Delta</label>
          <div style={styles.impactGrid}>
            <div>
              <div style={styles.statLabel}>Monthly Runway</div>
              <div style={styles.statValue}>{currentImpact.runway}</div>
            </div>
            <div>
              <div style={styles.statLabel}>Readiness Score</div>
              <div style={styles.statValue}>{currentImpact.readiness > 0 ? `+${currentImpact.readiness}` : currentImpact.readiness} pts</div>
            </div>
          </div>
          <div style={{marginTop: '16px'}}>
            <div style={styles.statLabel}>Active Variables</div>
            <div style={{marginTop: '8px'}}>
              {currentImpact.variables.map((v, i) => (
                <span key={i} style={styles.variableTag}>{v}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.btnOutline} onClick={onClose}>Discard</button>
          <button 
            style={styles.btnPrimary} 
            onClick={() => onSave({ name, description, ...currentImpact })}
          >
            Save to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveScenarioModal;