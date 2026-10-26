import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface DestinationNode {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  approxMiles: number;
  corridor: string;
  subBranches?: string[];
}

export const DESTINATIONS: DestinationNode[] = [
  {
    id: 'manchester',
    name: 'Manchester (OL8 Hub)',
    region: 'Central Dispatch Hub',
    lat: 53.54,
    lng: -2.11,
    approxMiles: 0,
    corridor: 'M60 / M62 / M6 Central Nexus',
    subBranches: ['Oldham OL8 HQ', 'Trafford Park', 'Manchester Airport Cargo', 'Rochdale M62'],
  },
  {
    id: 'london',
    name: 'London & Home Counties',
    region: 'Greater London & Southern Trunk',
    lat: 51.51,
    lng: -0.12,
    approxMiles: 205,
    corridor: 'M1 / M6 Dedicated Trunk Route',
    subBranches: ['Heathrow Cargo Terminal', 'London Docklands', 'Dartford Crossing', 'Southampton Port', 'Cambridge Tech Arc'],
  },
  {
    id: 'birmingham',
    name: 'Birmingham & West Midlands',
    region: 'Midlands Industrial Corridor',
    lat: 52.48,
    lng: -1.89,
    approxMiles: 86,
    corridor: 'M6 Southbound Direct Highway',
    subBranches: ['Coventry Automotive', 'East Midlands Freight Hub', 'Wolverhampton Manufacturing', 'Stoke-on-Trent'],
  },
  {
    id: 'leeds',
    name: 'Leeds & West Yorkshire',
    region: 'Trans-Pennine Express Corridor',
    lat: 53.80,
    lng: -1.55,
    approxMiles: 42,
    corridor: 'M62 Trans-Pennine Trunk',
    subBranches: ['Sheffield Advanced Manufacturing', 'Bradford Textile Arc', 'York Logistics Hub', 'Hull Maritime Port'],
  },
  {
    id: 'liverpool',
    name: 'Liverpool & Merseyside',
    region: 'Western Maritime & Container Ports',
    lat: 53.40,
    lng: -2.99,
    approxMiles: 34,
    corridor: 'M62 Westward Highway Route',
    subBranches: ['Liverpool Seaforth Docks', 'Warrington Freight Terminal', 'Chester Industrial Park', 'Birkenhead Gateway'],
  },
  {
    id: 'glasgow',
    name: 'Glasgow & Central Scotland',
    region: 'Scottish Gateway & Northern Arteries',
    lat: 55.86,
    lng: -4.25,
    approxMiles: 215,
    corridor: 'M6 ➔ A74(M) ➔ M74 Direct Trunk',
    subBranches: ['Edinburgh Industrial Park', 'Grangemouth Refinery', 'Dundee Hub', 'Aberdeen Offshore Gateway'],
  },
  {
    id: 'bristol',
    name: 'Bristol & South West',
    region: 'Severnside & South West Trunk',
    lat: 51.45,
    lng: -2.58,
    approxMiles: 170,
    corridor: 'M6 ➔ M5 Southbound Route',
    subBranches: ['Cardiff Wales Gateway', 'Newport Distribution Hub', 'Gloucester M5', 'Exeter Logistics Park'],
  },
  {
    id: 'newcastle',
    name: 'Newcastle & North East',
    region: 'North East Coastal Arteries',
    lat: 54.97,
    lng: -1.61,
    approxMiles: 135,
    corridor: 'M62 ➔ A1(M) Northward Trunk',
    subBranches: ['Sunderland Automotive Park', 'Teesside Chemical Complex', 'Durham Gateway', 'Middlesbrough Port'],
  },
];

// Sub-branch nodes for multi-branch network visualization
interface SubNode {
  name: string;
  lat: number;
  lng: number;
  parent: string;
}

