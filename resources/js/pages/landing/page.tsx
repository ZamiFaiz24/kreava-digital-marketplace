import LandingLayout from '@/layouts/landing-layout'
import { Navbar } from '@/components/Landing/navbar'
import { HeroSection } from '@/components/Landing/hero-section'
import { CategoriesSection } from '@/components/Landing/categories-section'
import { TrendingProducts } from '@/components/Landing/trending-products'
import { DashboardPreview } from '@/components/Landing/dashboard-preview'
import { WhyKreava } from '@/components/Landing/why-kreava'
import { Testimonials } from '@/components/Landing/testimonials'
import { CTASection } from '@/components/Landing/cta-section'
import { Footer } from '@/components/Landing/footer'

type LandingCategory = {
  title: string
  description: string
  icon?: string
}

type LandingProduct = {
  title: string
  creator: string
  rating: number
  reviews: number
  price: string
  category: string
  gradient?: string
}

type LandingTestimonial = {
  name: string
  role: string
  content: string
  avatar: string
  rating: number
}

interface LandingPageProps {
  categories?: LandingCategory[]
  trendingProducts?: LandingProduct[]
  testimonials?: LandingTestimonial[]
}

export default function LandingPage({ categories, trendingProducts, testimonials }: LandingPageProps) {
  return (
    <LandingLayout title="KREAVA - Create. Sell. Inspire.">
      <main className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <CategoriesSection categories={categories} />
        <TrendingProducts products={trendingProducts} />
        <DashboardPreview />
        <WhyKreava />
        <Testimonials testimonials={testimonials} />
        <CTASection />
        <Footer />
      </main>
    </LandingLayout>
  )
}
