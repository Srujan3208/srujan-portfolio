const menu=document.querySelector('#menuBtn'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#themeToggle')?.addEventListener('click',()=>document.documentElement.classList.toggle('light'));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;document.querySelectorAll('.skill-grid>div').forEach(card=>card.classList.toggle('hide',cat!=='all'&&card.dataset.cat!==cat))}));
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section,.project,.timeline article,.stats').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav a')];window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))},{passive:true});

/* Cinematic scroll engine: progress, subtle parallax, spatial depth and reveal */
(()=> {
  const root=document.documentElement;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar=document.createElement('div');
  bar.id='motion-progress';
  bar.setAttribute('aria-hidden','true');
  document.body.appendChild(bar);
  let ticking=false;
  const update=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    const y=window.scrollY||0;
    root.style.setProperty('--motion-progress',String(Math.min(1,y/max)));
    root.style.setProperty('--scroll-y',y+'px');
    document.body.classList.toggle('is-scrolling',y>24);
    if(!reduce && window.innerWidth>760){
      const hero=document.querySelector('.hero');
      if(hero){
        const art=hero.querySelector('.hero-art');
        const portrait=hero.querySelector('.portrait-wrap');
        const code=hero.querySelector('.code-window');
        const focus=hero.querySelector('.focus-card');
        const rect=hero.getBoundingClientRect();
        const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height)));
        if(art) art.style.setProperty('--hero-depth',p.toFixed(3));
        if(portrait) portrait.style.translate='0 '+(p*34)+'px';
        if(code) code.style.translate='0 '+(p*-20)+'px';
        if(focus) focus.style.translate='0 '+(p*16)+'px';
      }
    }
    ticking=false;
  };
  const onScroll=()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}};
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  update();

  if(!reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.project,.certificate-card,.skill-grid>div,.recognition-grid>div').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        card.style.transform='perspective(900px) translateY(-5px) rotateX('+(-y*5)+'deg) rotateY('+(x*6)+'deg)';
      });
      card.addEventListener('pointerleave',()=>{card.style.transform='';});
    });
  }
})();


