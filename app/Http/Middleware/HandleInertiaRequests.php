<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $shared = array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
        ]);

        $user = $request->user();

        if ($user) {
            // attach lightweight counts to the user model so frontend badges can read them
            try {
                $user->wishlist_count = $user->wishlist ? $user->wishlist->items()->count() : 0;
            } catch (\Throwable $e) {
                $user->wishlist_count = 0;
            }

            try {
                $user->cart_count = $user->cart ? $user->cart->items()->count() : 0;
            } catch (\Throwable $e) {
                $user->cart_count = 0;
            }
        }

        $shared['auth'] = [
            'user' => $user,
        ];

        return $shared;
    }
}
