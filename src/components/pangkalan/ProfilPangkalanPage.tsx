/**
 * ProfilPangkalanPage - Profil User & Pangkalan
 * 
 * PENJELASAN:
 * Halaman profil untuk melihat dan edit data user dan info pangkalan.
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import { authApi, uploadApi, type UserProfile } from '@/lib/api'
import { toast } from 'sonner'

export default function ProfilPangkalanPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    })

    useEffect(() => {
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
        fetchProfile()
    }, [])

    const handleSave = async () => {
        try {
            setIsSubmitting(true)
            const result = await authApi.updateProfile(formData)
            setProfile(result.user)
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

        try {
            const uploadResult = await uploadApi.uploadAvatar(file)
            const result = await authApi.updateProfile({ avatar_url: uploadResult.url })
            setProfile(result.user)
            toast.success('Foto profil berhasil diperbarui')
        } catch (error: any) {
            toast.error(error.message || 'Gagal upload foto')
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
                                    <AvatarImage src={profile?.avatar_url || undefined} />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                                        {profile ? getInitials(profile.name) : 'P'}
                                    </AvatarFallback>
                                </Avatar>
                                <label className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700">
                                    <SafeIcon name="Camera" className="h-4 w-4 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">No. Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                                        {isSubmitting ? <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Simpan
                                    </Button>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                                <Button variant="outline" onClick={() => setIsEditing(true)}>
                                    <SafeIcon name="Pencil" className="mr-2 h-4 w-4" />
                                    Edit Profil
                                </Button>
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
                        <div>
                            <p className="text-sm text-muted-foreground">Telepon Pangkalan</p>
                            <p className="font-medium">{profile?.pangkalans?.phone || '-'}</p>
                        </div>

                        <Separator />

                        <p className="text-xs text-muted-foreground">
                            Untuk mengubah informasi pangkalan, silakan hubungi administrator.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
