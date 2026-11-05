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
}
