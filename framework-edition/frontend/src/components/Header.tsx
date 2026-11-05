import React from 'react';

interface HeaderProps {
  currentThemeBg: string;
  onOpenCheckout: () => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  cartItemCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentThemeBg,
  onOpenCheckout,
  isAdminOpen,
  onToggleAdmin,
  cartItemCount
}) => {
  return (
    <header className="site-header" id="site-header" style={{ backgroundColor: currentThemeBg }}>
      <div className="container header-container">
        <a href="#hero" className="brand-lockup" aria-label="NOMU Home">
          <div className="brand-logo-badge">
            <img src="/img/nomu/nomu_logo_clean.png" alt="NOMU Logo" width="22" height="22" />
          </div>
          <span className="brand-wordmark">NOMU</span>
          <span className="brand-tagline">BEYOND HYDRATION</span>
        </a>

        <nav className="site-nav" aria-label="Primary Navigation">
          <ul className="nav-list">
            <li><a href="#about" className="nav-link">ABOUT</a></li>
            <li><a href="#reviews" className="nav-link">REVIEWS</a></li>
            <li><a href="#showcase" className="nav-link">FLAVOURS</a></li>
            <li><a href="#shop" className="nav-link">BUILD RITUAL</a></li>
            <li><a href="#contact" className="nav-link">CONTACT</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-outline"
            style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)', padding: '0.45rem 0.95rem' }}
            onClick={onToggleAdmin}
            aria-label="Toggle Operations Console"
          >
            {isAdminOpen ? 'Storefront View' : 'Operations Console'}
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={onOpenCheckout}
            aria-label="Order Ritual Box"
          >
            <span>ORDER NOW</span>
            {cartItemCount > 0 && (
              <span className="cart-pill-count">{cartItemCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
