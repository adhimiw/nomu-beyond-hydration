<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|min:2|max:100',
            'customer_email' => 'required|email|max:150',
            'flavor_key' => 'required|in:vetiver,chamomile,grapefruit,lemongrass',
            'rating' => 'required|integer|min:1|max:5',
            'headline' => 'required|string|min:4|max:180',
            'review_text' => 'required|string|min:10|max:1000',
            '_hp_security_check' => 'nullable|max:0'
        ];
    }
}
