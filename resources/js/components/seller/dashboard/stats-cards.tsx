import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import StatCard from '@/components/seller/shared/stat-card';
import type { SellerDashboardStats } from '@/types/seller';

interface StatsCardsProps {
    stats: SellerDashboardStats;
}

function formatCurrency(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

function formatCount(value: number, locale: string): string {
    if (value === 0) {
        return '0';
    }

    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

function formatPercent(value: number, locale: string): string {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)}%`;
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            <StatCard
                title={t('dashboard.stats.total_revenue')}
                value={formatCurrency(stats.totalRevenue, locale)}
                subtitle={t('dashboard.stats.this_month')}
                delta={stats.deltas.revenue}
                icon={<DollarSign />}
            />
            <StatCard
                title={t('dashboard.stats.total_sales')}
                value={formatCount(stats.totalSales, locale)}
                subtitle={t('dashboard.stats.orders_this_month')}
                delta={stats.deltas.sales}
                icon={<ShoppingCart />}
            />
            <StatCard
                title={t('dashboard.stats.products_sold')}
                value={formatCount(stats.productsSold, locale)}
                subtitle={t('dashboard.stats.units_this_month')}
                delta={stats.deltas.products}
                icon={<Package />}
            />
            <StatCard
                title={t('dashboard.stats.conversion_rate')}
                value={formatPercent(stats.conversionRate, locale)}
                subtitle={t('dashboard.stats.from_total_orders')}
                delta={stats.deltas.conversion}
                icon={<TrendingUp />}
            />
        </div>
    );
}
