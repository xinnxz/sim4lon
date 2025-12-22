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
import { authApi, pangkalanStockApi, lpgPricesApi, lpgProductsApi, agenApi, agenOrdersApi, type UserProfile, type StockLevel, type LpgType, type PangkalanStockMovement, type PangkalanLpgPrice, type Agen, type LpgProductWithStock, type AgenOrder, type AgenOrderStatus } from '@/lib/api'
import { toast } from 'sonner'
import { ProductManagementGrid } from './ProductManagementGrid'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// LPG type config (supports both '3kg' and 'kg3' formats)
const LPG_CONFIG: Record<string, { name: string; color: string; gradient: string }> = {
    // 220gram / Bright Gas Can
    '022': { name: 'Bright Gas 220gr', color: '#FFA500', gradient: 'from-orange-400 to-amber-500' },
    'kg022': { name: 'Bright Gas 220gr', color: '#FFA500', gradient: 'from-orange-400 to-amber-500' },
    // 3kg
    '3kg': { name: 'LPG 3 kg', color: '#22C55E', gradient: 'from-green-500 to-emerald-600' },
    'kg3': { name: 'LPG 3 kg', color: '#22C55E', gradient: 'from-green-500 to-emerald-600' },
    // 5.5kg
    '5kg': { name: 'LPG 5.5 kg', color: '#ff82c5', gradient: 'from-pink-400 to-pink-600' },
    'kg5': { name: 'LPG 5.5 kg', color: '#ff82c5', gradient: 'from-pink-400 to-pink-600' },
    // 12kg
    '12kg': { name: 'LPG 12 kg', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
    'kg12': { name: 'LPG 12 kg', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
    // 50kg
    '50kg': { name: 'LPG 50 kg', color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600' },
    'kg50': { name: 'LPG 50 kg', color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600' },
}

// Tab type
type TabType = 'stock' | 'history' | 'products' | 'orders';

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
    const [initialPrices, setInitialPrices] = useState<Record<string, { cost: number; sell: number; active: boolean }>>({})
    const [isLoadingPrices, setIsLoadingPrices] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Agen products state
    const [agenProducts, setAgenProducts] = useState<LpgProductWithStock[]>([])

    // Agen orders state
    const [agenOrders, setAgenOrders] = useState<AgenOrder[]>([])
    const [isLoadingOrders, setIsLoadingOrders] = useState(false)
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all')
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
    const [isReceiveOrderOpen, setIsReceiveOrderOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<AgenOrder | null>(null)
    const [createOrderData, setCreateOrderData] = useState({ lpgType: 'kg3' as LpgType, qty: 0, note: '' })
    const [receiveQty, setReceiveQty] = useState(0)

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
            setInitialPrices(JSON.parse(JSON.stringify(edited))) // Deep copy for comparison
            setHasChanges(false)
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
        } else if (activeTab === 'products') {
            fetchPrices()
            fetchAgenProducts()
        }
    }, [activeTab, filterType])

    // Fetch agen products for Kelola Produk tab
    const fetchAgenProducts = async () => {
        try {
            const data = await lpgProductsApi.getWithStock()
            setAgenProducts(data)
        } catch (error) {
            console.error('Failed to fetch agen products:', error)
        }
    }

    // Fetch agen orders for Pesanan Agen tab
    const fetchAgenOrders = async () => {
        try {
            setIsLoadingOrders(true)
            const data = await agenOrdersApi.getOrders(orderStatusFilter)
            setAgenOrders(data)
        } catch (error) {
            console.error('Failed to fetch agen orders:', error)
            toast.error('Gagal memuat pesanan agen')
        } finally {
            setIsLoadingOrders(false)
        }
    }

    // Fetch orders when tab changes or filter changes
    useEffect(() => {
        if (activeTab === 'orders') {
            fetchAgenOrders()
        }
    }, [activeTab, orderStatusFilter])

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
        setHasChanges(true)
    }

    const toggleActive = (lpgType: string) => {
        setEditedPrices(prev => ({
            ...prev,
            [lpgType]: { ...prev[lpgType], active: !prev[lpgType]?.active }
        }))
        setHasChanges(true)
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

    // Mapping: lpg_type (pangkalan) to size_kg (agen products)
    const lpgTypeToSizeKg = (lpgType: string): number => {
        const mapping: Record<string, number> = {
            'kg3': 3,
            'kg5': 5.5,    // kg5 means 5.5 kg
            'kg55': 5.5,   // Alternative format
            'kg12': 12,
            'kg50': 50,
            'kg022': 0.22, // 220gram
            'kg220': 0.22, // Alternative for 220gram
        }
        return mapping[lpgType] ?? parseFloat(lpgType.replace('kg', ''))
    }

    // Mapping: size_kg to lpg_type format
    const sizeKgToLpgType = (sizeKg: number): string => {
        const mapping: Record<number, string> = {
            0.22: 'kg022',
            3: 'kg3',
            5.5: 'kg5',
            12: 'kg12',
            50: 'kg50',
        }
        return mapping[sizeKg] ?? `kg${String(sizeKg).replace('.', '')}`
    }

    // Get agen products that are not yet added to pangkalan
    const getUnaddedAgenProducts = () => {
        if (agenProducts.length === 0) return []

        // Get all size_kg that pangkalan already has
        const existingSizeKgs = prices.map(p => lpgTypeToSizeKg(p.lpg_type))

        // Return agen products that are:
        // 1. Active in agen
        // 2. Not already in pangkalan's price list
        return agenProducts.filter(ap =>
            ap.is_active !== false &&
            !existingSizeKgs.includes(ap.size_kg)
        )
    }

    // Add a new product from agen catalog
    const handleAddProduct = async (product: LpgProductWithStock) => {
        try {
            setIsSaving(true)
            const lpgType = sizeKgToLpgType(product.size_kg)

            // Use bulkUpdate to add new price
            await lpgPricesApi.bulkUpdate([{
                lpg_type: lpgType,
                cost_price: Number(product.cost_price || 0),
                selling_price: Number(product.selling_price || 0),
                is_active: true,
            }])
            toast.success(`${product.name} berhasil ditambahkan!`)
            await fetchPrices()
            await fetchAgenProducts()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menambahkan produk')
        } finally {
            setIsSaving(false)
        }
    }

    // Find matching agen product for a pangkalan price
    const findAgenProduct = (lpgType: string) => {
        const sizeKg = lpgTypeToSizeKg(lpgType)
        return agenProducts.find(p => p.size_kg === sizeKg)
    }

    // Deactivate a product (set is_active = false)
    const handleDeactivateProduct = async (lpgType: string) => {
        try {
            setIsSaving(true)
            const existingPrice = prices.find(p => p.lpg_type === lpgType)
            if (existingPrice) {
                await lpgPricesApi.bulkUpdate([{
                    lpg_type: lpgType,
                    cost_price: Number(existingPrice.cost_price || 0),
                    selling_price: Number(existingPrice.selling_price || 0),
                    is_active: false,
                }])
                toast.success(`Produk berhasil dinonaktifkan`)
                await fetchPrices()
            }
        } catch (error: any) {
            toast.error(error.message || 'Gagal menonaktifkan produk')
        } finally {
            setIsSaving(false)
        }
    }

    // Get all products to display - Fixed 5 product types
    const getAllDisplayProducts = () => {
        // Define fixed 5 product types
        const FIXED_PRODUCTS = [
            { lpgType: 'kg022', name: 'Bright Gas Can', size_kg: 0.22, color: '#FFA500' },
            { lpgType: 'kg3', name: 'LPG 3 kg', size_kg: 3, color: '#22C55E' },
            { lpgType: 'kg5', name: 'LPG 5.5 kg', size_kg: 5.5, color: '#ff82c5' },
            { lpgType: 'kg12', name: 'LPG 12 kg', size_kg: 12, color: '#3B82F6' },
            { lpgType: 'kg50', name: 'LPG 50 kg', size_kg: 50, color: '#8B5CF6' },
        ]

        return FIXED_PRODUCTS.map(product => {
            // Check if this product has a price entry
            const priceData = prices.find(p => p.lpg_type === product.lpgType)

            return {
                id: priceData?.id || product.lpgType,
                name: product.name,
                size_kg: product.size_kg,
                lpgType: product.lpgType,
                color: product.color,
                selling_price: Number(priceData?.selling_price || 0),
                cost_price: Number(priceData?.cost_price || 0),
                isFromAgen: false,
                isAdded: !!priceData, // Has price entry
            }
        })
    }


    // Get active LPG types for dropdowns
    const getActiveLpgTypes = () => {
        const allTypes = [
            { value: 'kg3', label: 'LPG 3 kg' },
            { value: 'kg5', label: 'LPG 5.5 kg' },
            { value: 'kg12', label: 'LPG 12 kg' },
            { value: 'kg50', label: 'LPG 50 kg' },
        ]
        if (prices.length === 0) return allTypes // Return all if no prices loaded
        // Only include types that are explicitly active in prices
        return allTypes.filter(type => {
            const priceData = prices.find(p => p.lpg_type === type.value)
            return priceData?.is_active === true // Must exist AND be active
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

    // ========== AGEN ORDER HANDLERS ==========
    const handleCreateOrder = async () => {
        if (createOrderData.qty <= 0) {
            toast.error('Jumlah harus lebih dari 0')
            return
        }

        try {
            setIsSubmitting(true)
            await agenOrdersApi.createOrder({
                lpg_type: createOrderData.lpgType,
                qty: createOrderData.qty,
                note: createOrderData.note,
            })
            toast.success(`Pesanan ${createOrderData.qty} tabung ${LPG_CONFIG[createOrderData.lpgType]?.name || createOrderData.lpgType} berhasil dibuat`)
            setIsCreateOrderOpen(false)
            setCreateOrderData({ lpgType: 'kg3' as LpgType, qty: 0, note: '' })
            fetchAgenOrders()
        } catch (error: any) {
            toast.error(error.message || 'Gagal membuat pesanan')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReceiveOrder = async () => {
        if (!selectedOrder) return
        if (receiveQty <= 0) {
            toast.error('Jumlah diterima harus lebih dari 0')
            return
        }

        try {
            setIsSubmitting(true)
            await agenOrdersApi.receiveOrder(selectedOrder.id, {
                qty_received: receiveQty,
            })
            toast.success(`Berhasil menerima ${receiveQty} tabung untuk pesanan ${selectedOrder.code}`)
            setIsReceiveOrderOpen(false)
            setSelectedOrder(null)
            setReceiveQty(0)
            fetchAgenOrders()
            fetchData() // Refresh stock levels
        } catch (error: any) {
            toast.error(error.message || 'Gagal menerima pesanan')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelOrder = async (order: AgenOrder) => {
        if (!confirm(`Batalkan pesanan ${order.code}?`)) return

        try {
            await agenOrdersApi.cancelOrder(order.id)
            toast.success(`Pesanan ${order.code} dibatalkan`)
            fetchAgenOrders()
        } catch (error: any) {
            toast.error(error.message || 'Gagal membatalkan pesanan')
        }
    }

    const getStatusBadge = (status: AgenOrderStatus) => {
        const configs: Record<AgenOrderStatus, { label: string; className: string }> = {
            PENDING: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-700' },
            DIKIRIM: { label: 'Dikirim', className: 'bg-blue-100 text-blue-700' },
            DITERIMA: { label: 'Diterima', className: 'bg-green-100 text-green-700' },
            BATAL: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700' },
        }
        const config = configs[status]
        return <Badge className={config.className}>{config.label}</Badge>
    }

    // ========== EXPORT FUNCTIONS ==========
    const handleExportExcel = () => {
        try {
            toast.loading('Generating Excel...', { id: 'excel-export' })

            const wb = XLSX.utils.book_new()
            const now = new Date()
            const pangkalanName = profile?.pangkalans?.name || profile?.name || 'PANGKALAN'
            const monthName = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()

            // Sheet 1: Stock Levels
            const stockData: (string | number)[][] = []
            stockData.push([`LAPORAN STOK LPG ${pangkalanName.toUpperCase()}`])
            stockData.push([`Per Tanggal: ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`])
            stockData.push([])
            stockData.push(['NO', 'TIPE LPG', 'NAMA', 'STOK (TABUNG)', 'STATUS', 'TERAKHIR UPDATE'])

            let rowNo = 1
            stocks.forEach(stock => {
                const config = LPG_CONFIG[stock.lpg_type] || { name: stock.lpg_type.toUpperCase() }
                stockData.push([
                    rowNo++,
                    stock.lpg_type.toUpperCase(),
                    config.name,
                    stock.qty,
                    stock.status,
                    new Date(stock.updated_at).toLocaleDateString('id-ID')
                ])
            })

            stockData.push([])
            stockData.push(['', '', 'TOTAL STOK:', totalStock, '', ''])

            const wsStock = XLSX.utils.aoa_to_sheet(stockData)
            wsStock['!cols'] = [
                { wch: 5 }, { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 }
            ]
            wsStock['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }
            ]
            XLSX.utils.book_append_sheet(wb, wsStock, 'Stok Saat Ini')

            // Sheet 2: Movement History
            if (movements.length > 0) {
                const moveData: (string | number)[][] = []
                moveData.push([`RIWAYAT PERGERAKAN STOK ${pangkalanName.toUpperCase()}`])
                moveData.push([])
                moveData.push(['NO', 'TANGGAL', 'TIPE LPG', 'JENIS', 'QTY', 'CATATAN'])

                let moveNo = 1
                movements.forEach(move => {
                    moveData.push([
                        moveNo++,
                        new Date(move.created_at).toLocaleDateString('id-ID'),
                        move.lpg_type.toUpperCase(),
                        move.movement_type === 'IN' ? 'MASUK' : move.movement_type === 'OUT' ? 'KELUAR' : move.movement_type,
                        move.qty,
                        move.note || '-'
                    ])
                })

                const wsMove = XLSX.utils.aoa_to_sheet(moveData)
                wsMove['!cols'] = [
                    { wch: 5 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 25 }
                ]
                wsMove['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]
                XLSX.utils.book_append_sheet(wb, wsMove, 'Riwayat Pergerakan')
            }

            const fileName = `Stok_LPG_${pangkalanName.replace(/\s/g, '_')}_${monthName.replace(/\s/g, '_')}.xlsx`
            XLSX.writeFile(wb, fileName)
            toast.success('Excel berhasil di-download!', { id: 'excel-export' })
        } catch (error) {
            console.error('Excel export error:', error)
            toast.error('Gagal export Excel', { id: 'excel-export' })
        }
    }

    const handleExportPDF = () => {
        try {
            toast.loading('Generating PDF...', { id: 'pdf-export' })

            const doc = new jsPDF({ orientation: 'portrait' })
            const pageWidth = doc.internal.pageSize.getWidth()
            const margin = 14
            const now = new Date()
            const pangkalanName = profile?.pangkalans?.name || profile?.name || 'PANGKALAN'
            const monthName = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()

            // Watermark
            doc.setFont('helvetica', 'italic')
            doc.setFontSize(9)
            doc.setTextColor(150)
            doc.text('Sim4lon by Luthfi', pageWidth - margin, 10, { align: 'right' })

            // Header
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(16)
            doc.setTextColor(30, 64, 175)
            doc.text(`LAPORAN STOK LPG`, pageWidth / 2, 20, { align: 'center' })

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(12)
            doc.setTextColor(60)
            doc.text(pangkalanName.toUpperCase(), pageWidth / 2, 28, { align: 'center' })

            doc.setFontSize(10)
            doc.setTextColor(100)
            doc.text(`Per ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, 35, { align: 'center' })

            // Summary box
            doc.setDrawColor(200)
            doc.setFillColor(248, 250, 252)
            doc.roundedRect(margin, 42, pageWidth - 2 * margin, 18, 3, 3, 'F')

            doc.setFontSize(11)
            doc.setTextColor(60)
            doc.text(`Total Tipe LPG: ${stocks.length}`, margin + 10, 52)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(30, 64, 175)
            doc.text(`Total Stok: ${totalStock} Tabung`, pageWidth - margin - 10, 52, { align: 'right' })

            // Stock Table
            const stockHeaders = ['NO', 'TIPE LPG', 'NAMA PRODUK', 'STOK', 'STATUS']
            const stockTableData: (string | number)[][] = []
            let no = 1
            stocks.forEach(stock => {
                const config = LPG_CONFIG[stock.lpg_type] || { name: stock.lpg_type.toUpperCase() }
                stockTableData.push([
                    no++,
                    stock.lpg_type.toUpperCase(),
                    config.name,
                    `${stock.qty} tabung`,
                    stock.status
                ])
            })

            autoTable(doc, {
                startY: 65,
                head: [stockHeaders],
                body: stockTableData,
                theme: 'grid',
                styles: { fontSize: 10, cellPadding: 4 },
                headStyles: {
                    fillColor: [30, 64, 175],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 15 },
                    1: { halign: 'center', cellWidth: 25 },
                    2: { cellWidth: 60 },
                    3: { halign: 'center', cellWidth: 30 },
                    4: { halign: 'center', cellWidth: 25 }
                },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                didParseCell: (data) => {
                    if (data.column.index === 4 && data.section === 'body') {
                        const val = String(data.cell.raw)
                        if (val === 'Rendah') {
                            data.cell.styles.textColor = [220, 38, 38]
                            data.cell.styles.fontStyle = 'bold'
                        } else if (val === 'Aman') {
                            data.cell.styles.textColor = [22, 163, 74]
                        }
                    }
                }
            })

            // Footer
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(8)
                doc.setTextColor(150)
                doc.text(
                    `Halaman ${i} dari ${pageCount} | Dicetak: ${new Date().toLocaleString('id-ID')}`,
                    pageWidth / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                )
            }

            doc.save(`Stok_LPG_${pangkalanName.replace(/\s/g, '_')}_${monthName.replace(/\s/g, '_')}.pdf`)
            toast.success('PDF berhasil di-download!', { id: 'pdf-export' })
        } catch (error) {
            console.error('PDF export error:', error)
            toast.error('Gagal export PDF', { id: 'pdf-export' })
        }
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
                    {/* Export Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl border-green-200 text-green-600 hover:bg-green-50">
                                <SafeIcon name="Download" className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportExcel}>
                                <SafeIcon name="FileSpreadsheet" className="h-4 w-4 mr-2 text-green-600" />
                                Export Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportPDF}>
                                <SafeIcon name="FileText" className="h-4 w-4 mr-2 text-red-600" />
                                Export PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

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
                            <p className="text-5xl font-bold tracking-tight">
                                {stocks.filter(s => prices.find(p => p.lpg_type === s.lpg_type)?.is_active === true).reduce((sum, s) => sum + s.qty, 0)}
                            </p>
                            <p className="text-blue-100 text-sm mt-2">
                                tabung dari {stocks.filter(s => prices.find(p => p.lpg_type === s.lpg_type)?.is_active === true).length} tipe LPG aktif
                            </p>
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
                    onClick={() => setActiveTab('products')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'products'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <SafeIcon name="Package" className="h-4 w-4" />
                    Kelola Produk
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'orders'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <SafeIcon name="ShoppingCart" className="h-4 w-4" />
                    Pesanan Agen
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'stock' ? (
                <>
                    {/* Stock per Type Grid */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        {stocks
                            .filter(stock => {
                                // Only show stocks where the product is active
                                const priceData = prices.find(p => p.lpg_type === stock.lpg_type)
                                return priceData?.is_active === true
                            })
                            .map((stock) => {
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
                                    onClick={() => toast.info('Kaleum euy fitur na can beres')}
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
            ) : activeTab === 'products' ? (
                /* Kelola Produk Tab - Products from Agen with Pangkalan settings */
                <div className="space-y-6">
                    {/* Compact Header */}
                    <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <SafeIcon name="Package" className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Kelola Produk LPG</h2>
                                <p className="text-xs text-slate-500">Produk dari Agen • Atur harga & ketersediaan</p>
                            </div>
                        </div>
                        {hasChanges ? (
                            <Button
                                onClick={handleSavePrices}
                                disabled={isSaving}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-500/25 animate-pulse"
                            >
                                {isSaving ? (
                                    <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <SafeIcon name="Save" className="h-4 w-4 mr-2" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
                                <SafeIcon name="Check" className="h-4 w-4 text-green-500" />
                                <span>Tersimpan</span>
                            </div>
                        )}
                    </div>

                    {/* Product List - Modern Redesign */}
                    {isLoadingPrices ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
                        </div>
                    ) : (
                        <ProductManagementGrid
                            products={getAllDisplayProducts()}
                            editedPrices={editedPrices}
                            stocks={stocks}
                            isSaving={isSaving}
                            onAddProduct={(product) => handleAddProduct(product as LpgProductWithStock)}
                            onDeactivateProduct={handleDeactivateProduct}
                            onUpdatePrice={updatePrice}
                        />
                    )}
                </div>
            ) : activeTab === 'orders' ? (
                <div className="space-y-6">
                    {/* Header with filter and create button */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="PENDING">Menunggu</SelectItem>
                                    <SelectItem value="DIKIRIM">Dikirim</SelectItem>
                                    <SelectItem value="DITERIMA">Diterima</SelectItem>
                                    <SelectItem value="BATAL">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Create Order Dialog */}
                        <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                                    <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
                                    Buat Pesanan
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <SafeIcon name="ShoppingCart" className="h-5 w-5 text-blue-600" />
                                        </div>
                                        Buat Pesanan ke Agen
                                    </DialogTitle>
                                    <DialogDescription>
                                        Catat pesanan LPG ke agen distributor
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tipe LPG</label>
                                        <Select value={createOrderData.lpgType} onValueChange={(v) => setCreateOrderData({ ...createOrderData, lpgType: v as LpgType })}>
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
                                            value={createOrderData.qty || ''}
                                            onChange={(e) => setCreateOrderData({ ...createOrderData, qty: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Catatan (opsional)</label>
                                        <Input
                                            placeholder="Catatan tambahan"
                                            value={createOrderData.note}
                                            onChange={(e) => setCreateOrderData({ ...createOrderData, note: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>Batal</Button>
                                    <Button onClick={handleCreateOrder} disabled={isSubmitting}>
                                        {isSubmitting ? 'Menyimpan...' : 'Buat Pesanan'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Orders List */}
                    {
                        isLoadingOrders ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : agenOrders.length === 0 ? (
                            <Card className="bg-white">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <SafeIcon name="ShoppingCart" className="h-12 w-12 text-slate-300 mb-4" />
                                    <p className="text-slate-500 text-center">Belum ada pesanan ke agen</p>
                                    <p className="text-slate-400 text-sm text-center">Klik "Buat Pesanan" untuk membuat pesanan baru</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="bg-white overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">KODE</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">TANGGAL</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">TIPE LPG</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">DIPESAN</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">DITERIMA</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">STATUS</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">AKSI</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {agenOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{order.code}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {new Date(order.order_date).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-900">
                                                        {LPG_CONFIG[order.lpg_type]?.name || order.lpg_type.toUpperCase()}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-center font-semibold">{order.qty_ordered}</td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        {order.qty_received > 0 ? (
                                                            <span className="font-semibold text-green-600">{order.qty_received}</span>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">{getStatusBadge(order.status)}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {order.status === 'PENDING' && (
                                                            <div className="flex justify-center gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order)
                                                                        setReceiveQty(order.qty_ordered)
                                                                        setIsReceiveOrderOpen(true)
                                                                    }}
                                                                >
                                                                    <SafeIcon name="Check" className="h-3 w-3 mr-1" />
                                                                    Terima
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                                    onClick={() => handleCancelOrder(order)}
                                                                >
                                                                    <SafeIcon name="X" className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {order.status === 'DITERIMA' && (
                                                            <span className="text-xs text-slate-400">
                                                                {order.received_date && new Date(order.received_date).toLocaleDateString('id-ID')}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )
                    }

                    {/* Receive Order Dialog */}
                    <Dialog open={isReceiveOrderOpen} onOpenChange={setIsReceiveOrderOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <SafeIcon name="PackageCheck" className="h-5 w-5 text-green-600" />
                                    </div>
                                    Terima Pesanan
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedOrder && `Konfirmasi penerimaan pesanan ${selectedOrder.code}`}
                                </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                                <div className="space-y-4 py-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500">Tipe LPG</p>
                                                <p className="font-semibold">{LPG_CONFIG[selectedOrder.lpg_type]?.name || selectedOrder.lpg_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Jumlah Dipesan</p>
                                                <p className="font-semibold">{selectedOrder.qty_ordered} tabung</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Jumlah Diterima (tabung)</label>
                                        <Input
                                            type="number"
                                            value={receiveQty || ''}
                                            onChange={(e) => setReceiveQty(parseInt(e.target.value) || 0)}
                                        />
                                        <p className="text-xs text-slate-500">
                                            Stok akan otomatis bertambah setelah konfirmasi
                                        </p>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReceiveOrderOpen(false)}>Batal</Button>
                                <Button onClick={handleReceiveOrder} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                                    {isSubmitting ? 'Menyimpan...' : 'Konfirmasi Terima'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ) : null}
        </div>
    )
}
