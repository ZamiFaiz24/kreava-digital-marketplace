import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Sparkles, Star, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HeroSlideshow } from '@/components/landing/hero-slideshow';

const perkKeys = ['landing.hero.perks.no_fees', 'landing.hero.perks.secure_payment', 'landing.hero.perks.instant_download'];

const chartBars = [38, 58, 46, 72, 62, 88, 76];

export function HeroSection() {
    const { t } = useTranslation();

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
                            {t('landing.hero.badge')}
                        </Badge>

                        <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            {t('landing.hero.title_prefix')}
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
                                {t('landing.hero.title_highlight')}
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">{t('landing.hero.subtitle')}</p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="h-12 rounded-xl bg-emerald-500 px-7 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
                            >
                                <Link href={route('register', { role: 'seller' })}>
                                    {t('landing.hero.start_selling')}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                className="h-12 rounded-xl bg-indigo-600 px-7 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                            >
                                <Link href={route('marketplace')}>{t('landing.hero.browse_products')}</Link>
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                            {perkKeys.map((perkKey) => (
                                <span key={perkKey} className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    {t(perkKey)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/60 via-indigo-50 to-emerald-200/60 blur-2xl"
                            aria-hidden="true"
                        />

                        <HeroSlideshow />

                        <div className="absolute top-10 -right-3 hidden items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/90 px-3 py-2 shadow-xl shadow-indigo-900/30 backdrop-blur sm:flex lg:-right-6"
                            aria-hidden="true"
                        >
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <div>
                                <p className="text-sm leading-none font-bold text-white">4.9</p>
                                <p className="mt-1 text-[10px] text-slate-400">{t('landing.hero.preview.buyer_rating')}</p>
                            </div>
                        </div>

                        <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/90 px-3 py-2 shadow-xl shadow-emerald-900/30 backdrop-blur sm:flex lg:-left-6"
                            aria-hidden="true"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-400">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm leading-none font-bold text-white">1.2k+</p>
                                <p className="mt-1 text-[10px] text-slate-400">{t('landing.hero.preview.creators_joined')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
