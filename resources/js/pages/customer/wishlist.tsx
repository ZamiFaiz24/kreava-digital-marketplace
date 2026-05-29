import PublicLayout from '@/layouts/public-layout';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { formatPriceSimple } from '@/lib/marketplace-utils';

interface WishlistItem {
    id: number;
    product: {
        id: number;
        title: string;
        slug: string;
        price: number;
        thumbnail?: string;
        images: Array<{
            id: number;
            url: string;
        }>;
        seller: {
            id: number;
            name: string;
        };
    };
}

interface Props {
    wishlist: {
        id: number;
        items: WishlistItem[];
    } | null;
}

export default function Wishlist({ wishlist }: Props) {
    const [items, setItems] = useState(wishlist?.items || []);

    const removeFromWishlist = async (itemId: number) => {
        try {
            const response = await fetch(route('wishlist.remove', itemId), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                setItems(items.filter((item) => item.id !== itemId));
            }
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    return (
        <PublicLayout title="My Wishlist">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
                    <p className="mt-2 text-foreground/60">Saved products and items you're interested in</p>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 py-12">
                        <Heart className="mb-4 h-12 w-12 text-foreground/40" />
                        <h3 className="text-lg font-semibold text-foreground">Wishlist is empty</h3>
                        <p className="mt-1 text-sm text-foreground/60">Save products to your wishlist to view them later</p>
                        <Link href={route('marketplace')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                            <ShoppingCart className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((item) => (
                            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary/30">
                                {/* Product Image */}
                                <div className="relative h-48 overflow-hidden bg-muted">
                                    {item.product.images?.[0] ? (
                                        <img
                                            src={item.product.images[0].url}
                                            alt={item.product.title}
                                            className="h-full w-full object-cover transition group-hover:scale-105"
                                        />
                                    ) : item.product.thumbnail ? (
                                        <img
                                            src={item.product.thumbnail}
                                            alt={item.product.title}
                                            className="h-full w-full object-cover transition group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-foreground/40">No image</div>
                                    )}

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-red-500 transition hover:bg-background"
                                        title="Remove from wishlist"
                                    >
                                        <Heart className="h-5 w-5 fill-current" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-foreground line-clamp-2">{item.product.title}</h3>
                                    <p className="mt-1 text-xs text-foreground/60">{item.product.seller.name}</p>

                                    <div className="mt-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-foreground/60">Price</p>
                                            <p className="text-lg font-bold text-foreground">{formatPriceSimple(item.product.price)}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('product.show', item.product.slug)}
                                        className="mt-4 block w-full rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary transition hover:bg-primary/20"
                                    >
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
