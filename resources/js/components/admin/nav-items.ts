import type { DashboardNavItem } from '@/components/seller/layout/nav-types';

export const adminNavItems: DashboardNavItem[] = [
    {
        label: 'Dashboard',
        labelKey: 'admin.nav.dashboard',
        icon: 'grid',
        href: '/admin/dashboard',
        groupKey: 'admin.nav.groups.platform',
    },
    {
        label: 'Users',
        labelKey: 'admin.nav.users',
        icon: 'users',
        href: '/admin/users',
        groupKey: 'admin.nav.groups.platform',
    },
    {
        label: 'Products',
        labelKey: 'admin.nav.products',
        icon: 'package',
        href: '/admin/moderation/products',
        groupKey: 'admin.nav.groups.catalog',
    },
    {
        label: 'Sellers',
        labelKey: 'admin.nav.sellers',
        icon: 'users',
        href: '/admin/moderation/sellers',
        groupKey: 'admin.nav.groups.catalog',
    },
    {
        label: 'Orders',
        labelKey: 'admin.nav.orders',
        icon: 'shopping-cart',
        href: '/admin/orders',
        groupKey: 'admin.nav.groups.transactions',
    },
    {
        label: 'Payouts',
        labelKey: 'admin.nav.payouts',
        icon: 'wallet',
        href: '/admin/payouts',
        groupKey: 'admin.nav.groups.transactions',
    },
    {
        label: 'Audit Logs',
        labelKey: 'admin.nav.audit_logs',
        icon: 'scroll-text',
        href: '/admin/audit-logs',
        groupKey: 'admin.nav.groups.system',
    },
];
