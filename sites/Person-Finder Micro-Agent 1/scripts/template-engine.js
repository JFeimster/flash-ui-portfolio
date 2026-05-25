/**
 * Outreach & Template Builder Engine
 * Version: 1.0.2
 * Purpose: Dynamically generates personalized outreach messages based on person-finder metadata.
 */

const TemplateLibrary = {
    'Operations': {
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
        email: {
            subject: "Optimizing {{company}}'s Workflow",
            body: "Hi {{first_name}},\n\nI saw that you're heading up operations as {{title}} at {{company}}. Given your location in {{city}}, I wanted to reach out regarding how we've helped similar firms streamline their logistics pipeline.\n\nWould you be open to a 5-minute chat next Tuesday?"
        },
        linkedin: "Hi {{first_name}}, noticed your work in Operations at {{company}}. I'm building a network of leaders in {{city}} and would love to connect!"
    },
    'Finance': {
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path></svg>',
        email: {
            subject: "Fiscal Efficiency at {{company}}",
            body: "Hi {{first_name}},\n\nAs {{title}} at {{company}}, you likely have a keen eye on the bottom line. We've recently helped several {{industry}} firms in the {{city}} area reduce overhead by nearly 14% through automated audit trails.\n\nBest,\n[Your Name]"
        },
        linkedin: "Hi {{first_name}}, I've been following {{company}}'s growth in the {{industry}} sector. Impressive work on the finance side. Let's connect!"
    },
    'Default': {
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        email: {
            subject: "Re: {{company}} / Question",
            body: "Hi {{first_name}},\n\nI was doing some research on {{company}} and came across your profile. As {{title}}, I thought you might be the best person to speak with regarding your current growth initiatives in {{city}}.\n\nDo you have a moment to connect?"
        },
        linkedin: "Hi {{first_name}}, I'm looking to connect with decision makers at {{company}}. Hope you're having a productive week!"
    }
};

class OutreachEngine {
    constructor() {
        this.activePlatform = 'email'; // or 'linkedin'
    }

    /**
     * Parses role string to find the best template match
     */
    detectCategory(title = "") {
        const t = title.toLowerCase();
        if (t.includes('op') || t.includes('logistics') || t.includes('supply')) return 'Operations';
        if (t.includes('fin') || t.includes('account') || t.includes('tax') || t.includes('cfo')) return 'Finance';
        return 'Default';
    }

    /**
     * Replaces curly braces with actual metadata
     */
    formatTemplate(text, data) {
        return text
            .replace(/{{first_name}}/g, data.firstName || "there")
            .replace(/{{company}}/g, data.company || "your company")
            .replace(/{{title}}/g, data.title || "your role")
            .replace(/{{city}}/g, data.city || "your area")
            .replace(/{{industry}}/g, data.industry || "your industry");
    }

    /**
     * Generates the HTML for the template preview component
     */
    renderBuilderUI(targetSelector, personData) {
        const container = document.querySelector(targetSelector);
        if (!container) return;

        const category = this.detectCategory(personData.title);
        const template = TemplateLibrary[category];
        
        const renderedEmailSubject = this.formatTemplate(template.email.subject, personData);
        const renderedEmailBody = this.formatTemplate(template.email.body, personData);
        const renderedLinkedIn = this.formatTemplate(template.linkedin, personData);

        const builderHtml = `
            <div class="template-builder" style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em;">Drafting Outreach</div>
                    <div style="display: flex; gap: 4px;">
                        <button class="platform-tab active" data-platform="email" style="background: var(--primary); border: none; color: white; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; cursor: pointer;">Email</button>
                        <button class="platform-tab" data-platform="linkedin" style="background: var(--input-bg); border: 1px solid var(--border); color: var(--text-dim); font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; cursor: pointer;">LinkedIn</button>
                    </div>
                </div>

                <div id="outreach-content" style="background: #000; border: 1px solid var(--border); border-radius: 6px; padding: 12px; font-family: 'Inter', sans-serif;">
                    <div id="subject-line" style="font-size: 0.8rem; font-weight: 600; color: var(--primary); margin-bottom: 8px; border-bottom: 1px solid #1f242d; padding-bottom: 8px;">
                        <span style="color: var(--text-dim); font-weight: 400;">Subj:</span> ${renderedEmailSubject}
                    </div>
                    <div id="message-body" style="font-size: 0.8rem; line-height: 1.5; color: var(--text-main); white-space: pre-wrap;">${renderedEmailBody}</div>
                </div>

                <div style="margin-top: 12px; display: flex; gap: 8px;">
                    <button style="flex: 1; background: var(--border); border: none; color: white; padding: 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>
                        Copy
                    </button>
                    <button style="flex: 1; background: var(--accent); border: none; color: white; padding: 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        Send
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', builderHtml);
        this.initEventListeners(renderedEmailSubject, renderedEmailBody, renderedLinkedIn);
    }

    initEventListeners(emailSubj, emailBody, linkedinBody) {
        const tabs = document.querySelectorAll('.platform-tab');
        const subjectEl = document.getElementById('subject-line');
        const bodyEl = document.getElementById('message-body');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const platform = e.target.getAttribute('data-platform');
                
                tabs.forEach(t => {
                    t.style.background = 'var(--input-bg)';
                    t.style.borderColor = 'var(--border)';
                    t.style.color = 'var(--text-dim)';
                });
                
                e.target.style.background = 'var(--primary)';
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.color = 'white';

                if (platform === 'linkedin') {
                    subjectEl.style.display = 'none';
                    bodyEl.textContent = linkedinBody;
                } else {
                    subjectEl.style.display = 'block';
                    bodyEl.textContent = emailBody;
                }
            });
        });
    }
}

// Global initialization for the Finder UI
window.OutreachEngine = new OutreachEngine();