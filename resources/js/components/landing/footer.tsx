'use client';

import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Separator } from '@/components/ui/separator';

interface FooterLink {
    key: string;
    href: string;
}

export function Footer() {
    const { t } = useTranslation();

    const marketplaceLinks: FooterLink[] = [
        { key: 'all_products', href: route('marketplace') },
        { key: 'ui_kits', href: route('marketplace', { category: 'ui-kits' }) },
        { key: 'templates', href: route('marketplace', { category: 'templates' }) },
        { key: 'source_code', href: route('marketplace', { category: 'source-code' }) },
        { key: 'ebooks', href: route('marketplace', { category: 'ebooks' }) },
        { key: 'icons', href: route('marketplace', { category: 'icons' }) },
    ];

    const creatorLinks: FooterLink[] = [
        { key: 'start_selling', href: route('register', { role: 'seller' }) },
        { key: 'creator_dashboard', href: route('seller.dashboard') },
        { key: 'analytics', href: route('seller.analytics') },
        { key: 'browse_creators', href: route('creators') },
        { key: 'pricing', href: `${route('resources')}#pricing` },
        { key: 'resources', href: route('resources') },
        { key: 'api_docs', href: `${route('resources')}#api-docs` },
    ];

    const companyLinks: FooterLink[] = [
        { key: 'about_us', href: `${route('company')}#about` },
        { key: 'blog', href: `${route('company')}#blog` },
        { key: 'careers', href: `${route('company')}#careers` },
        { key: 'press', href: `${route('company')}#press` },
        { key: 'contact', href: `${route('company')}#contact` },
        { key: 'brand_kit', href: `${route('company')}#brand-kit` },
    ];

    const legalLinks: FooterLink[] = [
        { key: 'privacy_policy', href: `${route('legal')}#privacy` },
        { key: 'terms_of_service', href: `${route('legal')}#terms` },
        { key: 'cookie_policy', href: `${route('legal')}#cookies` },
        { key: 'security', href: `${route('legal')}#security` },
        { key: 'compliance', href: `${route('legal')}#compliance` },
        { key: 'contact', href: `${route('company')}#contact` },
    ];

    // Placeholder handles until the official Kreava social accounts are published.
    const socialLinks = [
        { icon: Twitter, href: 'https://x.com/kreava', label: 'Kreava on X' },
        { icon: Facebook, href: 'https://www.facebook.com/kreava', label: 'Kreava on Facebook' },
        { icon: Instagram, href: 'https://www.instagram.com/kreava', label: 'Kreava on Instagram' },
        { icon: Linkedin, href: 'https://www.linkedin.com/company/kreava', label: 'Kreava on LinkedIn' },
    ];

    const renderLinks = (links: FooterLink[]) => (
        <ul className="space-y-3">
            {links.map((link) => (
                <li key={link.key}>
                    <Link href={link.href} className="text-foreground/60 hover:text-foreground text-sm transition">
                        {t(`landing.footer.links.${link.key}`)}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <footer className="bg-background border-border border-t">
            <div className="container mx-auto px-4 py-16 md:py-20">
                {/* Main Content */}
                <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <Link href={route('landing')} className="mb-4 inline-flex items-center gap-3 transition-opacity hover:opacity-85">
                            <img src="/images/Logo/LogoMark-trimmed.png" alt="" className="h-10 w-10 object-contain" />
                            <img src="/images/Logo/LogoName-trimmed.png" alt="KREAVA" className="h-8 w-auto object-contain" />
                        </Link>
                        <p className="text-foreground/60 mb-6 text-sm">{t('landing.footer.description')}</p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                return (
                                    <a
                                        key={social.href}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="bg-muted hover:bg-primary hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Marketplace */}
                    <div>
                        <h4 className="text-foreground mb-4 font-semibold">{t('landing.footer.sections.marketplace')}</h4>
                        {renderLinks(marketplaceLinks)}
                    </div>

                    {/* For Creators */}
                    <div>
                        <h4 className="text-foreground mb-4 font-semibold">{t('landing.footer.sections.for_creators')}</h4>
                        {renderLinks(creatorLinks)}
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-foreground mb-4 font-semibold">{t('landing.footer.sections.company')}</h4>
                        {renderLinks(companyLinks)}
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-foreground mb-4 font-semibold">{t('landing.footer.sections.legal')}</h4>
                        {renderLinks(legalLinks)}
                    </div>
                </div>

                {/* Divider */}
                <Separator className="my-8" />

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-foreground/60 text-sm">{t('landing.footer.copyright')}</p>
                    <div className="flex items-center gap-6">
                        <Link href={`${route('legal')}#privacy`} className="text-foreground/60 hover:text-foreground text-xs transition">
                            {t('landing.footer.links.privacy')}
                        </Link>
                        <Link href={`${route('legal')}#terms`} className="text-foreground/60 hover:text-foreground text-xs transition">
                            {t('landing.footer.links.terms')}
                        </Link>
                        <Link href={route('status')} className="text-foreground/60 hover:text-foreground text-xs transition">
                            {t('landing.footer.links.status')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
