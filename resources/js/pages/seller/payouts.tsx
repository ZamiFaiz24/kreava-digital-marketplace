import { Head } from '@inertiajs/react';
import { CalendarClock, Clock3, TrendingUp, Wallet } from 'lucide-react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface PayoutRow {
    id: string;
    date: string;
    amount: number;
    orders: number;
    status: 'completed' | 'processing';
}

interface UpcomingSettlement {
    id: number;
    product: string;
    amount: number;
    date: string | null;
    expected_date: string | null;
    status: 'completed' | 'pending';
}

interface PayoutsPageProps {
    payouts: PayoutRow[];
    upcomingSettlements: UpcomingSettlement[];
    summary: {
        total_revenue: number;
        available_balance: number;
        pending_balance: number;
    };
}

function formatCurrency(value: number) {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

const statusClass: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    processing: 'bg-amber-100 text-amber-700',
    pending: 'bg-slate-100 text-slate-700',
};

export default function SellerPayoutsPage({ payouts, upcomingSettlements, summary }: PayoutsPageProps) {
    return (
        <>
            <Head title="Seller Payouts" />
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-foreground text-2xl font-bold">Payouts</h1>
                        <p className="text-muted-foreground text-sm">Riwayat pencairan dan estimasi settlement dari penjualanmu.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                                <p className="text-xs tracking-wide uppercase">Pending Balance</p>
                            </div>
                            <p className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(summary.pending_balance)}</p>
                        </div>
                    </div>

                    <div className="border-border overflow-x-auto rounded-xl border bg-white">
                        <div className="border-border border-b px-4 py-3">
                            <h2 className="text-foreground text-sm font-semibold">Payout History</h2>
                        </div>
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-border bg-muted/40 border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Amount</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Orders</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-12 text-center">
                                            <Wallet className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                                            <p className="text-foreground text-sm font-semibold">Belum ada payout</p>
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                Payout akan muncul setelah ada penjualan yang dibayar.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.map((payout) => (
                                        <tr key={payout.id} className="border-border border-b last:border-b-0">
                                            <td className="text-foreground px-4 py-3 text-sm">{payout.date}</td>
                                            <td className="text-foreground px-4 py-3 text-sm font-semibold">{formatCurrency(payout.amount)}</td>
                                            <td className="text-foreground px-4 py-3 text-sm">{payout.orders}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[payout.status] ?? statusClass.pending}`}
                                                >
                                                    {payout.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-border rounded-xl border bg-white p-5">
                        <div className="flex items-center gap-2">
                            <CalendarClock className="text-primary h-4 w-4" />
                            <h2 className="text-foreground text-sm font-semibold">Upcoming Settlements</h2>
                        </div>
                        <div className="mt-4 space-y-3">
                            {upcomingSettlements.length === 0 ? (
                                <p className="border-border text-muted-foreground rounded-lg border border-dashed px-4 py-8 text-center text-sm">
                                    Belum ada settlement yang dijadwalkan.
                                </p>
                            ) : (
                                upcomingSettlements.map((settlement) => (
                                    <div
                                        key={settlement.id}
                                        className="border-border flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-foreground truncate text-sm font-medium">{settlement.product}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {settlement.date ?? '-'} &middot; estimasi {settlement.expected_date ?? '-'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-foreground text-sm font-semibold">{formatCurrency(settlement.amount)}</span>
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[settlement.status] ?? statusClass.pending}`}
                                            >
                                                {settlement.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
