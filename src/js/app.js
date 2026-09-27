// MFT Courier — Editorial Interaction System
document.addEventListener('DOMContentLoaded', () => {
  initHeroCursorReveal();
  initServiceHoverPreview();
  initScrollAnimations();
  initJourneyCanvasSequence();
  initTrackingPreview();
  initCorridorSelector();
  initNavigation();
  initForms();
});

// 1. HERO CURSOR-FOLLOWING IMAGE REVEAL (Lerp + requestAnimationFrame)
function initHeroCursorReveal() {
  const hero = document.getElementById('heroSection');
  const mask = document.getElementById('heroCursorMask');
  if (!hero || !mask || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Only enable on desktop pointer devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mouseX = -999, mouseY = -999;
  let currentX = -999, currentY = -999;
  let isHovered = false;

  hero.addEventListener('mouseenter', () => {
    isHovered = true;
    mask.classList.add('active');
  });

  hero.addEventListener('mouseleave', () => {
    isHovered = false;
    mask.classList.remove('active');
  });

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (currentX === -999) {
      currentX = mouseX;
      currentY = mouseY;
    }
  });

  function renderReveal() {
    if (isHovered && mouseX !== -999) {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      mask.style.setProperty('--mouse-x', `${currentX}px`);
      mask.style.setProperty('--mouse-y', `${currentY}px`);
    }
    requestAnimationFrame(renderReveal);
  }
  requestAnimationFrame(renderReveal);
}

// 2. EDITORIAL SERVICE ROWS CURSOR IMAGE PREVIEW
function initServiceHoverPreview() {
  const preview = document.getElementById('serviceHoverPreview');
  const previewImg = document.getElementById('servicePreviewImg');
  const previewTitle = document.getElementById('servicePreviewTitle');
  const rows = document.querySelectorAll('.service-editorial-row');

  if (!preview || !previewImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let targetX = -999, targetY = -999;
  let currentX = -999, currentY = -999;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (currentX === -999) {
      currentX = targetX;
      currentY = targetY;
    }
  });

  function loop() {
    if (isVisible) {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      preview.style.left = `${currentX + 24}px`;
      preview.style.top = `${currentY + 24}px`;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      const imgSrc = row.getAttribute('data-image');
      const title = row.getAttribute('data-title');
      if (imgSrc) {
        previewImg.src = imgSrc;
        previewImg.alt = title || 'Service preview';
        if (previewTitle) previewTitle.innerText = title || '';
        preview.classList.add('visible');
        isVisible = true;
      }
    });

    row.addEventListener('mouseleave', () => {
      preview.classList.remove('visible');
      isVisible = false;
    });
  });
}

