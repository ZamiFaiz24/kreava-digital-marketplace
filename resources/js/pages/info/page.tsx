import { Link } from '@inertiajs/react';
import { ArrowRight, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Footer } from '@/components/landing/footer';
import PublicNavbar from '@/components/layout/public-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LandingLayout from '@/layouts/landing-layout';

interface InfoSection {
    id: string;
    title: string;
    body: string;
}

interface InfoPage {
    slug: string;
    eyebrow: string;
    title: string;
    description: string;
    sections: InfoSection[];
}

export default function InfoPage({ page }: { page: InfoPage }) {
    const { t } = useTranslation();

    return (
        <LandingLayout title={`${page.title} - KREAVA`}>
            <main className="bg-background min-h-screen">
                <PublicNavbar variant="landing" />

                <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-indigo-50/80 via-white to-emerald-50/60 py-16 md:py-24">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
                        <div className="absolute top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-100/50 blur-3xl" />
                    </div>

                    <div className="relative z-10 container mx-auto px-4">
                        <div className="max-w-3xl">
                            <Badge className="mb-5 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
                                {page.eyebrow}
                            </Badge>
                            <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-slate-950 sm:text-5xl">{page.title}</h1>
                            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{page.description}</p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-12 rounded-xl bg-indigo-600 px-7 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                                >
                                    <Link href={route('marketplace')}>
                                        {t('common.nav.browse_marketplace')}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="h-12 rounded-xl border-slate-200 bg-white/80 px-7 text-base font-semibold text-slate-700 hover:bg-white"
                                >
                                    <Link href={`${route('company')}#contact`}>{t('landing.footer.links.contact')}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-14 md:py-20">
                    <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">{page.eyebrow}</p>
                                <nav className="space-y-1">
                                    {page.sections.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                                        >
                                            {section.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        <div className="space-y-5">
                            {page.sections.map((section) => (
                                <Card
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-28 gap-3 border-slate-200/80 bg-white p-6 shadow-sm md:p-8"
                                >
                                    <h2 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">{section.title}</h2>
                                    <p className="text-sm leading-7 text-slate-600 md:text-base">{section.body}</p>
                                </Card>
                            ))}

                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 md:flex md:items-center md:justify-between md:gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-emerald-900">{t('landing.footer.links.contact')}</p>
                                    <p className="mt-1 text-sm text-emerald-800/80">hello@kreava.com</p>
                                </div>
                                <Button
                                    asChild
                                    className="mt-4 rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-600 md:mt-0"
                                >
                                    <Link href={`${route('company')}#contact`}>
                                        {t('landing.footer.links.contact')}
                                        <Mail className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </LandingLayout>
    );
}
