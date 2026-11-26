// State Tracking
    let userAffiliateId = "partner-demo";
    let completedSteps = [0]; // Step 0 completed by default

    // Real-time link generator updater
    function updateLinkPreview() {
      const inputVal = document.getElementById('affiliate-input').value.trim();
      const rawKey = inputVal.toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const previewEl = document.getElementById('live-link-preview');
      
      if (rawKey.length > 0) {
        userAffiliateId = rawKey;
        previewEl.innerText = 'https://moonshine.capital/?ref=' + rawKey;
      } else {
        previewEl.innerText = 'https://moonshine.capital/?ref=[YOUR_KEY]';
      }
    }

    // Tab Switcher for Step 2
    function switchTab(btn, tabId) {
      // Deactivate all tab buttons inside parent block
      const tabContainer = btn.closest('.training-tabs-container');
      tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      
      // Deactivate all tab contents
      tabContainer.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      // Activate selected
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    }

    // Step Switching Controller
    function goToStep(stepNum) {
      // Hide all steps
      document.querySelectorAll('.step-section').forEach(sec => sec.classList.remove('active'));

      // Determine step section to show
      let targetSectionId = '';
      if (stepNum === 0) targetSectionId = 'step-welcome';
      else if (stepNum === 1) targetSectionId = 'step-affiliate-id';
      else if (stepNum === 2) targetSectionId = 'step-training';
      else if (stepNum === 3) targetSectionId = 'step-submit-lead';
      else if (stepNum === 4) targetSectionId = 'step-dashboard';

      // Mark the active section
      document.getElementById(targetSectionId).classList.add('active');

      // Update progress checklists in sidebar
      updateSidebarChecklist(stepNum);
      
      // Auto Scroll to top of content
      window.scrollTo(0, 0);
    }

    // Save step 1 data and proceed
    function saveAffiliateId() {
      const inputVal = document.getElementById('affiliate-input').value.trim();
      if (!inputVal) {
        alert("Please enter a custom affiliate key identifier before proceeding.");
        return;
      }
      
      userAffiliateId = inputVal.toLowerCase().replace(/[^a-z0-9-_]/g, '');
      markStepCompleted(1);
      goToStep(2);
    }

    // Submit pilot lead form
    function submitPilotLead() {
      const company = document.getElementById('lead-company').value.trim();
      const amount = document.getElementById('lead-amount').value.trim();
      const contact = document.getElementById('lead-contact').value.trim();
      const email = document.getElementById('lead-email').value.trim();

      if (!company || !amount || !contact || !email) {
        alert("Attention: All key fields require completion to map node pipeline metrics.");
        return;
      }

      // Update Dashboard live fields
      document.getElementById('dash-pipeline-sum').innerText = '$' + Number(amount.replace(/[^0-9]/g, '')).toLocaleString();
      document.getElementById('dash-live-url').value = 'https://moonshine.capital/?ref=' + userAffiliateId;
      
      // Update Table row details
      document.getElementById('table-lead-company').innerText = company;
      document.getElementById('table-lead-amount').innerText = '$' + Number(amount.replace(/[^0-9]/g, '')).toLocaleString();
      document.getElementById('table-lead-ref').innerText = userAffiliateId;

      markStepCompleted(3);
      markStepCompleted(4); // Dashboard unlocked
      goToStep(4);
    }

    // Visual helper checklist
    function markStepCompleted(step) {
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }
    }

    function updateSidebarChecklist(activeStep) {
      // Reset classes
      for (let i = 0; i <= 4; i++) {
        const item = document.getElementById('chk-' + i);
        if (!item) continue;
        
        item.classList.remove('completed', 'active');
        
        if (completedSteps.includes(i)) {
          item.classList.add('completed');
        }
        
        if (i === activeStep) {
          item.classList.add('active');
        }
      }
    }

    // Copy live asset function
    function copyLink() {
      const linkEl = document.getElementById('dash-live-url');
      linkEl.select();
      linkEl.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(linkEl.value);
      alert("Asset Copied directly to Clipboard: " + linkEl.value);
    }

    // Send mock chat
    function sendMockChat() {
      const input = document.getElementById('chat-msg');
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      
      // Append quick confirmation from agent
      setTimeout(() => {
        alert("TELEMETRY CONFIRMED:\nYour query has been queued for immediate review. An agent will contact you shortly.");
      }, 500);
    }