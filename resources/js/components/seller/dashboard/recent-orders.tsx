import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import type { RecentOrder, RecentOrderStatus } from '@/types/seller';

interface RecentOrdersProps {
    orders: RecentOrder[];
}

const statusClass: Record<RecentOrderStatus, string> = {
    completed: 'bg-emerald-50 text-emerald-700',
    processing: 'bg-amber-50 text-amber-700',
    cancelled: 'bg-rose-50 text-rose-700',
};

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

export default function RecentOrders({ orders }: RecentOrdersProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const dateFormatter = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">{t('dashboard.recent_orders.title')}</h2>
                <Link href={route('seller.orders')} className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline">
                    {t('dashboard.recent_orders.view_all')}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-sm font-medium text-slate-700">{t('dashboard.recent_orders.empty_title')}</p>
                    <p className="mt-1 text-sm text-slate-500">{t('dashboard.recent_orders.empty_description')}</p>
                </div>
            ) : (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-200/70">
                                <th scope="col" className="pr-4 pb-3 text-xs font-medium tracking-wide text-slate-500 uppercase">
                                    {t('dashboard.recent_orders.customer')}
                                </th>
                                <th scope="col" className="pr-4 pb-3 text-xs font-medium tracking-wide text-slate-500 uppercase">
                                    {t('dashboard.recent_orders.product')}
                                </th>
                                <th scope="col" className="pr-4 pb-3 text-xs font-medium tracking-wide text-slate-500 uppercase">
                                    {t('dashboard.recent_orders.date')}
                                </th>
                                <th scope="col" className="pr-4 pb-3 text-xs font-medium tracking-wide text-slate-500 uppercase">
                                    {t('dashboard.recent_orders.status')}
                                </th>
                                <th scope="col" className="pb-3 text-right text-xs font-medium tracking-wide text-slate-500 uppercase">
                                    {t('dashboard.recent_orders.total')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-2.5">
                                            <span className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                                {initials(order.buyer)}
                                            </span>
                                            <span className="max-w-[160px] truncate text-sm font-medium text-slate-900">{order.buyer}</span>
                                        </div>
                                    </td>
                                    <td className="max-w-[220px] truncate py-3 pr-4 text-sm text-slate-700">{order.productName}</td>
                                    <td className="py-3 pr-4 text-sm whitespace-nowrap text-slate-500">
                                        {dateFormatter.format(new Date(`${order.date}T00:00:00`))}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusClass[order.status])}>
                                            {t(`dashboard.recent_orders.statuses.${order.status}`)}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right text-sm font-semibold text-slate-900 tabular-nums">
                                        {formatCurrency(order.amount, locale)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
