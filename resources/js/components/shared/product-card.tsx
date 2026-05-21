import { Star, TrendingUp } from 'lucide-react'
import type { Product } from '@/types/marketplace'
import { formatPriceSimple, generateStars } from '@/lib/marketplace-utils'

interface ProductCardProps {
  product: Product
  onClick?: () => void
  href?: string
}

export default function ProductCard({ product, onClick, href = '#' }: ProductCardProps) {
  const stars = generateStars(product.rating)

  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {product.trending && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent px-3 py-1.5">
            <TrendingUp className="h-4 w-4 text-accent-foreground" />
            <span className="text-xs font-semibold text-accent-foreground">Trending</span>
          </div>
        )}
        {product.old_price && (
          <div className="absolute left-3 top-3 rounded-lg bg-red-500 px-2.5 py-1">
            <span className="text-xs font-bold text-white">
              -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Badge */}
        <span className="mb-2 w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {typeof product.category === 'string' ? product.category : product.category.name}
        </span>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          <div className="flex gap-0.5">
            {stars.map((star, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  star === 1
                    ? 'fill-yellow-400 text-yellow-400'
                    : star === 0.5
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
        </div>

        {/* Creator Info */}
        <div className="mb-3 flex items-center gap-2">
          {product.seller.avatar && (
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="h-5 w-5 rounded-full object-cover"
            />
          )}
          <span className="text-xs text-muted-foreground">{product.seller.name}</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPriceSimple(product.price)}</span>
            {product.old_price && (
              <span className="text-sm line-through text-muted-foreground">
                {formatPriceSimple(product.old_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}
