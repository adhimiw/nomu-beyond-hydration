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
    customer_name: 'Ananya S.',
    flavor_key: 'vetiver',
    rating: 5,
    headline: 'Replaced my afternoon iced tea completely',
    review_text: 'The cooling earthiness of Vetiver is grounding. It has an unmistakable freshness without being bitter or sweet. Drinking it chilled after work in Chennai heat is an instant reset.',
    created_at: '2 days ago'
  },
  {
    id: 102,
    customer_name: 'Karthik Raman',
    flavor_key: 'chamomile',
    rating: 5,
    headline: 'Deep restorative calm for evening sleep',
    review_text: 'Gentle honeyed floral aroma without any artificial stevia aftertaste. It settles evening nervous energy and quiets neural chatter. I order the 12-pack pantry box every fortnight.',
    created_at: '4 days ago'
  },
  {
    id: 103,
    customer_name: 'Dr. Meera Iyer',
    flavor_key: 'lemongrass',
    rating: 5,
    headline: 'Clean herbal clarity during long hospital shifts',
    review_text: 'As a surgeon I avoid caffeinated energy drinks. NOMU Lemongrass with Holy Basil gives a sharp, crisp hydration burst without any heart rate spike or sugar crash.',
    created_at: '1 week ago'
  },
  {
    id: 104,
    customer_name: 'Vikram Chandran',
    flavor_key: 'grapefruit',
    rating: 5,
    headline: 'Vibrant ruby peel aroma with zero calories',
    review_text: 'The citrus peel distillation captures pure essential limonene aromatics. It feels luxurious, perfectly tart, and makes drinking 2 liters of daily water a genuine pleasure.',
    created_at: '1 week ago'
  }
];

export const App: React.FC = () => {
  const [activeHeroFlavor, setActiveHeroFlavor] = useState<FlavorKey>('vetiver');
  const [activeAccordionFlavor, setActiveAccordionFlavor] = useState<FlavorKey>('vetiver');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'vetiver-pack4',
      flavorKey: 'vetiver',
      packKey: 'pack4',
      quantity: 1,
      unitPrice: 160,
      bottlesPerPack: 4
    }
  ]);

  // Reviews State
  const [reviews, setReviews] = useState<ReviewRecord[]>(INITIAL_REVIEWS);

  // CMS Content State
  const [cms, setCms] = useState<CmsData>({
    hero_headline: 'BEYOND HYDRATION',
    hero_sub: 'Ancient South Indian botanical distillates crafted in small batches across India.',
    ticker_text: '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS',
    whatsapp_phone: '919840000000'
  });

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Fetch approved reviews and CMS on load
  const loadRemoteData = async () => {
    try {
      const cmsRes = await fetch('/api/content');
      if (cmsRes.ok) {
        const cmsData = await cmsRes.json();
        setCms(cmsData);
      }
    } catch (e) {}

    try {
      const revRes = await fetch('/api/reviews');
      if (revRes.ok) {
        const revData = await revRes.json();
        if (revData && Array.isArray(revData.reviews)) {
          const existingIds = new Set(revData.reviews.map((r: ReviewRecord) => String(r.id)));
          const uniqueSeeds = INITIAL_REVIEWS.filter((r) => !existingIds.has(String(r.id)));
          setReviews([...revData.reviews, ...uniqueSeeds]);
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

  const handleQuickOrder = (flavor: FlavorKey) => {
    handleAddToCart({
      id: `${flavor}-pack4`,
      flavorKey: flavor,
      packKey: 'pack4',
      quantity: 1,
      unitPrice: 160,
      bottlesPerPack: 4
    });
    setIsOrderModalOpen(true);
  };

  const scrollToPillars = (flavorKey?: FlavorKey) => {
    const targetFlavor = flavorKey || activeHeroFlavor;
    setActiveAccordionFlavor(targetFlavor);
    setTimeout(() => {
      const targetId = `pillar-${targetFlavor}`;
      const targetEl = document.getElementById(targetId) || document.getElementById('showcase');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        />

        {/* Continuous Marquee Ribbon matching Dribbble */}
        <div className="ticker-ribbon" aria-hidden="true">
          <div className="ticker-track">
            <span className="ticker-item">{cms.ticker_text || '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS'} <span className="ticker-dot">•</span></span>
            <span className="ticker-item">{cms.ticker_text || '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS'} <span className="ticker-dot">•</span></span>
            <span className="ticker-item">{cms.ticker_text || '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS'} <span className="ticker-dot">•</span></span>
            <span className="ticker-item">{cms.ticker_text || '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS'} <span className="ticker-dot">•</span></span>
          </div>
        </div>

        <AboutSection />

        <ShowcaseSection
          activeAccordionKey={activeAccordionFlavor}
          onSelectAccordion={(k) => setActiveAccordionFlavor(k)}
          onQuickOrderWhatsapp={handleQuickOrder}
        />

        <ManifestoSection />

        <RitualBoxBuilder
          cart={cart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onApplyPreset={handleApplyPreset}
          onOpenCheckout={() => setIsOrderModalOpen(true)}
        />

        {/* Reviews Section — Placed directly under Build Your Ritual */}
        <ReviewsSection
          reviews={reviews}
          onOpenWriteReview={() => setIsReviewModalOpen(true)}
        />

        <ContactSection />
      </main>

      <Footer />

      {/* Lazy-Loaded Modals */}
      <Suspense fallback={null}>
        {isOrderModalOpen && (
          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            cart={cart}
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