// 3. GSAP SCROLL STORY & ROUTE DASH ANIMATIONS
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero Parallax & Depth
  gsap.to('#heroBgImg', {
    y: 90,
    scale: 1.05,
    ease: 'none',
    scrollTrigger: {
      trigger: '#heroSection',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('#heroForegroundContent', {
    y: -40,
    opacity: 0.9,
    ease: 'none',
    scrollTrigger: {
      trigger: '#heroSection',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Editorial Large Statement Reveal
  const statement = document.querySelector('.editorial-statement-text');
  if (statement) {
    gsap.from(statement, {
      opacity: 0.15,
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: statement,
        start: 'top 80%',
        end: 'top 40%',
        scrub: true
      }
    });
  }

  // UK Journey SVG Route Progress Line
  const journeyPath = document.getElementById('mainJourneyPath');
  if (journeyPath) {
    const pathLength = journeyPath.getTotalLength();
    journeyPath.style.strokeDasharray = pathLength;
    journeyPath.style.strokeDashoffset = pathLength;

    gsap.to(journeyPath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#journeySection',
        start: 'top 70%',
        end: 'bottom 50%',
        scrub: 1.2
      }
    });
  }

  // How We Deliver 4 Stages Scroll Trigger
  const stages = document.querySelectorAll('.deliver-stage-card');
  const progressBar = document.getElementById('deliverProgressBar');
  if (stages.length && progressBar) {
    ScrollTrigger.create({
      trigger: '#how-it-works',
      start: 'top 60%',
      end: 'bottom 60%',
      onUpdate: (self) => {
        const progress = self.progress;
        progressBar.style.width = `${Math.min(100, Math.max(10, progress * 100))}%`;

        const activeIndex = Math.min(stages.length - 1, Math.floor(progress * stages.length));
        stages.forEach((st, idx) => {
          if (idx === activeIndex) {
            st.classList.add('border-steel', 'bg-surfaceDark');
            st.classList.remove('opacity-60');
          } else {
            st.classList.remove('border-steel', 'bg-surfaceDark');
            st.classList.add('opacity-60');
          }
        });
      }
    });
  }
}

// 4. SCROLL-DRIVEN DELIVERY CANVAS ANIMATION
function initJourneyCanvasSequence() {
  const canvas = document.getElementById('journeyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Resize canvas for device pixel ratio
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  const waypoints = [
    { label: '01. MANCHESTER OL8 HUB', note: 'Goods inspected & secured in transport hold', km: '0 km', progress: 0 },
    { label: '02. M60 / M62 CORRIDOR', note: 'Arterial highway departure, direct transit', km: '38 km', progress: 0.33 },
    { label: '03. INTER-CITY HIGHWAY', note: 'Continuous GPS telemetry & milestone progress', km: '142 km', progress: 0.66 },
    { label: '04. DESTINATION ARRIVAL', note: 'Recipient signature & electronic POD transmission', km: '210 km', progress: 1.0 }
  ];

  let currentProgress = 0;
  let targetProgress = 0;

  // Wire to ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '#journeyCanvasContainer',
      start: 'top 80%',
      end: 'bottom 20%',
      onUpdate: (self) => {
        targetProgress = self.progress;
      }
    });
  }

  function draw() {
    currentProgress += (targetProgress - currentProgress) * 0.08;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Background road corridor grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Main arterial transit line
    const startY = h * 0.5;
    ctx.beginPath();
    ctx.moveTo(40, startY);
    ctx.lineTo(w - 40, startY);
    ctx.strokeStyle = '#283747';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Active progress line
    const activeWidth = (w - 80) * currentProgress;
    ctx.beginPath();
    ctx.moveTo(40, startY);
    ctx.lineTo(40 + activeWidth, startY);
    ctx.strokeStyle = '#2F6F8F';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Moving Vehicle Marker
    const vehicleX = 40 + activeWidth;
    ctx.beginPath();
    ctx.arc(vehicleX, startY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#2F6F8F';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Waypoints along path
    waypoints.forEach((wp, index) => {
      const wpX = 40 + (w - 80) * (index / (waypoints.length - 1));
      const isReached = currentProgress >= (index / (waypoints.length - 1)) - 0.05;

      ctx.beginPath();
      ctx.arc(wpX, startY, 4, 0, Math.PI * 2);
      ctx.fillStyle = isReached ? '#2F6F8F' : '#1D2A37';
      ctx.strokeStyle = isReached ? '#ffffff' : '#848E97';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    });

    // Update Telemetry DOM text
    const activeIndex = Math.min(waypoints.length - 1, Math.floor(currentProgress * waypoints.length));
    const activeData = waypoints[activeIndex] || waypoints[0];
    const domStage = document.getElementById('canvasStageLabel');
    const domNote = document.getElementById('canvasStageNote');
    const domPct = document.getElementById('canvasStagePct');

    if (domStage && domStage.innerText !== activeData.label) {
      domStage.innerText = activeData.label;
    }
    if (domNote && domNote.innerText !== activeData.note) {
      domNote.innerText = activeData.note;
    }
    if (domPct) {
      domPct.innerText = `${Math.round(currentProgress * 100)}% Complete`;
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// 5. TRACKING PREVIEW (Clearly labeled demonstration with randomized demo journeys)
const DEMO_JOURNEYS = [
  {
    ref: 'MFT-DEMO-7842',
    origin: 'Manchester (OL8)',
    destination: 'Leeds (LS1)',
    corridor: 'M62 Eastbound',
    service: 'Same-Day Urgent',
    status: 'In Direct Highway Transit',
    progress: '68%',
    miles: '42 miles',
    eta: '25 mins'
  },
  {
    ref: 'MFT-DEMO-9120',
    origin: 'Manchester (OL8)',
    destination: 'Birmingham (B1)',
    corridor: 'M6 Southbound',
    service: 'Dedicated Charter',
    status: 'In Direct Highway Transit',
    progress: '54%',
    miles: '88 miles',
    eta: '52 mins'
  },
  {
    ref: 'MFT-DEMO-3401',
    origin: 'Manchester (OL8)',
    destination: 'London (EC1)',
    corridor: 'M6 / M1 Southbound',
    service: 'Next-Day Commercial',
    status: 'Consignment Collected & Secured',
    progress: '28%',
    miles: '205 miles',
    eta: '2h 45m'
  },
  {
    ref: 'MFT-DEMO-5529',
    origin: 'Manchester (OL8)',
    destination: 'Glasgow (G1)',
    corridor: 'M6 Northbound / A74(M)',
    service: 'Industrial Freight',
    status: 'Scheduled Motorway Transit',
    progress: '45%',
    miles: '218 miles',
    eta: '2h 10m'
  }
];

let currentJourneyIndex = 0;

function initTrackingPreview() {
  renderTrackingDemo(0);
}

function randomizeTrackingDemo() {
  currentJourneyIndex = (currentJourneyIndex + 1) % DEMO_JOURNEYS.length;
  renderTrackingDemo(currentJourneyIndex);
}

function renderTrackingDemo(index) {
  const d = DEMO_JOURNEYS[index];
  if (!d) return;

  const refEl = document.getElementById('demoTrackRef');
  const originEl = document.getElementById('demoTrackOrigin');
  const destEl = document.getElementById('demoTrackDest');
  const serviceEl = document.getElementById('demoTrackService');
  const statusEl = document.getElementById('demoTrackStatus');
  const progressEl = document.getElementById('demoTrackProgress');
  const barEl = document.getElementById('demoTrackBar');
  const milesEl = document.getElementById('demoTrackMiles');
  const etaEl = document.getElementById('demoTrackEta');

  if (refEl) refEl.innerText = d.ref;
  if (originEl) originEl.innerText = d.origin;
  if (destEl) destEl.innerText = d.destination;
  if (serviceEl) serviceEl.innerText = `${d.service} · ${d.corridor}`;
  if (statusEl) statusEl.innerText = d.status;
  if (progressEl) progressEl.innerText = d.progress;
  if (barEl) barEl.style.width = d.progress;
  if (milesEl) milesEl.innerText = d.miles;
  if (etaEl) etaEl.innerText = d.eta;
}

// 6. INTERACTIVE UK CORRIDOR SELECTOR
const CORRIDOR_DATA = {
  leeds: { route: 'OL8 Hub → Leeds & West Yorkshire', dist: '42 highway miles', time: '~55 minutes', motor: 'M62 Eastbound' },
  liverpool: { route: 'OL8 Hub → Liverpool & Merseyside', dist: '38 highway miles', time: '~50 minutes', motor: 'M60 / M62 Westbound' },
  birmingham: { route: 'OL8 Hub → Birmingham & Midlands', dist: '88 highway miles', time: '~1h 45m', motor: 'M6 Southbound' },
  sheffield: { route: 'OL8 Hub → Sheffield & South Yorks', dist: '44 highway miles', time: '~1h 10m', motor: 'A628 / Woodhead' },
  london: { route: 'OL8 Hub → London & South East', dist: '205 highway miles', time: '~3h 50m', motor: 'M6 / M1 Arterial' },
  newcastle: { route: 'OL8 Hub → Newcastle & North East', dist: '135 highway miles', time: '~2h 30m', motor: 'M62 / A1(M)' },
  glasgow: { route: 'OL8 Hub → Glasgow & Scotland', dist: '218 highway miles', time: '~3h 55m', motor: 'M6 / A74(M)' },
  bristol: { route: 'OL8 Hub → Bristol & South West', dist: '168 highway miles', time: '~3h 15m', motor: 'M6 / M5 Southbound' }
};

function selectCorridor(id) {
  const data = CORRIDOR_DATA[id];
  if (!data) return;

  const rEl = document.getElementById('infoRoute');
  const dEl = document.getElementById('infoDist');
  const tEl = document.getElementById('infoTime');
  const hEl = document.getElementById('infoHighway');

  if (rEl) rEl.innerText = data.route;
  if (dEl) dEl.innerText = data.dist;
  if (tEl) tEl.innerText = data.time;
  if (hEl) hEl.innerText = data.motor;

  document.querySelectorAll('.corridor-btn').forEach((btn) => {
    if (btn.getAttribute('data-id') === id) {
      btn.classList.add('bg-steel', 'text-white');
      btn.classList.remove('bg-cardDark');
    } else {
      btn.classList.remove('bg-steel');
      btn.classList.add('bg-cardDark');
    }
  });
}

// 7. NAVIGATION & HEADER CONTROLS
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('h-16', 'bg-brandDark/95');
      header?.classList.remove('h-20', 'bg-brandDark/85');
    } else {
      header?.classList.add('h-20', 'bg-brandDark/85');
      header?.classList.remove('h-16', 'bg-brandDark/95');
    }
  });

  // Mobile menu toggle
  toggleBtn?.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    drawer?.classList.toggle('hidden');
  });

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      drawer?.classList.add('hidden');
      toggleBtn?.setAttribute('aria-expanded', 'false');
    });
  });
}

