'use client';

import { BarChart3, Globe, Rocket, Shield, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';

const features = [
    {
        icon: Zap,
        titleKey: 'landing.why.features.easy_selling.title',
        descriptionKey: 'landing.why.features.easy_selling.description',
    },
    {
        icon: Users,
        titleKey: 'landing.why.features.multi_vendor.title',
        descriptionKey: 'landing.why.features.multi_vendor.description',
    },
    {
        icon: Rocket,
        titleKey: 'landing.why.features.instant_downloads.title',
        descriptionKey: 'landing.why.features.instant_downloads.description',
    },
    {
        icon: BarChart3,
        titleKey: 'landing.why.features.analytics.title',
        descriptionKey: 'landing.why.features.analytics.description',
    },
    {
        icon: Shield,
        titleKey: 'landing.why.features.secure.title',
        descriptionKey: 'landing.why.features.secure.description',
    },
    {
        icon: Globe,
        titleKey: 'landing.why.features.global.title',
        descriptionKey: 'landing.why.features.global.description',
    },
];

const trustStats = [
    { value: '50K+', labelKey: 'landing.why.stats.active_creators', color: 'text-primary' },
    { value: '$5M+', labelKey: 'landing.why.stats.total_earnings', color: 'text-accent' },
    { value: '500K+', labelKey: 'landing.why.stats.products_sold', color: 'text-primary' },
];

export function WhyKreava() {
    const { t } = useTranslation();

    return (
        <section className="bg-background relative py-20 md:py-28">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl">{t('landing.why.title')}</h2>
                    <p className="text-foreground/60 text-lg">{t('landing.why.subtitle')}</p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={feature.titleKey}
                                className="group border-border hover:border-primary/30 hover:bg-muted/30 border p-6 transition-all hover:shadow-lg"
                            >
                                {/* Icon */}
                                <div className="from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br transition-all">
                                    <Icon className="text-primary" size={24} />
                                </div>

                                {/* Content */}
                                <h3 className="text-foreground mb-3 text-lg font-semibold">{t(feature.titleKey)}</h3>
                                <p className="text-foreground/60 text-sm leading-relaxed">{t(feature.descriptionKey)}</p>
                            </Card>
                        );
                    })}
                </div>

                {/* Trust Stats */}
                <div className="border-border mt-20 grid grid-cols-1 gap-8 border-t pt-20 md:grid-cols-3">
                    {trustStats.map((stat) => (
                        <div key={stat.labelKey} className="text-center">
                            <p className={`mb-2 text-4xl font-bold md:text-5xl ${stat.color}`}>{stat.value}</p>
                            <p className="text-foreground/60">{t(stat.labelKey)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
