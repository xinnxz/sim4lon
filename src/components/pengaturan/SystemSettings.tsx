
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

interface SystemSettingsState {
  apiUrl: string
  databaseBackup: boolean
  backupFrequency: string
  logLevel: string
  debugMode: boolean
  maxUploadSize: string
  cacheEnabled: boolean
}

const initialSettings: SystemSettingsState = {
  apiUrl: 'https://api.sim4lon.local',
  databaseBackup: true,
  backupFrequency: 'daily',
  logLevel: 'info',
  debugMode: false,
  maxUploadSize: '50',
  cacheEnabled: true,
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsState>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (field: keyof SystemSettingsState) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleInputChange = (field: keyof SystemSettingsState, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Pengaturan sistem berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Zap" className="h-5 w-5 text-primary" />
            Konfigurasi API
          </CardTitle>
          <CardDescription>Pengaturan koneksi dan endpoint API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl" className="text-sm font-medium">URL API</Label>
            <Input
              id="apiUrl"
              type="url"
              value={settings.apiUrl}
              onChange={(e) => handleInputChange('apiUrl', e.target.value)}
              className="h-10"
              placeholder="https://api.sim4lon.local"
            />
            <p className="text-xs text-muted-foreground">Endpoint API untuk komunikasi backend</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUploadSize" className="text-sm font-medium">Ukuran Upload Maksimal (MB)</Label>
            <Input
              id="maxUploadSize"
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) => handleInputChange('maxUploadSize', e.target.value)}
              className="h-10"
              min="1"
              max="500"
            />
            <p className="text-xs text-muted-foreground">Batas ukuran file yang dapat diunggah</p>
          </div>
        </CardContent>
      </Card>

      {/* Database & Backup */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Database" className="h-5 w-5 text-primary" />
            Database & Backup
          </CardTitle>
          <CardDescription>Kelola backup dan pemulihan data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Backup Database Otomatis</p>
              <p className="text-xs text-muted-foreground">Buat backup database secara berkala</p>
            </div>
            <Switch
              checked={settings.databaseBackup}
              onCheckedChange={() => handleToggle('databaseBackup')}
            />
          </div>

          {settings.databaseBackup && (
            <div className="space-y-2">
              <Label htmlFor="backupFrequency" className="text-sm font-medium">Frekuensi Backup</Label>
              <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                <SelectTrigger id="backupFrequency" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Setiap Jam</SelectItem>
                  <SelectItem value="daily">Setiap Hari</SelectItem>
                  <SelectItem value="weekly">Setiap Minggu</SelectItem>
                  <SelectItem value="monthly">Setiap Bulan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium text-foreground mb-2">Backup Terakhir</p>
            <p className="text-xs text-muted-foreground">2024-01-15 03:00 AM (Berhasil)</p>
          </div>
        </CardContent>
      </Card>

      {/* Logging & Debug */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Bug" className="h-5 w-5 text-primary" />
            Logging & Debug
          </CardTitle>
          <CardDescription>Kelola log sistem dan mode debug</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logLevel" className="text-sm font-medium">Level Log</Label>
            <Select value={settings.logLevel} onValueChange={(value) => handleInputChange('logLevel', value)}>
              <SelectTrigger id="logLevel" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Tingkat detail logging sistem</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Mode Debug</p>
              <p className="text-xs text-muted-foreground">Aktifkan untuk informasi debug lengkap</p>
            </div>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={() => handleToggle('debugMode')}
            />
          </div>

          {settings.debugMode && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 flex items-start gap-2">
              <SafeIcon name="AlertTriangle" className="h-4 w-4 text-accent-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-accent-foreground">Mode debug aktif. Jangan gunakan di production.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Zap" className="h-5 w-5 text-primary" />
            Performa
          </CardTitle>
          <CardDescription>Optimasi performa aplikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Cache Enabled</p>
              <p className="text-xs text-muted-foreground">Aktifkan caching untuk performa lebih baik</p>
            </div>
            <Switch
              checked={settings.cacheEnabled}
              onCheckedChange={() => handleToggle('cacheEnabled')}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
            <p className="text-sm font-medium">Statistik Sistem</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Uptime: 45 hari</div>
              <div>Memory: 2.4 GB / 8 GB</div>
              <div>CPU: 12%</div>
              <div>Disk: 156 GB / 500 GB</div>
            </div>
          </div>
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
