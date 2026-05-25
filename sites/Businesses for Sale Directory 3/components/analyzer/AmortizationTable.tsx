'use client';

import React, { useMemo, useState } from 'react';

interface AmortizationTableProps {
  principal: number;
  annualRate: number;
  termYears: number;
  sde: number;
}

export default function AmortizationTable({ 
  principal = 0, 
  annualRate = 11, 
  termYears = 10,
  sde = 0 
}: AmortizationTableProps) {
  const [displayMode, setDisplayMode] = useState<'yearly' | 'monthly'>('yearly');

  const schedule = useMemo(() => {
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = termYears * 12;
    const monthlyPayment = 
      principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    let balance = principal;
    const results = [];

    for (let i = 1; i <= numberOfPayments; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      balance = Math.max(0, balance - principalPaid);

      results.push({
        period: i,
        payment: monthlyPayment,
        principal: principalPaid,
        interest: interest,
        remaining: balance
      });
    }
    return results;
  }, [principal, annualRate, termYears]);

  const yearlySchedule = useMemo(() => {
    const years = [];
    for (let i = 0; i < termYears; i++) {
      const slice = schedule.slice(i * 12, (i + 1) * 12);
      const totalPayment = slice.reduce((sum, s) => sum + s.payment, 0);
      const totalPrincipal = slice.reduce((sum, s) => sum + s.principal, 0);
      const totalInterest = slice.reduce((sum, s) => sum + s.interest, 0);
      const remaining = slice[slice.length - 1].remaining;
      const dscr = sde / totalPayment;

      years.push({
        year: i + 1,
        payment: totalPayment,
        principal: totalPrincipal,
        interest: totalInterest,
        remaining: remaining,
        dscr: dscr
      });
    }
    return years;
  }, [schedule, termYears, sde]);

  const formatCurr = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="analyzer-table-container" style={{
      backgroundColor: '#0F0F0F',
      border: '2px solid #1A1A1A',
      fontFamily: "'Inter', sans-serif",
      color: '#F5F5F0'
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: '2px solid #1A1A1A',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 className="mono" style={{ fontSize: '0.9rem', color: '#8E593E', margin: 0 }}>/ / DEBT_SERVICE_SCHEDULE</h3>
          <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>AMORTIZATION PROJECTION BASED ON CURRENT UNDERWRITING TERMS</p>
        </div>
        <div style={{ display: 'flex', gap: '2px', background: '#1A1A1A', padding: '2px' }}>
          <button 
            onClick={() => setDisplayMode('yearly')}
            className="mono"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.65rem',
              border: 'none',
              cursor: 'pointer',
              background: displayMode === 'yearly' ? '#F5F5F0' : '#050505',
              color: displayMode === 'yearly' ? '#050505' : '#F5F5F0'
            }}
          >YEARLY</button>
          <button 
            onClick={() => setDisplayMode('monthly')}
            className="mono"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.65rem',
              border: 'none',
              cursor: 'pointer',
              background: displayMode === 'monthly' ? '#F5F5F0' : '#050505',
              color: displayMode === 'monthly' ? '#050505' : '#F5F5F0'
            }}
          >MONTHLY</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{ background: '#050505', color: '#666', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem', borderBottom: '1px solid #1A1A1A' }}>Period</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #1A1A1A' }}>Total Payment</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #1A1A1A' }}>Principal</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #1A1A1A' }}>Interest</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #1A1A1A' }}>Remaining</th>
              {displayMode === 'yearly' && <th style={{ padding: '1rem', borderBottom: '1px solid #1A1A1A' }}>DSCR</th>}
            </tr>
          </thead>
          <tbody>
            {(displayMode === 'yearly' ? yearlySchedule : schedule).map((row, idx) => (
              <tr key={idx} style={{ 
                borderBottom: '1px solid #1A1A1A',
                background: idx % 2 === 0 ? 'transparent' : '#0a0a0a'
              }}>
                <td style={{ padding: '1rem', color: '#8E593E', fontWeight: 'bold' }}>
                  {displayMode === 'yearly' ? `YR ${row.year}` : `MO ${row.period}`}
                </td>
                <td style={{ padding: '1rem' }}>{formatCurr(row.payment)}</td>
                <td style={{ padding: '1rem' }}>{formatCurr(row.principal)}</td>
                <td style={{ padding: '1rem', color: '#FF3D00' }}>{formatCurr(row.interest)}</td>
                <td style={{ padding: '1rem' }}>{formatCurr(row.remaining)}</td>
                {displayMode === 'yearly' && (
                  <td style={{ 
                    padding: '1rem', 
                    color: (row.dscr || 0) > 1.25 ? '#C1FF00' : '#FF3D00',
                    fontWeight: 'bold'
                  }}>
                    {(row.dscr || 0).toFixed(2)}x
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        padding: '1.5rem',
        background: '#050505',
        borderTop: '2px solid #1A1A1A',
        display: 'flex',
        gap: '2rem'
      }}>
        <div>
          <span className="mono" style={{ display: 'block', fontSize: '0.6rem', color: '#666', marginBottom: '0.25rem' }}>TOTAL INTEREST PAYABLE</span>
          <span className="mono" style={{ color: '#FF3D00', fontSize: '1rem' }}>
            {formatCurr(schedule.reduce((sum, s) => sum + s.interest, 0))}
          </span>
        </div>
        <div>
          <span className="mono" style={{ display: 'block', fontSize: '0.6rem', color: '#666', marginBottom: '0.25rem' }}>TOTAL DEBT SERVICE</span>
          <span className="mono" style={{ color: '#F5F5F0', fontSize: '1rem' }}>
            {formatCurr(schedule.reduce((sum, s) => sum + s.payment, 0))}
          </span>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <span className="mono" style={{ display: 'block', fontSize: '0.6rem', color: '#666', marginBottom: '0.25rem' }}>LOAN CONSTANT</span>
          <span className="mono" style={{ color: '#C1FF00', fontSize: '1rem' }}>
            {((schedule[0]?.payment * 12 / principal) * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      <style jsx>{`
        .mono { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
        .analyzer-table-container tr:hover {
          background: #111 !important;
        }
        .analyzer-table-container td {
          transition: color 0.2s;
        }
        .analyzer-table-container tr:hover td {
          color: #F5F5F0;
        }
      `}</style>
    </div>
  );
}
'
