import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-copy-col">
            <span className="about-badge" data-ui>NOT JUST WATER</span>
            <h2 className="about-title">BEYOND HYDRATION.</h2>
            <p className="about-paragraph">
              Modern life is depleted by synthetic syrups, carbonated chemicals, and filtered plain tap water devoid of cellular life.
            </p>
            <p className="about-paragraph">
              NOMU cold-steeps and distills four whole botanical plants sourced across the Western Ghats and Tamil Nadu soils. Zero cane sugar, zero artificial flavor essences, zero stevia masking. Just clean, living hydration.
            </p>

            <div className="about-stats-row" data-ui>
              <div className="stat-unit">
                <strong>4</strong>
                <span>Pure Botanicals</span>
              </div>
              <div className="stat-unit">
                <strong>0g</strong>
                <span>Added Sugar</span>
              </div>
              <div className="stat-unit">
                <strong>100%</strong>
                <span>Recycled Glass</span>
              </div>
            </div>
          </div>

          <div className="about-visual-col">
            <div className="about-art-frame" data-ui>
              <img
                src="/img/ingredients/chamomile_lavender_harvest.jpg"
                alt="Botanical Steep Process"
                className="about-art-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
