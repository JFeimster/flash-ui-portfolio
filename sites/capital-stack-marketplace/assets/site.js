const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function money(n){
  if(n === null || n === undefined || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if(abs >= 1e9) return (n/1e9).toFixed(2)+"B";
  if(abs >= 1e6) return (n/1e6).toFixed(2)+"M";
  if(abs >= 1e3) return (n/1e3).toFixed(1)+"k";
  return n.toFixed(0);
}

function fmtUSD(n){
  if(n === null || n === undefined || isNaN(n)) return "—";
  return n.toLocaleString(undefined, {style:"currency", currency:"USD", maximumFractionDigits:0});
}

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

function setYear(){
  const el = $("#year");
  if(el) el.textContent = new Date().getFullYear();
}
document.addEventListener("DOMContentLoaded", setYear);