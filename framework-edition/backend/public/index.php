<?php
/**
 * NOMU BEVERAGES — HEADLESS CMS, REVIEW MODERATION & WHATSAPP ORDER ENGINE
 * High-performance, zero-overhead PHP 8.3 API Gateway with SQLite PDO.
 */

declare(strict_types=1);

// Security Headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// CORS configuration (allow same-origin or localhost dev)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://drinkitnomu.com',
    'https://www.drinkitnomu.com',
    'https://pink-frog-219558.hostingersite.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:8000',
    'http://localhost:8080'
];
if ($origin && (
    in_array($origin, $allowedOrigins, true) ||
    preg_match('/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|100\.\d+\.\d+\.\d+)(:\d+)?$/', $origin)
)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --------------------------------------------------------------------------
// Configuration & External Secrets Loader (Zero Hardcoded Prod Credentials)
// --------------------------------------------------------------------------
const DB_PATH = dirname(__DIR__) . '/database/nomu_database.sqlite';

$secrets = [];
$secretCandidatePaths = [
    dirname(__DIR__, 2) . '/.nomu_secrets.php',
    dirname(__DIR__, 1) . '/.nomu_secrets.php',
];
foreach ($secretCandidatePaths as $sp) {
    if (is_file($sp) && is_readable($sp)) {
        $loaded = require $sp;
        if (is_array($loaded)) {
            $secrets = $loaded;
            break;
        }
    }
}

$ADMIN_USERNAME = (string)(getenv('ADMIN_USERNAME') ?: ($secrets['admin_username'] ?? 'admin'));
$ADMIN_SIGNING_SECRET = (string)(getenv('ADMIN_SIGNING_SECRET') ?: ($secrets['admin_signing_secret'] ?? ''));
$ADMIN_PASSWORD_HASHES = [];
if (!empty($secrets['admin_password_hashes']) && is_array($secrets['admin_password_hashes'])) {
    $ADMIN_PASSWORD_HASHES = $secrets['admin_password_hashes'];
}
if (getenv('ADMIN_PASSWORD_HASH')) {
    $ADMIN_PASSWORD_HASHES[] = (string)getenv('ADMIN_PASSWORD_HASH');
}
$TOKEN_TTL_SECONDS = (int)(getenv('ADMIN_TOKEN_TTL') ?: ($secrets['token_ttl_seconds'] ?? 43200));

// Database Connection Manager: MySQL (Hostinger production) with SQLite fallback for local dev
$pdo = null;
$httpHost = $_SERVER['HTTP_HOST'] ?? '';
$isProdDomain = (strpos($httpHost, 'drinkitnomu.com') !== false);

$dbHost = (string)(getenv('DB_HOST') ?: ($secrets['db_host'] ?? ''));
$dbPort = (string)(getenv('DB_PORT') ?: ($secrets['db_port'] ?? '3306'));
$dbName = (string)(getenv('DB_NAME') ?: ($secrets['db_name'] ?? ''));
$dbUser = (string)(getenv('DB_USER') ?: ($secrets['db_user'] ?? ''));
$dbPass = (string)(getenv('DB_PASS') ?: ($secrets['db_pass'] ?? ''));

// 1. Attempt MySQL connection when configured
if ($dbHost !== '' && $dbName !== '' && $dbUser !== '') {
    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2
        ]);
    } catch (\Throwable $e) {
        $pdo = null;
    }
}

// 2. Fall back to local SQLite WAL database only for non-prod local/dev environments
if (!$pdo) {
    if ($isProdDomain) {
        http_response_code(503);
        echo json_encode(['error' => 'Service temporarily unavailable']);
        exit;
    }
    try {
        $pdo = new PDO('sqlite:' . DB_PATH, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ]);
        $pdo->exec('PRAGMA journal_mode = WAL;');
    } catch (\Throwable $e2) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }
}

// --------------------------------------------------------------------------
// Schema Auto-Migration & Seed Initialization
// --------------------------------------------------------------------------
$driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
$autoInc = ($driver === 'mysql') ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
$engine = ($driver === 'mysql') ? 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4' : '';

