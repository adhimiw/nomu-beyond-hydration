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
  coupon_code?: string;
  discount_amount?: number;
  influencer_name?: string;
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
  coupon_code?: string;
  discount_amount?: number;
  influencer_name?: string;
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
  font_stylesheet_url?: string;
  font_preset?: string;
  whatsapp_phone?: string;
  site_logo?: string;
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


export interface CouponSummary {
  total_coupons: number;
  active_coupons: number;
  total_redemptions: number;
  total_sales: number;
  total_discount: number;
}

export interface CouponRecord {
  id: number;
  code: string;
  influencer_name: string;
  influencer_handle?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  usage_limit?: number | null;
  times_used: number;
  total_sales_generated: number;
  total_discount_granted: number;
  is_active: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  code?: string;
  influencer_name?: string;
  influencer_handle?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount_amount?: number;
  final_amount?: number;
  min_order_amount?: number;
  message?: string;
}
