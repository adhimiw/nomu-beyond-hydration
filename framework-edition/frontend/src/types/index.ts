export type FlavorKey = 'vetiver' | 'chamomile' | 'grapefruit' | 'lemongrass';

export interface TastingNotes {
  top: string;
  heart: string;
  base: string;
}

export interface TastingMeters {
  citrus: number;
  sweetness: number;
  effervescence: number;
  botanical: number;
}

export interface FlavorItem {
  id: FlavorKey;
  indexNum: string;
  blendRoman: string;
  name: string;
  kanjiMark: string;
  flavorKanji: string;
  mood: string;
  subtitle: string;
  subtitleShort?: string;
  miniName?: string;
  positioning: string;
  tagline: string;
  themeBg: string;
  accentColor: string;
  bottleImage: string;
  packshotImage: string;
  splashImage: string;
  headline: string;
  mediaTitle: string;
  mediaDesc: string;
  mediaVideo?: string;
  mediaPoster?: string;
  ctaText: string;
  priceSingle: number;
  pricePack4: number;
  pricePack12: number;
  pricePack3?: number;
  tastingNotes: TastingNotes;
  meters: TastingMeters;
}

export type PackKey = 'single' | 'pack4' | 'pack12' | 'pack3';

export interface PackTier {
  id: PackKey;
  name: string;
  price: number;
  bottlesCount: number;
  description: string;
  badge?: string;
}

export interface CartItem {
  id: string; // e.g. 'vetiver-pack3'
  flavorKey: FlavorKey;
  packKey: PackKey;
  quantity: number;
  unitPrice: number;
  bottlesPerPack: number;
}

export interface OrderItemSummary {
  flavor: string;
  pack: string;
  quantity: number;
  bottles: number;
  price: number;
}

export interface OrderSubmissionPayload {
  order_ref?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  notes?: string;
  items: OrderItemSummary[];
  total_bottles: number;
  total_amount: number;
  _hp_security_check?: string;
}

export interface OrderRecord {
  id: number;
  order_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  notes?: string;
  items: OrderItemSummary[];
  total_bottles: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at?: string;
}

export interface ReviewSubmissionPayload {
  customer_name: string;
  customer_email: string;
  flavor_key: FlavorKey;
  rating: number;
  headline: string;
  review_text: string;
  _hp_security_check?: string;
}

export interface ReviewRecord {
  id: number;
  customer_name: string;
  customer_email?: string;
  flavor_key: FlavorKey;
  rating: number;
  headline: string;
  review_text: string;
  status?: 'pending' | 'approved' | 'rejected';
  is_visible?: number;
  created_at: string;
}

export interface CmsData {
  hero_headline?: string;
  hero_sub?: string;
  ticker_text?: string;
  font_family?: string;
  whatsapp_phone?: string;
  banner_text?: string;
  hero_video_url?: string;
  hero_poster_url?: string;
  vetiver_bottle_img?: string;
  vetiver_splash_img?: string;
  vetiver_packshot_img?: string;
  chamomile_bottle_img?: string;
  chamomile_splash_img?: string;
  chamomile_packshot_img?: string;
  grapefruit_bottle_img?: string;
  grapefruit_splash_img?: string;
  grapefruit_packshot_img?: string;
  lemongrass_bottle_img?: string;
  lemongrass_splash_img?: string;
  lemongrass_packshot_img?: string;
  about_image_url?: string;
  manifesto_image_url?: string;
}

export interface SystemTelemetry {
  status: string;
  timestamp: string;
  runtime: {
    php_version: string;
    sapi: string;
    os: string;
    memory_allocated_mb: number;
    memory_peak_mb: number;
    disk_free_gb: number | string;
    disk_total_gb: number | string;
    opcache_active: boolean;
  };
  database: {
    total_orders: number;
    pending_orders: number;
    total_reviews: number;
    pending_reviews: number;
  };
}

export interface SystemAuditLog {
  id: number;
  level: string;
  action: string;
  message: string;
  context_json?: string;
  ip_address: string;
  created_at: string;
}
