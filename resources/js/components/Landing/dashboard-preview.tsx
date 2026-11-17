'use client';

import {
    BarChart3,
    Bell,
    ChevronRight,
    DollarSign,
    LayoutDashboard,
    Lock,
    Package,
    Search,
    Settings,
    ShoppingCart,
    Star,
    TrendingUp,
    Upload,
    Users,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const navItems = [
    { key: 'dashboard', icon: LayoutDashboard, active: true },
    { key: 'products', icon: Package },
    { key: 'orders', icon: ShoppingCart },
    { key: 'analytics', icon: BarChart3 },
    { key: 'customers', icon: Users },
    { key: 'payouts', icon: Wallet },
    { key: 'settings', icon: Settings },
];

const stats = [
    {
        titleKey: 'dashboard.stats.total_revenue',
        value: '$12,450.00',
        subtitleKey: 'dashboard.stats.this_month',
        change: '+12.5%',
        icon: DollarSign,
        card: 'from-emerald-50 to-emerald-100 border-emerald-100',
        accent: 'text-emerald-600',
    },
    {
        titleKey: 'dashboard.stats.total_sales',
        value: '324',
        subtitleKey: 'dashboard.stats.number_of_sales',
        change: '+8.2%',
        icon: ShoppingCart,
        card: 'from-blue-50 to-blue-100 border-blue-100',
        accent: 'text-blue-600',
    },
    {
        titleKey: 'dashboard.stats.products_sold',
        value: '1.2K',
        subtitleKey: 'dashboard.stats.all_time',
        change: '+5.3%',
        icon: Package,
        card: 'from-purple-50 to-purple-100 border-purple-100',
        accent: 'text-purple-600',
    },
    {
        titleKey: 'dashboard.stats.conversion_rate',
        value: '4.8%',
        subtitleKey: 'dashboard.stats.from_visitors',
        change: '+2.1%',
        icon: TrendingUp,
        card: 'from-orange-50 to-orange-100 border-orange-100',
        accent: 'text-orange-600',
    },
];

const revenueByPeriod = {
    weekly: [
        { labelKey: 'landing.preview.days.mon', revenue: 420, sales: 9 },
        { labelKey: 'landing.preview.days.tue', revenue: 680, sales: 14 },
        { labelKey: 'landing.preview.days.wed', revenue: 510, sales: 11 },
        { labelKey: 'landing.preview.days.thu', revenue: 820, sales: 17 },
        { labelKey: 'landing.preview.days.fri', revenue: 640, sales: 13 },
        { labelKey: 'landing.preview.days.sat', revenue: 960, sales: 20 },
        { labelKey: 'landing.preview.days.sun', revenue: 740, sales: 15 },
    ],
    monthly: [
        { labelKey: 'landing.preview.weeks.w1', revenue: 3180, sales: 66 },
        { labelKey: 'landing.preview.weeks.w2', revenue: 4020, sales: 84 },
        { labelKey: 'landing.preview.weeks.w3', revenue: 3650, sales: 76 },
        { labelKey: 'landing.preview.weeks.w4', revenue: 4560, sales: 95 },
    ],
};

const recentOrders = [
    { product: 'UI Kit Pro Pack', buyer: 'Alex Morgan', amount: 49, status: 'completed', dateKey: 'landing.preview.dates.two_hours' },
    { product: 'Web Template Bundle', buyer: 'Siti Rahma', amount: 39, status: 'processing', dateKey: 'landing.preview.dates.five_hours' },
    { product: 'React Components', buyer: 'James Lee', amount: 29, status: 'completed', dateKey: 'landing.preview.dates.one_day' },
];

const statusStyles: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    processing: 'bg-blue-100 text-blue-700',
};

const topProducts = [
    { name: 'UI Kit Pro Pack', category: 'UI Kits', rating: 4.9, sales: 128, revenue: 6272, gradient: 'from-indigo-500 to-violet-500' },
    { name: 'Web Template Bundle', category: 'Templates', rating: 4.8, sales: 96, revenue: 3744, gradient: 'from-emerald-500 to-teal-500' },
    { name: 'React Components', category: 'Source Code', rating: 4.7, sales: 74, revenue: 2146, gradient: 'from-orange-500 to-rose-500' },
];

