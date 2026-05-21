import type { Product } from '@/types/marketplace'
import ProductCard from '@/components/shared/product-card'

interface RelatedProductsProps {
  products: Product[]
  title?: string
}

export default function RelatedProducts({
  products,
  title = 'Related Products',
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={`/products/${product.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
