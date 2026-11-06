import React from 'react';

interface HeaderProps {
  currentThemeBg: string;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  onOpenCheckout?: () => void;
  cartItemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentThemeBg,
  isAdminOpen,
  onToggleAdmin,
  onOpenCheckout
}) => {
  return (
    <header
      className="site-header"
      id="site-header"
      style={{ '--hero-bg': currentThemeBg, backgroundColor: currentThemeBg } as React.CSSProperties}
    >
      <div className="container header-inner">
        <a href="#hero" className="brand-group" aria-label="NOMU Home">
          <div className="brand-logo-badge">
            <img src="/img/nomu/nomu_logo_clean.png" alt="NOMU Logo" width="22" height="22" />
          </div>
          <img src="/img/nomu/nomu_wordmark_transparent.png" alt="NOMU Wordmark" className="brand-wordmark-img" height="20" />
          <span className="brand-tagline">BEYOND HYDRATION</span>
        </a>

        <nav className="site-nav" aria-label="Primary Navigation">
          <ul className="nav-list">
            <li><a href="#about" className="nav-link">ABOUT</a></li>
            <li><a href="#showcase" className="nav-link">FLAVOURS</a></li>
            <li><a href="#shop" className="nav-link">BUILD RITUAL</a></li>
            <li><a href="#reviews" className="nav-link">REVIEWS</a></li>
            <li><a href="#contact" className="nav-link">CONTACT</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-header-admin"
            onClick={onToggleAdmin}
            aria-label="Toggle Operations Console"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{isAdminOpen ? 'Storefront View' : 'Admin Login'}</span>
          </button>
          <a
            href="#shop"
            className="btn btn-header-cta"
            onClick={(e) => {
              if (onOpenCheckout) {
                e.preventDefault();
                onOpenCheckout();
              } else {
                const el = document.getElementById('shop');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          >
            ORDER NOW
          </a>
        </div>
      </div>
    </header>
  );
};
