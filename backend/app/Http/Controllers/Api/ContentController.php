<?php

namespace App\Http\Controllers\Api;

use App\Models\CmsContent;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ContentController extends Controller
{
    /**
     * Public: Get all CMS key-values to hydrate the storefront.
     */
    public function index(): JsonResponse
    {
        $all = CmsContent::all()->pluck('field_value', 'field_key')->toArray();

        // Sensible defaults if database is freshly seeded
        $defaults = [
            'hero_headline' => 'FOUR HERBS. ZERO NONSENSE.',
            'hero_sub' => 'Ancient botanical distillates crafted in small batches across Chennai.',
            'ticker_text' => '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS',
            'font_family' => 'editorial-serif',
            'whatsapp_phone' => '919840000000'
        ];

        return response()->json(array_merge($defaults, $all));
    }

    /**
     * Admin: Update CMS content fields.
     */
    public function update(Request $request): JsonResponse
    {
        $fields = $request->all();

        if (empty($fields) || !is_array($fields)) {
            return response()->json(['error' => 'No content fields provided'], 400);
        }

        $allowedKeys = [
            'hero_headline',
            'hero_sub',
            'ticker_text',
            'font_family',
            'whatsapp_phone',
            'banner_text',
            'announcement_bar'
        ];

        $updatedCount = 0;
        foreach ($fields as $key => $value) {
            if (in_array($key, $allowedKeys)) {
                $sanitized = htmlspecialchars(trim((string) $value), ENT_QUOTES, 'UTF-8');
                CmsContent::setValue($key, $sanitized);
                $updatedCount++;
            }
        }

        SystemLog::log('NOTICE', 'CMS_CONTENT_UPDATED', "CMS content updated: {$updatedCount} fields modified", [
            'keys_modified' => array_keys($fields)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Successfully updated {$updatedCount} content fields",
            'content' => CmsContent::all()->pluck('field_value', 'field_key')
        ]);
    }
}
