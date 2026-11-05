<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReviewApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_submit_tasting_note_which_starts_as_pending(): void
    {
        $payload = [
            'customer_name' => 'Maya R.',
            'customer_email' => 'maya@example.com',
            'flavor_key' => 'chamomile',
            'rating' => 5,
            'headline' => 'Soothing and floral',
            'review_text' => 'Gently calmed evening tension and tastes authentically like dried chamomile blossoms.'
        ];

        $response = $this->postJson('/api/reviews', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure(['status', 'message', 'review_id']);

        // Check review is saved as pending
        $this->assertDatabaseHas('reviews', [
            'customer_name' => 'Maya R.',
            'status' => 'pending'
        ]);

        // Verify it does NOT appear on public endpoint yet
        $publicRes = $this->getJson('/api/reviews');
        $publicRes->assertJsonMissing(['headline' => 'Soothing and floral']);
    }

    public function test_admin_can_approve_review_and_make_it_public(): void
    {
        $review = Review::create([
            'customer_name' => 'Adhithan S.',
            'customer_email' => 'test@domain.com',
            'flavor_key' => 'vetiver',
            'rating' => 5,
            'headline' => 'Unrivaled cooling mineral profile',
            'review_text' => 'Crisp, earthy, cold-steeped vetiver water that feels natural.',
            'status' => 'pending'
        ]);

        // Approve review
        $modResponse = $this->postJson("/api/admin/reviews/{$review->id}/moderate", [
            'action' => 'approve'
        ]);
        $modResponse->assertStatus(200);

        // Check database
        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'status' => 'approved'
        ]);

        // Check public endpoint
        $publicRes = $this->getJson('/api/reviews');
        $publicRes->assertJsonFragment(['headline' => 'Unrivaled cooling mineral profile']);
    }
}
