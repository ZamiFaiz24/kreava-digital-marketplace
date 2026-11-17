import { Link } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GreetingStripProps {
    sellerName: string;
}

export default function GreetingStrip({ sellerName }: GreetingStripProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t('dashboard.hero.title', { name: sellerName })}</h1>
                <p className="mt-1 text-sm text-slate-500">{t('dashboard.hero.subtitle')}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Link
                    href={route('seller.products.new')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors"
                >
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    {t('dashboard.hero.upload_product')}
                </Link>
                <Link
                    href={route('seller.analytics')}
                    className="inline-flex h-9 items-center rounded-lg border border-slate-200/70 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                    {t('dashboard.hero.view_analytics')}
                </Link>
            </div>
        </div>
    );
}
