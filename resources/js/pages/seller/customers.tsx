import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface CustomerRow {
  user_id: number;
  name: string;
  email: string;
  orders_count: number;
  total_spent: number;
  first_order_at: string;
  last_order_at: string;
}

interface CustomerPagination {
  data: CustomerRow[];
  current_page: number;
  last_page: number;
  total: number;
}

interface CustomersPageProps {
  customers: CustomerPagination;
  summary: {
    total_customers: number;
    active_this_month: number;
    repeat_customers: number;
  };
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export default function SellerCustomersPage({ customers, summary }: CustomersPageProps) {
  return (
    <>
      <Head title="Seller Customers" />
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-sm text-muted-foreground">Customers who have purchased products from your store.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Customers</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.total_customers}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Active This Month</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.active_this_month}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Repeat Customers</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.repeat_customers}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Total Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">First Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No customer transactions found yet.
                    </td>
                  </tr>
                ) : (
                  customers.data.map((customer) => (
                    <tr key={customer.user_id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{customer.orders_count}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">{formatCurrency(customer.total_spent)}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{customer.first_order_at || '-'}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{customer.last_order_at || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {customers.current_page} of {customers.last_page}
            </span>
            <span>{customers.total} customers</span>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
