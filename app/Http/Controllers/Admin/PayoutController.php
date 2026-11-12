<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Payout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function approve(Request $request, Payout $payout): RedirectResponse
    {
        if ($payout->status !== 'pending') {
            return redirect()
                ->route('admin.payouts')
                ->with('error', 'Payout sudah diproses sebelumnya.');
        }

        $previousStatus = $payout->status;
        $payout->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $this->recordPayoutAudit($request, $payout, 'payout.approve', $previousStatus, 'paid');

        return redirect()
            ->route('admin.payouts')
            ->with('success', 'Payout berhasil disetujui.');
    }

    public function reject(Request $request, Payout $payout): RedirectResponse
    {
        if ($payout->status !== 'pending') {
            return redirect()
                ->route('admin.payouts')
                ->with('error', 'Payout sudah diproses sebelumnya.');
        }

        $previousStatus = $payout->status;
        $payout->update([
            'status' => 'failed',
            'paid_at' => null,
        ]);

        $this->recordPayoutAudit($request, $payout, 'payout.reject', $previousStatus, 'failed');

        return redirect()
            ->route('admin.payouts')
            ->with('success', 'Payout berhasil ditolak.');
    }

    private function recordPayoutAudit(Request $request, Payout $payout, string $action, string $previousStatus, string $newStatus): void
    {
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'target_type' => 'payout',
            'target_id' => $payout->id,
            'details' => [
                'seller' => $payout->seller?->store_name ?? 'Unknown Seller',
                'amount' => (float) $payout->amount,
                'previous_status' => $previousStatus,
                'new_status' => $newStatus,
            ],
        ]);
    }
}
