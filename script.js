const menu=document.querySelector('#menuBtn'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#themeToggle')?.addEventListener('click',()=>document.documentElement.classList.toggle('light'));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;document.querySelectorAll('.skill-grid>div').forEach(card=>card.classList.toggle('hide',cat!=='all'&&card.dataset.cat!==cat))}));
if(!window.gsap){const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section,.project,.timeline article,.stats').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});}
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav a')];window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))},{passive:true});

/* Removed malformed legacy animation bundle; Three.js + GSAP directors below own all motion. */

/* SELECTIVE WEBGL STAGE — one quiet spatial layer, one hero focal object */
(()=>{
 const canvas=document.getElementById('portfolio-world'),hero=document.querySelector('#home');
 if(!canvas||!window.THREE)return;
 const THREE=window.THREE,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const desktop=matchMedia('(min-width: 1000px) and (hover:hover)').matches;
 if(!desktop){canvas.classList.add('mobile-scene-disabled');return;}
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}catch(e){canvas.classList.add('world-fallback');return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(innerWidth,innerHeight,false);
 renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
 camera.position.set(0,0,10);
 const group=new THREE.Group();group.position.set(3.05,.05,0);scene.add(group);
 const core=new THREE.Mesh(new THREE.SphereGeometry(1.05,64,64),new THREE.MeshStandardMaterial({color:0x17163f,metalness:.48,roughness:.32,emissive:0x25105d,emissiveIntensity:.5}));group.add(core);
 const shell=new THREE.Mesh(new THREE.SphereGeometry(1.09,48,48),new THREE.MeshBasicMaterial({color:0x8b5cf6,wireframe:true,transparent:true,opacity:.12}));group.add(shell);
 const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.16,48,48),new THREE.MeshBasicMaterial({color:0x438cff,transparent:true,opacity:.075,side:THREE.BackSide}));group.add(atmosphere);
 const rings=[];
 [1.48,1.78].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.012,10,180),new THREE.MeshBasicMaterial({color:i?0x3d8bff:0xb47cff,transparent:true,opacity:i?.38:.58}));ring.rotation.set(.75+i*.45,.2+i*.35,.1);group.add(ring);rings.push(ring);});
 const starCount=1050,positions=new Float32Array(starCount*3),colors=new Float32Array(starCount*3);
 for(let i=0;i<starCount;i++){positions[i*3]=(Math.random()-.5)*24;positions[i*3+1]=(Math.random()-.5)*15;positions[i*3+2]=(Math.random()-.5)*10-2;const k=.45+Math.random()*.55;colors[i*3]=.45*k;colors[i*3+1]=.36*k;colors[i*3+2]=k;}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const stars=new THREE.Points(geo,new THREE.PointsMaterial({size:.026,vertexColors:true,transparent:true,opacity:.38,depthWrite:false}));scene.add(stars);
 scene.add(new THREE.AmbientLight(0x9a8cff,.9));const light=new THREE.PointLight(0x7c4dff,3.4,18);light.position.set(-3,3,5);scene.add(light);
 let mx=0,my=0,tx=0,ty=0,raf=0,last=0,visible=true,heroActive=true;
 const pointer=e=>{tx=(e.clientX/innerWidth-.5)*.5;ty=(e.clientY/innerHeight-.5)*-.35;};window.addEventListener('pointermove',pointer,{passive:true});
 const io=new IntersectionObserver(entries=>{heroActive=entries[0].isIntersecting;group.visible=heroActive;},{threshold:.08});if(hero)io.observe(hero);
 const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(innerWidth,innerHeight,false);};window.addEventListener('resize',resize,{passive:true});
 const draw=now=>{raf=0;if(document.hidden||!visible)return;if(!reduce)raf=requestAnimationFrame(draw);if(now-last<32)return;last=now;const t=now*.001;mx+=(tx-mx)*.035;my+=(ty-my)*.035;camera.position.x=mx*.45;camera.position.y=my*.35;camera.lookAt(0,0,0);stars.rotation.y=t*.006;stars.rotation.x=Math.sin(t*.08)*.018;if(heroActive){group.rotation.y=t*.11+mx*.16;group.rotation.x=Math.sin(t*.24)*.08+my*.12;rings[0].rotation.z=t*.09;rings[1].rotation.z=-t*.065;}renderer.render(scene,camera);};
 document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}else if(visible&&!reduce&&!raf)raf=requestAnimationFrame(draw);});
 if(!reduce)raf=requestAnimationFrame(draw);else renderer.render(scene,camera);
 canvas.classList.add('world-ready');window.addEventListener('beforeunload',()=>{io.disconnect();geo.dispose();renderer.dispose();},{once:true});
})();


