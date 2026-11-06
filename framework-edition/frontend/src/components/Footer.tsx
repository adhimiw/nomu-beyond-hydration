import React from 'react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <div className="brand-logo-badge" style={{ width: '28px', height: '28px' }}>
              <img src="/img/nomu/nomu_logo_clean.png" alt="NOMU Logo" width="20" height="20" />
            </div>
            <img src="/img/nomu/nomu_wordmark_transparent.png" alt="NOMU" height="18" />
          </div>
          <p className="footer-mission" style={{ marginTop: '0.85rem' }}>
            Beyond Hydration. Clean herb-infused water crafted as a daily wellness ritual. Four herbs, zero nonsense.
          </p>
          <p className="footer-sustainability">
            100% recyclable glass bottles with aluminum seal caps. Small-batch crafted in Chennai, India.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Flavours</h4>
          <ul className="footer-links">
            <li><a href="#showcase">Vetiver (Khus Root)</a></li>
            <li><a href="#showcase">German Chamomile</a></li>
            <li><a href="#showcase">Grapefruit (Ruby Peel)</a></li>
            <li><a href="#showcase">Lemongrass (Nilgiri)</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><a href="#about">About</a></li>
            <li><a href="#showcase">Flavours</a></li>
            <li><a href="#shop">Shop on WhatsApp</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#contact">Contact</a></li>
            {onOpenAdmin && (
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: 'inherit',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Admin Login</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Small-Batch Dispatch</h4>
          <p className="footer-address">
            Crafted fresh in Chennai.<br />
            Express local deliveries.<br />
            Concierge: +91 98400 00000
          </p>
          <span className="footer-copyright">© 2026 NOMU BEVERAGES PRIVATE LIMITED. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
