// System tool database payload
    const weaponsDatabase = [
      {
        id: "ecommerce-cash-flow",
        name: "Ecommerce Cash Flow Forecaster",
        platform: "Static App",
        category: "Cash Flow",
        tag: "Ecommerce Finance",
        status: "Live",
        description: "Processes your historic store revenue parameters, inventory order schedules, and payment gateway holdback configurations. Outputs a precise 90-day cash buffer map with zero database calls.",
        color: "var(--acid-green)",
        launchUrl: "#lead-maximizer",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "READY",
        notion: "READY",
        supabase: "N/A"
      },
      {
        id: "get-my-funding-offer",
        name: "Get My Funding Offer",
        platform: "Vercel App",
        category: "Funding & Capital",
        tag: "Funding & Capital",
        status: "Live",
        description: "A fast lead-capture and pre-qualification agent tailored for alternative brokers. Users input basic top-line parameters to automatically map out dynamic term sheet limits.",
        color: "var(--magenta)",
        launchUrl: "#lead-maximizer",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "READY",
        notion: "SYNC_OK",
        supabase: "READY"
      },
      {
        id: "funding-pathfinder",
        name: "Funding Pathfinder GPT",
        platform: "CustomGPT",
        category: "Funding & Capital",
        tag: "Business Credit",
        status: "Live",
        description: "A specialized custom agent with deep underwriting rules trained to match MCA, Term Loan, and Invoice Factoring guidelines against real corporate profiles.",
        color: "var(--cyan)",
        launchUrl: "#",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "READY",
        notion: "SYNC_OK",
        supabase: "SECURED"
      },
      {
        id: "realtime-cash-flow",
        name: "Real-Time Cash Flow Analyzer",
        platform: "Gemini Gem",
        category: "Cash Flow",
        tag: "Cash Flow",
        status: "Prototype",
        description: "Harnesses massive context windows to rapidly search uploaded raw ledger exports for structural cash leaks and non-optimal vendor billing cycles.",
        color: "var(--magenta)",
        launchUrl: "#",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "SYNCING",
        notion: "READY",
        supabase: "SECURED"
      },
      {
        id: "funding-goal-tracker",
        name: "Funding Goal Tracker",
        platform: "AI Studio App",
        category: "Funding & Capital",
        tag: "Ecommerce Finance",
        status: "Live",
        description: "Automated agent calculating milestone velocity targets to unlock SBA or private equity criteria. Keeps key operations tracking forward visually.",
        color: "var(--orange)",
        launchUrl: "#",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "READY",
        notion: "OFFLINE",
        supabase: "READY"
      },
      {
        id: "mrr-to-money",
        name: "MRR to Money GPT",
        platform: "CustomGPT",
        category: "Founder Ops",
        tag: "Affiliate Growth",
        status: "Live",
        description: "Converts complex monthly recurring revenue parameters into clear asset-backed borrowing bases. Perfect for SaaS operators wanting non-dilutive solutions.",
        color: "var(--cyan)",
        launchUrl: "#",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "READY",
        notion: "READY",
        supabase: "N/A"
      },
      {
        id: "vc-backup-plan",
        name: "VC Backup Plan GPT",
        platform: "CustomGPT",
        category: "Founder Ops",
        tag: "Founder Ops",
        status: "Prototype",
        description: "Generates quick stress-tested pivots for ventures facing term sheet stagnation. Maps cash reserves to clear survival runway vectors.",
        color: "var(--yellow)",
        launchUrl: "#",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "READY",
        notion: "OFFLINE",
        supabase: "SECURED"
      },
      {
        id: "bizcredit-builder",
        name: "BizCredit Builder GPT",
        platform: "CustomGPT",
        category: "Business Credit",
        tag: "Business Credit",
        status: "Live",
        description: "Provides systematic step-by-step guidance for setting up non-PG corporate trade lines. Tracks your qualification readiness benchmarks.",
        color: "var(--blue)",
        launchUrl: "#",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "READY",
        notion: "READY",
        supabase: "N/A"
      },
      {
        id: "gpt-stack-builder",
        name: "GPT Stack Builder",
        platform: "Prompt System",
        category: "Prompt Systems",
        tag: "Prompt Systems",
        status: "Live",
        description: "A detailed meta-prompt configuration matrix. Builds clean markdown system instructions designed for production and system consistency.",
        color: "var(--yellow)",
        launchUrl: "#",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "READY",
        notion: "READY",
        supabase: "READY"
      },
      {
        id: "flash-ui-portfolio",
        name: "Flash UI Portfolio",
        platform: "Static App",
        category: "Founder Ops",
        tag: "Founder Ops",
        status: "Needs Update",
        description: "Rapid single-page portfolio layout for displaying custom-built agents. Extremely customizable for quick white-label agency launches.",
        color: "var(--red)",
        launchUrl: "#",
        repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
        chatgpt: "OFFLINE",
        notion: "READY",
        supabase: "OFFLINE"
      }
    ];

    // Connection Dependency Configuration Mapping
    const connectionStates = {
      chatgpt: true,
      notion: true,
      supabase: true
    };

    // Selectors
    const mainArmoryGrid = document.getElementById('mainArmoryGrid');
    const searchInput = document.getElementById('searchInput');
    const filterMatrix = document.getElementById('filterMatrix');
    const consoleScreen = document.getElementById('consoleScreen');
    const payloadCodeArea = document.getElementById('payloadCodeArea');
    const payloadTypeLabel = document.getElementById('payloadTypeLabel');

    // Stats Selectors
    const statLeadsCount = document.getElementById('statLeadsCount');
    const statCardToolsCount = document.getElementById('statCardToolsCount');

    let currentFilter = 'all';
    let searchQuery = '';
    let currentSelectedWorkflow = 'agent-test';
    let countLeads = 0;

    // Status Styling Helper
    function getStatusMark(status) {
      if (status === 'Live') return { color: 'var(--acid-green)', dot: '●' };
      if (status === 'Prototype') return { color: 'var(--magenta)', dot: '◆' };
      if (status === 'Needs Update') return { color: 'var(--red)', dot: '▲' };
      return { color: 'var(--yellow)', dot: '■' };
    }

    // Platform Badge Class Helper
    function getPlatformClass(platform) {
      switch(platform) {
        case 'CustomGPT': return 'badge-gpt';
        case 'Gemini Gem': return 'badge-gemini';
        case 'AI Studio App': return 'badge-studio';
        case 'Static App': return 'badge-static';
        case 'Prompt System': return 'badge-prompt';
        default: return 'badge-static';
      }
    }

    // Toggle service connections
    function toggleDependencyConnection(service) {
      connectionStates[service] = !connectionStates[service];
      
      // Update Core System Matrix Nodes visually
      if (service === 'chatgpt') {
        const card = document.getElementById('csCardGPT');
        const indicator = document.getElementById('pulseGPT');
        const stateLabel = document.getElementById('stateLabelGPT');
        const valueNode = document.getElementById('csValGPT');
        if (connectionStates.chatgpt) {
          card.classList.remove('offline');
          indicator.classList.add('active');
          stateLabel.textContent = "STATE: OPERATIONAL";
          valueNode.textContent = "99.9%";
          addConsoleLine("ChatGPT Core Connection Restored.", "CORE");
        } else {
          card.classList.add('offline');
          indicator.classList.remove('active');
          stateLabel.textContent = "STATE: DISCONNECTED";
          valueNode.textContent = "0.0%";
          addConsoleLine("WARNING: ChatGPT Core Connection Severed.", "CORE");
        }
      } else if (service === 'notion') {
        const card = document.getElementById('csCardNotion');
        const indicator = document.getElementById('pulseNotion');
        const stateLabel = document.getElementById('stateLabelNotion');
        const valueNode = document.getElementById('csValNotion');
        if (connectionStates.notion) {
          card.classList.remove('offline');
          indicator.classList.add('active');
          stateLabel.textContent = "STATE: SYNC_ESTABLISHED";
          valueNode.textContent = "READY";
          addConsoleLine("Notion CRM database connection online.", "CORE");
        } else {
          card.classList.add('offline');
          indicator.classList.remove('active');
          stateLabel.textContent = "STATE: OFFLINE";
          valueNode.textContent = "ERROR";
          addConsoleLine("WARNING: Notion CRM pipeline disconnected.", "CORE");
        }
      } else if (service === 'supabase') {
        const card = document.getElementById('csCardSupa');
        const indicator = document.getElementById('pulseSupa');
        const stateLabel = document.getElementById('stateLabelSupa');
        const valueNode = document.getElementById('csValSupa');
        if (connectionStates.supabase) {
          card.classList.remove('offline');
          indicator.classList.add('active');
          stateLabel.textContent = "STATE: GUARD_ENFORCED";
          valueNode.textContent = "SECURED";
          addConsoleLine("Supabase edge gateway fully secured.", "CORE");
        } else {
          card.classList.add('offline');
          indicator.classList.remove('active');
          stateLabel.textContent = "STATE: NO_GUARD";
          valueNode.textContent = "MUTED";
          addConsoleLine("WARNING: Supabase authentication guard bypass warning.", "CORE");
        }
      }

      // Update Systems Readiness Level indicator
      let activeServices = Object.values(connectionStates).filter(v => v).length;
      let readiness = Math.round((activeServices / 3) * 100);
      const readyLabel = document.getElementById('systemStatusLabel');
      readyLabel.textContent = `SYSTEMS_STABLE: ${readiness}%`;
      if(readiness === 100) {
        readyLabel.style.color = "var(--acid-green)";
      } else if (readiness >= 50) {
        readyLabel.style.color = "var(--yellow)";
      } else {
        readyLabel.style.color = "var(--red)";
      }

      renderArmory();
    }

    // Generate Weapon Card with Integrated Dynamic Command Stack Grid
    function generateCardHTML(tool) {
      const statusConfig = getStatusMark(tool.status);
      const platformClass = getPlatformClass(tool.platform);
      
      const gptStatus = !connectionStates.chatgpt ? 'OFFLINE' : (tool.chatgpt === 'READY' ? 'READY' : (tool.chatgpt === 'N/A' ? 'N/A' : tool.chatgpt));
      const notionStatus = !connectionStates.notion ? 'OFFLINE' : (tool.notion === 'READY' || tool.notion === 'SYNC_OK' ? tool.notion : (tool.notion === 'N/A' ? 'N/A' : tool.notion));
      const supabaseStatus = !connectionStates.supabase ? 'OFFLINE' : (tool.supabase === 'READY' || tool.supabase === 'SECURED' ? tool.supabase : (tool.supabase === 'N/A' ? 'N/A' : tool.supabase));

      const gptClass = (gptStatus === 'OFFLINE' || gptStatus === 'SYNCING') ? 'offline' : '';
      const notionClass = (notionStatus === 'OFFLINE') ? 'offline' : '';
      const supabaseClass = (supabaseStatus === 'OFFLINE') ? 'offline' : '';

      // Check for absolute critical dependencies
      let isDepOffline = false;
      if (tool.chatgpt !== 'N/A' && !connectionStates.chatgpt) isDepOffline = true;
      if (tool.notion !== 'N/A' && !connectionStates.notion) isDepOffline = true;
      if (tool.supabase !== 'N/A' && !connectionStates.supabase) isDepOffline = true;

      return `
        <div class="weapon-card ${isDepOffline ? 'dep-offline' : ''}" style="--card-accent: ${tool.color};">
          <div class="card-meta-top">
            <span class="platform-badge ${platformClass}">${tool.platform.toUpperCase()}</span>
            <span class="status-badge" style="color: ${statusConfig.color};">
              <span class="status-dot" style="background: ${statusConfig.color};"></span>
              ${tool.status}
            </span>
          </div>
          
          <div class="card-body">
            <div class="card-cat">${tool.category}</div>
            <h3 class="card-title">${tool.name}</h3>
            <p class="card-desc">${tool.description}</p>
          </div>

          <!-- Interactive Command Stack Grid inside Weapon Cards -->
          <div class="command-stack">
            <div class="command-stack-title mono">CONNECTIONS STATUS MATRIX</div>
            <div class="stack-badges-grid">
              <div class="stack-badge ${gptClass}">GPT: ${gptStatus}</div>
              <div class="stack-badge ${notionClass}">NOTION: ${notionStatus}</div>
              <div class="stack-badge ${supabaseClass}">SUPABASE: ${supabaseStatus}</div>
            </div>
          </div>

          <div class="card-actions">
            <a href="${tool.launchUrl}" class="btn-card btn-card-launch" style="--card-accent: ${tool.color};">Launch Weapon</a>
            <a href="${tool.repoUrl}" target="_blank" class="btn-card btn-card-secondary">Inspect Repo</a>
          </div>
        </div>
      `;
    }

    // Render Database Directory Grid
    function renderArmory() {
      mainArmoryGrid.innerHTML = '';
      
      const filteredTools = weaponsDatabase.filter(tool => {
        const matchesFilter = (currentFilter === 'all') || 
                              (tool.platform.toLowerCase() === currentFilter.toLowerCase()) ||
                              (tool.category.toLowerCase() === currentFilter.toLowerCase()) ||
                              (tool.tag.toLowerCase() === currentFilter.toLowerCase());

        const matchesSearch = tool.name.toLowerCase().includes(searchQuery) ||
                              tool.description.toLowerCase().includes(searchQuery) ||
                              tool.platform.toLowerCase().includes(searchQuery) ||
                              tool.category.toLowerCase().includes(searchQuery);

        return matchesFilter && matchesSearch;
      });

      // Update Filter Active state UI counts
      const filterChips = document.querySelectorAll('.filter-chip');
      filterChips.forEach(chip => {
        const chipFilter = chip.getAttribute('data-filter');
        if (chipFilter === currentFilter) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      // Update dynamic tool count inside stats
      statCardToolsCount.textContent = weaponsDatabase.length;

      if (filteredTools.length === 0) {
        mainArmoryGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-title">⚠️ SYSTEM EXCEPTION: NO TARGET ENGINES MATCHING QUERY</div>
            <p class="empty-desc">Adjust your parameters or reset the database filter to active state.</p>
          </div>
        `;
        return;
      }

      filteredTools.forEach(tool => {
        mainArmoryGrid.innerHTML += generateCardHTML(tool);
      });
    }

    // TACTICAL TERMINAL / WORKFLOW SELECTION LOGIC
    const workflowPayloads = {
      'agent-test': {
        action: "trigger-agent-test",
        endpoint: "/api/v1/trigger-agent-test",
        payload: {
          test_agent_id: "gemini_pro_finance_01",
          prompt_override: "Analyze runway logic",
          timestamp: "2025-10-24T12:00:00Z",
          api_key: "YOUR_N8N_KEY"
        }
      },
      'lead-sync': {
        action: "tally-lead-sync",
        endpoint: "/api/v1/tally-lead-sync",
        payload: {
          source: "tally_form_embed",
          qualification_score: "pending",
          operator_email: "awaiting_input@domain.com",
          notion_crm_connected: true,
          wix_marketing_synced: true
        }
      },
      'notion-archive': {
        action: "notion-auto-archive",
        endpoint: "/api/v1/notion-ingest-pipeline",
        payload: {
          target_master_database: "Notion_Master_Agents_v4",
          mapping_fields: ["id", "name", "platform", "status"],
          auto_publish_frontend: true,
          active_cron_schedule: "0 */1 * * *"
        }
      },
      'supabase-guard': {
        action: "supabase-edge-guard",
        endpoint: "/api/v1/stripe-supabase-auth",
        payload: {
          product_id: "prod_gemini_pro_09",
          supabase_user_token: "YOUR_JWT_TOKEN",
          stripe_client_secret: "sk_live_stripe_keys",
          licensing_active: true
        }
      }
    };

    function selectWorkflow(workflowKey) {
      currentSelectedWorkflow = workflowKey;
      
      // Update Tab Button States
      const buttons = document.querySelectorAll('.selector-btn');
      buttons.forEach(btn => {
        if(btn.textContent.toLowerCase().includes(workflowKey.replace('-', ''))) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Show/Hide parameters editor based on workflow
      const inputsArea = document.querySelector('.terminal-controls-subgrid');
      if (workflowKey === 'agent-test') {
        inputsArea.style.display = 'grid';
      } else {
        inputsArea.style.display = 'none';
      }

      // Update Labels & Text area
      payloadTypeLabel.textContent = `PAYLOAD SCHEMA: ${workflowKey.toUpperCase()}`;
      updateLivePayloadFromInputs();

      addConsoleLine(`SWITCHED INTERACTIVE TARGET TERMINAL TO: [${workflowKey.toUpperCase()}]`);
    }

    // Grab inputs dynamically to populate the JSON payload
    function updateLivePayloadFromInputs() {
      const payloadBase = workflowPayloads[currentSelectedWorkflow];
      
      if (currentSelectedWorkflow === 'agent-test') {
        const agentId = document.getElementById('termAgentId').value;
        const promptText = document.getElementById('termPrompt').value;
        payloadBase.payload.test_agent_id = agentId;
        payloadBase.payload.prompt_override = promptText;
      }

      payloadCodeArea.textContent = JSON.stringify(payloadBase, null, 2);
    }

    function addConsoleLine(text, customPrefix = '>') {
      const line = document.createElement('div');
      line.className = 'console-line';
      line.innerHTML = `<span class="console-prefix">${customPrefix}</span> ${text}`;
      consoleScreen.appendChild(line);
      consoleScreen.scrollTop = consoleScreen.scrollHeight;

      if (consoleScreen.children.length > 30) {
        consoleScreen.removeChild(consoleScreen.firstChild);
      }
    }

    // Trigger Mock Webhook call (hitting n8n routing triggers)
    function triggerWebhookMock() {
      addConsoleLine("DISPATCHING POST HTTP REQUEST TO n8n ENDPOINT...", "API");
      const endpoint = workflowPayloads[currentSelectedWorkflow].endpoint;
      
      // Flash Active status card pulses on trigger
      const statusMatrix = ['csCardGPT', 'csCardNotion', 'csCardSupa'];
      statusMatrix.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.border = '3px solid var(--magenta)';
      });

      setTimeout(() => {
        addConsoleLine(`STATUS CODE: 200 OK // ENDPOINT: ${endpoint}`, "API");
        
        // Return active state borders
        statusMatrix.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.border = '3px solid var(--off-white)';
        });

        if(currentSelectedWorkflow === 'agent-test') {
          addConsoleLine(`GEMINI METRICS RETURNED: [Temp: 0.7, OutTokens: 541, Latency: 120ms]`);
        } else if (currentSelectedWorkflow === 'lead-sync') {
          addConsoleLine(`CRM EXECUTIONS: Lead routed successfully to Wix and Notion databases.`);
        } else if (currentSelectedWorkflow === 'notion-archive') {
          addConsoleLine(`SYNC ACTION: Processed new tools directly from Master Notion DB.`);
        } else {
          addConsoleLine(`PIPELINE TRIGGER: Supabase edge guard validation processed successfully.`);
        }
      }, 1200);
    }

    function copyPayload() {
      const code = payloadCodeArea.textContent;
      navigator.clipboard.writeText(code).then(() => {
        addConsoleLine("CLIPBOARD BUFFER SUCCESS: JSON schema copied.");
      }).catch(err => {
        addConsoleLine("CLIPBOARD EXCEPTION: Enable browser clipboard permissions.");
      });
    }

    // HIGH-CONTRAST TALLY LEAD MAXIMIZER ENGINE
    function handleTallyLeadSync(e) {
      e.preventDefault();
      const name = document.getElementById('leadName').value;
      const email = document.getElementById('leadEmail').value;
      
      addConsoleLine(`TALLY SUBMISSION CAPTURED FROM FRONTEND OVERLAY`, "TALLY");
      addConsoleLine(`DISPATCHING POST /api/v1/tally-lead-sync [Wix Marketing Routing]`, "TALLY");

      // Update Tally Sync Card status to signify activity
      const notionCardVal = document.getElementById('csValNotion');
      const prevNotionVal = notionCardVal.textContent;
      notionCardVal.textContent = 'SYNCING_LEAD';

      setTimeout(() => {
        // Increment Leads in UI Stat Row
        countLeads += 1;
        statLeadsCount.textContent = countLeads;

        // Unlock calc controls
        document.getElementById('calcRevenue').removeAttribute('disabled');
        document.getElementById('calcDebt').removeAttribute('disabled');
        document.getElementById('calcMonths').removeAttribute('disabled');

        // Hide Locker message and enable calculator calculations
        const resultBox = document.getElementById('calcLockerMessage');
        resultBox.classList.add('unlocked');
        resultBox.innerHTML = `
          <span class="mono" style="font-size: 0.85rem; color: var(--acid-green); display: block; margin-bottom: 0.5rem;">[ SYSTEM ENGINE UNLOCKED ]</span>
          <p style="font-size: 0.8rem; color:#aaa;">Metrics dynamically linked with Wix Marketing Channels & Notion CRM.</p>
        `;

        // Run calculations
        calculateRealtimeRunway();

        // Toggle Gate views
        document.getElementById('tallyLeadGate').style.display = "none";
        document.getElementById('gateUnlockedPane').style.display = "flex";

        addConsoleLine(`WIX CRM NOTIFICATION DELIVERED: ${email} logged successfully.`);
        addConsoleLine(`ChatGPT EVALUATION COMPLETED: Qualified parameters for [${name}].`);
        
        notionCardVal.textContent = prevNotionVal;
      }, 1500);
    }

    // Dynamic Real-time Calculations inside the unlocked calculator
    function calculateRealtimeRunway() {
      const revenue = parseFloat(document.getElementById('calcRevenue').value) || 0;
      const debt = parseFloat(document.getElementById('calcDebt').value) || 0;
      const months = parseFloat(document.getElementById('calcMonths').value) || 0;

      // Update Slider value labels
      document.getElementById('valLabelRevenue').textContent = `$${revenue.toLocaleString()}`;
      document.getElementById('valLabelDebt').textContent = `$${debt.toLocaleString()}`;
      document.getElementById('valLabelMonths').textContent = `${months} Months`;

      // Perform calculations
      const borrowBase = (revenue * 1.5) - debt;
      const debtRatio = ((debt / (revenue || 1)) * 100).toFixed(1);
      const qualification = (borrowBase > 100000 && months >= 24) ? "HIGH PASS" : "REQUIRES SPONSOR";

      document.getElementById('outBorrowBase').textContent = `$${Math.max(0, borrowBase).toLocaleString()}`;
      document.getElementById('outDebtRatio').textContent = `${debtRatio}%`;
      
      const qualNode = document.getElementById('outQual');
      qualNode.textContent = qualification;
      if(qualification === "HIGH PASS") {
        qualNode.style.color = "var(--acid-green)";
      } else {
        qualNode.style.color = "var(--yellow)";
      }
    }

    // AUTO-ARCHIVE INGESTION PIPELINE TRIGGER (Notion to Badges)
    function triggerNotionSync() {
      addConsoleLine("QUERYING MASTER NOTION DATABASE FOR RECENT AI TOOLS...", "NOTION");
      
      setTimeout(() => {
        const mockNewAgent = {
          id: "notion-automated-agent",
          name: "Notion Directory Auto-Agent",
          platform: "CustomGPT",
          category: "Founder Ops",
          tag: "Founder Ops",
          status: "Live",
          description: "An automated helper pulling metrics in real-time straight out of production pipelines via Webhook connections.",
          color: "var(--acid-green)",
          launchUrl: "#",
          repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
          chatgpt: "READY",
          notion: "READY",
          supabase: "N/A"
        };

        // Inject into dynamic DB
        weaponsDatabase.unshift(mockNewAgent);
        renderArmory();

        addConsoleLine("SUCCESS: Found 1 new tool inside database. Formatted and injected into weapons directory.", "NOTION");
      }, 1500);
    }

    // STRIPE CHECKOUT SIMULATOR LOGIC
    function triggerStripeCheckoutSimulator() {
      const consoleNode = document.getElementById('apiGuardConsole');
      const supabaseCardVal = document.getElementById('csValSupa');
      const prevSupaVal = supabaseCardVal.textContent;
      
      consoleNode.innerHTML = `INITIATING STRIPE SECURE SESSION...<br>Awaiting Callback Event...`;
      supabaseCardVal.textContent = 'CHECKOUT';

      setTimeout(() => {
        consoleNode.innerHTML += `<br><span style="color:var(--acid-green);">EVENT_SUCCESS: Stripe Charge Completed ($49.00)</span>`;
        consoleNode.innerHTML += `<br>DISPATCHING VERIFICATION TO SUPABASE EDGE FUNCTIONS...`;
        
        setTimeout(() => {
          const generatedToken = "jwt_bearer_token_" + Math.random().toString(36).substring(7);
          consoleNode.innerHTML += `<br><span style="color:var(--cyan);">ACCESS TOKEN GRANTED: ${generatedToken}</span>`;
          addConsoleLine(`API ACCESS GRANTED FOR PREMIUM GEMINI GEMS via Supabase Guard.`);
          
          supabaseCardVal.textContent = prevSupaVal;
        }, 1200);

      }, 1200);
    }

    // API STENCIL DISPLAY DOCUMENTATION
    const apiStencils = {
      'trigger-agent-test': `// Webhook endpoint hitting an n8n pipeline testing Gemini metrics
fetch('https://your-n8n-instance.host/api/v1/trigger-agent-test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_SECURE_N8N_TOKEN'
  },
  body: JSON.stringify({
    test_agent_id: "gemini_pro_finance_01",
    prompt_override: "Analyze runway logic",
    timestamp: new Date().toISOString()
  })
})
.then(response => response.json())
.then(data => {
  console.log("Gemini Execution Output:", data.metrics);
  // Expected response: { status: "success", metrics: { latency: "120ms", tokens: 541 } }
});`,

      'tally-lead-sync': `// Syncs financial calculator submissions from Tally straight to Wix & Notion
app.post('/api/v1/tally-lead-sync', async (req, res) => {
  const { lead_email, calc_inputs } = req.body;
  
  try {
    // 1. Process qualification metrics via ChatGPT evaluation
    const score = await qualifyLeadWithChatGPT(calc_inputs);
    
    // 2. Map directly to Wix CRM & marketing funnels
    await syncToWixMarketing(lead_email, score);
    
    // 3. Document entry inside the Master Notion Database CRM
    await updateNotionCRM(lead_email, calc_inputs, score);
    
    res.status(200).json({ status: 'Success', qualified_tier: score });
  } catch (error) {
    res.status(500).json({ error: 'Sync failed completely' });
  }
});`,

      'notion-pipeline': `// Automates directory population by pulling logged tools inside Master Notion DB
async function ingestNotionDirectory() {
  const notionUrl = 'https://api.notion.com/v1/databases/YOUR_MASTER_DATABASE_ID/query';
  
  const response = await axios.post(notionUrl, {}, {
    headers: { 'Authorization': \`Bearer \${process.env.NOTION_INTEGRATION_TOKEN}\` }
  });
  
  const results = response.data.results.map(page => ({
    name: page.properties.Name.title[0].text.content,
    platform: page.properties.Platform.select.name,
    category: page.properties.Category.select.name,
    description: page.properties.Description.rich_text[0].plain_text
  }));
  
  // Directly pushes mapped variables straight into Webhook UI badge-cards
  return formatBadgeCards(results);
}`,

      'stripe-guard': `// Stripe-Gated Supabase Edge Function API access guard
import { createClient } from '@supabase/supabase-js'

export default async function handleRequest(req) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { stripe_session_id, user_email } = await req.json();

  // Verify direct billing records from Stripe Gateway
  const hasPaid = await verifyStripePurchase(stripe_session_id, user_email);

  if (!hasPaid) {
    return new Response(JSON.stringify({ error: "Access Denied: Payment Required" }), { status: 402 });
  }

  // Provision unique secure access token for premium prompt/Gemini systems
  const token = generateJWT(user_email);
  return new Response(JSON.stringify({ access_token: token }));
}`
    };

    function switchStencil(stencilKey) {
      const tabs = document.querySelectorAll('.code-tab');
      tabs.forEach(tab => {
        if(tab.textContent.toLowerCase().includes(stencilKey.replace('-', ''))) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      document.getElementById('stencilCodeArea').textContent = apiStencils[stencilKey];
    }

    // Search and Filtering Inputs
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      if (searchQuery.length > 0) {
        addConsoleLine(`SEARCH FILTER APPLIED: "${searchQuery}"`, "FILTER");
      }
      renderArmory();
    });

    filterMatrix.addEventListener('click', (e) => {
      const target = e.target.closest('.filter-chip');
      if (!target) return;
      
      currentFilter = target.getAttribute('data-filter');
      addConsoleLine(`FILTER SWITCHED TO: [${currentFilter.toUpperCase()}]`, "FILTER");
      renderArmory();
    });

    // On Load Initializers
    window.addEventListener('DOMContentLoaded', () => {
      renderArmory();
      switchStencil('trigger-agent-test');
    });