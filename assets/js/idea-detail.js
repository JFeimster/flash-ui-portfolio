(() => {
  'use strict';
  const id = document.body.dataset.ideaId;
  const root = document.getElementById('idea-detail');
  const node = (tag, className = '', value = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value) element.textContent = value;
    return element;
  };
  const link = (label, href, className = '') => {
    const element = node('a', className, label);
    element.href = href;
    return element;
  };
  const field = (label, value, fallback = 'Not specified') => {
    const wrapper = node('div', 'detail-field');
    wrapper.append(node('dt', '', label), node('dd', '', value || fallback));
    return wrapper;
  };
  const section = (title, className = '') => {
    const element = node('section', className || 'detail-section');
    element.append(node('h2', '', title));
    return element;
  };
  const download = (name, content) => {
    const url = URL.createObjectURL(new Blob([content], {type: 'text/markdown'}));
    const anchor = link('', url);
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const copy = async value => {
    try { await navigator.clipboard.writeText(value); return true; }
    catch { return false; }
  };
  const toolTypes = /calculator|assessment|generator|quiz|directory|widget|tool|decision|funnel/i;

  async function init() {
    try {
      const response = await fetch('/data/ideas-discovery-index.json');
      if (!response.ok) throw new Error('Index unavailable');
      const catalog = (await response.json()).ideas;
      const idea = catalog.find(item => item.id === id && location.pathname === item.detail_url);
      if (!idea) throw new Error('Idea unavailable');
      document.title = `${idea.title} · Flash UI Ideas`;
      const prompt = async () => {
        const result = await fetch(idea.prompt_url);
        if (!result.ok) throw new Error('Original prompt unavailable');
        const record = await result.json();
        if (record.id !== id) throw new Error('Prompt mismatch');
        return record.prompt;
      };
      root.replaceChildren();
      const back = link('← All ideas', '/ideas/', 'back-link');
      const header = node('header', 'detail-hero');
      const eyebrow = node('p', 'eyebrow', 'CONCEPT BRIEF · PROPOSED IDEA');
      const title = node('h1', '', idea.title);
      const summary = node('p', 'detail-summary', idea.summary);
      const chips = node('div', 'detail-chips');
      for (const value of [idea.category, idea.asset_type, idea.development_status]) if (value) chips.append(node('span', 'detail-chip', value));
      header.append(eyebrow, title, summary, chips);
      const toolbar = node('div', 'detail-toolbar');
      toolbar.append(link('View full prompt', `/workbench/?idea=${encodeURIComponent(id)}&mode=original`, 'cta'),
        link('Customize / Remix', `/workbench/?idea=${encodeURIComponent(id)}&mode=remix`, 'detail-button'),
        link('Open in Site Generator', idea.generator_url, 'detail-button'));
      for (const [label, action] of [
        ['Copy prompt', async () => copy(await prompt())],
        ['Download prompt', async () => { download(`${idea.slug}-prompt.md`, await prompt()); return true; }]
      ]) {
        const button = node('button', 'detail-button', label);
        button.type = 'button';
        button.addEventListener('click', async () => {
          try { status.textContent = await action() ? `${label} complete.` : 'Copy was blocked by the browser.'; }
          catch { status.textContent = 'The prompt could not be loaded.'; }
        });
        toolbar.append(button);
      }
      if (idea.live_path) toolbar.append(link('Open related site ↗', idea.live_path, 'detail-button'));
      const status = node('p', 'action-status');
      status.setAttribute('role', 'status');
      const facts = section('At a glance', 'detail-section detail-facts');
      const factsList = node('dl', 'detail-facts-grid');
      factsList.append(field('Brand', idea.brand), field('Audience', idea.target_audience),
        field('Primary action', idea.primary_cta), field('Design archetype', idea.archetype),
        field('Visual style', idea.design_style ? `${idea.design_style}${idea.design_style_source ? ` · ${idea.design_style_source}` : ''}` : '', 'Not specified; choose in the workbench'),
        field('Proposed starter', idea.starter), field('Workflow', idea.workflow),
        field('Development status', idea.development_status, 'Proposed'),
        field('Planning status', idea.planning_status));
      facts.append(factsList);
      const brief = section('Concept brief');
      brief.append(node('p', 'section-intro', 'Source metadata and open decisions. Unspecified details are left open.'));
      const briefList = node('dl', 'detail-facts-grid');
      briefList.append(field('Problem to solve', idea.tool_opportunity?.problem_solved),
        field('Intended users', idea.target_audience), field('Primary user action', idea.primary_cta),
        field('Core features', idea.key_features?.join(' · ')),
        field('Expected output', idea.tool_opportunity?.user_output),
        field('Design direction', idea.design_style || idea.archetype),
        field('Architecture notes', [idea.starter, idea.workflow].filter(Boolean).join(' · ')),
        field('Conversion potential', idea.monetization));
      brief.append(briefList);
      if (idea.integration_candidates?.length) {
        const integrations = node('p', 'detail-note', `Integration candidates for planning: ${idea.integration_candidates.map(item => item.id).join(', ')}. These are not working connections.`);
        brief.append(integrations);
      }
      const assets = section('Connected assets');
      if (idea.assets?.length) {
        const list = node('div', 'asset-list');
        for (const asset of idea.assets) {
          const item = node('div', 'asset-item');
          item.append(link(asset.title, asset.url), node('small', '', `${asset.kind || 'asset'} · ${asset.verification} · ${asset.provenance}`));
          list.append(item);
        }
        assets.append(list);
      } else assets.append(node('p', 'detail-note', 'No recorded public asset connection yet. Similar names alone do not establish a link.'));
      const related = section('Related ideas');
      const ranked = catalog.filter(item => item.id !== id).map(item => ({item,
        score: (item.category === idea.category ? 4 : 0) + (item.archetype === idea.archetype ? 3 : 0) +
          (item.asset_type === idea.asset_type ? 2 : 0) + (item.tags || []).filter(tag => idea.tags?.includes(tag)).length
      })).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title)).slice(0, 4);
      if (ranked.length) {
        const list = node('div', 'related-grid');
        for (const {item} of ranked) {
          const card = node('a', 'related-item');
          card.href = item.detail_url;
          card.append(node('small', '', item.category), node('strong', '', item.title));
          list.append(card);
        }
        related.append(list);
      } else related.append(node('p', 'detail-note', 'No closely related public ideas found.'));
      root.append(back, header, toolbar, status, facts, brief, assets);
      if (toolTypes.test(`${idea.asset_type} ${idea.archetype}`)) root.append(renderBlueprint(idea, download, copy));
      root.append(related);
    } catch {
      root.replaceChildren(node('h1', '', 'Idea unavailable'), node('p', '', 'This concept may have been removed or hidden.'), link('Browse ideas', '/ideas/', 'cta'));
    }
  }

  function renderBlueprint(idea, downloadFile, copyText) {
    const box = section('Tool opportunity', 'detail-section blueprint');
    box.append(node('p', 'section-intro', 'A planning worksheet for tool-oriented concepts. Empty fields are decisions to make, not verified product claims.'));
    const values = idea.tool_opportunity || {};
    const rows = [
      ['Problem solved', values.problem_solved], ['Target persona', values.target_persona || idea.target_audience],
      ['User inputs', values.user_inputs], ['Core logic', values.core_logic], ['User output', values.user_output],
      ['Shareable artifact', values.shareable_artifact], ['Primary CTA', values.primary_cta || idea.primary_cta],
      ['Lead capture opportunity', values.lead_capture], ['SEO opportunity', values.seo_opportunity],
      ['Distribution format', values.distribution_format], ['Integration potential', values.integration_potential],
      ['Build complexity', values.build_complexity || idea.complexity]
    ];
    const list = node('dl', 'detail-facts-grid');
    for (const [label, value] of rows) list.append(field(label, Array.isArray(value) ? value.join(', ') : value, 'To define'));
    box.append(list);
    const markdown = `# Tool blueprint: ${idea.title}\n\n${rows.map(([label, value]) => `## ${label}\n${Array.isArray(value) ? value.join(', ') : value || 'To define'}\n`).join('\n')}\n## Interface and technical requirements\nFormat: ${idea.asset_type}. Proposed starter: ${idea.starter || 'To define'}.\n\n## Possible integrations\n${idea.integration_candidates?.map(x => x.id).join(', ') || 'To define'}\n`;
    const actions = node('div', 'detail-toolbar');
    const copyButton = node('button', 'detail-button', 'Copy blueprint');
    const downloadButton = node('button', 'detail-button', 'Download Markdown');
    const generatorButton = node('button', 'detail-button', 'Use in Site Generator');
    for (const button of [copyButton, downloadButton, generatorButton]) button.type = 'button';
    copyButton.addEventListener('click', async () => { box.querySelector('.blueprint-status').textContent = await copyText(markdown) ? 'Blueprint copied.' : 'Copy was blocked.'; });
    downloadButton.addEventListener('click', () => downloadFile(`${idea.slug}-tool-blueprint.md`, markdown));
    generatorButton.addEventListener('click', () => {
      sessionStorage.setItem('flash-ui-generator-handoff:v1', JSON.stringify({ideaId: idea.id, prompt: markdown}));
      location.href = `${idea.generator_url}&handoff=1`;
    });
    actions.append(copyButton, downloadButton, generatorButton);
    const message = node('p', 'blueprint-status'); message.setAttribute('role', 'status');
    box.append(actions, message);
    return box;
  }
  init();
})();
