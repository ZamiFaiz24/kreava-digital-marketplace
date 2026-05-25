import MarketplaceScreen from '@/components/screens/marketplace/marketplace-screen'
import PublicLayout from '@/layouts/public-layout'
import type { MarketplacePageProps } from '@/types/marketplace'

export default function MarketplaceLandingPage(props: MarketplacePageProps) {
  return (
    <PublicLayout categories={props.categories}>
      <MarketplaceScreen {...props} />
    </PublicLayout>
  )
}