'use client'

import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

type LandingTestimonial = {
  name: string
  role: string
  content: string
  avatar: string
  rating: number
}

const fallbackTestimonials: LandingTestimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'UI/UX Designer',
    content: 'KREAVA has been a game-changer for my design business. I went from freelancing to selling UI kits and now earn $8k+ monthly.',
    avatar: '👩‍💼',
    rating: 5
  },
  {
    name: 'Marcus Johnson',
    role: 'Full Stack Developer',
    content: 'The marketplace is incredibly intuitive. I sold my first React component library within a week. The platform handles everything.',
    avatar: '👨‍💻',
    rating: 5
  },
  {
    name: 'Elena Rodriguez',
    role: 'Illustration Artist',
    content: 'I was skeptical about selling digital assets, but KREAVA made it so easy. Now my icon packs are my primary income stream.',
    avatar: '👩‍🎨',
    rating: 5
  },
  {
    name: 'James Wilson',
    role: 'Content Creator',
    content: 'The analytics dashboard is fantastic. I can see exactly what&apos;s working and optimize my products accordingly. Highly recommend!',
    avatar: '👨‍🏫',
    rating: 5
  },
  {
    name: 'Lisa Park',
    role: 'Design System Lead',
    content: 'Our team uses KREAVA to sell design system licenses. The payment processing is seamless and customer support is exceptional.',
    avatar: '👩‍💼',
    rating: 5
  },
  {
    name: 'Tom Bradley',
    role: 'SaaS Founder',
    content: 'We use KREAVA for our template marketplace. The automatic delivery and analytics integration saved us months of development.',
    avatar: '👨‍💼',
    rating: 5
  }
]

export function Testimonials({ testimonials = fallbackTestimonials }: { testimonials?: LandingTestimonial[] }) {
  return (
    <section className="py-20 md:py-28 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Loved by Creators
          </h2>
          <p className="text-lg text-foreground/60">
            Join thousands of successful creators who are making sustainable income from their digital products.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={`${testimonial.name}-${index}`}
              className="p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all group"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 mb-6 leading-relaxed text-sm">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="text-2xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-foreground/60">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
