import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface OrderRow {
  id: number;
  order_code: string;
  product_title: string;
  buyer_name: string;
  buyer_email: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

interface OrderPagination {
  data: OrderRow[];
  current_page: number;
  last_page: number;
  total: number;
}

interface OrdersPageProps {
  orders: OrderPagination;
  summary: {
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
  };
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

const statusClass: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
};

export default function SellerOrdersPage({ orders, summary }: OrdersPageProps) {
  return (
    <>
      <Head title="Seller Orders" />
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">Track and review all incoming seller orders.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Orders</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.total_orders}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Completed</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.completed_orders}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Pending</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.pending_orders}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Buyer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No orders found for this seller.
                    </td>
                  </tr>
                ) : (
                  orders.data.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">{order.order_code}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{order.product_title}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{order.buyer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.buyer_email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">{formatCurrency(order.amount)}</td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {order.payment_method}
                        <p className="text-xs text-muted-foreground">{order.payment_status}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[order.status] || statusClass.pending}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{order.created_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {orders.current_page} of {orders.last_page}
            </span>
            <span>{orders.total} order items</span>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
