export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPriceSimple(value: number): string {
  return `$${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)}`
}

export function formatDate(value: string): string {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatRelativeDate(value: string): string {
  if (!value) return '-'

  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`

  return `${Math.floor(diffDays / 365)} years ago`
}

export function generateStars(rating: number): number[] {
  const stars: number[] = []

  for (let index = 1; index <= 5; index += 1) {
    if (rating >= index) {
      stars.push(1)
    } else if (rating >= index - 0.5) {
      stars.push(0.5)
    } else {
      stars.push(0)
    }
  }

  return stars
}
