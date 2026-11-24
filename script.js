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
 if(coarse){canvas.classList.add('mobile-scene-disabled');return;}
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
 camera.position.set(0,0,coarse?15.5:13.5);
 const ambient=new THREE.AmbientLight(0x8cbfcf,.72);scene.add(ambient);
 const key=new THREE.PointLight(0x397dff,2.6,34);key.position.set(-4,3,6);scene.add(key);
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
 const makeGroup=(id)=>{const g=new THREE.Group();g.visible=false;g.userData.basePosition=new THREE.Vector3();root.add(g);groups[id]=g;return g;};
 // HOME — compact orbital data planet, offset away from the text.
 {
  const g=makeGroup('home');g.userData.basePosition.set(3.6,-.7,-.4);g.scale.setScalar(.72);
  sphere(g,1.52,dark,0,0,-1,64);
  const globe=sphere(g,1.49,mat(0x123a55,.5,.48,0x0b4a62),0,0,-1,64);
  const shell=new THREE.Mesh(new THREE.SphereGeometry(1.56,48,48),new THREE.MeshBasicMaterial({color:0x26c6da,wireframe:true,transparent:true,opacity:.13}));shell.position.z=-1;add(g,shell);
  torus(g,2.1,.018,cyanMat,0,0,-.8,.35,.12,.15);torus(g,2.35,.012,violet,0,0,-1.1,-.45,.1,-.2);
  sphere(g,.12,cyanMat,1.85,.65,.1,20);particles(g,900,14);g.userData.spin=[globe,shell];
 }
 // ABOUT — compact holographic atom, not a giant foreground object.
 {
  const g=makeGroup('about');g.userData.basePosition.set(3.5,-.35,-.5);g.scale.setScalar(.62);
  const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.2,.23,180,18,2,5),violet);add(g,knot);
  knot.add(wire(new THREE.TorusKnotGeometry(1.2,.23,80,8,2,5),0x52dfff,.3));
  for(let i=0;i<3;i++)torus(g,2.05+i*.18,.014,i===1?cyanMat:violet,0,0,0,Math.PI/2.4,i*Math.PI/3,0);
  sphere(g,.28,silver,0,0,0,28);particles(g,500,13);g.userData.spin=[knot];
 }
 // PROJECTS — holographic code panels instead of random floating cubes.
 {
  const g=makeGroup('projects');g.userData.basePosition.set(3.6,-.2,-.5);g.scale.setScalar(.68);
  for(let i=0;i<4;i++){
   const w=2.2+(i%2)*.35,h=1.12;
   const panel=new THREE.Mesh(new THREE.BoxGeometry(w,h,.075),i%2?dark:blue);
   panel.position.set((i%2?1:-1)*.95,1.15-Math.floor(i/2)*1.7,(i%2)*.18);panel.rotation.y=(i%2?-.16:.16);add(g,panel);
   add(g,wire(panel.geometry,i%2?0x31d6e8:0x9b70ff,.62)).position.copy(panel.position);
   for(let line=0;line<3;line++){const bar=new THREE.Mesh(new THREE.BoxGeometry(w*.62,.035,.02),line===0?cyanMat:silver);bar.position.set(panel.position.x-w*.12,panel.position.y-.18-line*.2,.09);add(g,bar);}
   sphere(g,.055,i%2?cyanMat:violet,panel.position.x-w*.38,panel.position.y+.38,.12,12);
  }
  torus(g,2.75,.014,cyanMat,0,0,-.7,.15,.12,0);particles(g,520,13);
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
   const base=g.userData.basePosition||new THREE.Vector3();
   g.position.x+=(base.x+mouseX*.55-g.position.x)*.025;
   g.position.y+=(base.y-mouseY*.42-g.position.y)*.025;
   const spin=g.userData.spin||[];spin.forEach((m,i)=>{m.rotation.y=t*(.16+i*.06);m.rotation.x=t*(.08+i*.035);});
  }
  camera.position.x+=(mouseX*.38-camera.position.x)*.025;
  camera.position.y+=(-mouseY*.28-camera.position.y)*.025;
  camera.position.z=(coarse?15.5:13.5)+Math.sin(t*.18)*.12;
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

