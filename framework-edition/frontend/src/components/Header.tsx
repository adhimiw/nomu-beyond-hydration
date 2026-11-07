import React from 'react';

interface HeaderProps {
  currentThemeBg: string;
  isAdminOpen?: boolean;
  onToggleAdmin?: () => void;
  onOpenCheckout?: () => void;
  cartItemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentThemeBg,
  onOpenCheckout,
  cartItemCount = 0
}) => {
  return (
    <header
      className="site-header"
      id="site-header"
      style={{ '--hero-bg': currentThemeBg, backgroundColor: currentThemeBg } as React.CSSProperties}
    >
      <div className="container header-inner">
        <a href="#hero" className="brand-group" aria-label="NOMU Home">
          <img
            src="/img/nomu/nomu_symbol_master.png"
            alt="NOMU"
            className="brand-master-logo"
            width="42"
            height="67"
            decoding="async"
          />
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
            {cartItemCount > 0 ? `YOUR CART (${cartItemCount})` : 'YOUR CART'}
          </a>
        </div>
      </div>
    </header>
  );
};
