import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Loader2, Store, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

interface ModerationFlash {
    success?: string;
    error?: string;
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-rose-100 text-rose-700',
    suspended: 'bg-rose-100 text-rose-700',
    approved: 'bg-emerald-100 text-emerald-700',
};

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

export default function SellerModerationPage({ sellers }: SellerModerationPageProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ key: string; seller: string } | null>(null);
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const translateFlash = (message?: string) => (message ? t(message, { defaultValue: message }) : null);
    const { errors, flash } = usePage<{ errors: Record<string, string>; flash?: ModerationFlash }>().props;
    const errorMessage = translateFlash(flash?.error) ?? Object.values(errors)[0];

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
                onSuccess: () =>
                    setFeedback({
                        key: action === 'approve' ? 'admin.moderation.sellers.feedback.approved' : 'admin.moderation.sellers.feedback.rejected',
                        seller: seller.storeName,
                    }),
                onFinish: () => setProcessing(null),
            },
        );
    };

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel={t('admin.account_label')} showUploadAction={false}>
            <Head title={t('admin.moderation.sellers.head_title')} />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-primary text-sm font-medium">{t('admin.moderation.eyebrow')}</p>
                    <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t('admin.moderation.sellers.title')}</h1>
                    <p className="text-muted-foreground mt-2 text-sm">{t('admin.moderation.sellers.description')}</p>
                </div>

                <Link
                    href={route('admin.moderation.products')}
                    className="border-border text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
                >
                    {t('admin.moderation.sellers.moderate_products')}
                </Link>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {feedback && (
                <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {t(feedback.key, { seller: feedback.seller || t('admin.moderation.sellers.unknown_owner') })}
                </div>
            )}

            <section className="border-border rounded-2xl border bg-white p-6">
                <div className="mb-6">
                    <h2 className="text-foreground text-xl font-semibold tracking-tight">{t('admin.moderation.sellers.pending')}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{t('admin.moderation.sellers.pending_description')}</p>
                </div>

                {sellers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Store className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">{t('admin.moderation.sellers.empty.title')}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{t('admin.moderation.sellers.empty.description')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.sellers.table.store')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.sellers.table.owner')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.sellers.table.products')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.sellers.table.status')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.sellers.table.joined')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                        {t('admin.moderation.sellers.table.actions')}
                                    </th>
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
                                            <td className="text-foreground px-4 py-4 text-sm">
                                                {seller.owner || t('admin.moderation.sellers.unknown_owner')}
                                            </td>
                                            <td className="text-foreground px-4 py-4 text-sm">{seller.productsCount.toLocaleString(locale)}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[seller.status] ?? 'bg-slate-100 text-slate-700'}`}
                                                >
                                                    {t(`admin.status.${seller.status}`, { defaultValue: seller.status })}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{formatDate(seller.joinedDate, locale)}</td>
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
                                                        {t('admin.moderation.sellers.actions.approve')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => act(seller, 'reject')}
                                                        disabled={isBusy}
                                                        className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                        {t('admin.moderation.sellers.actions.reject')}
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
