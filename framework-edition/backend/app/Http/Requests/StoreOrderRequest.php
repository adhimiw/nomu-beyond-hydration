<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_ref' => 'nullable|string|max:32',
            'customer_name' => 'required|string|min:2|max:120',
            'customer_phone' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'customer_email' => 'required|email|max:150',
            'delivery_address' => 'required|string|min:5|max:500',
            'notes' => 'nullable|string|max:300',
            'items' => 'required|array|min:1',
            'total_bottles' => 'nullable|integer|min:1',
            'total_amount' => 'required|numeric|min:1',
            '_hp_security_check' => 'nullable|max:0' // Honeypot must be empty
        ];
    }

    public function messages(): array
    {
        return [
            'customer_phone.regex' => 'Please provide a valid 10-digit Indian WhatsApp mobile number.',
            '_hp_security_check.max' => 'Invalid submission.'
        ];
    }
}