const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export function DashboardPreview() {
    const { t } = useTranslation();
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

    const revenueData = revenueByPeriod[period];
    const maxRevenue = Math.max(...revenueData.map((point) => point.revenue));
    const totalRevenue = revenueData.reduce((sum, point) => sum + point.revenue, 0);
    const totalSales = revenueData.reduce((sum, point) => sum + point.sales, 0);
    const avgRevenue = totalRevenue / revenueData.length;

    return (
        <section id="dashboard-preview" className="bg-background relative overflow-hidden py-20 md:py-28">
            <div
                aria-hidden
                className="from-primary/5 pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b via-transparent to-transparent"
            />

            <div className="relative container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-10 max-w-2xl md:mb-14">
                    <span className="text-primary bg-primary/10 mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        {t('landing.preview.eyebrow')}
                    </span>
                    <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl">{t('landing.preview.title')}</h2>
                    <p className="text-foreground/60 text-lg">{t('landing.preview.subtitle')}</p>
                </div>

                {/* Dashboard Frame */}
                <div className="from-primary/20 via-accent/10 to-primary/20 shadow-primary/10 rounded-2xl bg-gradient-to-br p-[1px] shadow-2xl">
                    <div className="bg-background overflow-hidden rounded-[15px]">
                        {/* Browser Chrome */}
                        <div className="bg-muted/40 flex h-10 items-center gap-3 border-b px-4">
                            <div aria-hidden className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                            </div>
                            <div className="bg-background/80 text-muted-foreground mx-auto flex max-w-[240px] flex-1 items-center justify-center gap-1.5 truncate rounded-md border px-3 py-1 text-[11px] sm:max-w-xs">
                                <Lock className="h-3 w-3 shrink-0 text-emerald-500" />
                                <span className="truncate">{t('landing.preview.browser_url')}</span>
                            </div>
                            <span className="hidden items-center gap-1.5 text-[11px] font-medium text-emerald-600 sm:flex">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                </span>
                                {t('landing.preview.badge')}
                            </span>
                        </div>

                        <div className="flex">
                            {/* Mini Sidebar */}
                            <aside className="border-border bg-background hidden w-44 shrink-0 flex-col border-r md:flex lg:w-52">
                                <div className="border-border flex items-center border-b px-4 py-3">
                                    <img src="/images/Logo/LogoFull2-trimmed.png" alt="KREAVA" className="h-8 w-auto object-contain" />
                                </div>

                                <div className="border-border flex items-center gap-2.5 border-b px-4 py-3">
                                    <img src="/images/Brand.png" alt="" className="h-8 w-8 rounded-full object-cover" />
                                    <div className="min-w-0">
                                        <p className="text-foreground truncate text-xs font-semibold">Nadia Putri</p>
                                        <p className="text-muted-foreground truncate text-[10px]">{t('dashboard.layout.seller_account')}</p>
                                    </div>
                                </div>

                                <nav className="flex-1 space-y-1 p-2.5">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={item.key}
                                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium ${
                                                    item.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{t(`landing.preview.nav.${item.key}`)}</span>
                                            </div>
                                        );
                                    })}
                                </nav>

                                <div className="border-border m-2.5 rounded-lg border border-dashed p-2.5">
                                    <p className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        {t('landing.preview.store_live')}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5 text-[10px]">{t('landing.preview.accepting_orders')}</p>
                                </div>
                            </aside>

                            {/* Dashboard Content */}
                            <div className="bg-muted/20 min-w-0 flex-1">
                                {/* Mini Navbar */}
                                <div className="bg-background flex h-12 items-center justify-between gap-3 border-b px-3 sm:px-4">
                                    <div className="relative hidden max-w-[220px] flex-1 sm:block">
                                        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
                                        <div className="border-border bg-muted/40 text-muted-foreground truncate rounded-lg border py-1.5 pr-3 pl-8 text-[11px]">
                                            {t('dashboard.layout.search_placeholder')}
                                        </div>
                                    </div>

                                    <div className="flex flex-1 items-center justify-end gap-2.5 sm:flex-none">
                                        <span className="border-border bg-background text-foreground hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold shadow-sm sm:flex">
                                            <Upload className="h-3.5 w-3.5" />
                                            {t('dashboard.layout.upload_product')}
                                        </span>
                                        <span className="text-foreground relative rounded-lg p-1.5">
                                            <Bell className="h-4 w-4" />
                                            <span className="bg-accent absolute top-1 right-1 h-1.5 w-1.5 rounded-full" />
                                        </span>
                                        <img src="/images/Brand.png" alt="" className="h-6 w-6 rounded-full object-cover ring-2 ring-white" />
                                    </div>
                                </div>

                                <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
                                    {/* Welcome Banner */}
                                    <div className="from-primary via-accent to-primary/80 relative overflow-hidden rounded-xl bg-gradient-to-r p-4 text-white sm:p-5">
                                        <div aria-hidden className="absolute inset-0 opacity-10">
                                            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <defs>
                                                    <pattern id="preview-grid" width="12" height="12" patternUnits="userSpaceOnUse">
                                                        <path d="M 12 0 L 0 0 0 12" fill="none" stroke="white" strokeWidth="0.5" />
                                                    </pattern>
                                                </defs>
                                                <rect width="100" height="100" fill="url(#preview-grid)" />
                                            </svg>
                                        </div>

                                        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                            <div>
                                                <p className="text-[11px] font-medium text-white/80">{t('dashboard.welcome')}</p>
                                                <h3 className="text-lg font-bold sm:text-xl">{t('dashboard.greeting', { name: 'Nadia' })}</h3>
                                                <p className="mt-1 text-[11px] text-white/75">{t('landing.preview.banner_text')}</p>
                                            </div>

                                            <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md">
                                                <p className="text-[10px] font-medium text-white/70">{t('dashboard.revenue_this_month')}</p>
                                                <div className="mt-0.5 flex items-baseline gap-2">
                                                    <span className="text-lg font-bold sm:text-xl">$12,450.00</span>
                                                    <span className="flex items-center gap-1 rounded-full bg-green-500/25 px-2 py-0.5 text-[10px] font-semibold text-green-50">
                                                        <TrendingUp className="h-3 w-3" />
                                                        12.5%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                                        {stats.map((stat) => {
                                            const Icon = stat.icon;
                                            return (
                                                <div key={stat.titleKey} className={`rounded-xl border bg-gradient-to-br p-3 sm:p-3.5 ${stat.card}`}>
                                                    <div className="mb-1.5 flex items-start justify-between gap-2">
                                                        <p className="text-muted-foreground text-[10px] font-medium">{t(stat.titleKey)}</p>
                                                        <Icon className={`h-4 w-4 shrink-0 opacity-60 ${stat.accent}`} />
                                                    </div>
                                                    <div className="flex flex-wrap items-baseline gap-1.5">
                                                        <p className={`text-base font-bold tracking-tight sm:text-lg ${stat.accent}`}>{stat.value}</p>
                                                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                                                            <TrendingUp className="h-2.5 w-2.5" />
                                                            {stat.change}
                                                        </span>
                                                    </div>
                                                    <p className="text-muted-foreground mt-0.5 truncate text-[10px]">{t(stat.subtitleKey)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Analytics */}
                                    <div className="border-border bg-background rounded-xl border p-3 sm:p-4">
                                        <div className="mb-3 flex items-center justify-between gap-2">
                                            <div>
                                                <p className="text-foreground text-sm font-bold">{t('dashboard.analytics.title')}</p>
                                                <p className="text-muted-foreground hidden text-[10px] sm:block">
                                                    {t('dashboard.analytics.description')}
                                                </p>
                                            </div>
                                            <div className="bg-muted flex items-center gap-0.5 rounded-lg p-0.5">
                                                {(['weekly', 'monthly'] as const).map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => setPeriod(option)}
                                                        className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                                                            period === option
                                                                ? 'text-primary bg-background shadow-sm'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                    >
                                                        {t(`dashboard.analytics.${option}`)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="from-primary/[0.04] flex h-36 items-end justify-between gap-1.5 rounded-lg bg-gradient-to-t to-transparent p-2 sm:h-44 sm:gap-2 sm:p-3">
                                            {revenueData.map((point) => (
                                                <div
                                                    key={point.labelKey}
                                                    className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
                                                >
                                                    <div className="relative flex w-full flex-1 items-end justify-center">
                                                        <div
                                                            className="from-primary to-accent relative w-full max-w-10 origin-bottom rounded-t-md bg-gradient-to-t transition-all group-hover:brightness-110"
                                                            style={{ height: `${(point.revenue / maxRevenue) * 100}%` }}
                                                        >
                                                            <div className="bg-foreground absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-white group-hover:block">
                                                                {formatCurrency(point.revenue)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-muted-foreground text-[9px] font-medium sm:text-[10px]">
                                                        {t(point.labelKey)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-border mt-3 grid grid-cols-3 gap-3 border-t pt-3">
                                            <div>
                                                <p className="text-muted-foreground text-[9px] sm:text-[10px]">
                                                    {t('dashboard.analytics.total_revenue')}
                                                </p>
                                                <p className="text-foreground text-xs font-bold sm:text-sm">{formatCurrency(totalRevenue)}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-[9px] sm:text-[10px]">
                                                    {t('dashboard.analytics.avg_per_day')}
                                                </p>
                                                <p className="text-foreground text-xs font-bold sm:text-sm">{formatCurrency(avgRevenue)}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-[9px] sm:text-[10px]">
                                                    {t('dashboard.analytics.total_sales')}
                                                </p>
                                                <p className="text-foreground text-xs font-bold sm:text-sm">{totalSales}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Orders & Top Products */}
                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        {/* Recent Orders */}
                                        <div className="border-border bg-background rounded-xl border p-3 sm:p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-foreground text-sm font-bold">{t('dashboard.recent_orders.title')}</p>
                                                <span className="text-primary flex items-center gap-0.5 text-[10px] font-semibold">
                                                    {t('dashboard.recent_orders.view_all')}
                                                    <ChevronRight className="h-3 w-3" />
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                {recentOrders.map((order) => (
                                                    <div
                                                        key={order.product}
                                                        className="border-border flex items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="text-foreground truncate text-[11px] font-semibold">{order.product}</p>
                                                            <p className="text-muted-foreground truncate text-[10px]">
                                                                {order.buyer} · {t(order.dateKey)}
                                                            </p>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-2">
                                                            <span className="text-foreground text-[11px] font-semibold">
                                                                ${order.amount.toFixed(2)}
                                                            </span>
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${statusStyles[order.status]}`}
                                                            >
                                                                {t(`dashboard.recent_orders.statuses.${order.status}`)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Top Products */}
                                        <div className="border-border bg-background rounded-xl border p-3 sm:p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-foreground text-sm font-bold">{t('dashboard.top_products.title')}</p>
                                                <span className="text-primary flex items-center gap-0.5 text-[10px] font-semibold">
                                                    {t('dashboard.top_products.view_all')}
                                                    <ChevronRight className="h-3 w-3" />
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                {topProducts.map((product) => (
                                                    <div
                                                        key={product.name}
                                                        className="border-border flex items-center gap-2.5 border-b pb-2 last:border-0 last:pb-0"
                                                    >
                                                        <div
                                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${product.gradient}`}
                                                        >
                                                            <Package className="h-4 w-4 text-white/85" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-foreground truncate text-[11px] font-semibold">{product.name}</p>
                                                            <p className="text-muted-foreground truncate text-[10px]">{product.category}</p>
                                                            <div className="mt-0.5 flex items-center gap-1">
                                                                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                                                <span className="text-foreground text-[10px] font-semibold">{product.rating}</span>
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <p className="text-foreground text-[11px] font-bold">
                                                                {product.sales.toLocaleString()}{' '}
                                                                <span className="text-muted-foreground font-normal">
                                                                    {t('dashboard.top_products.sales')}
                                                                </span>
                                                            </p>
                                                            <p className="text-primary text-[11px] font-semibold">
                                                                {formatCurrency(product.revenue)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
