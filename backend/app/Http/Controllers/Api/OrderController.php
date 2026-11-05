<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    /**
     * Store an order incoming from the Ritual Box checkout.
     */
    public function store(Request $request): JsonResponse
    {
        // Anti-bot honeypot check
        if (!empty($request->input('_hp_security_check'))) {
            return response()->json(['error' => 'Invalid submission'], 400);
        }

        $validated = $request->validate([
            'order_ref' => 'nullable|string|max:32',
            'customer_name' => 'required|string|min:2|max:120',
            'customer_phone' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'customer_email' => 'required|email|max:150',
            'delivery_address' => 'required|string|min:5|max:500',
            'notes' => 'nullable|string|max:300',
            'items' => 'required|array|min:1',
            'total_bottles' => 'nullable|integer|min:1',
            'total_amount' => 'required|numeric|min:1'
        ]);

        $orderRef = $validated['order_ref'] ?? ('NOMU-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)));

        // Sanitize string inputs
        $order = Order::create([
            'order_ref' => $orderRef,
            'customer_name' => strip_tags(trim($validated['customer_name'])),
            'customer_phone' => preg_replace('/\D/', '', $validated['customer_phone']),
            'customer_email' => filter_var(trim($validated['customer_email']), FILTER_SANITIZE_EMAIL),
            'delivery_address' => htmlspecialchars(trim($validated['delivery_address']), ENT_QUOTES, 'UTF-8'),
            'notes' => isset($validated['notes']) ? htmlspecialchars(trim($validated['notes']), ENT_QUOTES, 'UTF-8') : null,
            'items_json' => $validated['items'],
            'total_bottles' => $validated['total_bottles'] ?? 1,
            'total_amount' => $validated['total_amount'],
            'status' => 'pending',
            'ip_address' => $request->ip()
        ]);

        SystemLog::log('INFO', 'ORDER_CREATED', "New ritual order registered: {$orderRef} by {$order->customer_name}", [
            'order_id' => $order->id,
            'order_ref' => $orderRef,
            'amount' => $order->total_amount,
            'bottles' => $order->total_bottles
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Order registered successfully',
            'order_ref' => $orderRef,
            'order' => $order
        ], 201);
    }

    /**
     * Admin: Retrieve orders list with comprehensive filtering, search, and CSV export.
     */
    public function index(Request $request): JsonResponse|StreamedResponse
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');
        $export = $request->query('export');

        $query = Order::query()->latest();

        if ($status !== 'all' && in_array($status, ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'])) {
            $query->where('status', $status);
        }

        if (!empty($search)) {
            $query->search($search);
        }

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        // CSV Export functionality
        if ($export === 'csv') {
            $orders = $query->get();
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="nomu_orders_' . date('Y-m-d_His') . '.csv"',
                'Pragma' => 'no-cache',
                'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
                'Expires' => '0'
            ];

            return response()->stream(function () use ($orders) {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['Order Ref', 'Date', 'Customer Name', 'Phone', 'Email', 'Bottles', 'Total Amount (INR)', 'Status', 'Address', 'Notes']);
                foreach ($orders as $o) {
                    fputcsv($file, [
                        $o->order_ref,
                        $o->created_at->toDateTimeString(),
                        $o->customer_name,
                        $o->customer_phone,
                        $o->customer_email,
                        $o->total_bottles,
                        $o->total_amount,
                        $o->status,
                        $o->delivery_address,
                        $o->notes ?? ''
                    ]);
                }
                fclose($file);
            }, 200, $headers);
        }

        $perPage = (int) $request->query('per_page', 20);
        $orders = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * Admin: Update order status.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,dispatched,delivered,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        $order->status = $validated['status'];
        $order->save();

        SystemLog::log('NOTICE', 'ORDER_STATUS_CHANGED', "Order {$order->order_ref} status updated from {$oldStatus} to {$order->status}", [
            'order_id' => $order->id,
            'old_status' => $oldStatus,
            'new_status' => $order->status
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status updated',
            'order' => $order
        ]);
    }
}
