export interface Category {
  id: number
  name: string
  slug: string
  icon?: string | null
  count?: number
  products_count?: number
}

export interface Seller {
  id?: number
  name: string
  slug?: string
  avatar?: string | null
  bio?: string | null
  website?: string | null
  twitter?: string | null
  instagram?: string | null
  products_count?: number
  followers_count?: number
  rating?: number
  total_sales?: number
}

export interface ProductImage {
  id?: number
  url: string
  alt?: string
}

export interface Product {
  id: number
  slug: string
  title: string
  thumbnail: string
  price: number
  old_price?: number | null
  rating: number
  reviews_count: number
  trending?: boolean
  category: string | Category
  seller: Seller
  images?: ProductImage[]
  downloads_count?: number
  long_description?: string | null
  created_at?: string
}

export interface Review {
  id: number
  author: string
  avatar?: string | null
  rating: number
  comment: string
  created_at: string
  helpful_count?: number | null
}

export interface RatingBreakdown {
  five_star: number
  four_star: number
  three_star: number
  two_star: number
  one_star: number
}

export interface MarketplacePageProps {
  products?: Product[]
  categories?: Category[]
  pagination?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from: number
    to: number
  }
  filters?: {
    query?: string | null
    category?: string | null
    sort?: string | null
  }
}

export interface ProductDetailPageProps {
  product: Product
  reviews?: Review[]
  rating_breakdown?: RatingBreakdown
  related_products?: Product[]
  is_following?: boolean
}

export interface Creator {
  id?: number
  name: string
  slug?: string
  avatar?: string | null
  banner?: string | null
  bio?: string | null
  website?: string | null
  twitter?: string | null
  instagram?: string | null
  products_count?: number
  followers_count?: number
  rating?: number
  total_sales?: number
}

export interface CreatorProfilePageProps {
  creator: Creator
  featured_products?: Product[]
  all_products?: Product[]
  pagination?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from: number
    to: number
  }
  is_following?: boolean
}

export interface AuthPageProps {
  errors?: Record<string, string[]>
  old?: Record<string, unknown>
}