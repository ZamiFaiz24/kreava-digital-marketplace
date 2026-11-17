export interface SellerDashboardStats {
    totalRevenue: number;
    totalSales: number;
    productsSold: number;
    conversionRate: number;
    deltas: {
        revenue: number;
        sales: number;
        products: number;
        conversion: number;
    };
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
    sales: number;
}

export interface RevenueData {
    weekly: RevenueDataPoint[];
    monthly: RevenueDataPoint[];
}

export type RecentOrderStatus = 'completed' | 'processing' | 'cancelled';

export interface RecentOrder {
    id: string;
    productName: string;
    buyer: string;
    amount: number;
    status: RecentOrderStatus;
    date: string;
}

export interface TopProduct {
    id: string;
    name: string;
    thumbnail: string | null;
    ordersCount: number;
    salesCount: number;
    price: number;
    revenue: number;
}

export interface SellerProfile {
    id: string;
    name: string;
    email: string;
    avatar: string;
    storeUrl: string;
    joinedDate: string;
    totalEarnings: number;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    monthlyTarget: number;
}

export interface PendingActions {
    pendingOrders: number;
    availablePayout: number;
}

export interface SellerDashboardProps {
    sellerProfile: SellerProfile;
    dashboardStats: SellerDashboardStats;
    revenueData: RevenueData;
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
    pendingActions: PendingActions;
}
