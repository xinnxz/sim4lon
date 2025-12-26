'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { companyProfileApi } from '@/lib/api'
import { clearAppSettingsCache } from '@/hooks/useAppSettings'

/**
 * ApplicationSettings - Tab Aplikasi
 * 
 * Pengaturan khusus untuk operasional distribusi LPG:
 * - Batas stok kritis (untuk notifikasi)
 * - Prefix invoice
 * - PPN percentage
 * - Notifikasi email
 * - Auto-generate kode
 */

interface ApplicationState {
    criticalStockLimit: number
    invoicePrefix: string
    ppnPercentage: number
    priceRounding: string
    emailNotifications: boolean
    stockAlerts: boolean
    autoGenerateCode: boolean
    orderCodePrefix: string
}

const initialSettings: ApplicationState = {
    criticalStockLimit: 10,
    invoicePrefix: 'INV-',
    ppnPercentage: 11,
    priceRounding: '100',
    emailNotifications: true,
    stockAlerts: true,
    autoGenerateCode: true,
    orderCodePrefix: 'PO-'
}

export default function ApplicationSettings() {
    const [settings, setSettings] = useState<ApplicationState>(initialSettings)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Load settings from API on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const profile = await companyProfileApi.get()
                setSettings(prev => ({
                    ...prev,
                    ppnPercentage: Number(profile.ppn_rate) || 12,
                    criticalStockLimit: profile.critical_stock_limit || 10,
                    invoicePrefix: profile.invoice_prefix || 'INV-',
                    orderCodePrefix: profile.order_code_prefix || 'ORD-',
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
            // Save to backend via company profile API
            await companyProfileApi.update({
                ppn_rate: settings.ppnPercentage,
                critical_stock_limit: settings.criticalStockLimit,
                invoice_prefix: settings.invoicePrefix,
                order_code_prefix: settings.orderCodePrefix,
            })
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

            {/* Invoice & Pricing Settings */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10">
                            <SafeIcon name="Receipt" className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Invoice & Harga</CardTitle>
                            <CardDescription>Pengaturan format invoice dan perhitungan harga</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="invoicePrefix" className="text-sm font-medium">
                                Prefix Invoice
                            </Label>
                            <Input
                                id="invoicePrefix"
                                value={settings.invoicePrefix}
                                onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                                placeholder="INV-"
                                className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">
                                Contoh hasil: {settings.invoicePrefix}2024-0001
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orderCodePrefix" className="text-sm font-medium">
                                Prefix Kode Pesanan
                            </Label>
                            <Input
                                id="orderCodePrefix"
                                value={settings.orderCodePrefix}
                                onChange={(e) => handleChange('orderCodePrefix', e.target.value)}
                                placeholder="PO-"
                                className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">
                                Contoh hasil: {settings.orderCodePrefix}2024-0001
                            </p>
                        </div>
                    </div>

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
                                Tarif PPN yang berlaku untuk penjualan
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priceRounding" className="text-sm font-medium">
                                Pembulatan Harga
                            </Label>
                            <Select value={settings.priceRounding} onValueChange={(v) => handleChange('priceRounding', v)}>
                                <SelectTrigger id="priceRounding" className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Tidak ada pembulatan</SelectItem>
                                    <SelectItem value="100">Ke Rp 100 terdekat</SelectItem>
                                    <SelectItem value="1000">Ke Rp 1.000 terdekat</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Auto Generate Code Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Auto-Generate Kode Pesanan</p>
                            <p className="text-xs text-muted-foreground">
                                Buat kode pesanan secara otomatis saat membuat order baru
                            </p>
                        </div>
                        <Switch
                            checked={settings.autoGenerateCode}
                            onCheckedChange={(checked) => handleChange('autoGenerateCode', checked)}
                        />
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
