<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\SystemController;

/*
|--------------------------------------------------------------------------
| Public Storefront Endpoints
|--------------------------------------------------------------------------
*/
Route::get('/content', [ContentController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::post('/orders', [OrderController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Operations Console & Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    // Orders Ledger & Status Dispatch
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Review Moderation Queue
    Route::get('/reviews', [ReviewController::class, 'adminIndex']);
    Route::post('/reviews/{id}/moderate', [ReviewController::class, 'moderate']);

    // Headless CMS Content Editor & Media Uploader
    Route::post('/content', [ContentController::class, 'update']);
    Route::post('/media/upload', [ContentController::class, 'uploadMedia']);

    // System Telemetry & Logs
    Route::get('/system/status', [SystemController::class, 'status']);
    Route::get('/system/logs', [SystemController::class, 'logs']);
});