/* Matrix rain for the loader: actual code glyphs, not a flat purple gradient */
(()=>{
 const canvas=document.querySelector('.loader-matrix'),loader=document.getElementById('site-loader');
 if(!canvas||!loader)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const glyphs='0101 1010 0x7F 0xFF 0xA1 0xB4 <> {} [] () => const let async await function return class import export npm git push commit deploy';
 let cols=[],font=15,raf=0,last=0,active=true;
 const resize=()=>{
  const dpr=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);
  canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  font=Math.max(12,Math.min(17,innerWidth/88));
  cols=Array.from({length:Math.ceil(innerWidth/font)+1},(_,i)=>({x:i*font,y:Math.random()*-innerHeight,speed:.55+Math.random()*1.15,trail:10+Math.random()*20}));
 };
 const draw=now=>{
  raf=0;if(!active||!loader.isConnected||document.hidden)return;
  raf=requestAnimationFrame(draw);if(now-last<38)return;last=now;
  ctx.fillStyle='rgba(2,8,16,.13)';ctx.fillRect(0,0,innerWidth,innerHeight);
  ctx.font=font+'px monospace';ctx.textAlign='center';
  for(const c of cols){
   for(let n=0;n<c.trail;n++){
    const y=c.y-n*font;if(y<0||y>innerHeight)continue;
    const alpha=Math.max(.035,.5-n/c.trail*.46);
    ctx.fillStyle=n===0?'rgba(103,255,218,.98)':(n%5===0?'rgba(52,211,153,'+alpha+')':'rgba(75,160,185,'+alpha+')');
    ctx.fillText(glyphs[Math.floor(Math.random()*glyphs.length)],c.x,y);
   }
   c.y+=font*c.speed;if(c.y-c.trail*font>innerHeight)c.y=-Math.random()*innerHeight*.4;
  }
 };
 const io=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active&&!raf&&!document.hidden)raf=requestAnimationFrame(draw);else if(!active&&raf){cancelAnimationFrame(raf);raf=0;}});
 io.observe(loader);document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else if(active&&loader.isConnected&&!raf)raf=requestAnimationFrame(draw);});
 window.addEventListener('resize',resize,{passive:true});resize();raf=requestAnimationFrame(draw);
})();

/* Legacy cyber-globe loader removed; the 22-second cinematic renderer below owns this canvas. */

