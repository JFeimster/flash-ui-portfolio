const SCRIPT_LIBRARY = {
    "CPA/Accountant": {
        "Identified": {
            "Email": {
                "subject": "Strategic Capital Resource for [Firm Name] Clients",
                "body": "Hi [Name],\n\nI’ve been following [Firm Name]’s work in the local business community. I represent Moonshine Capital, and we specialize in non-dilutive funding and creative bridge loans that complement traditional tax planning.\n\nI’d love to introduce myself and see if we can be a resource for your clients who might be facing lending gaps. Do you have 15 minutes for a brief introductory call next Tuesday?"
            },
            "LinkedIn": "Hi [Name], I noticed your focus on [Specialty] at [Firm Name]. I work with referral partners in the accounting space to help their clients navigate complex capital needs. Would love to connect and share more about what we're seeing in the private credit market.",
            "Phone": "Hi [Name], this is [Your Name] with Moonshine Capital. I'm reaching out because we help CPAs provide more value to their clients by solving 'un-bankable' funding issues. I was hoping to chat for 2 minutes to see if a formal introduction makes sense?"
        },
        "Conversation Started": {
            "Email": {
                "subject": "Follow-up: Moonshine Capital / [Firm Name] Partnership",
                "body": "Hi [Name],\n\nGreat speaking with you earlier. As discussed, Moonshine Capital specializes in speed and flexibility—often funding in under 72 hours when traditional banks say no.\n\nI’ve attached our one-pager for you to keep on file. Next time a client mentions they are struggling with cash flow or expansion capital, let’s hop on a three-way call."
            },
            "LinkedIn": "Great connecting today, [Name]. I'm looking forward to seeing how we can support your clients at [Firm Name]. I'll keep you posted on any market shifts we see in the lending space.",
            "Phone": "Hey [Name], just checking in. I know tax season is approaching. Have any of your clients brought up expansion plans or equipment needs for the coming quarter?"
        },
        "Referral Agreement Discussed": {
            "Email": {
                "subject": "Referral Agreement & Process - Moonshine Capital",
                "body": "Hi [Name],\n\nFollowing our last chat, I’ve attached our standard Referral Partner Agreement. We value the expertise you bring to your clients, and our goal is to ensure a seamless experience when you hand them off to us.\n\nOnce signed, I’ll set up your partner portal where you can track the status of any deal you send over in real-time."
            },
            "LinkedIn": "Sent over the partner agreement to your email, [Name]. Excited to make this official and start building some momentum together.",
            "Phone": "Hi [Name], just wanted to verify you received the agreement. I'm excited to get started. I actually have a specific program right now that is perfect for your manufacturing clients."
        }
    },
    "Business Broker": {
        "Identified": {
            "Email": {
                "subject": "Helping your buyers close [Listing Name] faster",
                "body": "Hi [Name],\n\nI saw your listing for [Listing Name] and it looks like a fantastic opportunity. \n\nI work with Moonshine Capital, and we specialize in gap financing and bridge loans that help buyers cross the finish line when SBA or traditional bank timelines are too slow. I'd love to be a 'pocket resource' for your future listings."
            },
            "LinkedIn": "Hi [Name], love the listings you've been putting out lately—especially the one in [Industry]. I help brokers get deals closed by providing creative capital for buyers. Let's connect.",
            "Phone": "Hi [Name], I’m a private capital provider. I see you have a few active listings—are you seeing any buyers struggling to get traditional financing right now?"
        },
        "Active Source": {
            "Email": {
                "subject": "Quick Update: New High-Leverage Program for Buyers",
                "body": "Hi [Name],\n\nHope you're having a busy week. We just rolled out a new 'Asset-Light' program that allows buyers to leverage future receivables at a much lower cost of capital than typical MCAs.\n\nThis could be a game-changer for the service-based businesses you're currently listing. Let me know if you want the details."
            },
            "LinkedIn": "Hey [Name], just funded a deal for a buyer in [City] in 4 days. Keep me in mind if any of your current deals are hitting a wall with the banks.",
            "Phone": "Hi [Name], just checking in on your current pipeline. Anything we can help push over the finish line this month?"
        }
    },
    "Bank Manager": {
        "Identified": {
            "Email": {
                "subject": "A home for your 'Turned Down' commercial loans",
                "body": "Hi [Name],\n\nI know [Bank Name] has high standards for commercial lending. When you have a local business owner who doesn't quite meet your current credit box, what do you do with them?\n\nAt Moonshine Capital, we love the 'B' and 'C' credits that banks turn away. We help them get healthy so they can eventually return to you as 'A' credit clients. I'd love to buy you a coffee and discuss a referral workflow."
            },
            "LinkedIn": "Hi [Name], I work with bank managers to help provide solutions for clients who fall outside the traditional lending box. Would love to connect and be a resource for your 'turn-downs'.",
            "Phone": "Hi [Name], I'm [Your Name] from Moonshine Capital. We specialize in non-bankable deals. I'm looking to partner with a few local bankers who want to keep their clients happy even when the bank says no. Do you have a moment to chat?"
        }
    }
};

