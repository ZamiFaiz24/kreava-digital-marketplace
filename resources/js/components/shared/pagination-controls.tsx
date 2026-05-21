import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  current_page: number
  last_page: number
  total: number
  per_page: number
  onPageChange?: (page: number) => void
  href?: (page: number) => string
}

export default function PaginationControls({
  current_page,
  last_page,
  total,
  per_page,
  onPageChange,
  href = (page) => `?page=${page}`,
}: PaginationControlsProps) {
  const startItem = (current_page - 1) * per_page + 1
  const endItem = Math.min(current_page * per_page, total)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (last_page <= maxVisible) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (current_page > 3) {
        pages.push('...')
      }

      const start = Math.max(2, current_page - 1)
      const end = Math.min(last_page - 1, current_page + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (current_page < last_page - 2) {
        pages.push('...')
      }

      pages.push(last_page)
    }

    return pages
  }

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-4 py-6 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Menampilkan <span className="font-medium text-foreground">{startItem}</span> hingga{' '}
        <span className="font-medium text-foreground">{endItem}</span> dari{' '}
        <span className="font-medium text-foreground">{total}</span> produk
      </p>

      <div className="flex items-center gap-1">
        <a
          href={current_page > 1 ? href(current_page - 1) : '#'}
          onClick={(e) => {
            if (current_page <= 1) {
              e.preventDefault()
            } else {
              e.preventDefault()
              handlePageClick(current_page - 1)
            }
          }}
          className={`flex items-center justify-center rounded-lg border border-input p-2 transition-colors ${
            current_page <= 1
              ? 'cursor-not-allowed border-muted bg-muted text-muted-foreground'
              : 'hover:bg-muted'
          }`}
          aria-disabled={current_page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </a>

        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <a
              key={page}
              href={href(page as number)}
              onClick={(e) => {
                e.preventDefault()
                handlePageClick(page as number)
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                page === current_page
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-muted'
              }`}
            >
              {page}
            </a>
          )
        )}

        <a
          href={current_page < last_page ? href(current_page + 1) : '#'}
          onClick={(e) => {
            if (current_page >= last_page) {
              e.preventDefault()
            } else {
              e.preventDefault()
              handlePageClick(current_page + 1)
            }
          }}
          className={`flex items-center justify-center rounded-lg border border-input p-2 transition-colors ${
            current_page >= last_page
              ? 'cursor-not-allowed border-muted bg-muted text-muted-foreground'
              : 'hover:bg-muted'
          }`}
          aria-disabled={current_page >= last_page}
        >
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
