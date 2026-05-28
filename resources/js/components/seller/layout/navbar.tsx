'use client';

import React, { useState } from 'react';
import { Search, Bell, Upload, Menu } from 'lucide-react';

interface NavbarProps {
  sellerName: string;
  sellerAvatar: string;
  onMenuClick?: () => void;
}

export default function Navbar({ sellerName, sellerAvatar, onMenuClick }: NavbarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="h-16 bg-white border-b border-border sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Search */}
        <div className="flex-1 flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-muted rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, orders..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 ml-4">
          {/* Upload Product Button */}
          <button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload Product</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 hover:bg-muted rounded-lg relative transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-border shadow-lg">
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-foreground">Notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border-b border-border hover:bg-muted/50 cursor-pointer">
                      <p className="font-medium text-sm text-foreground">New order received</p>
                      <p className="text-xs text-muted-foreground mt-1">You have a new order for &quot;UI Kit Pro&quot;</p>
                      <p className="text-xs text-muted-foreground mt-2">{i} hour ago</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationOpen(false);
              }}
              className="flex items-center gap-2 p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <img
                src={sellerAvatar}
                alt={sellerName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:inline text-sm font-medium text-foreground">{sellerName}</span>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-border shadow-lg">
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-foreground text-sm">{sellerName}</p>
                  <p className="text-xs text-muted-foreground">seller@kreava.com</p>
                </div>
                <div className="p-2">
                  <a href="#" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">
                    Profile Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">
                    Store Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">
                    Billing
                  </a>
                  <div className="border-t border-border my-2"></div>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
