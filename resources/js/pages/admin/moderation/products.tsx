import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Loader2, Package, XCircle } from 'lucide-react';
import { useState } from 'react';
import { adminNavItems } from '../../../components/admin/nav-items';
import DashboardLayout from '../../../components/seller/layout/dashboard-layout';

interface ModerationProduct {
    id: number;
    title: string;
    thumbnail: string;
    seller: string;
    sellerEmail: string;
    category: string;
    price: number;
    status: string;
    createdAt: string;
}

interface ProductModerationPageProps {
    products: ModerationProduct[];
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    draft: 'bg-slate-100 text-slate-700',
    rejected: 'bg-rose-100 text-rose-700',
    published: 'bg-emerald-100 text-emerald-700',
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

export default function ProductModerationPage({ products }: ProductModerationPageProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const errorMessage = Object.values(errors)[0];

    const act = (product: ModerationProduct, action: 'approve' | 'reject') => {
        const endpoint =
            action === 'approve' ? route('admin.moderation.products.approve', product.id) : route('admin.moderation.products.reject', product.id);

        setFeedback(null);

        router.post(
            endpoint,
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(`${product.id}:${action}`),
                onSuccess: () => setFeedback(`Produk "${product.title}" ${action === 'approve' ? 'disetujui' : 'ditolak'}.`),
                onFinish: () => setProcessing(null),
            },
        );
    };

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel="Administrator" showUploadAction={false}>
            <Head title="Product Moderation" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-primary text-sm font-medium">Admin Moderation</p>
                    <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Product Moderation</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Tinjau produk yang belum tayang di marketplace.</p>
                </div>

                <Link
                    href={route('admin.moderation.sellers')}
                    className="border-border text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
                >
                    Moderate Sellers
                </Link>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {feedback && <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>}

            <section className="border-border rounded-2xl border bg-white p-6">
                <div className="mb-6">
                    <h2 className="text-foreground text-xl font-semibold tracking-tight">Pending Products</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Produk dengan status non-published memerlukan keputusan admin.</p>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Package className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">Tidak ada produk untuk dimoderasi</p>
                        <p className="text-muted-foreground mt-1 text-xs">Produk baru akan muncul di sini setelah seller mengunggahnya.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Product</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Category</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Price</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Submitted</th>
                                    <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const isApproving = processing === `${product.id}:approve`;
                                    const isRejecting = processing === `${product.id}:reject`;
                                    const isBusy = isApproving || isRejecting;

                                    return (
                                        <tr key={product.id} className="border-border hover:bg-muted/50 border-b transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.title}
                                                        className="border-border h-10 w-10 rounded-md border object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-foreground text-sm font-medium">{product.title}</p>
                                                        <p className="text-muted-foreground text-xs">{product.seller}</p>
                                                        <p className="text-muted-foreground text-xs">{product.sellerEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-foreground px-4 py-4 text-sm">{product.category}</td>
                                            <td className="text-foreground px-4 py-4 text-sm font-semibold">{formatCurrency(product.price)}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[product.status] ?? 'bg-slate-100 text-slate-700'}`}
                                                >
                                                    {capitalize(product.status)}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{product.createdAt}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => act(product, 'approve')}
                                                        disabled={isBusy}
                                                        className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isApproving ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        )}
                                                        Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => act(product, 'reject')}
                                                        disabled={isBusy}
                                                        className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
