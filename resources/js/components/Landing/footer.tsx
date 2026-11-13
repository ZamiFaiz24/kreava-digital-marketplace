'use client';

import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Separator } from '@/components/ui/separator';

const marketplaceLinks = ['all_products', 'ui_kits', 'templates', 'source_code', 'ebooks', 'icons'];
const creatorLinks = ['start_selling', 'creator_dashboard', 'analytics', 'pricing', 'resources', 'api_docs'];
const companyLinks = ['about_us', 'blog', 'careers', 'press', 'contact', 'brand_kit'];
const legalLinks = ['privacy_policy', 'terms_of_service', 'cookie_policy', 'security', 'compliance', 'contact'];

export function Footer() {
    const { t } = useTranslation();

    const renderLinks = (keys: string[]) => (
        <ul className="space-y-3">
            {keys.map((key) => (
                <li key={key}>
                    <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition">
                        {t(`landing.footer.links.${key}`)}
                    </a>
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
                        <div className="mb-4 flex items-center gap-3">
                            <img src="/images/Logo.png" alt="KREAVA mark" className="h-10 w-10 object-contain object-bottom" />
                            <img src="/images/Brand.png" alt="KREAVA" className="h-8 w-[165px] object-contain object-bottom" />
                        </div>
                        <p className="text-foreground/60 mb-6 text-sm">{t('landing.footer.description')}</p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: '#' },
                                { icon: Facebook, href: '#' },
                                { icon: Instagram, href: '#' },
                                { icon: Linkedin, href: '#' },
                            ].map((social, i) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={i}
                                        href={social.href}
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
                        <a href="#" className="text-foreground/60 hover:text-foreground text-xs transition">
                            {t('landing.footer.links.privacy')}
                        </a>
                        <a href="#" className="text-foreground/60 hover:text-foreground text-xs transition">
                            {t('landing.footer.links.terms')}
                        </a>
                        <a href="#" className="text-foreground/60 hover:text-foreground text-xs transition">
                            {t('landing.footer.links.status')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
