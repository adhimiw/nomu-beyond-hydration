import React, { useState } from 'react';
import { CartItem, FlavorKey, PackKey, CouponValidationResponse } from '../types';
import { FLAVORS, FLAVOR_KEYS, PACK_TIERS } from '../data/flavors';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onAddToCart?: (item: CartItem) => void;
  apiBaseUrl?: string;
  whatsappConcierge?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onAddToCart,
  apiBaseUrl = '/api',
  whatsappConcierge = '919345214712'
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Influencer & Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResponse | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const totalBottles = cart.reduce((acc, it) => acc + it.quantity * it.bottlesPerPack, 0);
  const grandTotal = cart.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);

  // Dynamic Coupon Discount Math
  let discountAmount = 0;
  let couponEligible = true;
  let couponIneligibleReason = '';

  if (appliedCoupon) {
    if (appliedCoupon.min_order_amount && grandTotal < appliedCoupon.min_order_amount) {
      couponEligible = false;
      couponIneligibleReason = `Minimum order amount of ₹${appliedCoupon.min_order_amount} required for this coupon.`;
    } else if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = Math.round((grandTotal * (appliedCoupon.discount_value || 0)) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.discount_value || 0, grandTotal);
    }
  }

  const finalAmount = Math.max(0, grandTotal - (couponEligible ? discountAmount : 0));

  const handleApplyCoupon = async () => {
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) {
      setCouponFeedback({ type: 'error', message: 'Please enter a coupon code.' });
      return;
    }
    if (cart.length === 0) {
      setCouponFeedback({ type: 'error', message: 'Add items to your cart first.' });
      return;
    }
    setIsValidatingCoupon(true);
    setCouponFeedback(null);
    try {
      const res = await fetch(`${apiBaseUrl}/coupons/validate?code=${encodeURIComponent(trimmed)}&amount=${grandTotal}`);
      const data: CouponValidationResponse = await res.json();
      if (data.valid) {
        setAppliedCoupon(data);
        setCouponFeedback({
          type: 'success',
          message: `Coupon "${data.code}" applied! You save ₹${data.discount_amount} (${data.influencer_name ? 'Referral: ' + data.influencer_name : data.discount_type === 'percentage' ? data.discount_value + '% off' : '₹' + data.discount_value + ' off'})`
        });
      } else {
        setAppliedCoupon(null);
        setCouponFeedback({ type: 'error', message: data.message || 'Invalid or inactive coupon code.' });
      }
    } catch (err) {
      setCouponFeedback({ type: 'error', message: 'Could not validate coupon. Please check connection.' });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponFeedback(null);
  };

  const handleAddPackFromModal = (fKey: FlavorKey, pKey: PackKey) => {
    if (onAddToCart) {
      const pData = PACK_TIERS[pKey];
      onAddToCart({
        id: `${fKey}-${pKey}`,
        flavorKey: fKey,
        packKey: pKey,
        quantity: 1,
        unitPrice: pData.price,
        bottlesPerPack: pData.bottlesCount
      });
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      setErrorMsg('Your ritual cart is empty. Please add at least one botanical pack to proceed.');
      return;
    }

    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setErrorMsg('Please complete all required fields (Name, Phone, Email, Delivery Address).');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg('Please provide a valid 10-digit Indian WhatsApp mobile number (starting with 6-9).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    const orderRef = 'NOMU-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const itemsSummary = cart.map((it) => {
      const flv = FLAVORS[it.flavorKey];
      const pck = PACK_TIERS[it.packKey];
      return {
        flavor: flv.name,
        pack: pck.name,
        quantity: it.quantity,
        bottles: it.bottlesPerPack * it.quantity,
        price: it.unitPrice * it.quantity
      };
    });

    const payload = {
      order_ref: orderRef,
      customer_name: name.trim(),
      customer_phone: cleanPhone,
      customer_email: email.trim(),
      delivery_address: address.trim(),
      notes: notes.trim(),
      items: itemsSummary,
      total_bottles: totalBottles,
      total_amount: finalAmount,
      coupon_code: appliedCoupon && couponEligible ? appliedCoupon.code : undefined,
      discount_amount: appliedCoupon && couponEligible ? discountAmount : 0,
      influencer_name: appliedCoupon && couponEligible ? (appliedCoupon.influencer_name || undefined) : undefined
    };

    // Await order capture in the backend database
    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const resData = await response.json();
        console.log('Backend order captured successfully:', resData);
      } else {
        console.warn('Backend responded with status:', response.status);
      }
    } catch (err) {
      console.warn('Network error recording order in backend:', err);
    } finally {
      setIsSubmitting(false);
    }

    // Construct formatted WhatsApp message
    let itemsText = '';
    itemsSummary.forEach((item) => {
      itemsText += `• ${item.quantity}x ${item.pack} — ${item.flavor} (₹${item.price})\n`;
    });

    const notesLine = notes.trim() ? `• Notes: ${notes.trim()}\n` : '';

    let pricingSection = '';
    if (appliedCoupon && couponEligible && discountAmount > 0) {
      pricingSection = `*Subtotal:* ₹${grandTotal}
*Coupon Applied:* ${appliedCoupon.code} (-₹${discountAmount})
*Influencer Referral:* ${appliedCoupon.influencer_name || 'Nomu Partner'}
*Final Amount Payable:* ₹${finalAmount}`;
    } else {
      pricingSection = `*Order Amount:* ₹${grandTotal}`;
    }

    const waMessage =
