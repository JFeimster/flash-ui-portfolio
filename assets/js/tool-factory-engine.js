(function (root) {
  'use strict';
  const VERSION = 'flash-ui-tool-spec/v1';
  const safeId = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64) || 'untitled-tool';
  function validate(spec) {
    const errors = [];
    if (!spec || typeof spec !== 'object') return ['Specification must be an object.'];
    if (spec.schema_version !== VERSION) errors.push('Unsupported schema version.');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(spec.id || '')) errors.push('ID must be a lowercase slug.');
    if (!String(spec.title || '').trim()) errors.push('Title is required.');
    if (!['calculator', 'scorecard', 'checklist', 'intake'].includes(spec.archetype)) errors.push('Choose a supported archetype.');
    if (!Array.isArray(spec.inputs) || !Array.isArray(spec.outputs)) errors.push('Inputs and outputs must be arrays.');
    if (spec.archetype === 'calculator') {
      if (!spec.calculation || !['sum', 'difference', 'multiply', 'divide'].includes(spec.calculation.operation)) errors.push('Choose a supported calculation.');
      if (!Array.isArray(spec.inputs) || spec.inputs.length < 2 || spec.inputs.some(i => i.type !== 'number' || !i.id || !i.label || !Number.isFinite(i.min) || !Number.isFinite(i.max) || i.min > i.max)) errors.push('Calculator needs at least two valid numeric inputs.');
    }
    if (spec.archetype === 'scorecard' && (!Array.isArray(spec.questions) || !spec.questions.length || spec.questions.some(q => !q.id || !q.label || !Array.isArray(q.options) || q.options.length < 2 || q.options.some(o => !o.label || !Number.isFinite(o.points))))) errors.push('Scorecard needs questions with scored options.');
    if (spec.archetype === 'checklist' && (!Array.isArray(spec.sections) || !spec.sections.length || spec.sections.some(s => !s.label || !Array.isArray(s.items) || !s.items.length))) errors.push('Checklist needs sections and items.');
    if (spec.archetype === 'intake' && (!Array.isArray(spec.fields) || !spec.fields.length || spec.fields.some(f => !/^[a-z0-9-]+$/.test(f.id || '') || !String(f.label || '').trim() || !['text','email','select'].includes(f.type) || (f.type === 'select' && (!Array.isArray(f.options) || f.options.length < 2 || f.options.some(o => !String(o).trim())))))) errors.push('Intake needs valid text, email, or select fields.');
    return errors;
  }
  function intake(spec, answers) {
    const errors = validate(spec);
    if (errors.length) return { errors };
    const lines = [];
    for (const field of spec.fields) {
      const value = String(answers[field.id] ?? '').trim();
      if (field.required && !value) errors.push(field.label + ': required.');
      if (value.length > 500) errors.push(field.label + ': 500 character limit.');
      if (field.type === 'email' && value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) errors.push(field.label + ': invalid email.');
      if (field.type === 'select' && value && !field.options.includes(value)) errors.push(field.label + ': invalid option.');
      lines.push(field.label + ': ' + (value || '[not provided]'));
    }
    if (errors.length) return { errors };
    return { text: spec.title + '\\n\\n' + lines.join('\\n') + '\\n\\nLocal draft only. Nothing submitted or stored.', errors: [] };
  }
  function calculate(spec, raw) {
    const errors = validate(spec);
    if (errors.length) return { errors };
    const values = [];
    for (const input of spec.inputs) {
      const original = raw[input.id];
      if (original === '' || original === null || original === undefined || !Number.isFinite(Number(original))) errors.push(`${input.label}: enter a number.`);
      else {
        const n = Number(original);
        if (n < input.min || n > input.max) errors.push(`${input.label}: use ${input.min} to ${input.max}.`);
        values.push(n);
      }
    }
    if (errors.length) return { errors };
    const op = spec.calculation.operation;
    let result = values[0];
    for (const n of values.slice(1)) {
      if (op === 'sum') result += n;
      if (op === 'difference') result -= n;
      if (op === 'multiply') result *= n;
      if (op === 'divide') { if (n === 0) return { errors: ['Cannot divide by zero.'] }; result /= n; }
    }
    if (!Number.isFinite(result)) return { errors: ['Result is outside the supported range.'] };
    return { value: Number(result.toFixed(2)), explanation: `${values.join(` ${ { sum: '+', difference: '−', multiply: '×', divide: '÷' }[op]} `)} = ${Number(result.toFixed(2))}`, errors: [] };
  }
  function score(spec, answers) {
    const errors = validate(spec);
    if (errors.length) return { errors };
    let total = 0;
    for (const q of spec.questions) {
      const chosen = q.options.find(o => o.id === answers[q.id]);
      if (!chosen) errors.push(`Answer ${q.label}.`);
      else total += chosen.points;
    }
    if (errors.length) return { errors };
    const tier = [...(spec.tiers || [])].sort((a, b) => b.min - a.min).find(t => total >= t.min) || { label: 'Result', recommendation: 'Review your answers.' };
    return { value: total, label: tier.label, recommendation: tier.recommendation, errors: [] };
  }
  function checklist(spec, selected) {
    const errors = validate(spec);
    if (errors.length) return { errors };
    const lines = [];
    for (const section of spec.sections) {
      const items = section.items.filter(i => selected.includes(i.id));
      if (items.length) lines.push(section.label, ...items.map(i => `□ ${i.label}`), '');
    }
    if (!lines.length) return { errors: ['Choose at least one item.'] };
    return { text: `${spec.title}\n\n${lines.join('\n').trim()}\n\nDemo checklist. Review before use.`, errors: [] };
  }
  root.ToolFactoryEngine = { VERSION, safeId, validate, calculate, score, checklist, intake };
})(globalThis);
