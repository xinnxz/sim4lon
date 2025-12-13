'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon'
import { formatCurrency } from '@/lib/currency'

interface EditLPGTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lpgType: {
    type: string
    label: string
    weight: string
    category: 'subsidi' | 'non-subsidi'
    minStock: number
    maxCapacity: number
    pricePerUnit: number
  }
  onSave: (updatedType: {
    type: string
    label: string
    weight: string
    category: 'subsidi' | 'non-subsidi'
    minStock: number
    maxCapacity: number
    pricePerUnit: number
  }) => void
}

export default function EditLPGTypeModal({
  open,
  onOpenChange,
  lpgType,
  onSave
}: EditLPGTypeModalProps) {
  const [formData, setFormData] = useState(lpgType)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    onSave(formData)
    setIsSaving(false)
  }

  const handleCancel = () => {
    setFormData(lpgType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Jenis LPG</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nama Gas</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Contoh: LPG 3 Kg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Berat (Kg)</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="Contoh: 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Jenis Gas</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'subsidi' | 'non-subsidi' })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="subsidi">Subsidi</option>
              <option value="non-subsidi">Non-Subsidi</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minStock">Min. Stok (Tabung)</Label>
            <Input
              id="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
              placeholder="Masukkan minimum stok"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Max Kapasitas Gudang (Tabung)</Label>
            <Input
              id="maxCapacity"
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 500 })}
              placeholder="Masukkan kapasitas maksimal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerUnit">Harga per Tabung (Rp)</Label>
            <Input
              id="pricePerUnit"
              type="number"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: parseInt(e.target.value) || 0 })}
              placeholder="Masukkan harga"
            />
          </div>

          <div className="p-3 bg-secondary rounded-lg border">
            <p className="text-sm text-foreground font-medium mb-2">Ringkasan:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Kode: <span className="font-medium text-foreground">{formData.type}</span></p>
              <p>Nama: <span className="font-medium text-foreground">{formData.label}</span></p>
              <p>Berat: <span className="font-medium text-foreground">{formData.weight} Kg</span></p>
              <p>Jenis: <span className="font-medium text-foreground">{formData.category === 'subsidi' ? 'Subsidi' : 'Non-Subsidi'}</span></p>
              <p>Min. Stok: <span className="font-medium text-foreground">{formData.minStock} tabung</span></p>
              <p>Max Kapasitas: <span className="font-medium text-foreground">{formData.maxCapacity} tabung</span></p>
              <p>Harga: <span className="font-medium text-foreground">{formatCurrency(formData.pricePerUnit)}</span></p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            <SafeIcon name="X" className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <SafeIcon name="Save" className="mr-2 h-4 w-4" />
                Simpan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}