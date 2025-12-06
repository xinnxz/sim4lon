
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import PaymentRecordForm from './PaymentRecordForm'
import PaymentSummary from './PaymentSummary'
import { toast } from 'sonner'

interface OrderData {
  id: string
  baseStation: string
  lpgType: string
  quantity: number
  totalAmount: number
  status: string
  date: string
}

const mockOrder: OrderData = {
  id: 'PES-12345',
  baseStation: 'Pangkalan Maju Jaya',
  lpgType: 'LPG 12kg',
  quantity: 100,
  totalAmount: 1500000,
  status: 'Dibayar',
  date: '2024-01-15'
}

export default function PaymentRecordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Payment recorded:', data)
    setIsSubmitting(false)
    
    // Show elegant success notification
    toast.success('Pembayaran Berhasil!', {
      description: `Pembayaran sebesar Rp ${mockOrder.totalAmount.toLocaleString('id-ID')} telah dicatat. Invoice akan dibangkitkan.`,
      action: {
        label: 'Lihat Invoice',
        onClick: () => {
          window.location.href = './nota-pembayaran.html'
        },
      },
      duration: 4000,
    })
    
    // Auto redirect after notification
    setTimeout(() => {
      window.location.href = './nota-pembayaran.html'
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="./detail-pesanan.html">
            <SafeIcon name="ArrowLeft" className="h-5 w-5" />
          </a>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Catat Pembayaran</h1>
          <p className="text-muted-foreground">Pencatatan pembayaran untuk pesanan {mockOrder.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detail Pembayaran</CardTitle>
              <CardDescription>
                Pilih metode pembayaran dan masukkan informasi pembayaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentRecordForm 
                order={mockOrder}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4">
          <PaymentSummary order={mockOrder} />
          
          {/* Info Box */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <SafeIcon name="Info" className="h-4 w-4 text-primary" />
                Informasi Penting
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>• Pastikan nominal pembayaran sesuai dengan total pesanan</p>
              <p>• Untuk transfer bank, upload bukti transfer sebagai verifikasi</p>
              <p>• Status pesanan akan otomatis diperbarui setelah pembayaran dicatat</p>
              <p>• Simpan bukti pembayaran untuk referensi</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
