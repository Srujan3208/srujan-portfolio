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

/* Cinematic motion system: scroll storytelling, subtle parallax and spatial effects */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce)return;
 const sections=[...document.querySelectorAll('main .section,main .hero')];
 const inView=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('in-view');}
  else if(entry.boundingClientRect.top>0){entry.target.classList.remove('in-view')}
 }),{threshold:.18});
 sections.forEach(section=>inView.observe(section));
 let ticking=false;
 const cinematicScroll=()=>{
  if(ticking)return;ticking=true;
  requestAnimationFrame(()=>{
   const y=scrollY,hero=document.querySelector('.hero'),grid=document.querySelector('.hero-grid'),left=document.querySelector('.hero-left'),art=document.querySelector('.hero-art');
   if(hero&&y<innerHeight*1.25){
    const p=Math.min(y/innerHeight,1);
    if(grid)grid.style.setProperty('--hero-grid-y',(-y*.14)+'px');
    if(left){left.style.transform='translate3d(0,'+(y*.08)+'px,0)';left.style.opacity=String(1-p*.28)}
    if(art)art.style.transform='translate3d(0,'+(y*.045)+'px,0)';
   }else{if(left){left.style.transform='';left.style.opacity=''}if(art)art.style.transform=''}
   document.querySelectorAll('.section.in-view').forEach(section=>{
    const rect=section.getBoundingClientRect();
    section.style.setProperty('--section-y',Math.max(0,Math.min(100,50-rect.top/innerHeight*18))+'%');
   });
   ticking=false;
  });
 };
 addEventListener('scroll',cinematicScroll,{passive:true});cinematicScroll();
})();

/* Force the cinematic layer to activate after the DOM is ready */
document.documentElement.classList.add('cinematic-ready');
document.body.classList.add('cinematic-ready');
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce)return;
 const cards=document.querySelectorAll('.project,.certificate-card,.cert-card,.recognition-grid>div');
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('motion-visible');observer.unobserve(e.target)}
 }),{threshold:.12});
 cards.forEach(card=>observer.observe(card));
 const hero=document.querySelector('.hero');
 const art=document.querySelector('.hero-art');
 const portrait=document.querySelector('.portrait-wrap');
 let busy=false;
 addEventListener('scroll',()=>{
  if(busy)return;busy=true;
  requestAnimationFrame(()=>{
   const progress=Math.min(scrollY/(innerHeight||1),1);
   if(hero){hero.style.setProperty('--scroll-scene',progress)}
   if(art&&scrollY<innerHeight){art.style.setProperty('--parallax-y',scrollY*.12+'px')}
   busy=false;
  });
 },{passive:true});
})();

/* REAL-TIME WEBGL CINEMATIC NEBULA — desktop GPU layer */
(()=>{
 const canvas=document.getElementById('cinematic-webgl');
 if(!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'high-performance'});
 if(!gl){canvas.style.display='none';return}
 const vertex='attribute vec2 p; void main(){gl_Position=vec4(p,0.0,1.0);}';
 const fragment=`
 precision mediump float;
 uniform vec2 resolution;
 uniform vec2 pointer;
 uniform float time;
 uniform float scroll;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
 float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=noise(p)*a;p*=2.03;a*=.5;}return v;}
 void main(){
  vec2 uv=(gl_FragCoord.xy-resolution*.5)/resolution.y;
  vec2 m=(pointer-resolution*.5)/resolution.y;
  uv+=m*.055;
  float t=time*.055+scroll*.25;
  vec2 q=uv;
  q.x+=.12*sin(uv.y*2.3+t);q.y+=.12*cos(uv.x*2.1-t);
  float n=fbm(q*2.2+vec2(t,-t));
  float n2=fbm(q*3.7-vec2(t*.7,t*.4));
  float cloud=smoothstep(.34,.78,n*.65+n2*.35);
  float bands=sin((q.x*1.8+q.y*1.1+n*1.2+t)*4.0);
  float energy=pow(max(0.,cloud),2.2)*(.65+.35*bands);
  vec3 purple=vec3(.23,.035,.58),violet=vec3(.48,.12,.95),cyan=vec3(.025,.45,.68),pink=vec3(.62,.06,.38);
  vec3 col=mix(purple,violet,smoothstep(.2,.8,n));
  col=mix(col,cyan,smoothstep(.52,.88,n2)*.55);
  col=mix(col,pink,smoothstep(.6,.95,noise(q*5.+t))*0.3);
  col*=energy;
  float glow=exp(-length(uv-m*.3)*4.5)*.18;
  col+=vec3(.16,.06,.35)*glow;
  // layered starfield
  vec2 st=gl_FragCoord.xy/resolution;
  float stars=step(.997,hash(floor(st*resolution*.35)))+step(.994,hash(floor(st*resolution*.7)+7.));
  float twinkle=.55+.45*sin(time*2.3+hash(floor(st*resolution))*8.);
  col+=vec3(.65,.75,1.)*stars*twinkle*.35;
  float vignette=smoothstep(1.25,.15,length(uv));
  col*=vignette;
  gl_FragColor=vec4(col,clamp(energy*.65+glow*.3+stars*.25,0.,.65));
 }`;
 const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));return null}return s};
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){console.warn(gl.getProgramInfoLog(program));return}
 gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const res=gl.getUniformLocation(program,'resolution'),ptr=gl.getUniformLocation(program,'pointer'),tm=gl.getUniformLocation(program,'time'),scr=gl.getUniformLocation(program,'scroll');
 let w=0,h=0,dpr=1,mx=innerWidth*.5,my=innerHeight*.5,start=performance.now(),scroll=0;
 const resize=()=>{dpr=Math.min(devicePixelRatio||1,innerWidth>900?1.6:1.1);w=innerWidth;h=innerHeight;canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(res,canvas.width,canvas.height)};
 resize();addEventListener('resize',resize,{passive:true});addEventListener('pointermove',e=>{mx=e.clientX*dpr;my=(h-e.clientY)*dpr},{passive:true});addEventListener('scroll',()=>{scroll=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)},{passive:true});
 let running=true;const frame=now=>{if(!running)return;gl.uniform2f(ptr,mx,my);gl.uniform1f(tm,(now-start)/1000);gl.uniform1f(scr,scroll);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(frame)};
 requestAnimationFrame(frame);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){running=false}else if(!running){running=true;requestAnimationFrame(frame)}});
})();

