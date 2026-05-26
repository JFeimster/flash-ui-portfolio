function calculateLeverage() {
            const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
            
            // Standard SBA 7(a) max is usually 75-90%
            // This logic calculates a balanced split based on the down payment
            let sba = 0;
            let seller = 0;

            if (downPayment >= 100) {
                sba = 0;
                seller = 0;
            } else {
                // Priority: Keep SBA high, Seller fills the gap
                const totalDebtNeeded = 100 - downPayment;
                
                // Typical SBA 7(a) cap in a leveraged buyout context
                sba = Math.min(totalDebtNeeded, 75);
                seller = totalDebtNeeded - sba;
            }

            // Update DOM
            document.getElementById('sba-val').innerText = sba.toFixed(1) + '%';
            document.getElementById('seller-val').innerText = seller.toFixed(1) + '%';
            
            document.getElementById('sba-bar').style.width = sba + '%';
            document.getElementById('seller-bar').style.width = seller + '%';
        }

        // Initial trigger
        calculateLeverage();