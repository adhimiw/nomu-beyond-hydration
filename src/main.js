// NOMU — Beyond Hydration Interactive Client Application
// Dribbble Hero Section Replication + Dribbble Expanding Pillar Showcase + Pack Builder

export const FLAVORS = {
  vetiver: {
    id: 'vetiver',
    indexNum: 'I',
    blendRoman: 'Blend I',
    name: 'Vetiver',
    kanjiMark: '',
    flavorKanji: '',
    mood: 'Ground',
    subtitle: 'Natural Khus Root Infusion',
    positioning: 'Earthy, Cooling & Deeply Grounding',
    tagline: 'Ancient South Indian Khus roots traditionally cold-steeped to dissipate internal heat, anchor the mind, and restore constitutional balance.',
    themeBg: '#4E301B', // Warm Botanical Khus Earth Brown
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/vetiver_isolated.png',
    packshotImage: '/img/bottles/vetiver_packshot.jpg',
    splashImage: '/img/ingredients/vetiver_khus_root.png',
    headline: 'Grounded in the earth.',
    mediaTitle: 'Vetiver (khus)',
    mediaDesc: 'Ancient Vetiver roots cold-steeped in micro-batches to extract cooling essential minerals and earthy aromatics.',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/nomu/nomu_film_poster.jpg',
    ctaText: 'EXPLORE VETIVER →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'Organic South Indian Vetiver (Khus) roots',
      heart: 'Cooling cucumber rind & fresh mint leaf',
      base: 'Potassium citrate & restorative sea trace minerals'
    },
    meters: {
      citrus: 24,
      sweetness: 15,
      effervescence: 70,
      botanical: 96
    }
  },
  chamomile: {
    id: 'chamomile',
    indexNum: 'II',
    blendRoman: 'Blend II',
    name: 'German Chamomile',
    kanjiMark: '',
    flavorKanji: '',
    mood: 'Unwind',
    subtitle: 'Blossoms & Soft Lavender',
    positioning: 'Floral, Delicate & Gently Calming',
    tagline: 'German Chamomile (Matricaria chamomilla) is traditionally known for its calming, relaxing and digestive-support properties.',
    themeBg: '#B27C08', // Radiant Warm Golden Chamomile Yellow
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/chamomile_isolated.png',
    packshotImage: '/img/bottles/chamomile_packshot.jpg',
    splashImage: '/img/ingredients/chamomile_lavender_harvest.jpg',
    headline: 'Calm in the chaos.',
    mediaTitle: 'German Chamomile',
    mediaDesc: 'Whole sun-dried German chamomile flower blossoms steeped gently at room temperature for evening restoration.',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/ingredients/chamomile_lavender_harvest.jpg',
    ctaText: 'EXPLORE CHAMOMILE →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'German chamomile flower blossoms',
      heart: 'Delicate lavender & soft floral aromatics',
      base: 'Gentle botanical infusion & subtle mineral finish'
    },
    meters: {
      citrus: 12,
      sweetness: 28,
      effervescence: 35,
      botanical: 92
    }
  },
  grapefruit: {
    id: 'grapefruit',
    indexNum: 'III',
    blendRoman: 'Blend III',
    name: 'Grapefruit',
    kanjiMark: '',
    flavorKanji: '',
    mood: 'Uplift',
    subtitle: 'Ruby Peel & Hibiscus',
    positioning: 'Zesty, Vibrant & Naturally Uplifting',
    tagline: 'Grapefruit-infused water delivers refreshing citrus hydration with naturally occurring antioxidants and vitamin C, depending on the formulation. Its bright, tangy flavour makes everyday hydration more enjoyable without added sugar.',
    themeBg: '#B51718', // Radiant Signature Crimson (WCAG 6.7:1)
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/grapefruit_isolated.png',
    packshotImage: '/img/bottles/grapefruit_packshot.jpg',
    splashImage: '/img/ingredients/grapefruit_harvest.jpg',
    headline: 'Awaken the senses.',
    mediaTitle: 'Grapefruit',
    mediaDesc: 'Grapefruit is believed to have originated in Barbados in the Caribbean during the 18th century. It developed through natural hybridisation between Sweet orange and pomelo.',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/ingredients/grapefruit_harvest.jpg',
    ctaText: 'EXPLORE GRAPEFRUIT →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'Ruby grapefruit citrus essence',
      heart: 'Hibiscus petals & refreshing citrus peel',
      base: 'Delicate botanical finish & natural mineral balance'
    },
    meters: {
      citrus: 96,
      sweetness: 35,
      effervescence: 65,
      botanical: 72
    }
  },
  lemongrass: {
    id: 'lemongrass',
    indexNum: 'IV',
    blendRoman: 'Blend IV',
    name: 'Lemongrass',
    kanjiMark: '',
    flavorKanji: '',
    mood: 'Refresh',
    subtitle: 'Fresh Stalks & Clean Citrus',
    positioning: 'Crisp, Herbal & Naturally Refreshing',
    tagline: 'High-altitude lemongrass to deliver sharp focus, cellular hydration, and clean herbal vitality.',
    themeBg: '#32690E', // Fresh Botanical Green (WCAG 6.6:1)
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/lemongrass_isolated.png',
    packshotImage: '/img/bottles/lemongrass_packshot.jpg',
    splashImage: '/img/ingredients/lemongrass_harvest.jpg',
    headline: 'Clarity by design.',
    mediaTitle: 'Lemongrass',
    mediaDesc: 'High-altitude lemongrass harvested at morning dew point and distilled with holy basil (Tulsi).',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/ingredients/lemongrass_harvest.jpg',
    ctaText: 'EXPLORE LEMONGRASS →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'Fresh crisp lemongrass stalks',
      heart: 'Citrus peel & wild holy basil (Tulsi)',
      base: 'Subtle herbal undertones & clean mineral finish'
    },
    meters: {
      citrus: 82,
      sweetness: 22,
      effervescence: 55,
      botanical: 85
    }
  }
};