/* CINEMATIC UNIVERSE INTRO — GPU-friendly 3D particle galaxy */
(()=>{
 const loader=document.getElementById('universe-loader'),canvas=document.getElementById('universe-canvas');
 if(!loader||!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('universe-revealed');loader?.remove();return}
 document.body.classList.add('universe-ready');
 const ctx=canvas.getContext('2d',{alpha:false});
 let w=0,h=0,dpr=1,particles=[],start=performance.now(),pointerX=0,pointerY=0;
 const resize=()=>{dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=[];const count=Math.min(1800,Math.floor(w*h/650));for(let i=0;i<count;i++){const arm=Math.floor(Math.random()*4),radius=Math.pow(Math.random(),.65)*Math.min(w,h)*.47,angle=arm*Math.PI/2+radius*.006+(Math.random()-.5)*.5;particles.push({r:radius,a:angle,z:(Math.random()-.5)*2,arm,size:Math.random()*1.5+.2,phase:Math.random()*6.28,alpha:Math.random()*.65+.15})}};
 resize();addEventListener('resize',resize,{passive:true});addEventListener('pointermove',e=>{pointerX=(e.clientX/w-.5)*2;pointerY=(e.clientY/h-.5)*2},{passive:true});
 const draw=now=>{if(!loader.isConnected)return;const t=(now-start)/1000;ctx.fillStyle='#02030b';ctx.fillRect(0,0,w,h);
 const cx=w/2+pointerX*12,cy=h/2+pointerY*12,scale=1+Math.min(t,3)*.045;
 const neb=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.5);neb.addColorStop(0,'rgba(85,35,180,.18)');neb.addColorStop(.45,'rgba(25,20,80,.09)');neb.addColorStop(1,'rgba(2,3,11,0)');ctx.fillStyle=neb;ctx.fillRect(0,0,w,h);
 for(const p of particles){const spin=t*.12+p.r*.0004;const a=p.a+spin;const x=cx+Math.cos(a)*p.r*scale;const y=cy+Math.sin(a)*p.r*.58*scale+p.z*p.r*.22;const fade=1-p.r/(Math.min(w,h)*.52);const tw=.5+.5*Math.sin(t*2+p.phase);ctx.fillStyle=p.arm%2?'rgba(115,170,255,'+(p.alpha*fade*tw)+')':'rgba(190,120,255,'+(p.alpha*fade*tw)+')';ctx.beginPath();ctx.arc(x,y,p.size*(.5+tw*.5),0,Math.PI*2);ctx.fill()}
 const core=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.16);core.addColorStop(0,'rgba(220,205,255,.85)');core.addColorStop(.08,'rgba(160,100,255,.55)');core.addColorStop(.28,'rgba(110,45,220,.18)');core.addColorStop(1,'rgba(40,15,100,0)');ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy,Math.min(w,h)*.16,0,Math.PI*2);ctx.fill();
 if(t<3.25)requestAnimationFrame(draw);else{loader.classList.add('depart');document.body.classList.add('universe-revealed');setTimeout(()=>loader.remove(),1400)}
 };
 requestAnimationFrame(draw);
})();
