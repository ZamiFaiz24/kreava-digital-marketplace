import type { ReactNode } from 'react'
import PublicNavbar from '@/components/layout/public-navbar'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar variant="marketplace" />

      <main>
        {children}
      </main>

      {/* Footer nanti */}
    </div>
  )
}