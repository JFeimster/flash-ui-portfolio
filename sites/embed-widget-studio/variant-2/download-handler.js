const assetLibrary = {
    logos: [
        { id: 'logo-primary', name: 'Moonshine Primary (Vector)', format: 'SVG', size: '24KB', url: '#' },
        { id: 'logo-monochrome', name: 'Monochrome Black', format: 'PNG', size: '110KB', url: '#' },
        { id: 'logo-white', name: 'Knockout White', format: 'PNG', size: '95KB', url: '#' }
    ],
    banners: [
        { id: 'banner-leader', name: 'Leaderboard Ad (728x90)', format: 'JPG', size: '240KB', url: '#' },
        { id: 'banner-mrec', name: 'Medium Rectangle (300x250)', format: 'JPG', size: '180KB', url: '#' },
        { id: 'banner-social', name: 'LinkedIn/Twitter Header', format: 'PNG', size: '1.2MB', url: '#' }
    ],
    swipe: [
        { 
            id: 'copy-email', 
            title: 'Email Announcement', 
            content: "Subject: New Funding Tools for Your Business\n\nHi [Name],\n\nWe've partnered with Moonshine Capital to provide you with instant access to funding readiness tools. Check your score today and see where you stand in the capital markets.\n\n[WIDGET_LINK]" 
        },
        { 
            id: 'copy-social', 
            title: 'Social Media Post', 
            content: "Excited to announce our new partnership with Moonshine Capital! 🚀 Our clients can now access advanced capital matching and readiness tools directly through our portal. Getting funded just got easier. #Fintech #Capital #Growth" 
        },
        { 
            id: 'copy-blog', 
            title: 'Blog Intro Paragraph', 
            content: "Navigating the world of business capital can be daunting. That is why we have integrated Moonshine Capital's proprietary scoring engine into our platform, allowing you to benchmark your business against thousands of successful funding rounds in real-time." 
        }
    ]
};

/**
 * Handles asset downloads with UI feedback
 * @param {string} assetId 
 * @param {HTMLElement} btnElement 
 */
function initiateDownload(assetId, btnElement) {
    const originalText = btnElement.innerText;
    
    // Simulate download start
    btnElement.innerText = 'Preparing...';
    btnElement.style.opacity = '0.7';
    
    setTimeout(() => {
        btnElement.innerText = 'Downloading';
        btnElement.style.color = '#39ff14'; // accent-green
        
        // In production, this would point to actual AWS/CDN signed URLs
        console.log(`Downloading asset: ${assetId}`);
        
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.color = '';
            btnElement.style.opacity = '1';
        }, 1500);
    }, 600);
}

/**
 * Copies swipe copy text to clipboard
 * @param {string} textId 
 * @param {HTMLElement} btnElement 
 */
function copySwipeText(textId, btnElement) {
    const asset = assetLibrary.swipe.find(s => s.id === textId);
    if (!asset) return;

    navigator.clipboard.writeText(asset.content).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = 'Copied to Clipboard';
        btnElement.style.backgroundColor = 'rgba(57, 255, 20, 0.15)';
        btnElement.style.color = '#39ff14';

        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.backgroundColor = '';
            btnElement.style.color = '';
        }, 2500);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

/**
 * Generates the Asset Library Section HTML
 * This can be called to inject the library into the page
 */
function injectAssetLibrary() {
    const container = document.createElement('section');
    container.className = 'faq-section'; // Reuse existing layout classes
    container.id = 'brand-library';
    
    let html = `
        <h2 style="margin-bottom: 8px;">Brand & Creative Assets</h2>
        <p class="subheadline" style="margin-bottom: 32px; text-align: left;">High-resolution logos, marketing banners, and pre-approved copy for your campaigns.</p>
        
        <div class="container" style="padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div class="panel">
                <h3 style="margin-bottom: 16px; font-size: 1rem; color: #00f2ff;">Official Logos & Banners</h3>
                <div id="asset-grid">
                    ${[...assetLibrary.logos, ...assetLibrary.banners].map(asset => `
                        <div class="history-item" style="padding: 12px 0;">
                            <div>
                                <div style="color: #e6edf3; font-weight: 600;">${asset.name}</div>
                                <div style="font-size: 0.7rem; color: #8b949e;">${asset.format} • ${asset.size}</div>
                            </div>
                            <button class="copy-btn" onclick="initiateDownload('${asset.id}', this)">Download</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="panel">
                <h3 style="margin-bottom: 16px; font-size: 1rem; color: #39ff14;">Marketing Swipe Copy</h3>
                ${assetLibrary.swipe.map(item => `
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #30363d;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label style="margin-bottom: 0;">${item.title}</label>
                            <button class="copy-btn" onclick="copySwipeText('${item.id}', this)">Copy Text</button>
                        </div>
                        <div class="code-container" style="max-height: 80px; overflow: hidden; opacity: 0.8;">
                            <pre style="font-size: 11px; color: #8b949e;">${item.content}</pre>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;
    
    // Find a spot to inject - before the FAQ section
    const faq = document.querySelector('.faq-section');
    if (faq) {
        faq.parentNode.insertBefore(container, faq);
    }
}

// Initializing the library component on script load
document.addEventListener('DOMContentLoaded', () => {
    // Check if the page is the generator page before injecting
    if (document.getElementById('config-start')) {
        injectAssetLibrary();
    }
});