/**
 * Logic to handle script generation and interaction
 */
document.addEventListener('DOMContentLoaded', () => {
    const personaSelect = document.getElementById('script-persona');
    const contextSelect = document.getElementById('script-context');
    const outputArea = document.getElementById('script-output');
    
    // Add Channel Selector to UI if not present
    const controlsContainer = personaSelect.closest('.grid');
    if (controlsContainer && !document.getElementById('script-channel')) {
        const channelDiv = document.createElement('div');
        channelDiv.className = "col-span-2 mt-2";
        channelDiv.innerHTML = `
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Communication Channel</label>
            <div class="flex gap-2">
                <button onclick="setChannel('Email')" class="channel-btn active bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold">Email</button>
                <button onclick="setChannel('LinkedIn')" class="channel-btn bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs font-bold">LinkedIn</button>
                <button onclick="setChannel('Phone')" class="channel-btn bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs font-bold">Phone</button>
            </div>
        `;
        controlsContainer.appendChild(channelDiv);
    }

    window.activeChannel = 'Email';

    window.setChannel = (channel) => {
        window.activeChannel = channel;
        document.querySelectorAll('.channel-btn').forEach(btn => {
            if (btn.innerText === channel) {
                btn.className = "channel-btn active bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold";
            } else {
                btn.className = "channel-btn bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs font-bold";
            }
        });
        generateAdvancedScript();
    };

    window.generateAdvancedScript = () => {
        const persona = personaSelect.value;
        const stage = contextSelect.value;
        const channel = window.activeChannel;

        // Map UI context values to Library stage keys if necessary
        let stageKey = stage;
        if (stage === 'Initial Reachout') stageKey = 'Identified';
        if (stage === 'Follow Up') stageKey = 'Conversation Started';
        if (stage === 'Asking for Referral') stageKey = 'Active Source';

        const roleData = SCRIPT_LIBRARY[persona] || SCRIPT_LIBRARY["CPA/Accountant"];
        const stageData = roleData[stageKey] || roleData["Identified"];
        const content = stageData[channel] || stageData["Email"];

        if (channel === 'Email') {
            outputArea.innerHTML = `
                <div class="mb-2 pb-2 border-b border-slate-200">
                    <span class="text-[10px] font-black text-slate-400 uppercase">Subject:</span>
                    <span class="text-sm font-bold text-slate-700">${content.subject}</span>
                </div>
                <div class="whitespace-pre-line text-slate-600">"${content.body}"</div>
            `;
        } else {
            outputArea.innerHTML = `<div class="whitespace-pre-line text-slate-600">"${content}"</div>`;
        }
    };

    // Override the base script function
    window.generateScript = window.generateAdvancedScript;
    
    // Initial generation
    generateAdvancedScript();
});

/**
 * Utility to copy with visual feedback
 */
window.copyScript = function() {
    const output = document.getElementById('script-output');
    // Strip HTML tags for clean clipboard copy
    const textToCopy = output.innerText.replace(/"/g, '');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const btn = document.querySelector('button[onclick="copyScript()"]');
        const originalText = btn.innerText;
        btn.innerText = "COPIED!";
        btn.classList.add('bg-emerald-500');
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('bg-emerald-500');
        }, 2000);
    });
};