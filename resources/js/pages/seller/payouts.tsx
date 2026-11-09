import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Clock3, Loader2, TrendingUp, Wallet } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface PayoutRow {
    id: number;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    requested_at: string;
    paid_at: string | null;
}

interface PayoutsPageProps {
    payouts: PayoutRow[];
    summary: {
        total_revenue: number;
        available_balance: number;
        pending_balance: number;
        paid_out: number;
    };
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

export default function SellerPayoutsPage({ payouts, summary }: PayoutsPageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
    });
    const [feedback, setFeedback] = useState<string | null>(null);
    const hasBalance = summary.available_balance > 0;

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        setFeedback(null);

        post(route('seller.payouts.request'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setFeedback('Permintaan payout berhasil diajukan.');
            },
        });
    };

    return (
        <>
            <Head title="Seller Payouts" />
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-foreground text-2xl font-bold">Payouts</h1>
                        <p className="text-muted-foreground text-sm">Ajukan penarikan saldo dan pantau riwayat payout kamu.</p>
                    </div>

                    {feedback && (
                        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="border-border rounded-xl border bg-white p-4">
                            <div className="text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                <p className="text-xs tracking-wide uppercase">Total Revenue</p>
                            </div>
                            <p className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(summary.total_revenue)}</p>
                        </div>
                        <div className="border-border rounded-xl border bg-white p-4">
                            <div className="text-muted-foreground flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                <p className="text-xs tracking-wide uppercase">Available Balance</p>
                            </div>
                            <p className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(summary.available_balance)}</p>
                        </div>
                        <div className="border-border rounded-xl border bg-white p-4">
                            <div className="text-muted-foreground flex items-center gap-2">
                                <Clock3 className="h-4 w-4" />
                                <p className="text-xs tracking-wide uppercase">Pending Payouts</p>
                            </div>
                            <p className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(summary.pending_balance)}</p>
                        </div>
                        <div className="border-border rounded-xl border bg-white p-4">
                            <div className="text-muted-foreground flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <p className="text-xs tracking-wide uppercase">Paid Out</p>
                            </div>
                            <p className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(summary.paid_out)}</p>
                        </div>
                    </div>

                    <section className="border-border rounded-2xl border bg-white p-6">
                        <div className="mb-4">
                            <h2 className="text-foreground text-xl font-semibold tracking-tight">Request Payout</h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Saldo tersedia dihitung dari order paid dikurangi payout pending dan paid.
                            </p>
                        </div>

                        <form onSubmit={submit} className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex-1">
                                <label htmlFor="amount" className="text-foreground mb-2 block text-sm font-medium">
                                    Amount
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    min="0.01"
                                    max={summary.available_balance}
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(event) => setData('amount', event.target.value)}
                                    disabled={processing || !hasBalance}
                                    placeholder="0.00"
                                    className="border-border bg-background text-foreground placeholder-muted-foreground focus:ring-primary/20 w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                />
                                {errors.amount && <p className="mt-2 text-sm text-rose-500">{errors.amount}</p>}
                                {!hasBalance && <p className="text-muted-foreground mt-2 text-sm">Belum ada saldo tersedia untuk ditarik.</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !hasBalance}
                                className="bg-primary hover:bg-primary/90 mt-0 inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:mt-7"
                            >
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                                {processing ? 'Memproses...' : 'Request Payout'}
                            </button>
                        </form>
                    </section>

                    <section className="border-border overflow-x-auto rounded-2xl border bg-white">
                        <div className="border-border border-b px-4 py-3">
                            <h2 className="text-foreground text-sm font-semibold">Payout History</h2>
                        </div>
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-border bg-muted/40 border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Requested</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Amount</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Paid At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-12 text-center">
                                            <Wallet className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                                            <p className="text-foreground text-sm font-semibold">Belum ada payout</p>
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                Riwayat payout akan muncul setelah kamu mengajukan penarikan.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.map((payout) => (
                                        <tr key={payout.id} className="border-border border-b last:border-b-0">
                                            <td className="text-foreground px-4 py-3 text-sm">{payout.requested_at}</td>
                                            <td className="text-foreground px-4 py-3 text-sm font-semibold">{formatCurrency(payout.amount)}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[payout.status] ?? 'bg-slate-100 text-slate-700'}`}
                                                >
                                                    {capitalize(payout.status)}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3 text-sm">{payout.paid_at ?? '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </section>
                </div>
            </DashboardLayout>
        </>
    );
}
