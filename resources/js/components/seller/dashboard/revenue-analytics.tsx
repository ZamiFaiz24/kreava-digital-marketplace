import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import type { RevenueData } from '@/types/seller';

interface RevenueAnalyticsProps {
    data: RevenueData;
}

function formatCurrency(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

function formatCompactCurrency(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

function formatCompactNumber(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

export default function RevenueAnalytics({ data }: RevenueAnalyticsProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

    const points = data[period] ?? [];
    const hasData = points.some((point) => point.revenue > 0 || point.sales > 0);

    const labelFormatter = new Intl.DateTimeFormat(locale, period === 'weekly' ? { weekday: 'short' } : { month: 'short' });
    const chartData = points.map((point) => ({
        ...point,
        label: labelFormatter.format(new Date(`${point.date}T00:00:00`)),
    }));

    const chartConfig = {
        revenue: {
            label: t('dashboard.analytics.revenue'),
            color: 'var(--primary)',
        },
        sales: {
            label: t('dashboard.analytics.sales'),
            color: '#94a3b8',
        },
    } satisfies ChartConfig;

    return (
        <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">{t('dashboard.analytics.title')}</h2>
                    <p className="mt-1 text-sm text-slate-500">{t('dashboard.analytics.description')}</p>
                </div>

                <div className="inline-flex w-fit items-center gap-0.5 rounded-lg bg-slate-100 p-0.5" role="group">
                    <button
                        type="button"
                        onClick={() => setPeriod('weekly')}
                        aria-pressed={period === 'weekly'}
                        className={cn(
                            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                            period === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                        )}
                    >
                        {t('dashboard.analytics.weekly')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setPeriod('monthly')}
                        aria-pressed={period === 'monthly'}
                        className={cn(
                            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                            period === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                        )}
                    >
                        {t('dashboard.analytics.monthly')}
                    </button>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-4">
                <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-primary h-0.5 w-4" aria-hidden="true" />
                    {t('dashboard.analytics.revenue')}
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-4 border-t border-dashed border-slate-400" aria-hidden="true" />
                    {t('dashboard.analytics.sales')}
                </span>
            </div>

            {hasData ? (
                <ChartContainer config={chartConfig} className="mt-2 h-72 w-full">
                    <LineChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis
                            yAxisId="revenue"
                            tickLine={false}
                            axisLine={false}
                            width={64}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value: number) => formatCompactCurrency(value, locale)}
                            label={{
                                value: t('dashboard.analytics.revenue'),
                                angle: -90,
                                position: 'insideLeft',
                                style: { fill: '#64748b', fontSize: 11 },
                            }}
                        />
                        <YAxis
                            yAxisId="sales"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            width={48}
                            allowDecimals={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value: number) => formatCompactNumber(value, locale)}
                            label={{
                                value: t('dashboard.analytics.sales'),
                                angle: 90,
                                position: 'insideRight',
                                style: { fill: '#64748b', fontSize: 11 },
                            }}
                        />
                        <ChartTooltip
                            cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(_, payload) => {
                                        const point = payload?.[0]?.payload as { label?: string } | undefined;

                                        return point?.label ?? '';
                                    }}
                                    formatter={(value, name) => {
                                        const numericValue = typeof value === 'number' ? value : Number(value);
                                        const isRevenue = name === t('dashboard.analytics.revenue');

                                        return (
                                            <div className="flex w-full items-center justify-between gap-4">
                                                <span className="flex items-center gap-2 text-slate-500">
                                                    <span className={cn('h-2 w-2 rounded-full', isRevenue ? 'bg-primary' : 'bg-slate-400')} />
                                                    {name}
                                                </span>
                                                <span className="font-semibold text-slate-900 tabular-nums">
                                                    {isRevenue ? formatCurrency(numericValue, locale) : formatCompactNumber(numericValue, locale)}
                                                </span>
                                            </div>
                                        );
                                    }}
                                />
                            }
                        />
                        <Line
                            yAxisId="revenue"
                            type="monotone"
                            dataKey="revenue"
                            name={t('dashboard.analytics.revenue')}
                            stroke="var(--color-revenue)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            yAxisId="sales"
                            type="monotone"
                            dataKey="sales"
                            name={t('dashboard.analytics.sales')}
                            stroke="var(--color-sales)"
                            strokeWidth={2}
                            strokeDasharray="5 4"
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ChartContainer>
            ) : (
                <div className="mt-4 flex h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 px-6 text-center">
                    <p className="text-sm font-medium text-slate-700">{t('dashboard.analytics.empty_title')}</p>
                    <p className="mt-1 text-sm text-slate-500">{t('dashboard.analytics.empty_description')}</p>
                </div>
            )}
        </section>
    );
}
