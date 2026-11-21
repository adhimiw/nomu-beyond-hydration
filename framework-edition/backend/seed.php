<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Forbidden: CLI execution only.');
}

/**
 * NOMU Seeder CLI Runner
 * 
 * Usage:
 *   php seed.php          # Run standard seed (inserts missing records)
 *   php seed.php --force  # Force-updates CMS, media assets, and seeded reviews
 *   php seed.php --status # Prints current database counts and summary
 */

require_once __DIR__ . '/database/seeders/DatabaseSeeder.php';
use Database\Seeders\DatabaseSeeder;

$args = array_slice($argv, 1);
$force = in_array('--force', $args, true);
$status = in_array('--status', $args, true);

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

$dbHost = (string)(getenv('DB_HOST') ?: ($secrets['db_host'] ?? ''));
$dbPort = (string)(getenv('DB_PORT') ?: ($secrets['db_port'] ?? '3306'));
$dbName = (string)(getenv('DB_NAME') ?: ($secrets['db_name'] ?? ''));
$dbUser = (string)(getenv('DB_USER') ?: ($secrets['db_user'] ?? ''));
$dbPass = (string)(getenv('DB_PASS') ?: ($secrets['db_pass'] ?? ''));

if ($dbHost === '' || $dbName === '' || $dbUser === '') {
    echo "ERROR: MySQL database credentials required. SQLite is disabled.\n";
    exit(1);
}

try {
    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5
    ]);
    $connectionType = 'mysql';
} catch (\Throwable $e) {
    echo "ERROR: Failed to connect to MySQL database at {$dbHost}: " . $e->getMessage() . "\n";
    exit(1);
}

if ($status) {
    echo "=== NOMU Database Status [{$connectionType}] ===\n";
    $cmsCount = $pdo->query("SELECT COUNT(*) FROM cms_contents")->fetchColumn();
    $mediaCount = $pdo->query("SELECT COUNT(*) FROM media_assets")->fetchColumn();
    $reviewsCount = $pdo->query("SELECT COUNT(*) FROM reviews")->fetchColumn();
    $ordersCount = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();

    $phone = $pdo->query("SELECT field_value FROM cms_contents WHERE field_key = 'whatsapp_phone'")->fetchColumn();
    $logo = $pdo->query("SELECT field_value FROM cms_contents WHERE field_key = 'site_logo'")->fetchColumn();

    echo "CMS entries:      {$cmsCount}\n";
    echo "Media assets:     {$mediaCount}\n";
    echo "Reviews total:    {$reviewsCount}\n";
    echo "Orders total:     {$ordersCount}\n";
    echo "WhatsApp Phone:   {$phone}\n";
    echo "Master Logo:      {$logo}\n";
    echo "============================\n";
    exit(0);
}

echo "Running NOMU Database Seeder" . ($force ? " [FORCE MODE]" : "") . "...\n";

$seeder = new DatabaseSeeder($pdo);
$report = $seeder->run($force);

echo "✓ CMS items updated/seeded:   {$report['cms']}\n";
echo "✓ Media assets updated/seeded: {$report['media']}\n";
echo "✓ Reviews seeded:              {$report['reviews']}\n";
echo "✓ Completed successfully at {$report['timestamp']}\n";
