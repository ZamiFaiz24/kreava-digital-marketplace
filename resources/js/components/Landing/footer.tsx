'use client'

import { Separator } from '@/components/ui/separator'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="font-bold text-lg text-primary-foreground">K</span>
              </div>
              <span className="font-bold text-xl text-foreground">KREAVA</span>
            </div>
            <p className="text-sm text-foreground/60 mb-6">
              Empowering digital creators to monetize their work and build sustainable businesses.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, i) => {
                const Icon = social.icon
                return (
                  <a
                    key={i}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Marketplace</h4>
            <ul className="space-y-3">
              {['All Products', 'UI Kits', 'Templates', 'Source Code', 'Ebooks', 'Icons'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">For Creators</h4>
            <ul className="space-y-3">
              {['Start Selling', 'Creator Dashboard', 'Analytics', 'Pricing', 'Resources', 'API Docs'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Blog', 'Careers', 'Press', 'Contact', 'Brand Kit'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security', 'Compliance', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/60">
            © 2024 KREAVA. All rights reserved. Made for creators, by creators.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-foreground/60 hover:text-foreground transition">
              Privacy
            </a>
            <a href="#" className="text-xs text-foreground/60 hover:text-foreground transition">
              Terms
            </a>
            <a href="#" className="text-xs text-foreground/60 hover:text-foreground transition">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
