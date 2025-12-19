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
import { authApi, pangkalanStockApi, lpgPricesApi, agenApi, type UserProfile, type StockLevel, type LpgType, type PangkalanStockMovement, type PangkalanLpgPrice, type Agen } from '@/lib/api'
import { toast } from 'sonner'

// LPG type config (supports both '3kg' and 'kg3' formats)
const LPG_CONFIG: Record<string, { name: string; color: string; gradient: string }> = {
    '3kg': { name: 'LPG 3 kg', color: '#22C55E', gradient: 'from-green-500 to-emerald-600' },
    '5kg': { name: 'LPG 5.5 kg', color: '#ff82c5', gradient: 'from-pink-400 to-pink-600' },
    '12kg': { name: 'LPG 12 kg', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
    '50kg': { name: 'LPG 50 kg', color: '#ef0e0e', gradient: 'from-red-500 to-red-600' },
    // Alternative format (API uses kg3, kg5, etc.)
    'kg3': { name: 'LPG 3 kg', color: '#22C55E', gradient: 'from-green-500 to-emerald-600' },
    'kg5': { name: 'LPG 5.5 kg', color: '#ff82c5', gradient: 'from-pink-400 to-pink-600' },
    'kg12': { name: 'LPG 12 kg', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
    'kg50': { name: 'LPG 50 kg', color: '#ef0e0e', gradient: 'from-red-500 to-red-600' },
}

// Tab type
type TabType = 'stock' | 'history' | 'prices';

export default function StokPangkalanPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stocks, setStocks] = useState<StockLevel[]>([])
    const [movements, setMovements] = useState<PangkalanStockMovement[]>([])
    const [totalStock, setTotalStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('stock')
    const [isReceiveOpen, setIsReceiveOpen] = useState(false)
    const [isOrderOpen, setIsOrderOpen] = useState(false)
    const [receiveData, setReceiveData] = useState({ lpgType: 'kg3' as LpgType, qty: 0, note: '', movementType: 'IN' as 'IN' | 'OUT' })
    const [orderData, setOrderData] = useState({ lpgType: 'kg3' as LpgType, qty: 0, note: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [agen, setAgen] = useState<Agen | null>(null)

    // History pagination & filter
    const [currentPage, setCurrentPage] = useState(1)
    const [filterType, setFilterType] = useState<string>('all')
    const itemsPerPage = 10

    // Price management state
    const [prices, setPrices] = useState<PangkalanLpgPrice[]>([])
    const [editedPrices, setEditedPrices] = useState<Record<string, { cost: number; sell: number; active: boolean }>>({})
    const [isLoadingPrices, setIsLoadingPrices] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

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

    const fetchMovements = async () => {
        try {
            setIsLoadingHistory(true)
            const data = await pangkalanStockApi.getMovements({
                limit: 100,
                lpgType: filterType !== 'all' ? filterType : undefined,
            })
            setMovements(data)
            setCurrentPage(1)
        } catch (error) {
            console.error('Failed to fetch movements:', error)
            toast.error('Gagal memuat riwayat stok')
        } finally {
            setIsLoadingHistory(false)
        }
    }

    const fetchPrices = async () => {
        try {
            setIsLoadingPrices(true)
            const data = await lpgPricesApi.getAll()
            setPrices(data)
            const edited: Record<string, { cost: number; sell: number; active: boolean }> = {}
            data.forEach(p => {
                edited[p.lpg_type] = {
                    cost: Number(p.cost_price),
                    sell: Number(p.selling_price),
                    active: p.is_active,
                }
            })
            setEditedPrices(edited)
        } catch (error) {
            console.error('Failed to fetch prices:', error)
            toast.error('Gagal memuat data harga')
        } finally {
            setIsLoadingPrices(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (activeTab === 'history') {
            fetchMovements()
        } else if (activeTab === 'prices') {
            fetchPrices()
        }
    }, [activeTab, filterType])

    // Fetch agen data for WhatsApp order
    useEffect(() => {
        const fetchAgen = async () => {
            try {
                const agenData = await agenApi.getMyAgen()
                setAgen(agenData)
            } catch (error) {
                console.error('Failed to fetch agen:', error)
            }
        }
        fetchAgen()
    }, [])

    // Price management functions
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

    const handleSavePrices = async () => {
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

    const getMargin = (lpgType: string) => {
        const data = editedPrices[lpgType]
        if (!data) return 0
        return data.sell - data.cost
    }

    const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID').format(v)

    // Get active LPG types for dropdowns
    const getActiveLpgTypes = () => {
        const allTypes = [
            { value: 'kg3', label: 'LPG 3 kg' },
            { value: 'kg5', label: 'LPG 5.5 kg' },
            { value: 'kg12', label: 'LPG 12 kg' },
            { value: 'kg50', label: 'LPG 50 kg' },
        ]
        if (prices.length === 0) return allTypes // Return all if no prices loaded
        return allTypes.filter(type => {
            const priceData = prices.find(p => p.lpg_type === type.value)
            return priceData ? priceData.is_active : true
        })
    }

    const activeLpgTypes = getActiveLpgTypes()

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Pagination
    const totalPages = Math.ceil(movements.length / itemsPerPage)
    const paginatedMovements = movements.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

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

        // Cek stok cukup jika mengurangi
        if (receiveData.movementType === 'OUT') {
            const currentStock = stocks.find(s => s.lpg_type === receiveData.lpgType)
            if (!currentStock || currentStock.qty < receiveData.qty) {
                toast.error(`Stok tidak cukup! Stok saat ini: ${currentStock?.qty || 0} tabung`)
                return
            }
        }

        try {
            setIsSubmitting(true)
            await pangkalanStockApi.receiveStock({
                lpg_type: receiveData.lpgType,
                qty: receiveData.movementType === 'OUT' ? -receiveData.qty : receiveData.qty, // Negatif untuk keluar
                note: receiveData.note || `Koreksi stok ${receiveData.movementType === 'IN' ? 'masuk' : 'keluar'} (manual)`,
            })
            const action = receiveData.movementType === 'IN' ? 'ditambahkan' : 'dikurangi'
            toast.success(`Berhasil ${action} ${receiveData.qty} tabung ${LPG_CONFIG[receiveData.lpgType]?.name}`)
            setIsReceiveOpen(false)
            setReceiveData({ lpgType: 'kg3' as LpgType, qty: 0, note: '', movementType: 'IN' })
            fetchData()
        } catch (error: any) {
            toast.error(error.message || 'Gagal mencatat koreksi stok')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleOrderToAgen = async () => {
        if (orderData.qty <= 0) {
            toast.error('Jumlah harus lebih dari 0')
            return
        }

        if (!agen?.phone) {
            toast.error('Nomor telepon Agen belum terdaftar. Hubungi admin untuk menambahkan data agen.')
            return
        }

        // Format phone number for WhatsApp (remove leading 0, add 62)
        let phoneNumber = agen.phone.replace(/\D/g, '')
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '62' + phoneNumber.substring(1)
        } else if (!phoneNumber.startsWith('62')) {
            phoneNumber = '62' + phoneNumber
        }

        // Generate message
        const lpgName = LPG_CONFIG[orderData.lpgType]?.name || orderData.lpgType
        const pangkalanName = profile?.pangkalans?.name || 'Pangkalan'
        const message = `*🛢️ PESANAN LPG*

Dari: ${pangkalanName}
Tipe: ${lpgName}
Jumlah: ${orderData.qty} tabung
${orderData.note ? `Catatan: ${orderData.note}` : ''}

Mohon konfirmasi ketersediaan dan estimasi pengiriman. Terima kasih.`

        // Open WhatsApp
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(waUrl, '_blank')

        toast.success(`Membuka WhatsApp untuk menghubungi ${agen.name}`)
        setIsOrderOpen(false)
        setOrderData({ lpgType: '3kg', qty: 0, note: '' })
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
                                            {activeLpgTypes.map(type => (
                                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                            ))}
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
                                {/* Agen Info Banner */}
                                {agen ? (
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-start gap-2">
                                            <SafeIcon name="Building2" className="h-4 w-4 text-green-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-green-800">{agen.name}</p>
                                                <p className="text-xs text-green-600">{agen.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                        <div className="flex items-start gap-2">
                                            <SafeIcon name="AlertCircle" className="h-4 w-4 text-amber-600 mt-0.5" />
                                            <p className="text-sm text-amber-700">
                                                Agen belum terdaftar. Hubungi admin untuk menambahkan data agen.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOrderOpen(false)}>Batal</Button>
                                <Button
                                    onClick={handleOrderToAgen}
                                    disabled={!agen?.phone}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <SafeIcon name="MessageCircle" className="h-4 w-4 mr-2" />
                                    Kirim via WhatsApp
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Terima Stok Button */}
                    <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg shadow-green-500/25">
                                <SafeIcon name="PackagePlus" className="h-4 w-4 mr-2" />
                                Koreksi Stok
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <SafeIcon name="PackagePlus" className="h-5 w-5 text-green-600" />
                                    </div>
                                    Koreksi Stok Manual
                                </DialogTitle>
                                <DialogDescription>
                                    Catat penyesuaian stok (selisih opname atau sumber lain)
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                {/* Movement Type Selector */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Jenis Koreksi</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setReceiveData({ ...receiveData, movementType: 'IN' })}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${receiveData.movementType === 'IN'
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <SafeIcon name="Plus" className="h-4 w-4" />
                                            <span className="font-medium">Tambah</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReceiveData({ ...receiveData, movementType: 'OUT' })}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${receiveData.movementType === 'OUT'
                                                ? 'border-red-500 bg-red-50 text-red-700'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <SafeIcon name="Minus" className="h-4 w-4" />
                                            <span className="font-medium">Kurangi</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipe LPG</label>
                                    <Select value={receiveData.lpgType} onValueChange={(v) => setReceiveData({ ...receiveData, lpgType: v as LpgType })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activeLpgTypes.map(type => (
                                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                            ))}
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

            {/* Tab Navigation */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 w-fit">
                <button
                    onClick={() => setActiveTab('stock')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'stock'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <SafeIcon name="Package" className="h-4 w-4" />
                    Stok Saat Ini
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <SafeIcon name="History" className="h-4 w-4" />
                    Riwayat
                </button>
                <button
                    onClick={() => setActiveTab('prices')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'prices'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <SafeIcon name="Settings" className="h-4 w-4" />
                    Kelola Harga
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'stock' ? (
                <>
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
                                        <p className="font-semibold text-slate-900">Koreksi Stok</p>
                                        <p className="text-sm text-slate-500">Penyesuaian manual (opname)</p>
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

                    {/* Info Banner - Auto-Sync Aktif */}
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <SafeIcon name="CheckCircle" className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">Stok Terintegrasi dengan Agen</h3>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Stok otomatis bertambah saat pesanan dari agen berstatus <strong>SELESAI</strong>
                                    </p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                            <span>Stok masuk otomatis dari pesanan</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                            <span>Riwayat pergerakan tercatat</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                            <span>Sumber: ORDER (dari agen)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                            <span>Koreksi manual tetap tersedia</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : activeTab === 'history' ? (
                /* Riwayat Tab */
                <div className="space-y-4">
                    {/* Filter Bar */}
                    <Card className="bg-white shadow-lg rounded-2xl border-0">
                        <CardContent className="p-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <SafeIcon name="Filter" className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-600">Filter:</span>
                                </div>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="w-[180px] rounded-xl">
                                        <SelectValue placeholder="Semua Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tipe</SelectItem>
                                        <SelectItem value="kg3">LPG 3 kg</SelectItem>
                                        <SelectItem value="kg5">LPG 5.5 kg</SelectItem>
                                        <SelectItem value="kg12">LPG 12 kg</SelectItem>
                                        <SelectItem value="kg50">LPG 50 kg</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm" onClick={fetchMovements} className="rounded-xl ml-auto">
                                    <SafeIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Movements Table */}
                    <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                        <CardContent className="p-0">
                            {isLoadingHistory ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
                                </div>
                            ) : movements.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <SafeIcon name="Inbox" className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <p className="font-medium">Belum ada riwayat</p>
                                    <p className="text-sm text-slate-400">Pergerakan stok akan muncul di sini</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b">
                                                <tr>
                                                    <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Waktu</th>
                                                    <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Tipe LPG</th>
                                                    <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Jenis</th>
                                                    <th className="text-right p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Qty</th>
                                                    <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Sumber</th>
                                                    <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Catatan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {paginatedMovements.map((mv, idx) => {
                                                    const config = LPG_CONFIG[mv.lpg_type] || { name: mv.lpg_type, color: '#666' }
                                                    const isIn = mv.movement_type === 'IN'

                                                    return (
                                                        <tr key={mv.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                                            <td className="p-4 text-sm text-slate-600">{formatDate(mv.movement_date)}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></div>
                                                                    <span className="text-sm font-medium text-slate-900">{config.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <Badge className={`${isIn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-0 rounded-full`}>
                                                                    <SafeIcon name={isIn ? 'ArrowDownCircle' : 'ArrowUpCircle'} className="h-3 w-3 mr-1" />
                                                                    {isIn ? 'MASUK' : 'KELUAR'}
                                                                </Badge>
                                                            </td>
                                                            <td className={`p-4 text-right font-bold ${isIn ? 'text-green-600' : 'text-red-600'}`}>
                                                                {isIn ? '+' : '-'}{mv.qty}
                                                            </td>
                                                            <td className="p-4 text-sm text-slate-600">{mv.source || '-'}</td>
                                                            <td className="p-4 text-sm text-slate-500 max-w-[200px] truncate">{mv.note || '-'}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
                                            <p className="text-sm text-slate-600">
                                                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, movements.length)} dari {movements.length}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-lg">
                                                    <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                                                </Button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        let pageNum: number
                                                        if (totalPages <= 5) pageNum = i + 1
                                                        else if (currentPage <= 3) pageNum = i + 1
                                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                                                        else pageNum = currentPage - 2 + i

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => setCurrentPage(pageNum)}
                                                                className={`w-8 h-8 p-0 rounded-lg ${currentPage === pageNum ? 'bg-blue-600' : ''}`}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        )
                                                    })}
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-lg">
                                                    <SafeIcon name="ChevronRight" className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : activeTab === 'prices' ? (
                /* Kelola Harga Tab */
                <div className="space-y-6">
                    {/* Compact Header */}
                    <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <SafeIcon name="BadgeDollarSign" className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Kelola Harga LPG</h2>
                                <p className="text-xs text-slate-500">Atur harga beli & jual per tipe</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleSavePrices}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg shadow-blue-500/25"
                        >
                            {isSaving ? (
                                <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <SafeIcon name="Save" className="h-4 w-4 mr-2" />
                                    Simpan
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Price Cards */}
                    {isLoadingPrices ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {prices.map((price) => {
                                const config = LPG_CONFIG[price.lpg_type] || { name: price.lpg_type, color: '#666', gradient: 'from-gray-500 to-gray-600' }
                                const edited = editedPrices[price.lpg_type]
                                const margin = getMargin(price.lpg_type)

                                return (
                                    <Card
                                        key={price.id}
                                        className={`relative overflow-hidden bg-white shadow-lg rounded-2xl border-0 transition-all duration-300 ${!edited?.active ? 'opacity-50 grayscale' : 'hover:shadow-xl hover:-translate-y-0.5'
                                            }`}
                                    >
                                        {/* Gradient Top Bar */}
                                        <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`}></div>

                                        <CardContent className="p-5">
                                            {/* Header Row */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md`}
                                                    >
                                                        <SafeIcon name="Flame" className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900">{config.name}</h3>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-xs text-slate-500">Margin:</span>
                                                            <span className={`text-sm font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                Rp {formatCurrency(margin)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Toggle Switch */}
                                                <button
                                                    onClick={() => toggleActive(price.lpg_type)}
                                                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${edited?.active
                                                        ? 'bg-green-500'
                                                        : 'bg-slate-300'
                                                        }`}
                                                >
                                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${edited?.active ? 'left-8' : 'left-1'
                                                        }`}></div>
                                                </button>
                                            </div>

                                            {/* Price Inputs */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Cost Price */}
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-xs text-slate-500 mb-1 block">Harga Beli</label>
                                                    <div className="relative">
                                                        <span className="text-xs text-slate-400 absolute left-0 top-1/2 -translate-y-1/2">Rp</span>
                                                        <Input
                                                            type="number"
                                                            value={edited?.cost || ''}
                                                            onChange={(e) => updatePrice(price.lpg_type, 'cost', Number(e.target.value))}
                                                            className="border-0 bg-transparent pl-6 pr-0 h-8 text-lg font-bold text-slate-900 focus-visible:ring-0"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Selling Price */}
                                                <div className="bg-blue-50 rounded-xl p-3">
                                                    <label className="text-xs text-blue-600 mb-1 block">Harga Jual</label>
                                                    <div className="relative">
                                                        <span className="text-xs text-blue-400 absolute left-0 top-1/2 -translate-y-1/2">Rp</span>
                                                        <Input
                                                            type="number"
                                                            value={edited?.sell || ''}
                                                            onChange={(e) => updatePrice(price.lpg_type, 'sell', Number(e.target.value))}
                                                            className="border-0 bg-transparent pl-6 pr-0 h-8 text-lg font-bold text-blue-700 focus-visible:ring-0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    )
}
