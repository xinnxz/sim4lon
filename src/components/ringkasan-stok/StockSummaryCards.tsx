
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SafeIcon from '@/components/common/SafeIcon'
import { lpgProductsApi, stockApi, type LpgProductWithStock, type LpgCategory } from '@/lib/api'
import { toast } from 'sonner'

interface StockSummaryCardsProps {
  refreshTrigger?: number
}

// Map lpg_product size to old lpg_type for stock API
const sizeToLpgType = (sizeKg: number): string => {
  if (sizeKg === 3) return '3kg';
  if (sizeKg === 12) return '12kg';
  if (sizeKg === 50) return '50kg';
  if (sizeKg === 5.5) return '3kg'; // Map Bright Gas 5.5kg to 3kg for now
  return '3kg';
}

const getStatusFromStock = (current: number, minStock: number): 'normal' | 'warning' | 'critical' => {
  if (current <= minStock * 0.25) return 'critical'
  if (current <= minStock) return 'warning'
  return 'normal'
}

const getStatusBadge = (status: 'normal' | 'warning' | 'critical') => {
  switch (status) {
    case 'critical':
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Kritis</Badge>
    case 'warning':
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Peringatan</Badge>
    default:
      return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Normal</Badge>
  }
}

const getCategoryLabel = (category: LpgCategory): string => {
  return category === 'SUBSIDI' ? 'Subsidi' : 'Non-Subsidi';
}

// Get color hex from product color name
const getColorHex = (colorName: string | null): string => {
  if (!colorName) return '#6b7280';  // gray default
  const colorMap: Record<string, string> = {
    'hijau': '#22c55e',
    'biru': '#38bdf8',
    'ungu': '#a855f7',
    'pink': '#ec4899',
    'merah': '#dc2626',
    'kuning': '#eab308',
    'orange': '#f97316',
  };
  return colorMap[colorName.toLowerCase()] || '#6b7280';
}