/* Native GPU cinematic renderer — real fragment shaders, adaptive quality */
(()=>{
 const hero=document.querySelector('.hero');
 if(!hero || window.matchMedia('(max-width:760px), (prefers-reduced-motion: reduce)').matches)return;
 const canvas=document.createElement('canvas');
 canvas.className='cinematic-webgl';
 canvas.setAttribute('aria-hidden','true');
 hero.insertBefore(canvas,hero.firstChild);
 const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'high-performance',premultipliedAlpha:false});
 if(!gl){canvas.remove();return;}
 const vertex=String.raw`attribute vec2 aPosition;
 varying vec2 vUv;
 void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
 const fragment=String.raw`precision highp float;
 varying vec2 vUv;
 uniform vec2 uResolution;
 uniform vec2 uMouse;
 uniform float uTime;
 uniform float uScroll;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
 float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
 mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
 }
 float fbm(vec2 p){float a=.5,n=0.;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.03+11.7;a*=.5;}return n;}
 void main(){
 vec2 uv=(gl_FragCoord.xy-.5*uResolution)/uResolution.y;
 vec2 m=(uMouse-.5)*vec2(uResolution.x/uResolution.y,1.);
 float t=uTime*.17;
 vec2 p=uv;
 p.x+=.10*sin(p.y*3.2+t*.8);
 float warp=fbm(p*2.3+vec2(t,-t*.65));
 vec2 q=p+vec2(warp*.32,fbm(p*2.7-vec2(t*.8,t))*.24);
 float nebula=fbm(q*3.1+vec2(t*.32,-t*.2));
 float cloud=smoothstep(.37,.85,nebula)*.31;
 float dist=length((p-m*.12)*vec2(.95,1.2));
 float halo=exp(-dist*dist*3.8)*.28;
 float band=exp(-pow((p.y-.20*sin(p.x*3.6+t*.7)-.12),2.)*130.)*.29;
 float wave=exp(-pow((p.y+.16*sin(p.x*4.4-t*.8)+.19),2.)*180.)*.18;
 float stars=step(.998,hash(floor((uv+vec2(t*.01,0.))*vec2(480.,270.))));
 stars*=.3+.7*sin(uTime*1.7+hash(floor(uv*280.))*6.2831)*sin(uTime*1.7+hash(floor(uv*280.))*6.2831);
 vec3 purple=vec3(.018,.075,.19);
 vec3 pink=vec3(.035,.24,.43);
 vec3 blue=vec3(.025,.12,.32);
 vec3 color=mix(purple,blue,smoothstep(.2,.8,warp))*(cloud+halo);
 color+=pink*band+blue*wave;
 color+=vec3(.48,.68,.94)*stars*.8;
 color*=.9+.1*sin(uScroll*.004);
 float alpha=clamp((cloud+halo+band+wave+stars)*1.2,0.,.62);
 gl_FragColor=vec4(color,alpha);
 }`;
 const compile=(type,source)=>{
  const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;
 };
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
 if(!vs||!fs){canvas.remove();return;}
 const program=gl.createProgram();
 gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){canvas.remove();return;}
 gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const uniforms={
  resolution:gl.getUniformLocation(program,'uResolution'),
  mouse:gl.getUniformLocation(program,'uMouse'),
  time:gl.getUniformLocation(program,'uTime'),
  scroll:gl.getUniformLocation(program,'uScroll')
 };
 let mouseX=.5,mouseY=.5,visible=true,raf=0,last=0,start=performance.now(),frames=0;
 const resize=()=>{
  const scale=Math.min(window.devicePixelRatio||1,1.35);
  const w=Math.max(1,Math.floor(hero.clientWidth*scale)),h=Math.max(1,Math.floor(hero.clientHeight*scale));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
 };
 const render=(now)=>{
  raf=0;
  if(!visible||document.hidden)return;
  raf=requestAnimationFrame(render);
  if(now-last<32)return;last=now;
  resize();
  gl.useProgram(program);
  gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);
  gl.uniform2f(uniforms.mouse,mouseX,mouseY);
  gl.uniform1f(uniforms.time,(now-start)*.001);
  gl.uniform1f(uniforms.scroll,window.scrollY||0);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLES,0,6);
  if(++frames===150 && window.innerWidth<1100){canvas.style.opacity='.55';}
 };
 const startLoop=()=>{if(!raf&&!document.hidden&&visible)raf=requestAnimationFrame(render);};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)startLoop();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0});
 observer.observe(hero);
 hero.addEventListener('pointermove',e=>{
  const r=hero.getBoundingClientRect();mouseX=(e.clientX-r.left)/r.width;mouseY=1-(e.clientY-r.top)/r.height;
 },{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else startLoop();});
 window.addEventListener('resize',resize,{passive:true});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;});
 startLoop();
})();


/* WebGL1 procedural planet renderer for the universal intro */
(()=>{
 const canvas=document.querySelector('.loader-earth-webgl');
 const fallback=document.querySelector('.earth-globe-fallback');
 const stage=document.querySelector('.earth-stage');
 if(!canvas||!stage)return;
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'high-performance'});
 if(!gl){if(fallback)fallback.style.display='block';return;}
 const vsSource=`attribute vec2 aPosition;
 varying vec2 vUv;
 void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.0,1.0);}`;
 const fsSource=`precision highp float;
 varying vec2 vUv;
 uniform vec2 uResolution;
 uniform float uTime;
 float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float noise(vec3 x){
  vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
 }
 float fbm(vec3 p){float v=0.0,a=.52;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
 void main(){
  vec2 p=(gl_FragCoord.xy-.5*uResolution)/min(uResolution.x,uResolution.y);
  float radius=.365;
  float d=length(p);
  vec3 col=vec3(0.0);float alpha=0.0;
  float stars=step(.997,hash(vec3(floor(gl_FragCoord.xy*.7),3.0)));
  col+=vec3(.55,.68,1.0)*stars*.48;alpha=max(alpha,stars*.45);
  float atmosphere=exp(-pow((d-radius)*42.0,2.0));
  float outer=exp(-max(d-radius,0.0)*25.0)*step(radius,d);
  col+=vec3(.16,.48,1.0)*outer*.62;
  if(d<radius){
   vec3 n=normalize(vec3(p/radius,sqrt(max(0.0,1.0-dot(p,p)/(radius*radius)))));
   float rot=uTime*.20;
   float lon=atan(n.x,n.z)+rot;
   float lat=asin(clamp(n.y,-1.0,1.0));
   vec3 coord=vec3(lon*2.2,lat*2.5,0.0);
   float land=fbm(coord*2.3+vec3(2.0,0.0,1.0));
   float detail=fbm(coord*7.0+vec3(0.0,2.0,3.0));
   float continent=smoothstep(.49,.57,land+detail*.12);
   float clouds=fbm(coord*9.0+vec3(rot*2.0,uTime*.015,4.0));
   float cloudMask=smoothstep(.61,.77,clouds)*.42;
   vec3 ocean=mix(vec3(.012,.075,.24),vec3(.025,.23,.48),smoothstep(-.4,.6,n.y));
   vec3 landColor=mix(vec3(.055,.27,.19),vec3(.36,.62,.36),smoothstep(.45,.7,detail));
   vec3 surface=mix(ocean,landColor,continent);
   surface=mix(surface,vec3(.72,.84,.94),cloudMask);
   vec3 lightDir=normalize(vec3(-.55,.38,.82));
   float diffuse=max(dot(n,lightDir),0.0);
   float night=1.0-smoothstep(-.22,.18,dot(n,lightDir));
   float city=pow(max(noise(coord*24.0),0.0),9.0)*night*.7;
   float spec=pow(max(dot(reflect(-lightDir,n),vec3(0,0,1)),0.0),28.0);
   surface*=.18+diffuse*.98;
   surface+=vec3(.95,.56,.22)*city+vec3(.18,.48,.95)*spec*.38;
   float rim=pow(1.0-max(n.z,0.0),3.0);
   surface+=vec3(.12,.48,1.0)*rim*.7;
   col=mix(col,surface,1.0);
   alpha=1.0;
  }
  col+=vec3(.19,.48,1.0)*atmosphere*.55;
  alpha=max(alpha,atmosphere*.55);
  gl_FragColor=vec4(col,alpha);
 }`;
 const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;};
 const vs=compile(gl.VERTEX_SHADER,vsSource),fs=compile(gl.FRAGMENT_SHADER,fsSource);
 if(!vs||!fs){if(fallback)fallback.style.display='block';canvas.style.display='none';return;}
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){if(fallback)fallback.style.display='block';canvas.style.display='none';return;}
 gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const pos=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 const res=gl.getUniformLocation(program,'uResolution'),time=gl.getUniformLocation(program,'uTime');
 let raf=0,start=performance.now(),last=0,active=true;
 const resize=()=>{const scale=Math.min(devicePixelRatio||1,1.5);const w=Math.round(stage.clientWidth*scale),h=Math.round(stage.clientHeight*scale);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}};
 const draw=now=>{raf=0;if(!active||!document.getElementById('site-loader'))return;raf=requestAnimationFrame(draw);if(now-last<33)return;last=now;resize();gl.useProgram(program);gl.uniform2f(res,canvas.width,canvas.height);gl.uniform1f(time,(now-start)*.001);gl.drawArrays(gl.TRIANGLES,0,6);};
 const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active&&!raf)raf=requestAnimationFrame(draw);else if(!active&&raf){cancelAnimationFrame(raf);raf=0;}});
 observer.observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else if(active&&!raf)raf=requestAnimationFrame(draw);});
 window.addEventListener('resize',resize,{passive:true});
 resize();raf=requestAnimationFrame(draw);
})();


/* HIGH-END MILKY WAY RENDERER — procedural spiral galaxy in WebGL */
(()=>{
 const canvas=document.querySelector('.galaxy-universe'),loader=document.getElementById('site-loader');
 if(!canvas||!loader)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'high-performance'});
 if(!gl)return;
 const vertex=String.raw`attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`;
 const fragment=String.raw`precision highp float;
 uniform vec2 resolution;
 uniform float time;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
 float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
 }
 float fbm(vec2 p){
  float v=0.,a=.52;
  for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+vec2(13.1,7.7);a*=.49;}
  return v;
 }
 float stars(vec2 uv,vec2 grid,float threshold,float radius){
  vec2 cell=uv*grid,id=floor(cell),f=fract(cell)-.5;
  float seed=hash(id);
  vec2 offset=(vec2(hash(id+17.3),hash(id+41.7))-.5)*.72;
  float d=length(f-offset);
  float core=1.-smoothstep(radius,radius+radius*.75,d);
  float bloom=exp(-d*34.)*.24;
  float twinkle=.62+.38*sin(time*(.65+seed*2.2)+seed*65.);
  return (core+bloom)*step(threshold,seed)*twinkle;
 }
 void main(){
  vec2 uv=gl_FragCoord.xy/resolution;
  vec2 screen=(uv-.5)*vec2(resolution.x/resolution.y,1.);
  float t=time*.018;
  vec3 color=vec3(.0018,.0028,.009);
  // Deep-space colour clouds, layered at different spatial frequencies.
  vec2 cloudP=screen*vec2(1.25,2.0);
  cloudP+=vec2(.025*sin(t*2.+screen.y*3.),.018*cos(t+screen.x*2.));
  float cloudA=fbm(cloudP*2.0+vec2(t*.4,-t*.2));
  float cloudB=fbm(cloudP*4.6-vec2(t*.25,t*.32));
  float cloudC=fbm(cloudP*9.5+vec2(-t*.3,t*.18));
  float nebula=smoothstep(.38,.78,cloudA)*smoothstep(.30,.72,cloudB);
  color+=vec3(.045,.012,.12)*smoothstep(.40,.76,cloudA)*.45;
  color+=vec3(.055,.018,.20)*nebula*.52;
  color+=vec3(.012,.065,.15)*smoothstep(.54,.82,cloudC)*nebula*.55;
  color+=vec3(.12,.025,.18)*smoothstep(.64,.84,cloudB)*.12;
  // Tilted, flattened spiral galaxy with four logarithmic arms.
  float angle=-.34+.018*sin(t*.8);
  mat2 rot=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
  vec2 g=rot*screen;
  g.y*=1.68;
  g+=vec2(-.055*sin(t*.65),.012*cos(t*.7));
  float r=length(g);
  float a=atan(g.y,g.x);
  float spiralPhase=a-2.65*log(r+.055)+t;
  float armWave=.5+.5*cos(spiralPhase*4.0);
  float armCore=pow(max(armWave,0.),11.);
  float armSoft=pow(max(armWave,0.),3.2);
  float disk=smoothstep(1.02,.08,r)*exp(-r*1.42);
  float turbulent=fbm(g*18.+vec2(t*.3,-t*.2));
  float armStructure=(armCore*.9+armSoft*.18)*disk;
  float cloudsInArms=smoothstep(.34,.78,turbulent)*armSoft*disk;
  // Dust lanes carve dark detail into the bright spiral arms.
  float dustNoise=fbm(g*vec2(27.,42.)+vec2(t*.2,0.));
  float dustLane=smoothstep(.53,.76,dustNoise)*armCore*disk;
  vec3 armPurple=vec3(.22,.075,.48);
  vec3 armBlue=vec3(.035,.20,.42);
  vec3 armPink=vec3(.34,.075,.34);
  color+=mix(armPurple,armBlue,smoothstep(-.38,.42,g.y))*armStructure*.88;
  color+=armPink*cloudsInArms*.42;
  color+=vec3(.10,.22,.42)*armSoft*disk*smoothstep(.4,.8,cloudB)*.24;
  color*=1.-dustLane*.55;
  // Bright galactic bulge and luminous central core.
  float core=exp(-r*r*34.);
  float innerGlow=exp(-r*r*8.);
  float corePulse=.96+.04*sin(time*1.25);
  color+=vec3(.30,.17,.54)*innerGlow*.44;
  color+=vec3(.75,.48,.92)*core*.52*corePulse;
  color+=vec3(.96,.82,.98)*exp(-r*r*260.)*.48;
  // Dense star clusters trace the spiral arms, with distant stars in the field.
  float cluster=stars(uv+g*.015,vec2(420.,720.),.86,.014);
  float clusterFine=stars(uv+g*.02,vec2(840.,1440.),.955,.009);
  float fieldA=stars(uv+vec2(t*.0008,0.),vec2(190.,330.),.966,.014);
  float fieldB=stars(uv-vec2(t*.0012,t*.0005),vec2(390.,680.),.986,.010);
  float fieldC=stars(uv,vec2(760.,1320.),.994,.007);
  float armStarMask=clamp(armSoft*disk*1.8,0.,1.);
  color+=vec3(.72,.57,1.)*cluster*armStarMask*.72;
  color+=vec3(.48,.70,1.)*clusterFine*armStarMask*.48;
  color+=vec3(.63,.73,1.)*fieldA*.82;
  color+=vec3(.78,.84,1.)*fieldB*.72;
  color+=vec3(.92,.94,1.)*fieldC*.58;
  // Soft diffraction on the brightest stars and a cinematic vignette.
  float vignette=1.-smoothstep(.40,1.12,length(screen)*.72);
  color*=.56+.44*vignette;
  color+=vec3(.018,.026,.065)*nebula;
  color=pow(max(color,0.),vec3(.88));
  gl_FragColor=vec4(color,1.);
 }`;
 const compile=(type,src)=>{
  const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);
  if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.warn('Galaxy shader:',gl.getShaderInfoLog(sh));gl.deleteShader(sh);return null;}
  return sh;
 };
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
 if(!vs||!fs){canvas.style.display='none';return;}
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){canvas.style.display='none';return;}
 gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const pos=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 const res=gl.getUniformLocation(program,'resolution'),clock=gl.getUniformLocation(program,'time');
 let raf=0,start=performance.now(),last=0,visible=true,launchAt=0;
 const highEnd=matchMedia('(min-width: 1100px) and (hover:hover)').matches;
 const resize=()=>{
  const scale=Math.min(devicePixelRatio||1,highEnd?1.75:1.25);
  const w=Math.max(1,Math.floor(innerWidth*scale)),h=Math.max(1,Math.floor(innerHeight*scale));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
 };
 const draw=now=>{
  raf=0;
  if(!visible||!loader.isConnected||document.hidden)return;
  raf=requestAnimationFrame(draw);
  if(now-last<(reduced?100:(highEnd?30:45)))return;
  last=now;resize();
  gl.useProgram(program);gl.uniform2f(res,canvas.width,canvas.height);
  const elapsed=(now-start)*.001;
  gl.uniform1f(clock,reduced?0:elapsed+(launchAt?Math.min(2.5,(now-launchAt)*.004):0));
  gl.drawArrays(gl.TRIANGLES,0,6);
 };
 const launchObserver=new MutationObserver(()=>{
  if(loader.classList.contains('is-launching')&&!launchAt)launchAt=performance.now();
 });
 launchObserver.observe(loader,{attributes:true,attributeFilter:['class']});
 const observer=new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  if(visible&&!raf&&!document.hidden)raf=requestAnimationFrame(draw);
  else if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}
 });
 observer.observe(loader);
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}
  else if(loader.isConnected){visible=true;if(!raf)raf=requestAnimationFrame(draw);}
 });
 window.addEventListener('resize',resize,{passive:true});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(raf)cancelAnimationFrame(raf);raf=0;});
 resize();raf=requestAnimationFrame(draw);
})();

/* Portfolio guide enhancements: boot counter, decode typography, magnetic UI and spotlight */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const loader=document.getElementById('site-loader');
 const counter=document.getElementById('loader-percent');
 if(loader&&counter&&!reduce){
  const began=performance.now(),duration=2900;
  const tick=now=>{
   if(!document.getElementById('site-loader'))return;
   const p=Math.min(96,Math.floor(((now-began)/duration)*96));
   counter.textContent=String(p).padStart(2,'0')+'%';
   requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
 }
 const heading=document.querySelector('.hero-left h1');
 if(heading&&!reduce){
  const name=heading.firstChild;
  if(name&&name.nodeType===Node.TEXT_NODE){
   const target=name.textContent.trim();
   const glyphs='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]';
   let frame=0;
   const total=22;
   const decode=()=>{
    frame++;
    const resolved=Math.floor((frame/total)*target.length);
    let out='';
    for(let i=0;i<target.length;i++)out+=i<resolved?target[i]:glyphs[Math.floor(Math.random()*glyphs.length)];
    name.textContent=out;
    if(frame<total)setTimeout(decode,38);
    else name.textContent=target;
   };
   name.textContent=target.split('').map(()=>glyphs[Math.floor(Math.random()*glyphs.length)]).join('');
   setTimeout(decode,280);
  }
 }
 const role=document.querySelector('.hero-left .roles span:nth-of-type(2)');
 if(role&&!reduce){
  const roles=['Full-Stack Developer','Hackathon Builder','AI Product Creator'];
  let index=0;
  const original=role.textContent.trim();
  role.textContent=original;
  setInterval(()=>{
   index=(index+1)%roles.length;
   const next=roles[index];
   role.classList.add('role-changing');
   setTimeout(()=>{role.textContent=next;role.classList.remove('role-changing');},180);
  },3100);
 }
 if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
  document.querySelectorAll('.button').forEach(el=>{
   el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
    el.style.transform='translate('+x*.10+'px,'+y*.16+'px)';
   });
   el.addEventListener('pointerleave',()=>{el.style.transform='';});
  });
  document.querySelectorAll('.project,.certificate-card,.skill-grid>div').forEach(card=>{
   card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--spot-x',(e.clientX-r.left)+'px');
    card.style.setProperty('--spot-y',(e.clientY-r.top)+'px');
   },{passive:true});
  });
 }
})();

/* Cinematic loader copy and hero arrival timing */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const loader=document.getElementById('site-loader');
 const terminal=document.getElementById('loader-terminal-text');
 const lines=['Initializing deep space...','Tracing the Milky Way...','Illuminating spiral arms...','Compiling creative ideas...','Opening Srujan.dev...'];
 if(terminal&&!reduce){
  let i=0;terminal.textContent=lines[0];
  const timer=setInterval(()=>{i++;if(i<lines.length)terminal.textContent=lines[i];else clearInterval(timer);},720);
  loader?.addEventListener('transitionend',()=>clearInterval(timer),{once:true});
 }
 if(!reduce){
  const hero=document.querySelector('.hero');
  if(hero){hero.classList.add('cosmic-arrival');setTimeout(()=>hero.classList.add('cosmic-arrived'),900);}
 }
})();
\n\n/* CINEMATIC MOTION SYSTEM — GSAP choreography with native-scroll fallback */
(()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
 const gsap=window.gsap,ST=window.ScrollTrigger;
 if(!gsap||!ST||reduce){
   document.documentElement.classList.add('motion-fallback');
   return;
 }
 gsap.registerPlugin(ST);
 gsap.config({nullTargetWarn:false});
 const mm=gsap.matchMedia();
 mm.add({
   desktop:'(min-width: 900px)',
   tablet:'(min-width: 600px) and (max-width: 899px)',
   mobile:'(max-width: 599px)'
 },context=>{
   const {desktop,mobile}=context.conditions;
   const distance=mobile?18:34;
   // Section titles arrive like chapter titles in a cinematic sequence.
   gsap.utils.toArray('.section').forEach((section,index)=>{
     const head=section.querySelector('.section-head');
     if(head){
       gsap.fromTo(head,{autoAlpha:0,y:distance,filter:'blur(8px)'},{
         autoAlpha:1,y:0,filter:'blur(0px)',duration:.9,ease:'power3.out',
         scrollTrigger:{trigger:section,start:'top 78%',once:true}
       });
     }
   });
   // Project cards enter with depth, then settle into the layout.
   gsap.fromTo('.project-grid .project',
     {autoAlpha:0,y:48,rotateX:desktop?7:0,transformPerspective:1000},
     {autoAlpha:1,y:0,rotateX:0,duration:1,stagger:.13,ease:'power3.out',
      scrollTrigger:{trigger:'#projects',start:'top 72%',once:true}});
   // A restrained scroll-scrubbed orbit around the portrait.
   const portrait=document.querySelector('.hero .portrait-wrap');
   const orbit=document.querySelector('.hero .orbit-a');
   if(desktop&&portrait){
     gsap.to(portrait,{y:42,rotate:1.2,ease:'none',
       scrollTrigger:{trigger:'#home',start:'top top',end:'bottom top',scrub:1}});
   }
   if(desktop&&orbit){
     gsap.to(orbit,{rotation:22,scale:1.06,ease:'none',
       scrollTrigger:{trigger:'#home',start:'top top',end:'bottom top',scrub:1.2}});
   }
   // About chapter: visual layers move at different depths.
   const aboutVisual=document.querySelector('.about-visual');
   if(aboutVisual){
     gsap.fromTo(aboutVisual,{y:34,rotateY:desktop?-5:0,scale:.96},{
       y:-12,rotateY:0,scale:1,ease:'none',
       scrollTrigger:{trigger:'#about',start:'top bottom',end:'center center',scrub:1}});
   }
   const aboutOrbit=document.querySelector('.about-orbit');
   if(aboutOrbit&&desktop){
     gsap.to(aboutOrbit,{rotate:18,ease:'none',
       scrollTrigger:{trigger:'#about',start:'top bottom',end:'bottom top',scrub:1}});
   }
   // Timeline becomes a vertical story line as each milestone enters.
   const timeline=document.querySelector('.timeline');
   if(timeline){
     gsap.fromTo(timeline.querySelectorAll('article'),{autoAlpha:0,x:desktop?-36:-18},{
       autoAlpha:1,x:0,duration:.75,stagger:.18,ease:'power2.out',
       scrollTrigger:{trigger:timeline,start:'top 78%',once:true}});
   }
   // Skill constellation: small stagger, no continuous animation loops.
   gsap.fromTo('.skill-grid > div',{autoAlpha:0,y:22,scale:.94},{
     autoAlpha:1,y:0,scale:1,duration:.55,stagger:.045,ease:'back.out(1.25)',
     scrollTrigger:{trigger:'#skills',start:'top 75%',once:true}});
   // Contact outro: glow and headline rise into the final frame.
   const contact=document.querySelector('.contact-panel');
   if(contact){
     gsap.fromTo(contact,{autoAlpha:0,y:55,scale:.985},{
       autoAlpha:1,y:0,scale:1,duration:1.05,ease:'power3.out',
       scrollTrigger:{trigger:contact,start:'top 82%',once:true}});
   }
   // Pointer tilt is desktop-only and stays deliberately subtle.
   if(desktop&&fine){
     document.querySelectorAll('.project,.certificate-card,.cert-card').forEach(card=>{
       card.addEventListener('pointermove',e=>{
         const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
         gsap.to(card,{rotateX:-y*3.2,rotateY:x*4,y:-3,duration:.35,ease:'power2.out',overwrite:true});
       });
       card.addEventListener('pointerleave',()=>gsap.to(card,{rotateX:0,rotateY:0,y:0,duration:.5,ease:'power3.out'}));
     });
   }
   return ()=>{ST.getAll().forEach(t=>t.kill());};
 });
 window.addEventListener('load',()=>ST.refresh(),{once:true});
})();

/* FULL-VIEWPORT CYBER MATRIX RAIN — separate 2D layer behind the loader panel */
(()=>{
 const canvas=document.querySelector('.loader-matrix'),loader=document.getElementById('site-loader');
 if(!canvas||!loader)return;
 const ctx=canvas.getContext('2d');
 if(!ctx)return;
 const glyphs='01 01 10 11 0x 0F 1A 7E 9C A5 C0 FF <> {} [] /\\ const let async await function return class import export';
 let columns=[],font=14,raf=0,last=0,active=true;
 const resize=()=>{
  const dpr=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);
  canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);font=Math.max(12,Math.min(17,innerWidth/95));
  columns=Array.from({length:Math.ceil(innerWidth/font)+1},(_,i)=>({x:i*font,y:Math.random()*-innerHeight,speed:.45+Math.random()*1.25,trail:8+Math.random()*18}));
 };
 const draw=now=>{
  raf=0;if(!active||!loader.isConnected||document.hidden)return;
  raf=requestAnimationFrame(draw);if(now-last<42)return;last=now;
  ctx.fillStyle='rgba(2,3,11,.16)';ctx.fillRect(0,0,innerWidth,innerHeight);
  ctx.font=font+'px monospace';ctx.textAlign='center';
  for(const c of columns){
   for(let n=0;n<c.trail;n++){
    const y=c.y-n*font;if(y<0||y>innerHeight)continue;
    const ch=glyphs[Math.floor(Math.random()*glyphs.length)];
    const alpha=Math.max(.025,.34-n/c.trail*.32);
    ctx.fillStyle=n===0?'rgba(165,243,252,.88)':(n%5===0?'rgba(167,139,250,'+alpha+')':'rgba(89,78,160,'+alpha+')');
    ctx.fillText(ch,c.x,y);
   }
   c.y+=font*c.speed;
   if(c.y-c.trail*font>innerHeight)c.y=-Math.random()*innerHeight*.5;
  }
 };
 const observer=new IntersectionObserver(entries=>{
  active=entries[0].isIntersecting;
  if(active&&!raf&&!document.hidden)raf=requestAnimationFrame(draw);
  else if(!active&&raf){cancelAnimationFrame(raf);raf=0;}
 });
 observer.observe(loader);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else if(active&&loader.isConnected&&!raf)raf=requestAnimationFrame(draw);});
 window.addEventListener('resize',resize,{passive:true});
 resize();ctx.fillStyle='#02030b';ctx.fillRect(0,0,innerWidth,innerHeight);raf=requestAnimationFrame(draw);
})();
