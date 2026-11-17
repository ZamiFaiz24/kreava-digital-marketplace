'use client';

import { Link, usePage } from '@inertiajs/react';
import { BarChart3, LayoutGrid, LogOut, Package, ScrollText, Settings, ShoppingCart, Users, Wallet } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

import type { DashboardNavGroup, ProfileBadge } from './nav-types';

const iconMap: Record<string, React.ReactNode> = {
    grid: <LayoutGrid className="h-5 w-5" />,
    package: <Package className="h-5 w-5" />,
    'shopping-cart': <ShoppingCart className="h-5 w-5" />,
    'scroll-text': <ScrollText className="h-5 w-5" />,
    'bar-chart-2': <BarChart3 className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
    wallet: <Wallet className="h-5 w-5" />,
    settings: <Settings className="h-5 w-5" />,
};

interface SidebarProps {
    navGroups: DashboardNavGroup[];
    sellerName: string;
    sellerAvatar: string;
    profileBadge: ProfileBadge;
    onNavigate?: () => void;
}

const badgeToneClass: Record<ProfileBadge['tone'], string> = {
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    neutral: 'bg-slate-100 text-slate-600',
};

export default function Sidebar({ navGroups, sellerName, sellerAvatar, profileBadge, onNavigate }: SidebarProps) {
    const { url } = usePage();
    const { t } = useTranslation();
    const isActive = (href: string) => url === href || url.startsWith(`${href}/`);

    return (
        <div className="relative flex h-full w-64 shrink-0 flex-col border-r border-slate-200/70 bg-slate-50">
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200/70 px-4">
                <Link href="/" className="flex items-center justify-center" onClick={onNavigate}>
                    <img src="/images/Logo/LogoFull2-trimmed.png" alt="KREAVA" className="h-10 w-auto object-contain" />
                </Link>
            </div>

            <div className="border-b border-slate-200/70 px-4 py-3">
                <div className="flex items-center gap-3">
                    <img src={sellerAvatar} alt={sellerName} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{sellerName}</p>
                        <span
                            className={cn(
                                'mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                                badgeToneClass[profileBadge.tone],
                            )}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                            {profileBadge.label}
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 pb-20">
                {navGroups.map((group, groupIndex) => (
                    <div key={group.labelKey} className={groupIndex === 0 ? 'mt-4' : 'mt-6'}>
                        <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{t(group.labelKey)}</p>
                        <div className="mt-2 space-y-1">
                            {group.items.map((item) => {
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavigate}
                                        aria-current={active ? 'page' : undefined}
                                        className={cn(
                                            'relative flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[15px] transition-colors',
                                            active
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                                        )}
                                    >
                                        {active && <span className="bg-primary absolute inset-y-1 left-0 w-[3px] rounded-full" aria-hidden="true" />}
                                        <span className="flex min-w-0 items-center gap-3">
                                            <span className="shrink-0">{iconMap[item.icon]}</span>
                                            <span className="truncate">{item.labelKey ? t(item.labelKey) : item.label}</span>
                                        </span>
                                        {item.badge ? (
                                            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                                                {item.badge}
                                            </span>
                                        ) : null}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="absolute inset-x-0 bottom-0 border-t border-slate-200/70 bg-slate-50 p-3">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                    <LogOut className="h-5 w-5" aria-hidden="true" />
                    <span>{t('dashboard.layout.logout')}</span>
                </Link>
            </div>
        </div>
    );
}
