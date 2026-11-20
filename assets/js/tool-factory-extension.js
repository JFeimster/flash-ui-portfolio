(function(root){
'use strict';
const E=root.ToolFactoryEngine,oldValidate=E.validate;
const V2='flash-ui-tool-spec/v2';
const slug=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const validInputs=a=>Array.isArray(a)&&a.length>0&&a.every(x=>x&&slug.test(x.id||'')&&typeof x.label==='string'&&x.label.trim()&&(['number','select','boolean'].includes(x.type))&&(x.type!=='number'||(finite(x.min)&&finite(x.max)&&x.min<=x.max))&&(x.type!=='select'||(Array.isArray(x.options)&&x.options.length>1&&x.options.every(o=>typeof o==='string'&&o.length))));
function validate(spec){
if(spec?.schema_version!==V2)return oldValidate(spec);
const errors=[];
if(!slug.test(spec.id||''))errors.push('ID must be a lowercase slug.');
if(!String(spec.title||'').trim())errors.push('Title is required.');
if(!['comparison','eligibility','decision-tree'].includes(spec.archetype))errors.push('Unsupported v2 archetype.');
if(!Array.isArray(spec.outputs))errors.push('Outputs must be an array.');
if(spec.archetype==='comparison'){
const c=spec.criteria,o=spec.options;
if(!Array.isArray(c)||!c.length||c.some(x=>!slug.test(x.id||'')||!String(x.label||'').trim()||!finite(x.weight)||x.weight<=0))errors.push('Criteria need IDs, labels and positive weights.');
if(!Array.isArray(o)||o.length<2||o.some(x=>!slug.test(x.id||'')||!String(x.label||'').trim()||!x.scores||c?.some(k=>!finite(x.scores[k.id])||x.scores[k.id]<0||x.scores[k.id]>10)))errors.push('Two or more options need scores from 0 to 10 for each criterion.');
if(c?.length>30||o?.length>30)errors.push('Maximum 30 criteria and options.');
}
if(spec.archetype==='eligibility'){
if(!validInputs(spec.inputs))errors.push('Eligibility needs valid typed inputs.');
if(!Array.isArray(spec.rules)||!spec.rules.length||spec.rules.some(r=>!spec.inputs?.some(x=>x.id===r.input)||!['gte','lte','eq'].includes(r.operator)||!String(r.reason||'').trim()))errors.push('Rules need an existing input, operator and explanation.');
if(spec.rules?.length>40)errors.push('Maximum 40 rules.');
}
if(spec.archetype==='decision-tree'){
const nodes=spec.nodes;
if(!Array.isArray(nodes)||!nodes.length||nodes.length>80||nodes.some(n=>!slug.test(n.id||'')||!['question','result'].includes(n.type)||!String(n.text||'').trim()))errors.push('Decision tree needs valid question or result nodes.');
else{
const ids=new Set(nodes.map(n=>n.id));if(ids.size!==nodes.length)errors.push('Node IDs must be unique.');
const rootNode=spec.start||nodes[0].id;if(!ids.has(rootNode))errors.push('Start node not found.');
for(const n of nodes)if(n.type==='question'&&(!Array.isArray(n.options)||n.options.length<2||n.options.some(o=>!String(o.label||'').trim()||!ids.has(o.next))))errors.push('Every question needs two valid branches.');
const seen=new Set(),stack=new Set();function visit(id){if(stack.has(id)){errors.push('Decision tree contains a cycle.');return;}if(seen.has(id))return;seen.add(id);stack.add(id);const n=nodes.find(x=>x.id===id);if(n?.type==='question')n.options.forEach(x=>visit(x.next));stack.delete(id);}if(ids.has(rootNode))visit(rootNode);
if(nodes.some(n=>!seen.has(n.id)))errors.push('Every node must be reachable.');
if(!nodes.some(n=>n.type==='result'))errors.push('At least one result node is required.');
}
}
return [...new Set(errors)];
}
function comparison(spec){const errors=validate(spec);if(errors.length)return {errors};const weight=spec.criteria.reduce((s,c)=>s+c.weight,0);const ranked=spec.options.map(o=>({id:o.id,label:o.label,score:Number((spec.criteria.reduce((s,c)=>s+c.weight*o.scores[c.id],0)/weight).toFixed(2)),explanation:spec.criteria.map(c=>c.label+': '+o.scores[c.id]+'/10 × '+c.weight).join('; ')})).sort((a,b)=>b.score-a.score||a.label.localeCompare(b.label));return {ranked,winner:ranked[0],errors:[]};}
function eligibility(spec,answers){const errors=validate(spec);if(errors.length)return {errors};for(const i of spec.inputs){const val=answers[i.id];if(val===undefined||val===null||val===''){errors.push(i.label+': required.');continue;}if(i.type==='number'&&(!Number.isFinite(Number(val))||Number(val)<i.min||Number(val)>i.max))errors.push(i.label+': invalid number or range.');if(i.type==='select'&&!i.options.includes(val))errors.push(i.label+': invalid selection.');if(i.type==='boolean'&&!['true','false',true,false].includes(val))errors.push(i.label+': select yes or no.');}if(errors.length)return {errors};const details=spec.rules.map(r=>{const field=spec.inputs.find(i=>i.id===r.input),raw=answers[r.input];const value=field.type==='number'?Number(raw):field.type==='boolean'?String(raw)==='true':raw;const target=field.type==='boolean'?String(r.value)==='true':r.value;const pass=r.operator==='gte'?value>=target:r.operator==='lte'?value<=target:value===target;return {pass,reason:r.reason};});return {eligible:details.every(d=>d.pass),details,disclosure:'Illustrative rules only. Not a lending decision, guarantee, or approval.',errors:[]};}
function decisionTree(spec,answers){const errors=validate(spec);if(errors.length)return {errors};const nodes=new Map(spec.nodes.map(n=>[n.id,n]));let id=spec.start||spec.nodes[0].id;const steps=[];for(let limit=0;limit<=spec.nodes.length;limit++){const node=nodes.get(id);if(node.type==='result')return {result:node.text,steps,errors:[]};const choice=answers[id];const option=node.options.find(o=>o.label===choice||o.id===choice);if(!option)return {next:node,steps,errors:[]};steps.push(node.text+' → '+option.label);id=option.next;}return {errors:['Invalid decision tree path.']};}
E.VERSION2=V2;E.validate=validate;E.comparison=comparison;E.eligibility=eligibility;E.decisionTree=decisionTree;
})(globalThis);
