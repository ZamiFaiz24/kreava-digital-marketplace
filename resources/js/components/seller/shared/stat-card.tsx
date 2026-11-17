import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    delta?: number;
}

function formatDelta(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
        signDisplay: 'exceptZero',
    }).format(value);
}

export default function StatCard({ title, value, subtitle, icon, delta }: StatCardProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const hasDelta = typeof delta === 'number' && Number.isFinite(delta);
    const deltaValue = hasDelta ? (delta as number) : 0;
    const direction = deltaValue > 0 ? 'up' : deltaValue < 0 ? 'down' : 'flat';
    const deltaText =
        direction === 'up'
            ? t('dashboard.stats.delta_up', { value: formatDelta(Math.abs(deltaValue), locale) })
            : direction === 'down'
              ? t('dashboard.stats.delta_down', { value: formatDelta(Math.abs(deltaValue), locale) })
              : t('dashboard.stats.delta_flat');

    return (
        <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
                </div>
                {icon && (
                    <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&>svg]:h-5 [&>svg]:w-5">
                        {icon}
                    </div>
                )}
            </div>

            {(hasDelta || subtitle) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {hasDelta && (
                        <span
                            title={deltaText}
                            className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                direction === 'up' && 'bg-emerald-50 text-emerald-700',
                                direction === 'down' && 'bg-rose-50 text-rose-700',
                                direction === 'flat' && 'bg-slate-100 text-slate-600',
                            )}
                        >
                            {direction === 'up' && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
                            {direction === 'down' && <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />}
                            {direction === 'flat' && <Minus className="h-3.5 w-3.5" aria-hidden="true" />}
                            {formatDelta(deltaValue, locale)}%<span className="sr-only">{deltaText}</span>
                        </span>
                    )}
                    {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
                </div>
            )}
        </div>
    );
}
