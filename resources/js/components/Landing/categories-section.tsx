'use client'

import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    title: 'UI Kits',
    description: 'Complete design systems and component libraries',
    gradient: 'from-primary to-accent',
    icon: '🎨'
  },
  {
    title: 'Templates',
    description: 'Figma, WordPress, and web app templates',
    gradient: 'from-accent to-primary',
    icon: '📐'
  },
  {
    title: 'Source Code',
    description: 'Ready-to-use code snippets and frameworks',
    gradient: 'from-primary via-accent to-primary',
    icon: '💻'
  },
  {
    title: 'Ebooks',
    description: 'Educational guides and digital books',
    gradient: 'from-accent via-primary to-accent',
    icon: '📚'
  },
  {
    title: 'Icons',
    description: 'Icon packs and vector asset libraries',
    gradient: 'from-primary to-accent',
    icon: '✨'
  },
  {
    title: 'Design Assets',
    description: 'Brushes, textures, and design resources',
    gradient: 'from-accent to-primary',
    icon: '🎭'
  }
]

export function CategoriesSection() {
  return (
    <section id="categories" className="py-20 md:py-28 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Featured Categories</h2>
          <p className="text-lg text-foreground/60">
            Explore diverse categories of digital products and find the perfect marketplace for your creative work.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.title}
              className="group relative overflow-hidden p-6 cursor-pointer transition-all hover:shadow-lg border border-border hover:border-primary/30"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-4xl mb-4">{category.icon}</div>

                {/* Title & Description */}
                <h3 className="text-xl font-semibold text-foreground mb-2">{category.title}</h3>
                <p className="text-foreground/60 text-sm mb-6">{category.description}</p>

                {/* Explore Link */}
                <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 gap-1 transition-all">
                  Explore
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
