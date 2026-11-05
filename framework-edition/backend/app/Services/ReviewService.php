<?php

namespace App\Services;

use App\Models\Review;
use App\Models\SystemLog;

class ReviewService
{
    public function submitReview(array $data, ?string $ip): Review
    {
        $review = Review::create([
            'customer_name' => strip_tags(trim($data['customer_name'])),
            'customer_email' => filter_var(trim($data['customer_email']), FILTER_SANITIZE_EMAIL),
            'flavor_key' => $data['flavor_key'],
            'rating' => (int) $data['rating'],
            'headline' => htmlspecialchars(trim($data['headline']), ENT_QUOTES, 'UTF-8'),
            'review_text' => htmlspecialchars(trim($data['review_text']), ENT_QUOTES, 'UTF-8'),
            'status' => 'pending',
            'ip_address' => $ip
        ]);

        SystemLog::log('INFO', 'REVIEW_SUBMITTED', "New tasting note submitted for {$review->flavor_key} by {$review->customer_name}", [
            'review_id' => $review->id,
            'rating' => $review->rating,
            'flavor' => $review->flavor_key
        ]);

        return $review;
    }

    public function moderateReview(Review $review, string $action): bool
    {
        if ($action === 'delete') {
            $id = $review->id;
            $review->delete();
            SystemLog::log('NOTICE', 'REVIEW_DELETED', "Review ID {$id} deleted by admin");
            return true;
        }

        $newStatus = $action === 'approve' ? 'approved' : 'rejected';
        $review->status = $newStatus;
        $review->moderated_at = now();
        $review->moderated_by = 'admin';
        $review->save();

        SystemLog::log('NOTICE', 'REVIEW_MODERATED', "Review ID {$review->id} marked as {$newStatus}", [
            'review_id' => $review->id,
            'status' => $newStatus
        ]);

        return true;
    }
}
