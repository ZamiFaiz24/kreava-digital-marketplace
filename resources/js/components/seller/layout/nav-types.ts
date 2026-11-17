export interface DashboardNavItem {
    label: string;
    labelKey?: string;
    icon: string;
    href: string;
    badge?: number;
    groupKey: string;
}

export interface DashboardNavGroup {
    labelKey: string;
    items: DashboardNavItem[];
}

export type ProfileBadgeTone = 'success' | 'warning' | 'neutral';

export interface ProfileBadge {
    label: string;
    tone: ProfileBadgeTone;
}
