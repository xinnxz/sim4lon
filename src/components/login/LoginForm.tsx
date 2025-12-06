
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!username.trim()) {
      setError('Username tidak boleh kosong')
      return
    }
    if (!password) {
      setError('Password tidak boleh kosong')
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock authentication - accept any non-empty credentials
      if (username && password) {
        toast.success('Login berhasil! Mengalihkan ke dashboard...')
        // Redirect to dashboard
        window.location.href = './dashboard-admin.html'
      } else {
        setError('Username atau password salah')
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <Card className="border-0 shadow-lg animate-scaleIn">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <SafeIcon name="Flame" className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">SIM4LON</CardTitle>
        <CardDescription className="text-base">
          Sistem Informasi Distribusi LPG
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-slideInRight">
              <SafeIcon name="AlertCircle" className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

{/* Username Field */}
           <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
             <Label htmlFor="username" className="text-sm font-medium transition-colors" style={{ color: focusedField === 'username' ? 'hsl(var(--primary))' : undefined }}>
               Username
             </Label>
             <div className="relative group">
               <SafeIcon 
                 name="User" 
                 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary"
               />
               <Input
                 id="username"
                 type="text"
                 placeholder="Masukkan username Anda"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 onFocus={() => setFocusedField('username')}
                 onBlur={() => setFocusedField(null)}
                 disabled={isLoading}
                 className="pl-10 h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                 autoComplete="username"
               />
             </div>
           </div>

           {/* Password Field */}
           <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
             <Label htmlFor="password" className="text-sm font-medium transition-colors" style={{ color: focusedField === 'password' ? 'hsl(var(--primary))' : undefined }}>
               Password
             </Label>
             <div className="relative group">
               <SafeIcon 
                 name="Lock" 
                 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary"
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
                 className="pl-10 pr-10 h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                 autoComplete="current-password"
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 disabled={isLoading}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-50 hover:scale-110"
                 aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
               >
                 <SafeIcon 
                   name={showPassword ? 'EyeOff' : 'Eye'} 
                   className="h-4 w-4"
                 />
               </button>
             </div>
</div>

            {/* Login Button */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
             <Button
               type="submit"
               disabled={isLoading}
               className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium button-interactive transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70"
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
           <div className="mt-6 p-3 bg-secondary/50 rounded-lg border border-border animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
             <p className="text-xs text-muted-foreground text-center">
               <span className="font-medium">Demo:</span> Gunakan username dan password apapun untuk masuk
             </p>
           </div>
        </form>
      </CardContent>
    </Card>
  )
}