$pdo->exec("
    CREATE TABLE IF NOT EXISTS orders (
        id {$autoInc},
        order_ref VARCHAR(32) UNIQUE NOT NULL,
        customer_name VARCHAR(120) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(150) NOT NULL,
        delivery_address TEXT NOT NULL,
        notes TEXT,
        items_json TEXT NOT NULL,
        total_bottles INTEGER DEFAULT 1,
        total_amount REAL NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        ip_address VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) {$engine};

    CREATE TABLE IF NOT EXISTS reviews (
        id {$autoInc},
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(150) NOT NULL,
        flavor_key VARCHAR(50) NOT NULL,
        rating INTEGER DEFAULT 5,
        headline VARCHAR(200) NOT NULL,
        review_text TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        is_visible TINYINT(1) DEFAULT 1,
        moderated_at DATETIME,
        moderated_by VARCHAR(100),
        ip_address VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) {$engine};

    CREATE TABLE IF NOT EXISTS cms_contents (
        id {$autoInc},
        field_key VARCHAR(80) UNIQUE NOT NULL,
        field_value TEXT,
        field_group VARCHAR(50) DEFAULT 'general',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) {$engine};

    CREATE TABLE IF NOT EXISTS system_logs (
        id {$autoInc},
        level VARCHAR(20) DEFAULT 'INFO',
        action VARCHAR(60) NOT NULL,
        message TEXT NOT NULL,
        context_json TEXT,
        ip_address VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) {$engine};

    CREATE TABLE IF NOT EXISTS coupons (
        id {$autoInc},
        code VARCHAR(50) UNIQUE NOT NULL,
        influencer_name VARCHAR(120) NOT NULL,
        influencer_handle VARCHAR(100),
        discount_type VARCHAR(20) DEFAULT 'percentage',
        discount_value REAL NOT NULL,
        min_order_amount REAL DEFAULT 0,
        usage_limit INTEGER DEFAULT NULL,
        times_used INTEGER DEFAULT 0,
        total_sales_generated REAL DEFAULT 0,
        total_discount_granted REAL DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) {$engine};

    CREATE TABLE IF NOT EXISTS media_assets (
        id {$autoInc},
        section_key VARCHAR(60) NOT NULL,
        asset_type VARCHAR(20) NOT NULL,
        title VARCHAR(120) NOT NULL,
        url VARCHAR(255) UNIQUE NOT NULL,
        alt_text VARCHAR(200),
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) {$engine};

    CREATE TABLE IF NOT EXISTS rate_limits (
        ip_hash VARCHAR(64) NOT NULL,
        bucket VARCHAR(40) NOT NULL,
        hits INTEGER DEFAULT 1,
        window_start INTEGER NOT NULL,
        PRIMARY KEY (ip_hash, bucket)
    ) {$engine};
");

try {
    $pdo->exec("ALTER TABLE reviews ADD COLUMN is_visible TINYINT(1) DEFAULT 1");
} catch (\Throwable $e) {}
try { $pdo->exec("ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(50) DEFAULT NULL"); } catch (\Throwable $e) {}
try { $pdo->exec("ALTER TABLE orders ADD COLUMN discount_amount REAL DEFAULT 0"); } catch (\Throwable $e) {}
try { $pdo->exec("ALTER TABLE orders ADD COLUMN influencer_name VARCHAR(120) DEFAULT NULL"); } catch (\Throwable $e) {}

// Database Seeder Function
function seedDatabase(PDO $pdo, bool $force = false, bool $isProdDomain = false): array {
    $seeded = ['cms' => 0, 'media' => 0, 'reviews' => 0];
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $insertIgnore = ($driver === 'mysql') ? 'INSERT IGNORE INTO' : 'INSERT OR IGNORE INTO';

    // 1. Seed CMS content & media references
    $cmsDefaults = [
        ['hero_headline', 'BEYOND HYDRATION', 'hero'],
        ['hero_sub', 'Ancient South Indian botanical distillates crafted in small batches across India.', 'hero'],
        ['ticker_text', 'Made in India, join the ritual', 'general'],
        ['font_family', "'Bricolage Grotesque', sans-serif", 'design'],
        ['font_stylesheet_url', 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap', 'design'],
        ['font_preset', 'bricolage', 'design'],
        ['whatsapp_phone', '919345214712', 'contact'],
        ['site_logo', '/img/nomu/nomu_symbol_master.png', 'brand'],
        ['hero_video_url', '/video/nomu_showcase.mp4', 'media'],
        ['hero_poster_url', '/img/nomu/nomu_film_poster.jpg', 'media'],
        ['vetiver_bottle_img', '/img/bottles/vetiver_isolated.png', 'media'],
        ['vetiver_ingredient_img', '/img/ingredients/vetiver_khus_root.png', 'media'],
        ['chamomile_bottle_img', '/img/bottles/chamomile_isolated.png', 'media'],
        ['chamomile_ingredient_img', '/img/ingredients/chamomile_lavender_harvest.jpg', 'media'],
        ['grapefruit_bottle_img', '/img/bottles/grapefruit_isolated.png', 'media'],
        ['grapefruit_ingredient_img', '/img/ingredients/grapefruit_harvest.jpg', 'media'],
        ['lemongrass_bottle_img', '/img/bottles/lemongrass_isolated.png', 'media'],
        ['lemongrass_ingredient_img', '/img/ingredients/lemongrass_harvest.jpg', 'media']
    ];

    $insCms = $pdo->prepare("{$insertIgnore} cms_contents (field_key, field_value, field_group) VALUES (?, ?, ?)");
    foreach ($cmsDefaults as $c) {
        $insCms->execute($c);
        if ($insCms->rowCount() > 0) $seeded['cms']++;
    }

    // 2. Seed Media Assets Vault (Images & Videos)
    $mediaDefaults = [
        ['hero', 'video', 'NOMU Brand Film Showcase (MP4)', '/video/nomu_showcase.mp4', 'NOMU botanical distillation film in 4K', 1],
        ['hero', 'video', 'NOMU Brand Film Showcase (WebM)', '/video/nomu_showcase.webm', 'NOMU botanical distillation film in WebM format', 1],
        ['hero', 'image', 'Hero Showcase Film Poster', '/img/nomu/nomu_film_poster.jpg', 'Cold-distilled botanical harvest poster frame', 1],
        ['hero', 'image', 'Hero Studio Photography', '/img/nomu/nomu_hero_studio.jpg', 'Minimalist glass bottle on studio slate pedestal', 1],
        ['hero', 'image', 'Four Bottles Botanical Packshot', '/img/nomu/nomu_bottles_hero_real.jpg', 'Complete lineup of four NOMU herb-infused waters', 1],
        ['showcase', 'image', 'Blend I — Vetiver Bottle Packshot', '/img/bottles/vetiver_isolated.png', 'NOMU Vetiver isolated bottle packshot', 1],
        ['showcase', 'image', 'South Indian Khus Root Harvest', '/img/ingredients/vetiver_khus_root.png', 'Earthy organic South Indian Khus roots cold-steeping', 1],
        ['showcase', 'image', 'Blend II — Chamomile Bottle Packshot', '/img/bottles/chamomile_isolated.png', 'NOMU German Chamomile isolated bottle packshot', 1],
        ['showcase', 'image', 'Chamomile Blossoms & Lavender Harvest', '/img/ingredients/chamomile_lavender_harvest.jpg', 'Fresh Egyptian and German chamomile blossoms', 1],
        ['showcase', 'image', 'Blend III — Grapefruit Bottle Packshot', '/img/bottles/grapefruit_isolated.png', 'NOMU Grapefruit isolated bottle packshot', 1],
        ['showcase', 'image', 'Ruby Red Grapefruit Peel Harvest', '/img/ingredients/grapefruit_harvest.jpg', 'Sun-drenched citrus peel and essential oil distillation', 1],
        ['showcase', 'image', 'Blend IV — Lemongrass Bottle Packshot', '/img/bottles/lemongrass_isolated.png', 'NOMU Lemongrass isolated bottle packshot', 1],
        ['showcase', 'image', 'Lemongrass Harvest', '/img/ingredients/lemongrass_harvest.jpg', 'Fresh high-altitude lemongrass stalks', 1],
        ['brand', 'image', 'NOMU Master Brand Symbol', '/img/nomu/nomu_symbol_master.png', 'NOMU primary botanical brand symbol logo', 1],
        ['brand', 'image', 'NOMU Wordmark Transparent', '/img/nomu/nomu_wordmark_transparent.png', 'NOMU architectural wordmark logo', 1]
    ];

    $pdo->exec("DELETE FROM media_assets WHERE url LIKE '%nomu_logo_clean.png%'");

    $insMedia = $pdo->prepare("{$insertIgnore} media_assets (section_key, asset_type, title, url, alt_text, is_active) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($mediaDefaults as $m) {
        $insMedia->execute($m);
        if ($insMedia->rowCount() > 0) $seeded['media']++;
    }

    // 3. Seed Authentic Community Reviews
    $reviewsDefaults = [
        ['Dr. Radhika Menon', 'radhika.m@apollohospitals.com', 'vetiver', 5, 'Gentle, non-acidic hydration for long clinical shifts', 'I keep a bottle of Vetiver chilled during long OT rotations. Unlike sparkling flavored water that triggers acid reflux, NOMU is silky smooth, subtly earthy, and leaves no sugar crash.', 'approved', 1, date('Y-m-d H:i:s'), 'System Seeder', '127.0.0.1'],
        ['Vikramaditya S.', 'vikram.s@thehindu.co.in', 'chamomile', 5, 'Replaced my evening chamomile tea with cold distilled NOMU', 'The floral notes are authentic, not synthetic essence. It has become my wind-down ritual at 9 PM after newsroom deadlines. Clean, relaxing, and exceptional glass packaging.', 'approved', 1, date('Y-m-d H:i:s'), 'System Seeder', '127.0.0.1'],
        ['Ananya Deshmukh', 'ananya.deshmukh@studioarch.in', 'grapefruit', 5, 'Vibrant ruby peel aroma with zero calories', 'The citrus peel distillation captures pure essential limonene aromatics. It feels luxurious, perfectly tart, and makes drinking 2 liters of daily water a genuine pleasure.', 'approved', 1, date('Y-m-d H:i:s'), 'System Seeder', '127.0.0.1'],
        ['Karthik R.', 'karthik.r@zoho.com', 'lemongrass', 5, 'Crisp lemongrass with a refreshing mineral finish', 'Ordered the 12-pack discovery box on WhatsApp. Arrived promptly at our doorstep in Besant Nagar. Lemongrass is crisp, uplifting, and pairs remarkably well with light South Indian meals.', 'approved', 1, date('Y-m-d H:i:s'), 'System Seeder', '127.0.0.1']
    ];

    $chkRev = $pdo->query("SELECT COUNT(*) FROM reviews")->fetchColumn();
    if ($chkRev == 0 || $force) {
        $insRev = $pdo->prepare("INSERT INTO reviews (customer_name, customer_email, flavor_key, rating, headline, review_text, status, is_visible, moderated_at, moderated_by, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($reviewsDefaults as $r) {
            $insRev->execute($r);
            $seeded['reviews']++;
        }
    }

    // 4. Seed Demo Influencer Coupons (Non-production staging/local only, explicit force seed)
    // Production starts clean so real influencer codes & sales tracking start at ₹0 with no fake metrics.
    if (!$isProdDomain && $force) {
        $couponDefaults = [
            ['VARUN10', 'Varun (Founder Campaign)', '@varun.nomu', 'percentage', 10.0, 0.0, null, 14, 4480.0, 448.0, 1, 'Founder personal ritual code'],
            ['FITNESSRITUAL', 'Rahul FitLife', '@rahul_fitness_chennai', 'percentage', 15.0, 160.0, 100, 9, 2880.0, 432.0, 1, 'Chennai athletic community collaboration'],
            ['ANANYA15', 'Ananya Deshmukh', '@ananya.wellness', 'percentage', 15.0, 160.0, 50, 7, 2240.0, 336.0, 1, 'Holistic living & yoga community'],
            ['WELCOME50', 'Chennai Gourmet Club', '@chennaifoodguide', 'fixed', 50.0, 320.0, null, 4, 1920.0, 200.0, 1, 'Flat ₹50 off on 8-pack and 12-pack ritual boxes']
        ];
        $insCpn = $pdo->prepare("{$insertIgnore} coupons (code, influencer_name, influencer_handle, discount_type, discount_value, min_order_amount, usage_limit, times_used, total_sales_generated, total_discount_granted, is_active, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($couponDefaults as $cp) {
            $insCpn->execute($cp);
            if ($insCpn->rowCount() > 0) $seeded['coupons'] = ($seeded['coupons'] ?? 0) + 1;
        }
    }

    return $seeded;
}

// Auto-seed if empty
seedDatabase($pdo, false, $isProdDomain);

// Helper: System Logger
function nomuLog(PDO $pdo, string $level, string $action, string $msg, array $ctx = []): void {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("INSERT INTO system_logs (level, action, message, context_json, ip_address) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([strtoupper($level), $action, $msg, json_encode($ctx), $ip]);
    } catch (\Throwable $e) {}
}

// Helper: Base64URL Encoding / Decoding
function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string {
    $pad = strlen($data) % 4;
    if ($pad) {
        $data .= str_repeat('=', 4 - $pad);
    }
    return (string)base64_decode(strtr($data, '-_', '+/'));
}

// Helper: Issue HMAC-SHA256 Signed Expiring Admin Session Token
function issueAdminToken(string $username, string $secret, int $ttl): string {
    $now = time();
    $payload = json_encode([
        'sub' => $username,
        'iat' => $now,
        'exp' => $now + $ttl,
        'jti' => bin2hex(random_bytes(12))
    ]);
    $encoded = base64UrlEncode((string)$payload);
    $sig = base64UrlEncode(hash_hmac('sha256', $encoded, $secret, true));
    return $encoded . '.' . $sig;
}

// Helper: Extract Authorization Header across Apache/LiteSpeed/FPM SAPIs
function getAuthorizationHeader(): string {
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        return (string)$_SERVER['HTTP_AUTHORIZATION'];
    }
    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return (string)$_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower((string)$k) === 'authorization') {
                return (string)$v;
            }
        }
    }
    return '';
}

