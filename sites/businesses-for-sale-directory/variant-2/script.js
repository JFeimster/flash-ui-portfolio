const DEALS = [
            { id: 1, title: "Established HVAC Operator", industry: "Service", location: "Austin, TX", asking: 1200000, revenue: 3500000, sde: 450000, multiple: "2.6x", financed: true, status: "Featured", type: "service" },
            { id: 2, title: "Niche Shopify SaaS Tool", industry: "Technology", location: "Remote", asking: 450000, revenue: 180000, sde: 150000, multiple: "3.0x", financed: false, status: "Hot", type: "tech" },
            { id: 3, title: "Modern Laundromat Portfolio", industry: "Service", location: "Chicago, IL", asking: 850000, revenue: 400000, sde: 220000, multiple: "3.8x", financed: true, status: "Off-Market", type: "service" },
            { id: 4, title: "Digital Marketing Agency", industry: "Service", location: "Remote", asking: 600000, revenue: 1200000, sde: 300000, multiple: "2.0x", financed: true, status: "Price Drop", type: "tech" },
            { id: 5, title: "FedEx Route Delivery", industry: "Logistics", location: "Atlanta, GA", asking: 950000, revenue: 2100000, sde: 280000, multiple: "3.3x", financed: false, status: "New", type: "service" },
            { id: 6, title: "Amazon FBA - Home Goods", industry: "Retail", location: "Global", asking: 2400000, revenue: 8000000, sde: 900000, multiple: "2.6x", financed: true, status: "High Growth", type: "retail" },
            { id: 7, title: "Auto Repair & Body Shop", industry: "Service", location: "Phoenix, AZ", asking: 550000, revenue: 1100000, sde: 180000, multiple: "3.0x", financed: true, status: "Featured", type: "service" },
            { id: 8, title: "Subscription Box Brand", industry: "Retail", location: "Remote", asking: 320000, revenue: 600000, sde: 120000, multiple: "2.6x", financed: false, status: "New", type: "retail" },
            { id: 9, title: "B2B SaaS Content Tool", industry: "Technology", location: "Remote", asking: 150000, revenue: 50000, sde: 45000, multiple: "3.3x", financed: false, status: "Micro", type: "tech" },
            { id: 10, title: "Landscaping & Hardscape", industry: "Service", location: "Miami, FL", asking: 780000, revenue: 1500000, sde: 320000, multiple: "2.4x", financed: true, status: "Hot", type: "service" },
            { id: 11, title: "Boutique Fitness Studio", industry: "Service", location: "Brooklyn, NY", asking: 400000, revenue: 700000, sde: 150000, multiple: "2.6x", financed: true, status: "Owner-Absentee", type: "service" },
            { id: 12, title: "Specialty Coffee Roastery", industry: "Retail", location: "Portland, OR", asking: 650000, revenue: 1300000, sde: 210000, multiple: "3.0x", financed: false, status: "Featured", type: "retail" }
        ];

        let savedIds = JSON.parse(localStorage.getItem('savedDeals') || '[]');

        function formatCurrency(num) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
        }

        function renderDeals(dealsToRender) {
            const container = document.getElementById('listings-container');
            container.innerHTML = dealsToRender.map(deal => `
                <article class="deal-card">
                    <div class="deal-badge ${deal.status === 'Hot' ? 'badge-hot' : (deal.financed ? 'badge-financed' : 'badge-featured')}">
                        ${deal.status}
                    </div>
                    <div class="mono industry">${deal.industry} // ${deal.location}</div>
                    <h3>${deal.title}</h3>
                    
                    <div class="deal-metrics">
                        <div class="metric">
                            <div class="m-label">Asking Price</div>
                            <div class="m-value" style="color: var(--bone)">${formatCurrency(deal.asking)}</div>
                        </div>
                        <div class="metric">
                            <div class="m-label">Annual SDE</div>
                            <div class="m-value" style="color: var(--acid-green)">${formatCurrency(deal.sde)}</div>
                        </div>
                        <div class="metric">
                            <div class="m-label">Revenue</div>
                            <div class="m-value">${formatCurrency(deal.revenue)}</div>
                        </div>
                        <div class="metric">
                            <div class="m-label">Multiple</div>
                            <div class="m-value" style="color: var(--copper)">${deal.multiple}</div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <a href="#" class="btn btn-primary" onclick="openDeal(${deal.id})">Analyze Deal</a>
                        <button class="save-deal ${savedIds.includes(deal.id) ? 'active' : ''}" onclick="toggleSave(${deal.id})">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                    </div>
                </article>
            `).join('');
            
            document.getElementById('count-listings').innerText = dealsToRender.length;
        }

        function toggleSave(id) {
            if (savedIds.includes(id)) {
                savedIds = savedIds.filter(i => i !== id);
            } else {
                savedIds.push(id);
            }
            localStorage.setItem('savedDeals', JSON.stringify(savedIds));
            renderDeals(DEALS);
            renderSaved();
        }

        function renderSaved() {
            const savedContainer = document.getElementById('saved-listings');
            const savedData = DEALS.filter(d => savedIds.includes(d.id));
            if (savedData.length === 0) {
                savedContainer.innerHTML = '<div style="padding: 2rem; color: var(--copper);">No deals monitored.</div>';
                return;
            }
            savedContainer.innerHTML = savedData.map(deal => `
                <div style="padding: 1rem; border-right: 1px solid var(--graphite); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="mono" style="font-size: 0.6rem;">${deal.title}</div>
                        <div style="font-weight: 700;">${formatCurrency(deal.asking)}</div>
                    </div>
                    <button onclick="toggleSave(${deal.id})" style="background: none; border: none; color: var(--blood-orange);">×</button>
                </div>
            `).join('');
        }

        function openDeal(id) {
            const deal = DEALS.find(d => d.id === id);
            const modal = document.getElementById('deal-modal');
            document.getElementById('modal-content').innerHTML = `
                <div class="mono" style="color: var(--acid-green); margin-bottom: 1rem;">// TERMINAL ACCESS: DEAL_ID_${deal.id}</div>
                <h2 style="font-size: 3rem; margin-bottom: 2rem;">${deal.title}</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <p class="mono">Description</p>
                        <p style="margin-bottom: 1.5rem;">This is a high-yield asset in the ${deal.industry} sector located in ${deal.location}. It shows consistent cash flow with a verified SDE of ${formatCurrency(deal.sde)}.</p>
                        <div class="filter-group" style="margin-bottom: 1rem;">
                            <label>Financing Status</label>
                            <div class="mono">${deal.financed ? 'Eligible for Seller Financing' : 'Cash or SBA only'}</div>
                        </div>
                    </div>
                    <div style="background: var(--graphite); padding: 2rem; border: 1px solid var(--acid-green);">
                        <h4 class="mono">Deal Scorecard</h4>
                        <ul style="list-style: none; margin-top: 1rem;">
                            <li style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #333;">
                                <span>Risk Factor</span> <span style="color: var(--blood-orange)">LOW</span>
                            </li>
                            <li style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #333;">
                                <span>Growth Potential</span> <span style="color: var(--acid-green)">HIGH</span>
                            </li>
                            <li style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                                <span>Defensibility</span> <span>MOATED</span>
                            </li>
                        </ul>
                    </div>
                </div>
            `;
            modal.showModal();
        }

        // Search and Filters
        function filterContent() {
            const ind = document.getElementById('filter-industry').value;
            const price = document.getElementById('filter-price').value;
            const fin = document.getElementById('filter-financing').value;
            const search = document.getElementById('main-search').value.toLowerCase();

            let filtered = DEALS.filter(deal => {
                const matchInd = ind === 'all' || deal.type === ind;
                const matchFin = fin === 'all' || deal.financed;
                const matchSearch = deal.title.toLowerCase().includes(search) || deal.location.toLowerCase().includes(search);
                
                let matchPrice = true;
                if (price === '0-500k') matchPrice = deal.asking < 500000;
                if (price === '500k-1m') matchPrice = deal.asking >= 500000 && deal.asking <= 1000000;
                if (price === '1m+') matchPrice = deal.asking > 1000000;

                return matchInd && matchFin && matchPrice && matchSearch;
            });

            renderDeals(filtered);
        }

        document.querySelectorAll('select').forEach(s => s.addEventListener('change', filterContent));
        document.getElementById('main-search').addEventListener('input', filterContent);

        // Initial Load
        renderDeals(DEALS);
        renderSaved();