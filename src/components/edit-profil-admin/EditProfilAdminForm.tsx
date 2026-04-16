/**
 * EditProfilAdminForm - Form Edit Profil dengan Avatar Upload & Crop
 * 
 * PENJELASAN:
 * Form ini fetch profil dari API dan update menggunakan authApi.updateProfile()
 * Termasuk fitur upload foto profil dengan cropping menggunakan react-image-crop
 * 
 * Design: Responsive - Desktop original, Mobile compact modern
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import SafeIcon from '@/components/common/SafeIcon'
import AvatarCropperModal from '@/components/profil-admin/AvatarCropperModal'
import { authApi, uploadApi, type UserProfile } from '@/lib/api'

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000'

interface FormData {
  name: string
  phone: string
  avatar_url: string | null
}

interface FormErrors {
  name?: string
  phone?: string
}

export default function EditProfilAdminForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', avatar_url: null })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await authApi.getProfile()
        setProfile(data)
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url,
        })
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        toast.error('Gagal memuat profil')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nama minimal 2 karakter'
    }

    if (formData.phone && !/^(\+62|0)[0-9]{9,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle file selection - open cropper
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error('Format gambar harus JPEG, PNG, atau WebP')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
      setCropperOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // Handle cropped image
  const handleCropComplete = async (croppedBlob: Blob) => {
    const localPreviewUrl = URL.createObjectURL(croppedBlob)
    setAvatarPreview(localPreviewUrl)

    setIsUploading(true)
    try {
      const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
      const result = await uploadApi.uploadAvatar(file)
      setFormData(prev => ({ ...prev, avatar_url: result.url }))
      toast.success('Foto profil berhasil diupload')
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengupload foto')
      setAvatarPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Mohon periksa kembali data yang Anda masukkan')
      return
    }

    setIsSubmitting(true)

    try {
      await authApi.updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
        avatar_url: formData.avatar_url === null ? null : formData.avatar_url || undefined,
      })

      toast.success('Profil berhasil diperbarui')
      setTimeout(() => {
        window.location.href = '/profil'
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui profil')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    window.location.href = '/profil'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getAvatarUrl = (url: string | null) => {
    if (!url) return undefined
    if (url.startsWith('http')) return url
    return `${API_BASE_URL}/api${url}`
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        {/* Mobile Skeleton */}
        <div className="space-y-3 sm:hidden px-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
        {/* Desktop Skeleton */}
        <div className="hidden sm:block max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardContent className="p-8 flex items-center justify-center">
              <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
        <Card className="shadow-card">
          <CardContent className="p-6 sm:p-8 text-center">
            <SafeIcon name="AlertCircle" className="h-10 w-10 mx-auto mb-3 text-destructive" />
            <p className="text-sm text-destructive mb-3">Gagal memuat profil</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* ===== MOBILE VIEW - Compact Modern ===== */}
      <div className="sm:hidden space-y-3 animate-fadeInUp">
        {/* Photo Section */}
        <div className="glass-card rounded-xl p-4">
          <div className="px-3 py-1.5 bg-muted/30 -mx-4 -mt-4 mb-3 border-b border-border/50">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Foto Profil</h3>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                <AvatarImage src={avatarPreview || getAvatarUrl(formData.avatar_url)} alt={formData.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {getInitials(formData.name || 'U')}
                </AvatarFallback>
              </Avatar>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <SafeIcon name="Loader2" className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isSubmitting}
                className="h-8 text-xs"
              >
                <SafeIcon name="Camera" className="mr-1.5 h-3.5 w-3.5" />
                Pilih Foto
              </Button>
              {formData.avatar_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, avatar_url: null }))
                    setAvatarPreview(null)
                  }}
                  disabled={isSubmitting || isUploading}
                  className="h-8 text-xs text-destructive hover:text-destructive"
                >
                  <SafeIcon name="Trash2" className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Informasi Profil</h3>
          </div>
          <div className="p-4 space-y-3">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name-mobile" className="text-xs font-medium">Nama Lengkap *</Label>
              <Input
                id="name-mobile"
                name="name"
                type="text"
                placeholder="Nama lengkap"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`h-9 text-sm ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && (
                <p className="text-[10px] text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email - Read only */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Email</Label>
              <div className="px-3 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
                {profile.email}
              </div>
              <p className="text-[10px] text-muted-foreground">Email tidak dapat diubah</p>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone-mobile" className="text-xs font-medium">Nomor Telepon</Label>
              <Input
                id="phone-mobile"
                name="phone"
                type="tel"
                placeholder="08123456789"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`h-9 text-sm ${errors.phone ? 'border-destructive' : ''}`}
              />
              {errors.phone && (
                <p className="text-[10px] text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Role - Read only */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Role</Label>
              <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">
                {profile.role === 'ADMIN' ? 'Administrator' : 'Operator'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 p-4 pt-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 h-9 text-xs"
            >
              <SafeIcon name="X" className="mr-1.5 h-3.5 w-3.5" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              size="sm"
              className="flex-1 h-9 text-xs bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <SafeIcon name="Loader2" className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <SafeIcon name="Save" className="mr-1.5 h-3.5 w-3.5" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* ===== DESKTOP VIEW - Original Design ===== */}
      <div className="hidden sm:block max-w-2xl mx-auto space-y-6 animate-fadeInUp">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SafeIcon
              name="ArrowLeft"
              className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={handleCancel}
            />
            <h1 className="text-3xl font-bold text-foreground">Edit Profil</h1>
          </div>
          <p className="text-muted-foreground">Perbarui informasi dan foto profil Anda</p>
        </div>

        <Separator />

        {/* Avatar Upload Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Foto Profil</CardTitle>
            <CardDescription>
              Pilih dan crop foto profil Anda (maks. 5MB, format: JPEG, PNG, WebP)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-primary/20">
                  <AvatarImage src={avatarPreview || getAvatarUrl(formData.avatar_url)} alt={formData.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {getInitials(formData.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    <SafeIcon name="Camera" className="mr-2 h-4 w-4" />
                    Pilih Foto
                  </Button>
                  {formData.avatar_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, avatar_url: null }))
                        setAvatarPreview(null)
                      }}
                      disabled={isSubmitting || isUploading}
                      className="text-destructive hover:text-destructive ml-2"
                    >
                      <SafeIcon name="Trash2" className="mr-1 h-4 w-4" />
                      Hapus
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>
              Ubah data pribadi Anda di bawah ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Lengkap <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field - Read Only */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                  {profile.email}
                </div>
                <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Contoh: 08123456789 atau +6281234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Read-only Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <div className="px-3 py-2 bg-muted rounded-md text-sm">
                    {profile.role === 'ADMIN' ? 'Administrator' : 'Operator'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Bergabung</Label>
                  <div className="px-3 py-2 bg-muted rounded-md text-sm">
                    {formatDate(profile.created_at)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <SafeIcon name="X" className="mr-2 h-4 w-4" />
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
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
            </form>
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
    </>
  )
}
