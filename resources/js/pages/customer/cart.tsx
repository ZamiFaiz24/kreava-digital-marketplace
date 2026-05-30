import PublicLayout from '@/layouts/public-layout';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { formatPriceSimple } from '@/lib/marketplace-utils';

interface CartItem {
  id: number;
  price: number;
  product: {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string;
    images: Array<{
      id: number;
      url: string;
    }>;
    seller: {
      id: number;
      store_name?: string;
      user?: {
        name?: string;
      };
    };
  };
}

interface Props extends PageProps {
  cart: {
    id: number;
    items: CartItem[];
  } | null;
}

export default function Cart({ cart }: Props) {
  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch(route('cart.remove', itemId), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(route('cart.clear'), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <PublicLayout title="My Cart">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Cart</h1>
            <p className="mt-2 text-foreground/60">Review products before you checkout</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 py-12">
            <ShoppingCart className="mb-4 h-12 w-12 text-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">Cart is empty</h3>
            <p className="mt-1 text-sm text-foreground/60">Add products to your cart to view them here</p>
            <Link
              href={route('marketplace')}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => {
                const image = item.product.images?.[0]?.url || item.product.thumbnail || '/images/Brand.png';
                const sellerName = item.product.seller.store_name || item.product.seller.user?.name || 'Independent Creator';

                return (
                  <div key={item.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={image}
                          alt={item.product.title}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-base font-semibold text-foreground">{item.product.title}</h3>
                          <p className="text-sm text-foreground/60">{sellerName}</p>
                          <p className="mt-2 text-sm font-semibold text-foreground">{formatPriceSimple(item.price)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={route('product.show', item.product.slug)}
                          className="rounded-lg border border-input px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
                        >
                          View Product
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="h-fit rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-foreground/70">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">{formatPriceSimple(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fees</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Link
                href={route('marketplace')}
                className="mt-6 block rounded-lg border border-input px-4 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Continue Shopping
              </Link>
              <button
                type="button"
                className="mt-3 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
