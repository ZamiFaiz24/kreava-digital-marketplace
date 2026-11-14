<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class InfoController extends Controller
{
    /**
     * Static public pages used by the footer and public navigation.
     */
    private const PAGES = [
        'company' => [
            'eyebrow' => 'Company',
            'title' => 'Built for digital creators',
            'description' => 'Kreava is a marketplace where creators sell digital products and buyers get instant access to the files they need.',
            'sections' => [
                [
                    'id' => 'about',
                    'title' => 'About Kreava',
                    'body' => 'Kreava helps independent creators turn design systems, templates, ebooks, icons, and source code into sustainable income. We focus on a simple storefront, transparent discovery, and instant delivery.',
                ],
                [
                    'id' => 'blog',
                    'title' => 'Blog',
                    'body' => 'Creator stories, product updates, and practical guides are published here as the marketplace grows. Check back soon for the first posts.',
                ],
                [
                    'id' => 'careers',
                    'title' => 'Careers',
                    'body' => 'We are a small, product-focused team. Open roles will be listed on this page when they become available.',
                ],
                [
                    'id' => 'press',
                    'title' => 'Press',
                    'body' => 'For press and media inquiries, contact press@kreava.com. We can share product context, brand assets, and founder background.',
                ],
                [
                    'id' => 'contact',
                    'title' => 'Contact',
                    'body' => 'General questions: hello@kreava.com. Order or download help: support@kreava.com. We usually reply within one business day.',
                ],
                [
                    'id' => 'brand-kit',
                    'title' => 'Brand kit',
                    'body' => 'Use the Kreava logo without altering its proportions or colors. Primary: Indigo-600, accent: Emerald-500, highlight: Amber-500, alert: Rose-500.',
                ],
            ],
        ],
        'legal' => [
            'eyebrow' => 'Legal',
            'title' => 'Legal information',
            'description' => 'The rules and commitments that keep Kreava useful, safe, and fair for buyers and creators.',
            'sections' => [
                [
                    'id' => 'privacy',
                    'title' => 'Privacy policy',
                    'body' => 'We collect only the information needed to run your account, process orders, and improve the marketplace. We do not sell personal data. You can request access to, correction of, or deletion of your personal data by contacting privacy@kreava.com.',
                ],
                [
                    'id' => 'terms',
                    'title' => 'Terms of service',
                    'body' => 'By using Kreava, you agree to list only lawful digital products, respect intellectual property, and use the platform responsibly. Buyers receive a licence to use purchased files as described on each product page. Creators must have the rights to everything they upload.',
                ],
                [
                    'id' => 'cookies',
                    'title' => 'Cookie policy',
                    'body' => 'Kreava uses essential cookies for authentication, security, and language preferences. We do not use advertising cookies. You can clear cookies in your browser, but you may need to sign in again.',
                ],
                [
                    'id' => 'security',
                    'title' => 'Security',
                    'body' => 'We use encrypted connections, hashed passwords, and access controls to protect accounts and orders. Report a vulnerability to security@kreava.com. Please do not test against real customer accounts or files.',
                ],
                [
                    'id' => 'compliance',
                    'title' => 'Compliance',
                    'body' => 'Kreava is committed to applicable data protection and consumer protection rules. For compliance requests, contact compliance@kreava.com. We review every request and respond within the timeframe required by law.',
                ],
            ],
        ],
        'resources' => [
            'eyebrow' => 'Resources',
            'title' => 'Creator resources',
            'description' => 'Everything you need to start selling, manage orders, and grow your store on Kreava.',
            'sections' => [
                [
                    'id' => 'pricing',
                    'title' => 'Pricing',
                    'body' => 'Creating an account and listing products on Kreava is free. Any seller fees and payout terms are shown clearly in the seller dashboard before a payout is requested.',
                ],
                [
                    'id' => 'resources',
                    'title' => 'Guides and support',
                    'body' => 'Guides for uploading products, managing orders, and growing your store are being prepared. In the meantime, contact support@kreava.com for help with your account or products.',
                ],
                [
                    'id' => 'api-docs',
                    'title' => 'API documentation',
                    'body' => 'Kreava does not offer a public API yet. This page will be updated when API access becomes available.',
                ],
            ],
        ],
        'status' => [
            'eyebrow' => 'Status',
            'title' => 'Kreava system status',
            'description' => 'Current availability of the core Kreava services.',
            'sections' => [
                [
                    'id' => 'marketplace',
                    'title' => 'Marketplace',
                    'body' => 'Operational. Browsing, search, and product pages are available.',
                ],
                [
                    'id' => 'payments',
                    'title' => 'Payments',
                    'body' => 'Operational. Mock checkout is available for testing paid orders.',
                ],
                [
                    'id' => 'downloads',
                    'title' => 'Downloads',
                    'body' => 'Operational. Paid buyers can access their files from the library.',
                ],
                [
                    'id' => 'accounts',
                    'title' => 'Accounts',
                    'body' => 'Operational. Registration, login, and profile settings are available.',
                ],
            ],
        ],
    ];

    public function company(): Response
    {
        return $this->render('company');
    }

    public function legal(): Response
    {
        return $this->render('legal');
    }

    public function resources(): Response
    {
        return $this->render('resources');
    }

    public function status(): Response
    {
        return $this->render('status');
    }

    private function render(string $slug): Response
    {
        return Inertia::render('info/page', [
            'page' => [
                'slug' => $slug,
                ...self::PAGES[$slug],
            ],
        ]);
    }
}
