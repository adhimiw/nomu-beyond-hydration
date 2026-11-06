import React, { useState } from 'react';
import { CartItem } from '../types';
import { FLAVORS, PACK_TIERS } from '../data/flavors';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  apiBaseUrl?: string;
  whatsappConcierge?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  cart,
  apiBaseUrl = '/api',
  whatsappConcierge = '919840000000'
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const totalBottles = cart.reduce((acc, it) => acc + it.quantity * it.bottlesPerPack, 0);
  const grandTotal = cart.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      total_amount: grandTotal
    };

    // Asynchronously register order in the backend database
    try {
      fetch(`${apiBaseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (err) {}

    // Construct formatted WhatsApp message
    let itemsText = '';
    itemsSummary.forEach((item) => {
      itemsText += `• ${item.quantity}x ${item.pack} — ${item.flavor} (₹${item.price})\n`;
    });

    const notesLine = notes.trim() ? `• Notes: ${notes.trim()}\n` : '';

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
*Order Amount:* ₹${grandTotal}
*Dispatch:* Express Chennai (Same-Day / 24h)

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
            <span>SELECTED RITUAL BOX</span>
            <span className="summary-highlight-tag">{totalBottles} Bottles</span>
          </div>
          <div className="modal-summary-list">
            {cart.map((it) => {
              const flv = FLAVORS[it.flavorKey];
              const pck = PACK_TIERS[it.packKey];
              return (
                <div key={it.id} className="modal-summary-row">
                  <span>{flv.name} ({it.quantity}x {pck.name.split('·')[0].trim()})</span>
                  <strong>₹{it.unitPrice * it.quantity}</strong>
                </div>
              );
            })}
          </div>
          <div className="modal-summary-total">
            <span>Order Total:</span>
            <strong>₹{grandTotal}</strong>
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
            <button type="submit" className="btn btn-burnt-orange btn-large btn-block">
              <span>CONFIRM & OPEN WHATSAPP CHAT</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <p className="modal-guarantee">
              Same-day delivery across Chennai • Zero payment gateway surcharges • Direct concierge dispatch
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
