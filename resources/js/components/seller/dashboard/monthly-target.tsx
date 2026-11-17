import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface MonthlyTargetProps {
    revenue: number;
    target: number;
}

const RADIUS = 52;

function formatCurrency(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function MonthlyTarget({ revenue, target }: MonthlyTargetProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US';
    const hasTarget = target > 0;
    const percentage = hasTarget ? (revenue / target) * 100 : 0;
    const clampedPercentage = Math.min(100, Math.max(0, percentage));
    const circumference = 2 * Math.PI * RADIUS;
    const dashOffset = circumference - (clampedPercentage / 100) * circumference;

    return (
        <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">{t('dashboard.target.title')}</h2>

            <div className="mt-4 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                    <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90" aria-hidden="true">
                        <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth="10" />
                        <circle
                            cx="70"
                            cy="70"
                            r={RADIUS}
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            className="transition-[stroke-dashoffset] duration-700 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-semibold text-slate-900 tabular-nums">{Math.round(percentage)}%</span>
                    </div>
                </div>

                {hasTarget ? (
                    <p className="mt-3 text-center text-sm text-slate-500">
                        {t('dashboard.target.caption', { target: formatCurrency(target, locale) })}
                    </p>
                ) : (
                    <div className="mt-3 text-center">
                        <p className="text-sm text-slate-500">{t('dashboard.target.no_target')}</p>
                        <Link href={route('seller.settings')} className="text-primary mt-1 inline-block text-sm font-medium hover:underline">
                            {t('dashboard.target.set_target')}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
