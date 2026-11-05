<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->createOrder(
            $request->validated(),
            $request->ip()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Order registered successfully',
            'order_ref' => $order->order_ref,
            'order_id' => $order->id
        ], 201);
    }

    public function index(Request $request): JsonResponse|StreamedResponse
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');
        $export = $request->query('export');

        $query = Order::query()->latest();

        if ($status !== 'all') {
            $query->status($status);
        }
        if (!empty($search)) {
            $query->search($search);
        }

        if ($export === 'csv') {
            return $this->orderService->exportCsv($query);
        }

        $perPage = (int) $request->query('per_page', 25);
        $orders = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'orders' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage()
            ]
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,dispatched,delivered,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $this->orderService->updateStatus($order, $request->input('status'));

        return response()->json([
            'status' => 'success',
            'message' => 'Order status updated',
            'order' => $order
        ]);
    }
}
