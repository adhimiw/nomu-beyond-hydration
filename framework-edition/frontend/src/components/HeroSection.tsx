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
  onExploreClick
}) => {
  // Two-phase transition: 'idle' (visible) | 'exit' (fading out to 0 before swap)
  const [swapPhase, setSwapPhase] = useState<'idle' | 'exit'>('idle');
  // Immediate visual feedback for top tabs & pagination dots (0ms lag on click)
  const [immediateFlavorKey, setImmediateFlavorKey] = useState<FlavorKey>(activeFlavorKey);
  const [isInView, setIsInView] = useState(true);

  const heroRef = useRef<HTMLElement | null>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const swapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeFlavor = FLAVORS[activeFlavorKey];
  const activeIndex = FLAVOR_KEYS.indexOf(activeFlavorKey);

  // Sync immediate feedback whenever parent state updates
  useEffect(() => {
    setImmediateFlavorKey(activeFlavorKey);
  }, [activeFlavorKey]);

  // Two-phase coordinated transition
  const handleSelect = (key: FlavorKey) => {
    if (key === activeFlavorKey) return;

    // 1. Instantly move tab / dot highlight for crisp, tactile feel
    setImmediateFlavorKey(key);

    // 2. Clear any pending swap timers
    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);

    // 3. Phase 1: Smoothly ease down bottle & wordings to opacity 0 (180ms)
    setSwapPhase('exit');

    // 4. Phase 2: When completely invisible at opacity 0, swap content and float in
    swapTimerRef.current = setTimeout(() => {
      onSelectFlavor(key);
      // Wait for next repaint so new product is mounted at opacity 0 before fading in
      requestAnimationFrame(() => {
        setSwapPhase('idle');
      });
    }, 180);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % FLAVOR_KEYS.length;
    handleSelect(FLAVOR_KEYS[nextIdx]);
  };

  // IntersectionObserver guarantees auto-rotation strictly halts when user scrolls past hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-rotation timer (only runs when hero is actively visible in viewport)
  useEffect(() => {
    if (!isInView) {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      return;
    }

    autoTimerRef.current = setInterval(() => {
      handleNext();
    }, 7000);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [activeIndex, isInView]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  const pauseTimer = () => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
  };

  const resumeTimer = () => {
    if (!isInView) return;
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      handleNext();
    }, 7000);
  };

  return (
    <section
      ref={heroRef}
      className="hero-dribbble-stage"
      id="hero"
      data-hero-flavor={activeFlavorKey}
      style={{ '--hero-bg': activeFlavor.themeBg } as React.CSSProperties}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <div className="container hero-stage-container">
        {/* Top Stage Quick Switcher with immediate tactile response */}
        <div className="hero-top-flavor-nav" role="tablist" aria-label="Hero Flavour Switcher">
          {FLAVOR_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className={`hero-flavour-link ${k === immediateFlavorKey ? 'is-active' : ''}`}
              data-hero-nav={k}
              role="tab"
              aria-selected={k === immediateFlavorKey}
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

        {/* 2-Column Interactive Stage: Left Video & Copy Cluster, Right Bottle Packshot */}
        <div className="hero-interactive-grid hero-2col-layout">
          {/* Left Column: Video Window + Synchronized Editorial Copy Cluster */}
          <div className="hero-col-left hero-col-video">
            <div className="hero-video-window hero-video-large">
              <video
                src={activeFlavor.mediaVideo}
                poster={activeFlavor.mediaPoster}
                className="hero-video-player"
                id="hero-video-player"
                width={640}
                height={360}
                preload="none"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Unified Copy Cluster: Fades out completely before swapping strings, eliminating all pop glitches */}
            <div className={`hero-copy-cluster ${swapPhase === 'exit' ? 'is-exiting' : ''}`}>
              <div className="hero-media-meta">
                <h3 className="hero-media-title" id="hero-media-title">{activeFlavor.mediaTitle}</h3>
                <p className="hero-media-desc" id="hero-media-desc">
                  {activeFlavor.mediaDesc}
                </p>
              </div>
              <div className="hero-editorial-sub-block">
                <p className="hero-tagline-text" id="hero-tagline-desc">
                  {activeFlavor.tagline}
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
              </div>
            </div>
          </div>

          {/* Right Column: Standing Isolated Bottle Packshot & Pagination Dots */}
          <div className="hero-col-right hero-col-bottle">
            <div className="hero-bottle-pedestal">
              <img
                src={activeFlavor.bottleImage}
                alt={`NOMU ${activeFlavor.name} Botanical Water Bottle`}
                className={`hero-bottle-packshot ${swapPhase === 'exit' ? 'is-exiting' : ''}`}
                id="hero-bottle-img"
                width={440}
                height={720}
                fetchPriority="high"
                decoding="async"
              />
              <div className="hero-contact-shadow" aria-hidden="true" />
            </div>
            {/* Pagination Dots with immediate tactile active response */}
            <div className="hero-pagination-dots" role="tablist" aria-label="Flavour Pagination">
              {FLAVOR_KEYS.map((k, i) => (
                <button
                  key={k}
                  type="button"
                  className={`hero-dot-btn ${k === immediateFlavorKey ? 'is-active' : ''}`}
                  data-dot-index={i}
                  role="tab"
                  aria-selected={k === immediateFlavorKey}
                  aria-label={`${FLAVORS[k].name} blend`}
                  onClick={() => handleSelect(k)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Controls & Origin Accent */}
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
              Blend {activeIndex + 1} of 4 · Small-Batch Crafted in India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
