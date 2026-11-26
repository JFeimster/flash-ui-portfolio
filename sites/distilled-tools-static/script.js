fetch('data/tools.json')
.then(r=>r.json())
.then(data=>{
  const root=document.getElementById('tools');
  const search=document.getElementById('search');
  function render(q=''){
    root.innerHTML='';
    data.filter(t=>t.name.toLowerCase().includes(q.toLowerCase()))
    .forEach(t=>{
      const d=document.createElement('div');
      d.className='card';
      d.innerHTML=`<span class="badge">${t.tool_type}</span><h3>${t.name}</h3><p>${t.short_pitch}</p><a href="${t.app_url}" target="_blank">Launch</a>`;
      root.appendChild(d);
    })
  }
  search.oninput=e=>render(e.target.value);
  render();
});
