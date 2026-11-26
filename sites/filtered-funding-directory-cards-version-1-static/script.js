// Initialize Circular Progress Bars/Dials
    document.addEventListener("DOMContentLoaded", function () {
      animateGauges();
      logToConsole("All dynamic SVG dials populated successfully. Precision tracking targets compiled.");
    });

    function animateGauges() {
      const fills = document.querySelectorAll(".gauge-fill");
      fills.forEach(fill => {
        const percent = fill.getAttribute("data-percent");
        // Calculate strokeDashoffset based on percentage (circumference = 220)
        const offset = 220 - (220 * percent) / 100;
        fill.style.strokeDashoffset = offset;
      });
    }

    // Dynamic Filter Chips Logic
    const filterChips = document.querySelectorAll(".filter-chip");
    const cards = document.querySelectorAll(".path-card");
    const visibleCounter = document.getElementById("visible-count");

    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        // Toggle Active State
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        const categoryFilter = chip.getAttribute("data-filter");
        let matchedCount = 0;

        cards.forEach(card => {
          const cardCategory = card.getAttribute("data-category");
          if (categoryFilter === "all" || cardCategory === categoryFilter) {
            card.style.display = "flex";
            matchedCount++;
          } else {
            card.style.display = "none";
          }
        });

        visibleCounter.textContent = matchedCount;
        logToConsole(`Filter Applied: <span class="cyan">${categoryFilter.toUpperCase()}</span>. Matches discovered: ${matchedCount}.`);
      });
    });

    // Interactive Checklist Toggle logic (Changes Fit Quality Metrics dynamically!)
    function toggleChecklist(itemElement) {
      itemElement.classList.toggle("checked");
      
      const listContainer = itemElement.parentElement;
      const cardId = listContainer.getAttribute("data-card-id");
      const totalItems = listContainer.querySelectorAll(".checklist-item").length;
      const checkedItems = listContainer.querySelectorAll(".checklist-item.checked").length;
      
      // Compute score calculation based on checklist items checked
      const fitScore = Math.round((checkedItems / totalItems) * 100);
      const scoreBadge = document.getElementById(`score-${cardId}`);
      
      scoreBadge.textContent = `${fitScore}% Fit`;
      
      if (fitScore < 50) {
        scoreBadge.style.color = "var(--accent-orange)";
        scoreBadge.style.borderColor = "var(--accent-orange)";
        scoreBadge.style.background = "rgba(255, 94, 0, 0.1)";
      } else if (fitScore < 100) {
        scoreBadge.style.color = "var(--cyan-neon)";
        scoreBadge.style.borderColor = "var(--cyan-neon)";
        scoreBadge.style.background = "rgba(0, 240, 255, 0.1)";
      } else {
        scoreBadge.style.color = "var(--green-neon)";
        scoreBadge.style.borderColor = "var(--green-neon)";
        scoreBadge.style.background = "rgba(57, 255, 20, 0.1)";
      }

      logToConsole(`Compliance checklist updated for <span class="accent">PATH_ID // ${cardId}</span>. Match performance modified to: <span class="success">${fitScore}%</span>.`);
    }

    // Interactive CTA Action & UTM Compiler Engine
    function triggerGetFunded(buttonElement) {
      // Fetch Custom override values
      const overSource = document.getElementById("utm_source_input").value || "partner_edge";
      const overMedium = document.getElementById("utm_medium_input").value || "portal_card";
      const overCampaign = document.getElementById("utm_campaign_input").value || "q3_acceleration";

      // Card-specific variables
      const baseCampaignAttr = buttonElement.closest(".path-card").getAttribute("data-base-campaign");
      const partnerBaseUrl = buttonElement.getAttribute("data-partner-url");
      const partnerChannel = buttonElement.getAttribute("data-partner-channel");

      // Compile final URL with dynamic components and secure handshakes
      const timestamp = Date.now();
      const compiledUrl = `${partnerBaseUrl}?utm_source=${encodeURIComponent(overSource)}&utm_medium=${encodeURIComponent(overMedium)}&utm_campaign=${encodeURIComponent(baseCampaignAttr + "_" + overCampaign)}&partner_channel=${encodeURIComponent(partnerChannel)}&tracking_id=e_${timestamp}`;

      // Open Modal to show action details
      const modal = document.getElementById("redirect-modal");
      const displayUrl = document.getElementById("compiled-url-display");
      displayUrl.textContent = compiledUrl;
      modal.classList.add("active");

      logToConsole(`SUCCESS: CTA Click Intercepted. Compiled tracker UTM dispatch for <span class="success">${partnerChannel}</span>. ID: e_${timestamp}`);
      logToConsole(`API Payload dispatched to analytics queue with destination: <span class="cyan">${compiledUrl}</span>`);
    }

    function closeModal() {
      document.getElementById("redirect-modal").classList.remove("active");
    }

    // Clean Console Interface Logger
    const consoleLogs = document.getElementById("console-logs");
    function logToConsole(message) {
      const timeStamp = new Date().toLocaleTimeString();
      const logLine = document.createElement("div");
      logLine.className = "console-line";
      logLine.innerHTML = `<span class="cyan">[System Log ${timeStamp}]</span> ${message}`;
      consoleLogs.prepend(logLine);
    }