<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCmsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hero_headline' => 'nullable|string|max:200',
            'hero_sub' => 'nullable|string|max:500',
            'ticker_text' => 'nullable|string|max:300',
            'font_family' => 'nullable|string|max:80',
            'whatsapp_phone' => 'nullable|string|max:30',
            'banner_text' => 'nullable|string|max:300',
            'hero_video_url' => 'nullable|string|max:500',
            'hero_poster_url' => 'nullable|string|max:500',
            'vetiver_bottle_img' => 'nullable|string|max:500',
            'vetiver_splash_img' => 'nullable|string|max:500',
            'vetiver_packshot_img' => 'nullable|string|max:500',
            'chamomile_bottle_img' => 'nullable|string|max:500',
            'chamomile_splash_img' => 'nullable|string|max:500',
            'chamomile_packshot_img' => 'nullable|string|max:500',
            'grapefruit_bottle_img' => 'nullable|string|max:500',
            'grapefruit_splash_img' => 'nullable|string|max:500',
            'grapefruit_packshot_img' => 'nullable|string|max:500',
            'lemongrass_bottle_img' => 'nullable|string|max:500',
            'lemongrass_splash_img' => 'nullable|string|max:500',
            'lemongrass_packshot_img' => 'nullable|string|max:500',
            'about_image_url' => 'nullable|string|max:500',
            'manifesto_image_url' => 'nullable|string|max:500'
        ];
    }
}
