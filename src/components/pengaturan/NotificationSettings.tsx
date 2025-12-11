
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

interface NotificationSettingsState {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  orderNotifications: boolean
  paymentNotifications: boolean
  deliveryNotifications: boolean
  stockNotifications: boolean
  emailAddress: string
  phoneNumber: string
}

const initialSettings: NotificationSettingsState = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  orderNotifications: true,
  paymentNotifications: true,
  deliveryNotifications: true,
  stockNotifications: true,
  emailAddress: 'admin@sim4lon.com',
  phoneNumber: '+62812345678',
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsState>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (field: keyof NotificationSettingsState) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleInputChange = (field: keyof NotificationSettingsState, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Pengaturan notifikasi berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Mail" className="h-5 w-5 text-primary" />
            Saluran Notifikasi
          </CardTitle>
          <CardDescription>Pilih cara Anda ingin menerima notifikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Notifikasi Email</p>
                <p className="text-xs text-muted-foreground">Terima notifikasi melalui email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Notifikasi SMS</p>
                <p className="text-xs text-muted-foreground">Terima notifikasi melalui SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={() => handleToggle('smsNotifications')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Notifikasi Push</p>
                <p className="text-xs text-muted-foreground">Terima notifikasi push di browser</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Bell" className="h-5 w-5 text-primary" />
            Jenis Notifikasi
          </CardTitle>
          <CardDescription>Pilih jenis notifikasi yang ingin Anda terima</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Notifikasi Pesanan</p>
                <p className="text-xs text-muted-foreground">Pesanan baru dan perubahan status</p>
              </div>
              <Switch
                checked={settings.orderNotifications}
                onCheckedChange={() => handleToggle('orderNotifications')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Notifikasi Pembayaran</p>
                <p className="text-xs text-muted-foreground">Pembayaran diterima dan tertunda</p>
              </div>
              <Switch
                checked={settings.paymentNotifications}
                onCheckedChange={() => handleToggle('paymentNotifications')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Notifikasi Pengiriman</p>
                <p className="text-xs text-muted-foreground">Status pengiriman dan perubahan</p>
              </div>
              <Switch
                checked={settings.deliveryNotifications}
                onCheckedChange={() => handleToggle('deliveryNotifications')}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Notifikasi Stok</p>
                <p className="text-xs text-muted-foreground">Stok menipis dan perubahan inventaris</p>
              </div>
              <Switch
                checked={settings.stockNotifications}
                onCheckedChange={() => handleToggle('stockNotifications')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Phone" className="h-5 w-5 text-primary" />
            Informasi Kontak
          </CardTitle>
          <CardDescription>Alamat email dan nomor telepon untuk notifikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className="h-10"
                placeholder="Email untuk notifikasi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Nomor Telepon</Label>
              <Input
                id="phone"
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="h-10"
                placeholder="Nomor telepon untuk SMS"
              />
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
