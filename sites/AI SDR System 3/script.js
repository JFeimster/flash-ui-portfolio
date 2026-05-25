// Simple animation logic for the pipeline
        const steps = document.querySelectorAll('.step');
        let currentIdx = 2;

        setInterval(() => {
            steps.forEach(s => s.classList.remove('active'));
            currentIdx = (currentIdx + 1) % steps.length;
            
            for(let i=0; i<=currentIdx; i++) {
                steps[i].classList.add('active');
            }
        }, 3000);