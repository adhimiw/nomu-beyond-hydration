import React, { useEffect, useState, useRef } from 'react';
import { FLAVORS, FLAVOR_KEYS } from '../data/flavors';
import { FlavorKey } from '../types';

interface HeroSectionProps {
  activeFlavorKey: FlavorKey;
  onSelectFlavor: (key: FlavorKey) => void;
  heroHeadline?: string;
  heroSub?: string;
  onExploreClick: () => void;
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
    }, 220);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % FLAVOR_KEYS.length;
    handleSelect(FLAVOR_KEYS[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + FLAVOR_KEYS.length) % FLAVOR_KEYS.length;
    handleSelect(FLAVOR_KEYS[prevIdx]);
  };

  useEffect(() => {
    autoTimerRef.current = setInterval(() => {
      handleNext();
    }, 6500);

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
    }, 6500);
  };

  return (
    <section
      id="hero"
      className="hero-section"
      style={{ backgroundColor: activeFlavor.themeBg }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <div className="container hero-container">
        {/* Stage Flavor Selector Bar */}
        <div className="hero-top-nav">
          <div className="flavor-pills-row" role="tablist" aria-label="Select Blend">
            {FLAVOR_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                className={`flavor-pill-btn ${k === activeFlavorKey ? 'is-active' : ''}`}
                onClick={() => handleSelect(k)}
                role="tab"
                aria-selected={k === activeFlavorKey}
              >
                {FLAVORS[k].name}
              </button>
            ))}
          </div>

          <div className="hero-counter-tag">
            Blend {activeIndex + 1} of 4 · Small-Batch Distilled in Chennai
          </div>
        </div>

        {/* 3-Column Coordinated Dribbble Hero Stage */}
        <div className="hero-stage-grid">
          {/* Column 1: Media Showcase Frame */}
          <div className={`hero-col-left ${isSwapping ? 'is-swapping' : ''}`}>
            <div className="hero-media-card">
              <div className="media-player-wrap">
                <video
                  className="media-video-element"
                  src={activeFlavor.mediaVideo}
                  poster={activeFlavor.mediaPoster}
                  playsInline
                  autoPlay
                  muted
                  loop
                />
              </div>
              <div className="media-caption-box">
                <h3 className="media-caption-title">{activeFlavor.mediaTitle}</h3>
                <p className="media-caption-desc">{activeFlavor.mediaDesc}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Center Bottle Hero Packshot */}
          <div className="hero-col-center">
            <div className="hero-bottle-wrap">
              <img
                src={activeFlavor.bottleImage}
                alt={`NOMU ${activeFlavor.name} Botanical Bottle`}
                className={`hero-bottle-img ${isSwapping ? 'is-swapping' : ''}`}
              />
            </div>

            {/* Pagination Controls */}
            <div className="hero-pagination-bar">
              <button
                type="button"
                className="hero-arrow-btn"
                onClick={handlePrev}
                aria-label="Previous Blend"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="hero-dots-group">
                {FLAVOR_KEYS.map((k, i) => (
                  <button
                    key={k}
                    type="button"
                    className={`hero-dot-btn ${i === activeIndex ? 'is-active' : ''}`}
                    onClick={() => handleSelect(k)}
                    aria-label={`Go to ${FLAVORS[k].name}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="hero-arrow-btn"
                onClick={handleNext}
                aria-label="Next Blend"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Column 3: Editorial Narrative Card */}
          <div className={`hero-col-right ${isSwapping ? 'is-swapping' : ''}`}>
            <div className="hero-editorial-card">
              <div className="editorial-head">
                <span className="editorial-kicker">BOTANICAL ARCHITECTURE</span>
                <h1 className="hero-main-title">{heroHeadline || activeFlavor.headline}</h1>
                <p className="hero-sub-text">{heroSub || activeFlavor.tagline}</p>
              </div>

              <div className="editorial-harvest-frame">
                <img
                  src={activeFlavor.splashImage}
                  alt={`${activeFlavor.name} Harvest`}
                  className="harvest-photo"
                />
              </div>

              <div className="editorial-action-row">
                <button
                  type="button"
                  className="btn btn-burnt-orange btn-large"
                  onClick={onExploreClick}
                >
                  <span>{activeFlavor.ctaText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
