import LandingLayout from '@/layouts/landing-layout'
import PublicNavbar from '@/components/layout/public-navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { CategoriesSection } from '@/components/landing/categories-section'
import { TrendingProducts } from '@/components/landing/trending-products'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { WhyKreava } from '@/components/landing/why-kreava'
import { Testimonials } from '@/components/landing/testimonials'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

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
        <PublicNavbar variant="landing" />
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
