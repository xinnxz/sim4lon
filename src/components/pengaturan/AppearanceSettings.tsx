'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

/**
 * AppearanceSettings - Tab Tampilan
 * 
 * Pengaturan visual aplikasi:
 * - Tema (Light/Dark/System)
 * - Bahasa
 * - Format Tanggal
 */

type Theme = 'light' | 'dark' | 'system'

interface AppearanceState {
    theme: Theme
    language: string
    dateFormat: string
    accentColor: string
}

const initialSettings: AppearanceState = {
    theme: 'system',
    language: 'id',
    dateFormat: 'DD/MM/YYYY',
    accentColor: 'green'
}

const themeOptions = [
    { value: 'light', label: 'Terang', icon: 'Sun', description: 'Mode terang untuk penggunaan siang hari' },
    { value: 'dark', label: 'Gelap', icon: 'Moon', description: 'Mode gelap untuk penggunaan malam hari' },
    { value: 'system', label: 'Sistem', icon: 'Monitor', description: 'Ikuti pengaturan sistem operasi' }
]

const accentColors = [
    { value: 'green', label: 'Hijau (Default)', color: 'bg-emerald-500' },
    { value: 'blue', label: 'Biru', color: 'bg-blue-500' },
    { value: 'purple', label: 'Ungu', color: 'bg-purple-500' },
    { value: 'orange', label: 'Oranye', color: 'bg-orange-500' }
]

export default function AppearanceSettings() {
    const [settings, setSettings] = useState<AppearanceState>(initialSettings)
    const [isSaving, setIsSaving] = useState(false)

    // Load saved theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme) {
            setSettings(prev => ({ ...prev, theme: savedTheme }))
        }
    }, [])

    const handleThemeChange = (theme: Theme) => {
        setSettings(prev => ({ ...prev, theme }))

        // Apply theme immediately
        const root = document.documentElement

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            root.classList.remove('light', 'dark')
            root.classList.add(systemTheme)
        } else {
            root.classList.remove('light', 'dark')
            root.classList.add(theme)
        }

        localStorage.setItem('theme', theme)
        toast.success(`Tema diubah ke ${themeOptions.find(t => t.value === theme)?.label}`)
    }

    const handleChange = (field: keyof AppearanceState, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            localStorage.setItem('appearance_settings', JSON.stringify(settings))
            toast.success('Pengaturan tampilan berhasil disimpan')
        } catch (error) {
            toast.error('Gagal menyimpan pengaturan')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Theme Selection */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/10">
                            <SafeIcon name="Palette" className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Tema Aplikasi</CardTitle>
                            <CardDescription>Pilih tampilan yang nyaman untuk mata Anda</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {themeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleThemeChange(option.value as Theme)}
                                className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-300 hover:border-primary/50 hover:bg-muted/50 group
                  ${settings.theme === option.value
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-muted-foreground/20'
                                    }`}
                            >
                                {/* Theme Icon */}
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300
                  ${settings.theme === option.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                                    }`}
                                >
                                    <SafeIcon name={option.icon} className="h-6 w-6" />
                                </div>

                                {/* Label */}
                                <div className="text-center">
                                    <p className={`font-medium ${settings.theme === option.value ? 'text-primary' : 'text-foreground'}`}>
                                        {option.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {option.description}
                                    </p>
                                </div>

                                {/* Check indicator */}
                                {settings.theme === option.value && (
                                    <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <SafeIcon name="Check" className="h-3 w-3" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Accent Color */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                            <SafeIcon name="Brush" className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Warna Aksen</CardTitle>
                            <CardDescription>Pilih warna utama untuk tombol dan elemen interaktif</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {accentColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => handleChange('accentColor', color.value)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 transition-all duration-200
                  ${settings.accentColor === color.value
                                        ? 'border-primary bg-primary/5'
                                        : 'border-transparent bg-muted/50 hover:bg-muted'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full ${color.color}`} />
                                <span className="text-sm font-medium">{color.label}</span>
                                {settings.accentColor === color.value && (
                                    <SafeIcon name="Check" className="h-4 w-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                        * Perubahan warna aksen memerlukan reload halaman
                    </p>
                </CardContent>
            </Card>

            {/* Regional Settings */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10">
                            <SafeIcon name="Globe" className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Regional</CardTitle>
                            <CardDescription>Pengaturan bahasa dan format tanggal</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="language" className="text-sm font-medium">Bahasa</Label>
                            <Select value={settings.language} onValueChange={(v) => handleChange('language', v)}>
                                <SelectTrigger id="language" className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                                    <SelectItem value="en">🇺🇸 English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateFormat" className="text-sm font-medium">Format Tanggal</Label>
                            <Select value={settings.dateFormat} onValueChange={(v) => handleChange('dateFormat', v)}>
                                <SelectTrigger id="dateFormat" className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</SelectItem>
                                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</SelectItem>
                                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</SelectItem>
                                </SelectContent>
                            </Select>
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
                            Simpan Tampilan
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
