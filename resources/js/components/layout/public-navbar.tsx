'use client';

import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { getCategoryIcon } from '@/lib/category-icons';
import type { SharedData } from '@/types';
import type { LandingCategory } from '@/types/landing';
import type { Category as MarketplaceCategory } from '@/types/marketplace';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronDown, Heart, Menu, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PublicNavbarVariant = 'landing' | 'marketplace';

const categoryLinks = [
    { label: 'Templates', slug: 'templates' },
    { label: 'UI Kits', slug: 'ui-kits' },
    { label: 'Fonts', slug: 'fonts' },
    { label: 'Mockups', slug: 'mockups' },
    { label: 'Icons', slug: 'icons' },
    { label: 'Illustrations', slug: 'illustrations' },
];

interface PublicNavbarProps {
    variant?: PublicNavbarVariant;
    categories?: Array<LandingCategory | MarketplaceCategory>;
}

interface NavbarCategoryItem {
    slug: string;
    title: string;
    href: string;
    description?: string;
    count?: number;
    icon?: string | null;
}

export default function PublicNavbar({ variant = 'landing', categories = [] }: PublicNavbarProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > (variant === 'marketplace' ? 8 : 24));
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [variant]);

    const isMarketplace = variant === 'marketplace';
    const primaryNavHref = isMarketplace ? route('landing') : route('marketplace');
    const primaryNavLabel = isMarketplace ? t('common.nav.home') : t('common.nav.marketplace');
    const sellerCtaHref = route('register', { intent: 'seller' });
    const isAuthenticated = Boolean(auth?.user);
    const normalizedCategories: NavbarCategoryItem[] = categories.map((category) =>
        'name' in category
            ? {
                  slug: category.slug,
                  title: category.name,
                  href: route('marketplace', { category: category.slug }),
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
    );

    const triggerLabel = auth?.user?.name?.charAt(0)?.toUpperCase() || 'U';

    // Badge counts shared at the auth level so the User model is never mutated
    const wishlistCount = Number(auth?.wishlist_count ?? 0);
    const cartCount = Number(auth?.cart_count ?? 0);

    const formatBadge = (n: number, cap = 99) => {
        if (n <= 0) return null;
        if (n > cap) return `${cap}+`;
        return String(n);
    };

    return (
        <>
            {variant === 'landing' && (
                <div className="bg-primary/95 text-primary-foreground text-center text-sm">
                    <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
                        {t('common.banner.new_templates')}{' '}
                        <Link href={route('marketplace', { category: 'templates', sort: 'latest' })} className="underline">
                            {t('common.banner.explore_now')}
                        </Link>
                    </div>
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
                          : 'bg-background/70 border-transparent backdrop-blur-lg'
                }`}
            >
                <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link href={route('landing')} className="flex items-center">
                            {isMarketplace ? (
                                <img src="/images/Logo/LogoMark-trimmed.png" alt="KREAVA" className="h-10 w-10 object-contain" />
                            ) : (
                                <img src="/images/Logo/LogoFull2-trimmed.png" alt="KREAVA" className="h-12 w-auto object-contain sm:h-14" />
                            )}
                        </Link>

                        <div className="hidden items-center gap-3 md:flex">
                            <Link
                                href={primaryNavHref}
                                className="text-foreground/70 hover:bg-muted hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium transition"
                            >
                                {primaryNavLabel}
                            </Link>
                            {isMarketplace ? (
                                <div className="group relative">
                                    <button className="text-foreground/70 hover:bg-muted hover:text-foreground flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition">
                                        {t('common.nav.categories')}
                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                                    </button>

                                    <div className="border-border bg-background invisible absolute top-full left-0 z-50 mt-2 w-64 translate-y-1 rounded-2xl border p-2 opacity-0 shadow-lg transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                        {(normalizedCategories.length > 0
                                            ? normalizedCategories
                                            : categoryLinks.map((category) => ({
                                                  slug: category.slug,
                                                  title: category.label,
                                                  href: route('marketplace', { category: category.slug }),
                                                  count: undefined,
                                              }))
                                        ).map((category) => (
                                            <Link
                                                key={category.href}
                                                href={category.href}
                                                className="text-foreground/80 hover:bg-muted hover:text-foreground flex items-center justify-between rounded-xl px-3 py-2 text-sm transition"
                                            >
                                                <span>{category.title}</span>
                                                {category.count !== undefined && <span className="text-foreground/40 text-xs">{category.count}</span>}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="group relative">
                                    <button className="text-foreground/70 hover:bg-muted hover:text-foreground flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition">
                                        {t('common.nav.categories')}
                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                                    </button>

                                    <div className="border-border bg-background invisible absolute top-full left-1/2 z-50 mt-3 w-[min(92vw,960px)] -translate-x-1/2 translate-y-2 rounded-[28px] border p-4 opacity-0 shadow-2xl transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                                            <div>
                                                <div className="mb-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
                                                            {t('common.nav.browse_categories')}
                                                        </p>
                                                        <h3 className="text-foreground mt-1 text-xl font-bold">
                                                            {t('common.nav.explore_by_category')}
                                                        </h3>
                                                    </div>
                                                    <Link
                                                        href={route('marketplace')}
                                                        className="text-primary inline-flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        {t('common.nav.view_all')}
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                                                    {(normalizedCategories.length > 0
                                                        ? normalizedCategories
                                                        : categoryLinks.map(
                                                              (item) =>
                                                                  ({
                                                                      slug: item.slug,
                                                                      title: item.label,
                                                                      description: t('common.nav.browse_category_description'),
                                                                      icon: 'sparkles',
                                                                      href: route('marketplace', { category: item.slug }),
                                                                      count: undefined,
                                                                  }) as NavbarCategoryItem,
                                                          )
                                                    ).map((category) => {
                                                        const Icon = getCategoryIcon(category.icon);

                                                        return (
                                                            <Link
                                                                key={category.slug}
                                                                href={category.href}
                                                                className="group/item border-border bg-muted/30 hover:border-primary/30 hover:bg-muted/60 rounded-2xl border p-4 transition hover:-translate-y-0.5"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                                                                        <Icon className="h-5 w-5" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-foreground font-medium">{category.title}</span>
                                                                            {category.count !== undefined && (
                                                                                <span className="bg-background text-foreground/50 rounded-full px-2 py-0.5 text-[11px]">
                                                                                    {category.count}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-foreground/60 mt-1 line-clamp-2 text-xs leading-5">
                                                                            {category.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="border-border bg-background rounded-[24px] border p-5">
                                                <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
                                                    {t('common.nav.featured_path')}
                                                </p>
                                                <h4 className="text-foreground mt-2 text-xl font-bold">{t('common.nav.need_inspiration')}</h4>
                                                <p className="text-foreground/60 mt-3 text-sm leading-6">{t('common.nav.inspiration_description')}</p>

                                                <div className="mt-5 space-y-2">
                                                    <Link
                                                        href={route('marketplace')}
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 block rounded-xl px-4 py-3 text-sm font-semibold transition"
                                                    >
                                                        {t('common.nav.browse_marketplace')}
                                                    </Link>
                                                    <Link
                                                        href={route('creators')}
                                                        className="border-input text-foreground hover:bg-muted block rounded-xl border px-4 py-3 text-sm font-semibold transition"
                                                    >
                                                        {t('common.nav.meet_creators')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isMarketplace && (
                                <Link
                                    href={route('creators')}
                                    className="text-foreground/70 hover:bg-muted hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium transition"
                                >
                                    {t('common.nav.creators')}
                                </Link>
                            )}
                        </div>
                    </div>

                    {variant === 'landing' && (
                        <div className="hidden items-center gap-2 md:flex">
                            <Link
                                href={sellerCtaHref}
                                className="border-input text-foreground hover:bg-muted rounded-xl border px-4 py-2 text-sm font-semibold transition"
                            >
                                {t('common.nav.sell_on_kreava')}
                            </Link>
                            <LanguageSwitcher />
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="border-input bg-background text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition">
                                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                <AvatarFallback className="bg-muted text-foreground rounded-full text-xs">
                                                    {triggerLabel}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="max-w-[120px] truncate">{auth.user.name}</span>
                                            <ChevronDown className="text-foreground/60 h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 text-sm font-semibold transition"
                                >
                                    {t('common.nav.login')}
                                </Link>
                            )}
                        </div>
                    )}

                    {isMarketplace && (
                        <div className="hidden items-center gap-2 md:flex">
                            <Link
                                href={sellerCtaHref}
                                className="border-input text-foreground/70 hover:bg-muted hover:text-foreground hidden rounded-xl border px-3 py-2 text-sm font-medium transition lg:block"
                            >
                                {t('common.nav.sell')}
                            </Link>
                            {isAuthenticated && (
                                <>
                                    <Link
                                        href={route('wishlist.index')}
                                        className="text-foreground/70 hover:bg-muted hover:text-foreground relative hidden h-9 w-9 items-center justify-center rounded-lg transition lg:flex"
                                        aria-label={t('common.nav.wishlist')}
                                    >
                                        <Heart className="h-4 w-4" />
                                        {formatBadge(wishlistCount, 10) && (
                                            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold">
                                                {formatBadge(wishlistCount, 10)}
                                            </span>
                                        )}
                                    </Link>
                                    <Link
                                        href={route('cart.index')}
                                        className="text-foreground/70 hover:bg-muted hover:text-foreground relative hidden h-9 w-9 items-center justify-center rounded-lg transition lg:flex"
                                        aria-label={t('common.nav.cart')}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        {formatBadge(cartCount, 10) && (
                                            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold">
                                                {formatBadge(cartCount, 10)}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            )}

                            <LanguageSwitcher />

                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="border-input text-foreground hover:bg-muted flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-medium transition">
                                            <span className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                    <AvatarFallback className="bg-muted text-foreground rounded-full text-xs">
                                                        {triggerLabel}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="flex flex-col text-left">
                                                    <span className="text-foreground font-medium">{auth.user.name}</span>
                                                    <span className="text-foreground/50 text-xs">{t('common.nav.account')}</span>
                                                </span>
                                            </span>
                                            <ChevronDown className="text-foreground/60 h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-foreground hover:bg-muted rounded-lg px-3 py-2 text-sm font-medium transition"
                                    >
                                        {t('common.nav.login')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-semibold transition"
                                    >
                                        {t('common.nav.register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => setIsOpen((value) => !value)}
                        className="hover:bg-muted rounded-lg p-2 transition md:hidden"
                        aria-label={t('common.nav.toggle_menu')}
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </nav>

                {isOpen && (
                    <div className="border-border bg-background border-t md:hidden">
                        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
                            <Link href={primaryNavHref} className="text-foreground/80 hover:text-foreground text-sm transition">
                                {primaryNavLabel}
                            </Link>
                            {isMarketplace ? (
                                <div className="space-y-2">
                                    <div className="text-foreground/80 text-sm font-medium">{t('common.nav.categories')}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categoryLinks.map((category) => (
                                            <Link
                                                key={category.slug}
                                                href={route('marketplace', { category: category.slug })}
                                                className="border-input text-foreground/80 hover:bg-muted hover:text-foreground rounded-lg border px-3 py-2 text-sm transition"
                                            >
                                                {category.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-foreground/80 text-sm font-medium">{t('common.nav.categories')}</div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {(normalizedCategories.length > 0
                                            ? normalizedCategories
                                            : categoryLinks.map(
                                                  (item) =>
                                                      ({
                                                          slug: item.slug,
                                                          title: item.label,
                                                          description: t('common.nav.browse_category_description'),
                                                          icon: 'sparkles',
                                                          href: route('marketplace', { category: item.slug }),
                                                          count: undefined,
                                                      }) as NavbarCategoryItem,
                                              )
                                        ).map((category) => {
                                            const Icon = getCategoryIcon(category.icon);

                                            return (
                                                <Link
                                                    key={category.slug}
                                                    href={category.href}
                                                    className="border-input text-foreground/80 hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition"
                                                >
                                                    <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                                                        <Icon className="h-5 w-5" />
                                                    </span>
                                                    <span className="flex-1 text-left">
                                                        <span className="text-foreground block font-medium">{category.title}</span>
                                                        <span className="text-foreground/50 block text-xs">{category.description}</span>
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {isMarketplace ? (
                                <div className="space-y-2">
                                    <Link href={route('creators')} className="text-foreground/80 hover:text-foreground text-sm transition">
                                        {t('common.nav.creators')}
                                    </Link>
                                    <Link href={sellerCtaHref} className="text-foreground/80 hover:text-foreground text-sm transition">
                                        {t('common.nav.sell_on_kreava')}
                                    </Link>
                                </div>
                            ) : (
                                <Link href={sellerCtaHref} className="text-foreground/80 hover:text-foreground text-sm transition">
                                    {t('common.nav.sell_on_kreava')}
                                </Link>
                            )}

                            <LanguageSwitcher className="self-start" />

                            {isAuthenticated ? (
                                <div className="border-border border-t pt-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="border-input text-foreground hover:bg-muted flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left text-sm font-medium transition">
                                                <span className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                        <AvatarFallback className="bg-muted text-foreground rounded-full text-xs">
                                                            {triggerLabel}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="flex flex-col text-left">
                                                        <span className="text-foreground font-medium">{auth.user.name}</span>
                                                        <span className="text-foreground/50 text-xs">{t('common.nav.account')}</span>
                                                    </span>
                                                </span>
                                                <ChevronDown className="text-foreground/60 h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-56" align="start">
                                            <UserMenuContent user={auth.user} />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <div className="border-border flex gap-2 border-t pt-3">
                                    <Link
                                        href={route('login')}
                                        className="border-input text-foreground flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium"
                                    >
                                        {t('common.nav.login')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-primary text-primary-foreground flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold"
                                    >
                                        {t('common.nav.register')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
