<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Download;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\DownloadLog;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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

    /**
     * Stream or return a secure download for an owned item.
     */
    public function download(Download $download)
    {
        if ($download->user_id !== Auth::id()) {
            abort(403);
        }

        $download->load('orderItem.order', 'product');

        $order = $download->orderItem?->order;

        if (!$order || $order->payment_status !== 'paid') {
            abort(403);
        }

        $product = $download->product ?? $download->orderItem->product;

        if (!$product || empty($product->file_path)) {
            abort(404);
        }

        $path = $product->file_path;

        // Enforce simple rate limit (default 5 per month). Use ?period=week for weekly check.
        $limit = 5;
        $period = request()->get('period', 'month');
        $since = $period === 'week' ? now()->subWeek() : now()->subMonth();

        $recentCount = DownloadLog::where('download_id', $download->id)
            ->where('created_at', '>=', $since)
            ->count();

        if ($recentCount >= $limit) {
            return redirect()->back()->with('error', "Download limit reached ({$limit} per {$period}).");
        }

        // Track download
        DownloadLog::create(['download_id' => $download->id]);
        $download->increment('download_count');
        $download->last_downloaded_at = now();
        $download->save();

        // Use Storage::download to stream the file (works for local and many disks)
        return Storage::download($path, $product->title . '.' . pathinfo($path, PATHINFO_EXTENSION));
    }
}
