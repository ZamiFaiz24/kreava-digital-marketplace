'use client';

import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  grid: <LayoutGrid className="w-5 h-5" />,
  package: <Package className="w-5 h-5" />,
  'shopping-cart': <ShoppingCart className="w-5 h-5" />,
  'bar-chart-2': <BarChart3 className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  wallet: <Wallet className="w-5 h-5" />,
  settings: <Settings className="w-5 h-5" />,
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
}

export default function Sidebar({ navItems, sellerName, sellerAvatar }: SidebarProps) {
  const { url } = usePage();
  const isActive = (href: string) => url === href || url.startsWith(`${href}/`);

  return (
    <div className="w-64 bg-white border-r border-border h-screen sticky top-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-lg text-foreground">KREAVA</span>
        </Link>
      </div>

      {/* Seller Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src={sellerAvatar}
            alt={sellerName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{sellerName}</p>
            <p className="text-xs text-muted-foreground">Seller Account</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
              isActive(item.href)
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              {iconMap[item.icon]}
              <span>{item.label}</span>
            </div>
            {item.badge ? (
              <span className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-border bg-white">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
