document.addEventListener("DOMContentLoaded", () => {
      // Set current year dynamically
      document.getElementById('current-year').textContent = new Date().getFullYear();

      // FAQ ACCORDION LOGIC
      const faqTriggers = document.querySelectorAll('.faq-trigger');
      
      faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.parentElement;
          const content = item.querySelector('.faq-content');
          const isActive = item.classList.contains('active');

          // Close all FAQ items
          document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
            i.querySelector('.faq-content').style.maxHeight = null;
          });

          // Toggle current
          if (!isActive) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      });

      // CHECKLIST WIDGET PROGRESS TRACKER
      const checkboxes = document.querySelectorAll('.checklist-cb');
      const progressBar = document.getElementById('checklist-progress-bar');
      const progressText = document.getElementById('checklist-progress-text');

      function updateChecklistProgress() {
        let score = 0;
        let checkedCount = 0;
        checkboxes.forEach(cb => {
          if(cb.checked) {
            score += parseInt(cb.getAttribute('data-weight'));
            checkedCount++;
          }
        });
        
        progressBar.style.width = score + '%';
        progressText.textContent = `${score}% Prepared`;

        // Interactive visual feedback based on milestone reached
        if(score === 100) {
          progressBar.style.backgroundColor = 'var(--electric-green)';
          showToast("Document package 100% prepared for filing!");
        } else if(score >= 50) {
          progressBar.style.backgroundColor = 'var(--signal-orange)';
        } else {
          progressBar.style.backgroundColor = 'var(--cobalt-blue)';
        }
      }

      checkboxes.forEach(cb => {
        cb.addEventListener('change', updateChecklistProgress);
      });

      // Local storage support to remember user checklist preferences
      checkboxes.forEach((cb, idx) => {
        const key = `moonshine_chk_[slug]_${idx}`;
        if(localStorage.getItem(key) === 'true') {
          cb.checked = true;
        }
        cb.addEventListener('change', () => {
          localStorage.setItem(key, cb.checked);
        });
      });
      updateChecklistProgress(); // Initial run
    });

    // SHARE HUBS - COPY PARTNER LINK TO CLIPBOARD
    function copyPartnerLink() {
      const dummyUrl = window.location.href;
      navigator.clipboard.writeText(dummyUrl).then(() => {
        showToast("Hub URL copied to clipboard!");
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }

    // CUSTOM TOAST NOTIFICATION UTILITY
    function showToast(message) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toast-message');
      toastMsg.textContent = message;
      toast.classList.add('active');
      
      setTimeout(() => {
        toast.classList.remove('active');
      }, 3000);
    }

    // INTERACTIVE ROUTE MATCHER WIDGET LOGIC
    let matcherData = {
      volume: '',
      objective: ''
    };

    function nextMatcherStep(step, val) {
      if (step === 1) {
        matcherData.volume = val;
        document.getElementById('step-1').classList.remove('active');
        if (val === 'under-15k') {
          document.getElementById('step-2-under').classList.add('active');
        } else {
          document.getElementById('step-2-over').classList.add('active');
        }
      }
    }

    function showMatcherResult(route) {
      // Hide step 2 variants
      document.getElementById('step-2-under').classList.remove('active');
      document.getElementById('step-2-over').classList.remove('active');

      const resultBox = document.getElementById('matcher-result');
      const resTitle = document.getElementById('res-title');
      const resDesc = document.getElementById('res-desc');

      resultBox.style.display = 'block';

      if (route === 'credit-equipment') {
        resTitle.textContent = "Optimal Path: Equipment Lease & Credit Prep";
        resDesc.textContent = "Your asset focus maps best directly to Equipment leasing structures, supplemented by operational credit line building.";
      } else if (route === 'credit-prep') {
        resTitle.textContent = "Optimal Path: Business Credit Prep Program";
        resDesc.textContent = "To match classic working capital lines, building a bulletproof Experian/D&B business file is your next best step.";
      } else if (route === 'rev-capital') {
        resTitle.textContent = "Optimal Path: Revenue-Based Capital Channel";
        resDesc.textContent = "With healthy daily ledgers, you are positioned for rapid liquidity advances without high asset collateral requirements.";
      } else if (route === 'term-facilities') {
        resTitle.textContent = "Optimal Path: Structured Institutional Facility";
        resDesc.textContent = "Strong operations match long-term lower APR structures. Ideal for systematic real estate or enterprise expansion programs.";
      }

      showToast("Matching Capital Route Locked!");
    }

    function resetMatcher() {
      document.getElementById('matcher-result').style.display = 'none';
      document.getElementById('step-2-under').classList.remove('active');
      document.getElementById('step-2-over').classList.remove('active');
      document.getElementById('step-1').classList.add('active');
      matcherData = { volume: '', objective: '' };
    }