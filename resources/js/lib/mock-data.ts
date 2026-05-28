import type {
  Order,
  Product,
  RevenueDataPoint,
  SellerDashboardStats,
  SellerProfile,
  SidebarNavItem,
} from '@/types/seller';

export const sellerProfile: SellerProfile = {
  id: 'seller_001',
  name: 'Alya Studio',
  email: 'seller@kreava.com',
  avatar: '/images/Brand.png',
  storeUrl: '/creators',
  joinedDate: '2025-09-12',
  totalEarnings: 18450.75,
};

export const sidebarNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', icon: 'grid', href: '/seller/dashboard' },
  { label: 'Products', icon: 'package', href: '/seller/products' },
  { label: 'Orders', icon: 'shopping-cart', href: '/seller/orders', badge: 3 },
  { label: 'Analytics', icon: 'bar-chart-2', href: '/seller/analytics' },
  { label: 'Customers', icon: 'users', href: '/seller/customers' },
  { label: 'Payouts', icon: 'wallet', href: '/seller/payouts' },
  { label: 'Settings', icon: 'settings', href: '/seller/settings' },
];

export const dashboardStats: SellerDashboardStats = {
  totalRevenue: 4560.5,
  totalSales: 328,
  productsSold: 1240,
  conversionRate: 4.8,
  monthlyGrowth: 12.5,
};

export const revenueData: RevenueDataPoint[] = [
  { date: 'Mon', revenue: 520, sales: 21 },
  { date: 'Tue', revenue: 610, sales: 25 },
  { date: 'Wed', revenue: 430, sales: 18 },
  { date: 'Thu', revenue: 760, sales: 31 },
  { date: 'Fri', revenue: 840, sales: 34 },
  { date: 'Sat', revenue: 680, sales: 28 },
  { date: 'Sun', revenue: 720, sales: 30 },
];

export const recentOrders: Order[] = [
  {
    id: 'ORD-1024',
    productName: 'Modern UI Kit Pro',
    buyer: 'Rafi Ahmad',
    amount: 49,
    status: 'completed',
    date: '2026-05-27',
  },
  {
    id: 'ORD-1025',
    productName: 'SaaS Landing Template',
    buyer: 'Nabila Putri',
    amount: 39,
    status: 'processing',
    date: '2026-05-27',
  },
  {
    id: 'ORD-1026',
    productName: 'Ecommerce Icon Pack',
    buyer: 'Dimas Saputra',
    amount: 19,
    status: 'pending',
    date: '2026-05-26',
  },
  {
    id: 'ORD-1027',
    productName: 'Design System Starter',
    buyer: 'Siti Rahma',
    amount: 59,
    status: 'completed',
    date: '2026-05-25',
  },
  {
    id: 'ORD-1028',
    productName: 'Portfolio Theme Pack',
    buyer: 'Andi Pratama',
    amount: 29,
    status: 'failed',
    date: '2026-05-24',
  },
];

export const topProducts: Product[] = [
  {
    id: 'prd_1',
    name: 'Modern UI Kit Pro',
    thumbnail: '/images/Brand.png',
    salesCount: 420,
    revenue: 20580,
    rating: 4.8,
    category: 'UI Kits',
  },
  {
    id: 'prd_2',
    name: 'SaaS Landing Template',
    thumbnail: '/images/Brand.png',
    salesCount: 318,
    revenue: 12402,
    rating: 4.7,
    category: 'Templates',
  },
  {
    id: 'prd_3',
    name: 'Ecommerce Icon Pack',
    thumbnail: '/images/Brand.png',
    salesCount: 280,
    revenue: 5320,
    rating: 4.6,
    category: 'Icons',
  },
  {
    id: 'prd_4',
    name: 'Design System Starter',
    thumbnail: '/images/Brand.png',
    salesCount: 196,
    revenue: 11564,
    rating: 4.9,
    category: 'Design Systems',
  },
];
