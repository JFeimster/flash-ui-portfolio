import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFile = process.argv[2];
if (!sourceFile) throw new Error('Usage: node scripts/import-prompt-recipes.mjs <local registry path>');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const expected = ['flashprompt','landingpage','tool','dashboard','widget','repo','monetize','upgrade','variants','killfluff','brandfit','staticexport'];
const directives = {
  flashprompt: 'Reorganize this idea into a complete build prompt with audience, pages, interactions, design direction, constraints, and deliverables. Preserve the source intent and mark unknowns.',
  landingpage: 'Shape a conversion page with a clear offer, proof needs, objections, accessible sections, and one primary action. Do not invent proof.',
  tool: 'Specify user inputs, validation, core logic, outputs, edge cases, and a useful next action for an interactive tool.',
  dashboard: 'Define the primary decisions, data states, hierarchy, filters, responsive layout, and empty/loading/error states for a dashboard.',
  widget: 'Describe an embeddable interface, host constraints, sizing, configuration, accessibility, and a standalone fallback.',
  repo: 'Turn the concept into a repository plan with file structure, setup, tests, and local run instructions. Do not claim a repository already exists.',
  monetize: 'Evaluate optional revenue paths, pricing assumptions, conversion points, and measurement needs. Label every unverified assumption.',
  upgrade: 'Identify vague requirements, missing states, accessibility gaps, and implementation risks, then revise the working instructions.',
  variants: 'Propose three distinct design or product directions, with tradeoffs and a recommended starting point.',
  killfluff: 'Replace vague claims with observable behaviors, explicit acceptance criteria, and concrete interface copy.',
  brandfit: 'Align tone, visual choices, audience, and actions with the specified brand. Keep unknown brand rules as open questions.',
  staticexport: 'Constrain the implementation to static HTML, CSS, and JavaScript. Identify which features require a backend and provide local-only fallbacks.'
};
const byId = new Map(source.entries.map(entry => [entry.id, entry]));
for (const id of expected) if (!byId.has(id)) throw new Error(`Missing command ${id}`);
const recipes = expected.map(id => {
  const entry = byId.get(id);
  return {id, command: entry.command, purpose: entry.purpose, required_input: entry.input_needed,
    expected_output: entry.expected_output, instruction: directives[id]};
});
fs.writeFileSync(path.join(root, 'data/prompt-recipes.public.json'), JSON.stringify({
  schema_version: '1.0.0', source: 'Public-safe projection of flash-ui-prompt-commands.registry(1).json', recipes
}, null, 2) + '\n');
console.log(`Imported ${recipes.length} public prompt recipes.`);
