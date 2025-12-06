
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

interface NotificationSettingsState {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  orderNotifications: boolean
  paymentNotifications: boolean
  deliveryNotifications: boolean
  stockAlerts: boolean
  systemAlerts: boolean
  dailyDigest: boolean
  weeklyReport: boolean
}

const initialSettings: NotificationSettingsState = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  orderNotifications: true,
  paymentNotifications: true,
  deliveryNotifications: true,
  stockAlerts: true,
  systemAlerts: true,
  dailyDigest: false,
  weeklyReport: true
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Pengaturan notifikasi berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan notifikasi')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Pengaturan Notifikasi</h3>
        <p className="text-sm text-muted-foreground mb-6">Kelola preferensi notifikasi Anda</p>
      </div>

      {/* Channel Settings */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Saluran Notifikasi</CardTitle>
          <CardDescription>Pilih saluran mana yang ingin menerima notifikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Mail" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Email</Label>
                <p className="text-xs text-muted-foreground">Terima notifikasi melalui email</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="MessageSquare" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">SMS</Label>
                <p className="text-xs text-muted-foreground">Terima notifikasi melalui SMS</p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggle('smsNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Bell" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Push Notification</Label>
                <p className="text-xs text-muted-foreground">Terima notifikasi push di browser</p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={() => handleToggle('pushNotifications')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Notifications */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Notifikasi Peristiwa</CardTitle>
          <CardDescription>Pilih peristiwa mana yang ingin Anda terima notifikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="ShoppingCart" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Pesanan Baru</Label>
                <p className="text-xs text-muted-foreground">Notifikasi saat ada pesanan baru</p>
              </div>
            </div>
            <Switch
              checked={settings.orderNotifications}
              onCheckedChange={() => handleToggle('orderNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="CreditCard" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Pembayaran</Label>
                <p className="text-xs text-muted-foreground">Notifikasi pembayaran pesanan</p>
              </div>
            </div>
            <Switch
              checked={settings.paymentNotifications}
              onCheckedChange={() => handleToggle('paymentNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Truck" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Pengiriman</Label>
                <p className="text-xs text-muted-foreground">Notifikasi status pengiriman</p>
              </div>
            </div>
            <Switch
              checked={settings.deliveryNotifications}
              onCheckedChange={() => handleToggle('deliveryNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Package" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Peringatan Stok</Label>
                <p className="text-xs text-muted-foreground">Notifikasi saat stok menipis</p>
              </div>
            </div>
            <Switch
              checked={settings.stockAlerts}
              onCheckedChange={() => handleToggle('stockAlerts')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="AlertTriangle" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Peringatan Sistem</Label>
                <p className="text-xs text-muted-foreground">Notifikasi masalah sistem penting</p>
              </div>
            </div>
            <Switch
              checked={settings.systemAlerts}
              onCheckedChange={() => handleToggle('systemAlerts')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Digest Settings */}
      <Card className="border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Ringkasan Berkala</CardTitle>
          <CardDescription>Terima ringkasan aktivitas secara berkala</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="Calendar" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Ringkasan Harian</Label>
                <p className="text-xs text-muted-foreground">Terima ringkasan aktivitas setiap hari</p>
              </div>
            </div>
            <Switch
              checked={settings.dailyDigest}
              onCheckedChange={() => handleToggle('dailyDigest')}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-3">
              <SafeIcon name="BarChart3" className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Laporan Mingguan</Label>
                <p className="text-xs text-muted-foreground">Terima laporan mingguan setiap Senin</p>
              </div>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={() => handleToggle('weeklyReport')}
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
