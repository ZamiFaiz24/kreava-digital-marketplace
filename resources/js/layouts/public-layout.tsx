import type { ReactNode } from 'react'
import MarketplaceHeader from '@/components/layout/marketplace-header'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <main>
        {children}
      </main>

      {/* Footer nanti */}
    </div>
  )
}