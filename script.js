const menu=document.querySelector('#menuBtn'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#themeToggle')?.addEventListener('click',()=>document.documentElement.classList.toggle('light'));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;document.querySelectorAll('.skill-grid>div').forEach(card=>card.classList.toggle('hide',cat!=='all'&&card.dataset.cat!==cat))}));
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section,.project,.timeline article,.stats').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav a')];window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))},{passive:true});

/* Reliable universal loader: never block access to the portfolio */
(()=>{
 const loader=document.getElementById('site-loader');
 if(!loader)return;
 let finished=false;
 const finish=()=>{
  if(finished)return;
  finished=true;
  loader.classList.add('is-launching');
  window.setTimeout(()=>{
   loader.classList.add('is-hidden');
   window.setTimeout(()=>loader.remove(),950);
  },850);
 };
 /* The script is loaded at the end of body; start the intro immediately.
    Do not wait for every image/font/network request to finish. */
 window.setTimeout(finish,3200);
 window.setTimeout(finish,5200);
 window.addEventListener('pageshow',()=>window.setTimeout(finish,5200),{once:true});
})();

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


/* Cinematic deep-space renderer: clean star points, spiral Milky Way and midnight-blue nebula */
(()=>{
 const canvas=document.querySelector('.galaxy-universe'),loader=document.getElementById('site-loader');
 if(!canvas||!loader)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'high-performance'});
 if(!gl)return;
 const vertex=String.raw`attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`;
 const fragment=String.raw`precision highp float;
 uniform vec2 resolution; uniform float time;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
 float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.01+17.3;a*=.5;}return v;}
 float starLayer(vec2 uv,vec2 grid,float threshold,float size){
  vec2 cell=uv*grid, id=floor(cell), f=fract(cell)-.5;
  float rnd=hash(id);
  vec2 offset=vec2(hash(id+17.1),hash(id+41.7))-.5;
  float radius=size*(.35+hash(id+9.2)*.9);
  float point=1.-smoothstep(radius,radius+size*.8,length(f-offset*.68));
  float glow=exp(-length(f-offset*.68)*22.)*.28;
  float active=step(threshold,rnd);
  float twinkle=.72+.28*sin(time*(.7+hash(id+4.)*1.8)+rnd*60.);
  return (point+glow)*active*twinkle;
 }
 void main(){
  vec2 uv=gl_FragCoord.xy/resolution;
  vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.);
  float t=time*.012;
  vec2 warped=p;
  warped.x+=.045*sin(p.y*4.2+t);
  warped.y+=.025*sin(p.x*3.1-t*.7);
  float cloudA=fbm(warped*2.4+vec2(t,-t*.4));
  float cloudB=fbm(warped*5.4-vec2(t*.8,t*.5));
  float cloudC=fbm(warped*10.0+vec2(-t*1.3,t));
  float nebula=smoothstep(.43,.78,cloudA)*smoothstep(.32,.72,cloudB);
  vec3 col=vec3(.0015,.004,.012);
  col+=vec3(.012,.027,.064)*smoothstep(.22,.82,cloudA);
  col+=vec3(.018,.085,.16)*nebula*.75;
  col+=vec3(.045,.12,.22)*smoothstep(.57,.82,cloudC)*nebula*.35;
  float angle=-.48;
  vec2 g=vec2(p.x*cos(angle)-p.y*sin(angle),p.x*sin(angle)+p.y*cos(angle));
  float arm1=length(vec2(g.x*.72,g.y+.12*sin(g.x*3.0+t)));
  float arm2=length(vec2(g.x*.72,g.y-.17*sin(g.x*2.5-t)-.12));
  float spiral=exp(-pow((arm1-.34)/.105,2.))*.45+exp(-pow((arm2-.48)/.12,2.))*.32;
  float core=exp(-dot(g-vec2(.04,-.01),g-vec2(.04,-.01))*24.);
  float dustLane=exp(-pow((g.y-.05*sin(g.x*5.0+t))/.025,2.))*smoothstep(.7,.08,abs(g.x));
  col+=vec3(.012,.055,.11)*spiral;
  col+=vec3(.035,.13,.24)*spiral*smoothstep(.35,.72,cloudB);
  col+=vec3(.08,.19,.32)*core*.35;
  col*=1.-dustLane*.55;
  float stars=starLayer(uv,vec2(180.,300.),.965,.018);
  float stars2=starLayer(uv,vec2(360.,600.),.986,.012);
  float stars3=starLayer(uv,vec2(720.,1200.),.996,.008);
  col+=vec3(.42,.62,.88)*stars*.8;
  col+=vec3(.65,.76,.95)*stars2*.72;
  col+=vec3(.82,.9,1.)*stars3*.62;
  float vignette=1.-smoothstep(.45,.95,length(p)*.72);
  col*=.68+.32*vignette;
  gl_FragColor=vec4(pow(max(col,0.),vec3(.92)),1.);
 }`;
 const compile=(type,src)=>{const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){gl.deleteShader(sh);return null;}return sh;};
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
 if(!vs||!fs){canvas.style.display='none';return;}
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){canvas.style.display='none';return;}
 gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const pos=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 const resolution=gl.getUniformLocation(program,'resolution'),clock=gl.getUniformLocation(program,'time');
 let raf=0,start=performance.now(),last=0,visible=true;
 const resize=()=>{const scale=Math.min(devicePixelRatio||1,1.25);const w=Math.max(1,Math.floor(innerWidth*scale)),h=Math.max(1,Math.floor(innerHeight*scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}};
 const draw=now=>{raf=0;if(!visible||!loader.isConnected||document.hidden)return;raf=requestAnimationFrame(draw);if(now-last<(reduced?100:40))return;last=now;resize();gl.useProgram(program);gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform1f(clock,reduced?0:(now-start)*.001);gl.drawArrays(gl.TRIANGLES,0,6);};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!raf&&!document.hidden)raf=requestAnimationFrame(draw);else if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}});
 observer.observe(loader);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else if(loader.isConnected){visible=true;if(!raf)raf=requestAnimationFrame(draw);}});
 window.addEventListener('resize',resize,{passive:true});resize();raf=requestAnimationFrame(draw);
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

