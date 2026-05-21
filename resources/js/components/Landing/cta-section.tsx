'use client'

import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 md:p-16 text-center backdrop-blur-xl">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6">
            <Zap className="text-primary-foreground" size={32} />
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to Start Selling?
          </h2>

          {/* Subheading */}
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            Join thousands of creators earning sustainable income from their digital products. Get started in minutes with no setup fees or hidden charges.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: '0% Setup Fees', description: 'Start selling immediately' },
              { label: 'Fast Payouts', description: 'Weekly to your account' },
              { label: '24/7 Support', description: 'We&apos;re here to help' }
            ].map((highlight) => (
              <div key={highlight.label} className="bg-background/50 rounded-lg p-4">
                <p className="font-semibold text-foreground mb-1">{highlight.label}</p>
                <p className="text-sm text-foreground/60">{highlight.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base group" size="lg">
              <Link href={route('marketplace')}>
                Become a Creator
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/5 px-8 h-12 text-base"
              size="lg"
            >
              <Link href={route('marketplace')}>Browse Products</Link>
            </Button>
          </div>

          {/* Small Text */}
          <p className="text-xs text-foreground/50 mt-8">
            No credit card required • Setup takes 5 minutes • Start earning immediately
          </p>
        </div>
      </div>
    </section>
  )
}
