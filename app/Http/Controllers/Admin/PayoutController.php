<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PayoutController extends Controller
{
    public function index(): Response
    {
        $payouts = Payout::query()
            ->with([
                'seller:id,user_id,store_name',
                'seller.user:id,name,email',
            ])
            ->latest()
            ->get()
            ->map(function (Payout $payout) {
                return [
                    'id' => $payout->id,
                    'seller' => $payout->seller?->store_name ?? 'Unknown Seller',
                    'email' => $payout->seller?->user?->email ?? '',
                    'amount' => (float) $payout->amount,
                    'status' => $payout->status,
                    'requested_at' => $payout->created_at?->toDateString() ?? '',
                    'paid_at' => $payout->paid_at?->toDateString(),
                ];
            })
            ->values();

        return Inertia::render('admin/payouts', [
            'payouts' => $payouts,
        ]);
    }

    public function approve(Payout $payout): RedirectResponse
    {
        if ($payout->status !== 'pending') {
            return redirect()
                ->route('admin.payouts')
                ->with('error', 'Payout sudah diproses sebelumnya.');
        }

        $payout->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return redirect()
            ->route('admin.payouts')
            ->with('success', 'Payout berhasil disetujui.');
    }

    public function reject(Payout $payout): RedirectResponse
    {
        if ($payout->status !== 'pending') {
            return redirect()
                ->route('admin.payouts')
                ->with('error', 'Payout sudah diproses sebelumnya.');
        }

        $payout->update([
            'status' => 'failed',
            'paid_at' => null,
        ]);

        return redirect()
            ->route('admin.payouts')
            ->with('success', 'Payout berhasil ditolak.');
    }
}
