<?php

namespace App\Services;

use App\Models\CmsContent;
use App\Models\SystemLog;

class CmsService
{
    public function getStorefrontContent(): array
    {
        $all = CmsContent::all()->pluck('field_value', 'field_key')->toArray();

        $defaults = [
            'hero_headline' => 'FOUR HERBS. ZERO NONSENSE.',
            'hero_sub' => 'Ancient South Indian botanical distillates crafted in small batches across Chennai.',
            'ticker_text' => '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS',
            'font_family' => 'editorial-serif',
            'whatsapp_phone' => '919840000000'
        ];

        return array_merge($defaults, $all);
    }

    public function updateContent(array $fields): int
    {
        $allowedKeys = [
            'hero_headline',
            'hero_sub',
            'ticker_text',
            'font_family',
            'whatsapp_phone'
        ];

        $updatedCount = 0;
        foreach ($fields as $key => $value) {
            if (in_array($key, $allowedKeys, true)) {
                $sanitized = htmlspecialchars(trim((string) $value), ENT_QUOTES, 'UTF-8');
                CmsContent::setValue($key, $sanitized);
                $updatedCount++;
            }
        }

        SystemLog::log('NOTICE', 'CMS_CONTENT_UPDATED', "CMS content updated: {$updatedCount} fields modified", [
            'keys_modified' => array_keys($fields)
        ]);

        return $updatedCount;
    }
}
