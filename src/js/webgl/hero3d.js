/* ======================================================
   ORDIS AI LABS — Global 3D Neural Core
   ====================================================== */
import * as THREE from 'three';
import gsap from 'gsap';

export function initHero3D() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Centerpiece: The Neural Core ---
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  const materials = {
    solid: new THREE.MeshPhysicalMaterial({
      color: 0x050505,
      emissive: 0xd4a853,
      emissiveIntensity: 0.1,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    }),
    glow: new THREE.MeshBasicMaterial({
      color: 0xf0d48a,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    }),
    edges: new THREE.LineBasicMaterial({
      color: 0xd4a853,
      transparent: true,
      opacity: 0.4
    })
  };

  // Main Orb
  const geo1 = new THREE.IcosahedronGeometry(2.2, 2);
  const orb = new THREE.Mesh(geo1, materials.solid);
  coreGroup.add(orb);

  // Inner Glow Orb
  const geo2 = new THREE.IcosahedronGeometry(1.8, 1);
  const innerOrb = new THREE.Mesh(geo2, materials.glow);
  coreGroup.add(innerOrb);

  // Fractal Rings
  for(let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(3.5 + i*0.8, 0.02, 16, 100);
    const ring = new THREE.LineSegments(new THREE.EdgesGeometry(ringGeo), materials.edges);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    coreGroup.add(ring);
  }

  // --- Data Particles ---
  const pCount = 300;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) {
    pPos[i] = (Math.random() - 0.5) * 30; // Large spread
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xd4a853,
    size: 0.05,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // --- Scroll & Mouse Interactivity ---
  let targetScroll = 0;
  let currentScroll = 0;
  let mouseX = 0, mouseY = 0;
  
  const handleMouse = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', handleMouse, { passive: true });

  const onScroll = () => {
    if (window.locoScroll) {
      targetScroll = window.locoScroll.scroll.instance.scroll.y;
    } else {
      targetScroll = window.scrollY;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Actually, Locomotive scroll doesn't fire native 'scroll'. We pull it inside animate loop directly!

  // --- Unified GSAP Render Loop ---
  const clock = new THREE.Clock();
  
  const animate = () => {
    const elapsed = clock.getElapsedTime();
    
    // Pull scroll from locoScroll if available dynamically
    if (window.locoScroll && window.locoScroll.scroll.instance.hasScroll) {
       targetScroll = window.locoScroll.scroll.instance.scroll.y;
    } else {
       targetScroll = window.scrollY;
    }
    
    // Smooth interpolation for scroll (pro physics)
    currentScroll += (targetScroll - currentScroll) * 0.05;
    
    // Core Rotation
    coreGroup.rotation.y = elapsed * 0.1 + (currentScroll * 0.001);
    coreGroup.rotation.z = currentScroll * 0.0005;
    
    // Inner pulse
    innerOrb.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05);

    // Camera Fly-through
    camera.position.z = 5 - (currentScroll * 0.003); // Deep dive effect
    camera.position.y = (currentScroll * 0.001);
    
    // Parallax mouse follow
    camera.position.x += ((mouseX * 1.5) - camera.position.x) * 0.05;
    
    // Particle swarm
    particles.rotation.y = elapsed * 0.05 - (currentScroll * 0.0002);
    
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  };
  
  // Tie strictly to GSAP ticker for 60fps unified dom/webgl sync
  gsap.ticker.add(animate);

  // --- Resize Resilience ---
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    gsap.ticker.remove(animate);
    window.removeEventListener('mousemove', handleMouse);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}
