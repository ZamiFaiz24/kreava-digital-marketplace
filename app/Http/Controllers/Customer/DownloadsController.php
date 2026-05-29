<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Download;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DownloadsController extends Controller
{
    public function index()
    {
        $downloads = Download::where('user_id', Auth::id())
            ->with('product')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('customer/downloads', [
            'downloads' => $downloads,
        ]);
    }
}
