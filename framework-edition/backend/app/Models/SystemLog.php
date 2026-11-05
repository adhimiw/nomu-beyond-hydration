<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'level',
        'action',
        'message',
        'context_json',
        'ip_address',
        'user_agent',
        'created_at'
    ];

    protected $casts = [
        'context_json' => 'array',
        'created_at' => 'datetime'
    ];

    public static function log(string $level, string $action, string $message, array $context = []): self
    {
        return static::create([
            'level' => strtoupper($level),
            'action' => $action,
            'message' => $message,
            'context_json' => $context,
            'ip_address' => request()->ip() ?? '127.0.0.1',
            'user_agent' => substr(request()->userAgent() ?? '', 0, 255),
            'created_at' => now()
        ]);
    }
}
