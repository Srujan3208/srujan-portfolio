const menu=document.querySelector('#menuBtn'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#themeToggle')?.addEventListener('click',()=>document.documentElement.classList.toggle('light'));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;document.querySelectorAll('.skill-grid>div').forEach(card=>card.classList.toggle('hide',cat!=='all'&&card.dataset.cat!==cat))}));
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section,.project,.timeline article,.stats').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav a')];window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))},{passive:true});



/* Portfolio reference effects — lightweight, responsive and reduced-motion aware */
(()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const touch=window.matchMedia('(pointer: coarse)').matches;
 const loader=document.querySelector('.boot-loader'),pct=document.querySelector('.boot-percent');
 if(loader&&!reduce){let n=0;const timer=setInterval(()=>{n=Math.min(100,n+Math.ceil(Math.random()*12));if(pct)pct.textContent=String(n).padStart(2,'0')+'%';if(n>=100){clearInterval(timer);setTimeout(()=>loader.classList.add('done'),220)}},90)}else loader?.classList.add('done');
 const progress=document.querySelector('.scroll-progress i');
 const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress&&(progress.style.width=(max>0?scrollY/max*100:0)+'%')};
 updateProgress();window.addEventListener('scroll',updateProgress,{passive:true});
 const role=document.querySelector('.typed-role');
 if(role&&!reduce){const words=['AI Engineer','Full-Stack Developer','Hackathon Builder','CSE Student'];let wi=0,ci=words[0].length,dir=-1;role.textContent=words[0];setInterval(()=>{const word=words[wi];ci+=dir;if(ci<=0){wi=(wi+1)%words.length;dir=1;ci=0}else if(ci>=words[wi].length){dir=-1;ci=words[wi].length;setTimeout(()=>{},200)}role.textContent=words[wi].slice(0,ci)},115)}
 const glow=document.querySelector('.cursor-glow');
 if(glow&&!touch){window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';document.documentElement.style.setProperty('--x',e.clientX+'px');document.documentElement.style.setProperty('--y',e.clientY+'px')},{passive:true})}
 if(!touch&&!reduce){document.querySelectorAll('.hero-buttons .button,.contact .button').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.08,y=(e.clientY-r.top-r.height/2)*.08;el.style.transform='translate('+x+'px,'+y+'px)' });el.addEventListener('pointerleave',()=>el.style.transform='')});
 document.querySelectorAll('.project').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--spot-x',(x*100)+'%');card.style.setProperty('--spot-y',(y*100)+'%');card.style.transform='perspective(900px) rotateX('+((.5-y)*3)+'deg) rotateY('+((x-.5)*3)+'deg) translateY(-2px)'});card.addEventListener('pointerleave',()=>card.style.transform='')})}
})();
