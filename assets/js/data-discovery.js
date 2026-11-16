const $ = (id) => document.getElementById(id);
const state = { entries: [], sources: [], references: [] };
const byLabel = (a, b) => String(a).localeCompare(String(b));
const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text != null) el.textContent = text; return el; };
function fill(id, values) {
  const select = $(id);
  [...new Set(values.filter(Boolean))].sort(byLabel).forEach(value => {
    const option = make('option', '', value.replaceAll('-', ' ')); option.value = value; select.append(option);
  });
}
function render() {
  const query = $('search').value.trim().toLowerCase();
  const kind = $('kind').value, category = $('category').value, brand = $('brand').value;
  const matches = state.entries.filter(x => (!kind || x.content_kind === kind) && (!category || x.category === category) && (!brand || x.brand === brand) && (!query || [x.name, x.brand, x.primary_cta, x.category].some(v => String(v || '').toLowerCase().includes(query))));
  $('resultCount').textContent = `${matches.length} of ${state.entries.length} ideas`;
  $('empty').hidden = matches.length !== 0;
  const grid = $('results'); grid.replaceChildren();
  for (const idea of matches) {
    const card = make('article', 'card');
    const meta = make('p', 'card-meta', [idea.content_kind, idea.category].filter(Boolean).join(' · ').replaceAll('-', ' '));
    const title = make('h3', '', idea.name);
    const brandLine = make('p', 'card-brand', idea.brand || 'Independent concept');
    const cta = make('p', 'card-cta', idea.primary_cta ? `CTA: ${idea.primary_cta}` : 'CTA: source prompt');
    const links = make('div', 'card-links');
    const prompt = make('a', '', 'Use in generator ↗'); prompt.href = `/generator/?source=${encodeURIComponent(idea.canonical_prompt_id)}`;
    links.append(prompt);
    if (idea.related_site_group_ids.length) {
      const site = make('a', '', 'Browse related projects ↗'); site.href = '/sites/'; links.append(site);
    }
    const source = make('small', '', `Source: ${idea.source_id} · ID: ${idea.id}${idea.related_external_prompt_ids.length ? ` · ${idea.related_external_prompt_ids.length} external title match candidate` : ''}`);
    card.append(meta, title, brandLine, cta, links, source); grid.append(card);
  }
}
function renderSources() {
  for (const item of state.sources) {
    const card = make('article', 'source-card');
    card.append(make('p', 'card-meta', `${item.kind} · ${item.record_count ?? 'reference'} records`), make('h3', '', item.id.replaceAll('-', ' ')), make('p', '', item.import_policy));
    const link = make('a', '', 'View source ↗'); link.href = item.source_url || item.local_path; card.append(link); $('sources').append(card);
  }
  for (const item of state.references) {
    const link = make('a', '', `${item.name} ↗`); link.href = item.data_url || item.repository_url; link.target = '_blank'; link.rel = 'noopener noreferrer'; $('references').append(link);
  }
}
async function load() {
  try {
    const paths = ['/data/idea-discovery-index.json', '/data/idea-source-index.json', '/data/external-project-references.json'];
    const [ideas, sources, references] = await Promise.all(paths.map(async path => { const response = await fetch(path); if (!response.ok) throw new Error(path); return response.json(); }));
    state.entries = ideas.entries; state.sources = sources.sources; state.references = references.projects;
    fill('kind', state.entries.map(x => x.content_kind)); fill('category', state.entries.map(x => x.category)); fill('brand', state.entries.map(x => x.brand));
    render(); renderSources();
  } catch { $('resultCount').textContent = 'Unavailable'; $('error').hidden = false; }
}
['search', 'kind', 'category', 'brand'].forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', render));
$('reset').addEventListener('click', () => { for (const id of ['search', 'kind', 'category', 'brand']) $(id).value = ''; render(); $('search').focus(); });
load();
