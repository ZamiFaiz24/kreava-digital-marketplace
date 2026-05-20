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

export default function LandingPage() {
  return (
    <LandingLayout title="KREAVA - Create. Sell. Inspire.">
      <main className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <CategoriesSection />
        <TrendingProducts />
        <DashboardPreview />
        <WhyKreava />
        <Testimonials />
        <CTASection />
        <Footer />
      </main>
    </LandingLayout>
  )
}
