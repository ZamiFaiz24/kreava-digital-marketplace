'use client'

import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { LayoutGrid, List } from 'lucide-react'
import type { MarketplacePageProps } from '@/types/marketplace'
import PageHeader from '@/components/shared/page-header'
import SearchInput from '@/components/shared/search-input'
import FilterSidebar from '@/components/shared/filter-sidebar'
import ProductCard from '@/components/shared/product-card'
import PaginationControls from '@/components/shared/pagination-controls'
import EmptyState from '@/components/shared/empty-state'

export default function MarketplaceScreen({
  products = [],
  categories = [],
  pagination = { total: 0, per_page: 12, current_page: 1, last_page: 1, from: 0, to: 0 },
  filters = {},
}: MarketplacePageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState(filters.query || '')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
  filters.category ?? undefined)  
  const [sortBy, setSortBy] = useState(filters.sort || 'newest')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In real Laravel app, this would trigger a form submission or navigate with query params
  }

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category || undefined)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader
        title="Jelajahi Produk"
        description="Temukan UI kit, template, icon, dan aset digital terbaik dari para kreator berbakat"
        action={
          <Link
            href={route('landing')}
            className="inline-flex items-center rounded-lg border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Kembali ke Landing
          </Link>
        }
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchInput value={searchQuery} onChange={handleSearch} />
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <FilterSidebar
              categories={categories}
              onCategoryChange={handleCategoryChange}
              selectedCategory={selectedCategory}
            />
          </aside>

          {/* Main Area */}
          <main className="lg:col-span-3">
            {/* Toolbar */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {pagination.total} produk ditemukan
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
                >
                  <option value="newest">Terbaru</option>
                  <option value="trending">Trending</option>
                  <option value="price_low">Harga: Rendah ke Tinggi</option>
                  <option value="price_high">Harga: Tinggi ke Rendah</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex gap-2 rounded-lg border border-input bg-card p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors ${
                      viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition-colors ${
                      viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                    }`}
                    title="List view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {products.length > 0 ? (
              <>
                <div
                  className={`mb-8 gap-6 ${
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                      : 'space-y-4'
                  }`}
                >
                  {products.map((product) => (
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
                title="Produk tidak ditemukan"
                description="Coba ubah filter atau cari dengan kata kunci yang berbeda"
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}