const terminal = document.getElementById('terminal');
        const items = document.querySelectorAll('.sequence-item');
        const status = document.getElementById('status');
        const scanline = document.getElementById('scanline');
        const resultCard = document.getElementById('resultCard');

        function log(msg) {
            const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            terminal.innerHTML += `\n[${time}] ${msg}`;
            terminal.scrollTop = terminal.scrollHeight;
        }

        async function startScan() {
            const name = document.getElementById('bizName').value || "TARGET_ENTITY";
            
            // Reset
            items.forEach(i => i.className = 'sequence-item');
            resultCard.style.display = 'none';
            terminal.innerHTML = '';
            
            status.innerText = "Scanning...";
            status.style.color = "var(--accent-cyan)";
            status.style.borderColor = "var(--accent-cyan)";
            status.style.background = "rgba(0, 242, 255, 0.1)";
            scanline.style.display = "block";

            log(`Starting micro-agent for: ${name}`);
            
            for(let i=0; i < items.length; i++) {
                items[i].classList.add('active');
                log(`Querying: ${items[i].innerText}...`);
                
                await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
                
                items[i].classList.remove('active');
                items[i].classList.add('complete');
                
                if(i === 2) log(`> Found possible email pattern: first.last@domain.com`);
                if(i === 4) log(`> Found LinkedIn Profile: /in/sjenkins-ops-lead`);
                if(i === 5) log(`> Verified via SOS: Registered Agent matches search.`);
            }

            status.innerText = "Scan Complete";
            status.style.color = "var(--accent-lime)";
            status.style.borderColor = "var(--accent-lime)";
            status.style.background = "rgba(188, 255, 0, 0.1)";
            scanline.style.display = "none";
            
            log(`Search complete. Decision engine selected high-probability contact.`);
            
            resultCard.style.display = 'block';
            document.getElementById('foundName').innerText = "Sarah Jenkins";
            document.getElementById('foundRole').innerText = "Director of Operations • Acme Dynamics";
        }