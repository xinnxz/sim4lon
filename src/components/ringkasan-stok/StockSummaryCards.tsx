
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
  showSummary?: boolean
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

export default function StockSummaryCards({ refreshTrigger, showSummary = true }: StockSummaryCardsProps) {
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
      {/* Total Stock Summary Section - Only show if showSummary is true */}
      {showSummary && (
        <div className="glass-card rounded-2xl overflow-hidden animate-fadeInUp">
          <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Total Keseluruhan */}
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600" style={{ boxShadow: '0 4px 20px -4px rgba(34,197,94,0.5)' }}>
                  <SafeIcon name="Package" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Stok Keseluruhan</p>
                  <p className="text-4xl font-bold text-foreground">{totalStock.toLocaleString('id-ID')} <span className="text-lg font-normal text-muted-foreground">unit</span></p>
                </div>
              </div>

              {/* Breakdown by Category - Equal Width Grid */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="text-center p-4 rounded-xl bg-green-500/10 min-w-[100px]">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Subsidi</p>
                  <p className="text-2xl font-bold text-green-600">{totalSubsidi.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-muted-foreground">unit</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-blue-500/10 min-w-[100px]">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Non-Subsidi</p>
                  <p className="text-2xl font-bold text-blue-600">{totalNonSubsidi.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-muted-foreground">unit</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-purple-500/10 min-w-[100px]">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Jenis Produk</p>
                  <p className="text-2xl font-bold text-purple-600">{products.length}</p>
                  <p className="text-xs text-muted-foreground">produk aktif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                className={`overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isEditing ? 'shadow-2xl scale-[1.02]' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${getColorHex(product.color)}08 0%, transparent 50%)`,
                }}
              >
                {/* Color accent bar at top */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${getColorHex(product.color)}, ${getColorHex(product.color)}80)` }}
                />
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold truncate">{product.name}</CardTitle>
                      <div className="text-muted-foreground text-sm font-medium">
                        {product.size_kg} kg
                      </div>
                    </div>
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${getColorHex(product.color)}30, ${getColorHex(product.color)}10)`,
                        boxShadow: `0 4px 12px -2px ${getColorHex(product.color)}40`,
                      }}
                    >
                      <SafeIcon name="Cylinder" className="h-6 w-6" style={{ color: getColorHex(product.color) }} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Stock - Large Display with gradient background */}
                  <div
                    className="text-center py-4 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${getColorHex(product.color)}08, transparent)` }}
                  >
                    <span
                      className={`text-5xl font-bold ${product.stock.current < 0 ? 'text-destructive' : ''}`}
                      style={{ color: product.stock.current >= 0 ? getColorHex(product.color) : undefined }}
                    >
                      {product.stock.current}
                    </span>
                    <span className="text-lg text-muted-foreground ml-2">unit</span>
                  </div>

                  {/* Price & Category with better styling */}
                  <div className="flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 font-medium ${product.category === 'SUBSIDI'
                        ? 'bg-green-500/10 text-green-700 border-green-300'
                        : 'bg-blue-500/10 text-blue-700 border-blue-300'
                        }`}
                    >
                      {getCategoryLabel(product.category)}
                    </Badge>
                    {displayPrice > 0 && (
                      <span className="font-bold text-lg">{formatPrice(Number(displayPrice))}</span>
                    )}
                  </div>


                  {/* Edit Mode - Enhanced UI */}
                  {isEditing ? (
                    <div
                      className="space-y-4 pt-4 mt-3 rounded-2xl p-4 -mx-2"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
                        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.8)',
                      }}
                    >
                      {/* Quantity Stepper */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                          Jumlah Unit
                        </label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-12 p-0 select-none rounded-xl border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
                            onClick={handleDecrement}
                            onMouseDown={() => startHold('decrement')}
                            onMouseUp={stopHold}
                            onMouseLeave={stopHold}
                            onTouchStart={() => startHold('decrement')}
                            onTouchEnd={stopHold}
                            disabled={!editQuantity || parseInt(editQuantity) <= 0}
                          >
                            <SafeIcon name="Minus" className="h-5 w-5" />
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
                            className="h-12 text-center text-2xl font-bold flex-1 rounded-xl border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            autoFocus
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-12 p-0 select-none rounded-xl border-2 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all"
                            onClick={handleIncrement}
                            onMouseDown={() => startHold('increment')}
                            onMouseUp={stopHold}
                            onMouseLeave={stopHold}
                            onTouchStart={() => startHold('increment')}
                            onTouchEnd={stopHold}
                          >
                            <SafeIcon name="Plus" className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          className="h-11 rounded-xl font-semibold gap-2"
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            boxShadow: '0 4px 12px -2px rgba(239,68,68,0.4)',
                          }}
                          onClick={() => handleSubmit(product, 'KELUAR')}
                          disabled={isSubmitting || !editQuantity}
                        >
                          {isSubmitting ? (
                            <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <SafeIcon name="ArrowDownCircle" className="h-4 w-4" />
                              Keluar
                            </>
                          )}
                        </Button>
                        <Button
                          className="h-11 rounded-xl font-semibold gap-2"
                          style={{
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            boxShadow: '0 4px 12px -2px rgba(34,197,94,0.4)',
                          }}
                          onClick={() => handleSubmit(product, 'MASUK')}
                          disabled={isSubmitting || !editQuantity}
                        >
                          {isSubmitting ? (
                            <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <SafeIcon name="ArrowUpCircle" className="h-4 w-4" />
                              Masuk
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Cancel Button */}
                      <button
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        Batal
                      </button>
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
    </div >
  )
}
