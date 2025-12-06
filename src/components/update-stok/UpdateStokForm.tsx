
'use client'

import { useState } from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import SafeIcon from '@/components/common/SafeIcon'

interface UpdateStokFormData {
  lpgType: string
  movementType: 'masuk' | 'keluar'
  quantity: string
  notes: string
}

interface UpdateStokFormProps {
  onClose?: () => void
}

const mockFormData: UpdateStokFormData = {
  lpgType: '3kg',
  movementType: 'masuk',
  quantity: '100',
  notes: 'Pengiriman dari supplier PT Maju Jaya',
}

const lpgTypes = [
  { value: '3kg', label: 'LPG 3kg', currentStock: 450 },
  { value: '12kg', label: 'LPG 12kg', currentStock: 280 },
  { value: '50kg', label: 'LPG 50kg', currentStock: 95 },
]

export default function UpdateStokForm({ onClose }: UpdateStokFormProps) {
  const [formData, setFormData] = useState<UpdateStokFormData>(mockFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedLpg = lpgTypes.find(lpg => lpg.value === formData.lpgType)

  const handleLpgTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, lpgType: value }))
  }

  const handleMovementTypeChange = (value: 'masuk' | 'keluar') => {
    setFormData(prev => ({ ...prev, movementType: value }))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, quantity: e.target.value }))
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted:', formData)
    setIsSubmitting(false)
    
    // Close modal or redirect based on context
    if (onClose) {
      onClose()
    } else {
      window.location.href = './ringkasan-stok.html'
    }
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      window.location.href = './ringkasan-stok.html'
    }
  }

// When used in modal context, don't show full page header
  const isModal = !!onClose
  
  return (
    <div className={isModal ? "" : "max-w-2xl mx-auto"}>
      {!isModal && (
        <>
          {/* Header - only show in full page mode */}
          <div className="mb-8">
            <div id="i35u5g" className="flex items-center gap-2 mb-2">
              <a href="./ringkasan-stok.html" className="text-primary hover:underline flex items-center gap-1">
                <SafeIcon name="ArrowLeft" className="h-4 w-4" />
                Kembali ke Ringkasan Stok
              </a>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Update Stok LPG</h1>
            <p className="text-muted-foreground mt-2">
              Catat pemasukan atau pengeluaran stok LPG dengan detail yang akurat
            </p>
          </div>
        </>
      )}

{/* Form Card - no shadow in modal */}
      <Card className={isModal ? "" : "shadow-card"}>
        <CardHeader>
          <CardTitle>Form Update Stok</CardTitle>
          <CardDescription>
            Isi semua field di bawah untuk memperbarui data stok LPG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LPG Type Selection */}
            <div className="space-y-3">
              <Label htmlFor="lpg-type" className="text-base font-semibold">
                Jenis LPG
              </Label>
              <Select value={formData.lpgType} onValueChange={handleLpgTypeChange}>
                <SelectTrigger id="lpg-type" className="h-10">
                  <SelectValue placeholder="Pilih jenis LPG" />
                </SelectTrigger>
                <SelectContent>
                  {lpgTypes.map(lpg => (
                    <SelectItem key={lpg.value} value={lpg.value}>
                      <div className="flex items-center gap-2">
                        <span>{lpg.label}</span>
                        <span className="text-xs text-muted-foreground">
                          (Stok: {lpg.currentStock})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLpg && (
                <div className="mt-2 p-3 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Stok saat ini: <span className="font-semibold text-foreground">{selectedLpg.currentStock} unit</span>
                  </p>
                </div>
              )}
            </div>

            {/* Movement Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Tipe Pergerakan Stok
              </Label>
              <RadioGroup 
                value={formData.movementType} 
                onValueChange={(value) => handleMovementTypeChange(value as 'masuk' | 'keluar')}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary cursor-pointer transition-colors">
                  <RadioGroupItem value="masuk" id="masuk" />
                  <Label htmlFor="masuk" className="flex-1 cursor-pointer font-normal">
                    <div className="flex items-center gap-2">
                      <SafeIcon name="TrendingUp" className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Stok Masuk</p>
                        <p className="text-xs text-muted-foreground">Penambahan stok dari supplier</p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary cursor-pointer transition-colors">
                  <RadioGroupItem value="keluar" id="keluar" />
                  <Label htmlFor="keluar" className="flex-1 cursor-pointer font-normal">
                    <div className="flex items-center gap-2">
                      <SafeIcon name="TrendingDown" className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium">Stok Keluar</p>
                        <p className="text-xs text-muted-foreground">Pengurangan stok untuk pengiriman</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Quantity Input */}
            <div className="space-y-3">
              <Label htmlFor="quantity" className="text-base font-semibold">
                Jumlah {formData.movementType === 'masuk' ? 'Masuk' : 'Keluar'}
              </Label>
              <div className="relative">
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  placeholder="Masukkan jumlah unit"
                  className="h-10 pr-12"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  unit
                </span>
              </div>
              {formData.quantity && (
                <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Stok setelah update: </span>
                    <span className="font-semibold text-foreground">
                      {formData.movementType === 'masuk' 
                        ? (selectedLpg ? selectedLpg.currentStock + parseInt(formData.quantity || '0') : 0)
                        : (selectedLpg ? selectedLpg.currentStock - parseInt(formData.quantity || '0') : 0)
                      } unit
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-base font-semibold">
                Catatan (Opsional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={handleNotesChange}
                placeholder="Tambahkan catatan atau keterangan tentang pergerakan stok ini..."
                className="min-h-24 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Contoh: Pengiriman dari supplier PT Maju Jaya, Invoice #INV-2024-001
              </p>
            </div>

            {/* Summary Card */}
            <div className="p-4 bg-gradient-lpg-subtle rounded-lg border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3">Ringkasan Update</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jenis LPG:</span>
                  <span className="font-medium">{selectedLpg?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe Pergerakan:</span>
                  <span className="font-medium capitalize">
                    {formData.movementType === 'masuk' ? 'Stok Masuk' : 'Stok Keluar'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah:</span>
                  <span className="font-medium">{formData.quantity || '0'} unit</span>
                </div>
                <div className="border-t border-primary/20 pt-2 mt-2 flex justify-between">
                  <span className="text-muted-foreground">Stok Setelah Update:</span>
                  <span className="font-bold text-primary">
                    {formData.movementType === 'masuk' 
                      ? (selectedLpg ? selectedLpg.currentStock + parseInt(formData.quantity || '0') : 0)
                      : (selectedLpg ? selectedLpg.currentStock - parseInt(formData.quantity || '0') : 0)
                    } unit
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                <SafeIcon name="X" className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isSubmitting || !formData.quantity}
              >
                {isSubmitting ? (
                  <>
                    <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SafeIcon name="Save" className="mr-2 h-4 w-4" />
                    Simpan Update Stok
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

{!isModal && (
        <>
          {/* Info Box - only show in full page mode */}
          <div className="mt-6 p-4 bg-secondary rounded-lg border">
        <div className="flex gap-3">
          <SafeIcon name="Info" className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Informasi Penting</p>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Pastikan jumlah yang diinput sudah sesuai dengan dokumen fisik</li>
              <li>Catatan akan membantu dalam audit dan tracking stok</li>
              <li>Update stok akan langsung mempengaruhi data inventaris</li>
            </ul>
</div>
         </div>
       </div>
        </>
      )}
    </div>
  )
}
