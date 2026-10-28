import { NomuCanScene, FLAVORS } from './can3d.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D WebGL Canvas Scene
  let canScene = null;
  try {
    canScene = new NomuCanScene('nomu-3d-canvas');
  } catch (err) {
    console.warn('WebGL initialization fallback:', err);
  }

  // State Management
  let activeFlavorKey = 'lemongrass';
  let activePackKey = 'pack3';
  let quantity = 1;
  let finishMode = 'matte'; // 'matte' (Signature White Ceramic) | 'glass' (Botanical Fluid)
  let isFrost = false;
  let isExploded = false;

  const PACKS = {
    single: { id: 'single', name: 'Single Bottle (330ml)', price: 95, desc: '1x 330ml Glass Bottle' },
    pack3: { id: 'pack3', name: '3-Pack Ritual Box', price: 270, desc: '3x 330ml Bottles (Save 5%)' },
    pack12: { id: 'pack12', name: '12-Pack Pantry Box', price: 999, desc: '12x 330ml Bottles (Free Delivery)' }
  };

  const WHATSAPP_PHONE = '919840000000'; // NOMU Concierge Phone

  // 2. Dynamic WhatsApp URL & Summary Calculation
  function updateOrderSummary() {
    const flavor = FLAVORS[activeFlavorKey] || FLAVORS.lemongrass;
    const pack = PACKS[activePackKey] || PACKS.pack3;
    const totalPrice = pack.price * quantity;

    // Update DOM summary texts
    const summaryFlavor = document.getElementById('summary-flavor-name');
    const summaryPack = document.getElementById('summary-pack-name');
    const summaryTotal = document.getElementById('summary-total-price');
    const qtyVal = document.getElementById('cfg-qty-val');

    if (summaryFlavor) summaryFlavor.textContent = flavor.name;
    if (summaryPack) summaryPack.textContent = `${quantity}x ${pack.name}`;
    if (summaryTotal) summaryTotal.textContent = `₹${totalPrice}`;
    if (qtyVal) qtyVal.textContent = quantity;

    // Update WhatsApp link
    const whatsappBtn = document.getElementById('whatsapp-submit-btn');
    if (whatsappBtn) {
      const message = `Hi NOMU, I would like to order: ${quantity}x ${pack.name} of ${flavor.name} (Total: ₹${totalPrice}). Please confirm availability and delivery to my address.`;
      whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    }
  }

  // 3. Flavor Switching Controller
  function updateFlavor(flavorKey) {
    if (!FLAVORS[flavorKey]) return;
    activeFlavorKey = flavorKey;
    const flavor = FLAVORS[flavorKey];

    // Update body theme attribute
    document.body.setAttribute('data-flavor', flavorKey);

    // Update 3D scene
    if (canScene) {
      canScene.setFlavor(flavorKey);
    }

    // Update Configurator Flavor Buttons
    document.querySelectorAll('[data-cfg-flavor]').forEach(btn => {
      const isCurrent = btn.dataset.cfgFlavor === flavorKey;
      btn.classList.toggle('is-active', isCurrent);
      btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Update Sensory Lab Rail
    document.querySelectorAll('[data-rail]').forEach(card => {
      card.classList.toggle('is-active', card.dataset.rail === flavorKey);
    });

    // Update Tasting Lab Display Card
    const labName = document.getElementById('lab-name');
    const labKanji = document.getElementById('lab-kanji');
    const labTagline = document.getElementById('lab-tagline');
    const noteTop = document.getElementById('note-top');
    const noteHeart = document.getElementById('note-heart');
    const noteBase = document.getElementById('note-base');

    if (labName) labName.textContent = flavor.name;
    if (labKanji) labKanji.textContent = `${flavor.flavorKanji} · ${flavor.kanjiMark}`;
    if (labTagline) labTagline.textContent = flavor.subtitle;

    if (noteTop) noteTop.textContent = flavor.tastingNotes.top;
    if (noteHeart) noteHeart.textContent = flavor.tastingNotes.heart;
    if (noteBase) noteBase.textContent = flavor.tastingNotes.base;

    // Update Sensory Meters
    const meters = flavor.meters;
    const valCitrus = document.getElementById('val-citrus');
    const barCitrus = document.getElementById('bar-citrus');
    const valSweet = document.getElementById('val-sweetness');
    const barSweet = document.getElementById('bar-sweetness');
    const valEff = document.getElementById('val-effervescence');
    const barEff = document.getElementById('bar-effervescence');
    const valBot = document.getElementById('val-botanical');
    const barBot = document.getElementById('bar-botanical');

    if (valCitrus) valCitrus.textContent = `${meters.citrus}%`;
    if (barCitrus) barCitrus.style.width = `${meters.citrus}%`;
    if (valSweet) valSweet.textContent = `${meters.sweetness}%`;
    if (barSweet) barSweet.style.width = `${meters.sweetness}%`;
    if (valEff) valEff.textContent = `${meters.effervescence}%`;
    if (barEff) barEff.style.width = `${meters.effervescence}%`;
    if (valBot) valBot.textContent = `${meters.botanical}%`;
    if (barBot) barBot.style.width = `${meters.botanical}%`;

    updateOrderSummary();
  }

  // 4. Pack Size Controller
  function updatePack(packKey) {
    if (!PACKS[packKey]) return;
    activePackKey = packKey;

    document.querySelectorAll('[data-cfg-pack]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.cfgPack === packKey);
    });

    updateOrderSummary();
  }

  // 5. Finish Mode Controller
  function toggleFinish() {
    finishMode = finishMode === 'matte' ? 'glass' : 'matte';
    if (canScene) {
      canScene.setFinishMode(finishMode);
    }

    const finishLabel = document.getElementById('finish-mode-label');
    if (finishLabel) {
      finishLabel.textContent = finishMode === 'matte' ? 'Matte Finish' : 'Glass Infusion';
    }

    const builderFinish = document.getElementById('builder-finish-toggle');
    if (builderFinish) {
      builderFinish.textContent = finishMode === 'matte' ? 'Matte Ceramic Finish' : 'Botanical Glass Infusion';
    }
  }

  // Bind Configurator Flavor Buttons
  document.querySelectorAll('[data-cfg-flavor]').forEach(btn => {
    btn.addEventListener('click', () => updateFlavor(btn.dataset.cfgFlavor));
  });

  // Bind Pack Buttons
  document.querySelectorAll('[data-cfg-pack]').forEach(btn => {
    btn.addEventListener('click', () => updatePack(btn.dataset.cfgPack));
  });

  // Bind Herb Cards in Section 3 ("Order on WhatsApp" jump)
  document.querySelectorAll('[data-select-flavor]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const flavor = btn.dataset.selectFlavor;
      updateFlavor(flavor);
    });
  });

  // Bind Sensory Lab Rails
  document.querySelectorAll('[data-rail]').forEach(card => {
    card.addEventListener('click', () => updateFlavor(card.dataset.rail));
  });

  // Bind Quantity Steppers
  const minusBtn = document.getElementById('btn-qty-minus');
  const plusBtn = document.getElementById('btn-qty-plus');

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        updateOrderSummary();
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      if (quantity < 50) {
        quantity++;
        updateOrderSummary();
      }
    });
  }

  // 6. 3D HUD Controls
  const btnRotate = document.getElementById('btn-toggle-rotate');
  if (btnRotate && canScene) {
    btnRotate.addEventListener('click', () => {
      const active = canScene.toggleAutoRotate();
      btnRotate.classList.toggle('is-active', active);
    });
  }

  const btnFinish = document.getElementById('btn-toggle-finish');
  if (btnFinish) {
    btnFinish.addEventListener('click', () => toggleFinish());
  }

  const builderFinishToggle = document.getElementById('builder-finish-toggle');
  if (builderFinishToggle) {
    builderFinishToggle.addEventListener('click', () => toggleFinish());
  }

  const btnFrost = document.getElementById('btn-toggle-frost');
  if (btnFrost && canScene) {
    btnFrost.addEventListener('click', () => {
      isFrost = !isFrost;
      btnFrost.classList.toggle('is-active', isFrost);
      if (isFrost && isExploded) {
        isExploded = false;
        document.getElementById('btn-toggle-explode')?.classList.remove('is-active');
      }
      canScene.setViewMode(isFrost ? 'frost' : 'normal');
    });
  }

  const btnExplode = document.getElementById('btn-toggle-explode');
  if (btnExplode && canScene) {
    btnExplode.addEventListener('click', () => {
      isExploded = !isExploded;
      btnExplode.classList.toggle('is-active', isExploded);
      if (isExploded && isFrost) {
        isFrost = false;
        document.getElementById('btn-toggle-frost')?.classList.remove('is-active');
      }
      canScene.setViewMode(isExploded ? 'exploded' : 'normal');
    });
  }

  // Initialize summary on startup
  updateOrderSummary();
});
