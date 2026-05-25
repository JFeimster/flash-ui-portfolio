document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.querySelector('.subscribe-box');
    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const submitBtn = subscribeForm.querySelector('button');
    const statusContainer = document.createElement('div');
    
    // Style the terminal output to match the dossier theme
    statusContainer.style.fontFamily = "'Courier Prime', monospace";
    statusContainer.style.fontSize = "0.8rem";
    statusContainer.style.marginTop = "15px";
    statusContainer.style.minHeight = "20px";
    statusContainer.style.textTransform = "uppercase";
    statusContainer.style.fontWeight = "bold";
    subscribeForm.appendChild(statusContainer);

    const logToTerminal = (message, color = 'inherit') => {
        statusContainer.innerHTML = `[SYSTEM]: <span style="color: ${color}">${message}</span>`;
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const simulateEnlistment = async () => {
        const email = emailInput.value.trim();

        if (!email) {
            logToTerminal("MISSING IDENTIFICATION. PROVIDE EMAIL.", "var(--stamp-red)");
            return;
        }

        if (!validateEmail(email)) {
            logToTerminal("INVALID FORMAT. INTEL REJECTED.", "var(--stamp-red)");
            return;
        }

        // Lock UI
        submitBtn.disabled = true;
        emailInput.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.innerText = "PROCESSING...";

        const sequences = [
            { msg: "ESTABLISHING SECURE CONNECTION...", time: 600 },
            { msg: "ENCRYPTING SUBSCRIPTION PACKET...", time: 1200 },
            { msg: "BYPASSING BUREAUCRATIC FIREWALLS...", time: 1800 },
            { msg: "ACCESS GRANTED. WELCOME TO THE FRONT.", time: 2400 }
        ];

        for (const step of sequences) {
            await new Promise(resolve => setTimeout(() => {
                logToTerminal(step.msg, step.msg.includes("GRANTED") ? "var(--olive-dark)" : "inherit");
                resolve();
            }, step.time / 2));
        }

        // Final Success State
        setTimeout(() => {
            submitBtn.innerText = "ENLISTED";
            submitBtn.style.background = "var(--ink)";
            submitBtn.style.color = "var(--paper)";
            emailInput.value = "SUBSCRIPTION_ACTIVE";
        }, 500);
    };

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        simulateEnlistment();
    });

    // Handle Enter Key
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            simulateEnlistment();
        }
    });

    // Add typewriter effect decoration to input
    emailInput.addEventListener('focus', () => {
        logToTerminal("AWAITING INTEL INPUT...");
    });
});