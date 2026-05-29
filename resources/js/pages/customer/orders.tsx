import { PublicLayout } from '@/components/layout/public-layout';
import { PageProps } from '@/types';
import { ShoppingBag } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    total_price: number;
    status: string;
    created_at: string;
    items: Array<{
        id: number;
        quantity: number;
        price: number;
        product: {
            id: number;
            name: string;
            slug: string;
        };
    }>;
}

interface Props extends PageProps {
    orders: {
        data: Order[];
        links: any;
    };
}

export default function Orders({ orders }: Props) {
    return (
        <PublicLayout title="My Orders">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Order History</h1>
                    <p className="mt-2 text-foreground/60">View and manage all your purchases</p>
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
                            <div key={order.id} className="rounded-lg border border-border bg-card p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground">Order #{order.order_number}</h3>
                                        <p className="text-sm text-foreground/60">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between text-sm">
                                            <span className="text-foreground/80">{item.product.name}</span>
                                            <span className="text-foreground">Rp {item.price.toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 border-t border-border pt-4">
                                    <div className="flex items-center justify-between font-semibold">
                                        <span className="text-foreground">Total:</span>
                                        <span className="text-lg text-foreground">Rp {order.total_price.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
