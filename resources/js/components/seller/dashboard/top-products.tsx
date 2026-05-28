import React from 'react';
import { Product } from '../../../types/seller';
import { Star, ChevronRight } from 'lucide-react';

interface TopProductsProps {
  products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Top Products</h2>
          <p className="text-sm text-muted-foreground">Your best selling products</p>
        </div>
        <a
          href="#"
          className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground line-clamp-1">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-foreground">{product.rating}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-foreground">
                {product.salesCount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">sales</p>

              <p className="text-sm font-bold text-primary mt-2">
                ${product.revenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">revenue</p>
            </div>

            {/* Chevron */}
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
