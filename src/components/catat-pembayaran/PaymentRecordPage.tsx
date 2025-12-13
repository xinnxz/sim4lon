/**
 * PaymentRecordPage - Halaman catat pembayaran
 * 
 * PENJELASAN:
 * - Fetch order dari API berdasarkan orderId dari URL
 * - Submit payment ke paymentApi.createRecord
 * - Update order payment status ke paymentApi.updateOrderPayment
 * - Navigate back ke detail pesanan setelah sukses
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import PaymentRecordForm from './PaymentRecordForm'
import PaymentSummary from './PaymentSummary'
import { toast } from 'sonner'
import {
  ordersApi,
  paymentApi,
  type Order,
  type PaymentMethod,
  type CreatePaymentRecordDto
} from '@/lib/api'
import { formatCurrency } from '@/lib/currency'

// Interface untuk item LPG
interface LpgItem {
  type: string
  quantity: number
}

// Interface untuk data order yang dipakai di form
interface OrderData {
  id: string
  baseStation: string
  lpgType: string // kept for form compatibility
  quantity: number // total quantity
  items: LpgItem[] // per-item details for summary
  totalAmount: number
  status: string
  date: string
}

export default function PaymentRecordPage() {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentSuccessful, setPaymentSuccessful] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get orderId from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('orderId') || params.get('id')
    if (id) {
      setOrderId(id)
    } else {
      setError('Order ID tidak ditemukan di URL')
      setIsLoading(false)
    }
  }, [])

  // Fetch order data
  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const apiOrder = await ordersApi.getById(orderId)

        // Map API response ke OrderData format untuk form
        const totalQty = apiOrder.order_items.reduce((sum, item) => sum + item.qty, 0)
        const lpgTypes = [...new Set(apiOrder.order_items.map(item => item.label || item.lpg_type))].join(', ')

        // Create items array with per-type quantities
        const items: LpgItem[] = apiOrder.order_items.map(item => ({
          type: item.label || item.lpg_type,
          quantity: item.qty
        }))

        setOrder({
          id: (apiOrder as any).code || apiOrder.id.substring(0, 12),
          baseStation: apiOrder.pangkalans?.name || 'Unknown',
          lpgType: lpgTypes,
          quantity: totalQty,
          items: items,
          totalAmount: apiOrder.total_amount,
          status: apiOrder.current_status,
          date: new Date(apiOrder.created_at).toISOString().split('T')[0]
        })
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch order:', err)
        setError(err.message || 'Gagal memuat data pesanan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  /**
   * Handle payment submission
   */
  const handleSubmit = async (data: {
    paymentMethod: string
    amount: number
    transferProof: File | null
    notes: string
  }) => {
    if (!orderId || !order) return

    setIsSubmitting(true)
    try {
      // 1. Create payment record
      const paymentDto: CreatePaymentRecordDto = {
        order_id: orderId,
        method: data.paymentMethod === 'cash' ? 'TUNAI' : 'TRANSFER',
        amount: data.amount,
        // TODO: Upload file dan dapatkan URL jika ada transferProof
        proof_url: data.transferProof ? `uploaded/${data.transferProof.name}` : undefined,
        note: data.notes || undefined,
      }

      await paymentApi.createRecord(paymentDto)

      // 2. Update order payment status to paid
      await paymentApi.updateOrderPayment(orderId, {
        is_paid: true,
        payment_method: paymentDto.method,
        amount_paid: data.amount,
        proof_url: paymentDto.proof_url,
      })

      // 3. Update order status to DIPROSES if currently MENUNGGU_PEMBAYARAN
      if (order.status === 'MENUNGGU_PEMBAYARAN') {
        await ordersApi.updateStatus(orderId, {
          status: 'DIPROSES',
          note: 'Pembayaran diterima'
        })
      }

      // Success!
      setPaymentSuccessful(true)

      toast.success('Pembayaran Berhasil!', {
        description: `Pembayaran sebesar ${formatCurrency(data.amount)} telah dicatat.`,
        action: {
          label: 'Lihat Nota',
          onClick: () => {
            window.location.href = `/nota-pembayaran?id=${orderId}`
          },
        },
        duration: 5000,
      })

    } catch (err: any) {
      console.error('Payment failed:', err)
      toast.error('Gagal mencatat pembayaran', {
        description: err.message || 'Terjadi kesalahan saat menyimpan pembayaran'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <SafeIcon name="Loader2" className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Memuat data pesanan...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !order) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <SafeIcon name="AlertCircle" className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-semibold">Gagal Memuat Pesanan</h2>
            <p className="text-muted-foreground">{error || 'Pesanan tidak ditemukan'}</p>
            <Button onClick={() => window.location.href = '/daftar-pesanan'}>
              Kembali ke Daftar Pesanan
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => window.location.href = `/detail-pesanan?id=${orderId}`}>
          <SafeIcon name="ArrowLeft" className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Catat Pembayaran</h1>
          <p className="text-muted-foreground">Pencatatan pembayaran untuk pesanan {order.id}</p>
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
                order={order}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isPaymentSuccessful={paymentSuccessful}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4">
          <PaymentSummary order={order} />

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
              <p>• Untuk transfer bank, masukkan URL bukti transfer</p>
              <p>• Status pesanan akan otomatis diperbarui ke "Diproses"</p>
              <p>• Simpan informasi pembayaran untuk referensi</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
