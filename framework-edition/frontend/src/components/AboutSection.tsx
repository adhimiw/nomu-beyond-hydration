import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section className="about-nomu-section" id="about">
      <div className="container">
        <div className="about-nomu-grid">
          {/* Left Column: Sticky Title & Japanese Subtitle */}
          <div className="about-nomu-left">
            <span data-ui className="about-nomu-badge">ABOUT US — 私たちについて</span>
            <p className="about-nomu-headline">
              NOT JUST WATER.<br />
              <span className="text-nomu-red">NOT JUST A</span><br />
              FLAVOURED DRINK.
            </p>
          </div>

          {/* Right Column: Narrative & 4 Claim Cards */}
          <div className="about-nomu-right">
            <div className="about-nomu-narrative">
              <p className="about-lead-p">
                <strong className="text-nomu-red">NOMU</strong> is a modern herb-infused water brand bringing together traditional ingredients and contemporary lifestyles in every bottle.
              </p>
              <p className="about-body-p">
                We craft refreshing blends like Vetiver, Chamomile, Lemongrass and Grapefruit to offer clean, functional hydration without added nonsense. Replaces sugar, chemicals, and caffeine with clean, herb-infused hydration that delivers real flavor and function.
              </p>
              <p className="about-body-p">
                At Nomu, we’re redefining water as a daily wellness ritual — natural, flavorful, and mindfully restorative.
              </p>
            </div>

            {/* 4 Metrics Claims Grid */}
            <div className="about-claims-grid" data-ui>
              <div className="about-claim-card">
                <span className="claim-val">100%</span>
                <span className="claim-lbl">NATURAL INFUSIONS</span>
              </div>
              <div className="about-claim-card">
                <span className="claim-val">0</span>
                <span className="claim-lbl">CALORIES PER BOTTLE</span>
              </div>
              <div className="about-claim-card">
                <span className="claim-val">0</span>
                <span className="claim-lbl">PRESERVATIVES</span>
              </div>
              <div className="about-claim-card">
                <span className="claim-val">4</span>
                <span className="claim-lbl">SIGNATURE FLAVOURS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
