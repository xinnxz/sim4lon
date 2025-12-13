/**
 * CreateOrderForm - Form untuk membuat pesanan baru
 * 
 * PENJELASAN:
 * Component ini menampilkan form untuk membuat pesanan LPG baru dengan:
 * - Fetch pangkalan dari API (real data)
 * - Fetch produk LPG dari API (dynamic products)
 * - Submit pesanan via ordersApi
 * - Support edit mode untuk update pesanan existing
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import {
  pangkalanApi,
  lpgProductsApi,
  ordersApi,
  type Pangkalan,
  type LpgProduct,
  type OrderStatus
} from '@/lib/api'

interface OrderItem {
  id: string
  productId: string
  lpgType: string
  label: string
  price: number
  quantity: number
}

interface OrderFormData {
  pangkalanId: string
  note: string
  items: OrderItem[]
}

export default function CreateOrderForm() {
  // Data state
  const [pangkalanList, setPangkalanList] = useState<Pangkalan[]>([])
  const [lpgProducts, setLpgProducts] = useState<LpgProduct[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Form state
  const [formData, setFormData] = useState<OrderFormData>({
    pangkalanId: '',
    note: '',
    items: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [editOrderId, setEditOrderId] = useState<string | null>(null)
  const [editOrderStatus, setEditOrderStatus] = useState<OrderStatus | null>(null)

  /**
   * Fetch pangkalan dan products saat mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const [pangkalanRes, productsRes] = await Promise.all([
          pangkalanApi.getAll(1, 100, undefined, true), // Only active pangkalan
          lpgProductsApi.getAll(), // All active LPG products
        ])

        setPangkalanList(pangkalanRes.data)
        setLpgProducts(productsRes)

        // Keep items array empty on load (user will add items via button)
        // Items will be added when user clicks "+ Tambah Item LPG"
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Gagal memuat data pangkalan dan produk')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()

    // Check for edit mode
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const orderId = params.get('id')
      if (orderId) {
        setIsEditMode(true)
        setEditOrderId(orderId)
        loadOrderForEdit(orderId)
      }
    }
  }, [])

  /**
   * Load order data for edit mode
   */
  const loadOrderForEdit = async (orderId: string) => {
    try {
      const order = await ordersApi.getById(orderId)
      setEditOrderStatus(order.current_status)
      setFormData({
        pangkalanId: order.pangkalan_id,
        note: order.note || '',
        items: order.order_items.map((item, index) => ({
          id: String(index + 1),
          productId: '', // Will need to match with products
          lpgType: item.lpg_type,
          label: item.label,
          price: item.price_per_unit,
          quantity: item.qty,
        })),
      })
    } catch (error) {
      console.error('Failed to load order:', error)
      toast.error('Gagal memuat data pesanan')
    }
  }

  /**
   * Handle pangkalan selection
   */
  const handlePangkalanChange = (value: string) => {
    setFormData(prev => ({ ...prev, pangkalanId: value }))
  }

  /**
   * Handle product selection for an item
   */
  const handleProductChange = (itemId: string, productId: string) => {
    const product = lpgProducts.find(p => p.id === productId)
    if (!product) return

    const defaultPrice = product.prices?.find(p => p.is_default)?.price || product.prices?.[0]?.price || 0

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
            ...item,
            productId,
            lpgType: `${product.size_kg}kg`,
            label: product.name,
            price: defaultPrice,
          }
          : item
      ),
    }))
  }

  /**
   * Handle quantity change
   */
  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }))
  }

  /**
   * Add new item
   */
  const handleAddItem = () => {
    if (lpgProducts.length === 0) return
    const newId = String(Math.max(...formData.items.map(i => parseInt(i.id)), 0) + 1)
    const defaultProduct = lpgProducts[0]
    const defaultPrice = defaultProduct.prices?.find(p => p.is_default)?.price || defaultProduct.prices?.[0]?.price || 0

    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          productId: defaultProduct.id,
          lpgType: `${defaultProduct.size_kg}kg`,
          label: defaultProduct.name,
          price: defaultPrice,
          quantity: 1,
        },
      ],
    }))
  }

  /**
   * Remove item
   */
  const handleRemoveItem = (itemId: string) => {
    if (formData.items.length <= 1) {
      toast.error('Minimal harus ada satu item LPG')
      return
    }
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }))
  }

  /**
   * Calculate total
   */
  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.pangkalanId) {
      toast.error('Silakan pilih pangkalan')
      return
    }

    if (formData.items.length === 0) {
      toast.error('Silakan tambahkan minimal satu item LPG')
      return
    }

    setIsSubmitting(true)

    try {
      // Ensure all numeric values are proper numbers
      const orderDto = {
        pangkalan_id: formData.pangkalanId,
        note: formData.note || undefined,
        items: formData.items.map(item => ({
          lpg_type: item.lpgType,
          label: item.label,
          price_per_unit: Number(item.price),  // Ensure it's a number
          qty: Math.floor(Number(item.quantity)),  // Ensure it's an integer
        })),
      }

      // DEBUG: Log what's being sent
      console.log('=== DEBUG ORDER SUBMISSION ===')
      console.log('orderDto:', JSON.stringify(orderDto, null, 2))

      const result = await ordersApi.create(orderDto)
      toast.success('Pesanan berhasil dibuat!')

      // Redirect to order detail
      window.location.href = `/detail-pesanan?id=${result.id}`
    } catch (error: any) {
      console.error('Failed to create order:', error)
      toast.error(error.message || 'Gagal membuat pesanan')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (isEditMode && editOrderId) {
      window.location.href = `/detail-pesanan?id=${editOrderId}`
    } else {
      window.location.href = '/daftar-pesanan'
    }
  }

  const selectedPangkalan = pangkalanList.find(p => p.id === formData.pangkalanId)
  const isFormDisabled = editOrderStatus === 'SELESAI' || editOrderStatus === 'BATAL'

  // Loading state
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <SafeIcon name="Loader2" className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Pesanan' : 'Buat Pesanan Baru'}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? `Perbarui informasi pesanan`
                : 'Lengkapi informasi pesanan LPG baru'}
            </CardDescription>
            {isEditMode && editOrderStatus && (
              <div className="mt-4 flex items-center gap-3 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="secondary">{editOrderStatus}</Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isFormDisabled && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  Pesanan dengan status selesai atau dibatalkan tidak dapat diubah
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pangkalan Selection */}
              <div className="space-y-2">
                <Label htmlFor="pangkalan" className="text-base font-semibold">
                  Pilih Pangkalan <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.pangkalanId}
                  onValueChange={handlePangkalanChange}
                  disabled={isFormDisabled}
                >
                  <SelectTrigger id="pangkalan" className="h-10">
                    <SelectValue placeholder="Pilih pangkalan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pangkalanList.map(pangkalan => (
                      <SelectItem key={pangkalan.id} value={pangkalan.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{pangkalan.name}</span>
                          <span className="text-xs text-muted-foreground">{pangkalan.address}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* LPG Items */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    Item LPG <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pilih jenis dan jumlah LPG yang ingin dipesan
                  </p>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <Card key={item.id} className="border border-border">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Item {index + 1}
                            </span>
                            {formData.items.length > 1 && !isFormDisabled && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <SafeIcon name="Trash2" className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* LPG Type */}
                            <div className="space-y-2">
                              <Label className="text-sm">Jenis LPG</Label>
                              <Select
                                value={item.productId}
                                onValueChange={(value) => handleProductChange(item.id, value)}
                                disabled={isFormDisabled}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Pilih produk..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {lpgProducts.map(product => {
                                    const price = product.prices?.find(p => p.is_default)?.price || product.prices?.[0]?.price || 0
                                    return (
                                      <SelectItem key={product.id} value={product.id}>
                                        {product.name} - Rp {price.toLocaleString('id-ID')}
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                              <Label className="text-sm">Jumlah</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                className="h-9"
                                disabled={isFormDisabled}
                              />
                            </div>
                          </div>

                          {/* Price Display */}
                          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                            <span className="text-sm text-muted-foreground">Harga per unit:</span>
                            <span className="font-semibold text-foreground">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                          </div>

                          {/* Subtotal */}
                          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <span className="text-sm font-medium text-foreground">Subtotal:</span>
                            <span className="font-bold text-primary">
                              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add Item Button */}
                {!isFormDisabled && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddItem}
                    className="w-full border-dashed"
                  >
                    <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                    Tambah Item LPG
                  </Button>
                )}
              </div>

              <Separator />

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-base font-semibold">
                  Catatan (Opsional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="Tambahkan catatan untuk pesanan ini..."
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  className="min-h-[100px]"
                  disabled={isFormDisabled}
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
                  disabled={isSubmitting || !formData.pangkalanId || formData.items.length === 0 || isFormDisabled}
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
        <Card className="sticky top-6 border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? 'Verifikasi perubahan pesanan' : 'Verifikasi detail sebelum menyimpan'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pangkalan Info */}
            {selectedPangkalan ? (
              <div className="space-y-2 p-3 bg-secondary rounded-lg border border-border">
                <div className="flex items-start gap-2">
                  <SafeIcon name="Store" className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{selectedPangkalan.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{selectedPangkalan.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Pilih pangkalan untuk melihat detail
                </p>
              </div>
            )}

            <Separator />

            {/* Items Summary */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Item Pesanan</p>
              {formData.items.length > 0 ? (
                <div className="space-y-2">
                  {formData.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {item.lpgType}
                        </Badge>
                        <span className="text-muted-foreground">× {item.quantity}</span>
                      </div>
                      <span className="font-medium text-foreground">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada item</p>
              )}
            </div>

            <Separator />

            {/* Summary Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Item:</span>
                <span className="font-medium">{formData.items.reduce((sum, item) => sum + item.quantity, 0)} tabung</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jenis LPG:</span>
                <span className="font-medium">{new Set(formData.items.map(i => i.lpgType)).size} jenis</span>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="space-y-2 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total Pembayaran:</span>
                <span className="text-2xl font-bold text-primary">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Belum termasuk biaya pengiriman
              </p>
            </div>

            {/* Status Info */}
            {!isEditMode && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-2">
                  <SafeIcon name="Info" className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Pesanan akan dibuat dengan status <strong>Menunggu Pembayaran</strong>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}