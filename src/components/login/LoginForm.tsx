
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { authApi, isAuthenticated, getToken, removeToken } from '@/lib/api'
import { clearCachedProfile } from '@/components/auth/AuthGuard'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null)

  /**
   * PENJELASAN: useEffect untuk cek apakah user sudah login
   * 
   * Saat halaman login dibuka, kita cek:
   * 1. Apakah ada token di localStorage?
   * 2. Jika ada, verifikasi token masih valid dengan memanggil API profile
   * 3. Jika valid -> redirect ke dashboard
   * 4. Jika tidak valid -> hapus token, tetap di login page
   */
  useEffect(() => {
    const checkAuth = async () => {
      // Cek apakah ada token tersimpan
      if (isAuthenticated()) {
        try {
          // Verifikasi token masih valid
          const user = await authApi.getProfile()

          // Token valid, redirect ke dashboard berdasarkan role
          const dashboardRoutes: Record<string, string> = {
            'ADMIN': '/dashboard-admin',
            'OPERATOR': '/dashboard-admin',
            'PANGKALAN': '/pangkalan/dashboard',
          };
          const redirectUrl = dashboardRoutes[user.role] || '/dashboard-admin';
          window.location.href = redirectUrl;
        } catch (error) {
          // Token tidak valid, hapus dan biarkan user login ulang
          removeToken()
        }
      }
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email.trim()) {
      setError('Email tidak boleh kosong')
      return
    }
    if (!password) {
      setError('Password tidak boleh kosong')
      return
    }

    setIsLoading(true)

    try {
      // Real API call
      const response = await authApi.login({ email, password })

      // Clear any old cached profile before redirecting
      clearCachedProfile()

      toast.success('Login berhasil! Mengalihkan ke dashboard...')

      // Redirect based on role
      const dashboardRoutes: Record<string, string> = {
        'ADMIN': '/dashboard-admin',
        'OPERATOR': '/dashboard-admin',
        'PANGKALAN': '/pangkalan/dashboard',
      };
      const redirectUrl = dashboardRoutes[response.user.role] || '/dashboard-admin';

      window.location.href = redirectUrl
    } catch (err: any) {
      setError(err.message || 'Email atau password salah')
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-xl animate-scaleIn bg-slate-50/100 backdrop-blur-sm mx-4 sm:mx-0 w-full max-w-md">
      <CardHeader className="space-y-2 text-center px-4 sm:px-6">
        <div className="flex justify-center mb-2 sm:mb-4 mt-4 sm:mt-8">
          <img
            src="/logo-pertamina-2.png"
            alt="Pertamina"
            className="h-12 sm:h-16 object-contain transition-all duration-300"
          />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold">SIM4LON</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Sistem Informasi Distribusi LPG
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-slideInRight">
              <SafeIcon name="AlertCircle" className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <Label htmlFor="email" className="text-sm font-medium transition-colors" style={{ color: focusedField === 'email' ? 'hsl(152, 100%, 30%)' : undefined }}>
              Email
            </Label>
            <div className="relative group">
              <SafeIcon
                name="Mail"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-emerald-600"
              />
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                disabled={isLoading}
                className="pl-10 h-11 sm:h-10 text-base sm:text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Label htmlFor="password" className="text-sm font-medium transition-colors" style={{ color: focusedField === 'password' ? 'hsl(152, 100%, 30%)' : undefined }}>
              Password
            </Label>
            <div className="relative group">
              <SafeIcon
                name="Lock"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-emerald-600"
              />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                disabled={isLoading}
                className="pl-10 pr-12 h-11 sm:h-10 text-base sm:text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-50 hover:scale-110 touch-manipulation"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                <SafeIcon
                  name={showPassword ? 'EyeOff' : 'Eye'}
                  className="h-4 w-4"
                />
              </button>
            </div>
          </div>

          {/* Login Button - Hardcoded green for login page (HSL 152 100% 30% from --primary) */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 sm:h-10 text-base sm:text-sm text-white font-medium button-interactive transition-all duration-300 hover:shadow-lg disabled:opacity-70 touch-manipulation"
              style={{
                background: 'linear-gradient(to right, hsl(152, 100%, 40%), hsl(152, 100%, 35%))',
                boxShadow: isLoading ? undefined : '0 4px 14px 0 hsla(152, 100%, 30%, 0.25)'
              }}
            >
              {isLoading ? (
                <>
                  <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Sedang Masuk...
                </>
              ) : (
                <>
                  <SafeIcon name="LogIn" className="mr-2 h-4 w-4 transition-transform group-active:translate-x-1" />
                  Masuk
                </>
              )}
            </Button>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-3 sm:p-3 bg-secondary/50 rounded-lg border border-border animate-fadeInUp space-y-1" style={{ animationDelay: '0.5s' }}>
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium">Demo:</span> admin@demo.com / admin123
            </p>
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium">Demo:</span> operator@demo.com / operator123
            </p>
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium">Demo:</span> pkl001@demo.com / pangkalan123
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
