<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'store_name',
        'slug',
        'description',
        'logo',
        'banner',
        'contact_email',
        'phone',
        'status',
        'monthly_target',
    ];

    protected $casts = [
        'monthly_target' => 'float',
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
