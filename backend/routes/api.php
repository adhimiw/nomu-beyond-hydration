<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\SystemController;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// Content Management: Public Key-Values
Route::get('/content', [ContentController::class, 'index']);

// Reviews: Public Approved Listing & Submission
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);

// Orders: Multi-Product Ritual Box Submission
Route::post('/orders', [OrderController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Admin CMS, Moderation & Telemetry Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    // Orders Ledger
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Review Moderation
    Route::get('/reviews', [ReviewController::class, 'adminIndex']);
    Route::post('/reviews/{id}/moderate', [ReviewController::class, 'moderate']);

    // CMS Editor
    Route::post('/content', [ContentController::class, 'update']);

    // System Telemetry & Logs
    Route::get('/system/status', [SystemController::class, 'status']);
    Route::get('/system/logs', [SystemController::class, 'logs']);
});
