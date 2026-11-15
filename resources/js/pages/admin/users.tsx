import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Loader2, Search, UserCheck, Users, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminNavItems } from '../../components/admin/nav-items';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

type UserRole = 'customer' | 'seller' | 'admin';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    joined_at: string;
    is_self: boolean;
}

interface UserPagination {
    data: AdminUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface UsersFilters {
    search: string;
    role: string;
}

interface UsersFlash {
    success?: string;
    error?: string;
}

interface UsersPageProps {
    users: UserPagination;
    filters: UsersFilters;
}

const roleStyles: Record<UserRole, string> = {
    admin: 'bg-indigo-100 text-indigo-700',
    seller: 'bg-emerald-100 text-emerald-700',
    customer: 'bg-slate-100 text-slate-700',
};

function formatDate(value: string, locale: string) {
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

export default function AdminUsersPage({ users, filters }: UsersPageProps) {
    const [processingStatusId, setProcessingStatusId] = useState<number | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [search, setSearch] = useState(filters.search);
    const [role, setRole] = useState(filters.role || 'all');
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const translateFlash = (message?: string) => (message ? t(message, { defaultValue: message }) : null);
    const { errors, flash } = usePage<{ errors: Record<string, string>; flash?: UsersFlash }>().props;
    const errorMessage = translateFlash(flash?.error) ?? Object.values(errors)[0];

    useEffect(() => {
        setSearch(filters.search);
        setRole(filters.role || 'all');
    }, [filters.search, filters.role]);

    const applyFilters = (nextSearch: string, nextRole: string) => {
        const params: Record<string, string> = {};

        if (nextSearch.trim()) {
            params.search = nextSearch.trim();
        }

        if (nextRole !== 'all') {
            params.role = nextRole;
        }

        router.get(route('admin.users.index'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    };

    const toggleStatus = (user: AdminUser) => {
        if (user.is_self) {
            return;
        }

        router.post(
            route('admin.users.status', user.id),
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessingStatusId(user.id),
                onFinish: () => setProcessingStatusId(null),
            },
        );
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > users.last_page) {
            return;
        }

        const params: Record<string, string> = { page: String(page) };

        if (filters.search) {
            params.search = filters.search;
        }

        if (filters.role) {
            params.role = filters.role;
        }

        router.get(route('admin.users.index'), params, {
            preserveScroll: true,
            preserveState: true,
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    };

    const startItem = users.total === 0 ? 0 : (users.current_page - 1) * users.per_page + 1;
    const endItem = Math.min(users.current_page * users.per_page, users.total);

    return (
        <DashboardLayout navItems={adminNavItems} accountLabel={t('admin.account_label')} showUploadAction={false}>
            <Head title={t('admin.users.head_title')} />

            <div className="mb-8">
                <p className="text-primary text-sm font-medium">{t('admin.panel')}</p>
                <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t('admin.users.title')}</h1>
                <p className="text-muted-foreground mt-2 text-sm">{t('admin.users.description')}</p>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {flash?.success && (
                <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {translateFlash(flash.success)}
                </div>
            )}

            <section className="border-border rounded-2xl border bg-white">
                <div className="border-border flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-end lg:justify-between">
                    <form
                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                        onSubmit={(event) => {
                            event.preventDefault();
                            applyFilters(search, role);
                        }}
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="search">{t('admin.users.filters.search')}</Label>
                            <Input
                                id="search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t('admin.users.filters.search_placeholder')}
                                className="w-full sm:w-[260px]"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="role">{t('admin.users.filters.role')}</Label>
                            <Select
                                value={role}
                                onValueChange={(value) => {
                                    setRole(value);
                                    applyFilters(search, value);
                                }}
                                disabled={isFiltering}
                            >
                                <SelectTrigger id="role" className="w-[160px]">
                                    <SelectValue placeholder={t('admin.users.filters.all_roles')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('admin.users.filters.all_roles')}</SelectItem>
                                    <SelectItem value="customer">{t('admin.roles.customer')}</SelectItem>
                                    <SelectItem value="seller">{t('admin.roles.seller')}</SelectItem>
                                    <SelectItem value="admin">{t('admin.roles.admin')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={isFiltering} className="bg-indigo-600 hover:bg-indigo-700">
                            {isFiltering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            {t('admin.users.filters.search')}
                        </Button>
                    </form>

                    <p className="text-muted-foreground text-sm">{t('admin.users.count', { total: users.total })}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-border bg-muted/40 border-b">
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.users.table.name')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.users.table.email')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.users.table.role')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.users.table.status')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                    {t('admin.users.table.joined')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">
                                    {t('admin.users.table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <Users className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                                        <p className="text-foreground text-sm font-semibold">{t('admin.users.empty.title')}</p>
                                        <p className="text-muted-foreground mt-1 text-sm">{t('admin.users.empty.description')}</p>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => {
                                    const isTogglingStatus = processingStatusId === user.id;

                                    return (
                                        <tr key={user.id} className="border-border hover:bg-muted/50 border-b transition-colors last:border-b-0">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-foreground text-sm font-medium">{user.name}</p>
                                                    {user.is_self && (
                                                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                                                            {t('admin.users.you')}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{user.email}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}
                                                >
                                                    {t(`admin.roles.${user.role}`)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                        user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                    }`}
                                                >
                                                    {user.is_active ? t('admin.status.active') : t('admin.status.inactive')}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{formatDate(user.joined_at, locale)}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleStatus(user)}
                                                        disabled={user.is_self || isTogglingStatus}
                                                        title={user.is_self ? t('admin.users.cannot_toggle_self') : undefined}
                                                        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                                                            user.is_active
                                                                ? 'border-rose-200 text-rose-500 hover:bg-rose-50'
                                                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                                        }`}
                                                    >
                                                        {isTogglingStatus ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : user.is_active ? (
                                                            <UserX className="h-4 w-4" />
                                                        ) : (
                                                            <UserCheck className="h-4 w-4" />
                                                        )}
                                                        {user.is_active ? t('admin.users.actions.deactivate') : t('admin.users.actions.activate')}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {users.last_page > 1 && (
                    <div className="border-border flex flex-col items-center justify-between gap-3 border-t px-4 py-4 text-sm sm:flex-row">
                        <p className="text-muted-foreground">
                            {t('admin.users.pagination.showing', { start: startItem, end: endItem, total: users.total })}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(users.current_page - 1)}
                                disabled={users.current_page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {t('admin.users.pagination.previous')}
                            </Button>
                            <span className="text-muted-foreground px-2">
                                {t('admin.users.pagination.page', { current: users.current_page, last: users.last_page })}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(users.current_page + 1)}
                                disabled={users.current_page >= users.last_page}
                            >
                                {t('admin.users.pagination.next')}
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
