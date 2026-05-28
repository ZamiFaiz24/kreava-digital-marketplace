'use client'

import { useEffect, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Menu, X, Search, ShoppingCart, Heart, ChevronDown, ArrowRight } from 'lucide-react'
import type { LandingCategory } from '@/types/landing'
import type { Category as MarketplaceCategory } from '@/types/marketplace'
import type { SharedData } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserMenuContent } from '@/components/user-menu-content'
import { getCategoryIcon } from '@/lib/category-icons'

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
  categories?: Array<LandingCategory | MarketplaceCategory>
}

interface NavbarCategoryItem {
  slug: string
  title: string
  href: string
  description?: string
  count?: number
  icon?: string | null
}

export default function PublicNavbar({ variant = 'landing', categories = [] }: PublicNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { auth } = usePage<SharedData>().props

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
  const sellerCtaHref = `${route('register')}?intent=seller`
  const isAuthenticated = Boolean(auth?.user)
  const normalizedCategories: NavbarCategoryItem[] = categories.map((category) =>
    'name' in category
      ? {
          slug: category.slug,
          title: category.name,
          href: `/marketplace?category=${category.slug}`,
          count: category.count ?? category.products_count,
          icon: category.icon,
        }
      : {
          slug: category.slug,
          title: category.title,
          href: category.href,
          description: category.description,
          count: category.count,
          icon: category.icon,
        },
  )

  const triggerLabel = auth?.user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <>
      {variant === 'landing' && (
        <div className="bg-primary/95 text-primary-foreground text-sm text-center">
          <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">New: Free templates this month — <a href="/marketplace?tag=new" className="underline">Explore now</a></div>
        </div>
      )}

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
            className={
              isMarketplace
                ? 'h-10 w-10 object-contain sm:h-12 sm:w-12'
                : '-ml-4 h-[120px] w-[120px] object-contain sm:-ml-5 sm:h-[156px] sm:w-[156px]'
            }
          />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link href={primaryNavHref} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
            {primaryNavLabel}
          </Link>
          {isMarketplace ? (
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
                Categories
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-0 top-full z-50 mt-2 w-64 translate-y-1 rounded-2xl border border-border bg-background p-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {(normalizedCategories.length > 0
                  ? normalizedCategories
                  : categoryLinks.map((category) => ({
                      slug: category.href,
                      title: category.label,
                      href: category.href,
                      count: undefined,
                    }))).map((category) => (
                  <a
                    key={category.href}
                    href={category.href}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground/80 transition hover:bg-muted hover:text-foreground"
                  >
                    <span>{category.title}</span>
                    {category.count !== undefined && (
                      <span className="text-xs text-foreground/40">{category.count}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
                Categories
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-[min(92vw,960px)] -translate-x-1/2 translate-y-2 rounded-[28px] border border-border bg-background p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Browse categories</p>
                        <h3 className="mt-1 text-xl font-bold text-foreground">Explore by category</h3>
                      </div>
                      <Link href={route('marketplace')} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                        View all
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                      {(normalizedCategories.length > 0 ? normalizedCategories : categoryLinks.map((item) => ({
                        slug: item.href,
                        title: item.label,
                        description: 'Browse products in this category',
                        icon: 'sparkles',
                        href: item.href,
                        count: undefined,
                      } as NavbarCategoryItem))).map((category) => {
                        const Icon = getCategoryIcon(category.icon)

                        return (
                          <Link
                            key={category.slug}
                            href={category.href}
                            className="group/item rounded-2xl border border-border bg-muted/30 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/60"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium text-foreground">{category.title}</span>
                                  {category.count !== undefined && (
                                    <span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-foreground/50">
                                      {category.count}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-foreground/60">{category.description}</p>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-border bg-background p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Featured path</p>
                    <h4 className="mt-2 text-xl font-bold text-foreground">Need inspiration?</h4>
                    <p className="mt-3 text-sm leading-6 text-foreground/60">
                      Start with UI Kits, Templates, or Source Code to find products that fit your workflow.
                    </p>

                    <div className="mt-5 space-y-2">
                      <Link href={route('marketplace')} className="block rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                        Browse marketplace
                      </Link>
                      <Link href={route('creators')} className="block rounded-xl border border-input px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted">
                        Meet creators
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isMarketplace && (
            <Link href={route('creators')} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
              Creators
            </Link>
          )}
        </div>

        {variant === 'landing' && (
          <div className="hidden items-center gap-2 md:flex">
            <Link href={sellerCtaHref} className="rounded-xl border border-input px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted">
              Sell on KREAVA
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                      <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                      <AvatarFallback className="rounded-full bg-muted text-xs text-foreground">
                        {triggerLabel}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[120px] truncate">{auth.user.name}</span>
                    <ChevronDown className="h-4 w-4 text-foreground/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <UserMenuContent user={auth.user} />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={route('login')} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Login
              </Link>
            )}
          </div>
        )}

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

        {isMarketplace && (
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={sellerCtaHref}
              className="hidden rounded-xl border border-input px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground lg:block"
            >
              Sell
            </Link>
            <button className="hidden h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition hover:bg-muted hover:text-foreground lg:flex">
              <Heart className="h-4 w-4" />
            </button>
            <button className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition hover:bg-muted hover:text-foreground lg:flex">
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                2
              </span>
            </button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex w-full items-center justify-between rounded-lg border border-input px-3 py-2 text-left text-sm font-medium text-foreground transition hover:bg-muted">
                    <span className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                        <AvatarFallback className="rounded-full bg-muted text-xs text-foreground">
                          {triggerLabel}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex flex-col text-left">
                        <span className="font-medium text-foreground">{auth.user.name}</span>
                        <span className="text-xs text-foreground/50">Account</span>
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-foreground/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <UserMenuContent user={auth.user} />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href={route('login')} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
                  Login
                </Link>
                <Link href={route('register')} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Register
                </Link>
              </>
            )}
          </div>
        )}

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
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground/80">Categories</div>
                <div className="grid grid-cols-1 gap-2">
                  {(normalizedCategories.length > 0 ? normalizedCategories : categoryLinks.map((item) => ({
                    slug: item.href,
                    title: item.label,
                    description: 'Browse products in this category',
                    icon: 'sparkles',
                    href: item.href,
                    count: undefined,
                  } as NavbarCategoryItem))).map((category) => {
                    const Icon = getCategoryIcon(category.icon)

                    return (
                      <Link
                        key={category.slug}
                        href={category.href}
                        className="flex items-center gap-3 rounded-2xl border border-input px-3 py-3 text-sm text-foreground/80 transition hover:bg-muted hover:text-foreground"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex-1 text-left">
                          <span className="block font-medium text-foreground">{category.title}</span>
                          <span className="block text-xs text-foreground/50">{category.description}</span>
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {isMarketplace ? (
              <div className="space-y-2">
                <Link href={route('creators')} className="text-sm text-foreground/80 transition hover:text-foreground">
                  Creators
                </Link>
                <Link href={sellerCtaHref} className="text-sm text-foreground/80 transition hover:text-foreground">
                  Sell on Kreava
                </Link>
              </div>
            ) : (
              <Link href={sellerCtaHref} className="text-sm text-foreground/80 transition hover:text-foreground">
                Sell on KREAVA
              </Link>
            )}

            {isAuthenticated ? (
              <div className="border-t border-border pt-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center justify-between rounded-lg border border-input px-3 py-3 text-left text-sm font-medium text-foreground transition hover:bg-muted">
                      <span className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                          <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                          <AvatarFallback className="rounded-full bg-muted text-xs text-foreground">
                            {triggerLabel}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex flex-col text-left">
                          <span className="font-medium text-foreground">{auth.user.name}</span>
                          <span className="text-xs text-foreground/50">Account</span>
                        </span>
                      </span>
                      <ChevronDown className="h-4 w-4 text-foreground/60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-56" align="start">
                    <UserMenuContent user={auth.user} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2 border-t border-border pt-3">
                <Link href={route('login')} className="flex-1 rounded-lg border border-input px-3 py-2 text-center text-sm font-medium text-foreground">
                  Login
                </Link>
                <Link href={route('register')} className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  )
}
