import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, CheckCircle2, Code2, Layers, Palette, Sparkles, Star, TrendingUp, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const showcaseItems = [
    {
        title: 'UI Kit',
        subtitle: '1.240 produk',
        icon: Palette,
        className: 'from-indigo-500 to-violet-500',
    },
    {
        title: 'Template',
        subtitle: '980 produk',
        icon: Code2,
        className: 'from-emerald-500 to-teal-500',
    },
    {
        title: 'Ebook',
        subtitle: '640 produk',
        icon: BookOpen,
        className: 'from-amber-400 to-orange-500',
    },
    {
        title: 'Icons',
        subtitle: '2.100 produk',
        icon: Layers,
        className: 'from-rose-500 to-pink-500',
    },
];

const chartBars = [38, 58, 46, 72, 62, 88, 76];

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-emerald-50/60 py-16 md:py-24">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="absolute top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-100/50 blur-3xl" />
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="max-w-2xl">
                        <Badge className="mb-6 gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                            Marketplace untuk kreator digital
                        </Badge>

                        <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Tempat Terbaik untuk{' '}
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
                                Kreator Digital
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
                            Jual UI kits, templates, ebook, ikon, dan produk digital lainnya.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="h-12 rounded-xl bg-emerald-500 px-7 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
                            >
                                <Link href={route('register', { role: 'seller' })}>
                                    Mulai Jual
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                className="h-12 rounded-xl bg-indigo-600 px-7 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                            >
                                <Link href={route('marketplace')}>Telusuri Produk</Link>
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                            {['Tanpa biaya pendaftaran', 'Pembayaran aman', 'Download instan'].map((item) => (
                                <span key={item} className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/60 via-white to-emerald-200/60 blur-2xl" />

                        <div className="relative rounded-[2rem] border border-indigo-100 bg-white/80 p-3 shadow-2xl shadow-indigo-100/70 backdrop-blur">
                            <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950">
                                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                    <span className="ml-3 truncate rounded-md bg-white/10 px-3 py-1 text-[11px] text-slate-400">
                                        kreava.marketplace
                                    </span>
                                </div>

                                <div className="p-4">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-white">Produk unggulan</p>
                                            <p className="mt-1 text-xs text-slate-400">Pilihan terbaik minggu ini</p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                                            <TrendingUp className="h-3 w-3" />
                                            +24%
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {showcaseItems.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                                    <div
                                                        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.className}`}
                                                    >
                                                        <Icon className="h-4 w-4 text-white" />
                                                    </div>
                                                    <p className="text-xs font-semibold text-white">{item.title}</p>
                                                    <p className="mt-0.5 text-[11px] text-slate-400">{item.subtitle}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-3 rounded-2xl bg-white p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[
                                                        'from-indigo-500 to-violet-500',
                                                        'from-emerald-500 to-teal-500',
                                                        'from-amber-400 to-orange-500',
                                                    ].map((gradient, index) => (
                                                        <span
                                                            key={gradient}
                                                            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br text-[10px] font-bold text-white ${gradient}`}
                                                        >
                                                            {['A', 'R', 'S'][index]}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-900">Kreator aktif</p>
                                                    <p className="text-[11px] text-slate-500">Bergabung bulan ini</p>
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-600">
                                                +128
                                            </span>
                                        </div>

                                        <div className="mt-4 flex h-14 items-end gap-1.5">
                                            {chartBars.map((height, index) => (
                                                <span
                                                    key={index}
                                                    className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-600 to-emerald-400"
                                                    style={{ height: `${height}%` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-10 -right-3 hidden items-center gap-2 rounded-2xl border border-white bg-white px-3 py-2 shadow-xl shadow-indigo-100/70 sm:flex lg:-right-6">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <div>
                                <p className="text-sm leading-none font-bold text-slate-900">4.9</p>
                                <p className="mt-1 text-[10px] text-slate-500">Rating pembeli</p>
                            </div>
                        </div>

                        <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-2xl border border-white bg-white px-3 py-2 shadow-xl shadow-emerald-100/70 sm:flex lg:-left-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm leading-none font-bold text-slate-900">1.2k+</p>
                                <p className="mt-1 text-[10px] text-slate-500">Kreator bergabung</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
