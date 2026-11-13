import { ChevronRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Product } from '../../../types/seller';

interface TopProductsProps {
    products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
    const { t } = useTranslation();

    return (
        <div className="border-border mb-8 rounded-2xl border bg-white p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-foreground text-xl font-bold">{t('dashboard.top_products.title')}</h2>
                    <p className="text-muted-foreground text-sm">{t('dashboard.top_products.description')}</p>
                </div>
                <a href="#" className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-semibold">
                    {t('dashboard.top_products.view_all')} <ChevronRight className="h-4 w-4" />
                </a>
            </div>

            {/* Products Grid */}
            <div className="space-y-4">
                {products.map((product) => (
                    <div key={product.id} className="hover:bg-muted/50 group flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors">
                        {/* Thumbnail */}
                        <div className="bg-muted h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="min-w-0 flex-1">
                            <p className="text-foreground line-clamp-1 font-semibold">{product.name}</p>
                            <p className="text-muted-foreground text-xs">{product.category}</p>

                            {/* Rating */}
                            <div className="mt-2 flex items-center gap-1">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3 w-3 ${
                                                i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-foreground text-xs font-semibold">{product.rating}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex-shrink-0 text-right">
                            <p className="text-foreground text-sm font-bold">{product.salesCount.toLocaleString()}</p>
                            <p className="text-muted-foreground text-xs">{t('dashboard.top_products.sales')}</p>

                            <p className="text-primary mt-2 text-sm font-bold">
                                ${product.revenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-muted-foreground text-xs">{t('dashboard.top_products.revenue')}</p>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
}
