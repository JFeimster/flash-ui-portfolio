import React, { useState } from 'react';

const LenderRequirementsList = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const requirements = [
    {
      id: 1,
      category: 'Financials',
      name: 'Last 24 Months P&L',
      status: 'ready',
      audit: 'AI verified: Standard formatting detected. Ready for export.',
      weight: 'High'
    },
    {
      id: 2,
      category: 'Financials',
      name: 'Balance Sheet (YTD)',
      status: 'needs-work',
      audit: 'Inconsistency found in Accounts Receivable vs Bank Sync.',
      weight: 'High'
    },
    {
      id: 3,
      category: 'Legal',
      name: 'Articles of Incorporation',
      status: 'ready',
      audit: 'Document matched with Secretary of State records.',
      weight: 'Medium'
    },
    {
      id: 4,
      category: 'Financials',
      name: 'Debt Schedule',
      status: 'missing',
      audit: 'Required for SBA and Revenue-based financing.',
      weight: 'High'
    },
    {
      id: 5,
      category: 'Tax',
      name: 'Last 2 Years Tax Returns',
      status: 'ready',
      audit: 'Verified: 2022 and 2023 filings present.',
      weight: 'High'
    },
    {
      id: 6,
      category: 'Operational',
      name: 'Top 10 Customer Contracts',
      status: 'needs-work',
      audit: '3 contracts missing signatures. High risk for due diligence.',
      weight: 'Medium'
    }
  ];

  const filteredDocs = activeCategory === 'all' 
    ? requirements 
    : requirements.filter(doc => doc.category.toLowerCase() === activeCategory.toLowerCase());

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ready': return '#00ff9d';
      case 'needs-work': return '#ffb800';
      case 'missing': return '#ff4d4d';
      default: return '#8a8f98';
    }
  };

  return (
    <div style={{
      backgroundColor: '#050608',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #1f242d',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid #1f242d'
      }}>
        <div>
          <div style={{ 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            color: '#00ff9d', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            marginBottom: '8px'
          }}>
            Funding Readiness Portal
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Lender Requirements List
          </h2>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#8a8f98', marginBottom: '4px', fontWeight: 600 }}>
            READINESS SCORE
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00ff9d', lineHeight: 1 }}>
            72<span style={{ fontSize: '1rem', color: '#1f242d' }}>/100</span>
          </div>
        </div>
      </div>

      {/* Dashboard Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['All', 'Financials', 'Legal', 'Tax', 'Operational'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat.toLowerCase())}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #1f242d',
              background: activeCategory === cat.toLowerCase() ? '#14171c' : 'transparent',
              color: activeCategory === cat.toLowerCase() ? '#00ff9d' : '#8a8f98',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            {cat}
          </button>
        ))}
        <button style={{
          marginLeft: 'auto',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          background: '#00ff9d',
          color: '#000',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          Generate Data Room
        </button>
      </div>

      {/* Requirements Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredDocs.map(doc => (
          <div key={doc.id} style={{
            background: '#0d0f14',
            border: '1px solid #1f242d',
            borderRadius: '8px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 120px 100px',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{doc.name}</h4>
                <span style={{ 
                  fontSize: '0.65rem', 
                  padding: '2px 6px', 
                  background: '#14171c', 
                  borderRadius: '3px', 
                  color: '#8a8f98',
                  border: '1px solid #1f242d'
                }}>{doc.category}</span>
              </div>
              <div style={{ 
                fontFamily: "'JetBrains Mono', monospace", 
                fontSize: '0.75rem', 
                color: doc.status === 'ready' ? '#8a8f98' : doc.status === 'needs-work' ? '#ffb800' : '#ff4d4d'
              }}>
                <span style={{ opacity: 0.5 }}>&gt; AI_AUDIT:</span> {doc.audit}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#8a8f98', marginBottom: '4px', textTransform: 'uppercase' }}>Weight</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doc.weight}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                border: `1px solid ${getStatusColor(doc.status)}`,
                color: getStatusColor(doc.status),
                backgroundColor: `${getStatusColor(doc.status)}10`
              }}>
                {doc.status.replace('-', ' ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div style={{ 
        marginTop: '32px', 
        padding: '20px', 
        background: 'linear-gradient(90deg, #14171c, #0d0f14)', 
        borderRadius: '8px',
        borderLeft: '3px solid #00ff9d'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Ready to approach lenders?
            </div>
            <div style={{ fontSize: '0.8rem', color: '#8a8f98' }}>
              3 critical items need attention before your "Crime Scene" financials are investor-grade.
            </div>
          </div>
          <button style={{
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid #00ff9d',
            color: '#00ff9d',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Fix Issues with AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default LenderRequirementsList;

```