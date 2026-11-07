<?php

namespace App\Services;

interface PaymentGateway
{
    /**
     * Process a payment for the given order data.
     *
     * @param  array<string, mixed>  $data
     * @return array{success: bool, transaction_id: string|null, error: string|null}
     */
    public function pay(array $data): array;
}