/* Adaptive 10-second cinematic universe intro — Three.js procedural CGI sequence */
(()=>{
 const root=document.getElementById('site-loader');
 if(!root||root.dataset.introInit==='1')return;
 root.dataset.introInit='1';
 const canvas=root.querySelector('.loader-3d-scene');
 const sceneLabel=document.getElementById('space-scene-name');
 const caption=document.getElementById('space-caption');
 const progress=document.getElementById('space-progress-bar');
 const finalPanel=document.getElementById('space-final');
 const flash=document.getElementById('space-flash');
 const enter=document.getElementById('enter-portfolio');
 const skip=document.getElementById('space-skip');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const coarse=window.matchMedia('(pointer:coarse)').matches;
 let finished=false,started=performance.now(),raf=0,renderer=null,cleanup=()=>{};
 const finish=()=>{
  if(finished)return;finished=true;
  root.classList.add('space-exit');
  document.body.classList.remove('is-loading');
  window.setTimeout(()=>{
   root.remove();
   const home=document.getElementById('home');
   if(home)home.scrollIntoView({behavior:'smooth',block:'start'});
   window.dispatchEvent(new CustomEvent('portfolio:intro-complete'));
  },420);
 };
 enter?.addEventListener('click',(event)=>{event.preventDefault();finish();});
 skip?.addEventListener('click',finish);
 window.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!finished)finish();});
 const scenes=[
  {at:0,name:'THE BEGINNING OF EVERYTHING',caption:'Somewhere, a universe begins.'},
  {at:2,name:'THE MILKY WAY',caption:'A billion stars. One extraordinary galaxy.'},
  {at:4,name:'A BLUE WORLD',caption:'Across the cosmos, a home comes into view.'},
  {at:7,name:'THE JOURNEY HOME',caption:'Closer to everything that makes us human.'},
  {at:9,name:'WELCOME TO MY UNIVERSE',caption:'Creativity, technology and everything in between.'}
 ];
 let currentScene=-1;
 const setScene=(index)=>{
  if(index===currentScene)return;currentScene=index;
  const item=scenes[index];if(!item)return;
  if(sceneLabel)sceneLabel.textContent=item.name;
  if(caption)caption.innerHTML='<span class="space-caption-index">0'+(index+1)+' — 05</span><span>'+item.caption+'</span>';
  root.dataset.scene=String(index+1);
  if(index===4){root.classList.add('space-reveal');finalPanel?.classList.add('visible');finalPanel?.setAttribute('aria-hidden','false');}
 };
 const THREE=window.THREE;
 if(!THREE){
  root.classList.add('space-fallback');
  setScene(4);finalPanel?.classList.add('visible');finalPanel?.setAttribute('aria-hidden','false');
  if(progress)progress.style.width='100%';
  return;
 }
 try{
  const renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:!coarse,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,coarse?1.25:1.8));
  renderer.setSize(innerWidth,innerHeight,false);
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.12;
  const world=new THREE.Scene();world.background=new THREE.Color(0x01030a);
  const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,240);
  camera.position.set(0,0,26);
  const ambient=new THREE.AmbientLight(0x9ab9d8,.48);world.add(ambient);
  const sun=new THREE.PointLight(0xdceaff,3.8,100,1.5);sun.position.set(-8,5,12);world.add(sun);
  const fill=new THREE.PointLight(0x287bff,1.5,70,2);fill.position.set(8,-5,8);world.add(fill);
  const universe=new THREE.Group();world.add(universe);
  const makeStars=(count,radius,size,opacity,color=0xc8d9ff)=>{
   const arr=new Float32Array(count*3),sizes=new Float32Array(count);
   for(let i=0;i<count;i++){const u=Math.random()*2-1,a=Math.random()*Math.PI*2,r=radius*Math.pow(Math.random(),.42);arr[i*3]=Math.sqrt(1-u*u)*Math.cos(a)*r;arr[i*3+1]=u*r*.68;arr[i*3+2]=Math.sqrt(1-u*u)*Math.sin(a)*r;sizes[i]=.45+Math.random()*1.8;}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(arr,3));geo.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
   const points=new THREE.Points(geo,new THREE.PointsMaterial({color,size,transparent:true,opacity,depthWrite:false,sizeAttenuation:true,blending:THREE.AdditiveBlending}));
   universe.add(points);return points;
  };
  const starfield=makeStars(coarse?2800:9000,105,coarse?.095:.12,.88,0xc9e5ff);
  const galaxy=new THREE.Group();universe.add(galaxy);galaxy.position.set(0,0,-3);
  const galaxyCount=coarse?18000:52000,positions=new Float32Array(galaxyCount*3),colors=new Float32Array(galaxyCount*3);
  const colorA=new THREE.Color(0x536dff),colorB=new THREE.Color(0xe7a4ff),colorC=new THREE.Color(0x42cfff);
  for(let i=0;i<galaxyCount;i++){
   const arm=i%5,rad=Math.pow(Math.random(),.56)*10.5,angle=arm*Math.PI*2/5+rad*.72+(Math.random()-.5)*.52;
   positions[i*3]=Math.cos(angle)*rad+(Math.random()-.5)*(.18+rad*.045);
   positions[i*3+1]=Math.sin(angle)*rad*.62+(Math.random()-.5)*(.18+rad*.045);
   positions[i*3+2]=(Math.random()-.5)*(.22+rad*.065);
   const mix=Math.min(1,rad/10),col=colorA.clone().lerp(colorB,Math.random()*.45).lerp(colorC,Math.random()*.18*mix);
   const core=Math.max(0,1-rad/3.2);col.lerp(new THREE.Color(0xffe8cf),core*.72);
   colors[i*3]=col.r;colors[i*3+1]=col.g;colors[i*3+2]=col.b;
  }
  const galaxyGeo=new THREE.BufferGeometry();galaxyGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));galaxyGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const galaxyPoints=new THREE.Points(galaxyGeo,new THREE.PointsMaterial({size:coarse?.055:.072,vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
  galaxy.add(galaxyPoints);
  const coreGlow=new THREE.Mesh(new THREE.SphereGeometry(1.15,32,32),new THREE.MeshBasicMaterial({color:0xffc9e8,transparent:true,opacity:0}));
  const glowMat=new THREE.SpriteMaterial({map:(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(255,239,224,.9)');g.addColorStop(.18,'rgba(255,165,220,.45)');g.addColorStop(.5,'rgba(112,105,255,.15)');g.addColorStop(1,'rgba(20,40,120,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(c);})(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0});
  const glow=new THREE.Sprite(glowMat);glow.scale.set(10,10,1);galaxy.add(glow);galaxy.add(coreGlow);
  const nebulaMat=new THREE.SpriteMaterial({map:(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(68,115,255,.28)');g.addColorStop(.38,'rgba(90,50,190,.16)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(c);})(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.0});
  for(let i=0;i<8;i++){const sp=new THREE.Sprite(nebulaMat.clone());sp.position.set((Math.random()-.5)*23,(Math.random()-.5)*11,-4-Math.random()*8);sp.scale.set(9+Math.random()*8,4+Math.random()*5,1);universe.add(sp);}
  // High-detail satellite Earth textures (Three.js public planet maps); procedural fallback keeps the intro resilient.
  const textureLoader=new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');
  const earthMap=textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
  earthMap.encoding=THREE.sRGBEncoding;
  const earthNormal=textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
  const earthCloudMap=textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png');
  const earthGroup=new THREE.Group();world.add(earthGroup);earthGroup.position.set(0,0,0);
  const earthMaterial=new THREE.MeshPhongMaterial({map:earthMap,normalMap:earthNormal,normalScale:new THREE.Vector2(.7,.7),specular:new THREE.Color(0x263d5a),shininess:18});
  const earth=new THREE.Mesh(new THREE.SphereGeometry(2.1,128,128),earthMaterial);
  earth.rotation.z=.32;earthGroup.add(earth);
  const clouds=new THREE.Mesh(new THREE.SphereGeometry(2.135,96,96),new THREE.MeshPhongMaterial({map:earthCloudMap,transparent:true,opacity:.5,depthWrite:false,blending:THREE.NormalBlending}));
  earthGroup.add(clouds);
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(2.23,96,96),new THREE.MeshBasicMaterial({color:0x369dff,transparent:true,opacity:.28,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}));earthGroup.add(atmosphere);
  const atmosphereRim=new THREE.Mesh(new THREE.SphereGeometry(2.19,96,96),new THREE.MeshBasicMaterial({color:0x7bcfff,transparent:true,opacity:.12,side:THREE.FrontSide,blending:THREE.AdditiveBlending,depthWrite:false}));earthGroup.add(atmosphereRim);
  // A soft sunrise sprite catches the limb as the camera approaches the horizon.
  const sunCanvas=document.createElement('canvas');sunCanvas.width=sunCanvas.height=256;
  const sunCtx=sunCanvas.getContext('2d'),sunGrad=sunCtx.createRadialGradient(128,128,2,128,128,128);
  sunGrad.addColorStop(0,'rgba(255,255,245,1)');sunGrad.addColorStop(.12,'rgba(255,229,188,.92)');sunGrad.addColorStop(.28,'rgba(255,176,104,.35)');sunGrad.addColorStop(1,'rgba(255,140,60,0)');
  sunCtx.fillStyle=sunGrad;sunCtx.fillRect(0,0,256,256);
  const sunSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(sunCanvas),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));
  sunSprite.scale.set(1.25,1.25,1);sunSprite.position.set(2.35,1.25,1.8);earthGroup.add(sunSprite);
  earthGroup.visible=false;
  // A small distant moon and a few passing asteroids add scale during approach.
  const moonMap=textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg');
  const moon=new THREE.Mesh(new THREE.SphereGeometry(.32,48,48),new THREE.MeshStandardMaterial({map:moonMap,roughness:1}));moon.position.set(4.5,1.8,-1.8);world.add(moon);
  const asteroidGroup=new THREE.Group();world.add(asteroidGroup);
  for(let i=0;i<32;i++){const a=new THREE.Mesh(new THREE.IcosahedronGeometry(.045+Math.random()*.09,0),new THREE.MeshStandardMaterial({color:0x647080,roughness:1}));a.position.set((Math.random()-.5)*16,(Math.random()-.5)*10,-2-Math.random()*12);a.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);asteroidGroup.add(a);}
  const flashLight=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshBasicMaterial({color:0xe7f7ff,transparent:true,opacity:0,depthWrite:false}));flashLight.position.set(0,0,5);camera.add(flashLight);world.add(camera);
  const lerp=(a,b,t)=>a+(b-a)*Math.max(0,Math.min(1,t));
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  const render=(now)=>{
   raf=requestAnimationFrame(render);
   const elapsed=(now-started)/1000,sec=Math.min(9,elapsed);
   if(progress)progress.style.width=(Math.min(100,sec/9*100))+'%';
   const sceneIndex=sec<1.5?0:sec<3?1:sec<5?2:sec<7?3:4;setScene(sceneIndex);
   const fadeIn=smooth(sec/.45),galaxyIn=smooth((sec-1.8)/.55),earthIn=smooth((sec-4)/.55);
   starfield.material.opacity=lerp(.0,.9,fadeIn);
   galaxyPoints.material.opacity=.98*galaxyIn;glowMat.opacity=.92*galaxyIn;coreGlow.material.opacity=.22*galaxyIn;
   galaxy.rotation.z=sec*.035;galaxy.rotation.x=.12+Math.sin(sec*.16)*.025;
   if(sec<2){camera.position.set(0,0,lerp(28,18,smooth(sec/1.5)));camera.lookAt(0,0,0);earthGroup.visible=false;}
   else if(sec<4){const orbit=smooth((sec-1.5)/1.5)*Math.PI*1.15;camera.position.set(Math.sin(orbit)*12.5,Math.sin(orbit*.72)*4.2,Math.cos(orbit)*12.5+3);camera.lookAt(0,0,-3);earthGroup.visible=false;}
   else if(sec<7){earthGroup.visible=true;camera.position.set(lerp(2.1,0,smooth((sec-3)/2)),lerp(.8,.15,smooth((sec-4)/3)),lerp(11,7.7,smooth((sec-4)/3)));camera.lookAt(0,0,0);earthGroup.scale.setScalar(lerp(.001,1,smooth((sec-3)/.65)));galaxyPoints.material.opacity=lerp(.98,.015,smooth((sec-3)/1.4));sunSprite.material.opacity=.85*smooth((sec-4.3)/.8);}
   else if(sec<7.8){earthGroup.visible=true;const approach=smooth((sec-5)/2.8);earthGroup.scale.setScalar(lerp(1,1.2,approach));camera.position.set(0,lerp(.15,0,approach),lerp(7.7,5.2,approach));camera.lookAt(0,0,0);earth.rotation.y+=.0018;clouds.rotation.y+=.0025;sunSprite.material.opacity=.85;}
   else{earthGroup.visible=true;const reveal=smooth((sec-7.8)/.6);earthGroup.scale.setScalar(lerp(1.2,1.5,reveal));earthGroup.position.set(0,0,0);camera.position.set(0,0,lerp(5.2,4.5,reveal));camera.lookAt(0,0,0);earth.rotation.y+=.0018;clouds.rotation.y+=.0025;sunSprite.material.opacity=.9;flashLight.material.opacity=sec<8.25?lerp(0,.55,smooth((sec-7.8)/.3)):lerp(.55,0,smooth((sec-8.25)/.7));universe.rotation.z=sec*.002;}
   if(sec>=7.8&&finalPanel&&!finalPanel.classList.contains('visible')){finalPanel.classList.add('visible');finalPanel.setAttribute('aria-hidden','false');root.classList.add('space-reveal');}
   moon.rotation.y+=.001;asteroidGroup.rotation.y+=.0012;
   if(sec>=8){if(progress)progress.style.width='100%';if(sceneLabel)sceneLabel.textContent='YOUR UNIVERSE IS READY';}
   renderer.render(world,camera);
  };
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.25:1.8));renderer.setSize(innerWidth,innerHeight,false);};
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else if(!document.hidden&&!finished&&!raf){started=performance.now()-Math.min(9,(performance.now()-started)/1000)*1000;raf=requestAnimationFrame(render);}});
  cleanup=()=>{cancelAnimationFrame(raf);renderer.dispose();world.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});};
  raf=requestAnimationFrame(render);
  window.setTimeout(()=>{if(!finished){finalPanel?.classList.add('visible');finalPanel?.setAttribute('aria-hidden','false');root.classList.add('space-reveal');}},8400);
  // Never leave visitors trapped behind the cinematic intro.
  window.setTimeout(()=>{if(!finished)finish();},12500);
 }catch(error){
  console.error('Cinematic intro renderer fallback:',error);
  root.classList.add('space-fallback');setScene(4);finalPanel?.classList.add('visible');
 }
 window.addEventListener('beforeunload',cleanup,{once:true});
})();
