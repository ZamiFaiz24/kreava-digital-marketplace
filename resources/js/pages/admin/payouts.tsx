import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock3, Loader2, Wallet, XCircle } from 'lucide-react';
import { useState } from 'react';
import { adminNavItems } from '../../components/admin/nav-items';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface AdminPayout {
    id: number;
    seller: string;
    email: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    requested_at: string;
    paid_at: string | null;
}

interface AdminPayoutsPageProps {
    payouts: AdminPayout[];
}

function formatCurrency(value: number) {
    return `$${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-rose-100 text-rose-700',
};

export default function AdminPayoutsPage({ payouts }: AdminPayoutsPageProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const errorMessage = Object.values(errors)[0];

    const pendingPayouts = payouts.filter((payout) => payout.status === 'pending');
    const paidPayouts = payouts.filter((payout) => payout.status === 'paid');
    const failedPayouts = payouts.filter((payout) => payout.status === 'failed');

    const act = (payout: AdminPayout, action: 'approve' | 'reject') => {
        const endpoint = action === 'approve' ? route('admin.payouts.approve', payout.id) : route('admin.payouts.reject', payout.id);

        setFeedback(null);

        router.post(
            endpoint,
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(`${payout.id}:${action}`),
                onSuccess: () => setFeedback(`Payout "${payout.seller}" ${action === 'approve' ? 'disetujui' : 'ditolak'}.`),
                onFinish: () => setProcessing(null),
            },
        );
    };

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel="Administrator" showUploadAction={false}>
            <Head title="Payout Management" />

            <div className="mb-8">
                <p className="text-primary text-sm font-medium">Admin Panel</p>
                <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Payout Management</h1>
                <p className="text-muted-foreground mt-2 text-sm">Tinjau dan proses permintaan penarikan dari seller.</p>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {feedback && <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>}

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="border-border rounded-xl border bg-white p-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <p className="text-xs tracking-wide uppercase">Pending Payouts</p>
                    </div>
                    <p className="text-foreground mt-2 text-2xl font-bold">{pendingPayouts.length}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {formatCurrency(pendingPayouts.reduce((total, payout) => total + payout.amount, 0))}
                    </p>
                </div>
                <div className="border-border rounded-xl border bg-white p-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <p className="text-xs tracking-wide uppercase">Paid Out</p>
                    </div>
                    <p className="text-foreground mt-2 text-2xl font-bold">{paidPayouts.length}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {formatCurrency(paidPayouts.reduce((total, payout) => total + payout.amount, 0))}
                    </p>
                </div>
                <div className="border-border rounded-xl border bg-white p-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        <p className="text-xs tracking-wide uppercase">Failed Payouts</p>
                    </div>
                    <p className="text-foreground mt-2 text-2xl font-bold">{failedPayouts.length}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {formatCurrency(failedPayouts.reduce((total, payout) => total + payout.amount, 0))}
                    </p>
                </div>
            </div>

            <section className="border-border overflow-x-auto rounded-2xl border bg-white">
                <div className="border-border border-b px-4 py-3">
                    <h2 className="text-foreground text-sm font-semibold">All Payouts</h2>
                </div>
                <table className="w-full min-w-[820px]">
                    <thead>
                        <tr className="border-border bg-muted/40 border-b">
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Seller</th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Amount</th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Requested</th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Paid At</th>
                            <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center">
                                    <Wallet className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                                    <p className="text-foreground text-sm font-semibold">Belum ada payout</p>
                                    <p className="text-muted-foreground mt-1 text-sm">Permintaan payout seller akan muncul di sini.</p>
                                </td>
                            </tr>
                        ) : (
                            payouts.map((payout) => {
                                const isApproving = processing === `${payout.id}:approve`;
                                const isRejecting = processing === `${payout.id}:reject`;
                                const isBusy = isApproving || isRejecting;

                                return (
                                    <tr key={payout.id} className="border-border hover:bg-muted/50 border-b transition-colors last:border-b-0">
                                        <td className="px-4 py-4">
                                            <p className="text-foreground text-sm font-medium">{payout.seller}</p>
                                            <p className="text-muted-foreground text-xs">{payout.email}</p>
                                        </td>
                                        <td className="text-foreground px-4 py-4 text-sm font-semibold">{formatCurrency(payout.amount)}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[payout.status] ?? 'bg-slate-100 text-slate-700'}`}
                                            >
                                                {capitalize(payout.status)}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-4 text-sm">{payout.requested_at}</td>
                                        <td className="text-muted-foreground px-4 py-4 text-sm">{payout.paid_at ?? '-'}</td>
                                        <td className="px-4 py-4">
                                            {payout.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => act(payout, 'approve')}
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
                                                        onClick={() => act(payout, 'reject')}
                                                        disabled={isBusy}
                                                        className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-right text-xs">Processed</p>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </section>
        </DashboardLayout>
    );
}
