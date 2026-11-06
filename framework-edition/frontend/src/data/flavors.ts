import { FlavorItem, FlavorKey, PackTier } from '../types';

export const FLAVORS: Record<FlavorKey, FlavorItem> = {
  vetiver: {
    id: 'vetiver',
    indexNum: 'I',
    blendRoman: 'Blend I',
    name: 'Vetiver',
    kanjiMark: '根',
    flavorKanji: '香根草',
    mood: 'Ground',
    subtitle: 'Natural Khus Root Infusion',
    subtitleShort: '(Khus Root)',
    miniName: 'Vetiver',
    positioning: 'Earthy, Cooling & Deeply Grounding',
    tagline: 'Ancient South Indian Khus roots traditionally cold-steeped to dissipate internal heat, anchor the mind, and restore constitutional balance.',
    themeBg: '#D5360C',
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/vetiver_isolated.png',
    packshotImage: '/img/bottles/vetiver_packshot.jpg',
    splashImage: '/img/ingredients/vetiver_khus_root.png',
    headline: 'Grounded in the earth.',
    mediaTitle: 'South Indian Khus Harvest',
    mediaDesc: 'Ancient Vetiver roots cold-steeped in micro-batches to extract cooling essential minerals and earthy aromatics.',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/nomu/nomu_film_poster.jpg',
    ctaText: 'EXPLORE VETIVER →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'Organic South Indian Vetiver (Khus) roots',
      heart: 'Cooling cucumber rind & fresh mint leaf',
      base: 'Potassium citrate & restorative sea trace minerals'
    },
    meters: {
      citrus: 24,
      sweetness: 15,
      effervescence: 70,
      botanical: 96
    }
  },
  chamomile: {
    id: 'chamomile',
    indexNum: 'II',
    blendRoman: 'Blend II',
    name: 'German Chamomile',
    kanjiMark: '花',
    flavorKanji: '洋甘菊',
    mood: 'Unwind',
    subtitle: 'Blossoms & Soft Lavender',
    subtitleShort: '(Blossoms)',
    miniName: 'Chamomile',
    positioning: 'Floral, Delicate & Gently Calming',
    tagline: 'Sun-dried German chamomile blossoms delivering apigenin-rich relaxation, settling digestion and quieting evening neural chatter.',
    themeBg: '#8A5404',
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/chamomile_isolated.png',
    packshotImage: '/img/bottles/chamomile_packshot.jpg',
    splashImage: '/img/ingredients/chatgpt_hero_visual.webp',
    headline: 'Calm in the chaos.',
    mediaTitle: 'German Blossom Steep',
    mediaDesc: 'Whole sun-dried Roman chamomile flower blossoms steeped gently at room temperature for evening restoration.',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/ingredients/chamomile_lavender_harvest.jpg',
    ctaText: 'EXPLORE CHAMOMILE →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'German chamomile flower blossoms',
      heart: 'Delicate lavender & soft floral aromatics',
      base: 'Gentle botanical infusion & subtle mineral finish'
    },
    meters: {
      citrus: 12,
      sweetness: 28,
      effervescence: 35,
      botanical: 92
    }
  },
  grapefruit: {
    id: 'grapefruit',
    indexNum: 'III',
    blendRoman: 'Blend III',
    name: 'Grapefruit',
    kanjiMark: '果',
    flavorKanji: '葡萄柚',
    mood: 'Uplift',
    subtitle: 'Ruby Peel & Hibiscus',
    subtitleShort: '(Ruby Peel)',
    miniName: 'Grapefruit',
    positioning: 'Zesty, Vibrant & Naturally Uplifting',
    tagline: 'Cold-extracted ruby grapefruit peel and tart botanical infusions to awaken palate senses, invigorate metabolic alertness, and sparkle.',
    themeBg: '#B51718',
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/grapefruit_isolated.png',
    packshotImage: '/img/bottles/grapefruit_packshot.jpg',
    splashImage: '/img/ingredients/grapefruit_harvest.jpg',
    headline: 'Awaken the senses.',
    mediaTitle: 'Ruby Peel Expression',
    mediaDesc: 'Cold-expressed citrus peel and vibrant hibiscus releasing natural essential limonene oils for morning alertness.',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/ingredients/grapefruit_harvest.jpg',
    ctaText: 'EXPLORE GRAPEFRUIT →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'Ruby grapefruit citrus essence',
      heart: 'Hibiscus petals & refreshing citrus peel',
      base: 'Delicate botanical finish & natural mineral balance'
    },
    meters: {
      citrus: 96,
      sweetness: 35,
      effervescence: 65,
      botanical: 72
    }
  },
  lemongrass: {
    id: 'lemongrass',
    indexNum: 'IV',
    blendRoman: 'Blend IV',
    name: 'Lemongrass',
    kanjiMark: '叶',
    flavorKanji: '柠檬草',
    mood: 'Refresh',
    subtitle: 'Nilgiri Stalks & Holy Basil',
    subtitleShort: '(Nilgiri Stalks)',
    miniName: 'Lemongrass',
    positioning: 'Crisp, Herbal & Naturally Refreshing',
    tagline: 'High-altitude Nilgiri lemongrass distilled with holy basil to deliver sharp focus, cellular hydration, and clean herbal vitality.',
    themeBg: '#32690E',
    accentColor: '#E6D5BD',
    bottleImage: '/img/bottles/lemongrass_isolated.png',
    packshotImage: '/img/bottles/lemongrass_packshot.jpg',
    splashImage: '/img/ingredients/lemongrass_grapefruit_herbs.jpg',
    headline: 'Clarity by design.',
    mediaTitle: 'Nilgiri Mountain Stalks',
    mediaDesc: 'High-altitude Nilgiri lemongrass harvested at morning dew point and distilled with holy basil (Tulsi).',
    mediaVideo: '/video/nomu_showcase.mp4',
    mediaPoster: '/img/ingredients/lemongrass_harvest.jpg',
    ctaText: 'EXPLORE LEMONGRASS →',
    priceSingle: 95,
    pricePack3: 270,
    pricePack12: 999,
    tastingNotes: {
      top: 'Fresh Nilgiri lemongrass stalks',
      heart: 'Citrus peel & wild holy basil (Tulsi)',
      base: 'Subtle herbal undertones & clean mineral finish'
    },
    meters: {
      citrus: 82,
      sweetness: 22,
      effervescence: 55,
      botanical: 85
    }
  }
};

export const FLAVOR_KEYS: FlavorKey[] = ['vetiver', 'chamomile', 'grapefruit', 'lemongrass'];

export const PACK_TIERS: Record<string, PackTier> = {
  single: {
    id: 'single',
    name: 'SINGLE BOTTLE · ₹95',
    price: 95,
    bottlesCount: 1,
    description: '1x 330ml Glass Bottle · Discovery trial'
  },
  pack3: {
    id: 'pack3',
    name: '3-PACK RITUAL BOX · ₹270',
    price: 270,
    bottlesCount: 3,
    description: '3x 330ml Bottles · 3-day daily wellness routine',
    badge: 'SAVE 5%'
  },
  pack12: {
    id: 'pack12',
    name: '12-PACK PANTRY BOX · ₹999',
    price: 999,
    bottlesCount: 12,
    description: '12x 330ml Bottles · Full 2-week sustained ritual',
    badge: 'FREE CHENNAI EXPRESS'
  }
};
