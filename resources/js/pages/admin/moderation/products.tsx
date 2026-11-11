import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Loader2, Package, ShieldOff, XCircle } from 'lucide-react';
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

interface ModerationFlash {
    success?: string;
    error?: string;
}

type ModerationAction = 'approve' | 'reject' | 'takedown';

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
    const { errors, flash } = usePage<{ errors: Record<string, string>; flash?: ModerationFlash }>().props;
    const errorMessage = flash?.error ?? Object.values(errors)[0];

    const act = (product: ModerationProduct, action: ModerationAction) => {
        const endpoints: Record<ModerationAction, string> = {
            approve: route('admin.moderation.products.approve', product.id),
            reject: route('admin.moderation.products.reject', product.id),
            takedown: route('admin.moderation.products.takedown', product.id),
        };

        router.post(
            endpoints[action],
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(`${product.id}:${action}`),
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
                    <p className="text-muted-foreground mt-2 text-sm">Tinjau semua produk dan kelola status tayangnya.</p>
                </div>

                <Link
                    href={route('admin.moderation.sellers')}
                    className="border-border text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
                >
                    Moderate Sellers
                </Link>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {flash?.success && (
                <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{flash.success}</div>
            )}

            <section className="border-border rounded-2xl border bg-white p-6">
                <div className="mb-6">
                    <h2 className="text-foreground text-xl font-semibold tracking-tight">All Products</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Semua produk, termasuk yang sudah tayang, ditampilkan di sini.</p>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Package className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">Belum ada produk</p>
                        <p className="text-muted-foreground mt-1 text-xs">Produk akan muncul di sini setelah seller mengunggahnya.</p>
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
                                    const isTakingDown = processing === `${product.id}:takedown`;
                                    const isBusy = isApproving || isRejecting || isTakingDown;

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
                                                    {product.status === 'published' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => act(product, 'takedown')}
                                                            disabled={isBusy}
                                                            className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {isTakingDown ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <ShieldOff className="h-4 w-4" />
                                                            )}
                                                            Takedown
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => act(product, 'approve')}
                                                                disabled={isBusy}
                                                                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                                                                {isRejecting ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4" />
                                                                )}
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
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
