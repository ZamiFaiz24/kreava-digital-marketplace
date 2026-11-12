import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Loader2, RotateCcw, Search, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminNavItems } from '../../components/admin/nav-items';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

interface AdminOrder {
    id: number;
    order_number: string;
    customer: string;
    email: string;
    created_at: string;
    total_price: number;
    payment_status: PaymentStatus;
    refunded_at: string | null;
    can_refund: boolean;
}

interface OrderPagination {
    data: AdminOrder[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface OrderFilters {
    search: string;
    status: string;
}

interface OrdersFlash {
    success?: string;
    error?: string;
}

interface OrdersPageProps {
    orders: OrderPagination;
    filters: OrderFilters;
}

const paymentStatusStyles: Record<PaymentStatus, string> = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-rose-100 text-rose-700',
    expired: 'bg-slate-100 text-slate-700',
};

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCurrency(value: number) {
    return `$${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export default function AdminOrdersPage({ orders, filters }: OrdersPageProps) {
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status || 'all');
    const { errors, flash } = usePage<{ errors: Record<string, string>; flash?: OrdersFlash }>().props;
    const errorMessage = flash?.error ?? Object.values(errors)[0];

    useEffect(() => {
        setSearch(filters.search);
        setStatus(filters.status || 'all');
    }, [filters.search, filters.status]);

    const applyFilters = (nextSearch: string, nextStatus: string) => {
        const params: Record<string, string> = {};

        if (nextSearch.trim()) {
            params.search = nextSearch.trim();
        }

        if (nextStatus !== 'all') {
            params.status = nextStatus;
        }

        router.get(route('admin.orders.index'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    };

    const refund = (order: AdminOrder) => {
        if (!order.can_refund) {
            return;
        }

        router.post(
            route('admin.orders.refund', order.id),
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessingId(order.id),
                onFinish: () => setProcessingId(null),
            },
        );
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > orders.last_page) {
            return;
        }

        const params: Record<string, string> = { page: String(page) };

        if (filters.search) {
            params.search = filters.search;
        }

        if (filters.status) {
            params.status = filters.status;
        }

        router.get(route('admin.orders.index'), params, {
            preserveScroll: true,
            preserveState: true,
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    };

    const startItem = orders.total === 0 ? 0 : (orders.current_page - 1) * orders.per_page + 1;
    const endItem = Math.min(orders.current_page * orders.per_page, orders.total);

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel="Administrator" showUploadAction={false}>
            <Head title="Order Management" />

            <div className="mb-8">
                <p className="text-primary text-sm font-medium">Admin Panel</p>
                <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Order Management</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    Pantau pembayaran dan tandai refund. Status pembayaran tidak dapat diubah manual.
                </p>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {flash?.success && (
                <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{flash.success}</div>
            )}

            <section className="border-border rounded-2xl border bg-white">
                <div className="border-border flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-end lg:justify-between">
                    <form
                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                        onSubmit={(event) => {
                            event.preventDefault();
                            applyFilters(search, status);
                        }}
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari nomor order, nama, atau email"
                                className="w-full sm:w-[300px]"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={status}
                                onValueChange={(value) => {
                                    setStatus(value);
                                    applyFilters(search, value);
                                }}
                                disabled={isFiltering}
                            >
                                <SelectTrigger id="status" className="w-[160px]">
                                    <SelectValue placeholder="Semua status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={isFiltering} className="bg-indigo-600 hover:bg-indigo-700">
                            {isFiltering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            Search
                        </Button>
                    </form>

                    <p className="text-muted-foreground text-sm">{orders.total} orders</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px]">
                        <thead>
                            <tr className="border-border bg-muted/40 border-b">
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Order</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Customer</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Total</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Payment</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Refund</th>
                                <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center">
                                        <ShoppingBag className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                                        <p className="text-foreground text-sm font-semibold">Tidak ada order ditemukan</p>
                                        <p className="text-muted-foreground mt-1 text-sm">Coba ubah filter atau kata kunci pencarian.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => {
                                    const isProcessing = processingId === order.id;

                                    return (
                                        <tr key={order.id} className="border-border hover:bg-muted/50 border-b transition-colors last:border-b-0">
                                            <td className="px-4 py-4">
                                                <p className="text-foreground text-sm font-medium">{order.order_number}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-foreground text-sm font-medium">{order.customer}</p>
                                                <p className="text-muted-foreground text-xs">{order.email}</p>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{order.created_at}</td>
                                            <td className="text-foreground px-4 py-4 text-sm font-semibold">{formatCurrency(order.total_price)}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                        paymentStatusStyles[order.payment_status] ?? 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {capitalize(order.payment_status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {order.refunded_at ? (
                                                    <div>
                                                        <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                                                            Refunded
                                                        </span>
                                                        <p className="text-muted-foreground mt-1 text-xs">{order.refunded_at}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">Belum refund</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end">
                                                    {order.can_refund ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => refund(order)}
                                                            disabled={isProcessing}
                                                            className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {isProcessing ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <RotateCcw className="h-4 w-4" />
                                                            )}
                                                            Tandai Refund
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">
                                                            {order.refunded_at ? 'Sudah refund' : 'Tidak tersedia'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {orders.last_page > 1 && (
                    <div className="border-border flex flex-col items-center justify-between gap-3 border-t px-4 py-4 text-sm sm:flex-row">
                        <p className="text-muted-foreground">
                            Showing <span className="text-foreground font-medium">{startItem}</span> to{' '}
                            <span className="text-foreground font-medium">{endItem}</span> of{' '}
                            <span className="text-foreground font-medium">{orders.total}</span> orders
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(orders.current_page - 1)}
                                disabled={isFiltering || orders.current_page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="text-muted-foreground px-2">
                                Page {orders.current_page} of {orders.last_page}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(orders.current_page + 1)}
                                disabled={isFiltering || orders.current_page >= orders.last_page}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
