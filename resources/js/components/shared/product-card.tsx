'use client';

import { Link } from '@inertiajs/react';
import { ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { addProductToCart } from '@/lib/cart';
import { formatPriceSimple, generateStars } from '@/lib/marketplace-utils';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/marketplace';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
    href?: string;
}

export default function ProductCard({ product, onClick, href = '#' }: ProductCardProps) {
    const { t } = useTranslation();
    const [isAdding, setIsAdding] = useState(false);
    const { toast } = useToast();
    const stars = generateStars(product.rating);
    const categoryName = typeof product.category === 'string' ? product.category : product.category.name;

    const handleAddToCart = async () => {
        try {
            setIsAdding(true);
            await addProductToCart(product.id);
            toast({
                title: t('marketplace.product.added_title'),
                description: t('marketplace.product.added_description', { title: product.title }),
            });
        } catch (error) {
            console.error('Failed to add product to cart', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Card className="group h-full gap-0 overflow-hidden border border-slate-200/80 bg-white p-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
            <Link
                href={href}
                onClick={(event) => {
                    if (onClick) {
                        event.preventDefault();
                        onClick();
                    }
                }}
                className="flex flex-1 flex-col"
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {product.trending && (
                        <Badge className="absolute top-3 left-3 gap-1 border-0 bg-amber-500 text-white shadow-sm">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {t('marketplace.product.trending')}
                        </Badge>
                    )}

                    {product.old_price && (
                        <Badge className="absolute top-3 right-3 border-0 bg-rose-500 text-white shadow-sm">
                            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                        </Badge>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                    <Badge variant="secondary" className="mb-3 w-fit bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
                        {categoryName}
                    </Badge>

                    <h3 className="line-clamp-2 text-base leading-6 font-semibold text-slate-900 transition group-hover:text-indigo-600">
                        {product.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600">
                            {product.seller.avatar ? (
                                <img src={product.seller.avatar} alt={product.seller.name} className="h-full w-full object-cover" />
                            ) : (
                                product.seller.name.charAt(0).toUpperCase()
                            )}
                        </span>
                        <span className="truncate">{product.seller.name}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                            {stars.map((star, index) => (
                                <Star key={index} className={cn('h-3.5 w-3.5', star > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />
                            ))}
                        </div>
                        <span className="text-xs font-medium text-slate-600">{product.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({t('marketplace.product.reviews', { count: product.reviews_count })})</span>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                        <div>
                            <p className="text-xl font-bold tracking-tight text-slate-950">{formatPriceSimple(product.price)}</p>
                            {product.old_price && <p className="text-xs text-slate-400 line-through">{formatPriceSimple(product.old_price)}</p>}
                        </div>
                    </div>
                </div>
            </Link>

            <div className="px-5 pb-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full rounded-xl border-indigo-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                    <ShoppingCart className="h-4 w-4" />
                    {isAdding ? t('marketplace.product.adding') : t('marketplace.product.add_to_cart')}
                </Button>
            </div>
        </Card>
    );
}
