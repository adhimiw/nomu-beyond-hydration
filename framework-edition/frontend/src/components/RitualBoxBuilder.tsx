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
  const [selectedPack, setSelectedPack] = useState<PackKey>('pack3');
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
          <span className="section-badge" data-ui>CUSTOM RITUAL BOX BUILDER</span>
          <h2 className="section-title">BUILD YOUR RITUAL.</h2>
          <p className="section-sub">
            Select multiple herbal blends, configure your custom pack sizes, and order instantly over WhatsApp with local Chennai express dispatch.
          </p>
        </div>

        {/* 1-Click Flight Presets Bar */}
        <div className="builder-presets-bar">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>
            Quick Presets:
          </span>
          <button
            type="button"
            className="preset-pill-btn"
            onClick={() => onApplyPreset('discovery')}
          >
            Discovery Flight (1 of Each · 4 Bottles) · ₹360
          </button>
          <button
            type="button"
            className="preset-pill-btn"
            onClick={() => onApplyPreset('pantry')}
          >
            Pantry Ritual (3 of Each · 12 Bottles) · ₹999
          </button>
          <button
            type="button"
            className="preset-pill-btn btn-reset"
            onClick={() => onApplyPreset('reset')}
          >
            Reset Cart
          </button>
        </div>

        {/* Builder Layout */}
        <div className="builder-layout">
          {/* Left Column: Visual Bottle Packshot Card */}
          <div className="builder-viewport-card" data-ui>
            <div className="viewport-inner">
              <img
                src={activeFlavorData.packshotImage}
                alt={`NOMU ${activeFlavorData.name} Packshot`}
                className="builder-packshot-img"
              />
              <div className="viewport-flavor-badge">
                <strong>{activeFlavorData.name}</strong> · <span>{activeFlavorData.subtitle}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Multi-Cart Step Configurator */}
          <div className="builder-controls-card" data-ui>
            <h3 className="step-title">1. Choose Botanical Blend</h3>
            <div className="pills-selector-grid" data-ui>
              {FLAVOR_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`cfg-flavor-pill ${selectedFlavor === k ? 'is-active' : ''}`}
                  onClick={() => setSelectedFlavor(k)}
                >
                  <span className="pill-roman">{FLAVORS[k].blendRoman}</span>
                  <span className="pill-name">{FLAVORS[k].name}</span>
                </button>
              ))}
            </div>

            <h3 className="step-title">2. Select Pack Tier for this Blend</h3>
            <div className="pills-selector-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '1.25rem' }} data-ui>
              {Object.keys(PACK_TIERS).map((pk) => {
                const tier = PACK_TIERS[pk];
                const isSelected = selectedPack === pk;
                return (
                  <button
                    key={pk}
                    type="button"
                    className={`pack-choice-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setSelectedPack(pk as PackKey)}
                  >
                    <span className="pack-choice-title">{tier.name}</span>
                    <span className="pack-choice-desc">{tier.description}</span>
                    {tier.badge && <span className="pack-choice-badge">{tier.badge}</span>}
                  </button>
                );
              })}
            </div>

            {/* Stepper & Add Action */}
            <div className="add-to-cart-action-row">
              <div className="stepper-group" data-ui>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="stepper-value">{qty}</span>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQty(qty + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-dark-pill"
                onClick={handleAdd}
              >
                <span>+ ADD / UPDATE IN RITUAL BOX</span>
              </button>
            </div>

            {/* Live Cart Ledger */}
            <div className="multi-cart-container" data-ui>
              <div className="multi-cart-header">
                <h4 className="multi-cart-title">Your Custom Ritual Box</h4>
                <span className="multi-cart-badge">{totalBottles} Bottle{totalBottles === 1 ? '' : 's'}</span>
              </div>

              <div className="multi-cart-items">
                {cart.length === 0 ? (
                  <p className="multi-cart-empty-text">Your ritual box is empty. Choose a blend and add it above.</p>
                ) : (
                  cart.map((it) => {
                    const flv = FLAVORS[it.flavorKey];
                    const pck = PACK_TIERS[it.packKey];
                    const subtotal = it.unitPrice * it.quantity;
                    const btls = it.bottlesPerPack * it.quantity;

                    return (
                      <div key={it.id} className="multi-cart-item">
                        <div className="multi-cart-item-info">
                          <span className="multi-cart-item-title">{flv.name}</span>
                          <span className="multi-cart-item-sub">
                            {it.quantity}x {pck.name.split('·')[0].trim()} ({btls} btls)
                          </span>
                        </div>
                        <div className="multi-cart-item-right">
                          <span className="multi-cart-item-price">₹{subtotal}</span>
                          <button
                            type="button"
                            className="multi-cart-remove-btn"
                            onClick={() => onRemoveFromCart(it.id)}
                            aria-label={`Remove ${flv.name}`}
                          >
                            ×
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
                  <strong className="total-val">₹{grandTotal}</strong>
                </div>
                <div className="delivery-col">
                  <span className="delivery-status">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Free Express Chennai Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Trigger Button */}
            <button
              type="button"
              className="btn btn-burnt-orange btn-large btn-block"
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
