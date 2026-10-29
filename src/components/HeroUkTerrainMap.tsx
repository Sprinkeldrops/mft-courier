import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, Navigation, Zap } from 'lucide-react';
import { Galaxy } from './Galaxy';
import { UK_NETWORK_CITIES, UkCityNode, DESTINATIONS } from './UkCourierNetworkMap';

export interface HeroUkTerrainMapProps {
  activeDestinationId?: string;
  onSelectDestination?: (dest: UkCityNode) => void;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  terrainIntensity?: number;
  glowIntensity?: number;
  interactive?: boolean;
  className?: string;
}

// Project coordinates into SVG viewport (viewBox: 0 0 620 740)
function projectCoordinates(lat: number, lng: number): { x: number; y: number } {
  const latMin = 49.8;
  const latMax = 58.9;
  const lngMin = -8.6;
  const lngMax = 2.1;

  const latRange = latMax - latMin;
  const lngRange = lngMax - lngMin;

  const y = ((latMax - lat) / latRange) * 630 + 55;
  const x = ((lng - lngMin) / lngRange) * 520 + 50;

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export const HeroUkTerrainMap: React.FC<HeroUkTerrainMapProps> = ({
  activeDestinationId = 'london',
  onSelectDestination,
  scale = 1.08,
  offsetX = 14,
  offsetY = -2,
  opacity = 0.95,
  terrainIntensity = 1.0,
  glowIntensity = 1.0,
  interactive = true,
  className = '',
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(activeDestinationId);
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mouseParallax, setMouseParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external prop changes
  useEffect(() => {
    if (activeDestinationId) {
      setSelectedCityId(activeDestinationId);
    }
  }, [activeDestinationId]);

  // Subtle mouse parallax handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

      // Soft clamp for gentle response
      setMouseParallax({
        x: Math.max(-1, Math.min(1, relativeX)),
        y: Math.max(-1, Math.min(1, relativeY)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hub City (Manchester)
  const manchesterCity = useMemo(() => UK_NETWORK_CITIES.find((c) => c.isHub)!, []);
  const hubPoint = useMemo(() => projectCoordinates(manchesterCity.lat, manchesterCity.lng), [manchesterCity]);

  // Destination Cities (all except Manchester)
  const destinationCities = useMemo(() => UK_NETWORK_CITIES.filter((c) => !c.isHub), []);

  // Selected city object
  const activeCity = useMemo(() => {
    const id = hoveredCityId || selectedCityId;
    return UK_NETWORK_CITIES.find((c) => c.id === id) || UK_NETWORK_CITIES[1];
  }, [hoveredCityId, selectedCityId]);

  const handleSelectCity = (city: UkCityNode) => {
    setSelectedCityId(city.id);
    if (onSelectDestination) {
      onSelectDestination(city);
    }
  };

  // Route paths from Manchester to each destination
  const routePaths = useMemo(() => {
    return destinationCities.map((city, idx) => {
      const destPoint = projectCoordinates(city.lat, city.lng);
      const dx = destPoint.x - hubPoint.x;
      const dy = destPoint.y - hubPoint.y;
      const dist = Math.hypot(dx, dy);

      // Natural curved arc
      const curvature = (idx % 2 === 0 ? 1 : -1) * Math.min(32, Math.max(12, dist * 0.16));
      const midX = (hubPoint.x + destPoint.x) / 2 - (dy / (dist || 1)) * curvature;
      const midY = (hubPoint.y + destPoint.y) / 2 + (dx / (dist || 1)) * curvature;

      const pathData = `M ${hubPoint.x} ${hubPoint.y} Q ${midX} ${midY} ${destPoint.x} ${destPoint.y}`;
      const duration = (2.2 + (dist / 140) * 1.0).toFixed(2);
      const delay = ((idx * 0.28) % 1.8).toFixed(2);

      return {
        city,
        destPoint,
        pathData,
        duration,
        delay,
        midX,
        midY,
      };
    });
  }, [destinationCities, hubPoint]);

  // 3D Parallax Tilt Values
  const tiltX = (mouseParallax.y * -3.5).toFixed(2);
  const tiltY = (mouseParallax.x * 4.5).toFixed(2);
  const panX = (mouseParallax.x * 12).toFixed(1);
  const panY = (mouseParallax.y * 8).toFixed(1);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{
        opacity,
        // Allow external CSS variables to override
        '--hero-map-scale': scale,
        '--hero-map-offset-x': `${offsetX}%`,
        '--hero-map-offset-y': `${offsetY}%`,
      } as React.CSSProperties}
    >
      {/* 1. Deep Cosmic Starfield Backdrop */}
      <Galaxy
        density={1.1}
        glowIntensity={0.4}
        starSpeed={0.4}
        mouseRepulsion={true}
        twinkleIntensity={0.35}
        lightMode={false}
        paused={isPaused}
        className="opacity-90 absolute inset-0"
      />

      {/* 2. Soft Ambient Vignettes: Dark scrim on left & bottom for crystal-clear text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(circle at 75% 45%, rgba(6, 9, 15, 0.2) 0%, rgba(6, 9, 15, 0.75) 70%, rgba(6, 9, 15, 0.96) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-3/5 pointer-events-none z-10 bg-gradient-to-r from-[#07090E] via-[#07090E]/90 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10 bg-gradient-to-t from-[#07090E] via-[#07090E]/80 to-transparent"
        aria-hidden="true"
      />

      {/* 3. Interactive Floating Map Stage with subtle 3D tilt */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center lg:justify-end transition-transform duration-700 ease-out z-0"
        style={{
          transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${panX}px, ${panY}px, 0)`,
        }}
      >
        <div
          className="relative w-[92vw] sm:w-[85vw] md:w-[75vw] lg:w-[62vw] xl:w-[54vw] max-w-[920px] aspect-[620/740] transition-all duration-500 ease-out"
          style={{
            transform: `translate(${offsetX}%, ${offsetY}%) scale(${scale})`,
          }}
        >
          <svg
            viewBox="0 0 620 740"
            className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="3D UK Courier Logistics Network Map"
          >
            <defs>
              {/* Filter: Intense Neon Lime Courier Artery Glow */}
              <filter id="heroRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={3.5 * glowIntensity} result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Filter: Active Selected Route Electric Glow */}
              <filter id="heroActiveGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation={6 * glowIntensity} result="blur1" />
                <feGaussianBlur stdDeviation={2 * glowIntensity} result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Filter: Manchester Hub Beacon Flare */}
              <filter id="heroHubGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={8 * glowIntensity} result="blur" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.517   0 0 0 0 0.8   0 0 0 0 0.086  0 0 0 1.2 0"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 3D Terrain Shading Gradients */}
              <linearGradient id="ukLandmassGradient" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#141E2C" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#182436" stopOpacity="0.98" />
                <stop offset="70%" stopColor="#101824" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#0B1019" stopOpacity="0.98" />
              </linearGradient>

              {/* Highland / Mountain Topographic Relief Gradient */}
              <linearGradient id="terrainHighlandsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#25354C" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#1D2A3D" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#131D2B" stopOpacity="0.3" />
              </linearGradient>

              {/* Pennines Spine Relief Gradient (Manchester corridor) */}
              <linearGradient id="terrainPenninesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84CC16" stopOpacity="0.18" />
                <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#172233" stopOpacity="0.4" />
              </linearGradient>

              {/* Coastal Bathymetric Glow Gradient */}
              <linearGradient id="coastalShelfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#84CC16" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#A3E635" stopOpacity="0.45" />
              </linearGradient>

              {/* Route Artery Gradients */}
              <linearGradient id="heroRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84CC16" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#A3E635" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="heroRouteDim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84CC16" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
              </linearGradient>

              {/* Moving Light Particle Glow */}
              <radialGradient id="heroParticleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="35%" stopColor="#A3E635" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#84CC16" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* A. Precision Geographic Graticule Grid */}
            <g className="opacity-15 font-mono text-[9px] text-[#717E94]" stroke="#334155" strokeWidth="0.6" strokeDasharray="3 4">
              <line x1="50" y1="120" x2="570" y2="120" />
              <text x="55" y="115" fill="#64748B" stroke="none">58°N</text>
              <line x1="50" y1="260" x2="570" y2="260" />
              <text x="55" y="255" fill="#64748B" stroke="none">56°N</text>
              <line x1="50" y1="400" x2="570" y2="400" />
              <text x="55" y="395" fill="#64748B" stroke="none">54°N</text>
              <line x1="50" y1="540" x2="570" y2="540" />
              <text x="55" y="535" fill="#64748B" stroke="none">52°N</text>

              <line x1="170" y1="60" x2="170" y2="680" />
              <text x="175" y="670" fill="#64748B" stroke="none">6°W</text>
              <line x1="270" y1="60" x2="270" y2="680" />
              <text x="275" y="670" fill="#64748B" stroke="none">4°W</text>
              <line x1="370" y1="60" x2="370" y2="680" />
              <text x="375" y="670" fill="#64748B" stroke="none">2°W</text>
              <line x1="470" y1="60" x2="470" y2="680" />
              <text x="475" y="670" fill="#64748B" stroke="none">0°</text>
            </g>

            {/* B. Recognisable, Filled UK Landmass (Great Britain & Northern Ireland) with 3D Depth */}
            <g className="transition-all duration-300">
              {/* 3D Elevated Base Shadow */}
              <path
                d="
                  M 307 64
                  C 327 62, 357 69, 377 79
                  C 390 92, 397 109, 387 129
                  C 377 144, 362 152, 364 169
                  C 374 179, 414 189, 420 204
                  C 427 222, 402 239, 397 252
                  C 392 264, 374 272, 372 284
                  C 377 296, 407 309, 412 324
                  C 417 344, 437 369, 444 392
                  C 452 414, 484 434, 494 456
                  C 502 476, 467 489, 460 499
                  C 457 514, 482 526, 497 542
                  C 514 559, 517 576, 500 589
                  C 487 599, 467 594, 452 602
                  C 440 609, 432 626, 414 629
                  C 397 632, 382 619, 362 622
                  C 342 626, 322 639, 297 644
                  C 277 649, 247 654, 227 652
                  C 217 646, 232 634, 244 626
                  C 257 616, 277 619, 292 609
                  C 307 599, 320 582, 327 569
                  C 317 564, 297 572, 282 569
                  C 262 564, 240 549, 244 534
                  C 247 519, 267 512, 277 502
                  C 287 492, 280 476, 287 464
                  C 294 452, 317 446, 330 439
                  C 342 429, 337 414, 344 399
                  C 352 384, 347 364, 337 349
                  C 327 334, 307 324, 297 304
                  C 287 284, 280 264, 284 244
                  C 290 224, 277 202, 280 182
                  C 284 162, 292 144, 287 124
                  C 282 104, 287 84, 307 64
                  Z
                "
                fill="rgba(3, 5, 8, 0.85)"
              />

              {/* Main Great Britain Solid Landmass with Rich Gradient */}
              <path
                d="
                  M 305 60
                  C 325 58, 355 65, 375 75
                  C 388 88, 395 105, 385 125
                  C 375 140, 360 148, 362 165
                  C 372 175, 412 185, 418 200
                  C 425 218, 400 235, 395 248
                  C 390 260, 372 268, 370 280
                  C 375 292, 405 305, 410 320
                  C 415 340, 435 365, 442 388
                  C 450 410, 482 430, 492 452
                  C 500 472, 465 485, 458 495
                  C 455 510, 480 522, 495 538
                  C 512 555, 515 572, 498 585
                  C 485 595, 465 590, 450 598
                  C 438 605, 430 622, 412 625
                  C 395 628, 380 615, 360 618
                  C 340 622, 320 635, 295 640
                  C 275 645, 245 650, 225 648
                  C 215 642, 230 630, 242 622
                  C 255 612, 275 615, 290 605
                  C 305 595, 318 578, 325 565
                  C 315 560, 295 568, 280 565
                  C 260 560, 238 545, 242 530
                  C 245 515, 265 508, 275 498
                  C 285 488, 278 472, 285 460
                  C 292 448, 315 442, 328 435
                  C 340 425, 335 410, 342 395
                  C 350 380, 345 360, 335 345
                  C 325 330, 305 320, 295 300
                  C 285 280, 278 260, 282 240
                  C 288 220, 275 198, 278 178
                  C 282 158, 290 140, 285 120
                  C 280 100, 285 80, 305 60
                  Z
                "
                fill="url(#ukLandmassGradient)"
                stroke="url(#coastalShelfGradient)"
                strokeWidth="2"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_20px_rgba(132,204,22,0.22)]"
              />

              {/* Northern Ireland Solid Landmass with Shadow and Bevel */}
              <path
                d="
                  M 160 280
                  C 175 272, 195 275, 208 285
                  C 218 295, 222 315, 220 330
                  C 218 345, 205 360, 192 368
                  C 178 375, 160 372, 150 360
                  C 142 348, 140 330, 145 315
                  C 148 300, 152 288, 160 280
                  Z
                "
                fill="url(#ukLandmassGradient)"
                stroke="url(#coastalShelfGradient)"
                strokeWidth="1.8"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              />

              {/* Lough Neagh indentation inside Northern Ireland */}
              <ellipse cx="180" cy="325" rx="8" ry="6" fill="#070A10" stroke="rgba(34,211,238,0.3)" strokeWidth="0.8" />

              {/* Isle of Man */}
              <ellipse
                cx="310"
                cy="400"
                rx="7"
                ry="12"
                transform="rotate(-18 310 400)"
                fill="url(#ukLandmassGradient)"
                stroke="rgba(132, 204, 22, 0.5)"
                strokeWidth="1.2"
              />

              {/* Isle of Wight */}
              <ellipse
                cx="430"
                cy="622"
                rx="10"
                ry="5"
                fill="url(#ukLandmassGradient)"
                stroke="rgba(132, 204, 22, 0.5)"
                strokeWidth="1.2"
              />

              {/* C. Subtle 3D Topographic Terrain Contours & Elevation Ridges */}
              {/* 1. Scottish Highlands & Grampian Massif */}
              <path
                d="
                  M 315 90
                  C 335 95, 360 110, 365 130
                  C 370 150, 340 170, 330 185
                  C 320 200, 305 195, 298 175
                  C 292 155, 305 110, 315 90
                  Z
                "
                fill="url(#terrainHighlandsGradient)"
                stroke="rgba(34, 211, 238, 0.22)"
                strokeWidth="0.75"
                strokeDasharray="2 3"
              />
              <path
                d="M 320 120 C 330 135, 345 150, 335 165"
                fill="none"
                stroke="rgba(132, 204, 22, 0.3)"
                strokeWidth="1"
              />

              {/* 2. Pennines Mountain Spine (Runs north-to-south directly via Manchester corridor) */}
              <path
                d="
                  M 365 310
                  C 380 340, 395 380, 385 410
                  C 375 440, 350 460, 345 445
                  C 340 430, 350 390, 355 350
                  C 358 325, 360 315, 365 310
                  Z
                "
                fill="url(#terrainPenninesGradient)"
                stroke="rgba(132, 204, 22, 0.28)"
                strokeWidth="0.8"
              />

              {/* 3. Welsh Cambrian & Snowdonia Massif */}
              <path
                d="
                  M 285 480
                  C 305 470, 320 490, 315 520
                  C 310 545, 290 550, 275 540
                  C 265 530, 275 495, 285 480
                  Z
                "
                fill="url(#terrainHighlandsGradient)"
                stroke="rgba(34, 211, 238, 0.2)"
                strokeWidth="0.75"
                strokeDasharray="2 4"
              />

              {/* 4. Cotswolds / South Downs Elevation Ridges */}
              <path
                d="M 330 575 C 360 565, 410 570, 440 595"
                fill="none"
                stroke="rgba(132, 204, 22, 0.2)"
                strokeWidth="0.8"
                strokeDasharray="3 4"
              />
            </g>

            {/* D. Radar Ripple Sweep Rings radiating from Manchester OL8 Hub */}
            <g transform={`translate(${hubPoint.x}, ${hubPoint.y})`} className="pointer-events-none">
              {!isPaused && (
                <>
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#84CC16" strokeWidth="1.2" opacity="0.8">
                    <animate attributeName="r" values="8;75" dur="3.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.85;0" dur="3.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.7">
                    <animate attributeName="r" values="8;75" dur="3.6s" begin="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.75;0" dur="3.6s" begin="1.2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#A3E635" strokeWidth="0.8" opacity="0.6">
                    <animate attributeName="r" values="8;75" dur="3.6s" begin="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.65;0" dur="3.6s" begin="2.4s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
            </g>

            {/* E. Glowing Arterial Courier Routes (Manchester ➔ UK Destinations) */}
            <g className="transition-all duration-300">
              {routePaths.map(({ city, pathData }) => {
                const isSelected = activeCity.id === city.id;

                return (
                  <g key={`route-${city.id}`} className="transition-opacity duration-300">
                    {/* Underlying Soft Ambient Glow */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isSelected ? '#84CC16' : '#22D3EE'}
                      strokeWidth={isSelected ? '5.5' : '2.2'}
                      strokeOpacity={isSelected ? '0.75' : '0.18'}
                      filter={isSelected ? 'url(#heroActiveGlow)' : 'url(#heroRouteGlow)'}
                    />

                    {/* Crisp Road Core Line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isSelected ? 'url(#heroRouteGrad)' : 'url(#heroRouteDim)'}
                      strokeWidth={isSelected ? '2.4' : '1.3'}
                      strokeLinecap="round"
                      strokeDasharray={isSelected ? 'none' : '4 3'}
                    />
                  </g>
                );
              })}
            </g>

            {/* F. High-Speed Courier Light Particles Traveling Along Corridors */}
            {!isPaused && (
              <g className="pointer-events-none">
                {routePaths.map(({ city, pathData, duration, delay }) => {
                  const isSelected = activeCity.id === city.id;

                  return (
                    <g key={`particles-${city.id}`}>
                      {/* Outbound Courier Particle (Manchester ➔ City) */}
                      <circle r={isSelected ? '4.8' : '3.6'} fill="url(#heroParticleGlow)">
                        <animateMotion
                          path={pathData}
                          dur={`${duration}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                          rotate="auto"
                        />
                      </circle>

                      {/* Inbound Courier Particle (City ➔ Manchester Return Transit) */}
                      <circle r={isSelected ? '3.8' : '2.6'} fill="#22D3EE" opacity="0.85">
                        <animateMotion
                          path={pathData}
                          dur={`${Number(duration) * 1.15}s`}
                          begin={`${Number(delay) + 1.2}s`}
                          repeatCount="indefinite"
                          keyPoints="1;0"
                          keyTimes="0;1"
                        />
                      </circle>
                    </g>
                  );
                })}
              </g>
            )}

            {/* G. Destination City Markers with Pulsing Glow and Interactive Hit Targets */}
            <g className="pointer-events-auto">
              {destinationCities.map((city) => {
                const pt = projectCoordinates(city.lat, city.lng);
                const isSelected = activeCity.id === city.id;
                const isHovered = hoveredCityId === city.id;

                return (
                  <g
                    key={`city-${city.id}`}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className={`cursor-pointer group transition-transform ${isSelected ? 'scale-115' : 'hover:scale-110'}`}
                    onClick={() => interactive && handleSelectCity(city)}
                    onMouseEnter={() => interactive && setHoveredCityId(city.id)}
                    onMouseLeave={() => interactive && setHoveredCityId(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select corridor to ${city.name}`}
                  >
                    {/* Interactive Click target aura */}
                    <circle cx="0" cy="0" r="18" fill="transparent" />

                    {/* Outer pulse aura */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '12' : '7'}
                      fill={isSelected ? '#84CC16' : '#22D3EE'}
                      opacity={isSelected ? '0.35' : '0.2'}
                      className={isSelected ? 'animate-pulse' : ''}
                    />

                    {/* Mid Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '7' : '4.5'}
                      fill="#0C1017"
                      stroke={isSelected ? '#84CC16' : '#67E8F9'}
                      strokeWidth={isSelected ? '2' : '1.4'}
                    />

                    {/* Center Core Dot */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '3.5' : '2.2'}
                      fill={isSelected ? '#FFFFFF' : '#84CC16'}
                    />

                    {/* City Monospace Label with legibility dark halo */}
                    <g transform={`translate(${city.lng > -2.2 ? 10 : -10}, ${city.lat > 53.5 ? -8 : 12})`}>
                      <text
                        x="0"
                        y="0"
                        textAnchor={city.lng > -2.2 ? 'start' : 'end'}
                        fill="#06090F"
                        stroke="#06090F"
                        strokeWidth="4"
                        strokeLinejoin="round"
                        fontSize="9.5"
                        fontWeight="700"
                        fontFamily="ui-monospace, monospace"
                      >
                        {city.shortName.toUpperCase()}
                      </text>
                      <text
                        x="0"
                        y="0"
                        textAnchor={city.lng > -2.2 ? 'start' : 'end'}
                        fill={isSelected || isHovered ? '#84CC16' : '#CBD5E1'}
                        fontSize="9.5"
                        fontWeight="700"
                        fontFamily="ui-monospace, monospace"
                        letterSpacing="0.04em"
                      >
                        {city.shortName.toUpperCase()}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* H. Manchester Central Hub (OL8) Prominent Beacon */}
            <g
              transform={`translate(${hubPoint.x}, ${hubPoint.y})`}
              className="pointer-events-auto cursor-pointer"
              onClick={() => interactive && handleSelectCity(manchesterCity)}
            >
              {/* Outer Glow Disc */}
              <circle cx="0" cy="0" r="26" fill="#84CC16" opacity="0.25" filter="url(#heroHubGlow)" />
              <circle cx="0" cy="0" r="16" fill="#84CC16" opacity="0.35" className="animate-pulse" />

              {/* Hub Outer Ring */}
              <circle cx="0" cy="0" r="9" fill="#0B0F15" stroke="#84CC16" strokeWidth="2.5" />

              {/* Pure White Core Center */}
              <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />

              {/* Prominent Badge for Manchester OL8 */}
              <g transform="translate(14, -14)">
                <rect
                  x="-2"
                  y="-12"
                  width="136"
                  height="20"
                  rx="4"
                  fill="#0B0F16"
                  stroke="#84CC16"
                  strokeWidth="1.2"
                  opacity="0.95"
                />
                <circle cx="6" cy="-2" r="3" fill="#84CC16" className="animate-ping" />
                <circle cx="6" cy="-2" r="2" fill="#84CC16" />
                <text
                  x="14"
                  y="2"
                  fill="#84CC16"
                  fontSize="9.5"
                  fontWeight="800"
                  fontFamily="ui-monospace, monospace"
                  letterSpacing="0.05em"
                >
                  MANCHESTER HUB (OL8)
                </text>
              </g>
            </g>

            {/* I. Compass Rose Tactical Heading Accent */}
            <g transform="translate(90, 85)" className="opacity-35 pointer-events-none">
              <circle cx="0" cy="0" r="20" fill="none" stroke="#64748B" strokeWidth="0.8" strokeDasharray="2 4" />
              <line x1="0" y1="-26" x2="0" y2="26" stroke="#84CC16" strokeWidth="1" />
              <line x1="-26" y1="0" x2="26" y2="0" stroke="#64748B" strokeWidth="1" />
              <polygon points="0,-26 -3,-15 0,-18 3,-15" fill="#84CC16" />
              <text x="0" y="-30" textAnchor="middle" fill="#84CC16" fontSize="9" fontWeight="bold" fontFamily="monospace">N</text>
              <text x="0" y="14" textAnchor="middle" fill="#717E94" fontSize="7.5" fontFamily="monospace">GRID 3D</text>
            </g>
          </svg>
        </div>
      </div>

      {/* 4. Controls & Quick Corridor HUD (Positioned in Top Right, subtle and unobtrusive) */}
      <div className="absolute top-6 right-6 z-20 pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="px-3 py-1.5 rounded-xl bg-[#0E131C]/80 hover:bg-[#151D2B] border border-[#222E42] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all backdrop-blur-md shadow-lg active:scale-95 cursor-pointer"
          title={isPaused ? 'Resume live courier motion' : 'Pause animation motion'}
          aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 text-[#84CC16] fill-[#84CC16]" />
              <span className="hidden sm:inline">Resume Motion</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-[#84CC16]" />
              <span className="hidden sm:inline">Pause Motion</span>
            </>
          )}
        </button>
      </div>

      {/* 5. Active Corridor Interactive Pill (Floating bottom-right on desktop) */}
      {activeCity && (
        <div className="hidden lg:flex absolute bottom-8 right-8 z-20 pointer-events-auto items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0C111A]/85 border border-[#1E2B3E] backdrop-blur-xl shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-[#84CC16] animate-pulse" />
          <div className="text-xs font-mono">
            <span className="text-neutral-400">Direct Transit: </span>
            <strong className="text-white">Manchester OL8</strong>
            <span className="text-[#84CC16] mx-1">➔</span>
            <strong className="text-[#84CC16]">{activeCity.name}</strong>
            {activeCity.approxMiles > 0 && (
              <span className="text-neutral-400 ml-1.5">
                (~{activeCity.approxMiles} mi via {activeCity.corridor})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
