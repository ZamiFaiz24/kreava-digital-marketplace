import React from 'react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';
import WelcomeBanner from '../../components/seller/dashboard/welcome-banner';
import StatsCards from '../../components/seller/dashboard/stats-cards';
import AnalyticsSection from '../../components/seller/dashboard/analytics-section';
import RecentOrders from '../../components/seller/dashboard/recent-orders';
import TopProducts from '../../components/seller/dashboard/top-products';
import QuickActions from '../../components/seller/dashboard/quick-actions';
import type {
  Order,
  Product,
  RevenueDataPoint,
  SellerDashboardStats,
  SellerProfile,
} from '../../types/seller';

interface SellerDashboardPageProps {
  sellerProfile: SellerProfile;
  dashboardStats: SellerDashboardStats;
  revenueData: RevenueDataPoint[];
  recentOrders: Order[];
  topProducts: Product[];
}

export default function SellerDashboardPage({
  sellerProfile,
  dashboardStats,
  revenueData,
  recentOrders,
  topProducts,
}: SellerDashboardPageProps) {
  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <WelcomeBanner
        sellerName={sellerProfile.name}
        totalRevenue={dashboardStats.totalRevenue}
        monthlyGrowth={dashboardStats.monthlyGrowth}
      />

      {/* Statistics Cards */}
      <StatsCards stats={dashboardStats} />

      {/* Analytics Section */}
      <AnalyticsSection data={revenueData} />

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} />

      {/* Top Products */}
      <TopProducts products={topProducts} />

      {/* Quick Actions */}
      <QuickActions />
    </DashboardLayout>
  );
}
