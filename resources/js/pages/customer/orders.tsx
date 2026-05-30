import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { CreditCard, Package, ShoppingBag } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Order {
    id: number;
    total_price: number;
    payment_status: 'pending' | 'paid' | 'failed' | 'expired';
    payment_method: string;
    created_at: string;
    items: Array<{
        id: number;
        price: number;
        product: {
            id: number;
            title: string;
            slug: string;
            seller: {
                store_name?: string;
                user?: {
                    name?: string;
                };
            };
        };
    }>;
}

interface Props {
    orders: {
        data: Order[];
        links: PaginationLink[];
    };
    summary: {
        total_orders: number;
        paid_orders: number;
        pending_orders: number;
        total_spent: number;
    };
}

const statusStyles: Record<Order['payment_status'], string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    expired: 'bg-slate-100 text-slate-700 border-slate-200',
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export default function Orders({ orders, summary }: Props) {

    return (
        <PublicLayout title="My Orders">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Order History</h1>
                    <p className="mt-2 text-foreground/60">Track your purchases, payment status, and order items.</p>
                </div>

                <div className="mb-8 grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Orders</p>
                        <p className="mt-2 text-2xl font-bold text-foreground">{summary.total_orders}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Paid</p>
                        <p className="mt-2 text-2xl font-bold text-foreground">{summary.paid_orders}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Pending</p>
                        <p className="mt-2 text-2xl font-bold text-foreground">{summary.pending_orders}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Spent</p>
                        <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(summary.total_spent)}</p>
                    </div>
                </div>

                {orders.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 py-12">
                        <ShoppingBag className="mb-4 h-12 w-12 text-foreground/40" />
                        <h3 className="text-lg font-semibold text-foreground">No orders yet</h3>
                        <p className="mt-1 text-sm text-foreground/60">Start shopping to see your orders here</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.data.map((order) => (
                            <div key={order.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-primary" />
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-foreground truncate">Order #{String(order.id).padStart(4, '0')}</h3>
                                                <p className="mt-0.5 text-xs text-foreground/60 truncate">
                                                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.payment_status]}`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    <div className="rounded-md bg-muted/20 px-3 py-2 text-sm">
                                        <div className="flex items-center justify-between text-sm text-foreground/70">
                                            <div className="inline-flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                <span className="truncate">{order.payment_method}</span>
                                            </div>
                                            <span className="text-sm">{order.items.length} item(s)</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground truncate">{item.product.title}</p>
                                                    <p className="text-xs text-foreground/60 truncate">{item.product.seller.store_name || item.product.seller.user?.name || 'Independent Creator'}</p>
                                                </div>
                                                <div className="flex-shrink-0 text-sm font-semibold text-foreground">{formatCurrency(item.price)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-border pt-4 flex items-center justify-between gap-4">
                                    <div>
                                        <span className="text-sm text-foreground/70">Order total</span>
                                        <div className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(order.total_price)}</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={route('orders.show', order.id)} className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary/5">
                                            View Details
                                        </Link>
                                        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                                            Reorder
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                            {orders.links.map((link, index) => {
                                const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();

                                if (!link.url) {
                                    return (
                                        <span key={index} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                                            {label}
                                        </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                                            link.active
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border text-foreground hover:border-primary hover:bg-primary/5'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
