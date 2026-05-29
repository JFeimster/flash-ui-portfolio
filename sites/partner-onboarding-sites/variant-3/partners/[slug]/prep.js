import React, { useState, useEffect } from 'react';

export default function PrepPage() {
  // Dynamic Route / Query Parameters via client-side state
  const [partner, setPartner] = useState({
    name: 'Alex Mercer',
    title: 'Senior Funding Strategist',
    company: 'Moonshine Capital Partners',
    photo: '',
    phone: '+1 (800) 555-0199',
    email: 'alex.m@moonshine.capital'
  });

  // Checklist Interactive State
  const [checklist, setChecklist] = useState([
    { id: 'bank', text: 'Downloaded Last 3 Months Business Bank Statements', desc: 'Must be official PDFs, not screenshots.', checked: false },
    { id: 'id', text: 'Verified Identity Document Ready', desc: 'Valid Driver\'s License or Passport for KYC routing.', checked: false },
    { id: 'tax', text: 'Entity Setup Details Available (EIN / Tax ID)', desc: 'Required to verify operational structure tenure.', checked: false },
    { id: 'meeting', text: 'Added Call to My Calendar', desc: 'Secures your locked time window on our active desk.', checked: false }
  ]);

  // Active Case Study Tab
  const [activeCase, setActiveCase] = useState('ecommerce');

  // Video State Simulators
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);

  // Countdown State: Standard 24-hour setup or relative mock
  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Read URL query params on load to support dynamic partner deployment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name') || params.get('partner_name');
      const title = params.get('title') || params.get('partner_title');
      const company = params.get('company') || params.get('partner_company');
      const phone = params.get('phone') || params.get('partner_phone');
      const email = params.get('email') || params.get('partner_email');
      
      if (name) setPartner(prev => ({ ...prev, name }));
      if (title) setPartner(prev => ({ ...prev, title }));
      if (company) setPartner(prev => ({ ...prev, company }));
      if (phone) setPartner(prev => ({ ...prev, phone }));
      if (email) setPartner(prev => ({ ...prev, email }));
    }
  }, []);

  // Timer Countdown Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated Video Timer Progress
  useEffect(() => {
    let timer;
    if (videoPlaying) {
      timer = setInterval(() => {
        setVideoTime(prev => {
          if (prev >= 100) {
            setVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [videoPlaying]);

  const handleCheck = (id) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const getProgressPercent = () => {
    const checked = checklist.filter(c => c.checked).length;
    return Math.round((checked / checklist.length) * 100);
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`Capital Strategy Call with ${partner.name}`);
    const details = encodeURIComponent('Preparing underwriting guidelines and capital capacity review.');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(googleCalendarUrl, '_blank');
  };

  // Static Cases Data
  const cases = {
    ecommerce: {
      industry: 'E-Commerce Marketplace',
      before: 'Friction-filled MCA quotes offering high-rate capital factoring structures.',
      after: 'Structured $245K revenue-based deployment channel at a 1.15x factor layout.',
      docs: ['3 Months Stripe Exports', 'Verified US LLC Incorporation Certificate', 'Active Supplier Invoices'],
      stat: '24-Hour Desk Processing',
      accent: 'var(--electric-green)'
    },
    logistics: {
      industry: 'Interstate Transport & Fleet Logistics',
      before: 'Denied asset loans from traditional commercial banks due to driver payroll gaps.',
      after: '$410K mixed equipment leaseback structure & operational dynamic cash lines.',
      docs: ['6 Months Bank Ledger PDFs', 'FMCSA Registration Profile', 'Corporate Tax Schedules'],
      stat: '$410,000 Liquidated',
      accent: 'var(--signal-orange)'
    },
    brickandmortar: {
      industry: 'Multi-Location Health Centers',
      before: 'Struggling with immediate physical buildout deposits and operational inventory prep.',
      after: '$180K Working Capital Line supplemented with systematic business credit building.',
      docs: ['3 Months Bank Ledgers', 'Commercial Property Lease Agreement', 'Clinical Practice Verification'],
      stat: '0% Down Financing Structure',
      accent: 'var(--cobalt-blue)'
    }
  };

  return (
    <>
      {/* Embedded Neobrutalist Font Styles & Core Theme Elements */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --matte-black: #0D0D0D;
          --bone-white: #F4F4F0;
          --electric-green: #39FF14;
          --signal-orange: #FF5A09;
          --cobalt-blue: #0047AB;
          --graphite-gray: #1C1C1C;
          --border-gray: #2D2D2D;
          --text-muted: #8E8E93;
          --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --neo-border: 3px solid var(--matte-black);
          --neo-shadow: 6px 6px 0px 0px var(--matte-black);
          --neo-shadow-sm: 3px 3px 0px 0px var(--matte-black);
          --neo-shadow-green: 6px 6px 0px 0px var(--electric-green);
          --neo-shadow-orange: 6px 6px 0px 0px var(--signal-orange);
          --neo-shadow-blue: 6px 6px 0px 0px var(--cobalt-blue);
        }

        body {
          background-color: var(--bone-white);
          color: var(--matte-black);
          font-family: var(--font-sans);
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Neobrutalist UI elements */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 28px;
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          text-decoration: none;
          border: var(--neo-border);
          background-color: var(--bone-white);
          color: var(--matte-black);
          box-shadow: var(--neo-shadow);
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0px 0px var(--matte-black);
        }

        .btn:active {
          transform: translate(3px, 3px);
          box-shadow: 3px 3px 0px 0px var(--matte-black);
        }

        .btn-green { background-color: var(--electric-green); }
        .btn-black { background-color: var(--matte-black); color: var(--bone-white); }
        .btn-orange { background-color: var(--signal-orange); color: var(--bone-white); }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--matte-black);
          color: var(--bone-white);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          border: 1px solid var(--matte-black);
          letter-spacing: 0.05em;
        }

        .badge-accent {
          background: var(--electric-green);
          color: var(--matte-black);
          border: 2px solid var(--matte-black);
          box-shadow: 2px 2px 0px 0px var(--matte-black);
        }

        /* Nav Header */
        header {
          background-color: var(--matte-black);
          border-bottom: 3px solid var(--matte-black);
          padding: 14px 0;
        }

        header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: var(--electric-green);
          border: 2px solid var(--bone-white);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-mark span {
          transform: rotate(45deg);
          color: var(--matte-black);
          font-family: var(--font-mono);
          font-weight: 900;
          font-size: 18px;
        }

        .logo-text {
          font-family: var(--font-mono);
          color: var(--bone-white);
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.05em;
        }

        /* Countdown Grid Section */
        .hero-banner {
          background-color: var(--matte-black);
          color: var(--bone-white);
          padding: 64px 0;
          border-bottom: 8px solid var(--matte-black);
          position: relative;
        }

        .hero-banner::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(var(--border-gray) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
          opacity: 0.25;
          pointer-events: none;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 48px;
          position: relative;
          z-index: 2;
        }

        .confirmation-headline {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .confirmation-headline span {
          color: var(--electric-green);
        }

        .hero-desc {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(244, 244, 240, 0.85);
          margin-bottom: 24px;
        }

        /* Countdown Card */
        .countdown-card {
          background: var(--bone-white);
          border: var(--neo-border);
          box-shadow: var(--neo-shadow-orange);
          padding: 24px;
          color: var(--matte-black);
        }

        .countdown-title {
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 800;
          color: var(--signal-orange);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .countdown-numbers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          text-align: center;
          margin-bottom: 20px;
        }

        .number-box {
          border: 2px solid var(--matte-black);
          background: white;
          padding: 12px 0;
        }

        .number-val {
          font-family: var(--font-mono);
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 900;
        }

        .number-lbl {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }

        /* Main Content Grid */
        .prep-section {
          padding: 80px 0;
        }

        .prep-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
        }

        /* Video Zone */
        .video-wrapper {
          border: var(--neo-border);
          box-shadow: var(--neo-shadow);
          background-color: var(--matte-black);
          position: relative;
          overflow: hidden;
          margin-bottom: 32px;
        }

        .video-box {
          width: 100%;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: repeating-linear-gradient(
            45deg,
            #1c1c1c,
            #1c1c1c 10px,
            #2a2a2a 10px,
            #2a2a2a 20px
          );
        }

        .video-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--bone-white);
          padding: 24px;
          text-align: center;
          z-index: 3;
        }

        .play-btn {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--electric-green);
          border: var(--neo-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: var(--matte-black);
          cursor: pointer;
          transition: transform 0.1s ease;
          box-shadow: 4px 4px 0px var(--matte-black);
        }

        .play-btn:hover {
          transform: scale(1.05);
        }

        .video-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 8px;
          background: var(--electric-green);
          transition: width 0.3s linear;
        }

        /* Dynamic Popups for Video Playback */
        .takeaway-alert {
          position: absolute;
          top: 24px;
          left: 24px;
          right: 24px;
          background: var(--signal-orange);
          color: white;
          border: 2px solid var(--matte-black);
          padding: 12px 18px;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 4px 4px 0px var(--matte-black);
          z-index: 5;
          animation: popupSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes popupSlide {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Call Itinerary Styles */
        .itinerary-timeline {
          border-left: 3px solid var(--matte-black);
          padding-left: 24px;
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .timeline-step {
          position: relative;
        }

        .timeline-dot {
          width: 16px;
          height: 16px;
          background-color: var(--bone-white);
          border: 3px solid var(--matte-black);
          border-radius: 50%;
          position: absolute;
          left: -34px;
          top: 4px;
        }

        .timeline-dot.active {
          background-color: var(--electric-green);
        }

        .timeline-time {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--signal-orange);
          font-weight: 800;
        }

        .timeline-title {
          font-size: 18px;
          font-weight: 800;
          margin-top: 4px;
        }

        .timeline-desc {
          font-size: 14px;
          color: rgba(13, 13, 13, 0.75);
          margin-top: 6px;
          line-height: 1.5;
        }

        /* Checklist Tracker styles */
        .checklist-card {
          background: white;
          border: var(--neo-border);
          box-shadow: var(--neo-shadow);
          padding: 32px;
          margin-bottom: 48px;
        }

        .checklist-progress-bar {
          height: 12px;
          background-color: var(--bone-white);
          border: 2px solid var(--matte-black);
          margin-bottom: 24px;
          position: relative;
        }

        .checklist-progress-fill {
          height: 100%;
          background-color: var(--electric-green);
          transition: width 0.3s ease;
        }

        .checklist-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px dashed rgba(13, 13, 13, 0.15);
          cursor: pointer;
        }

        .checklist-item:last-child {
          border-bottom: none;
        }

        .checklist-cb {
          width: 24px;
          height: 24px;
          border: 2px solid var(--matte-black);
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
        }

        .checklist-cb.checked {
          background: var(--electric-green);
        }

        .checklist-cb.checked::after {
          content: '✓';
          color: var(--matte-black);
          font-weight: 900;
          font-size: 14px;
        }

        .checklist-info {
          display: flex;
          flex-direction: column;
        }

        .checklist-label {
          font-size: 15px;
          font-weight: 700;
        }

        .checklist-desc {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* Case Studies Component styles */
        .cases-card {
          border: var(--neo-border);
          box-shadow: var(--neo-shadow-blue);
          background: white;
          padding: 32px;
        }

        .cases-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .case-tab {
          border: 2px solid var(--matte-black);
          background: var(--bone-white);
          padding: 10px 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.1s ease;
        }

        .case-tab.active {
          background-color: var(--cobalt-blue);
          color: white;
          box-shadow: 3px 3px 0px var(--matte-black);
          transform: translate(-2px, -2px);
        }

        .case-detail {
          padding-top: 16px;
          border-top: 2px dashed var(--matte-black);
        }

        .case-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .case-title {
          font-size: 20px;
          font-weight: 900;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .comparison-box {
          border: 2px solid var(--matte-black);
          padding: 16px;
        }

        .comparison-lbl {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 800;
          margin-bottom: 8px;
          color: var(--text-muted);
        }

        .comparison-desc {
          font-size: 14px;
          line-height: 1.4;
        }

        /* Responsive Queries */
        @media (max-width: 991px) {
          .hero-grid, .prep-grid {
            grid-template-columns: 1fr;
          }
          .video-box {
            height: 300px;
          }
        }
      ` }} />

      {/* HEADER SECTION */}
      <header>
        <div class="container">
          <div className="logo-container">
            <div className="logo-mark"><span>M</span></div>
            <div className="logo-text">MOONSHINE</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="badge badge-accent">Secure Session</span>
          </div>
        </div>
      </header>

      {/* DYNAMIC CONFIRMATION HERO BANNER */}
      <section className="hero-banner">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span className="badge" style={{ background: 'var(--signal-orange)' }}>
                  <i className="fa-solid fa-calendar-check" style={{ marginRight: '6px' }} /> Confirmed
                </span>
              </div>
              <h1 className="confirmation-headline">
                Strategy Session <span>Locked In</span>. Let's Build Your Path.
              </h1>
              <p className="hero-desc">
                Your target funding routes are prepared. Take 3 minutes to review the itinerary, audit your document ready-state, and match with the absolute best-fit lending desks.
              </p>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button className="btn btn-green" onClick={handleAddToCalendar}>
                  <i className="fa-solid fa-calendar-plus" /> Save Appointment
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Representative:</span>
                  <strong style={{ fontSize: '14px', color: 'white' }}>{partner.name} ({partner.company})</strong>
                </div>
              </div>
            </div>

            {/* Live Neobrutalist Countdown Widget */}
            <div>
              <div className="countdown-card">
                <div className="countdown-title">
                  <span className="status-dot" style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--signal-orange)', borderRadius: '50%' }} />
                  Preparing Capital Strategy Desks
                </div>
                
                <div className="countdown-numbers">
                  <div className="number-box">
                    <div className="number-val">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="number-lbl">Hours</div>
                  </div>
                  <div className="number-box">
                    <div className="number-val">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="number-lbl">Mins</div>
                  </div>
                  <div className="number-box">
                    <div className="number-val">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="number-lbl">Secs</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: 700 }}>Desk Access Status:</span>
                    <span style={{ color: 'var(--electric-green)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>PRIORITY ROUTER</span>
                  </div>
                  <div style={{ borderTop: '2px dashed var(--matte-black)', marginTop: '8px', paddingTop: '8px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    *Keep this preparation window open. Complete the checklist below to lock maximum underwriting capacity.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGY PREP DETAILS & TOOLS */}
      <section className="prep-section">
        <div className="container">
          <div className="prep-grid">
            
            {/* LEFT COLUMN: Preparation Video & Timeline */}
            <div>
              <div style={{ marginBottom: '32px' }}>
                <span className="badge" style={{ marginBottom: '8px', background: 'var(--matte-black)' }}>Video Briefing</span>
                <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>A 90-Second Prep Message</h2>
                <p style={{ fontSize: '15px', color: 'rgba(13, 13, 13, 0.8)', lineHeight: '1.6' }}>
                  Watch this immediate operational walk-through with {partner.name} to grasp what desk underwriters check for during live submissions.
                </p>
              </div>

              {/* Custom Neobrutalist Video Player */}
              <div className="video-wrapper">
                <div className="video-box">
                  {/* Play Overlay */}
                  {!videoPlaying && (
                    <div className="video-overlay">
                      <div className="play-btn" onClick={() => setVideoPlaying(true)}>
                        <i className="fa-solid fa-play" style={{ marginLeft: '4px' }} />
                      </div>
                      <span style={{ marginTop: '16px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.05em' }}>
                        Click to Play Underwriting Briefing
                      </span>
                    </div>
                  )}

                  {/* Simulated Video Playback Screen */}
                  {videoPlaying && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' }}>
                      <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '32px', color: 'var(--electric-green)' }} />
                      <span style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        Simulated Stream Running... {videoTime}%
                      </span>

                      {/* Dynamic Timestamp Popup */}
                      {videoTime > 15 && videoTime < 65 && (
                        <div className="takeaway-alert">
                          <i className="fa-solid fa-lightbulb" style={{ marginRight: '8px' }} />
                          <strong>STRATEGIST ADVICE:</strong> Ensure your bank ledgers are processed via clear PDF format! Scanned images cause automatic processing delays.
                        </div>
                      )}

                      {videoTime >= 65 && videoTime < 95 && (
                        <div className="takeaway-alert" style={{ background: 'var(--cobalt-blue)' }}>
                          <i className="fa-solid fa-circle-check" style={{ marginRight: '8px' }} />
                          <strong>NEXT STEP:</strong> Use the Document Checklist widget to pre-approve your file state before we initiate routing.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="video-bar" style={{ width: `${videoTime}%` }} />
                </div>
              </div>

              {/* Call Itinerary */}
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Strategic 15-Minute Call Itinerary</h3>
                <div className="itinerary-timeline">
                  <div className="timeline-step">
                    <div className="timeline-dot active" />
                    <span className="timeline-time">Minute 0 - 3</span>
                    <h4 className="timeline-title">Operational Friction Diagnosis</h4>
                    <p className="timeline-desc">We identify why standard funding routes have fallen short and diagnose clear points of leverage within your target entity.</p>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-dot" />
                    <span className="timeline-time">Minute 3 - 8</span>
                    <h4 className="timeline-title">Capital Lane Matching</h4>
                    <p className="timeline-desc">Mapping your metrics directly against standard Working Capital, Asset leasing platforms, or structural low-interest Revenue lines.</p>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-dot" />
                    <span className="timeline-time">Minute 8 - 12</span>
                    <h4 className="timeline-title">Underwriting Target Capacity</h4>
                    <p className="timeline-desc">Securing realistic funding thresholds and analyzing dynamic terms to ensure healthy operating liquidity.</p>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-dot" />
                    <span className="timeline-time">Minute 12 - 15</span>
                    <h4 className="timeline-title">Desk Launch Mapping</h4>
                    <p className="timeline-desc">Setting target delivery times, assigning file specialists, and locking final document routing paths.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Prep Checklist & Case Studies */}
            <div>
              {/* Document Readiness Checklist Tracker */}
              <div className="checklist-card">
                <span className="badge" style={{ marginBottom: '12px', background: 'var(--electric-green)', color: 'var(--matte-black)' }}>Required Action</span>
                <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Pre-Submission Audit</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Secure faster review speeds. Prepare these key pieces to skip long triage queues.
                </p>

                <div className="checklist-progress-bar">
                  <div className="checklist-progress-fill" style={{ width: `${getProgressPercent()}%` }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
                  <span>AUDIT PROGRESS:</span>
                  <span style={{ color: getProgressPercent() === 100 ? 'var(--cobalt-blue)' : 'var(--signal-orange)' }}>
                    {getProgressPercent()}% PREPARED
                  </span>
                </div>

                <div>
                  {checklist.map(item => (
                    <div key={item.id} className="checklist-item" onClick={() => handleCheck(item.id)}>
                      <div className={`checklist-cb ${item.checked ? 'checked' : ''}`} />
                      <div className="checklist-info">
                        <span className="checklist-label" style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--text-muted)' : 'var(--matte-black)' }}>
                          {item.text}
                        </span>
                        <span className="checklist-desc">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Interactive Case Studies Selector */}
              <div className="cases-card">
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Execution Proof Centers</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Select your vertical to see real structured results achieved through modern desk routing rules.
                </p>

                <div className="cases-tabs">
                  <button className={`case-tab ${activeCase === 'ecommerce' ? 'active' : ''}`} onClick={() => setActiveCase('ecommerce')}>
                    E-Commerce
                  </button>
                  <button className={`case-tab ${activeCase === 'logistics' ? 'active' : ''}`} onClick={() => setActiveCase('logistics')}>
                    Logistics
                  </button>
                  <button className={`case-tab ${activeCase === 'brickandmortar' ? 'active' : ''}`} onClick={() => setActiveCase('brickandmortar')}>
                    Brick & Mortar
                  </button>
                </div>

                <div className="case-detail">
                  <div className="case-header">
                    <strong style={{ fontSize: '16px', color: 'var(--matte-black)' }}>{cases[activeCase].industry}</strong>
                    <span className="badge" style={{ background: cases[activeCase].accent, color: 'var(--matte-black)' }}>
                      {cases[activeCase].stat}
                    </span>
                  </div>

                  <div className="comparison-grid">
                    <div className="comparison-box" style={{ borderColor: 'var(--signal-orange)' }}>
                      <div className="comparison-lbl">Standard Broker MCA Channel</div>
                      <p className="comparison-desc">{cases[activeCase].before}</p>
                    </div>
                    <div className="comparison-box" style={{ borderColor: 'var(--electric-green)', background: 'rgba(57, 255, 20, 0.04)' }}>
                      <div className="comparison-lbl" style={{ color: 'var(--matte-black)' }}>Moonshine Route Output</div>
                      <p className="comparison-desc" style={{ fontWeight: 600 }}>{cases[activeCase].after}</p>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      Key Underwriting Documents Used:
                    </span>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {cases[activeCase].docs.map((doc, i) => (
                        <li key={i} style={{ color: 'var(--matte-black)' }}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FOOTER NOTICE */}
      <footer style={{ background: 'var(--matte-black)', color: 'var(--bone-white)', padding: '40px 0', borderTop: '3px solid var(--border-gray)', fontSize: '12px' }}>
        <div className="container" style={{ textAlign: 'center', opacity: 0.7 }}>
          <p style={{ margin: '0 0 12px 0' }}>
            &copy; {new Date().getFullYear()} Moonshine Capital and partner affiliates. All rights reserved.
          </p>
          <p style={{ margin: 0, lineHeight: '1.5', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
            Funding program structures, terms, routing paths, and capacity limitations depend intensely on provider review, dynamic operational profiles, actual verified bank statement records, and target platform underwriter approvals.
          </p>
        </div>
      </footer>
    </>
  );
}