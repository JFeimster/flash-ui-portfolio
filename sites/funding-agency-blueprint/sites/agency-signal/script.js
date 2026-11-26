const fmt=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
function updateCalculator(){const g=Number(document.getElementById('goal').value);const r=Number(document.getElementById('rate').value);document.getElementById('goalval').textContent=fmt(g);document.getElementById('rateval').textContent=r.toFixed(1)+'%';document.getElementById('volume').textContent=fmt(g/(r/100));}
for(const el of document.querySelectorAll('input[type=range]'))el.addEventListener('input',updateCalculator);
updateCalculator();