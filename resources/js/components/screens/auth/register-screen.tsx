'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from 'lucide-react'
import type { AuthPageProps } from '@/types/marketplace'

export default function RegisterScreen({ errors = {}, old = {} }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agreedToTerms) return
    setIsLoading(true)
    // Form akan di-submit ke Laravel
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Branding */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">KREAVA</h1>
          <p className="mt-2 text-muted-foreground">Buat akun baru Anda</p>
        </div>

        {/* Register Card */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Nama Lengkap
              </label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={(old.name as string) || ''}
                  className="w-full rounded-lg border border-input bg-input py-3 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="John Doe"
                  required
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">{errors.name[0]}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={(old.email as string) || ''}
                  className="w-full rounded-lg border border-input bg-input py-3 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="nama@example.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="w-full rounded-lg border border-input bg-input py-3 pl-10 pr-10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password[0]}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground">
                Konfirmasi Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="password_confirmation"
                  name="password_confirmation"
                  className="w-full rounded-lg border border-input bg-input py-3 pl-10 pr-10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-2 text-sm text-red-500">{errors.password_confirmation[0]}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agree_terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input bg-input text-primary"
                required
              />
              <span className="text-sm text-muted-foreground">
                Saya setuju dengan{' '}
                <a href="/terms" className="text-primary hover:underline">
                  Syarat dan Ketentuan
                </a>{' '}
                dan{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Kebijakan Privasi
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Membuat akun...' : 'Daftar'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">atau</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-lg border border-input bg-card px-4 py-3 font-medium text-foreground transition-colors hover:bg-muted"
            >
              Google
            </button>
            <button
              type="button"
              className="rounded-lg border border-input bg-card px-4 py-3 font-medium text-foreground transition-colors hover:bg-muted"
            >
              GitHub
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <a href="/login" className="font-semibold text-primary hover:underline">
              Masuk di sini
            </a>
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3 rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-semibold text-foreground">Keuntungan bergabung:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Akses ke marketplace premium
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Jual produk digital Anda
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Dapatkan passive income
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}