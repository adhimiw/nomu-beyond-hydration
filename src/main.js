// NOMU — Beyond Hydration Interactive Client Application
// Ingests botanical consultation monograph & Dribbble showcase dynamics

export const FLAVORS = {
  vetiver: {
    id: 'vetiver',
    blendIndex: 'Blend I',
    name: 'Vetiver',
    kanjiMark: '根',
    flavorKanji: '香根草',
    mood: 'Ground',
    subtitle: 'Earthy, Cooling & Deeply Grounding',
    positioning: 'Earthy, Cooling & Deeply Grounding',
    tagline: 'Ancient South Indian Khus roots traditionally cold-steeped to dissipate internal heat, anchor the mind, and restore constitutional balance.',
    primaryColor: '#443826',
    bgColor: '#18140D',
    accentColor: '#D8C7A3',
    bottleImage: '/img/bottles/vetiver_isolated.png',
    packshotImage: '/img/bottles/vetiver_packshot.jpg',
    mediaTitle: 'Khus Root Extraction',
    mediaDesc: 'Ancient South Indian Khus roots traditionally cold-steeped to dissipate internal heat and anchor the mind.',
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
    blendIndex: 'Blend II',
    name: 'German Chamomile',
    kanjiMark: '花',
    flavorKanji: '洋甘菊',
    mood: 'Unwind',
    subtitle: 'Floral, Delicate & Gently Calming',
    positioning: 'Floral, Delicate & Gently Calming',
    tagline: 'Sun-dried German chamomile blossoms delivering apigenin-rich relaxation, settling digestion and quieting evening neural chatter.',
    primaryColor: '#C88A1E',
    bgColor: '#1D1305',
    accentColor: '#F5DC9C',
    bottleImage: '/img/bottles/chamomile_isolated.png',
    packshotImage: '/img/bottles/chamomile_packshot.jpg',
    mediaTitle: 'Blossom Infusion Lab',
    mediaDesc: 'Handpicked German chamomile flowers steeped at room temperature to preserve fragile apigenin calming flavonoids.',
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
    blendIndex: 'Blend III',
    name: 'Grapefruit',
    kanjiMark: '果',
    flavorKanji: '葡萄柚',
    mood: 'Uplift',
    subtitle: 'Zesty, Vibrant & Naturally Uplifting',
    positioning: 'Zesty, Vibrant & Naturally Uplifting',
    tagline: 'Cold-extracted ruby grapefruit peel and tart botanical infusions to awaken palate senses, invigorate metabolic alertness, and sparkle.',
    primaryColor: '#D8262C',
    bgColor: '#1E0608',
    accentColor: '#FFB8B8',
    bottleImage: '/img/bottles/grapefruit_isolated.png',
    packshotImage: '/img/bottles/grapefruit_packshot.jpg',
    mediaTitle: 'Ruby Peel Expression',
    mediaDesc: 'Cold-expressed ruby citrus peel releasing natural essential limonene oils for vibrant morning alertness.',
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
    blendIndex: 'Blend IV',
    name: 'Lemongrass',
    kanjiMark: '叶',
    flavorKanji: '柠檬草',
    mood: 'Refresh',
    subtitle: 'Crisp, Herbal & Naturally Refreshing',
    positioning: 'Crisp, Herbal & Naturally Refreshing',
    tagline: 'High-altitude Nilgiri lemongrass distilled with holy basil to deliver sharp focus, cellular hydration, and clean herbal vitality.',
    primaryColor: '#3E7824',
    bgColor: '#0C1A06',
    accentColor: '#D1E8A9',
    bottleImage: '/img/bottles/lemongrass_isolated.png',
    packshotImage: '/img/bottles/lemongrass_packshot.jpg',
    mediaTitle: 'Nilgiri Stalk Harvest',
    mediaDesc: 'High-altitude Nilgiri mountain lemongrass harvested at morning dew point and brewed within hours.',
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
  single: { id: 'single', name: 'Single Bottle (330ml)', price: 95, desc: '1x 330ml Glass Bottle' },
  pack3: { id: 'pack3', name: '3-Pack Ritual Box', price: 270, desc: '3x 330ml Bottles (Save 5%)' },
  pack12: { id: 'pack12', name: '12-Pack Pantry Box', price: 999, desc: '12x 330ml Bottles (Free Express Delivery)' }
};

const WHATSAPP_PHONE = '919840000000';

document.addEventListener('DOMContentLoaded', () => {
  let activeIndex = 0; // Starts at Vetiver (01)
  let activePackKey = 'pack3';
  let quantity = 1;

  // 1. Dribbble Flavor Showcase Controller
  function renderDribbbleShowcase(index) {
    if (index < 0) index = FLAVOR_KEYS.length - 1;
    if (index >= FLAVOR_KEYS.length) index = 0;
    activeIndex = index;

    const flavorKey = FLAVOR_KEYS[activeIndex];
    const flavor = FLAVORS[flavorKey];

    // Update body theme and showcase data-theme attribute
    document.body.setAttribute('data-flavor', flavorKey);
    const showcaseSection = document.getElementById('flavours');
    if (showcaseSection) {
      showcaseSection.setAttribute('data-theme', flavorKey);
    }

    // Update Category Tabs
    document.querySelectorAll('[data-flavor-tab]').forEach(tab => {
      const isCurrent = tab.dataset.flavorTab === flavorKey;
      tab.classList.toggle('is-active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Update Dots
    document.querySelectorAll('.showcase-dot').forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIndex);
    });

    // Update Center Bottle Image with Subtle Pop
    const bottleImg = document.getElementById('showcase-bottle-img');
    if (bottleImg) {
      bottleImg.style.opacity = '0';
      bottleImg.style.transform = 'translateY(16px) scale(0.96)';
      setTimeout(() => {
        bottleImg.src = flavor.bottleImage;
        bottleImg.alt = `NOMU ${flavor.name} Botanical Water Bottle`;
        bottleImg.style.opacity = '1';
        bottleImg.style.transform = 'translateY(0) scale(1)';
      }, 150);
    }

    // Update Left Media Card
    const mediaTitle = document.getElementById('showcase-media-title');
    const mediaDesc = document.getElementById('showcase-media-desc');
    const badgeText = document.getElementById('showcase-badge-text');

    if (mediaTitle) mediaTitle.textContent = flavor.mediaTitle;
    if (mediaDesc) mediaDesc.textContent = flavor.mediaDesc;
    if (badgeText) badgeText.textContent = `${flavor.name.toUpperCase()} HARVEST`;

    // Update Right Monograph Content
    const blendNum = document.getElementById('showcase-blend-num');
    const moodBadge = document.getElementById('showcase-mood-badge');
    const nameEl = document.getElementById('showcase-name');
    const kanjiEl = document.getElementById('showcase-kanji');
    const posEl = document.getElementById('showcase-positioning');
    const narEl = document.getElementById('showcase-narrative');

    if (blendNum) blendNum.textContent = `HERB BLEND · ${flavor.blendIndex.toUpperCase()}`;
    if (moodBadge) moodBadge.innerHTML = `<span>MOOD: ${flavor.mood.toUpperCase()}</span>`;
    if (nameEl) nameEl.textContent = flavor.name.toUpperCase();
    if (kanjiEl) kanjiEl.textContent = `${flavor.flavorKanji} · ${flavor.kanjiMark}`;
    if (posEl) posEl.textContent = `"${flavor.positioning}"`;
    if (narEl) narEl.textContent = flavor.tagline;

    // Update Aromatic Architecture Notes
    const aromaTop = document.getElementById('showcase-aroma-top');
    const aromaHeart = document.getElementById('showcase-aroma-heart');
    const aromaBase = document.getElementById('showcase-aroma-base');

    if (aromaTop) aromaTop.textContent = flavor.tastingNotes.top;
    if (aromaHeart) aromaHeart.textContent = flavor.tastingNotes.heart;
    if (aromaBase) aromaBase.textContent = flavor.tastingNotes.base;

    // Update Palate Spectrum Meters
    const mCitrusVal = document.getElementById('showcase-meter-citrus-val');
    const mCitrusBar = document.getElementById('showcase-meter-citrus-bar');
    const mSweetVal = document.getElementById('showcase-meter-sweet-val');
    const mSweetBar = document.getElementById('showcase-meter-sweet-bar');
    const mEffVal = document.getElementById('showcase-meter-eff-val');
    const mEffBar = document.getElementById('showcase-meter-eff-bar');
    const mDepthVal = document.getElementById('showcase-meter-depth-val');
    const mDepthBar = document.getElementById('showcase-meter-depth-bar');

    if (mCitrusVal) mCitrusVal.textContent = `${flavor.meters.citrus}%`;
    if (mCitrusBar) mCitrusBar.style.width = `${flavor.meters.citrus}%`;

    if (mSweetVal) mSweetVal.textContent = `${flavor.meters.sweetness}%`;
    if (mSweetBar) mSweetBar.style.width = `${flavor.meters.sweetness}%`;

    if (mEffVal) mEffVal.textContent = `${flavor.meters.effervescence}%`;
    if (mEffBar) mEffBar.style.width = `${flavor.meters.effervescence}%`;

    if (mDepthVal) mDepthVal.textContent = `${flavor.meters.botanical}%`;
    if (mDepthBar) mDepthBar.style.width = `${flavor.meters.botanical}%`;

    // Update Direct WhatsApp Button
    const waBtn = document.getElementById('showcase-whatsapp-btn');
    const waLabel = document.getElementById('showcase-whatsapp-label');
    if (waBtn) {
      const msg = `Hi NOMU, I would like to order NOMU ${flavor.name} (Single ₹95 / 3-Pack ₹270 / 12-Pack ₹999). Please confirm delivery in Chennai.`;
      waBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }
    if (waLabel) {
      waLabel.textContent = `ORDER ${flavor.name.toUpperCase()} ON WHATSAPP`;
    }

    // Synchronize Section 4 & 5
    syncConfigurator(flavorKey);
    syncSensoryLab(flavorKey);
  }

  // 2. Configurator / Pack Builder Sync
  function syncConfigurator(flavorKey) {
    const flavor = FLAVORS[flavorKey];
    if (!flavor) return;

    // Update Configurator Flavor Buttons
    document.querySelectorAll('[data-cfg-flavor]').forEach(btn => {
      const isCurrent = btn.dataset.cfgFlavor === flavorKey;
      btn.classList.toggle('is-active', isCurrent);
      btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Update preview packshot image
    const previewImg = document.getElementById('builder-preview-img');
    if (previewImg) {
      previewImg.src = flavor.packshotImage;
      previewImg.alt = `NOMU ${flavor.name} Bottle Packshot`;
    }

    updateOrderSummary();
  }

  // 3. Sensory Tasting Lab Sync
  function syncSensoryLab(flavorKey) {
    const flavor = FLAVORS[flavorKey];
    if (!flavor) return;

    // Rail cards
    document.querySelectorAll('[data-rail]').forEach(card => {
      card.classList.toggle('is-active', card.dataset.rail === flavorKey);
    });

    // Focus Card
    const labName = document.getElementById('lab-name');
    const labKanji = document.getElementById('lab-kanji');
    const labSerial = document.getElementById('lab-serial');
    const labTagline = document.getElementById('lab-tagline');
    const noteTop = document.getElementById('note-top');
    const noteHeart = document.getElementById('note-heart');
    const noteBase = document.getElementById('note-base');

    if (labName) labName.textContent = flavor.name;
    if (labKanji) labKanji.textContent = `${flavor.flavorKanji} · ${flavor.kanjiMark}`;
    if (labSerial) labSerial.textContent = `HERB BLEND · ${flavor.blendIndex.toUpperCase()}`;
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

  // 4. Order Summary Calculator
  function updateOrderSummary() {
    const flavorKey = FLAVOR_KEYS[activeIndex];
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
      const message = `Hi NOMU, I would like to order: ${quantity}x ${pack.name} of ${flavor.name} (Total: ₹${totalPrice}). Please confirm availability and delivery to my address.`;
      whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    }
  }

  // 5. Event Listeners Setup

  // Category Tabs click
  document.querySelectorAll('[data-flavor-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.flavorTab;
      const index = FLAVOR_KEYS.indexOf(key);
      if (index !== -1) renderDribbbleShowcase(index);
    });
  });

  // Prev / Next arrow buttons
  const prevBtn = document.getElementById('showcase-prev-btn');
  const nextBtn = document.getElementById('showcase-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => renderDribbbleShowcase(activeIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => renderDribbbleShowcase(activeIndex + 1));
  }

  // Pagination Dots click
  document.querySelectorAll('.showcase-dot').forEach((dot, idx) => {
    dot.addEventListener('click', () => renderDribbbleShowcase(idx));
  });

  // Configurator Flavor Pills click
  document.querySelectorAll('[data-cfg-flavor]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.cfgFlavor;
      const index = FLAVOR_KEYS.indexOf(key);
      if (index !== -1) renderDribbbleShowcase(index);
    });
  });

  // Configurator Pack Size click
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

  // Sensory Lab Rail Cards click
  document.querySelectorAll('[data-rail]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.rail;
      const index = FLAVOR_KEYS.indexOf(key);
      if (index !== -1) renderDribbbleShowcase(index);
    });
  });

  // Keyboard navigation for carousel
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') {
      renderDribbbleShowcase(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      renderDribbbleShowcase(activeIndex + 1);
    }
  });

  // Initialize Showcase with Vetiver (Herb Blend 01)
  renderDribbbleShowcase(0);
});
