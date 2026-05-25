const inputs = ['widgetType', 'partnerName', 'partnerId', 'trackingSource', 'appUrl', 'brandColor', 'widgetWidth', 'widgetHeight', 'brandColorHex'];
    const mockData = {
        readiness: { title: "Funding Readiness", desc: "Check your business funding potential in 60 seconds." },
        matcher: { title: "Route Matcher", desc: "Find the best capital path for your business model." },
        cta: { title: "Apply Now", desc: "Start your Moonshine Capital application." },
        checklist: { title: "Document Checklist", desc: "Everything you need for a successful round." },
        faq: { title: "Funding FAQ", desc: "Common questions about Moonshine's process." },
        estimator: { title: "Commission Calc", desc: "Estimate your partner referral earnings." },
        profile: { title: "Partner Profile", desc: "Verified Moonshine Capital Affiliate." }
    };

    function init() {
        // Sync color inputs
        document.getElementById('brandColor').addEventListener('input', (e) => {
            document.getElementById('brandColorHex').value = e.target.value;
            updateGenerator();
        });
        document.getElementById('brandColorHex').addEventListener('input', (e) => {
            document.getElementById('brandColor').value = e.target.value;
            updateGenerator();
        });

        // Add listeners to all inputs
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', updateGenerator);
        });

        document.getElementById('btnBuild').addEventListener('click', () => {
            saveToHistory();
            showToast('Configuration Saved!');
        });

        loadHistory();
        updateGenerator();
    }

    function updateGenerator() {
        const type = document.getElementById('widgetType').value;
        const pId = document.getElementById('partnerId').value || 'PARTNER_ID';
        const pName = document.getElementById('partnerName').value || 'Partner';
        const source = document.getElementById('trackingSource').value || 'direct';
        const appUrl = document.getElementById('appUrl').value || 'https://moonshine.cap/apply';
        const color = document.getElementById('brandColor').value;
        const width = document.getElementById('widgetWidth').value;
        const height = document.getElementById('widgetHeight').value;

        // Build URL
        const baseUrl = `https://widgets.moonshine.cap/${type}`;
        const finalUrl = `${baseUrl}?pid=${encodeURIComponent(pId)}&source=${encodeURIComponent(source)}&accent=${encodeURIComponent(color.replace('#',''))}`;

        // Update iFrame Code
        const iframeCode = `<iframe 
    src="${finalUrl}" 
    width="${width}" 
    height="${height}" 
    frameborder="0" 
    style="border:none; overflow:hidden;" 
    allowTransparency="true">
</iframe>`;

        document.getElementById('iframe-code').textContent = iframeCode;
        document.getElementById('direct-link').textContent = finalUrl;

        // Update Mockup UI
        const mock = mockData[type];
        const mockRender = document.getElementById('mock-render');
        mockRender.innerHTML = `
            <div class="mock-widget-card" style="border-color: ${color}">
                <div class="mock-title" style="color: ${color}">${mock.title}</div>
                <div class="mock-desc">${mock.desc}</div>
                <div class="mock-btn" style="background: ${color}">Get Started</div>
                <div style="margin-top:10px; font-size: 10px; color: #555;">ID: ${pId}</div>
            </div>
        `;
    }

    function copyCode(id) {
        const text = document.getElementById(id).textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!');
        });
    }

    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }

    function showTab(tabId) {
        document.querySelectorAll('.platform-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.platform-tab').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    }

    function saveToHistory() {
        const history = JSON.parse(localStorage.getItem('ms_recent') || '[]');
        const entry = {
            type: document.getElementById('widgetType').value,
            date: new Date().toLocaleTimeString(),
            id: document.getElementById('partnerId').value
        };
        history.unshift(entry);
        localStorage.setItem('ms_recent', JSON.stringify(history.slice(0, 5)));
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('ms_recent') || '[]');
        const container = document.getElementById('recentList');
        if(history.length === 0) return;
        
        container.innerHTML = history.map(h => `
            <div class="recent-item">
                ${h.date} - ${h.type.toUpperCase()} (${h.id || 'No ID'})
            </div>
        `).join('');
    }

    window.onload = init;