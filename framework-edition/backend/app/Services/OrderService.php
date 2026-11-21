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

        // Authoritative Nomu catalog pack definitions: 1, 4, or 12 bottles per pack (CWE-602).
        $canonicalPacks = [
            'single' => 1,
            'pack4'  => 4,
            'pack3'  => 4,
            'pack12' => 12,
        ];

        $items = is_array($data['items'] ?? null) ? $data['items'] : [];
        $calculatedBottles = 0;
        $calculatedGross = 0.0;
        foreach ($items as &$it) {
            $qty = max(1, (int)($it['quantity'] ?? 1));
            $packKey = strtolower(trim((string)($it['packKey'] ?? $it['pack_key'] ?? '')));
            if (isset($canonicalPacks[$packKey])) {
                $bottlesPerPack = $canonicalPacks[$packKey];
            } else {
                $packStr = strtolower((string)($it['pack'] ?? ''));
                if (strpos($packStr, '12') !== false) {
                    $bottlesPerPack = 12;
                } elseif (strpos($packStr, '4') !== false || strpos($packStr, '3') !== false) {
                    $bottlesPerPack = 4;
                } else {
                    $bottlesPerPack = 1;
                }
            }
            $lineBottles = $qty * $bottlesPerPack;
            $linePrice = (float)($lineBottles * 40.0);

            $it['quantity'] = $qty;
            $it['bottles'] = $lineBottles;
            $it['bottlesPerPack'] = $bottlesPerPack;
            $it['price'] = $linePrice;

            $calculatedBottles += $lineBottles;
            $calculatedGross += $linePrice;
        }
        unset($it);

        $totalBottles = max(1, $calculatedBottles);
        $grossTotal = (float)($totalBottles * 40.0);
        $totalAmount = $grossTotal;

        $order = Order::create([
            'order_ref' => $orderRef,
            'customer_name' => strip_tags(trim($data['customer_name'])),
            'customer_phone' => preg_replace('/\D/', '', $data['customer_phone']),
            'customer_email' => filter_var(trim($data['customer_email']), FILTER_SANITIZE_EMAIL),
            'delivery_address' => htmlspecialchars(trim($data['delivery_address']), ENT_QUOTES, 'UTF-8'),
            'notes' => isset($data['notes']) ? htmlspecialchars(trim($data['notes']), ENT_QUOTES, 'UTF-8') : null,
            'items_json' => $items,
            'total_bottles' => $totalBottles,
            'total_amount' => $totalAmount,
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
            
            $sanitize = function ($val) {
                if (is_string($val) && strlen($val) > 0 && in_array($val[0], ['=', '+', '-', '@', "\t", "\r"])) {
                    return "'" . $val;
                }
                return $val;
            };

            $query->chunk(100, function ($orders) use ($file, $sanitize) {
                foreach ($orders as $o) {
                    fputcsv($file, [
                        $sanitize($o->order_ref),
                        $o->created_at->toDateTimeString(),
                        $sanitize($o->customer_name),
                        $sanitize($o->customer_phone),
                        $sanitize($o->customer_email),
                        $o->total_bottles,
                        $o->total_amount,
                        $sanitize($o->status),
                        $sanitize($o->delivery_address),
                        $sanitize($o->notes ?? '')
                    ]);
                }
            });

            fclose($file);
        }, 200, $headers);
    }
}
