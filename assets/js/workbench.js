(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const node = (tag, className = '', value = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  };
  const params = new URLSearchParams(location.search);
  const id = params.get('idea');
  const status = message => { $('#workbenchStatus').textContent = message; };
  const count = value => ({ words: value.trim().split(/\s+/).filter(Boolean).length, characters: value.length });
  const fields = [
    ['audience','Target audience'],['brand','Brand'],['theme','Visual design theme'],['type','Page or product type'],
    ['framework','Framework'],['functionality','Required functionality'],['integrations','Data and integrations'],
    ['monetization','Monetization approach'],['conversion','Conversion goal'],['output','Output format']
  ];
  const toolTypes = /calculator|assessment|generator|quiz|directory|widget|tool|decision|funnel/i;
  let idea, original, draft, recipes, blueprint;
  const draftKey = () => `flash-ui-workbench-draft:${id}`;

  async function copy(value) {
    try { await navigator.clipboard.writeText(value); status('Copied to clipboard.'); }
    catch { status('Clipboard access was blocked. Select the text and copy it manually.'); }
  }
  function download(name, value) {
    const url = URL.createObjectURL(new Blob([value], {type: 'text/markdown'}));
    const anchor = node('a'); anchor.href = url; anchor.download = name;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status('Download started.');
  }
  function handoff(value) {
    try {
      sessionStorage.setItem('flash-ui-generator-handoff:v1', JSON.stringify({ideaId: id, prompt: value}));
      location.href = `${idea.generator_url}&handoff=1`;
    } catch { status('This browser could not hand off the draft. Copy it and open the Site Generator manually.'); }
  }
  function setMode(mode) {
    if (!['overview','structured','original','remix','tool'].includes(mode) ||
      (mode === 'tool' && !toolTypes.test(`${idea.asset_type} ${idea.archetype}`))) mode = 'overview';
    for (const button of document.querySelectorAll('[data-mode]')) {
      const selected = button.dataset.mode === mode;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-current', selected ? 'page' : 'false');
    }
    for (const name of ['overview','structured','original','remix','tool']) $(`#${name}Mode`).hidden = name !== mode;
    params.set('mode', mode);
    history.replaceState(null, '', `${location.pathname}?${params}`);
  }
  function item(label, value) {
    const wrapper = node('div', 'overview-item');
    wrapper.append(node('dt', '', label), node('dd', '', value || 'Not specified'));
    return wrapper;
  }
  function renderOverview() {
    const list = node('dl', 'overview-grid');
    list.append(item('Audience', idea.target_audience), item('Primary action', idea.primary_cta),
      item('Format', idea.asset_type), item('Category', idea.category),
      item('Design direction', idea.design_style || idea.archetype),
      item('Starter', idea.starter), item('Workflow', idea.workflow),
      item('Key features', idea.key_features?.join(' · ')),
      item('Expected outcome', idea.tool_opportunity?.user_output),
      item('Technical constraints', 'See original prompt; no additional constraints inferred.'));
    $('#overviewContent').append(list);
    const action = node('a', 'primary-action', 'Read the original prompt →');
    action.href = `/workbench/?idea=${encodeURIComponent(id)}&mode=original`;
    action.addEventListener('click', event => { event.preventDefault(); setMode('original'); });
    $('#overviewContent').append(action);
  }
  function splitSections(prompt) {
    const heading = /^(?:#{1,6}\s+|[A-Z][^:\n]{2,55}:\s*$)/m;
    if (heading.test(prompt)) {
      const lines = prompt.match(/[^\n]*\n|[^\n]+$/g) || [];
      const parts = []; let current = {title: 'Introduction', text: ''};
      for (const line of lines) {
        if (heading.test(line.trimEnd())) {
          if (current.text) parts.push(current);
          current = {title: line.trim().replace(/^#+\s*/, '').replace(/:$/, ''), text: ''};
        }
        current.text += line;
      }
      if (current.text) parts.push(current);
      return parts;
    }
    const sentences = prompt.split(/(?<=[.!?])(?=\s)/);
    const parts = []; let body = '';
    for (const sentence of sentences) {
      if (body.length >= 700) { parts.push({title: `Part ${parts.length + 1}`, text: body}); body = ''; }
      body += sentence;
    }
    if (body) parts.push({title: `Part ${parts.length + 1}`, text: body});
    return parts;
  }
  function renderSections() {
    const parts = splitSections(original);
    if (parts.map(part => part.text).join('') !== original) throw new Error('Structured outline changed the original prompt');
    for (const part of parts) {
      const article = node('article', 'prompt-section');
      const top = node('div', 'section-top');
      top.append(node('h3', '', part.title));
      const button = node('button', '', 'Copy section'); button.type = 'button';
      button.addEventListener('click', () => copy(part.text));
      top.append(button);
      article.append(top, node('pre', 'section-text', part.text));
      $('#sectionList').append(article);
    }
  }
  function renderOriginal(term = '') {
    const target = $('#originalText');
    target.replaceChildren();
    if (!term) { target.textContent = original; $('#promptSearchCount').textContent = ''; return; }
    const lower = original.toLocaleLowerCase();
    const needle = term.toLocaleLowerCase();
    let cursor = 0, hits = 0, found;
    while ((found = lower.indexOf(needle, cursor)) !== -1) {
      target.append(document.createTextNode(original.slice(cursor, found)));
      const mark = node('mark', '', original.slice(found, found + term.length));
      target.append(mark); hits++; cursor = found + term.length;
    }
    target.append(document.createTextNode(original.slice(cursor)));
    $('#promptSearchCount').textContent = `${hits} ${hits === 1 ? 'match' : 'matches'}`;
    target.querySelector('mark')?.scrollIntoView({block: 'center'});
  }
  function saveDraft() {
    draft = $('#draftText').value;
    $('#draftStats').textContent = `${count(draft).words.toLocaleString()} words · ${count(draft).characters.toLocaleString()} characters`;
    try { localStorage.setItem(draftKey(), draft); }
    catch { status('Draft could not be saved in this browser. Download a copy.'); }
  }
  function renderRemix() {
    const suggestions = {audience: idea.target_audience, brand: idea.brand, type: idea.asset_type,
      framework: idea.starter, conversion: idea.primary_cta};
    for (const [key, label] of fields) {
      const wrapper = node('label', 'remix-field', label);
      const input = document.createElement(key === 'functionality' || key === 'integrations' ? 'textarea' : 'input');
      input.dataset.remixField = key;
      input.placeholder = suggestions[key] || 'Optional';
      wrapper.append(input); $('#remixFields').append(wrapper);
    }
    try { draft = localStorage.getItem(draftKey()) ?? original; }
    catch { draft = original; }
    $('#draftText').value = draft;
    saveDraft();
    $('#draftText').addEventListener('input', saveDraft);
    $('#composeDraft').addEventListener('click', () => {
      const instructions = fields.map(([key, label]) => [label, document.querySelector(`[data-remix-field="${key}"]`).value.trim()])
        .filter(([, value]) => value).map(([label, value]) => `- ${label}: ${value}`);
      $('#draftText').value = original + (instructions.length ? `\n\n## Requested changes\n${instructions.join('\n')}` : '');
      saveDraft(); status('Working draft composed from the original and your controls.');
    });
    $('#copyDraft').addEventListener('click', () => copy($('#draftText').value));
    $('#downloadDraft').addEventListener('click', () => download(`${idea.slug}-remix.md`, $('#draftText').value));
    $('#resetDraft').addEventListener('click', () => { $('#draftText').value = original; saveDraft(); status('Working draft restored to the original prompt.'); });
    $('#openGenerator').addEventListener('click', () => handoff($('#draftText').value));
  }
  function renderRecipes() {
    for (const recipe of recipes) {
      const details = node('details', 'recipe');
      const summary = node('summary', '', `${recipe.command} · ${recipe.purpose}`);
      details.append(summary);
      details.append(node('p', '', `Input: ${recipe.required_input}`), node('p', '', `Expected output: ${recipe.expected_output}`),
        node('p', 'recipe-instruction', recipe.instruction));
      const apply = node('button', '', 'Apply to draft'); apply.type = 'button';
      apply.addEventListener('click', () => { $('#draftText').value += `\n\n## Prompt recipe: ${recipe.command}\n${recipe.instruction}`; saveDraft(); status(`${recipe.command} instructions added to your local draft.`); });
      const copyButton = node('button', '', 'Copy instructions'); copyButton.type = 'button';
      copyButton.addEventListener('click', () => copy(recipe.instruction));
      const actions = node('div', 'prompt-actions'); actions.append(apply, copyButton);
      details.append(actions); $('#recipeList').append(details);
    }
  }
  function renderTool() {
    const values = idea.tool_opportunity || {};
    const rows = [
      ['Problem solved', values.problem_solved], ['Target persona', values.target_persona || idea.target_audience],
      ['User inputs', values.user_inputs], ['Core logic', values.core_logic], ['User output', values.user_output],
      ['Shareable artifact', values.shareable_artifact], ['Primary CTA', values.primary_cta || idea.primary_cta],
      ['Lead capture', values.lead_capture], ['SEO opportunity', values.seo_opportunity],
      ['Distribution format', values.distribution_format], ['Integration potential', values.integration_potential],
      ['Build complexity', values.build_complexity || idea.complexity]
    ];
    const list = node('dl', 'overview-grid');
    for (const [label, value] of rows) list.append(item(label, Array.isArray(value) ? value.join(', ') : value || 'To define'));
    $('#toolContent').append(list);
    blueprint = `# Tool blueprint: ${idea.title}\n\n${rows.map(([label, value]) => `## ${label}\n${Array.isArray(value) ? value.join(', ') : value || 'To define'}\n`).join('\n')}\n## Interface and technical requirements\nFormat: ${idea.asset_type}. Proposed starter: ${idea.starter || 'To define'}.\n\n## Possible integrations\n${idea.integration_candidates?.map(x => x.id).join(', ') || 'To define'}\n`;
    $('#copyBlueprint').addEventListener('click', () => copy(blueprint));
    $('#downloadBlueprint').addEventListener('click', () => download(`${idea.slug}-tool-blueprint.md`, blueprint));
    $('#blueprintGenerator').addEventListener('click', () => handoff(blueprint));
  }

  async function init() {
    try {
      if (!id) throw new Error('No idea selected');
      const [catalogResponse, recipeResponse] = await Promise.all([
        fetch('/data/ideas-discovery-index.json'), fetch('/data/prompt-recipes.public.json')]);
      if (!catalogResponse.ok || !recipeResponse.ok) throw new Error('Workbench data unavailable');
      const catalog = await catalogResponse.json();
      idea = catalog.ideas.find(item => item.id === id);
      if (!idea) throw new Error('Idea unavailable');
      recipes = (await recipeResponse.json()).recipes;
      const promptResponse = await fetch(idea.prompt_url);
      if (!promptResponse.ok) throw new Error('Original prompt unavailable');
      const payload = await promptResponse.json();
      if (payload.id !== id || typeof payload.prompt !== 'string') throw new Error('Prompt mismatch');
      original = payload.prompt;
      $('#ideaTitle').textContent = idea.title;
      $('#ideaSummary').textContent = idea.summary;
      $('#detailLink').href = idea.detail_url;
      $('#sourceNote').textContent = `Source: data/site-generator-prompts.json · ${idea.id} · Original is read only`;
      const stats = count(original);
      $('#promptStats').textContent = `${stats.words.toLocaleString()} words · ${stats.characters.toLocaleString()} characters`;
      renderOverview(); renderSections(); renderOriginal(); renderRemix(); renderRecipes();
      if (toolTypes.test(`${idea.asset_type} ${idea.archetype}`)) { $('[data-mode="tool"]').hidden = false; renderTool(); }
      for (const button of document.querySelectorAll('[data-mode]')) button.addEventListener('click', () => setMode(button.dataset.mode));
      $('#promptSearch').addEventListener('input', event => renderOriginal(event.target.value));
      $('#copyOriginal').addEventListener('click', () => copy(original));
      $('#downloadOriginal').addEventListener('click', () => download(`${idea.slug}-original.md`, original));
      $('#fullScreen').addEventListener('click', () => {
        $('#originalMode').classList.toggle('full-screen');
        $('#fullScreen').textContent = $('#originalMode').classList.contains('full-screen') ? 'Exit full screen' : 'Full screen';
      });
      setMode(params.get('mode') || 'overview');
      document.title = `${idea.title} · Prompt Workbench`;
    } catch (error) {
      $('#ideaTitle').textContent = 'Workbench unavailable';
      $('#ideaSummary').textContent = 'This idea may have been removed or hidden. Return to the public idea directory.';
      status(error.message);
    }
  }
  init();
})();
