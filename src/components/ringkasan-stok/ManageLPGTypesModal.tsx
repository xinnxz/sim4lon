'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import SafeIcon from '@/components/common/SafeIcon'
import { lpgProductsApi, type LpgProductWithStock, type LpgCategory } from '@/lib/api'
import { toast } from 'sonner'

interface ManageLPGTypesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductUpdate?: () => void
}

// Color options for products
const colorOptions = [
  { name: 'hijau', hex: '#22c55e', label: 'Hijau' },
  { name: 'biru', hex: '#38bdf8', label: 'Biru' },
  { name: 'pink', hex: '#ec4899', label: 'Pink' },
  { name: 'kuning', hex: '#eab308', label: 'Kuning' },
  { name: 'merah', hex: '#dc2626', label: 'Merah' },
  { name: 'ungu', hex: '#a855f7', label: 'Ungu' },
  { name: 'orange', hex: '#f97316', label: 'Orange' },
]

// Fixed size options
const sizeOptions = [
  { value: '0.22', label: '220 gram' },
  { value: '3', label: '3 kg' },
  { value: '5.5', label: '5.5 kg' },
  { value: '12', label: '12 kg' },
  { value: '50', label: '50 kg' },
]

// Brand options
const brandOptions = [
  'Elpiji',
  'Bright Gas',
  'Arsy Gas',
  'MyGas',
  'PrimGas',
  'GGA',
]

// Get color hex from product color name
const getColorHex = (colorName: string | null): string => {
  if (!colorName) return '#6b7280'
  const found = colorOptions.find(c => c.name.toLowerCase() === colorName.toLowerCase())
  return found?.hex || '#6b7280'
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)

type ViewMode = 'list' | 'edit'

interface ProductFormData {
  name: string
  size_kg: string
  category: LpgCategory
  color: string
  brand: string
  selling_price: string
  cost_price: string
  is_active: boolean
}

