
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
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)

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
            'ADMIN': '/dashboard',
            'OPERATOR': '/dashboard',
            'PANGKALAN': '/pangkalan/dashboard',
          };
          const redirectUrl = dashboardRoutes[user.role] || '/dashboard';
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
        'ADMIN': '/dashboard',
        'OPERATOR': '/dashboard',
        'PANGKALAN': '/pangkalan/dashboard',
      };
      const redirectUrl = dashboardRoutes[response.user.role] || '/dashboard';

      window.location.href = redirectUrl
    } catch (err: any) {
      setError(err.message || 'Email atau password salah')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full px-4 sm:px-0">
      {/* Mobile Header - Only visible on mobile */}
      <div className="sm:hidden text-center mb-2">
        <img
          src="/logo-sim4lon-transparant-v2.png"
          alt="SIM4LON Logo"
          className="h-16 mx-auto mb-1 drop-shadow-lg"
        />
        <h1 className="text-2xl font-bold text-white drop-shadow-md">SIM4LON</h1>
        <p className="text-white/90 text-sm">Sistem Informasi Untuk Distribusi LPG</p>
      </div>

      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
        {/* Desktop Header - Hidden on mobile */}
        <CardHeader className="hidden sm:block space-y-2 text-center px-6 pt-8 pb-2">
          <div className="flex justify-center mb-2">
            <img
              src="/logo-sim4lon-transparant-v2.png"
              alt="SIM4LON Logo"
              className="h-16 object-contain transition-all duration-300"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">SIM4LON</CardTitle>
          <CardDescription className="text-base text-gray-600">
            Sistem Informasi Untuk Distribusi LPG
          </CardDescription>

          {/* Logo Mitra */}
          <div className="pt-2 flex flex-col items-center gap-1.5">
            <span className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">Mitra Resmi</span>
            <div className="flex items-center gap-4">
              <img
                src="/logo-pertamina.png"
                alt="Pertamina"
                className="h-7 object-contain opacity-80"
              />
              <img
                src="/logo-bluegaz.png"
                alt="Blue Gaz"
                className="h-7 object-contain opacity-80"
              />
              <img
                src="/logo-pgn.png"
                alt="PGN"
                className="h-9 object-contain opacity-80"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 sm:px-6 py-6 sm:pb-8">
          {/* Logo Mitra - Mobile Only (inside card) */}
          <div className="sm:hidden flex flex-col items-center gap-1.5 pb-2 mb-2 border-b border-gray-100">
            <span className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">Mitra Resmi</span>
            <div className="flex items-center gap-4">
              <img
                src="/logo-pertamina.png"
                alt="Pertamina"
                className="h-6 object-contain opacity-80"
              />
              <img
                src="/logo-bluegaz.png"
                alt="Blue Gaz"
                className="h-6 object-contain opacity-80"
              />
              <img
                src="/logo-pgn.png"
                alt="PGN"
                className="h-8 object-contain opacity-80"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-slideInRight rounded-xl">
                <SafeIcon name="AlertCircle" className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 transition-colors"
                style={{ color: focusedField === 'email' ? 'hsl(152, 100%, 30%)' : undefined }}
              >
                Email
              </Label>
              <div className="relative group">
                <SafeIcon
                  name="Mail"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-emerald-600"
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
                  className="pl-12 h-14 sm:h-12 text-base rounded-xl border-2 border-gray-200 bg-gray-50/50 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white placeholder:text-gray-400"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 transition-colors"
                style={{ color: focusedField === 'password' ? 'hsl(152, 100%, 30%)' : undefined }}
              >
                Password
              </Label>
              <div className="relative group">
                <SafeIcon
                  name="Lock"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-emerald-600"
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
                  className="pl-12 pr-14 h-14 sm:h-12 text-base rounded-xl border-2 border-gray-200 bg-gray-50/50 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white placeholder:text-gray-400"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-gray-400 hover:text-gray-600 transition-all duration-200 disabled:opacity-50 hover:bg-gray-100 rounded-lg active:scale-95 touch-manipulation"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  <SafeIcon
                    name={showPassword ? 'EyeOff' : 'Eye'}
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="animate-fadeInUp pt-2" style={{ animationDelay: '0.4s' }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 sm:h-12 text-base sm:text-sm text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl active:scale-[0.98] disabled:opacity-70 touch-manipulation"
                style={{
                  background: 'linear-gradient(135deg, hsl(152, 100%, 40%) 0%, hsl(152, 100%, 32%) 100%)',
                  boxShadow: isLoading ? undefined : '0 8px 24px -4px hsla(152, 100%, 30%, 0.4)'
                }}
              >
                {isLoading ? (
                  <>
                    <SafeIcon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                    Sedang Masuk...
                  </>
                ) : (
                  <>
                    <SafeIcon name="LogIn" className="mr-2 h-5 w-5 transition-transform group-active:translate-x-1" />
                    Masuk
                  </>
                )}
              </Button>
            </div>

            {/* Demo Credentials Info - Click to Reveal */}
            <div className="mt-3 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <SafeIcon
                  name={showDemoCredentials ? 'EyeOff' : 'Eye'}
                  className="h-3.5 w-3.5"
                />
                <span>{showDemoCredentials ? 'Sembunyikan' : 'Tampilkan'} Akun Demo</span>
              </button>

              {/* Collapsible Demo Info */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${showDemoCredentials ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                  {/* Daftar Akun Demo - Vertikal */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-semibold min-w-[70px]">Admin</span>
                      <span className="text-gray-600">admin@agen.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-semibold min-w-[70px]">Operator</span>
                      <span className="text-gray-600">operator@demo.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 font-semibold min-w-[70px]">Pangkalan</span>
                      <span className="text-gray-600">tes2@demo.com</span>
                    </div>
                  </div>

                  {/* Password Info */}
                  <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                    <span className="font-medium">Password:</span> admin123 / operator123 / pangkalan123
                  </p>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer - All devices */}
      <p className="text-center text-white/70 text-xs mt-6">
        © 2026 SIM4LON. All rights reserved.
      </p>
    </div>
  )
}
