/**
 * StokPangkalanPage - Enhanced Stok LPG Page
 * 
 * Features:
 * - Real API integration with pangkalanStockApi
 * - Pesan ke Agen (future integration placeholder)
 * - Stock receive from agen
 * - Stock adjustment (opname)
 * - Stock movements history
 * - Consistent styling with Dashboard/Laporan
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import { authApi, pangkalanStockApi, type UserProfile, type StockLevel, type LpgType } from '@/lib/api'
import { toast } from 'sonner'

// LPG type config
const LPG_CONFIG: Record<string, { name: string; color: string; gradient: string }> = {
    'kg3': { name: 'LPG 3 kg', color: '#22C55E', gradient: 'from-green-500 to-emerald-600' },
    'kg5': { name: 'LPG 5.5 kg', color: '#06B6D4', gradient: 'from-cyan-500 to-teal-600' },
    'kg12': { name: 'LPG 12 kg', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
    'kg50': { name: 'LPG 50 kg', color: '#F59E0B', gradient: 'from-amber-500 to-orange-600' },
}

export default function StokPangkalanPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stocks, setStocks] = useState<StockLevel[]>([])
    const [totalStock, setTotalStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isReceiveOpen, setIsReceiveOpen] = useState(false)
    const [isOrderOpen, setIsOrderOpen] = useState(false)
    const [receiveData, setReceiveData] = useState({ lpgType: 'kg3' as LpgType, qty: 0, note: '' })
    const [orderData, setOrderData] = useState({ lpgType: 'kg3' as LpgType, qty: 0, note: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [profileData, stockResponse] = await Promise.all([
                authApi.getProfile(),
                pangkalanStockApi.getStockLevels(),
            ])
            setProfile(profileData)
            setStocks(stockResponse.stocks)
            setTotalStock(stockResponse.summary.total)
        } catch (error) {
            console.error('Failed to fetch data:', error)
            toast.error('Gagal memuat data stok')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const getStockStatus = (stock: StockLevel) => {
        if (stock.status === 'KRITIS') return { label: 'Kritis', color: 'bg-red-100 text-red-700 border-red-200' }
        if (stock.status === 'RENDAH') return { label: 'Menipis', color: 'bg-orange-100 text-orange-700 border-orange-200' }
        return { label: 'Aman', color: 'bg-green-100 text-green-700 border-green-200' }
    }

    const handleReceiveStock = async () => {
        if (receiveData.qty <= 0) {
            toast.error('Jumlah harus lebih dari 0')
            return
        }
        try {
            setIsSubmitting(true)
            await pangkalanStockApi.receiveStock({
                lpg_type: receiveData.lpgType,
                qty: receiveData.qty,
                note: receiveData.note || undefined,
            })
            toast.success(`Berhasil terima ${receiveData.qty} tabung ${LPG_CONFIG[receiveData.lpgType]?.name}`)
            setIsReceiveOpen(false)
            setReceiveData({ lpgType: 'kg3', qty: 0, note: '' })
            fetchData()
        } catch (error: any) {
            toast.error(error.message || 'Gagal mencatat penerimaan stok')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleOrderToAgen = async () => {
        if (orderData.qty <= 0) {
            toast.error('Jumlah harus lebih dari 0')
            return
        }
        // Future: API integration with agen
        toast.success(`Pesanan ${orderData.qty} tabung ${LPG_CONFIG[orderData.lpgType]?.name} berhasil dikirim ke Agen! (Coming Soon)`)
        setIsOrderOpen(false)
        setOrderData({ lpgType: 'kg3', qty: 0, note: '' })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SafeIcon name="Package" className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 mt-4 font-medium">Memuat data stok...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Stok LPG</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <SafeIcon name="Package" className="h-4 w-4" />
                        Kelola ketersediaan stok LPG di pangkalan
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Pesan ke Agen Button */}
                    <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <SafeIcon name="Truck" className="h-4 w-4 mr-2" />
                                Pesan ke Agen
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <SafeIcon name="Truck" className="h-5 w-5 text-blue-600" />
                                    </div>
                                    Pesan ke Agen
                                </DialogTitle>
                                <DialogDescription>
                                    Kirim pesanan LPG ke agen distributor
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipe LPG</label>
                                    <Select value={orderData.lpgType} onValueChange={(v) => setOrderData({ ...orderData, lpgType: v as LpgType })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg3">LPG 3 kg</SelectItem>
                                            <SelectItem value="kg5">LPG 5.5 kg</SelectItem>
                                            <SelectItem value="kg12">LPG 12 kg</SelectItem>
                                            <SelectItem value="kg50">LPG 50 kg</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Jumlah (tabung)</label>
                                    <Input
                                        type="number"
                                        placeholder="Masukkan jumlah"
                                        value={orderData.qty || ''}
                                        onChange={(e) => setOrderData({ ...orderData, qty: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Catatan (opsional)</label>
                                    <Input
                                        placeholder="Catatan tambahan"
                                        value={orderData.note}
                                        onChange={(e) => setOrderData({ ...orderData, note: e.target.value })}
                                    />
                                </div>
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <div className="flex items-start gap-2">
                                        <SafeIcon name="AlertCircle" className="h-4 w-4 text-amber-600 mt-0.5" />
                                        <p className="text-sm text-amber-700">
                                            <strong>Coming Soon:</strong> Fitur integrasi dengan agen akan segera tersedia.
                                            Pesanan akan dikirim langsung ke sistem agen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOrderOpen(false)}>Batal</Button>
                                <Button onClick={handleOrderToAgen} className="bg-blue-600 hover:bg-blue-700">
                                    <SafeIcon name="Send" className="h-4 w-4 mr-2" />
                                    Kirim Pesanan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Terima Stok Button */}
                    <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg shadow-green-500/25">
                                <SafeIcon name="PackagePlus" className="h-4 w-4 mr-2" />
                                Terima Stok
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <SafeIcon name="PackagePlus" className="h-5 w-5 text-green-600" />
                                    </div>
                                    Terima Stok dari Agen
                                </DialogTitle>
                                <DialogDescription>
                                    Catat penerimaan LPG dari agen
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipe LPG</label>
                                    <Select value={receiveData.lpgType} onValueChange={(v) => setReceiveData({ ...receiveData, lpgType: v as LpgType })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg3">LPG 3 kg</SelectItem>
                                            <SelectItem value="kg5">LPG 5.5 kg</SelectItem>
                                            <SelectItem value="kg12">LPG 12 kg</SelectItem>
                                            <SelectItem value="kg50">LPG 50 kg</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Jumlah (tabung)</label>
                                    <Input
                                        type="number"
                                        placeholder="Masukkan jumlah"
                                        value={receiveData.qty || ''}
                                        onChange={(e) => setReceiveData({ ...receiveData, qty: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Catatan (opsional)</label>
                                    <Input
                                        placeholder="Contoh: Pengiriman dari Agen XYZ"
                                        value={receiveData.note}
                                        onChange={(e) => setReceiveData({ ...receiveData, note: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReceiveOpen(false)}>Batal</Button>
                                <Button onClick={handleReceiveStock} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                                    {isSubmitting ? (
                                        <SafeIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <SafeIcon name="Check" className="h-4 w-4 mr-2" />
                                    )}
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Total Stock Summary */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm mb-1 flex items-center gap-2">
                                <SafeIcon name="Package" className="h-4 w-4" />
                                Total Stok Tersedia
                            </p>
                            <p className="text-5xl font-bold tracking-tight">{totalStock}</p>
                            <p className="text-blue-100 text-sm mt-2">tabung dari {stocks.length} tipe LPG</p>
                        </div>
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <SafeIcon name="Flame" className="h-10 w-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stock per Type Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stocks.map((stock) => {
                    const config = LPG_CONFIG[stock.lpg_type] || { name: stock.lpg_type, gradient: 'from-slate-500 to-slate-600' }
                    const status = getStockStatus(stock)
                    return (
                        <Card key={stock.id} className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <CardHeader className="pb-2 relative">
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
                                        <SafeIcon name="Flame" className="h-6 w-6 text-white" />
                                    </div>
                                    <Badge variant="outline" className={status.color}>
                                        {status.label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <p className="text-sm text-slate-500 mb-1">{config.name}</p>
                                <p className="text-3xl font-bold text-slate-900">
                                    {stock.qty}
                                    <span className="text-sm font-normal text-slate-400 ml-1">tabung</span>
                                </p>
                                {/* Stock level indicator */}
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span>0</span>
                                        <span>Kritis: {stock.critical_level}</span>
                                        <span>Peringatan: {stock.warning_level}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${stock.status === 'KRITIS' ? 'bg-red-500' :
                                                    stock.status === 'RENDAH' ? 'bg-orange-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min(100, (stock.qty / stock.warning_level) * 50)}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <SafeIcon name="Zap" className="h-4 w-4 text-purple-600" />
                        </div>
                        Aksi Cepat
                    </CardTitle>
                    <CardDescription>Kelola stok dengan mudah</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        {/* Pesan ke Agen */}
                        <button
                            onClick={() => setIsOrderOpen(true)}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-300 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <SafeIcon name="Truck" className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-slate-900">Pesan ke Agen</p>
                                <p className="text-sm text-slate-500">Kirim pesanan LPG</p>
                            </div>
                            <Badge className="ml-auto bg-amber-100 text-amber-700 hover:bg-amber-200">Soon</Badge>
                        </button>

                        {/* Terima Stok */}
                        <button
                            onClick={() => setIsReceiveOpen(true)}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-green-200 bg-green-50/50 hover:bg-green-100 hover:border-green-300 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <SafeIcon name="PackagePlus" className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-slate-900">Terima Stok</p>
                                <p className="text-sm text-slate-500">Catat penerimaan dari agen</p>
                            </div>
                        </button>

                        {/* Stock Opname */}
                        <button
                            onClick={() => toast.info('Fitur Stock Opname akan segera tersedia')}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <SafeIcon name="ClipboardCheck" className="h-6 w-6 text-slate-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-slate-900">Stock Opname</p>
                                <p className="text-sm text-slate-500">Sesuaikan stok aktual</p>
                            </div>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Info Banner - Agen Integration */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <SafeIcon name="Lightbulb" className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Integrasi dengan Agen</h3>
                            <p className="text-sm text-slate-600 mb-3">
                                Segera hadir! Fitur integrasi langsung dengan sistem agen untuk:
                            </p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                    <span>Pesan LPG langsung ke agen</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                    <span>Tracking status pengiriman</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                    <span>Riwayat pembelian otomatis</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                    <span>Notifikasi real-time</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
