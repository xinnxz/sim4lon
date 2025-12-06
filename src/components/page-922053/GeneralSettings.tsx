
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

interface GeneralSettingsState {
  appName: string
  appVersion: string
  timezone: string
  dateFormat: string
  currency: string
  language: string
}

const initialSettings: GeneralSettingsState = {
  appName: 'SIM4LON',
  appVersion: '1.0.0',
  timezone: 'Asia/Jakarta',
  dateFormat: 'DD/MM/YYYY',
  currency: 'IDR',
  language: 'id'
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettingsState>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: keyof GeneralSettingsState, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Pengaturan umum berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Pengaturan Umum Sistem</h3>
        <p className="text-sm text-muted-foreground mb-6">Konfigurasi dasar aplikasi SIM4LON</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* App Name */}
        <div className="space-y-2">
          <Label htmlFor="appName" className="text-sm font-medium">Nama Aplikasi</Label>
          <Input
            id="appName"
            value={settings.appName}
            onChange={(e) => handleChange('appName', e.target.value)}
            className="h-10"
            disabled
          />
          <p className="text-xs text-muted-foreground">Nama aplikasi tidak dapat diubah</p>
        </div>

        {/* App Version */}
        <div className="space-y-2">
          <Label htmlFor="appVersion" className="text-sm font-medium">Versi Aplikasi</Label>
          <Input
            id="appVersion"
            value={settings.appVersion}
            onChange={(e) => handleChange('appVersion', e.target.value)}
            className="h-10"
            disabled
          />
          <p className="text-xs text-muted-foreground">Versi saat ini</p>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label htmlFor="timezone" className="text-sm font-medium">Zona Waktu</Label>
          <Select value={settings.timezone} onValueChange={(value) => handleChange('timezone', value)}>
            <SelectTrigger id="timezone" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
              <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
              <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Format */}
        <div className="space-y-2">
          <Label htmlFor="dateFormat" className="text-sm font-medium">Format Tanggal</Label>
          <Select value={settings.dateFormat} onValueChange={(value) => handleChange('dateFormat', value)}>
            <SelectTrigger id="dateFormat" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium">Mata Uang</Label>
          <Select value={settings.currency} onValueChange={(value) => handleChange('currency', value)}>
            <SelectTrigger id="currency" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IDR">IDR (Rupiah Indonesia)</SelectItem>
              <SelectItem value="USD">USD (Dolar Amerika)</SelectItem>
              <SelectItem value="SGD">SGD (Dolar Singapura)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium">Bahasa</Label>
          <Select value={settings.language} onValueChange={(value) => handleChange('language', value)}>
            <SelectTrigger id="language" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
