/* three.js ambient dust layer — visible throughout entire page.
   Recoloured for the white palette: on white the motes must be DARKER
   than the background, not lighter. Reads as fine construction dust. */
(function(){
  const c=document.getElementById('gl');
  const renderer=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:false});
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,1000);
  cam.position.z=10;
  const N=420,pos=new Float32Array(N*3);
  for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*30;pos[i*3+1]=(Math.random()-.5)*30;pos[i*3+2]=(Math.random()-.5)*24;}
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:0xA8611C,size:0.05,transparent:true,opacity:0.30,depthWrite:false});
  const pts=new THREE.Points(geo,mat);scene.add(pts);
  const mat2=new THREE.PointsMaterial({color:0x8A7F76,size:0.11,transparent:true,opacity:0.22,depthWrite:false});
  const pts2=new THREE.Points(geo.clone(),mat2);pts2.rotation.z=1.3;scene.add(pts2);
  function size(){renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio,2));cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();}
  size();addEventListener('resize',size);
  let sc=0,scl=0;
  addEventListener('scroll',()=>{sc=scrollY;},{passive:true});

  // Get total page height for normalization
  function getPageHeight(){ return Math.max(1, document.documentElement.scrollHeight - innerHeight); }

  (function loop(t){
    scl+=(sc-scl)*0.06;
    // Normalize scroll so particles wrap/repeat rather than drifting off
    const scrollFrac = scl / getPageHeight();
    // Rotate slowly based on time + subtle scroll influence
    pts.rotation.y=t*0.00002 + scrollFrac * 0.8;
    pts2.rotation.y=-t*0.000015 - scrollFrac * 0.6;
    // Keep camera Y movement very gentle so particles stay visible throughout
    cam.position.y = -Math.sin(scrollFrac * Math.PI * 2) * 2;
    renderer.render(scene,cam);
    requestAnimationFrame(loop);
  })(0);
})();
