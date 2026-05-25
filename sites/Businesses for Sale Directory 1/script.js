const dealData = [
            { id: 1, title: "High-Margin HVAC & Cooling", industry: "Home Services", location: "Phoenix, AZ", askingPrice: 1250000, revenue: 3200000, sde: 450000, multiple: 2.7, financing: true, featured: true, hot: false, status: "Active" },
            { id: 2, title: "Niche Shopify Subscription Box", industry: "Digital", location: "Remote", askingPrice: 425000, revenue: 850000, sde: 180000, multiple: 2.3, financing: false, featured: false, hot: true, status: "Active" },
            { id: 3, title: "Multi-Unit Laundromat Portfolio", industry: "Retail", location: "Chicago, IL", askingPrice: 2100000, revenue: 1100000, sde: 520000, multiple: 4.0, financing: true, featured: false, hot: false, status: "Under Contract" },
            { id: 4, title: "B2B SaaS - SEO Automation Tool", industry: "Digital", location: "Remote", askingPrice: 850000, revenue: 400000, sde: 310000, multiple: 2.7, financing: true, featured: true, hot: false, status: "Active" },
            { id: 5, title: "Precision CNC Machine Shop", industry: "Industrial", location: "Detroit, MI", askingPrice: 3400000, revenue: 5800000, sde: 950000, multiple: 3.5, financing: false, featured: false, hot: false, status: "Active" },
            { id: 6, title: "Amazon FBA - Home Goods Brand", industry: "Digital", location: "Remote", askingPrice: 620000, revenue: 1400000, sde: 220000, multiple: 2.8, financing: true, featured: false, hot: true, status: "Active" },
            { id: 7, title: "Specialty Medical Courier Route", industry: "Industrial", location: "Atlanta, GA", askingPrice: 295000, revenue: 550000, sde: 115000, multiple: 2.5, financing: true, featured: false, hot: false, status: "Active" },
            { id: 8, title: "Regional Landscaping Enterprise", industry: "Home Services", location: "Austin, TX", askingPrice: 1850000, revenue: 4200000, sde: 610000, multiple: 3.0, financing: true, featured: true, hot: false, status: "Active" },
            { id: 9, title: "Full-Service Digital Agency", industry: "Digital", location: "New York, NY", askingPrice: 950000, revenue: 1200000, sde: 350000, multiple: 2.7, financing: false, featured: false, hot: false, status: "Active" },
            { id: 10, title: "Plumbing & Rooter Franchise", industry: "Home Services", location: "Denver, CO", askingPrice: 550000, revenue: 1100000, sde: 190000, multiple: 2.9, financing: true, featured: false, hot: false, status: "Active" },
            { id: 11, title: "Niche Content Site - Tech News", industry: "Digital", location: "Remote", askingPrice: 120000, revenue: 60000, sde: 45000, multiple: 2.6, financing: false, featured: false, hot: true, status: "Active" },
            { id: 12, title: "Auto Collision Repair Center", industry: "Industrial", location: "Portland, OR", askingPrice: 1400000, revenue: 2800000, sde: 420000, multiple: 3.3, financing: true, featured: false, hot: false, status: "Active" }
        ];

        const grid = document.getElementById('listingGrid');
        const modal = document.getElementById('dealModal');
        const modalBody = document.getElementById('modalBody');
        const closeModal = document.getElementById('closeModal');

        function formatCurrency(num) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
        }

        function renderListings(data) {
            grid.innerHTML = '';
            data.forEach(deal => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-header">
                        <div style="display:flex; gap: 0.5rem;">
                            ${deal.featured ? '<span class="badge badge-copper">FEATURED</span>' : ''}
                            ${deal.financing ? '<span class="badge badge-acid">SELLER FINANCING</span>' : ''}
                            ${deal.hot ? '<span class="badge badge-orange">HOT DEAL</span>' : ''}
                        </div>
                        <h3 class="card-title">${deal.title}</h3>
                        <div class="card-loc">${deal.industry} • ${deal.location}</div>
                    </div>
                    <div class="card-metrics">
                        <div class="metric">
                            <div class="metric-label">REVENUE (TTM)</div>
                            <div class="metric-value">${formatCurrency(deal.revenue)}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">CASH FLOW (SDE)</div>
                            <div class="metric-value" style="color: var(--acid-green)">${formatCurrency(deal.sde)}</div>
                        </div>
                    </div>
                    <div class="card-main-price">
                        <div class="price-label">ASKING PRICE</div>
                        <div class="price-value">${formatCurrency(deal.askingPrice)}</div>
                        <div class="metric-label" style="margin-top:0.5rem">MULTIPLE: ${deal.multiple}x</div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-secondary mono" style="flex:1; font-size: 0.7rem;" onclick="openDeal(${deal.id})">View Deal</button>
                        <button class="btn btn-primary mono" style="flex:1; font-size: 0.7rem;">Analyze</button>
                        <button class="save-btn" onclick="toggleSave(this, ${deal.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        function filterDeals() {
            const industry = document.getElementById('filterIndustry').value;
            const price = parseInt(document.getElementById('filterPrice').value);
            const financing = document.getElementById('filterFinancing').checked;
            const search = document.getElementById('mainSearch').value.toLowerCase();
            const sort = document.getElementById('sortOption').value;

            let filtered = dealData.filter(d => {
                const matchIndustry = industry === 'all' || d.industry === industry;
                const matchPrice = d.askingPrice <= price;
                const matchFinancing = !financing || d.financing === true;
                const matchSearch = d.title.toLowerCase().includes(search) || d.location.toLowerCase().includes(search);
                return matchIndustry && matchPrice && matchFinancing && matchSearch;
            });

            if(sort === 'cashflow') filtered.sort((a,b) => b.sde - a.sde);
            if(sort === 'multiple') filtered.sort((a,b) => a.multiple - b.multiple);
            if(sort === 'newest') filtered.sort((a,b) => b.id - a.id);

            renderListings(filtered);
        }

        function triggerSearch() {
            document.getElementById('filterBar').scrollIntoView({ behavior: 'smooth' });
            filterDeals();
        }

        function openDeal(id) {
            const deal = dealData.find(d => d.id === id);
            modalBody.innerHTML = `
                <div class="badge badge-acid">${deal.status}</div>
                <h2 style="font-size: 3rem; font-weight: 800; margin-bottom: 1rem;">${deal.title}</h2>
                <p class="mono" style="color: var(--oxidized-copper); margin-bottom: 2rem;">${deal.location} | Ref ID: #00${deal.id}992</p>
                
                <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 3rem;">
                    <div class="stat-card"><h3>ASKING PRICE</h3><p>${formatCurrency(deal.askingPrice)}</p></div>
                    <div class="stat-card"><h3>CASH FLOW</h3><p>${formatCurrency(deal.sde)}</p></div>
                    <div class="stat-card"><h3>REVENUE</h3><p>${formatCurrency(deal.revenue)}</p></div>
                    <div class="stat-card"><h3>MULTIPLE</h3><p>${deal.multiple}x</p></div>
                </div>

                <div style="background: var(--graphite-light); padding: 2rem; border-left: 4px solid var(--acid-green);">
                    <h4 class="mono" style="margin-bottom: 1rem;">Deal Intelligence</h4>
                    <p style="margin-bottom: 1rem;">This asset is currently in high demand. Recent data shows similar listings in ${deal.industry} are trading at ${deal.multiple + 0.2}x EBITDA. The seller is offering ${deal.financing ? '30% seller carry' : 'no seller financing'} for qualified buyers.</p>
                    <button class="btn btn-primary">Request Confidential Memo</button>
                </div>
            `;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function toggleSave(btn, id) {
            btn.classList.toggle('active');
            let saved = JSON.parse(localStorage.getItem('savedDeals') || '[]');
            if(btn.classList.contains('active')) {
                saved.push(id);
            } else {
                saved = saved.filter(sid => sid !== id);
            }
            localStorage.setItem('savedDeals', JSON.stringify(saved));
        }

        closeModal.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        window.onclick = (e) => { if(e.target == modal) closeModal.onclick(); };

        // Listeners
        document.getElementById('filterIndustry').onchange = filterDeals;
        document.getElementById('filterPrice').onchange = filterDeals;
        document.getElementById('filterFinancing').onchange = filterDeals;
        document.getElementById('sortOption').onchange = filterDeals;
        document.getElementById('mainSearch').onkeyup = (e) => { if(e.key === 'Enter') triggerSearch(); };

        // Initial Load
        renderListings(dealData);
        
        // Sync saved states
        const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]');
        document.querySelectorAll('.save-btn').forEach((btn, idx) => {
            if(saved.includes(dealData[idx]?.id)) btn.classList.add('active');
        });