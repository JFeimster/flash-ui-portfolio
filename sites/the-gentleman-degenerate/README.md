# The Gentleman Degenerate

This single local project folder contains three independent static site variations.

## Layout

```text
the-gentleman-degenerate/
├── index.html                  # Variation selector
├── variations/
│   ├── dark-luxe/              # Original editorial lounge
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── app.js
│   │   └── assets/lounge.jpg
│   ├── dada-riot/              # Punk zine interpretation
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── app.js
│   │   └── lounge.jpg
│   └── neo-brutalist-jester/   # Bold digital printshop
│       ├── index.html
│       ├── styles.css
│       ├── app.js
│       └── lounge.jpg
├── transferable-design-themes.json
├── BUILD-PROMPT.md
└── runner-brief.json
```

The original root `index.html` remains the Dark Luxe live page to preserve its URL and anchors. Open `variations/index.html` to choose a variation. Each variation can also be opened directly and is self-contained for a later static deployment. No build step is required.

The Dada Riot and Neo-Brutalist Jester designs follow their entries in `transferable-design-themes.json`. The newsletter forms are visual prototypes: they validate email addresses but do not send or store them.
