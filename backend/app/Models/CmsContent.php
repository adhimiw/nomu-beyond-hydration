<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsContent extends Model
{
    protected $fillable = [
        'field_key',
        'field_value',
        'field_group',
        'field_type'
    ];

    public static function getValue(string $key, ?string $default = null): ?string
    {
        $item = static::where('field_key', $key)->first();
        return $item ? $item->field_value : $default;
    }

    public static function setValue(string $key, ?string $value, string $group = 'general'): self
    {
        return static::updateOrCreate(
            ['field_key' => $key],
            ['field_value' => $value, 'field_group' => $group]
        );
    }
}
