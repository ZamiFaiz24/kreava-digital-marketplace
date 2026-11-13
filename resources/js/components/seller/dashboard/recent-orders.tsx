import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Order } from '../../../types/seller';

interface RecentOrdersProps {
    orders: Order[];
}

const statusStyles = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
    const { t } = useTranslation();

    const statusLabels: Record<string, string> = {
        completed: t('dashboard.recent_orders.statuses.completed'),
        pending: t('dashboard.recent_orders.statuses.pending'),
        processing: t('dashboard.recent_orders.statuses.processing'),
        failed: t('dashboard.recent_orders.statuses.failed'),
    };

    return (
        <div className="border-border mb-8 rounded-2xl border bg-white p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-foreground text-xl font-bold">{t('dashboard.recent_orders.title')}</h2>
                    <p className="text-muted-foreground text-sm">{t('dashboard.recent_orders.description')}</p>
                </div>
                <a href="#" className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-semibold">
                    {t('dashboard.recent_orders.view_all')} <ChevronRight className="h-4 w-4" />
                </a>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-border border-b">
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('dashboard.recent_orders.product')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('dashboard.recent_orders.buyer')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('dashboard.recent_orders.amount')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('dashboard.recent_orders.status')}
                            </th>
                            <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">
                                {t('dashboard.recent_orders.date')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-border hover:bg-muted/50 border-b transition-colors">
                                <td className="px-4 py-4">
                                    <p className="text-foreground line-clamp-1 text-sm font-medium">{order.productName}</p>
                                    <p className="text-muted-foreground text-xs">{order.id}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-foreground text-sm font-medium">{order.buyer}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-foreground text-sm font-semibold">${order.amount.toFixed(2)}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                            statusStyles[order.status as keyof typeof statusStyles]
                                        }`}
                                    >
                                        {statusLabels[order.status] ?? order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-muted-foreground text-sm">{order.date}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
