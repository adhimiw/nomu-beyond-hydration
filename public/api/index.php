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

// CORS configuration (allow same-origin or localhost dev)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://pink-frog-219558.hostingersite.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080'
];
if (in_array($origin, $allowedOrigins, true)) {
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

// Initialize SQLite PDO Database Connection
try {
    $pdo = new PDO('sqlite:' . DB_PATH, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5
    ]);
    $pdo->exec('PRAGMA journal_mode = WAL;');
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'details' => $e->getMessage()]);
    exit;
}

// --------------------------------------------------------------------------
// Schema Auto-Migration & Seed Initialization
// --------------------------------------------------------------------------
$pdo->exec("
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(150) NOT NULL,
        flavor_key VARCHAR(50) NOT NULL,
        rating INTEGER DEFAULT 5,
        headline VARCHAR(200) NOT NULL,
        review_text TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        moderated_at DATETIME,
        moderated_by VARCHAR(100),
        ip_address VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cms_contents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field_key VARCHAR(80) UNIQUE NOT NULL,
        field_value TEXT,
        field_group VARCHAR(50) DEFAULT 'general',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS system_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level VARCHAR(20) DEFAULT 'INFO',
        action VARCHAR(60) NOT NULL,
        message TEXT NOT NULL,
        context_json TEXT,
        ip_address VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
");

// Seed default CMS content if empty
$chkCms = $pdo->query("SELECT COUNT(*) FROM cms_contents")->fetchColumn();
if ($chkCms == 0) {
    $insCms = $pdo->prepare("INSERT INTO cms_contents (field_key, field_value, field_group) VALUES (?, ?, ?)");
    $insCms->execute(['hero_headline', 'FOUR HERBS. ZERO NONSENSE.', 'hero']);
    $insCms->execute(['hero_sub', 'Ancient South Indian botanical distillates crafted in small batches across Chennai.', 'hero']);
    $insCms->execute(['ticker_text', '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS', 'general']);
    $insCms->execute(['font_family', 'editorial-serif', 'design']);
    $insCms->execute(['whatsapp_phone', '919840000000', 'contact']);
}

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
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $pathInfo = preg_replace('#^/api#', '', $uri);
}
$pathInfo = '/' . trim($pathInfo, '/');

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

// 2. PUBLIC: GET /reviews (approved only)
if ($method === 'GET' && $pathInfo === '/reviews') {
    $flavor = $_GET['flavor'] ?? 'all';
    if ($flavor !== 'all') {
        $stmt = $pdo->prepare("SELECT id, customer_name, flavor_key, rating, headline, review_text, created_at FROM reviews WHERE status = 'approved' AND flavor_key = ? ORDER BY id DESC LIMIT 30");
        $stmt->execute([$flavor]);
    } else {
        $stmt = $pdo->query("SELECT id, customer_name, flavor_key, rating, headline, review_text, created_at FROM reviews WHERE status = 'approved' ORDER BY id DESC LIMIT 30");
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

        if (!in_array($action, ['approve', 'reject'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid moderation action']);
            exit;
        }

        $newStatus = $action === 'approve' ? 'approved' : 'rejected';
        $stmt = $pdo->prepare("UPDATE reviews SET status = ?, moderated_at = CURRENT_TIMESTAMP, moderated_by = 'admin', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
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
}

// 404 Not Found
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found', 'path' => $pathInfo]);
