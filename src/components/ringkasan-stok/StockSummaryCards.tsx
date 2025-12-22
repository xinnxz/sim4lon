
'use client'

/**
 * StockSummaryCards - READ-ONLY Stock Display
 * 
 * SECURITY: Stok tidak bisa diedit manual untuk mencegah manipulasi.
 * - Stok MASUK: Hanya via halaman Penerimaan (dengan dokumen SO/LO)
 * - Stok KELUAR: Hanya via Order yang SELESAI (otomatis)
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { lpgProductsApi, type LpgProductWithStock, type LpgCategory } from '@/lib/api'
import AnimatedNumber from '@/components/common/AnimatedNumber'

interface StockSummaryCardsProps {
  refreshTrigger?: number
  showSummary?: boolean
}

const getStatusFromStock = (current: number, minStock: number): 'normal' | 'warning' | 'critical' => {
  if (current <= minStock * 0.25) return 'critical'
  if (current <= minStock) return 'warning'
  return 'normal'
}

const getStatusBadge = (status: 'normal' | 'warning' | 'critical') => {
  switch (status) {
    case 'critical':
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20">Kritis</Badge>
    case 'warning':
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400">Perhatian</Badge>
    default:
      return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20">Aman</Badge>
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted/50 rounded w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-16 bg-muted rounded w-1/2" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-muted/50 rounded" />
                <div className="h-12 bg-muted/50 rounded" />
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
          <p className="text-muted-foreground">
            Tambahkan produk LPG terlebih dahulu untuk melihat stok.
          </p>
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
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Total Keseluruhan */}
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                  <SafeIcon name="Package" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Stok Keseluruhan</p>
                  <p className="text-4xl font-bold text-foreground"><AnimatedNumber value={totalStock} delay={100} /> <span className="text-lg font-normal text-muted-foreground">unit</span></p>
                </div>
              </div>

              {/* Breakdown by Category */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="text-center p-4 rounded-xl bg-primary/10 dark:bg-primary/20 min-w-[100px]">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Subsidi</p>
                  <p className="text-2xl font-bold text-primary"><AnimatedNumber value={totalSubsidi} delay={200} /></p>
                  <p className="text-xs text-muted-foreground">unit</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-accent/10 dark:bg-accent/20 min-w-[100px]">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Non-Subsidi</p>
                  <p className="text-2xl font-bold text-accent"><AnimatedNumber value={totalNonSubsidi} delay={300} /></p>
                  <p className="text-xs text-muted-foreground">unit</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50 dark:bg-muted/30 min-w-[100px]">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Jenis Produk</p>
                  <p className="text-2xl font-bold text-foreground"><AnimatedNumber value={products.length} delay={400} /></p>
                  <p className="text-xs text-muted-foreground">produk aktif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Stock Cards Grid - READ ONLY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product, index) => {
          const minStock = product.category === 'SUBSIDI' ? 100 : 50
          const status = getStatusFromStock(product.stock.current, minStock)
          const displayPrice = product.selling_price || product.prices?.find(p => p.is_default)?.price || product.prices?.[0]?.price || 0

          return (
            <div
              key={product.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <Card
                className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
                      <AnimatedNumber value={product.stock.current} delay={500 + index * 100} />
                    </span>
                    <span className="text-lg text-muted-foreground ml-2">unit</span>
                  </div>

                  {/* Price & Category */}
                  <div className="flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 font-medium ${product.category === 'SUBSIDI'
                        ? 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20'
                        : 'bg-accent/10 text-accent border-accent/30 dark:bg-accent/20'
                        }`}
                    >
                      {getCategoryLabel(product.category)}
                    </Badge>
                    {displayPrice > 0 && (
                      <span className="font-bold text-lg">{formatPrice(Number(displayPrice))}</span>
                    )}
                  </div>

                  {/* Status Badge & Info - READ ONLY */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    {getStatusBadge(status)}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <SafeIcon name="Lock" className="h-3 w-3" />
                      <span>Read-only</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
