'use client'

import PublicLayout from '@/layouts/public-layout'
import { Link } from '@inertiajs/react'
import { ArrowRight, BadgeCheck, ExternalLink, GalleryHorizontal, ShoppingBag, Star, Users } from 'lucide-react'

interface CreatorPreviewProduct {
  title: string
  slug: string
  category: string
  thumbnail: string
  price: string
}

interface Creator {
  id: number
  slug: string
  name: string
  store_name: string
  avatar?: string | null
  description: string
  specialization: string[]
  products_count: number
  sales_count: number
  followers_count: number
  rating: number
  preview_products: CreatorPreviewProduct[]
}

interface CreatorsPageProps {
  creators?: Creator[]
  featuredCreator?: Creator | null
  stats?: {
    creators: number
    products: number
    sales: number
    average_rating: number
  }
}

function formatCompactNumber(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
  }

  return `${value}`
}

function resolveAvatarSrc(avatar?: string | null) {
  if (!avatar) {
    return '/images/Brand.png'
  }

  return avatar.startsWith('/') ? avatar : `/${avatar}`
}

function CreatorAvatar({ avatar, name, className = 'h-16 w-16' }: { avatar?: string | null; name: string; className?: string }) {
  return (
    <img
      src={resolveAvatarSrc(avatar)}
      alt={name}
      className={`${className} rounded-2xl object-cover ring-1 ring-border`}
      onError={(event) => {
        ;(event.currentTarget as HTMLImageElement).src = '/images/Brand.png'
      }}
    />
  )
}

export default function CreatorsPage({ creators = [], featuredCreator, stats }: CreatorsPageProps) {
  const spotlight = featuredCreator ?? creators[0]
  const topCreators = spotlight ? creators.filter((creator) => creator.id !== spotlight.id) : creators

  return (
    <PublicLayout>
      <main className="bg-background">
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/8 via-background to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(11,101,98,0.14),_transparent_35%),radial-gradient(circle_at_left,_rgba(11,101,98,0.08),_transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">Creators</p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                Discover the best creators shaping Kreava.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/65">
                A curated showcase of sellers and studios with strong product catalogs, active buyers, and standout digital work.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-border bg-background/85 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/60">
                  <Users className="h-4 w-4 text-primary" />
                  Creators
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">{formatCompactNumber(stats?.creators ?? creators.length)}</div>
              </div>
              <div className="rounded-2xl border border-border bg-background/85 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/60">
                  <GalleryHorizontal className="h-4 w-4 text-primary" />
                  Products
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">{formatCompactNumber(stats?.products ?? 0)}</div>
              </div>
              <div className="rounded-2xl border border-border bg-background/85 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/60">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  Total sales
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">{formatCompactNumber(stats?.sales ?? 0)}</div>
              </div>
              <div className="rounded-2xl border border-border bg-background/85 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/60">
                  <Star className="h-4 w-4 text-primary" />
                  Average rating
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">{(stats?.average_rating ?? 0).toFixed(1)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {spotlight ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[32px] border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <CreatorAvatar avatar={spotlight.avatar} name={spotlight.name} className="h-20 w-20" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-bold text-foreground">{spotlight.store_name}</h2>
                        <BadgeCheck className="h-5 w-5 text-primary" />
                      </div>
                      <p className="mt-1 text-sm font-medium text-foreground/60">{spotlight.name}</p>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/65">{spotlight.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-foreground/70 sm:grid-cols-4 lg:min-w-[280px]">
                    <div className="rounded-2xl border border-border bg-background p-3 text-center">
                      <div className="text-xl font-bold text-foreground">{spotlight.rating.toFixed(1)}</div>
                      <div className="mt-1 text-xs text-foreground/50">Rating</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background p-3 text-center">
                      <div className="text-xl font-bold text-foreground">{spotlight.products_count}</div>
                      <div className="mt-1 text-xs text-foreground/50">Products</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background p-3 text-center">
                      <div className="text-xl font-bold text-foreground">{formatCompactNumber(spotlight.sales_count)}</div>
                      <div className="mt-1 text-xs text-foreground/50">Sales</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background p-3 text-center">
                      <div className="text-xl font-bold text-foreground">{formatCompactNumber(spotlight.followers_count)}</div>
                      <div className="mt-1 text-xs text-foreground/50">Followers</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {spotlight.specialization.length > 0 ? (
                    spotlight.specialization.map((item) => (
                      <span key={item} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/60">
                      Digital products
                    </span>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={route('marketplace')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                    Browse marketplace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href={`mailto:${spotlight.name.toLowerCase().replace(/\s+/g, '.')}@kreava.com`} className="inline-flex items-center gap-2 rounded-xl border border-input px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted">
                    Contact creator
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="rounded-[32px] border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Preview products</p>
                    <h3 className="mt-2 text-2xl font-bold text-foreground">What the creator is selling</h3>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {(spotlight.preview_products.length > 0 ? spotlight.preview_products : []).map((product) => (
                    <Link
                      key={product.slug}
                      href={route('product.show', product.slug)}
                      className="group overflow-hidden rounded-3xl border border-border bg-background transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                    >
                      <div className="aspect-[4/3] bg-muted">
                        <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{product.category}</p>
                        <h4 className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">{product.title}</h4>
                        <div className="mt-3 flex items-center justify-between gap-2 text-sm text-foreground/60">
                          <span>{product.price}</span>
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-12 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Top creators</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Best selling studios and independent creators</h2>
            </div>
            <Link href={route('marketplace')} className="hidden items-center gap-2 text-sm font-medium text-primary md:inline-flex">
              Browse marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {topCreators.map((creator) => (
              <article key={creator.id} className="group rounded-[30px] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <CreatorAvatar avatar={creator.avatar} name={creator.name} className="h-16 w-16" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-foreground">{creator.store_name}</h3>
                        <p className="truncate text-sm text-foreground/60">{creator.name}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {creator.rating.toFixed(1)}
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground/65">{creator.description}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(creator.specialization.length > 0 ? creator.specialization : ['Digital Assets']).map((item) => (
                    <span key={item} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/60">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl border border-border bg-background p-3">
                    <div className="font-bold text-foreground">{creator.products_count}</div>
                    <div className="mt-1 text-xs text-foreground/50">Products</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-3">
                    <div className="font-bold text-foreground">{formatCompactNumber(creator.followers_count)}</div>
                    <div className="mt-1 text-xs text-foreground/50">Followers</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-3">
                    <div className="font-bold text-foreground">{formatCompactNumber(creator.sales_count)}</div>
                    <div className="mt-1 text-xs text-foreground/50">Sales</div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {creator.preview_products.slice(0, 3).map((product) => (
                    <Link key={product.slug} href={route('product.show', product.slug)} className="group/preview overflow-hidden rounded-2xl border border-border bg-background">
                      <div className="aspect-square bg-muted">
                        <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-sm text-foreground/50">Preview products and storefront identity</p>
                  <Link href={route('marketplace')} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {topCreators.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No approved creators yet.
            </div>
          )}
        </section>
      </main>
    </PublicLayout>
  )
}
