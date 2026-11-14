<?php

use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

it('renders public info pages', function (string $routeName, string $slug) {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('info/page')
            ->where('page.slug', $slug)
            ->has('page.sections')
        );
})->with([
    ['company', 'company'],
    ['legal', 'legal'],
    ['resources', 'resources'],
    ['status', 'status'],
]);

it('registers the public destinations used by the footer', function () {
    expect(route('marketplace'))->toContain('/marketplace')
        ->and(route('marketplace', ['category' => 'ui-kits']))->toContain('category=ui-kits')
        ->and(route('creators'))->toContain('/creators')
        ->and(route('company'))->toContain('/company')
        ->and(route('legal'))->toContain('/legal')
        ->and(route('resources'))->toContain('/resources')
        ->and(route('status'))->toContain('/status');
});
