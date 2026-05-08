const inputs = ['widgetType', 'partnerName', 'partnerId', 'brandColor', 'width', 'height', 'trackingSource'];
        const mockTitles = {
            score: "Funding Readiness Score",
            matcher: "Funding Route Matcher",
            cta: "Apply for Capital",
            checklist: "Document Checklist",
            faq: "Funding FAQ",
            estimator: "Commission Estimator",
            profile: "Partner Profile"
        };

        function updateGenerator() {
            const config = {};
            inputs.forEach(id => {
                config[id] = document.getElementById(id).value;
            });

            // Update Mockup
            document.getElementById('mockTitle').innerText = mockTitles[config.widgetType];
            document.getElementById('mockBtn').style.backgroundColor = config.brandColor;
            document.getElementById('mockProgress').style.backgroundColor = config.brandColor;
            document.getElementById('mockPartner').innerText = `Powered by Moonshine Capital x ${config.partnerName || 'Partner'}`;
            
            // Build URL
            const baseUrl = `https://widgets.moonshinecapital.com/${config.widgetType}`;
            const params = new URLSearchParams({
                pid: config.partnerId || 'default',
                utm_source: config.trackingSource || 'affiliate',
                color: config.brandColor.replace('#', '')
            });
            const fullUrl = `${baseUrl}?${params.toString()}`;

            // Build iFrame
            const iframe = `<iframe \n  src="${fullUrl}" \n  width="${config.width}" \n  height="${config.height}" \n  frameborder="0" \n  scrolling="no" \n  style="border-radius: 8px; border: 1px solid #eee;">\n</iframe>`;
            
            document.getElementById('iframeCode').textContent = iframe;
            document.getElementById('directLink').textContent = fullUrl;

            saveToLocal(config);
        }

        function setColor(hex) {
            document.getElementById('brandColor').value = hex;
            updateGenerator();
        }

        function copyCode(elementId) {
            const text = document.getElementById(elementId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                const btn = event.target;
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                btn.style.color = 'var(--accent-green)';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.color = 'var(--text-dim)';
                }, 2000);
            });
        }

        function saveToLocal(config) {
            const history = JSON.parse(localStorage.getItem('ms_embed_history') || '[]');
            const entry = { type: config.widgetType, time: new Date().toLocaleTimeString() };
            
            // Basic prevent duplicates
            if (history.length === 0 || history[0].type !== entry.type) {
                history.unshift(entry);
                if (history.length > 5) history.pop();
                localStorage.setItem('ms_embed_history', JSON.stringify(history));
                renderHistory();
            }
        }

        function renderHistory() {
            const history = JSON.parse(localStorage.getItem('ms_embed_history') || '[]');
            const list = document.getElementById('historyList');
            if (history.length > 0) {
                list.innerHTML = history.map(h => `
                    <li class="history-item">
                        <span>${mockTitles[h.type]}</span>
                        <span>${h.time}</span>
                    </li>
                `).join('');
            }
        }

        // Listeners
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', updateGenerator);
        });

        // Init
        updateGenerator();
        renderHistory();