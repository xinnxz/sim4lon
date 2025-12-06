import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import LpgItemSelector from './LpgItemSelector'
import OrderSummary from './OrderSummary'

interface LpgItem {
  id: string | number
  type: '3kg' | '12kg' | '50kg'
  quantity: number
  price: number
}

interface OrderFormData {
  pangkalanId: string
  items: LpgItem[]
}

interface EditOrderData {
  orderId?: string
  status?: string
  statusLabel?: string
  customer?: {
    name: string
    address: string
  }
}

// Mock data
const mockPangkalan = [
  { id: '1', name: 'Pangkalan Maju Jaya', address: 'Jl. Raya Utama No. 123' },
  { id: '2', name: 'Pangkalan Sejahtera', address: 'Jl. Gatot Subroto No. 456' },
  { id: '3', name: 'Pangkalan Bersama', address: 'Jl. Ahmad Yani No. 789' },
  { id: '4', name: 'Pangkalan Mitra Utama', address: 'Jl. Diponegoro No. 321' },
]

// Mock order data for edit mode
const mockOrderData: Record<string, any> = {
  'ORD-2024-12345': {
    orderId: 'ORD-2024-12345',
    status: 'pending_payment',
    statusLabel: 'Menunggu Pembayaran',
    customer: {
      name: 'Pangkalan Maju Jaya',
      address: 'Jl. Raya Industri No. 45, Jakarta Timur',
    },
    pangkalanId: '1',
    items: [
      { id: 1, type: '3kg', quantity: 50, price: 25000 },
      { id: 2, type: '12kg', quantity: 20, price: 75000 },
    ],
    subtotal: 2750000,
    tax: 275000,
    total: 3025000,
  }
}

const lpgPrices: Record<'3kg' | '12kg' | '50kg', number> = {
  '3kg': 25000,
  '12kg': 85000,
  '50kg': 350000,
}

export default function CreateOrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    pangkalanId: '',
    items: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editOrderData, setEditOrderData] = useState<EditOrderData | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const orderId = params.get('id')
      
      if (orderId && mockOrderData[orderId]) {
        const orderData = mockOrderData[orderId]
        setIsEditMode(true)
        setEditOrderData(orderData)
        setFormData({
          pangkalanId: orderData.pangkalanId,
          items: orderData.items,
        })
      }
    }
  }, [])

  const isFormReadonly = editOrderData?.status === 'completed'
  const isPaymentConfirmed = editOrderData?.status === 'payment_confirmed'

  const handlePangkalanChange = (value: string) => {
    if (!isFormReadonly) {
      setFormData(prev => ({ ...prev, pangkalanId: value }))
    }
  }

  const handleItemsChange = (items: LpgItem[]) => {
    if (!isPaymentConfirmed) {
      setFormData(prev => ({ ...prev, items }))
    }
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.pangkalanId) {
      alert('Silakan pilih pangkalan')
      return
    }

    if (!isEditMode && formData.items.length === 0) {
      alert('Silakan tambahkan minimal satu item LPG')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode) {
        console.log('Order updated:', formData)
        alert('Pesanan berhasil diperbarui!')
      } else {
        console.log('Order created:', formData)
        alert('Pesanan berhasil dibuat!')
      }
      window.location.href = './detail-pesanan.html'
    }, 1000)
  }

  const handleCancel = () => {
    if (isEditMode && editOrderData?.orderId) {
      window.location.href = `./detail-pesanan.html?id=${editOrderData.orderId}`
    } else {
      window.location.href = './daftar-pesanan.html'
    }
  }

  const selectedPangkalan = mockPangkalan.find(p => p.id === formData.pangkalanId)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Pesanan' : 'Detail Pesanan'}
            </CardTitle>
            <CardDescription>
              {isEditMode 
                ? `Perbarui informasi pesanan ${editOrderData?.orderId}` 
                : 'Lengkapi informasi pesanan LPG baru'}
            </CardDescription>
            {isEditMode && editOrderData && (
              <div className="mt-4 flex items-center gap-3 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Status Pesanan:</span>
                <Badge 
                  className={`${
                    editOrderData.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                    editOrderData.status === 'payment_confirmed' ? 'bg-blue-100 text-blue-800' :
                    editOrderData.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {editOrderData.statusLabel}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isFormReadonly && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  Pesanan dengan status selesai tidak dapat diubah
                </p>
              </div>
            )}
            {isPaymentConfirmed && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Hanya catatan yang dapat diedit. Item dan jumlah pesanan terkunci.
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pangkalan Selection */}
              <div className="space-y-2">
                <Label htmlFor="pangkalan" className="text-base font-semibold">
                  Pilih Pangkalan <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.pangkalanId} onValueChange={handlePangkalanChange} disabled={isFormReadonly}>
                  <SelectTrigger id="pangkalan" className="h-10">
                    <SelectValue placeholder="Pilih pangkalan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPangkalan.map(pangkalan => (
                      <SelectItem key={pangkalan.id} value={pangkalan.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{pangkalan.name}</span>
                          <span className="text-xs text-muted-foreground">{pangkalan.address}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPangkalan && (
                  <div className="mt-2 p-3 bg-secondary rounded-lg border border-border">
                    <p className="text-sm font-medium text-foreground">{selectedPangkalan.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPangkalan.address}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* LPG Items */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    Item LPG <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isPaymentConfirmed 
                      ? 'Item dan jumlah pesanan tidak dapat diubah setelah pembayaran dikonfirmasi' 
                      : 'Tambahkan jenis dan jumlah LPG yang ingin dipesan'}
                  </p>
                </div>
                <LpgItemSelector 
                  items={formData.items}
                  onItemsChange={handleItemsChange}
                  disabled={isFormReadonly || isPaymentConfirmed}
                />
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <SafeIcon name="X" className="mr-2 h-4 w-4" />
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.pangkalanId || formData.items.length === 0 || isFormReadonly}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Memperbarui...' : 'Menyimpan...'}
                    </>
                  ) : (
                    <>
                      <SafeIcon name={isEditMode ? 'Edit' : 'Save'} className="mr-2 h-4 w-4" />
                      {isEditMode ? 'Perbarui Pesanan' : 'Simpan Pesanan'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <div className="lg:col-span-1">
        <OrderSummary 
          pangkalan={selectedPangkalan}
          items={formData.items}
          total={calculateTotal()}
          isEditMode={isEditMode}
          editOrderStatus={editOrderData?.status}
        />
      </div>
    </div>
  )
}