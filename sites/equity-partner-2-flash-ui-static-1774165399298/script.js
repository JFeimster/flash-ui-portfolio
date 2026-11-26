function calculate() {
            const clients = document.getElementById('clients').value;
            const dealSize = document.getElementById('dealSize').value;
            const rate = document.getElementById('rate').value;
            
            const annual = clients * 12 * dealSize * (rate / 100);
            
            document.getElementById('totalResult').innerText = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(annual);
        }