document.addEventListener('DOMContentLoaded', () => {
    // Pipeline Motion Simulation
    const stages = document.querySelectorAll('.pipe-stage');
    const connectors = document.querySelectorAll('.pipe-connector');
    
    let currentIndex = 0;
    
    setInterval(() => {
        // Reset all
        stages.forEach(stage => stage.classList.remove('active'));
        connectors.forEach(conn => conn.classList.remove('active'));
        
        // Set active stage
        stages[currentIndex].classList.add('active');
        
        // Set active connector if not the first stage
        if (currentIndex > 0) {
            connectors[currentIndex - 1].classList.add('active');
        }
        
        currentIndex = (currentIndex + 1) % stages.length;
    }, 2000);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
