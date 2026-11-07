import React, { useState } from 'react';
import { ReviewRecord, FlavorKey } from '../types';

interface ReviewsSectionProps {
  reviews: ReviewRecord[];
  onOpenWriteReview: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onOpenWriteReview
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | FlavorKey>('all');

  const filteredReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter((r) => r.flavor_key === activeFilter);

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }).map((_, i) => (
      <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section className="reviews-section" id="reviews">
      <div className="container">
        <div className="reviews-section-header">
          <div className="reviews-header-top">
            <span data-ui className="reviews-badge">COMMUNITY TASTING NOTES — お客様の声</span>
            <div className="reviews-rating-summary">
              <span className="stars-gold-row" aria-hidden="true">
                {renderStars(5)}
              </span>
              <span className="rating-number">4.9 / 5.0</span>
              <span className="rating-count">(340+ Verified Ritual Drinkers)</span>
            </div>
          </div>
          <div className="reviews-header-main">
            <h2 className="reviews-title-main">
              <span>REAL RITUALS.</span> <span className="title-red">GENUINE REVIEWS.</span>
            </h2>
            <p className="reviews-sub-main">
              Honest impressions from everyday drinkers who replaced soda, artificial chemicals, and plain water with NOMU's botanical infusions.
            </p>
          </div>

          {/* Review Filters & Write Review Action */}
          <div className="reviews-toolbar">
            <div className="reviews-filter-pills" role="tablist" aria-label="Filter reviews by blend">
              <button
                type="button"
                className={`review-filter-btn ${activeFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('all')}
                role="tab"
                aria-selected={activeFilter === 'all'}
              >
                All Blends
              </button>
              <button
                type="button"
                className={`review-filter-btn ${activeFilter === 'vetiver' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('vetiver')}
                role="tab"
                aria-selected={activeFilter === 'vetiver'}
              >
                I · Vetiver
              </button>
              <button
                type="button"
                className={`review-filter-btn ${activeFilter === 'chamomile' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('chamomile')}
                role="tab"
                aria-selected={activeFilter === 'chamomile'}
              >
                II · Chamomile
              </button>
              <button
                type="button"
                className={`review-filter-btn ${activeFilter === 'grapefruit' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('grapefruit')}
                role="tab"
                aria-selected={activeFilter === 'grapefruit'}
              >
                III · Grapefruit
              </button>
              <button
                type="button"
                className={`review-filter-btn ${activeFilter === 'lemongrass' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('lemongrass')}
                role="tab"
                aria-selected={activeFilter === 'lemongrass'}
              >
                IV · Lemongrass
              </button>
            </div>
            <button
              type="button"
              className="btn btn-review-write"
              id="btn-open-review-modal"
              aria-haspopup="dialog"
              onClick={onOpenWriteReview}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="reviews-cards-grid" id="reviews-cards-grid">
          {filteredReviews.length === 0 ? (
            <p className="multi-cart-empty-text">No reviews recorded yet for this blend.</p>
          ) : (
            filteredReviews.map((r) => (
              <article key={r.id} className="review-card">
                <div>
                  <div className="review-card-top">
                    <span className={`review-blend-badge blend-${r.flavor_key}`}>
                      Blend · {r.flavor_key.toUpperCase()}
                    </span>
                    <div className="stars-gold-row" aria-label={`${r.rating || 5} out of 5 stars`}>
                      {renderStars(r.rating || 5)}
                    </div>
                  </div>
                  <h3 className="review-card-title">{r.headline}</h3>
                  <p className="review-card-body">"{r.review_text}"</p>
                </div>
                <div className="review-card-footer">
                  <div className="review-author-info">
                    <span className="review-author-name">{r.customer_name}</span>
                    <span className="review-verified-badge" title="Verified Customer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified
                    </span>
                  </div>
                  <span className="review-date-text">{r.created_at}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
