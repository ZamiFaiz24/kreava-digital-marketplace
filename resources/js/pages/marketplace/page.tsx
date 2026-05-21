import MarketplaceScreen from '@/components/screens/marketplace/marketplace-screen'
import LandingLayout from '@/layouts/landing-layout'
import type { MarketplacePageProps } from '@/types/marketplace'

export default function MarketplaceLandingPage(props: MarketplacePageProps) {
  return (
    <LandingLayout title="Marketplace - KREAVA">
      <MarketplaceScreen {...props} />
    </LandingLayout>
  )
}