const SUB_BRANCHES: SubNode[] = [
  // London cluster
  { name: 'Heathrow', lat: 51.47, lng: -0.45, parent: 'london' },
  { name: 'Docklands', lat: 51.50, lng: 0.02, parent: 'london' },
  { name: 'Southampton', lat: 50.90, lng: -1.40, parent: 'london' },
  { name: 'Cambridge', lat: 52.20, lng: 0.12, parent: 'london' },
  // Midlands cluster
  { name: 'Coventry', lat: 52.40, lng: -1.51, parent: 'birmingham' },
  { name: 'E. Midlands Airport', lat: 52.83, lng: -1.32, parent: 'birmingham' },
  { name: 'Wolverhampton', lat: 52.58, lng: -2.13, parent: 'birmingham' },
  // Leeds / Yorkshire cluster
  { name: 'Sheffield', lat: 53.38, lng: -1.47, parent: 'leeds' },
  { name: 'Hull Port', lat: 53.74, lng: -0.33, parent: 'leeds' },
  { name: 'York', lat: 53.96, lng: -1.08, parent: 'leeds' },
  // Liverpool cluster
  { name: 'Warrington', lat: 53.39, lng: -2.59, parent: 'liverpool' },
  { name: 'Chester', lat: 53.19, lng: -2.89, parent: 'liverpool' },
  // Scotland cluster
  { name: 'Edinburgh', lat: 55.95, lng: -3.18, parent: 'glasgow' },
  { name: 'Dundee', lat: 56.46, lng: -2.97, parent: 'glasgow' },
  // Bristol / Wales cluster
  { name: 'Cardiff', lat: 51.48, lng: -3.18, parent: 'bristol' },
  { name: 'Gloucester', lat: 51.86, lng: -2.24, parent: 'bristol' },
  // Newcastle cluster
  { name: 'Sunderland', lat: 54.90, lng: -1.38, parent: 'newcastle' },
  { name: 'Teesside', lat: 54.57, lng: -1.23, parent: 'newcastle' },
];

interface LogisticsGlobe3DProps {
  onSelectDestination?: (dest: DestinationNode) => void;
  activeDestinationId?: string;
}

