'use client';

import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './sidebar';
import Navbar from './navbar';

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
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { auth } = usePage<{ auth: { user?: { name?: string; avatar?: string | null } } }>().props;

  const sellerName = auth?.user?.name || 'Seller';
  const sellerAvatar = auth?.user?.avatar || '/images/Brand.png';

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar
          navItems={sidebarNavItems}
          sellerName={sellerName}
          sellerAvatar={sellerAvatar}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setIsSidebarOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar
              navItems={sidebarNavItems}
              sellerName={sellerName}
              sellerAvatar={sellerAvatar}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          sellerName={sellerName}
          sellerAvatar={sellerAvatar}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
