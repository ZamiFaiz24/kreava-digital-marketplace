'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-background">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Welcome to the creator economy</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-foreground">
            Create. <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sell</span>. Inspire.
          </h1>

          {/* Subheading */}
          <p className="text-xl text-foreground/60 mb-8 leading-relaxed max-w-2xl">
            Launch your digital products on the fastest-growing marketplace for creators. Sell UI kits, templates, source code, ebooks, icons, and design assets to a global audience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base group" size="lg">
              Start Selling Today
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition" />
            </Button>
            <Button 
              variant="outline" 
              className="border-primary/30 text-primary hover:bg-primary/5 px-8 h-12 text-base"
              size="lg"
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <p className="text-sm text-foreground/50">Trusted by creators worldwide</p>
            <div className="flex gap-4 flex-wrap">
              {['UI/UX Designer', 'Developer', 'Illustrator', 'Content Creator'].map((role) => (
                <div key={role} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent opacity-40" />
                  <span className="text-xs text-foreground/50">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Preview - Placeholder */}
        <div className="mt-20 relative">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-1 backdrop-blur-xl">
            <div className="bg-background rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
