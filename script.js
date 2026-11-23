const menu=document.querySelector('#menuBtn'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#themeToggle')?.addEventListener('click',()=>document.documentElement.classList.toggle('light'));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;document.querySelectorAll('.skill-grid>div').forEach(card=>card.classList.toggle('hide',cat!=='all'&&card.dataset.cat!==cat))}));
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section,.project,.timeline article,.stats').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav a')];window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))},{passive:true});


/* iPhone Dynamic Island menu behavior */
(()=>{
 const island=document.getElementById('iphoneIsland');
 const toggle=document.getElementById('iphoneIslandToggle');
 if(!island||!toggle)return;
 const links=[...island.querySelectorAll('.island-choice')];
 toggle.addEventListener('click',()=>{
  const open=island.classList.toggle('open');
  toggle.setAttribute('aria-expanded',String(open));
 });
 links.forEach(link=>link.addEventListener('click',()=>{
  links.forEach(l=>l.classList.toggle('active',l===link));
  island.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
 }));
 const sections=links.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){
    const current=links.find(link=>link.getAttribute('href')==='#'+entry.target.id);
    if(current)links.forEach(link=>link.classList.toggle('active',link===current));
   }
  }),{rootMargin:'-35% 0px -45% 0px'});
  sections.forEach(section=>observer.observe(section));
 }
 document.addEventListener('click',e=>{
  if(!island.contains(e.target)&&island.classList.contains('open')){
   island.classList.remove('open');toggle.setAttribute('aria-expanded','false');
  }
 });
})();

/* Immersive motion system */
(()=>{
 const canvas=document.getElementById('motionCanvas');
 const ctx=canvas?.getContext('2d');
 const progress=document.getElementById('scrollProgress');
 if(!canvas||!ctx)return;
 let w,h,dpr,points=[],mouse={x:-999,y:-999},raf;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function resize(){dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);points=Array.from({length:Math.min(75,Math.floor(w*h/16000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.5+.4}));}
 function draw(){ctx.clearRect(0,0,w,h);points.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;let d=Math.hypot(p.x-mouse.x,p.y-mouse.y);if(d<130){p.x+=(mouse.x-p.x)*.001;p.y+=(mouse.y-p.y)*.001;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(180,140,255,.55)';ctx.fill();});for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){let a=points[i],b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<115){ctx.strokeStyle='rgba(139,92,246,'+(1-d/115)*.18+')';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}if(!reduced)raf=requestAnimationFrame(draw);}
 resize();if(!reduced)draw();window.addEventListener('resize',resize,{passive:true});window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
 const reveal=document.querySelectorAll('section, .project-card, .skill-card, .cert-card, .timeline-item, .glass');
 reveal.forEach((el,i)=>{if(!el.classList.contains('hero')){el.classList.add('reveal');el.dataset.delay=String(i%4)}});
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
 reveal.forEach(el=>observer.observe(el));
 const update=()=>{let max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';};
 update();window.addEventListener('scroll',update,{passive:true});
})();
