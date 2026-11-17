import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { supportedLanguages, type SupportedLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
    className?: string;
    variant?: 'default' | 'dashboard';
}

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
    const { i18n, t } = useTranslation();
    const currentLanguage: SupportedLanguage = i18n.resolvedLanguage === 'id' ? 'id' : 'en';
    const isDashboard = variant === 'dashboard';

    return (
        <div
            role="group"
            aria-label={t('common.language.label')}
            className={cn(
                'inline-flex items-center gap-0.5 rounded-lg p-0.5',
                isDashboard ? 'bg-slate-100' : 'border-border bg-background/80 border',
                className,
            )}
        >
            {!isDashboard && <Globe className="text-muted-foreground ml-1.5 h-3.5 w-3.5" aria-hidden="true" />}
            {supportedLanguages.map((language) => (
                <button
                    key={language}
                    type="button"
                    title={t(`common.language.${language}`)}
                    aria-pressed={currentLanguage === language}
                    onClick={() => {
                        void i18n.changeLanguage(language);
                    }}
                    className={cn(
                        'rounded-md px-2 py-1 text-[11px] font-semibold uppercase transition-colors',
                        currentLanguage === language
                            ? isDashboard
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'bg-primary text-primary-foreground'
                            : isDashboard
                              ? 'text-slate-500 hover:text-slate-700'
                              : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {language}
                </button>
            ))}
        </div>
    );
}
