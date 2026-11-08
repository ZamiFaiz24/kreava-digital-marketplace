<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('seller/settings', [
            'seller' => [
                'store_name' => $seller->store_name,
                'slug' => $seller->slug,
                'description' => $seller->description,
                'contact_email' => $seller->contact_email,
                'phone' => $seller->phone,
                'logo' => $seller->logo,
                'banner' => $seller->banner,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'store_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'banner' => ['nullable', 'image', 'max:4096'],
        ]);

        unset($validated['logo'], $validated['banner']);

        if ($request->hasFile('logo')) {
            $validated['logo'] = Storage::disk('public')->url(
                $request->file('logo')->store('sellers/logos', 'public')
            );
        }

        if ($request->hasFile('banner')) {
            $validated['banner'] = Storage::disk('public')->url(
                $request->file('banner')->store('sellers/banners', 'public')
            );
        }

        $seller->update($validated);

        return redirect()
            ->route('seller.settings')
            ->with('success', 'Pengaturan toko berhasil disimpan.');
    }
}
