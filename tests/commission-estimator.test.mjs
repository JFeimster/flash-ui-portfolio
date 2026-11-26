import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const slug = 'commission-estimator';
const base = `sites/${slug}`;

test('Commission Estimator is discoverable as one four-variant gallery', () => {
  const registry = read('data/site-registry.json').filter(x => x.slug === slug);
  assert.equal(registry.length, 1);
  const entry = registry[0];
  for (const [key, expected] of Object.entries({ title: 'Commission Estimator', subtitle: 'Funding Partner & Agency Revenue Simulator', category: 'Funding Tools', subcategory: 'Commission Modeling', productType: 'Calculator', industry: 'Financial Services', type: 'group-hub', status: 'portfolio-site', source: 'curated-canonical-registry', path: base, livePath: `/${base}/`, defaultVariant: 1, hasIndex: true, lifecycle: 'active-development' })) assert.equal(entry[key], expected, key);
  assert.deepEqual(entry.variantNumbers, [1, 2, 3, 4]);
  assert.deepEqual(entry.distribution, ['standalone', 'embed', 'portfolio-preview']);
  const routes = read('data/asset-route-resolution.json');
  const group = routes.groups.filter(x => x.groupId === slug);
  assert.equal(group.length, 1);
  assert.equal(group[0].variantCount, 4);
  const entries = routes.entries.filter(x => x.canonicalGroupId === slug);
  assert.equal(entries.length, 5);
  assert.ok(entries.every(x => x.resolutionStatus === 'resolved'));
  for (const entry of entries) assert.ok(fs.existsSync(path.join(entry.resolvedPath.slice(1), 'index.html')));
  assert.equal(read('data/asset-showcase.json').projects[slug].title, 'Commission Estimator');
  assert.equal(read('data/variant-route-contracts.json').groups.find(x => x.groupId === slug).variants.length, 4);
  const loader = fs.readFileSync('assets/js/app.js', 'utf8');
  assert.ok(loader.includes('/data/asset-route-resolution.json'));
  assert.ok(loader.includes('/data/asset-showcase.json'));
  const gallery = fs.readFileSync(`${base}/index.html`, 'utf8');
  for (let i = 1; i <= 4; i++) assert.ok(gallery.includes(`./variant-${i}/index.html`));
});

test('nested portfolio variants resolve local imports and assets with calculation parity', async () => {
  const config = (await import(pathToFileURL(path.resolve(`${base}/shared/config/commission-config.js`)))).COMMISSION_CONFIG;
  const stateModule = await import(pathToFileURL(path.resolve(`${base}/shared/lib/state.js`)));
  const engine = await import(pathToFileURL(path.resolve(`${base}/shared/lib/calculator-engine.js`)));
  const state = stateModule.createBaselineDemoState(config);
  assert.equal(engine.calculateCommissions(state, config).monthlyGrossCommission, 15000);
  for (let i = 1; i <= 4; i++) {
    const folder = `${base}/variant-${i}`;
    for (const file of ['index.html', 'script.js']) {
      const content = fs.readFileSync(`${folder}/${file}`, 'utf8');
      for (const match of content.matchAll(/from\s*["'](\.[^"']+)["']|(?:src|href)=["'](\.\/[^"'#?]+)["']/g)) assert.ok(fs.existsSync(path.resolve(folder, match[1] || match[2])), `${folder}: ${match[0]}`);
    }
    const localEngine = await import(pathToFileURL(path.resolve(folder, '../shared/lib/calculator-engine.js')));
    assert.deepEqual(localEngine.calculateCommissions(state, config), engine.calculateCommissions(state, config));
  }
  const links = await import(pathToFileURL(path.resolve(`${base}/shared/config/partner-links.js`)));
  assert.equal(links.PARTNER_LINKS.leadCaptureEndpoint, null);
  assert.equal(links.PARTNER_LINKS.becomePartnerUrl, null);
});
