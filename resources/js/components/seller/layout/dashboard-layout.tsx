'use client';

import React, { useState } from 'react';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { sidebarNavItems, sellerProfile } from '../../../lib/mock-data';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar
          navItems={sidebarNavItems}
          sellerName={sellerProfile.name}
          sellerAvatar={sellerProfile.avatar}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setIsSidebarOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar
              navItems={sidebarNavItems}
              sellerName={sellerProfile.name}
              sellerAvatar={sellerProfile.avatar}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          sellerName={sellerProfile.name}
          sellerAvatar={sellerProfile.avatar}
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
