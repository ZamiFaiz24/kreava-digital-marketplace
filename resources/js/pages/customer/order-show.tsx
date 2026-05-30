import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Package } from 'lucide-react';

interface OrderItem {
    id: number;
    price: number;
    product: {
        id: number;
        title: string;
        slug: string;
        seller: { store_name?: string; user?: { name?: string } };
    };
}

interface OrderProps {
    order: {
        id: number;
        total_price: number;
        payment_status: string;
        payment_method: string;
        created_at: string;
        items: OrderItem[];
    };
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export default function OrderShow({ order }: OrderProps) {
    return (
        <PublicLayout title={`Order #${String(order.id).padStart(4, '0')}`}>
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center gap-4">
                    <Link href={route('orders.index')} className="inline-flex items-center gap-2 text-sm text-primary">
                        <ArrowLeft className="h-4 w-4" /> Back to orders
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">Order Details</h1>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                <h2 className="font-semibold text-foreground">Order #{String(order.id).padStart(4, '0')}</h2>
                            </div>
                            <p className="mt-1 text-sm text-foreground/60">Placed on {new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-sm text-foreground/70 inline-flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> {order.payment_method}
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
                                <div className="min-w-0">
                                    <p className="font-medium text-foreground truncate">{item.product.title}</p>
                                    <p className="text-xs text-foreground/60">{item.product.seller.store_name || item.product.seller.user?.name || 'Independent Creator'}</p>
                                </div>
                                <div className="flex-shrink-0 text-sm font-semibold text-foreground">{formatCurrency(item.price)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-foreground/70">Payment status</p>
                            <p className="mt-1 font-semibold text-foreground">{order.payment_status}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-foreground/70">Total</p>
                            <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(order.total_price)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
