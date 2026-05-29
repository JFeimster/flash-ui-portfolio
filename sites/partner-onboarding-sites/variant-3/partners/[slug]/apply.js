import React, { useState, useEffect } from 'react';

export default function ApplyPortal() {
  const [slug, setSlug] = useState('partner-hub');
  const [partnerName, setPartnerName] = useState('Authorized Partner');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    timeInBusiness: '',
    monthlyRevenue: '',
    entityType: '',
    creditBand: '',
    hasBankAcc: '',
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    consent: false
  });

  // Validation State
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse partner details from URL or fallback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const partnersIndex = pathParts.indexOf('partners');
      if (partnersIndex !== -1 && pathParts[partnersIndex + 1]) {
        const dynamicSlug = pathParts[partnersIndex + 1];
        setSlug(dynamicSlug);
        // Clean up visual partner name from slug (e.g. john-doe -> John Doe)
        const formatted = dynamicSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setPartnerName(formatted);
      }

      // Restore form draft from localStorage
      const savedDraft = localStorage.getItem(`moonshine_review_draft_${slug}`);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData(prev => ({ ...prev, ...parsed }));
          // Restore progress safely (don't force step 4 if data is partial)
          const savedStep = localStorage.getItem(`moonshine_review_step_${slug}`);
          if (savedStep) {
            setCurrentStep(Math.min(parseInt(savedStep, 10), totalSteps));
          }
        } catch (e) {
          console.error("Error loading application draft", e);
        }
      }
    }
  }, [slug]);

  // Persist draft to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      localStorage.setItem(`moonshine_review_draft_${slug}`, JSON.stringify(formData));
      localStorage.setItem(`moonshine_review_step_${slug}`, currentStep.toString());
    }
  }, [formData, currentStep, slug]);

  // Interactive tooltips dictionary based on focused inputs
  const tooltips = {
    amount: "Specify your optimal operating target. Underwriters use this boundary to index collateral-free working facilities versus structured long-term lines.",
    purpose: "Purpose helps route your file to specific desks. For instance, hard assets route to equipment lease structures which enjoy vastly optimized APR rates.",
    timeInBusiness: "Underwriting compliance protocols segment profiles under 1 year as early-stage Gig/Sole Prop capital, while 2+ years access premium institutional paths.",
    monthlyRevenue: "A critical routing ledger. Consistent monthly receipts override traditional low credit constraints because capital is backed by future receivables.",
    creditBand: "This is a soft assessment only. Zero hard inquiry hits. Knowing your band enables our system to instantly disqualify paths with strict credit requirements.",
    hasBankAcc: "A business checkings account is standard for direct commercial liquidity lines. If you select No, we default route your file through Sole Proprietor/1099 paths.",
    email: "Required to establish your tracking link and securely relay route matches without broadcasting sensitive merchant financials.",
    phone: "Required for SMS updates regarding underwriting clearance statuses, instant validation codes, and desk callbacks."
  };

  // Field Validation Logic
  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) < 1000) {
        stepErrors.amount = "Minimum request size is $1,000";
      }
      if (Number(formData.amount) > 10000000) {
        stepErrors.amount = "Maximum limit for automated matching is $10M";
      }
      if (!formData.purpose) {
        stepErrors.purpose = "Select an operational deployment purpose";
      }
    } else if (step === 2) {
      if (!formData.timeInBusiness) {
        stepErrors.timeInBusiness = "Indicate operational duration";
      }
      if (!formData.monthlyRevenue) {
        stepErrors.monthlyRevenue = "Select your current monthly baseline volume";
      }
      if (!formData.entityType) {
        stepErrors.entityType = "Entity type selection required";
      }
    } else if (step === 3) {
      if (!formData.creditBand) {
        stepErrors.creditBand = "Select your current estimated credit index";
      }
      if (!formData.hasBankAcc) {
        stepErrors.hasBankAcc = "Select operating account status";
      }
    } else if (step === 4) {
      if (!formData.firstName.trim()) stepErrors.firstName = "First name required";
      if (!formData.lastName.trim()) stepErrors.lastName = "Last name required";
      if (!formData.businessName.trim()) stepErrors.businessName = "Registered business entity name required";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        stepErrors.email = "Enter a valid enterprise email";
      }

      const phoneClean = formData.phone.replace(/\D/g, '');
      if (phoneClean.length < 10) {
        stepErrors.phone = "Provide a valid 10-digit primary phone";
      }

      if (!formData.consent) {
        stepErrors.consent = "Underwriting guidelines require data validation consent";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (validateStep(4)) {
      setIsSubmitting(true);
      
      // Simulate high-speed route mapping calculations
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        if (typeof window !== 'undefined' && slug) {
          localStorage.removeItem(`moonshine_review_draft_${slug}`);
          localStorage.removeItem(`moonshine_review_step_${slug}`);
        }
      }, 2000);
    }
  };

  // Reset form helper
  const handleReset = () => {
    setFormData({
      amount: '',
      purpose: '',
      timeInBusiness: '',
      monthlyRevenue: '',
      entityType: '',
      creditBand: '',
      hasBankAcc: '',
      firstName: '',
      lastName: '',
      businessName: '',
      email: '',
      phone: '',
      consent: false
    });
    setCurrentStep(1);
    setIsSubmitted(false);
    setErrors({});
  };

  return (
    <div className="portal-wrapper">
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
          
          --transition-fast: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body, .portal-wrapper {
          background-color: var(--bone-white);
          color: var(--matte-black);
          font-family: var(--font-sans);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        header {
          background-color: var(--matte-black);
          border-bottom: 3px solid var(--matte-black);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
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

        .header-badge {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          background-color: var(--electric-green);
          color: var(--matte-black);
          padding: 6px 12px;
          border: 2px solid var(--matte-black);
          box-shadow: 2px 2px 0px 0px var(--matte-black);
        }

        main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .wizard-layout {
          width: 100%;
          max-width: 1000px;
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 32px;
        }

        .wizard-card {
          background: #FFFFFF;
          border: var(--neo-border);
          box-shadow: var(--neo-shadow);
          padding: 40px;
          position: relative;
        }

        .progress-header {
          margin-bottom: 32px;
        }

        .progress-meta {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .progress-bar-track {
          height: 12px;
          background-color: var(--bone-white);
          border: 2px solid var(--matte-black);
          position: relative;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: var(--electric-green);
          transition: width var(--transition-fast) ease-out;
        }

        .step-container {
          display: none;
        }

        .step-container.active {
          display: block;
          animation: stepFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .step-title {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .step-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        /* Form Inputs */
        .form-group {
          margin-bottom: 24px;
          position: relative;
        }

        .field-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .text-input {
          width: 100%;
          padding: 16px;
          font-size: 18px;
          font-family: var(--font-sans);
          font-weight: 600;
          border: var(--neo-border);
          background-color: var(--bone-white);
          color: var(--matte-black);
          outline: none;
          transition: all var(--transition-fast);
        }

        .text-input:focus {
          background-color: #FFFFFF;
          box-shadow: var(--neo-shadow-sm);
          transform: translate(-2px, -2px);
        }

        /* Custom selectors */
        .selector-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .selector-grid-three {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .selector-btn {
          width: 100%;
          padding: 16px;
          text-align: left;
          background-color: var(--bone-white);
          border: var(--neo-border);
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .selector-btn:hover {
          background-color: #FFFFFF;
          transform: translate(-2px, -2px);
          box-shadow: var(--neo-shadow-sm);
        }

        .selector-btn.selected {
          background-color: var(--electric-green);
          box-shadow: var(--neo-shadow-sm);
          transform: translate(-2px, -2px);
        }

        .selector-btn.selected-orange {
          background-color: var(--signal-orange);
          color: var(--bone-white);
          box-shadow: var(--neo-shadow-sm);
          transform: translate(-2px, -2px);
        }

        /* Custom Currency Input Styling */
        .currency-input-wrap {
          position: relative;
        }

        .currency-prefix {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-mono);
          font-size: 20px;
          font-weight: 800;
          color: var(--text-muted);
          pointer-events: none;
        }

        .currency-input {
          padding-left: 36px !important;
        }

        .validation-error {
          color: var(--signal-orange);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          margin-top: 6px;
          display: block;
        }

        /* Action Buttons */
        .btn-row {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          gap: 16px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 32px;
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          text-decoration: none;
          border: var(--neo-border);
          background-color: var(--bone-white);
          color: var(--matte-black);
          box-shadow: var(--neo-shadow-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px 0px var(--matte-black);
        }

        .btn:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0px 0px var(--matte-black);
        }

        .btn-orange {
          background-color: var(--signal-orange);
          color: var(--bone-white);
        }

        .btn-green {
          background-color: var(--electric-green);
          color: var(--matte-black);
        }

        .btn-black {
          background-color: var(--matte-black);
          color: var(--bone-white);
        }

        .btn-full {
          width: 100%;
        }

        /* Tooltip Sidebar Component */
        .sidebar-card {
          background-color: var(--matte-black);
          border: var(--neo-border);
          box-shadow: 6px 6px 0px 0px var(--signal-orange);
          padding: 32px;
          color: var(--bone-white);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .sidebar-title {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 800;
          color: var(--electric-green);
          text-transform: uppercase;
          margin-bottom: 16px;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sidebar-content {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(244, 244, 240, 0.85);
        }

        .sidebar-help {
          background-color: var(--graphite-gray);
          border-left: 4px solid var(--electric-green);
          padding: 16px;
          margin-top: 24px;
          font-size: 12px;
        }

        .sidebar-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          color: var(--electric-green);
          margin-top: 16px;
        }

        /* Success screen styles */
        .success-box {
          text-align: center;
          padding: 24px 0;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: var(--electric-green);
          border: 3px solid var(--matte-black);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: var(--matte-black);
          margin-bottom: 24px;
          animation: popSuccess 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popSuccess {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-title {
          font-size: 32px;
          font-weight: 950;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .success-text {
          font-size: 15px;
          color: rgba(13, 13, 13, 0.75);
          margin-bottom: 32px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .success-route-card {
          background: var(--bone-white);
          border: var(--neo-border);
          padding: 24px;
          margin-bottom: 32px;
          text-align: left;
        }

        .success-route-title {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--signal-orange);
          margin-bottom: 8px;
        }

        /* Responsive modifications */
        @media (max-width: 900px) {
          .wizard-layout {
            grid-template-columns: 1fr;
          }
          .sidebar-card {
            order: -1;
            position: relative;
            top: 0;
          }
          .wizard-card {
            padding: 24px;
          }
        }
      ` }} />

      {/* STICKY HEADER */}
      <header>
        <a href={`/partners/${slug}`} className="logo-container">
          <div className="logo-mark"><span>M</span></div>
          <div className="logo-text">MOONSHINE</div>
        </a>
        <span className="header-badge">Review Desk Connected</span>
      </header>

      {/* PORTAL BODY */}
      <main>
        <div className="wizard-layout">
          {/* Main Form Area */}
          <div className="wizard-card">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                {/* Neobrutalist Progress Meter */}
                <div className="progress-header">
                  <div className="progress-meta">
                    <span>STAGE {currentStep} of {totalSteps}</span>
                    <span>{Math.round(((currentStep - 1) / totalSteps) * 100)}% COMPLETED</span>
                  </div>
                  <div className="progress-bar-track">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${((currentStep) / totalSteps) * 100}%` }} 
                    />
                  </div>
                </div>

                {/* STEP 1: Capital Requirements */}
                <div className={`step-container ${currentStep === 1 ? 'active' : ''}`}>
                  <h1 className="step-title">Capital Requirements</h1>
                  <p className="step-subtitle">Begin your verification workflow by identifying capital targets.</p>

                  <div className="form-group">
                    <label className="field-label">How much funding do you need?</label>
                    <div className="currency-input-wrap">
                      <span className="currency-prefix">$</span>
                      <input 
                        type="number" 
                        name="amount"
                        className="text-input currency-input" 
                        placeholder="50,000"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        onFocus={() => setFocusedField('amount')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    {errors.amount && <span className="validation-error">{errors.amount}</span>}
                  </div>

                  <div className="form-group">
                    <label className="field-label">Primary deployment objective</label>
                    <div className="selector-grid">
                      {['Cash Flow Expansion', 'Equipment Acquisition', 'Inventory Stocking', 'Commercial Property', 'Marketing Push', 'Refinancing'].map((purpose) => (
                        <button
                          key={purpose}
                          type="button"
                          className={`selector-btn ${formData.purpose === purpose ? 'selected' : ''}`}
                          onClick={() => setFormData({ ...formData, purpose })}
                          onFocus={() => setFocusedField('purpose')}
                          onBlur={() => setFocusedField(null)}
                        >
                          {purpose}
                        </button>
                      ))}
                    </div>
                    {errors.purpose && <span className="validation-error">{errors.purpose}</span>}
                  </div>
                </div>

                {/* STEP 2: Business Health */}
                <div className={`step-container ${currentStep === 2 ? 'active' : ''}`}>
                  <h1 className="step-title">Business Footprint</h1>
                  <p className="step-subtitle">Identify entity metrics required to verify system thresholds.</p>

                  <div className="form-group">
                    <label className="field-label">Time in Business</label>
                    <div className="selector-grid">
                      {[
                        { label: 'Less than 1 Year', value: '<1 year' },
                        { label: '1 to 2 Years', value: '1-2 years' },
                        { label: '2 to 5 Years', value: '2-5 years' },
                        { label: '5+ Years', value: '5+ years' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`selector-btn ${formData.timeInBusiness === opt.value ? 'selected' : ''}`}
                          onClick={() => setFormData({ ...formData, timeInBusiness: opt.value })}
                          onFocus={() => setFocusedField('timeInBusiness')}
                          onBlur={() => setFocusedField(null)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {errors.timeInBusiness && <span className="validation-error">{errors.timeInBusiness}</span>}
                  </div>

                  <div className="form-group">
                    <label className="field-label">Average Monthly Revenue</label>
                    <div className="selector-grid">
                      {[
                        { label: 'Under $15,000 / mo', value: 'under-15k' },
                        { label: '$15,000 - $50,000', value: '15k-50k' },
                        { label: '$50,000 - $100,000', value: '50k-100k' },
                        { label: '$100,000+ / mo', value: 'over-100k' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`selector-btn ${formData.monthlyRevenue === opt.value ? 'selected-orange' : ''}`}
                          onClick={() => setFormData({ ...formData, monthlyRevenue: opt.value })}
                          onFocus={() => setFocusedField('monthlyRevenue')}
                          onBlur={() => setFocusedField(null)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {errors.monthlyRevenue && <span className="validation-error">{errors.monthlyRevenue}</span>}
                  </div>

                  <div className="form-group">
                    <label className="field-label">Filing Entity Structure</label>
                    <div className="selector-grid-three">
                      {['LLC', 'S-Corp', 'C-Corp', 'Sole Prop', 'Partnership'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`selector-btn ${formData.entityType === type ? 'selected' : ''}`}
                          onClick={() => setFormData({ ...formData, entityType: type })}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {errors.entityType && <span className="validation-error">{errors.entityType}</span>}
                  </div>
                </div>

                {/* STEP 3: Owner Profile */}
                <div className={`step-container ${currentStep === 3 ? 'active' : ''}`}>
                  <h1 className="step-title">Risk Context</h1>
                  <p className="step-subtitle">Verify financial health indexes. Standard risk checks remain soft.</p>

                  <div className="form-group">
                    <label className="field-label">Estimated Personal Credit Band</label>
                    <div className="selector-grid">
                      {[
                        { label: '720+ (Excellent)', value: '720' },
                        { label: '660 - 719 (Good)', value: '660' },
                        { label: '600 - 659 (Fair)', value: '600' },
                        { label: 'Under 600 (Poor)', value: '500' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`selector-btn ${formData.creditBand === opt.value ? 'selected' : ''}`}
                          onClick={() => setFormData({ ...formData, creditBand: opt.value })}
                          onFocus={() => setFocusedField('creditBand')}
                          onBlur={() => setFocusedField(null)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {errors.creditBand && <span className="validation-error">{errors.creditBand}</span>}
                  </div>

                  <div className="form-group">
                    <label className="field-label">Do you possess an active business bank account?</label>
                    <div className="selector-grid">
                      <button
                        type="button"
                        className={`selector-btn ${formData.hasBankAcc === 'yes' ? 'selected-orange' : ''}`}
                        onClick={() => setFormData({ ...formData, hasBankAcc: 'yes' })}
                        onFocus={() => setFocusedField('hasBankAcc')}
                        onBlur={() => setFocusedField(null)}
                      >
                        Yes, I use Business Account
                      </button>
                      <button
                        type="button"
                        className={`selector-btn ${formData.hasBankAcc === 'no' ? 'selected-orange' : ''}`}
                        onClick={() => setFormData({ ...formData, hasBankAcc: 'no' })}
                        onFocus={() => setFocusedField('hasBankAcc')}
                        onBlur={() => setFocusedField(null)}
                      >
                        No, Personal Accounts Only
                      </button>
                    </div>
                    {errors.hasBankAcc && <span className="validation-error">{errors.hasBankAcc}</span>}
                  </div>
                </div>

                {/* STEP 4: Secure Contact Setup */}
                <div className={`step-container ${currentStep === 4 ? 'active' : ''}`}>
                  <h1 className="step-title">Secure Verification</h1>
                  <p className="step-subtitle">Submit credentials securely. Matches sync through your liaison desk.</p>

                  <div className="selector-grid" style={{ marginBottom: '24px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="field-label">First Name</label>
                      <input 
                        type="text" 
                        className="text-input" 
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      {errors.firstName && <span className="validation-error">{errors.firstName}</span>}
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="field-label">Last Name</label>
                      <input 
                        type="text" 
                        className="text-input" 
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                      {errors.lastName && <span className="validation-error">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="field-label">Registered Business Legal Name</label>
                    <input 
                      type="text" 
                      className="text-input" 
                      placeholder="Enterprise Corp LLC"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                    {errors.businessName && <span className="validation-error">{errors.businessName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="field-label">Enterprise Contact Email</label>
                    <input 
                      type="email" 
                      className="text-input" 
                      placeholder="johndoe@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {errors.email && <span className="validation-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="field-label">Primary Mobile Phone</label>
                    <input 
                      type="tel" 
                      className="text-input" 
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {errors.phone && <span className="validation-error">{errors.phone}</span>}
                  </div>

                  <div className="form-group" style={{ marginTop: '32px' }}>
                    <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', userSelect: 'none' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        style={{
                          width: '20px',
                          height: '20px',
                          accentColor: 'var(--matte-black)',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '12px', lineHeight: '1.4', color: 'rgba(13, 13, 13, 0.75)' }}>
                        I authorize the secure diagnostic mapping algorithms of Moonshine Capital to analyze this file and direct my profile options back to my partner desk rep, <strong>{partnerName}</strong>. Standard Privacy rules protect this.
                      </span>
                    </label>
                    {errors.consent && <span className="validation-error">{errors.consent}</span>}
                  </div>
                </div>

                {/* Wizard Dynamic Navigation */}
                <div className="btn-row">
                  {currentStep > 1 && (
                    <button type="button" className="btn" onClick={handleBack}>
                      ← Back
                    </button>
                  )}
                  {currentStep < totalSteps ? (
                    <button 
                      type="button" 
                      className="btn btn-green" 
                      style={{ marginLeft: 'auto' }}
                      onClick={handleNext}
                    >
                      Continue Route →
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="btn btn-orange" 
                      style={{ marginLeft: 'auto' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SECURELY CALCULATING...' : 'SUBMIT DIRECT FOR ROUTING ✓'}
                    </button>
                  )}
                </div>
              </form>
            ) : (
              /* Success / Results Panel */
              <div className="success-box">
                <div className="success-icon">✓</div>
                <h1 className="success-title">Route Mapped</h1>
                <p className="success-text">
                  Your diagnostic profile has bypassed standard aggregate broker networks and routed directly into high-tier desks under the management of <strong>{partnerName}</strong>.
                </p>

                <div className="success-route-card">
                  <div className="success-route-title">Automated Match Matrix Details</div>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
                    <strong>Direct Desk Channel:</strong> Verified Partner Desk Routing (Slug: <span style={{ fontFamily: 'var(--font-mono)' }}>{slug}</span>)<br />
                    <strong>Requested Allocation:</strong> ${Number(formData.amount).toLocaleString()}<br />
                    <strong>Initial Assessment Target:</strong> {Number(formData.amount) > 150000 || formData.monthlyRevenue === 'over-100k' ? 'Structured Low APR Asset Class' : 'High-Velocity Line of Credit'}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Your primary rep will contact you via {formData.email} and {formData.phone} shortly with underwriting requirements. Keep your bank statement archives prepared.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <a href={`/partners/${slug}`} className="btn btn-black">Return To Hub</a>
                  <button type="button" className="btn btn-green" onClick={handleReset}>New Review Run</button>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Tooltip and Sidebar */}
          <div className="sidebar-card">
            <div>
              <div className="sidebar-title">
                <span>⚡ REALTIME ASSISTANCE</span>
              </div>
              <div className="sidebar-content">
                {focusedField && tooltips[focusedField] ? (
                  <p style={{ animation: 'stepFadeIn 0.2s ease-out' }}>
                    {tooltips[focusedField]}
                  </p>
                ) : (
                  <p>
                    Ensure your entries correspond directly with active banking ledgers. Divergences in automated diagnostic files can result in temporary desk routing freezes.
                  </p>
                )}
              </div>

              <div className="sidebar-help">
                <strong>No Hard Credit Inquiry:</strong> None of the operations performed inside this secure builder triggers hard checks. You maintain absolute credit profile protection.
              </div>
            </div>

            <div>
              <div className="sidebar-badge">
                <span>🛡️ SSL SECURED ARCHITECTURE</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                Underwriting diagnostics run through Moonshine Systems' advanced commercial database structures to keep files secure and private.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}