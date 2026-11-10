import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { ManifestoSection } from './components/ManifestoSection';
import { RitualBoxBuilder } from './components/RitualBoxBuilder';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Code-split heavy modals and administration console for fast mobile payload
const AdminConsole = lazy(() => import('./components/AdminConsole').then(m => ({ default: m.AdminConsole })));
const OrderModal = lazy(() => import('./components/OrderModal').then(m => ({ default: m.OrderModal })));
const ReviewModal = lazy(() => import('./components/ReviewModal').then(m => ({ default: m.ReviewModal })));

import { FLAVORS } from './data/flavors';
import { CartItem, FlavorKey, ReviewRecord, CmsData } from './types';
import './styles/theme.css';

const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 101,
    customer_name: 'Dr. Radhika Menon',
    flavor_key: 'vetiver',
    rating: 5,
    headline: 'Gentle, non-acidic hydration for long clinical shifts',
    review_text: 'I keep a bottle of Vetiver chilled during long OT rotations. Unlike sparkling flavored water that triggers acid reflux, NOMU is silky smooth, subtly earthy, and leaves no sugar crash.',
    created_at: '2 days ago',
    is_visible: 1
  },
  {
    id: 102,
    customer_name: 'Vikramaditya S.',
    flavor_key: 'chamomile',
    rating: 5,
    headline: 'Replaced my evening chamomile tea with cold distilled NOMU',
    review_text: 'The floral notes are authentic, not synthetic essence. It has become my wind-down ritual at 9 PM after newsroom deadlines. Clean, relaxing, and exceptional glass packaging.',
    created_at: '3 days ago',
    is_visible: 1
  },
  {
    id: 103,
    customer_name: 'Ananya Deshmukh',
    flavor_key: 'grapefruit',
    rating: 5,
    headline: 'Vibrant ruby peel aroma with zero calories',
    review_text: 'The citrus peel distillation captures pure essential limonene aromatics. It feels luxurious, perfectly tart, and makes drinking 2 liters of daily water a genuine pleasure.',
    created_at: '5 days ago',
    is_visible: 1
  },
  {
    id: 104,
    customer_name: 'Karthik R.',
    flavor_key: 'lemongrass',
    rating: 5,
    headline: 'Crisp lemongrass with a refreshing mineral finish',
    review_text: 'Ordered the 12-pack discovery box on WhatsApp. Delivered same day in Besant Nagar. Lemongrass is crisp, uplifting, and pairs remarkably well with light South Indian meals.',
    created_at: '1 week ago',
    is_visible: 1
  }
];

const renderTickerContent = (text: string) => {
  const target = 'join the ritual';
  const effectiveText = (text && text.toLowerCase().includes(target))
    ? text
    : 'Made in India, join the ritual';
  const lower = effectiveText.toLowerCase();
  const idx = lower.indexOf(target);
  if (idx !== -1) {
    const before = effectiveText.slice(0, idx);
    const match = effectiveText.slice(idx, idx + target.length);
    const after = effectiveText.slice(idx + target.length);
    return (
      <>
        {before}
        <span className="ticker-accent">{match}</span>
        {after}
      </>
    );
  }
  return effectiveText;
};

