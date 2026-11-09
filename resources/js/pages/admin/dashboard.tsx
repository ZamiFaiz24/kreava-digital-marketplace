import { Head, router, usePage } from '@inertiajs/react';
import { BadgeCheck, DollarSign, Package, RefreshCw, ShoppingCart, Store, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
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

function formatCurrency(value: number) {
    return `$${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminDashboardPage({ stats, recentOrders, recentSellers }: AdminDashboardPageProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
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
        <DashboardLayout navItems={adminNavItems} accountLabel="Administrator" showUploadAction={false}>
            <Head title="Admin Dashboard" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-primary text-sm font-medium">Admin Panel</p>
                    <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Ringkasan aktivitas marketplace Kreava.</p>
                </div>

                <button
                    type="button"
                    onClick={refresh}
                    disabled={isRefreshing}
                    className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Memuat...' : 'Refresh'}
                </button>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    subtitle="All registered accounts"
                    icon={<Users className="h-8 w-8" />}
                    backgroundColor="bg-gradient-to-br from-indigo-50 to-indigo-100"
                    textColor="text-indigo-600"
                />
                <StatCard
                    title="Total Sellers"
                    value={stats.totalSellers}
                    subtitle="Registered seller accounts"
                    icon={<Store className="h-8 w-8" />}
                    backgroundColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
                    textColor="text-emerald-600"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    subtitle="Registered buyer accounts"
                    icon={<UserCheck className="h-8 w-8" />}
                    backgroundColor="bg-gradient-to-br from-violet-50 to-violet-100"
                    textColor="text-violet-600"
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    subtitle="From paid orders"
                    icon={<DollarSign className="h-8 w-8" />}
                    backgroundColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
                    textColor="text-emerald-600"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    subtitle="All orders"
                    icon={<ShoppingCart className="h-8 w-8" />}
                    backgroundColor="bg-gradient-to-br from-indigo-50 to-indigo-100"
                    textColor="text-indigo-600"
                />
                <StatCard
                    title="Paid Orders"
                    value={stats.paidOrders}
                    subtitle="Successfully paid"
                    icon={<BadgeCheck className="h-8 w-8" />}
                    backgroundColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
                    textColor="text-emerald-600"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    subtitle="All seller products"
                    icon={<Package className="h-8 w-8" />}
                    backgroundColor="bg-gradient-to-br from-violet-50 to-violet-100"
                    textColor="text-violet-600"
                />
                <StatCard
                    title="Published Products"
                    value={stats.publishedProducts}
                    subtitle="Visible in marketplace"
                    icon={<Store className="h-8 w-8" />}
                    backgroundColor="bg-gradient-to-br from-amber-50 to-amber-100"
                    textColor="text-amber-600"
                />
            </div>

            <section className="border-border mb-8 rounded-2xl border bg-white p-6">
                <div className="mb-6">
                    <h2 className="text-foreground text-xl font-semibold tracking-tight">Recent Orders</h2>
                    <p className="text-muted-foreground mt-1 text-sm">5 order terbaru di marketplace.</p>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingCart className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">Belum ada order</p>
                        <p className="text-muted-foreground mt-1 text-xs">Order akan muncul di sini setelah customer mulai membeli.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Order</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Customer</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Amount</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
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
                                        <td className="text-foreground px-4 py-4 text-sm font-semibold">{formatCurrency(order.amount)}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                    orderStatusStyles[order.status] ?? 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {capitalize(order.status)}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-4 text-sm">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="border-border rounded-2xl border bg-white p-6">
                <div className="mb-6">
                    <h2 className="text-foreground text-xl font-semibold tracking-tight">Recent Sellers</h2>
                    <p className="text-muted-foreground mt-1 text-sm">5 seller terbaru yang bergabung.</p>
                </div>

                {recentSellers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Store className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">Belum ada seller</p>
                        <p className="text-muted-foreground mt-1 text-xs">Seller akan muncul di sini setelah mendaftar.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Store</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Owner</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Products</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Joined</th>
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
                                        <td className="text-foreground px-4 py-4 text-sm">{seller.productsCount}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                    sellerStatusStyles[seller.status] ?? 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {capitalize(seller.status)}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-4 text-sm">{seller.joinedDate}</td>
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
