<?php

namespace App\Http\Controllers\Api;

use App\Models\SystemLog;
use App\Services\TelemetryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SystemController extends Controller
{
    public function __construct(
        protected TelemetryService $telemetryService
    ) {}

    public function status(): JsonResponse
    {
        return response()->json($this->telemetryService->getRuntimeStatus());
    }

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
