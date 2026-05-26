const inputs = ['widgetType', 'trackingSource', 'partnerName', 'partnerId', 'appUrl', 'bookingUrl', 'brandColor', 'width', 'height', 'brandColorHex'];
        
        function init() {
            // Load from localStorage
            inputs.forEach(id => {
                const val = localStorage.getItem(id);
                if (val) {
                    document.getElementById(id).value = val;
                }
                
                document.getElementById(id).addEventListener('input', () => {
                    if (id === 'brandColor') document.getElementById('brandColorHex').value = document.getElementById(id).value;
                    if (id === 'brandColorHex') document.getElementById('brandColor').value = document.getElementById(id).value;
                    updateAll();
                });
            });

            updateAll();
        }

        function updateAll() {
            const data = {};
            inputs.forEach(id => {
                data[id] = document.getElementById(id).value;
                localStorage.setItem(id, data[id]);
            });

            const baseUrl = "https://widgets.moonshine.capital";
            const params = new URLSearchParams({
                type: data.widgetType,
                pid: data.partnerId,
                source: data.trackingSource,
                color: data.brandColor.replace('#', ''),
                app: data.appUrl
            });

            const finalUrl = `${baseUrl}/${data.widgetType}?${params.toString()}`;

            // Update Codes
            document.getElementById('iframe-display').textContent = `<iframe src="${finalUrl}" width="${data.width}" height="${data.height}" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true" allow="encrypted-media"></iframe>`;
            
            document.getElementById('script-display').textContent = `<script src="https://cdn.moonshine.capital/sdk.js" id="ms-widget" data-widget="${data.widgetType}" data-partner="${data.partnerId}" data-color="${data.brandColor}"><\/script>`;
            
            document.getElementById('link-display').textContent = finalUrl;

            // Update Preview
            document.getElementById('mockPartner').textContent = `Powered by Moonshine Capital & ${data.partnerName || 'Partner'}`;
            document.getElementById('mockCta').style.backgroundColor = data.brandColor;
            
            const titles = {
                'funding-readiness': 'Funding Readiness Score',
                'route-matcher': 'Route Matcher',
                'app-cta': 'Ready to Scale?',
                'checklist': 'Document Checklist',
                'faq': 'Capital FAQ',
                'commission': 'Commission Estimator',
                'profile': 'Partner Profile'
            };
            
            document.getElementById('mockTitle').textContent = titles[data.widgetType];
        }

        function switchTab(type) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');

            document.getElementById('iframe-code').classList.add('hidden');
            document.getElementById('script-code').classList.add('hidden');
            document.getElementById('link-code').classList.add('hidden');

            document.getElementById(`${type}-code`).classList.remove('hidden');
        }

        function copyCode(id) {
            const text = document.getElementById(id).textContent;
            navigator.clipboard.writeText(text).then(() => {
                const toast = document.getElementById('toast');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            });
        }

        window.onload = init;