/**
 * FLASH-UI // PromptAlchemy // PromptAnalyzer.js
 * System: Impact Calculator & Structural Integrity Engine
 * Part of the Prompt Engineering Optimization Suite
 */

class PromptAnalyzer {
    constructor() {
        this.manifest = {
            structural: ['layout', 'grid', 'bento', 'flex', 'section', 'stack', 'container', 'dashboard', 'architecture', 'blueprint', 'nav', 'header', 'footer'],
            visual: ['onyx', 'neon', 'glassmorphism', 'minimal', 'brutalist', 'dark-mode', 'contrast', 'glow', 'fidelity', 'monochrome', 'typography', 'swiss'],
            functional: ['cta', 'navigation', 'authentication', 'filtering', 'sorting', 'real-time', 'validation', 'trigger', 'interactive', 'api', 'state'],
            audience: ['user', 'persona', 'demographic', 'trader', 'founder', 'enterprise', 'consumer', 'audience', 'pain', 'solution', 'goal']
        };

        this.weightings = {
            structural: 0.35,
            visual: 0.25,
            functional: 0.20,
            audience: 0.20
        };
    }

    /**
     * Analyzes prompt for engineering quality and generation probability.
     * @param {string} prompt - The raw prompt string.
     * @returns {Object} Impact Analysis Report
     */
    calculateImpact(prompt) {
        if (!prompt || prompt.length < 10) return this._getEmptyReport();

        const cleanPrompt = prompt.toLowerCase();
        
        const categories = {
            structural: this._checkDensity(cleanPrompt, 'structural'),
            visual: this._checkDensity(cleanPrompt, 'visual'),
            functional: this._checkDensity(cleanPrompt, 'functional'),
            audience: this._checkDensity(cleanPrompt, 'audience')
        };

        const structuralIntegrity = this._calculateIntegrity(prompt);
        const keywordDensity = this._calculateOverallDensity(categories);
        
        const finalScore = Math.round(
            (keywordDensity * 0.6) + (structuralIntegrity * 0.4)
        );

        return {
            timestamp: new Date().toLocaleTimeString(),
            impactScore: finalScore,
            status: this._getRating(finalScore),
            metrics: {
                clarity: structuralIntegrity,
                density: keywordDensity,
                architecture: categories.structural,
                visualDNA: categories.visual
            },
            recommendations: this._generateRecommendations(finalScore, categories, prompt)
        };
    }

    _checkDensity(text, category) {
        const keywords = this.manifest[category];
        const matches = keywords.filter(kw => text.includes(kw));
        // Calculate score based on keyword variety relative to an "ideal" subset
        return Math.min(Math.round((matches.length / (keywords.length * 0.4)) * 100), 100);
    }

    _calculateIntegrity(text) {
        // High fidelity prompts use structural markers like labels, colons, or line breaks
        const hasMarkers = /[:\-\d\.]/.test(text);
        const hasStructure = text.split('\n').length > 3;
        const lengthFactor = Math.min(text.length / 500, 1);
        
        let score = (lengthFactor * 60);
        if (hasMarkers) score += 20;
        if (hasStructure) score += 20;
        
        return Math.round(Math.min(score, 100));
    }

    _calculateOverallDensity(categories) {
        return Math.round(
            (categories.structural * this.weightings.structural) +
            (categories.visual * this.weightings.visual) +
            (categories.functional * this.weightings.functional) +
            (categories.audience * this.weightings.audience)
        );
    }

    _getRating(score) {
        if (score > 85) return { label: 'SYSTEM_OPTIMAL', color: '#00f2ff' };
        if (score > 65) return { label: 'STABLE_BLUEPRINT', color: '#7000ff' };
        if (score > 35) return { label: 'WEAK_SIGNAL', color: '#ffaa00' };
        return { label: 'CRITICAL_FAILURE', color: '#ff0055' };
    }

    _generateRecommendations(score, categories, prompt) {
        const suggestions = [];
        
        if (categories.structural < 40) {
            suggestions.push("LOW_STABILITY: Define specific layout components (e.g., 'Bento Grid', 'Full-width stack').");
        }
        if (categories.visual < 40) {
            suggestions.push("VISUAL_DNA_MISSING: Inject aesthetic markers like 'Glassmorphism' or 'Onyx Command'.");
        }
        if (prompt.length < 200) {
            suggestions.push("THIN_CONTENT: Increase contextual data density for higher fidelity generation.");
        }
        if (score > 80 && suggestions.length === 0) {
            suggestions.push("CORE_STABLE: Prompt integrity confirmed. Clear for system injection.");
        }

        return suggestions.slice(0, 3);
    }

    _getEmptyReport() {
        return {
            impactScore: 0,
            status: { label: 'AWAITING_INPUT', color: '#888' },
            metrics: { clarity: 0, density: 0, architecture: 0, visualDNA: 0 },
            recommendations: ["Input prompt data to begin architectural analysis."]
        };
    }
}

// Global initialization for FLASH-UI
window.PromptAnalyzer = new PromptAnalyzer();