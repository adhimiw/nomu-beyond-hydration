import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FLAVORS, FLAVOR_KEYS } from '../data/flavors';
import { FlavorKey } from '../types';

interface ShowcaseSectionProps {
  activeAccordionKey: FlavorKey;
  onSelectAccordion: (key: FlavorKey) => void;
  onMoveToBuilder: (flavor: FlavorKey) => void;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  activeAccordionKey,
  onSelectAccordion,
  onMoveToBuilder
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Touch Swipe Tracking
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const activeIndex = FLAVOR_KEYS.indexOf(activeAccordionKey);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const handlePrev = useCallback(() => {
    const prevIdx = (safeActiveIndex - 1 + FLAVOR_KEYS.length) % FLAVOR_KEYS.length;
    onSelectAccordion(FLAVOR_KEYS[prevIdx]);
  }, [safeActiveIndex, onSelectAccordion]);

  const handleNext = useCallback(() => {
    const nextIdx = (safeActiveIndex + 1) % FLAVOR_KEYS.length;
    onSelectAccordion(FLAVOR_KEYS[nextIdx]);
  }, [safeActiveIndex, onSelectAccordion]);

  // Touch event handlers for fluid swipe on all screens
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 45; // 45px swipe threshold

    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Auto-progression with automatic pause on hover or focus
  useEffect(() => {
    if (isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 8000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, handleNext]);

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="showcase-master-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      aria-label="NOMU Botanical Distillates Showcase Carousel"
    >
      <div className="container">
        {/* Section Title Header */}
        <div className="showcase-section-header">
          <h2 className="showcase-title-main">
            <span style={{ display: 'inline-block' }}>FOUR HERBS.</span>{' '}
            <span className="title-red" style={{ display: 'inline-block' }}>ZERO NONSENSE.</span>
          </h2>
          <p className="showcase-sub-main">
            Click or navigate through our four botanical distillates to explore their architecture, aromatic profile, and palate spectrum.
          </p>
        </div>

        {/* =========================================================================
            1. HARDWARE-ACCELERATED MULTI-PANE SLIDING CAROUSEL (Laptop & Desktop)
            All 4 slides are pre-mounted side-by-side in a GPU-accelerated sliding track.
            Eliminates all image pop-ins, layout jitter, and clipped text completely.
           ========================================================================= */}
        <div className="desktop-showcase-carousel" data-desktop-only>
          {/* Top Flavour Selector Tabs Track */}
          <div className="carousel-flavour-nav-grid" role="tablist" aria-label="Select Blend">
            {FLAVOR_KEYS.map((key, idx) => {
              const item = FLAVORS[key];
              const isActive = activeAccordionKey === key;

              return (
                <button
                  key={key}
                  id={`pillar-${key}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${key}`}
                  className={`carousel-nav-tab theme-${key} ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectAccordion(key)}
                  style={{ '--tab-accent': item.themeBg } as React.CSSProperties}
                >
                  <div className="tab-thumb-bottle">
                    <img
                      src={item.bottleImage}
                      alt={`${item.name} Bottle`}
                      className="tab-bottle-img"
                      width={36}
                      height={80}
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="tab-meta-content">
                    <div className="tab-top-row">
                      <span className="tab-index-tag">0{idx + 1}</span>
                      <span className="tab-mood-chip">{item.mood}</span>
                    </div>
                    <h3 className="tab-product-title">{item.miniName || item.name}</h3>
                    <span className="tab-product-subtitle">{item.subtitleShort}</span>
                  </div>
                  <div className="tab-active-indicator" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {/* Carousel Spotlight Viewport Stage */}
          <div
            className="carousel-stage-card-frame"
            aria-live="polite"
          >
            {/* Previous Slide Arrow */}
            <button
              type="button"
              className="carousel-nav-arrow arrow-prev"
              onClick={handlePrev}
              aria-label="Previous Blend"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Next Slide Arrow */}
            <button
              type="button"
              className="carousel-nav-arrow arrow-next"
              onClick={handleNext}
              aria-label="Next Blend"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Continuous GPU Sliding Track */}
            <div
              className="carousel-stage-track"
              style={{
                transform: `translate3d(-${safeActiveIndex * (100 / FLAVOR_KEYS.length)}%, 0, 0)`
              }}
            >
              {FLAVOR_KEYS.map((key, idx) => {
                const item = FLAVORS[key];
                const isCurrent = activeAccordionKey === key;

                return (
                  <div
                    key={key}
                    id={`panel-${key}`}
                    role="tabpanel"
                    aria-labelledby={`pillar-${key}`}
                    className={`carousel-slide-pane theme-${key} ${isCurrent ? 'is-active-slide' : ''}`}
                    style={{ '--pane-accent': item.themeBg } as React.CSSProperties}
                  >
                    <div className="carousel-stage-grid">
                      {/* Left Column: Artwork (Preloaded, Never Blanks) */}
                      <div className="carousel-art-column">
                        <div className="carousel-art-wrap">
                          <img
                            src={item.bottleImage}
                            alt={`NOMU ${item.name} Large Bottle`}
                            className="carousel-large-bottle"
                            width={340}
                            height={560}
                            loading="eager"
                            decoding="sync"
                          />
                          {item.splashImage && (
                            <img
                              src={item.splashImage}
                              alt={`${item.name} Botanical Harvest`}
                              className="carousel-harvest-splash"
                              width={380}
                              height={250}
                              loading="eager"
                              decoding="sync"
                            />
                          )}
                          <div className="carousel-stage-glow" style={{ background: item.themeBg }} aria-hidden="true" />
                        </div>
                      </div>

                      {/* Right Column: Architectural Narrative & Palate Details */}
                      <div className="carousel-content-column">
                        <div className="carousel-slide-head">
                          <div className="carousel-head-topline">
                            <span className="carousel-blend-badge">
                              {item.blendRoman} · BLEND 0{idx + 1} OF 04
                            </span>
                            <span className="carousel-mood-badge">
                              Mood: {item.mood}
                            </span>
                          </div>
                          <h3 className="carousel-display-title">{item.miniName || item.name}</h3>
                          <p className="carousel-positioning-quote">"{item.positioning}"</p>
                        </div>

                        <p className="carousel-narrative-copy">{item.tagline}</p>

                        {/* Aromatic Architecture Notes */}
                        <div className="carousel-notes-matrix">
                          <div className="carousel-note-item">
                            <span className="note-badge-tag">Top Note</span>
                            <span className="note-desc-text">{item.tastingNotes.top}</span>
                          </div>
                          <div className="carousel-note-item">
                            <span className="note-badge-tag">Heart Note</span>
                            <span className="note-desc-text">{item.tastingNotes.heart}</span>
                          </div>
                          <div className="carousel-note-item">
                            <span className="note-badge-tag">Base Note</span>
                            <span className="note-desc-text">{item.tastingNotes.base}</span>
                          </div>
                        </div>

                        {/* Palate Spectrum Meters */}
                        <div className="carousel-spectrum-matrix">
                          <div className="spectrum-meter-card">
                            <div className="meter-label-row">
                              <span>Citrus</span>
                              <strong>{item.meters.citrus}%</strong>
                            </div>
                            <div className="meter-track-groove">
                              <div
                                className="meter-fill-bar"
                                style={{ width: `${item.meters.citrus}%` }}
                              />
                            </div>
                          </div>
                          <div className="spectrum-meter-card">
                            <div className="meter-label-row">
                              <span>Sweetness</span>
                              <strong>{item.meters.sweetness}%</strong>
                            </div>
                            <div className="meter-track-groove">
                              <div
                                className="meter-fill-bar"
                                style={{ width: `${item.meters.sweetness}%` }}
                              />
                            </div>
                          </div>
                          <div className="spectrum-meter-card">
                            <div className="meter-label-row">
                              <span>Effervescence</span>
                              <strong>{item.meters.effervescence}%</strong>
                            </div>
                            <div className="meter-track-groove">
                              <div
                                className="meter-fill-bar"
                                style={{ width: `${item.meters.effervescence}%` }}
                              />
                            </div>
                          </div>
                          <div className="spectrum-meter-card">
                            <div className="meter-label-row">
                              <span>Depth</span>
                              <strong>{item.meters.botanical}%</strong>
                            </div>
                            <div className="meter-track-groove">
                              <div
                                className="meter-fill-bar"
                                style={{ width: `${item.meters.botanical}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Pricing & WhatsApp CTA (Rock-Solid Fixed Baseline) */}
                        <div className="carousel-stage-actions">
                          <span className="carousel-price-statement">
                            SINGLE ₹{item.priceSingle} · 4-PACK ₹{item.pricePack4} · 12-PACK ₹{item.pricePack12}
                          </span>
                          <button
                            type="button"
                            className="btn btn-ivory-pill carousel-cta-btn"
                            onClick={() => onMoveToBuilder(key)}
                          >
                            ORDER {item.miniName ? item.miniName.toUpperCase() : item.name.toUpperCase()} ON WHATSAPP &rarr;
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Indicators per Pane */}
                    <div className="carousel-footer-indicators">
                      <span className="carousel-fraction-counter">
                        0{idx + 1} <span style={{ opacity: 0.5 }}>/</span> 04
                      </span>
                      <div className="carousel-progress-dots" role="tablist" aria-label="Slide dots">
                        {FLAVOR_KEYS.map((k, i) => (
                          <button
                            key={k}
                            type="button"
                            className={`carousel-indicator-dot ${i === idx ? 'is-active' : ''}`}
                            onClick={() => onSelectAccordion(k)}
                            aria-label={`Switch to ${FLAVORS[k].name}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. MOBILE / TABLET TOUCH ACCORDION (Fluid Responsive across 2000-2026 devices)
            Optimized for all viewports from 320px compact screens to 430px modern flagships.
           ========================================================================= */}
        <div className="mobile-showcase-accordion" data-mobile-only>
          <div className="accordion-stage-wrap">
            {FLAVOR_KEYS.map((key, idx) => {
              const item = FLAVORS[key];
              const isExpanded = activeAccordionKey === key;

              return (
                <div
                  key={key}
                  className={`accordion-pillar theme-${key} ${isExpanded ? 'is-expanded' : ''}`}
                  data-pillar-index={idx}
                  aria-expanded={isExpanded}
                  onClick={() => onSelectAccordion(key)}
                >
                  {/* Collapsed Mini Preview */}
                  <div className="pillar-collapsed-view">
                    <div className="pillar-mini-bottle">
                      <img
                        src={item.bottleImage}
                        alt={`${item.miniName || item.name} Packshot`}
                        className="mini-bottle-img"
                        width={80}
                        height={180}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="pillar-mini-meta">
                      <div className="pillar-mini-text-cluster">
                        <h3 className="pillar-mini-name">{item.miniName || item.name}</h3>
                        <span className="pillar-mini-sub">{item.subtitleShort}</span>
                      </div>
                      <span className="pillar-view-btn">View More</span>
                    </div>
                  </div>

                  {/* Expanded Full Stage View */}
                  <div className="pillar-expanded-view">
                    <div className="pillar-expanded-left">
                      <div className="pillar-splash-bottle-wrap">
                        <img
                          src={item.bottleImage}
                          alt={`NOMU ${item.name} Large Bottle`}
                          className="pillar-large-bottle"
                          width={340}
                          height={560}
                          loading="lazy"
                          decoding="async"
                        />
                        {item.splashImage && (
                          <img
                            src={item.splashImage}
                            alt={`${item.name} Botanical Harvest`}
                            className="pillar-ingredient-splash"
                            width={400}
                            height={260}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <div className="pillar-bottle-shadow" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="pillar-expanded-right">
                      <div className="pillar-expanded-header">
                        <div className="pillar-title-lockup">
                          <h3 className="pillar-full-name">{item.name}</h3>
                        </div>
                        <div className="pillar-mood-wrap">
                          <span className="pillar-mood-pill">Mood: {item.mood}</span>
                        </div>
                      </div>

                      <p className="pillar-positioning-quote">"{item.positioning}"</p>
                      <p className="pillar-narrative-text">{item.tagline}</p>

                      {/* Aromatic Architecture */}
                      <div className="pillar-aroma-block">
                        <div className="pillar-aroma-row">
                          <span className="pillar-aroma-label">Top Note</span>
                          <span className="pillar-aroma-val">{item.tastingNotes.top}</span>
                        </div>
                        <div className="pillar-aroma-row">
                          <span className="pillar-aroma-label">Heart Note</span>
                          <span className="pillar-aroma-val">{item.tastingNotes.heart}</span>
                        </div>
                        <div className="pillar-aroma-row">
                          <span className="pillar-aroma-label">Base Note</span>
                          <span className="pillar-aroma-val">{item.tastingNotes.base}</span>
                        </div>
                      </div>

                      {/* Palate Spectrum Mini-Grid */}
                      <div className="pillar-spectrum-grid">
                        <div className="pillar-meter-col">
                          <div className="meter-info">
                            <span>Citrus</span>
                            <strong>{item.meters.citrus}%</strong>
                          </div>
                          <div className="meter-track">
                            <div className="meter-fill" style={{ width: `${item.meters.citrus}%` }} />
                          </div>
                        </div>
                        <div className="pillar-meter-col">
                          <div className="meter-info">
                            <span>Sweetness</span>
                            <strong>{item.meters.sweetness}%</strong>
                          </div>
                          <div className="meter-track">
                            <div className="meter-fill" style={{ width: `${item.meters.sweetness}%` }} />
                          </div>
                        </div>
                        <div className="pillar-meter-col">
                          <div className="meter-info">
                            <span>Effervescence</span>
                            <strong>{item.meters.effervescence}%</strong>
                          </div>
                          <div className="meter-track">
                            <div className="meter-fill" style={{ width: `${item.meters.effervescence}%` }} />
                          </div>
                        </div>
                        <div className="pillar-meter-col">
                          <div className="meter-info">
                            <span>Depth</span>
                            <strong>{item.meters.botanical}%</strong>
                          </div>
                          <div className="meter-track">
                            <div className="meter-fill" style={{ width: `${item.meters.botanical}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* CTA & WhatsApp Order */}
                      <div className="pillar-action-row">
                        <span className="pillar-price-tag">
                          SINGLE ₹{item.priceSingle} · 4-PACK ₹{item.pricePack4} · 12-PACK ₹{item.pricePack12}
                        </span>
                        <button
                          type="button"
                          className="btn btn-ivory-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveToBuilder(key);
                          }}
                        >
                          ORDER {item.miniName ? item.miniName.toUpperCase() : item.name.toUpperCase()} ON WHATSAPP &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
