'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { authApi } from '@/lib/api'

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormErrors {
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

export default function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Kata sandi lama harus diisi'
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Kata sandi baru harus diisi'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Kata sandi baru minimal 8 karakter'
    } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Kata sandi harus mengandung huruf kecil'
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Kata sandi harus mengandung huruf besar'
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Kata sandi harus mengandung angka'
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi harus diisi'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Kata sandi tidak cocok'
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'Kata sandi baru harus berbeda dengan kata sandi lama'
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
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Call real API to change password
      await authApi.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })

      // Success
      toast.success('Kata sandi berhasil diubah')

      // Reset and close modal
      setTimeout(() => {
        onOpenChange(false)
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setErrors({})
        setShowPasswords({ old: false, new: false, confirm: false })
      }, 500)
    } catch (error: any) {
      const message = error.message || 'Terjadi kesalahan saat mengubah kata sandi'
      setErrors({ general: message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    setShowPasswords({ old: false, new: false, confirm: false })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SafeIcon name="Lock" className="h-5 w-5 text-primary" />
            Ubah Kata Sandi
          </DialogTitle>
          <DialogDescription>
            Masukkan kata sandi lama dan baru Anda. Kata sandi harus minimal 8 karakter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
          {/* General Error Alert */}
          {errors.general && (
            <Alert variant="destructive">
              <SafeIcon name="AlertCircle" className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Old Password Field */}
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="text-sm font-medium">
              Kata Sandi Lama <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="oldPassword"
                name="oldPassword"
                type={showPasswords.old ? 'text' : 'password'}
                placeholder="Masukkan kata sandi lama Anda"
                value={formData.oldPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.oldPassword ? 'border-destructive' : ''}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <SafeIcon
                  name={showPasswords.old ? 'EyeOff' : 'Eye'}
                  className="h-4 w-4"
                />
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              Kata Sandi Baru <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                placeholder="Masukkan kata sandi baru Anda"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.newPassword ? 'border-destructive' : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <SafeIcon
                  name={showPasswords.new ? 'EyeOff' : 'Eye'}
                  className="h-4 w-4"
                />
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.newPassword}
              </p>
            )}

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="mt-2 p-2 bg-secondary rounded text-xs space-y-1">
                <p className="font-medium text-foreground">Persyaratan:</p>
                <ul className="space-y-0.5">
                  <li className={`flex items-center gap-1 ${formData.newPassword.length >= 8 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <SafeIcon name={formData.newPassword.length >= 8 ? 'Check' : 'X'} className="h-3 w-3" />
                    Minimal 8 karakter
                  </li>
                  <li className={`flex items-center gap-1 ${/(?=.*[a-z])/.test(formData.newPassword) ? 'text-primary' : 'text-muted-foreground'}`}>
                    <SafeIcon name={/(?=.*[a-z])/.test(formData.newPassword) ? 'Check' : 'X'} className="h-3 w-3" />
                    Huruf kecil
                  </li>
                  <li className={`flex items-center gap-1 ${/(?=.*[A-Z])/.test(formData.newPassword) ? 'text-primary' : 'text-muted-foreground'}`}>
                    <SafeIcon name={/(?=.*[A-Z])/.test(formData.newPassword) ? 'Check' : 'X'} className="h-3 w-3" />
                    Huruf besar
                  </li>
                  <li className={`flex items-center gap-1 ${/(?=.*\d)/.test(formData.newPassword) ? 'text-primary' : 'text-muted-foreground'}`}>
                    <SafeIcon name={/(?=.*\d)/.test(formData.newPassword) ? 'Check' : 'X'} className="h-3 w-3" />
                    Angka
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Konfirmasi Kata Sandi <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder="Konfirmasi kata sandi baru Anda"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.confirmPassword ? 'border-destructive' : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <SafeIcon
                  name={showPasswords.confirm ? 'EyeOff' : 'Eye'}
                  className="h-4 w-4"
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.confirmPassword}
              </p>
            )}

            {/* Password Match Indicator */}
            {formData.newPassword && formData.confirmPassword && (
              <div className={`text-xs flex items-center gap-1 ${formData.newPassword === formData.confirmPassword ? 'text-primary' : 'text-destructive'}`}>
                <SafeIcon
                  name={formData.newPassword === formData.confirmPassword ? 'Check' : 'X'}
                  className="h-3 w-3"
                />
                {formData.newPassword === formData.confirmPassword ? 'Kata sandi cocok' : 'Kata sandi tidak cocok'}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
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
                  Simpan Kata Sandi
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}