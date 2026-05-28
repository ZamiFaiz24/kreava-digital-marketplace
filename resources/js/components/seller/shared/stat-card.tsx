import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
    <div className={`${backgroundColor} rounded-2xl p-6 border border-blue-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {trend.value}%
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        {icon && <div className="text-blue-400 opacity-80">{icon}</div>}
      </div>
    </div>
  );
}
