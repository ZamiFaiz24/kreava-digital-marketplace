import React from 'react';
import { Package, Globe, Settings, BarChart3, ArrowRight } from 'lucide-react';

interface ActionItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

export default function QuickActions() {
  const actions: ActionItem[] = [
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Upload Product',
      description: 'Add a new digital product to your store',
      href: '/seller/products/new',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'View Marketplace',
      description: 'See how your store looks to customers',
      href: '/marketplace',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Edit Store',
      description: 'Customize your store settings and branding',
      href: '/seller/settings',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'View Analytics',
      description: 'Deep dive into your sales analytics',
      href: '/seller/analytics',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="bg-white rounded-2xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all group cursor-pointer"
          >
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              {action.icon}
            </div>
            <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">{action.description}</p>
            <div className="flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Go <ArrowRight className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
