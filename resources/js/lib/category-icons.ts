import {
  BookOpen,
  Code2,
  LayoutGrid,
  LayoutTemplate,
  MonitorSmartphone,
  Music4,
  Shapes,
  Type,
  Sparkles,
  LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  'layout-grid': LayoutGrid,
  'layout-template': LayoutTemplate,
  'code-2': Code2,
  'book-open': BookOpen,
  shapes: Shapes,
  'monitor-smartphone': MonitorSmartphone,
  type: Type,
  'music-4': Music4,
}

export function getCategoryIcon(icon?: string | null): LucideIcon {
  if (!icon) {
    return Sparkles
  }

  return iconMap[icon] ?? Sparkles
}
