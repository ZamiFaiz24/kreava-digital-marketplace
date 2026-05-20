'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, ShoppingBag, Download, Clock } from 'lucide-react'

const stats = [
  {
    label: 'Total Revenue',
    value: '$12,450',
    change: '+12.5%',
    icon: TrendingUp,
    color: 'text-primary'
  },
  {
    label: 'Total Sales',
    value: '324',
    change: '+8.2%',
    icon: ShoppingBag,
    color: 'text-accent'
  },
  {
    label: 'Downloads',
    value: '1,200',
    change: '+15.3%',
    icon: Download,
    color: 'text-primary'
  },
  {
    label: 'Avg. Response',
    value: '2.4hrs',
    change: '-5.1%',
    icon: Clock,
    color: 'text-accent'
  }
]

export function DashboardPreview() {
  return (
    <section className="py-20 md:py-28 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Creator Dashboard
          </h2>
          <p className="text-lg text-foreground/60">
            Track your sales, revenue, and product performance in real-time with our powerful analytics dashboard.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/20 p-1 backdrop-blur-xl">
          <Card className="overflow-hidden border-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border p-6">
              <h3 className="text-xl font-semibold text-foreground">Dashboard Overview</h3>
              <p className="text-sm text-foreground/60">May 2024</p>
            </div>

            {/* Stats Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="bg-muted/50 rounded-lg p-6 border border-border">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <Icon className={`${stat.color} opacity-60`} size={24} />
                      </div>
                      <p className="text-xs text-primary font-medium">{stat.change} from last month</p>
                    </div>
                  )
                })}
              </div>

              {/* Charts Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Revenue Trend</h4>
                  <div className="h-48 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-end justify-around p-4">
                    {[40, 65, 45, 75, 55, 85, 60].map((height, i) => (
                      <div key={i} className="flex-1 mx-1 bg-gradient-to-t from-primary to-accent rounded-t h-full" style={{ maxHeight: '100%', height: `${height}%` }} />
                    ))}
                  </div>
                </div>

                {/* Sales Distribution */}
                <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Sales by Category</h4>
                  <div className="flex items-center justify-center h-48 gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent opacity-70" />
                      <p className="text-xs text-foreground/60 mt-2">UI Kits (35%)</p>
                    </div>
                    <div>
                      <div className="mb-3">
                        <p className="text-xs text-foreground/60 mb-1">Templates</p>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-accent" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-foreground/60 mb-1">Source Code</p>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-1/2 h-full bg-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Ebooks</p>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="mt-6 bg-muted/30 rounded-lg p-6 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-4">Recent Orders</h4>
                <div className="space-y-3">
                  {[
                    { order: 'UI Kit Pro Pack', date: '2 hours ago', amount: '$49' },
                    { order: 'Web Template Bundle', date: '5 hours ago', amount: '$39' },
                    { order: 'React Components', date: '1 day ago', amount: '$29' },
                  ].map((item) => (
                    <div key={item.order} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.order}</p>
                        <p className="text-xs text-foreground/60">{item.date}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