export default function ManageLPGTypesModal({ open, onOpenChange, onProductUpdate }: ManageLPGTypesModalProps) {
  const [products, setProducts] = useState<LpgProductWithStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingProduct, setEditingProduct] = useState<LpgProductWithStock | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    size_kg: '3',
    category: 'NON_SUBSIDI',
    color: 'biru',
    brand: 'Elpiji',
    selling_price: '',
    cost_price: '',
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      // Fetch ALL products including inactive
      const data = await lpgProductsApi.getAll(true)
      // Get stock for each
      const withStock = await lpgProductsApi.getWithStock()
      // Merge active status with stock data
      const merged = data.map(p => {
        const stockData = withStock.find(ws => ws.id === p.id)
        return { ...p, stock: stockData?.stock || { current: 0 } }
      })
      setProducts(merged as LpgProductWithStock[])
    } catch (err) {
      console.error('Failed to fetch products:', err)
      toast.error('Gagal memuat data produk')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchProducts()
      setViewMode('list')
      setEditingProduct(null)
    }
  }, [open])

  const handleEdit = (product: LpgProductWithStock) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      size_kg: String(product.size_kg),
      category: product.category as LpgCategory,
      color: product.color || 'biru',
      brand: (product as any).brand || 'Elpiji',
      selling_price: String(product.selling_price || 0),
      cost_price: String(product.cost_price || 0),
      is_active: product.is_active !== false,
    })
    setViewMode('edit')
  }

  const handleSave = async () => {
    if (!formData.name || !formData.size_kg || !formData.selling_price) {
      toast.error('Nama, ukuran, dan harga jual wajib diisi')
      return
    }

    setSaving(true)
    try {
      if (editingProduct) {
        await lpgProductsApi.update(editingProduct.id, {
          name: formData.name,
          size_kg: parseFloat(formData.size_kg),
          category: formData.category,
          color: formData.color,
          brand: formData.brand,
          selling_price: parseFloat(formData.selling_price),
          cost_price: parseFloat(formData.cost_price) || 0,
          is_active: formData.is_active,
        })
        toast.success('Produk berhasil diperbarui')
      }
      await fetchProducts()
      onProductUpdate?.()
      setViewMode('list')
    } catch (err) {
      console.error('Failed to save product:', err)
      toast.error('Gagal menyimpan produk')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (product: LpgProductWithStock) => {
    setTogglingId(product.id)
    try {
      const newStatus = product.is_active === false ? true : false
      await lpgProductsApi.update(product.id, { is_active: newStatus })
      toast.success(`Produk ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
      await fetchProducts()
      onProductUpdate?.()
    } catch (err) {
      console.error('Failed to toggle product:', err)
      toast.error('Gagal mengubah status produk')
    } finally {
      setTogglingId(null)
    }
  }

  // Calculate stats
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.is_active !== false).length
  const totalStock = products
    .filter(p => p.is_active !== false)
    .reduce((sum, p) => sum + (p.stock?.current || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70" style={{ boxShadow: '0 4px 12px -2px rgba(var(--primary-rgb), 0.4)' }}>
                  <SafeIcon name="Package" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {viewMode === 'list' ? 'Kelola Produk LPG' : `Edit ${editingProduct?.name}`}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {viewMode === 'list'
                      ? 'Atur tampilan dan harga produk LPG'
                      : 'Ubah detail produk'}
                  </p>
                </div>
              </div>
              {viewMode !== 'list' && (
                <Button variant="ghost" onClick={() => setViewMode('list')} className="gap-2">
                  <SafeIcon name="ArrowLeft" className="h-4 w-4" />
                  Kembali
                </Button>
              )}
            </div>
          </DialogHeader>

          {/* Stats Row - Only show in list mode */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                <p className="text-2xl font-bold text-primary">{totalProducts}</p>
                <p className="text-xs text-muted-foreground">Total Produk</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-green-500/10">
                <p className="text-2xl font-bold text-green-600">{activeProducts}</p>
                <p className="text-xs text-muted-foreground">Produk Aktif</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-purple-500/10">
                <p className="text-2xl font-bold text-purple-600">{totalStock.toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted-foreground">Total Stok Aktif</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'list' && (
            /* Products List */
            <div className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                products.map((product) => {
                  const isActive = product.is_active !== false
                  return (
                    <div
                      key={product.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border bg-card transition-all ${isActive ? 'hover:shadow-md' : 'opacity-50'
                        }`}
                      style={{ borderLeftWidth: '4px', borderLeftColor: isActive ? getColorHex(product.color) : '#9ca3af' }}
                    >
                      {/* Product Icon */}
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: isActive
                            ? `linear-gradient(135deg, ${getColorHex(product.color)}30, ${getColorHex(product.color)}10)`
                            : 'rgba(156,163,175,0.1)',
                        }}
                      >
                        <SafeIcon
                          name="Cylinder"
                          className="h-6 w-6"
                          style={{ color: isActive ? getColorHex(product.color) : '#9ca3af' }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold truncate">{product.name}</h3>
                          <Badge
                            variant="outline"
                            className={`shrink-0 text-xs ${product.category === 'SUBSIDI'
                              ? 'bg-green-500/10 text-green-700 border-green-300'
                              : 'bg-blue-500/10 text-blue-700 border-blue-300'
                              }`}
                          >
                            {product.category === 'SUBSIDI' ? 'Subsidi' : 'Non-Subsidi'}
                          </Badge>
                          {!isActive && (
                            <Badge variant="secondary" className="text-xs">
                              Nonaktif
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                          <span>{product.size_kg} kg</span>
                          <span>•</span>
                          <span>Jual: {formatCurrency(Number(product.selling_price || 0))}</span>
                          {isActive && (
                            <>
                              <span>•</span>
                              <span>Stok: {product.stock?.current || 0}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Active Toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <Switch
                          checked={isActive}
                          disabled={togglingId === product.id}
                          onCheckedChange={() => handleToggleActive(product)}
                        />
                      </div>

                      {/* Edit Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="gap-1 shrink-0"
                      >
                        <SafeIcon name="Pencil" className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Edit Form */}
          {viewMode === 'edit' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Active Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-semibold">Status Produk</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.is_active
                      ? 'Produk aktif dan muncul di halaman Stok LPG'
                      : 'Produk nonaktif dan tidak muncul di halaman Stok LPG'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${formData.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {formData.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Nama Produk</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: LPG 3 kg Subsidi"
                  className="h-11"
                />
              </div>

              {/* Size & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Ukuran (kg)</Label>
                  <Select
                    value={formData.size_kg}
                    onValueChange={(v) => setFormData({ ...formData, size_kg: v })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v as LpgCategory })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUBSIDI">Subsidi</SelectItem>
                      <SelectItem value="NON_SUBSIDI">Non-Subsidi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Merek</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(v) => setFormData({ ...formData, brand: v })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih merek" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandOptions.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selling" className="text-sm font-semibold">Harga Jual (Rp)</Label>
                  <Input
                    id="selling"
                    type="number"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                    placeholder="16000"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost" className="text-sm font-semibold">Harga Beli (Rp)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    placeholder="13000"
                    className="h-11"
                  />
                </div>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Warna Tampilan</Label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setFormData({ ...formData, color: color.name })}
                      className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 ${formData.color === color.name ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                        }`}
                      style={{ backgroundColor: color.hex, borderColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: formData.is_active
                        ? `linear-gradient(135deg, ${getColorHex(formData.color)}30, ${getColorHex(formData.color)}10)`
                        : 'rgba(156,163,175,0.1)',
                    }}
                  >
                    <SafeIcon
                      name="Cylinder"
                      className="h-6 w-6"
                      style={{ color: formData.is_active ? getColorHex(formData.color) : '#9ca3af' }}
                    />
                  </div>
                  <div className={formData.is_active ? '' : 'opacity-50'}>
                    <p className="font-bold">{formData.name || 'Nama Produk'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.size_kg || '0'} kg • {formData.category === 'SUBSIDI' ? 'Subsidi' : 'Non-Subsidi'}
                      {formData.selling_price && ` • ${formatCurrency(parseFloat(formData.selling_price))}`}
                      {!formData.is_active && ' • Nonaktif'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.size_kg || !formData.selling_price}
                className="w-full h-12 text-base font-semibold gap-2"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  boxShadow: '0 4px 12px -2px rgba(34,197,94,0.4)',
                }}
              >
                {saving ? (
                  <SafeIcon name="Loader2" className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <SafeIcon name="Check" className="h-5 w-5" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end items-center bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}