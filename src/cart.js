import confetti from 'canvas-confetti';

export class NomuCart {
  constructor() {
    this.items = [];
    this.isOpen = false;
    this.initDrawer();
  }

  initDrawer() {
    this.drawerEl = document.getElementById('cart-drawer');
    this.backdropEl = document.getElementById('cart-backdrop');
    this.countBadges = document.querySelectorAll('.cart-badge');
    this.itemsContainer = document.getElementById('cart-items-list');
    this.subtotalEl = document.getElementById('cart-subtotal-val');
    this.progressFill = document.getElementById('shipping-progress-fill');
    this.progressText = document.getElementById('shipping-progress-text');

    const openBtns = document.querySelectorAll('[data-open-cart]');
    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    }));

    const closeBtn = document.getElementById('close-cart-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (this.backdropEl) this.backdropEl.addEventListener('click', () => this.close());
  }

  open() {
    this.isOpen = true;
    if (this.drawerEl) this.drawerEl.classList.add('is-open');
    if (this.backdropEl) this.backdropEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    if (this.drawerEl) this.drawerEl.classList.remove('is-open');
    if (this.backdropEl) this.backdropEl.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  addItem(product) {
    const existing = this.items.find(i => i.id === product.id && i.flavor === product.flavor);
    if (existing) {
      existing.quantity += (product.quantity || 1);
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        flavor: product.flavor,
        price: product.price,
        size: product.size,
        quantity: product.quantity || 1,
        color: product.color
      });
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#F59E0B', '#E84A3F', '#F472B6']
      });
    } catch (e) {
      // Confetti fallback
    }

    this.render();
    this.open();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.render();
  }

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.removeItem(index);
        return;
      }
    }
    this.render();
  }

  render() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.countBadges.forEach(b => b.textContent = totalCount);

    if (!this.itemsContainer) return;

    if (this.items.length === 0) {
      this.itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg class="empty-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p class="empty-title">Your ritual cart is empty</p>
          <p class="empty-desc">Choose a tasting pack or custom variety case to begin.</p>
        </div>
      `;
      if (this.subtotalEl) this.subtotalEl.textContent = '$0.00';
      if (this.progressFill) this.progressFill.style.width = '0%';
      if (this.progressText) this.progressText.textContent = 'Add $50.00 for Complimentary Carbon-Neutral Shipping';
      return;
    }

    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (this.subtotalEl) this.subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Free shipping threshold ($50)
    const freeShippingThreshold = 50.0;
    const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
    if (this.progressFill) this.progressFill.style.width = `${progressPercent}%`;

    if (progressPercent >= 100) {
      if (this.progressText) this.progressText.innerHTML = '<strong>Unlocked!</strong> Free Carbon-Neutral Shipping Applied';
    } else {
      const remaining = (freeShippingThreshold - subtotal).toFixed(2);
      if (this.progressText) this.progressText.textContent = `Add $${remaining} more for Complimentary Shipping`;
    }

    this.itemsContainer.innerHTML = this.items.map((item, idx) => `
      <div class="cart-item">
        <div class="item-swatch" style="background: ${item.color || '#F59E0B'}"></div>
        <div class="item-info">
          <h4 class="item-name">${item.name}</h4>
          <p class="item-variant">${item.flavor} · ${item.size}</p>
          <div class="item-actions">
            <div class="qty-control">
              <button class="qty-btn" data-action="dec" data-index="${idx}" aria-label="Decrease quantity">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" data-action="inc" data-index="${idx}" aria-label="Increase quantity">+</button>
            </div>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button class="item-remove-btn" data-remove="${idx}" aria-label="Remove item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');

    // Attach item events
    this.itemsContainer.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const index = parseInt(e.target.dataset.index, 10);
        this.updateQuantity(index, action === 'inc' ? 1 : -1);
      });
    });

    this.itemsContainer.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.remove, 10);
        this.removeItem(index);
      });
    });
  }
}
