import { Head } from '@inertiajs/react'
import type { ReactNode } from 'react'

interface LandingLayoutProps {
  children: ReactNode
  title?: string
}

export default function LandingLayout({ children, title = 'KREAVA - Create. Sell. Inspire.' }: LandingLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Digital product marketplace for creators. Sell UI kits, templates, code, ebooks, icons, and design assets. Join thousands of creators earning from their digital products." />
        <meta property="og:title" content="KREAVA - Create. Sell. Inspire." />
        <meta property="og:description" content="Digital product marketplace for creators." />
        <meta property="og:image" content="/images/Brand.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/images/Brand.png" />
        <link rel="icon" href="/public/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/Logo.png" />
      </Head>

      <div className="font-sans antialiased bg-background text-foreground">
        {children}
      </div>
    </>
  )
}
