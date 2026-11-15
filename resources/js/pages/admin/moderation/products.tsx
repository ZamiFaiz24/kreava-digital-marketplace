import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Loader2, Package, ShieldOff, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

export default function ProductModerationPage({ products }: ProductModerationPageProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const translateFlash = (message?: string) => (message ? t(message, { defaultValue: message }) : null);
    const { errors, flash } = usePage<{ errors: Record<string, string>; flash?: ModerationFlash }>().props;
    const errorMessage = translateFlash(flash?.error) ?? Object.values(errors)[0];

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
        <DashboardLayout navItems={adminNavItems} accountLabel={t('admin.account_label')} showUploadAction={false}>
            <Head title={t('admin.moderation.products.head_title')} />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-primary text-sm font-medium">{t('admin.moderation.eyebrow')}</p>
                    <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t('admin.moderation.products.title')}</h1>
                    <p className="text-muted-foreground mt-2 text-sm">{t('admin.moderation.products.description')}</p>
                </div>

                <Link
                    href={route('admin.moderation.sellers')}
                    className="border-border text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
                >
                    {t('admin.moderation.products.moderate_sellers')}
                </Link>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {flash?.success && (
                <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {translateFlash(flash.success)}
                </div>
            )}

            <section className="border-border rounded-2xl border bg-white p-6">
                <div className="mb-6">
                    <h2 className="text-foreground text-xl font-semibold tracking-tight">{t('admin.moderation.products.all')}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{t('admin.moderation.products.all_description')}</p>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Package className="text-muted-foreground/50 h-10 w-10" />
                        <p className="text-foreground mt-3 text-sm font-medium">{t('admin.moderation.products.empty.title')}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{t('admin.moderation.products.empty.description')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.products.table.product')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.products.table.category')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.products.table.price')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.products.table.status')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                        {t('admin.moderation.products.table.submitted')}
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                        {t('admin.moderation.products.table.actions')}
                                    </th>
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
                                                        <p className="text-muted-foreground text-xs">
                                                            {product.seller || t('admin.moderation.products.unknown_seller')}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">{product.sellerEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-foreground px-4 py-4 text-sm">
                                                {product.category || t('admin.moderation.products.uncategorized')}
                                            </td>
                                            <td className="text-foreground px-4 py-4 text-sm font-semibold">
                                                {formatCurrency(product.price, locale)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[product.status] ?? 'bg-slate-100 text-slate-700'}`}
                                                >
                                                    {t(`admin.status.${product.status}`, { defaultValue: product.status })}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{formatDate(product.createdAt, locale)}</td>
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
                                                            {t('admin.moderation.products.actions.takedown')}
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
                                                                {t('admin.moderation.products.actions.approve')}
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
                                                                {t('admin.moderation.products.actions.reject')}
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
