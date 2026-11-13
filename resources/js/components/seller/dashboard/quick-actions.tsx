import { ArrowRight, BarChart3, Globe, Package, Settings } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ActionItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    color: string;
}

export default function QuickActions() {
    const { t } = useTranslation();

    const actions: ActionItem[] = [
        {
            icon: <Package className="h-6 w-6" />,
            title: t('dashboard.quick_actions.upload_product'),
            description: t('dashboard.quick_actions.upload_product_description'),
            href: '/seller/products/new',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <Globe className="h-6 w-6" />,
            title: t('dashboard.quick_actions.view_marketplace'),
            description: t('dashboard.quick_actions.view_marketplace_description'),
            href: '/marketplace',
            color: 'from-emerald-500 to-teal-500',
        },
        {
            icon: <Settings className="h-6 w-6" />,
            title: t('dashboard.quick_actions.edit_store'),
            description: t('dashboard.quick_actions.edit_store_description'),
            href: '/seller/settings',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: <BarChart3 className="h-6 w-6" />,
            title: t('dashboard.quick_actions.view_analytics'),
            description: t('dashboard.quick_actions.view_analytics_description'),
            href: '/seller/analytics',
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <div className="mb-8">
            <h2 className="text-foreground mb-6 text-xl font-bold">{t('dashboard.quick_actions.title')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {actions.map((action, index) => (
                    <a
                        key={index}
                        href={action.href}
                        className="border-border hover:border-primary group cursor-pointer rounded-2xl border bg-white p-6 transition-all hover:shadow-lg"
                    >
                        <div
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} text-white transition-transform group-hover:scale-110`}
                        >
                            {action.icon}
                        </div>
                        <h3 className="text-foreground group-hover:text-primary mb-1 font-bold transition-colors">{action.title}</h3>
                        <p className="text-muted-foreground mb-4 text-xs">{action.description}</p>
                        <div className="text-primary flex items-center gap-2 text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                            {t('dashboard.quick_actions.go')} <ArrowRight className="h-4 w-4" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
