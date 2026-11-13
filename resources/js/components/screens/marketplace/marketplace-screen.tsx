'use client';

import { router } from '@inertiajs/react';
import { LayoutGrid, List, Loader2, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

import EmptyState from '@/components/shared/empty-state';
import FilterSidebar from '@/components/shared/filter-sidebar';
import PageHeader from '@/components/shared/page-header';
import PaginationControls from '@/components/shared/pagination-controls';
import ProductCard from '@/components/shared/product-card';
import SearchInput from '@/components/shared/search-input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MarketplacePageProps } from '@/types/marketplace';

type FilterOverrides = {
    query?: string;
    category?: string | null;
    min_price?: string | number | null;
    max_price?: string | number | null;
    min_rating?: number | null;
    sort?: string;
    page?: number;
};

export default function MarketplaceScreen({
    products = [],
    categories = [],
    pagination = { total: 0, per_page: 12, current_page: 1, last_page: 1, from: 0, to: 0 },
    filters = {},
}: MarketplacePageProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.query ?? '');
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(filters.category ?? undefined);
    const [selectedRating, setSelectedRating] = useState<number | null>(filters.min_rating ?? null);
    const [minPrice, setMinPrice] = useState(filters.min_price !== null && filters.min_price !== undefined ? String(filters.min_price) : '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price !== null && filters.max_price !== undefined ? String(filters.max_price) : '');
    const [sortBy, setSortBy] = useState(filters.sort ?? 'latest');

    useEffect(() => {
        setSearchQuery(filters.query ?? '');
        setSelectedCategory(filters.category ?? undefined);
        setSelectedRating(filters.min_rating ?? null);
        setMinPrice(filters.min_price !== null && filters.min_price !== undefined ? String(filters.min_price) : '');
        setMaxPrice(filters.max_price !== null && filters.max_price !== undefined ? String(filters.max_price) : '');
        setSortBy(filters.sort ?? 'latest');
    }, [filters.query, filters.category, filters.min_rating, filters.min_price, filters.max_price, filters.sort]);

    const navigate = (overrides: FilterOverrides = {}) => {
        const next = {
            query: overrides.query !== undefined ? overrides.query : searchQuery,
            category: overrides.category !== undefined ? overrides.category : selectedCategory,
            min_price: overrides.min_price !== undefined ? overrides.min_price : minPrice,
            max_price: overrides.max_price !== undefined ? overrides.max_price : maxPrice,
            min_rating: overrides.min_rating !== undefined ? overrides.min_rating : selectedRating,
            sort: overrides.sort !== undefined ? overrides.sort : sortBy,
            page: overrides.page,
        };

        const params: Record<string, string | number> = {};

        Object.entries(next).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                return;
            }

            if (key === 'sort' && value === 'latest') {
                return;
            }

            params[key] = value;
        });

        router.get(route('marketplace'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory(undefined);
        setSelectedRating(null);
        setMinPrice('');
        setMaxPrice('');
        setSortBy('latest');

        router.get(
            route('marketplace'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/60">
            <PageHeader
                title="Jelajahi Marketplace"
                description="Temukan UI kits, template, ikon, ebook, dan aset digital premium dari kreator terbaik."
            />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Cari produk, UI kit, template..."
                        onSubmit={(value) => {
                            setSearchQuery(value);
                            navigate({ query: value });
                        }}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={() => navigate({ query: searchQuery })}
                        disabled={isLoading}
                        className="h-12 bg-indigo-600 px-6 text-base font-semibold hover:bg-indigo-700 sm:w-auto"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Cari produk
                    </Button>
                </div>

                <div className="mb-4 lg:hidden">
                    <Button type="button" variant="outline" onClick={() => setShowFilters((previous) => !previous)} className="w-full justify-center">
                        <SlidersHorizontal className="h-4 w-4" />
                        {showFilters ? 'Sembunyikan filter' : 'Tampilkan filter'}
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className={cn('lg:block', showFilters ? 'block' : 'hidden')}>
                        <FilterSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            selectedRating={selectedRating}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            sort={sortBy}
                            onCategoryChange={(category) => {
                                setSelectedCategory(category ?? undefined);
                                navigate({ category });
                            }}
                            onRatingChange={(rating) => {
                                setSelectedRating(rating);
                                navigate({ min_rating: rating });
                            }}
                            onMinPriceChange={setMinPrice}
                            onMaxPriceChange={setMaxPrice}
                            onApplyPrice={() => navigate({ min_price: minPrice, max_price: maxPrice })}
                            onSortChange={(sort) => {
                                setSortBy(sort);
                                navigate({ sort });
                            }}
                            onReset={resetFilters}
                        />
                    </aside>

                    <main aria-busy={isLoading}>
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{pagination.total.toLocaleString('id-ID')} produk ditemukan</p>
                                <p className="text-xs text-slate-500">
                                    {pagination.total > 0
                                        ? `Menampilkan ${pagination.from}-${pagination.to} dari ${pagination.total} produk`
                                        : 'Tidak ada produk yang cocok'}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {isLoading && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Memuat
                                    </span>
                                )}

                                <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            'rounded-md p-1.5 transition',
                                            viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-700',
                                        )}
                                        title="Tampilan grid"
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            'rounded-md p-1.5 transition',
                                            viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-700',
                                        )}
                                        title="Tampilan list"
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <>
                                <div
                                    className={cn(
                                        'mb-8 gap-5 transition-opacity',
                                        viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4',
                                        isLoading && 'pointer-events-none opacity-60',
                                    )}
                                >
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} href={`/products/${product.slug}`} />
                                    ))}
                                </div>

                                {pagination.last_page > 1 && (
                                    <PaginationControls
                                        current_page={pagination.current_page}
                                        last_page={pagination.last_page}
                                        total={pagination.total}
                                        per_page={pagination.per_page}
                                        onPageChange={(page) => navigate({ page })}
                                    />
                                )}
                            </>
                        ) : (
                            <EmptyState
                                title="Produk tidak ditemukan"
                                description="Coba ubah kata kunci, rentang harga, kategori, atau rating minimum."
                                action={
                                    <Button type="button" onClick={resetFilters} className="bg-indigo-600 hover:bg-indigo-700">
                                        Reset filter
                                    </Button>
                                }
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
