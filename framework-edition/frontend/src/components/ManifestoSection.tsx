import React from 'react';

export const ManifestoSection: React.FC = () => {
  return (
    <section className="manifesto-pillars-section">
      <div className="container">
        <div className="manifesto-split-layout">
          <div className="manifesto-statement-col">
            <h2 className="manifesto-headline">RESTORE NATURAL EQUILIBRIUM</h2>
            <p className="manifesto-statement-p">
              NOMU is here to bring you back into balance naturally, gently, intentionally. Crafted in Chennai with 100% whole herbs, no added sugar, and zero synthetic preservatives.
            </p>
            <div className="manifesto-art-frame">
              <img
                src="/img/nomu/nomu_bottles_hero_real.jpg"
                alt="NOMU Botanical Water Collection"
                className="manifesto-art-img"
              />
            </div>
          </div>

          <div className="manifesto-narrative-col">
            <div className="manifesto-principle-row">
              <div className="manifesto-principle-tag">Pillar 1</div>
              <div className="manifesto-principle-body">
                <h3 className="manifesto-principle-title">Pure by Nature</h3>
                <p className="manifesto-principle-desc">
                  Seasonally mindful botanicals gently cold-steeped to extract cooling minerals, volatile terpenes, and active plant compounds.
                </p>
              </div>
            </div>

            <div className="manifesto-principle-row">
              <div className="manifesto-principle-tag">Pillar 2</div>
              <div className="manifesto-principle-body">
                <h3 className="manifesto-principle-title">Ancient Ayurvedic Roots</h3>
                <p className="manifesto-principle-desc">
                  Rooted in Indian botanical tradition, blending sacred Khus roots, holy basil (Tulsi), and calming blossoms for whole-body restoration.
                </p>
              </div>
            </div>

            <div className="manifesto-principle-row">
              <div className="manifesto-principle-tag">Pillar 3</div>
              <div className="manifesto-principle-body">
                <h3 className="manifesto-principle-title">Chennai Small-Batch Craft</h3>
                <p className="manifesto-principle-desc">
                  Micro-brewed in Chennai to guarantee crisp palate clarity, peak botanical vitality, and zero artificial preservatives or sugars.
                </p>
              </div>
            </div>

            <div className="manifesto-principle-row">
              <div className="manifesto-principle-tag">Pillar 4</div>
              <div className="manifesto-principle-body">
                <h3 className="manifesto-principle-title">Consciously Bottled</h3>
                <p className="manifesto-principle-desc">
                  Housed exclusively in endlessly recyclable glass bottles, honoring biological and environmental harmony.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