// Helper: Admin Authentication Verification (Strict Bearer Header + HMAC-SHA256 + Expiry; No Query-String Tokens)
function verifyAdmin(): bool {
    global $ADMIN_SIGNING_SECRET, $ADMIN_USERNAME;
    if (empty($ADMIN_SIGNING_SECRET)) {
        return false;
    }
    $auth = trim(getAuthorizationHeader());
    if (!str_starts_with($auth, 'Bearer ')) {
        return false;
    }
    $token = trim(substr($auth, 7));
    if ($token === '' || substr_count($token, '.') !== 1) {
        return false;
    }
    [$encodedPayload, $encodedSig] = explode('.', $token, 2);
    $expectedSig = base64UrlEncode(hash_hmac('sha256', $encodedPayload, $ADMIN_SIGNING_SECRET, true));
    if (!hash_equals($expectedSig, $encodedSig)) {
        return false;
    }
    $payload = json_decode(base64UrlDecode($encodedPayload), true);
    if (!is_array($payload)) {
        return false;
    }
    $exp = (int)($payload['exp'] ?? 0);
    $sub = (string)($payload['sub'] ?? '');
    if ($exp <= time() || !hash_equals($ADMIN_USERNAME, $sub)) {
        return false;
    }
    return true;
}

// Helper: Sliding-Window Per-IP Rate Limiter
function checkRateLimit(PDO $pdo, string $bucket, int $maxHits, int $windowSeconds): bool {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $ipHash = hash('sha256', $ip . '|nomu_rl_v1');
        $now = time();
        $stmt = $pdo->prepare("SELECT hits, window_start FROM rate_limits WHERE ip_hash = ? AND bucket = ?");
        $stmt->execute([$ipHash, $bucket]);
        $row = $stmt->fetch();
        if (!$row || ($now - (int)$row['window_start']) >= $windowSeconds) {
            $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            $sql = ($driver === 'mysql')
                ? "INSERT INTO rate_limits (ip_hash, bucket, hits, window_start) VALUES (?, ?, 1, ?) ON DUPLICATE KEY UPDATE hits = 1, window_start = VALUES(window_start)"
                : "INSERT INTO rate_limits (ip_hash, bucket, hits, window_start) VALUES (?, ?, 1, ?) ON CONFLICT(ip_hash, bucket) DO UPDATE SET hits = 1, window_start = excluded.window_start";
            $pdo->prepare($sql)->execute([$ipHash, $bucket, $now]);
            return true;
        }
        if ((int)$row['hits'] >= $maxHits) {
            return false;
        }
        $pdo->prepare("UPDATE rate_limits SET hits = hits + 1 WHERE ip_hash = ? AND bucket = ?")->execute([$ipHash, $bucket]);
        return true;
    } catch (\Throwable $e) {
        return true;
    }
}

// Helper: Strict Google Fonts Stylesheet URL Allowlist (Blocks Arbitrary CSS Injection)
function sanitizeFontStylesheetUrl(string $url): string {
    $url = trim($url);
    if ($url === '') {
        return '';
    }
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        return '';
    }
    $parts = parse_url($url);
    $scheme = strtolower((string)($parts['scheme'] ?? ''));
    $host = strtolower((string)($parts['host'] ?? ''));
    if ($scheme !== 'https' || $host !== 'fonts.googleapis.com') {
        return '';
    }
    return filter_var($url, FILTER_SANITIZE_URL) ?: '';
}

// Helper: Strict CSS Font Family Allowlist
function sanitizeFontFamily(string $font): string {
    $font = trim($font);
    if ($font === '' || strlen($font) > 120) {
        return '';
    }
    if (!preg_match('/^[A-Za-z0-9\s,\'\"\-]+$/', $font)) {
        return '';
    }
    return $font;
}

// Helper: Neutralize Spreadsheet Formula / CSV Injection (DDE Protection)
function sanitizeCsvCell(mixed $val): string {
    $str = (string)($val ?? '');
    if ($str !== '' && in_array($str[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
        return "'" . $str;
    }
    return $str;
}

// Helper: Sanitize Media URLs (defense against Stored XSS & path traversal)
function sanitizeMediaUrl(string $url): string {
    $url = trim($url);
    if (empty($url)) {
        return '';
    }
    // Block dangerous pseudo-protocols
    if (preg_match('#^(javascript|data|vbscript|file):#i', $url)) {
        return '';
    }
    // Allow relative paths starting with / (e.g. /uploads/..., /img/..., /video/...)
    if (str_starts_with($url, '/')) {
        if (str_contains($url, '..')) {
            return '';
        }
        return htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
    }
    // Allow valid http / https URLs
    if (filter_var($url, FILTER_VALIDATE_URL)) {
        $scheme = parse_url($url, PHP_URL_SCHEME);
        if (in_array(strtolower((string)$scheme), ['http', 'https'], true)) {
            return htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
        }
    }
    return '';
}

// --------------------------------------------------------------------------
// Request Routing
// --------------------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$pathInfo = $_SERVER['PATH_INFO'] ?? '';
if (empty($pathInfo)) {
    $pathInfo = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
}
$pathInfo = preg_replace('#^/api#', '', $pathInfo);
$pathInfo = '/' . trim($pathInfo, '/');

// 0. PUBLIC: GET /health or /status
if ($method === 'GET' && ($pathInfo === '/health' || $pathInfo === '/status')) {
    echo json_encode([
        'status' => 'healthy',
        'service' => 'NOMU Botanical Distillates Engine',
        'driver' => $pdo->getAttribute(PDO::ATTR_DRIVER_NAME),
        'server_time' => date('c')
    ]);
    exit;
}

// 1. PUBLIC: GET /content
if ($method === 'GET' && ($pathInfo === '/content' || $pathInfo === '/')) {
    $stmt = $pdo->query("SELECT field_key, field_value FROM cms_contents");
    $result = [];
    while ($row = $stmt->fetch()) {
        $result[$row['field_key']] = $row['field_value'];
    }
    echo json_encode($result);
    exit;
}

// 1b. PUBLIC: GET /font (retrieve active storefront typography settings)
if ($method === 'GET' && ($pathInfo === '/font' || $pathInfo === '/api/font')) {
    $stmt = $pdo->prepare("SELECT field_key, field_value FROM cms_contents WHERE field_key IN ('font_family', 'font_stylesheet_url', 'font_preset')");
    $stmt->execute();
    $fontConfig = [
        'font_family' => "'Bricolage Grotesque', sans-serif",
        'font_stylesheet_url' => 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap',
        'font_preset' => 'bricolage'
    ];
    while ($row = $stmt->fetch()) {
        $fontConfig[$row['field_key']] = $row['field_value'];
    }
    echo json_encode(['status' => 'success', 'font' => $fontConfig]);
    exit;
}

// 1c. ADMIN-PROTECTED: POST /font (update storefront typography from Admin)
if ($method === 'POST' && ($pathInfo === '/font' || $pathInfo === '/api/font')) {
    if (!verifyAdmin()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized', 'message' => 'Admin authentication required to update typography.']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data payload']);
        exit;
    }

    $fontFamily = sanitizeFontFamily((string)($input['font_family'] ?? ''));
    if (empty($fontFamily)) {
        http_response_code(422);
        echo json_encode(['error' => 'Invalid or missing font_family']);
        exit;
    }

    $rawStylesheet = trim((string)($input['font_stylesheet_url'] ?? ''));
    $fontStylesheet = '';
    if ($rawStylesheet !== '') {
        $fontStylesheet = sanitizeFontStylesheetUrl($rawStylesheet);
        if ($fontStylesheet === '') {
            http_response_code(422);
            echo json_encode(['error' => 'Only https://fonts.googleapis.com/ font stylesheets are permitted.']);
            exit;
        }
    }
    $fontPreset = preg_replace('/[^a-zA-Z0-9_-]/', '', trim((string)($input['font_preset'] ?? 'custom'))) ?: 'custom';

    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $upsertSql = ($driver === 'mysql')
        ? "INSERT INTO cms_contents (field_key, field_value, field_group) VALUES (?, ?, 'design') ON DUPLICATE KEY UPDATE field_value = VALUES(field_value), updated_at = CURRENT_TIMESTAMP"
        : "INSERT INTO cms_contents (field_key, field_value, field_group) VALUES (?, ?, 'design') ON CONFLICT(field_key) DO UPDATE SET field_value = excluded.field_value, updated_at = CURRENT_TIMESTAMP";

    $upd = $pdo->prepare($upsertSql);
    $upd->execute(['font_family', $fontFamily]);
    if ($fontStylesheet !== '') {
        $upd->execute(['font_stylesheet_url', $fontStylesheet]);
    }
    $upd->execute(['font_preset', $fontPreset]);

    nomuLog($pdo, 'NOTICE', 'FONT_UPDATED', "Storefront font updated to {$fontFamily} (preset: {$fontPreset})");

    echo json_encode([
        'status' => 'success',
        'message' => 'Font updated successfully',
        'font' => [
            'font_family' => $fontFamily,
            'font_stylesheet_url' => $fontStylesheet,
            'font_preset' => $fontPreset
        ]
    ]);
    exit;
}

