import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock3, Loader2, Wallet, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

interface PayoutsFlash {
    success?: string;
    error?: string;
}

function formatCurrency(value: number, locale: string) {
    return `$${value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value: string, locale: string) {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-rose-100 text-rose-700',
};

export default function AdminPayoutsPage({ payouts }: AdminPayoutsPageProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ key: string; seller: string } | null>(null);
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const translateFlash = (message?: string) => (message ? t(message, { defaultValue: message }) : null);
    const { errors, flash } = usePage<{ errors: Record<string, string>; flash?: PayoutsFlash }>().props;
    const errorMessage = translateFlash(flash?.error) ?? Object.values(errors)[0];
    const sellerLabel = (payout: AdminPayout) => payout.seller || t('admin.payouts.unknown_seller');

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
                onSuccess: () =>
                    setFeedback({
                        key: action === 'approve' ? 'admin.payouts.feedback.approved' : 'admin.payouts.feedback.rejected',
                        seller: payout.seller,
                    }),
                onFinish: () => setProcessing(null),
            },
        );
    };

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel={t('admin.account_label')} showUploadAction={false}>
            <Head title={t('admin.payouts.head_title')} />

            <div className="mb-8">
                <p className="text-primary text-sm font-medium">{t('admin.panel')}</p>
                <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t('admin.payouts.title')}</h1>
                <p className="text-muted-foreground mt-2 text-sm">{t('admin.payouts.description')}</p>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {feedback && (
                <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {t(feedback.key, { seller: feedback.seller || t('admin.payouts.unknown_seller') })}
                </div>
            )}

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="border-border rounded-xl border bg-white p-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <p className="text-xs tracking-wide uppercase">{t('admin.payouts.summary.pending')}</p>
                    </div>
                    <p className="text-foreground mt-2 text-2xl font-bold">{pendingPayouts.length}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {formatCurrency(
                            pendingPayouts.reduce((total, payout) => total + payout.amount, 0),
                            locale,
                        )}
                    </p>
                </div>
                <div className="border-border rounded-xl border bg-white p-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <p className="text-xs tracking-wide uppercase">{t('admin.payouts.summary.paid')}</p>
                    </div>
                    <p className="text-foreground mt-2 text-2xl font-bold">{paidPayouts.length}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {formatCurrency(
                            paidPayouts.reduce((total, payout) => total + payout.amount, 0),
                            locale,
                        )}
                    </p>
                </div>
                <div className="border-border rounded-xl border bg-white p-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        <p className="text-xs tracking-wide uppercase">{t('admin.payouts.summary.failed')}</p>
                    </div>
                    <p className="text-foreground mt-2 text-2xl font-bold">{failedPayouts.length}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {formatCurrency(
                            failedPayouts.reduce((total, payout) => total + payout.amount, 0),
                            locale,
                        )}
                    </p>
                </div>
            </div>

            <section className="border-border overflow-x-auto rounded-2xl border bg-white">
                <div className="border-border border-b px-4 py-3">
                    <h2 className="text-foreground text-sm font-semibold">{t('admin.payouts.all')}</h2>
                </div>
                <table className="w-full min-w-[820px]">
                    <thead>
                        <tr className="border-border bg-muted/40 border-b">
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('admin.payouts.table.seller')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('admin.payouts.table.amount')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('admin.payouts.table.status')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('admin.payouts.table.requested')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('admin.payouts.table.paid_at')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                {t('admin.payouts.table.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center">
                                    <Wallet className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                                    <p className="text-foreground text-sm font-semibold">{t('admin.payouts.empty.title')}</p>
                                    <p className="text-muted-foreground mt-1 text-sm">{t('admin.payouts.empty.description')}</p>
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
                                            <p className="text-foreground text-sm font-medium">{sellerLabel(payout)}</p>
                                            <p className="text-muted-foreground text-xs">{payout.email}</p>
                                        </td>
                                        <td className="text-foreground px-4 py-4 text-sm font-semibold">{formatCurrency(payout.amount, locale)}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[payout.status] ?? 'bg-slate-100 text-slate-700'}`}
                                            >
                                                {t(`admin.status.${payout.status}`)}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-4 text-sm">{formatDate(payout.requested_at, locale)}</td>
                                        <td className="text-muted-foreground px-4 py-4 text-sm">
                                            {payout.paid_at ? formatDate(payout.paid_at, locale) : '-'}
                                        </td>
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
                                                        {t('admin.payouts.actions.approve')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => act(payout, 'reject')}
                                                        disabled={isBusy}
                                                        className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                        {t('admin.payouts.actions.reject')}
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-right text-xs">{t('admin.payouts.processed')}</p>
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
