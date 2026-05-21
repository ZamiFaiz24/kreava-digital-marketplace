'use client'

import { useEffect, useState } from 'react'
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  Sparkles,
} from 'lucide-react'

export default function MarketplaceHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-extrabold tracking-tight text-foreground">
                KREAVA
              </h1>

              <p className="-mt-1 text-[11px] text-muted-foreground">
                Creative Digital Marketplace
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 lg:flex">
            <a
              href="/marketplace"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Explore
            </a>

            <button className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Categories
              <ChevronDown className="h-4 w-4" />
            </button>

            <a
              href="/creators"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Creators
            </a>
          </nav>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden flex-1 px-8 lg:block">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search templates, UI kits, mockups..."
              className="h-12 w-full rounded-2xl border border-border bg-background/70 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* Sell CTA */}
          <a
            href="/seller/register"
            className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 lg:block"
          >
            Sell on Kreava
          </a>

          {/* Wishlist */}
          <button className="hidden h-11 w-11 items-center justify-center rounded-xl border border-border bg-card transition-all hover:border-primary hover:bg-primary/5 md:flex">
            <Heart className="h-5 w-5 text-foreground" />
          </button>

          {/* Cart */}
          <button className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-border bg-card transition-all hover:border-primary hover:bg-primary/5 md:flex">
            <ShoppingCart className="h-5 w-5 text-foreground" />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              2
            </span>
          </button>

          {/* Auth */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Register
            </a>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card">
              <Search className="h-5 w-5" />
            </button>

            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}