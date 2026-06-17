// Simple Three.js scene + mouse model, click parts to update the info panel
(() => {
  const canvas = document.querySelector('#three-canvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x071127);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth || 800, canvas.clientHeight || 600, false);

  const camera = new THREE.PerspectiveCamera(45, 4/3, 0.1, 100);
  camera.position.set(0, 1.2, 3);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.4, 0);
  controls.enableDamping = true;

  // Lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemi.position.set(0, 2, 0);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 5);
  scene.add(dir);

  // Ground plane (subtle)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0x03060a, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -0.01;
  scene.add(ground);

  // Build a mouse body using LatheGeometry (profile revolve)
  const points = [];
  // profile (x, y) from bottom to top
  points.push(new THREE.Vector2(0.0, 0.0));
  points.push(new THREE.Vector2(0.45, 0.0));
  points.push(new THREE.Vector2(0.55, 0.2));
  points.push(new THREE.Vector2(0.6, 0.6));
  points.push(new THREE.Vector2(0.55, 1.0));
  points.push(new THREE.Vector2(0.45, 1.2));
  points.push(new THREE.Vector2(0.25, 1.4));
  points.push(new THREE.Vector2(0.02, 1.45));

  const latheGeom = new THREE.LatheGeometry(points, 60);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2b6f8f, roughness: 0.45, metalness: 0.05, emissive: 0x072a33, side: THREE.DoubleSide });
  const body = new THREE.Mesh(latheGeom, bodyMat);
  body.rotation.x = Math.PI; // orient correctly
  body.position.y = 0;
  body.name = 'body';
  scene.add(body);

  // Left and right buttons (simple boxes, slightly extruded)
  const btnMat = new THREE.MeshStandardMaterial({ color: 0x3aa0c7, roughness: 0.4, metalness: 0 });
  const leftBtn = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 0.9), btnMat);
  leftBtn.position.set(-0.05, 1.0, 0.0);
  leftBtn.rotation.y = 0.06;
  leftBtn.name = 'left-button';
  scene.add(leftBtn);

  const rightBtn = leftBtn.clone();
  rightBtn.position.set(0.3, 1.0, 0.0);
  rightBtn.rotation.y = -0.06;
  rightBtn.name = 'right-button';
  scene.add(rightBtn);

  // Scroll wheel (cylinder)
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0xd7d7d7, roughness: 0.6 });
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 32), wheelMat);
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(0.12, 1.02, 0.15);
  wheel.name = 'wheel';
  scene.add(wheel);

  // Sensor (small emissive plane on underside)
  const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.05), new THREE.MeshStandardMaterial({ color: 0xff4d4d, emissive: 0x220000 }));
  sensor.position.set(0, 0.05, -0.15);
  sensor.name = 'sensor';
  scene.add(sensor);

  // Group for easy highlighting
  const parts = [body, leftBtn, rightBtn, wheel, sensor];

  // Raycaster for clicks
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function resizeRenderer() {
    const width = canvas.clientWidth || canvas.parentElement.clientWidth;
    const height = canvas.clientHeight || Math.max(window.innerHeight - 200, 400);
    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  function onPointerMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onClick(event) {
    onPointerMove(event);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(parts, true);
    if (intersects.length) {
      const p = intersects[0].object;
      highlightPart(p);
      showInfoFor(p.name);
    }
  }

  function highlightPart(part) {
    // reset materials
    parts.forEach(obj => {
      if (obj.material && obj.material.emissive) obj.material.emissive.setHex(obj.userEmissive || 0x000000);
      if (obj.material && obj.material.color) obj.material.color.set(obj.userColor || obj.material.color.getHex());
    });

    // store previous color if not stored
    if (part.material && !part.userColor) part.userColor = part.material.color.getHex();
    if (part.material && !part.userEmissive) part.userEmissive = (part.material.emissive && part.material.emissive.getHex) ? part.material.emissive.getHex() : 0x000000;

    // highlight
    if (part.material && part.material.emissive) part.material.emissive.setHex(0x66eeff);
    if (part.material && part.material.color) part.material.color.offsetHSL(0, -0.1, 0.1);
  }

  const infoMap = {
    'body': { title: 'Mouse Body', desc: 'The main shell houses internals and provides the ergonomic shape. Materials affect grip and weight.' },
    'left-button': { title: 'Left Button', desc: 'Primary click button. Often uses mechanical switches with rated lifespans.' },
    'right-button': { title: 'Right Button', desc: 'Secondary button for context menus and alternate actions.' },
    'wheel': { title: 'Scroll Wheel', desc: 'Scroll wheel is often a notched encoder, sometimes clickable as the middle button.' },
    'sensor': { title: 'Sensor', desc: 'Optical or laser sensor detects movement — DPI determines sensitivity.' }
  };

  function showInfoFor(name) {
    const title = document.getElementById('part-title');
    const desc = document.getElementById('part-desc');
    const info = infoMap[name] || { title: 'Mouse', desc: 'Click parts to explore.' };
    title.textContent = info.title;
    desc.textContent = info.desc;
  }

  window.addEventListener('resize', resizeRenderer);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('click', onClick);

  // animate
  function animate() {
    controls.update();
    resizeRenderer();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // initial camera framing
  const box = new THREE.Box3().setFromObject(body);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 2.2;
  camera.position.set(0, 1.2, cameraZ);
  camera.lookAt(box.getCenter(new THREE.Vector3()));

  animate();

  // expose simple keyboard help
  window.addEventListener('keydown', e => {
    if (e.key === 'h') {
      alert('Controls: drag to rotate, scroll to zoom, click parts to view info.');
    }
  });
})();
