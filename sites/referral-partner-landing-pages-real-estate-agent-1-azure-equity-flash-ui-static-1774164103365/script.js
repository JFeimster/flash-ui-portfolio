// Income Calculator Logic
        const loanRange = document.getElementById('loanRange');
        const refRange = document.getElementById('refRange');
        const loanVal = document.getElementById('loan-val');
        const refVal = document.getElementById('ref-val');
        const monthlyTotal = document.getElementById('monthly-total');

        function updateCalc() {
            const loan = parseInt(loanRange.value);
            const refs = parseInt(refRange.value);
            const commission = (loan * 0.005) * refs;
            
            loanVal.innerText = `$${loan.toLocaleString()}`;
            refVal.innerText = refs;
            monthlyTotal.innerText = `$${commission.toLocaleString()}`;
        }

        loanRange.addEventListener('input', updateCalc);
        refRange.addEventListener('input', updateCalc);

        // Form Submission Simulation
        document.getElementById('partnerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            this.style.opacity = '0.5';
            this.style.pointerEvents = 'none';
            setTimeout(() => {
                this.style.display = 'none';
                document.getElementById('successNote').style.display = 'block';
            }, 1000);
        });