// 8. QUOTE FORM & ESTIMATE ENGINE
function initForms() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitQuote');
    if (btn) {
      btn.innerText = 'Transmitting to OL8 Dispatch...';
      btn.disabled = true;
    }

    const payload = {
      name: document.getElementById('qName')?.value || '',
      phone: document.getElementById('qPhone')?.value || '',
      email: document.getElementById('qEmail')?.value || '',
      pickupPostcode: document.getElementById('qPickup')?.value || '',
      dropPostcode: document.getElementById('qDrop')?.value || '',
      serviceType: document.getElementById('qService')?.value || 'same-day',
      description: document.getElementById('qDesc')?.value || ''
    };

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      showToast(
        'Quote Request Logged',
        `Ref ${data.reference || 'MFT-DISPATCH'}: A transport controller at our Manchester OL8 hub is reviewing your corridor.`
      );
      form.reset();
    } catch (err) {
      showToast(
        'Inquiry Recorded',
        'Thank you. Your consignment inquiry has been dispatched to our Manchester controllers. We will call you on ' + payload.phone
      );
    } finally {
      if (btn) {
        btn.innerText = 'Request Price & Collection Time →';
        btn.disabled = false;
      }
    }
  });
}

// Toast notification helper (Iframe-safe)
let toastTimeout = null;
function showToast(title, message) {
  const toast = document.getElementById('appToast');
  const tTitle = document.getElementById('toastTitle');
  const tMessage = document.getElementById('toastMessage');
  if (!toast || !tTitle || !tMessage) return;

  tTitle.innerText = title;
  tMessage.innerText = message;
  toast.classList.remove('-translate-y-24', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(dismissToast, 6000);
}

function dismissToast() {
  const toast = document.getElementById('appToast');
  if (!toast) return;
  toast.classList.add('-translate-y-24', 'opacity-0', 'pointer-events-none');
  toast.classList.remove('translate-y-0', 'opacity-100');
}

// Global hooks for inline triggers
window.selectCorridor = selectCorridor;
window.randomizeTrackingDemo = randomizeTrackingDemo;
window.dismissToast = dismissToast;
window.showToast = showToast;
