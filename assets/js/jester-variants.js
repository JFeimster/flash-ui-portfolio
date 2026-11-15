(async () => {
  const host = document.querySelector('#editions');
  const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  try {
    const response = await fetch('/data/jester-quotes-editions.json');
    if (!response.ok) throw new Error('Edition data unavailable');
    const editions = await response.json();
    if (!Array.isArray(editions) || editions.length !== 8) throw new Error('Edition registry invalid');
    host.innerHTML = editions.map(edition => {
      const destination = edition.default ? '/sites/jester-quotes/' : `https://jester-quotes.vercel.app${edition.destination}`;
      const canonical = `https://jester-quotes.vercel.app${edition.destination}`;
      const screenshot = edition.default ? '/assets/previews/jester-quotes.webp' : `/assets/previews/jester-editions/${edition.slug}.png`;
      const image = `<img src="${esc(screenshot)}" alt="Actual ${esc(edition.name)} page capture" loading="lazy">`;
      return `<article class="card"><div class="preview preview--${esc(edition.slug)}">${image}</div><div class="copy"><span class="status">${edition.default ? 'Full edition · Public default' : 'Design Preview'}</span><h2>${esc(edition.name)}</h2><p>${esc(edition.description)}</p><a href="${esc(destination)}">Open ${edition.default ? 'Dada Riot static import' : 'design preview'} ↗</a>${edition.default ? `<a class="secondary" href="${esc(canonical)}">Open canonical site ↗</a>` : ''}</div></article>`;
    }).join('');
  } catch (error) {
    host.innerHTML = '<p>Edition data is temporarily unavailable. <a href="/sites/jester-quotes/">Open the Dada Riot static import ↗</a></p>';
  }
})();
