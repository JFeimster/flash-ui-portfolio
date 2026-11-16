(function (root) {
  'use strict';
  const E = root.ToolFactoryEngine;
  function mount(host, spec) {
    host.replaceChildren();
    const add = (tag, text, parent = host) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; parent.append(el); return el; };
    const title = add('h1', spec.title);
    title.className = 'tool-title';
    add('p', `${spec.target_persona || 'For your audience'} · Local demo, no data sent.`);
    if (spec.problem) add('p', spec.problem);
    const form = add('form'); form.noValidate = true;
    const result = add('section'); result.className = 'tool-result'; result.setAttribute('aria-live', 'polite');
    function show(value, error = false) { result.replaceChildren(); result.classList.toggle('error', error); result.dataset.text = error ? '' : value; add('p', value, result); }
    if (spec.archetype === 'calculator') {
      for (const field of spec.inputs) {
        const label = add('label', field.label, form); label.htmlFor = `tool-${field.id}`;
        const input = add('input', undefined, form); input.id = label.htmlFor; input.name = field.id; input.type = 'number'; input.min = field.min; input.max = field.max; input.step = field.step || 'any'; input.value = field.sample ?? 0; input.required = true;
      }
      const go = add('button', 'Calculate', form); go.type = 'submit';
      const reset = add('button', 'Reset', form); reset.type = 'reset'; reset.className = 'secondary';
      form.addEventListener('submit', ev => { ev.preventDefault(); const raw = Object.fromEntries(new FormData(form)); const out = E.calculate(spec, raw); show(out.errors.length ? out.errors.join(' ') : `${spec.outputs[0]?.label || 'Result'}: ${out.value}\n${out.explanation}${spec.assumptions ? `\n${spec.assumptions}` : ''}`, !!out.errors.length); });
      form.addEventListener('reset', () => show('Enter values and calculate.'));
      show('Enter values and calculate.');
    } else if (spec.archetype === 'scorecard') {
      let step = 0; const answers = {};
      function render() {
        form.replaceChildren(); result.replaceChildren();
        const q = spec.questions[step];
        add('p', `Question ${step + 1} of ${spec.questions.length}`, form);
        add('h2', q.label, form);
        for (const option of q.options) {
          const label = add('label', undefined, form);
          const radio = add('input', undefined, label); radio.type = 'radio'; radio.name = q.id; radio.value = option.id; radio.checked = answers[q.id] === option.id;
          label.append(document.createTextNode(` ${option.label}`));
        }
        const back = add('button', 'Back', form); back.type = 'button'; back.className = 'secondary'; back.disabled = step === 0; back.addEventListener('click', () => { step--; render(); });
        const next = add('button', step === spec.questions.length - 1 ? 'See result' : 'Next', form); next.type = 'submit';
        const restart = add('button', 'Restart', form); restart.type = 'button'; restart.className = 'secondary'; restart.addEventListener('click', () => { Object.keys(answers).forEach(k => delete answers[k]); step = 0; render(); });
      }
      form.addEventListener('submit', ev => { ev.preventDefault(); const q = spec.questions[step]; const chosen = new FormData(form).get(q.id); if (!chosen) return show('Choose an answer to continue.', true); answers[q.id] = chosen; if (step < spec.questions.length - 1) { step++; render(); } else { const out = E.score(spec, answers); show(out.errors.length ? out.errors.join(' ') : `${out.label} · ${out.value} points. ${out.recommendation}`, !!out.errors.length); } });
      render();
    } else if (spec.archetype === 'checklist') {
      for (const section of spec.sections) {
        add('h2', section.label, form);
        for (const item of section.items) {
          const label = add('label', undefined, form); const checkbox = add('input', undefined, label); checkbox.type = 'checkbox'; checkbox.name = 'item'; checkbox.value = item.id; label.append(document.createTextNode(` ${item.label}`));
        }
      }
      const go = add('button', 'Make checklist', form); go.type = 'submit';
      form.addEventListener('submit', ev => { ev.preventDefault(); const selected = new FormData(form).getAll('item'); const out = E.checklist(spec, selected); show(out.errors.length ? out.errors.join(' ') : out.text, !!out.errors.length); });
      show('Choose items to build a checklist.');
    }
    const artifact = add('div'); artifact.className = 'artifact-actions';
    const copy = add('button', 'Copy result', artifact); copy.type = 'button'; copy.className = 'secondary'; copy.addEventListener('click', async () => { if (result.dataset.text) await navigator.clipboard.writeText(result.dataset.text); });
    const save = add('button', 'Download result', artifact); save.type = 'button'; save.className = 'secondary'; save.addEventListener('click', () => { if (!result.dataset.text) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([result.dataset.text], { type: 'text/plain' })); a.download = `${spec.id}-result.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); });
    const print = add('button', 'Print result', artifact); print.type = 'button'; print.className = 'secondary'; print.addEventListener('click', () => { if (result.dataset.text) root.print(); });
    const share = add('button', 'Share result', artifact); share.type = 'button'; share.className = 'secondary'; share.addEventListener('click', async () => { if (!result.dataset.text) return; if (navigator.share) { try { await navigator.share({ title: spec.title, text: result.dataset.text }); } catch (_) {} } else await navigator.clipboard.writeText(result.dataset.text); });
    if (spec.cta?.label && spec.cta?.url) { const a = add('a', spec.cta.label); a.href = spec.cta.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'tool-cta'; }
    return host;
  }
  root.ToolFactoryRuntime = { mount };
  const initial = document.getElementById('tool-spec');
  if (initial) {
    try { mount(document.getElementById('tool-root'), JSON.parse(initial.textContent)); }
    catch (err) { document.getElementById('tool-root').textContent = `Unable to start tool: ${err.message}`; }
  }
})(globalThis);
