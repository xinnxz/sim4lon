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

import { useState, useEffect, useRef, useCallback } from 'react'
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
  type LpgProductWithStock,
  type OrderStatus
} from '@/lib/api'
import { formatCurrency } from '@/lib/currency'

interface OrderItem {
  id: string
  productId: string
  lpgType: string
  label: string
  price: number
  quantity: number
  isTaxable: boolean  // true jika NON_SUBSIDI (kena PPN 12%)
}

interface OrderFormData {
  pangkalanId: string
  note: string
  items: OrderItem[]
}

export default function CreateOrderForm() {
  // Data state
  const [pangkalanList, setPangkalanList] = useState<Pangkalan[]>([])
  const [lpgProducts, setLpgProducts] = useState<LpgProductWithStock[]>([])
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

  // Hold +/- button refs for quantity stepper
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const holdCountRef = useRef(0)
  const holdItemIdRef = useRef<string | null>(null)

  // Start holding - with acceleration (longer hold = bigger increments)
  const startHold = useCallback((itemId: string, action: 'increment' | 'decrement') => {
    holdCountRef.current = 0
    holdItemIdRef.current = itemId

    // Wait 250ms before starting rapid mode
    holdTimeoutRef.current = setTimeout(() => {
      const tick = () => {
        holdCountRef.current++

        // Acceleration: 0-10 ticks: +1, 11-30: +5, 31+: +10
        let step = 1
        if (holdCountRef.current > 30) step = 10
        else if (holdCountRef.current > 10) step = 5

        const currentItemId = holdItemIdRef.current
        if (!currentItemId) return

        setFormData(prev => ({
          ...prev,
          items: prev.items.map(item => {
            if (item.id !== currentItemId) return item
            const newQty = action === 'increment'
              ? item.quantity + step
              : Math.max(0, item.quantity - step)
            return { ...item, quantity: newQty }
          })
        }))

        // Speed increases: 100ms → 80ms → 75ms
        let delay = 100
        if (holdCountRef.current > 20) delay = 75
        else if (holdCountRef.current > 5) delay = 80

        holdIntervalRef.current = setTimeout(tick, delay)
      }
      tick()
    }, 450)
  }, [])

  // Stop holding
  const stopHold = useCallback(() => {
    holdCountRef.current = 0
    holdItemIdRef.current = null
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
    if (holdIntervalRef.current) {
      clearTimeout(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => stopHold()
  }, [stopHold])

  /**
   * Fetch pangkalan dan products saat mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const [pangkalanRes, productsRes] = await Promise.all([
          pangkalanApi.getAll(1, 100, undefined, true), // Only active pangkalan
          lpgProductsApi.getWithStock(), // LPG products with stock info
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
   * PENJELASAN: Saat edit, perlu match productId dari lpgProducts
   * berdasarkan lpg_type dari order item
   */
  const loadOrderForEdit = async (orderId: string) => {
    try {
      const order = await ordersApi.getById(orderId)
      setEditOrderStatus(order.current_status)

      // Wait for lpgProducts to load if not ready
      const products = lpgProducts.length > 0 ? lpgProducts : await lpgProductsApi.getAll()

      setFormData({
        pangkalanId: order.pangkalan_id,
        note: order.note || '',
        items: order.order_items.map((item, index) => {
          // Match productId by finding product with same size
          // lpg_type format: "3kg", "kg12", "kg50" -> extract number
          const sizeMatch = item.lpg_type.match(/\d+/)
          const size = sizeMatch ? parseFloat(sizeMatch[0]) : 0

          // Find matching product by size
          const matchedProduct = products.find(p =>
            parseFloat(String(p.size_kg)) === size ||
            p.name.toLowerCase().includes(item.label?.toLowerCase() || '')
          )

          return {
            id: String(index + 1),
            productId: matchedProduct?.id || '',
            lpgType: item.lpg_type,
            label: item.label || matchedProduct?.name || item.lpg_type,
            price: item.price_per_unit,
            quantity: item.qty,
            isTaxable: (item as any).is_taxable ?? false,
          }
        }),
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

    // Use selling_price directly, fallback to old prices[] for backward compat
    const defaultPrice = product.selling_price
      || product.prices?.find(p => p.is_default)?.price
      || product.prices?.[0]?.price
      || 0

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
            ...item,
            productId,
            lpgType: `${product.size_kg}kg`,
            label: product.name,
            price: Number(defaultPrice),
            isTaxable: product.category === 'NON_SUBSIDI',  // Update tax status
          }
          : item
      ),
    }))
  }

  /**
   * Handle quantity change - allow typing without immediate validation
   * PENJELASAN: Validasi max stok hanya saat blur, bukan setiap keystroke
   */
  const handleQuantityChange = (itemId: string, quantity: number) => {
    // Allow 0 during typing, validation happens on blur
    if (quantity < 0) quantity = 0

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }))
  }

  /**
   * Validate quantity on blur - ensure min 1 and cap to max stock
   */
  const handleQuantityBlur = (itemId: string) => {
    const item = formData.items.find(i => i.id === itemId)
    if (!item) return

    let newQuantity = item.quantity
    const product = lpgProducts.find(p => p.id === item.productId)
    const maxStock = product?.stock?.current || 0

    // Ensure min 1 (orders must have at least 1)
    if (newQuantity < 1) {
      newQuantity = 1
    }

    // Cap to max stock
    if (maxStock > 0 && newQuantity > maxStock) {
      toast.warning(`Maksimal stok ${product?.name}: ${maxStock} unit`)
      newQuantity = maxStock
    }

    // Update if changed
    if (newQuantity !== item.quantity) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(i =>
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        ),
      }))
    }
  }

  /**
   * Add new item
   */
  const handleAddItem = () => {
    if (lpgProducts.length === 0) return
    const newId = String(Math.max(...formData.items.map(i => parseInt(i.id)), 0) + 1)
    const defaultProduct = lpgProducts[0]
    // Use selling_price directly, fallback to old prices[] for backward compat
    const defaultPrice = defaultProduct.selling_price || defaultProduct.prices?.find(p => p.is_default)?.price || defaultProduct.prices?.[0]?.price || 0
    // NON_SUBSIDI products are taxable (12% PPN)
    const isTaxable = defaultProduct.category === 'NON_SUBSIDI'

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
          isTaxable: isTaxable,
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
  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  /**
   * Calculate PPN 12% for non-subsidi items
   */
  const calculateTax = () => {
    const PPN_RATE = 0.12
    return formData.items.reduce((sum, item) => {
      if (item.isTaxable) {
        return sum + Math.round(item.price * item.quantity * PPN_RATE)
      }
      return sum
    }, 0)
  }

  /**
   * Calculate grand total (subtotal + tax)
   */
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
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
          lpg_product_id: item.productId,  // For dynamic product stock tracking
          label: item.label,
          price_per_unit: Number(item.price),  // Ensure it's a number
          qty: Math.floor(Number(item.quantity)),  // Ensure it's an integer
          is_taxable: item.isTaxable,  // Send tax status for PPN calculation
        })),
      }

      // DEBUG: Log what's being sent
      console.log('=== DEBUG ORDER SUBMISSION ===')
      console.log('isEditMode:', isEditMode)
      console.log('editOrderId:', editOrderId)
      console.log('orderDto:', JSON.stringify(orderDto, null, 2))

      let result
      if (isEditMode && editOrderId) {
        // UPDATE existing order
        result = await ordersApi.update(editOrderId, orderDto)
        toast.success('Pesanan berhasil diperbarui!')
      } else {
        // CREATE new order
        result = await ordersApi.create(orderDto)
        toast.success('Pesanan berhasil dibuat!')
      }

      // Redirect to order detail
      window.location.href = `/detail-pesanan?id=${result.id}`
    } catch (error: any) {
      console.error('Failed to submit order:', error)
      toast.error(error.message || (isEditMode ? 'Gagal memperbarui pesanan' : 'Gagal membuat pesanan'))
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
                                    // Use selling_price directly, fallback to old prices[]
                                    const price = product.selling_price || product.prices?.find(p => p.is_default)?.price || product.prices?.[0]?.price || 0
                                    const stock = product.stock?.current || 0
                                    const isOutOfStock = stock <= 0
                                    return (
                                      <SelectItem
                                        key={product.id}
                                        value={product.id}
                                        disabled={isOutOfStock}
                                        className={isOutOfStock ? 'opacity-50' : ''}
                                      >
                                        <div className="flex items-center justify-between w-full gap-2">
                                          <span>{product.name} - {formatCurrency(price)}</span>
                                          <span className={`text-xs ${isOutOfStock ? 'text-red-500' : 'text-muted-foreground'}`}>
                                            (Stok: {stock})
                                          </span>
                                        </div>
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Quantity with +/- buttons */}
                            <div className="space-y-2">
                              <Label className="text-sm">Jumlah</Label>
                              <div className="flex items-center gap-1">
                                {/* Minus Button - with hold support */}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9 shrink-0 hover:bg-destructive/10 hover:border-destructive/50 active:scale-95 transition-all select-none"
                                  onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                                  onMouseDown={() => startHold(item.id, 'decrement')}
                                  onMouseUp={stopHold}
                                  onMouseLeave={stopHold}
                                  onTouchStart={() => startHold(item.id, 'decrement')}
                                  onTouchEnd={stopHold}
                                  disabled={isFormDisabled || item.quantity <= 0}
                                >
                                  <SafeIcon name="Minus" className="h-4 w-4" />
                                </Button>

                                {/* Quantity Input */}
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={item.quantity || ''}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '')
                                    handleQuantityChange(item.id, parseInt(val) || 0)
                                  }}
                                  onBlur={() => handleQuantityBlur(item.id)}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="0"
                                  className="h-9 text-center font-medium"
                                  disabled={isFormDisabled}
                                />

                                {/* Plus Button - with hold support */}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9 shrink-0 hover:bg-primary/10 hover:border-primary/50 active:scale-95 transition-all select-none"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  onMouseDown={() => startHold(item.id, 'increment')}
                                  onMouseUp={stopHold}
                                  onMouseLeave={stopHold}
                                  onTouchStart={() => startHold(item.id, 'increment')}
                                  onTouchEnd={stopHold}
                                  disabled={isFormDisabled}
                                >
                                  <SafeIcon name="Plus" className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Price Display */}
                          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                            <span className="text-sm text-muted-foreground">Harga per unit:</span>
                            <span className="font-semibold text-foreground">
                              {formatCurrency(item.price)}
                            </span>
                          </div>

                          {/* Subtotal */}
                          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <span className="text-sm font-medium text-foreground">Subtotal:</span>
                            <span className="font-bold text-primary">
                              {formatCurrency(item.price * item.quantity)}
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
                        {formatCurrency(item.price * item.quantity)}
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

            {/* Price Breakdown with PPN */}
            <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>

              {/* PPN 12% (if any taxable items) */}
              {calculateTax() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    PPN 12%
                    <Badge variant="outline" className="text-[10px] px-1 py-0 bg-orange-50 text-orange-600 border-orange-200">
                      Non-Subsidi
                    </Badge>
                  </span>
                  <span className="font-medium text-orange-600">
                    + {formatCurrency(calculateTax())}
                  </span>
                </div>
              )}

              <Separator className="my-2" />

              {/* Grand Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-foreground">Total Pembayaran:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {calculateTax() > 0 ? 'Sudah termasuk PPN untuk produk Non-Subsidi' : 'Produk Subsidi tidak dikenakan PPN'}
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