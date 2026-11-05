<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_ritual_box_order(): void
    {
        $payload = [
            'customer_name' => 'Meera Raman',
            'customer_phone' => '9840012345',
            'customer_email' => 'meera@example.com',
            'delivery_address' => 'Flat 4B, Harrington Rd, Chetpet, Chennai 600031',
            'notes' => 'Afternoon dispatch',
            'total_bottles' => 4,
            'total_amount' => 365,
            'items' => [
                ['flavor' => 'Vetiver', 'pack' => '3-Pack Ritual Box', 'quantity' => 1, 'bottles' => 3, 'price' => 270],
                ['flavor' => 'Lemongrass', 'pack' => 'Single Bottle', 'quantity' => 1, 'bottles' => 1, 'price' => 95]
            ]
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure(['status', 'message', 'order_ref', 'order_id']);

        $this->assertDatabaseHas('orders', [
            'customer_name' => 'Meera Raman',
            'customer_phone' => '9840012345',
            'status' => 'pending'
        ]);
    }

    public function test_rejects_invalid_phone_number(): void
    {
        $payload = [
            'customer_name' => 'Invalid Phone Test',
            'customer_phone' => '12345', // Invalid format
            'customer_email' => 'test@example.com',
            'delivery_address' => 'Chennai',
            'items' => [['flavor' => 'Vetiver', 'quantity' => 1, 'price' => 95]],
            'total_amount' => 95
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['customer_phone']);
    }

    public function test_rejects_honeypot_bot_submission(): void
    {
        $payload = [
            'customer_name' => 'Spam Bot',
            'customer_phone' => '9840012345',
            'customer_email' => 'bot@spam.com',
            'delivery_address' => 'Spam Address',
            'items' => [['flavor' => 'Vetiver', 'price' => 95]],
            'total_amount' => 95,
            '_hp_security_check' => 'I am a spambot'
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(422);
    }
}
