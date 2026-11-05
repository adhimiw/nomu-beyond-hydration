import React from 'react';
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
  return (
    <section id="showcase" className="accordion-showcase-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge" data-ui>THE BOTANICAL QUARTET</span>
          <h2 className="section-title">FOUR HERBS. ZERO NONSENSE.</h2>
          <p className="section-sub">
            Each blend is crafted around a single hero botanical, cold-steeped and distilled in small batches to preserve volatile essential phytonutrients.
          </p>
        </div>

        {/* 4-Pillar Expanding Stage */}
        <div className="accordion-stage-grid">
          {FLAVOR_KEYS.map((key) => {
            const item = FLAVORS[key];
            const isExpanded = activeAccordionKey === key;

            return (
              <div
                key={key}
                id={`pillar-${key}`}
                className={`accordion-pillar pillar-${key} ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                style={{ backgroundColor: item.themeBg }}
                onClick={() => onSelectAccordion(key)}
                role="region"
                aria-expanded={isExpanded}
              >
                {/* Collapsed Pill Preview */}
                {!isExpanded && (
                  <div className="pillar-collapsed-content">
                    <img
                      src={item.bottleImage}
                      alt={item.name}
                      className="collapsed-bottle-thumb"
                    />
                    <div className="collapsed-meta">
                      <span className="collapsed-blend-num">{item.blendRoman}</span>
                      <strong className="collapsed-blend-name">{item.name}</strong>
                      <span className="collapsed-mood">({item.mood})</span>
                    </div>
                    <button type="button" className="collapsed-explore-btn">
                      View More
                    </button>
                  </div>
                )}

                {/* Expanded Full Presentation */}
                {isExpanded && (
                  <div className="pillar-expanded-content">
                    <div className="pillar-split-layout">
                      {/* Left: Packshot and Splash Image */}
                      <div className="pillar-visual-col">
                        <div className="pillar-bottle-frame">
                          <img
                            src={item.bottleImage}
                            alt={`NOMU ${item.name} Bottle`}
                            className="expanded-bottle-img"
                          />
                        </div>
                      </div>

                      {/* Right: Technical Details & Tasting Meters */}
                      <div className="pillar-details-col">
                        <div className="pillar-header-lockup">
                          <div className="pillar-roman-hero">{item.indexNum}</div>
                          <div>
                            <h3 className="pillar-name-display">{item.name}</h3>
                            <div className="pillar-kanji-sub">
                              <span>{item.flavorKanji}</span> · <span>{item.kanjiMark}</span>
                              <span className="pillar-mood-pill">Mood: {item.mood}</span>
                            </div>
                          </div>
                        </div>

                        <blockquote className="pillar-positioning">
                          "{item.positioning}"
                        </blockquote>

                        <p className="pillar-narrative">{item.tagline}</p>

                        {/* Tasting Notes Table */}
                        <div className="tasting-notes-box" data-ui>
                          <div className="note-row">
                            <span className="note-label">Top Note</span>
                            <span className="note-value">{item.tastingNotes.top}</span>
                          </div>
                          <div className="note-row">
                            <span className="note-label">Heart Note</span>
                            <span className="note-value">{item.tastingNotes.heart}</span>
                          </div>
                          <div className="note-row">
                            <span className="note-label">Base Note</span>
                            <span className="note-value">{item.tastingNotes.base}</span>
                          </div>
                        </div>

                        {/* Sensory Meters */}
                        <div className="sensory-meters-row">
                          <div className="meter-unit">
                            <div className="meter-label-row">
                              <span>Citrus</span>
                              <strong>{item.meters.citrus}%</strong>
                            </div>
                            <div className="meter-track">
                              <div className="meter-fill" style={{ width: `${item.meters.citrus}%` }} />
                            </div>
                          </div>
                          <div className="meter-unit">
                            <div className="meter-label-row">
                              <span>Sweetness</span>
                              <strong>{item.meters.sweetness}%</strong>
                            </div>
                            <div className="meter-track">
                              <div className="meter-fill" style={{ width: `${item.meters.sweetness}%` }} />
                            </div>
                          </div>
                          <div className="meter-unit">
                            <div className="meter-label-row">
                              <span>Effervescence</span>
                              <strong>{item.meters.effervescence}%</strong>
                            </div>
                            <div className="meter-track">
                              <div className="meter-fill" style={{ width: `${item.meters.effervescence}%` }} />
                            </div>
                          </div>
                          <div className="meter-unit">
                            <div className="meter-label-row">
                              <span>Depth</span>
                              <strong>{item.meters.botanical}%</strong>
                            </div>
                            <div className="meter-track">
                              <div className="meter-fill" style={{ width: `${item.meters.botanical}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Pack Pricing & Direct WhatsApp CTA */}
                        <div className="pillar-pricing-strip">
                          SINGLE ₹{item.priceSingle} · 3-PACK ₹{item.pricePack3} · 12-PACK ₹{item.pricePack12}
                        </div>

                        <button
                          type="button"
                          className="btn btn-white-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickOrderWhatsapp(key);
                          }}
                        >
                          <span>ORDER {item.name.toUpperCase()} ON WHATSAPP</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
