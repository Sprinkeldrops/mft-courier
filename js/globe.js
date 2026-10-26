/**
 * MFT COURIER — 3D SPATIAL LOGISTICS GLOBE & UK ARTERIAL NETWORK
 * Interactive WebGL Three.js Visualizer
 * Centered on Greater Manchester Hub (OL8, UK)
 */

(function () {
  'use strict';

  // Verified Hub Coordinates (Lat, Lon for UK mapping)
  const UK_HUB = {
    id: 'manchester',
    name: 'Greater Manchester OL8 Hub',
    postcode: 'OL8 1ER',
    lat: 53.5409,
    lon: -2.1114,
    motorways: 'M60 / M62 / M6 Access',
    color: 0x22C55E,
    isHub: true
  };

  // Illustrative Major UK Corridor Destinations (Connected to Manchester Hub)
  const CORRIDORS = [
    {
      id: 'london',
      name: 'London & Home Counties',
      lat: 51.5074,
      lon: -0.1278,
      corridor: 'M60 ➔ M6 ➔ M1 Direct Trunk',
      distanceMiles: 208,
      transitNote: 'Direct dedicated highway link from OL8'
    },
    {
      id: 'birmingham',
      name: 'Birmingham & West Midlands',
      lat: 52.4862,
      lon: -1.8904,
      corridor: 'M60 ➔ M6 Southbound',
      distanceMiles: 86,
      transitNote: 'Direct central corridor transit'
    },
    {
      id: 'leeds',
      name: 'Leeds & West Yorkshire',
      lat: 53.8008,
      lon: -1.5491,
      corridor: 'M62 Trans-Pennine Corridor',
      distanceMiles: 44,
      transitNote: 'Immediate trans-Pennine link'
    },
    {
      id: 'liverpool',
      name: 'Liverpool & Merseyside Ports',
      lat: 53.4084,
      lon: -2.9916,
      corridor: 'M60 ➔ M62 Westbound',
      distanceMiles: 38,
      transitNote: 'Direct western maritime link'
    },
    {
      id: 'glasgow',
      name: 'Glasgow & Scotland Gateway',
      lat: 55.8642,
      lon: -4.2518,
      corridor: 'M60 ➔ M6 North ➔ A74(M)/M74',
      distanceMiles: 218,
      transitNote: 'Northern trunk route corridor'
    },
    {
      id: 'bristol',
      name: 'Bristol & South West',
      lat: 51.4545,
      lon: -2.5879,
      corridor: 'M60 ➔ M6 ➔ M5 Southbound',
      distanceMiles: 165,
      transitNote: 'Dedicated western cross-country'
    }
  ];

  let scene, camera, renderer, globeGroup;
  let animId = null;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let activeCorridorId = 'london';
  let arcMeshes = [];
  let pulsePoints = [];

  function init() {
    const container = document.getElementById('globeCanvasContainer');
    const fallback = document.getElementById('globeFallback');
    
    // Check reduced motion or small touch devices if needed
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (fallback) fallback.classList.remove('hidden');
      if (container) container.classList.add('hidden');
      setupCorridorButtons();
      return;
    }

    if (!container || typeof THREE === 'undefined') {
      if (fallback) fallback.classList.remove('hidden');
      setupCorridorButtons();
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene & Camera Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0B0F15, 0.04);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 7.8);
    camera.lookAt(0, 0.3, 0);

    // 2. WebGL Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x22C55E, 1.4);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const blueRim = new THREE.DirectionalLight(0x3B82F6, 0.6);
    blueRim.position.set(-6, -4, -5);
    scene.add(blueRim);

    // 4. Globe & Geometry Construction
    globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Sphere Wireframe Core
    const radius = 2.4;
    const coreGeo = new THREE.SphereGeometry(radius, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x111923,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Holographic Inner Glow Sphere
    const innerGeo = new THREE.SphereGeometry(radius * 0.98, 32, 32);
    const innerMat = new THREE.MeshLambertMaterial({
      color: 0x0E151E,
      transparent: true,
      opacity: 0.85
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerMesh);

    // Outer Atmospheric Ring
    const ringGeo = new THREE.RingGeometry(radius * 1.15, radius * 1.16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22C55E,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.2;
    globeGroup.add(ringMesh);

    // Lat/Long Coordinate Convert to 3D Sphere Points
    function latLonToVector3(lat, lon, r) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    // Convert Hub & Corridors to 3D coordinates
    const hubPos = latLonToVector3(UK_HUB.lat, UK_HUB.lon, radius);

    // Hub Beacon
    const hubMarkerGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const hubMarkerMat = new THREE.MeshBasicMaterial({ color: 0x22C55E });
    const hubMesh = new THREE.Mesh(hubMarkerGeo, hubMarkerMat);
    hubMesh.position.copy(hubPos);
    globeGroup.add(hubMesh);

    // Hub Pulse Ring
    const pulseRingGeo = new THREE.RingGeometry(0.09, 0.14, 24);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0x22C55E,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.position.copy(hubPos.clone().multiplyScalar(1.01));
    pulseRing.lookAt(hubPos.clone().multiplyScalar(2));
    globeGroup.add(pulseRing);
    pulsePoints.push({ mesh: pulseRing, baseScale: 1 });

    // Destination Nodes & Connecting Geodesic Arcs
    CORRIDORS.forEach((dest, idx) => {
      const destPos = latLonToVector3(dest.lat, dest.lon, radius);

      // Node Marker
      const nodeGeo = new THREE.SphereGeometry(0.05, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x94A3B8 });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(destPos);
      globeGroup.add(nodeMesh);

      // Curved Geodesic Arc from Hub to Destination
      const midPoint = new THREE.Vector3().addVectors(hubPos, destPos).multiplyScalar(0.5);
      const distance = hubPos.distanceTo(destPos);
      // Elevate mid-point higher for longer routes
      const elevation = radius + Math.max(0.2, distance * 0.45);
      midPoint.normalize().multiplyScalar(elevation);

      const curve = new THREE.QuadraticBezierCurve3(hubPos, midPoint, destPos);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const isCurrentActive = dest.id === activeCorridorId;
      const arcMat = new THREE.LineBasicMaterial({
        color: isCurrentActive ? 0x22C55E : 0x334455,
        linewidth: isCurrentActive ? 2 : 1,
        transparent: true,
        opacity: isCurrentActive ? 0.95 : 0.45
      });

      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
      arcMeshes.push({ id: dest.id, line: arcLine, curve: curve });

      // Moving Pulse Particle on Arc
      const particleGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({ color: 0x22C55E });
      const particleMesh = new THREE.Mesh(particleGeo, particleMat);
      globeGroup.add(particleMesh);
      pulsePoints.push({ mesh: particleMesh, curve: curve, progress: (idx * 0.2) % 1 });
    });

    // Initial globe orientation to frame UK nicely
    globeGroup.rotation.y = -2.1;
    globeGroup.rotation.x = 0.35;

    // 5. Interaction Listeners (Mouse Drag / Touch Orbit)
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('mousemove', onPointerMove);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    window.addEventListener('resize', onWindowResize);

    // 6. Corridor Button Setup
    setupCorridorButtons();

    // 7. Animation Loop
    animate();
  }

  function onPointerDown(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp() {
    isDragging = false;
  }

  function onPointerMove(e) {
    if (!isDragging || !globeGroup) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    globeGroup.rotation.y += deltaX * 0.005;
    globeGroup.rotation.x += deltaY * 0.003;
    globeGroup.rotation.x = Math.max(-0.6, Math.min(0.8, globeGroup.rotation.x));

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  function onTouchMove(e) {
    if (!isDragging || !globeGroup || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    globeGroup.rotation.y += deltaX * 0.006;
    globeGroup.rotation.x += deltaY * 0.004;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onWindowResize() {
    const container = document.getElementById('globeCanvasContainer');
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight || 520;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function setupCorridorButtons() {
    const buttons = document.querySelectorAll('[data-corridor-target]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-corridor-target');
        selectCorridor(targetId);
      });
    });

    // Initialize first display details
    selectCorridor(activeCorridorId);
  }

  function selectCorridor(id) {
    activeCorridorId = id;
    const corridorData = CORRIDORS.find(c => c.id === id);
    if (!corridorData) return;

    // Update Button Active States
    document.querySelectorAll('[data-corridor-target]').forEach(btn => {
      const match = btn.getAttribute('data-corridor-target') === id;
      if (match) {
        btn.classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-white');
        btn.classList.remove('border-white/10', 'text-gray-400');
      } else {
        btn.classList.remove('bg-emerald-500/20', 'border-emerald-500', 'text-white');
        btn.classList.add('border-white/10', 'text-gray-400');
      }
    });

    // Update Telemetry Display Panel (Factual road corridor details)
    const nameEl = document.getElementById('corridorDestinationName');
    const routeEl = document.getElementById('corridorHighwayRoute');
    const distEl = document.getElementById('corridorDistance');
    const noteEl = document.getElementById('corridorOperationalNote');
    const waQuoteBtn = document.getElementById('corridorWhatsAppBtn');

    if (nameEl) nameEl.textContent = corridorData.name;
    if (routeEl) routeEl.textContent = corridorData.corridor;
    if (distEl) distEl.textContent = `~${corridorData.distanceMiles} miles from Manchester OL8`;
    if (noteEl) noteEl.textContent = corridorData.transitNote;

    if (waQuoteBtn) {
      const msg = encodeURIComponent(`Hello MFT Courier, I would like to request a delivery quote for the ${corridorData.name} corridor (dispatched from Manchester OL8). Please let me know vehicle availability.`);
      waQuoteBtn.href = `https://wa.me/447501419198?text=${msg}`;
    }

    // Update Three.js Arc Highlight
    if (arcMeshes.length > 0) {
      arcMeshes.forEach(item => {
        if (item.id === id) {
          item.line.material.color.setHex(0x22C55E);
          item.line.material.opacity = 1.0;
        } else {
          item.line.material.color.setHex(0x223243);
          item.line.material.opacity = 0.35;
        }
      });
    }
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    if (globeGroup && !isDragging) {
      globeGroup.rotation.y += 0.0012;
    }

    // Pulse & Particle travel
    pulsePoints.forEach(p => {
      if (p.curve) {
        p.progress += 0.004;
        if (p.progress > 1) p.progress = 0;
        const pt = p.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      } else if (p.baseScale) {
        // Pulsing hub ring
        const time = Date.now() * 0.003;
        const scale = 1 + Math.sin(time) * 0.25;
        p.mesh.scale.set(scale, scale, scale);
      }
    });

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external hooks if required
  window.MFTGlobe = {
    selectCorridor: selectCorridor,
    corridors: CORRIDORS
  };
})();
