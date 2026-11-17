'use client';

import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu, Search, Upload } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '@/components/shared/language-switcher';

interface NavbarProps {
    sellerName: string;
    sellerAvatar: string;
    profileEmail?: string;
    showUploadAction?: boolean;
    onMenuClick?: () => void;
}

export default function Navbar({ sellerName, sellerAvatar, profileEmail, showUploadAction = true, onMenuClick }: NavbarProps) {
    const { t } = useTranslation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { auth } = usePage<{ auth: { user?: { role?: string } } }>().props;
    const isSeller = auth?.user?.role === 'seller';

    return (
        <header className="sticky top-0 z-30 h-16 shrink-0 border-b border-slate-200/70 bg-white/80">
            <div className="flex h-full items-center gap-3 px-4 md:px-6">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label={t('dashboard.layout.open_menu')}
                    className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="hidden w-full max-w-sm md:block">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input
                            type="search"
                            placeholder={t('dashboard.layout.search_placeholder')}
                            className="h-9 w-full rounded-lg border border-slate-200/70 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none"
                        />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    <LanguageSwitcher variant="dashboard" />

                    {showUploadAction && (
                        <Link
                            href={route('seller.products.new')}
                            aria-label={t('dashboard.layout.upload_product')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors"
                        >
                            <Upload className="h-4 w-4" aria-hidden="true" />
                            <span className="hidden sm:inline">{t('dashboard.layout.upload_product')}</span>
                        </Link>
                    )}

                    <button
                        type="button"
                        aria-label={t('dashboard.layout.notifications')}
                        className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        <Bell className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsProfileOpen((open) => !open)}
                            aria-label={t('dashboard.layout.open_profile')}
                            aria-expanded={isProfileOpen}
                            aria-haspopup="menu"
                            className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100"
                        >
                            <img src={sellerAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                            <span className="hidden max-w-[140px] truncate text-sm font-medium text-slate-900 md:inline">{sellerName}</span>
                        </button>

                        {isProfileOpen && (
                            <div role="menu" className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200/70 bg-white p-2 shadow-lg">
                                <div className="border-b border-slate-200/70 px-3 py-2">
                                    <p className="truncate text-sm font-semibold text-slate-900">{sellerName}</p>
                                    {profileEmail && <p className="truncate text-xs text-slate-500">{profileEmail}</p>}
                                </div>
                                {isSeller && (
                                    <Link
                                        href={route('seller.settings')}
                                        role="menuitem"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="mt-1 block rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        {t('dashboard.layout.store_settings')}
                                    </Link>
                                )}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    role="menuitem"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
                                >
                                    {t('dashboard.layout.logout')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
