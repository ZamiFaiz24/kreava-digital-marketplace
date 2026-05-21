'use client'

import { useState } from 'react'
import { Download, Share2, Heart } from 'lucide-react'
import type { ProductDetailPageProps } from '@/types/marketplace'
import CreatorInfoCard from '@/components/shared/creator-info-card'
import ProductGallery from '@/components/marketplace/product-gallery'
import ReviewsSection from '@/components/marketplace/reviews-section'
import RelatedProducts from '@/components/marketplace/related-products'
import { formatPrice, formatDate } from '@/lib/marketplace-utils'

export default function ProductDetailScreen({
  product,
  reviews = [],
  rating_breakdown = {
    five_star: 0,
    four_star: 0,
    three_star: 0,
    two_star: 0,
    one_star: 0,
  },
  related_products = [],
  is_following = false,
}: ProductDetailPageProps) {
  const [isFollowing, setIsFollowing] = useState(is_following)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: product.thumbnail, alt: product.title }]
  const categoryName = typeof product.category === 'string' ? product.category : product.category.name
  const categorySlug = typeof product.category === 'string' ? product.category : product.category.slug

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/marketplace" className="text-primary hover:underline">
              Marketplace
            </a>
            <span className="text-muted-foreground">/</span>
            <a href={`/marketplace?category=${categorySlug}`} className="text-primary hover:underline">
              {categoryName}
            </a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-2">
            <ProductGallery images={images} title={product.title} />
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            {/* Title & Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Added {formatDate(product.created_at || '')}
              </p>
              {product.downloads_count !== undefined && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.downloads_count.toLocaleString('en-US')} downloads
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">{product.rating.toFixed(1)}</span>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.reviews_count} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-6">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
              {product.old_price && (
                <p className="mt-1 text-sm line-through text-muted-foreground">
                  {formatPrice(product.old_price)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                <Download className="h-5 w-5" />
                Buy & Download
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWishlist}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                    isWishlisted
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">Wishlist</span>
                </button>

                <button className="flex items-center justify-center gap-2 rounded-lg border border-input px-4 py-2 hover:border-primary hover:bg-primary/5">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>

            {/* Creator Info */}
            <CreatorInfoCard
              creator={product.seller}
              isFollowing={isFollowing}
              onFollowClick={handleFollow}
              showBio={true}
            />
          </div>
        </div>

        {/* Description Section */}
        {product.long_description && (
          <div className="mt-12 space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold text-foreground">Description</h2>
            <div
              className="prose prose-sm max-w-none text-foreground dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: product.long_description }}
            />
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 || product.reviews_count > 0 ? (
          <div className="mt-12">
            <ReviewsSection
              reviews={reviews}
              rating={product.rating}
              ratingBreakdown={rating_breakdown}
            />
          </div>
        ) : null}

        {/* Related Products */}
        {related_products.length > 0 && (
          <div className="mt-12">
            <RelatedProducts products={related_products} />
          </div>
        )}
      </div>
    </div>
  )
}