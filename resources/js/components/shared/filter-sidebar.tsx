'use client';

import { Check, ChevronDown, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/marketplace';

interface FilterSidebarProps {
    categories: Category[];
    selectedCategory?: string;
    selectedRating?: number | null;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    onCategoryChange?: (category: string | null) => void;
    onRatingChange?: (rating: number | null) => void;
    onMinPriceChange?: (value: string) => void;
    onMaxPriceChange?: (value: string) => void;
    onApplyPrice?: () => void;
    onSortChange?: (value: string) => void;
    onReset?: () => void;
}

const ratingOptions = [
    { labelKey: 'marketplace.rating.five', value: 5 },
    { labelKey: 'marketplace.rating.four_half', value: 4.5 },
    { labelKey: 'marketplace.rating.four', value: 4 },
    { labelKey: 'marketplace.rating.three', value: 3 },
];

const sortOptions = [
    { labelKey: 'marketplace.sort.latest', value: 'latest' },
    { labelKey: 'marketplace.sort.price_asc', value: 'price_asc' },
    { labelKey: 'marketplace.sort.price_desc', value: 'price_desc' },
    { labelKey: 'marketplace.sort.rating_desc', value: 'rating_desc' },
];

export default function FilterSidebar({
    categories,
    selectedCategory,
    selectedRating,
    minPrice = '',
    maxPrice = '',
    sort = 'latest',
    onCategoryChange,
    onRatingChange,
    onMinPriceChange,
    onMaxPriceChange,
    onApplyPrice,
    onSortChange,
    onReset,
}: FilterSidebarProps) {
    const { t } = useTranslation();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        category: true,
        price: true,
        rating: true,
        sort: true,
    });

    const toggleSection = (section: string) => {
        setOpenSections((previous) => ({
            ...previous,
            [section]: !previous[section],
        }));
    };

    return (
        <div className="space-y-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-900">{t('marketplace.filter.title')}</p>
                    <p className="text-xs text-slate-500">{t('marketplace.filter.description')}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={onReset} className="text-slate-500 hover:text-indigo-600">
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t('marketplace.filter.reset')}
                </Button>
            </div>

            <Card className="gap-0 border border-slate-200/80 bg-white p-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => toggleSection('category')}
                    className="flex w-full items-center justify-between text-sm font-semibold text-slate-900 transition hover:text-indigo-600"
                >
                    {t('marketplace.filter.category')}
                    <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', openSections.category && 'rotate-180')} />
                </button>

                {openSections.category && (
                    <div className="mt-4 space-y-1">
                        <button
                            type="button"
                            onClick={() => onCategoryChange?.(null)}
                            className={cn(
                                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                                !selectedCategory
                                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                            )}
                        >
                            {t('marketplace.filter.all_categories')}
                            {!selectedCategory && <Check className="h-4 w-4" />}
                        </button>

                        {categories.map((category) => {
                            const active = selectedCategory === category.slug;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => onCategoryChange?.(category.slug)}
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                                        active
                                            ? 'bg-indigo-50 font-semibold text-indigo-700'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                                    )}
                                >
                                    <span className="truncate">{category.name}</span>
                                    <span className={cn('ml-2 shrink-0 text-xs', active ? 'text-indigo-500' : 'text-slate-400')}>
                                        {category.count ?? 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </Card>

            <Card className="gap-0 border border-slate-200/80 bg-white p-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => toggleSection('price')}
                    className="flex w-full items-center justify-between text-sm font-semibold text-slate-900 transition hover:text-indigo-600"
                >
                    {t('marketplace.filter.price_range')}
                    <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', openSections.price && 'rotate-180')} />
                </button>

                {openSections.price && (
                    <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label htmlFor="min-price" className="mb-1.5 block text-xs font-medium text-slate-500">
                                    {t('marketplace.filter.min')}
                                </label>
                                <Input
                                    id="min-price"
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(event) => onMinPriceChange?.(event.target.value)}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                            <div>
                                <label htmlFor="max-price" className="mb-1.5 block text-xs font-medium text-slate-500">
                                    {t('marketplace.filter.max')}
                                </label>
                                <Input
                                    id="max-price"
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    placeholder="1000"
                                    value={maxPrice}
                                    onChange={(event) => onMaxPriceChange?.(event.target.value)}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                        </div>

                        <Button type="button" onClick={onApplyPrice} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {t('marketplace.filter.apply_price')}
                        </Button>
                    </div>
                )}
            </Card>

            <Card className="gap-0 border border-slate-200/80 bg-white p-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => toggleSection('rating')}
                    className="flex w-full items-center justify-between text-sm font-semibold text-slate-900 transition hover:text-indigo-600"
                >
                    {t('marketplace.filter.min_rating')}
                    <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', openSections.rating && 'rotate-180')} />
                </button>

                {openSections.rating && (
                    <div className="mt-4 space-y-1">
                        <button
                            type="button"
                            onClick={() => onRatingChange?.(null)}
                            className={cn(
                                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                                !selectedRating
                                    ? 'bg-emerald-50 font-semibold text-emerald-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                            )}
                        >
                            {t('marketplace.filter.all_ratings')}
                            {!selectedRating && <Check className="h-4 w-4" />}
                        </button>

                        {ratingOptions.map((rating) => {
                            const active = selectedRating === rating.value;

                            return (
                                <button
                                    key={rating.value}
                                    type="button"
                                    onClick={() => onRatingChange?.(rating.value)}
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                                        active
                                            ? 'bg-emerald-50 font-semibold text-emerald-700'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                                    )}
                                >
                                    {t(rating.labelKey)}
                                    {active && <Check className="h-4 w-4" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </Card>

            <Card className="gap-0 border border-slate-200/80 bg-white p-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => toggleSection('sort')}
                    className="flex w-full items-center justify-between text-sm font-semibold text-slate-900 transition hover:text-indigo-600"
                >
                    {t('marketplace.filter.sort')}
                    <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', openSections.sort && 'rotate-180')} />
                </button>

                {openSections.sort && (
                    <div className="mt-4">
                        <Select value={sort} onValueChange={onSortChange}>
                            <SelectTrigger className="h-9 w-full rounded-lg">
                                <SelectValue placeholder={t('marketplace.filter.sort_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {t(option.labelKey)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </Card>
        </div>
    );
}
