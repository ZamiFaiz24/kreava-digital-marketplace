<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Concerns\ResolvesDateRange;
use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Seller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    use ResolvesDateRange;

    public function export(Request $request): StreamedResponse
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        [$startDate, $endDate] = $this->resolveDateRange($request);

        $items = OrderItem::query()
            ->with([
                'order:id,user_id,payment_status,created_at',
                'order.user:id,name',
                'product:id,title',
            ])
            ->where('seller_id', $seller->id)
            ->whereHas('order', function ($query) use ($startDate, $endDate) {
                $query->when($startDate, fn ($query) => $query->where('created_at', '>=', $startDate))
                    ->when($endDate, fn ($query) => $query->where('created_at', '<=', $endDate));
            })
            ->latest('order_items.created_at')
            ->lazy(200);

        $filename = 'seller-orders-'.now()->format('Y-m-d_His').'.csv';

        return response()->streamDownload(function () use ($items) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'order_number',
                'customer',
                'product',
                'qty',
                'price',
                'total',
                'payment_status',
                'created_at',
            ]);

            foreach ($items as $item) {
                $order = $item->order;
                $price = (float) $item->price;

                fputcsv($handle, [
                    $this->orderNumber($item->order_id),
                    $order?->user?->name ?? 'Unknown Customer',
                    $item->product?->title ?? 'Untitled Product',
                    1,
                    number_format($price, 2, '.', ''),
                    number_format($price, 2, '.', ''),
                    $order?->payment_status ?? 'pending',
                    $order?->created_at?->toDateTimeString() ?? '',
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function orderNumber(int $orderId): string
    {
        return 'ORD-'.str_pad((string) $orderId, 4, '0', STR_PAD_LEFT);
    }
}
