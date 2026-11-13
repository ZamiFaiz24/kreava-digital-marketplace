import { Link } from '@inertiajs/react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { getCategoryIcon } from '@/lib/category-icons';
import type { LandingCategory } from '@/types/landing';

const fallbackCategoryDefinitions = [
    {
        slug: 'ui-kits',
        title: 'UI Kits',
        descriptionKey: 'landing.categories.fallback.ui_kits',
        icon: 'layout-grid',
        href: '/marketplace?category=ui-kits',
        count: 0,
    },
    {
        slug: 'templates',
        title: 'Templates',
        descriptionKey: 'landing.categories.fallback.templates',
        icon: 'layout-template',
        href: '/marketplace?category=templates',
        count: 0,
    },
    {
        slug: 'source-code',
        title: 'Source Code',
        descriptionKey: 'landing.categories.fallback.source_code',
        icon: 'code-2',
        href: '/marketplace?category=source-code',
        count: 0,
    },
    {
        slug: 'ebooks',
        title: 'Ebooks',
        descriptionKey: 'landing.categories.fallback.ebooks',
        icon: 'book-open',
        href: '/marketplace?category=ebooks',
        count: 0,
    },
    {
        slug: 'icons',
        title: 'Icons',
        descriptionKey: 'landing.categories.fallback.icons',
        icon: 'shapes',
        href: '/marketplace?category=icons',
        count: 0,
    },
    {
        slug: 'mockups',
        title: 'Mockups',
        descriptionKey: 'landing.categories.fallback.mockups',
        icon: 'monitor-smartphone',
        href: '/marketplace?category=mockups',
        count: 0,
    },
    {
        slug: 'fonts',
        title: 'Fonts',
        descriptionKey: 'landing.categories.fallback.fonts',
        icon: 'type',
        href: '/marketplace?category=fonts',
        count: 0,
    },
    {
        slug: 'music-audio',
        title: 'Music & Audio',
        descriptionKey: 'landing.categories.fallback.music_audio',
        icon: 'music-4',
        href: '/marketplace?category=music-audio',
        count: 0,
    },
];

const categoryThemes = [
    {
        icon: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
        hover: 'hover:border-indigo-200',
        glow: 'from-indigo-500/10',
        arrow: 'text-indigo-600',
    },
    {
        icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
        hover: 'hover:border-emerald-200',
        glow: 'from-emerald-500/10',
        arrow: 'text-emerald-600',
    },
    {
        icon: 'bg-amber-50 text-amber-600 ring-amber-100',
        hover: 'hover:border-amber-200',
        glow: 'from-amber-500/10',
        arrow: 'text-amber-600',
    },
    {
        icon: 'bg-rose-50 text-rose-600 ring-rose-100',
        hover: 'hover:border-rose-200',
        glow: 'from-rose-500/10',
        arrow: 'text-rose-600',
    },
    {
        icon: 'bg-sky-50 text-sky-600 ring-sky-100',
        hover: 'hover:border-sky-200',
        glow: 'from-sky-500/10',
        arrow: 'text-sky-600',
    },
    {
        icon: 'bg-violet-50 text-violet-600 ring-violet-100',
        hover: 'hover:border-violet-200',
        glow: 'from-violet-500/10',
        arrow: 'text-violet-600',
    },
    {
        icon: 'bg-orange-50 text-orange-600 ring-orange-100',
        hover: 'hover:border-orange-200',
        glow: 'from-orange-500/10',
        arrow: 'text-orange-600',
    },
    {
        icon: 'bg-teal-50 text-teal-600 ring-teal-100',
        hover: 'hover:border-teal-200',
        glow: 'from-teal-500/10',
        arrow: 'text-teal-600',
    },
];

export function CategoriesSection({ categories }: { categories?: LandingCategory[] }) {
    const { t } = useTranslation();
    const fallbackCategories: LandingCategory[] = fallbackCategoryDefinitions.map(({ descriptionKey, ...category }) => ({
        ...category,
        description: t(descriptionKey),
    }));
    const visibleCategories = categories ?? fallbackCategories;

    return (
        <section id="categories" className="relative bg-white py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-sm font-semibold tracking-[0.24em] text-indigo-600 uppercase">{t('landing.categories.eyebrow')}</p>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{t('landing.categories.title')}</h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{t('landing.categories.subtitle')}</p>
                    </div>

                    <Link
                        href={route('marketplace')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:gap-3 hover:text-indigo-700"
                    >
                        {t('landing.categories.view_all')}
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                {visibleCategories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {visibleCategories.map((category, index) => {
                            const Icon = getCategoryIcon(category.icon);
                            const theme = categoryThemes[index % categoryThemes.length];

                            return (
                                <Link key={`${category.slug}-${index}`} href={category.href} className="group block">
                                    <Card
                                        className={`relative h-full overflow-hidden border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${theme.hover}`}
                                    >
                                        <div
                                            className={`pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${theme.glow}`}
                                        />

                                        <div className="relative z-10 flex h-full flex-col">
                                            <div className="mb-6 flex items-start justify-between gap-3">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${theme.icon}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                                    {t('landing.categories.products_count', { count: category.count ?? 0 })}
                                                </span>
                                            </div>

                                            <div className="mt-auto">
                                                <h3 className="text-base font-semibold text-slate-900 md:text-lg">{category.title}</h3>
                                                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500 md:text-sm">
                                                    {category.description}
                                                </p>
                                                <span
                                                    className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold md:text-sm ${theme.arrow}`}
                                                >
                                                    {t('landing.categories.view_category')}
                                                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <Sparkles className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{t('landing.categories.empty_title')}</h3>
                        <p className="mt-2 max-w-md text-sm text-slate-500">{t('landing.categories.empty_description')}</p>
                    </Card>
                )}
            </div>
        </section>
    );
}
