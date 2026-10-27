import { NomuCanScene, FLAVORS } from './can3d.js';
import { NomuCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D WebGL Canvas Scene
  let canScene = null;
  try {
    canScene = new NomuCanScene('nomu-3d-canvas');
  } catch (err) {
    console.warn('WebGL initialization fallback:', err);
  }

  // 2. Initialize Cart Drawer
  const cart = new NomuCart();

  let activeFlavorKey = 'yuzu';
  let isFrost = false;
  let isExploded = false;

  // 3. Flavor Switching Logic
  function updateFlavor(flavorKey) {
    if (!FLAVORS[flavorKey]) return;
    activeFlavorKey = flavorKey;
    const flavor = FLAVORS[flavorKey];

    // Update body theme attribute
    document.body.setAttribute('data-flavor', flavorKey);

    // Update 3D model
    if (canScene) {
      canScene.setFlavor(flavorKey);
    }

    // Update Hero UI
    const heroPill = document.getElementById('hero-flavor-pill');
    if (heroPill) {
      heroPill.textContent = `${flavorKey === 'yuzu' ? 'BLEND I' : flavorKey === 'peach' ? 'BLEND II' : 'BLEND III'} · ${flavor.name.toUpperCase()}`;
    }

    // Update active tab buttons
    document.querySelectorAll('[data-flavor-btn]').forEach(btn => {
      const isCurrent = btn.dataset.flavorBtn === flavorKey;
      btn.classList.toggle('is-active', isCurrent);
      btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    document.querySelectorAll('[data-rail]').forEach(card => {
      card.classList.toggle('is-active', card.dataset.rail === flavorKey);
    });

    // Update Tasting Lab Card
    const labSerial = document.getElementById('lab-serial');
    const labName = document.getElementById('lab-name');
    const labKanji = document.getElementById('lab-kanji');
    const labTagline = document.getElementById('lab-tagline');
    const noteTop = document.getElementById('note-top');
    const noteHeart = document.getElementById('note-heart');
    const noteBase = document.getElementById('note-base');

    if (labSerial) labSerial.textContent = `HARVEST ${flavorKey === 'yuzu' ? 'I' : flavorKey === 'peach' ? 'II' : 'III'}`;
    if (labName) labName.textContent = flavor.name;
    if (labKanji) labKanji.textContent = flavor.kanji;
    if (labTagline) labTagline.textContent = flavor.tagline;

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
  }

  // Bind Flavor Buttons
  document.querySelectorAll('[data-flavor-btn]').forEach(btn => {
    btn.addEventListener('click', () => updateFlavor(btn.dataset.flavorBtn));
  });

  document.querySelectorAll('[data-rail]').forEach(card => {
    card.addEventListener('click', () => updateFlavor(card.dataset.rail));
  });

  // 4. 3D HUD Controls
  const btnRotate = document.getElementById('btn-toggle-rotate');
  if (btnRotate && canScene) {
    btnRotate.addEventListener('click', () => {
      const active = canScene.toggleAutoRotate();
      btnRotate.classList.toggle('is-active', active);
    });
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

  // 5. E-Commerce Purchases & Add to Cart
  const quickAddBtn = document.getElementById('quick-add-btn');
  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      const flavor = FLAVORS[activeFlavorKey];
      cart.addItem({
        id: `nomu-12-${flavor.id}`,
        name: 'NOMU 12-Bottle Discovery Flight',
        flavor: flavor.name,
        price: 36.00,
        size: '12 x 330ml Glass Bottles',
        quantity: 1,
        color: flavor.primaryColor
      });
    });
  }

  const labAddBtn = document.getElementById('lab-add-cart-btn');
  if (labAddBtn) {
    labAddBtn.addEventListener('click', () => {
      const flavor = FLAVORS[activeFlavorKey];
      cart.addItem({
        id: `nomu-6-${flavor.id}`,
        name: `NOMU Single Blend Flight`,
        flavor: flavor.name,
        price: 24.00,
        size: '6 x 330ml Glass Bottles',
        quantity: 1,
        color: flavor.primaryColor
      });
    });
  }

  // Pack Configurator Buttons
  document.querySelectorAll('[data-pack-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const packType = btn.dataset.packAdd;
      const price = parseFloat(btn.dataset.price);
      const flavor = FLAVORS[activeFlavorKey];

      cart.addItem({
        id: `nomu-pack-${packType}`,
        name: packType === '24' ? 'NOMU 24-Bottle Daily Ritual Case' : 'NOMU 12-Bottle Discovery Flight',
        flavor: packType === '24' ? 'Triple Blend Spectrum (8x each)' : `4x ${flavor.name} + 8x Variety`,
        price: price,
        size: `${packType} x 330ml Glass Bottles`,
        quantity: 1,
        color: flavor.primaryColor
      });
    });
  });

  // Simulated Checkout
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Thank you for choosing NOMU! Proceeding to encrypted Stripe checkout with carbon-neutral delivery.');
      cart.close();
    });
  }
});
