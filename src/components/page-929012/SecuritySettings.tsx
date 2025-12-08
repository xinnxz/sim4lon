
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

interface SecuritySettingsState {
  twoFactorAuth: boolean
  sessionTimeout: string
  passwordExpiry: string
  loginAttempts: string
  ipWhitelist: boolean
  ipAddresses: string
}

const initialSettings: SecuritySettingsState = {
  twoFactorAuth: true,
  sessionTimeout: '30',
  passwordExpiry: '90',
  loginAttempts: '5',
  ipWhitelist: false,
  ipAddresses: '',
}

export default function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettingsState>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleToggle = (field: keyof SecuritySettingsState) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleInputChange = (field: keyof SecuritySettingsState, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Pengaturan keamanan berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Authentication Security */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Lock" className="h-5 w-5 text-primary" />
            Keamanan Autentikasi
          </CardTitle>
          <CardDescription>Kelola pengaturan keamanan login dan akses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Autentikasi Dua Faktor (2FA)</p>
              <p className="text-xs text-muted-foreground">Tingkatkan keamanan dengan 2FA</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={() => handleToggle('twoFactorAuth')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout" className="text-sm font-medium">Timeout Sesi (menit)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                className="h-10"
                min="5"
                max="480"
              />
              <p className="text-xs text-muted-foreground">Durasi sesi sebelum logout otomatis</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginAttempts" className="text-sm font-medium">Maksimal Percobaan Login</Label>
              <Input
                id="loginAttempts"
                type="number"
                value={settings.loginAttempts}
                onChange={(e) => handleInputChange('loginAttempts', e.target.value)}
                className="h-10"
                min="1"
                max="10"
              />
              <p className="text-xs text-muted-foreground">Jumlah percobaan sebelum akun terkunci</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Policy */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Key" className="h-5 w-5 text-primary" />
            Kebijakan Kata Sandi
          </CardTitle>
          <CardDescription>Atur persyaratan dan kebijakan kata sandi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passwordExpiry" className="text-sm font-medium">Masa Berlaku Kata Sandi (hari)</Label>
            <Input
              id="passwordExpiry"
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) => handleInputChange('passwordExpiry', e.target.value)}
              className="h-10"
              min="0"
              max="365"
            />
            <p className="text-xs text-muted-foreground">Masukkan 0 untuk tidak ada batas waktu</p>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
            <p className="font-medium text-sm text-foreground">Persyaratan Kata Sandi Minimum:</p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <SafeIcon name="Check" className="h-3 w-3 text-primary" />
                Minimal 8 karakter
              </li>
              <li className="flex items-center gap-2">
                <SafeIcon name="Check" className="h-3 w-3 text-primary" />
                Mengandung huruf besar dan kecil
              </li>
              <li className="flex items-center gap-2">
                <SafeIcon name="Check" className="h-3 w-3 text-primary" />
                Mengandung angka dan simbol
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* IP Whitelist */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Shield" className="h-5 w-5 text-primary" />
            Daftar Putih IP
          </CardTitle>
          <CardDescription>Batasi akses hanya dari IP tertentu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Aktifkan Daftar Putih IP</p>
              <p className="text-xs text-muted-foreground">Hanya izinkan akses dari IP yang terdaftar</p>
            </div>
            <Switch
              checked={settings.ipWhitelist}
              onCheckedChange={() => handleToggle('ipWhitelist')}
            />
          </div>

          {settings.ipWhitelist && (
            <div className="space-y-2">
              <Label htmlFor="ipAddresses" className="text-sm font-medium">Alamat IP yang Diizinkan</Label>
              <textarea
                id="ipAddresses"
                value={settings.ipAddresses}
                onChange={(e) => handleInputChange('ipAddresses', e.target.value)}
                className="w-full h-24 px-3 py-2 border rounded-lg bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Masukkan satu IP per baris (contoh: 192.168.1.1)"
              />
              <p className="text-xs text-muted-foreground">Pisahkan setiap IP dengan baris baru</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setSettings(initialSettings)}>
          <SafeIcon name="RotateCcw" className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
          {isSaving ? (
            <>
              <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <SafeIcon name="Save" className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
