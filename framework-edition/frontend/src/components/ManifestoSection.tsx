import React from 'react';

export const ManifestoSection: React.FC = () => {
  return (
    <section className="manifesto-pillars-section">
      <div className="container">
        <div className="manifesto-split-layout">
          <div className="manifesto-statement-col">
            <h2 className="manifesto-headline">
              HONORING THE SOIL. RESTORING THE BODY.
            </h2>
            <p className="manifesto-statement-p">
              We started NOMU out of frustration with sugary bottled drinks disguised as health products. Nature does not require lab-synthesized artificial flavors or excessive sweeteners to hydrate living cells.
            </p>
            <div className="manifesto-art-frame" data-ui>
              <img
                src="/img/ingredients/vetiver_khus_root.png"
                alt="Khus Root Harvest"
                className="manifesto-photo"
              />
            </div>
          </div>

          <div className="manifesto-cards-col">
            <div className="manifesto-card" data-ui>
              <div className="manifesto-num">01</div>
              <h3 className="manifesto-card-title">Whole Herb Distillation</h3>
              <p className="manifesto-card-text">
                We steep entire root bundles, flower blossoms, and cold-pressed citrus rinds in micro-lots, distilling aromatics and minerals directly into pure water.
              </p>
            </div>

            <div className="manifesto-card" data-ui>
              <div className="manifesto-num">02</div>
              <h3 className="manifesto-card-title">Zero Added Chemicals</h3>
              <p className="manifesto-card-text">
                Free of synthetic preservation chemicals, gums, or artificial colorings. Pure, clean water with genuine botanical vitality.
              </p>
            </div>

            <div className="manifesto-card" data-ui>
              <div className="manifesto-num">03</div>
              <h3 className="manifesto-card-title">Infinitely Recyclable Glass</h3>
              <p className="manifesto-card-text">
                Bottled exclusively in sterilized 330ml glass to preserve flavor purity without microplastic leaching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