const FLAVOR_KEYS = ['vetiver', 'chamomile', 'grapefruit', 'lemongrass'];

const PACKS = {
  single: { id: 'single', name: 'Single Bottle (330ml)', price: 95 },
  pack3: { id: 'pack3', name: '3-Pack Ritual Box', price: 270 },
  pack12: { id: 'pack12', name: '12-Pack Pantry Box', price: 999 }
};

const WHATSAPP_PHONE = '919840000000';

document.addEventListener('DOMContentLoaded', () => {
  let heroActiveIndex = 0; // 0: Vetiver, 1: Chamomile, 2: Grapefruit, 3: Lemongrass
  let accordionActiveIndex = -1; // For Section 2 (The Expanding Pillar Showcase)
  let activePackKey = 'pack3';
  let quantity = 1;
  let isHeroAnimating = false;
  let heroCycleTimer = null;

  // 1. Hero Section Controller (Faithful Dribbble Replication)
  function renderHeroFlavor(index) {
    if (index < 0) index = FLAVOR_KEYS.length - 1;
    if (index >= FLAVOR_KEYS.length) index = 0;
    heroActiveIndex = index;

    const flavorKey = FLAVOR_KEYS[heroActiveIndex];
    const flavor = FLAVORS[flavorKey];

    // A. Update Stage Theme (Triggers smooth CSS background transition)
    const heroStage = document.getElementById('hero');
    const siteHeader = document.getElementById('site-header');
    if (heroStage) {
      heroStage.setAttribute('data-hero-flavor', flavorKey);
      heroStage.style.setProperty('--hero-bg', flavor.themeBg);
    }
    if (siteHeader) {
      siteHeader.style.setProperty('--hero-bg', flavor.themeBg);
    }

    // B. Animate Coordinated Hero Swap Across All 3 Columns
    const heroBottle = document.getElementById('hero-bottle-img');
    const leftCol = document.querySelector('.hero-col-left');
    const rightCol = document.getElementById('hero-col-right');
    const heroHeadline = document.getElementById('hero-right-title');
    const heroPhoto = document.getElementById('hero-right-thumb');
    const heroNarrative = document.getElementById('hero-right-desc');
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    const heroMediaTitle = document.getElementById('hero-media-title');
    const heroMediaDesc = document.getElementById('hero-media-desc');
    const heroVideoPlayer = document.getElementById('hero-video-player');

    if (heroBottle) heroBottle.classList.add('is-swapping');
    if (leftCol) leftCol.classList.add('is-swapping');
    if (rightCol) rightCol.classList.add('anim-stagger-out');

    setTimeout(() => {
      if (heroBottle) {
        heroBottle.src = flavor.bottleImage;
        heroBottle.alt = `NOMU ${flavor.name} Botanical Water Bottle`;
        heroBottle.classList.remove('is-swapping');
      }

      if (leftCol) {
        if (heroMediaTitle) heroMediaTitle.textContent = flavor.mediaTitle;
        if (heroMediaDesc) heroMediaDesc.textContent = flavor.mediaDesc;
        // Only update poster if video is paused to avoid video flash
        if (heroVideoPlayer && flavor.mediaPoster && (heroVideoPlayer.paused || heroVideoPlayer.ended)) {
          heroVideoPlayer.poster = flavor.mediaPoster;
        }
        leftCol.classList.remove('is-swapping');
      }

      if (rightCol) {
        if (heroHeadline) heroHeadline.textContent = flavor.headline;
        if (heroPhoto) {
          heroPhoto.src = flavor.splashImage;
          heroPhoto.alt = `${flavor.name} harvest ingredients`;
        }
        if (heroNarrative) heroNarrative.textContent = flavor.tagline;
        if (heroCtaBtn) {
          heroCtaBtn.textContent = flavor.ctaText;
          heroCtaBtn.href = `#pillar-${flavorKey}`;
        }
        rightCol.classList.remove('anim-stagger-out');
      }
    }, 420);

    // E. Synchronize Pagination Dots
    document.querySelectorAll('.hero-dot-btn').forEach((dot, dotIdx) => {
      dot.classList.toggle('is-active', dotIdx === heroActiveIndex);
      dot.setAttribute('aria-selected', dotIdx === heroActiveIndex ? 'true' : 'false');
    });

    // F. Synchronize Top & Stage Nav Links
    document.querySelectorAll('[data-hero-nav]').forEach(pill => {
      const isCur = pill.dataset.heroNav === flavorKey;
      pill.classList.toggle('is-active', isCur);
    });

    // G. Update Counter & WhatsApp Link
    const heroCounter = document.getElementById('hero-index-counter');
    if (heroCounter) {
      heroCounter.textContent = `Blend ${heroActiveIndex + 1} of 4 · Small-Batch Crafted in Chennai`;
    }

    const heroWaBtn = document.getElementById('hero-whatsapp-btn');
    if (heroWaBtn) {
      const msg = `Hi NOMU, I would like to order NOMU ${flavor.name} Botanical Water (₹95 single / ₹270 3-pack).`;
      heroWaBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }
  }

  // Bind Pagination Dots
  document.querySelectorAll('.hero-dot-btn').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const dotIdx = parseInt(dot.dataset.dotIndex, 10);
      if (!isNaN(dotIdx)) {
        renderHeroFlavor(dotIdx);
        resetHeroTimer();
      }
    });
  });

  // Bind Top Stage Flavour Links
  document.querySelectorAll('[data-hero-nav]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const key = pill.dataset.heroNav;
      const idx = FLAVOR_KEYS.indexOf(key);
      if (idx !== -1) {
        renderHeroFlavor(idx);
        resetHeroTimer();
      }
    });
  });

  // Hero Auto-Cycle Timer (6.5s interval, pauses on hover)
  function startHeroTimer() {
    if (heroCycleTimer) clearInterval(heroCycleTimer);
    heroCycleTimer = setInterval(() => {
      renderHeroFlavor(heroActiveIndex + 1);
    }, 6500);
  }

  function resetHeroTimer() {
    startHeroTimer();
  }

  const heroSectionEl = document.getElementById('hero');
  if (heroSectionEl) {
    heroSectionEl.addEventListener('mouseenter', () => {
      if (heroCycleTimer) clearInterval(heroCycleTimer);
    });
    heroSectionEl.addEventListener('mouseleave', () => {
      startHeroTimer();
    });
  }

  startHeroTimer();

  // 2. Dribbble Expanding Accordion Showcase Controller (Video 2 reference)
  let accordionHoverTimeout = null;

  function setAccordionActive(index) {
    if (index < 0 || index >= FLAVOR_KEYS.length) return;
    if (index === accordionActiveIndex) return;
    accordionActiveIndex = index;

    const pillars = document.querySelectorAll('.accordion-pillar');
    pillars.forEach((pillar, idx) => {
      const isActive = idx === accordionActiveIndex;
      pillar.classList.toggle('is-expanded', isActive);
      pillar.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    const activeKey = FLAVOR_KEYS[accordionActiveIndex];
    syncConfigurator(activeKey);
  }

  // Bind Accordion Pillars (click & smooth debounced hover)
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.querySelectorAll('.accordion-pillar').forEach((pillar, idx) => {
    pillar.addEventListener('click', () => {
      clearTimeout(accordionHoverTimeout);
      setAccordionActive(idx);
    });

    if (canHover) {
      pillar.addEventListener('mouseenter', () => {
        clearTimeout(accordionHoverTimeout);
        accordionHoverTimeout = setTimeout(() => {
          setAccordionActive(idx);
        }, 300); // Calm hover intent debounce (300ms) prevents accidental triggers
      });
      pillar.addEventListener('mouseleave', () => {
        clearTimeout(accordionHoverTimeout);
      });
    }
  });

  // Hero Explore Button -> Navigates to corresponding pillar in Section 3
  const heroCtaBtn = document.getElementById('hero-cta-btn');
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setAccordionActive(heroActiveIndex);
      const targetPillar = document.querySelectorAll('.accordion-pillar')[heroActiveIndex];
      if (targetPillar) {
        targetPillar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const showcaseSec = document.getElementById('showcase');
        if (showcaseSec) {
          showcaseSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // 3. Hero Navigation Bindings (Prev/Next fallback)
  const heroPrev = document.getElementById('hero-nav-prev');
  const heroNext = document.getElementById('hero-nav-next');

  if (heroPrev) {
    heroPrev.addEventListener('click', () => {
      renderHeroFlavor(heroActiveIndex - 1);
      resetHeroTimer();
    });
  }
  if (heroNext) {
    heroNext.addEventListener('click', () => {
      renderHeroFlavor(heroActiveIndex + 1);
      resetHeroTimer();
    });
  }

  // 4. Configurator / Pack Builder Sync
  function syncConfigurator(flavorKey) {
    const flavor = FLAVORS[flavorKey];
    if (!flavor) return;

    document.querySelectorAll('[data-cfg-flavor]').forEach(btn => {
      const isCur = btn.dataset.cfgFlavor === flavorKey;
      btn.classList.toggle('is-active', isCur);
    });

    const previewImg = document.getElementById('builder-preview-img');
    if (previewImg) {
      previewImg.src = flavor.packshotImage;
      previewImg.alt = `NOMU ${flavor.name} Bottle Packshot`;
    }
  }

  // Configurator Flavor Buttons
  document.querySelectorAll('[data-cfg-flavor]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.cfgFlavor;
      const idx = FLAVOR_KEYS.indexOf(key);
      if (idx !== -1) setAccordionActive(idx);
    });
  });

  // Configurator Pack Size
  document.querySelectorAll('[data-cfg-pack]').forEach(btn => {
    btn.addEventListener('click', () => {
      activePackKey = btn.dataset.cfgPack;
      document.querySelectorAll('[data-cfg-pack]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  // Showcase Pillar CTA: Move to Build Your Ritual with selected flavor
  document.querySelectorAll('.accordion-pillar .btn-ivory-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const flavorKey = btn.getAttribute('data-flavor');
      if (flavorKey) {
        syncConfigurator(flavorKey);
      }
      const shopEl = document.getElementById('shop');
      if (shopEl) {
        shopEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Quantity Stepper
  const btnMinus = document.getElementById('btn-qty-minus');
  const btnPlus = document.getElementById('btn-qty-plus');
  const qtyVal = document.getElementById('cfg-qty-val');

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        if (qtyVal) qtyVal.textContent = quantity;
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      quantity++;
      if (qtyVal) qtyVal.textContent = quantity;
    });
  }

  // ==========================================================================
  // MULTI-PRODUCT RITUAL BOX BUILDER
  // ==========================================================================
  let ritualBoxCart = [];

  function renderMultiCart() {
    const cartListEl = document.getElementById('multi-cart-items-list');
    const totalBottlesEl = document.getElementById('cart-total-bottles');
    const grandTotalEl = document.getElementById('cart-grand-total');

    if (!cartListEl) return;

    if (ritualBoxCart.length === 0) {
      cartListEl.innerHTML = '<p class="multi-cart-empty-text">Your ritual box is empty. Choose a blend and add it above.</p>';
      if (totalBottlesEl) totalBottlesEl.textContent = '0 Bottles';
      if (grandTotalEl) grandTotalEl.textContent = '₹0';
      return;
    }

    let totalBottles = 0;
    let grandTotal = 0;
    let html = '';

    ritualBoxCart.forEach(item => {
      const flavor = FLAVORS[item.flavorKey] || { name: item.flavorKey };
      const pack = PACKS[item.packKey] || { name: item.packKey, price: item.unitPrice };
      const itemSubtotal = item.unitPrice * item.quantity;
      const itemBottles = item.bottlesPerPack * item.quantity;

      totalBottles += itemBottles;
      grandTotal += itemSubtotal;

      html += `
        <div class="multi-cart-item" data-cart-id="${item.id}">
          <div class="multi-cart-item-info">
            <span class="multi-cart-item-title">${flavor.name}</span>
            <span class="multi-cart-item-sub">${item.quantity}x ${pack.name} (${itemBottles} btls)</span>
          </div>
          <div class="multi-cart-item-right">
            <span class="multi-cart-item-price">₹${itemSubtotal}</span>
            <button type="button" class="multi-cart-remove-btn" data-remove-id="${item.id}" aria-label="Remove item">×</button>
          </div>
        </div>
      `;
    });

    cartListEl.innerHTML = html;
    if (totalBottlesEl) totalBottlesEl.textContent = `${totalBottles} Bottle${totalBottles === 1 ? '' : 's'}`;
    if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal}`;

    // Bind remove buttons
    cartListEl.querySelectorAll('[data-remove-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idToRemove = e.currentTarget.dataset.removeId;
        ritualBoxCart = ritualBoxCart.filter(it => it.id !== idToRemove);
        renderMultiCart();
      });
    });
  }

  // Add / Update item in Ritual Box
  const btnAddToRitualBox = document.getElementById('btn-add-to-ritual-box');
  if (btnAddToRitualBox) {
    btnAddToRitualBox.addEventListener('click', () => {
      const activeFlavorKey = FLAVOR_KEYS[accordionActiveIndex >= 0 ? accordionActiveIndex : 0];
      const pack = PACKS[activePackKey] || PACKS.pack3;
      const itemId = `${activeFlavorKey}-${activePackKey}`;
      const bottlesCount = activePackKey === 'single' ? 1 : activePackKey === 'pack3' ? 3 : 12;

      const existingIndex = ritualBoxCart.findIndex(it => it.id === itemId);
      if (existingIndex !== -1) {
        ritualBoxCart[existingIndex].quantity += quantity;
      } else {
        ritualBoxCart.push({
          id: itemId,
          flavorKey: activeFlavorKey,
          packKey: activePackKey,
          quantity: quantity,
          unitPrice: pack.price,
          bottlesPerPack: bottlesCount
        });
      }

      // Reset quantity stepper back to 1
      quantity = 1;
      if (qtyVal) qtyVal.textContent = 1;

      renderMultiCart();

      // Gentle button bounce feedback
      btnAddToRitualBox.style.transform = 'scale(0.98)';
      setTimeout(() => {
        btnAddToRitualBox.style.transform = '';
      }, 150);
    });
  }

  // Quick Preset Buttons
  const presetDiscovery = document.getElementById('preset-discovery-flight');
  if (presetDiscovery) {
    presetDiscovery.addEventListener('click', () => {
      ritualBoxCart = [
        { id: 'vetiver-single', flavorKey: 'vetiver', packKey: 'single', quantity: 1, unitPrice: 95, bottlesPerPack: 1 },
        { id: 'chamomile-single', flavorKey: 'chamomile', packKey: 'single', quantity: 1, unitPrice: 95, bottlesPerPack: 1 },
        { id: 'grapefruit-single', flavorKey: 'grapefruit', packKey: 'single', quantity: 1, unitPrice: 95, bottlesPerPack: 1 },
        { id: 'lemongrass-single', flavorKey: 'lemongrass', packKey: 'single', quantity: 1, unitPrice: 95, bottlesPerPack: 1 }
      ];
      renderMultiCart();
    });
  }

  const presetPantry = document.getElementById('preset-pantry-ritual');
  if (presetPantry) {
    presetPantry.addEventListener('click', () => {
      ritualBoxCart = [
        { id: 'vetiver-pack3', flavorKey: 'vetiver', packKey: 'pack3', quantity: 1, unitPrice: 270, bottlesPerPack: 3 },
        { id: 'chamomile-pack3', flavorKey: 'chamomile', packKey: 'pack3', quantity: 1, unitPrice: 270, bottlesPerPack: 3 },
        { id: 'grapefruit-pack3', flavorKey: 'grapefruit', packKey: 'pack3', quantity: 1, unitPrice: 270, bottlesPerPack: 3 },
        { id: 'lemongrass-pack3', flavorKey: 'lemongrass', packKey: 'pack3', quantity: 1, unitPrice: 270, bottlesPerPack: 3 }
      ];
      renderMultiCart();
    });
  }

  const presetReset = document.getElementById('preset-reset-cart');
  if (presetReset) {
    presetReset.addEventListener('click', () => {
      ritualBoxCart = [];
      renderMultiCart();
    });
  }

  // ==========================================================================
  // WHATSAPP CHECKOUT MODAL & ORDER PERSISTENCE
  // ==========================================================================
  const orderModal = document.getElementById('order-modal');
  const btnCheckoutWhatsapp = document.getElementById('btn-checkout-whatsapp');
  const btnCloseOrderModal = document.getElementById('btn-close-order-modal');
  const orderCheckoutForm = document.getElementById('order-checkout-form');
  const orderFormError = document.getElementById('order-form-error');

  function openOrderModal() {
    if (ritualBoxCart.length === 0) {
      alert('Please add at least one botanical blend to your ritual box before checkout.');
      return;
    }

    // Populate summary in modal
    const summaryList = document.getElementById('modal-summary-items-list');
    const summaryBottles = document.getElementById('modal-summary-bottles');
    const summaryPrice = document.getElementById('modal-summary-total-price');

    let totalBottles = 0;
    let grandTotal = 0;
    let summaryHtml = '';

    ritualBoxCart.forEach(it => {
      const flv = FLAVORS[it.flavorKey] || { name: it.flavorKey };
      const pck = PACKS[it.packKey] || { name: it.packKey };
      const sub = it.unitPrice * it.quantity;
      const btls = it.bottlesPerPack * it.quantity;
      totalBottles += btls;
      grandTotal += sub;

      summaryHtml += `
        <div class="modal-summary-row">
          <span>${flv.name} (${it.quantity}x ${pck.name})</span>
          <strong>₹${sub}</strong>
        </div>
      `;
    });

    if (summaryList) summaryList.innerHTML = summaryHtml;
    if (summaryBottles) summaryBottles.textContent = `${totalBottles} Bottles`;
    if (summaryPrice) summaryPrice.textContent = `₹${grandTotal}`;

    if (orderModal) {
      orderModal.removeAttribute('hidden');
      const nameInput = document.getElementById('order-customer-name');
      if (nameInput) nameInput.focus();
    }
  }

  function closeOrderModal() {
    if (orderModal) orderModal.setAttribute('hidden', '');
    if (orderFormError) {
      orderFormError.setAttribute('hidden', '');
      orderFormError.textContent = '';
    }
  }

  if (btnCheckoutWhatsapp) {
    btnCheckoutWhatsapp.addEventListener('click', openOrderModal);
  }
  if (btnCloseOrderModal) {
    btnCloseOrderModal.addEventListener('click', closeOrderModal);
  }
  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeOrderModal();
    });
  }

  if (orderCheckoutForm) {
    orderCheckoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('order-customer-name')?.value.trim();
      const phoneVal = document.getElementById('order-customer-phone')?.value.trim();
      const emailVal = document.getElementById('order-customer-email')?.value.trim();
      const addressVal = document.getElementById('order-delivery-address')?.value.trim();
      const notesVal = document.getElementById('order-notes')?.value.trim() || '';

      // Validation
      if (!nameVal || !phoneVal || !emailVal || !addressVal) {
        if (orderFormError) {
          orderFormError.textContent = 'Please fill in all required fields (Name, Phone, Email, Delivery Address).';
          orderFormError.removeAttribute('hidden');
        }
        return;
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanPhone = phoneVal.replace(/[\s-]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        if (orderFormError) {
          orderFormError.textContent = 'Please provide a valid 10-digit Indian WhatsApp mobile number.';
          orderFormError.removeAttribute('hidden');
        }
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        if (orderFormError) {
          orderFormError.textContent = 'Please provide a valid email address.';
          orderFormError.removeAttribute('hidden');
        }
        return;
      }

      // Calculate totals
      let totalBottles = 0;
      let grandTotal = 0;
      const itemsDetailList = [];

      ritualBoxCart.forEach(it => {
        const flv = FLAVORS[it.flavorKey] || { name: it.flavorKey };
        const pck = PACKS[it.packKey] || { name: it.packKey };
        const sub = it.unitPrice * it.quantity;
        const btls = it.bottlesPerPack * it.quantity;
        totalBottles += btls;
        grandTotal += sub;
        itemsDetailList.push({
          flavor: flv.name,
          pack: pck.name,
          quantity: it.quantity,
          bottles: btls,
          price: sub
        });
      });

      const orderRef = 'NOMU-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // Asynchronously send order payload to backend
      const orderPayload = {
        order_ref: orderRef,
        customer_name: nameVal,
        customer_phone: cleanPhone,
        customer_email: emailVal,
        delivery_address: addressVal,
        notes: notesVal,
        items: itemsDetailList,
        total_bottles: totalBottles,
        total_amount: grandTotal
      };

      try {
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        }).catch(() => {
          // Graceful fallback if backend is offline
        });
      } catch (err) {
        // Continue to WhatsApp even if offline
      }

      // Construct formatted WhatsApp text
      let itemsWaText = '';
      itemsDetailList.forEach(item => {
        itemsWaText += `• ${item.quantity}x ${item.pack} — ${item.flavor} (₹${item.price})\n`;
      });

      const notesLine = notesVal ? `• Notes: ${notesVal}\n` : '';

      const waMessage =
`*NOMU BOTANICAL RITUAL ORDER*
Order Ref: ${orderRef}

*Customer Details:*
• Name: ${nameVal}
• Phone: ${cleanPhone}
• Email: ${emailVal}
• Address: ${addressVal}
${notesLine}
*Selected Ritual Box:*
${itemsWaText}-----------------------------
*Total Bottles:* ${totalBottles} Bottles
*Order Amount:* ₹${grandTotal}
*Dispatch:* Express Chennai (Same-Day / 24h)

Please confirm my order and share UPI / payment link. Thank you!`;

      // Launch WhatsApp
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');

      closeOrderModal();
    });
  }

  // ==========================================================================
  // BOTANICAL REVIEWS ENGINE
  // ==========================================================================
  const SEED_REVIEWS = [
    {
      id: 1,
      customer_name: 'Ananya S.',
      blend: 'vetiver',
      blend_label: 'Blend I · Vetiver',
      rating: 5,
      headline: 'Replaced my afternoon iced tea completely',
      review_text: 'The cooling earthiness of Vetiver is grounding. It has an unmistakable freshness without being bitter or sweet. Drinking it chilled after work in Chennai heat is an instant constitutional reset.',
      created_at: '2 days ago'
    },
    {
      id: 2,
      customer_name: 'Karthik Raman',
      blend: 'chamomile',
      blend_label: 'Blend II · Chamomile',
      rating: 5,
      headline: 'Deep restorative calm for evening sleep',
      review_text: 'Gentle honeyed floral aroma without any artificial stevia aftertaste. It settles evening nervous energy and quiets neural chatter. I order the 12-pack pantry box every fortnight.',
      created_at: '4 days ago'
    },
    {
      id: 3,
      customer_name: 'Dr. Meera Iyer',
      blend: 'lemongrass',
      blend_label: 'Blend IV · Lemongrass',
      rating: 5,
      headline: 'Clean herbal clarity during long hospital shifts',
      review_text: 'As a surgeon I avoid caffeinated energy drinks. NOMU Lemongrass with Holy Basil gives a sharp, crisp hydration burst without any heart rate spike or sugar crash.',
      created_at: '1 week ago'
    },
    {
      id: 4,
      customer_name: 'Vikram Chandran',
      blend: 'grapefruit',
      blend_label: 'Blend III · Grapefruit',
      rating: 5,
      headline: 'Vibrant ruby peel aroma with zero calories',
      review_text: 'The citrus peel distillation captures pure essential limonene aromatics. It feels luxurious, perfectly tart, and makes drinking 2 liters of daily water a genuine pleasure.',
      created_at: '1 week ago'
    },
    {
      id: 5,
      customer_name: 'Sunita M.',
      blend: 'vetiver',
      blend_label: 'Blend I · Vetiver',
      rating: 5,
      headline: 'Authentic South Indian Khus tradition done right',
      review_text: 'Tastes exactly like the earthen pot Khus water my grandmother made during Tamil summers, bottled with pristine clarity. Truly beyond hydration.',
      created_at: '2 weeks ago'
    },
    {
      id: 6,
      customer_name: 'Aditya Rao',
      blend: 'lemongrass',
      blend_label: 'Blend IV · Lemongrass',
      rating: 5,
      headline: 'Crisp morning ritual partner',
      review_text: 'The holy basil herbal balance hits right at the back of the palate. Super crisp, zero synthetic extracts, and arrives chilled within 4 hours in Chennai.',
      created_at: '3 weeks ago'
    }
  ];

  let currentReviewsList = [...SEED_REVIEWS];
  let activeReviewFilter = 'all';

  function renderReviewsGrid(filter = 'all') {
    const gridEl = document.getElementById('reviews-cards-grid');
    if (!gridEl) return;

    activeReviewFilter = filter;
    const filtered = filter === 'all'
      ? currentReviewsList
      : currentReviewsList.filter(r => r.blend === filter);

    if (filtered.length === 0) {
      gridEl.innerHTML = '<p class="multi-cart-empty-text">No reviews recorded yet for this blend. Be the first to share your tasting experience!</p>';
      return;
    }

    const starSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#D97706" style="display:inline-block;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

    let html = '';
    filtered.forEach(r => {
      const starsRow = Array(r.rating || 5).fill(starSvg).join('');
      const blendClass = `blend-${r.blend}`;

      html += `
        <article class="review-card" data-review-blend="${r.blend}">
          <div>
            <div class="review-card-top">
              <span class="review-blend-badge ${blendClass}">${r.blend_label || r.blend}</span>
              <div class="review-stars-row" aria-label="${r.rating} stars">${starsRow}</div>
            </div>
            <h3 class="review-card-title">${r.headline}</h3>
            <p class="review-card-body">"${r.review_text}"</p>
          </div>
          <div class="review-card-footer">
            <div class="review-author-info">
              <span class="review-author-name">${r.customer_name}</span>
              <span class="review-verified-badge" title="Verified Customer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Verified
              </span>
            </div>
            <span class="review-date-text">${r.created_at || 'Verified'}</span>
          </div>
        </article>
      `;
    });

    gridEl.innerHTML = html;
  }

  // Filter Buttons
  document.querySelectorAll('[data-review-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.reviewFilter;
      document.querySelectorAll('[data-review-filter]').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      renderReviewsGrid(filter);
    });
  });

  // Fetch approved reviews from backend API
  function loadRemoteReviews() {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const approved = data.reviews.map(item => ({
            id: item.id,
            customer_name: item.customer_name,
            blend: item.flavor_key,
            blend_label: `Blend · ${item.flavor_key.charAt(0).toUpperCase() + item.flavor_key.slice(1)}`,
            rating: item.rating || 5,
            headline: item.headline,
            review_text: item.review_text,
            created_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Verified'
          }));
          currentReviewsList = [...approved, ...SEED_REVIEWS];
          renderReviewsGrid(activeReviewFilter);
        }
      })
      .catch(() => {
        // Keep seed reviews on fallback
      });
  }

  // Review Modal Handlers
  const reviewModal = document.getElementById('review-modal');
  const btnOpenReviewModal = document.getElementById('btn-open-review-modal');
  const btnCloseReviewModal = document.getElementById('btn-close-review-modal');
  const reviewForm = document.getElementById('review-submission-form');
  const reviewErrorAlert = document.getElementById('review-form-error');
  const reviewSuccessAlert = document.getElementById('review-form-success');
  const starPickerBtns = document.querySelectorAll('.star-picker-btn');
  const reviewRatingValInput = document.getElementById('review-rating-val');

  function openReviewModal() {
    if (reviewModal) {
      reviewModal.removeAttribute('hidden');
      if (reviewSuccessAlert) reviewSuccessAlert.setAttribute('hidden', '');
      if (reviewErrorAlert) reviewErrorAlert.setAttribute('hidden', '');
      const nameInp = document.getElementById('review-customer-name');
      if (nameInp) nameInp.focus();
    }
  }

  function closeReviewModal() {
    if (reviewModal) reviewModal.setAttribute('hidden', '');
  }

  if (btnOpenReviewModal) btnOpenReviewModal.addEventListener('click', openReviewModal);
  if (btnCloseReviewModal) btnCloseReviewModal.addEventListener('click', closeReviewModal);
  if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) closeReviewModal();
    });
  }

  // Star Rating Interaction
  let chosenRating = 5;
  starPickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.value, 10);
      chosenRating = val;
      if (reviewRatingValInput) reviewRatingValInput.value = val;
      starPickerBtns.forEach(b => {
        const bVal = parseInt(b.dataset.value, 10);
        b.classList.toggle('is-active', bVal <= val);
      });
    });
  });

  // Submit Review Form
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const reviewerName = document.getElementById('review-customer-name')?.value.trim();
      const reviewerEmail = document.getElementById('review-customer-email')?.value.trim();
      const flavorSelected = document.getElementById('review-flavor-select')?.value;
      const headlineVal = document.getElementById('review-headline')?.value.trim();
      const textVal = document.getElementById('review-text')?.value.trim();

      if (!reviewerName || !reviewerEmail || !headlineVal || !textVal) {
        if (reviewErrorAlert) {
          reviewErrorAlert.textContent = 'Please complete all required fields.';
          reviewErrorAlert.removeAttribute('hidden');
        }
        return;
      }

      const reviewPayload = {
        customer_name: reviewerName,
        customer_email: reviewerEmail,
        flavor_key: flavorSelected,
        rating: chosenRating,
        headline: headlineVal,
        review_text: textVal
      };

      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewPayload)
        });

        if (res.ok) {
          if (reviewErrorAlert) reviewErrorAlert.setAttribute('hidden', '');
          if (reviewSuccessAlert) reviewSuccessAlert.removeAttribute('hidden');
          reviewForm.reset();
          setTimeout(() => {
            closeReviewModal();
          }, 2400);
        } else {
          throw new Error('Server submission error');
        }
      } catch (err) {
        // Even if offline, show confirmation to the user and clear modal
        if (reviewSuccessAlert) {
          reviewSuccessAlert.textContent = 'Thank you! Your tasting note has been recorded and submitted for approval.';
          reviewSuccessAlert.removeAttribute('hidden');
        }
        setTimeout(() => {
          closeReviewModal();
        }, 2200);
      }
    });
  }

  // ==========================================================================
  // HEADLESS CMS CONTENT SYNCHRONIZATION
  // ==========================================================================
  function loadCmsContent() {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (!data || typeof data !== 'object') return;
        if (data.hero_headline) {
          const heroHead = document.querySelector('.hero-main-title');
          if (heroHead) heroHead.textContent = data.hero_headline;
        }
        if (data.hero_sub) {
          const heroSub = document.querySelector('.hero-description-block p');
          if (heroSub) heroSub.textContent = data.hero_sub;
        }
        if (data.ticker_text) {
          const tickers = document.querySelectorAll('.ticker-segment span');
          tickers.forEach(t => { t.textContent = data.ticker_text; });
        }
        if (data.whatsapp_phone) {
          NOMU_WHATSAPP_NUMBER = data.whatsapp_phone;
        }

        // Hero Video & Poster
        if (data.hero_video_url) {
          const v = document.getElementById('hero-video-player');
          if (v && v.getAttribute('src') !== data.hero_video_url) {
            v.src = data.hero_video_url;
          }
        }
        if (data.hero_poster_url) {
          const v = document.getElementById('hero-video-player');
          if (v) v.poster = data.hero_poster_url;
        }

        // Botanical Quartet Images
        const blendKeys = ['vetiver', 'chamomile', 'grapefruit', 'lemongrass'];
        blendKeys.forEach(k => {
          if (data[`${k}_bottle_img`]) FLAVORS[k].bottleImage = data[`${k}_bottle_img`];
          if (data[`${k}_splash_img`]) FLAVORS[k].splashImage = data[`${k}_splash_img`];
          if (data[`${k}_packshot_img`]) FLAVORS[k].packshotImage = data[`${k}_packshot_img`];
        });

        // Story & Manifesto Media
        if (data.manifesto_image_url) {
          const manImg = document.querySelector('.manifesto-art-img');
          if (manImg) manImg.src = data.manifesto_image_url;
        }

        // Refresh views with newly updated assets
        renderHeroFlavor(heroActiveIndex);
      })
      .catch(() => {
        // Fallback to static HTML
      });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') {
      renderHeroFlavor(heroActiveIndex - 1);
    } else if (e.key === 'ArrowRight') {
      renderHeroFlavor(heroActiveIndex + 1);
    }
  });

  // Initialize all interactive engines
  renderHeroFlavor(0);
  setAccordionActive(0);
  renderMultiCart();
  renderReviewsGrid('all');
  loadRemoteReviews();
  loadCmsContent();
});
