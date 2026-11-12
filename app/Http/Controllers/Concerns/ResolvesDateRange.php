<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

trait ResolvesDateRange
{
    /**
     * @return array{0: Carbon|null, 1: Carbon|null}
     */
    protected function resolveDateRange(Request $request): array
    {
        $startDate = $this->parseDate($request->query('start_date'));
        $endDate = $this->parseDate($request->query('end_date'));

        return [
            $startDate?->startOfDay(),
            $endDate?->endOfDay(),
        ];
    }

    private function parseDate(mixed $value): ?Carbon
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        try {
            $date = Carbon::createFromFormat('Y-m-d', $value);

            return $date instanceof Carbon ? $date : null;
        } catch (\Throwable) {
            return null;
        }
    }
}
