import React, { useEffect, useState, useRef } from 'react';
import { FLAVORS, FLAVOR_KEYS } from '../data/flavors';
import { FlavorKey } from '../types';

interface HeroSectionProps {
  activeFlavorKey: FlavorKey;
  onSelectFlavor: (key: FlavorKey) => void;
  heroHeadline?: string;
  heroSub?: string;
  onExploreClick: (flavorKey: FlavorKey) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeFlavorKey,
  onSelectFlavor,
  heroHeadline,
  heroSub,
  onExploreClick
}) => {
  const [isSwapping, setIsSwapping] = useState(false);
  const activeFlavor = FLAVORS[activeFlavorKey];
  const activeIndex = FLAVOR_KEYS.indexOf(activeFlavorKey);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelect = (key: FlavorKey) => {
    if (key === activeFlavorKey) return;
    setIsSwapping(true);
    setTimeout(() => {
      onSelectFlavor(key);
      setIsSwapping(false);
    }, 420);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % FLAVOR_KEYS.length;
    handleSelect(FLAVOR_KEYS[nextIdx]);
  };

  useEffect(() => {
    autoTimerRef.current = setInterval(() => {
      handleNext();
    }, 7000);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [activeIndex]);

  const pauseTimer = () => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
  };

  const resumeTimer = () => {
    autoTimerRef.current = setInterval(() => {
      handleNext();
    }, 7000);
  };

  return (
    <section
      className="hero-dribbble-stage"
      id="hero"
      data-hero-flavor={activeFlavorKey}
      style={{ '--hero-bg': activeFlavor.themeBg } as React.CSSProperties}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <div className="container hero-stage-container">
        {/* Top Stage Quick Switcher matching Dribbble */}
        <div className="hero-top-flavor-nav" role="tablist" aria-label="Hero Flavour Switcher">
          {FLAVOR_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className={`hero-flavour-link ${k === activeFlavorKey ? 'is-active' : ''}`}
              data-hero-nav={k}
              role="tab"
              aria-selected={k === activeFlavorKey}
              onClick={() => handleSelect(k)}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Big Curved Display Headline across Stage */}
        <div className="hero-curved-title-wrap">
          <h1 className="hero-curved-title">
            {heroHeadline || 'BEYOND HYDRATION'}
          </h1>
        </div>

        {/* 3-Column Interactive Stage Grid */}
        <div className="hero-interactive-grid">
          {/* Left Column: Video & Process Window */}
          <div className={`hero-col-left ${isSwapping ? 'is-swapping' : ''}`}>
            <div className="hero-video-window">
              <video
                src={activeFlavor.mediaVideo}
                poster={activeFlavor.mediaPoster}
                className="hero-video-player"
                id="hero-video-player"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className="hero-media-meta">
              <h3 className="hero-media-title" id="hero-media-title">{activeFlavor.mediaTitle}</h3>
              <p className="hero-media-desc" id="hero-media-desc">
                {activeFlavor.mediaDesc}
              </p>
            </div>
            <div className="hero-manifesto-side">
              <span>Ideas, visions, and botanical restoration for daily equilibrium.</span>
            </div>
          </div>

          {/* Center Column: Standing Isolated Bottle Packshot & Pagination Dots */}
          <div className="hero-col-center">
            <div className="hero-bottle-pedestal">
              <img
                src={activeFlavor.bottleImage}
                alt={`NOMU ${activeFlavor.name} Botanical Water Bottle`}
                className={`hero-bottle-packshot ${isSwapping ? 'is-swapping' : ''}`}
                id="hero-bottle-img"
              />
              <div className="hero-contact-shadow" aria-hidden="true" />
            </div>
            {/* Pagination Dots directly under bottle matching Dribbble */}
            <div className="hero-pagination-dots" role="tablist" aria-label="Flavour Pagination">
              {FLAVOR_KEYS.map((k, i) => (
                <button
                  key={k}
                  type="button"
                  className={`hero-dot-btn ${i === activeIndex ? 'is-active' : ''}`}
                  data-dot-index={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`${FLAVORS[k].name} blend`}
                  onClick={() => handleSelect(k)}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Editorial Note & CTA directly on colored canvas (No white card!) */}
          <div className={`hero-col-right ${isSwapping ? 'anim-stagger-out' : ''}`} id="hero-col-right">
            <h2 className="hero-editorial-heading" id="hero-right-title">{activeFlavor.headline}</h2>
            <div className="hero-ingredient-frame">
              <img
                src={activeFlavor.splashImage}
                alt={`${activeFlavor.name} harvest ingredients`}
                className="hero-ingredient-img"
                id="hero-right-thumb"
              />
            </div>
            <p className="hero-editorial-narrative" id="hero-right-desc">
              {heroSub || activeFlavor.tagline}
            </p>
            <div className="hero-cta-action">
              <a
                href="#showcase"
                className="btn-hero-outline"
                id="hero-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onExploreClick(activeFlavorKey);
                }}
              >
                {activeFlavor.ctaText}
              </a>
            </div>
            <div className="hero-curious-side">
              <span>A space for curious minds, active bodies, and daily mindfulness.</span>
            </div>
          </div>
        </div>

        {/* Bottom Controls & Accents */}
        <div className="hero-bottom-bar">
          <div className="hero-bottom-left">
            <a
              href={`https://wa.me/919840000000?text=Hi%20NOMU%2C%20I%20would%20like%20to%20order%20NOMU%20${encodeURIComponent(activeFlavor.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-circle-btn"
              id="hero-whatsapp-btn"
              aria-label="Order on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <span className="hero-btn-label">ORDER ON WHATSAPP</span>
          </div>

          <div className="hero-bottom-right">
            <span className="hero-counter-val" id="hero-index-counter">
              Blend {activeIndex + 1} of 4 · Small-Batch Crafted in Chennai
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
