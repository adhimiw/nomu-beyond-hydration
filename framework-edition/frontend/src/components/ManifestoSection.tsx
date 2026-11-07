import React from 'react';

export const ManifestoSection: React.FC = () => {
  return (
    <section className="manifesto-pillars-section">
      <div className="container">
        <div className="manifesto-statement-centered">
          <span className="manifesto-kicker">OUR BOTANICAL PHILOSOPHY</span>
          <h2 className="manifesto-headline">RESTORE NATURAL EQUILIBRIUM</h2>
          <p className="manifesto-statement-p">
            NOMU is here to bring you back into balance naturally, gently, intentionally. Crafted in India with 100% whole herbs, no added sugar, and zero synthetic preservatives.
          </p>
          <div className="manifesto-art-frame">
            <img
              src="/img/nomu/nomu_bottles_hero_real.webp"
              alt="NOMU Botanical Water Collection"
              className="manifesto-art-img"
              width={1000}
              height={520}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
