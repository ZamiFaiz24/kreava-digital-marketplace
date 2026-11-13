import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { supportedLanguages, type SupportedLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
    className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const { i18n, t } = useTranslation();
    const currentLanguage: SupportedLanguage = i18n.resolvedLanguage === 'id' ? 'id' : 'en';

    return (
        <div
            role="group"
            aria-label={t('common.language.label')}
            className={cn('border-border bg-background/80 inline-flex items-center gap-0.5 rounded-lg border p-0.5', className)}
        >
            <Globe className="text-muted-foreground ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
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
                        currentLanguage === language ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {language}
                </button>
            ))}
        </div>
    );
}
