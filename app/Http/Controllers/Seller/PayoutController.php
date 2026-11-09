<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Payout;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PayoutController extends Controller
{
    public function index(Request $request): Response
    {
        $seller = $this->sellerFor($request);

        $totalRevenue = $this->totalRevenue($seller);
        $paidOut = (float) Payout::query()
            ->where('seller_id', $seller->id)
            ->where('status', 'paid')
            ->sum('amount');
        $pendingBalance = (float) Payout::query()
            ->where('seller_id', $seller->id)
            ->where('status', 'pending')
            ->sum('amount');

        $payouts = Payout::query()
            ->where('seller_id', $seller->id)
            ->latest()
            ->get()
            ->map(function (Payout $payout) {
                return [
                    'id' => $payout->id,
                    'amount' => (float) $payout->amount,
                    'status' => $payout->status,
                    'requested_at' => $payout->created_at?->toDateString() ?? '',
                    'paid_at' => $payout->paid_at?->toDateString(),
                ];
            })
            ->values();

        return Inertia::render('seller/payouts', [
            'payouts' => $payouts,
            'summary' => [
                'total_revenue' => round($totalRevenue, 2),
                'available_balance' => max(0, round($totalRevenue - $paidOut - $pendingBalance, 2)),
                'pending_balance' => round($pendingBalance, 2),
                'paid_out' => round($paidOut, 2),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $seller = $this->sellerFor($request);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
        ]);

        $amount = round((float) $validated['amount'], 2);

        if ($amount > $this->availableBalance($seller)) {
            throw ValidationException::withMessages([
                'amount' => 'Saldo tidak mencukupi untuk penarikan ini.',
            ]);
        }

        Payout::create([
            'seller_id' => $seller->id,
            'amount' => $amount,
            'status' => 'pending',
        ]);

        return redirect()
            ->route('seller.payouts')
            ->with('success', 'Permintaan payout berhasil diajukan.');
    }

    private function sellerFor(Request $request): Seller
    {
        return Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
    }

    private function totalRevenue(Seller $seller): float
    {
        return (float) OrderItem::query()
            ->where('seller_id', $seller->id)
            ->whereHas('order', fn ($query) => $query->where('payment_status', 'paid'))
            ->sum('price');
    }

    private function availableBalance(Seller $seller): float
    {
        $reserved = (float) Payout::query()
            ->where('seller_id', $seller->id)
            ->whereIn('status', ['pending', 'paid'])
            ->sum('amount');

        return max(0, round($this->totalRevenue($seller) - $reserved, 2));
    }
}
