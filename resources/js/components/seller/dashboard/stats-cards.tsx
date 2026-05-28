import React from 'react';
import StatCard from '../shared/stat-card';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import { SellerDashboardStats } from '../../../types/seller';

interface StatsCardsProps {
  stats: SellerDashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Revenue */}
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
        subtitle="This month"
        icon={<DollarSign className="w-8 h-8" />}
        trend={{ value: 12.5, direction: 'up' }}
        backgroundColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
        textColor="text-emerald-600"
      />

      {/* Total Sales */}
      <StatCard
        title="Total Sales"
        value={stats.totalSales}
        subtitle="Number of sales"
        icon={<ShoppingCart className="w-8 h-8" />}
        trend={{ value: 8.2, direction: 'up' }}
        backgroundColor="bg-gradient-to-br from-blue-50 to-blue-100"
        textColor="text-blue-600"
      />

      {/* Products Sold */}
      <StatCard
        title="Products Sold"
        value={`${(stats.productsSold / 1000).toFixed(1)}K`}
        subtitle="All time"
        icon={<Package className="w-8 h-8" />}
        trend={{ value: 5.3, direction: 'up' }}
        backgroundColor="bg-gradient-to-br from-purple-50 to-purple-100"
        textColor="text-purple-600"
      />

      {/* Conversion Rate */}
      <StatCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        subtitle="From visitors"
        icon={<TrendingUp className="w-8 h-8" />}
        trend={{ value: 2.1, direction: 'up' }}
        backgroundColor="bg-gradient-to-br from-orange-50 to-orange-100"
        textColor="text-orange-600"
      />
    </div>
  );
}