export default function StockSummaryCards({ refreshTrigger }: StockSummaryCardsProps) {
  const [products, setProducts] = useState<LpgProductWithStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit mode state
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hold +/- button refs
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const holdCountRef = useRef(0)  // Track how long held for acceleration

  // Single click handlers - just +1 or -1
  const handleIncrement = useCallback(() => {
    setEditQuantity(prev => String(parseInt(prev || '0') + 1))
  }, [])

  const handleDecrement = useCallback(() => {
    setEditQuantity(prev => String(Math.max(0, parseInt(prev || '0') - 1)))
  }, [])

  // Start holding - with acceleration (longer hold = bigger increments)
  const startHold = useCallback((action: 'increment' | 'decrement') => {
    holdCountRef.current = 0

    // Wait 250ms before starting rapid mode
    holdTimeoutRef.current = setTimeout(() => {
      const tick = () => {
        holdCountRef.current++

        // Acceleration: increment amount increases over time
        // 0-10 ticks: +1, 11-30 ticks: +5, 31+: +10
        let step = 1
        if (holdCountRef.current > 30) step = 10
        else if (holdCountRef.current > 10) step = 5

        if (action === 'increment') {
          setEditQuantity(prev => String(parseInt(prev || '0') + step))
        } else {
          setEditQuantity(prev => String(Math.max(0, parseInt(prev || '0') - step)))
        }

        // Speed also increases: 100ms → 75ms → 50ms
        let delay = 100
        if (holdCountRef.current > 30) delay = 50
        else if (holdCountRef.current > 10) delay = 75

        holdIntervalRef.current = setTimeout(tick, delay)
      }
      tick()
    }, 250)  // Initial delay before rapid mode
  }, [])

  // Stop holding
  const stopHold = useCallback(() => {
    holdCountRef.current = 0
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
    return () => {
      stopHold()
    }
  }, [stopHold])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const data = await lpgProductsApi.getWithStock()
      setProducts(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch products with stock:', err)
      setError('Gagal memuat data stok')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  const handleEdit = (productId: string) => {
    setEditingCard(productId)
    setEditQuantity('')
  }

  const handleCancelEdit = () => {
    setEditingCard(null)
    setEditQuantity('')
  }

  const handleSubmit = async (product: LpgProductWithStock, movementType: 'MASUK' | 'KELUAR') => {
    const qty = parseInt(editQuantity)
    if (!qty || qty <= 0) {
      toast.error('Masukkan jumlah yang valid')
      return
    }

    if (movementType === 'KELUAR' && qty > product.stock.current) {
      toast.error(`Stok tidak mencukupi. Stok saat ini: ${product.stock.current} unit`)
      return
    }

    setIsSubmitting(true)
    try {
      // Use size to determine lpg_type for legacy compatibility
      const lpgType = sizeToLpgType(Number(product.size_kg))

      await stockApi.createMovement({
        lpg_product_id: product.id, // Track by product ID for dynamic products
        lpg_type: lpgType as any,   // Also set legacy type for dashboard
        movement_type: movementType,
        qty: qty,
      })

      toast.success(
        `${movementType === 'MASUK' ? '+' : '-'}${qty} unit ${product.name} berhasil disimpan`
      )

      await fetchData()
      handleCancelEdit()
    } catch (error: any) {
      console.error('Failed to create movement:', error)
      toast.error(error?.message || 'Gagal menyimpan perubahan stok')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-2 shadow-soft animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-100 rounded w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-16 bg-gray-200 rounded w-1/2" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-100 rounded" />
                <div className="h-12 bg-gray-100 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <SafeIcon name="AlertCircle" className="h-10 w-10 mx-auto mb-2 text-destructive" />
        <p>{error}</p>
        <button onClick={fetchData} className="mt-2 text-primary hover:underline">
          Coba lagi
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="p-12 text-center">
          <SafeIcon name="Package" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Belum Ada Produk LPG</h3>
          <p className="text-muted-foreground mb-4">
            Tambahkan produk LPG terlebih dahulu untuk melihat stok.
          </p>
          <Button onClick={() => window.location.href = '/kelola-produk-lpg'}>
            <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
            Kelola Produk LPG
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Calculate total stock across all products
  const totalStock = products.reduce((sum, p) => sum + (p.stock.current || 0), 0)
  const totalSubsidi = products.filter(p => p.category === 'SUBSIDI').reduce((sum, p) => sum + (p.stock.current || 0), 0)
  const totalNonSubsidi = products.filter(p => p.category === 'NON_SUBSIDI').reduce((sum, p) => sum + (p.stock.current || 0), 0)

  return (
    <div className="space-y-6">
      {/* Total Stock Summary Section */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Total Keseluruhan */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                <SafeIcon name="Package" className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Stok Keseluruhan</p>
                <p className="text-3xl font-bold text-foreground">{totalStock.toLocaleString('id-ID')} <span className="text-lg font-normal text-muted-foreground">unit</span></p>
              </div>
            </div>

            {/* Breakdown by Category */}
            <div className="flex gap-6 md:gap-8">
              <div className="text-center md:text-right">
                <p className="text-xs font-medium text-muted-foreground mb-1">Subsidi</p>
                <p className="text-xl font-bold text-green-600">{totalSubsidi.toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted-foreground">unit</p>
              </div>
              <div className="h-12 w-px bg-border hidden md:block" />
              <div className="text-center md:text-right">
                <p className="text-xs font-medium text-muted-foreground mb-1">Non-Subsidi</p>
                <p className="text-xl font-bold text-blue-600">{totalNonSubsidi.toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted-foreground">unit</p>
              </div>
              <div className="h-12 w-px bg-border hidden md:block" />
              <div className="text-center md:text-right">
                <p className="text-xs font-medium text-muted-foreground mb-1">Jenis Produk</p>
                <p className="text-xl font-bold text-foreground">{products.length}</p>
                <p className="text-xs text-muted-foreground">produk aktif</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product, index) => {
          const isEditing = editingCard === product.id
          const minStock = product.category === 'SUBSIDI' ? 100 : 50
          const status = getStatusFromStock(product.stock.current, minStock)
          // Use selling_price directly, fallback to old prices[] for backward compat
          const displayPrice = product.selling_price || product.prices?.find(p => p.is_default)?.price || product.prices?.[0]?.price || 0

          return (
            <div
              key={product.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <Card
                className={`border shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden ${isEditing ? 'ring-2 ring-primary' : ''}`}
                style={{ borderLeftWidth: '4px', borderLeftColor: getColorHex(product.color) }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-bold truncate">{product.name}</CardTitle>
                      <div className="text-muted-foreground text-xs">
                        {product.size_kg} kg
                      </div>
                    </div>
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50"
                    >
                      <SafeIcon name="Cylinder" className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Current Stock - Large Display */}
                  <div className="text-center py-2">
                    <span className={`text-4xl font-bold ${product.stock.current < 0 ? 'text-destructive' : 'text-foreground'}`}>
                      {product.stock.current}
                    </span>
                    <span className="text-lg text-muted-foreground ml-2">unit</span>
                  </div>

                  {/* Price & Category */}
                  <div className="flex justify-between items-center text-xs">
                    <Badge variant="outline" className="text-muted-foreground">
                      {getCategoryLabel(product.category)}
                    </Badge>
                    {displayPrice > 0 && (
                      <span className="font-semibold">{formatPrice(Number(displayPrice))}</span>
                    )}
                  </div>


                  {/* Edit Mode */}
                  {isEditing ? (
                    <div className="space-y-3 pt-2 border-t">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Jumlah</label>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 select-none"
                            onClick={handleDecrement}
                            onMouseDown={() => startHold('decrement')}
                            onMouseUp={stopHold}
                            onMouseLeave={stopHold}
                            onTouchStart={() => startHold('decrement')}
                            onTouchEnd={stopHold}
                            disabled={!editQuantity || parseInt(editQuantity) <= 0}
                          >
                            <SafeIcon name="Minus" className="h-4 w-4" />
                          </Button>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={editQuantity}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '')
                              setEditQuantity(val)
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="0"
                            className="h-10 text-center text-lg font-semibold flex-1"
                            autoFocus
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 select-none"
                            onClick={handleIncrement}
                            onMouseDown={() => startHold('increment')}
                            onMouseUp={stopHold}
                            onMouseLeave={stopHold}
                            onTouchStart={() => startHold('increment')}
                            onTouchEnd={stopHold}
                          >
                            <SafeIcon name="Plus" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleSubmit(product, 'KELUAR')}
                          disabled={isSubmitting || !editQuantity}
                        >
                          {isSubmitting ? (
                            <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <SafeIcon name="Minus" className="h-4 w-4 mr-1" />
                              Keluar
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleSubmit(product, 'MASUK')}
                          disabled={isSubmitting || !editQuantity}
                        >
                          {isSubmitting ? (
                            <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <SafeIcon name="Plus" className="h-4 w-4 mr-1" />
                              Masuk
                            </>
                          )}
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        Batal
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2 border-t">
                      {getStatusBadge(status)}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleEdit(product.id)}
                      >
                        <SafeIcon name="Pencil" className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
