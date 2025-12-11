
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import type { Driver } from './types'

interface AddDriverModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver?: Driver | null
  onSave: (driver: Driver | Omit<Driver, 'id'>) => void
}

export default function AddDriverModal({
  open,
  onOpenChange,
  driver,
  onSave,
}: AddDriverModalProps) {
  const [formData, setFormData] = useState<Omit<Driver, 'id'> & { id?: number }>({
    name: '',
    phone: '',
    status: 'active',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (driver) {
      setFormData(driver)
    } else {
      setFormData({
        name: '',
        phone: '',
        status: 'active',
        notes: '',
      })
    }
    setErrors({})
  }, [driver, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama supir harus diisi'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon harus diisi'
    } else if (!/^08\d{8,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Nomor telepon tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (driver?.id) {
      onSave({
        ...formData,
        id: driver.id,
      } as Driver)
    } else {
      onSave(formData)
    }

    onOpenChange(false)
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
              Nama Supir
            </Label>
            <Input
              id="name"
              placeholder="Masukkan nama supir"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              Nomor Telepon
            </Label>
            <Input
              id="phone"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select 
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Catatan */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Catatan (Opsional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan tentang supir ini..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <SafeIcon name="Save" className="h-4 w-4" />
              {driver ? 'Simpan Perubahan' : 'Tambah Supir'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
