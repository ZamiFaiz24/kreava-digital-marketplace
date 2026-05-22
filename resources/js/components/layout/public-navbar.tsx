'use client'

import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Menu, X, Search, ShoppingCart, Heart, ChevronDown } from 'lucide-react'

type PublicNavbarVariant = 'landing' | 'marketplace'

const categoryLinks = [
  { label: 'Templates', href: '/marketplace?category=templates' },
  { label: 'UI Kits', href: '/marketplace?category=ui-kits' },
  { label: 'Fonts', href: '/marketplace?category=fonts' },
  { label: 'Mockups', href: '/marketplace?category=mockups' },
  { label: 'Icons', href: '/marketplace?category=icons' },
  { label: 'Illustrations', href: '/marketplace?category=illustrations' },
]

interface PublicNavbarProps {
  variant?: PublicNavbarVariant
}

export default function PublicNavbar({ variant = 'landing' }: PublicNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > (variant === 'marketplace' ? 8 : 24))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [variant])

  const isMarketplace = variant === 'marketplace'
  const primaryNavHref = isMarketplace ? route('landing') : route('marketplace')
  const primaryNavLabel = isMarketplace ? 'Home' : 'Marketplace'

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isMarketplace
          ? isScrolled
            ? 'border-border bg-background/90 shadow-sm backdrop-blur-xl'
            : 'border-border/60 bg-background/80 backdrop-blur-xl'
          : isScrolled
            ? 'border-border bg-background/85 backdrop-blur-xl'
            : 'border-transparent bg-background/70 backdrop-blur-lg'
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={route('landing')} className="flex items-center">
          <img
            src="/images/Logo/LogoFull.png"
            alt="KREAVA"
            className="-ml-4 h-[120px] w-[120px] object-contain sm:-ml-5 sm:h-[156px] sm:w-[156px]"
          />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link href={primaryNavHref} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
            {primaryNavLabel}
          </Link>
          <a href={isMarketplace ? '/marketplace' : '#explore'} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
            Explore
          </a>
          {isMarketplace ? (
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
                Categories
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-0 top-full z-50 mt-2 w-52 translate-y-1 rounded-2xl border border-border bg-background p-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {categoryLinks.map((category) => (
                  <a
                    key={category.href}
                    href={category.href}
                    className="block rounded-xl px-3 py-2 text-sm text-foreground/80 transition hover:bg-muted hover:text-foreground"
                  >
                    {category.label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a href="#pricing" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
              Pricing
            </a>
          )}
          {isMarketplace && (
            <Link href={route('creators')} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
              Creators
            </Link>
          )}
        </div>

        {isMarketplace && (
          <div className="hidden flex-1 px-6 lg:block">
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates, UI kits, mockups..."
                className="h-11 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        <div className="hidden items-center gap-2 md:flex">
          {isMarketplace && (
            <>
              <a
                href="/seller/register"
                className="hidden px-3 py-2 text-sm font-medium border border-input rounded-xl text-foreground/70 transition hover:text-foreground hover:bg-muted lg:block"
              >
                Sell
              </a>
              <button className="hidden h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition hover:bg-muted hover:text-foreground lg:flex">
                <Heart className="h-4 w-4" />
              </button>
              <button className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition hover:bg-muted hover:text-foreground lg:flex">
                <ShoppingCart className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  2
                </span>
              </button>
            </>
          )}

          <a href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
            Login
          </a>
          <a href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            Register
          </a>
        </div>

        <button
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-lg p-2 transition hover:bg-muted md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
            <Link href={primaryNavHref} className="text-sm text-foreground/80 transition hover:text-foreground">
              {primaryNavLabel}
            </Link>
            <a href={isMarketplace ? '/marketplace' : '#explore'} className="text-sm text-foreground/80 transition hover:text-foreground">
              Explore
            </a>
            {isMarketplace ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground/80">Categories</div>
                <div className="grid grid-cols-2 gap-2">
                  {categoryLinks.map((category) => (
                    <a
                      key={category.href}
                      href={category.href}
                      className="rounded-lg border border-input px-3 py-2 text-sm text-foreground/80 transition hover:bg-muted hover:text-foreground"
                    >
                      {category.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a href="#categories" className="text-sm text-foreground/80 transition hover:text-foreground">
                Categories
              </a>
            )}

            {isMarketplace ? (
              <div className="space-y-2">
                <Link href={route('creators')} className="text-sm text-foreground/80 transition hover:text-foreground">
                  Creators
                </Link>
                <a href="/seller/register" className="text-sm text-foreground/80 transition hover:text-foreground">
                  Sell on Kreava
                </a>
              </div>
            ) : (
              <a href="#pricing" className="text-sm text-foreground/80 transition hover:text-foreground">
                Pricing
              </a>
            )}

            <div className="flex gap-2 border-t border-border pt-3">
              <a href="/login" className="flex-1 rounded-lg border border-input px-3 py-2 text-center text-sm font-medium text-foreground">
                Login
              </a>
              <a href="/register" className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">
                Register
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
