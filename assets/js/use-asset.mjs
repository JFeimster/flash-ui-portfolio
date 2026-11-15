import { createZip } from './zip-store.mjs';

const shell = document.querySelector('#assetShell');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const route = new URLSearchParams(location.search).get('asset');
const slug = value => String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 55);
const textFiles = entry => entry.files.map(file => file.name).join(', ');
function customizationPrompt(entry) {
  return `Customize the static site "${entry.title}" using the attached project files.\n\n` +
    `Preview route: ${entry.previewPath}\nCategory: ${entry.category || 'Static site'}\n` +
    `${entry.variantNumber ? `Variant: ${entry.variantNumber}\n` : ''}` +
    `${entry.description ? `Current description: ${entry.description}\n` : ''}` +
    `\nActual files in this package: ${textFiles(entry)}.\n\n` +
    `Keep index.html as the entrypoint. Preserve working interactions and local asset paths. ` +
    `Replace the current branding, copy, imagery, links, and calls to action with my supplied details. ` +
    `If details are missing, mark them as placeholders instead of inventing claims or connected services. ` +
    `Keep the project as static HTML/CSS/JavaScript unless I request another stack. ` +
    `Check the layout on mobile and desktop, test links and scripts, and list any external fonts or services that still need setup.\n`;
}
function readme(entry) {
  return `# ${entry.title}\n\nThis ZIP contains the static source files shown in the Flash UI Portfolio. ` +
    `The site entrypoint is index.html. No npm install or build is required.\n\n` +
    `## Local preview\n\n1. Extract this ZIP.\n2. Open a terminal in the extracted folder.\n3. Run: python -m http.server 4173\n4. Open http://127.0.0.1:4173/\n\n` +
    `## Customize\n\nEdit index.html and the included CSS/JS/assets. Use CUSTOMIZE.md as a starting prompt. ` +
    `External fonts or services referenced by the source may need your own setup.\n\n` +
    `## Publish\n\nDeploy the extracted folder as a static site using your preferred host. ` +
    `For Vercel CLI, run npx vercel in this folder, then npx vercel --prod when you are ready to publish. ` +
    `Review links, forms, content, and any external dependencies before publishing.\n\n` +
    `Source preview: ${entry.previewPath}\nFiles: ${textFiles(entry)}\n`;
}
function unavailable() {
  shell.innerHTML = `<nav><a href="/sites/">← Portfolio</a></nav><h1>Asset package unavailable</h1><p>This preview does not have a verified static source package.</p>`;
}
async function init() {
  const response = await fetch('/data/asset-packages.json');
  if (!response.ok) throw new Error('Asset package list unavailable.');
  const entry = (await response.json()).entries?.[route];
  if (!entry) return unavailable();
  document.title = `Use ${entry.title} · Flash UI Portfolio`;
  const prompt = customizationPrompt(entry);
  shell.innerHTML = `<nav><a href="/sites/">← Portfolio</a><a href="${esc(entry.previewPath)}" target="_blank" rel="noopener">Open original ↗</a></nav>
    <header><p class="eyebrow">Static site source</p><h1>Use ${esc(entry.title)}</h1><p>${esc(entry.description || 'Download the source, make it yours, and publish it as a static site.')}</p>
    <div class="asset-actions"><button type="button" id="downloadAsset">Download project ZIP</button><button type="button" id="copyPrompt">Copy customization prompt</button></div><p id="assetStatus" role="status" aria-live="polite">${entry.files.length} source files included</p></header>
    <section class="preview"><div class="section-head"><h2>Live preview</h2><a href="${esc(entry.previewPath)}" target="_blank" rel="noopener">Open full size ↗</a></div><iframe src="${esc(entry.previewPath)}" title="Preview of ${esc(entry.title)}" loading="lazy"></iframe></section>
    <section class="instructions"><div><h2>Customize</h2><p>Use this prompt with the extracted files. It names the actual source files in this package.</p><pre id="promptText"></pre></div><div><h2>Run locally</h2><ol><li>Extract the ZIP.</li><li>Open a terminal in the extracted folder.</li><li>Run <code>python -m http.server 4173</code>.</li><li>Visit <code>http://127.0.0.1:4173/</code>.</li></ol><h2>Publish</h2><p>Deploy that folder as a static site. With Vercel CLI, run <code>npx vercel</code>, then <code>npx vercel --prod</code> when ready.</p></div></section>`;
  document.querySelector('#promptText').textContent = prompt;
  const status = document.querySelector('#assetStatus');
  document.querySelector('#copyPrompt').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(prompt); status.textContent = 'Customization prompt copied.'; }
    catch { status.textContent = 'Copy failed. Select the prompt text below instead.'; }
  });
  document.querySelector('#downloadAsset').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true; status.textContent = 'Preparing project ZIP…';
    try {
      const files = await Promise.all(entry.files.map(async file => {
        const response = await fetch(file.source);
        if (!response.ok) throw new Error(`Could not fetch ${file.name}.`);
        return { name: file.name, bytes: new Uint8Array(await response.arrayBuffer()) };
      }));
      files.push({ name: 'CUSTOMIZE.md', bytes: prompt }, { name: 'README.md', bytes: readme(entry) });
      const blob = createZip(files);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `${slug(entry.title)}-static-site.zip`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = `Project ZIP ready: ${files.length} files.`;
    } catch (error) { status.textContent = error.message || 'Package could not be prepared.'; }
    finally { button.disabled = false; }
  });
}
init().catch(() => { unavailable(); });
