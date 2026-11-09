import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
    backgroundColor?: string;
    textColor?: string;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    backgroundColor = 'bg-gradient-to-br from-blue-50 to-blue-100',
    textColor = 'text-blue-600',
}: StatCardProps) {
    return (
        <div className={`${backgroundColor} border-border rounded-2xl border p-6`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-muted-foreground mb-2 text-sm font-medium">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
                        {trend && (
                            <div
                                className={`flex items-center gap-1 text-sm font-semibold ${
                                    trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {trend.direction === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {trend.value}%
                            </div>
                        )}
                    </div>
                    {subtitle && <p className="text-muted-foreground mt-2 text-xs">{subtitle}</p>}
                </div>
                {icon && <div className={`${textColor} opacity-70`}>{icon}</div>}
            </div>
        </div>
    );
}
