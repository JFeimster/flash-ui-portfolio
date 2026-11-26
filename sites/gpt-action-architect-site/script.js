const toggle=document.querySelector('.menu-toggle');
const mobile=document.querySelector('#mobile-nav');

if(toggle&&mobile){
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded',String(!open));
    mobile.hidden=open;
  });
  mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    toggle.setAttribute('aria-expanded','false');
    mobile.hidden=true;
  }));
}

const revealTargets=document.querySelectorAll('.cards article,.rows article,.steps article,.auth');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

revealTargets.forEach((el,i)=>{
  el.style.opacity='0';
  el.style.transform='translateY(12px)';
  el.style.transition=`opacity .45s ease ${Math.min(i%4,3)*.05}s, transform .45s ease ${Math.min(i%4,3)*.05}s`;
  observer.observe(el);
});

const style=document.createElement('style');
style.textContent='.visible{opacity:1!important;transform:translateY(0)!important}';
document.head.appendChild(style);
