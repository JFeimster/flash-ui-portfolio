(async () => {
  const host = document.querySelector('#variants');
  const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  try {
    const response = await fetch('/data/jester-quotes-editions.json');
    if (!response.ok) throw new Error('Variation data unavailable');
    const variations = await response.json();
    if (!Array.isArray(variations) || variations.length !== 8) throw new Error('Variation registry invalid');
    host.innerHTML = variations.map(edition => {
      const canonical = new URL(edition.destination, 'https://jester-quotes.vercel.app/').href;
      const screenshot = edition.default ? '/assets/previews/jester-quotes.webp' : `/assets/previews/jester-editions/${edition.slug}.png`;
      const image = `<img src="${esc(screenshot)}" alt="Actual ${esc(edition.name)} page capture" loading="lazy">`;
      return `<article class="card"><div class="preview preview--${esc(edition.slug)}">${image}</div><div class="copy"><span class="status">${edition.status === 'full' ? 'Full site · Public default' : 'Design preview'}</span><h2>${esc(edition.name)}${edition.default ? ' — Default' : ''}</h2><p>${esc(edition.description)}</p><a href="${esc(canonical)}">Open ${edition.default ? 'default site' : 'design preview'} ↗</a>${edition.default ? '<a class="secondary" href="/sites/jester-quotes/">Open static import ↗</a>' : ''}</div></article>`;
    }).join('');
  } catch (error) {
    host.innerHTML = '<p>Variation data is temporarily unavailable. <a href="/sites/jester-quotes/">Open the Dada Riot static import ↗</a></p>';
  }
})();
