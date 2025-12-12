/**
 * AddDriverModal - Modal Tambah/Edit Driver dengan API Integration
 * 
 * PENJELASAN:
 * Modal untuk menambah atau mengedit data driver.
 * Data dikirim ke API /drivers via POST (create) atau PUT (update).
 */

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import SafeIcon from '@/components/common/SafeIcon'
import { driversApi, type Driver } from '@/lib/api'
import { toast } from 'sonner'

interface AddDriverModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver?: Driver | null
  onSuccess?: () => void
}

interface FormData {
  name: string
  phone: string
  vehicle_id: string
  note: string
}

export default function AddDriverModal({
  open,
  onOpenChange,
  driver,
  onSuccess,
}: AddDriverModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    vehicle_id: '',
    note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form saat modal dibuka
  useEffect(() => {
    if (open) {
      if (driver) {
        // Edit mode - populate form with driver data
        setFormData({
          name: driver.name,
          phone: driver.phone || '',
          vehicle_id: driver.vehicle_id || '',
          note: driver.note || '',
        })
      } else {
        // Add mode - reset form
        setFormData({
          name: '',
          phone: '',
          vehicle_id: '',
          note: '',
        })
      }
      setErrors({})
    }
  }, [driver, open])

  /**
   * Validasi form
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama supir harus diisi'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nama minimal 2 karakter'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon harus diisi'
    } else if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.phone)) {
      newErrors.phone = 'Nomor telepon tidak valid (contoh: 08xx atau +62xx)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Submit form ke API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (driver) {
        // Update existing driver
        await driversApi.update(driver.id, {
          name: formData.name,
          phone: formData.phone,
          vehicle_id: formData.vehicle_id || null,
          note: formData.note || null,
        })
        toast.success('Data supir berhasil diperbarui')
      } else {
        // Create new driver
        await driversApi.create({
          name: formData.name,
          phone: formData.phone,
          vehicle_id: formData.vehicle_id || null,
          note: formData.note || null,
        })
        toast.success('Supir baru berhasil ditambahkan')
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save driver:', error)
      toast.error('Gagal menyimpan data supir')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {driver ? 'Edit Supir' : 'Tambah Supir Baru'}
          </DialogTitle>
          <DialogDescription>
            {driver
              ? 'Perbarui informasi supir di bawah ini'
              : 'Isi formulir untuk menambahkan supir baru ke sistem'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Supir */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nama Supir *
            </Label>
            <Input
              id="name"
              placeholder="Masukkan nama supir"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Nomor Telepon *
            </Label>
            <Input
              id="phone"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Plat Kendaraan */}
          <div className="space-y-2">
            <Label htmlFor="vehicle_id" className="text-sm font-medium">
              Plat Kendaraan (Opsional)
            </Label>
            <Input
              id="vehicle_id"
              placeholder="Contoh: B 1234 ABC"
              value={formData.vehicle_id}
              onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          {/* Catatan */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">
              Catatan (Opsional)
            </Label>
            <Textarea
              id="note"
              placeholder="Tambahkan catatan tentang supir ini..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              disabled={isSubmitting}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {isSubmitting ? (
                <>
                  <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <SafeIcon name="Save" className="h-4 w-4" />
                  {driver ? 'Simpan Perubahan' : 'Tambah Supir'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
