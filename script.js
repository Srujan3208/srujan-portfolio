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

/* 22-SECOND PROCEDURAL WEBGL INTRO — galaxy fly-through, Earth reveal, surface dive */
(()=>{
 const root=document.getElementById('site-loader'),canvas=document.getElementById('intro-cosmos');
 if(!root||!canvas)return;
 const fill=document.getElementById('intro-progress-fill'),percent=document.getElementById('intro-percent'),status=root.querySelector('.intro-status'),skip=document.getElementById('intro-skip');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let gl=null,program=null,raf=0,start=0,finished=false,skipRequested=false;
 const vertex='attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.0,1.0);}';
 const fragment=`
 precision highp float;
 varying vec2 vUv;
 uniform vec2 uResolution;
 uniform float uTime;
 uniform float uPhase;
 uniform float uZoom;
 uniform vec2 uPointer;
 float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){float v=0.0,a=.52;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.49;}return v;}
 vec3 galaxy(vec2 uv){
  vec2 p=uv-vec2(.5);p.x*=uResolution.x/uResolution.y;p+=uPointer*.018;
  float r=length(p),ang=atan(p.y,p.x),spin=ang+log(r+.035)*2.25-uTime*.055;
  float arms=pow(max(0.0,.5+.5*cos(spin*4.0)),8.0);
  float core=exp(-r*8.0),disc=exp(-r*2.35);
  float n=fbm(vec3(p*5.0,uTime*.025)),dust=fbm(vec3(p*12.0,1.4));
  float lanes=smoothstep(.28,.78,arms*.75+n*.4)*disc;
  float cloud=disc*(.12+n*.36)+lanes*.85;
  vec3 col=vec3(.012,.014,.045);
  col+=vec3(.12,.045,.28)*cloud;
  col+=vec3(.13,.25,.72)*pow(max(0.0,arms),1.7)*disc*.72;
  col+=vec3(.48,.12,.68)*lanes*.62;
  col+=vec3(.95,.58,.38)*core*.92;
  col*=.76+(.24*dust);
  float stars=0.0;vec2 cell=floor(uv*uResolution/vec2(3.2));float h=hash(vec3(cell,2.));
  vec2 local=fract(uv*uResolution/vec2(3.2))-.5;
  stars=step(.994,h)*pow(max(0.0,1.0-length(local)*2.0),5.0);
  float star2=step(.998,hash(vec3(floor(uv*uResolution/vec2(1.8)),7.)))*.8;
  col+=vec3(.65,.76,1.0)*(stars+star2*.6);
  col*=smoothstep(1.15,.12,r);
  return col;
 }
 vec3 earth(vec2 uv){
  vec2 p=uv-vec2(.51,.50);p.x*=uResolution.x/uResolution.y;p+=uPointer*.012;
  float radius=mix(.78,3.15,uZoom);
  float d=length(p),z=sqrt(max(0.0,radius*radius-d*d));
  vec3 n=normalize(vec3(p,z));
  float globe=step(d,radius);
  float landNoise=fbm(n*vec3(5.0,5.0,5.0)+vec3(2.3,1.7,.6));
  float ridge=fbm(n*12.0+vec3(3.1,0.0,1.8));
  float land=smoothstep(.49,.62,landNoise+ridge*.11);
  vec3 ocean=mix(vec3(.012,.045,.16),vec3(.018,.16,.34),smoothstep(-.2,.8,n.y));
  vec3 ground=mix(vec3(.025,.20,.19),vec3(.20,.32,.30),ridge);
  vec3 surface=mix(ocean,ground,land);
  float light= max(0.0,dot(n,normalize(vec3(-.48,.58,.72))));
  float cloud= smoothstep(.60,.78,fbm(n*22.0+vec3(0.0,uTime*.008,0.0)))*.22;
  surface=surface*(.22+light*.95)+cloud;
  float atmosphere=pow(1.0-max(0.0,n.z),3.0);
  vec3 rim=vec3(.10,.43,1.0)*atmosphere*1.8;
  return mix(vec3(0.0),surface+rim,globe);
 }
 void main(){
  vec2 uv=vUv;
  vec3 space=galaxy(uv);
  vec3 earthCol=earth(uv);
  float blend=smoothstep(0.0,1.0,uPhase);
  vec3 color=mix(space,earthCol,blend);
  float starfield=(hash(vec3(floor(uv*uResolution/2.2),5.))>.996)?1.0:0.0;
  color+=vec3(.48,.62,1.0)*starfield*(1.0-blend*.7);
  float vignette=smoothstep(1.15,.25,length((uv-.5)*vec2(uResolution.x/uResolution.y,1.0)));
  color*=.68+.32*vignette;
  color=pow(max(color,0.0),vec3(.88));
  gl_FragColor=vec4(color,1.0);
 }`;
 const compile=(type,source)=>{const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;};
 const init=()=>{
  try{
   gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'high-performance'})||canvas.getContext('experimental-webgl');
   if(!gl)return false;
   program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
   gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
   const loc=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
   canvas._uniforms={resolution:gl.getUniformLocation(program,'uResolution'),time:gl.getUniformLocation(program,'uTime'),phase:gl.getUniformLocation(program,'uPhase'),zoom:gl.getUniformLocation(program,'uZoom'),pointer:gl.getUniformLocation(program,'uPointer')};
   resize();return true;
  }catch(e){canvas.classList.add('intro-fallback');return false;}
 };
 const resize=()=>{if(!gl)return;const dpr=Math.min(devicePixelRatio||1,matchMedia('(min-width:1000px)').matches?1.5:1);canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(canvas._uniforms.resolution,canvas.width,canvas.height);};
 window.addEventListener('resize',resize,{passive:true});
 let px=0,py=0;window.addEventListener('pointermove',e=>{px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*-2;},{passive:true});
 const finish=()=>{if(finished)return;finished=true;if(raf)cancelAnimationFrame(raf);root.classList.add('intro-exit');setTimeout(()=>{root.remove();window.scrollTo(0,0);window.dispatchEvent(new CustomEvent('portfolio:intro-complete'));},1100);};
 const render=now=>{
  raf=requestAnimationFrame(render);const elapsed=Math.min(22,(now-start)/1000),phase=elapsed<8?0:elapsed<15?(elapsed-8)/7:1,zoom=elapsed<15?0:Math.min(1,(elapsed-15)/7);
  if(gl&&program){gl.useProgram(program);gl.uniform1f(canvas._uniforms.time,elapsed);gl.uniform1f(canvas._uniforms.phase,phase);gl.uniform1f(canvas._uniforms.zoom,zoom);gl.uniform2f(canvas._uniforms.pointer,px,py);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
  const p=Math.min(100,elapsed/22*100);if(fill)fill.style.width=p+'%';if(percent)percent.textContent=String(Math.floor(p)).padStart(2,'0')+'%';
  if(status)status.textContent=elapsed<8?'TRAVERSING THE MILKY WAY':elapsed<15?'APPROACHING PLANET EARTH':'DESCENDING TO THE SURFACE';
  if(elapsed>=22)finish();
 };
 const start=()=>{if(reduced){finish();return;}if(!init())root.classList.add('intro-fallback');start=performance.now();raf=requestAnimationFrame(render);};
 if(skip)skip.addEventListener('click',finish);root.addEventListener('pointerdown',e=>{if(e.target===root)finish();});
 window.addEventListener('keydown',e=>{if(e.key==='Escape')finish();},{once:true});
 start();
})();
