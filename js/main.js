/**
 * MFT COURIER — MASTER INTERACTION & MOTION CONTROLLER
 * Active Theory Inspired · Zero Fake Data · Pure Operational Function
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCursorSpotlight();
  initMobileNavigation();
  initServiceTabs();
  initWhatsAppQuoteBuilder();
  initGSAPMotion();
  initClipboardButtons();
});

/**
 * 1. HERO CURSOR SPOTLIGHT (Desktop Pointer Devices)
 */
function initHeroCursorSpotlight() {
  const heroSection = document.getElementById('heroSection');
  const revealMask = document.getElementById('heroRevealMask');
  if (!heroSection || !revealMask) return;

  // Respect reduced motion & touch screens
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover)').matches) {
    return;
  }

  let mouseX = -999, mouseY = -999;
  let currentX = -999, currentY = -999;
  let isInside = false;

  heroSection.addEventListener('mouseenter', () => {
    isInside = true;
    revealMask.classList.add('active');
  });

  heroSection.addEventListener('mouseleave', () => {
    isInside = false;
    revealMask.classList.remove('active');
  });

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function renderCursor() {
    if (isInside) {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      revealMask.style.setProperty('--cursor-x', `${currentX}px`);
      revealMask.style.setProperty('--cursor-y', `${currentY}px`);
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

/**
 * 2. ACCESSIBLE MOBILE NAVIGATION DRAWER
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('mobileNavClose');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileDrawer) return;

  function openMenu() {
    mobileDrawer.classList.remove('hidden');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileDrawer.classList.add('hidden');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ESC key closes drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileDrawer.classList.contains('hidden')) {
      closeMenu();
    }
  });
}

/**
 * 3. EDITORIAL SERVICES INTERACTIVE TABS
 */
function initServiceTabs() {
  const serviceTabs = document.querySelectorAll('[data-service-tab]');
  const servicePanels = document.querySelectorAll('[data-service-panel]');
  const servicePhoto = document.getElementById('serviceDisplayPhoto');

  if (!serviceTabs.length) return;

  const photoMap = {
    'same-day': 'assets/images/service_same_day_urgency_1790544913995.jpg',
    'next-day': 'assets/images/service_next_day_scheduled_1790544925795.jpg',
    'dedicated': 'assets/images/service_dedicated_transit_1790543334017.jpg',
    'pallets': 'assets/images/service_pallets_freight_1790543323503.jpg',
    'contract': 'assets/images/journey_highway_motion_1790544939721.jpg'
  };

  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-service-tab');

      // Update Tab Styles
      serviceTabs.forEach(t => {
        if (t === tab) {
          t.classList.add('border-emerald-500', 'bg-emerald-500/10', 'text-white');
          t.classList.remove('border-white/10', 'text-gray-400');
          t.setAttribute('aria-selected', 'true');
        } else {
          t.classList.remove('border-emerald-500', 'bg-emerald-500/10', 'text-white');
          t.classList.add('border-white/10', 'text-gray-400');
          t.setAttribute('aria-selected', 'false');
        }
      });

      // Update Content Panels
      servicePanels.forEach(panel => {
        if (panel.getAttribute('data-service-panel') === targetId) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });

      // Update Featured Service Photo with Smooth Transition
      if (servicePhoto && photoMap[targetId]) {
        servicePhoto.style.opacity = '0.4';
        setTimeout(() => {
          servicePhoto.src = photoMap[targetId];
          servicePhoto.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/**
 * 4. INTERACTIVE WHATSAPP QUOTE GENERATOR
 * Factual, direct, URL-encoded generation for +447501419198
 */
function initWhatsAppQuoteBuilder() {
  const form = document.getElementById('quoteBuilderForm');
  if (!form) return;

  const serviceSelect = document.getElementById('quoteServiceSelect');
  const pickupInput = document.getElementById('quotePickup');
  const deliveryInput = document.getElementById('quoteDelivery');
  const detailsInput = document.getElementById('quoteDetails');
  const generateBtn = document.getElementById('quoteGenerateBtn');
  const previewBox = document.getElementById('quotePreviewBox');
  const previewText = document.getElementById('quotePreviewText');
  const sendWhatsAppBtn = document.getElementById('quoteWhatsAppSendBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const service = serviceSelect ? serviceSelect.value : 'Same-Day Courier';
    const pickup = pickupInput && pickupInput.value.trim() ? pickupInput.value.trim() : 'Greater Manchester (OL8)';
    const delivery = deliveryInput && deliveryInput.value.trim() ? deliveryInput.value.trim() : 'UK Destination';
    const details = detailsInput && detailsInput.value.trim() ? detailsInput.value.trim() : 'Standard consignment';

    const message = `Hello MFT Courier, I would like to request an immediate delivery quotation:
• Service: ${service}
• Collection: ${pickup}
• Destination: ${delivery}
• Consignment Details: ${details}

Please let me know vehicle availability and transit schedule.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/447501419198?text=${encoded}`;

    if (previewText) {
      previewText.textContent = message;
    }

    if (sendWhatsAppBtn) {
      sendWhatsAppBtn.href = whatsappUrl;
    }

    if (previewBox) {
      previewBox.classList.remove('hidden');
      previewBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast('Quote message prepared. Click "Launch WhatsApp" to connect directly with MFT Courier.', 'success');
  });
}

/**
 * 5. GSAP SCROLL & REVEAL ANIMATIONS
 */
function initGSAPMotion() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Stagger reveal on key headings
  gsap.utils.toArray('.reveal-on-scroll').forEach(element => {
    gsap.fromTo(element, 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Stagger reveal on cards/lists
  gsap.utils.toArray('.stagger-group').forEach(group => {
    const children = group.querySelectorAll('.stagger-item');
    if (!children.length) return;

    gsap.fromTo(children,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 82%'
        }
      }
    );
  });
}

/**
 * 6. CLIPBOARD BUTTON HELPER
 */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('[data-copy-target]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy-target');
      if (!targetText) return;
      navigator.clipboard.writeText(targetText).then(() => {
        showToast(`Copied to clipboard: ${targetText}`, 'info');
      }).catch(() => {
        showToast(targetText, 'info');
      });
    });
  });
}

/**
 * 7. ACCESSIBLE TOAST NOTIFICATION COMPONENT
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('mftToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'mftToastContainer';
    container.className = 'fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-[#141C27] border border-white/10 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 transform translate-y-4 opacity-0 transition-all duration-300 font-sans text-xs';
  const iconColor = type === 'success' ? 'text-emerald-400' : 'text-blue-400';
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-bell';

  toast.innerHTML = `
    <i class="fa-solid ${icon} ${iconColor} text-base mt-0.5"></i>
    <div class="flex-1">
      <div class="font-bold text-white mb-0.5 font-mono uppercase tracking-wider text-[11px]">MFT Courier Operations</div>
      <div class="text-gray-300 leading-relaxed">${message}</div>
    </div>
    <button class="text-gray-400 hover:text-white text-base leading-none" aria-label="Close notification" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

window.showToast = showToast;
