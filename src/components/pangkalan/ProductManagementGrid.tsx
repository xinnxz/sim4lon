import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import SafeIcon from '@/components/common/SafeIcon'

// Format currency helper
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value)
}

interface ProductDisplayItem {
    id: string
    name: string
    size_kg: number
    lpgType: string
    color: string
    selling_price: number
    cost_price: number
    isFromAgen: boolean
    isAdded: boolean
}

interface EditedPrice {
    cost: number
    sell: number
    active: boolean
}

interface Stock {
    id: string
    lpg_type: string
    qty: number
    status: 'AMAN' | 'RENDAH' | 'KRITIS'
    critical_level: number
    warning_level: number
}

interface ProductManagementGridProps {
    products: ProductDisplayItem[]
    editedPrices: Record<string, EditedPrice>
    stocks: Stock[]
    isSaving: boolean
    onAddProduct: (product: any) => void
    onDeactivateProduct: (lpgType: string) => void
    onUpdatePrice: (lpgType: string, field: 'cost' | 'sell', value: number) => void
}

export const ProductManagementGrid: React.FC<ProductManagementGridProps> = ({
    products,
    editedPrices,
    stocks,
    isSaving,
    onAddProduct,
    onDeactivateProduct,
    onUpdatePrice,
}) => {
    // Separate active and inactive products
    const activeProducts = products.filter(p => {
        const edited = editedPrices[p.lpgType]
        return p.isAdded && (edited?.active ?? false)
    })

    const inactiveProducts = products.filter(p => {
        const edited = editedPrices[p.lpgType]
        return !p.isAdded || !(edited?.active ?? false)
    })

    return (
        <div className="space-y-8">
            {/* Active Products Section */}
            {activeProducts.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <SafeIcon name="CheckCircle2" className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Produk Aktif</h3>
                            <p className="text-xs text-slate-500">{activeProducts.length} produk yang dijual</p>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        {activeProducts.map((product) => {
                            const lpgType = product.lpgType
                            const edited = editedPrices[lpgType]
                            const margin = (edited?.sell || 0) - (edited?.cost || 0)
                            const currentStock = stocks.find(s => s.lpg_type === lpgType)
                            const productColor = product.color || '#3B82F6'

                            return (
                                <div
                                    key={product.id}
                                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                                >
                                    {/* Left color stripe */}
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-1.5"
                                        style={{ backgroundColor: productColor }}
                                    />

                                    <div className="p-5 pl-6">
                                        {/* Header row */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${productColor}, ${productColor}CC)`,
                                                    }}
                                                >
                                                    <SafeIcon name="Flame" className="h-7 w-7 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-900">{product.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className="text-sm text-slate-500">{product.size_kg} kg</span>
                                                        {currentStock && (
                                                            <Badge
                                                                variant="secondary"
                                                                className={`text-xs ${currentStock.status === 'KRITIS' ? 'bg-red-100 text-red-700' :
                                                                    currentStock.status === 'RENDAH' ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-green-100 text-green-700'
                                                                    }`}
                                                            >
                                                                Stok: {currentStock.qty}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => onDeactivateProduct(lpgType)}
                                                disabled={isSaving}
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <SafeIcon name="X" className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Pricing Grid - 3 columns */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <label className="text-xs text-slate-500 block mb-1">Harga Beli</label>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xs text-slate-400">Rp</span>
                                                    <Input
                                                        type="number"
                                                        value={edited?.cost || ''}
                                                        onChange={(e) => onUpdatePrice(lpgType, 'cost', Number(e.target.value))}
                                                        className="border-0 bg-transparent p-0 h-auto text-lg font-bold text-slate-900 focus-visible:ring-0 w-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 rounded-xl p-3">
                                                <label className="text-xs text-blue-600 block mb-1">Harga Jual</label>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xs text-blue-400">Rp</span>
                                                    <Input
                                                        type="number"
                                                        value={edited?.sell || ''}
                                                        onChange={(e) => onUpdatePrice(lpgType, 'sell', Number(e.target.value))}
                                                        className="border-0 bg-transparent p-0 h-auto text-lg font-bold text-blue-700 focus-visible:ring-0 w-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className={`rounded-xl p-3 ${margin >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                                <label className={`text-xs block mb-1 ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    Margin
                                                </label>
                                                <div className={`text-lg font-bold ${margin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                    Rp {formatCurrency(margin)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Inactive/Available Products Section */}
            {inactiveProducts.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            <SafeIcon name="Plus" className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Tambah Produk</h3>
                            <p className="text-xs text-slate-500">Klik produk untuk mengaktifkan</p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {inactiveProducts.map((product) => {
                            const productColor = product.color || '#3B82F6'

                            return (
                                <button
                                    key={product.id}
                                    onClick={() => onAddProduct({
                                        id: product.id,
                                        name: product.name,
                                        size_kg: product.size_kg,
                                        selling_price: product.selling_price,
                                        cost_price: product.cost_price,
                                    })}
                                    disabled={isSaving}
                                    className="group flex items-center gap-4 p-4 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50"
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-all group-hover:shadow-lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${productColor}40, ${productColor}20)`,
                                        }}
                                    >
                                        <SafeIcon name="Flame" className="h-6 w-6" style={{ color: productColor }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-600 group-hover:text-blue-600 transition-colors truncate">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-slate-400">{product.size_kg} kg</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-500 flex items-center justify-center transition-all">
                                        <SafeIcon name="Plus" className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {products.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <SafeIcon name="Package" className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="font-medium text-slate-700 mb-1">Tidak ada produk</h3>
                    <p className="text-sm text-slate-500">Produk akan muncul di sini</p>
                </div>
            )}
        </div>
    )
}
