import { BarChart3, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WelcomeBannerProps {
    sellerName: string;
    totalRevenue: number;
    monthlyGrowth: number;
}

export default function WelcomeBanner({ sellerName, totalRevenue, monthlyGrowth }: WelcomeBannerProps) {
    const { t } = useTranslation();

    return (
        <div className="from-primary via-accent to-primary/80 relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r p-8 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative z-10">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <p className="mb-1 text-sm font-medium text-white/90">{t('dashboard.welcome')}</p>
                        <h1 className="text-3xl font-bold sm:text-4xl">{t('dashboard.greeting', { name: sellerName })}</h1>
                    </div>
                    <BarChart3 className="h-8 w-8 text-white/80" />
                </div>

                <p className="mb-6 text-white/80">{t('dashboard.overview')}</p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Revenue Card */}
                    <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                        <p className="mb-2 text-sm font-medium text-white/70">{t('dashboard.revenue_this_month')}</p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-2xl font-bold text-white sm:text-3xl">
                                ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </p>
                            <div className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-green-100">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm font-semibold">{monthlyGrowth}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Insights */}
                    <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                        <p className="mb-2 text-sm font-medium text-white/70">{t('dashboard.quick_insights')}</p>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li>{t('dashboard.insight_orders')}</li>
                            <li>{t('dashboard.insight_reviews')}</li>
                            <li>{t('dashboard.insight_payout')}</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button className="text-primary rounded-lg bg-white px-6 py-2 font-semibold transition-colors hover:bg-white/90">
                        {t('dashboard.upload_product')}
                    </button>
                    <button className="rounded-lg border border-white/30 bg-white/20 px-6 py-2 font-semibold text-white transition-colors hover:bg-white/30">
                        {t('dashboard.view_analytics')}
                    </button>
                </div>
            </div>
        </div>
    );
}
