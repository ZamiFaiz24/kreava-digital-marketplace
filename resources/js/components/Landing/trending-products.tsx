import { Link } from '@inertiajs/react';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { LandingProduct } from '@/types/landing';

const fallbackProducts: LandingProduct[] = [
    {
        title: 'Modern UI Kit Pro',
        slug: 'modern-ui-kit-pro',
        href: '/marketplace',
        thumbnail: null,
        creator: 'Design Studio X',
        rating: 4.8,
        reviews: 342,
        price: '$49',
        category: 'UI Kit',
        gradient: 'from-indigo-500 to-violet-500',
    },
    {
        title: 'Responsive Web Templates',
        slug: 'responsive-web-templates',
        href: '/marketplace',
        thumbnail: null,
        creator: 'Code Masters',
        rating: 4.9,
        reviews: 521,
        price: '$39',
        category: 'Template',
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        title: 'React Component Library',
        slug: 'react-component-library',
        href: '/marketplace',
        thumbnail: null,
        creator: 'DevTools Inc',
        rating: 4.7,
        reviews: 287,
        price: '$29',
        category: 'Source Code',
        gradient: 'from-amber-400 to-orange-500',
    },
    {
        title: 'Complete Design System Guide',
        slug: 'complete-design-system-guide',
        href: '/marketplace',
        thumbnail: null,
        creator: 'Creative Academy',
        rating: 4.9,
        reviews: 156,
        price: '$19',
        category: 'Ebook',
        gradient: 'from-rose-500 to-pink-500',
    },
    {
        title: 'Premium Icon Collection',
        slug: 'premium-icon-collection',
        href: '/marketplace',
        thumbnail: null,
        creator: 'Icon Creators',
        rating: 4.8,
        reviews: 412,
        price: '$24',
        category: 'Icons',
        gradient: 'from-sky-500 to-indigo-500',
    },
    {
        title: 'Photography Asset Pack',
        slug: 'photography-asset-pack',
        href: '/marketplace',
        thumbnail: null,
        creator: 'Asset Market',
        rating: 4.6,
        reviews: 198,
        price: '$34',
        category: 'Assets',
        gradient: 'from-violet-500 to-fuchsia-500',
    },
];

const gradientOptions = [
    'from-indigo-500 to-violet-500',
    'from-emerald-500 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-sky-500 to-indigo-500',
    'from-violet-500 to-fuchsia-500',
];

export function TrendingProducts({ products = fallbackProducts }: { products?: LandingProduct[] }) {
    const { t } = useTranslation();

    return (
        <section className="relative bg-slate-50/70 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-sm font-semibold tracking-[0.24em] text-emerald-600 uppercase">{t('landing.trending.eyebrow')}</p>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{t('landing.trending.title')}</h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{t('landing.trending.subtitle')}</p>
                    </div>

                    <Link
                        href={route('marketplace')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:gap-3 hover:text-indigo-700"
                    >
                        {t('landing.trending.view_all')}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product, index) => {
                            const gradient = product.gradient ?? gradientOptions[index % gradientOptions.length];
                            const href = product.href ?? route('marketplace');

                            return (
                                <Link key={`${product.title}-${index}`} href={href} className="group block h-full">
                                    <Card className="h-full gap-0 overflow-hidden border border-slate-200/80 bg-white p-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                            {product.thumbnail ? (
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
                                                    <ShoppingBag className="h-14 w-14 text-white/80" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                            <Badge className="absolute top-4 left-4 border-0 bg-white/95 text-slate-700 shadow-sm backdrop-blur">
                                                {product.category}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-1 flex-col p-5">
                                            <h3 className="line-clamp-2 text-base leading-6 font-semibold text-slate-900 transition group-hover:text-indigo-600 md:text-lg">
                                                {product.title}
                                            </h3>

                                            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                                <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600">
                                                    {product.avatar ? (
                                                        <img src={product.avatar} alt={product.creator} className="h-full w-full object-cover" />
                                                    ) : (
                                                        product.creator.charAt(0).toUpperCase()
                                                    )}
                                                </span>
                                                <span className="truncate">{product.creator}</span>
                                            </div>

                                            <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-3.5 w-3.5 ${
                                                                    star <= Math.round(product.rating)
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'text-slate-200'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {product.rating.toFixed(1)} ({t('landing.trending.reviews', { count: product.reviews })})
                                                    </p>
                                                </div>

                                                <p className="text-xl font-bold tracking-tight text-slate-950">{product.price}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <ShoppingBag className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{t('landing.trending.empty_title')}</h3>
                        <p className="mt-2 max-w-md text-sm text-slate-500">{t('landing.trending.empty_description')}</p>
                    </Card>
                )}
            </div>
        </section>
    );
}
