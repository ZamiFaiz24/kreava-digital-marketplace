'use client'

import { Card } from '@/components/ui/card'
import { Zap, Users, Rocket, BarChart3, Shield, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Sell Digital Products Easily',
    description: 'Simple setup process with no coding required. Start selling in minutes with our intuitive platform.'
  },
  {
    icon: Users,
    title: 'Multi-Vendor Platform',
    description: 'Join thousands of creators selling on the same marketplace with built-in audience and discovery.'
  },
  {
    icon: Rocket,
    title: 'Instant Downloads',
    description: 'Automatic instant delivery of digital products to customers with zero friction.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time insights into your sales, revenue, customer behavior, and product performance.'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with SSL encryption, secure payments, and fraud protection.'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Sell to customers worldwide with multi-currency support and international payment methods.'
  }
]

export function WhyKreava() {
  return (
    <section className="py-20 md:py-28 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Why Choose KREAVA?
          </h2>
          <p className="text-lg text-foreground/60">
            We&apos;re built specifically for digital creators who want to monetize their work and build a sustainable business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all hover:bg-muted/30"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:from-primary/40 group-hover:to-accent/40 transition-all">
                  <Icon className="text-primary" size={24} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-border">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</p>
            <p className="text-foreground/60">Active Creators</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-accent mb-2">$5M+</p>
            <p className="text-foreground/60">Total Earnings</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-primary mb-2">500K+</p>
            <p className="text-foreground/60">Products Sold</p>
          </div>
        </div>
      </div>
    </section>
  )
}
