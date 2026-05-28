import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface SellerPlaceholderProps {
  title: string;
  description: string;
}

export default function SellerPlaceholderPage({ title, description }: SellerPlaceholderProps) {
  return (
    <>
      <Head title={title} />
      <DashboardLayout>
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Seller Area</p>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={route('seller.dashboard')}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Back to Dashboard
            </Link>
            <Link
              href={route('marketplace')}
              className="rounded-lg border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Open Marketplace
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
