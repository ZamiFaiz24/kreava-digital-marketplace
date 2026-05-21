'use client'

import type { ProductDetailPageProps } from '@/types/marketplace'
import ProductDetailScreen from '@/components/screens/marketplace/product-detail-screen'

export default function ProductPage(props: ProductDetailPageProps) {
  return <ProductDetailScreen {...props} />
}
