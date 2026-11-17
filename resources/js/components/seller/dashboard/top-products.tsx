import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { TopProduct } from '@/types/seller';

interface TopProductsProps {
    products: TopProduct[];
}

function initials(name: string): string {
    return (
        name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('') || '?'
    );
}

function formatCurrency(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(value);
}

export default function TopProducts({ products }: TopProductsProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const maxRevenue = Math.max(...products.map((product) => product.revenue), 0);

    return (
        <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">{t('dashboard.top_products.title')}</h2>
                <Link href={route('seller.products')} className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline">
                    {t('dashboard.top_products.view_all')}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-sm font-medium text-slate-700">{t('dashboard.top_products.empty_title')}</p>
                    <p className="mt-1 text-sm text-slate-500">{t('dashboard.top_products.empty_description')}</p>
                </div>
            ) : (
                <div className="mt-4 divide-y divide-slate-100">
                    {products.map((product) => {
                        const contribution = maxRevenue > 0 ? (product.revenue / maxRevenue) * 100 : 0;

                        return (
                            <div key={product.id} className="py-3 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    {product.thumbnail ? (
                                        <img src={product.thumbnail} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                                    ) : (
                                        <span className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">
                                            {initials(product.name)}
                                        </span>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {t('dashboard.top_products.orders', { count: product.ordersCount })}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
                                        {formatCurrency(product.price, locale)}
                                    </p>
                                </div>

                                <div
                                    role="progressbar"
                                    aria-label={t('dashboard.top_products.contribution')}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={Math.round(contribution)}
                                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
                                >
                                    <div
                                        className="bg-primary h-full rounded-full transition-[width] duration-500 ease-out"
                                        style={{ width: `${Math.max(0, Math.min(100, contribution))}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
