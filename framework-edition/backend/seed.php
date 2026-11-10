<?php
declare(strict_types=1);

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
$forceSqlite = in_array('--sqlite', $args, true);

$dbPath = file_exists(__DIR__ . '/nomu_database.sqlite')
    ? __DIR__ . '/nomu_database.sqlite'
    : __DIR__ . '/public/nomu_database.sqlite';

$pdo = null;
$connectionType = 'sqlite';

if (!$forceSqlite) {
    $dbHost = getenv('DB_HOST') ?: '127.0.0.1';
    $dbPort = getenv('DB_PORT') ?: '3306';
    $dbName = getenv('DB_NAME') ?: 'u244089748_nomustanging';
    $dbUser = getenv('DB_USER') ?: 'u244089748_nomustanging';
    $dbPass = getenv('DB_PASS') ?: 'Nomu2026';

    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2
        ]);
        $connectionType = 'mysql';
    } catch (\Throwable $e) {
        $pdo = null;
    }
}

if (!$pdo) {
    try {
        $pdo = new PDO("sqlite:" . $dbPath, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        $connectionType = 'sqlite';
    } catch (PDOException $e) {
        echo "ERROR: Failed to connect to SQLite database at {$dbPath}: " . $e->getMessage() . "\n";
        exit(1);
    }
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