`*NOMU BOTANICAL RITUAL ORDER*
Order Ref: ${orderRef}

*Customer Details:*
• Name: ${name.trim()}
• Phone: ${cleanPhone}
• Email: ${email.trim()}
• Address: ${address.trim()}
${notesLine}
*Selected Ritual Box:*
${itemsText}-----------------------------
*Total Bottles:* ${totalBottles} Bottles
${pricingSection}
*Delivery:* Within 10 Days to Your Location

Please confirm my order and share payment link / UPI instructions. Thank you!`;

    const waUrl = `https://wa.me/${whatsappConcierge}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
      <div className="modal-card" data-ui>
        <div className="modal-header">
          <div className="modal-header-copy">
            <span className="modal-badge">DIRECT WHATSAPP DISPATCH</span>
            <h3 id="order-modal-title" className="modal-title">Complete Your Ritual Order</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cart Summary */}
        <div className="modal-order-summary" data-ui>
          <div className="modal-summary-head">
            <span className="modal-summary-title">SELECTED RITUAL BOX</span>
            <div className="modal-summary-tags">
              <span className="summary-highlight-tag">{totalBottles} Bottle{totalBottles === 1 ? '' : 's'}</span>
              {cart.length > 0 && (
                <span className="summary-count-tag">({cart.length} item{cart.length === 1 ? '' : 's'})</span>
              )}
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="modal-empty-cart">
              <p style={{ margin: '0 0 0.75rem', color: '#777', fontSize: '0.875rem' }}>
                Your cart is currently empty. Tap a blend below to add it:
              </p>
              <div className="modal-quick-add-grid">
                {FLAVOR_KEYS.map((fk) => {
                  const flv = FLAVORS[fk];
                  return (
                    <button
                      key={fk}
                      type="button"
                      className="modal-quick-add-chip"
                      onClick={() => handleAddPackFromModal(fk, 'pack4')}
                    >
                      <span className="chip-dot" style={{ background: flv.themeBg }} />
                      <span>+ {flv.name} (4-Pk · ₹160)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="modal-summary-list">
              {cart.map((it) => {
                const flv = FLAVORS[it.flavorKey];
                const pck = PACK_TIERS[it.packKey];
                return (
                  <div key={it.id} className="modal-summary-row">
                    <div className="modal-item-info">
                      <span className="modal-item-dot" style={{ background: flv?.themeBg || '#D01C1D' }} />
                      <div className="modal-item-names">
                        <strong className="modal-item-title">{flv?.name}</strong>
                        <span className="modal-item-pack">{pck?.name.split('·')[0].trim()}</span>
                      </div>
                    </div>

                    <div className="modal-item-controls">
                      {onUpdateQuantity && (
                        <div className="modal-qty-stepper">
                          <button
                            type="button"
                            className="modal-qty-btn"
                            onClick={() => onUpdateQuantity(it.id, -1)}
                            aria-label={`Decrease ${flv?.name}`}
                          >
                            −
                          </button>
                          <span className="modal-qty-val">{it.quantity}</span>
                          <button
                            type="button"
                            className="modal-qty-btn"
                            onClick={() => onUpdateQuantity(it.id, 1)}
                            aria-label={`Increase ${flv?.name}`}
                          >
                            +
                          </button>
                        </div>
                      )}

                      <strong className="modal-item-price">₹{it.unitPrice * it.quantity}</strong>

                      {onRemoveFromCart && (
                        <button
                          type="button"
                          className="modal-remove-item-btn"
                          onClick={() => onRemoveFromCart(it.id)}
                          aria-label={`Remove ${flv?.name}`}
                          title={`Remove ${flv?.name}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Add Other Packs Bar */}
          {cart.length > 0 && (
            <div className="modal-add-more-section">
              <div className="modal-add-more-header">
                <span className="modal-add-more-label">+ ADD OTHER PACKS</span>
              </div>
              <div className="modal-quick-add-grid">
                {FLAVOR_KEYS.map((fk) => {
                  const flv = FLAVORS[fk];
                  return (
                    <button
                      key={fk}
                      type="button"
                      className="modal-quick-add-chip"
                      onClick={() => handleAddPackFromModal(fk, 'pack4')}
                    >
                      <span className="chip-dot" style={{ background: flv.themeBg }} />
                      <span>+ {flv.name} (4-Pk)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Influencer / Promo Coupon Box */}
          {cart.length > 0 && (
            <div className="modal-coupon-section">
              <div className="modal-coupon-row">
                <div className="modal-coupon-input-wrap">
                  <span className="modal-coupon-tag-icon">🏷️</span>
                  <input
                    type="text"
                    className="modal-coupon-input"
                    placeholder="Influencer / Promo Code"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      if (couponFeedback) setCouponFeedback(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    disabled={!!appliedCoupon || isValidatingCoupon}
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    className="btn-coupon-remove"
                    onClick={handleRemoveCoupon}
                    title="Remove coupon"
                  >
                    ✕ Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-coupon-apply"
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim() || isValidatingCoupon}
                  >
                    {isValidatingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                )}
              </div>

              {couponFeedback && (
                <div className={`modal-coupon-feedback ${couponFeedback.type}`}>
                  {couponFeedback.type === 'success' ? '✓ ' : '⚠ '}
                  {couponFeedback.message}
                </div>
              )}

              {appliedCoupon && !couponEligible && (
                <div className="modal-coupon-feedback error">
                  ⚠ {couponIneligibleReason}
                </div>
              )}
            </div>
          )}

          <div className="modal-summary-total">
            <div className="modal-total-labels">
              {appliedCoupon && couponEligible && discountAmount > 0 ? (
                <>
                  <span style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'line-through' }}>
                    Subtotal: ₹{grandTotal}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2E7D32', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>🏷️ {appliedCoupon.code}</span>
                    <span>(-₹{discountAmount})</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Final Amount Payable:</span>
                </>
              ) : (
                <span>Order Total:</span>
              )}
              <small style={{ color: '#2E7D32', fontWeight: 600, display: 'block', fontSize: '0.72rem' }}>
                ✓ Delivered within 10 days to your location
              </small>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ fontSize: '1.2rem', color: appliedCoupon && couponEligible && discountAmount > 0 ? '#D01C1D' : 'inherit' }}>
                ₹{finalAmount}
              </strong>
              {appliedCoupon && couponEligible && discountAmount > 0 && (
                <div style={{ fontSize: '0.72rem', color: '#2E7D32', fontWeight: 600 }}>
                  You save ₹{discountAmount}!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <input type="text" name="_hp_security_check" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customer_name" className="form-label">Full Name *</label>
              <input
                type="text"
                id="customer_name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Adhithan Sundaram"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="customer_phone" className="form-label">WhatsApp Mobile *</label>
              <input
                type="tel"
                id="customer_phone"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number (e.g. 9840012345)"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="customer_email" className="form-label">Email Address *</label>
            <input
              type="email"
              id="customer_email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="delivery_address" className="form-label">Delivery Address in Chennai *</label>
            <textarea
              id="delivery_address"
              className="form-textarea"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat No, Street, Landmark, Area, PIN Code"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="order_notes" className="form-label">Delivery Notes (Optional)</label>
            <input
              type="text"
              id="order_notes"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Leave with security, afternoon delivery preferred"
            />
          </div>

          {errorMsg && (
            <div className="modal-error-alert" role="alert">{errorMsg}</div>
          )}

          <div className="modal-footer" style={{ marginTop: '0.75rem' }}>
            <button
              type="submit"
              className="btn btn-burnt-orange btn-large btn-block"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'SECURING YOUR RITUAL ORDER...' : 'CONFIRM & OPEN WHATSAPP CHAT'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <p className="modal-guarantee">
              Delivered within 10 days to your location • Fresh small-batch dispatch • Direct concierge updates
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
