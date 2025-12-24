/**
 * EditProfilAdminForm - Form Edit Profil dengan Avatar Upload & Crop
 * 
 * PENJELASAN:
 * Form ini fetch profil dari API dan update menggunakan authApi.updateProfile()
 * Termasuk fitur upload foto profil dengan cropping menggunakan react-image-crop
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null) // Local blob preview
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
      newErrors.phone = 'Format nomor telepon tidak valid (contoh: 08xxx atau +62xxx)'
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

    // Validate file type - no GIF allowed
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error('Gambar kudu wajib JPEG, PNG, WebP.')
      return
    }

    // Validate file size (max 5MB for source - will be compressed after crop)
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

  // Handle cropped image - show preview immediately then upload
  const handleCropComplete = async (croppedBlob: Blob) => {
    console.log('handleCropComplete called with blob:', croppedBlob.size, 'bytes')

    // Create local preview URL immediately
    const localPreviewUrl = URL.createObjectURL(croppedBlob)
    console.log('Local preview URL created:', localPreviewUrl)
    setAvatarPreview(localPreviewUrl)

    setIsUploading(true)
    try {
      // Convert blob to File
      const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
      console.log('File created:', file.name, file.size, 'bytes')

      const result = await uploadApi.uploadAvatar(file)
      console.log('Upload result:', result)
      setFormData(prev => ({ ...prev, avatar_url: result.url }))
      toast.success('Foto profil berhasil diupload')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Gagal mengupload foto')
      // Clear preview on error
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
      // Send null explicitly if avatar was removed, undefined if unchanged
      await authApi.updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
        avatar_url: formData.avatar_url === null ? null : formData.avatar_url || undefined,
      })

      toast.success('Profil berhasil diperbarui')

      setTimeout(() => {
        window.location.href = '/profil-admin'
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui profil')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    window.location.href = '/profil-admin'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarUrl = (url: string | null) => {
    if (!url) return undefined
    if (url.startsWith('http')) return url
    // Backend serves at /api/upload/avatars, but returns /upload/avatars in URL
    return `${API_BASE_URL}/api${url}`
  }

  // Loading state - maintain height to prevent footer jump
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto min-h-[400px] flex items-center justify-center">
        <Card className="shadow-card w-full">
          <CardContent className="p-8 flex items-center justify-center">
            <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto min-h-[400px] flex items-center justify-center">
        <Card className="shadow-card w-full">
          <CardContent className="p-8 text-center">
            <SafeIcon name="AlertCircle" className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">Gagal memuat profil</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeInUp">
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
            {/* Avatar Preview */}
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

            {/* Upload Controls */}
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

      {/* Avatar Cropper Modal */}
      <AvatarCropperModal
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
      />
    </div>
  )
}
