// NOMU — Beyond Hydration Interactive Client Application
// Dribbble Hero + Dribbble Expanding Pillar Showcase + Botanical Consultation

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
    themeBg: '#2B2014',
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/vetiver_isolated.png',
    packshotImage: '/img/bottles/vetiver_packshot.jpg',
    splashImage: '/img/ingredients/vetiver_khus_root.png',
    mediaTitle: 'South Indian Khus Harvest',
    mediaDesc: 'Ancient Vetiver roots cold-steeped in micro-batches to extract cooling essential minerals and earthy aromatics.',
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
    themeBg: '#2E1C06',
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/chamomile_isolated.png',
    packshotImage: '/img/bottles/chamomile_packshot.jpg',
    splashImage: '/img/ingredients/chatgpt_hero_visual.webp',
    mediaTitle: 'German Blossom Steep',
    mediaDesc: 'Whole sun-dried Roman chamomile flower blossoms steeped gently at room temperature for evening restoration.',
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
    themeBg: '#380B0E',
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/grapefruit_isolated.png',
    packshotImage: '/img/bottles/grapefruit_packshot.jpg',
    splashImage: '/img/ingredients/lemongrass_grapefruit_herbs.jpg',
    mediaTitle: 'Ruby Peel Expression',
    mediaDesc: 'Cold-expressed citrus peel and vibrant hibiscus releasing natural essential limonene oils for morning alertness.',
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
    themeBg: '#14290B',
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/lemongrass_isolated.png',
    packshotImage: '/img/bottles/lemongrass_packshot.jpg',
    splashImage: '/img/ingredients/lemongrass_grapefruit_herbs.jpg',
    mediaTitle: 'Nilgiri Mountain Stalks',
    mediaDesc: 'High-altitude Nilgiri lemongrass harvested at morning dew point and distilled with holy basil (Tulsi).',
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

  // 1. Hero Section Controller (Dribbble Bottle Stage)
  function renderHeroFlavor(index) {
    if (index < 0) index = FLAVOR_KEYS.length - 1;
    if (index >= FLAVOR_KEYS.length) index = 0;
    heroActiveIndex = index;

    const flavorKey = FLAVOR_KEYS[heroActiveIndex];
    const flavor = FLAVORS[flavorKey];

    // Update Hero Bottle Image
    const heroBottle = document.getElementById('hero-bottle-img');
    if (heroBottle) {
      heroBottle.style.opacity = '0';
      heroBottle.style.transform = 'translateY(12px) scale(0.96)';
      setTimeout(() => {
        heroBottle.src = flavor.bottleImage;
        heroBottle.alt = `NOMU ${flavor.name} Botanical Water Bottle`;
        heroBottle.style.opacity = '1';
        heroBottle.style.transform = 'translateY(0) scale(1)';
      }, 150);
    }

    // Update Hero Media Thumbnail & Texts
    const heroMediaTitle = document.getElementById('hero-media-title');
    const heroMediaDesc = document.getElementById('hero-media-desc');
    const heroCounter = document.getElementById('hero-index-counter');
    const heroProgress = document.getElementById('hero-progress-bar');
    const heroRightTitle = document.getElementById('hero-right-title');
    const heroRightDesc = document.getElementById('hero-right-desc');
    const heroRightThumb = document.getElementById('hero-right-thumb');

    if (heroMediaTitle) heroMediaTitle.textContent = flavor.mediaTitle;
    if (heroMediaDesc) heroMediaDesc.textContent = flavor.mediaDesc;
    if (heroCounter) heroCounter.textContent = `Blend ${heroActiveIndex + 1} of 4`;
    if (heroProgress) heroProgress.style.width = `${((heroActiveIndex + 1) / 4) * 100}%`;
    if (heroRightTitle) heroRightTitle.textContent = `${flavor.name}.`;
    if (heroRightDesc) heroRightDesc.textContent = flavor.positioning;
    if (heroRightThumb) heroRightThumb.src = flavor.splashImage;

    // Update Hero WhatsApp Order Link
    const heroWaBtn = document.getElementById('hero-whatsapp-btn');
    if (heroWaBtn) {
      const msg = `Hi NOMU, I would like to order NOMU ${flavor.name} (Single ₹95 / 3-Pack ₹270 / 12-Pack ₹999).`;
      heroWaBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }

    // Update Hero Category Nav Pills
    document.querySelectorAll('[data-hero-nav]').forEach(pill => {
      const isCur = pill.dataset.heroNav === flavorKey;
      pill.classList.toggle('is-active', isCur);
    });
  }

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

  // 3. Hero Navigation Bindings
  const heroPrev = document.getElementById('hero-nav-prev');
  const heroNext = document.getElementById('hero-nav-next');

  if (heroPrev) {
    heroPrev.addEventListener('click', () => renderHeroFlavor(heroActiveIndex - 1));
  }
  if (heroNext) {
    heroNext.addEventListener('click', () => renderHeroFlavor(heroActiveIndex + 1));
  }

  document.querySelectorAll('[data-hero-nav]').forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.dataset.heroNav;
      const idx = FLAVOR_KEYS.indexOf(key);
      if (idx !== -1) renderHeroFlavor(idx);
    });
  });

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
