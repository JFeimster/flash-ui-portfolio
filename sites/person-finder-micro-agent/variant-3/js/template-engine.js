/**
 * Prism Scan | Email Template Architect
 * A library of personalized outreach templates for discovered personas.
 */

const PRISM_TEMPLATES = {
    FOUNDER: {
        id: 'PRISM-F-01',
        label: 'Founder/Visionary',
        subject: 'Strategic Vision: {{company}} Outreach',
        body: `Hello {{name}},\n\nI was conducting a deep-scan of the {{company}} ecosystem via {{source}} and identified your role as a founder. Given your unique position, I wanted to share specific data-driven insights regarding your current market trajectory.\n\nWould you be open to a brief node-sync next week?\n\nBest,\n[Agent_Name]`
    },
    EXECUTIVE: {
        id: 'PRISM-E-02',
        label: 'Executive Leadership',
        subject: 'Entity Performance & {{company}} Operations',
        body: `Dear {{name}},\n\nWhile aggregating data nodes through {{source}}, your leadership at {{company}} stood out as a primary contact point. I've prepared an analysis of operational efficiencies that directly correlate with your recent sector expansion.\n\nCan we schedule a secure transmission to discuss?\n\nRegards,\n[Agent_Name]`
    },
    MANAGER: {
        id: 'PRISM-M-03',
        label: 'Manager/Director',
        subject: 'Workflow Optimization for {{company}}',
        body: `Hi {{name}},\n\nMy analysis of {{company}}'s directory via {{source}} flagged your profile as a key decision-maker. I'm reaching out because our latest prism-scan uncovered several optimization paths for your specific department.\n\nLet me know if you have 5 minutes to review the findings.\n\nSincerely,\n[Agent_Name]`
    }
};

class TemplateEngine {
    constructor() {
        this.version = "1.0.4-Stable";
        this.placeholders = ['name', 'company', 'source'];
    }

    /**
     * Injects data into placeholders within a template string.
     * @param {string} str - The template string.
     * @param {Object} data - Values for name, company, and source.
     */
    process(str, data) {
        let output = str;
        this.placeholders.forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            const value = data[key] || `[${key.toUpperCase()}_NOT_FOUND]`;
            output = output.replace(regex, value);
        });
        return output;
    }

    /**
     * Generates a full outreach package based on persona.
     * @param {string} persona - 'FOUNDER', 'EXECUTIVE', or 'MANAGER'.
     * @param {Object} data - { name, company, source }.
     */
    generate(persona, data) {
        const template = PRISM_TEMPLATES[persona] || PRISM_TEMPLATES.MANAGER;
        
        return {
            personaId: template.id,
            personaLabel: template.label,
            subject: this.process(template.subject, data),
            body: this.process(template.body, data),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Formats the result for display in the Prism Scan terminal.
     */
    formatForTerminal(persona, data) {
        const result = this.generate(persona, data);
        return `
[SYSTEM] ARCHITECTING OUTREACH...
[STATUS] Persona Identified: ${result.personaLabel}
[STATUS] Source Node: ${data.source}
--------------------------------------------------
SUBJECT: ${result.subject}
CONTENT:
${result.body}
--------------------------------------------------
[SYSTEM] Template ${result.personaId} compiled successfully.`;
    }
}

// Initialize the Architect on the window object
window.PrismArchitect = new TemplateEngine();