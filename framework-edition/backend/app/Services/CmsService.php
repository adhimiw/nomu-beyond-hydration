<?php

namespace App\Services;

use App\Models\CmsContent;
use App\Models\SystemLog;
use Illuminate\Http\UploadedFile;

class CmsService
{
    public function getStorefrontContent(): array
    {
        $all = CmsContent::all()->pluck('field_value', 'field_key')->toArray();

        $defaults = [
            'hero_headline' => 'BEYOND HYDRATION',
            'hero_sub' => 'Ancient South Indian botanical distillates crafted in small batches across India.',
            'ticker_text' => 'Made in India, join the ritual',
            'font_family' => 'editorial-serif',
            'whatsapp_phone' => '919840000000',
            'hero_video_url' => '/video/nomu_showcase.mp4',
            'hero_poster_url' => '/img/nomu/nomu_film_poster.jpg'
        ];

        return array_merge($defaults, $all);
    }

    public function sanitizeMediaUrl(string $url): string
    {
        $url = trim($url);
        if (empty($url)) {
            return '';
        }
        if (preg_match('#^(javascript|data|vbscript|file):#i', $url)) {
            return '';
        }
        if (str_starts_with($url, '/')) {
            if (str_contains($url, '..')) {
                return '';
            }
            return htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
        }
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            $scheme = parse_url($url, PHP_URL_SCHEME);
            if (in_array(strtolower((string)$scheme), ['http', 'https'], true)) {
                return htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
            }
        }
        return '';
    }

    public function updateContent(array $fields): int
    {
        $textKeys = [
            'hero_headline',
            'hero_sub',
            'ticker_text',
            'font_family',
            'whatsapp_phone',
            'banner_text'
        ];

        $mediaKeys = [
            'hero_video_url', 'hero_poster_url',
            'vetiver_bottle_img', 'vetiver_splash_img', 'vetiver_packshot_img',
            'chamomile_bottle_img', 'chamomile_splash_img', 'chamomile_packshot_img',
            'grapefruit_bottle_img', 'grapefruit_splash_img', 'grapefruit_packshot_img',
            'lemongrass_bottle_img', 'lemongrass_splash_img', 'lemongrass_packshot_img',
            'about_image_url', 'manifesto_image_url'
        ];

        $updatedCount = 0;
        foreach ($fields as $key => $value) {
            if (in_array($key, $textKeys, true)) {
                $sanitized = htmlspecialchars(trim((string) $value), ENT_QUOTES, 'UTF-8');
                CmsContent::setValue($key, $sanitized);
                $updatedCount++;
            } elseif (in_array($key, $mediaKeys, true)) {
                $sanitized = $this->sanitizeMediaUrl((string) $value);
                CmsContent::setValue($key, $sanitized);
                $updatedCount++;
            }
        }

        SystemLog::log('NOTICE', 'CMS_CONTENT_UPDATED', "CMS content updated: {$updatedCount} fields modified", [
            'keys_modified' => array_keys($fields)
        ]);

        return $updatedCount;
    }

    public function storeMediaUpload(UploadedFile $file): array
    {
        $maxBytes = 25 * 1024 * 1024;
        if ($file->getSize() > $maxBytes) {
            throw new \InvalidArgumentException('Uploaded file must be smaller than 25MB.');
        }

        $mime = $file->getMimeType();
        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'video/mp4'  => 'mp4',
            'video/webm' => 'webm'
        ];

        if (!isset($allowedMimes[$mime])) {
            throw new \InvalidArgumentException('Only JPG, PNG, WEBP images and MP4, WEBM videos are allowed.');
        }

        $ext = $allowedMimes[$mime];
        $filename = 'nomu_media_' . bin2hex(random_bytes(8)) . '.' . $ext;
        $destinationDir = public_path('uploads');

        if (!is_dir($destinationDir)) {
            mkdir($destinationDir, 0755, true);
        }

        $file->move($destinationDir, $filename);
        $publicUrl = '/uploads/' . $filename;

        SystemLog::log('INFO', 'MEDIA_UPLOADED', "Uploaded media file {$filename} ({$mime})", [
            'filename' => $filename,
            'url' => $publicUrl,
            'mime' => $mime
        ]);

        return [
            'status' => 'success',
            'url' => $publicUrl,
            'filename' => $filename,
            'mime' => $mime
        ];
    }
}
