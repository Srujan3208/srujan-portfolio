import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./SpaceIntro.css";

const TEX = "https://threejs.org/examples/textures/planets/";
export default function SpaceIntro({ onEnter, fixed = true }) {
  const host=useRef(null), [ready,setReady]=useState(false);
  useEffect(()=>{
    const root=host.current;if(!root)return;
    let renderer,raf,disposed=false;const clean=[];
    try{
      const w=root.clientWidth,h=root.clientHeight;
      renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));renderer.setSize(w,h);
      renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
      root.prepend(renderer.domElement);
      const scene=new THREE.Scene();scene.background=new THREE.Color(0x01020a);
      const camera=new THREE.PerspectiveCamera(48,w/h,.1,4000);camera.position.set(0,0,54);
      scene.add(new THREE.AmbientLight(0x6074b8,.48));
      const sun=new THREE.DirectionalLight(0xffe0b3,3.5);sun.position.set(-24,18,32);scene.add(sun);
      const fill=new THREE.PointLight(0x315cff,180,240);fill.position.set(24,-12,12);scene.add(fill);
      const loader=new THREE.TextureLoader();loader.setCrossOrigin("anonymous");
      const load=(url)=>{const t=loader.load(url,undefined,undefined,()=>{});t.colorSpace=THREE.SRGBColorSpace;clean.push(t);return t;};
      // Deep starfield: spherical distribution, circular sprites and varied stellar colour.
      const starCanvas=document.createElement("canvas");starCanvas.width=starCanvas.height=64;
      const ctx=starCanvas.getContext("2d"),grad=ctx.createRadialGradient(32,32,0,32,32,31);
      grad.addColorStop(0,"rgba(255,255,255,1)");grad.addColorStop(.16,"rgba(225,235,255,.95)");grad.addColorStop(.48,"rgba(155,180,255,.24)");grad.addColorStop(1,"rgba(100,130,255,0)");
      ctx.fillStyle=grad;ctx.fillRect(0,0,64,64);const starTex=new THREE.CanvasTexture(starCanvas);
      const starN=5600,sp=new Float32Array(starN*3),sc=new Float32Array(starN*3),ss=new Float32Array(starN);
      for(let i=0;i<starN;i++){const r=180+Math.random()*1150,a=Math.random()*Math.PI*2,z=Math.random()*2-1,q=Math.sqrt(1-z*z);sp.set([r*q*Math.cos(a),r*q*Math.sin(a),r*z],i*3);const c=new THREE.Color().setHSL(.55+Math.random()*.2,.3+Math.random()*.5,.72+Math.random()*.28);sc.set([c.r,c.g,c.b],i*3);ss[i]=.5+Math.random()*2.3;}
      const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.BufferAttribute(sp,3));sg.setAttribute("color",new THREE.BufferAttribute(sc,3));sg.setAttribute("size",new THREE.BufferAttribute(ss,1));
      const stars=new THREE.Points(sg,new THREE.PointsMaterial({size:1.25,map:starTex,vertexColors:true,transparent:true,opacity:.94,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true}));scene.add(stars);
      // A volumetric-looking spiral galaxy made of layered dust, star clusters and a hot galactic nucleus.
      const galaxy=new THREE.Group();scene.add(galaxy);
      const arms=5,n=26000,gp=new Float32Array(n*3),gc=new Float32Array(n*3);
      for(let i=0;i<n;i++){const arm=i%arms,r=Math.pow(Math.random(),.58)*22,theta=arm*Math.PI*2/arms+r*.42+(Math.random()-.5)*(.18+r*.025),spread=(Math.random()-.5)*(.8+r*.1);gp.set([Math.cos(theta)*r,Math.sin(theta)*r*.52+spread,(Math.random()-.5)*(.7+r*.045)],i*3);const hue=Math.random()<.18?.78:(Math.random()<.45?.59:.09);const c=new THREE.Color().setHSL(hue,.7,.48+Math.random()*.38);gc.set([c.r,c.g,c.b],i*3);}
      const ggeo=new THREE.BufferGeometry();ggeo.setAttribute("position",new THREE.BufferAttribute(gp,3));ggeo.setAttribute("color",new THREE.BufferAttribute(gc,3));
      const dust=new THREE.Points(ggeo,new THREE.PointsMaterial({size:.11,map:starTex,vertexColors:true,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));galaxy.add(dust);galaxy.rotation.x=.24;galaxy.rotation.z=-.2;
      const core=new THREE.Mesh(new THREE.SphereGeometry(1.5,48,48),new THREE.MeshBasicMaterial({color:0xffe1b0}));galaxy.add(core);
      const coreGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:starTex,color:0xffc98e,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));coreGlow.scale.set(15,15,1);galaxy.add(coreGlow);
      const spiralHalo=new THREE.Mesh(new THREE.RingGeometry(3,24,160),new THREE.MeshBasicMaterial({color:0x6754d9,transparent:true,opacity:.045,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));spiralHalo.rotation.x=.25;galaxy.add(spiralHalo);
      // Photoreal Earth using the Three.js planet texture set: day map, normal map, city lights and animated cloud layer.
      const earthGroup=new THREE.Group();scene.add(earthGroup);
      const day=load(TEX+"earth_atmos_2048.jpg"),normal=load(TEX+"earth_normal_2048.jpg"),spec=load(TEX+"earth_specular_2048.jpg"),lights=load(TEX+"earth_lights_2048.png"),cloudMap=load(TEX+"earth_clouds_1024.png"),moonMap=load(TEX+"moon_1024.jpg");
      const earthGeo=new THREE.SphereGeometry(8.4,128,128);
      const earthMat=new THREE.MeshPhongMaterial({map:day,normalMap:normal,normalScale:new THREE.Vector2(.55,.55),specularMap:spec,specular:new THREE.Color(0x465c83),shininess:18});
      const earth=new THREE.Mesh(earthGeo,earthMat);earthGroup.add(earth);
      const nightMat=new THREE.MeshBasicMaterial({map:lights,transparent:true,blending:THREE.AdditiveBlending,opacity:.72,depthWrite:false});
      const night=new THREE.Mesh(new THREE.SphereGeometry(8.405,128,128),nightMat);earthGroup.add(night);
      const clouds=new THREE.Mesh(new THREE.SphereGeometry(8.48,128,128),new THREE.MeshPhongMaterial({map:cloudMap,transparent:true,opacity:.34,depthWrite:false,blending:THREE.NormalBlending}));earthGroup.add(clouds);
      const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(8.68,96,96),new THREE.MeshBasicMaterial({color:0x398dff,transparent:true,opacity:.16,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}));earthGroup.add(atmosphere);
      const rim=new THREE.Mesh(new THREE.SphereGeometry(8.82,96,96),new THREE.MeshBasicMaterial({color:0x3c80ff,transparent:true,opacity:.075,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}));earthGroup.add(rim);
      const moon=new THREE.Mesh(new THREE.SphereGeometry(1.35,64,64),new THREE.MeshPhongMaterial({map:moonMap,bumpMap:moonMap,bumpScale:.035,shininess:1}));earthGroup.add(moon);
      const moonLight=new THREE.DirectionalLight(0xcbdcff,1.2);moonLight.position.set(-12,5,6);earthGroup.add(moonLight);
      // distant purple-blue nebula haze as layered transparent procedural clouds
      const nebulaCanvas=document.createElement("canvas");nebulaCanvas.width=512;nebulaCanvas.height=256;const nc=nebulaCanvas.getContext("2d");
      for(let i=0;i<90;i++){const x=Math.random()*512,y=Math.random()*256,r=25+Math.random()*90,g=nc.createRadialGradient(x,y,0,x,y,r);const hue=Math.random()>.5?"120,55,210":"35,90,190";g.addColorStop(0,"rgba("+hue+",.13)");g.addColorStop(1,"rgba("+hue+",0)");nc.fillStyle=g;nc.fillRect(x-r,y-r,r*2,r*2);}
      const nebTex=new THREE.CanvasTexture(nebulaCanvas);clean.push(nebTex);
      const neb=new THREE.Mesh(new THREE.SphereGeometry(900,48,32),new THREE.MeshBasicMaterial({map:nebTex,side:THREE.BackSide,transparent:true,opacity:.8,depthWrite:false}));scene.add(neb);
      const resize=()=>{const W=root.clientWidth,H=root.clientHeight;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));};window.addEventListener("resize",resize);
      const smooth=(a,b,x)=>{const v=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return v*v*(3-2*v);};
      const start=performance.now();
      const tick=now=>{if(disposed)return;raf=requestAnimationFrame(tick);const t=(now-start)/1000;
        stars.rotation.y=t*.00045;neb.rotation.y=t*.00012;
        if(t<5){const p=smooth(0,5,t);camera.position.set(0,0,57-9*p);camera.lookAt(0,0,0);galaxy.position.set(8,-1,-55);galaxy.scale.setScalar(.48+.12*p);galaxy.visible=false;earthGroup.visible=false;}
        else if(t<9){const p=smooth(5,9,t);galaxy.visible=true;galaxy.position.set(0,0,-38+7*p);galaxy.scale.setScalar(.78+1.15*p);galaxy.rotation.z=-.2+t*.018;camera.position.set(0,0,48-21*p);camera.lookAt(0,0,-12);earthGroup.visible=false;}
        else if(t<14){const p=smooth(9,14,t);galaxy.visible=false;earthGroup.visible=true;earthGroup.position.set(0,-1,-58+27*p);earthGroup.scale.setScalar(.62+.36*p);camera.position.set(0,0,25-7*p);camera.lookAt(0,0,-27);earth.rotation.y=.35+t*.025;clouds.rotation.y=earth.rotation.y+.025;moon.position.set(-15+3*p,6,-8); }
        else if(t<18){const p=smooth(14,18,t);earthGroup.position.set(0,-3,-31+8*p);earthGroup.scale.setScalar(1.0+.28*p);camera.position.set(0,-2,7+2*p);camera.lookAt(0,-3,-25);earth.rotation.y=.35+t*.025;clouds.rotation.y=earth.rotation.y+.025;moon.position.set(-12,6,-8);}
        else {const p=smooth(18,20,t);earthGroup.position.set(0,-20,-36);earthGroup.scale.setScalar(2.1);camera.position.set(0,1,10);camera.lookAt(0,-7,-28);earth.rotation.y=.35+t*.025;clouds.rotation.y=earth.rotation.y+.025;moon.position.set(-16,9,-8);}
        const showTitle=t>18.5;setReady(v=>v||showTitle);
        if(t>22){camera.position.set(0,1,10);camera.lookAt(0,-7,-28);}
        renderer.render(scene,camera);
      };raf=requestAnimationFrame(tick);
      return ()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener("resize",resize);renderer.dispose();ggeo.dispose();sg.dispose();earthGeo.dispose();for(const x of clean)x.dispose();};
    }catch(e){console.error("3D intro renderer error",e);root.classList.add("si-fallback");}
    return ()=>{disposed=true;if(raf)cancelAnimationFrame(raf);if(renderer){renderer.dispose();renderer.domElement.remove();}};
  },[]);
  return <section ref={host} className={`si si--fixed ${fixed?"":"si--inline"}`} aria-label="Photorealistic 3D space intro">
    <div className="si__vignette"/>
    <div className="si__top"><span>SRUJAN.DEV</span><span className="si__scene">A JOURNEY THROUGH THE UNIVERSE</span><button onClick={()=>onEnter?.()}>SKIP INTRO ↗</button></div>
    <div className={`si__title ${ready?"is-visible":""}`}><span>EXPLORE MY UNIVERSE</span><h1>SRUJAN</h1><p>AI DEVELOPER <i/> SOFTWARE ENGINEER</p><button onClick={()=>onEnter?.()}>ENTER MY PORTFOLIO <b>↗</b></button></div>
    <div className="si__bottom"><span>SCROLL TO EXPLORE</span><span>EST. 2026 · INFINITE POSSIBILITIES</span></div>
  </section>;
}
