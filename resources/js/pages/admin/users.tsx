import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Loader2, Search, UserCheck, Users, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
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

const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    seller: 'Seller',
    customer: 'Customer',
};

export default function AdminUsersPage({ users, filters }: UsersPageProps) {
    const [processingStatusId, setProcessingStatusId] = useState<number | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [search, setSearch] = useState(filters.search);
    const [role, setRole] = useState(filters.role || 'all');
    const { errors, flash } = usePage<{ errors: Record<string, string>; flash?: UsersFlash }>().props;
    const errorMessage = flash?.error ?? Object.values(errors)[0];

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
        <DashboardLayout navItems={adminNavItems} accountLabel="Administrator" showUploadAction={false}>
            <Head title="User Management" />

            <div className="mb-8">
                <p className="text-primary text-sm font-medium">Admin Panel</p>
                <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">User Management</h1>
                <p className="text-muted-foreground mt-2 text-sm">Pantau role dan kelola status akun pengguna Kreava.</p>
            </div>

            {errorMessage && <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">{errorMessage}</div>}

            {flash?.success && (
                <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{flash.success}</div>
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
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari nama atau email"
                                className="w-full sm:w-[260px]"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={role}
                                onValueChange={(value) => {
                                    setRole(value);
                                    applyFilters(search, value);
                                }}
                                disabled={isFiltering}
                            >
                                <SelectTrigger id="role" className="w-[160px]">
                                    <SelectValue placeholder="Semua role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All roles</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="seller">Seller</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={isFiltering} className="bg-indigo-600 hover:bg-indigo-700">
                            {isFiltering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            Search
                        </Button>
                    </form>

                    <p className="text-muted-foreground text-sm">{users.total} pengguna</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-border bg-muted/40 border-b">
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Email</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Role</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">Joined</th>
                                <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <Users className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                                        <p className="text-foreground text-sm font-semibold">Tidak ada pengguna ditemukan</p>
                                        <p className="text-muted-foreground mt-1 text-sm">Coba ubah filter atau kata kunci pencarian.</p>
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
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{user.email}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}
                                                >
                                                    {roleLabels[user.role]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                        user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                    }`}
                                                >
                                                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-4 text-sm">{user.joined_at}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleStatus(user)}
                                                        disabled={user.is_self || isTogglingStatus}
                                                        title={user.is_self ? 'Tidak dapat mengubah status akun sendiri' : undefined}
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
                                                        {user.is_active ? 'Deactivate' : 'Activate'}
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
                            Showing <span className="text-foreground font-medium">{startItem}</span> to{' '}
                            <span className="text-foreground font-medium">{endItem}</span> of{' '}
                            <span className="text-foreground font-medium">{users.total}</span> users
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
                                Previous
                            </Button>
                            <span className="text-muted-foreground px-2">
                                Page {users.current_page} of {users.last_page}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(users.current_page + 1)}
                                disabled={users.current_page >= users.last_page}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
