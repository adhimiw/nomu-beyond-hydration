<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_email',
        'flavor_key',
        'rating',
        'headline',
        'review_text',
        'status',
        'moderated_at',
        'moderated_by',
        'ip_address'
    ];

    protected $casts = [
        'rating' => 'integer',
        'moderated_at' => 'datetime'
    ];

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeForFlavor($query, ?string $flavor)
    {
        if ($flavor && $flavor !== 'all') {
            return $query->where('flavor_key', $flavor);
        }
        return $query;
    }
}
