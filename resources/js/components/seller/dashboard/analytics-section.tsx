'use client';

import React, { useState } from 'react';
import { RevenueDataPoint } from '../../../types/seller';
import { Calendar } from 'lucide-react';

interface AnalyticsSectionProps {
  data: RevenueDataPoint[];
}

export default function AnalyticsSection({ data }: AnalyticsSectionProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-white rounded-2xl border border-border p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Revenue Analytics</h2>
          <p className="text-sm text-muted-foreground">Track your sales performance</p>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
              period === 'weekly'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
              period === 'monthly'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-6">
        {/* Chart */}
        <div className="flex items-end justify-between gap-2 h-64 bg-gradient-to-t from-primary/5 to-transparent rounded-lg p-6">
          {data.map((point) => (
            <div key={point.date} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex flex-col items-center gap-1">
                <div className="relative w-full h-48 flex items-end justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all hover:shadow-lg hover:scale-y-105 origin-bottom"
                    style={{
                      height: `${(point.revenue / maxRevenue) * 100}%`,
                    }}
                  >
                    <div className="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-white px-3 py-1 rounded text-xs font-semibold whitespace-nowrap">
                      ${point.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium text-muted-foreground">{point.date}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-foreground">
              ${data.reduce((sum, d) => sum + d.revenue, 0).toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg per Day</p>
            <p className="text-lg font-bold text-foreground">
              ${(data.reduce((sum, d) => sum + d.revenue, 0) / data.length).toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
            <p className="text-lg font-bold text-foreground">
              {data.reduce((sum, d) => sum + d.sales, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
