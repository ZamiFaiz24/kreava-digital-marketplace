import GreetingStrip from '@/components/seller/dashboard/greeting-strip';
import MonthlyTarget from '@/components/seller/dashboard/monthly-target';
import PendingActions from '@/components/seller/dashboard/pending-actions';
import RecentOrders from '@/components/seller/dashboard/recent-orders';
import RevenueAnalytics from '@/components/seller/dashboard/revenue-analytics';
import StatsCards from '@/components/seller/dashboard/stats-cards';
import TopProducts from '@/components/seller/dashboard/top-products';
import DashboardLayout from '@/components/seller/layout/dashboard-layout';
import type { SellerDashboardProps } from '@/types/seller';

export default function SellerDashboardPage({
    sellerProfile,
    dashboardStats,
    revenueData,
    recentOrders,
    topProducts,
    pendingActions,
}: SellerDashboardProps) {
    return (
        <DashboardLayout>
            <GreetingStrip sellerName={sellerProfile.name} />

            <div className="mt-6 space-y-4 xl:space-y-6">
                <StatsCards stats={dashboardStats} />

                <div className="grid gap-4 xl:grid-cols-3 xl:gap-6">
                    <div className="xl:col-span-2">
                        <RevenueAnalytics data={revenueData} />
                    </div>

                    <div className="flex flex-col gap-4 xl:gap-6">
                        <PendingActions data={pendingActions} />
                        <MonthlyTarget revenue={dashboardStats.totalRevenue} target={sellerProfile.monthlyTarget} />
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-3 xl:gap-6">
                    <div className="xl:col-span-2">
                        <RecentOrders orders={recentOrders} />
                    </div>
                    <TopProducts products={topProducts} />
                </div>
            </div>
        </DashboardLayout>
    );
}