/* CINEMATIC MOTION DIRECTOR — scroll storytelling, kinetic type, parallax, depth */
(()=>{
 const gsap=window.gsap,ST=window.ScrollTrigger;
 if(!gsap||!ST)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 gsap.registerPlugin(ST);
 gsap.defaults({ease:'power3.out'});
 const desktop=matchMedia('(min-width: 900px) and (hover:hover)').matches;
 document.documentElement.classList.add('cinematic-motion-ready');
 // Animate complete headings without splitting Unicode spaces into visible escape text.
  document.querySelectorAll('.section-head h2').forEach(h=>{
   gsap.fromTo(h,{y:34,opacity:0,filter:'blur(5px)'},{y:0,opacity:1,filter:'blur(0px)',duration:.8,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 84%',once:true}});
  });
  // Chapter-by-chapter scroll reveals with stable, readable typography.
  document.querySelectorAll('main section').forEach((section,index)=>{
   const head=section.querySelector('.section-head');
   const copy=section.querySelector('.about-text,.hero-copy,.contact-panel>div:first-child');
   if(head)gsap.fromTo(head,{y:34,opacity:0},{y:0,opacity:1,duration:.85,scrollTrigger:{trigger:section,start:'top 78%',once:true}});
   if(copy&&section.id!=='home')gsap.fromTo(copy,{y:24,opacity:0},{y:0,opacity:1,duration:.8,delay:.06,scrollTrigger:{trigger:copy,start:'top 88%',once:true}});
   const cards=section.querySelectorAll('.project,.timeline article,.skill-grid>div,.certificate-card,.recognition-grid>div');
   if(cards.length)gsap.fromTo(cards,{y:38,opacity:0,rotateX:desktop?7:0,scale:.98,transformPerspective:1100},{y:0,opacity:1,rotateX:0,scale:1,duration:.8,stagger:.075,ease:'power3.out',scrollTrigger:{trigger:cards[0].parentElement,start:'top 84%',once:true}});
  });
  // Parallax and depth only on larger screens; mobile remains readable and stable.
  if(desktop){
   [['.hero-art',-46],['.portrait-wrap',-22],['.about-visual',-24],['.contact-orb',35]].forEach(([selector,amount])=>{
    document.querySelectorAll(selector).forEach(el=>gsap.to(el,{y:amount,ease:'none',scrollTrigger:{trigger:el.closest('section')||el,start:'top bottom',end:'bottom top',scrub:1.2}}));
   });
   document.querySelectorAll('.about-visual,.contact-panel,.hero-art').forEach(el=>{
    gsap.fromTo(el,{rotateX:2,rotateY:-1.5,transformPerspective:1300},{rotateX:-1,rotateY:1.5,ease:'none',scrollTrigger:{trigger:el.closest('section'),start:'top bottom',end:'bottom top',scrub:1.4}});
   });
  }
  document.querySelectorAll('.timeline').forEach(el=>gsap.fromTo(el,{'--timeline-progress':0},{'--timeline-progress':1,ease:'none',scrollTrigger:{trigger:el,start:'top 72%',end:'bottom 58%',scrub:true}}));
  const gallery=document.querySelector('.project-grid');
  if(gallery&&desktop)gsap.to(gallery,{y:-18,ease:'none',scrollTrigger:{trigger:gallery,start:'top bottom',end:'bottom top',scrub:1.2}});
 // Fluid page navigation: native scroll remains available, but links glide to chapters.
 document.documentElement.style.scrollBehavior=reduce?'auto':'smooth';
 // Refresh after fonts/images settle so scroll scenes use accurate geometry.
 window.addEventListener('load',()=>{ST.refresh();setTimeout(()=>ST.refresh(),450);},{once:true});
 window.addEventListener('resize',()=>ST.refresh(),{passive:true});
})();

/* Legacy cyber-globe loader removed; the 22-second cinematic renderer below owns this canvas. */


/* UPLOADED GALAXY INTRO CONTROLLER */
(()=>{
 const root=document.getElementById('site-loader');
 const canvas=document.getElementById('intro-cosmos');
 if(!root||!canvas)return;
 const fill=document.getElementById('intro-progress-fill'),percent=document.getElementById('intro-percent');
 const status=root.querySelector('.intro-status'),skip=document.getElementById('intro-skip');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let renderer,scene,camera,raf=0,start=0,finished=false,earth=null,galaxy=null,stars=null,resizeHandler;
 const finish=()=>{
   if(finished)return;finished=true;
   if(raf)cancelAnimationFrame(raf);
   root.classList.add('intro-exit');
   document.body.classList.add('intro-complete');
   setTimeout(()=>{root.remove();window.dispatchEvent(new CustomEvent('portfolio:intro-complete'));},850);
 };
 const fallback=()=>{
   root.classList.add('intro-fallback');
   if(reduce){finish();return;}
   start=performance.now();
   const tick=now=>{if(finished)return;const t=(now-start)/1000,p=Math.min(100,t/12*100);if(fill)fill.style.width=p+'%';if(percent)percent.textContent=Math.floor(p).toString().padStart(2,'0')+'%';if(status)status.textContent='TRAVERSING THE MILKY WAY';if(t>=12)finish();else raf=requestAnimationFrame(tick);};
   raf=requestAnimationFrame(tick);
 };
 const init=()=>{
  if(!window.THREE)return false;
  try{
   const THREE=window.THREE;
   renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:true,powerPreference:'high-performance'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
   renderer.setSize(innerWidth,innerHeight,false);
   renderer.outputEncoding=THREE.sRGBEncoding;
   scene=new THREE.Scene();scene.background=new THREE.Color(0x03020b);
   camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,1600);camera.position.set(0,0,42);
   const nebula=new THREE.BufferGeometry(),count=68000,positions=new Float32Array(count*3),colors=new Float32Array(count*3);
   const c1=new THREE.Color(0x6932b8),c2=new THREE.Color(0x2358a8),c3=new THREE.Color(0x170d35);
   for(let i=0;i<count;i++){
    const arm=i%4,rad=Math.pow(Math.random(),.62)*42,angle=arm*Math.PI/2+rad*.105+(Math.random()-.5)*.62;
    positions[i*3]=Math.cos(angle)*rad+(Math.random()-.5)*3.2;
    positions[i*3+1]=Math.sin(angle)*rad*.58+(Math.random()-.5)*2.8;
    positions[i*3+2]=(Math.random()-.5)*25;
    const col=[c1,c2,c3][Math.floor(Math.random()*3)];colors[i*3]=col.r;colors[i*3+1]=col.g;colors[i*3+2]=col.b;
   }
   nebula.setAttribute('position',new THREE.BufferAttribute(positions,3));nebula.setAttribute('color',new THREE.BufferAttribute(colors,3));
   galaxy=new THREE.Points(nebula,new THREE.PointsMaterial({size:.12,vertexColors:true,transparent:true,opacity:.72,depthWrite:false,blending:THREE.AdditiveBlending}));
   scene.add(galaxy);
   const starGeo=new THREE.BufferGeometry(),sc=6500,sp=new Float32Array(sc*3);
   for(let i=0;i<sc;i++){sp[i*3]=(Math.random()-.5)*900;sp[i*3+1]=(Math.random()-.5)*600;sp[i*3+2]=(Math.random()-.5)*950;}
   starGeo.setAttribute('position',new THREE.BufferAttribute(sp,3));
   stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xcbd8ff,size:.75,transparent:true,opacity:.82}));
   scene.add(stars);
   const ambient=new THREE.AmbientLight(0x9aaeff,1.25);scene.add(ambient);
   const sun=new THREE.PointLight(0x8c6dff,3.4,400);sun.position.set(-35,22,45);scene.add(sun);
   const globe=new THREE.Group();globe.position.set(0,0,-45);scene.add(globe);earth=globe;
   const earthGeo=new THREE.SphereGeometry(10,72,72);
   const earthMat=new THREE.MeshStandardMaterial({color:0x2466a6,roughness:.92,metalness:.03});
   const earthMesh=new THREE.Mesh(earthGeo,earthMat);globe.add(earthMesh);
   const landMat=new THREE.MeshStandardMaterial({color:0x348d76,roughness:1,transparent:true,opacity:.82});
   const landGeo=new THREE.SphereGeometry(10.035,48,48);
   const land=new THREE.Mesh(landGeo,landMat);globe.add(land);
   const cloudGeo=new THREE.SphereGeometry(10.12,48,48);
   const cloudMat=new THREE.MeshBasicMaterial({color:0xd7e9ff,transparent:true,opacity:.11,wireframe:true});
   const clouds=new THREE.Mesh(cloudGeo,cloudMat);globe.add(clouds);
   const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(10.5,64,64),new THREE.MeshBasicMaterial({color:0x3c8dff,transparent:true,opacity:.13,side:THREE.BackSide}));
   globe.add(atmosphere);
   const moon=new THREE.Mesh(new THREE.SphereGeometry(2.1,32,32),new THREE.MeshStandardMaterial({color:0x9aa4bb,roughness:1}));
   moon.position.set(18,6,-30);scene.add(moon);
   let px=0,py=0,tx=0,ty=0;
   const onPointer=e=>{tx=(e.clientX/innerWidth-.5)*.35;ty=(e.clientY/innerHeight-.5)*-.25;};
   window.addEventListener('pointermove',onPointer,{passive:true});
   const resize=()=>{if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));};
   resizeHandler=resize;window.addEventListener('resize',resize,{passive:true});
   const render=now=>{
    if(finished)return;
    raf=requestAnimationFrame(render);
    const elapsed=(now-start)/1000,t=Math.min(elapsed,22);
    px+=(tx-px)*.035;py+=(ty-py)*.035;
    galaxy.rotation.z=t*.014;stars.rotation.y=t*.003;
    earth.rotation.y=t*.035;earth.rotation.x=Math.sin(t*.16)*.035;
    const approach=t<8?0:t<14?(t-8)/6:1;
    earth.position.z=-45+approach*26;
    earth.scale.setScalar(t<8?.42:t<14?.42+approach*.58:1+Math.min(1,(t-14)/8)*.28);
    camera.position.x=px*4;camera.position.y=py*3;
    camera.position.z=t<8?42-t*2.1:t<14?25-(t-8)*1.2:18-Math.min(1,(t-14)/8)*3.5;
    camera.lookAt(0,0,-8);
    if(fill)fill.style.width=(t/22*100)+'%';
    if(percent)percent.textContent=Math.floor(t/22*100).toString().padStart(2,'0')+'%';
    if(status)status.textContent=t<8?'TRAVERSING THE MILKY WAY':t<15?'APPROACHING PLANET EARTH':'DESCENDING TO THE SURFACE';
    const hud=root.querySelector('.intro-hud');
    if(hud)hud.style.setProperty('--intro-visibility',t>16?String(Math.min(1,(t-16)/2)): '0');
    if(t>=22)finish();
    renderer.render(scene,camera);
   };
   start=performance.now();raf=requestAnimationFrame(render);
   return true;
  }catch(err){try{renderer?.dispose();}catch{}return false;}
 };
 if(skip)skip.addEventListener('click',finish);
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!finished)finish();});
 if(reduce){finish();return;}
 if(!init())fallback();
 window.addEventListener('beforeunload',()=>{if(raf)cancelAnimationFrame(raf);if(resizeHandler)removeEventListener('resize',resizeHandler);renderer?.dispose();},{once:true});
})();
