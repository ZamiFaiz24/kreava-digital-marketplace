import PublicLayout from '@/layouts/public-layout';
import { Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CreditCard, Loader2, Lock, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface CheckoutItem {
    id: number;
    price: number;
    product: {
        id: number;
        title: string;
        slug: string;
        thumbnail?: string | null;
        images?: Array<{
            id: number;
            url: string;
        }>;
        seller?: {
            id: number;
            store_name?: string | null;
            user?: {
                name?: string | null;
            } | null;
        } | null;
    };
}

interface CheckoutCart {
    id: number;
    items: CheckoutItem[];
}

interface Props {
    cart: CheckoutCart | null;
    total: number;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export default function Checkout({ cart, total }: Props) {
    const items = cart?.items ?? [];
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = () => {
        router.post(
            route('checkout.store'),
            {},
            {
                onStart: () => {
                    setProcessing(true);
                    setError(null);
                },
                onFinish: () => setProcessing(false),
                onError: (errors) => {
                    setError(errors.checkout ?? 'Gagal memproses checkout. Coba lagi nanti.');
                },
            },
        );
    };

    return (
        <PublicLayout title="Checkout">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href={route('cart.index')}
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm font-medium transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke keranjang
                    </Link>
                    <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight">Checkout</h1>
                    <p className="text-foreground/60 mt-2">Tinjau pesananmu sebelum menyelesaikan pembayaran.</p>
                </div>

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="border-border bg-muted/30 flex flex-col items-center justify-center rounded-lg border py-12">
                        <ShoppingCart className="text-foreground/40 mb-4 h-12 w-12" />
                        <h3 className="text-foreground text-lg font-semibold">Keranjang kamu kosong</h3>
                        <p className="text-foreground/60 mt-1 text-sm">Tambahkan produk ke keranjang sebelum checkout.</p>
                        <Link
                            href={route('marketplace')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition"
                        >
                            Jelajahi Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                        <section className="space-y-4">
                            <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
                                <h2 className="text-foreground text-lg font-semibold">Ringkasan Pesanan</h2>
                                <div className="mt-4 space-y-4">
                                    {items.map((item) => {
                                        const image = item.product.images?.[0]?.url || item.product.thumbnail || '/images/Brand.png';
                                        const sellerName =
                                            item.product.seller?.store_name || item.product.seller?.user?.name || 'Independent Creator';

                                        return (
                                            <div key={item.id} className="border-border flex items-center gap-4 rounded-lg border px-4 py-3">
                                                <img src={image} alt={item.product.title} className="h-16 w-16 rounded-lg object-cover" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-foreground truncate font-medium">{item.product.title}</p>
                                                    <p className="text-foreground/60 truncate text-sm">{sellerName}</p>
                                                </div>
                                                <p className="text-foreground flex-shrink-0 text-sm font-semibold">{formatCurrency(item.price)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-foreground font-semibold">Mock Payment</h2>
                                        <p className="text-foreground/60 text-sm">Simulasi pembayaran — selalu berhasil.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <aside className="border-border h-fit rounded-xl border bg-white p-6 shadow-sm">
                            <h2 className="text-foreground text-lg font-bold">Total Pembayaran</h2>
                            <div className="text-foreground/70 mt-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span>Item</span>
                                    <span>{items.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-foreground font-semibold">{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                                <span className="text-foreground text-sm font-medium">Total</span>
                                <span className="text-foreground text-xl font-bold">{formatCurrency(total)}</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={processing}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-4 w-4" />
                                        Bayar Sekarang
                                    </>
                                )}
                            </button>
                            <p className="text-foreground/50 mt-3 text-center text-xs">Pembayaran menggunakan gateway mock untuk keperluan demo.</p>
                        </aside>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
