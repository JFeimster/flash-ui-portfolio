const inputs = ['widgetType', 'partnerName', 'partnerId', 'source', 'brandColor', 'width', 'height', 'appUrl'];
        const elements = {};
        inputs.forEach(id => elements[id] = document.getElementById(id));
        
        const previewBtn = document.getElementById('mockBtn');
        const previewTitle = document.getElementById('mockTitle');
        const previewDesc = document.getElementById('mockDesc');
        const previewProgress = document.getElementById('mockProgress');
        const codeOutput = document.getElementById('codeOutput');
        const previewDimensions = document.getElementById('previewDimensions');
        const historyContainer = document.getElementById('history');

        let currentTab = 'iframe';

        const widgetData = {
            score: { title: "Funding Readiness", desc: "Check your eligibility for capital in 60 seconds.", btn: "Calculate Now", progress: "65%" },
            matcher: { title: "Route Matcher", desc: "Which funding pathway fits your business model?", btn: "Find My Match", progress: "20%" },
            cta: { title: "Apply for Funding", desc: "Fast capital for growing agencies and SaaS.", btn: "Start Application", progress: "0%" },
            docs: { title: "Document Checklist", desc: "See what you need for a successful application.", btn: "View Checklist", progress: "40%" },
            faq: { title: "Funding FAQ", desc: "Common questions about Moonshine Capital.", btn: "Read More", progress: "10%" },
            calc: { title: "Commission Estimator", desc: "Calculate your partner earnings.", btn: "Estimate Now", progress: "80%" },
            profile: { title: "Verified Partner", desc: "Official Moonshine Capital Funding Partner.", btn: "Get Funded", progress: "100%" }
        };

        function updateGenerator() {
            const type = elements.widgetType.value;
            const data = widgetData[type];
            
            // Update Preview Mockup
            previewTitle.innerText = data.title;
            previewDesc.innerText = data.desc;
            previewBtn.innerText = data.btn;
            previewBtn.style.backgroundColor = elements.brandColor.value;
            previewProgress.style.width = data.progress;
            previewProgress.style.backgroundColor = elements.brandColor.value;
            previewDimensions.innerText = `${elements.width.value} x ${elements.height.value}px`;

            // Build URL
            const baseUrl = "https://widgets.moonshine.capital/" + type;
            const params = new URLSearchParams({
                pid: elements.partnerId.value,
                pname: elements.partnerName.value,
                src: elements.source.value,
                color: elements.brandColor.value.replace('#', ''),
                app_url: elements.appUrl.value || 'https://moonshine.capital/apply'
            });
            const finalUrl = `${baseUrl}?${params.toString()}`;

            // Update Code Blocks
            if (currentTab === 'iframe') {
                codeOutput.innerText = `<iframe \n  src="${finalUrl}"\n  width="${elements.width.value}"\n  height="${elements.height.value}"\n  frameborder="0"\n  allowtransparency="true"\n  style="border-radius: 8px; overflow: hidden;"\n></iframe>`;
            } else if (currentTab === 'script') {
                codeOutput.innerText = `<script src="https://cdn.moonshine.capital/widget-loader.js"><\/script>\n<div \n  data-ms-widget="${type}"\n  data-partner-id="${elements.partnerId.value}"\n  data-color="${elements.brandColor.value}"\n><\/div>`;
            } else {
                codeOutput.innerText = finalUrl;
            }

            saveToHistory(data.title);
        }

        function switchTab(tab) {
            currentTab = tab;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
            updateGenerator();
        }

        function copyCode() {
            navigator.clipboard.writeText(codeOutput.innerText);
            const btn = document.querySelector('.copy-btn');
            btn.innerText = 'Copied!';
            btn.style.color = 'var(--neon-green)';
            setTimeout(() => {
                btn.innerText = 'Copy Code';
                btn.style.color = 'var(--text-primary)';
            }, 2000);
        }

        function saveToHistory(widgetName) {
            let history = JSON.parse(localStorage.getItem('ms_history') || '[]');
            const entry = { name: widgetName, date: new Date().toLocaleTimeString() };
            
            // Avoid duplicates
            if (history.length > 0 && history[0].name === widgetName) return;
            
            history.unshift(entry);
            history = history.slice(0, 3);
            localStorage.setItem('ms_history', JSON.stringify(history));
            renderHistory();
        }

        function renderHistory() {
            const history = JSON.parse(localStorage.getItem('ms_history') || '[]');
            if (history.length === 0) return;
            
            historyContainer.innerHTML = history.map(item => `
                <div class="history-item">
                    <span>${item.name}</span>
                    <span style="color: var(--text-muted); font-size: 0.7rem;">${item.date}</span>
                </div>
            `).join('');
        }

        // Listeners
        inputs.forEach(id => {
            elements[id].addEventListener('input', updateGenerator);
        });

        // Init
        updateGenerator();
        renderHistory();