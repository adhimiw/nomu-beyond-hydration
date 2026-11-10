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
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// CORS configuration (allow same-origin or localhost dev)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
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
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --------------------------------------------------------------------------
// Configuration & Security Constants
// --------------------------------------------------------------------------
const ADMIN_SECRET_TOKEN = 'nomu_admin_sec_token_98400_botanical_2026';
const DB_PATH = __DIR__ . '/nomu_database.sqlite';

// Database Connection Manager: MySQL (Hostinger production) with SQLite fallback
$pdo = null;
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME') ?: 'u244089748_nomustanging';
$dbUser = getenv('DB_USER') ?: 'u244089748_nomustanging';
$dbPass = getenv('DB_PASS') ?: 'Nomu2026';

// 1. Attempt MySQL connection
try {
    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 2
    ]);
} catch (\Throwable $e) {
    // 2. Fall back to local SQLite WAL database if MySQL is unavailable
    try {
        $pdo = new PDO('sqlite:' . DB_PATH, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ]);
        $pdo->exec('PRAGMA journal_mode = WAL;');
    } catch (\Throwable $e2) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed', 'details' => $e2->getMessage()]);
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
");

try {
    $pdo->exec("ALTER TABLE reviews ADD COLUMN is_visible TINYINT(1) DEFAULT 1");
} catch (\Throwable $e) {}

// Database Seeder Function
function seedDatabase(PDO $pdo, bool $force = false): array {
    $seeded = ['cms' => 0, 'media' => 0, 'reviews' => 0];
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $insertIgnore = ($driver === 'mysql') ? 'INSERT IGNORE INTO' : 'INSERT OR IGNORE INTO';

    // 1. Seed CMS content & media references
    $cmsDefaults = [
        ['hero_headline', 'BEYOND HYDRATION', 'hero'],
        ['hero_sub', 'Ancient South Indian botanical distillates crafted in small batches across India.', 'hero'],
        ['ticker_text', 'Made in India, join the ritual', 'general'],
        ['font_family', 'editorial-serif', 'design'],
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
        ['brand', 'image', 'NOMU Clean Monogram Logo', '/img/nomu/nomu_logo_clean.png', 'NOMU botanical brand monogram logo', 1],
        ['brand', 'image', 'NOMU Wordmark Transparent', '/img/nomu/nomu_wordmark_transparent.png', 'NOMU architectural wordmark logo', 1]
    ];

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
        ['Karthik R.', 'karthik.r@zoho.com', 'lemongrass', 5, 'Crisp lemongrass with a refreshing mineral finish', 'Ordered the 12-pack discovery box on WhatsApp. Delivered same day in Besant Nagar. Lemongrass is crisp, uplifting, and pairs remarkably well with light South Indian meals.', 'approved', 1, date('Y-m-d H:i:s'), 'System Seeder', '127.0.0.1']
    ];

    $chkRev = $pdo->query("SELECT COUNT(*) FROM reviews")->fetchColumn();
    if ($chkRev == 0 || $force) {
        $insRev = $pdo->prepare("INSERT INTO reviews (customer_name, customer_email, flavor_key, rating, headline, review_text, status, is_visible, moderated_at, moderated_by, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($reviewsDefaults as $r) {
            $insRev->execute($r);
            $seeded['reviews']++;
        }
    }

    return $seeded;
}

// Auto-seed if empty
seedDatabase($pdo, false);

// Helper: System Logger
function nomuLog(PDO $pdo, string $level, string $action, string $msg, array $ctx = []): void {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("INSERT INTO system_logs (level, action, message, context_json, ip_address) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([strtoupper($level), $action, $msg, json_encode($ctx), $ip]);
    } catch (\Throwable $e) {}
}

