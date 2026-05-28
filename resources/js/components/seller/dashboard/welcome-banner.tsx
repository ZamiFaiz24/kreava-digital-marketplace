import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface WelcomeBannerProps {
  sellerName: string;
  totalRevenue: number;
  monthlyGrowth: number;
}

export default function WelcomeBanner({
  sellerName,
  totalRevenue,
  monthlyGrowth,
}: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary/80 rounded-2xl p-8 text-white mb-8 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/90 text-sm font-medium mb-1">Welcome back!</p>
            <h1 className="text-3xl sm:text-4xl font-bold">Hey, {sellerName}! 👋</h1>
          </div>
          <BarChart3 className="w-8 h-8 text-white/80" />
        </div>

        <p className="text-white/80 mb-6">
          You&apos;re doing great! Check your latest stats and manage your store below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Revenue Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm font-medium mb-2">This Month Revenue</p>
            <div className="flex items-baseline gap-3">
              <p className="text-2xl sm:text-3xl font-bold text-white">
                ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-1 bg-green-500/20 text-green-100 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">{monthlyGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm font-medium mb-2">Quick Insights</p>
            <ul className="space-y-2 text-white/90 text-sm">
              <li>✓ 12 new orders this week</li>
              <li>✓ 2 pending reviews to respond</li>
              <li>✓ Payout ready on May 30th</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
            Upload New Product
          </button>
          <button className="px-6 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors border border-white/30">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
