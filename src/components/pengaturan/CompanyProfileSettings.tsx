'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { companyProfileApi, type CompanyProfile } from '@/lib/api'

/**
 * CompanyProfileSettings - Tab Profil Perusahaan
 * 
 * Berisi informasi distributor LPG:
 * - Nama perusahaan
 * - Alamat lengkap
 * - Kontak (telepon, email)
 * - PIC (Person In Charge)
 * - Logo perusahaan
 * - Nomor SPPBE
 * - Wilayah/Region
 * 
 * Data disimpan di database via API /company-profile
 */

interface ProfileFormData {
    companyName: string
    address: string
    phone: string
    email: string
    picName: string
    sppbeNumber: string
    region: string
    logo: string | null
}

const initialProfile: ProfileFormData = {
    companyName: '',
    address: '',
    phone: '',
    email: '',
    picName: '',
    sppbeNumber: '',
    region: '',
    logo: null
}

export default function CompanyProfileSettings() {
    const [profile, setProfile] = useState<ProfileFormData>(initialProfile)
    const [agenId, setAgenId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    // Load profile from API on mount
    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        setIsLoading(true)
        try {
            const data = await companyProfileApi.get()
            // Map API response to form data
            setProfile({
                companyName: data.company_name || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                picName: data.pic_name || '',
                sppbeNumber: data.sppbe_number || '',
                region: data.region || '',
                logo: data.logo_url || null
            })
            setAgenId(data.id || null) // id is now the 6-digit agen code
            if (data.logo_url) {
                setLogoPreview(data.logo_url)
            }
        } catch (error) {
            console.error('Failed to load company profile:', error)
            toast.error('Gagal memuat profil perusahaan')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: keyof ProfileFormData, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }))
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 2MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result as string)
                setProfile(prev => ({ ...prev, logo: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        // Validation
        if (!profile.companyName.trim()) {
            toast.error('Nama perusahaan wajib diisi')
            return
        }
        if (!profile.address.trim()) {
            toast.error('Alamat wajib diisi')
            return
        }

        setIsSaving(true)
        try {
            await companyProfileApi.update({
                company_name: profile.companyName,
                address: profile.address,
                phone: profile.phone || undefined,
                email: profile.email || undefined,
                pic_name: profile.picName || undefined,
                sppbe_number: profile.sppbeNumber || undefined,
                region: profile.region || undefined,
                logo_url: profile.logo || undefined,
            })
            toast.success('Profil perusahaan berhasil disimpan')
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan profil')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Memuat profil...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Company Info Card */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                            <SafeIcon name="Building2" className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Informasi Perusahaan</CardTitle>
                            <CardDescription>Data distributor yang muncul di invoice dan laporan PDF</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* ID Agen Display - for pangkalan connection */}
                    {agenId && (
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
                                    <SafeIcon name="Key" className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-medium">ID Agen (Kode Koneksi)</p>
                                    <p className="text-2xl font-bold text-blue-800 tracking-wider">{agenId}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-600 hover:bg-blue-100"
                                onClick={() => {
                                    navigator.clipboard.writeText(agenId)
                                    toast.success('ID Agen disalin!')
                                }}
                            >
                                <SafeIcon name="Copy" className="h-4 w-4 mr-1" />
                                Salin
                            </Button>
                        </div>
                    )}

                    {/* Logo Upload */}
                    <div className="flex items-start gap-6 p-4 rounded-xl bg-muted/30 border border-dashed">
                        <div className="flex-shrink-0">
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="w-24 h-24 rounded-xl object-cover border-2 border-primary/20"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                                    <SafeIcon name="Image" className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label className="text-sm font-medium">Logo Perusahaan</Label>
                            <p className="text-xs text-muted-foreground">
                                Upload logo untuk ditampilkan di header dan invoice. Format: JPG, PNG. Maks 2MB.
                            </p>
                            <Input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleLogoChange}
                                className="max-w-xs h-9 text-sm cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-sm font-medium">
                                Nama Distributor/Agen <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="companyName"
                                value={profile.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                placeholder="PT. Sigap Elpiji Nusantara"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sppbeNumber" className="text-sm font-medium">
                                Nomor SPPBE/SIID
                            </Label>
                            <Input
                                id="sppbeNumber"
                                value={profile.sppbeNumber}
                                onChange={(e) => handleChange('sppbeNumber', e.target.value)}
                                placeholder="997904"
                                className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">Nomor Surat Penunjukan / SIID To</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">
                            Alamat Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="address"
                            value={profile.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            placeholder="Jl. HR Rasuna Said Kav. X-8, No. 5E, Jakarta Selatan"
                            className="min-h-[80px] resize-none"
                        />
                    </div>

                    {/* Region */}
                    <div className="space-y-2">
                        <Label htmlFor="region" className="text-sm font-medium">
                            Wilayah/Region
                        </Label>
                        <Input
                            id="region"
                            value={profile.region}
                            onChange={(e) => handleChange('region', e.target.value)}
                            placeholder="JAWA BARAT, KABUPATEN CIANJUR"
                            className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">Wilayah operasional untuk laporan Pertamina</p>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Info Card */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                            <SafeIcon name="Phone" className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Kontak</CardTitle>
                            <CardDescription>Informasi kontak untuk keperluan komunikasi</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">
                                Nomor Telepon
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="021-98765432"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="info@distributor.com"
                                className="h-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="picName" className="text-sm font-medium">
                            Nama PIC (Person In Charge)
                        </Label>
                        <Input
                            id="picName"
                            value={profile.picName}
                            onChange={(e) => handleChange('picName', e.target.value)}
                            placeholder="Nama penanggung jawab"
                            className="h-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-2">
                <Button
                    variant="outline"
                    onClick={loadProfile}
                    className="gap-2"
                    disabled={isLoading}
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
                            Simpan Profil
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
