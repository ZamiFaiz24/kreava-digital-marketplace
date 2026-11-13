'use client';

import { Clock, Download, ShoppingBag, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';

const stats = [
    {
        labelKey: 'landing.preview.stats.total_revenue',
        value: '$12,450',
        change: '+12.5%',
        icon: TrendingUp,
        color: 'text-primary',
    },
    {
        labelKey: 'landing.preview.stats.total_sales',
        value: '324',
        change: '+8.2%',
        icon: ShoppingBag,
        color: 'text-accent',
    },
    {
        labelKey: 'landing.preview.stats.downloads',
        value: '1,200',
        change: '+15.3%',
        icon: Download,
        color: 'text-primary',
    },
    {
        labelKey: 'landing.preview.stats.avg_response',
        value: '2.4hrs',
        change: '-5.1%',
        icon: Clock,
        color: 'text-accent',
    },
];

const recentOrders = [
    { order: 'UI Kit Pro Pack', dateKey: 'landing.preview.dates.two_hours', amount: '$49' },
    { order: 'Web Template Bundle', dateKey: 'landing.preview.dates.five_hours', amount: '$39' },
    { order: 'React Components', dateKey: 'landing.preview.dates.one_day', amount: '$29' },
];

export function DashboardPreview() {
    const { t } = useTranslation();

    return (
        <section className="bg-background relative py-20 md:py-28">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl">{t('landing.preview.title')}</h2>
                    <p className="text-foreground/60 text-lg">{t('landing.preview.subtitle')}</p>
                </div>

                {/* Dashboard Preview */}
                <div className="border-primary/20 from-primary/5 to-accent/5 rounded-2xl border bg-gradient-to-br p-1 backdrop-blur-xl">
                    <Card className="overflow-hidden border-0">
                        {/* Header */}
                        <div className="from-primary/10 to-accent/10 border-border border-b bg-gradient-to-r p-6">
                            <h3 className="text-foreground text-xl font-semibold">{t('landing.preview.overview')}</h3>
                            <p className="text-foreground/60 text-sm">{t('landing.preview.month')}</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="p-8">
                            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={stat.labelKey} className="bg-muted/50 border-border rounded-lg border p-6">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div>
                                                    <p className="text-foreground/60 mb-1 text-sm">{t(stat.labelKey)}</p>
                                                    <p className="text-foreground text-2xl font-bold">{stat.value}</p>
                                                </div>
                                                <Icon className={`${stat.color} opacity-60`} size={24} />
                                            </div>
                                            <p className="text-primary text-xs font-medium">{t('landing.preview.change', { change: stat.change })}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Charts Area */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* Revenue Chart */}
                                <div className="bg-muted/30 border-border rounded-lg border p-6">
                                    <h4 className="text-foreground mb-4 text-sm font-semibold">{t('landing.preview.revenue_trend')}</h4>
                                    <div className="from-primary/5 to-accent/5 flex h-48 items-end justify-around rounded-lg bg-gradient-to-br p-4">
                                        {[40, 65, 45, 75, 55, 85, 60].map((height, i) => (
                                            <div
                                                key={i}
                                                className="from-primary to-accent mx-1 flex-1 rounded-t bg-gradient-to-t"
                                                style={{ maxHeight: '100%', height: `${height}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Sales Distribution */}
                                <div className="bg-muted/30 border-border rounded-lg border p-6">
                                    <h4 className="text-foreground mb-4 text-sm font-semibold">{t('landing.preview.sales_by_category')}</h4>
                                    <div className="flex h-48 items-center justify-center gap-8">
                                        <div className="flex flex-col items-center">
                                            <div className="from-primary to-accent h-24 w-24 rounded-full bg-gradient-to-br opacity-70" />
                                            <p className="text-foreground/60 mt-2 text-xs">UI Kits (35%)</p>
                                        </div>
                                        <div>
                                            <div className="mb-3">
                                                <p className="text-foreground/60 mb-1 text-xs">Templates</p>
                                                <div className="bg-muted h-2 w-32 overflow-hidden rounded-full">
                                                    <div className="bg-accent h-full w-2/3" />
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-foreground/60 mb-1 text-xs">Source Code</p>
                                                <div className="bg-muted h-2 w-32 overflow-hidden rounded-full">
                                                    <div className="bg-primary h-full w-1/2" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-foreground/60 mb-1 text-xs">Ebooks</p>
                                                <div className="bg-muted h-2 w-32 overflow-hidden rounded-full">
                                                    <div className="bg-accent h-full w-1/3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-muted/30 border-border mt-6 rounded-lg border p-6">
                                <h4 className="text-foreground mb-4 text-sm font-semibold">{t('landing.preview.recent_orders')}</h4>
                                <div className="space-y-3">
                                    {recentOrders.map((item) => (
                                        <div key={item.order} className="border-border flex items-center justify-between border-b py-3 last:border-0">
                                            <div>
                                                <p className="text-foreground text-sm font-medium">{item.order}</p>
                                                <p className="text-foreground/60 text-xs">{t(item.dateKey)}</p>
                                            </div>
                                            <span className="text-primary text-sm font-semibold">{item.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
