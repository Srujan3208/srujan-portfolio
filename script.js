const menu=document.querySelector('#menuBtn'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#themeToggle')?.addEventListener('click',()=>document.documentElement.classList.toggle('light'));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;document.querySelectorAll('.skill-grid>div').forEach(card=>card.classList.toggle('hide',cat!=='all'&&card.dataset.cat!==cat))}));
if(!window.gsap){const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section,.project,.timeline article,.stats').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});}
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav a')];window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))},{passive:true});

/* Removed malformed legacy animation bundle; Three.js + GSAP directors below own all motion. */

/* FULL 3D PORTFOLIO EXPERIMENT — one GPU renderer, nine distinct section worlds */
(()=>{
 const canvas=document.getElementById('portfolio-world');
 const sections=[...document.querySelectorAll('main section')];
 if(!canvas||!sections.length)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const coarse=matchMedia('(pointer:coarse)').matches;
 const THREE=window.THREE;
 if(!THREE){canvas.classList.add('world-fallback');return;}
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!coarse,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.25:1.8));
 renderer.setSize(innerWidth,innerHeight,false);
 renderer.outputEncoding=THREE.sRGBEncoding;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.12;
 const scene=new THREE.Scene();
 scene.fog=new THREE.FogExp2(0x050513,.035);
 const camera=new THREE.PerspectiveCamera(46,innerWidth/innerHeight,.1,120);
 camera.position.set(0,0,11);
 const ambient=new THREE.AmbientLight(0x8792ff,.82);scene.add(ambient);
 const key=new THREE.PointLight(0x9a58ff,3.2,34);key.position.set(-4,3,6);scene.add(key);
 const cyan=new THREE.PointLight(0x24d9ff,2.4,28);cyan.position.set(5,-2,4);scene.add(cyan);
 const root=new THREE.Group();scene.add(root);
 const groups={};
 const mat=(color,metal=0.55,rough=.28,emissive=color)=>new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough,emissive,emissiveIntensity:.16});
 const purple=mat(0x5520a7,.72,.25,0x35106f),violet=mat(0x9b55ff,.65,.22,0x5a20c8),blue=mat(0x126aab,.68,.25,0x063a75),cyanMat=mat(0x35d9ff,.55,.2,0x087ca8),dark=mat(0x11142e,.8,.3,0x151039),silver=mat(0xb9c8ff,.75,.2,0x5365a8);
 const wire=(geo,color=0x9c70ff,opacity=.55)=>new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color,transparent:true,opacity}));
 const add=(g,obj)=>{g.add(obj);return obj};
 const sphere=(g,r,material,x=0,y=0,z=0,seg=36)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,seg),material);m.position.set(x,y,z);add(g,m);return m;};
 const torus=(g,r,t,material,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,t,12,120),material);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);add(g,m);return m;};
 const particles=(g,count=900,spread=15,color=0x8c6dff)=>{
  const p=new Float32Array(count*3),c=new Float32Array(count*3);
  for(let i=0;i<count;i++){p[i*3]=(Math.random()-.5)*spread*2;p[i*3+1]=(Math.random()-.5)*spread*1.35;p[i*3+2]=(Math.random()-.5)*spread;const k=.55+Math.random()*.45;c[i*3]=.42*k;c[i*3+1]=.28*k;c[i*3+2]=.95*k;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));geo.setAttribute('color',new THREE.BufferAttribute(c,3));
  const points=new THREE.Points(geo,new THREE.PointsMaterial({size:.035,color,vertexColors:true,transparent:true,opacity:.86,blending:THREE.AdditiveBlending,depthWrite:false}));
  add(g,points);return points;
 };
 const makeGroup=(id)=>{const g=new THREE.Group();g.visible=false;root.add(g);groups[id]=g;return g;};
 // HOME — orbital planet, satellite rings and a dense star field.
 {
  const g=makeGroup('home');sphere(g,2.15,dark,0,0,-1,64);
  const globe=sphere(g,2.12,mat(0x1a1551,.5,.48,0x24116e),0,0,-1,64);
  const shell=new THREE.Mesh(new THREE.SphereGeometry(2.2,48,48),new THREE.MeshBasicMaterial({color:0x754aff,wireframe:true,transparent:true,opacity:.11}));shell.position.z=-1;add(g,shell);
  torus(g,3.05,.025,violet,0,0,-.8,.35,.12,.15);torus(g,3.45,.012,cyanMat,0,0,-1.1,-.45,.1,-.2);
  sphere(g,.17,cyanMat,2.7,.8,.1,20);particles(g,1500,18);
  g.userData.spin=[globe,shell];
 }
 // ABOUT — holographic atom and rotating torus-knot sculpture.
 {
  const g=makeGroup('about');const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.35,.36,220,24,2,5),violet);add(g,knot);
  knot.add(wire(new THREE.TorusKnotGeometry(1.35,.36,90,10,2,5),0x52dfff,.35));
  for(let i=0;i<3;i++)torus(g,2.45+i*.22,.018,i===1?cyanMat:violet,0,0,0,Math.PI/2.4,i*Math.PI/3,0);
  sphere(g,.4,silver,0,0,0,28);particles(g,950,16);
  g.userData.spin=[knot];
 }
 // PROJECTS — floating product cubes and stacked 3D interface panels.
 {
  const g=makeGroup('projects');
  for(let i=0;i<7;i++){
   const geo=new THREE.BoxGeometry(1.05,1.05,1.05);
   const cube=new THREE.Mesh(geo,[purple,blue,violet,cyanMat][i%4]);cube.position.set((i%3-1)*2.15,Math.floor(i/3)*1.65-1.6,(i%2)*.6);cube.rotation.set(.35*i,.4*i,.15*i);add(g,cube);add(g,wire(geo,0x8c74ff,.6)).position.copy(cube.position);
   torus(g,.68,.012,i%2?cyanMat:violet,cube.position.x,cube.position.y,cube.position.z,Math.PI/2,.4*i,0);
  }
  particles(g,1100,17);
 }
 // EXPERIENCE — dimensional timeline with illuminated nodes and connecting rails.
 {
  const g=makeGroup('experience');const pts=[];
  for(let i=0;i<5;i++){const y=3.2-i*1.6;const node=sphere(g,.24,i%2?cyanMat:violet,-1.5,y,0,24);sphere(g,.42,dark,-1.5,y,-.2,24);node.position.z=.12;pts.push(new THREE.Vector3(-1.5,y,0));torus(g,.48,.018,i%2?cyanMat:violet,-1.5,y,0,Math.PI/2,0,0);}
  const curve=new THREE.CatmullRomCurve3(pts);add(g,new THREE.Mesh(new THREE.TubeGeometry(curve,100,.035,8,false),cyanMat));
  for(let i=0;i<5;i++){const plate=new THREE.Mesh(new THREE.BoxGeometry(2.4,.68,.12),dark);plate.position.set(1.25,3.2-i*1.6,-.1);add(g,plate);add(g,wire(plate.geometry,0x8c68ff,.5)).position.copy(plate.position);}
  particles(g,700,15);
 }
 // SKILLS — rotating polyhedral constellation and a web of luminous connections.
 {
  const g=makeGroup('skills');
  const geo=new THREE.IcosahedronGeometry(1.7,2),ico=new THREE.Mesh(geo,blue);add(g,ico);add(g,wire(geo,0x5fe5ff,.7));
  for(let i=0;i<14;i++){const a=i*2.399,b=Math.acos(1-2*(i+.5)/14),r=3.2;const x=r*Math.sin(b)*Math.cos(a),y=r*Math.cos(b),z=r*Math.sin(b)*Math.sin(a);sphere(g,.12,i%3?violet:cyanMat,x,y,z,16);const line=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,y,z),new THREE.Vector3(0,0,0)]);add(g,new THREE.Line(line,new THREE.LineBasicMaterial({color:i%3?0x895aff:0x28dfff,transparent:true,opacity:.45})));torus(g,.22,.012,i%3?violet:cyanMat,x,y,z,Math.PI/2,0,0);}
  particles(g,1200,17);
  g.userData.spin=[ico];
 }
 // LEARNING — open holographic book with floating data rings.
 {
  const g=makeGroup('learning');
  const left=new THREE.Mesh(new THREE.BoxGeometry(2.3,2.8,.16),blue);left.position.set(-1.12,0,0);left.rotation.y=-.22;add(g,left);
  const right=new THREE.Mesh(new THREE.BoxGeometry(2.3,2.8,.16),violet);right.position.set(1.12,0,0);right.rotation.y=.22;add(g,right);
  for(let i=0;i<7;i++){const line=new THREE.Mesh(new THREE.BoxGeometry(1.55,.025,.025),silver);line.position.set(-1.1,-.75+i*.24,.12);add(g,line);const line2=line.clone();line2.position.x=1.1;add(g,line2);}
  torus(g,3.1,.02,cyanMat,0,0,-.8,.3,.2,0);torus(g,3.5,.014,violet,0,0,-.8,-.4,.1,0);particles(g,1000,17);
 }
 // CERTIFICATIONS — 3D credential medallions on a rotating orbital display.
 {
  const g=makeGroup('certifications');
  for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a)*2.5,y=Math.sin(a)*1.8;const medal=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.16,48),i%2?violet:blue);medal.position.set(x,y,0);medal.rotation.x=Math.PI/2;add(g,medal);torus(g,.48,.035,silver,x,y,.1,Math.PI/2,0,0);sphere(g,.16,cyanMat,x,y,.15,20);}
  const core=new THREE.Mesh(new THREE.OctahedronGeometry(1.05,1),silver);add(g,core);particles(g,850,16);g.userData.spin=[core];
 }
 // RECOGNITION — sculptural trophy, laurel rings and floating stars.
 {
  const g=makeGroup('recognition');
  const cup=new THREE.Mesh(new THREE.CylinderGeometry(.5,.85,1.35,48,1,true),violet);cup.position.y=.45;add(g,cup);
  torus(g,.55,.12,silver,0,1.14,0,Math.PI/2,0,0);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.14,.2,.85,24),silver);stem.position.y=-.55;add(g,stem);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.22,48),blue);base.position.y=-1.05;add(g,base);
  for(let i=0;i<2;i++){const laurel=torus(g,1.65,.045,i?cyanMat:violet,(i?1:-1)*1.4,0,0,Math.PI/2,(i?1:-1)*.35,0);laurel.scale.set(.7,1.2,1);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;sphere(g,.09,silver,Math.cos(a)*2.8,Math.sin(a)*2.8,0,12);}
  particles(g,900,16);
 }
 // CONTACT — luminous portal gateway and animated data stream.
 {
  const g=makeGroup('contact');
  torus(g,2.65,.17,violet,0,0,0,0,0,0);torus(g,2.3,.045,cyanMat,0,0,.12,0,0,0);
  const portal=new THREE.Mesh(new THREE.CircleGeometry(2.25,80),new THREE.MeshBasicMaterial({color:0x24105b,transparent:true,opacity:.28,side:THREE.DoubleSide}));portal.position.z=-.18;add(g,portal);
  for(let i=0;i<18;i++){const a=i*Math.PI*2/18;sphere(g,.08,i%2?cyanMat:violet,Math.cos(a)*3.25,Math.sin(a)*3.25,.2,14);}
  particles(g,1450,18);
 }
 const order=sections.map(s=>s.id||s.className.split(' ')[0]);
 let active=order[0],target=order[0],mouseX=0,mouseY=0,scrollMix=0,last=0,raf=0;
 const setActive=id=>{if(!groups[id])id=order.find(x=>groups[x])||'home';target=id;Object.entries(groups).forEach(([k,g])=>g.visible=k===id);};
 sections.forEach(s=>{if(!groups[s.id]){const key=s.classList.contains('recognition')?'recognition':s.id;if(groups[key])s.dataset.scene=key;}});
 const resolve=s=>groups[s.id]?s.id:(s.classList.contains('recognition')?'recognition':s.id);
 const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){active=resolve(e.target);setActive(active);}});},{threshold:.32});
 sections.forEach(s=>io.observe(s));setActive(resolve(sections[0]));
 const pointer=e=>{mouseX=(e.clientX/innerWidth-.5)*.8;mouseY=(e.clientY/innerHeight-.5)*.55;};
 if(!coarse)window.addEventListener('pointermove',pointer,{passive:true});
 window.addEventListener('scroll',()=>{scrollMix=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);},{passive:true});
 const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.25:1.8));renderer.setSize(innerWidth,innerHeight,false);};
 window.addEventListener('resize',resize,{passive:true});
 const clock=new THREE.Clock();
 const render=now=>{
  raf=0;if(document.hidden)return;
  if(!reduce)raf=requestAnimationFrame(render);
  if(now-last<28)return;last=now;
  const t=clock.getElapsedTime(),g=groups[active];
  if(g){
   g.rotation.y+=.0018;
   g.rotation.x=Math.sin(t*.24)*.055;
   g.position.x+=(mouseX*.55-g.position.x)*.025;
   g.position.y+=(-mouseY*.42-g.position.y)*.025;
   const spin=g.userData.spin||[];spin.forEach((m,i)=>{m.rotation.y=t*(.16+i*.06);m.rotation.x=t*(.08+i*.035);});
  }
  camera.position.x+=(mouseX*.38-camera.position.x)*.025;
  camera.position.y+=(-mouseY*.28-camera.position.y)*.025;
  camera.position.z=11+Math.sin(t*.18)*.16;
  camera.lookAt(0,0,0);key.position.x=Math.sin(t*.45)*5;cyan.position.y=Math.cos(t*.38)*3;
  renderer.render(scene,camera);
 };
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else if(!reduce&&!raf)raf=requestAnimationFrame(render);});
 if(!reduce)raf=requestAnimationFrame(render);else renderer.render(scene,camera);
 canvas.classList.add('world-ready');
 window.addEventListener('beforeunload',()=>{io.disconnect();renderer.dispose();},{once:true});
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
 // Kinetic typography: each visible character arrives with a compact, staggered lift.
 const splitText=el=>{
  if(el.dataset.kinetic==='done')return;
  const original=el.textContent.trim();if(!original)return;
  el.dataset.kinetic='done';el.setAttribute('aria-label',original);
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{
   const fragment=document.createDocumentFragment();
   [...node.textContent].forEach((char,i)=>{
    const span=document.createElement('span');span.className='kinetic-char';
    span.textContent=char===' '?'\\u00a0':char;span.style.setProperty('--char-index',i);
    fragment.appendChild(span);
   });
   node.parentNode.replaceChild(fragment,node);
  });
 };
 if(!reduce){
  const heroTimeline=gsap.timeline({defaults:{ease:'power4.out'}});
  const heroEyebrow=document.querySelector('.hero-left .eyebrow');
  const heroTitle=document.querySelector('.hero h1');
  const heroRoles=document.querySelector('.hero-left .roles');
  const heroCopy=document.querySelector('.hero-left .hero-copy');
  const heroButtons=document.querySelector('.hero-left .hero-buttons');
  const heroSocials=document.querySelector('.hero-left .socials');
  const heroPortrait=document.querySelector('.hero-art .portrait-wrap');
  if(heroEyebrow)heroTimeline.fromTo(heroEyebrow,{y:24,opacity:0,filter:'blur(8px)'},{y:0,opacity:1,filter:'blur(0)',duration:.65},0);
  if(heroTitle)heroTimeline.fromTo(heroTitle,{y:70,opacity:0,rotateX:-28,filter:'blur(12px)'},{y:0,opacity:1,rotateX:0,filter:'blur(0px)',duration:1.05},.08);
  if(heroRoles)heroTimeline.fromTo(heroRoles,{y:22,opacity:0},{y:0,opacity:1,duration:.62},.32);
  if(heroCopy)heroTimeline.fromTo(heroCopy,{y:28,opacity:0},{y:0,opacity:1,duration:.7},.42);
  if(heroButtons)heroTimeline.fromTo(heroButtons,{y:24,opacity:0,scale:.97},{y:0,opacity:1,scale:1,duration:.62},.55);
  if(heroSocials)heroTimeline.fromTo(heroSocials,{y:18,opacity:0},{y:0,opacity:1,duration:.55},.68);
  if(heroPortrait)heroTimeline.fromTo(heroPortrait,{y:52,opacity:0,scale:.94,filter:'blur(8px)'},{y:0,opacity:1,scale:1,filter:'blur(0)',duration:1.1,ease:'power3.out'},.3);
  if(desktop){
   const homeCards=document.querySelectorAll('.hero-art .code-window,.hero-art .focus-card,.hero>.stats');
   if(homeCards.length)heroTimeline.fromTo(homeCards,{y:30,opacity:0,rotateY:8},{y:0,opacity:1,rotateY:0,duration:.8,stagger:.13},.48);
  }
  if(heroTitle){
   // Keep the accent dot visually intact while animating the title as a single kinetic unit.
   gsap.fromTo(heroTitle,{y:70,opacity:0,rotateX:-28,filter:'blur(12px)'},{y:0,opacity:1,rotateX:0,filter:'blur(0px)',duration:1.25,delay:.08,ease:'power4.out'});
  }
  document.querySelectorAll('.section-head h2').forEach((h,i)=>{
   splitText(h);
   gsap.fromTo(h.querySelectorAll('.kinetic-char'),{yPercent:115,rotateX:-65,opacity:0},{yPercent:0,rotateX:0,opacity:1,duration:.72,stagger:.022,ease:'back.out(1.35)',scrollTrigger:{trigger:h,start:'top 84%',once:true}});
  });
  // Chapter-by-chapter scroll reveals, each with its own visual rhythm.
  document.querySelectorAll('main section').forEach((section,index)=>{
   const head=section.querySelector('.section-head');
   const copy=section.querySelector('.about-copy,.hero-copy,.contact-panel>div:first-child');
   if(head)gsap.fromTo(head,{y:64,opacity:0,filter:'blur(10px)'},{y:0,opacity:1,filter:'blur(0px)',duration:1,scrollTrigger:{trigger:section,start:'top 78%',once:true}});
   if(copy&&section.id!=='home')gsap.fromTo(copy,{y:36,opacity:0},{y:0,opacity:1,duration:.9,delay:.08,scrollTrigger:{trigger:copy,start:'top 88%',once:true}});
   const cards=section.querySelectorAll('.project,.timeline article,.skill-grid>div,.certificate-card,.recognition-grid>div');
   if(cards.length)gsap.fromTo(cards,{y:58,opacity:0,rotateX:desktop?12:0,rotateY:desktop?index%2?7:-7:0,scale:.94,transformPerspective:1200},{y:0,opacity:1,rotateX:0,rotateY:0,scale:1,duration:1,stagger:.095,ease:'power3.out',scrollTrigger:{trigger:cards[0].parentElement,start:'top 82%',once:true}});
  });
  // Multi-plane parallax: foreground subject, interface panels and orbit move at different speeds.
  if(desktop){
   const parallax=[
    ['.hero-art',-90],['.portrait-wrap',-48],['.globe',35],['.about-visual',-58],
    ['.contact-orb',75],['.contact-panel',-22]
   ];
   parallax.forEach(([selector,amount])=>document.querySelectorAll(selector).forEach(el=>{
    gsap.to(el,{y:amount,ease:'none',scrollTrigger:{trigger:el.closest('section')||el,start:'top bottom',end:'bottom top',scrub:1.15}});
   }));
   // Layered 3D tilt on section feature visuals, tied to the scroll position.
   document.querySelectorAll('.about-visual,.contact-panel,.hero-art').forEach(el=>{
    gsap.fromTo(el,{rotateX:4,rotateY:-3,transformPerspective:1400},{rotateX:-2,rotateY:3,ease:'none',scrollTrigger:{trigger:el.closest('section'),start:'top bottom',end:'bottom top',scrub:1.4}});
   });
  }
  // Scroll-driven chapter progress line.
  document.querySelectorAll('.timeline').forEach(el=>{
   gsap.fromTo(el,{ '--timeline-progress':0 },{'--timeline-progress':1,ease:'none',scrollTrigger:{trigger:el,start:'top 72%',end:'bottom 58%',scrub:true}});
  });
  // Ambient scroll-linked motion in the project gallery.
  const gallery=document.querySelector('.project-grid');
  if(gallery&&desktop)gsap.to(gallery,{y:-34,ease:'none',scrollTrigger:{trigger:gallery,start:'top bottom',end:'bottom top',scrub:1.1}});
 }
 // Fluid page navigation: native scroll remains available, but links glide to chapters.
 document.documentElement.style.scrollBehavior=reduce?'auto':'smooth';
 // Refresh after fonts/images settle so scroll scenes use accurate geometry.
 window.addEventListener('load',()=>{ST.refresh();setTimeout(()=>ST.refresh(),450);},{once:true});
 window.addEventListener('resize',()=>ST.refresh(),{passive:true});
})();
