<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\Review;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class SystemController extends Controller
{
    /**
     * Admin: Retrieve runtime health metrics and telemetry.
     */
    public function status(): JsonResponse
    {
        $memoryUsage = round(memory_get_usage(true) / 1024 / 1024, 2);
        $memoryPeak = round(memory_get_peak_usage(true) / 1024 / 1024, 2);
        $diskFree = @disk_free_space('/') ? round(disk_free_space('/') / 1024 / 1024 / 1024, 2) : 'N/A';
        $diskTotal = @disk_total_space('/') ? round(disk_total_space('/') / 1024 / 1024 / 1024, 2) : 'N/A';

        $opcacheEnabled = function_exists('opcache_get_status') && is_array(@opcache_get_status());

        $ordersCount = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $reviewsCount = Review::count();
        $pendingReviews = Review::where('status', 'pending')->count();

        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'runtime' => [
                'php_version' => PHP_VERSION,
                'sapi' => php_sapi_name(),
                'os' => PHP_OS . ' ' . php_uname('r'),
                'memory_allocated_mb' => $memoryUsage,
                'memory_peak_mb' => $memoryPeak,
                'disk_free_gb' => $diskFree,
                'disk_total_gb' => $diskTotal,
                'opcache_active' => $opcacheEnabled
            ],
            'database' => [
                'total_orders' => $ordersCount,
                'pending_orders' => $pendingOrders,
                'total_reviews' => $reviewsCount,
                'pending_reviews' => $pendingReviews
            ]
        ]);
    }

    /**
     * Admin: Retrieve system audit logs with level filter.
     */
    public function logs(Request $request): JsonResponse
    {
        $level = $request->query('level', 'all');

        $query = SystemLog::query()->latest('created_at');

        if ($level !== 'all') {
            $query->where('level', strtoupper($level));
        }

        $logs = $query->take(100)->get();

        return response()->json([
            'status' => 'success',
            'logs' => $logs
        ]);
    }
}
