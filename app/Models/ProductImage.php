<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $appends = [
        'url',
    ];

    protected $fillable = [
        'product_id',
        'image',
    ];

    public function getUrlAttribute(): string
    {
        if (! is_string($this->image) || $this->image === '') {
            return '';
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://') || str_starts_with($this->image, 'data:') || str_starts_with($this->image, '/')) {
            return $this->image;
        }

        return asset($this->image);
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
