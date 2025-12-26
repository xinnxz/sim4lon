
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { formatCurrency } from '@/lib/currency'

interface OrderData {
  id: string
  baseStation: string
  lpgType: string
  quantity: number
  totalAmount: number
  status: string
  date: string
}

interface PaymentRecordFormProps {
  order: OrderData
  onSubmit: (data: any) => void
  isSubmitting: boolean
  isPaymentSuccessful?: boolean
}

export default function PaymentRecordForm({
  order,
  onSubmit,
  isSubmitting,
  isPaymentSuccessful = false
}: PaymentRecordFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  // Amount is auto-filled and read-only - no need for user input
  const amount = order.totalAmount
  const [transferProof, setTransferProof] = useState<File | null>(null)
  const [transferProofUrl, setTransferProofUrl] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          transferProof: 'Format file harus JPG, PNG, atau PDF'
        }))
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          transferProof: 'Ukuran file maksimal 5MB'
        }))
        return
      }
      setTransferProof(file)

      // Create image preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setImagePreview(null) // No preview for PDF
      }

      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.transferProof
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // For transfer, require proof (either file or URL)
    if (paymentMethod === 'transfer') {
      if (!transferProof && !transferProofUrl.trim()) {
        newErrors.transferProof = 'Bukti transfer harus diunggah atau masukkan URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const formData = {
      orderId: order.id,
      paymentMethod,
      amount: amount, // Already a number, no parsing needed
      transferProof: paymentMethod === 'transfer' ? transferProof : null,
      transferProofUrl: paymentMethod === 'transfer' ? transferProofUrl : undefined,
      notes,
      recordedAt: new Date().toISOString()
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success State - Paid Badge */}
      {isPaymentSuccessful && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <SafeIcon name="CheckCircle" className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-900">✔️ Sudah Dibayar</p>
            <p className="text-sm text-green-700">Pembayaran telah berhasil dicatat dan aman tersimpan</p>
          </div>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Metode Pembayaran</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          disabled={isPaymentSuccessful}
        >
          <div className={`flex items-center space-x-2 p-3 border rounded-lg ${isPaymentSuccessful ? 'bg-muted/50 cursor-not-allowed' : 'hover:bg-secondary/50 cursor-pointer'}`}>
            <RadioGroupItem value="cash" id="cash" disabled={isPaymentSuccessful} />
            <Label htmlFor="cash" className={`flex-1 ${isPaymentSuccessful ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
              <div className="font-medium">Cash</div>
              <div className="text-sm text-muted-foreground">Pembayaran langsung dengan uang tunai</div>
            </Label>
          </div>
          <div className={`flex items-center space-x-2 p-3 border rounded-lg ${isPaymentSuccessful ? 'bg-muted/50 cursor-not-allowed' : 'hover:bg-secondary/50 cursor-pointer'}`}>
            <RadioGroupItem value="transfer" id="transfer" disabled={isPaymentSuccessful} />
            <Label htmlFor="transfer" className={`flex-1 ${isPaymentSuccessful ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
              <div className="font-medium">Cashless</div>
              <div className="text-sm text-muted-foreground">Pembayaran melalui transfer bank / non-tunai</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t pt-6" />

      {/* Amount Display - Read Only with elegant styling */}
      <div className="space-y-2">
        <Label className="font-semibold">Nominal Pembayaran</Label>
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{formatCurrency(amount)}</p>
              <p className="text-xs text-muted-foreground mt-1">Sesuai total pesanan</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <SafeIcon name="CheckCircle" className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Bank Transfer - Proof Upload Only */}
      {paymentMethod === 'transfer' && (
        <>
          <div className="border-t pt-6" />
          <div className="space-y-2">
            <Label htmlFor="transferProof" className="font-semibold">Bukti Transfer</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-secondary/50 transition-colors">
              <input
                id="transferProof"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isPaymentSuccessful}
              />
              <label htmlFor="transferProof" className={isPaymentSuccessful ? 'cursor-not-allowed block' : 'cursor-pointer block'}>
                {transferProof ? (
                  <div className="space-y-3">
                    {/* Image Preview Thumbnail */}
                    {imagePreview && (
                      <div
                        className="relative mx-auto max-w-xs cursor-pointer group"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowPreviewModal(true)
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Bukti transfer"
                          className="w-full max-h-40 object-contain rounded-lg border shadow-sm group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                          <SafeIcon name="ZoomIn" className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <SafeIcon name="CheckCircle" className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{transferProof.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Klik untuk ganti file</p>
                  </div>
                ) : (
                  <div className={`space-y-2 ${isPaymentSuccessful ? 'opacity-60' : ''}`}>
                    <SafeIcon name="Upload" className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Klik untuk unggah bukti transfer</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, atau PDF (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
            {errors.transferProof && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-4 w-4" />
                {errors.transferProof}
              </p>
            )}
          </div>

          {/* Fullscreen Preview Modal */}
          {showPreviewModal && imagePreview && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setShowPreviewModal(false)}
            >
              <div className="relative max-w-3xl max-h-[90vh]">
                <img
                  src={imagePreview}
                  alt="Bukti transfer (full)"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                >
                  <SafeIcon name="X" className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="font-semibold">Catatan (Opsional)</Label>
        <Textarea
          id="notes"
          placeholder="Tambahkan catatan atau keterangan pembayaran..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          disabled={isPaymentSuccessful}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t">
        {!isPaymentSuccessful ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const params = new URLSearchParams(window.location.search)
                const id = params.get('orderId') || params.get('id')
                window.location.href = id ? `/detail-pesanan?id=${id}` : '/daftar-pesanan'
              }}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <SafeIcon name="Save" className="mr-2 h-4 w-4" />
                  Simpan Pembayaran
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const params = new URLSearchParams(window.location.search)
                const id = params.get('orderId') || params.get('id')
                window.location.href = id ? `/detail-pesanan?id=${id}` : '/daftar-pesanan'
              }}
              className="flex-1"
            >
              <SafeIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Kembali ke Pesanan
            </Button>
            <Button
              type="button"
              onClick={() => {
                // Get orderId from URL params
                const params = new URLSearchParams(window.location.search)
                const orderId = params.get('orderId') || params.get('id')
                window.location.href = `/nota-pembayaran?id=${orderId}`
              }}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <SafeIcon name="FileText" className="mr-2 h-4 w-4" />
              Lihat Invoice
            </Button>
          </>
        )}
      </div>
    </form>
  )
}
