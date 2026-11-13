import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    className?: string;
}

export default function SearchInput({ placeholder, value = '', onChange, onSubmit, className = '' }: SearchInputProps) {
    const { t } = useTranslation();
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSubmit) {
            onSubmit(e.currentTarget.value);
        }
    };

    return (
        <div className={`relative w-full ${className}`}>
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <input
                type="text"
                placeholder={placeholder ?? t('marketplace.search.placeholder')}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-input bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-3 pr-4 pl-12 focus:ring-2 focus:outline-none"
            />
        </div>
    );
}
