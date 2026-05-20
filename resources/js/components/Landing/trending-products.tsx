'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart } from 'lucide-react'

const products = [
  {
    title: 'Modern UI Kit Pro',
    creator: 'Design Studio X',
    rating: 4.8,
    reviews: 342,
    price: '$49',
    category: 'UI Kit',
    gradient: 'from-primary/20 to-accent/20'
  },
  {
    title: 'Responsive Web Templates',
    creator: 'Code Masters',
    rating: 4.9,
    reviews: 521,
    price: '$39',
    category: 'Template',
    gradient: 'from-accent/20 to-primary/20'
  },
  {
    title: 'React Component Library',
    creator: 'DevTools Inc',
    rating: 4.7,
    reviews: 287,
    price: '$29',
    category: 'Source Code',
    gradient: 'from-primary/20 via-accent/20 to-primary/20'
  },
  {
    title: 'Complete Design System Guide',
    creator: 'Creative Academy',
    rating: 4.9,
    reviews: 156,
    price: '$19',
    category: 'Ebook',
    gradient: 'from-accent/20 via-primary/20 to-accent/20'
  },
  {
    title: 'Premium Icon Collection',
    creator: 'Icon Creators',
    rating: 4.8,
    reviews: 412,
    price: '$24',
    category: 'Icons',
    gradient: 'from-primary/20 to-accent/20'
  },
  {
    title: 'Photography Asset Pack',
    creator: 'Asset Market',
    rating: 4.6,
    reviews: 198,
    price: '$34',
    category: 'Assets',
    gradient: 'from-accent/20 to-primary/20'
  }
]

export function TrendingProducts() {
  return (
    <section className="py-20 md:py-28 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-16 flex-wrap gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Trending Products</h2>
            <p className="text-lg text-foreground/60">
              Discover the most popular digital products from creators worldwide
            </p>
          </div>
          <a href="#" className="text-primary font-semibold hover:underline whitespace-nowrap">
            View All →
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.title}
              className="group overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
            >
              {/* Thumbnail */}
              <div className={`aspect-video bg-gradient-to-br ${product.gradient} rounded-t-lg relative overflow-hidden group-hover:scale-105 transition-transform`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingCart size={48} className="text-foreground/10" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <Badge variant="secondary" className="mb-3">
                  {product.category}
                </Badge>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {product.title}
                </h3>

                {/* Creator */}
                <p className="text-sm text-foreground/60 mb-4">{product.creator}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-border'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-foreground/60">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-foreground">{product.price}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
