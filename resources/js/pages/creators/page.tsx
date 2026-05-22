'use client'

import PublicLayout from '@/layouts/public-layout'
import PageHeader from '@/components/shared/page-header'

export default function CreatorsPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Creators"
        description="A curated directory of creators and studios building digital products on Kreava."
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
          Creator directory is coming soon.
        </div>
      </div>
    </PublicLayout>
  )
}
