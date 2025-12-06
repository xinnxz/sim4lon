
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

interface UserPreferencesState {
  theme: string
  compactMode: boolean
  showAnimations: boolean
  defaultView: string
  itemsPerPage: string
  autoRefresh: boolean
  refreshInterval: string
  soundNotifications: boolean
  desktopNotifications: boolean
}

const initialSettings: UserPreferencesState = {
  theme: 'light',
  compactMode: false,
  showAnimations: true,
  defaultView: 'grid',
  itemsPerPage: '10',
  autoRefresh: true,
  refreshInterval: '30',
  soundNotifications: true,
  desktopNotifications: true
}

export default function UserPreferences() {
  const [settings, setSettings] = useState<UserPreferencesState>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: keyof UserPreferencesState, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Preferensi pengguna berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan preferensi pengguna')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Preferensi Pengguna</h3>
        <p className="text-sm text-muted-foreground mb-6">Sesuaikan pengalaman pengguna Anda</p>
      </div>

      {/* Display Settings */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Pengaturan Tampilan</CardTitle>
          <CardDescription>Sesuaikan tampilan antarmuka</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-sm font-medium">Tema</Label>
            <Select value={settings.theme} onValueChange={(value) => handleChange('theme', value)}>
              <SelectTrigger id="theme" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Terang</SelectItem>
                <SelectItem value="dark">Gelap</SelectItem>
                <SelectItem value="auto">Otomatis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Minimize2" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Mode Kompak</Label>
                <p className="text-xs text-muted-foreground">Tampilkan lebih banyak konten dalam satu layar</p>
              </div>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(value) => handleChange('compactMode', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Sparkles" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Tampilkan Animasi</Label>
                <p className="text-xs text-muted-foreground">Aktifkan animasi dan transisi</p>
              </div>
            </div>
            <Switch
              checked={settings.showAnimations}
              onCheckedChange={(value) => handleChange('showAnimations', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Display Settings */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Tampilan Data</CardTitle>
          <CardDescription>Pengaturan tampilan tabel dan daftar</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="defaultView" className="text-sm font-medium">Tampilan Default</Label>
            <Select value={settings.defaultView} onValueChange={(value) => handleChange('defaultView', value)}>
              <SelectTrigger id="defaultView" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">Daftar</SelectItem>
                <SelectItem value="table">Tabel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemsPerPage" className="text-sm font-medium">Item Per Halaman</Label>
            <Select value={settings.itemsPerPage} onValueChange={(value) => handleChange('itemsPerPage', value)}>
              <SelectTrigger id="itemsPerPage" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Item</SelectItem>
                <SelectItem value="10">10 Item</SelectItem>
                <SelectItem value="25">25 Item</SelectItem>
                <SelectItem value="50">50 Item</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Refresh Settings */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Penyegaran Otomatis</CardTitle>
          <CardDescription>Pengaturan penyegaran data otomatis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="RotateCw" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Penyegaran Otomatis</Label>
                <p className="text-xs text-muted-foreground">Segarkan data secara otomatis</p>
              </div>
            </div>
            <Switch
              checked={settings.autoRefresh}
              onCheckedChange={(value) => handleChange('autoRefresh', value)}
            />
          </div>

          {settings.autoRefresh && (
            <div className="space-y-2">
              <Label htmlFor="refreshInterval" className="text-sm font-medium">Interval Penyegaran (Detik)</Label>
              <Select value={settings.refreshInterval} onValueChange={(value) => handleChange('refreshInterval', value)}>
                <SelectTrigger id="refreshInterval" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Detik</SelectItem>
                  <SelectItem value="30">30 Detik</SelectItem>
                  <SelectItem value="60">1 Menit</SelectItem>
                  <SelectItem value="300">5 Menit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Preferensi Notifikasi</CardTitle>
          <CardDescription>Pengaturan notifikasi lokal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Volume2" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Notifikasi Suara</Label>
                <p className="text-xs text-muted-foreground">Putar suara untuk notifikasi penting</p>
              </div>
            </div>
            <Switch
              checked={settings.soundNotifications}
              onCheckedChange={(value) => handleChange('soundNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Monitor" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Notifikasi Desktop</Label>
                <p className="text-xs text-muted-foreground">Tampilkan notifikasi desktop</p>
              </div>
            </div>
            <Switch
              checked={settings.desktopNotifications}
              onCheckedChange={(value) => handleChange('desktopNotifications', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline">
          <SafeIcon name="RotateCcw" className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90"
        >
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
