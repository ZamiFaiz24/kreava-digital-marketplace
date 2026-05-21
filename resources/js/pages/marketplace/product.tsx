'use client'

import type { ProductDetailPageProps } from '@/types/marketplace'
import ProductDetailScreen from '@/components/screens/marketplace/product-detail-screen'
import PublicLayout from '@/layouts/public-layout'

export default function ProductPage(props: ProductDetailPageProps) {
  return (
    <PublicLayout>
      <ProductDetailScreen {...props} />
    </PublicLayout>
  )
}
