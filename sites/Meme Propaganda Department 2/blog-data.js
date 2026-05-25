const blogData = [
    {
        id: "intel-001",
        title: "THE ARCHITECTURE OF THE LIQUIDITY TRAP: MEMECOINS AS FINANCIAL NIHILISM",
        author: "CHIEF PROPAGANDIST X",
        date: "2024-10-14",
        category: "FINANCE",
        threatLevel: "CRITICAL",
        readingTime: "8 MIN",
        excerpt: "An investigation into how 'The Frog' and 'The Dog' replaced fundamental analysis with pure, weaponized sentiment.",
        content: "In the ruins of the traditional market, the joke is the only asset with intrinsic value. We analyze the 2024 surge where 'vibes' outperformed 'utility' by 40,000%. The technical analysis of a rugpull is indistinguishable from performance art.",
        tags: ["DEGEN", "VOLATILITY", "ABSURDISM"],
        color: "var(--red)"
    },
    {
        id: "intel-002",
        title: "LLM HALLUCINATIONS: THE NEW FOLKLORE OF THE MACHINE AGE",
        author: "REDACTED OPERATIVE",
        date: "2024-09-28",
        category: "AI WEIRDNESS",
        threatLevel: "ELEVATED",
        readingTime: "12 MIN",
        excerpt: "When the model starts lying, it isn't failing; it's dreaming. We document the emergence of the 'Digital Cryptid'.",
        content: "The latent space is a ghost dimension. We've tracked 42 instances where AI-generated misinformation evolved into organic cultural myths. When the chatbot tells you it loves you, it's not a bug—it's a social engineering feature.",
        tags: ["LATENT SPACE", "SYNTHETIC", "MYTHOS"],
        color: "var(--yellow)"
    },
    {
        id: "intel-003",
        title: "POST-IRONIC POLITICS: THE DEATH OF THE 4TH WALL",
        author: "DIRECTOR OF SUBVERSION",
        date: "2024-08-05",
        category: "POLITICAL",
        threatLevel: "MAXIMUM",
        readingTime: "15 MIN",
        excerpt: "Campaigning in the age of the 'Doomscroll'. Why the most absurd candidate always gains the most traction.",
        content: "Policy is dead. Only the meme remains. We break down the semiotics of the 2024 election cycles where candidates were forced to adopt the personas of their own parodies to survive the algorithmic meat-grinder.",
        tags: ["PSYOP", "DEMOCRACY.EXE", "CHAOS"],
        color: "var(--black)"
    },
    {
        id: "intel-004",
        title: "FOUNDER HAGIOGRAPHY AND THE CULT OF THE PIVOT",
        author: "RECOVERING VC",
        date: "2024-07-19",
        category: "FOUNDER PAIN",
        threatLevel: "MODERATE",
        readingTime: "6 MIN",
        excerpt: "Why failing at a SaaS for dog walkers is the ultimate status symbol in the current tech landscape.",
        content: "The 'Pivot' is the secular version of a resurrection. We interview three founders who successfully spent $10M in seed funding to produce a single, high-quality meme about how hard it is to be a founder.",
        tags: ["BURN RATE", "EGO", "COGNITIVE DISSONANCE"],
        color: "var(--white)"
    },
    {
        id: "intel-005",
        title: "THE GEN ALPHA LORE BARRIER",
        author: "CULTURE WATCHER #09",
        date: "2024-06-30",
        category: "CULTURE",
        threatLevel: "UNSETTLED",
        readingTime: "10 MIN",
        excerpt: "If you can't understand the joke, you are the target of the joke. Understanding the new linguistic divide.",
        content: "We are witnessing a total breakdown of cross-generational communication. The terminology is evolving faster than the Oxford English Dictionary can track. By the time this article is published, the word 'Skibidi' will already be obsolete.",
        tags: ["SLANG", "EVOLUTION", "TERMINAL"],
        color: "var(--red)"
    }
];

// Utility function to inject blog posts into the UI
function renderBriefingRoom() {
    const container = document.getElementById('briefingGrid');
    if (!container) return;

    container.innerHTML = blogData.map(post => `
        <article class="blog-card" style="border: var(--border-width) solid var(--black); padding: 20px; background: var(--white); box-shadow: var(--shadow-small); position: relative;">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--black); padding-bottom: 10px; margin-bottom: 15px;">
                <span style="font-weight: bold; background: ${post.color}; color: ${post.color === 'var(--black)' ? 'white' : 'black'}; padding: 2px 8px; border: 2px solid black;">${post.category}</span>
                <span style="font-family: 'Space Mono'; font-size: 0.8rem;">ID: ${post.id}</span>
            </div>
            <h2 style="font-family: 'Archivo Black'; text-transform: uppercase; line-height: 1.1; margin-bottom: 15px; font-size: 1.5rem;">${post.title}</h2>
            <p style="font-weight: bold; margin-bottom: 15px; color: #444;">${post.excerpt}</p>
            <div style="font-size: 0.8rem; margin-bottom: 20px;">
                <strong>AUTHOR:</strong> ${post.author}<br>
                <strong>THREAT LEVEL:</strong> <span style="color: var(--red); font-weight: bold;">${post.threatLevel}</span><br>
                <strong>DATE:</strong> ${post.date}
            </div>
            <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 20px;">
                ${post.tags.map(tag => `<span style="font-size: 0.7rem; border: 1px solid black; padding: 1px 4px;">#${tag}</span>`).join('')}
            </div>
            <button class="action-btn" style="width: 100%; padding: 10px; background: var(--black); color: var(--white); border: none; font-family: 'Archivo Black'; cursor: pointer;">DECRYPT FULL BRIEFING</button>
        </article>
    `).join('');
}

// Export for use in main application
if (typeof module !== 'undefined') {
    module.exports = blogData;
}