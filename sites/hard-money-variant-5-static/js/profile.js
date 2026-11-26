document.addEventListener('alpine:init', () => {
  // Alpine.js Store for Lender Profiles, Reviews, and Direct Messaging Pipeline
  Alpine.store('lenderProfiles', {
    // Highly detailed mock parameters for each lender in the base system
    extendedData: {
      "Colony American Finance": {
        founded: "2013",
        minLoanAmount: 500000,
        maxLoanAmount: 100000000,
        underwritingTime: "7-10 Days",
        originationFee: "1.5% - 2.5%",
        geographicCoverage: {
          type: "National",
          states: ["AK", "CA", "TX", "FL", "NY", "IL", "GA", "NC", "OH", "PA"],
          mapRegions: "West Coast, East Coast, Southern Hubs"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 75, maxLTC: 90, rateRange: "8.99% - 11.25%", term: "12-18 Months", minFico: 620 },
          { name: "Bridge Loans", maxLTV: 75, maxLTC: 85, rateRange: "7.99% - 9.50%", term: "12-36 Months", minFico: 600 },
          { name: "DSCR Rental Long-Term", maxLTV: 80, maxLTC: 0, rateRange: "6.75% - 8.25%", term: "30 Years", minFico: 640 }
        ],
        reviews: [
          { author: "Marcus Vance", role: "Real Estate Developer", rating: 5, date: "2024-02-15", content: "Extremely fast approval process on our multi-family bridge facility. Their underwriting team actually understands commercial deal flow.", tags: ["Fast Close", "High Leverage"] },
          { author: "Elena Rostova", role: "Portfolio Manager", rating: 4, date: "2024-01-20", content: "Great long-term DSCR programs. Origination fees were slightly higher than expected, but the reliability and execution speed make up for it.", tags: ["Reliable Rate"] },
          { author: "Todd Sterling", role: "SFR Rehabber", rating: 5, date: "2023-11-05", content: "Processed a massive $12M portfolio cash-out refinance effortlessly. Highly recommend for sophisticated institutional developers.", tags: ["Institutional Power"] }
        ]
      },
      "Asset Avenue": {
        founded: "2014",
        minLoanAmount: 150000,
        maxLoanAmount: 2000000,
        underwritingTime: "5-7 Days",
        originationFee: "1.0% - 2.0%",
        geographicCoverage: {
          type: "Multi-State Regional",
          states: ["AL", "AR", "CA", "CO", "CT", "FL", "GA", "IL", "IN", "TX", "WA"],
          mapRegions: "Southeast, West Coast, Central Metros"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 85, maxLTC: 95, rateRange: "9.25% - 12.00%", term: "12 Months", minFico: 600 },
          { name: "Bridge Loans", maxLTV: 80, maxLTC: 85, rateRange: "8.50% - 10.50%", term: "12-24 Months", minFico: 620 },
          { name: "DSCR Investment", maxLTV: 75, maxLTC: 0, rateRange: "7.25% - 8.99%", term: "30 Years", minFico: 660 }
        ],
        reviews: [
          { author: "Derrick Jenkins", role: "Fix & Flip Investor", rating: 5, date: "2024-02-28", content: "Asset Avenue came through when our local credit union backed out. Handled 85% LTV without a hitch. Draws are smooth as butter.", tags: ["Great Draws", "High Leverage"] },
          { author: "Samantha Wu", role: "Residential Developer", rating: 5, date: "2023-12-10", content: "Unbelievable service. They closed our flip loan in 6 days flat. Our contractor is happy with the rapid draw turnaround.", tags: ["Fast Close"] }
        ]
      },
      "Source Capital": {
        founded: "2007",
        minLoanAmount: 100000,
        maxLoanAmount: 5000000,
        underwritingTime: "3-5 Days",
        originationFee: "2.0% - 3.0%",
        geographicCoverage: {
          type: "State Targeted",
          states: ["CA", "AZ", "MN"],
          mapRegions: "California Coastal, Phoenix Metro, Twin Cities"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 70, maxLTC: 85, rateRange: "7.99% - 10.50%", term: "12-24 Months", minFico: 550 },
          { name: "Commercial Bridge", maxLTV: 65, maxLTC: 75, rateRange: "8.25% - 11.00%", term: "12-36 Months", minFico: 500 },
          { name: "Refinance Cash-Out", maxLTV: 70, maxLTC: 70, rateRange: "7.99% - 9.50%", term: "12-36 Months", minFico: 500 }
        ],
        reviews: [
          { author: "Hector Ramirez", role: "Commercial Investor", rating: 5, date: "2024-03-01", content: "If you have solid equity, they do not care about credit. True asset-based lenders who move at lighting speed.", tags: ["True Asset Lending", "Low FICO Friendly"] },
          { author: "Julie Sterling", role: "Retail Rehab Broker", rating: 4, date: "2024-01-14", content: "Closed a commercial warehouse bridge in San Diego. Very transparent process, rate stayed exactly as quoted in the term sheet.", tags: ["No Hidden Fees"] }
        ]
      },
      "Great Oak Capital": {
        founded: "2016",
        minLoanAmount: 100000,
        maxLoanAmount: 1000000,
        underwritingTime: "4-6 Days",
        originationFee: "1.5% - 2.0%",
        geographicCoverage: {
          type: "Local Metro Specialization",
          states: ["PA", "NJ", "DE"],
          mapRegions: "Philadelphia County, Chester County, Montgomery County, South Jersey"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 80, maxLTC: 90, rateRange: "9.50% - 11.75%", term: "6-12 Months", minFico: 600 },
          { name: "Bridge Funding", maxLTV: 75, maxLTC: 80, rateRange: "8.99% - 10.50%", term: "12 Months", minFico: 580 },
          { name: "Raw Land / Dev", maxLTV: 50, maxLTC: 60, rateRange: "11.00% - 13.50%", term: "12-18 Months", minFico: 650 }
        ],
        reviews: [
          { author: "Brian O'Connor", role: "Philly Rehabber", rating: 5, date: "2024-02-10", content: "Great Oak is the premier local lender in Philly. They personally inspect the sites and release draws instantly.", tags: ["Local Experts", "Fast Draws"] }
        ]
      },
      "CIVIC Private Money Lending": {
        founded: "2014",
        minLoanAmount: 100000,
        maxLoanAmount: 5000000,
        underwritingTime: "5-7 Days",
        originationFee: "1.0% - 1.5%",
        geographicCoverage: {
          type: "Multi-State Regional",
          states: ["AZ", "CA", "CO", "FL", "GA", "HI", "NV", "OR", "TX", "WA"],
          mapRegions: "Sun Belt States, West Coast, Rocky Mountains"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 80, maxLTC: 90, rateRange: "8.50% - 10.50%", term: "12-24 Months", minFico: 600 },
          { name: "Buy and Hold", maxLTV: 80, maxLTC: 80, rateRange: "7.75% - 9.25%", term: "24-48 Months", minFico: 600 },
          { name: "Refinance Cash-Out", maxLTV: 75, maxLTC: 0, rateRange: "8.25% - 9.99%", term: "36 Months", minFico: 580 }
        ],
        reviews: [
          { author: "Kelsey Vance", role: "Portfolio Aggregator", rating: 5, date: "2024-03-05", content: "Amazing execution on a 10-property blanket rental loan. Underwritten with speed and clear criteria. Zero hassles.", tags: ["Portfolio Special", "Smooth Closing"] }
        ]
      },
      "Corevest": {
        founded: "2014",
        minLoanAmount: 500000,
        maxLoanAmount: 100000000,
        underwritingTime: "10-14 Days",
        originationFee: "1.0% - 2.0%",
        geographicCoverage: {
          type: "National",
          states: ["AK", "AL", "AR", "CA", "CO", "FL", "GA", "IL", "IN", "TX", "WA", "NY"],
          mapRegions: "Nationwide Core Metros"
        },
        programs: [
          { name: "Bridge Funding", maxLTV: 75, maxLTC: 80, rateRange: "7.50% - 9.00%", term: "12-36 Months", minFico: 620 },
          { name: "SFR Rental Portfolios", maxLTV: 75, maxLTC: 0, rateRange: "6.50% - 7.99%", term: "5-10 Years", minFico: 640 },
          { name: "Build-To-Rent Construction", maxLTV: 70, maxLTC: 85, rateRange: "8.99% - 11.00%", term: "24-36 Months", minFico: 660 }
        ],
        reviews: [
          { author: "Arthur Pendelton", role: "BTR Developer", rating: 5, date: "2024-02-22", content: "Undisputed heavyweights for single-family rental portfolio lending. Locked in deep institutional capital on our build-to-rent project.", tags: ["BTR Specialists", "Scale Power"] }
        ]
      },
      "Charleston Private Lending": {
        founded: "2018",
        minLoanAmount: 75000,
        maxLoanAmount: 2000000,
        underwritingTime: "3-5 Days",
        originationFee: "1.5% - 2.5%",
        geographicCoverage: {
          type: "Local Hub Coverage",
          states: ["SC", "NC", "GA"],
          mapRegions: "Coastal Carolinas, Lowcountry, Savannah Area"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 80, maxLTC: 90, rateRange: "9.00% - 11.50%", term: "12 Months", minFico: 580 },
          { name: "Coastal Bridge", maxLTV: 75, maxLTC: 80, rateRange: "8.50% - 10.00%", term: "12-24 Months", minFico: 600 }
        ],
        reviews: [
          { author: "Garrett Cole", role: "Lowcountry Flippers LLC", rating: 5, date: "2024-01-30", content: "Extremely responsive local team. They knew the appraisal value of our historic downtown renovation instantly. No generic models.", tags: ["Local Experts", "High Precision"] }
        ]
      },
      "Texas Mortgage Place": {
        founded: "2009",
        minLoanAmount: 70000,
        maxLoanAmount: 400000,
        underwritingTime: "2-4 Days",
        originationFee: "2.0% - 3.0%",
        geographicCoverage: {
          type: "State Exclusive",
          states: ["TX"],
          mapRegions: "Dallas-Fort Worth Metroplex, Austin, San Antonio, Houston"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 80, maxLTC: 90, rateRange: "9.99% - 12.00%", term: "6-12 Months", minFico: 500 },
          { name: "Bridge Loans", maxLTV: 80, maxLTC: 85, rateRange: "9.50% - 11.00%", term: "12 Months", minFico: 500 }
        ],
        reviews: [
          { author: "Cody Henderson", role: "DFW Wholesaler", rating: 5, date: "2024-03-03", content: "Easiest closing in Texas. No FICO check, completely asset value driven. Closed our Garland property in 72 hours.", tags: ["Super Fast Close", "No FICO Check"] }
        ]
      },
      "Rental Home Financing": {
        founded: "2015",
        minLoanAmount: 75000,
        maxLoanAmount: 10000000,
        underwritingTime: "7-12 Days",
        originationFee: "1.5% - 2.0%",
        geographicCoverage: {
          type: "National",
          states: ["AL", "CA", "CT", "FL", "GA", "IL", "IN", "MN", "NC", "NJ", "NV", "NY", "OH", "OR", "PA", "SC", "TN", "TX", "VA", "WA", "WI", "UT"],
          mapRegions: "Midwest, Sunbelt, Coastal Hubs"
        },
        programs: [
          { name: "DSCR Long-Term Rental", maxLTV: 75, maxLTC: 0, rateRange: "6.50% - 8.50%", term: "30 Years", minFico: 620 },
          { name: "Portfolio Blanket Facility", maxLTV: 75, maxLTC: 80, rateRange: "6.99% - 8.75%", term: "5-10 Years", minFico: 620 }
        ],
        reviews: [
          { author: "Annette Brody", role: "SFR Portfolio Owner", rating: 4, date: "2024-01-18", content: "Great rates for experienced landlords. Consolidated 14 separate properties into a single blanket mortgage. Saved us thousands monthly.", tags: ["DSCR Kings", "Tax Optimized"] }
        ]
      },
      "Bridge Well Capital": {
        founded: "2008",
        minLoanAmount: 75000,
        maxLoanAmount: 5000000,
        underwritingTime: "5-7 Days",
        originationFee: "1.5% - 2.5%",
        geographicCoverage: {
          type: "National Reach",
          states: ["AK", "AL", "AR", "CO", "CT", "FL", "GA", "HI", "IL", "IN", "MI", "MO", "MS", "NJ", "NM", "NY", "OH", "OK", "TN", "TX", "VA", "WA", "WI"],
          mapRegions: "Mid-Atlantic, Southeast, Great Lakes, Northwest"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 85, maxLTC: 90, rateRange: "9.50% - 11.99%", term: "12-24 Months", minFico: 600 },
          { name: "Bridge Funding", maxLTV: 80, maxLTC: 80, rateRange: "8.99% - 10.50%", term: "12-36 Months", minFico: 600 }
        ],
        reviews: [
          { author: "Franklin Myers", role: "Rehab Operator", rating: 5, date: "2024-02-14", content: "Awesome draw administration. Always prompt, keeping our general contractors paid on time. Perfect partner for scaling flips.", tags: ["Prompt Draws", "Highly Scalable"] }
        ]
      },
      "Angel Oak Prime Bridge": {
        founded: "2011",
        minLoanAmount: 50000,
        maxLoanAmount: 3000000,
        underwritingTime: "7-10 Days",
        originationFee: "1.0% - 2.0%",
        geographicCoverage: {
          type: "Multi-State Regional",
          states: ["GA", "CO", "FL", "SC", "TN", "NC", "NJ", "IL", "TX", "MD", "OH", "VA", "PA", "IN", "MS"],
          mapRegions: "Midwest, Deep South, East Coast"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 80, maxLTC: 90, rateRange: "9.99% - 12.00%", term: "12-18 Months", minFico: 560 },
          { name: "Bridge Funding", maxLTV: 75, maxLTC: 80, rateRange: "9.25% - 10.99%", term: "12-36 Months", minFico: 560 },
          { name: "New Ground-Up Construction", maxLTV: 70, maxLTC: 85, rateRange: "10.50% - 12.50%", term: "18-24 Months", minFico: 620 }
        ],
        reviews: [
          { author: "Vivian Ward", role: "Ground-up Builder", rating: 5, date: "2024-02-25", content: "Angel Oak has been crucial for our custom residential builds in Atlanta. Competitive rates and solid leverage matrix.", tags: ["Construction Pros"] }
        ]
      },
      "Manhattan Bridge Capital": {
        founded: "2007",
        minLoanAmount: 100000,
        maxLoanAmount: 2000000,
        underwritingTime: "3-5 Days",
        originationFee: "2.0% - 3.0%",
        geographicCoverage: {
          type: "Local Metro Specialized",
          states: ["NY", "NJ", "CT", "FL"],
          mapRegions: "New York Tri-State Area, South Florida Coast"
        },
        programs: [
          { name: "Bridge Funding", maxLTV: 65, maxLTC: 80, rateRange: "8.50% - 10.50%", term: "12 Months", minFico: 600 },
          { name: "Fix and Flip", maxLTV: 65, maxLTC: 85, rateRange: "8.99% - 11.00%", term: "12 Months", minFico: 600 },
          { name: "Ground-Up Construction", maxLTV: 60, maxLTC: 75, rateRange: "9.50% - 11.50%", term: "12-24 Months", minFico: 620 }
        ],
        reviews: [
          { author: "Louie G.", role: "Brooklyn Developer", rating: 5, date: "2024-03-02", content: "NYC is complex and speed is everything. Manhattan Bridge closed our building deal in Queens within 4 days. Absolutely bulletproof execution.", tags: ["Tri-State Heavyweights", "No Red Tape"] }
        ]
      },
      "The Norris Group": {
        founded: "1997",
        minLoanAmount: 100000,
        maxLoanAmount: 5000000,
        underwritingTime: "5-7 Days",
        originationFee: "1.5% - 2.5%",
        geographicCoverage: {
          type: "State Targeted",
          states: ["CA", "FL"],
          mapRegions: "Southern California, Central Florida Metro"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 75, maxLTC: 85, rateRange: "8.99% - 10.75%", term: "12 Months", minFico: 550 },
          { name: "Rental Properties", maxLTV: 70, maxLTC: 75, rateRange: "7.99% - 9.50%", term: "30 Years", minFico: 580 },
          { name: "Ground-Up Builder Program", maxLTV: 70, maxLTC: 80, rateRange: "9.25% - 11.00%", term: "18-24 Months", minFico: 620 }
        ],
        reviews: [
          { author: "Gary Patterson", role: "Inland Empire Rehabber", rating: 5, date: "2024-01-28", content: "Legends of California private lending. Bruce Norris and team know how to navigate market shifts. Outstanding educational resources as well.", tags: ["Legacy Lender", "Flawless Rep"] }
        ]
      },
      "Tidal Loans": {
        founded: "2018",
        minLoanAmount: 50000,
        maxLoanAmount: 3000000,
        underwritingTime: "4-6 Days",
        originationFee: "1.5% - 2.5%",
        geographicCoverage: {
          type: "State Targeted",
          states: ["TX"],
          mapRegions: "Houston Coastal, Austin Central, San Antonio Hills"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 70, maxLTC: 100, rateRange: "9.99% - 11.99%", term: "12 Months", minFico: 600 },
          { name: "Bridge Funding", maxLTV: 75, maxLTC: 80, rateRange: "9.25% - 11.50%", term: "12 Months", minFico: 580 },
          { name: "New Ground-Up", maxLTV: 70, maxLTC: 85, rateRange: "10.50% - 12.00%", term: "12-18 Months", minFico: 620 }
        ],
        reviews: [
          { author: "Estevan Garza", role: "San Antonio Builder", rating: 5, date: "2024-02-18", content: "100% construction cost financing parameter is true! Accelerated our pipeline tremendously. Draws are handled through simple digital portals.", tags: ["100% Rehab Funding", "Fast Draw Approval"] }
        ]
      }
    },

    // Generates high-fidelity default values for any missing entries
    getExtendedProfile(lenderName) {
      if (this.extendedData[lenderName]) {
        return this.extendedData[lenderName];
      }
      // Sophisticated Fallback Object
      return {
        founded: "2015",
        minLoanAmount: 100000,
        maxLoanAmount: 10000000,
        underwritingTime: "5-7 Days",
        originationFee: "1.5% - 2.5%",
        geographicCoverage: {
          type: "Multi-State Focus",
          states: ["TX", "CA", "FL", "GA"],
          mapRegions: "High Demand Investment Zones"
        },
        programs: [
          { name: "Fix and Flip", maxLTV: 75, maxLTC: 85, rateRange: "8.99% - 11.50%", term: "12 Months", minFico: 600 },
          { name: "Bridge Loans", maxLTV: 75, maxLTC: 80, rateRange: "8.50% - 10.00%", term: "12-36 Months", minFico: 600 }
        ],
        reviews: [
          { author: "Investor Anonymous", role: "Private Capital Client", rating: 5, date: "2024-01-10", content: "Very solid execution. Receptive to non-traditional assets.", tags: ["Fast Execution"] }
        ]
      };
    }
  });

  // Dynamic Controller to coordinate Profile Views, Aggregate Reviews, and validation flows
  window.lenderProfileComponent = function() {
    return {
      activeTab: 'programs', // 'programs' | 'coverage' | 'reviews' | 'inquiry'
      profile: null,
      lender: null,
      reviewsList: [],
      avgRating: 4.8,
      ratingMetrics: {5: 0, 4: 0, 3: 0, 2: 0, 1: 0},
      
      // Interactive Messaging State Machine
      inquiry: {
        borrowerName: '',
        borrowerEmail: '',
        borrowerPhone: '',
        loanAmount: '',
        propertyAddress: '',
        loanType: 'Fix and Flip',
        estimatedLTV: 75,
        messageText: '',
        submitted: false,
        status: 'draft', // 'draft' | 'validating' | 'hashing' | 'delivered'
        statusMessage: 'Ready to dispatch to underwriting desk.'
      },

      // Interactive Review Submission State
      newReview: {
        author: '',
        role: 'Real Estate Investor',
        rating: 5,
        content: '',
        tagInput: '',
        submitting: false
      },

      // Initializes profile panel when user clicks card
      initializeProfile(lenderData) {
        this.lender = lenderData;
        this.profile = Alpine.store('lenderProfiles').getExtendedProfile(lenderData.Lender);
        this.reviewsList = [...this.profile.reviews];
        this.recalculateRatings();
        
        // Setup initial inquiry message
        this.inquiry.propertyAddress = lenderData.City ? `${lenderData.City}, ${lenderData.State}` : '';
        this.inquiry.submitted = false;
        this.inquiry.status = 'draft';
        this.inquiry.statusMessage = 'Secure institutional pipeline connection established.';
        this.activeTab = 'programs';
      },

      // Re-aggregates ratings dynamically to feed visual analytics
      recalculateRatings() {
        if (this.reviewsList.length === 0) {
          this.avgRating = 5.0;
          this.ratingMetrics = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
          return;
        }
        let total = 0;
        let counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
        this.reviewsList.forEach(r => {
          total += r.rating;
          if (counts[r.rating] !== undefined) {
            counts[r.rating]++;
          }
        });
        this.avgRating = parseFloat((total / this.reviewsList.length).toFixed(1));
        this.ratingMetrics = counts;
      },

      // Submits message and simulates professional underwriting dispatch pipeline
      sendInquiry() {
        if (!this.inquiry.borrowerName || !this.inquiry.borrowerEmail || !this.inquiry.loanAmount) {
          alert("Please complete all required fields (Name, Email, and Target Loan Amount) to request underwriting metrics.");
          return;
        }

        this.inquiry.submitted = true;
        this.inquiry.status = 'validating';
        this.inquiry.statusMessage = 'Encrypting secure transaction logs & checking pipeline capacity...';

        // Step-by-Step Simulated Submission Experience
        setTimeout(() => {
          this.inquiry.status = 'hashing';
          this.inquiry.statusMessage = `Formulating term matrix algorithms for ${this.inquiry.loanType} program...`;
        }, 1200);

        setTimeout(() => {
          this.inquiry.status = 'delivered';
          this.inquiry.statusMessage = `Dispatched successfully to ${this.lender.Lender}'s private underwriting portal. Transaction Route Secured.`;
          
          // Inject an dynamic entry to query logs
          if (typeof window.lenderDirectory === 'function') {
            const controller = document.querySelector('[x-data="lenderDirectory()"]');
            if (controller && controller.__x) {
              controller.__x.$data.addAuditLog(
                `Direct Loan Route established`, 
                `Requested $${parseFloat(this.inquiry.loanAmount).toLocaleString()} for ${this.lender.Lender}`
              );
            }
          }
        }, 2800);
      },

      // Resets dynamic messaging panel
      resetInquiry() {
        this.inquiry.borrowerName = '';
        this.inquiry.borrowerEmail = '';
        this.inquiry.borrowerPhone = '';
        this.inquiry.loanAmount = '';
        this.inquiry.propertyAddress = '';
        this.inquiry.messageText = '';
        this.inquiry.submitted = false;
        this.inquiry.status = 'draft';
        this.inquiry.statusMessage = 'Ready to dispatch to underwriting desk.';
      },

      // Injects custom review inside client instance state
      submitReview() {
        if (!this.newReview.author || !this.newReview.content) {
          alert("Please input your Name/Entity and Review description.");
          return;
        }
        this.newReview.submitting = true;

        setTimeout(() => {
          const splitTags = this.newReview.tagInput 
            ? this.newReview.tagInput.split(',').map(t => t.trim()).filter(Boolean) 
            : ["Verified Close"];

          const completeReview = {
            author: this.newReview.author,
            role: this.newReview.role || "Independent Developer",
            rating: parseInt(this.newReview.rating),
            date: new Date().toISOString().split('T')[0],
            content: this.newReview.content,
            tags: splitTags
          };

          this.reviewsList.unshift(completeReview);
          this.recalculateRatings();

          // Reset Submission Inputs
          this.newReview.author = '';
          this.newReview.content = '';
          this.newReview.tagInput = '';
          this.newReview.submitting = false;

          // Push feedback to base component's dynamic logs if reachable
          const rootElement = document.querySelector('[x-data="lenderDirectory()"]');
          if (rootElement && rootElement.__x) {
            rootElement.__x.$data.addAuditLog(
              `New review filed for ${this.lender.Lender}`, 
              `Assigned score: ${completeReview.rating} Stars by ${completeReview.author}`
            );
          }
        }, 600);
      }
    };
  };

  // Automated injection to intercept Base Component Drawer View to mount high-fidelity layout
  // Locates profile slide drawer container dynamically
  const drawerObserver = new MutationObserver(() => {
    const drawerContainer = document.querySelector('.pointer-events-auto.w-screen.max-w-xl');
    if (drawerContainer && !drawerContainer.hasAttribute('data-enhanced')) {
      drawerContainer.setAttribute('data-enhanced', 'true');
      
      // Upgrade Drawer container structural UI to integrate interactive dynamic tab systems
      drawerContainer.setAttribute('x-data', 'lenderProfileComponent()');
      drawerContainer.setAttribute('x-effect', 'if (selectedLender) { initializeProfile(selectedLender) }');

      // Inject advanced tab structure right above program specs snapshot matrix inside the base layout
      const searchAnchor = drawerContainer.querySelector('.grid.grid-cols-2.gap-4');
      if (searchAnchor) {
        // Create tab navigation element
        const tabNav = document.createElement('div');
        tabNav.className = "flex border-b border-gray-800/80 mb-6 space-x-2 text-xs font-semibold uppercase tracking-wider";
        tabNav.innerHTML = `
          <button @click="activeTab = 'programs'" :class="activeTab === 'programs' ? 'text-brand-400 border-b-2 border-brand-500 pb-2' : 'text-gray-400 hover:text-white pb-2 transition'" class="px-2">Programs & Terms</button>
          <button @click="activeTab = 'coverage'" :class="activeTab === 'coverage' ? 'text-brand-400 border-b-2 border-brand-500 pb-2' : 'text-gray-400 hover:text-white pb-2 transition'" class="px-2">Coverage Map</button>
          <button @click="activeTab = 'reviews'" :class="activeTab === 'reviews' ? 'text-brand-400 border-b-2 border-brand-500 pb-2' : 'text-gray-400 hover:text-white pb-2 transition'" class="px-2">Reviews (<span x-text="reviewsList.length"></span>)</button>
          <button @click="activeTab = 'inquiry'" :class="activeTab === 'inquiry' ? 'text-brand-400 border-b-2 border-brand-500 pb-2 bg-brand-500/10 rounded-t-lg px-2' : 'text-emerald-400 hover:text-emerald-300 pb-2 transition'" class="px-2">Direct Message</button>
        `;
        searchAnchor.parentNode.insertBefore(tabNav, searchAnchor);

        // Render Programs Tab Content wrapping original blocks
        const targetWrapper = document.createElement('div');
        targetWrapper.setAttribute('x-show', "activeTab === 'programs'");
        targetWrapper.className = "space-y-6";

        // Wrap current fields (snapshot metrics and descriptions) within the Programs wrapper
        const overviewDiv = drawerContainer.querySelector('.space-y-3');
        if (overviewDiv) {
          // Reposition core elements into activeTab context
          searchAnchor.parentNode.insertBefore(targetWrapper, searchAnchor);
          targetWrapper.appendChild(searchAnchor);
          targetWrapper.appendChild(overviewDiv);

          // Append institutional program terms detail sheets inside programs wrapper
          const termsTable = document.createElement('div');
          termsTable.className = "pt-4 border-t border-gray-800/40";
          termsTable.innerHTML = `
            <h4 class="text-xs uppercase tracking-widest text-brand-400 font-bold mb-3">Underwriting Criteria</h4>
            <div class="space-y-3">
              <template x-for="prog in profile?.programs" :key="prog.name">
                <div class="bg-gray-950/80 p-4 rounded-xl border border-gray-900 flex justify-between items-center">
                  <div>
                    <span class="text-sm font-bold text-white block" x-text="prog.name"></span>
                    <span class="text-[10px] text-gray-500 uppercase">Min FICO: <span class="text-gray-300 font-semibold" x-text="prog.minFico"></span></span>
                  </div>
                  <div class="text-right text-xs">
                    <span class="text-emerald-400 font-bold block" x-text="prog.rateRange"></span>
                    <span class="text-gray-400" x-text="'Up to ' + prog.maxLTV + '% LTV'"></span>
                  </div>
                </div>
              </template>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-3 text-[11px] text-gray-400 bg-gray-900/30 p-3 rounded-lg border border-gray-800/40">
              <div>Est. Closing Speed: <span class="text-white font-semibold" x-text="profile?.underwritingTime"></span></div>
              <div>Origination Fees: <span class="text-white font-semibold" x-text="profile?.originationFee"></span></div>
              <div>Origination Base: <span class="text-white font-semibold" x-text="'Est. ' + profile?.founded"></span></div>
              <div>Underwriting Model: <span class="text-emerald-400 font-semibold">Asset Value Focus</span></div>
            </div>
          `;
          targetWrapper.appendChild(termsTable);
        }

        // Render Interactive Geographic Coverage Tab
        const coverageTab = document.createElement('div');
        coverageTab.setAttribute('x-show', "activeTab === 'coverage'");
        coverageTab.className = "space-y-6";
        coverageTab.innerHTML = `
          <div class="space-y-4">
            <h4 class="text-xs uppercase tracking-widest text-brand-400 font-bold">Geographic Target Zone</h4>
            <div class="p-5 bg-gray-900/40 rounded-2xl border border-gray-800/50 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg font-bold text-white block" x-text="profile?.geographicCoverage.type"></span>
                  <span class="text-xs text-gray-400" x-text="profile?.geographicCoverage.mapRegions"></span>
                </div>
                <div class="px-3 py-1 bg-brand-500/10 text-brand-300 text-xs font-bold rounded-full uppercase border border-brand-500/20">
                  <span x-text="profile?.geographicCoverage.states.length + ' Active States'"></span>
                </div>
              </div>

              <!-- Simulative Map Grid Matrix -->
              <div>
                <span class="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-2">Simulated Coverage Mesh Grid</span>
                <div class="grid grid-cols-8 gap-1 p-3 bg-gray-950 rounded-xl border border-gray-900">
                  <template x-for="stateCode in ['CA', 'TX', 'FL', 'NY', 'IL', 'GA', 'NC', 'OH', 'PA', 'AZ', 'CO', 'NJ', 'WA', 'MN', 'SC', 'NV']">
                    <div class="h-10 flex items-center justify-center rounded text-[11px] font-extrabold uppercase transition"
                         :class="profile?.geographicCoverage.states.includes(stateCode) ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 shadow' : 'bg-gray-900/40 text-gray-700 border border-gray-900/60'">
                      <span x-text="stateCode"></span>
                    </div>
                  </template>
                </div>
                <span class="text-[9px] text-gray-500 italic mt-1.5 block">Highlighted boxes indicate established regional capital channels.</span>
              </div>
            </div>
          </div>
        `;
        searchAnchor.parentNode.insertBefore(coverageTab, searchAnchor.nextSibling);

        // Render Dynamic Reviews Integration & Aggregation Tab
        const reviewsTab = document.createElement('div');
        reviewsTab.setAttribute('x-show', "activeTab === 'reviews'");
        reviewsTab.className = "space-y-6";
        reviewsTab.innerHTML = `
          <!-- Review Analytics Header -->
          <div class="p-6 bg-gray-950 rounded-3xl border border-gray-900 flex items-center justify-between">
            <div>
              <div class="text-4xl font-extrabold text-white tracking-tight flex items-baseline space-x-1">
                <span x-text="avgRating"></span>
                <span class="text-xs text-gray-500 font-medium">/ 5.0</span>
              </div>
              <p class="text-xs text-gray-400 mt-1 uppercase tracking-wider" x-text="reviewsList.length + ' Borrower Reviews'"></p>
            </div>
            
            <!-- Rating bar visualizations -->
            <div class="flex-1 max-w-[200px] ml-6 space-y-1 text-[10px] text-gray-400">
              <template x-for="stars in [5,4,3,2,1]" :key="stars">
                <div class="flex items-center space-x-2">
                  <span x-text="stars + '★'" class="w-4"></span>
                  <div class="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div class="h-full bg-brand-500 rounded-full" :style="'width: ' + ((ratingMetrics[stars] || 0) / (reviewsList.length || 1) * 100) + '%'"></div>
                  </div>
                  <span x-text="ratingMetrics[stars] || 0" class="w-3 text-right"></span>
                </div>
              </template>
            </div>
          </div>

          <!-- Active Reviews Stack -->
          <div class="space-y-4 max-h-96 overflow-y-auto pr-1">
            <template x-for="(rev, idx) in reviewsList" :key="idx">
              <div class="p-4 bg-gray-900/40 rounded-2xl border border-gray-800/50 space-y-2">
                <div class="flex justify-between items-start">
                  <div>
                    <h5 class="text-sm font-bold text-white" x-text="rev.author"></h5>
                    <span class="text-[10px] text-gray-500" x-text="rev.role + ' • ' + rev.date"></span>
                  </div>
                  <div class="flex items-center space-x-1 text-xs text-amber-400">
                    <span class="font-bold" x-text="rev.rating + '.0'"></span>
                    <span>★</span>
                  </div>
                </div>
                <p class="text-xs text-gray-300 leading-relaxed" x-text="rev.content"></p>
                
                <!-- Verification and feature badges -->
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <template x-for="tag in rev.tags" :key="tag">
                    <span class="text-[9px] bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded border border-brand-500/15" x-text="tag"></span>
                  </template>
                </div>
              </div>
            </template>
          </div>

          <!-- Add Borrower Review Form -->
          <div class="p-6 bg-gray-950 rounded-2xl border border-gray-900/80 space-y-4">
            <h4 class="text-xs uppercase tracking-widest text-brand-400 font-bold">Write a Review</h4>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Your Name</label>
                  <input type="text" x-model="newReview.author" placeholder="Entity or Name" class="w-full text-xs px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
                </div>
                <div>
                  <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Star Rating</label>
                  <select x-model="newReview.rating" class="w-full text-xs px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Fair)</option>
                    <option value="1">1 Star (Poor)</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Experience Review</label>
                <textarea x-model="newReview.content" rows="3" placeholder="Describe the loan parameters, draw speed, and closing execution..." class="w-full text-xs px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500"></textarea>
              </div>
              <div>
                <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Tags (Comma separated)</label>
                <input type="text" x-model="newReview.tagInput" placeholder="Fast Close, Fast Draws, High Leverage" class="w-full text-xs px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
              </div>
              <button @click="submitReview()" class="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase rounded-xl transition">Submit Client Review</button>
            </div>
          </div>
        `;
        searchAnchor.parentNode.insertBefore(reviewsTab, searchAnchor.nextSibling);

        // Render Direct Underwriter Message Inquiry Pipeline Tab
        const inquiryTab = document.createElement('div');
        inquiryTab.setAttribute('x-show', "activeTab === 'inquiry'");
        inquiryTab.className = "space-y-6";
        inquiryTab.innerHTML = `
          <div class="space-y-4">
            <h4 class="text-xs uppercase tracking-widest text-emerald-400 font-bold">Secure Capital Dispatch Form</h4>
            <p class="text-xs text-gray-400">Inquire directly into this lender's pipeline. Responses are usually routed back under 12 hours.</p>

            <template x-if="!inquiry.submitted">
              <div class="space-y-4 bg-gray-950 p-6 rounded-3xl border border-gray-900">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Full Name *</label>
                    <input type="text" x-model="inquiry.borrowerName" placeholder="Enter Full Name" class="w-full text-xs px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
                  </div>
                  <div>
                    <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Email Address *</label>
                    <input type="email" x-model="inquiry.borrowerEmail" placeholder="name@domain.com" class="w-full text-xs px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Phone Number</label>
                    <input type="text" x-model="inquiry.borrowerPhone" placeholder="(555) 000-0000" class="w-full text-xs px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
                  </div>
                  <div>
                    <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Desired Capital *</label>
                    <input type="number" x-model="inquiry.loanAmount" placeholder="e.g. 850000" class="w-full text-xs px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Asset Class Location</label>
                    <input type="text" x-model="inquiry.propertyAddress" placeholder="City, State" class="w-full text-xs px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
                  </div>
                  <div>
                    <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Target Strategy</label>
                    <select x-model="inquiry.loanType" class="w-full text-xs px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500">
                      <option value="Fix and Flip">Fix & Flip Financing</option>
                      <option value="Bridge Loan">Bridge Financing</option>
                      <option value="DSCR Rental">Long Term DSCR</option>
                      <option value="Ground-Up Construction">Ground-Up Construction</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1 flex justify-between">
                    <span>Target Leverage Ratio</span>
                    <span class="text-brand-400 font-bold" x-text="inquiry.estimatedLTV + '%'"></span>
                  </label>
                  <input type="range" min="50" max="95" step="5" x-model="inquiry.estimatedLTV" class="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-500">
                </div>

                <div>
                  <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Brief Deal Parameters Description</label>
                  <textarea x-model="inquiry.messageText" rows="3" placeholder="Explain the purchase price, rehab requirements, and strategy execution speed..." class="w-full text-xs px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-brand-500"></textarea>
                </div>

                <button @click="sendInquiry()" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase rounded-xl transition duration-150 shadow-md shadow-emerald-600/20">
                  Establish Underwriter Pipeline
                </button>
              </div>
            </template>

            <!-- Submission Loading State Pipeline HUD -->
            <template x-if="inquiry.submitted">
              <div class="p-6 bg-gray-950 rounded-3xl border border-gray-900/60 text-center space-y-6">
                <!-- Visual active loop status badge -->
                <div class="mx-auto w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center relative">
                  <span class="absolute w-3 h-3 rounded-full bg-emerald-400 animate-ping" x-show="inquiry.status !== 'delivered'"></span>
                  <svg x-show="inquiry.status === 'delivered'" class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <svg x-show="inquiry.status !== 'delivered'" class="w-6 h-6 text-brand-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>

                <div>
                  <h5 class="text-sm font-bold uppercase tracking-widest text-gray-300">Underwriting Pipeline Connection</h5>
                  <p class="text-xs text-brand-400 mt-2 font-mono" x-text="inquiry.statusMessage"></p>
                </div>

                <!-- Live progress steps tracker -->
                <div class="grid grid-cols-3 gap-2 text-[9px] uppercase tracking-wider font-bold">
                  <div class="p-2 rounded" :class="inquiry.status === 'validating' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'bg-gray-900/40 text-gray-500'">1. Validation</div>
                  <div class="p-2 rounded" :class="inquiry.status === 'hashing' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'bg-gray-900/40 text-gray-500'">2. Term Routing</div>
                  <div class="p-2 rounded" :class="inquiry.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-900/40 text-gray-500'">3. Delivered</div>
                </div>

                <div class="pt-4 border-t border-gray-900">
                  <button @click="resetInquiry()" class="text-xs text-gray-400 hover:text-white transition font-semibold underline">Submit Another Capital Inquiry</button>
                </div>
              </div>
            </template>
          </div>
        `;
        searchAnchor.parentNode.insertBefore(inquiryTab, searchAnchor.nextSibling);

        // Hide structural elements representing direct call buttons by converting into actions on bottom of form
        const callActionPanel = drawerContainer.querySelector('.space-y-4.pt-4.border-t');
        if (callActionPanel) {
          callActionPanel.classList.add('hidden'); // hidden to replace with integrated Tab system
        }
      }
    }
  });

  // Begin monitoring DOM for slide drawer mount events
  drawerObserver.observe(document.body, { childList: true, subtree: true });
});
