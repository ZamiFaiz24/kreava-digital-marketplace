'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { Category } from '@/types/marketplace'

interface FilterSidebarProps {
  categories: Category[]
  onCategoryChange?: (category: string | null) => void
  onPriceChange?: (min: number, max: number) => void
  onRatingChange?: (rating: number | null) => void
  selectedCategory?: string
  selectedRating?: number
}

const PRICE_RANGES = [
  { label: 'Rp 0 - Rp 100rb', min: 0, max: 100000 },
  { label: 'Rp 100rb - Rp 500rb', min: 100000, max: 500000 },
  { label: 'Rp 500rb - Rp 1jt', min: 500000, max: 1000000 },
  { label: 'Di atas Rp 1jt', min: 1000000, max: Infinity },
]

const RATINGS = [
  { label: '5 Bintang', value: 5 },
  { label: '4+ Bintang', value: 4 },
  { label: '3+ Bintang', value: 3 },
  { label: '2+ Bintang', value: 2 },
]

export default function FilterSidebar({
  categories,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  selectedCategory,
  selectedRating,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    rating: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="rounded-lg border border-border bg-card p-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex w-full items-center justify-between font-semibold text-foreground hover:text-primary"
        >
          Kategori
          <ChevronDown
            className={`h-4 w-4 transition-transform ${openSections.category ? 'rotate-180' : ''}`}
          />
        </button>

        {openSections.category && (
          <div className="mt-4 space-y-3">
            <button
              onClick={() => onCategoryChange?.(null)}
              className={`block w-full text-left text-sm transition-colors ${
                !selectedCategory
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua Kategori
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.slug)}
                className={`block w-full text-left text-sm transition-colors ${
                  selectedCategory === category.slug
                    ? 'font-medium text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{category.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">({category.count || 0})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="rounded-lg border border-border bg-card p-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between font-semibold text-foreground hover:text-primary"
        >
          Harga
          <ChevronDown
            className={`h-4 w-4 transition-transform ${openSections.price ? 'rotate-180' : ''}`}
          />
        </button>

        {openSections.price && (
          <div className="mt-4 space-y-3">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => onPriceChange?.(range.min, range.max)}
                className="block w-full text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="rounded-lg border border-border bg-card p-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex w-full items-center justify-between font-semibold text-foreground hover:text-primary"
        >
          Rating
          <ChevronDown
            className={`h-4 w-4 transition-transform ${openSections.rating ? 'rotate-180' : ''}`}
          />
        </button>

        {openSections.rating && (
          <div className="mt-4 space-y-3">
            <button
              onClick={() => onRatingChange?.(null)}
              className={`block w-full text-left text-sm transition-colors ${
                !selectedRating
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua Rating
            </button>

            {RATINGS.map((rating) => (
              <button
                key={rating.value}
                onClick={() => onRatingChange?.(rating.value)}
                className={`block w-full text-left text-sm transition-colors ${
                  selectedRating === rating.value
                    ? 'font-medium text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {rating.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
