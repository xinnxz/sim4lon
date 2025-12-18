/**
 * PengaturanHargaPage - LPG Price Management
 * 
 * Halaman untuk mengelola harga LPG per pangkalan
 * - View all LPG types with current prices
 * - Edit cost_price (harga modal) and selling_price (harga jual)
 * - Toggle is_active for each type
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { lpgPricesApi, type PangkalanLpgPrice } from '@/lib/api'
import { toast } from 'sonner'

// LPG Display info (colors, labels)
const LPG_INFO: Record<string, { display: string; color: string; bgGradient: string }> = {
    kg3: { display: 'LPG 3 kg', color: '#22C55E', bgGradient: 'from-green-500 to-emerald-600' },
    kg5: { display: 'LPG 5.5 kg', color: '#ff82c5', bgGradient: 'from-pink-400 to-pink-600' },
    kg12: { display: 'LPG 12 kg', color: '#3B82F6', bgGradient: 'from-blue-500 to-indigo-600' },
    kg50: { display: 'LPG 50 kg', color: '#ef0e0e', bgGradient: 'from-red-500 to-red-600' },
}

export default function PengaturanHargaPage() {
    const [prices, setPrices] = useState<PangkalanLpgPrice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [editedPrices, setEditedPrices] = useState<Record<string, { cost: number; sell: number; active: boolean }>>({})

    useEffect(() => {
        fetchPrices()
    }, [])

    const fetchPrices = async () => {
        try {
            setIsLoading(true)
            const data = await lpgPricesApi.getAll()
            setPrices(data)
            // Initialize edited prices state
            const edited: Record<string, { cost: number; sell: number; active: boolean }> = {}
            data.forEach(p => {
                edited[p.lpg_type] = {
                    cost: Number(p.cost_price),
                    sell: Number(p.selling_price),
                    active: p.is_active,
                }
            })
            setEditedPrices(edited)
        } catch (error: any) {
            toast.error('Gagal memuat data harga')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const pricesToUpdate = Object.entries(editedPrices).map(([lpgType, data]) => ({
                lpg_type: lpgType,
                cost_price: data.cost,
                selling_price: data.sell,
                is_active: data.active,
            }))
            await lpgPricesApi.bulkUpdate(pricesToUpdate)
            toast.success('Harga berhasil disimpan!')
            await fetchPrices()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan harga')
        } finally {
            setIsSaving(false)
        }
    }

    const updatePrice = (lpgType: string, field: 'cost' | 'sell', value: number) => {
        setEditedPrices(prev => ({
            ...prev,
            [lpgType]: { ...prev[lpgType], [field]: value }
        }))
    }

    const toggleActive = (lpgType: string) => {
        setEditedPrices(prev => ({
            ...prev,
            [lpgType]: { ...prev[lpgType], active: !prev[lpgType]?.active }
        }))
    }

    const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID').format(v)

    // Calculate margin for each type
    const getMargin = (lpgType: string) => {
        const data = editedPrices[lpgType]
        if (!data) return 0
        return data.sell - data.cost
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <p className="text-slate-500 mt-4">Memuat pengaturan harga...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Pengaturan Harga LPG</h1>
                    <p className="text-slate-500 mt-1">Kelola harga modal dan harga jual untuk setiap tipe LPG</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
                >
                    {isSaving ? (
                        <>
                            <SafeIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <SafeIcon name="Save" className="h-4 w-4 mr-2" />
                            Simpan Perubahan
                        </>
                    )}
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <SafeIcon name="Info" className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-900">Cara Kerja Harga</h3>
                        <p className="text-sm text-blue-700 mt-1">
                            <strong>Harga Modal (HPP)</strong> = Harga beli dari agen/supplier<br />
                            <strong>Harga Jual</strong> = Harga jual ke konsumen<br />
                            <strong>Margin</strong> = Selisih harga jual - harga modal (keuntungan per tabung)
                        </p>
                    </div>
                </div>
            </div>

            {/* Price Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {prices.map((price) => {
                    const info = LPG_INFO[price.lpg_type] || { display: price.lpg_type, color: '#666', bgGradient: 'from-gray-500 to-gray-600' }
                    const edited = editedPrices[price.lpg_type]
                    const margin = getMargin(price.lpg_type)

                    return (
                        <Card key={price.id} className={`relative overflow-hidden border-0 shadow-lg ${!edited?.active ? 'opacity-60' : ''}`}>
                            {/* Color Header */}
                            <div className={`h-2 bg-gradient-to-r ${info.bgGradient}`}></div>

                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: info.color + '20' }}
                                        >
                                            <SafeIcon name="Cylinder" className="h-6 w-6" style={{ color: info.color }} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{info.display}</CardTitle>
                                            <p className="text-sm text-slate-500">
                                                Margin: <span className={`font-semibold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    Rp {formatCurrency(margin)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleActive(price.lpg_type)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${edited?.active
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                    >
                                        {edited?.active ? 'Aktif' : 'Nonaktif'}
                                    </button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Cost Price */}
                                <div>
                                    <label className="text-sm font-medium text-slate-600 mb-1.5 block">
                                        Harga Modal (HPP)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                                        <Input
                                            type="number"
                                            value={edited?.cost || ''}
                                            onChange={(e) => updatePrice(price.lpg_type, 'cost', Number(e.target.value))}
                                            className="pl-10 h-11 rounded-xl text-right font-semibold"
                                        />
                                    </div>
                                </div>

                                {/* Selling Price */}
                                <div>
                                    <label className="text-sm font-medium text-slate-600 mb-1.5 block">
                                        Harga Jual ke Konsumen
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                                        <Input
                                            type="number"
                                            value={edited?.sell || ''}
                                            onChange={(e) => updatePrice(price.lpg_type, 'sell', Number(e.target.value))}
                                            className="pl-10 h-11 rounded-xl text-right font-semibold"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
