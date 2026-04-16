'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { companyProfileApi } from '@/lib/api'
import { clearAppSettingsCache } from '@/hooks/useAppSettings'

/**
 * ApplicationSettings - Tab Aplikasi
 * 
 * Pengaturan khusus untuk operasional distribusi LPG:
 * - Batas stok kritis (untuk notifikasi)
 * - PPN percentage
 * - Jatuh tempo pembayaran
 * - Minimum order per pesanan
 * - Notifikasi email
 */

interface ApplicationState {
    criticalStockLimit: number
    ppnPercentage: number
    paymentDueDays: number       // Batas hari jatuh tempo
    minOrderQuantity: number     // Minimum tabung per pesanan
    emailNotifications: boolean
    stockAlerts: boolean
}

const initialSettings: ApplicationState = {
    criticalStockLimit: 10,
    ppnPercentage: 12,
    paymentDueDays: 7,
    minOrderQuantity: 1,
    emailNotifications: true,
    stockAlerts: true,
}

export default function ApplicationSettings() {
    const [settings, setSettings] = useState<ApplicationState>(initialSettings)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Load settings from API + localStorage on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const profile = await companyProfileApi.get()

                // Load toggles from localStorage (client-side preferences)
                const savedStockAlerts = localStorage.getItem('app_stockAlerts')
                const savedEmailNotifications = localStorage.getItem('app_emailNotifications')

                setSettings(prev => ({
                    ...prev,
                    ppnPercentage: Number(profile.ppn_rate) || 12,
                    criticalStockLimit: profile.critical_stock_limit || 10,
                    paymentDueDays: Number(profile.payment_due_days) || 7,
                    minOrderQuantity: Number(profile.min_order_quantity) || 1,
                    // Client-side preferences from localStorage
                    stockAlerts: savedStockAlerts !== null ? savedStockAlerts === 'true' : true,
                    emailNotifications: savedEmailNotifications !== null ? savedEmailNotifications === 'true' : true,
                }))
            } catch (error) {
                console.error('Failed to load settings:', error)
                // Use defaults on error
            } finally {
                setIsLoading(false)
            }
        }
        loadSettings()
    }, [])

    const handleChange = (field: keyof ApplicationState, value: string | number | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Save to backend via company profile API (database settings)
            await companyProfileApi.update({
                ppn_rate: settings.ppnPercentage,
                critical_stock_limit: settings.criticalStockLimit,
                payment_due_days: settings.paymentDueDays,
                min_order_quantity: settings.minOrderQuantity,
            })

            // Save toggles to localStorage (client-side preferences)
            localStorage.setItem('app_stockAlerts', String(settings.stockAlerts))
            localStorage.setItem('app_emailNotifications', String(settings.emailNotifications))

            // Clear cache so other components get fresh data
            clearAppSettingsCache()
            toast.success('Pengaturan aplikasi berhasil disimpan')
        } catch (error) {
            console.error('Failed to save settings:', error)
            toast.error('Gagal menyimpan pengaturan')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Stock Settings */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10">
                            <SafeIcon name="Package" className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Pengaturan Stok</CardTitle>
                            <CardDescription>Konfigurasi batas stok dan notifikasi</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Critical Stock Limit */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="criticalStockLimit" className="text-sm font-medium">
                                Batas Stok Kritis (Tabung)
                            </Label>
                            <Input
                                id="criticalStockLimit"
                                type="number"
                                min="1"
                                max="1000"
                                value={settings.criticalStockLimit}
                                onChange={(e) => handleChange('criticalStockLimit', parseInt(e.target.value) || 0)}
                                className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">
                                Notifikasi akan muncul jika stok di bawah angka ini
                            </p>
                        </div>
                    </div>

                    {/* Stock Alerts Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Peringatan Stok Menipis</p>
                            <p className="text-xs text-muted-foreground">
                                Tampilkan notifikasi saat stok di bawah batas kritis
                            </p>
                        </div>
                        <Switch
                            checked={settings.stockAlerts}
                            onCheckedChange={(checked) => handleChange('stockAlerts', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Pricing & Payment Settings */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10">
                            <SafeIcon name="Receipt" className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Harga & Pembayaran</CardTitle>
                            <CardDescription>Pengaturan pajak, pembayaran, dan biaya pengiriman</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="ppnPercentage" className="text-sm font-medium">
                                Persentase PPN (%)
                            </Label>
                            <Input
                                id="ppnPercentage"
                                type="number"
                                min="0"
                                max="100"
                                value={settings.ppnPercentage}
                                onChange={(e) => handleChange('ppnPercentage', parseFloat(e.target.value) || 0)}
                                className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">
                                Tarif PPN untuk produk non-subsidi
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentDueDays" className="text-sm font-medium">
                                Jatuh Tempo Pembayaran (Hari)
                            </Label>
                            <Input
                                id="paymentDueDays"
                                type="number"
                                min="1"
                                max="90"
                                value={settings.paymentDueDays}
                                onChange={(e) => handleChange('paymentDueDays', parseInt(e.target.value) || 7)}
                                className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">
                                Batas hari untuk pembayaran pesanan (default: 7 hari)
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="minOrderQuantity" className="text-sm font-medium">
                                Minimum Order (Tabung)
                            </Label>
                            <Input
                                id="minOrderQuantity"
                                type="number"
                                min="1"
                                max="100"
                                value={settings.minOrderQuantity}
                                onChange={(e) => handleChange('minOrderQuantity', parseInt(e.target.value) || 1)}
                                className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">
                                Jumlah minimum tabung per pesanan (default: 1)
                            </p>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <SafeIcon name="Info" className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Konfigurasi Pembayaran & Order</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pesanan yang melewati jatuh tempo akan ditandai sebagai "overdue" di daftar pesanan. Pesanan dengan jumlah tabung kurang dari minimum akan ditolak.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                            <SafeIcon name="Bell" className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Notifikasi</CardTitle>
                            <CardDescription>Pengaturan pemberitahuan sistem</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Notifikasi Email</p>
                            <p className="text-xs text-muted-foreground">
                                Kirim email notifikasi untuk pesanan baru dan pembayaran
                            </p>
                        </div>
                        <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
                        />
                    </div>

                    {/* Info Box */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <SafeIcon name="Info" className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Konfigurasi Email</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Untuk mengaktifkan notifikasi email, pastikan email perusahaan sudah dikonfigurasi di tab Profil Perusahaan.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-2">
                <Button
                    variant="outline"
                    onClick={() => setSettings(initialSettings)}
                    className="gap-2"
                >
                    <SafeIcon name="RotateCcw" className="h-4 w-4" />
                    Reset
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2 bg-primary hover:bg-primary/90 min-w-[140px]"
                >
                    {isSaving ? (
                        <>
                            <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <SafeIcon name="Save" className="h-4 w-4" />
                            Simpan Pengaturan
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

