'use client';

import { usePage } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { DashboardNavGroup, DashboardNavItem, ProfileBadge } from './nav-types';
import Navbar from './navbar';
import Sidebar from './sidebar';

const sellerNavItems: DashboardNavItem[] = [
    {
        label: 'Dashboard',
        labelKey: 'dashboard.nav.dashboard',
        icon: 'grid',
        href: '/seller/dashboard',
        groupKey: 'dashboard.nav.groups.store',
    },
    {
        label: 'Products',
        labelKey: 'dashboard.nav.products',
        icon: 'package',
        href: '/seller/products',
        groupKey: 'dashboard.nav.groups.store',
    },
    {
        label: 'Orders',
        labelKey: 'dashboard.nav.orders',
        icon: 'shopping-cart',
        href: '/seller/orders',
        groupKey: 'dashboard.nav.groups.store',
    },
    {
        label: 'Customers',
        labelKey: 'dashboard.nav.customers',
        icon: 'users',
        href: '/seller/customers',
        groupKey: 'dashboard.nav.groups.store',
    },
    {
        label: 'Analytics',
        labelKey: 'dashboard.nav.analytics',
        icon: 'bar-chart-2',
        href: '/seller/analytics',
        groupKey: 'dashboard.nav.groups.analytics_finance',
    },
    {
        label: 'Payouts',
        labelKey: 'dashboard.nav.payouts',
        icon: 'wallet',
        href: '/seller/payouts',
        groupKey: 'dashboard.nav.groups.analytics_finance',
    },
    {
        label: 'Settings',
        labelKey: 'dashboard.nav.settings',
        icon: 'settings',
        href: '/seller/settings',
        groupKey: 'dashboard.nav.groups.account',
    },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
    navItems?: DashboardNavItem[];
    accountLabel?: string;
    showUploadAction?: boolean;
}

export default function DashboardLayout({ children, navItems = sellerNavItems, accountLabel, showUploadAction = true }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t } = useTranslation();
    const { auth, seller_status } = usePage<{
        auth: {
            user?: {
                name?: string;
                avatar?: string | null;
                email?: string;
                role?: string;
            };
        };
        seller_status?: string | null;
    }>().props;

    const navGroups = useMemo<DashboardNavGroup[]>(() => {
        const groups: DashboardNavGroup[] = [];

        navItems.forEach((item) => {
            const group = groups.find((candidate) => candidate.labelKey === item.groupKey);

            if (group) {
                group.items.push(item);
            } else {
                groups.push({ labelKey: item.groupKey, items: [item] });
            }
        });

        return groups;
    }, [navItems]);

    const sellerName = auth?.user?.name || t('dashboard.layout.seller_fallback');
    const sellerAvatar = auth?.user?.avatar || '/images/Brand.png';

    const profileBadge = useMemo<ProfileBadge>(() => {
        if (auth?.user?.role === 'admin' || accountLabel) {
            return {
                label: accountLabel ?? t('dashboard.profile.administrator'),
                tone: 'neutral',
            };
        }

        if (seller_status === 'approved') {
            return { label: t('dashboard.profile.verified'), tone: 'success' };
        }

        return { label: t('dashboard.profile.pending_verification'), tone: 'warning' };
    }, [accountLabel, auth?.user?.role, seller_status, t]);

    return (
        <div className="flex h-screen bg-slate-50">
            <div className="hidden lg:flex">
                <Sidebar navGroups={navGroups} sellerName={sellerName} sellerAvatar={sellerAvatar} profileBadge={profileBadge} />
            </div>

            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsSidebarOpen(false)} />
                    <div className="absolute inset-y-0 left-0 z-50 shadow-xl">
                        <Sidebar
                            navGroups={navGroups}
                            sellerName={sellerName}
                            sellerAvatar={sellerAvatar}
                            profileBadge={profileBadge}
                            onNavigate={() => setIsSidebarOpen(false)}
                        />
                    </div>
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar
                    sellerName={sellerName}
                    sellerAvatar={sellerAvatar}
                    profileEmail={auth?.user?.email}
                    showUploadAction={showUploadAction}
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <main className="flex-1 overflow-y-auto bg-slate-50">
                    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
