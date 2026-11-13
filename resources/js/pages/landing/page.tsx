import { useTranslation } from 'react-i18next';

import { CategoriesSection } from '@/components/landing/categories-section';
import { CTASection } from '@/components/landing/cta-section';
import { DashboardPreview } from '@/components/landing/dashboard-preview';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { PlatformStatsSection } from '@/components/landing/platform-stats';
import { Testimonials } from '@/components/landing/testimonials';
import { TrendingProducts } from '@/components/landing/trending-products';
import { WhyKreava } from '@/components/landing/why-kreava';
import PublicNavbar from '@/components/layout/public-navbar';
import LandingLayout from '@/layouts/landing-layout';
import type { LandingCategory, LandingProduct, LandingTestimonial, PlatformStats } from '@/types/landing';

interface LandingPageProps {
    categories?: LandingCategory[];
    stats?: PlatformStats;
    trendingProducts?: LandingProduct[];
    testimonials?: LandingTestimonial[];
}

const emptyStats: PlatformStats = {
    products: 0,
    creators: 0,
    transactions: 0,
    average_rating: 0,
};

export default function LandingPage({ categories, stats = emptyStats, trendingProducts, testimonials }: LandingPageProps) {
    const { t } = useTranslation();

    return (
        <LandingLayout title={t('landing.meta.title')}>
            <main className="bg-background min-h-screen">
                <PublicNavbar variant="landing" categories={categories} />
                <HeroSection />
                <PlatformStatsSection stats={stats} />
                <CategoriesSection categories={categories} />
                <TrendingProducts products={trendingProducts} />
                <DashboardPreview />
                <WhyKreava />
                <Testimonials testimonials={testimonials} />
                <CTASection />
                <Footer />
            </main>
        </LandingLayout>
    );
}
