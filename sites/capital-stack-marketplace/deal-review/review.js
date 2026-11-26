document.addEventListener("DOMContentLoaded", ()=>{
  const pre = document.querySelector("#prefill");
  let payload = null;
  try{ payload = JSON.parse(localStorage.getItem("csm_builder_payload")||"null"); }catch(e){}
  if(payload){
    pre.classList.remove("hidden");
    document.querySelector("#summary").textContent =
      `Purchase price: ${payload.price ? payload.price.toLocaleString() : "—"} | EBITDA: ${payload.ebitda ? payload.ebitda.toLocaleString() : "—"} | Buyer: ${payload.buyer_type || "—"}`;
    // attempt to prefill
    const map = {
      name:"name",
      email:"email",
      price:"price",
      ebitda:"ebitda",
      cash:"cash"
    };
    Object.entries(map).forEach(([id,key])=>{
      const el = document.getElementById(id);
      if(el && payload[key]!==undefined && payload[key]!==null){
        if(el.type==="checkbox") el.checked = !!payload[key];
        else el.value = payload[key];
      }
    });
  }
  document.querySelector("#intakeForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    alert("Demo form: wire this to your CRM (HubSpot, Airtable, etc.) in production.");
  });
});