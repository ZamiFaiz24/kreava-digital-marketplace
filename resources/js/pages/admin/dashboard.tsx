import { Head, router, usePage } from '@inertiajs/react';
import { BadgeCheck, DollarSign, Package, RefreshCw, ShoppingCart, Store, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminNavItems } from '../../components/admin/nav-items';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';
import StatCard from '../../components/seller/shared/stat-card';

interface AdminStats {
    totalUsers: number;
    totalSellers: number;
    totalCustomers: number;
    totalProducts: number;
    publishedProducts: number;
    totalOrders: number;
    paidOrders: number;
    totalRevenue: number;
}

interface AdminOrder {
    id: string;
    customer: string;
    email: string;
    amount: number;
    status: string;
    date: string;
}

interface AdminSeller {
    id: string;
    storeName: string;
    owner: string;
    email: string;
    productsCount: number;
    status: string;
    joinedDate: string;
}

interface AdminDashboardPageProps {
    stats: AdminStats;
    recentOrders: AdminOrder[];
    recentSellers: AdminSeller[];
}

const orderStatusStyles: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-rose-100 text-rose-700',
    expired: 'bg-rose-100 text-rose-700',
};

const sellerStatusStyles: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-rose-100 text-rose-700',
    suspended: 'bg-rose-100 text-rose-700',
};

function formatCurrency(value: number, locale: string) {
    return `$${value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value: string, locale: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminDashboardPage({ stats, recentOrders, recentSellers }: AdminDashboardPageProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const translateStatus = (status: string) => t(`admin.status.${status}`, { defaultValue: capitalize(status) });
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const errorMessage = Object.values(errors)[0];

    const refresh = () => {
        router.reload({
            only: ['stats', 'recentOrders', 'recentSellers'],
            onStart: () => setIsRefreshing(true),
            onFinish: () => setIsRefreshing(false),
        });
    };

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel={t('admin.account_label')} showUploadAction={false}>
            <Head title={t('admin.dashboard.head_title')} />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-primary text-sm font-medium">{t('admin.panel')}</p>
                    <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight">{t('admin.dashboard.title')}</h1>
                    <p className="text-muted-foreground mt-2 text-sm">{t('admin.dashboard.description')}</p>
                </div>

                <button
                    type="button"
                    onClick={refresh}
                    disabled={isRefreshing}
                    className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? t('admin.dashboard.refreshing') : t('admin.dashboard.refresh')}
                </button>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
                <StatCard
                    title={t('admin.dashboard.stats.total_users')}
                    value={stats.totalUsers.toLocaleString(locale)}
                    subtitle={t('admin.dashboard.stats.total_users_subtitle')}
                    icon={<Users className="h-8 w-8" />}
                />
                <StatCard
                    title={t('admin.dashboard.stats.total_sellers')}
                    value={stats.totalSellers.toLocaleString(locale)}
                    subtitle={t('admin.dashboard.stats.total_sellers_subtitle')}
                    icon={<Store className="h-8 w-8" />}
                />
                <StatCard
                    title={t('admin.dashboard.stats.total_customers')}
                    value={stats.totalCustomers.toLocaleString(locale)}
                    subtitle={t('admin.dashboard.stats.total_customers_subtitle')}
                    icon={<UserCheck className="h-8 w-8" />}
                />
                <StatCard
                    title={t('admin.dashboard.stats.total_revenue')}
                    value={formatCurrency(stats.totalRevenue, locale)}
                    subtitle={t('admin.dashboard.stats.total_revenue_subtitle')}
                    icon={<DollarSign className="h-8 w-8" />}
                />
                <StatCard
                    title={t('admin.dashboard.stats.total_orders')}
                    value={stats.totalOrders.toLocaleString(locale)}
                    subtitle={t('admin.dashboard.stats.total_orders_subtitle')}
                    icon={<ShoppingCart className="h-8 w-8" />}
                />
                <StatCard
                    title={t('admin.dashboard.stats.paid_orders')}
                    value={stats.paidOrders.toLocaleString(locale)}
                    subtitle={t('admin.dashboard.stats.paid_orders_subtitle')}
                    icon={<BadgeCheck className="h-8 w-8" />}
                />
                <StatCard
                    title={t('admin.dashboard.stats.total_products')}
                    value={stats.totalProducts.toLocaleString(locale)}
                    subtitle={t('admin.dashboard.stats.total_products_subtitle')}
                    icon={<Package className="h-8 w-8" />}
                />
                <StatCard
                    title={t('admin.dashboard.stats.published_products')}
                    value={stats.publishedProducts.toLocaleString(locale)}
                    subtitle={t('admin.dashboard.stats.published_products_subtitle')}
                    icon={<Store className="h-8 w-8" />}
                />
            </div>

            <section className="mb-8 rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="mb-5">
                    <h2 className="text-base font-semibold text-slate-900">{t('admin.dashboard.recent_orders.title')}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{t('admin.dashboard.recent_orders.description')}</p>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingCart className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">{t('admin.dashboard.recent_orders.empty_title')}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{t('admin.dashboard.recent_orders.empty_description')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_orders.order')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_orders.customer')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_orders.amount')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_orders.status')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_orders.date')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-border hover:bg-muted/50 border-b transition-colors">
                                        <td className="text-foreground px-4 py-4 text-sm font-medium">{order.id}</td>
                                        <td className="px-4 py-4">
                                            <p className="text-foreground text-sm font-medium">{order.customer}</p>
                                            <p className="text-muted-foreground text-xs">{order.email}</p>
                                        </td>
                                        <td className="text-foreground px-4 py-4 text-sm font-semibold">{formatCurrency(order.amount, locale)}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                    orderStatusStyles[order.status] ?? 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {translateStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-4 text-sm">{formatDate(order.date, locale)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="mb-5">
                    <h2 className="text-base font-semibold text-slate-900">{t('admin.dashboard.recent_sellers.title')}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{t('admin.dashboard.recent_sellers.description')}</p>
                </div>

                {recentSellers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Store className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">{t('admin.dashboard.recent_sellers.empty_title')}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{t('admin.dashboard.recent_sellers.empty_description')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_sellers.store')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_sellers.owner')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_sellers.products')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_sellers.status')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.dashboard.recent_sellers.joined')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSellers.map((seller) => (
                                    <tr key={seller.id} className="border-border hover:bg-muted/50 border-b transition-colors">
                                        <td className="px-4 py-4">
                                            <p className="text-foreground text-sm font-medium">{seller.storeName}</p>
                                            <p className="text-muted-foreground text-xs">{seller.email}</p>
                                        </td>
                                        <td className="text-foreground px-4 py-4 text-sm">{seller.owner}</td>
                                        <td className="text-foreground px-4 py-4 text-sm">{seller.productsCount.toLocaleString(locale)}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                    sellerStatusStyles[seller.status] ?? 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {translateStatus(seller.status)}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-4 text-sm">{formatDate(seller.joinedDate, locale)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
