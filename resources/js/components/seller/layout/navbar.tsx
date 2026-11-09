'use client';

import { Link } from '@inertiajs/react';
import { Bell, Menu, Search, Upload } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
    sellerName: string;
    sellerAvatar: string;
    profileEmail?: string;
    showUploadAction?: boolean;
    onMenuClick?: () => void;
}

export default function Navbar({ sellerName, sellerAvatar, profileEmail = 'seller@kreava.com', showUploadAction = true, onMenuClick }: NavbarProps) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="border-border sticky top-0 z-40 h-16 border-b bg-white">
            <div className="flex h-full items-center justify-between px-6">
                {/* Left: Search */}
                <div className="flex flex-1 items-center gap-4">
                    <button onClick={onMenuClick} className="hover:bg-muted rounded-lg p-2 lg:hidden">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="hidden max-w-sm flex-1 md:flex">
                        <div className="relative w-full">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                            <input
                                type="text"
                                placeholder="Search products, orders..."
                                className="border-border bg-muted/50 text-foreground placeholder-muted-foreground focus:ring-primary/20 w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="ml-4 flex items-center gap-4">
                    {/* Upload Product Button */}
                    {showUploadAction && (
                        <button className="bg-primary hover:bg-primary/90 hidden items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors sm:flex">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm font-medium">Upload Product</span>
                        </button>
                    )}

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setIsNotificationOpen(!isNotificationOpen);
                                setIsProfileOpen(false);
                            }}
                            className="hover:bg-muted relative rounded-lg p-2 transition-colors"
                        >
                            <Bell className="text-foreground h-5 w-5" />
                            <span className="bg-accent absolute top-1 right-1 h-2 w-2 rounded-full"></span>
                        </button>

                        {/* Notification Dropdown */}
                        {isNotificationOpen && (
                            <div className="border-border absolute right-0 mt-2 w-80 rounded-lg border bg-white shadow-lg">
                                <div className="border-border border-b p-4">
                                    <p className="text-foreground font-semibold">Notifications</p>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="border-border hover:bg-muted/50 cursor-pointer border-b p-4">
                                            <p className="text-foreground text-sm font-medium">New order received</p>
                                            <p className="text-muted-foreground mt-1 text-xs">You have a new order for &quot;UI Kit Pro&quot;</p>
                                            <p className="text-muted-foreground mt-2 text-xs">{i} hour ago</p>
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
                            className="hover:bg-muted flex items-center gap-2 rounded-lg p-1 transition-colors"
                        >
                            <img src={sellerAvatar} alt={sellerName} className="h-8 w-8 rounded-full object-cover" />
                            <span className="text-foreground hidden text-sm font-medium sm:inline">{sellerName}</span>
                        </button>

                        {/* Profile Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="border-border absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg">
                                <div className="border-border border-b p-4">
                                    <p className="text-foreground text-sm font-semibold">{sellerName}</p>
                                    <p className="text-muted-foreground text-xs">{profileEmail}</p>
                                </div>
                                <div className="p-2">
                                    <a href="#" className="text-foreground hover:bg-muted block rounded px-4 py-2 text-sm transition-colors">
                                        Profile Settings
                                    </a>
                                    <a href="#" className="text-foreground hover:bg-muted block rounded px-4 py-2 text-sm transition-colors">
                                        Store Settings
                                    </a>
                                    <a href="#" className="text-foreground hover:bg-muted block rounded px-4 py-2 text-sm transition-colors">
                                        Billing
                                    </a>
                                    <div className="border-border my-2 border-t"></div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="w-full rounded px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
