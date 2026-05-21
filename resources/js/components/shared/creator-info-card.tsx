import { Star, MapPin } from 'lucide-react'
import type { Creator } from '@/types/marketplace'
import { formatNumber } from '@/lib/marketplace-utils'

interface CreatorInfoCardProps {
  creator: Creator
  isFollowing?: boolean
  onFollowClick?: () => void
  showBio?: boolean
}

export default function CreatorInfoCard({
  creator,
  isFollowing = false,
  onFollowClick,
  showBio = true,
}: CreatorInfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        {creator.avatar && (
          <img
            src={creator.avatar}
            alt={creator.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        )}

        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">{creator.name}</h3>
          {creator.bio && showBio && (
            <p className="mt-1 text-sm text-muted-foreground">{creator.bio}</p>
          )}

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Produk</p>
              <p className="font-semibold text-foreground">{creator.products_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pengikut</p>
              <p className="font-semibold text-foreground">
                {formatNumber(creator.followers_count || 0)}
              </p>
            </div>
            {creator.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-foreground">{creator.rating}</span>
              </div>
            )}
          </div>
        </div>

        {onFollowClick && (
          <button
            onClick={onFollowClick}
            className={`flex-shrink-0 rounded-lg px-4 py-2 font-medium transition-colors ${
              isFollowing
                ? 'border border-primary bg-background text-primary hover:bg-primary/5'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isFollowing ? 'Mengikuti' : 'Ikuti'}
          </button>
        )}
      </div>

      {/* Social Links */}
      {(creator.website || creator.twitter || creator.instagram) && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex gap-3">
            {creator.website && (
              <a
                href={creator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Website
              </a>
            )}
            {creator.twitter && (
              <a
                href={`https://twitter.com/${creator.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Twitter
              </a>
            )}
            {creator.instagram && (
              <a
                href={`https://instagram.com/${creator.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
