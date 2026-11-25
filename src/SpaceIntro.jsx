import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./SpaceIntro.css";

export default function SpaceIntro({ onEnter, fixed = true }) {
  const host = useRef(null);
  const [ready,setReady] = useState(false);
  const [muted,setMuted] = useState(true);
  const [paused,setPaused] = useState(false);
  useEffect(() => {
    const root=host.current; if(!root) return;
    let renderer,scene,camera,raf,disposed=false,start=performance.now(),pauseAt=0,elapsed=0;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.setSize(root.clientWidth,root.clientHeight);
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.25;
      root.prepend(renderer.domElement);
      scene=new THREE.Scene(); scene.background=new THREE.Color(0x02020a);
      camera=new THREE.PerspectiveCamera(52,root.clientWidth/root.clientHeight,.1,3000);
      camera.position.set(0,0,46);
      const ambient=new THREE.AmbientLight(0x6474bb,1.1);scene.add(ambient);
      const key=new THREE.PointLight(0xffd6a0,260,600);key.position.set(0,0,0);scene.add(key);
      const starsGeo=new THREE.BufferGeometry(),count=6500,positions=new Float32Array(count*3),colors=new Float32Array(count*3);
      for(let i=0;i<count;i++){const r=100+Math.random()*1100,a=Math.random()*Math.PI*2,z=(Math.random()-.5)*2;const q=Math.sqrt(1-z*z);positions.set([r*q*Math.cos(a),r*q*Math.sin(a),r*z],i*3);const c=new THREE.Color().setHSL(.58+Math.random()*.2,.55,.55+Math.random()*.4);colors.set([c.r,c.g,c.b],i*3);}
      starsGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));starsGeo.setAttribute("color",new THREE.BufferAttribute(colors,3));
      const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({size:1.35,vertexColors:true,transparent:true,opacity:.92,sizeAttenuation:true}));scene.add(stars);
      // Spiral galaxy: thousands of luminous particles arranged in curved arms.
      const gN=18000,gPos=new Float32Array(gN*3),gCol=new Float32Array(gN*3),arms=5;
      for(let i=0;i<gN;i++){const arm=i%arms,r=Math.pow(Math.random(),.62)*19,angle=arm*Math.PI*2/arms+r*.48+(Math.random()-.5)*.42;const thick=(Math.random()-.5)*(.35+r*.045);gPos.set([Math.cos(angle)*r,Math.sin(angle)*r*.48+thick, (Math.random()-.5)*(.45+r*.045)],i*3);const c=new THREE.Color().setHSL(.58+Math.random()*.22,.78,.48+Math.random()*.32);gCol.set([c.r,c.g,c.b],i*3);}
      const gg=new THREE.BufferGeometry();gg.setAttribute("position",new THREE.BufferAttribute(gPos,3));gg.setAttribute("color",new THREE.BufferAttribute(gCol,3));
      const galaxy=new THREE.Points(gg,new THREE.PointsMaterial({size:.075,vertexColors:true,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));galaxy.rotation.x=.28;scene.add(galaxy);
      const core=new THREE.Mesh(new THREE.SphereGeometry(1.2,32,32),new THREE.MeshBasicMaterial({color:0xffd9aa}));scene.add(core);
      const glow=new THREE.Mesh(new THREE.SphereGeometry(2.5,32,32),new THREE.MeshBasicMaterial({color:0x8d83ff,transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(glow);
      // Procedural Earth surface with animated cloud bands and a luminous atmospheric rim.
      const earthGroup=new THREE.Group();scene.add(earthGroup);
      const earthMat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:`varying vec2 vUv; varying vec3 vNormal; varying vec3 vPos; void main(){vUv=uv;vNormal=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vPos=mv.xyz;gl_Position=projectionMatrix*mv;}`,fragmentShader:`uniform float uTime; varying vec2 vUv; varying vec3 vNormal; varying vec3 vPos;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      void main(){vec2 uv=vUv;float n=noise(uv*vec2(17.,9.))+0.45*noise(uv*vec2(39.,21.));float land=smoothstep(.72,.94,n);vec3 ocean=vec3(.008,.09,.25);vec3 ground=mix(vec3(.025,.22,.12),vec3(.48,.34,.19),noise(uv*vec2(12.,7.)));ground=mix(ground,vec3(.75,.76,.69),smoothstep(.78,.96,noise(uv*vec2(31.,15.))));float clouds=smoothstep(.58,.82,noise(uv*vec2(55.,27.)+vec2(uTime*.003,0.)));vec3 col=mix(ocean,ground,land);col=mix(col,vec3(.82,.9,1.),clouds*.46);vec3 N=normalize(vNormal);vec3 L=normalize(vec3(-.4,.35,1.));float light=max(dot(N,L),0.);col*=.22+.95*light;float rim=pow(1.-max(dot(N,normalize(-vPos)),0.),3.);col+=vec3(.08,.38,1.)*rim*.95;gl_FragColor=vec4(col,1.);}`});
      const earth=new THREE.Mesh(new THREE.SphereGeometry(7.2,96,96),earthMat);earthGroup.add(earth);
      const atmo=new THREE.Mesh(new THREE.SphereGeometry(7.42,64,64),new THREE.MeshBasicMaterial({color:0x328cff,transparent:true,opacity:.12,side:THREE.BackSide,blending:THREE.AdditiveBlending}));earthGroup.add(atmo);
      const moon=new THREE.Mesh(new THREE.SphereGeometry(1.35,48,48),new THREE.MeshStandardMaterial({color:0x9da7b9,roughness:1}));moon.position.set(-12,5,-5);earthGroup.add(moon);
      const moonLight=new THREE.PointLight(0x9bbcff,35,80);moonLight.position.set(-12,5,5);earthGroup.add(moonLight);
      // Earth horizon for the final cinematic title reveal.
      const horizon=new THREE.Mesh(new THREE.SphereGeometry(23,64,64),new THREE.MeshBasicMaterial({color:0x071a3d,wireframe:true,transparent:true,opacity:.045}));horizon.position.set(0,-24,-20);scene.add(horizon);
      const resize=()=>{if(!renderer)return;camera.aspect=root.clientWidth/root.clientHeight;camera.updateProjectionMatrix();renderer.setSize(root.clientWidth,root.clientHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));};window.addEventListener("resize",resize);
      const smooth=(a,b,x)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
      const tick=now=>{if(disposed)return;raf=requestAnimationFrame(tick);if(paused)return;const t=reduced?22:(now-start-pauseAt)/1000;earthMat.uniforms.uTime.value=t;
        galaxy.rotation.z=t*.012;stars.rotation.y=t*.0007;earth.rotation.y=t*.055;moon.position.set(-12*Math.cos(t*.12),5*Math.sin(t*.12),-5);
        const a=smooth(0,5,t),b=smooth(5,9,t),c=smooth(9,14,t),d=smooth(14,18,t),e=smooth(18,20,t);
        // Start in the star field, reveal the spiral galaxy, fly through its core, then approach Earth.
        if(t<5){camera.position.set(0,0,46-12*a);camera.lookAt(0,0,0);galaxy.scale.setScalar(.72+.32*a);earthGroup.position.set(0,-90,-90);}
        else if(t<9){camera.position.set(0,0,34-20*b);camera.lookAt(0,0,0);galaxy.scale.setScalar(1.05+1.8*b);earthGroup.position.set(0,-90,-90);}
        else if(t<14){camera.position.set(0,0,14-4*c);camera.lookAt(0,0,0);earthGroup.position.set(0,0,-28+19*c);earthGroup.scale.setScalar(.55+.55*c);}
        else if(t<18){camera.position.set(0,-2,-1+5*d);camera.lookAt(0,0,-18);earthGroup.position.set(0,-2,-19);earthGroup.scale.setScalar(1.1+1.2*d);}
        else {camera.position.set(0,1,10);camera.lookAt(0,-3,-20);earthGroup.position.set(0,-20,-32);earthGroup.scale.setScalar(2.5);}
        core.material.opacity=1-smooth(7,9,t);core.visible=t<9;glow.visible=t<9;earthGroup.visible=t>8.5;horizon.visible=t>17;
        renderer.render(scene,camera);
      };raf=requestAnimationFrame(tick);
      return ()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener("resize",resize);renderer.dispose();gg.dispose();starsGeo.dispose();earth.geometry.dispose();earthMat.dispose();atmo.geometry.dispose();moon.geometry.dispose();};
    } catch(err){console.error("3D intro failed",err);root.classList.add("si-fallback");}
    return ()=>{disposed=true;if(raf)cancelAnimationFrame(raf);if(renderer){renderer.dispose();renderer.domElement.remove();}};
  },[paused]);
  useEffect(()=>{const timer=setTimeout(()=>setReady(true),19000);return()=>clearTimeout(timer);},[]);
  const enter=()=>onEnter?.();
  return <section ref={host} className={`si si--fixed ${fixed?"":"si--inline"}`} aria-label="Srujan cinematic 3D universe intro">
    <div className="si__vignette"/>
    <div className="si__top"><span>SRUJAN.DEV</span><span className="si__scene">A JOURNEY THROUGH THE UNIVERSE</span><button onClick={()=>setReady(true)}>SKIP INTRO ↗</button></div>
    <div className={`si__title ${ready?"is-visible":""}`}><span>EXPLORE MY UNIVERSE</span><h1>SRUJAN</h1><p>AI DEVELOPER <i/> SOFTWARE ENGINEER</p><button onClick={enter}>ENTER MY PORTFOLIO <b>↗</b></button></div>
    <div className="si__bottom"><span>SCROLL TO EXPLORE</span><span>EST. 2026&nbsp; · &nbsp;INFINITE POSSIBILITIES</span></div>
  </section>;
}
