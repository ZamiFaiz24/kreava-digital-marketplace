import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
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

interface Props extends PageProps {
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
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
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
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <div key={order.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-primary" />
                                            <h3 className="font-semibold text-foreground">Order #{String(order.id).padStart(4, '0')}</h3>
                                        </div>
                                        <p className="mt-1 text-sm text-foreground/60">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.payment_status]}`}>
                                        {order.payment_status}
                                    </span>
                                </div>

                                <div className="mt-4 rounded-lg bg-muted/30 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-foreground/70">
                                        <span className="inline-flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            {order.payment_method}
                                        </span>
                                        <span>{order.items.length} item(s)</span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">{item.product.title}</p>
                                                <p className="text-xs text-foreground/60">
                                                    {item.product.seller.store_name || item.product.seller.user?.name || 'Independent Creator'}
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold text-foreground">{formatCurrency(item.price)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 border-t border-border pt-4">
                                    <div className="flex items-center justify-between font-semibold">
                                        <span className="text-foreground">Total:</span>
                                        <span className="text-lg text-foreground">{formatCurrency(order.total_price)}</span>
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
