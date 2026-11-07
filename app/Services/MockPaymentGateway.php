<?php

namespace App\Services;

use Illuminate\Support\Str;

class MockPaymentGateway implements PaymentGateway
{
    /**
     * Simulate a payment that always succeeds.
     *
     * @param  array<string, mixed>  $data
     * @return array{success: bool, transaction_id: string|null, error: string|null}
     */
    public function pay(array $data): array
    {
        return [
            'success' => true,
            'transaction_id' => 'MOCK-' . strtoupper(Str::random(16)),
            'error' => null,
        ];
    }
}
