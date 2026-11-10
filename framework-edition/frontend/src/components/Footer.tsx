import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <img
              src="/img/nomu/nomu_wordmark_transparent.png"
              alt="NOMU"
              className="footer-brand-logo"
              width="96"
              height="20"
              loading="lazy"
              decoding="async"
            />
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
