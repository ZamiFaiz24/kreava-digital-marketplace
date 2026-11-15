import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Loader2, ScrollText, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminNavItems } from '../../components/admin/nav-items';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

type AuditDetails = Record<string, unknown> | null;

interface AdminAuditLog {
    id: number;
    created_at: string;
    admin: string;
    email: string;
    action: string;
    target_type: string;
    target_id: number;
    details: AuditDetails;
}

interface AuditLogPagination {
    data: AdminAuditLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface AuditLogFilters {
    search: string;
    action: string;
}

interface AuditLogsPageProps {
    logs: AuditLogPagination;
    actions: string[];
    filters: AuditLogFilters;
}

const actionStyles: Record<string, string> = {
    'product.approve': 'bg-emerald-100 text-emerald-700',
    'product.reject': 'bg-rose-100 text-rose-700',
    'product.takedown': 'bg-rose-100 text-rose-700',
    'seller.approve': 'bg-emerald-100 text-emerald-700',
    'seller.reject': 'bg-rose-100 text-rose-700',
    'user.activate': 'bg-emerald-100 text-emerald-700',
    'user.deactivate': 'bg-rose-100 text-rose-700',
    'order.refund': 'bg-amber-100 text-amber-700',
    'payout.approve': 'bg-emerald-100 text-emerald-700',
    'payout.reject': 'bg-rose-100 text-rose-700',
};

const targetTypeStyles: Record<string, string> = {
    product: 'bg-indigo-100 text-indigo-700',
    seller: 'bg-emerald-100 text-emerald-700',
    user: 'bg-slate-100 text-slate-700',
    order: 'bg-amber-100 text-amber-700',
    payout: 'bg-slate-100 text-slate-700',
};

const actionLabelKeys: Record<string, string> = {
    'product.approve': 'admin.audit_logs.actions.product_approve',
    'product.reject': 'admin.audit_logs.actions.product_reject',
    'product.takedown': 'admin.audit_logs.actions.product_takedown',
    'seller.approve': 'admin.audit_logs.actions.seller_approve',
    'seller.reject': 'admin.audit_logs.actions.seller_reject',
    'user.activate': 'admin.audit_logs.actions.user_activate',
    'user.deactivate': 'admin.audit_logs.actions.user_deactivate',
    'order.refund': 'admin.audit_logs.actions.order_refund',
    'payout.approve': 'admin.audit_logs.actions.payout_approve',
    'payout.reject': 'admin.audit_logs.actions.payout_reject',
};

function formatCurrency(value: number, locale: string) {
    return `$${value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDateTime(value: string, locale: string) {
    if (!value) {
        return '-';
    }

    const date = new Date(value.replace(' ', 'T'));

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
}

export default function AdminAuditLogsPage({ logs, actions, filters }: AuditLogsPageProps) {
    const [isFiltering, setIsFiltering] = useState(false);
    const [search, setSearch] = useState(filters.search);
    const [action, setAction] = useState(filters.action || 'all');
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';

    const actionLabel = (value: string) => {
        const key = actionLabelKeys[value];

        return key ? t(key) : value;
    };

    const targetTypeLabel = (value: string) => t(`admin.audit_logs.target_types.${value}`, { defaultValue: value });

    const detailLabel = (key: string) => t(`admin.audit_logs.details.${key}`, { defaultValue: key });

    const formatDetailValue = (key: string, value: unknown): string => {
        if (value === null || value === undefined) {
            return '—';
        }

        if (typeof value === 'boolean') {
            return value ? t('admin.audit_logs.boolean.true') : t('admin.audit_logs.boolean.false');
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        if (key === 'previous_status' || key === 'new_status' || key === 'payment_status') {
            return t(`admin.status.${String(value)}`, { defaultValue: String(value) });
        }

        if (key === 'refunded_at') {
            return formatDateTime(String(value), locale);
        }

        if (key === 'total_price' || key === 'amount') {
            const numeric = Number(value);

            if (!Number.isNaN(numeric)) {
                return formatCurrency(numeric, locale);
            }
        }

        return String(value);
    };

    useEffect(() => {
        setSearch(filters.search);
        setAction(filters.action || 'all');
    }, [filters.search, filters.action]);

    const applyFilters = (nextSearch: string, nextAction: string) => {
        const params: Record<string, string> = {};

        if (nextSearch.trim()) {
            params.search = nextSearch.trim();
        }

        if (nextAction !== 'all') {
            params.action = nextAction;
        }

        router.get(route('admin.audit-logs.index'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > logs.last_page) {
            return;
        }

        const params: Record<string, string> = { page: String(page) };

        if (filters.search) {
            params.search = filters.search;
        }

        if (filters.action) {
            params.action = filters.action;
        }

        router.get(route('admin.audit-logs.index'), params, {
            preserveScroll: true,
            preserveState: true,
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    };

    const startItem = logs.total === 0 ? 0 : (logs.current_page - 1) * logs.per_page + 1;
    const endItem = Math.min(logs.current_page * logs.per_page, logs.total);

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel={t('admin.account_label')} showUploadAction={false}>
            <Head title={t('admin.audit_logs.head_title')} />

            <div className="mb-8">
                <p className="text-primary text-sm font-medium">{t('admin.panel')}</p>
                <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t('admin.audit_logs.title')}</h1>
                <p className="text-muted-foreground mt-2 text-sm">{t('admin.audit_logs.description')}</p>
            </div>

            <section className="border-border rounded-2xl border bg-white">
                <div className="border-border flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-end lg:justify-between">
                    <form
                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                        onSubmit={(event) => {
                            event.preventDefault();
                            applyFilters(search, action);
                        }}
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="search">{t('admin.audit_logs.filters.search')}</Label>
                            <Input
                                id="search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t('admin.audit_logs.filters.search_placeholder')}
                                className="w-full sm:w-[320px]"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="action">{t('admin.audit_logs.filters.action')}</Label>
                            <Select
                                value={action}
                                onValueChange={(value) => {
                                    setAction(value);
                                    applyFilters(search, value);
                                }}
                                disabled={isFiltering}
                            >
                                <SelectTrigger id="action" className="w-[210px]">
                                    <SelectValue placeholder={t('admin.audit_logs.filters.all_actions')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('admin.audit_logs.filters.all_actions')}</SelectItem>
                                    {actions.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {actionLabel(item)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={isFiltering} className="bg-indigo-600 hover:bg-indigo-700">
                            {isFiltering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            {t('admin.audit_logs.filters.search')}
                        </Button>
                    </form>

                    <p className="text-muted-foreground text-sm">{t('admin.audit_logs.count', { total: logs.total })}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px]">
                        <thead>
                            <tr className="border-border bg-muted/40 border-b">
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.audit_logs.table.time')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.audit_logs.table.admin')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.audit_logs.table.action')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.audit_logs.table.target_type')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.audit_logs.table.target_id')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.audit_logs.table.details')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <ScrollText className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                                        <p className="text-foreground text-sm font-semibold">{t('admin.audit_logs.empty.title')}</p>
                                        <p className="text-muted-foreground mt-1 text-sm">{t('admin.audit_logs.empty.description')}</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="border-border hover:bg-muted/50 border-b transition-colors last:border-b-0">
                                        <td className="text-muted-foreground px-4 py-4 text-sm">{formatDateTime(log.created_at, locale)}</td>
                                        <td className="px-4 py-4">
                                            <p className="text-foreground text-sm font-medium">{log.admin || t('admin.audit_logs.unknown_admin')}</p>
                                            <p className="text-muted-foreground text-xs">{log.email}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                    actionStyles[log.action] ?? 'bg-indigo-100 text-indigo-700'
                                                }`}
                                            >
                                                {actionLabel(log.action)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                    targetTypeStyles[log.target_type] ?? 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {targetTypeLabel(log.target_type)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-foreground font-mono text-sm">#{log.target_id}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {log.details && Object.keys(log.details).length > 0 ? (
                                                <div className="flex max-w-[360px] flex-wrap gap-1">
                                                    {Object.entries(log.details).map(([key, value]) => (
                                                        <span key={key} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                                                            <span className="font-semibold">{detailLabel(key)}:</span> {formatDetailValue(key, value)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {logs.last_page > 1 && (
                    <div className="border-border flex flex-col items-center justify-between gap-3 border-t px-4 py-4 text-sm sm:flex-row">
                        <p className="text-muted-foreground">
                            {t('admin.audit_logs.pagination.showing', {
                                start: startItem,
                                end: endItem,
                                total: logs.total,
                            })}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(logs.current_page - 1)}
                                disabled={isFiltering || logs.current_page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {t('admin.audit_logs.pagination.previous')}
                            </Button>
                            <span className="text-muted-foreground px-2">
                                {t('admin.audit_logs.pagination.page', {
                                    current: logs.current_page,
                                    last: logs.last_page,
                                })}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(logs.current_page + 1)}
                                disabled={isFiltering || logs.current_page >= logs.last_page}
                            >
                                {t('admin.audit_logs.pagination.next')}
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
