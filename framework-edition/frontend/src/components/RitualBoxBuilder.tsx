import React, { useState } from 'react';
import { FLAVORS, FLAVOR_KEYS, PACK_TIERS } from '../data/flavors';
import { CartItem, FlavorKey, PackKey } from '../types';

interface RitualBoxBuilderProps {
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onApplyPreset: (preset: 'discovery' | 'pantry' | 'reset') => void;
  onOpenCheckout: () => void;
}

export const RitualBoxBuilder: React.FC<RitualBoxBuilderProps> = ({
  cart,
  onAddToCart,
  onRemoveFromCart,
  onApplyPreset,
  onOpenCheckout
}) => {
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorKey>('vetiver');
  const [selectedPack, setSelectedPack] = useState<PackKey>('pack4');
  const [qty, setQty] = useState<number>(1);

  const activeFlavorData = FLAVORS[selectedFlavor];
  const activePackData = PACK_TIERS[selectedPack];

  const handleAdd = () => {
    const itemId = `${selectedFlavor}-${selectedPack}`;
    onAddToCart({
      id: itemId,
      flavorKey: selectedFlavor,
      packKey: selectedPack,
      quantity: qty,
      unitPrice: activePackData.price,
      bottlesPerPack: activePackData.bottlesCount
    });
    setQty(1);
  };

  const totalBottles = cart.reduce((acc, it) => acc + it.quantity * it.bottlesPerPack, 0);
  const grandTotal = cart.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);

  return (
    <section id="shop" className="builder-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">BUILD YOUR RITUAL.</h2>
          <p className="section-sub">
            Select multiple herbal blends, configure your custom pack sizes, and order directly over WhatsApp.
          </p>
        </div>

        {/* Quick Bundle Presets */}
        <div className="builder-presets-bar">
          <span className="preset-label">Quick Ritual Bundles:</span>
          <div className="preset-buttons-group">
            <button
              type="button"
              className="preset-pill-btn"
              id="preset-discovery"
              onClick={() => onApplyPreset('discovery')}
            >
              <span>Discovery Flight (1 of Each Blend · 4 Bottles) · ₹160</span>
            </button>
            <button
              type="button"
              className="preset-pill-btn is-popular"
              id="preset-pantry"
              onClick={() => onApplyPreset('pantry')}
            >
              <span className="badge-mini">FREE SHIPPING</span>
              <span>Pantry Ritual (3 of Each Blend · 12 Bottles) · ₹480</span>
            </button>
            <button
              type="button"
              className="preset-pill-btn"
              id="preset-clear"
              onClick={() => onApplyPreset('reset')}
            >
              <span>Reset Cart</span>
            </button>
          </div>
        </div>

        <div className="builder-layout">
          {/* Left: Studio Stage with Packshot */}
          <div className="builder-viewport-card">
            <div className="builder-3d-stage" id="builder-3d-box">
              <img
                src={activeFlavorData.packshotImage}
                alt={`Selected NOMU ${activeFlavorData.name} Preview`}
                id="builder-preview-img"
                className="builder-bottle-preview"
                width={320}
                height={480}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="builder-finish-selector">
              <span className="builder-craft-badge">100% Whole Herb Infusion · Small-Batch India</span>
            </div>
          </div>

          {/* Right: Configurator Controls */}
          <div className="builder-config-card">
            <h3 className="step-title">1. Choose blend to customize</h3>
            <div className="pills-selector-grid" role="tablist" aria-label="Select Flavour" data-ui>
              {FLAVOR_KEYS.map((k) => {
                const item = FLAVORS[k];
                const isSelected = selectedFlavor === k;
                return (
                  <button
                    key={k}
                    type="button"
                    className={`choice-pill-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setSelectedFlavor(k)}
                    role="tab"
                    aria-selected={isSelected}
                  >
                    <span className="tab-dot" style={{ background: item.themeBg }} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <h3 className="step-title">2. Select pack tier for this blend</h3>
            <div className="pills-selector-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '1.25rem' }} data-ui>
              <button
                type="button"
                className={`pack-choice-btn ${selectedPack === 'single' ? 'is-active' : ''}`}
                onClick={() => setSelectedPack('single')}
              >
                <span className="pack-choice-title">SINGLE BOTTLE · ₹40</span>
                <span className="pack-choice-desc">1x 500ml Glass Bottle · Perfect discovery trial</span>
              </button>
              <button
                type="button"
                className={`pack-choice-btn ${selectedPack === 'pack4' || selectedPack === 'pack3' ? 'is-active' : ''}`}
                onClick={() => setSelectedPack('pack4')}
              >
                <span className="pack-choice-title">4-PACK RITUAL BOX · ₹160</span>
                <span className="pack-choice-desc">4x 500ml Glass Bottles · 4-day daily wellness routine</span>
                <span className="pack-choice-badge">POPULAR</span>
              </button>
              <button
                type="button"
                className={`pack-choice-btn ${selectedPack === 'pack12' ? 'is-active' : ''}`}
                onClick={() => setSelectedPack('pack12')}
              >
                <span className="pack-choice-title">12-PACK PANTRY BOX · ₹480</span>
                <span className="pack-choice-desc">12x 500ml Glass Bottles · Sustained daily ritual</span>
                <span className="pack-choice-badge">FREE EXPRESS SHIPPING</span>
              </button>
            </div>

            <div className="add-to-cart-action-row">
              <div className="stepper-group" data-ui>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="stepper-value" id="cfg-qty-val">{qty}</span>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn btn-dark-pill"
                id="btn-add-to-ritual-box"
                onClick={handleAdd}
              >
                <span>+ ADD / UPDATE IN RITUAL BOX</span>
              </button>
            </div>

            {/* Multi-Product Ritual Box Cart */}
            <div className="multi-cart-container" data-ui>
              <div className="multi-cart-header">
                <h4 className="multi-cart-title">Your Custom Ritual Box</h4>
                <span className="multi-cart-badge" id="cart-total-bottles">
                  {totalBottles} Bottle{totalBottles === 1 ? '' : 's'}
                </span>
              </div>
              <div className="multi-cart-items" id="multi-cart-items-list">
                {cart.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#888', fontSize: '0.875rem' }}>
                    Your ritual box is empty. Choose a blend and click Add above.
                  </div>
                ) : (
                  cart.map((item) => {
                    const flv = FLAVORS[item.flavorKey];
                    const pack = PACK_TIERS[item.packKey];
                    return (
                      <div key={item.id} className="cart-item-row">
                        <div className="cart-item-info">
                          <strong>{flv?.name}</strong>
                          <span style={{ color: '#666', fontSize: '0.8125rem' }}>
                            {' '}· {pack?.name} (×{item.quantity})
                          </span>
                        </div>
                        <div className="cart-item-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--soft-black)' }}>
                            ₹{item.quantity * item.unitPrice}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveFromCart(item.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--nomu-red)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                            aria-label={`Remove ${flv?.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="multi-cart-total-bar">
                <div className="total-col">
                  <span className="total-lbl">Estimated Total</span>
                  <strong className="total-val" id="cart-grand-total">₹{grandTotal}</strong>
                </div>
                <div className="delivery-col">
                  <span className="delivery-status" id="cart-delivery-status">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Free Express Chennai Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Checkout CTA Button */}
            <button
              type="button"
              className="btn btn-burnt-orange btn-large btn-block"
              id="btn-checkout-whatsapp"
              onClick={onOpenCheckout}
            >
              <span>ENTER DETAILS & ORDER ON WHATSAPP</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
