const API_SNIPPETS = {
    curl: `curl -X GET "https://api.quotegrenade.com/v1/pull-pin" \\
-H "Accept: application/json"`,

    javascript: `fetch('https://api.quotegrenade.com/v1/pull-pin')
  .then(res => res.json())
  .then(data => {
    console.log(\`[DETONATED]: \${data.quote}\`);
  });`,

    widget: `<div id="grenade-widget"></div>
<script 
  src="https://cdn.quotegrenade.com/widget.js" 
  data-theme="radical-red" 
  async>
</script>`,

    discord: `// Simple Discord Webhook POST
const axios = require('axios');

axios.post(WEBHOOK_URL, {
  username: "QUOTE GRENADE",
  content: "💣 **NEW GRENADE DROPPED**",
  embeds: [{
    title: "Permission is the ghost of a dead king.",
    color: 16711680
  }]
});`
};

/**
 * The Fuse: Integration Logic
 * Initializes snippet containers and handles clipboard actions
 */
function initTheFuse() {
    const snippetContainers = document.querySelectorAll('.snippet-container');
    
    snippetContainers.forEach(container => {
        const type = container.dataset.type;
        const codeElement = container.querySelector('code');
        const copyBtn = container.querySelector('.copy-snippet');

        if (API_SNIPPETS[type] && codeElement) {
            codeElement.textContent = API_SNIPPETS[type];
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = API_SNIPPETS[type];
                navigator.clipboard.writeText(text).then(() => {
                    showToast(`COPIED ${type.toUpperCase()} SNIPPET`);
                    
                    // Visual feedback on button
                    const originalText = copyBtn.innerText;
                    copyBtn.innerText = 'ARMED & READY';
                    copyBtn.style.backgroundColor = '#000';
                    copyBtn.style.color = '#fff';
                    
                    setTimeout(() => {
                        copyBtn.innerText = originalText;
                        copyBtn.style.backgroundColor = '';
                        copyBtn.style.color = '';
                    }, 2000);
                });
            });
        }
    });
}

/**
 * Reuses the toast system from the base component if available, 
 * otherwise creates a fallback.
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        const originalText = toast.innerText;
        toast.innerText = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.innerText = originalText;
        }, 2000);
    } else {
        console.log(`[QUOTE GRENADE]: ${message}`);
    }
}

// Detonate on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheFuse);
} else {
    initTheFuse();
}

// Export for module environments if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_SNIPPETS };
}