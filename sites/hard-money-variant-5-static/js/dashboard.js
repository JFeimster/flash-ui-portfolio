/**
 * Capital_Vault - Lender Management Dashboard Component Script
 * High-Fidelity Mock Portal State and Interactive Operations
 * Optimized for Integration with Premium Glassmorphic Tailwind templates
 */

window.lenderDashboard = function() {
  return {
    // Current active dashboard tab
    activeTab: 'overview', // 'overview' | 'profile' | 'leads' | 'territory' | 'analytics'
    
    // Quick status controls
    systemOnline: true,
    isPremiumListed: true,
    subscriptionTier: 'Institutional Gold Vault',
    
    // Toast Notification Pipeline
    notifications: [],
    
    // Comprehensive Lender Profile State
    profile: {
      lenderName: "Apex Capital Alliance",
      companyPhone: "(800) 555-0199",
      website: "https://www.apexcapitalalliance.com",
      city: "Los Angeles",
      state: "California",
      streetAddress: "1100 Glendon Ave, 18th Floor",
      zipCode: "90024",
      bio: "Apex Capital Alliance is a premier direct private balance sheet lender. We specialize in fast, customized financing solutions for real estate investors. With over $1.5B in closed transactions, we provide reliable, institutional-grade debt capital across bridge, fix-and-flip, and multi-family value-add programs.",
      minLoanAmount: 150000,
      maxLoanAmount: 12500000,
      maxLTV: 80,
      minFico: 580,
      targetRateMin: 7.99,
      targetRateMax: 10.50,
      loanPrograms: ['Bridge Loans', 'Fix and Flip Loans', 'Investment Property Loans', 'Refinance / Cash Out Loans'],
      propertyClasses: ['Single Family', 'Multi Family', 'Apartment', 'Mixed Use', 'Commercial']
    },

    // Territorial Footprint (Active states matrix)
    activeStates: ['CA', 'AZ', 'CO', 'FL', 'TX', 'NV', 'WA', 'UT', 'OR', 'NY', 'NJ'],
    allStates: [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ],

    // Real-time Pipeline Analytics
    analytics: {
      impressions30d: 14520,
      profileClicks30d: 1890,
      leadsGenerated30d: 42,
      conversionRate: '2.2%',
      volumeFundedYTD: 14250000,
      activePipelineVal: 8400000
    },

    // Interactive Deal Leads Database
    leads: [
      {
        id: "LND-8942",
        borrowerName: "Marcus Vance",
        phone: "(310) 555-3921",
        email: "marcus.vance@vancedevelopments.com",
        propertyType: "Multi Family",
        loanType: "Fix and Flip Loans",
        location: "Phoenix, AZ",
        requestedAmount: 1250000,
        estimatedLTV: 75,
        estimatedValue: 1670000,
        ficoScore: 680,
        timestamp: "2 mins ago",
        status: "new", // 'new' | 'contacted' | 'approved' | 'closed' | 'archived'
        description: "Acquisition of a distressed 8-unit value-add apartment complex in dynamic Phoenix submarket. Plan is to execute interior renovations of $15k per unit and refi into long-term agency debt."
      },
      {
        id: "LND-8939",
        borrowerName: "Sarah Jenkins",
        phone: "(415) 555-9012",
        email: "sjenkins@equitypartners.co",
        propertyType: "Single Family",
        loanType: "Bridge Loans",
        location: "Austin, TX",
        requestedAmount: 640000,
        estimatedLTV: 70,
        estimatedValue: 915000,
        ficoScore: 710,
        timestamp: "1 hour ago",
        status: "contacted",
        description: "Acquisition bridge loan to secure a prime single-family investment property before standard financing expires. Property is structurally sound, needs light cosmetics."
      },
      {
        id: "LND-8911",
        borrowerName: "David Goldstein",
        phone: "(201) 555-4841",
        email: "david@goldsteinrealty.com",
        propertyType: "Apartment",
        loanType: "Investment Property Loans",
        location: "Fort Lauderdale, FL",
        requestedAmount: 4850000,
        estimatedLTV: 80,
        estimatedValue: 6062500,
        ficoScore: 740,
        timestamp: "1 day ago",
        status: "approved",
        description: "Cash-out refinance to pull equity from a fully stabilized 24-unit garden-style apartment building. Funds will be deployed into active pipeline opportunities in Tampa."
      },
      {
        id: "LND-8894",
        borrowerName: "Elena Rostova",
        phone: "(702) 555-1104",
        email: "erostova@urbanlivingnv.com",
        propertyType: "Single Family",
        loanType: "Refinance / Cash Out Loans",
        location: "Las Vegas, NV",
        requestedAmount: 380000,
        estimatedLTV: 65,
        estimatedValue: 585000,
        ficoScore: 640,
        timestamp: "3 days ago",
        status: "closed",
        description: "Refinance of private debt on a long-term luxury rental property. Low risk due to solid rental cash flow and reliable asset-class dynamics in Henderson corridor."
      },
      {
        id: "LND-8821",
        borrowerName: "Jonathan Cole",
        phone: "(206) 555-8910",
        email: "jcole@cascadeholdings.net",
        propertyType: "Mixed Use",
        loanType: "Bridge Loans",
        location: "Seattle, WA",
        requestedAmount: 2200000,
        estimatedLTV: 72,
        estimatedValue: 3050000,
        ficoScore: 695,
        timestamp: "1 week ago",
        status: "archived",
        description: "Commercial bridge financing for ground floor retail and 4 upper-level residential units. Deal stalled due to historical environmental zoning issue."
      }
    ],

    // Lead detail modal state
    selectedLead: null,
    
    // Init lifecycle
    init() {
      this.pushNotification('System Synced', 'Premium Directory API connection verified.', 'success');
      
      // Auto-simulate live deal incoming from the directory to display interactive UI fidelity
      setTimeout(() => {
        this.simulateIncomingLead();
      }, 15000);
    },

    // Add visual system notification
    pushNotification(title, message, type = 'info') {
      const id = Date.now();
      this.notifications.push({ id, title, message, type });
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 6000);
    },

    // Update Directory profile information
    saveProfile() {
      this.pushNotification(
        'Vault Updated', 
        'Listing changes successfully broadcasted to the main pipeline directory.', 
        'success'
      );
    },

    // Toggle active geographic lending footprint
    toggleTerritory(stateCode) {
      if (this.activeStates.includes(stateCode)) {
        // Must maintain at least one state footprint
        if (this.activeStates.length > 1) {
          this.activeStates = this.activeStates.filter(s => s !== stateCode);
          this.pushNotification('Territory Removed', `Removed ${stateCode} from direct matches.`, 'info');
        } else {
          this.pushNotification('Action Denied', 'At least one active lending state is required.', 'error');
        }
      } else {
        this.activeStates.push(stateCode);
        this.pushNotification('Territory Added', `Activated instant matches in ${stateCode}.`, 'success');
      }
    },

    // Expand to all available states with one action
    activateAllStates() {
      this.activeStates = [...this.allStates];
      this.pushNotification('Expanded Coverage', 'Now active across all 50 US States.', 'success');
    },

    // Change status of pipeline deals
    updateLeadStatus(leadId, newStatus) {
      const lead = this.leads.find(l => l.id === leadId);
      if (lead) {
        const oldStatus = lead.status;
        lead.status = newStatus;
        
        // Adjust mock YTD/Active metrics on simulated fundings
        if (newStatus === 'closed' && oldStatus !== 'closed') {
          this.analytics.volumeFundedYTD += lead.requestedAmount;
          this.analytics.activePipelineVal -= lead.requestedAmount;
          this.pushNotification('Deal Funded!', `Successfully recorded $${lead.requestedAmount.toLocaleString()} loan execution.`, 'success');
        } else if (oldStatus === 'closed' && newStatus !== 'closed') {
          this.analytics.volumeFundedYTD -= lead.requestedAmount;
          this.analytics.activePipelineVal += lead.requestedAmount;
        }

        this.pushNotification('Lead Updated', `Deal ${leadId} status set to ${newStatus}.`, 'info');
      }
    },

    // Delete/Archive deal logic
    archiveLead(leadId) {
      this.updateLeadStatus(leadId, 'archived');
    },

    // Detail view activation
    viewLead(lead) {
      this.selectedLead = lead;
    },

    closeLeadDetail() {
      this.selectedLead = null;
    },

    // Toggle entire programmatic directory visibility on/off
    toggleListingStatus() {
      this.isPremiumListed = !this.isPremiumListed;
      const statusText = this.isPremiumListed ? 'Active Premium Stream' : 'Invisible (Deactivated)';
      this.pushNotification(
        'Listing Visibility Changed',
        `Your public catalog presence is now set to ${statusText}.`,
        this.isPremiumListed ? 'success' : 'warning'
      );
    },

    // Export raw JSON or CSV lead format
    exportLeads() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.leads, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `CapitalVault_Leads_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.pushNotification('Export Initiated', 'Saved current portfolio dataset locally.', 'success');
    },

    // Realtime Pipeline simulation (Generates highly accurate mock deal lead structure)
    simulateIncomingLead() {
      const mockFirstNames = ["Sarah", "James", "Elena", "Carlos", "Brittany", "Devon", "Anya", "Arthur"];
      const mockLastNames = ["Kovacs", "O'Connor", "Miller", "Vanderbilt", "Zheng", "Rodriguez", "Chase"];
      const mockProperties = ["Single Family", "Multi Family", "Apartment", "Warehouse", "Retail", "Land"];
      const mockLocations = ["San Diego, CA", "Salt Lake City, UT", "Tampa, FL", "Denver, CO", "Dallas, TX", "Seattle, WA"];
      const mockPrograms = ["Fix and Flip Loans", "Bridge Loans", "Investment Property Loans", "New Construction Loans"];
      
      const randomAmount = Math.floor(Math.random() * (2500000 - 180000 + 1)) + 180000;
      const randomLTV = [60, 65, 70, 75, 80][Math.floor(Math.random() * 5)];
      const randomValue = Math.round(randomAmount / (randomLTV / 100));

      const newSimLead = {
        id: `LND-${Math.floor(Math.random() * 9000) + 1000}`,
        borrowerName: `${mockFirstNames[Math.floor(Math.random() * mockFirstNames.length)]} ${mockLastNames[Math.floor(Math.random() * mockLastNames.length)]}`,
        phone: `(${Math.floor(Math.random() * 800) + 200}) 555-01${Math.floor(Math.random() * 90) + 10}`,
        email: "capitalpipeline@simulateddeal.com",
        propertyType: mockProperties[Math.floor(Math.random() * mockProperties.length)],
        loanType: mockPrograms[Math.floor(Math.random() * mockPrograms.length)],
        location: mockLocations[Math.floor(Math.random() * mockLocations.length)],
        requestedAmount: randomAmount,
        estimatedLTV: randomLTV,
        estimatedValue: randomValue,
        ficoScore: Math.floor(Math.random() * (810 - 600 + 1)) + 600,
        timestamp: "Just Now",
        status: "new",
        description: "Live incoming capital matching request routed direct from Capital_Vault. Borrowers are looking for quick execution parameters and a reliable strategic capital provider."
      };

      // Add to front of active pipeline array
      this.leads.unshift(newSimLead);
      this.analytics.leadsGenerated30d += 1;
      this.analytics.activePipelineVal += randomAmount;
      
      // Notify lender interface
      this.pushNotification(
        '🚨 New Direct Matching Deal!',
        `${newSimLead.borrowerName} requests $${randomAmount.toLocaleString()} for a ${newSimLead.propertyType} in ${newSimLead.location}.`,
        'success'
      );
    }
  };
};