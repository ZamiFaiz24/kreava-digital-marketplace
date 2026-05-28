import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface ProductRow {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  price: number;
  status: string;
  sales_count: number;
  revenue: number;
  rating: number;
  created_at: string;
}

interface ProductPagination {
  data: ProductRow[];
  current_page: number;
  last_page: number;
  total: number;
}

interface ProductsPageProps {
  products: ProductPagination;
  summary: {
    total_products: number;
    published_products: number;
    draft_products: number;
  };
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export default function SellerProductsPage({ products, summary }: ProductsPageProps) {
  return (
    <>
      <Head title="Seller Products" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Products</h1>
              <p className="text-sm text-muted-foreground">Manage all products from your store.</p>
            </div>
            <Link
              href={route('seller.products.new')}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Upload Product
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Products</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.total_products}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Published</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.published_products}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Draft</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary.draft_products}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Sales</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody>
                {products.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No products found for this seller.
                    </td>
                  </tr>
                ) : (
                  products.data.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.thumbnail} alt={product.title} className="h-11 w-11 rounded-md object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{product.title}</p>
                            <p className="text-xs text-muted-foreground">{product.created_at}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{product.category}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{formatCurrency(product.price)}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{product.sales_count}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">{formatCurrency(product.revenue)}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80">
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{product.rating.toFixed(1)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {products.current_page} of {products.last_page}
            </span>
            <span>{products.total} products</span>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
