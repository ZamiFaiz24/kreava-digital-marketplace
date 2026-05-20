import { Head } from '@inertiajs/react'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title = 'KREAVA - Create. Sell. Inspire.' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Digital product marketplace for creators. Sell UI kits, templates, code, ebooks, icons, and design assets. Join thousands of creators earning from their digital products." />
        <meta property="og:title" content="KREAVA - Create. Sell. Inspire." />
        <meta property="og:description" content="Digital product marketplace for creators." />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-light-32x32.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/icon-dark-32x32.png" media="(prefers-color-scheme: dark)" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </Head>

      <div className="font-sans antialiased bg-background text-foreground">
        {children}
      </div>
    </>
  )
}
