import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AVATAR } from './config.js';
import { fitContain, normalizeAngle } from './design.js';

// The avatar factory is intentionally isolated: swap the GLB in config.js or
// replace this function without rewriting the editor or print surface controls.
function createMannequin(shirtMaterial) {
 const group=new THREE.Group();
 const skin=new THREE.MeshStandardMaterial({color:0x92968c,roughness:0.8,metalness:0.15});
 const pants=new THREE.MeshStandardMaterial({color:0x292f2c,roughness:0.94});
 const shoes=new THREE.MeshStandardMaterial({color:0xbebfaf,roughness:0.85});
 function ellipsoid(x,y,z,sx,sy,sz,material,rot=0){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,40,32),material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.rotation.z=rot;mesh.castShadow=true;group.add(mesh);return mesh;}
 function tube(a,b,r1,r2,material){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);const m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,start.distanceTo(end),32,1),material);m.position.copy(start).add(end).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());m.castShadow=true;group.add(m);return m;}
 // Youthful slim, fully clothed fashion-display proportions, no face details.
 ellipsoid(0,3.23,0,.168,.247,.178,skin);
 tube([0,2.79,0],[0,3.08,0],.104,.105,skin);
 for(const sign of [-1,1]){
  ellipsoid(sign*.163,3.23,0,.03,.059,.039,skin);
  tube([sign*.24,.18,0],[sign*.205,1.66,0],.107,.159,pants);
  ellipsoid(sign*.22,.83,.01,.12,.23,.13,pants);
  ellipsoid(sign*.24,.12,.105,.133,.105,.245,shoes);
  tube([sign*.48,2.62,0],[sign*.625,2.1,.02],.10,.105,skin);
  tube([sign*.625,2.1,.02],[sign*.72,1.68,.07],.073,.10,skin);
  ellipsoid(sign*.74,1.55,.08,.074,.16,.065,skin,sign*.13);
  ellipsoid(sign*.684,1.59,.12,.03,.075,.035,skin,sign*-.45);
 }
 ellipsoid(0,1.63,0,.342,.30,.19,pants);
 // Radial garment mesh with a broad, soft shoulder and gently tapered hem.
 const levels=[[1.59,.368,.215],[1.64,.374,.222],[1.85,.34,.21],[2.08,.351,.227],[2.36,.39,.247],[2.58,.436,.229],[2.70,.46,.198],[2.79,.335,.155],[2.84,.142,.111]];
 const points=[],uvs=[],indices=[],n=80;
 levels.forEach(([y,rx,rz],j)=>{for(let i=0;i<=n;i++){const a=i/n*Math.PI*2;const wrinkle=.0035*Math.sin(a*10+j*1.4)*Math.sin(j/levels.length*Math.PI);points.push(Math.sin(a)*(rx+wrinkle),y,Math.cos(a)*(rz+wrinkle));uvs.push(i/n,j/(levels.length-1));}});
 for(let j=0;j<levels.length-1;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+n+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();
 const tee=new THREE.Mesh(geo,shirtMaterial);tee.castShadow=true;tee.receiveShadow=true;group.add(tee);
 for(const s of [-1,1]){
  const sleeve=tube([s*.355,2.69,0],[s*.555,2.39,0],.175,.151,shirtMaterial);sleeve.scale.z=.94;
 }
 const collar=new THREE.Mesh(new THREE.TorusGeometry(.126,.018,12,64),shirtMaterial);collar.rotation.x=Math.PI/2;collar.scale.y=.82;collar.position.y=2.841;group.add(collar);
 return group;
}
function artworkTexture(image,side,scale=100,dark=false){
 const c=document.createElement('canvas');c.width=768;c.height=960;const ctx=c.getContext('2d');
 if(image){const size=fitContain(image.naturalWidth,image.naturalHeight,610*scale/100,770*scale/100);ctx.drawImage(image,(768-size.width)/2,(960-size.height)/2,size.width,size.height);}
 else {
  ctx.strokeStyle=dark?'#d5ef7680':'#434d3260';ctx.lineWidth=2;ctx.setLineDash([10,13]);ctx.strokeRect(44,70,680,815);ctx.setLineDash([]);
  ctx.fillStyle=dark?'#d5ef76':'#30382a';ctx.textAlign='center';ctx.font='bold 114px Arial';ctx.fillText('YOUR',384,324);ctx.fillText('BRAND',384,442);ctx.fillText('HERE.',384,560);
  ctx.font='22px Arial';ctx.fillText(side==='front'?'THE FIRST IMPRESSION':'THE LASTING ONE',384,700);
  ctx.fillRect(321,760,126,5);
 }
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
export async function createPreview(canvas,{onRotate,onDrag,onError}) {
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(31,1,.1,50);camera.position.set(0,2.05,7.6);camera.lookAt(0,1.78,0);
 scene.add(new THREE.HemisphereLight(0xeaf1df,0x383f32,2.4));
 const key=new THREE.DirectionalLight(0xfff4df,4);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
 const rim=new THREE.DirectionalLight(0xd5ef91,3.5);rim.position.set(3,3,-3);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xc1d0d0,1.4);fill.position.set(3,3,4);scene.add(fill);
 const shirt=new THREE.MeshStandardMaterial({color:0xd8d6cb,roughness:.88,side:THREE.DoubleSide});
 const avatar=new THREE.Group();scene.add(avatar);let body=createMannequin(shirt);avatar.add(body);
 if(AVATAR.modelUrl){new GLTFLoader().load(AVATAR.modelUrl,gltf=>{avatar.remove(body);body=gltf.scene;body.scale.setScalar(AVATAR.scale);body.position.fromArray(AVATAR.position);body.rotation.y=AVATAR.rotationY;avatar.add(body);},undefined,()=>{onError?.();});}
 const prints={};const current={front:null,back:null};const sizes={front:100,back:100};let dark=false;
 for(const side of ['front','back']){
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(side==='front'?.52:.55,side==='front'?.65:.70),new THREE.MeshBasicMaterial({map:artworkTexture(null,side),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));
  mesh.position.set(0,2.25,side==='front'?.253:-.253);if(side==='back')mesh.rotation.y=Math.PI;avatar.add(mesh);prints[side]=mesh;
 }
 const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.96,1.02,.045,96),new THREE.MeshStandardMaterial({color:0x30362b,metalness:.4,roughness:.65}));pedestal.position.y=-.045;pedestal.receiveShadow=true;scene.add(pedestal);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.01,.009,8,120),new THREE.MeshBasicMaterial({color:0xc1d888,transparent:true,opacity:.4}));ring.rotation.x=Math.PI/2;ring.position.y=-.02;scene.add(ring);
 let target=0,auto=false,angle=0,drag=null,dirty=true,visible=true,last=0,dead=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const observer=new ResizeObserver(()=>{const {width,height}=canvas.parentElement.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;});observer.observe(canvas.parentElement);
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;dirty=true;});intersection.observe(canvas);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();dead=true;renderer.setAnimationLoop(null);onError?.();});
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;onDrag();drag={x:e.clientX,angle};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;angle=target=drag.angle+(e.clientX-drag.x)*.008;onRotate(normalizeAngle(angle*180/Math.PI));dirty=true;});
 const end=()=>{drag=null;canvas.classList.remove('dragging');};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
 renderer.setAnimationLoop(time=>{
  const dt=Math.min((time-last)/1000,.04);last=time;
  if(dead||!visible||document.hidden)return;
  if(auto){target+=dt*.35;angle=target;onRotate(normalizeAngle(angle*180/Math.PI));dirty=true;}
  if(Math.abs(angle-target)>.001){angle=reduced.matches?target:THREE.MathUtils.damp(angle,target,10,dt);dirty=true;}
  if(dirty){avatar.rotation.y=angle;renderer.render(scene,camera);dirty=false;}
 });
 return {
  setAngle(deg,instant=false){let next=deg*Math.PI/180;next+=Math.round((angle-next)/(Math.PI*2))*Math.PI*2;target=next;if(instant||reduced.matches)angle=next;dirty=true;},
  setAuto(value){auto=value;},
  setColor(hex){shirt.color.set(hex);dark=hex==='#262a28';for(const side of ['front','back'])this.setArtwork(side,current[side],sizes[side]);dirty=true;},
  setArtwork(side,img,scale){current[side]=img||null;sizes[side]=scale;const old=prints[side].material.map;prints[side].material.map=artworkTexture(img,side,scale,dark);old.dispose();dirty=true;},
  reset(){target=0;dirty=true;},
  dispose(){renderer.setAnimationLoop(null);observer.disconnect();intersection.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{m.map?.dispose();m.dispose();});}});renderer.dispose();}
 };
}
