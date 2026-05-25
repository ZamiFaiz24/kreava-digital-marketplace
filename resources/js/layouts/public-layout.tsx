import type { ReactNode } from 'react'
import PublicNavbar from '@/components/layout/public-navbar'
import type { Category } from '@/types/marketplace'

interface PublicLayoutProps {
  children: ReactNode
  categories?: Category[]
}

export default function PublicLayout({
  children,
  categories = [],
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar variant="marketplace" categories={categories} />

      <main>
        {children}
      </main>

      {/* Footer nanti */}
    </div>
  )
}