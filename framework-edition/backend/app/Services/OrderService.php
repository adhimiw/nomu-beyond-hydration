<?php

namespace App\Services;

use App\Models\Order;
use App\Models\SystemLog;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderService
{
    public function createOrder(array $data, ?string $ip): Order
    {
        $orderRef = $data['order_ref'] ?? ('NOMU-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)));

        $order = Order::create([
            'order_ref' => $orderRef,
            'customer_name' => strip_tags(trim($data['customer_name'])),
            'customer_phone' => preg_replace('/\D/', '', $data['customer_phone']),
            'customer_email' => filter_var(trim($data['customer_email']), FILTER_SANITIZE_EMAIL),
            'delivery_address' => htmlspecialchars(trim($data['delivery_address']), ENT_QUOTES, 'UTF-8'),
            'notes' => isset($data['notes']) ? htmlspecialchars(trim($data['notes']), ENT_QUOTES, 'UTF-8') : null,
            'items_json' => $data['items'],
            'total_bottles' => $data['total_bottles'] ?? 1,
            'total_amount' => $data['total_amount'],
            'status' => 'pending',
            'ip_address' => $ip
        ]);

        SystemLog::log('INFO', 'ORDER_CREATED', "New ritual order registered: {$orderRef} from {$order->customer_name}", [
            'order_id' => $order->id,
            'order_ref' => $orderRef,
            'amount' => $order->total_amount,
            'bottles' => $order->total_bottles
        ]);

        return $order;
    }

    public function updateStatus(Order $order, string $newStatus): Order
    {
        $oldStatus = $order->status;
        $order->status = $newStatus;
        $order->save();

        SystemLog::log('NOTICE', 'ORDER_STATUS_CHANGED', "Order {$order->order_ref} status updated from {$oldStatus} to {$newStatus}", [
            'order_id' => $order->id,
            'old' => $oldStatus,
            'new' => $newStatus
        ]);

        return $order;
    }

    public function exportCsv($query): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="nomu_orders_' . date('Y-m-d_His') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        return response()->stream(function () use ($query) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Order Ref', 'Date', 'Customer Name', 'Phone', 'Email', 'Bottles', 'Total Amount (INR)', 'Status', 'Address', 'Notes']);
            
            $query->chunk(100, function ($orders) use ($file) {
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
            });

            fclose($file);
        }, 200, $headers);
    }
}