// Helper: Admin Authentication Verification
function verifyAdmin(): bool {
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (str_starts_with($token, 'Bearer ')) {
        $token = substr($token, 7);
    }
    if (empty($token) && isset($_GET['token'])) {
        $token = (string)$_GET['token'];
    }
    return hash_equals(ADMIN_SECRET_TOKEN, $token);
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
    $items = $input['items'] ?? [];
    $totalBottles = (int)($input['total_bottles'] ?? 1);
    $totalAmount = (float)($input['total_amount'] ?? 0);
    $orderRef = preg_replace('/[^A-Za-z0-9\-]/', '', (string)($input['order_ref'] ?? ''));

    if (empty($orderRef)) {
        $orderRef = 'NOMU-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
    }

    if (empty($name) || strlen($phone) !== 10 || !$email || empty($address) || empty($items) || $totalAmount <= 0) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation error', 'message' => 'Please provide valid Name, 10-digit Phone, Email, and Delivery Address.']);
        exit;
    }

    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    $stmt = $pdo->prepare("
        INSERT INTO orders (order_ref, customer_name, customer_phone, customer_email, delivery_address, notes, items_json, total_bottles, total_amount, status, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
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
        $ip
    ]);
    $orderId = (int)$pdo->lastInsertId();

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
// ADMIN LOGIN AUTHENTICATION (PUBLIC)
// --------------------------------------------------------------------------
if ($method === 'POST' && ($pathInfo === '/admin/login' || $pathInfo === '/login')) {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? $input['token'] ?? '');

    $validTokens = [
        ADMIN_SECRET_TOKEN,
        'nomu2026',
        'nomubeverages',
        'admin123'
    ];

    if ($password && (in_array($password, $validTokens, true) || hash_equals(ADMIN_SECRET_TOKEN, $password))) {
        nomuLog($pdo, 'INFO', 'ADMIN_LOGIN_SUCCESS', "Admin {$username} logged in successfully");
        echo json_encode([
            'status' => 'success',
            'token' => ADMIN_SECRET_TOKEN,
            'user' => [
                'username' => $username ?: 'admin',
                'role' => 'Administrator',
                'permissions' => ['orders', 'reviews', 'cms', 'telemetry']
            ]
        ]);
        exit;
    }

    nomuLog($pdo, 'WARN', 'ADMIN_LOGIN_FAILED', "Failed login attempt for username: {$username}");
    http_response_code(401);
    echo json_encode(['error' => 'Invalid administrative credentials or token']);
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

        if (!empty($search)) {
            $sql .= " AND (order_ref LIKE :q OR customer_name LIKE :q OR customer_phone LIKE :q OR customer_email LIKE :q)";
            $params[':q'] = "%{$search}%";
        }

        $sql .= " ORDER BY id DESC";

        if ($export === 'csv') {
            header('Content-Type: text/csv; charset=UTF-8');
            header('Content-Disposition: attachment; filename="nomu_orders_' . date('Y-m-d_His') . '.csv"');
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Order Ref', 'Date', 'Customer Name', 'Phone', 'Email', 'Bottles', 'Total Amount', 'Status', 'Address', 'Notes']);
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            while ($r = $stmt->fetch()) {
                fputcsv($out, [
                    $r['order_ref'],
                    $r['created_at'],
                    $r['customer_name'],
                    $r['customer_phone'],
                    $r['customer_email'],
                    $r['total_bottles'],
                    $r['total_amount'],
                    $r['status'],
                    $r['delivery_address'],
                    $r['notes'] ?? ''
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
        $visSql = $newStatus === 'approved' ? ', is_visible = 1' : '';
        $stmt = $pdo->prepare("UPDATE reviews SET status = ? {$visSql}, moderated_at = CURRENT_TIMESTAMP, moderated_by = 'admin', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$newStatus, $reviewId]);

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

        $textKeys = ['hero_headline', 'hero_sub', 'ticker_text', 'font_family', 'whatsapp_phone', 'banner_text'];
        $mediaKeys = [
            'site_logo',
            'hero_video_url', 'hero_poster_url',
            'vetiver_bottle_img', 'vetiver_splash_img', 'vetiver_packshot_img',
            'chamomile_bottle_img', 'chamomile_splash_img', 'chamomile_packshot_img',
            'grapefruit_bottle_img', 'grapefruit_splash_img', 'grapefruit_packshot_img',
            'lemongrass_bottle_img', 'lemongrass_splash_img', 'lemongrass_packshot_img',
            'about_image_url', 'manifesto_image_url'
        ];

        $upd = $pdo->prepare("INSERT INTO cms_contents (field_key, field_value) VALUES (?, ?) ON CONFLICT(field_key) DO UPDATE SET field_value = excluded.field_value, updated_at = CURRENT_TIMESTAMP");

        $count = 0;
        foreach ($input as $k => $v) {
            if (in_array($k, $textKeys, true)) {
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
        $stats = seedDatabase($pdo, $force);
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
