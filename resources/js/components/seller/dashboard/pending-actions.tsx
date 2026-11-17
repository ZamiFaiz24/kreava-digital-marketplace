import { Link } from '@inertiajs/react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { PendingActions as PendingActionsData } from '@/types/seller';

interface PendingActionsProps {
    data: PendingActionsData;
}

function formatCurrency(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(value);
}

export default function PendingActions({ data }: PendingActionsProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const hasPendingOrders = data.pendingOrders > 0;
    const hasAvailablePayout = data.availablePayout > 0;
    const allDone = !hasPendingOrders && !hasAvailablePayout;

    return (
        <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">{t('dashboard.pending_actions.title')}</h2>

            {allDone ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-slate-700">{t('dashboard.pending_actions.all_done')}</p>
                    <p className="mt-1 text-sm text-slate-500">{t('dashboard.pending_actions.all_done_description')}</p>
                </div>
            ) : (
                <div className="mt-3 space-y-1">
                    {hasPendingOrders && (
                        <Link
                            href={route('seller.orders')}
                            className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                            <span className="min-w-0 truncate">{t('dashboard.pending_actions.pending_orders')}</span>
                            <span className="flex shrink-0 items-center gap-2">
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 tabular-nums">
                                    {new Intl.NumberFormat(locale).format(data.pendingOrders)}
                                </span>
                                <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            </span>
                        </Link>
                    )}

                    {hasAvailablePayout && (
                        <Link
                            href={route('seller.payouts')}
                            className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                            <span className="min-w-0 truncate">{t('dashboard.pending_actions.available_payout')}</span>
                            <span className="flex shrink-0 items-center gap-2">
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 tabular-nums">
                                    {formatCurrency(data.availablePayout, locale)}
                                </span>
                                <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            </span>
                        </Link>
                    )}
                </div>
            )}
        </section>
    );
}
