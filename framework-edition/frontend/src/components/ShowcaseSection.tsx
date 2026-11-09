import React, { useRef } from 'react';
import { FLAVORS, FLAVOR_KEYS } from '../data/flavors';
import { FlavorKey } from '../types';

interface ShowcaseSectionProps {
  activeAccordionKey: FlavorKey;
  onSelectAccordion: (key: FlavorKey) => void;
  onQuickOrderWhatsapp: (flavor: FlavorKey) => void;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  activeAccordionKey,
  onSelectAccordion,
  onQuickOrderWhatsapp
}) => {
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (key: FlavorKey) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      // Responsive, smooth 100ms hover debounce prevents jitter while feeling instantaneous
      hoverTimerRef.current = setTimeout(() => {
        onSelectAccordion(key);
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  return (
    <section id="showcase" className="accordion-showcase-section">
      <div className="container">
        <div className="showcase-section-header">
          <h2 className="showcase-title-main">
            <span style={{ display: 'inline-block' }}>FOUR HERBS.</span>{' '}
            <span className="title-red" style={{ display: 'inline-block' }}>ZERO NONSENSE.</span>
          </h2>
          <p className="showcase-sub-main">
            Click or hover any bottle to explore its botanical architecture, aromatic profile, and palate spectrum.
          </p>
        </div>

        {/* 4-Pillar Expanding Stage Container */}
        <div className="accordion-stage-wrap">
          {FLAVOR_KEYS.map((key, idx) => {
            const item = FLAVORS[key];
            const isExpanded = activeAccordionKey === key;

            return (
              <div
                key={key}
                id={`pillar-${key}`}
                className={`accordion-pillar theme-${key} ${isExpanded ? 'is-expanded' : ''}`}
                data-pillar-index={idx}
                aria-expanded={isExpanded}
                onClick={() => {
                  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                  onSelectAccordion(key);
                }}
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
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
                      <a
                        href={`https://wa.me/919840000000?text=Hi%20NOMU%2C%20I%20would%20like%20to%20order%20NOMU%20${encodeURIComponent(item.name)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ivory-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickOrderWhatsapp(key);
                        }}
                      >
                        ORDER {item.miniName ? item.miniName.toUpperCase() : item.name.toUpperCase()} ON WHATSAPP &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
