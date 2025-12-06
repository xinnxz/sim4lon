
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
  maintenanceMode: boolean
  debugMode: boolean
  autoBackup: boolean
  backupFrequency: string
  maxLoginAttempts: string
  sessionTimeout: string
  apiRateLimit: string
  logLevel: string
}

const initialSettings: SystemSettingsState = {
  maintenanceMode: false,
  debugMode: false,
  autoBackup: true,
  backupFrequency: 'daily',
  maxLoginAttempts: '5',
  sessionTimeout: '30',
  apiRateLimit: '1000',
  logLevel: 'info'
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsState>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: keyof SystemSettingsState, value: string | boolean) => {
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
      toast.error('Gagal menyimpan pengaturan sistem')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Pengaturan Sistem</h3>
        <p className="text-sm text-muted-foreground mb-6">Konfigurasi lanjutan untuk administrator sistem</p>
      </div>

      {/* System Status */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Status Sistem</CardTitle>
          <CardDescription>Kelola status operasional sistem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="AlertTriangle" className="h-5 w-5 text-accent-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Mode Pemeliharaan</Label>
                <p className="text-xs text-muted-foreground">Nonaktifkan akses pengguna untuk pemeliharaan</p>
              </div>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(value) => handleChange('maintenanceMode', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Bug" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Mode Debug</Label>
                <p className="text-xs text-muted-foreground">Aktifkan logging debug untuk troubleshooting</p>
              </div>
            </div>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={(value) => handleChange('debugMode', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Pengaturan Backup</CardTitle>
          <CardDescription>Kelola backup otomatis data sistem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="HardDrive" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Backup Otomatis</Label>
                <p className="text-xs text-muted-foreground">Aktifkan backup data otomatis</p>
              </div>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(value) => handleChange('autoBackup', value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backupFrequency" className="text-sm font-medium">Frekuensi Backup</Label>
            <Select value={settings.backupFrequency} onValueChange={(value) => handleChange('backupFrequency', value)}>
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
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Pengaturan Keamanan</CardTitle>
          <CardDescription>Konfigurasi keamanan sistem</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts" className="text-sm font-medium">Maksimal Percobaan Login</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
              className="h-10"
              min="1"
              max="10"
            />
            <p className="text-xs text-muted-foreground">Jumlah percobaan login sebelum akun terkunci</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout" className="text-sm font-medium">Timeout Sesi (Menit)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              className="h-10"
              min="5"
              max="480"
            />
            <p className="text-xs text-muted-foreground">Durasi sesi sebelum logout otomatis</p>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Pengaturan API</CardTitle>
          <CardDescription>Konfigurasi API dan rate limiting</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="apiRateLimit" className="text-sm font-medium">Rate Limit (Req/Jam)</Label>
            <Input
              id="apiRateLimit"
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => handleChange('apiRateLimit', e.target.value)}
              className="h-10"
              min="100"
              max="10000"
            />
            <p className="text-xs text-muted-foreground">Jumlah request API per jam</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logLevel" className="text-sm font-medium">Level Logging</Label>
            <Select value={settings.logLevel} onValueChange={(value) => handleChange('logLevel', value)}>
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
            <p className="text-xs text-muted-foreground">Level detail logging sistem</p>
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
