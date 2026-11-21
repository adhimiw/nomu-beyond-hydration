<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminTokenMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = (string) env('NOMU_ADMIN_TOKEN', '');
        if ($expected === '') {
            return response()->json(['error' => 'Admin authentication is not configured'], 503);
        }

        $auth = (string) $request->header('Authorization', '');
        if (!str_starts_with($auth, 'Bearer ')) {
            return response()->json(['error' => 'Unauthorized', 'message' => 'Valid admin bearer token required'], 401);
        }

        $provided = trim(substr($auth, 7));
        if ($provided === '' || !hash_equals($expected, $provided)) {
            return response()->json(['error' => 'Unauthorized', 'message' => 'Invalid admin bearer token'], 401);
        }

        return $next($request);
    }
}
