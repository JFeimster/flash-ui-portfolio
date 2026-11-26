function calculate() {
        const size = document.getElementById('loanSize').value;
        const count = document.getElementById('referralCount').value;
        const result = (size * count) * 0.01;
        document.getElementById('resultDisplay').innerText = '$' + result.toLocaleString();
    }

    function handleApply(e) {
        e.preventDefault();
        const overlay = document.getElementById('success-overlay');
        overlay.style.display = 'flex';
    }

    // Toggle FAQ
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Initialize display
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');