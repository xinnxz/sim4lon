'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon'

interface AddLPGTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (newType: {
    type: string
    label: string
    weight: string
    category: 'subsidi' | 'non-subsidi'
    minStock: number
    maxCapacity: number
    pricePerUnit: number
  }) => void
}

export default function AddLPGTypeModal({ 
  open, 
  onOpenChange, 
  onAdd
}: AddLPGTypeModalProps) {
const [formData, setFormData] = useState({
    label: '',
    weight: '',
    category: 'subsidi' as 'subsidi' | 'non-subsidi',
    minStock: 50,
    maxCapacity: 500,
    pricePerUnit: 0
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!formData.label || !formData.weight) {
      setError('Semua field harus diisi')
      return
    }

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
// Auto-generate type code from weight
    const generatedType = `${formData.weight}kg`
    onAdd({
      ...formData,
      type: generatedType,
      maxCapacity: formData.maxCapacity
    })
    resetForm()
    setIsSaving(false)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

const resetForm = () => {
    setFormData({
      label: '',
      weight: '',
      category: 'subsidi',
      minStock: 50,
      maxCapacity: 500,
      pricePerUnit: 0
    })
    setError('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Jenis LPG Baru</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nama Gas</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => {
                setFormData({ ...formData, label: e.target.value })
                setError('')
              }}
              placeholder="Contoh: LPG 5 Kg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Berat (Kg)</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => {
                setFormData({ ...formData, weight: e.target.value })
                setError('')
              }}
              placeholder="Contoh: 5"
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
            <Label htmlFor="pricePerUnit">Harga per Tabung (Rp)</Label>
            <Input
              id="pricePerUnit"
              type="number"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: parseInt(e.target.value) || 0 })}
              placeholder="Masukkan harga"
            />
          </div>

<div className="space-y-2">
             <Label htmlFor="minStock">Min. Stok (Tabung)</Label>
             <Input
               id="minStock"
               type="number"
               value={formData.minStock}
               onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 50 })}
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

           {error && (
            <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="p-3 bg-secondary rounded-lg border">
            <p className="text-sm text-foreground font-medium mb-2">Ringkasan:</p>
<div className="space-y-1 text-sm text-muted-foreground">
               <p>Nama: <span className="font-medium text-foreground">{formData.label || '-'}</span></p>
               <p>Berat: <span className="font-medium text-foreground">{formData.weight || '-'} Kg</span></p>
               <p>Jenis: <span className="font-medium text-foreground">{formData.category === 'subsidi' ? 'Subsidi' : 'Non-Subsidi'}</span></p>
               <p>Min. Stok: <span className="font-medium text-foreground">{formData.minStock} tabung</span></p>
               <p>Max Kapasitas: <span className="font-medium text-foreground">{formData.maxCapacity} tabung</span></p>
               <p>Harga: <span className="font-medium text-foreground">Rp {formData.pricePerUnit.toLocaleString('id-ID') || '-'}</span></p>
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
                Menambah...
              </>
            ) : (
              <>
                <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                Tambah
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}