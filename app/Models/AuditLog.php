<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'target_type',
        'target_id',
        'details',
    ];

    protected function casts(): array
    {
        return [
            'target_id' => 'integer',
            'details' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