export const App: React.FC = () => {
  const [activeHeroFlavor, setActiveHeroFlavor] = useState<FlavorKey>('vetiver');
  const [activeAccordionFlavor, setActiveAccordionFlavor] = useState<FlavorKey>('vetiver');
  const [builderFlavor, setBuilderFlavor] = useState<FlavorKey>('vetiver');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Cart State (Initialized empty; users choose their blends and add to cart)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Reviews State
  const [reviews, setReviews] = useState<ReviewRecord[]>(INITIAL_REVIEWS);

  // CMS Content State
  const [cms, setCms] = useState<CmsData>({
    hero_headline: 'BEYOND HYDRATION',
    hero_sub: 'Ancient South Indian botanical distillates crafted in small batches across India.',
    ticker_text: 'Made in India, join the ritual',
    whatsapp_phone: '919345214712',
    site_logo: '/img/nomu/nomu_symbol_master.png'
  });

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Fetch approved reviews and CMS on load (cache-busted to bypass CDN edge caching)
  const loadRemoteData = async () => {
    try {
      const cmsRes = await fetch(`/api/content?_t=${Date.now()}`, { cache: 'no-store' });
      if (cmsRes.ok) {
        const cmsData = await cmsRes.json();
        setCms(cmsData);
      }
    } catch (e) {}

    try {
      const revRes = await fetch(`/api/reviews?_t=${Date.now()}`, { cache: 'no-store' });
      if (revRes.ok) {
        const revData = await revRes.json();
        if (revData && Array.isArray(revData.reviews)) {
          if (revData.reviews.length > 0) {
            setReviews(revData.reviews);
          } else {
            setReviews(INITIAL_REVIEWS);
          }
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadRemoteData();

    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Cart Actions
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.id === item.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? { ...it, quantity: nextQty } : null;
          }
          return it;
        })
        .filter((it): it is CartItem => it !== null)
    );
  };

  const handleApplyPreset = (preset: 'discovery' | 'pantry' | 'reset') => {
    if (preset === 'reset') {
      setCart([]);
      return;
    }
    if (preset === 'discovery') {
      setCart([
        { id: 'vetiver-single', flavorKey: 'vetiver', packKey: 'single', quantity: 1, unitPrice: 40, bottlesPerPack: 1 },
        { id: 'chamomile-single', flavorKey: 'chamomile', packKey: 'single', quantity: 1, unitPrice: 40, bottlesPerPack: 1 },
        { id: 'grapefruit-single', flavorKey: 'grapefruit', packKey: 'single', quantity: 1, unitPrice: 40, bottlesPerPack: 1 },
        { id: 'lemongrass-single', flavorKey: 'lemongrass', packKey: 'single', quantity: 1, unitPrice: 40, bottlesPerPack: 1 }
      ]);
      return;
    }
    if (preset === 'pantry') {
      setCart([
        { id: 'vetiver-pack4', flavorKey: 'vetiver', packKey: 'pack4', quantity: 1, unitPrice: 160, bottlesPerPack: 4 },
        { id: 'chamomile-pack4', flavorKey: 'chamomile', packKey: 'pack4', quantity: 1, unitPrice: 160, bottlesPerPack: 4 },
        { id: 'grapefruit-pack4', flavorKey: 'grapefruit', packKey: 'pack4', quantity: 1, unitPrice: 160, bottlesPerPack: 4 }
      ]);
      return;
    }
  };

  const handleMoveToBuilder = (flavor: FlavorKey) => {
    setBuilderFlavor(flavor);
    setTimeout(() => {
      const shopEl = document.getElementById('shop');
      if (shopEl) {
        shopEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const scrollToPillars = (flavorKey?: FlavorKey) => {
    const targetFlavor = flavorKey || activeHeroFlavor;
    setActiveAccordionFlavor(targetFlavor);
    setTimeout(() => {
      const showcaseEl = document.getElementById('showcase');
      if (showcaseEl) {
        showcaseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  if (isAdminOpen) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Console...</div>}>
        <AdminConsole onClose={handleCloseAdmin} />
      </Suspense>
    );
  }

  const currentThemeBg = FLAVORS[activeHeroFlavor].themeBg;

  return (
    <div className="nomu-app">
      <Header
        currentThemeBg={currentThemeBg}
        onOpenCheckout={() => setIsOrderModalOpen(true)}
        cartItemCount={cart.reduce((a, b) => a + b.quantity * b.bottlesPerPack, 0)}
        siteLogo={cms.site_logo}
      />

      <main>
        <HeroSection
          activeFlavorKey={activeHeroFlavor}
          onSelectFlavor={(k) => {
            setActiveHeroFlavor(k);
          }}
          heroHeadline={cms.hero_headline}
          heroSub={cms.hero_sub}
          onExploreClick={scrollToPillars}
          whatsappPhone={cms.whatsapp_phone}
        />

        {/* Continuous Marquee Ribbon matching Dribbble */}
        <div className="ticker-ribbon" aria-hidden="true">
          <div className="ticker-track">
            {Array.from({ length: 12 }).map((_, i) => (
              <span className="ticker-item" key={i}>
                {renderTickerContent(cms.ticker_text || 'Made in India, join the ritual')}
                <span className="ticker-dot">•</span>
              </span>
            ))}
          </div>
        </div>

        <AboutSection />

        <ShowcaseSection
          activeAccordionKey={activeAccordionFlavor}
          onSelectAccordion={(k) => setActiveAccordionFlavor(k)}
          onMoveToBuilder={handleMoveToBuilder}
        />

        <ManifestoSection />

        <RitualBoxBuilder
          cart={cart}
          selectedFlavor={builderFlavor}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onApplyPreset={handleApplyPreset}
          onOpenCheckout={() => setIsOrderModalOpen(true)}
        />

        {/* Reviews Section — Placed directly under Build Your Ritual */}
        <ReviewsSection
          reviews={reviews}
          onOpenWriteReview={() => setIsReviewModalOpen(true)}
        />

        <ContactSection whatsappPhone={cms.whatsapp_phone} />
      </main>

      <Footer siteLogo={cms.site_logo} />

      {/* Lazy-Loaded Modals */}
      <Suspense fallback={null}>
        {isOrderModalOpen && (
          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onAddToCart={handleAddToCart}
            whatsappConcierge={cms.whatsapp_phone}
          />
        )}
        {isReviewModalOpen && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            onReviewSubmitted={loadRemoteData}
          />
        )}
      </Suspense>
    </div>
  );
};