/* Cosmic intro renderer: Milky Way starfield, code sequence and portal reveal */
(()=>{
 const canvas=document.querySelector('#site-loader .galaxy-universe'),loader=document.getElementById('site-loader');
 if(!loader)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,terminal=document.getElementById('loader-terminal-text');
 const lines=['Initializing universe...','Mapping the Milky Way...','Compiling creative ideas...','Rendering Srujan.dev...','Opening your portfolio...'];
 let line=0;if(terminal&&!reduce){const type=()=>{terminal.textContent=lines[line%lines.length];line++;};type();const timer=setInterval(type,620);setTimeout(()=>clearInterval(timer),3100);}
 if(canvas&&!reduce){const ctx=canvas.getContext('2d',{alpha:true});if(ctx){
  let w=0,h=0,dpr=1,raf=0,started=performance.now(),stars=[],dust=[],running=true,launchStarted=0;
  const resize=()=>{dpr=Math.min(devicePixelRatio||1,1.6);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(900,Math.round(w*h/1650));stars=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,z:.15+Math.random()*.85,r:.35+Math.random()*1.25,p:Math.random()*6.28}));dust=Array.from({length:Math.round(count*.36)},()=>({x:Math.random()*w,y:Math.random()*h,a:Math.random()*.2+.04,r:Math.random()*1.7}));};
  const draw=now=>{if(!running||!document.body.contains(canvas))return;const t=(now-started)*.001,cx=w*.5,cy=h*.49;ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(cx,cy);ctx.rotate(-.38);
   const mw=ctx.createRadialGradient(0,0,10,0,0,Math.max(w,h)*.58);mw.addColorStop(0,'rgba(124,58,237,.17)');mw.addColorStop(.25,'rgba(91,33,182,.11)');mw.addColorStop(.58,'rgba(34,211,238,.035)');mw.addColorStop(1,'rgba(5,4,13,0)');ctx.fillStyle=mw;ctx.fillRect(-w,-h,w*2,h*2);
   for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(0,0,w*(.18+i*.055),h*(.08+i*.022),0,0,Math.PI*2);ctx.strokeStyle='rgba(167,139,250,'+(.035-i*.003)+')';ctx.lineWidth=1;ctx.stroke();}ctx.restore();
   for(const d of dust){ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle='rgba(196,181,253,'+d.a+')';ctx.fill();}
   const warp=launchStarted?Math.min(1,(now-launchStarted)/800):0;
   for(const s of stars){const tw=.5+.5*Math.sin(t*1.6+s.p),x=cx+(s.x-cx)*(1+warp*3.8),y=cy+(s.y-cy)*(1+warp*3.8);ctx.beginPath();ctx.arc(x,y,s.r*(.65+tw*.55),0,Math.PI*2);ctx.fillStyle='rgba('+(s.z>.72?'220,210,255':'157,145,220')+','+(.22+tw*.68)+')';ctx.fill();if(s.z>.88){ctx.strokeStyle='rgba(196,181,253,'+(tw*.28)+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-4*s.r,y);ctx.lineTo(x+4*s.r,y);ctx.moveTo(x,y-4*s.r);ctx.lineTo(x,y+4*s.r);ctx.stroke();}}
   const core=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.18);core.addColorStop(0,'rgba(167,139,250,.08)');core.addColorStop(1,'rgba(167,139,250,0)');ctx.fillStyle=core;ctx.fillRect(0,0,w,h);raf=requestAnimationFrame(draw);};
  const stop=()=>{running=false;cancelAnimationFrame(raf);};loader.addEventListener('animationstart',e=>{if(e.animationName==='loaderFadeAway')launchStarted=performance.now();});loader.addEventListener('transitionend',e=>{if(e.propertyName==='opacity'&&loader.classList.contains('is-hidden'))stop();});resize();addEventListener('resize',resize,{passive:true});raf=requestAnimationFrame(draw);
 }}
 if(!reduce){const hero=document.querySelector('.hero');if(hero){hero.classList.add('cosmic-arrival');setTimeout(()=>hero.classList.add('cosmic-arrived'),900);}}
})();
