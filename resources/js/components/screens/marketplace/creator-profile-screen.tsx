'use client'

import { useState } from 'react'
import { Mail, Globe } from 'lucide-react'
import type { CreatorProfilePageProps } from '@/types/marketplace'
import ProductCard from '@/components/shared/product-card'
import PaginationControls from '@/components/shared/pagination-controls'
import EmptyState from '@/components/shared/empty-state'
import { formatNumber } from '@/lib/marketplace-utils'

export default function CreatorProfileScreen({
  creator,
  featured_products = [],
  all_products = [],
  pagination = { total: 0, per_page: 12, current_page: 1, last_page: 1, from: 0, to: 0 },
  is_following = false,
}: CreatorProfilePageProps) {
  const [isFollowing, setIsFollowing] = useState(is_following)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      {creator.banner && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-r from-primary to-accent sm:h-64">
          <img src={creator.banner} alt={creator.name} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Profile Section */}
      <div className="relative -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              {/* Profile Info */}
              <div className="flex items-start gap-6">
                {creator.avatar && (
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-24 w-24 rounded-full border-4 border-card object-cover sm:h-32 sm:w-32"
                  />
                )}

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{creator.name}</h1>

                  {creator.bio && (
                    <p className="mt-2 text-muted-foreground">{creator.bio}</p>
                  )}

                  {/* Stats */}
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Produk</p>
                      <p className="font-semibold text-foreground">{creator.products_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pengikut</p>
                      <p className="font-semibold text-foreground">
                        {formatNumber(creator.followers_count || 0)}
                      </p>
                    </div>
                    {creator.rating && (
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-semibold text-foreground">{creator.rating.toFixed(1)} ★</p>
                      </div>
                    )}
                    {creator.total_sales && (
                      <div>
                        <p className="text-sm text-muted-foreground">Total Penjualan</p>
                        <p className="font-semibold text-foreground">
                          Rp{(creator.total_sales / 1000000).toFixed(1)}jt
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleFollow}
                className={`flex-shrink-0 rounded-lg px-6 py-3 font-semibold transition-colors ${
                  isFollowing
                    ? 'border border-primary bg-background text-primary hover:bg-primary/5'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isFollowing ? 'Mengikuti' : 'Ikuti'}
              </button>
            </div>

            {/* Social Links */}
            {(creator.website || creator.twitter || creator.instagram) && (
              <div className="mt-6 border-t border-border pt-6">
                <p className="mb-3 text-sm font-medium text-foreground">Hubungi</p>
                <div className="flex flex-wrap gap-3">
                  {creator.website && (
                    <a
                      href={creator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {creator.twitter && (
                    <a
                      href={`https://twitter.com/${creator.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Twitter
                    </a>
                  )}
                  {creator.instagram && (
                    <a
                      href={`https://instagram.com/${creator.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Instagram
                    </a>
                  )}
                  <a
                    href={`mailto:contact@${creator.slug}.com`}
                    className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Featured Products */}
        {featured_products.length > 0 && (
          <section className="mb-16 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Produk Unggulan</h2>
              <p className="mt-1 text-muted-foreground">Koleksi terbaik dari kreator ini</p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featured_products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={`/products/${product.slug}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Semua Produk</h2>
            <p className="mt-1 text-muted-foreground">
              {pagination.total} produk tersedia
            </p>
          </div>

          {all_products.length > 0 ? (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {all_products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    href={`/products/${product.slug}`}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <PaginationControls
                  current_page={pagination.current_page}
                  last_page={pagination.last_page}
                  total={pagination.total}
                  per_page={pagination.per_page}
                  href={(page) => `?page=${page}`}
                />
              )}
            </>
          ) : (
            <EmptyState
              title="Belum ada produk"
              description="Kreator ini belum membagikan produk apapun"
            />
          )}
        </section>
      </div>
    </div>
  )
}