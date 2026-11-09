'use client';

import { usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

const sidebarNavItems = [
    { label: 'Dashboard', icon: 'grid', href: '/seller/dashboard' },
    { label: 'Products', icon: 'package', href: '/seller/products' },
    { label: 'Orders', icon: 'shopping-cart', href: '/seller/orders' },
    { label: 'Analytics', icon: 'bar-chart-2', href: '/seller/analytics' },
    { label: 'Customers', icon: 'users', href: '/seller/customers' },
    { label: 'Payouts', icon: 'wallet', href: '/seller/payouts' },
    { label: 'Settings', icon: 'settings', href: '/seller/settings' },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
    navItems?: Array<{
        label: string;
        icon: string;
        href: string;
        badge?: number;
    }>;
    accountLabel?: string;
    showUploadAction?: boolean;
}

export default function DashboardLayout({
    children,
    navItems = sidebarNavItems,
    accountLabel = 'Seller Account',
    showUploadAction = true,
}: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { auth } = usePage<{
        auth: { user?: { name?: string; avatar?: string | null; email?: string } };
    }>().props;

    const sellerName = auth?.user?.name || 'Seller';
    const sellerAvatar = auth?.user?.avatar || '/images/Brand.png';

    return (
        <div className="bg-background flex h-screen">
            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block">
                <Sidebar navItems={navItems} sellerName={sellerName} sellerAvatar={sellerAvatar} accountLabel={accountLabel} />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Sidebar navItems={navItems} sellerName={sellerName} sellerAvatar={sellerAvatar} accountLabel={accountLabel} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar
                    sellerName={sellerName}
                    sellerAvatar={sellerAvatar}
                    profileEmail={auth?.user?.email}
                    showUploadAction={showUploadAction}
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* Dashboard Content */}
                <main className="bg-background flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
