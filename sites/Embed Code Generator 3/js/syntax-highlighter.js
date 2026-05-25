/**
 * Moonshine Capital | Syntax Highlighter Engine
 * Optimized for Advanced Integration Docs & Partner Portal v2.0
 * Handles real-time highlighting for iFrames, JS Snippets, and CSS Overrides.
 */

const MoonshineHighlighter = {
    theme: {
        tag: 'var(--neon-blue)',
        attr: 'var(--text-secondary)',
        string: 'var(--neon-green)',
        comment: 'var(--text-muted)',
        keyword: 'var(--neon-blue)',
        variable: 'var(--neon-green)'
    },

    patterns: [
        {
            // HTML Tags
            regex: /(&lt;\/?[a-z1-6]+|&gt;)/gi,
            color: 'tag'
        },
        {
            // Attributes
            regex: /\s([a-z-]+)(?==)/gi,
            color: 'attr'
        },
        {
            // Strings (Double quotes)
            regex: /"([^"\\]*(\\.[^"\\]*)*)"/g,
            color: 'string'
        },
        {
            // JS Keywords
            regex: /\b(const|let|var|function|return|if|else|import|export|from|script|src|data-[a-z-]+)\b/g,
            color: 'keyword'
        },
        {
            // CSS Variables & Directives
            regex: /(--[a-zA-Z0-9-]+|!important)/g,
            color: 'variable'
        },
        {
            // Comments
            regex: /(\/\*[\s\S]*?\*\/|\/\/.*)/g,
            color: 'comment'
        }
    ],

    highlight: function(text) {
        if (!text) return '';

        // Initial Escape
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Apply Pattern Matching
        this.patterns.forEach(pattern => {
            const colorVar = this.theme[pattern.color];
            html = html.replace(pattern.regex, (match) => {
                return `<span style="color: ${colorVar}; font-weight: 500;">${match}</span>`;
            });
        });

        return html;
    },

    injectStyles: function() {
        if (document.getElementById('ms-highlighter-styles')) return;
        const style = document.createElement('style');
        style.id = 'ms-highlighter-styles';
        style.textContent = `
            #codeOutput {
                line-height: 1.6;
                transition: opacity 0.2s ease;
            }
            #codeOutput.updating {
                opacity: 0.5;
            }
        `;
        document.head.appendChild(style);
    },

    init: function() {
        const targetNode = document.getElementById('codeOutput');
        if (!targetNode) return;

        this.injectStyles();

        // Observe changes to code output for real-time reactivity
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (targetNode.dataset.isHighlighting === "true") return;

                const rawContent = targetNode.innerText;
                
                // Disconnect to prevent infinite loop during update
                observer.disconnect();
                targetNode.dataset.isHighlighting = "true";
                targetNode.classList.add('updating');

                targetNode.innerHTML = this.highlight(rawContent);

                // Short delay to signify update then resume observation
                setTimeout(() => {
                    targetNode.dataset.isHighlighting = "false";
                    targetNode.classList.remove('updating');
                    observer.observe(targetNode, { 
                        characterData: true, 
                        childList: true, 
                        subtree: true 
                    });
                }, 10);
            });
        });

        observer.observe(targetNode, { 
            characterData: true, 
            childList: true, 
            subtree: true 
        });

        // Trigger initial highlight
        const initialText = targetNode.innerText;
        targetNode.innerHTML = this.highlight(initialText);
    }
};

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MoonshineHighlighter.init());
} else {
    MoonshineHighlighter.init();
}