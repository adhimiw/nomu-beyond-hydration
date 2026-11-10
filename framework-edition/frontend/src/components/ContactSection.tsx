import React from 'react';

interface ContactSectionProps {
  whatsappPhone?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ whatsappPhone = '919345214712' }) => {
  return (
    <>
      {/* Brand Statement Banner matching Original Storefront */}
      <section className="brand-banner-section" aria-hidden="true">
        <div className="brand-banner-content">
          <h2 className="brand-banner-title">NOMU</h2>
          <p className="brand-banner-sub">BEYOND HYDRATION</p>
        </div>
      </section>

      {/* Section: Connect with NOMU */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">CONNECT WITH NOMU.</h2>
            <p className="section-sub">
              Have a question about our infusions, retail partnerships, or bulk office orders? Reach out directly.
            </p>
          </div>

          <div className="contact-channels-grid">
            {/* Channel 1: WhatsApp Concierge */}
            <div className="contact-channel-card">
              <div>
                <h3 className="contact-channel-title">Direct WhatsApp Line</h3>
                <p className="contact-channel-body">
                  Direct chat for immediate orders, custom ritual mix boxes, and express delivery inquiries across Chennai.
                </p>
              </div>
              <a
                href={`https://wa.me/${whatsappPhone || '919345214712'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-burnt-orange btn-block"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Channel 2: Instagram */}
            <div className="contact-channel-card">
              <div>
                <h3 className="contact-channel-title">Instagram Dispatch</h3>
                <p className="contact-channel-body">
                  Follow our journey, small-batch bottling runs, and community events @drinkitnomu.
                </p>
              </div>
              <a
                href="https://www.instagram.com/drinkitnomu/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-burnt-orange btn-block"
              >
                Follow @drinkitnomu
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
