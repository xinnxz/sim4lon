
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'

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
  const [amount, setAmount] = useState(order.totalAmount.toString())
  const [transferProof, setTransferProof] = useState<File | null>(null)
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
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.transferProof
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Nominal pembayaran harus lebih dari 0'
    }

    if (parseFloat(amount) !== order.totalAmount) {
      newErrors.amount = `Nominal harus sesuai dengan total pesanan (Rp ${order.totalAmount.toLocaleString('id-ID')})`
    }

if (paymentMethod === 'transfer') {
      if (!transferProof) {
        newErrors.transferProof = 'Bukti transfer harus diunggah'
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
      amount: parseFloat(amount),
      transferProof: paymentMethod === 'transfer' ? transferProof : null,
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
              <div className="font-medium">Tunai</div>
              <div className="text-sm text-muted-foreground">Pembayaran langsung dengan uang tunai</div>
            </Label>
          </div>
          <div className={`flex items-center space-x-2 p-3 border rounded-lg ${isPaymentSuccessful ? 'bg-muted/50 cursor-not-allowed' : 'hover:bg-secondary/50 cursor-pointer'}`}>
            <RadioGroupItem value="transfer" id="transfer" disabled={isPaymentSuccessful} />
            <Label htmlFor="transfer" className={`flex-1 ${isPaymentSuccessful ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
              <div className="font-medium">Transfer Bank</div>
              <div className="text-sm text-muted-foreground">Pembayaran melalui transfer bank dengan bukti</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t pt-6" />

{/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="font-semibold">Nominal Pembayaran</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
          <Input
            id="amount"
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10"
            disabled={isPaymentSuccessful}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <SafeIcon name="AlertCircle" className="h-4 w-4" />
            {errors.amount}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Total pesanan: Rp {order.totalAmount.toLocaleString('id-ID')}
        </p>
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
                  <div className="flex items-center justify-center gap-2">
                    <SafeIcon name="CheckCircle" className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{transferProof.name}</span>
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
              onClick={() => window.location.href = './detail-pesanan.html'}
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
              onClick={() => window.location.href = './detail-pesanan.html'}
              className="flex-1"
            >
              <SafeIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Kembali ke Pesanan
            </Button>
            <Button
              type="button"
              onClick={() => window.location.href = './nota-pembayaran.html'}
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
