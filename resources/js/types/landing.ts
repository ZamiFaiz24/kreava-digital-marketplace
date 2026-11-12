export interface LandingCategory {
    slug: string;
    title: string;
    description: string;
    icon?: string | null;
    href: string;
    count?: number;
}

export interface LandingProduct {
    title: string;
    slug?: string;
    href?: string;
    thumbnail?: string | null;
    creator: string;
    rating: number;
    reviews: number;
    price: string;
    category: string;
    avatar?: string | null;
    gradient?: string;
}

export interface LandingTestimonial {
    name: string;
    role: string;
    content: string;
    avatar?: string | null;
    rating: number;
}

export interface PlatformStats {
    products: number;
    creators: number;
    transactions: number;
    average_rating: number;
}