export const LogisticsGlobe3D: React.FC<LogisticsGlobe3DProps> = ({
  onSelectDestination,
  activeDestinationId = 'london',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [selectedNode, setSelectedNode] = useState<DestinationNode>(
    DESTINATIONS.find((d) => d.id === activeDestinationId) || DESTINATIONS[1]
  );
  const [isRotating, setIsRotating] = useState(true);

  // Sync prop changes
  useEffect(() => {
    const found = DESTINATIONS.find((d) => d.id === activeDestinationId);
    if (found) setSelectedNode(found);
  }, [activeDestinationId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let globeGroup: THREE.Group;
    let animationFrameId: number;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.42;
    let targetRotationY = -0.58;

    try {
      scene = new THREE.Scene();

      const width = container.clientWidth || 550;
      const height = container.clientHeight || 580;
      camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
      camera.position.set(0, 0, 7.8);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      globeGroup = new THREE.Group();
      scene.add(globeGroup);

      const sphereRadius = 2.38;

      const latLngToVector3 = (lat: number, lng: number, radius = sphereRadius): THREE.Vector3 => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
      };

      // 1. High-Tech Holographic Earth Surface Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Deep obsidian base
        ctx.fillStyle = '#0F1622';
        ctx.fillRect(0, 0, 2048, 1024);

        // Holographic Dot Matrix Grid
        ctx.fillStyle = 'rgba(132, 204, 22, 0.12)';
        for (let x = 0; x < 2048; x += 18) {
          for (let y = 0; y < 1024; y += 18) {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Coordinate Meridian Lines
        ctx.strokeStyle = 'rgba(132, 204, 22, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 2048; x += 64) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 1024);
          ctx.stroke();
        }
        for (let y = 0; y <= 1024; y += 64) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(2048, y);
          ctx.stroke();
        }

        // Digital Vector Landmasses with glowing circuit borders
        const drawLand = (cx: number, cy: number, rx: number, ry: number, angle = 0) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#182433';
          ctx.fill();
          ctx.strokeStyle = '#84CC16';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#84CC16';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.restore();
        };

        // British Isles (UK Hub Prominence)
        drawLand(1015, 225, 62, 90, Math.PI / 10);
        drawLand(988, 235, 34, 50, Math.PI / 8);

        // Continental Europe
        drawLand(1125, 260, 190, 140, Math.PI / 12);
        drawLand(1085, 135, 75, 130, -Math.PI / 10);

        // Africa, Asia, Americas
        drawLand(1140, 520, 160, 240, 0);
        drawLand(1430, 270, 270, 190, Math.PI / 14);
        drawLand(1320, 390, 130, 110, Math.PI / 6);
        drawLand(520, 240, 210, 170, -Math.PI / 16);
        drawLand(460, 130, 125, 85, 0);
        drawLand(660, 580, 145, 215, Math.PI / 12);
        drawLand(1650, 680, 135, 115, 0);
      }

      const globeTexture = new THREE.CanvasTexture(canvas);
      globeTexture.wrapS = THREE.RepeatWrapping;
      globeTexture.wrapT = THREE.ClampToEdgeWrapping;

      // Base Sphere with Specular Finish
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);
      const sphereMat = new THREE.MeshStandardMaterial({
        map: globeTexture,
        roughness: 0.35,
        metalness: 0.25,
        color: new THREE.Color('#16202D'),
      });
      const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      globeGroup.add(globeMesh);

      // Atmospheric Glowing Outer Envelope
      const atmoGeo = new THREE.SphereGeometry(sphereRadius * 1.045, 48, 48);
      const atmoMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(0.518, 0.8, 0.086, 1.0) * intensity * 0.55;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });
      const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
      globeGroup.add(atmoMesh);

      // 2. Orbital Gyroscope Coordinate Rings
      const ringGeo1 = new THREE.RingGeometry(sphereRadius * 1.14, sphereRadius * 1.155, 64);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#84CC16'),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
      ringMesh1.rotation.x = Math.PI / 2.3;
      globeGroup.add(ringMesh1);

      const ringGeo2 = new THREE.RingGeometry(sphereRadius * 1.24, sphereRadius * 1.25, 64);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#4ADE80'),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
      });
      const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
      ringMesh2.rotation.y = Math.PI / 3;
      globeGroup.add(ringMesh2);

      // 3. Manchester OL8 Central Hub Origin Node
      const mcrPos = latLngToVector3(53.54, -2.11, sphereRadius + 0.02);

      // Manchester Vertical Cyber Pin
      const mcrPinGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.24, 16);
      const mcrPinMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#A3E635') });
      const mcrPin = new THREE.Mesh(mcrPinGeo, mcrPinMat);
      mcrPin.position.copy(mcrPos);
      mcrPin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), mcrPos.clone().normalize());
      globeGroup.add(mcrPin);

      // Manchester Glowing Hub Core Beacon
      const mcrCoreGeo = new THREE.SphereGeometry(0.09, 24, 24);
      const mcrCoreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#84CC16'),
        emissive: new THREE.Color('#84CC16'),
        emissiveIntensity: 2.2,
        roughness: 0.1,
      });
      const mcrCore = new THREE.Mesh(mcrCoreGeo, mcrCoreMat);
      mcrCore.position.copy(mcrPos);
      globeGroup.add(mcrCore);

      // Multi-Concentric Radar Wave Rings over Manchester
      const pulseGeo1 = new THREE.RingGeometry(0.1, 0.13, 32);
      const pulseMat1 = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#84CC16'),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const pulseMesh1 = new THREE.Mesh(pulseGeo1, pulseMat1);
      pulseMesh1.position.copy(mcrPos.clone().multiplyScalar(1.01));
      pulseMesh1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), mcrPos.clone().normalize());
      globeGroup.add(pulseMesh1);

      const pulseGeo2 = new THREE.RingGeometry(0.16, 0.19, 32);
      const pulseMat2 = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#84CC16'),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const pulseMesh2 = new THREE.Mesh(pulseGeo2, pulseMat2);
      pulseMesh2.position.copy(mcrPos.clone().multiplyScalar(1.01));
      pulseMesh2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), mcrPos.clone().normalize());
      globeGroup.add(pulseMesh2);

      // 4. Multi-Branching Arterial Network Architecture
      const routes: Array<{
        curve: THREE.CubicBezierCurve3;
        particleMesh: THREE.Mesh;
        trailMesh: THREE.Mesh;
        dest: DestinationNode;
        lineMesh: THREE.Line;
        curveMat: THREE.LineBasicMaterial;
      }> = [];

      const subBranchesList: THREE.Line[] = [];

      const nonHubDestinations = DESTINATIONS.filter((d) => d.id !== 'manchester');

      // Create Primary Trunk Arcs from Manchester to Key UK Cities
      nonHubDestinations.forEach((dest) => {
        const destPos = latLngToVector3(dest.lat, dest.lng, sphereRadius + 0.02);

        // Destination Node Marker
        const nodeGeo = new THREE.SphereGeometry(0.055, 16, 16);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#222E3D'),
          emissive: new THREE.Color('#84CC16'),
          emissiveIntensity: 0.6,
          roughness: 0.2,
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.copy(destPos);
        globeGroup.add(nodeMesh);

        // High-Arched Geodesic 3D Bezier Curve
        const start = mcrPos.clone();
        const end = destPos.clone();
        const distance = start.distanceTo(end);
        const elevation = sphereRadius * (1 + Math.max(0.12, distance * 0.22));
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(elevation);
        const ctrl1 = start.clone().lerp(mid, 0.5).normalize().multiplyScalar(elevation * 0.98);
        const ctrl2 = end.clone().lerp(mid, 0.5).normalize().multiplyScalar(elevation * 0.98);

        const curve = new THREE.CubicBezierCurve3(start, ctrl1, ctrl2, end);
        const points = curve.getPoints(54);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

        const curveMat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#84CC16'),
          transparent: true,
          opacity: 0.75,
        });
        const lineMesh = new THREE.Line(curveGeo, curveMat);
        globeGroup.add(lineMesh);

        // Moving Data Packet Particles
        const particleGeo = new THREE.SphereGeometry(0.046, 12, 12);
        const particleMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#BEF264') });
        const particleMesh = new THREE.Mesh(particleGeo, particleMat);
        globeGroup.add(particleMesh);

        const trailGeo = new THREE.SphereGeometry(0.028, 8, 8);
        const trailMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#84CC16'),
          transparent: true,
          opacity: 0.7,
        });
        const trailMesh = new THREE.Mesh(trailGeo, trailMat);
        globeGroup.add(trailMesh);

        routes.push({ curve, particleMesh, trailMesh, dest, lineMesh, curveMat });
      });

      // 5. Create Secondary Sub-Branches Radiating from Key Destinations
      SUB_BRANCHES.forEach((sub) => {
        const parentDest = DESTINATIONS.find((d) => d.id === sub.parent);
        if (!parentDest) return;

        const parentPos = latLngToVector3(parentDest.lat, parentDest.lng, sphereRadius + 0.02);
        const subPos = latLngToVector3(sub.lat, sub.lng, sphereRadius + 0.02);

        // Sub-Node Marker
        const subMarkerGeo = new THREE.SphereGeometry(0.03, 10, 10);
        const subMarkerMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#4ADE80') });
        const subMarker = new THREE.Mesh(subMarkerGeo, subMarkerMat);
        subMarker.position.copy(subPos);
        globeGroup.add(subMarker);

        // Sub-Branch Connecting Line
        const subCurve = new THREE.QuadraticBezierCurve3(
          parentPos,
          parentPos.clone().add(subPos).multiplyScalar(0.5).normalize().multiplyScalar(sphereRadius * 1.06),
          subPos
        );
        const subPoints = subCurve.getPoints(24);
        const subGeo = new THREE.BufferGeometry().setFromPoints(subPoints);
        const subMat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#84CC16'),
          transparent: true,
          opacity: 0.35,
        });
        const subLine = new THREE.Line(subGeo, subMat);
        globeGroup.add(subLine);
        subBranchesList.push(subLine);
      });

      // 6. Volumetric Lighting & Sci-Fi Atmosphere
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const limeKeyLight = new THREE.DirectionalLight(0x84cc16, 2.2);
      limeKeyLight.position.set(5, 8, 7);
      scene.add(limeKeyLight);

      const cyanRim = new THREE.DirectionalLight(0x38bdf8, 1.1);
      cyanRim.position.set(-6, -4, -6);
      scene.add(cyanRim);

      const mcrPointLight = new THREE.PointLight(0xa3e635, 2.0, 6);
      mcrPointLight.position.copy(mcrPos.clone().multiplyScalar(1.2));
      globeGroup.add(mcrPointLight);

      // Initial orientation focusing on the UK
      globeGroup.rotation.x = targetRotationX;
      globeGroup.rotation.y = targetRotationY;

      // Mouse drag controls
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        setIsRotating(false);
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;
        targetRotationX = Math.max(-1.15, Math.min(1.15, targetRotationX));
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const domElem = renderer.domElement;
      domElem.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Slow smooth ambient rotation
        if (!isDragging && isRotating) {
          targetRotationY += 0.0024;
        }

        // Smooth rotation damping
        globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.08;
        globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.08;

        // Subtle floating bob
        globeGroup.position.y = Math.sin(elapsedTime * 0.9) * 0.08;

        // Counter-rotate coordinate gimbal rings
        ringMesh1.rotation.z = elapsedTime * 0.05;
        ringMesh2.rotation.z = -elapsedTime * 0.035;

        // Pulse wave radar rings over Manchester Hub
        const pulseScale1 = 1 + (Math.sin(elapsedTime * 3) + 1) * 0.38;
        pulseMesh1.scale.set(pulseScale1, pulseScale1, pulseScale1);
        pulseMat1.opacity = Math.max(0, 0.9 - (pulseScale1 - 1) * 1.5);

        const pulseScale2 = 1 + (Math.sin(elapsedTime * 3 + 1.2) + 1) * 0.48;
        pulseMesh2.scale.set(pulseScale2, pulseScale2, pulseScale2);
        pulseMat2.opacity = Math.max(0, 0.65 - (pulseScale2 - 1) * 1.3);

        // Animate data packet pulses along each route arc
        routes.forEach((route, index) => {
          const speed = 0.35 + (index % 3) * 0.08;
          const t1 = (elapsedTime * speed + index * 0.22) % 1;
          const t2 = Math.max(0, (t1 - 0.04 + 1) % 1);

          route.particleMesh.position.copy(route.curve.getPointAt(t1));
          route.trailMesh.position.copy(route.curve.getPointAt(t2));

          // Highlight selected route & its sub-branches
          if (route.dest.id === selectedNode.id) {
            route.curveMat.opacity = 1.0;
            route.curveMat.color.setHex(0xa3e635);
            route.particleMesh.scale.set(1.5, 1.5, 1.5);
            route.trailMesh.scale.set(1.3, 1.3, 1.3);
          } else {
            route.curveMat.opacity = 0.45;
            route.curveMat.color.setHex(0x84cc16);
            route.particleMesh.scale.set(1.0, 1.0, 1.0);
            route.trailMesh.scale.set(1.0, 1.0, 1.0);
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        domElem.removeEventListener('mousedown', onMouseDown);
        if (container.contains(domElem)) {
          container.removeChild(domElem);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization fallback:', err);
      setHasWebGLError(true);
    }
  }, [isRotating, selectedNode.id]);

  const handleCityClick = (dest: DestinationNode) => {
    setSelectedNode(dest);
    if (onSelectDestination) onSelectDestination(dest);
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-[#0C1117] border border-[#253241]">
      
      {/* 3D WebGL Canvas */}
      {!hasWebGLError ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        /* Accessible 2D Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#121822] rounded-2xl border border-white/10 text-center text-white">
          <div className="w-24 h-24 rounded-full bg-[#84CC16]/20 border-2 border-[#84CC16] flex items-center justify-center mb-4">
            <span className="font-mono text-xs font-bold text-[#84CC16]">MFT &bull; OL8</span>
          </div>
          <h4 className="text-lg font-bold text-white font-display">UK Multi-Branch Logistics Network</h4>
          <p className="text-xs text-gray-400 max-w-sm mt-1">
            Dedicated point-to-point courier transit originating from Greater Manchester (OL8) across all major UK arterial trunk corridors and regional branch clusters.
          </p>
        </div>
      )}

      {/* Floating Active Route HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm p-4 bg-[#121822]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl pointer-events-auto space-y-3 text-white">
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span className="flex items-center gap-2 font-bold text-[#84CC16]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16] animate-pulse" />
            <span>MFT LOGISTICS DATA GLOBE</span>
          </span>
          <span className="text-gray-400 text-[10px]">Multi-Branch Matrix</span>
        </div>

        <div>
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
            PRIMARY ARTERIAL TRUNK
          </div>
          <div className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5 font-display">
            <span>Manchester OL8</span>
            <span className="text-[#84CC16]">&rarr;</span>
            <span>{selectedNode.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="p-2.5 bg-black/50 rounded-xl border border-white/10">
            <div className="text-[9px] text-gray-400 uppercase">HIGHWAY ARTERY</div>
            <div className="font-bold text-white text-[11px] truncate mt-0.5">{selectedNode.corridor}</div>
          </div>
          <div className="p-2.5 bg-black/50 rounded-xl border border-white/10">
            <div className="text-[9px] text-gray-400 uppercase">DIRECT DISTANCE</div>
            <div className="font-bold text-[#84CC16] tabular-nums mt-0.5">~{selectedNode.approxMiles} miles</div>
          </div>
        </div>

        {/* Sub-Branches List */}
        {selectedNode.subBranches && selectedNode.subBranches.length > 0 && (
          <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <div className="text-[9px] font-mono text-[#84CC16] font-bold uppercase tracking-wider">
              Connected Sub-Branches:
            </div>
            <div className="text-[11px] text-gray-300 font-sans line-clamp-2">
              {selectedNode.subBranches.join(' • ')}
            </div>
          </div>
        )}

        <div className="pt-1 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>*Live 3D road routing</span>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="text-[#84CC16] font-semibold underline cursor-pointer"
          >
            {isRotating ? 'Pause rotation' : 'Resume rotation'}
          </button>
        </div>
      </div>

      {/* Destination Nodes Quick Selector (Bottom Horizontal Bar) */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-[#121822]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-x-auto max-w-full">
          <span className="text-[10px] font-mono font-bold text-[#84CC16] px-2 shrink-0">
            TRUNKS:
          </span>
          {DESTINATIONS.filter((d) => d.id !== 'manchester').map((dest) => {
            const isSelected = selectedNode.id === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => handleCityClick(dest)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#84CC16] text-[#0C1117] font-bold shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {dest.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
