<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_ref',
        'customer_name',
        'customer_phone',
        'customer_email',
        'delivery_address',
        'notes',
        'items_json',
        'total_bottles',
        'total_amount',
        'status',
        'ip_address'
    ];

    protected $casts = [
        'items_json' => 'array',
        'total_bottles' => 'integer',
        'total_amount' => 'decimal:2'
    ];

    public function scopeStatus($query, ?string $status)
    {
        if ($status && $status !== 'all') {
            return $query->where('status', $status);
        }
        return $query;
    }

    public function scopeSearch($query, ?string $term)
    {
        if (!empty($term)) {
            return $query->where(function ($q) use ($term) {
                $q->where('order_ref', 'like', "%{$term}%")
                  ->orWhere('customer_name', 'like', "%{$term}%")
                  ->orWhere('customer_phone', 'like', "%{$term}%")
                  ->orWhere('customer_email', 'like', "%{$term}%");
            });
        }
        return $query;
    }
}
