/**
 * ProfilPangkalanPage - Profil User & Pangkalan
 * 
 * PENJELASAN:
 * Halaman profil untuk melihat dan edit data user dan info pangkalan.
 * Termasuk fitur:
 * - Edit nama dan nomor telepon
 * - Upload foto profil
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

    // Change password modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

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
            toast.success('Profil berhasil diperbarui')
        } catch (error: any) {
            toast.error(error.message || 'Gagal memperbarui profil')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
            toast.error('Format gambar harus JPEG, PNG, atau WebP')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 5MB')
            return
        }

        try {
            setIsUploading(true)
            const uploadResult = await uploadApi.uploadAvatar(file)
            await authApi.updateProfile({ avatar_url: uploadResult.url })

            // Re-fetch profile to get complete data
            await fetchProfile()

            toast.success('Foto profil berhasil diperbarui')
        } catch (error: any) {
            toast.error(error.message || 'Gagal upload foto')
        } finally {
            setIsUploading(false)
            // Clear input to allow re-selecting same file
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleChangePassword = async () => {
        // Validation
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error('Semua field harus diisi')
            return
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('Password baru minimal 6 karakter')
            return
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok')
            return
        }

        try {
            setIsChangingPassword(true)
            await authApi.changePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
            })

            toast.success('Password berhasil diubah')
            setShowPasswordModal(false)
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengubah password')
        } finally {
            setIsChangingPassword(false)
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

    const getAvatarUrl = (url: string | null | undefined) => {
        if (!url) return undefined
        if (url.startsWith('http')) return url
        return `${API_BASE_URL}/api${url}`
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
                <p className="text-muted-foreground">Kelola informasi akun Anda</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* User Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Akun</CardTitle>
                        <CardDescription>Data akun login Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={getAvatarUrl(profile?.avatar_url)} />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
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
                                    <label className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                                        <SafeIcon name="Camera" className="h-4 w-4 text-white" />
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold">{profile?.name}</p>
                                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                            </div>
                        </div>

                        <Separator />

                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Masukkan nama"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">No. Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Contoh: 081234567890"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                                        {isSubmitting ? <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Simpan
                                    </Button>
                                    <Button variant="outline" onClick={() => {
                                        setIsEditing(false)
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
                                <div>
                                    <p className="text-sm text-muted-foreground">Nama</p>
                                    <p className="font-medium">{profile?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{profile?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">No. Telepon</p>
                                    <p className="font-medium">{profile?.phone || '-'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                                        <SafeIcon name="Pencil" className="mr-2 h-4 w-4" />
                                        Edit Profil
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                                        <SafeIcon name="Lock" className="mr-2 h-4 w-4" />
                                        Ubah Password
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pangkalan Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Pangkalan</CardTitle>
                        <CardDescription>Data pangkalan Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Kode</p>
                            <p className="font-medium">{profile?.pangkalans?.code || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Nama Pangkalan</p>
                            <p className="font-medium">{profile?.pangkalans?.name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Alamat</p>
                            <p className="font-medium">{profile?.pangkalans?.address || '-'}</p>
                        </div>
                        <Separator />

                        <p className="text-xs text-muted-foreground">
                            Untuk mengubah informasi pangkalan, silakan hubungi administrator.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Change Password Modal */}
            <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ubah Password</DialogTitle>
                        <DialogDescription>
                            Masukkan password lama dan password baru Anda
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Password Lama</Label>
                            <Input
                                id="oldPassword"
                                type="password"
                                value={passwordForm.oldPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                placeholder="Masukkan password lama"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Password Baru</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="Minimal 6 karakter"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="Ulangi password baru"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowPasswordModal(false)
                            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
                        }}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isChangingPassword && <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />}
                            Ubah Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
