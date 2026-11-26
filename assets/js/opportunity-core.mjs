// Decisions derived from local catalog evidence. No market or revenue claims.
export const recipes = Object.freeze({
  'lead-magnet': {label:'Lead magnet', steps:['Adapt the offer and audience copy','Choose a separately configured lead form','Review privacy copy and disclosures','Test the public route and mobile layout']},
  embed: {label:'Embed', steps:['Check iframe dimensions and host policy','Review external dependencies and CSP','Test the embed on the target host','Document fallback link and accessibility']},
  'white-label': {label:'White-label package', steps:['Identify replaceable brand assets and copy','Document license and source ownership','Create a client configuration checklist','Test the exported package with client branding']},
  standalone: {label:'Standalone product', steps:['Audit source and runtime dependencies','Define authentication and data requirements','Test all interactions and responsive states','Prepare deployment and support handoff']}
});
const clean = value => String(value || '').trim();
const norm = value => clean(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function readiness(asset = {}) {
  const checks = [
    {id:'source',label:'Recorded source entry',passed:Boolean(asset.sourcePath),evidence:asset.sourcePath || null},
    {id:'route',label:'Public route recorded',passed:Boolean(asset.previewPath),evidence:asset.previewPath || null},
    {id:'package',label:'Package files recorded',passed:Array.isArray(asset.files) && asset.files.length > 0,evidence:asset.files?.length ? `${asset.files.length} files in data/asset-packages.json` : null},
    {id:'dependencies',label:'No missing local files',passed:Array.isArray(asset.missingFiles) && asset.missingFiles.length === 0,evidence:Array.isArray(asset.missingFiles) ? `${asset.missingFiles.length} missing files in package manifest` : null},
    {id:'external',label:'No recorded external dependencies',passed:Array.isArray(asset.externalDependencies) && asset.externalDependencies.length === 0,evidence:Array.isArray(asset.externalDependencies) ? `${asset.externalDependencies.length} external dependencies in package manifest` : null}
  ];
  return {score:checks.filter(c=>c.passed).length,maximum:checks.length,meaning:'Local package evidence coverage only; not quality, commercial demand, or production readiness',checks};
}
export function promotionChecklist(asset = {}) {
  return [
    {id:'ownership',label:'Confirm source ownership and reuse rights',evidence:asset.sourcePath || null,verified:false},
    {id:'interaction',label:'Test interactions and mobile layout',evidence:null,verified:false},
    {id:'content',label:'Replace demo content and check claims',evidence:null,verified:false},
    {id:'dependency',label:'Resolve missing and external dependencies',evidence:`${asset.missingFiles?.length || 0} missing; ${asset.externalDependencies?.length || 0} external`,verified:false},
    {id:'distribution',label:'Review target host, privacy, disclosures and license',evidence:null,verified:false}
  ];
}
export function dryRun(asset, recipeId, config = {}) {
  const recipe = recipes[recipeId];
  if (!recipe) throw Error('Unknown recipe');
  if (!asset?.previewPath) throw Error('Choose a packaged source');
  const gaps = [];
  if (!clean(config.audience)) gaps.push('Target audience');
  if (!clean(config.action)) gaps.push('Primary action');
  if (recipeId === 'embed' && !clean(config.host)) gaps.push('Target host');
  if (recipeId === 'white-label' && !clean(config.brand)) gaps.push('Client brand');
  return {schemaVersion:'flash-ui-recipe-preview/v1',mode:'dry-run',recipe:recipeId,asset:{title:asset.title,sourcePath:asset.sourcePath,previewPath:asset.previewPath},configuration:{audience:clean(config.audience),action:clean(config.action),host:clean(config.host),brand:clean(config.brand)},steps:recipe.steps,missingInputs:gaps,readiness:readiness(asset),checklist:promotionChecklist(asset),handoffs:{package:'/use-asset/?asset='+encodeURIComponent(asset.previewPath),adaptation:'/build/?asset='+encodeURIComponent(asset.previewPath)},execution:'No files, deployment, form, or external service was changed.'};
}
export function discoverOpportunities(packages = {}, ideas = []) {
  const entries = Object.values(packages.entries || {});
  const counts = new Map();
  for (const entry of entries) {const key=clean(entry.category) || 'Uncategorized';counts.set(key,(counts.get(key)||0)+1);}
  const builtNames = new Set(entries.map(e=>norm(e.title)));
  const candidates = ideas.filter(i=>i && i.name && !builtNames.has(norm(i.name))).slice(0,100);
  const byType = new Map();
  for (const idea of candidates) {const key=clean(idea.type) || 'Unclassified';if(!byType.has(key))byType.set(key,[]);byType.get(key).push(idea);}
  return [...byType].map(([category,items])=>({category,ideaCount:items.length,packagedCategoryCount:counts.get(category)||0,examples:items.slice(0,5).map(i=>({id:i.id,name:i.name,source:'data/site-generator-prompts.json'})),basis:'Catalog coverage and existing idea records only',externalMarketEvidence:'unverified'})).sort((a,b)=>a.packagedCategoryCount-b.packagedCategoryCount || b.ideaCount-a.ideaCount || a.category.localeCompare(b.category));
}
export function decisionBrief(preview, opportunity) {
  return {schemaVersion:'flash-ui-decision-brief/v1',createdAt:new Date().toISOString(),source:'Flash UI local catalog',recommendation:preview.recipe,asset:preview.asset,readiness:preview.readiness,missingInputs:preview.missingInputs,requiredReview:preview.checklist,steps:preview.steps,opportunity:opportunity || null,distribution:recipes[preview.recipe]?.label,claims:{marketDemand:'unverified',revenue:'not estimated',productionQuality:'not independently verified'},handoffs:preview.handoffs};
}
