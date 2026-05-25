// State
        let selectedType = "Landing Page";
        
        // Handle Site Type Selection
        const typeTiles = document.querySelectorAll('#typeGrid .option-tile');
        typeTiles.forEach(tile => {
            tile.addEventListener('click', () => {
                typeTiles.forEach(t => t.classList.remove('active'));
                tile.classList.add('active');
                selectedType = tile.dataset.value;
            });
        });

        function generatePrompt() {
            const style = document.getElementById('styleInput').value;
            const audience = document.getElementById('audience').value || "General Users";
            const pain = document.getElementById('pain').value || "Lack of efficiency";
            const cta = document.getElementById('cta').value || "Get Started";
            
            const checkboxes = document.querySelectorAll('#sectionsGrid input:checked');
            const sections = Array.from(checkboxes).map(cb => cb.value).join(', ');

            const promptTemplate = `Create a high-fidelity FLASH-UI ${selectedType}. 

Visual Aesthetic: ${style}. 
Target Audience: ${audience}.
Core Problem Solved: ${pain}.
Conversion Goal: ${cta}.

Key Component Manifest:
${sections}.

Design Guidelines: 
- Use a strictly dark-themed 'Onyx Command' layout.
- Implement bento-box styling for the main content areas.
- Ensure neon accents and glassmorphic overlays.
- Typography should be modern, clean, and use mono-fonts for technical data points.
- The UI should feel like a futuristic laboratory or command console.

Output Format: RAW HTML/CSS/JS in a single file.`;

            document.getElementById('promptOutput').value = promptTemplate;
            document.getElementById('outputSection').style.display = 'block';
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }

        function copyToClipboard() {
            const copyText = document.getElementById("promptOutput");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(copyText.value);
            
            const btn = document.querySelector('.btn-outline');
            const originalText = btn.innerText;
            btn.innerText = "COPIED!";
            setTimeout(() => btn.innerText = originalText, 2000);
        }

        function savePrompt() {
            const prompt = document.getElementById('promptOutput').value;
            if(!prompt) return;

            const saved = JSON.parse(localStorage.getItem('flash_prompts') || '[]');
            const newItem = {
                id: Date.now(),
                title: `${selectedType} - ${new Date().toLocaleDateString()}`,
                content: prompt
            };
            
            saved.unshift(newItem);
            localStorage.setItem('flash_prompts', JSON.stringify(saved.slice(0, 6))); // Keep last 6
            renderHistory();
        }

        function renderHistory() {
            const historyGrid = document.getElementById('historyGrid');
            const saved = JSON.parse(localStorage.getItem('flash_prompts') || '[]');
            
            if(saved.length === 0) {
                historyGrid.innerHTML = `<div style="color: var(--text-dim); font-size: 0.9rem;">No prompts saved in local vault.</div>`;
                return;
            }

            historyGrid.innerHTML = saved.map(item => `
                <div class="history-item">
                    <header>${item.title}</header>
                    <div style="height: 60px; overflow: hidden; opacity: 0.6; font-family: var(--font-mono); margin-bottom: 10px;">
                        ${item.content.substring(0, 100)}...
                    </div>
                    <button class="btn-outline" style="width: 100%; font-size: 0.7rem;" onclick="loadPrompt(${item.id})">Reload</button>
                </div>
            `).join('');
        }

        function loadPrompt(id) {
            const saved = JSON.parse(localStorage.getItem('flash_prompts') || '[]');
            const item = saved.find(i => i.id === id);
            if(item) {
                document.getElementById('promptOutput').value = item.content;
                document.getElementById('outputSection').style.display = 'block';
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        }

        // Init
        renderHistory();