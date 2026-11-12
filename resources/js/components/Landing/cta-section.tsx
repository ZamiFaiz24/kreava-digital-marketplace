import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

const highlights = ['Gratis untuk mulai', 'Pencairan cepat', 'Dukungan kreator 24/7'];

export function CTASection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-16 md:py-24">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 -left-20 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
                <div className="absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-3xl" />
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-indigo-950/40 backdrop-blur md:p-14">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-emerald-500/20">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Siap menjadi kreator?</h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                        Bergabung dengan ribuan kreator yang sudah menjual karya digital mereka di Kreava. Mulai tanpa biaya, tanpa ribet.
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-300">
                        {highlights.map((highlight) => (
                            <span key={highlight} className="inline-flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                {highlight}
                            </span>
                        ))}
                    </div>

                    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 rounded-xl bg-emerald-500 px-7 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
                        >
                            <Link href={route('register', { role: 'seller' })}>
                                Daftar sebagai Seller
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-12 rounded-xl border-white/20 bg-white/5 px-7 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
                        >
                            <Link href={route('marketplace')}>Telusuri Produk</Link>
                        </Button>
                    </div>

                    <p className="mt-7 text-xs text-slate-400">Tanpa kartu kredit • Setup 5 menit • Mulai hasilkan pendapatan</p>
                </div>
            </div>
        </section>
    );
}
