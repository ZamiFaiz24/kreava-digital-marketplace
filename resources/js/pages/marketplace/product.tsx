'use client';

import ProductDetailScreen from '@/components/screens/marketplace/product-detail-screen';
import PublicLayout from '@/layouts/public-layout';
import type { ProductDetailPageProps } from '@/types/marketplace';

export default function ProductPage(props: ProductDetailPageProps) {
    return (
        <PublicLayout>
            <ProductDetailScreen {...props} />
        </PublicLayout>
    );
}
