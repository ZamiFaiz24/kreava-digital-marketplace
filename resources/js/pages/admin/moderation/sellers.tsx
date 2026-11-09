import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Loader2, Store, XCircle } from 'lucide-react';
import { useState } from 'react';
import { adminNavItems } from '../../../components/admin/nav-items';
import DashboardLayout from '../../../components/seller/layout/dashboard-layout';

interface ModerationSeller {
    id: number;
    storeName: string;
    owner: string;
    email: string;
    productsCount: number;
    status: string;
    joinedDate: string;
}

interface SellerModerationPageProps {
    sellers: ModerationSeller[];
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-rose-100 text-rose-700',
    suspended: 'bg-rose-100 text-rose-700',
    approved: 'bg-emerald-100 text-emerald-700',
};

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function SellerModerationPage({ sellers }: SellerModerationPageProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const errorMessage = Object.values(errors)[0];

    const act = (seller: ModerationSeller, action: 'approve' | 'reject') => {
        const endpoint =
            action === 'approve' ? route('admin.moderation.sellers.approve', seller.id) : route('admin.moderation.sellers.reject', seller.id);

        setFeedback(null);

        router.post(
            endpoint,
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(`${seller.id}:${action}`),
                onSuccess: () => setFeedback(`Seller "${seller.storeName}" ${action === 'approve' ? 'disetujui' : 'ditolak'}.`),
                onFinish: () => setProcessing(null),
            },
        );
    };

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel="Administrator" showUploadAction={false}>
            <Head title="Seller Moderation" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-primary text-sm font-medium">Admin Moderation</p>
                    <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Seller Moderation</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Tinjau kreator yang menunggu persetujuan.</p>
                </div>

                <Link
                    href={route('admin.moderation.products')}
                    className="border-border text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
                >
                    Moderate Products
                </Link>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {feedback && <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>}

            <section className="border-border rounded-2xl border bg-white p-6">
                <div className="mb-6">
                    <h2 className="text-foreground text-xl font-semibold tracking-tight">Pending Sellers</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Seller dengan status non-approved memerlukan keputusan admin.</p>
                </div>

                {sellers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Store className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">Tidak ada seller untuk dimoderasi</p>
                        <p className="text-muted-foreground mt-1 text-xs">Seller baru akan muncul di sini setelah mendaftar.</p>
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
                                    <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.map((seller) => {
                                    const isApproving = processing === `${seller.id}:approve`;
                                    const isRejecting = processing === `${seller.id}:reject`;
                                    const isBusy = isApproving || isRejecting;

                                    return (
                                        <tr key={seller.id} className="border-border hover:bg-muted/50 border-b transition-colors">
                                            <td className="px-4 py-4">
                                                <p className="text-foreground text-sm font-medium">{seller.storeName}</p>
                                                <p className="text-muted-foreground text-xs">{seller.email}</p>
                                            </td>
                                            <td className="text-foreground px-4 py-4 text-sm">{seller.owner}</td>
                                            <td className="text-foreground px-4 py-4 text-sm">{seller.productsCount}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[seller.status] ?? 'bg-slate-100 text-slate-700'}`}
                                                >
                                                    {capitalize(seller.status)}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{seller.joinedDate}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => act(seller, 'approve')}
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
                                                        onClick={() => act(seller, 'reject')}
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
