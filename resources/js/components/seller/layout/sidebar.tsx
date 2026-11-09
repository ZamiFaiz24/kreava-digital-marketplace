'use client';

import { Link, usePage } from '@inertiajs/react';
import { BarChart3, LayoutGrid, LogOut, Package, Settings, ShoppingCart, Users, Wallet } from 'lucide-react';
import React from 'react';

const iconMap: Record<string, React.ReactNode> = {
    grid: <LayoutGrid className="h-5 w-5" />,
    package: <Package className="h-5 w-5" />,
    'shopping-cart': <ShoppingCart className="h-5 w-5" />,
    'bar-chart-2': <BarChart3 className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
    wallet: <Wallet className="h-5 w-5" />,
    settings: <Settings className="h-5 w-5" />,
};

interface SidebarProps {
    navItems: Array<{
        label: string;
        icon: string;
        href: string;
        badge?: number;
    }>;
    sellerName: string;
    sellerAvatar: string;
    accountLabel?: string;
}

export default function Sidebar({ navItems, sellerName, sellerAvatar, accountLabel = 'Seller Account' }: SidebarProps) {
    const { url } = usePage();
    const isActive = (href: string) => url === href || url.startsWith(`${href}/`);

    return (
        <div className="border-border sticky top-0 h-screen w-64 overflow-y-auto border-r bg-white">
            {/* Logo Section */}
            <div className="border-border border-b p-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="from-primary to-accent flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
                        <span className="text-sm font-bold text-white">K</span>
                    </div>
                    <span className="text-foreground text-lg font-bold">KREAVA</span>
                </Link>
            </div>

            {/* Seller Info */}
            <div className="border-border border-b p-6">
                <div className="flex items-center gap-3">
                    <img src={sellerAvatar} alt={sellerName} className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-semibold">{sellerName}</p>
                        <p className="text-muted-foreground text-xs">{accountLabel}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 transition-all ${
                            isActive(item.href) ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {iconMap[item.icon]}
                            <span>{item.label}</span>
                        </div>
                        {item.badge ? <span className="bg-accent rounded-full px-2 py-1 text-xs font-semibold text-white">{item.badge}</span> : null}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="border-border absolute bottom-0 w-64 border-t bg-white p-4">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-foreground hover:bg-muted flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
}
