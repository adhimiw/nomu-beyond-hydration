<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ReviewController extends Controller
{
    /**
     * Public: Fetch approved reviews to display on the storefront.
     */
    public function index(Request $request): JsonResponse
    {
        $flavor = $request->query('flavor', 'all');

        $query = Review::approved()->latest();

        if ($flavor !== 'all') {
            $query->forFlavor($flavor);
        }

        $reviews = $query->take(24)->get();

        return response()->json([
            'status' => 'success',
            'reviews' => $reviews
        ]);
    }

    /**
     * Public: Submit a tasting review. Stored strictly with status='pending' until reviewed.
     */
    public function store(Request $request): JsonResponse
    {
        // Anti-bot honeypot check
        if (!empty($request->input('_hp_security_check'))) {
            return response()->json(['error' => 'Invalid submission'], 400);
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|min:2|max:100',
            'customer_email' => 'required|email|max:150',
            'flavor_key' => 'required|in:vetiver,chamomile,grapefruit,lemongrass',
            'rating' => 'required|integer|min:1|max:5',
            'headline' => 'required|string|min:4|max:180',
            'review_text' => 'required|string|min:10|max:1000'
        ]);

        $review = Review::create([
            'customer_name' => strip_tags(trim($validated['customer_name'])),
            'customer_email' => filter_var(trim($validated['customer_email']), FILTER_SANITIZE_EMAIL),
            'flavor_key' => $validated['flavor_key'],
            'rating' => (int) $validated['rating'],
            'headline' => htmlspecialchars(trim($validated['headline']), ENT_QUOTES, 'UTF-8'),
            'review_text' => htmlspecialchars(trim($validated['review_text']), ENT_QUOTES, 'UTF-8'),
            'status' => 'pending',
            'ip_address' => $request->ip()
        ]);

        SystemLog::log('INFO', 'REVIEW_SUBMITTED', "New tasting note submitted for {$review->flavor_key} by {$review->customer_name}", [
            'review_id' => $review->id,
            'rating' => $review->rating,
            'flavor' => $review->flavor_key
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Your tasting note has been received and queued for review moderation.',
            'review_id' => $review->id
        ], 201);
    }

    /**
     * Admin: Retrieve reviews list with moderation filter.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $status = $request->query('status', 'all');
        $flavor = $request->query('flavor', 'all');

        $query = Review::query()->latest();

        if ($status !== 'all' && in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
        }

        if ($flavor !== 'all') {
            $query->forFlavor($flavor);
        }

        $reviews = $query->paginate(25);

        return response()->json([
            'status' => 'success',
            'data' => $reviews
        ]);
    }

    /**
     * Admin: Moderate review (approve, reject, or delete).
     */
    public function moderate(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:approve,reject,delete'
        ]);

        $review = Review::findOrFail($id);

        if ($validated['action'] === 'delete') {
            $review->delete();
            SystemLog::log('NOTICE', 'REVIEW_DELETED', "Review ID {$id} deleted by admin", ['review_id' => $id]);
            return response()->json(['status' => 'success', 'message' => 'Review deleted']);
        }

        $newStatus = $validated['action'] === 'approve' ? 'approved' : 'rejected';
        $review->status = $newStatus;
        $review->moderated_at = now();
        $review->moderated_by = 'admin';
        $review->save();

        SystemLog::log('NOTICE', 'REVIEW_MODERATED', "Review ID {$id} marked as {$newStatus}", [
            'review_id' => $id,
            'status' => $newStatus
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Review marked as {$newStatus}",
            'review' => $review
        ]);
    }
}
