
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

interface GeneralSettingsState {
  appName: string
  appVersion: string
  timezone: string
  language: string
  dateFormat: string
  maintenanceMode: boolean
  agentName: string
  agentAddress: string
  agentPhone: string
  agentEmail: string
  agentContactPerson: string
  agentBusinessNumber: string
}

interface FileErrors {
  [key: string]: string
}

const initialSettings: GeneralSettingsState = {
  appName: 'SIM4LON',
  appVersion: '1.0.0',
  timezone: 'Asia/Jakarta',
  language: 'id',
  dateFormat: 'DD/MM/YYYY',
  maintenanceMode: false,
  agentName: '',
  agentAddress: '',
  agentPhone: '',
  agentEmail: '',
  agentContactPerson: '',
  agentBusinessNumber: ''
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettingsState>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [agentLogoFile, setAgentLogoFile] = useState<File | null>(null)
  const [logoErrors, setLogoErrors] = useState<FileErrors>({})

  const handleInputChange = (field: keyof GeneralSettingsState, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type - only image formats
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
        setLogoErrors({
          agentLogo: 'Format file harus JPG, PNG, WebP, atau SVG'
        })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setLogoErrors({
          agentLogo: 'Ukuran file maksimal 5MB'
        })
        return
      }
      setAgentLogoFile(file)
      setLogoErrors({})
    }
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
      {/* Application Info */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Info" className="h-5 w-5 text-primary" />
            Informasi Aplikasi
          </CardTitle>
          <CardDescription>Konfigurasi dasar aplikasi SIM4LON</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="appName" className="text-sm font-medium">Nama Aplikasi</Label>
              <Input
                id="appName"
                value={settings.appName}
                onChange={(e) => handleInputChange('appName', e.target.value)}
                className="h-10"
                placeholder="Nama aplikasi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appVersion" className="text-sm font-medium">Versi Aplikasi</Label>
              <Input
                id="appVersion"
                value={settings.appVersion}
                disabled
                className="h-10 bg-muted"
                placeholder="Versi aplikasi"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Globe" className="h-5 w-5 text-primary" />
            Pengaturan Regional
          </CardTitle>
          <CardDescription>Atur zona waktu, bahasa, dan format tanggal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-sm font-medium">Zona Waktu</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
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
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">Bahasa</Label>
              <Select value={settings.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger id="language" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat" className="text-sm font-medium">Format Tanggal</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => handleInputChange('dateFormat', value)}>
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
          </div>
        </CardContent>
      </Card>

{/* Agent/Company Information */}
       <Card className="border shadow-soft">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <SafeIcon name="Building2" className="h-5 w-5 text-primary" />
             Informasi Agen / Perusahaan
           </CardTitle>
           <CardDescription>Kelola informasi identitas agen atau perusahaan Anda</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="grid gap-4 sm:grid-cols-2">
             <div className="space-y-2">
               <Label htmlFor="agentName" className="text-sm font-medium">Nama Agen / Perusahaan</Label>
               <Input
                 id="agentName"
                 value={settings.agentName}
                 onChange={(e) => handleInputChange('agentName', e.target.value)}
                 className="h-10"
                 placeholder="Nama agen atau perusahaan"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="agentContactPerson" className="text-sm font-medium">Penanggung Jawab</Label>
               <Input
                 id="agentContactPerson"
                 value={settings.agentContactPerson}
                 onChange={(e) => handleInputChange('agentContactPerson', e.target.value)}
                 className="h-10"
                 placeholder="Nama penanggung jawab"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="agentPhone" className="text-sm font-medium">Nomor Telepon</Label>
               <Input
                 id="agentPhone"
                 value={settings.agentPhone}
                 onChange={(e) => handleInputChange('agentPhone', e.target.value)}
                 className="h-10"
                 placeholder="Contoh: +628123456789"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="agentEmail" className="text-sm font-medium">Email</Label>
               <Input
                 id="agentEmail"
                 type="email"
                 value={settings.agentEmail}
                 onChange={(e) => handleInputChange('agentEmail', e.target.value)}
                 className="h-10"
                 placeholder="Email perusahaan"
               />
             </div>
           </div>
           <div className="space-y-2">
             <Label htmlFor="agentAddress" className="text-sm font-medium">Alamat</Label>
             <Input
               id="agentAddress"
               value={settings.agentAddress}
               onChange={(e) => handleInputChange('agentAddress', e.target.value)}
               className="h-10"
               placeholder="Alamat lengkap perusahaan"
             />
           </div>
<div className="space-y-2">
              <Label htmlFor="agentBusinessNumber" className="text-sm font-medium">Nomor Registrasi Usaha</Label>
              <Input
                id="agentBusinessNumber"
                value={settings.agentBusinessNumber}
                onChange={(e) => handleInputChange('agentBusinessNumber', e.target.value)}
                className="h-10"
                placeholder="Nomor NIB / NPWP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentLogo" className="font-semibold">Logo Perusahaan</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-secondary/50 transition-colors">
                <input
                  id="agentLogo"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.svg"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <label htmlFor="agentLogo" className="cursor-pointer block">
                  {agentLogoFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <SafeIcon name="CheckCircle" className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{agentLogoFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SafeIcon name="Upload" className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Klik untuk unggah logo perusahaan</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, WebP, atau SVG (Max 5MB)</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              {logoErrors.agentLogo && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {logoErrors.agentLogo}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

       {/* System Status */}
       <Card className="border shadow-soft">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <SafeIcon name="Activity" className="h-5 w-5 text-primary" />
             Status Sistem
           </CardTitle>
           <CardDescription>Kelola status operasional aplikasi</CardDescription>
         </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Mode Pemeliharaan</p>
              <p className="text-xs text-muted-foreground">Aktifkan untuk melakukan pemeliharaan sistem</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
            />
          </div>
          {settings.maintenanceMode && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 flex items-start gap-2">
              <SafeIcon name="AlertTriangle" className="h-4 w-4 text-accent-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-accent-foreground">Mode pemeliharaan aktif. Pengguna akan melihat pesan pemeliharaan.</p>
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
