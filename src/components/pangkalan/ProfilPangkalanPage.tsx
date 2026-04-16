/**
 * ProfilPangkalanPage - Profil User & Pangkalan
 * 
 * PENJELASAN:
 * Halaman profil untuk melihat dan edit data user dan info pangkalan.
 * Termasuk fitur:
 * - Edit nama dan nomor telepon
 * - Upload foto profil dengan CROP
 * - Ubah password
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/SafeIcon'
import AvatarCropperModal from '@/components/profil-admin/AvatarCropperModal'
import ChangePasswordModal from '@/components/profil-admin/ChangePasswordModal'
import { authApi, uploadApi, type UserProfile } from '@/lib/api'
import { toast } from 'sonner'

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000'

export default function ProfilPangkalanPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    })

    // Avatar crop state
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string>('')
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Change password modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setIsLoading(true)
            const data = await authApi.getProfile()
            setProfile(data)
            setFormData({
                name: data.name,
                phone: data.phone || '',
            })
        } catch (error) {
            console.error('Failed to fetch profile:', error)
            toast.error('Gagal memuat profil')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Nama tidak boleh kosong')
            return
        }

        try {
            setIsSubmitting(true)
            await authApi.updateProfile(formData)

            // Re-fetch profile to get complete data with pangkalans relation
            await fetchProfile()

            setIsEditing(false)
            setAvatarPreview(null) // Clear local preview
            toast.success('Profil berhasil diperbarui')
        } catch (error: any) {
            toast.error(error.message || 'Gagal memperbarui profil')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle file selection - open cropper
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
            toast.error('Format foto harus JPG, PNG, atau WebP')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 5MB')
            return
        }

        // Read file and open cropper
        const reader = new FileReader()
        reader.onload = () => {
            setSelectedImage(reader.result as string)
            setCropperOpen(true)
        }
        reader.readAsDataURL(file)

        // Clear input to allow re-selecting same file
        e.target.value = ''
    }

    // Handle cropped image - show preview then upload
    const handleCropComplete = async (croppedBlob: Blob) => {
        // Create local preview URL immediately
        const localPreviewUrl = URL.createObjectURL(croppedBlob)
        setAvatarPreview(localPreviewUrl)

        setIsUploading(true)
        try {
            // Convert blob to File
            const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })

            const result = await uploadApi.uploadAvatar(file)
            await authApi.updateProfile({ avatar_url: result.url })

            // Re-fetch profile to get complete data
            await fetchProfile()

            toast.success('Foto profil berhasil diperbarui')
        } catch (error: any) {
            toast.error(error.message || 'Gagal upload foto')
            // Clear preview on error
            setAvatarPreview(null)
        } finally {
            setIsUploading(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const getAvatarUrl = () => {
        // Priority: local preview > profile avatar
        if (avatarPreview) return avatarPreview
        if (!profile?.avatar_url) return undefined
        if (profile.avatar_url.startsWith('http')) return profile.avatar_url
        return `${API_BASE_URL}/api${profile.avatar_url}`
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-6 dashboard-gradient-bg min-h-screen">
            {/* Page Header */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                    Profil Saya
                </h1>
                <p className="text-muted-foreground">Kelola informasi akun dan pangkalan Anda</p>
            </div>

            {/* Gradient Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="grid gap-6 md:grid-cols-2">
                {/* User Profile Card - Modern Style */}
                <Card className="glass-card border-0">
                    <CardHeader className="bg-gradient-to-r from-emerald-600/10 to-emerald-400/5 rounded-t-lg border-b border-emerald-100/50 dark:border-emerald-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10">
                                <SafeIcon name="UserCircle" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Informasi Akun</CardTitle>
                                <CardDescription>Data akun login Anda</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-20 w-20 ring-4 ring-emerald-100 dark:ring-emerald-900/50">
                                    <AvatarImage src={getAvatarUrl()} />
                                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xl font-semibold">
                                        {profile ? getInitials(profile.name) : 'P'}
                                    </AvatarFallback>
                                </Avatar>
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                        <SafeIcon name="Loader2" className="h-6 w-6 animate-spin text-white" />
                                    </div>
                                )}
                                {/* Only show camera button when editing */}
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-all shadow-lg hover:scale-110">
                                        <SafeIcon name="Camera" className="h-4 w-4 text-white" />
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-lg">{profile?.name}</p>
                                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <SafeIcon name="Building2" className="h-3 w-3" />
                                    Pangkalan
                                </span>
                            </div>
                        </div>

                        <Separator />

                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">Nama</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Masukkan nama"
                                        className="bg-background"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">No. Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Contoh: 081234567890"
                                        className="bg-background"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button onClick={handleSave} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        {isSubmitting ? <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> : <SafeIcon name="Save" className="mr-2 h-4 w-4" />}
                                        Simpan
                                    </Button>
                                    <Button variant="outline" onClick={() => {
                                        setIsEditing(false)
                                        setAvatarPreview(null)
                                        // Reset form to original values
                                        setFormData({
                                            name: profile?.name || '',
                                            phone: profile?.phone || '',
                                        })
                                    }}>
                                        Batal
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <SafeIcon name="User" className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Nama</p>
                                        <p className="font-medium">{profile?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <SafeIcon name="Mail" className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="font-medium">{profile?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <SafeIcon name="Phone" className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">No. Telepon</p>
                                        <p className="font-medium">{profile?.phone || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" onClick={() => setIsEditing(true)} className="hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700">
                                        <SafeIcon name="Pencil" className="mr-2 h-4 w-4" />
                                        Edit Profil
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowPasswordModal(true)} className="hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700">
                                        <SafeIcon name="Lock" className="mr-2 h-4 w-4" />
                                        Ubah Password
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pangkalan Info Card - Modern Style */}
                <Card className="glass-card border-0">
                    <CardHeader className="bg-gradient-to-r from-blue-600/10 to-blue-400/5 rounded-t-lg border-b border-blue-100/50 dark:border-blue-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-500/10">
                                <SafeIcon name="Store" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Informasi Pangkalan</CardTitle>
                                <CardDescription>Data pangkalan Anda</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        {/* Kode Pangkalan */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <SafeIcon name="Hash" className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Kode Pangkalan</p>
                                <p className="font-mono font-semibold text-blue-600">{profile?.pangkalans?.code || '-'}</p>
                            </div>
                        </div>

                        {/* Nama Pangkalan */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <SafeIcon name="Building2" className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Nama Pangkalan</p>
                                <p className="font-semibold">{profile?.pangkalans?.name || '-'}</p>
                            </div>
                        </div>

                        {/* Alamat Lengkap */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <SafeIcon name="MapPin" className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Alamat Lengkap</p>
                                <p className="font-medium">{profile?.pangkalans?.address || '-'}</p>
                                {profile?.pangkalans?.region && (
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {profile.pangkalans.region}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                            <SafeIcon name="Info" className="h-4 w-4 text-amber-600 shrink-0" />
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                                Untuk mengubah informasi pangkalan, silakan hubungi administrator.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Avatar Cropper Modal */}
            <AvatarCropperModal
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageSrc={selectedImage}
                onCropComplete={handleCropComplete}
            />

            {/* Change Password Modal - Uses enterprise component from profil-admin */}
            <ChangePasswordModal
                open={showPasswordModal}
                onOpenChange={setShowPasswordModal}
            />
        </div>
    )
}
