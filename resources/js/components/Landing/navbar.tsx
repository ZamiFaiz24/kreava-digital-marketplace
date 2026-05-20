'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="font-bold text-lg text-primary-foreground">K</span>
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:inline">KREAVA</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#marketplace" className="text-sm text-foreground/70 hover:text-foreground transition">
            Marketplace
          </a>
          <a href="#explore" className="text-sm text-foreground/70 hover:text-foreground transition">
            Explore
          </a>
          <a href="#categories" className="text-sm text-foreground/70 hover:text-foreground transition">
            Categories
          </a>
          <a href="#pricing" className="text-sm text-foreground/70 hover:text-foreground transition">
            Pricing
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button className="bg-primary hover:bg-primary/90" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#marketplace" className="text-sm text-foreground/70 hover:text-foreground transition">
              Marketplace
            </a>
            <a href="#explore" className="text-sm text-foreground/70 hover:text-foreground transition">
              Explore
            </a>
            <a href="#categories" className="text-sm text-foreground/70 hover:text-foreground transition">
              Categories
            </a>
            <a href="#pricing" className="text-sm text-foreground/70 hover:text-foreground transition">
              Pricing
            </a>
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="flex-1">
                Login
              </Button>
              <Button className="bg-primary hover:bg-primary/90 flex-1" size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
