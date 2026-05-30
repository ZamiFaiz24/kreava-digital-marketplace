<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DownloadLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'download_id',
    ];

    public function download()
    {
        return $this->belongsTo(Download::class, 'download_id');
    }
}
