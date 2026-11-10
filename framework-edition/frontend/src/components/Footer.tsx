import React from 'react';

interface FooterProps {
  siteLogo?: string;
}

export const Footer: React.FC<FooterProps> = ({ siteLogo = '/img/nomu/nomu_symbol_master.png' }) => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <a href="#hero" aria-label="NOMU Home" style={{ display: 'inline-block' }}>
              <img
                src={siteLogo || '/img/nomu/nomu_symbol_master.png'}
                alt="NOMU"
                className="brand-master-logo footer-master-logo"
                width="36"
                height="57"
                loading="lazy"
                decoding="async"
                style={{ height: '48px', width: 'auto' }}
              />
            </a>
          </div>
          <p className="footer-mission" style={{ marginTop: '0.85rem' }}>
            Beyond Hydration. Clean herb-infused water crafted as a daily wellness ritual. Four herbs, zero nonsense.
          </p>
          <p className="footer-sustainability">
            100% recyclable glass bottles with aluminum seal caps. Small-batch crafted in India.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Flavours</h4>
          <ul className="footer-links">
            <li><a href="#showcase">Vetiver (Khus Root)</a></li>
            <li><a href="#showcase">German Chamomile</a></li>
            <li><a href="#showcase">Grapefruit (Ruby Peel)</a></li>
            <li><a href="#showcase">Lemongrass</a></li>
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
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Small-Batch Dispatch</h4>
          <p className="footer-address">
            Crafted fresh in India.<br />
            Express local deliveries.<br />
            Concierge: +91 93452 14712
          </p>
          <span className="footer-copyright">© 2026 NOMU BEVERAGES PRIVATE LIMITED. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
