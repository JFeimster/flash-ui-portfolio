#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryArgIndex = process.argv.indexOf('--registry-dir');
const registryRoot = registryArgIndex >= 0
  ? path.resolve(process.argv[registryArgIndex + 1] || '')
  : path.resolve(repoRoot, '..', '..', 'JSON', 'Private & Shared', 'Registries');

function readJson(fileName) {
  const fullPath = path.join(registryRoot, fileName);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

const prompts = readJson('flash-ui-prompts.registry.json');
const factory = readJson('flash-ui-project-factory.registry.json');
const factoryById = new Map((factory.entries || []).map((entry) => [entry.id, entry]));
const eligible = (prompts.entries || []).flatMap((entry) => {
  const enriched = factoryById.get(entry.id);
  const metadata = enriched?.factory;
  return metadata && ['site-idea', 'design-template'].includes(metadata.kind) ? [{ entry, metadata }] : [];
});
const collectProfiles = (group, ids) => Object.fromEntries([...new Set(ids.filter(Boolean))]
  .filter((id) => factory[group]?.[id])
  .map((id) => [id, factory[group][id]]));
const factoryResources = {
  architecture_profiles: collectProfiles('architecture_profiles', eligible.map(({ metadata }) => metadata.architecture_profile)),
  starter_profiles: collectProfiles('starter_profiles', eligible.map(({ metadata }) => metadata.starter)),
  workflows: collectProfiles('workflows', eligible.map(({ metadata }) => metadata.workflow)),
};

const entries = eligible.map(({ entry, metadata }) => ({
    id: entry.id,
    name: entry.name || entry.id,
    type: entry.type || 'Site idea',
    brand: entry.brand || '',
    visitor_psychology: entry.visitor_psychology || '',
    primary_cta: entry.primary_cta || '',
    prompt: entry.prompt || '',
    factory: {
      kind: metadata.kind,
      archetype: metadata.archetype || '',
      starter: metadata.starter || '',
      starter_selection: metadata.starter_selection || null,
      brief: metadata.brief || {},
      planning: metadata.planning || {},
      architecture_profile: metadata.architecture_profile || '',
      workflow: metadata.workflow || '',
      integration_candidates: metadata.integration_candidates || [],
      output: metadata.output || {},
    },
  }));

const additionsPath = path.join(repoRoot, 'data', 'site-generator-prompt-additions.json');
const additions = JSON.parse(fs.readFileSync(additionsPath, 'utf8'));
const knownIds = new Set(entries.map((entry) => entry.id));
for (const entry of additions.entries || []) {
  if (!knownIds.has(entry.id)) entries.push(entry);
}

const output = {
  schema_version: 'flash-ui-site-generator-library/v1',
  registry_schema_version: factory.schema_version || null,
  entry_count: entries.length,
  factory_resources: factoryResources,
  entries,
};
fs.writeFileSync(path.join(repoRoot, 'data', 'site-generator-prompts.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Wrote ${entries.length} site ideas/templates to data/site-generator-prompts.json`);
