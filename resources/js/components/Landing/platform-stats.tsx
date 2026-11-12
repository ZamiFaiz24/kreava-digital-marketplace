import { BadgeCheck, Package, ShoppingBag, Star, Users } from 'lucide-react';

import { Card } from '@/components/ui/card';
import type { PlatformStats } from '@/types/landing';

const numberFormatter = new Intl.NumberFormat('id-ID');

const statItems = [
    {
        key: 'products' as const,
        label: 'Total Produk',
        description: 'Produk digital siap dibeli',
        icon: Package,
        iconClass: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    },
    {
        key: 'creators' as const,
        label: 'Total Kreator',
        description: 'Kreator terverifikasi',
        icon: Users,
        iconClass: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    },
    {
        key: 'transactions' as const,
        label: 'Total Transaksi',
        description: 'Transaksi berhasil',
        icon: ShoppingBag,
        iconClass: 'bg-amber-50 text-amber-600 ring-amber-100',
    },
    {
        key: 'average_rating' as const,
        label: 'Rating Rata-rata',
        description: 'Dari ulasan pembeli',
        icon: Star,
        iconClass: 'bg-rose-50 text-rose-600 ring-rose-100',
    },
];

export function PlatformStatsSection({ stats }: { stats: PlatformStats }) {
    return (
        <section className="relative z-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                    {statItems.map((item) => {
                        const Icon = item.icon;
                        const value = item.key === 'average_rating' ? stats.average_rating.toFixed(1) : numberFormatter.format(stats[item.key]);

                        return (
                            <Card
                                key={item.key}
                                className="flex-row items-center gap-3 border-slate-200/80 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md md:gap-4 md:p-5"
                            >
                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 md:h-12 md:w-12 ${item.iconClass}`}
                                >
                                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-500 md:text-sm">{item.label}</p>
                                    <p className="mt-0.5 flex items-baseline gap-1 text-xl font-bold tracking-tight text-slate-900 tabular-nums md:text-2xl">
                                        {value}
                                        {item.key === 'average_rating' && <span className="text-xs font-medium text-slate-400">/ 5</span>}
                                    </p>
                                    <p className="mt-0.5 hidden truncate text-xs text-slate-400 sm:block">{item.description}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Data platform diperbarui secara otomatis
                </p>
            </div>
        </section>
    );
}
