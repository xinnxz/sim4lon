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
    { value: 'green', label: 'Hijau', color: 'bg-emerald-600', description: 'Default Pertamina' },
    { value: 'blue', label: 'Biru', color: 'bg-blue-600', description: 'Professional Blue' },
    { value: 'red', label: 'Merah', color: 'bg-red-600', description: 'Bold & Modern' }
]

export default function AppearanceSettings() {
    const [settings, setSettings] = useState<AppearanceState>(initialSettings)
    const [isSaving, setIsSaving] = useState(false)

    // Load saved theme and accent on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme
        const savedAccent = localStorage.getItem('accentColor')
        if (savedTheme) {
            setSettings(prev => ({ ...prev, theme: savedTheme }))
        }
        if (savedAccent) {
            setSettings(prev => ({ ...prev, accentColor: savedAccent }))
            // Apply saved accent color immediately
            document.documentElement.setAttribute('data-accent', savedAccent)
        }
    }, [])

    const handleThemeChange = (theme: Theme) => {
        setSettings(prev => ({ ...prev, theme }))
        // Preview theme immediately (but don't save yet)
        const root = document.documentElement
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            root.classList.remove('light', 'dark')
            root.classList.add(systemTheme)
        } else {
            root.classList.remove('light', 'dark')
            root.classList.add(theme)
        }
        // Note: Don't save to localStorage here - only on Save button click
    }

    const handleChange = (field: keyof AppearanceState, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }))
        // Preview accent color immediately (but don't save yet)
        if (field === 'accentColor') {
            document.documentElement.setAttribute('data-accent', value)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            // Save theme to localStorage
            localStorage.setItem('theme', settings.theme)
            // Save accent color to localStorage
            localStorage.setItem('accentColor', settings.accentColor)
            // Save all settings
            localStorage.setItem('appearance_settings', JSON.stringify(settings))
            toast.success('Pengaturan tampilan berhasil disimpan')
        } catch (error) {
            toast.error('Gagal menyimpan pengaturan')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Theme Selection - Compact */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-2 pt-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10">
                            <SafeIcon name="Palette" className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                            <CardTitle className="text-sm sm:text-base">Tema Aplikasi</CardTitle>
                            <CardDescription className="text-xs hidden sm:block">Pilih tampilan yang nyaman untuk mata Anda</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                    <div className="grid gap-2 grid-cols-3">
                        {themeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleThemeChange(option.value as Theme)}
                                className={`relative flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:border-primary/50 hover:bg-muted/50
                  ${settings.theme === option.value
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-muted-foreground/20'
                                    }`}
                            >
                                {/* Theme Icon */}
                                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg transition-all duration-200
                  ${settings.theme === option.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    <SafeIcon name={option.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>

                                {/* Label */}
                                <div className="text-center">
                                    <p className={`text-xs sm:text-sm font-medium ${settings.theme === option.value ? 'text-primary' : 'text-foreground'}`}>
                                        {option.label}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block line-clamp-1">
                                        {option.description}
                                    </p>
                                </div>

                                {/* Check indicator */}
                                {settings.theme === option.value && (
                                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <SafeIcon name="Check" className="h-2.5 w-2.5" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Accent Color - Compact Inline */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-2 pt-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                            <SafeIcon name="Brush" className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-sm sm:text-base">Warna Aksen</CardTitle>
                            <CardDescription className="text-xs hidden sm:block">Pilih warna utama untuk tombol dan elemen interaktif</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                    <div className="flex flex-wrap gap-2">
                        {accentColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => handleChange('accentColor', color.value)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all duration-200
                  ${settings.accentColor === color.value
                                        ? 'border-primary bg-primary/5'
                                        : 'border-transparent bg-muted/50 hover:bg-muted'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full ${color.color}`} />
                                <span className="text-xs sm:text-sm font-medium">{color.label}</span>
                                {settings.accentColor === color.value && (
                                    <SafeIcon name="Check" className="h-3.5 w-3.5 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Regional Settings - Compact */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-2 pt-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10">
                            <SafeIcon name="Globe" className="h-4 w-4 text-cyan-600" />
                        </div>
                        <div>
                            <CardTitle className="text-sm sm:text-base">Regional</CardTitle>
                            <CardDescription className="text-xs hidden sm:block">Pengaturan bahasa dan format tanggal</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                    <div className="grid gap-3 grid-cols-2">
                        <div className="space-y-1">
                            <Label htmlFor="language" className="text-xs font-medium">Bahasa</Label>
                            <Select value={settings.language} onValueChange={(v) => handleChange('language', v)}>
                                <SelectTrigger id="language" className="h-8 text-xs sm:text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                                    <SelectItem value="en">🇺🇸 English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="dateFormat" className="text-xs font-medium">Format Tanggal</Label>
                            <Select value={settings.dateFormat} onValueChange={(v) => handleChange('dateFormat', v)}>
                                <SelectTrigger id="dateFormat" className="h-8 text-xs sm:text-sm">
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

            {/* Save Button - Compact */}
            <div className="flex justify-end gap-2 pt-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSettings(initialSettings)}
                    className="gap-1.5 h-8 text-xs"
                >
                    <SafeIcon name="RotateCcw" className="h-3.5 w-3.5" />
                    Reset
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="sm"
                    className="gap-1.5 h-8 text-xs bg-primary hover:bg-primary/90 min-w-[100px]"
                >
                    {isSaving ? (
                        <>
                            <SafeIcon name="Loader2" className="h-3.5 w-3.5 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <SafeIcon name="Save" className="h-3.5 w-3.5" />
                            Simpan
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
