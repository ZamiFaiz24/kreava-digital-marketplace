import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SellerDashboardStats } from '../../../types/seller';
import StatCard from '../shared/stat-card';

interface StatsCardsProps {
    stats: SellerDashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const { t } = useTranslation();

    return (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue */}
            <StatCard
                title={t('dashboard.stats.total_revenue')}
                value={`$${stats.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
                subtitle={t('dashboard.stats.this_month')}
                icon={<DollarSign className="h-8 w-8" />}
                trend={{ value: 12.5, direction: 'up' }}
                backgroundColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
                textColor="text-emerald-600"
            />

            {/* Total Sales */}
            <StatCard
                title={t('dashboard.stats.total_sales')}
                value={stats.totalSales}
                subtitle={t('dashboard.stats.number_of_sales')}
                icon={<ShoppingCart className="h-8 w-8" />}
                trend={{ value: 8.2, direction: 'up' }}
                backgroundColor="bg-gradient-to-br from-blue-50 to-blue-100"
                textColor="text-blue-600"
            />

            {/* Products Sold */}
            <StatCard
                title={t('dashboard.stats.products_sold')}
                value={`${(stats.productsSold / 1000).toFixed(1)}K`}
                subtitle={t('dashboard.stats.all_time')}
                icon={<Package className="h-8 w-8" />}
                trend={{ value: 5.3, direction: 'up' }}
                backgroundColor="bg-gradient-to-br from-purple-50 to-purple-100"
                textColor="text-purple-600"
            />

            {/* Conversion Rate */}
            <StatCard
                title={t('dashboard.stats.conversion_rate')}
                value={`${stats.conversionRate}%`}
                subtitle={t('dashboard.stats.from_visitors')}
                icon={<TrendingUp className="h-8 w-8" />}
                trend={{ value: 2.1, direction: 'up' }}
                backgroundColor="bg-gradient-to-br from-orange-50 to-orange-100"
                textColor="text-orange-600"
            />
        </div>
    );
}
