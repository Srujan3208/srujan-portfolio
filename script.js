const menu=document.querySelector('#menuBtn'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#themeToggle')?.addEventListener('click',()=>document.documentElement.classList.toggle('light'));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;document.querySelectorAll('.skill-grid>div').forEach(card=>card.classList.toggle('hide',cat!=='all'&&card.dataset.cat!==cat))}));
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section,.project,.timeline article,.stats').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav a')];window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))},{passive:true});

/* PREVIEW: dynamic island interaction and active section switching */
(()=>{
 const island=document.querySelector('#dynamicIsland');
 const toggle=document.querySelector('#islandToggle');
 const tabs=[...document.querySelectorAll('.island-tab')];
 if(!island||!toggle)return;
 toggle.addEventListener('click',()=>{
   const open=island.classList.toggle('open');
   toggle.setAttribute('aria-expanded',String(open));
 });
 tabs.forEach(tab=>tab.addEventListener('click',()=>{
   tabs.forEach(t=>t.classList.remove('active'));
   tab.classList.add('active');
   island.classList.remove('open');
   toggle.setAttribute('aria-expanded','false');
 }));
 const targets=tabs.map(t=>document.querySelector(t.getAttribute('href'))).filter(Boolean);
 if('IntersectionObserver' in window){
   const io=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{
       if(entry.isIntersecting){
         const active=tabs.find(t=>t.getAttribute('href')==='#'+entry.target.id);
         if(active){tabs.forEach(t=>t.classList.toggle('active',t===active));}
       }
     });
   },{rootMargin:'-35% 0px -45% 0px',threshold:0});
   targets.forEach(target=>io.observe(target));
 }
 document.addEventListener('click',e=>{
   if(!island.contains(e.target)&&island.classList.contains('open')){
     island.classList.remove('open');toggle.setAttribute('aria-expanded','false');
   }
 });
})();
