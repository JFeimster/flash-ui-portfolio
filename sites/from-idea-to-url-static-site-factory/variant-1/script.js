// Subtle animation for the generate button
        document.querySelector('.btn-generate').addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        document.querySelector('.btn-generate').addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });