
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { toast } from 'sonner'
import { usersApi } from '@/lib/api'

const roleOptions = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'OPERATOR', label: 'Operator Lapangan' }
]

interface EditUserFormProps {
  onClose?: () => void
  userId?: string
}

export default function EditUserForm({ onClose, userId }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    telepon: '',
    email: '',
    role: 'OPERATOR',
    status: 'aktif',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [copiedPassword, setCopiedPassword] = useState(false)

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setIsFetching(false)
        return
      }
      try {
        const user = await usersApi.getById(userId)
        setFormData({
          nama: user.name,
          telepon: user.phone || '',
          email: user.email,
          role: user.role,
          status: user.is_active ? 'aktif' : 'nonaktif',
        })
      } catch (error) {
        console.error('Failed to fetch user:', error)
        toast.error('Gagal memuat data pengguna')
      } finally {
        setIsFetching(false)
      }
    }
    fetchUser()
  }, [userId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama pengguna harus diisi'
    }

    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Nomor telepon harus diisi'
    } else if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.telepon.replace(/\s/g, ''))) {
      newErrors.telepon = 'Format nomor telepon tidak valid'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.role) {
      newErrors.role = 'Peran pengguna harus dipilih'
    }

    if (!formData.status) {
      newErrors.status = 'Status pengguna harus dipilih'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Mohon periksa kembali form Anda')
      return
    }

    if (!userId) {
      toast.error('ID pengguna tidak ditemukan')
      return
    }

    setIsLoading(true)
    try {
      // Note: email tidak bisa diubah setelah user dibuat
      await usersApi.update(userId, {
        name: formData.nama,
        phone: formData.telepon,
        role: formData.role as 'ADMIN' | 'OPERATOR',
        is_active: formData.status === 'aktif',
      })

      toast.success('Data pengguna berhasil diperbarui')

      // Close modal or redirect
      setTimeout(() => {
        if (onClose) {
          onClose()
        } else {
          window.location.href = '/daftar-pengguna'
        }
      }, 500)
    } catch (error: any) {
      const message = error?.message || 'Gagal memperbarui data pengguna'
      toast.error(message)
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      window.location.href = '/daftar-pengguna'
    }
  }

  const [isResettingPassword, setIsResettingPassword] = useState(false)

  /**
   * Reset password via backend API
   * Password baru disimpan ke database dan dikembalikan ke admin
   */
  const generateRandomPassword = async () => {
    if (!userId) {
      toast.error('ID pengguna tidak ditemukan')
      return
    }

    setIsResettingPassword(true)
    try {
      const response = await usersApi.resetPassword(userId)
      setGeneratedPassword(response.newPassword)
      setCopiedPassword(false)
      toast.success('Password berhasil direset dan disimpan ke database')
    } catch (error) {
      console.error('Failed to reset password:', error)
      toast.error('Gagal mereset password')
    } finally {
      setIsResettingPassword(false)
    }
  }

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword)
    setCopiedPassword(true)
    setTimeout(() => setCopiedPassword(false), 2000)
  }

  return (
    <>
      <Card className="border shadow-card">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="UserEdit" className="h-5 w-5 text-primary" />
            Edit Data Pengguna
          </CardTitle>
          <CardDescription>
            ID Pengguna: <span className="font-mono font-semibold text-foreground">{userId || '-'}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Nama Pengguna */}
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-sm font-semibold">
                Nama Pengguna <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Masukkan nama pengguna"
                value={formData.nama}
                onChange={handleInputChange}
                className={`h-10 ${errors.nama ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.nama && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.nama}
                </p>
              )}
            </div>

            {/* Nomor Telepon */}
            <div className="space-y-2">
              <Label htmlFor="telepon" className="text-sm font-semibold">
                Nomor Telepon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="telepon"
                name="telepon"
                placeholder="Contoh: 081234567890"
                value={formData.telepon}
                onChange={handleInputChange}
                className={`h-10 ${errors.telepon ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.telepon && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.telepon}
                </p>
              )}
            </div>

            {/* Email (Read-Only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                Email
                <span className="text-xs font-normal bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Read-only</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                readOnly
                disabled
                className="h-10 bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold">
                Peran Pengguna <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={`h-10 ${errors.role ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
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
            </div>

            {/* Password Reset Button */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SafeIcon name="Key" className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Reset Password Pengguna</p>
                  <p className="text-muted-foreground text-xs">Generate password baru untuk pengguna yang lupa kata sandi</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowResetPassword(true)}
                disabled={isLoading}
                className="shrink-0 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <SafeIcon name="RotateCw" className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
              <SafeIcon name="Info" className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-semibold mb-1">Catatan Penting</p>
                <p className="text-muted-foreground">
                  Perubahan peran pengguna akan langsung berlaku. Pastikan pengguna memiliki akses yang sesuai dengan tanggung jawab mereka.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                <SafeIcon name="X" className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button
                onClick={() => setShowConfirm(true)}
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
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Konfirmasi Perubahan"
        description={`Apakah Anda yakin ingin menyimpan perubahan data pengguna ${formData.nama}?`}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        icon="CheckCircle"
        iconColor="text-primary"
        isLoading={isLoading}
        isDangerous={false}
        onConfirm={handleSubmit}
      />

      {/* Reset Password Modal - Modern Enterprise Design */}
      {showResetPassword && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <SafeIcon name="Shield" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Reset Password</h2>
                  <p className="text-sm text-blue-100">{formData.nama}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!generatedPassword ? (
                <div className="space-y-4">
                  {/* Security Info */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100">
                    <SafeIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 mb-1">Password akan direset</p>
                      <p className="text-gray-600">Sistem akan generate password baru dan menyimpannya ke database. Password lama tidak dapat dipulihkan.</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Langkah selanjutnya:</p>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">1</span>
                        Klik "Generate Password"
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">2</span>
                        Copy password yang muncul
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">3</span>
                        Berikan ke pengguna melalui channel aman
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Success State */}
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="bg-green-500 rounded-full p-1">
                      <SafeIcon name="Check" className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-green-800">Password berhasil direset!</p>
                  </div>

                  {/* Password Display */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password Baru</label>
                    <div className="relative">
                      <div className="flex items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg font-mono text-lg tracking-wider">
                        <span className="flex-1 select-all break-all">{generatedPassword}</span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={copyPasswordToClipboard}
                          className={copiedPassword
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                          }
                        >
                          <SafeIcon name={copiedPassword ? 'Check' : 'Copy'} className="h-4 w-4 mr-1" />
                          {copiedPassword ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <SafeIcon name="AlertTriangle" className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">
                      <strong>Penting:</strong> Salin password ini sekarang. Setelah modal ditutup, password tidak akan ditampilkan lagi.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex gap-3 justify-end">
              {!generatedPassword ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowResetPassword(false)}
                    disabled={isResettingPassword}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={generateRandomPassword}
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? (
                      <>
                        <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <SafeIcon name="Key" className="mr-2 h-4 w-4" />
                        Generate Password
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  onClick={() => {
                    setShowResetPassword(false)
                    setGeneratedPassword('')
                  }}
                >
                  <SafeIcon name="Check" className="mr-2 h-4 w-4" />
                  Selesai
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
