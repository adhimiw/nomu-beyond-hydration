<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\ModerateReviewRequest;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ReviewController extends Controller
{
    public function __construct(
        protected ReviewService $reviewService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $flavor = $request->query('flavor', 'all');

        $query = Review::approved()->latest();
        if ($flavor !== 'all') {
            $query->forFlavor($flavor);
        }

        $reviews = $query->take(30)->get();

        return response()->json([
            'status' => 'success',
            'reviews' => $reviews
        ]);
    }

    public function store(StoreReviewRequest $request): JsonResponse
    {
        $review = $this->reviewService->submitReview(
            $request->validated(),
            $request->ip()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Your tasting note has been received and queued for review moderation.',
            'review_id' => $review->id
        ], 201);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $status = $request->query('status', 'all');
        $flavor = $request->query('flavor', 'all');

        $query = Review::query()->latest();

        if ($status !== 'all' && in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }
        if ($flavor !== 'all') {
            $query->forFlavor($flavor);
        }

        $reviews = $query->take(100)->get();

        return response()->json([
            'status' => 'success',
            'reviews' => $reviews
        ]);
    }

    public function moderate(ModerateReviewRequest $request, int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $action = $request->validated()['action'];

        $this->reviewService->moderateReview($review, $action);

        return response()->json([
            'status' => 'success',
            'message' => $action === 'delete' ? 'Review deleted' : "Review marked as {$action}d"
        ]);
    }
}
