// NOMU — Beyond Hydration Interactive Client Application
// Dribbble Hero Section Replication + Dribbble Expanding Pillar Showcase + Pack Builder

export const FLAVORS = {
  vetiver: {
    id: 'vetiver',
    indexNum: 'I',
    blendRoman: 'Blend I',
    name: 'Vetiver',
    kanjiMark: '根',
    flavorKanji: '香根草',
    mood: 'Ground',
    subtitle: 'Natural Khus Root Infusion',
    positioning: 'Earthy, Cooling & Deeply Grounding',
    tagline: 'Ancient South Indian Khus roots traditionally cold-steeped to dissipate internal heat, anchor the mind, and restore constitutional balance.',
    themeBg: '#D5360C', // Burnt Orange / Terracotta as requested
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/vetiver_isolated.png',
    packshotImage: '/img/bottles/vetiver_packshot.jpg',
    splashImage: '/img/ingredients/vetiver_khus_root.png',
    headline: 'Grounded in the earth.',
    mediaTitle: 'South Indian Khus Harvest',
    mediaDesc: 'Ancient Vetiver roots cold-steeped in micro-batches to extract cooling essential minerals and earthy aromatics.',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/nomu/nomu_bottles_hero_real.jpg',
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
    kanjiMark: '花',
    flavorKanji: '洋甘菊',
    mood: 'Unwind',
    subtitle: 'Blossoms & Soft Lavender',
    positioning: 'Floral, Delicate & Gently Calming',
    tagline: 'Sun-dried German chamomile blossoms delivering apigenin-rich relaxation, settling digestion and quieting evening neural chatter.',
    themeBg: '#8A5404', // Warm Golden Amber / Roasted Honey Steep (WCAG 6.2:1)
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/chamomile_isolated.png',
    packshotImage: '/img/bottles/chamomile_packshot.jpg',
    splashImage: '/img/ingredients/chamomile_lavender_harvest.jpg',
    headline: 'Calm in the chaos.',
    mediaTitle: 'German Blossom Steep',
    mediaDesc: 'Whole sun-dried Roman chamomile flower blossoms steeped gently at room temperature for evening restoration.',
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
    kanjiMark: '果',
    flavorKanji: '葡萄柚',
    mood: 'Uplift',
    subtitle: 'Ruby Peel & Hibiscus',
    positioning: 'Zesty, Vibrant & Naturally Uplifting',
    tagline: 'Cold-extracted ruby grapefruit peel and tart botanical infusions to awaken palate senses, invigorate metabolic alertness, and sparkle.',
    themeBg: '#B51718', // Radiant Signature Crimson (WCAG 6.7:1)
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/grapefruit_isolated.png',
    packshotImage: '/img/bottles/grapefruit_packshot.jpg',
    splashImage: '/img/ingredients/grapefruit_harvest.jpg',
    headline: 'Awaken the senses.',
    mediaTitle: 'Ruby Peel Expression',
    mediaDesc: 'Cold-expressed citrus peel and vibrant hibiscus releasing natural essential limonene oils for morning alertness.',
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
    kanjiMark: '叶',
    flavorKanji: '柠檬草',
    mood: 'Refresh',
    subtitle: 'Nilgiri Stalks & Holy Basil',
    positioning: 'Crisp, Herbal & Naturally Refreshing',
    tagline: 'High-altitude Nilgiri lemongrass distilled with holy basil to deliver sharp focus, cellular hydration, and clean herbal vitality.',
    themeBg: '#32690E', // Fresh Botanical Nilgiri Green (WCAG 6.6:1)
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/lemongrass_isolated.png',
    packshotImage: '/img/bottles/lemongrass_packshot.jpg',
    splashImage: '/img/ingredients/lemongrass_harvest.jpg',
    headline: 'Clarity by design.',
    mediaTitle: 'Nilgiri Mountain Stalks',
    mediaDesc: 'High-altitude Nilgiri lemongrass harvested at morning dew point and distilled with holy basil (Tulsi).',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/ingredients/lemongrass_harvest.jpg',
    ctaText: 'EXPLORE LEMONGRASS →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'Fresh Nilgiri lemongrass stalks',
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
  let accordionActiveIndex = 0; // For Section 2 (The Expanding Pillar Showcase)
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

    // B. Animate Center Bottle Swap with Spring Scale
    const heroBottle = document.getElementById('hero-bottle-img');
    if (heroBottle) {
      heroBottle.classList.add('is-swapping');
      setTimeout(() => {
        heroBottle.src = flavor.bottleImage;
        heroBottle.alt = `NOMU ${flavor.name} Botanical Water Bottle`;
        heroBottle.classList.remove('is-swapping');
      }, 200);
    }

    // C. Animate Right Editorial Column with Staggered Slide-Fade
    const rightCol = document.getElementById('hero-col-right');
    const heroHeadline = document.getElementById('hero-right-title');
    const heroPhoto = document.getElementById('hero-right-thumb');
    const heroNarrative = document.getElementById('hero-right-desc');
    const heroCtaBtn = document.getElementById('hero-cta-btn');

    if (rightCol) {
      rightCol.classList.add('anim-stagger-out');
      setTimeout(() => {
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
      }, 200);
    }

    // D. Update Left Media Window & Captions
    const heroMediaTitle = document.getElementById('hero-media-title');
    const heroMediaDesc = document.getElementById('hero-media-desc');
    const heroVideoPlayer = document.getElementById('hero-video-player');

    if (heroMediaTitle) heroMediaTitle.textContent = flavor.mediaTitle;
    if (heroMediaDesc) heroMediaDesc.textContent = flavor.mediaDesc;
    if (heroVideoPlayer && flavor.mediaPoster) {
      heroVideoPlayer.poster = flavor.mediaPoster;
    }

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

  // Hero Play/Pause Toggle Button
  const heroPlayToggle = document.getElementById('hero-play-toggle');
  const heroVideoPlayer = document.getElementById('hero-video-player');
  if (heroPlayToggle && heroVideoPlayer) {
    heroPlayToggle.addEventListener('click', () => {
      if (heroVideoPlayer.paused) {
        heroVideoPlayer.play();
        heroPlayToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        heroPlayToggle.setAttribute('aria-label', 'Pause video');
      } else {
        heroVideoPlayer.pause();
        heroPlayToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        heroPlayToggle.setAttribute('aria-label', 'Play video');
      }
    });
  }

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
  function setAccordionActive(index) {
    if (index < 0 || index >= FLAVOR_KEYS.length) return;
    accordionActiveIndex = index;

    const pillars = document.querySelectorAll('.accordion-pillar');
    pillars.forEach((pillar, idx) => {
      const isActive = idx === accordionActiveIndex;
      pillar.classList.toggle('is-expanded', isActive);
      pillar.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    const activeKey = FLAVOR_KEYS[accordionActiveIndex];
    syncConfigurator(activeKey);
    syncSensoryLab(activeKey);
  }

  // Bind Accordion Pillars (click & hover)
  document.querySelectorAll('.accordion-pillar').forEach((pillar, idx) => {
    pillar.addEventListener('click', () => {
      setAccordionActive(idx);
    });
    pillar.addEventListener('mouseenter', () => {
      setAccordionActive(idx);
    });
  });

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

    updateOrderSummary();
  }

  // 5. Sensory Tasting Lab Sync
  function syncSensoryLab(flavorKey) {
    const flavor = FLAVORS[flavorKey];
    if (!flavor) return;

    document.querySelectorAll('[data-rail]').forEach(card => {
      card.classList.toggle('is-active', card.dataset.rail === flavorKey);
    });

    const labName = document.getElementById('lab-name');
    const labKanji = document.getElementById('lab-kanji');
    const labTagline = document.getElementById('lab-tagline');
    const noteTop = document.getElementById('note-top');
    const noteHeart = document.getElementById('note-heart');
    const noteBase = document.getElementById('note-base');

    if (labName) labName.textContent = flavor.name;
    if (labKanji) labKanji.textContent = `${flavor.flavorKanji} · ${flavor.kanjiMark}`;
    if (labTagline) labTagline.textContent = flavor.positioning;

    if (noteTop) noteTop.textContent = flavor.tastingNotes.top;
    if (noteHeart) noteHeart.textContent = flavor.tastingNotes.heart;
    if (noteBase) noteBase.textContent = flavor.tastingNotes.base;

    const valCitrus = document.getElementById('val-citrus');
    const barCitrus = document.getElementById('bar-citrus');
    const valSweet = document.getElementById('val-sweetness');
    const barSweet = document.getElementById('bar-sweetness');
    const valEff = document.getElementById('val-effervescence');
    const barEff = document.getElementById('bar-effervescence');
    const valBot = document.getElementById('val-botanical');
    const barBot = document.getElementById('bar-botanical');

    if (valCitrus) valCitrus.textContent = `${flavor.meters.citrus}%`;
    if (barCitrus) barCitrus.style.width = `${flavor.meters.citrus}%`;
    if (valSweet) valSweet.textContent = `${flavor.meters.sweetness}%`;
    if (barSweet) barSweet.style.width = `${flavor.meters.sweetness}%`;
    if (valEff) valEff.textContent = `${flavor.meters.effervescence}%`;
    if (barEff) barEff.style.width = `${flavor.meters.effervescence}%`;
    if (valBot) valBot.textContent = `${flavor.meters.botanical}%`;
    if (barBot) barBot.style.width = `${flavor.meters.botanical}%`;
  }

  // 6. Order Summary Calculator
  function updateOrderSummary() {
    const flavorKey = FLAVOR_KEYS[accordionActiveIndex];
    const flavor = FLAVORS[flavorKey];
    const pack = PACKS[activePackKey] || PACKS.pack3;
    const totalPrice = pack.price * quantity;

    const summaryFlavor = document.getElementById('summary-flavor-name');
    const summaryPack = document.getElementById('summary-pack-name');
    const summaryTotal = document.getElementById('summary-total-price');
    const qtyVal = document.getElementById('cfg-qty-val');

    if (summaryFlavor) summaryFlavor.textContent = flavor.name;
    if (summaryPack) summaryPack.textContent = `${quantity}x ${pack.name}`;
    if (summaryTotal) summaryTotal.textContent = `₹${totalPrice}`;
    if (qtyVal) qtyVal.textContent = quantity;

    const whatsappBtn = document.getElementById('whatsapp-submit-btn');
    if (whatsappBtn) {
      const message = `Hi NOMU, I would like to order: ${quantity}x ${pack.name} of ${flavor.name} (Total: ₹${totalPrice}). Please confirm availability and delivery in Chennai.`;
      whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
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
      updateOrderSummary();
    });
  });

  // Quantity Stepper
  const btnMinus = document.getElementById('btn-qty-minus');
  const btnPlus = document.getElementById('btn-qty-plus');

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        updateOrderSummary();
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      quantity++;
      updateOrderSummary();
    });
  }

  // Sensory Rail Cards
  document.querySelectorAll('[data-rail]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.rail;
      const idx = FLAVOR_KEYS.indexOf(key);
      if (idx !== -1) setAccordionActive(idx);
    });
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') {
      renderHeroFlavor(heroActiveIndex - 1);
    } else if (e.key === 'ArrowRight') {
      renderHeroFlavor(heroActiveIndex + 1);
    }
  });

  // Initialize Hero with Vetiver (0) and Accordion with Vetiver (0)
  renderHeroFlavor(0);
  setAccordionActive(0);
});
