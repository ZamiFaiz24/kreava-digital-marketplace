import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface RevenuePoint {
  label: string;
  revenue: number;
  sales: number;
}

interface TopProduct {
  id: number;
  title: string;
  category: string;
  sales_count: number;
  revenue: number;
}

interface CategoryBreakdown {
  category: string;
  revenue: number;
  sales_count: number;
}

interface AnalyticsPageProps {
  summary: {
    total_revenue: number;
    total_paid_orders: number;
    avg_order_value: number;
    monthly_growth: number;
    this_month_revenue: number;
  };
  revenue_data: RevenuePoint[];
  top_products: TopProduct[];
  category_breakdown: CategoryBreakdown[];
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export default function SellerAnalyticsPage({ summary, revenue_data, top_products, category_breakdown }: AnalyticsPageProps) {
  const maxRevenue = Math.max(...revenue_data.map((item) => item.revenue), 1);

  return (
    <>
      <Head title="Seller Analytics" />
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">Performance trends and revenue insights from your store.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(summary.total_revenue)}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Paid Orders</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.total_paid_orders}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg Order Value</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(summary.avg_order_value)}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Monthly Growth</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.monthly_growth}%</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-lg font-bold text-foreground">Revenue (Last 14 Days)</h2>
            <div className="mt-4 grid grid-cols-7 gap-2 md:grid-cols-14">
              {revenue_data.map((point) => (
                <div key={point.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end rounded-md bg-muted/40 p-1">
                    <div
                      className="w-full rounded bg-primary"
                      style={{ height: `${Math.max((point.revenue / maxRevenue) * 100, 3)}%` }}
                      title={`${point.label} - ${formatCurrency(point.revenue)}`}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{point.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-5">
              <h2 className="text-lg font-bold text-foreground">Top Products</h2>
              <div className="mt-4 space-y-3">
                {top_products.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sales data yet.</p>
                ) : (
                  top_products.map((product) => (
                    <div key={product.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold text-foreground">{product.title}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span>{product.sales_count} sales</span>
                        <span className="font-semibold">{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-5">
              <h2 className="text-lg font-bold text-foreground">Category Breakdown</h2>
              <div className="mt-4 space-y-3">
                {category_breakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No category revenue yet.</p>
                ) : (
                  category_breakdown.map((item) => (
                    <div key={item.category} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold text-foreground">{item.category}</p>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span>{item.sales_count} sales</span>
                        <span className="font-semibold">{formatCurrency(item.revenue)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
