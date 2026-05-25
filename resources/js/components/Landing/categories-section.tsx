'use client'

import { Card } from '@/components/ui/card'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { LandingCategory } from '@/types/landing'
import { getCategoryIcon } from '@/lib/category-icons'

const fallbackCategories: LandingCategory[] = [
  {
    slug: 'ui-kits',
    title: 'UI Kits',
    description: 'Complete design systems and component libraries',
    icon: 'layout-grid',
    href: '/marketplace?category=ui-kits',
    count: 0,
  },
  {
    slug: 'templates',
    title: 'Templates',
    description: 'Figma, WordPress, and web app templates',
    icon: 'layout-template',
    href: '/marketplace?category=templates',
    count: 0,
  },
  {
    slug: 'source-code',
    title: 'Source Code',
    description: 'Ready-to-use code snippets and frameworks',
    icon: 'code-2',
    href: '/marketplace?category=source-code',
    count: 0,
  },
  {
    slug: 'ebooks',
    title: 'Ebooks',
    description: 'Educational guides and digital books',
    icon: 'book-open',
    href: '/marketplace?category=ebooks',
    count: 0,
  },
  {
    slug: 'icons',
    title: 'Icons',
    description: 'Icon packs and vector asset libraries',
    icon: 'shapes',
    href: '/marketplace?category=icons',
    count: 0,
  },
  {
    slug: 'mockups',
    title: 'Mockups',
    description: 'Realistic mockups for product presentations',
    icon: 'monitor-smartphone',
    href: '/marketplace?category=mockups',
    count: 0,
  },
  {
    slug: 'fonts',
    title: 'Fonts',
    description: 'Typography resources for branding projects',
    icon: 'type',
    href: '/marketplace?category=fonts',
    count: 0,
  },
  {
    slug: 'music-audio',
    title: 'Music & Audio',
    description: 'Music, SFX, and audio assets for content',
    icon: 'music-4',
    href: '/marketplace?category=music-audio',
    count: 0,
  },
]

export function CategoriesSection({ categories = fallbackCategories }: { categories?: LandingCategory[] }) {
  return (
    <section id="categories" className="relative bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary">Browse categories</p>
          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">Find the right digital assets, faster.</h2>
          <p className="text-lg text-foreground/60">
            These categories are pulled from the database, so the landing page stays aligned with your marketplace taxonomy.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.icon)

              return (
            <Card
                key={`${category.slug}-${index}`}
                className="group relative overflow-hidden border border-border p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Icon className="h-6 w-6" />
                    </div>

                    {category.count !== undefined && (
                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/60">
                        {category.count} items
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{category.title}</h3>
                    <p className="text-sm leading-6 text-foreground/60">{category.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary transition group-hover:gap-3">
                    Explore category
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
              )
            })}
          </div>

          <Card className="border border-border bg-background p-6 shadow-sm">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Quick browse</p>
                <h3 className="text-2xl font-bold text-foreground">Popular categories at a glance</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/60">
                  Hover cards or use the navbar dropdown to jump straight into the most active category pages.
                </p>
              </div>

              <div className="space-y-3">
                {categories.slice(0, 4).map((category) => {
                  const Icon = getCategoryIcon(category.icon)

                  return (
                    <a
                      key={category.slug}
                      href={category.href}
                      className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 transition hover:border-primary/30 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="font-medium text-foreground">{category.title}</div>
                          <div className="text-xs text-foreground/50">{category.count ?? 0} products</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-foreground/40" />
                    </a>
                  )
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
