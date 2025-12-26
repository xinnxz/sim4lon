
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { usersApi } from '@/lib/api'

interface AddUserFormProps {
  onClose?: () => void
}

interface FormData {
  nama: string
  telepon: string
  email: string
  role: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  [key: string]: string
}

const roleOptions = [
  { value: 'Admin', label: 'Administrator' },
  { value: 'Operator', label: 'Operator Lapangan' },
]

export default function AddUserForm({ onClose }: AddUserFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    telepon: '',
    email: '',
    role: 'Operator',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate nama
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi'
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = 'Nama minimal 3 karakter'
    }

    // Validate telepon
    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Nomor telepon harus diisi'
    } else if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.telepon.replace(/\s/g, ''))) {
      newErrors.telepon = 'Format nomor telepon tidak valid'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    // Validate role
    if (!formData.role) {
      newErrors.role = 'Peran harus dipilih'
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Kata sandi harus diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter'
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi harus diisi'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Kata sandi tidak cocok'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Mohon periksa kembali form Anda')
      return
    }

    setIsLoading(true)

    try {
      // Map role value to backend enum
      const roleMap: Record<string, 'ADMIN' | 'OPERATOR'> = {
        'Admin': 'ADMIN',
        'Operator': 'OPERATOR'
      }

      await usersApi.create({
        email: formData.email,
        password: formData.password,
        name: formData.nama,
        phone: formData.telepon,
        role: roleMap[formData.role] || 'OPERATOR'
      })

      toast.success('Pengguna berhasil ditambahkan')

      // Close modal or redirect based on context
      setTimeout(() => {
        if (onClose) {
          onClose()
        } else {
          window.location.href = '/daftar-pengguna'
        }
      }, 500)
    } catch (error: any) {
      const message = error?.message || 'Gagal menambahkan pengguna. Silakan coba lagi.'
      toast.error(message)
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      window.location.href = './daftar-pengguna.html'
    }
  }

  return (
    <Card className="border shadow-card animate-scaleIn">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <SafeIcon name="UserPlus" className="h-5 w-5 text-primary" />
          Form Pendaftaran Pengguna
        </CardTitle>
        <CardDescription>
          Isi semua field di bawah untuk mendaftarkan pengguna baru
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Alert */}
          <Alert className="border-primary/20 bg-primary/5">
            <SafeIcon name="Info" className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-foreground">
              Pengguna yang didaftarkan akan langsung aktif dan dapat mengakses sistem sesuai dengan peran yang diberikan.
            </AlertDescription>
          </Alert>

          {/* Nama Field */}
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-sm font-medium">
              Nama Lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nama"
              name="nama"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.nama}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.nama ? 'border-destructive' : ''}
              aria-invalid={!!errors.nama}
            />
            {errors.nama && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-4 w-4" />
                {errors.nama}
              </p>
            )}
          </div>

          {/* Telepon Field */}
          <div className="space-y-2">
            <Label htmlFor="telepon" className="text-sm font-medium">
              Nomor Telepon <span className="text-destructive">*</span>
            </Label>
            <Input
              id="telepon"
              name="telepon"
              type="tel"
              placeholder="Contoh: 08123456789 atau +6281234567890"
              value={formData.telepon}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.telepon ? 'border-destructive' : ''}
              aria-invalid={!!errors.telepon}
            />
            {errors.telepon && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-4 w-4" />
                {errors.telepon}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Contoh: user@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.email ? 'border-destructive' : ''}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-4 w-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Peran <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange} disabled={isLoading}>
              <SelectTrigger
                id="role"
                className={errors.role ? 'border-destructive' : ''}
                aria-invalid={!!errors.role}
              >
                <SelectValue placeholder="Pilih peran pengguna" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-4 w-4" />
                {errors.role}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Pilih peran yang sesuai dengan tanggung jawab pengguna
            </p>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Kata Sandi <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                <SafeIcon
                  name={showPassword ? 'EyeOff' : 'Eye'}
                  className="h-4 w-4"
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-4 w-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Konfirmasi Kata Sandi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan ulang kata sandi"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.confirmPassword ? 'border-destructive' : ''}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-4 w-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              <SafeIcon name="X" className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <SafeIcon name="Save" className="mr-2 h-4 w-4" />
                  Simpan Pengguna
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
