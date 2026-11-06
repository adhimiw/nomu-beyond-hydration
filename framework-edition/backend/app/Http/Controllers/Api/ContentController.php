<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\UpdateCmsRequest;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ContentController extends Controller
{
    public function __construct(
        protected CmsService $cmsService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->cmsService->getStorefrontContent());
    }

    public function update(UpdateCmsRequest $request): JsonResponse
    {
        $updated = $this->cmsService->updateContent($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => "Successfully updated {$updated} content fields",
            'content' => $this->cmsService->getStorefrontContent()
        ]);
    }

    public function uploadMedia(\Illuminate\Http\Request $request): JsonResponse
    {
        if (!$request->hasFile('file') || !$request->file('file')->isValid()) {
            return response()->json([
                'error' => 'No file uploaded',
                'message' => 'Please select a valid image or video file to upload.'
            ], 400);
        }

        try {
            $result = $this->cmsService->storeMediaUpload($request->file('file'));
            return response()->json($result, 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'error' => 'Validation error',
                'message' => $e->getMessage()
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Storage error',
                'message' => 'Failed to store media file.'
            ], 500);
        }
    }
}
