import { Star } from 'lucide-react'
import type { Review, RatingBreakdown } from '@/types/marketplace'
import { formatRelativeDate, generateStars } from '@/lib/marketplace-utils'

interface ReviewsSectionProps {
  reviews: Review[]
  rating: number
  ratingBreakdown: RatingBreakdown
}

export default function ReviewsSection({
  reviews,
  rating,
  ratingBreakdown,
}: ReviewsSectionProps) {
  const totalReviews = Object.values(ratingBreakdown).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Ulasan Pelanggan</h2>

      {/* Rating Summary */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-start gap-6">
          <div>
            <div className="text-5xl font-bold text-foreground">{rating.toFixed(1)}</div>
            <div className="mt-2 flex gap-1">
              {generateStars(rating).map((star, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    star === 1
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Berdasarkan {totalReviews} ulasan</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingBreakdown[`${stars}_star` as keyof RatingBreakdown] || 0
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{stars} bintang</span>
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const reviewStars = generateStars(review.rating)

            return (
              <div key={review.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  {review.avatar && (
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">{review.author}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(review.created_at)}
                      </span>
                    </div>

                    <div className="mt-1 flex gap-0.5">
                      {reviewStars.map((star, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            star === 1
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-2 text-sm text-foreground">{review.comment}</p>

                    {review.helpful_count && review.helpful_count > 0 && (
                      <div className="mt-3">
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          Membantu ({review.helpful_count})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Belum ada ulasan</p>
        </div>
      )}
    </div>
  )
}
