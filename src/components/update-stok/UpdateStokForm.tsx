
'use client'

import { useState, useEffect } from 'react'
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
import { toast } from 'sonner'
import { stockApi, type LpgType, type MovementType, type StockSummary } from '@/lib/api'

interface UpdateStokFormProps {
  onClose?: () => void
  onSuccess?: () => void
}

// LPG types - uses Prisma enum VALUE (database format: 3kg, 12kg, 50kg)
const lpgTypeOptions: { value: LpgType; label: string }[] = [
  { value: '3kg', label: 'LPG 3kg (Subsidi)' },
  { value: '12kg', label: 'LPG 12kg' },
  { value: '50kg', label: 'LPG 50kg (Industri)' },
]

export default function UpdateStokForm({ onClose, onSuccess }: UpdateStokFormProps) {
  const [lpgType, setLpgType] = useState<LpgType>('3kg')
  const [movementType, setMovementType] = useState<MovementType>('MASUK')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stockSummary, setStockSummary] = useState<StockSummary>({})

  // Fetch current stock summary on mount
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await stockApi.getSummary()
        setStockSummary(data)
      } catch (error) {
        console.error('Failed to fetch stock summary:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSummary()
  }, [])

  // Get current stock for selected LPG type
  const currentStock = stockSummary[lpgType]?.current || 0

  // Calculate projected stock after update
  const projectedStock = movementType === 'MASUK'
    ? currentStock + parseInt(quantity || '0')
    : currentStock - parseInt(quantity || '0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const qty = parseInt(quantity)
    if (!qty || qty <= 0) {
      toast.error('Jumlah harus lebih dari 0')
      return
    }

    // Validate keluar tidak melebihi stok
    if (movementType === 'KELUAR' && qty > currentStock) {
      toast.error(`Stok tidak mencukupi. Stok saat ini: ${currentStock} unit`)
      return
    }

    setIsSubmitting(true)

    try {
      await stockApi.createMovement({
        lpg_type: lpgType,
        movement_type: movementType,
        qty: qty,
        note: notes || undefined,
      })

      toast.success(
        `Stok berhasil ${movementType === 'MASUK' ? 'ditambahkan' : 'dikurangi'}: ${qty} unit ${lpgTypeOptions.find(l => l.value === lpgType)?.label}`
      )

      onSuccess?.()

      // Close after short delay
      setTimeout(() => {
        if (onClose) {
          onClose()
        } else {
          window.location.href = '/ringkasan-stok'
        }
      }, 500)
    } catch (error: any) {
      const message = error?.message || 'Gagal menyimpan pergerakan stok'
      toast.error(message)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      window.location.href = '/ringkasan-stok'
    }
  }

  const isModal = !!onClose

  return (
    <div className={isModal ? "" : "max-w-2xl mx-auto"}>
      {!isModal && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <a href="/ringkasan-stok" className="text-primary hover:underline flex items-center gap-1">
              <SafeIcon name="ArrowLeft" className="h-4 w-4" />
              Kembali ke Ringkasan Stok
            </a>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Update Stok LPG</h1>
          <p className="text-muted-foreground mt-2">
            Catat pemasukan atau pengeluaran stok LPG dengan detail yang akurat
          </p>
        </div>
      )}

      <Card className={isModal ? "border-0 shadow-none" : "shadow-card"}>
        <CardHeader className={isModal ? "pb-4" : ""}>
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
              <Select value={lpgType} onValueChange={(v) => setLpgType(v as LpgType)}>
                <SelectTrigger id="lpg-type" className="h-10">
                  <SelectValue placeholder="Pilih jenis LPG" />
                </SelectTrigger>
                <SelectContent>
                  {lpgTypeOptions.map(lpg => (
                    <SelectItem key={lpg.value} value={lpg.value}>
                      <div className="flex items-center gap-2">
                        <span>{lpg.label}</span>
                        {!isLoading && (
                          <span className="text-xs text-muted-foreground">
                            (Stok: {stockSummary[lpg.value]?.current || 0})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 p-3 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Stok saat ini: {' '}
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <span className="font-semibold text-foreground">{currentStock} unit</span>
                  )}
                </p>
              </div>
            </div>

            {/* Movement Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Tipe Pergerakan Stok
              </Label>
              <RadioGroup
                value={movementType}
                onValueChange={(v) => setMovementType(v as MovementType)}
              >
                <div
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${movementType === 'MASUK' ? 'bg-green-50 border-green-200' : 'hover:bg-secondary'
                    }`}
                  onClick={() => setMovementType('MASUK')}
                >
                  <RadioGroupItem value="MASUK" id="masuk" />
                  <Label htmlFor="masuk" className="flex-1 cursor-pointer font-normal">
                    <div className="flex items-center gap-2">
                      <SafeIcon name="TrendingUp" className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Stok Masuk</p>
                        <p className="text-xs text-muted-foreground">Penambahan stok dari supplier</p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${movementType === 'KELUAR' ? 'bg-red-50 border-red-200' : 'hover:bg-secondary'
                    }`}
                  onClick={() => setMovementType('KELUAR')}
                >
                  <RadioGroupItem value="KELUAR" id="keluar" />
                  <Label htmlFor="keluar" className="flex-1 cursor-pointer font-normal">
                    <div className="flex items-center gap-2">
                      <SafeIcon name="TrendingDown" className="h-5 w-5 text-red-600" />
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
                Jumlah {movementType === 'MASUK' ? 'Masuk' : 'Keluar'} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Masukkan jumlah unit"
                  className="h-10 pr-12"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  unit
                </span>
              </div>
              {quantity && (
                <div className={`mt-2 p-3 rounded-lg border ${projectedStock < 0 ? 'bg-red-50 border-red-200' : 'bg-primary/5 border-primary/20'
                  }`}>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Stok setelah update: </span>
                    <span className={`font-semibold ${projectedStock < 0 ? 'text-destructive' : 'text-foreground'}`}>
                      {projectedStock} unit
                    </span>
                    {projectedStock < 0 && (
                      <span className="text-xs text-destructive ml-2">(Stok tidak mencukupi!)</span>
                    )}
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan tentang pergerakan stok..."
                className="min-h-20 resize-none"
              />
            </div>

            {/* Summary Card */}
            <div className={`p-4 rounded-lg border ${movementType === 'MASUK' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
              <h3 className="font-semibold text-foreground mb-3">Ringkasan Update</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jenis LPG:</span>
                  <span className="font-medium">{lpgTypeOptions.find(l => l.value === lpgType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe Pergerakan:</span>
                  <span className={`font-medium ${movementType === 'MASUK' ? 'text-green-600' : 'text-red-600'}`}>
                    {movementType === 'MASUK' ? '↑ Stok Masuk' : '↓ Stok Keluar'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah:</span>
                  <span className="font-medium">{quantity || '0'} unit</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="text-muted-foreground">Stok Setelah Update:</span>
                  <span className={`font-bold ${projectedStock < 0 ? 'text-destructive' : 'text-primary'}`}>
                    {projectedStock} unit
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
                className={`flex-1 ${movementType === 'MASUK' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={isSubmitting || !quantity || projectedStock < 0}
              >
                {isSubmitting ? (
                  <>
                    <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SafeIcon name={movementType === 'MASUK' ? 'Plus' : 'Minus'} className="mr-2 h-4 w-4" />
                    {movementType === 'MASUK' ? 'Tambah Stok' : 'Kurangi Stok'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