// 1d. PUBLIC: GET /coupons/validate (validate coupon for checkout)
if ($method === 'GET' && ($pathInfo === '/coupons/validate' || $pathInfo === '/api/coupons/validate')) {
    if (!checkRateLimit($pdo, 'coupon_validate', 30, 300)) {
        http_response_code(429);
        echo json_encode(['valid' => false, 'message' => 'Too many coupon attempts. Please wait a few minutes and try again.']);
        exit;
    }
    $code = strtoupper(trim((string)($_GET['code'] ?? '')));
    $amount = (float)($_GET['amount'] ?? 0);

    if (empty($code)) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'Please enter a coupon code.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM coupons WHERE UPPER(code) = ? LIMIT 1");
    $stmt->execute([$code]);
    $cpn = $stmt->fetch();

    if (!$cpn) {
        http_response_code(404);
        echo json_encode(['valid' => false, 'message' => "Coupon code '{$code}' not recognized."]);
        exit;
    }

    if ((int)$cpn['is_active'] !== 1) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => "Coupon '{$code}' is currently inactive."]);
        exit;
    }

    if ($cpn['usage_limit'] !== null && (int)$cpn['times_used'] >= (int)$cpn['usage_limit']) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => "Coupon '{$code}' redemption limit has been reached."]);
        exit;
    }

    $minOrder = (float)$cpn['min_order_amount'];
    if ($amount > 0 && $amount < $minOrder) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => "Minimum order of ₹{$minOrder} required to activate '{$code}'."]);
        exit;
    }

    $discountValue = (float)$cpn['discount_value'];
    $discountAmount = 0.0;
    if ($cpn['discount_type'] === 'percentage') {
        $discountAmount = round(($amount * $discountValue) / 100, 2);
    } else {
        $discountAmount = $discountValue;
    }
    $discountAmount = min($amount, $discountAmount);
    $finalAmount = max(0, round($amount - $discountAmount, 2));

    $discountDesc = $cpn['discount_type'] === 'percentage' ? "{$discountValue}% Off" : "₹{$discountValue} Off";

    echo json_encode([
        'valid' => true,
        'code' => $cpn['code'],
        'influencer_name' => $cpn['influencer_name'],
        'influencer_handle' => $cpn['influencer_handle'],
        'discount_type' => $cpn['discount_type'],
        'discount_value' => $discountValue,
        'discount_amount' => $discountAmount,
        'final_amount' => $finalAmount,
        'min_order_amount' => $minOrder,
        'message' => "Applied! {$discountDesc} with referral from {$cpn['influencer_name']}."
    ]);
    exit;
}

// 2. PUBLIC: GET /reviews (approved and visible only)
if ($method === 'GET' && $pathInfo === '/reviews') {
    $flavor = $_GET['flavor'] ?? 'all';
    if ($flavor !== 'all') {
        $stmt = $pdo->prepare("SELECT id, customer_name, flavor_key, rating, headline, review_text, is_visible, created_at FROM reviews WHERE status = 'approved' AND (is_visible = 1 OR is_visible IS NULL) AND flavor_key = ? ORDER BY id DESC LIMIT 30");
        $stmt->execute([$flavor]);
    } else {
        $stmt = $pdo->query("SELECT id, customer_name, flavor_key, rating, headline, review_text, is_visible, created_at FROM reviews WHERE status = 'approved' AND (is_visible = 1 OR is_visible IS NULL) ORDER BY id DESC LIMIT 30");
    }
    $reviews = $stmt->fetchAll();
    echo json_encode(['status' => 'success', 'reviews' => $reviews]);
    exit;
}

// 3. PUBLIC: POST /reviews (save as pending)
if ($method === 'POST' && $pathInfo === '/reviews') {
    if (!checkRateLimit($pdo, 'reviews_post', 5, 900)) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many reviews submitted. Please try again later.']);
        exit;
    }
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    // Honeypot check
    if (!empty($input['_hp_security_check'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid submission']);
        exit;
    }

    $name = strip_tags(trim((string)($input['customer_name'] ?? '')));
    $email = filter_var(trim((string)($input['customer_email'] ?? '')), FILTER_VALIDATE_EMAIL);
    $flavor = trim((string)($input['flavor_key'] ?? ''));
    $rating = (int)($input['rating'] ?? 5);
    $headline = htmlspecialchars(trim((string)($input['headline'] ?? '')), ENT_QUOTES, 'UTF-8');
    $text = htmlspecialchars(trim((string)($input['review_text'] ?? '')), ENT_QUOTES, 'UTF-8');

    if (empty($name) || !$email || empty($headline) || empty($text) || !in_array($flavor, ['vetiver', 'chamomile', 'grapefruit', 'lemongrass'], true)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation error', 'message' => 'Please fill in all review fields with valid information.']);
        exit;
    }

    $rating = max(1, min(5, $rating));
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    $stmt = $pdo->prepare("INSERT INTO reviews (customer_name, customer_email, flavor_key, rating, headline, review_text, status, ip_address) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)");
    $stmt->execute([$name, $email, $flavor, $rating, $headline, $text, $ip]);
    $reviewId = (int)$pdo->lastInsertId();

    nomuLog($pdo, 'INFO', 'REVIEW_SUBMITTED', "New tasting note submitted for {$flavor} by {$name}", [
        'review_id' => $reviewId,
        'rating' => $rating
    ]);

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Your tasting note has been received and queued for review moderation.',
        'review_id' => $reviewId
    ]);
    exit;
}

