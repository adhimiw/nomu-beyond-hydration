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
            'whatsapp_phone' => 'nullable|string|max:30'
        ];
    }
}
