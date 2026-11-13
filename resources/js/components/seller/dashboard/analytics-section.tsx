'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RevenueDataPoint } from '../../../types/seller';

interface AnalyticsSectionProps {
    data: RevenueDataPoint[];
}

export default function AnalyticsSection({ data }: AnalyticsSectionProps) {
    const { t } = useTranslation();
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

    const maxRevenue = Math.max(...data.map((d) => d.revenue));

    return (
        <div className="border-border mb-8 rounded-2xl border bg-white p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-foreground text-xl font-bold">{t('dashboard.analytics.title')}</h2>
                    <p className="text-muted-foreground text-sm">{t('dashboard.analytics.description')}</p>
                </div>
                <div className="bg-muted flex items-center gap-2 rounded-lg p-1">
                    <button
                        onClick={() => setPeriod('weekly')}
                        className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                            period === 'weekly' ? 'text-primary bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {t('dashboard.analytics.weekly')}
                    </button>
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                            period === 'monthly' ? 'text-primary bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {t('dashboard.analytics.monthly')}
                    </button>
                </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-6">
                {/* Chart */}
                <div className="from-primary/5 flex h-64 items-end justify-between gap-2 rounded-lg bg-gradient-to-t to-transparent p-6">
                    {data.map((point) => (
                        <div key={point.date} className="group flex flex-1 flex-col items-center gap-2">
                            <div className="flex w-full flex-col items-center gap-1">
                                <div className="relative flex h-48 w-full items-end justify-center">
                                    <div
                                        className="from-primary to-accent w-full origin-bottom rounded-t-lg bg-gradient-to-t transition-all hover:scale-y-105 hover:shadow-lg"
                                        style={{
                                            height: `${(point.revenue / maxRevenue) * 100}%`,
                                        }}
                                    >
                                        <div className="bg-foreground absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded px-3 py-1 text-xs font-semibold whitespace-nowrap text-white group-hover:flex">
                                            ${point.revenue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-xs font-medium">{point.date}</p>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="border-border grid grid-cols-3 gap-4 border-t pt-4">
                    <div>
                        <p className="text-muted-foreground mb-1 text-xs">{t('dashboard.analytics.total_revenue')}</p>
                        <p className="text-foreground text-lg font-bold">
                            $
                            {data
                                .reduce((sum, d) => sum + d.revenue, 0)
                                .toLocaleString('en-US', {
                                    maximumFractionDigits: 2,
                                })}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1 text-xs">{t('dashboard.analytics.avg_per_day')}</p>
                        <p className="text-foreground text-lg font-bold">
                            $
                            {(data.reduce((sum, d) => sum + d.revenue, 0) / data.length).toLocaleString('en-US', {
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1 text-xs">{t('dashboard.analytics.total_sales')}</p>
                        <p className="text-foreground text-lg font-bold">{data.reduce((sum, d) => sum + d.sales, 0)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
