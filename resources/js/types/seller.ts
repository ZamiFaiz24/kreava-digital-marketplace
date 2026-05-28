export interface SellerDashboardStats {
  totalRevenue: number;
  totalSales: number;
  productsSold: number;
  conversionRate: number;
  monthlyGrowth: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  sales: number;
}

export interface Order {
  id: string;
  productName: string;
  buyer: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  date: string;
}

export interface Product {
  id: string;
  name: string;
  thumbnail: string;
  salesCount: number;
  revenue: number;
  rating: number;
  category: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  storeUrl: string;
  joinedDate: string;
  totalEarnings: number;
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'message' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface SidebarNavItem {
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

export interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  backgroundColor?: string;
}