// 4. PUBLIC: POST /orders (save ritual box order)
if ($method === 'POST' && $pathInfo === '/orders') {
    if (!checkRateLimit($pdo, 'orders_post', 10, 600)) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many orders submitted from this connection. Please wait a few minutes.']);
        exit;
    }
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    if (!empty($input['_hp_security_check'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid submission']);
        exit;
    }

    $name = strip_tags(trim((string)($input['customer_name'] ?? '')));
    $phone = preg_replace('/\D/', '', (string)($input['customer_phone'] ?? ''));
    $email = filter_var(trim((string)($input['customer_email'] ?? '')), FILTER_VALIDATE_EMAIL);
    $address = htmlspecialchars(trim((string)($input['delivery_address'] ?? '')), ENT_QUOTES, 'UTF-8');
    $notes = isset($input['notes']) ? htmlspecialchars(trim((string)$input['notes']), ENT_QUOTES, 'UTF-8') : null;
    $items = is_array($input['items'] ?? null) ? $input['items'] : [];
    
    // Authoritative Nomu catalog pack definitions: 1, 4, or 12 bottles per pack (CWE-602).
    // Client bottle counts and prices are strictly derived from authoritative definitions.
    $canonicalPacks = [
        'single' => 1,
        'pack4'  => 4,
        'pack3'  => 4,
        'pack12' => 12,
    ];

    $calculatedBottles = 0;
    $calculatedGross = 0.0;
    foreach ($items as &$it) {
        $qty = max(1, (int)($it['quantity'] ?? 1));
        $packKey = strtolower(trim((string)($it['packKey'] ?? $it['pack_key'] ?? '')));
        if (isset($canonicalPacks[$packKey])) {
            $bottlesPerPack = $canonicalPacks[$packKey];
        } else {
            $packStr = strtolower((string)($it['pack'] ?? ''));
            if (strpos($packStr, '12') !== false) {
                $bottlesPerPack = 12;
            } elseif (strpos($packStr, '4') !== false || strpos($packStr, '3') !== false) {
                $bottlesPerPack = 4;
            } else {
                $bottlesPerPack = 1;
            }
        }
        $lineBottles = $qty * $bottlesPerPack;
        $linePrice = (float)($lineBottles * 40.0);

        // Normalize item line fields to authoritative server values
        $it['quantity'] = $qty;
        $it['bottles'] = $lineBottles;
        $it['bottlesPerPack'] = $bottlesPerPack;
        $it['price'] = $linePrice;

        $calculatedBottles += $lineBottles;
        $calculatedGross += $linePrice;
    }
    unset($it);
    
    $totalBottles = max(1, $calculatedBottles);
    $grossTotal = (float)($totalBottles * 40.0);
    $totalAmount = $grossTotal;
    // Always generate an authoritative unique order reference on the server to prevent replay/duplicate collisions (CWE-841)
    $orderRef = 'NOMU-' . strtoupper(substr(bin2hex(random_bytes(5)), 0, 10));

    if (empty($name) || strlen($phone) !== 10 || !$email || empty($address) || empty($items)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation error', 'message' => 'Please provide valid Name, 10-digit Phone, Email, Delivery Address, and at least one item.']);
        exit;
    }

    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    $couponCode = strtoupper(preg_replace('/[^A-Za-z0-9\-_]/', '', trim((string)($input['coupon_code'] ?? ''))));
    $discountAmount = 0.0;
    $influencerName = '';
    $cpn = null;

    if (!empty($couponCode)) {
        $cStmt = $pdo->prepare("SELECT * FROM coupons WHERE UPPER(code) = ? AND is_active = 1");
        $cStmt->execute([$couponCode]);
        $cpn = $cStmt->fetch();
        $underLimit = $cpn && ($cpn['usage_limit'] === null || (int)$cpn['times_used'] < (int)$cpn['usage_limit']);
        $meetsMin = $cpn && ($grossTotal >= (float)$cpn['min_order_amount']);
        if ($cpn && $underLimit && $meetsMin) {
            $influencerName = $cpn['influencer_name'];
            $expectedDiscount = ($cpn['discount_type'] === 'percentage')
                ? round(($grossTotal * (float)$cpn['discount_value']) / 100, 2)
                : (float)$cpn['discount_value'];
            $discountAmount = min($expectedDiscount, $grossTotal);
            $totalAmount = max(0.0, $grossTotal - $discountAmount);
        } else {
            // Invalid, paused, or exhausted coupon — clear attribution
            $couponCode = '';
            $discountAmount = 0.0;
            $influencerName = '';
            $cpn = null;
        }
    }

    // Atomic transaction for order insertion and coupon accounting (CWE-841)
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("
            INSERT INTO orders (order_ref, customer_name, customer_phone, customer_email, delivery_address, notes, items_json, total_bottles, total_amount, status, ip_address, coupon_code, discount_amount, influencer_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
        ");
        $stmt->execute([
            $orderRef,
            $name,
            $phone,
            $email,
            $address,
            $notes,
            json_encode($items),
            $totalBottles,
            $totalAmount,
            $ip,
            $couponCode ?: null,
            $discountAmount,
            $influencerName ?: null
        ]);
        $orderId = (int)$pdo->lastInsertId();

        // Atomically update coupon usage only within active transaction
        if ($cpn && !empty($couponCode)) {
            $updCpn = $pdo->prepare("
                UPDATE coupons 
                SET times_used = times_used + 1, 
                    total_sales_generated = total_sales_generated + ?, 
                    total_discount_granted = total_discount_granted + ?, 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = ? AND is_active = 1 AND (usage_limit IS NULL OR times_used < usage_limit)
            ");
            $updCpn->execute([$totalAmount, $discountAmount, $cpn['id']]);
            if ($updCpn->rowCount() === 0 && $cpn['usage_limit'] !== null) {
                // Concurrently exhausted limit — rollback transaction
                $pdo->rollBack();
                http_response_code(409);
                echo json_encode(['error' => 'Coupon exhausted', 'message' => 'This coupon has just reached its maximum usage limit.']);
                exit;
            }
        }

        $pdo->commit();
    } catch (\Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        nomuLog($pdo, 'ERROR', 'ORDER_CREATION_FAILED', "Order creation failed: " . $e->getMessage(), ['order_ref' => $orderRef]);
        http_response_code(500);
        echo json_encode(['error' => 'Server error', 'message' => 'Failed to process order. Please try again.']);
        exit;
    }

    if ($cpn && !empty($couponCode)) {
        nomuLog($pdo, 'INFO', 'INFLUENCER_COUPON_REDEEMED', "Coupon {$couponCode} used by {$name} (Influencer: {$influencerName}, Discount: INR {$discountAmount})", [
            'coupon' => $couponCode,
            'influencer' => $influencerName,
            'order_ref' => $orderRef,
            'amount' => $totalAmount,
            'discount' => $discountAmount
        ]);
    }

    nomuLog($pdo, 'INFO', 'ORDER_CREATED', "New ritual order {$orderRef} from {$name} (INR {$totalAmount})", [
        'order_id' => $orderId,
        'order_ref' => $orderRef,
        'bottles' => $totalBottles,
        'amount' => $totalAmount
    ]);

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Order registered successfully',
        'order_ref' => $orderRef,
        'order_id' => $orderId
    ]);
    exit;
}

// --------------------------------------------------------------------------
// ADMIN LOGIN AUTHENTICATION (PUBLIC — Rate Limited, Bcrypt + HMAC Expiring Session Token)
// --------------------------------------------------------------------------
if ($method === 'POST' && ($pathInfo === '/admin/login' || $pathInfo === '/login')) {
    if (!checkRateLimit($pdo, 'admin_login', 8, 900)) {
        nomuLog($pdo, 'WARN', 'ADMIN_LOGIN_RATE_LIMITED', 'Admin login rate limit exceeded');
        http_response_code(429);
        echo json_encode(['error' => 'Too many failed login attempts. Please wait 15 minutes before trying again.']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $username = trim((string)($input['username'] ?? ''));
    $password = trim((string)($input['password'] ?? ''));

    if (empty($ADMIN_SIGNING_SECRET) || empty($ADMIN_PASSWORD_HASHES)) {
        http_response_code(503);
        echo json_encode(['error' => 'Administrative authentication is not configured on this server.']);
        exit;
    }

    $userMatch = ($username !== '' && hash_equals($ADMIN_USERNAME, $username));
    $passMatch = false;
    if ($password !== '') {
        foreach ($ADMIN_PASSWORD_HASHES as $hash) {
            if (is_string($hash) && password_verify($password, $hash)) {
                $passMatch = true;
                break;
            }
        }
    }

    if ($userMatch && $passMatch) {
        $sessionToken = issueAdminToken($ADMIN_USERNAME, $ADMIN_SIGNING_SECRET, $TOKEN_TTL_SECONDS);
        nomuLog($pdo, 'INFO', 'ADMIN_LOGIN_SUCCESS', "Admin {$ADMIN_USERNAME} logged in successfully");
        echo json_encode([
            'status' => 'success',
            'token' => $sessionToken,
            'expires_in' => $TOKEN_TTL_SECONDS,
            'user' => [
                'username' => $ADMIN_USERNAME,
                'role' => 'Administrator',
                'permissions' => ['orders', 'reviews', 'coupons', 'cms', 'telemetry']
            ]
        ]);
        exit;
    }

    nomuLog($pdo, 'WARN', 'ADMIN_LOGIN_FAILED', "Failed login attempt for username: " . substr($username, 0, 40));
    http_response_code(401);
    echo json_encode(['error' => 'Invalid administrative credentials']);
    exit;
}

// --------------------------------------------------------------------------
// MEDIA ASSETS CATALOG (PUBLIC)
// --------------------------------------------------------------------------
if ($method === 'GET' && $pathInfo === '/media') {
    $section = $_GET['section'] ?? '';
    if ($section) {
        $stmt = $pdo->prepare("SELECT * FROM media_assets WHERE section_key = ? AND is_active = 1 ORDER BY id ASC");
        $stmt->execute([$section]);
    } else {
        $stmt = $pdo->query("SELECT * FROM media_assets WHERE is_active = 1 ORDER BY id ASC");
    }
    $assets = $stmt->fetchAll();
    echo json_encode(['status' => 'success', 'count' => count($assets), 'assets' => $assets]);
    exit;
}

// --------------------------------------------------------------------------
// ADMIN ENDPOINTS (Require Authorization)
// --------------------------------------------------------------------------
if (str_starts_with($pathInfo, '/admin')) {
    if (!verifyAdmin()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized', 'message' => 'Valid admin bearer token required']);
        exit;
    }

    // A. GET /admin/orders
    if ($method === 'GET' && $pathInfo === '/admin/orders') {
        $status = $_GET['status'] ?? 'all';
        $search = trim((string)($_GET['search'] ?? ''));
        $export = $_GET['export'] ?? '';

        $sql = "SELECT * FROM orders WHERE 1=1";
        $params = [];

        if ($status !== 'all' && in_array($status, ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'], true)) {
            $sql .= " AND status = :status";
            $params[':status'] = $status;
        }

        $couponCodeFilter = trim((string)($_GET['coupon_code'] ?? ''));
        if (!empty($couponCodeFilter)) {
            $sql .= " AND coupon_code = :coupon_code";
            $params[':coupon_code'] = $couponCodeFilter;
        }

        if (!empty($search)) {
            $sql .= " AND (order_ref LIKE :q OR customer_name LIKE :q OR customer_phone LIKE :q OR customer_email LIKE :q)";
            $params[':q'] = "%{$search}%";
        }

        $sql .= " ORDER BY id DESC";

        if ($export === 'csv') {
            header('Content-Type: text/csv; charset=UTF-8');
            header('Content-Disposition: attachment; filename="nomu_confirmed_orders_' . date('Y-m-d_His') . '.csv"');
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Date', 'Customer Name', 'Phone', 'Email', 'Bottles', 'Total Amount', 'Coupon Code', 'Discount (INR)', 'Influencer', 'Status', 'Address', 'Notes']);
            
            // CSV Export is strictly restricted to confirmed orders per operations protocol
            $csvSql = "SELECT * FROM orders WHERE status = 'confirmed'";
            $csvParams = [];
            if (!empty($couponCodeFilter)) {
                $csvSql .= " AND coupon_code = :coupon_code";
                $csvParams[':coupon_code'] = $couponCodeFilter;
            }
            if (!empty($search)) {
                $csvSql .= " AND (customer_name LIKE :q OR customer_phone LIKE :q OR customer_email LIKE :q)";
                $csvParams[':q'] = "%{$search}%";
            }
            $csvSql .= " ORDER BY id DESC";

            $stmt = $pdo->prepare($csvSql);
            $stmt->execute($csvParams);
            while ($r = $stmt->fetch()) {
                fputcsv($out, [
                    sanitizeCsvCell($r['created_at']),
                    sanitizeCsvCell($r['customer_name']),
                    sanitizeCsvCell($r['customer_phone']),
                    sanitizeCsvCell($r['customer_email']),
                    $r['total_bottles'],
                    $r['total_amount'],
                    sanitizeCsvCell($r['coupon_code'] ?? ''),
                    $r['discount_amount'] ?? 0,
                    sanitizeCsvCell($r['influencer_name'] ?? ''),
                    sanitizeCsvCell($r['status']),
                    sanitizeCsvCell($r['delivery_address']),
                    sanitizeCsvCell($r['notes'] ?? '')
                ]);
            }
            fclose($out);
            exit;
        }

        $stmt = $pdo->prepare($sql . " LIMIT 100");
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        foreach ($orders as &$o) {
            $o['items'] = json_decode($o['items_json'] ?? '[]', true);
        }

        echo json_encode(['status' => 'success', 'orders' => $orders]);
        exit;
    }

    // A2. GET /admin/coupons (Influencer coupons and performance summary)
    if ($method === 'GET' && $pathInfo === '/admin/coupons') {
        $stmt = $pdo->query("SELECT * FROM coupons ORDER BY times_used DESC, created_at DESC");
        $coupons = $stmt->fetchAll();

        $totalCoupons = count($coupons);
        $activeCoupons = 0;
        $totalRedemptions = 0;
        $totalSales = 0.0;
        $totalDiscount = 0.0;

        foreach ($coupons as $c) {
            if ((int)$c['is_active'] === 1) $activeCoupons++;
            $totalRedemptions += (int)$c['times_used'];
            $totalSales += (float)$c['total_sales_generated'];
            $totalDiscount += (float)$c['total_discount_granted'];
        }

        // Fetch recent redemptions
        $rStmt = $pdo->query("SELECT id, order_ref, customer_name, customer_phone, total_amount, coupon_code, discount_amount, influencer_name, created_at FROM orders WHERE coupon_code IS NOT NULL AND coupon_code != '' ORDER BY id DESC LIMIT 50");
        $redemptions = $rStmt->fetchAll();

        echo json_encode([
            'status' => 'success',
            'summary' => [
                'total_coupons' => $totalCoupons,
                'active_coupons' => $activeCoupons,
                'total_redemptions' => $totalRedemptions,
                'total_sales' => round($totalSales, 2),
                'total_discount' => round($totalDiscount, 2)
            ],
            'coupons' => $coupons,
            'recent_redemptions' => $redemptions
        ]);
        exit;
    }

    // A3. POST /admin/coupons (Create new influencer coupon)
    if ($method === 'POST' && $pathInfo === '/admin/coupons') {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $code = strtoupper(preg_replace('/[^A-Za-z0-9\-_]/', '', trim((string)($input['code'] ?? ''))));
        $influencerName = strip_tags(trim((string)($input['influencer_name'] ?? '')));
        $influencerHandle = strip_tags(trim((string)($input['influencer_handle'] ?? '')));
        $discountType = in_array($input['discount_type'] ?? '', ['percentage', 'fixed'], true) ? $input['discount_type'] : 'percentage';
        $discountValue = (float)($input['discount_value'] ?? 0);
        $minOrder = (float)($input['min_order_amount'] ?? 0);
        $usageLimit = isset($input['usage_limit']) && $input['usage_limit'] !== '' ? (int)$input['usage_limit'] : null;
        $notes = htmlspecialchars(trim((string)($input['notes'] ?? '')), ENT_QUOTES, 'UTF-8');

        if (empty($code) || empty($influencerName) || $discountValue <= 0) {
            http_response_code(422);
            echo json_encode(['error' => 'Validation error', 'message' => 'Valid Code, Influencer Name, and Discount Value (> 0) are required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO coupons (code, influencer_name, influencer_handle, discount_type, discount_value, min_order_amount, usage_limit, notes, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)");
            $stmt->execute([$code, $influencerName, $influencerHandle, $discountType, $discountValue, $minOrder, $usageLimit, $notes]);
            $cpnId = (int)$pdo->lastInsertId();

            nomuLog($pdo, 'INFO', 'COUPON_CREATED', "New coupon {$code} created for {$influencerName} ({$discountType} {$discountValue})");
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => "Coupon {$code} created successfully", 'id' => $cpnId]);
        } catch (\PDOException $e) {
            if (str_contains($e->getMessage(), 'UNIQUE') || str_contains($e->getMessage(), 'Duplicate')) {
                http_response_code(409);
                echo json_encode(['error' => "Coupon code '{$code}' already exists. Please choose a unique code."]);
            } else {
                nomuLog($pdo, 'ERROR', 'COUPON_DB_ERROR', 'Database error while saving coupon', ['err' => $e->getMessage()]);
                http_response_code(500);
                echo json_encode(['error' => 'Internal database error']);
            }
        }
        exit;
    }

    // A3.5. GET /admin/coupons/{id} (Fetch single coupon for edit/inspect)
    if ($method === 'GET' && preg_match('#^/admin/coupons/(\\d+)$#', $pathInfo, $m)) {
        $id = (int)$m[1];
        $stmt = $pdo->prepare("SELECT * FROM coupons WHERE id = ?");
        $stmt->execute([$id]);
        $coupon = $stmt->fetch();
        if (!$coupon) {
            http_response_code(404);
            echo json_encode(['error' => 'Coupon not found']);
            exit;
        }
        echo json_encode(['status' => 'success', 'coupon' => $coupon]);
        exit;
    }

    // A3.6. POST/PUT /admin/coupons/{id} (Update/Edit existing coupon)
    if (($method === 'POST' || $method === 'PUT') && preg_match('#^/admin/coupons/(\\d+)$#', $pathInfo, $m)) {
        $id = (int)$m[1];
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $code = strtoupper(preg_replace('/[^A-Za-z0-9\-_]/', '', trim((string)($input['code'] ?? ''))));
        $influencerName = strip_tags(trim((string)($input['influencer_name'] ?? '')));
        $influencerHandle = strip_tags(trim((string)($input['influencer_handle'] ?? '')));
        $discountType = in_array($input['discount_type'] ?? '', ['percentage', 'fixed'], true) ? $input['discount_type'] : 'percentage';
        $discountValue = (float)($input['discount_value'] ?? 0);
        $minOrder = (float)($input['min_order_amount'] ?? 0);
        $usageLimit = isset($input['usage_limit']) && $input['usage_limit'] !== '' && $input['usage_limit'] !== null ? (int)$input['usage_limit'] : null;
        $notes = htmlspecialchars(trim((string)($input['notes'] ?? '')), ENT_QUOTES, 'UTF-8');
        $isActive = isset($input['is_active']) ? ((int)$input['is_active'] ? 1 : 0) : null;

        if (empty($code) || empty($influencerName) || $discountValue <= 0) {
            http_response_code(422);
            echo json_encode(['error' => 'Validation error', 'message' => 'Valid Code, Influencer Name, and Discount Value (> 0) are required.']);
            exit;
        }

        // Verify coupon exists
        $chk = $pdo->prepare("SELECT id, code FROM coupons WHERE id = ?");
        $chk->execute([$id]);
        $existing = $chk->fetch();
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Coupon not found']);
            exit;
        }

        // Check if code was changed and is unique
        $uChk = $pdo->prepare("SELECT id FROM coupons WHERE code = ? AND id != ?");
        $uChk->execute([$code, $id]);
        if ($uChk->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => "Coupon code '{$code}' already exists for another campaign. Please choose a unique code."]);
            exit;
        }

        try {
            if ($isActive !== null) {
                $updStmt = $pdo->prepare("
                    UPDATE coupons 
                    SET code = ?, influencer_name = ?, influencer_handle = ?, discount_type = ?, 
                        discount_value = ?, min_order_amount = ?, usage_limit = ?, notes = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");
                $updStmt->execute([$code, $influencerName, $influencerHandle, $discountType, $discountValue, $minOrder, $usageLimit, $notes, $isActive, $id]);
            } else {
                $updStmt = $pdo->prepare("
                    UPDATE coupons 
                    SET code = ?, influencer_name = ?, influencer_handle = ?, discount_type = ?, 
                        discount_value = ?, min_order_amount = ?, usage_limit = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");
                $updStmt->execute([$code, $influencerName, $influencerHandle, $discountType, $discountValue, $minOrder, $usageLimit, $notes, $id]);
            }

            nomuLog($pdo, 'INFO', 'COUPON_UPDATED', "Coupon ID {$id} ({$code}) updated for {$influencerName} ({$discountType} {$discountValue})");
            echo json_encode(['status' => 'success', 'message' => "Coupon {$code} updated successfully"]);
        } catch (\PDOException $e) {
            nomuLog($pdo, 'ERROR', 'COUPON_UPDATE_DB_ERROR', 'Database error while updating coupon', ['err' => $e->getMessage()]);
            http_response_code(500);
            echo json_encode(['error' => 'Internal database error']);
        }
        exit;
    }

    // A4. POST /admin/coupons/{id}/toggle
    if ($method === 'POST' && preg_match('#^/admin/coupons/(\\d+)/toggle$#', $pathInfo, $m)) {
        $id = (int)$m[1];
        $pdo->prepare("UPDATE coupons SET is_active = 1 - is_active, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$id]);
        $newActive = (int)$pdo->query("SELECT is_active FROM coupons WHERE id = {$id}")->fetchColumn();
        nomuLog($pdo, 'INFO', 'COUPON_TOGGLED', "Coupon ID {$id} active set to {$newActive}");
        echo json_encode(['status' => 'success', 'is_active' => $newActive]);
        exit;
    }

    // A5. DELETE /admin/coupons/{id}
    if ($method === 'DELETE' && preg_match('#^/admin/coupons/(\\d+)$#', $pathInfo, $m)) {
        $id = (int)$m[1];
        $code = $pdo->query("SELECT code FROM coupons WHERE id = {$id}")->fetchColumn();
        $pdo->prepare("DELETE FROM coupons WHERE id = ?")->execute([$id]);
        nomuLog($pdo, 'NOTICE', 'COUPON_DELETED', "Coupon ID {$id} ({$code}) deleted");
        echo json_encode(['status' => 'success', 'message' => "Coupon deleted successfully"]);
        exit;
    }

    // B. POST /admin/orders/status
    if ($method === 'POST' && preg_match('#^/admin/orders/(\d+)/status#', $pathInfo, $m)) {
        $orderId = (int)$m[1];
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $newStatus = $input['status'] ?? '';

        if (!in_array($newStatus, ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$newStatus, $orderId]);

        nomuLog($pdo, 'NOTICE', 'ORDER_STATUS_CHANGED', "Order ID {$orderId} status changed to {$newStatus}", [
            'order_id' => $orderId,
            'new_status' => $newStatus
        ]);

        echo json_encode(['status' => 'success', 'message' => "Order updated to {$newStatus}"]);
        exit;
    }

    // C. GET /admin/reviews
    if ($method === 'GET' && $pathInfo === '/admin/reviews') {
        $status = $_GET['status'] ?? 'all';
        $sql = "SELECT * FROM reviews WHERE 1=1";
        $params = [];

        if ($status !== 'all' && in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $sql .= " AND status = :status";
            $params[':status'] = $status;
        }

        $sql .= " ORDER BY id DESC LIMIT 100";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $reviews = $stmt->fetchAll();

        echo json_encode(['status' => 'success', 'reviews' => $reviews]);
        exit;
    }

    // D. POST /admin/reviews/{id}/moderate
    if ($method === 'POST' && preg_match('#^/admin/reviews/(\d+)/moderate#', $pathInfo, $m)) {
        $reviewId = (int)$m[1];
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $action = $input['action'] ?? '';

        if ($action === 'delete') {
            $pdo->prepare("DELETE FROM reviews WHERE id = ?")->execute([$reviewId]);
            nomuLog($pdo, 'NOTICE', 'REVIEW_DELETED', "Review ID {$reviewId} permanently deleted");
            echo json_encode(['status' => 'success', 'message' => 'Review deleted']);
            exit;
        }

        if ($action === 'toggle_visibility') {
            $stmt = $pdo->prepare("SELECT is_visible FROM reviews WHERE id = ?");
            $stmt->execute([$reviewId]);
            $current = $stmt->fetchColumn();
            $newVisible = ($current === 1 || $current === '1' || $current === null) ? 0 : 1;
            $pdo->prepare("UPDATE reviews SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$newVisible, $reviewId]);
            $msg = $newVisible === 1 ? 'Review is now visible on site' : 'Review is now hidden from site';
            nomuLog($pdo, 'NOTICE', 'REVIEW_VISIBILITY_TOGGLED', "Review ID {$reviewId} visible={$newVisible}");
            echo json_encode(['status' => 'success', 'message' => $msg, 'is_visible' => $newVisible]);
            exit;
        }

        if ($action === 'show' || $action === 'hide') {
            $newVisible = ($action === 'show') ? 1 : 0;
            $pdo->prepare("UPDATE reviews SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$newVisible, $reviewId]);
            $msg = $newVisible === 1 ? 'Review is now visible on site' : 'Review is now hidden from site';
            nomuLog($pdo, 'NOTICE', 'REVIEW_VISIBILITY_SET', "Review ID {$reviewId} visible={$newVisible}");
            echo json_encode(['status' => 'success', 'message' => $msg, 'is_visible' => $newVisible]);
            exit;
        }

        if (!in_array($action, ['approve', 'reject'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid moderation action']);
            exit;
        }

        $newStatus = $action === 'approve' ? 'approved' : 'rejected';
        $newVisibility = $action === 'approve' ? 1 : 0;
        $stmt = $pdo->prepare("UPDATE reviews SET status = ?, is_visible = ?, moderated_at = CURRENT_TIMESTAMP, moderated_by = 'admin', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$newStatus, $newVisibility, $reviewId]);

        nomuLog($pdo, 'NOTICE', 'REVIEW_MODERATED', "Review ID {$reviewId} marked as {$newStatus}");

        echo json_encode(['status' => 'success', 'message' => "Review marked as {$newStatus}"]);
        exit;
    }

    // E. POST /admin/content
    if ($method === 'POST' && $pathInfo === '/admin/content') {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data payload']);
            exit;
        }

        $textKeys = ['hero_headline', 'hero_sub', 'ticker_text', 'font_family', 'font_stylesheet_url', 'font_preset', 'whatsapp_phone', 'banner_text'];
        $mediaKeys = [
            'site_logo',
            'hero_video_url', 'hero_poster_url',
            'vetiver_bottle_img', 'vetiver_ingredient_img', 'vetiver_splash_img', 'vetiver_packshot_img',
            'chamomile_bottle_img', 'chamomile_ingredient_img', 'chamomile_splash_img', 'chamomile_packshot_img',
            'grapefruit_bottle_img', 'grapefruit_ingredient_img', 'grapefruit_splash_img', 'grapefruit_packshot_img',
            'lemongrass_bottle_img', 'lemongrass_ingredient_img', 'lemongrass_splash_img', 'lemongrass_packshot_img',
            'about_image_url', 'manifesto_image_url'
        ];

        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        $upsertSql = ($driver === 'mysql')
            ? "INSERT INTO cms_contents (field_key, field_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE field_value = VALUES(field_value), updated_at = CURRENT_TIMESTAMP"
            : "INSERT INTO cms_contents (field_key, field_value) VALUES (?, ?) ON CONFLICT(field_key) DO UPDATE SET field_value = excluded.field_value, updated_at = CURRENT_TIMESTAMP";
        $upd = $pdo->prepare($upsertSql);

        $count = 0;
        foreach ($input as $k => $v) {
            if ($k === 'font_stylesheet_url') {
                $sanitized = sanitizeFontStylesheetUrl((string)$v);
                if ($sanitized !== '' || trim((string)$v) === '') {
                    $upd->execute([$k, $sanitized]);
                    $count++;
                }
            } elseif ($k === 'font_family') {
                $sanitized = sanitizeFontFamily((string)$v);
                if ($sanitized !== '') {
                    $upd->execute([$k, $sanitized]);
                    $count++;
                }
            } elseif ($k === 'whatsapp_phone') {
                $digits = preg_replace('/\D/', '', (string)$v);
                if (strlen($digits) >= 10 && strlen($digits) <= 15) {
                    $upd->execute([$k, $digits]);
                    $count++;
                }
            } elseif (in_array($k, $textKeys, true)) {
                $sanitized = htmlspecialchars(trim((string)$v), ENT_QUOTES, 'UTF-8');
                $upd->execute([$k, $sanitized]);
                $count++;
            } elseif (in_array($k, $mediaKeys, true)) {
                $sanitized = sanitizeMediaUrl((string)$v);
                $upd->execute([$k, $sanitized]);
                $count++;
            }
        }

        nomuLog($pdo, 'NOTICE', 'CMS_CONTENT_UPDATED', "Updated {$count} CMS content items");

        echo json_encode(['status' => 'success', 'message' => "Updated {$count} fields"]);
        exit;
    }

    // F. POST /admin/media/upload
    if ($method === 'POST' && $pathInfo === '/admin/media/upload') {
        if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No file uploaded', 'message' => 'Please select an image or video file to upload.']);
            exit;
        }

        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'Upload failed', 'code' => $file['error']]);
            exit;
        }

        // Maximum size: 25 MB
        $maxBytes = 25 * 1024 * 1024;
        if ($file['size'] > $maxBytes) {
            http_response_code(422);
            echo json_encode(['error' => 'File too large', 'message' => 'Uploaded file must be smaller than 25MB.']);
            exit;
        }

        // Magic byte verification via finfo
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'video/mp4'  => 'mp4',
            'video/webm' => 'webm'
        ];

        if (!isset($allowedMimes[$mime])) {
            http_response_code(422);
            echo json_encode([
                'error' => 'Invalid file format',
                'detected_mime' => $mime,
                'message' => 'Only JPG, PNG, WEBP images and MP4, WEBM videos are allowed.'
            ]);
            exit;
        }

        $ext = $allowedMimes[$mime];
        $filename = 'nomu_media_' . bin2hex(random_bytes(8)) . '.' . $ext;
        $uploadDir = realpath(__DIR__ . '/../uploads');
        if (!$uploadDir) {
            $uploadDir = __DIR__ . '/../uploads';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
        }

        $destination = $uploadDir . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            http_response_code(500);
            echo json_encode(['error' => 'Storage error', 'message' => 'Could not save uploaded file.']);
            exit;
        }

        // Safe permissions
        chmod($destination, 0644);

        $publicUrl = '/uploads/' . $filename;

        nomuLog($pdo, 'INFO', 'MEDIA_UPLOADED', "Uploaded media file {$filename} ({$mime}, {$file['size']} bytes)", [
            'filename' => $filename,
            'mime' => $mime,
            'size' => $file['size'],
            'url' => $publicUrl
        ]);

        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Media uploaded successfully',
            'url' => $publicUrl,
            'filename' => $filename,
            'mime' => $mime,
            'size' => $file['size']
        ]);
        exit;
    }

    // F. GET /admin/system/status
    if ($method === 'GET' && $pathInfo === '/admin/system/status') {
        $memUsage = round(memory_get_usage(true) / 1024 / 1024, 2);
        $memPeak = round(memory_get_peak_usage(true) / 1024 / 1024, 2);
        $diskFree = @disk_free_space('/') ? round(disk_free_space('/') / 1024 / 1024 / 1024, 2) : 'N/A';
        $diskTotal = @disk_total_space('/') ? round(disk_total_space('/') / 1024 / 1024 / 1024, 2) : 'N/A';

        $totalOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
        $pendingOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();
        $totalReviews = (int)$pdo->query("SELECT COUNT(*) FROM reviews")->fetchColumn();
        $pendingReviews = (int)$pdo->query("SELECT COUNT(*) FROM reviews WHERE status = 'pending'")->fetchColumn();

        echo json_encode([
            'status' => 'healthy',
            'timestamp' => date('c'),
            'runtime' => [
                'php_version' => PHP_VERSION,
                'sapi' => php_sapi_name(),
                'os' => PHP_OS,
                'memory_allocated_mb' => $memUsage,
                'memory_peak_mb' => $memPeak,
                'disk_free_gb' => $diskFree,
                'disk_total_gb' => $diskTotal,
                'opcache_active' => function_exists('opcache_get_status') && is_array(@opcache_get_status())
            ],
            'database' => [
                'driver' => $pdo->getAttribute(PDO::ATTR_DRIVER_NAME),
                'engine' => ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') ? 'MySQL Enterprise' : 'SQLite 3 (WAL)',
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_reviews' => $totalReviews,
                'pending_reviews' => $pendingReviews
            ]
        ]);
        exit;
    }

    // G. GET /admin/system/logs
    if ($method === 'GET' && $pathInfo === '/admin/system/logs') {
        $level = $_GET['level'] ?? 'all';
        $sql = "SELECT * FROM system_logs WHERE 1=1";
        $params = [];

        if ($level !== 'all') {
            $sql .= " AND level = :lvl";
            $params[':lvl'] = strtoupper($level);
        }

        $sql .= " ORDER BY id DESC LIMIT 100";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $logs = $stmt->fetchAll();

        echo json_encode(['status' => 'success', 'logs' => $logs]);
        exit;
    }

    // H. POST /admin/seed - Seed images, videos, and default records
    if ($method === 'POST' && $pathInfo === '/admin/seed') {
        $force = !empty($_GET['force']);
        $stats = seedDatabase($pdo, $force, $isProdDomain);
        nomuLog($pdo, 'INFO', 'DB_SEEDED', "Database seeded with images, videos, and default records", $stats);
        echo json_encode([
            'status' => 'success',
            'message' => 'Database successfully seeded with images and videos',
            'seeded' => $stats
        ]);
        exit;
    }
}

// 404 Not Found
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found', 'path' => $pathInfo]);
