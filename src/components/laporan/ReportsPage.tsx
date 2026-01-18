'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import AnimatedNumber from '@/components/common/AnimatedNumber'
import {
    reportsApi,
    type SalesReportResponse,
    type StockMovementResponse
} from '@/lib/api'
import { toast } from 'sonner'
import { exportToPDF, exportToExcel, formatCurrencyExport, formatDateExport, createFooterRow } from '@/lib/export-utils'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import PangkalanTabContent from './PangkalanTabContent'

type DatePreset = 'today' | '7days' | '30days' | 'month' | 'year' | 'custom'

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
    const timeStr = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    })
    return `${dateStr}, ${timeStr}`
}

const getDateRange = (preset: DatePreset) => {
    const now = new Date()
    let start: Date
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    switch (preset) {
        case 'today':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
            break
        case '7days':
            start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
        case '30days':
            start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
        case 'month':
            start = new Date(now.getFullYear(), now.getMonth(), 1)
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
            break
        case 'year':
            start = new Date(now.getFullYear(), 0, 1)
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
            break
        default:
            start = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    return {
        start: start.toISOString(),
        end: end.toISOString(),
    }
}

export default function ReportsPage() {
    // Read initial tab from URL hash or default to 'sales'
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '')
            if (['sales', 'pangkalan', 'stock'].includes(hash)) {
                return hash
            }
        }
        return 'sales'
    }

    const [activeTab, setActiveTab] = useState(getInitialTab)
    const [datePreset, setDatePreset] = useState<DatePreset>('month')
    const [customStart, setCustomStart] = useState('')
    const [customEnd, setCustomEnd] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Ref to access pangkalan export functions
    const pangkalanExportRef = useRef<{
        exportAllPDF: () => Promise<void>
        exportAllExcel: () => void
    } | null>(null)

    // Update URL hash when tab changes
    const handleTabChange = (value: string) => {
        setActiveTab(value)
        if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `#${value}`)
        }
    }

    // Pagination states
    const rowsPerPageOptions = [10, 25, 50]
    const [salesRowsPerPage, setSalesRowsPerPage] = useState(10)
    const [salesCurrentPage, setSalesCurrentPage] = useState(1)
    const [stockRowsPerPage, setStockRowsPerPage] = useState(10)
    const [stockCurrentPage, setStockCurrentPage] = useState(1)

    // Sorting states for Sales table
    type SalesSortField = 'date' | 'code' | 'pangkalan' | 'total' | 'status'
    const [salesSortBy, setSalesSortBy] = useState<SalesSortField>('date')
    const [salesSortOrder, setSalesSortOrder] = useState<'asc' | 'desc'>('desc')

    // Sorting states for Stock table
    type StockSortField = 'date' | 'product' | 'type' | 'qty'
    const [stockSortBy, setStockSortBy] = useState<StockSortField>('date')
    const [stockSortOrder, setStockSortOrder] = useState<'asc' | 'desc'>('desc')

    // Sort handlers
    const handleSalesSort = (field: SalesSortField) => {
        if (salesSortBy === field) {
            setSalesSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSalesSortBy(field)
            setSalesSortOrder('desc')
        }
        setSalesCurrentPage(1)
    }

    const handleStockSort = (field: StockSortField) => {
        if (stockSortBy === field) {
            setStockSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setStockSortBy(field)
            setStockSortOrder('desc')
        }
        setStockCurrentPage(1)
    }

    // Get sort icon
    const getSortIcon = (currentField: string, sortBy: string, sortOrder: 'asc' | 'desc') => {
        if (currentField !== sortBy) return 'ArrowUpDown'
        return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'
    }

    // Report data
    const [salesData, setSalesData] = useState<SalesReportResponse | null>(null)
    const [stockData, setStockData] = useState<StockMovementResponse | null>(null)
    const [totalPangkalan, setTotalPangkalan] = useState<number>(0)

    // Sorted sales data (client-side sorting)
    const sortedSalesData = useMemo(() => {
        if (!salesData?.data) return []
        return [...salesData.data].sort((a, b) => {
            const multiplier = salesSortOrder === 'asc' ? 1 : -1
            switch (salesSortBy) {
                case 'date':
                    return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime())
                case 'code':
                    return multiplier * a.code.localeCompare(b.code)
                case 'pangkalan':
                    return multiplier * a.pangkalan.localeCompare(b.pangkalan)
                case 'total':
                    return multiplier * (a.total - b.total)
                case 'status':
                    return multiplier * a.status.localeCompare(b.status)
                default:
                    return 0
            }
        })
    }, [salesData, salesSortBy, salesSortOrder])

    // Sorted stock data (client-side sorting)
    const sortedStockData = useMemo(() => {
        if (!stockData?.data) return []
        return [...stockData.data].sort((a, b) => {
            const multiplier = stockSortOrder === 'asc' ? 1 : -1
            switch (stockSortBy) {
                case 'date':
                    return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime())
                case 'product':
                    return multiplier * a.product.localeCompare(b.product)
                case 'type':
                    return multiplier * a.type.localeCompare(b.type)
                case 'qty':
                    return multiplier * (a.qty - b.qty)
                default:
                    return 0
            }
        })
    }, [stockData, stockSortBy, stockSortOrder])

    // Editable sales target state
    const [dailySalesTarget, setDailySalesTarget] = useState(35000000) // Default: Rp 35 juta
    const [isEditingTarget, setIsEditingTarget] = useState(false)
    const [tempTarget, setTempTarget] = useState('')

    // Load target from localStorage on mount
    useEffect(() => {
        const savedTarget = localStorage.getItem('dailySalesTarget')
        if (savedTarget) {
            setDailySalesTarget(Number(savedTarget))
        }
    }, [])

    // Save target to localStorage
    const handleSaveTarget = () => {
        const newTarget = Number(tempTarget.replace(/\D/g, ''))
        if (newTarget > 0) {
            setDailySalesTarget(newTarget)
            localStorage.setItem('dailySalesTarget', String(newTarget))
            setIsEditingTarget(false)
            toast.success('Target penjualan berhasil disimpan!')
        } else {
            toast.error('Masukkan nilai target yang valid')
        }
    }

    const fetchReports = async () => {
        setIsLoading(true)
        try {
            const range = datePreset === 'custom' && customStart && customEnd
                ? { start: new Date(customStart).toISOString(), end: new Date(customEnd).toISOString() }
                : getDateRange(datePreset)

            // Fetch all reports including pangkalan for badge count
            const [sales, stock, pangkalan] = await Promise.all([
                reportsApi.getSalesReport(range.start, range.end),
                reportsApi.getStockMovementReport(range.start, range.end),
                reportsApi.getPangkalanReport(range.start, range.end),
            ])

            setSalesData(sales)
            setStockData(stock)
            // Set pangkalan count for tab badge
            if (pangkalan?.summary?.total_pangkalan) {
                setTotalPangkalan(pangkalan.summary.total_pangkalan)
            }
        } catch (error: any) {
            toast.error(error.message || 'Gagal memuat laporan')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [datePreset])

    const handlePresetChange = (value: string) => {
        setDatePreset(value as DatePreset)
    }

    const handleCustomDateApply = () => {
        if (customStart && customEnd) {
            fetchReports()
        }
    }

    const statusLabels: Record<string, string> = {
        DRAFT: 'DRAFT',
        MENUNGGU_PEMBAYARAN: 'MENUNGGU PEMBAYARAN',
        DIPROSES: 'DIPROSES',
        DIKIRIM: 'DIKIRIM',
        SELESAI: 'SELESAI',
        DIBATALKAN: 'BATAL',
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SELESAI': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
            case 'DIKIRIM': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
            case 'DIPROSES': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
            case 'MENUNGGU_PEMBAYARAN': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
            case 'DIBATALKAN': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    // Chart colors
    const CHART_COLORS = {
        primary: '#22c55e',
        secondary: '#f59e0b',
        accent: '#3b82f6',
        muted: '#6b7280',
    }
    const PIE_COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4']

    // Prepare chart data - Sales trend by date with target line and profit
    const salesChartData = useMemo(() => {
        if (!salesData?.data) return []
        const groupedByDate: Record<string, { date: string; total: number; profit: number; count: number; target: number }> = {}

        salesData.data.forEach((item: any) => {
            const dateKey = new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { date: dateKey, total: 0, profit: 0, count: 0, target: dailySalesTarget }
            }
            groupedByDate[dateKey].total += item.total
            groupedByDate[dateKey].profit += item.profit || 0
            groupedByDate[dateKey].count += 1
        })

        return Object.values(groupedByDate).reverse()
    }, [salesData, dailySalesTarget])

    // Calculate growth percentage (comparing to previous period)
    const growthPercentage = useMemo(() => {
        if (!salesData?.data || salesData.data.length === 0) return 0

        // Calculate average daily sales
        const totalRevenue = salesData.summary.total_revenue || 0
        const daysInPeriod = salesChartData.length || 1
        const dailyAverage = totalRevenue / daysInPeriod

        // Calculate growth vs target
        const growth = ((dailyAverage - dailySalesTarget) / dailySalesTarget) * 100
        return growth
    }, [salesData, salesChartData, dailySalesTarget])

    // Sales by status for pie chart
    const salesByStatusData = useMemo(() => {
        if (!salesData?.summary.status_breakdown) return []
        return Object.entries(salesData.summary.status_breakdown).map(([status, count]) => ({
            name: statusLabels[status] || status,
            value: count,
        }))
    }, [salesData])

    // Stock movement chart data
    const stockChartData = useMemo(() => {
        if (!stockData?.data) return []
        const groupedByDate: Record<string, { date: string; masuk: number; keluar: number }> = {}

        stockData.data.forEach(item => {
            const dateKey = new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { date: dateKey, masuk: 0, keluar: 0 }
            }
            if (item.type === 'MASUK') {
                groupedByDate[dateKey].masuk += item.qty
            } else {
                groupedByDate[dateKey].keluar += item.qty
            }
        })

        return Object.values(groupedByDate).reverse()
    }, [stockData])

    // Stock by product for bar chart
    const stockByProductData = useMemo(() => {
        if (!stockData?.data) return []
        const groupedByProduct: Record<string, { product: string; masuk: number; keluar: number }> = {}

        stockData.data.forEach(item => {
            const product = item.product
            if (!groupedByProduct[product]) {
                groupedByProduct[product] = { product, masuk: 0, keluar: 0 }
            }
            if (item.type === 'MASUK') {
                groupedByProduct[product].masuk += item.qty
            } else {
                groupedByProduct[product].keluar += item.qty
            }
        })

        return Object.values(groupedByProduct)
    }, [stockData])

    const getPeriodLabel = () => {
        if (salesData?.period) {
            return `${formatDateExport(salesData.period.start)} - ${formatDateExport(salesData.period.end)}`
        }
        return 'Bulan Ini'
    }

    const handleExportPDF = async () => {
        try {
            const tabTitles = { sales: 'Penjualan', payments: 'Pembayaran', stock: 'Stok' }
            const title = `Laporan ${tabTitles[activeTab as keyof typeof tabTitles]}`
            const period = getPeriodLabel()
            const filename = `laporan-${activeTab}-${new Date().toISOString().split('T')[0]}`

            if (activeTab === 'sales' && salesData) {
                const columns = [
                    { header: 'Tanggal', key: 'date', width: 13 },
                    { header: 'Kode', key: 'code', width: 11 },
                    { header: 'Pangkalan', key: 'pangkalan', width: 20 },
                    { header: 'Pendapatan', key: 'total', width: 14, align: 'right' as const },
                    { header: 'Modal', key: 'cost', width: 14, align: 'right' as const },
                    { header: 'Profit', key: 'profit', width: 14, align: 'right' as const },
                    { header: 'Status', key: 'status', width: 12 },
                ]
                const data = salesData.data.map((item: any) => ({
                    ...item,
                    date: formatDateExport(item.date),
                    total: formatCurrencyExport(item.total),
                    cost: formatCurrencyExport(item.cost || 0),
                    profit: formatCurrencyExport(item.profit || 0),
                    status: statusLabels[item.status] || item.status,
                }))
                const summaryData = salesData.summary as any
                const summary = [
                    { label: 'Total Pesanan', value: summaryData.total_orders },
                    { label: 'Total Pendapatan', value: formatCurrencyExport(summaryData.total_revenue) },
                    { label: 'Total Modal', value: formatCurrencyExport(summaryData.total_cost || 0) },
                    { label: 'Profit Bersih', value: formatCurrencyExport(summaryData.total_profit || 0) },
                    { label: 'Profit Margin', value: `${(summaryData.profit_margin || 0).toFixed(1)}%` },
                ]
                // Footer row dengan total
                const footerRows = [
                    createFooterRow('TOTAL', {
                        code: '',
                        pangkalan: '',
                        total: formatCurrencyExport(summaryData.total_revenue),
                        cost: formatCurrencyExport(summaryData.total_cost || 0),
                        profit: formatCurrencyExport(summaryData.total_profit || 0),
                        status: `(${(summaryData.profit_margin || 0).toFixed(1)}%)`
                    }, 'date'),
                ]
                await exportToPDF(data, columns, summary, { title, period, filename }, footerRows)
            } else if (activeTab === 'stock' && stockData) {
                const columns = [
                    { header: 'Tanggal', key: 'date', width: 15 },
                    { header: 'Produk', key: 'product', width: 20 },
                    { header: 'Tipe', key: 'type', width: 10 },
                    { header: 'Qty', key: 'qty', width: 10, align: 'right' as const },
                    { header: 'Keterangan', key: 'note', width: 25 },
                    { header: 'Dicatat Oleh', key: 'recorded_by', width: 15 },
                ]
                const data = stockData.data.map(item => ({
                    ...item,
                    date: formatDateExport(item.date),
                    note: item.note || '-',
                }))
                const summary = [
                    { label: 'Total Masuk', value: `+${stockData.summary.total_in}` },
                    { label: 'Total Keluar', value: `-${stockData.summary.total_out}` },
                    { label: 'Perubahan Bersih', value: stockData.summary.net_change },
                    { label: 'Saldo Akhir', value: stockData.summary.current_balance },
                ]
                // Satu baris TOTAL di paling bawah - total masuk, keluar, dan net
                const footerRows = [
                    createFooterRow('TOTAL', {
                        product: `Masuk: +${stockData.summary.total_in}`,
                        type: `Keluar: -${stockData.summary.total_out}`,
                        qty: stockData.summary.net_change,
                        note: `Saldo Akhir: ${stockData.summary.current_balance}`,
                        recorded_by: ''
                    }, 'date'),
                ]
                await exportToPDF(data, columns, summary, { title, period, filename }, footerRows)
            }
            toast.success('PDF berhasil diexport!')
        } catch (error) {
            toast.error('Gagal export PDF')
        }
    }

    const handleExportExcel = () => {
        try {
            const tabTitles = { sales: 'Penjualan', payments: 'Pembayaran', stock: 'Stok' }
            const title = `Laporan ${tabTitles[activeTab as keyof typeof tabTitles]}`
            const period = getPeriodLabel()
            const filename = `laporan-${activeTab}-${new Date().toISOString().split('T')[0]}`

            if (activeTab === 'sales' && salesData) {
                const columns = [
                    { header: 'Tanggal', key: 'date', width: 12 },
                    { header: 'Kode', key: 'code', width: 13 },
                    { header: 'Pangkalan', key: 'pangkalan', width: 22 },
                    { header: 'Pendapatan', key: 'total', width: 15 },
                    { header: 'Modal', key: 'cost', width: 15 },
                    { header: 'Profit', key: 'profit', width: 15 },
                    { header: 'Status', key: 'status', width: 13 },
                ]
                const data = salesData.data.map((item: any) => ({
                    ...item,
                    date: formatDateExport(item.date),
                    cost: item.cost || 0,
                    profit: item.profit || 0,
                    status: statusLabels[item.status] || item.status,
                }))
                const summaryData = salesData.summary as any
                const summary = [
                    { label: 'Total Pesanan', value: summaryData.total_orders },
                    { label: 'Total Pendapatan', value: summaryData.total_revenue },
                    { label: 'Total Modal', value: summaryData.total_cost || 0 },
                    { label: 'Profit Bersih', value: summaryData.total_profit || 0 },
                    { label: 'Profit Margin', value: `${(summaryData.profit_margin || 0).toFixed(1)}%` },
                ]
                // Footer row dengan total
                const footerRows = [
                    createFooterRow('TOTAL', {
                        code: '',
                        pangkalan: '',
                        total: summaryData.total_revenue,
                        cost: summaryData.total_cost || 0,
                        profit: summaryData.total_profit || 0,
                        status: `Margin: ${(summaryData.profit_margin || 0).toFixed(1)}%`
                    }, 'date'),
                ]
                exportToExcel(data, columns, summary, { title, period, filename }, footerRows)
            } else if (activeTab === 'stock' && stockData) {
                const columns = [
                    { header: 'Tanggal', key: 'date', width: 12 },
                    { header: 'Produk', key: 'product', width: 20 },
                    { header: 'Tipe', key: 'type', width: 10 },
                    { header: 'Qty', key: 'qty', width: 10 },
                    { header: 'Keterangan', key: 'note', width: 25 },
                    { header: 'Dicatat Oleh', key: 'recorded_by', width: 15 },
                ]
                const data = stockData.data.map(item => ({
                    ...item,
                    date: formatDateExport(item.date),
                }))
                const summary = [
                    { label: 'Total Masuk', value: stockData.summary.total_in },
                    { label: 'Total Keluar', value: stockData.summary.total_out },
                    { label: 'Perubahan Bersih', value: stockData.summary.net_change },
                    { label: 'Saldo Akhir', value: stockData.summary.current_balance },
                ]
                // Satu baris TOTAL di paling bawah
                const footerRows = [
                    createFooterRow('TOTAL', {
                        product: `Masuk: +${stockData.summary.total_in}`,
                        type: `Keluar: -${stockData.summary.total_out}`,
                        qty: stockData.summary.net_change,
                        note: `Saldo Akhir: ${stockData.summary.current_balance}`,
                        recorded_by: ''
                    }, 'date'),
                ]
                exportToExcel(data, columns, summary, { title, period, filename }, footerRows)
            }
            toast.success('Excel berhasil diexport!')
        } catch (error) {
            toast.error('Gagal export Excel')
        }
    }

    return (
        <div className="space-y-3 sm:space-y-6">
            {/* Filter Bar - Compact on mobile */}
            <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
                <div className="flex flex-col gap-2 sm:gap-4">
                    {/* Period Filter - Inline on mobile */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                            <SafeIcon name="Calendar" className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-foreground">Periode</span>
                        </div>
                        <Select value={datePreset} onValueChange={handlePresetChange}>
                            <SelectTrigger className="w-[130px] sm:w-[180px] h-8 text-xs sm:text-sm bg-background border-border/50 hover:border-primary/50 transition-colors">
                                <SelectValue placeholder="Pilih periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">
                                    <div className="flex items-center gap-2">
                                        <SafeIcon name="Clock" className="h-3.5 w-3.5 text-muted-foreground" />
                                        Hari Ini
                                    </div>
                                </SelectItem>
                                <SelectItem value="7days">
                                    <div className="flex items-center gap-2">
                                        <SafeIcon name="Calendar" className="h-3.5 w-3.5 text-muted-foreground" />
                                        7 Hari Terakhir
                                    </div>
                                </SelectItem>
                                <SelectItem value="30days">
                                    <div className="flex items-center gap-2">
                                        <SafeIcon name="Calendar" className="h-3.5 w-3.5 text-muted-foreground" />
                                        30 Hari Terakhir
                                    </div>
                                </SelectItem>
                                <SelectItem value="month">
                                    <div className="flex items-center gap-2">
                                        <SafeIcon name="CalendarDays" className="h-3.5 w-3.5 text-muted-foreground" />
                                        Bulan Ini
                                    </div>
                                </SelectItem>
                                <SelectItem value="year">
                                    <div className="flex items-center gap-2">
                                        <SafeIcon name="CalendarRange" className="h-3.5 w-3.5 text-muted-foreground" />
                                        Tahun Ini
                                    </div>
                                </SelectItem>
                                <SelectItem value="custom">
                                    <div className="flex items-center gap-2">
                                        <SafeIcon name="Settings2" className="h-3.5 w-3.5 text-muted-foreground" />
                                        Custom
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Refresh Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={fetchReports}
                            disabled={isLoading}
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        >
                            <SafeIcon
                                name="RefreshCw"
                                className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
                            />
                        </Button>

                        {/* Export Dropdown - Inline with filters */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading}
                                    className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                                >
                                    <SafeIcon name="Download" className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Export</span>
                                    <SafeIcon name="ChevronDown" className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                {activeTab === 'pangkalan' ? (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => pangkalanExportRef.current?.exportAllPDF()}
                                            className="cursor-pointer"
                                        >
                                            <SafeIcon name="FileText" className="h-4 w-4 mr-2 text-red-500" />
                                            Semua Data (PDF)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => pangkalanExportRef.current?.exportAllExcel()}
                                            className="cursor-pointer"
                                        >
                                            <SafeIcon name="FileSpreadsheet" className="h-4 w-4 mr-2 text-green-500" />
                                            Semua Data (Excel)
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                                            <SafeIcon name="FileText" className="h-4 w-4 mr-2 text-red-500" />
                                            Export PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                                            <SafeIcon name="FileSpreadsheet" className="h-4 w-4 mr-2 text-green-500" />
                                            Export Excel
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Custom date inputs */}
                    {datePreset === 'custom' && (
                        <div className="flex gap-2 items-center flex-wrap bg-muted/30 p-2 rounded-lg border border-border/50">
                            <Input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="w-[130px] h-8 text-xs bg-background"
                            />
                            <SafeIcon name="ArrowRight" className="h-3 w-3 text-muted-foreground" />
                            <Input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="w-[130px] h-8 text-xs bg-background"
                            />
                            <Button size="sm" onClick={handleCustomDateApply} className="h-8 text-xs">
                                <SafeIcon name="Check" className="h-3 w-3 mr-1" />
                                OK
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs - Horizontal scroll on mobile */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-3 sm:space-y-4">
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <TabsList className="inline-flex h-auto gap-1 rounded-xl sm:rounded-2xl glass-card p-1.5 sm:p-2 shadow-lg min-w-max mb-2">
                        <TabsTrigger
                            value="sales"
                            className="relative flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 text-muted-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 hover:text-primary"
                        >
                            <SafeIcon name="ShoppingCart" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>Penjualan</span>
                            {salesData && salesData.summary.total_orders > 0 && (
                                <Badge variant="secondary" className={`ml-0.5 h-4 sm:h-5 min-w-4 sm:min-w-5 rounded-full px-1 sm:px-1.5 text-[10px] sm:text-xs font-medium ${activeTab === 'sales' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                    {salesData.summary.total_orders}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="pangkalan"
                            className="relative flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 text-muted-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent/80 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-accent/10 hover:text-accent"
                        >
                            <SafeIcon name="Store" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>Pangkalan</span>
                            {totalPangkalan > 0 && (
                                <Badge variant="secondary" className={`ml-0.5 h-4 sm:h-5 min-w-4 sm:min-w-5 rounded-full px-1 sm:px-1.5 text-[10px] sm:text-xs font-medium ${activeTab === 'pangkalan' ? 'bg-white/20 text-white' : 'bg-accent/10 text-accent'}`}>
                                    {totalPangkalan}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="stock"
                            className="relative flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 text-muted-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-amber-500/10 hover:text-amber-600"
                        >
                            <SafeIcon name="Package" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>Stok</span>
                            {stockData && stockData.summary.current_balance !== undefined && (
                                <Badge variant="secondary" className={`ml-0.5 h-4 sm:h-5 min-w-4 sm:min-w-5 rounded-full px-1 sm:px-1.5 text-[10px] sm:text-xs font-medium ${activeTab === 'stock' ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600'}`}>
                                    {stockData.summary.current_balance}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Sales Tab */}
                <TabsContent value="sales" className="space-y-3 sm:space-y-4">
                    {/* Summary Cards - 5 columns with fixed height */}
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow h-[120px]">
                            <div className="p-4 relative h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Pesanan</p>
                                        <p className="text-2xl lg:text-3xl font-bold text-primary mt-1">
                                            {isLoading ? '...' : <AnimatedNumber value={salesData?.summary.total_orders || 0} delay={100} />}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Pesanan periode ini</p>
                                    </div>
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-200/50 dark:from-primary/30 dark:to-emerald-800/30 shadow-lg flex-shrink-0">
                                        <SafeIcon name="ShoppingCart" className="h-4 w-4 text-primary" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow h-[120px]">
                            <div className="p-4 relative h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Pendapatan</p>
                                        <p className="text-xl lg:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                            {isLoading ? '...' : <AnimatedNumber value={salesData?.summary.total_revenue || 0} delay={200} isCurrency />}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Revenue bruto</p>
                                    </div>
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 shadow-lg flex-shrink-0">
                                        <SafeIcon name="TrendingUp" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300" />
                            </div>
                        </Tilt3DCard>
                        {/* Profit Bersih Card */}
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow h-[120px]">
                            <div className="p-4 relative h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Profit Bersih</p>
                                        <p className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                            {isLoading ? '...' : <AnimatedNumber value={(salesData?.summary as any)?.total_profit || 0} delay={250} isCurrency />}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                            Margin: {isLoading ? '...' : `${((salesData?.summary as any)?.profit_margin || 0).toFixed(1)}%`}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 shadow-lg flex-shrink-0">
                                        <SafeIcon name="Coins" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow h-[120px]">
                            <div className="p-4 relative h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Rata-rata Pesanan</p>
                                        <p className="text-xl lg:text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">
                                            {isLoading ? '...' : <AnimatedNumber value={salesData?.summary.average_order || 0} delay={300} isCurrency />}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Per transaksi</p>
                                    </div>
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 shadow-lg flex-shrink-0">
                                        <SafeIcon name="Calculator" className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-5 card-hover-glow col-span-2 md:col-span-1 h-[120px]">
                            <div className="p-4 relative h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pertumbuhan</p>
                                        <p className={`text-2xl lg:text-3xl font-bold mt-1 ${growthPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {isLoading ? '...' : `${growthPercentage >= 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Vs target harian</p>
                                    </div>
                                    <div className={`p-2 rounded-xl shadow-lg flex-shrink-0 bg-gradient-to-br ${growthPercentage >= 0 ? 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30' : 'from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30'}`}>
                                        <SafeIcon name={growthPercentage >= 0 ? "TrendingUp" : "TrendingDown"} className={`h-4 w-4 ${growthPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                                    </div>
                                </div>
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${growthPercentage >= 0 ? 'from-green-300 via-green-500 to-green-300' : 'from-red-300 via-red-500 to-red-300'}`} />
                            </div>
                        </Tilt3DCard>
                    </div>

                    {/* Sales Charts */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Line Chart - Trend Penjualan */}
                        <div className="chart-card-premium rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <div className="p-5 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <h3 className="text-lg font-semibold">Tren Penjualan</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Total pendapatan per hari dalam periode ini
                                        </p>
                                    </div>
                                    {/* Edit Target Button */}
                                    {!isEditingTarget ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs gap-1 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
                                            onClick={() => {
                                                setTempTarget(String(dailySalesTarget))
                                                setIsEditingTarget(true)
                                            }}
                                        >
                                            <SafeIcon name="Settings2" className="h-3 w-3" />
                                            Target: {formatCurrency(dailySalesTarget)}
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="text"
                                                value={tempTarget}
                                                onChange={(e) => setTempTarget(e.target.value.replace(/\D/g, ''))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSaveTarget()
                                                    } else if (e.key === 'Escape') {
                                                        setIsEditingTarget(false)
                                                    }
                                                }}
                                                className="w-32 h-8 text-sm"
                                                placeholder="Rp"
                                                autoFocus
                                            />
                                            <Button size="sm" className="h-8 px-2" onClick={handleSaveTarget}>
                                                <SafeIcon name="Check" className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setIsEditingTarget(false)}>
                                                <SafeIcon name="X" className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-5">
                                {isLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : salesChartData.length === 0 ? (
                                    <div className="h-[300px] flex flex-col items-center justify-center gap-2">
                                        <SafeIcon name="LineChart" className="h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-muted-foreground">Tidak ada data trend</p>
                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={salesChartData}>
                                            <defs>
                                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                                <filter id="salesGlow" height="300%">
                                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}Jt`}
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <Tooltip
                                                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                                                labelFormatter={(label) => `Tanggal: ${label}`}
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px 16px'
                                                }}
                                                labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                                            />
                                            <Legend
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                iconType="circle"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="total"
                                                name="Penjualan Aktual"
                                                stroke="#22c55e"
                                                strokeWidth={3}
                                                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                                activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 3, filter: 'url(#salesGlow)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="profit"
                                                name="Profit"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3, stroke: '#fff' }}
                                                activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="target"
                                                name="Target Penjualan"
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                strokeDasharray="8 4"
                                                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3, stroke: '#fff' }}
                                                activeDot={{ r: 5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Pie Chart - Status Pesanan */}
                        <div className="chart-card-premium rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                            <div className="p-5 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                    <h3 className="text-lg font-semibold">Status Pesanan</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Distribusi pesanan berdasarkan status
                                </p>
                            </div>
                            <div className="p-5">
                                {isLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : salesByStatusData.length === 0 ? (
                                    <div className="h-[300px] flex flex-col items-center justify-center gap-2">
                                        <SafeIcon name="PieChart" className="h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-muted-foreground">Tidak ada data status</p>
                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <defs>
                                                <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                                                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                                                </filter>
                                            </defs>
                                            <Pie
                                                data={salesByStatusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={105}
                                                paddingAngle={3}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                                style={{ filter: 'url(#pieShadow)' }}
                                            >
                                                {salesByStatusData.map((_, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                        stroke="#fff"
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number) => [value, 'Pesanan']}
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px 16px'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sales Table */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SafeIcon name="List" className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle className="text-lg">Detail Penjualan</CardTitle>
                                </div>
                                {salesData && salesData.data.length > 0 && (
                                    <Badge variant="secondary" className="bg-muted px-2 py-1">
                                        {salesData.data.length} transaksi
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-t border-border">
                                        <tr>
                                            <th
                                                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleSalesSort('date')}
                                            >
                                                <span className="flex items-center gap-1">
                                                    Tanggal
                                                    <SafeIcon name={getSortIcon('date', salesSortBy, salesSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleSalesSort('code')}
                                            >
                                                <span className="flex items-center gap-1">
                                                    Kode
                                                    <SafeIcon name={getSortIcon('code', salesSortBy, salesSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleSalesSort('pangkalan')}
                                            >
                                                <span className="flex items-center gap-1">
                                                    Pangkalan
                                                    <SafeIcon name={getSortIcon('pangkalan', salesSortBy, salesSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                            <th
                                                className="px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleSalesSort('total')}
                                            >
                                                <span className="flex items-center justify-end gap-1">
                                                    Pendapatan
                                                    <SafeIcon name={getSortIcon('total', salesSortBy, salesSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                            <th
                                                className="px-4 py-3 text-center text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleSalesSort('status')}
                                            >
                                                <span className="flex items-center justify-center gap-1">
                                                    Status
                                                    <SafeIcon name={getSortIcon('status', salesSortBy, salesSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center">
                                                    <SafeIcon name="Loader2" className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                                </td>
                                            </tr>
                                        ) : sortedSalesData.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <SafeIcon name="ShoppingCart" className="h-10 w-10 text-muted-foreground/50" />
                                                        <p className="text-muted-foreground">Tidak ada data penjualan</p>
                                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedSalesData
                                                .slice((salesCurrentPage - 1) * salesRowsPerPage, salesCurrentPage * salesRowsPerPage)
                                                .map((item) => (
                                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                        <td className="px-4 py-3 text-sm">{formatDate(item.date)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium font-mono text-green-600">{item.code}</td>
                                                        <td className="px-4 py-3 text-sm">{item.pangkalan}</td>
                                                        <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(item.total)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge className={`${getStatusColor(item.status)} hover:bg-inherit`}>
                                                                {statusLabels[item.status] || item.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Controls */}
                            {salesData && salesData.data.length > 0 && (
                                <div className="p-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Tampilkan</span>
                                        <Select value={String(salesRowsPerPage)} onValueChange={(v) => { setSalesRowsPerPage(Number(v)); setSalesCurrentPage(1); }}>
                                            <SelectTrigger className="w-[70px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rowsPerPageOptions.map((opt) => (
                                                    <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span>dari {salesData.data.length} data</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSalesCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={salesCurrentPage === 1}
                                            className="h-8 px-2"
                                        >
                                            <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                                            Hal {salesCurrentPage} / {Math.ceil(salesData.data.length / salesRowsPerPage)}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSalesCurrentPage(p => Math.min(Math.ceil(salesData.data.length / salesRowsPerPage), p + 1))}
                                            disabled={salesCurrentPage >= Math.ceil(salesData.data.length / salesRowsPerPage)}
                                            className="h-8 px-2"
                                        >
                                            <SafeIcon name="ChevronRight" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pangkalan Analytics Tab */}
                <TabsContent value="pangkalan" className="space-y-4">
                    <PangkalanTabContent
                        dateRange={
                            datePreset === 'custom' && customStart && customEnd
                                ? { start: new Date(customStart).toISOString(), end: new Date(customEnd).toISOString() }
                                : getDateRange(datePreset)
                        }
                        isLoading={isLoading}
                        onSummaryLoad={setTotalPangkalan}
                        exportRef={pangkalanExportRef}
                    />
                </TabsContent>

                {/* Stock Tab */}
                <TabsContent value="stock" className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {/* Saldo Akhir - FIRST */}
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saldo Akhir</p>
                                        <p className="text-3xl font-bold text-primary mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={stockData?.summary.current_balance || 0} delay={100} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Stok saat ini</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-200/50 dark:from-primary/30 dark:to-emerald-800/30 shadow-lg">
                                        <SafeIcon name="Package" className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Masuk</p>
                                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                                            +{isLoading ? '...' : <AnimatedNumber value={stockData?.summary.total_in || 0} delay={200} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Stok masuk</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 shadow-lg">
                                        <SafeIcon name="ArrowDownCircle" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Keluar</p>
                                        <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                                            -{isLoading ? '...' : <AnimatedNumber value={stockData?.summary.total_out || 0} delay={300} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Stok keluar</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 shadow-lg">
                                        <SafeIcon name="ArrowUpCircle" className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-300 via-red-500 to-red-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Perubahan Bersih</p>
                                        <p className={`text-3xl font-bold mt-2 ${(stockData?.summary.net_change || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {isLoading ? '...' : <>{(stockData?.summary.net_change || 0) >= 0 ? '+' : ''}<AnimatedNumber value={stockData?.summary.net_change || 0} delay={400} /></>}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Selisih masuk/keluar</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 shadow-lg">
                                        <SafeIcon name="TrendingUp" className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-5 card-hover-glow">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jumlah Transaksi</p>
                                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={stockData?.summary.movement_count || 0} delay={500} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Pergerakan stok</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-800/30 shadow-lg">
                                        <SafeIcon name="Activity" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
                            </div>
                        </Tilt3DCard>
                    </div>

                    {/* Stock Charts */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Line Chart - Trend Stok */}
                        <div className="chart-card-premium rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                            <div className="p-5 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <h3 className="text-lg font-semibold">Grafik Pergerakan Stok</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Stok masuk dan keluar per hari dalam periode ini
                                </p>
                            </div>
                            <div className="p-5">
                                {isLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : stockChartData.length === 0 ? (
                                    <div className="h-[300px] flex flex-col items-center justify-center gap-2">
                                        <SafeIcon name="LineChart" className="h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-muted-foreground">Tidak ada data pergerakan</p>
                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={stockChartData}>
                                            <defs>
                                                <filter id="stockGlowGreen" height="300%">
                                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                                <filter id="stockGlowOrange" height="300%">
                                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px 16px'
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                iconType="circle"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="masuk"
                                                name="Masuk"
                                                stroke="#22c55e"
                                                strokeWidth={3}
                                                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                                activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 3, filter: 'url(#stockGlowGreen)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="keluar"
                                                name="Keluar"
                                                stroke="#f59e0b"
                                                strokeWidth={3}
                                                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                                activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 3, filter: 'url(#stockGlowOrange)' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Bar Chart - Stok per Produk */}
                        <div className="chart-card-premium rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                            <div className="p-5 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                    <h3 className="text-lg font-semibold">Pemakaian Berdasarkan Jenis</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Distribusi stok masuk/keluar per produk
                                </p>
                            </div>
                            <div className="p-5">
                                {isLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : stockByProductData.length === 0 ? (
                                    <div className="h-[300px] flex flex-col items-center justify-center gap-2">
                                        <SafeIcon name="BarChart" className="h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-muted-foreground">Tidak ada data produk</p>
                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stockByProductData} layout="vertical">
                                            <defs>
                                                <linearGradient id="stockBarGreen" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
                                                </linearGradient>
                                                <linearGradient id="stockBarOrange" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                                            <XAxis
                                                type="number"
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                dataKey="product"
                                                type="category"
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                width={100}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px 16px'
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                iconType="circle"
                                            />
                                            <Bar dataKey="masuk" name="Masuk" fill="url(#stockBarGreen)" radius={[0, 4, 4, 0]} />
                                            <Bar dataKey="keluar" name="Keluar" fill="url(#stockBarOrange)" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stock Table */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SafeIcon name="PackageOpen" className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle className="text-lg">Riwayat Pergerakan Stok</CardTitle>
                                </div>
                                {stockData && stockData.data.length > 0 && (
                                    <Badge variant="secondary" className="bg-muted px-2 py-1">
                                        {stockData.data.length} pergerakan
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-t border-border">
                                        <tr>
                                            <th
                                                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleStockSort('date')}
                                            >
                                                <span className="flex items-center gap-1">
                                                    Tanggal
                                                    <SafeIcon name={getSortIcon('date', stockSortBy, stockSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleStockSort('product')}
                                            >
                                                <span className="flex items-center gap-1">
                                                    Produk
                                                    <SafeIcon name={getSortIcon('product', stockSortBy, stockSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                            <th
                                                className="px-4 py-3 text-center text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleStockSort('type')}
                                            >
                                                <span className="flex items-center justify-center gap-1">
                                                    Tipe
                                                    <SafeIcon name={getSortIcon('type', stockSortBy, stockSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                            <th
                                                className="px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none"
                                                onClick={() => handleStockSort('qty')}
                                            >
                                                <span className="flex items-center justify-end gap-1">
                                                    Qty
                                                    <SafeIcon name={getSortIcon('qty', stockSortBy, stockSortOrder)} className="h-3.5 w-3.5" />
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Keterangan</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dicatat Oleh</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center">
                                                    <SafeIcon name="Loader2" className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                                </td>
                                            </tr>
                                        ) : sortedStockData.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <SafeIcon name="Package" className="h-10 w-10 text-muted-foreground/50" />
                                                        <p className="text-muted-foreground">Tidak ada data pergerakan stok</p>
                                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedStockData
                                                .slice((stockCurrentPage - 1) * stockRowsPerPage, stockCurrentPage * stockRowsPerPage)
                                                .map((item) => (
                                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                        <td className="px-4 py-3 text-sm">{formatDate(item.date)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-orange-600">{item.product}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge className={`${item.type === 'MASUK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} hover:bg-inherit`}>
                                                                {item.type}
                                                            </Badge>
                                                        </td>
                                                        <td className={`px-4 py-3 text-sm text-right font-medium font-mono ${item.type === 'MASUK' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {item.type === 'MASUK' ? '+' : '-'}{item.qty}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-muted-foreground">{item.note || '-'}</td>
                                                        <td className="px-4 py-3 text-sm text-muted-foreground">{item.recorded_by}</td>
                                                    </tr>
                                                ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Controls */}
                            {stockData && stockData.data.length > 0 && (
                                <div className="p-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Tampilkan</span>
                                        <Select value={String(stockRowsPerPage)} onValueChange={(v) => { setStockRowsPerPage(Number(v)); setStockCurrentPage(1); }}>
                                            <SelectTrigger className="w-[70px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rowsPerPageOptions.map((opt) => (
                                                    <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span>dari {stockData.data.length} data</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setStockCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={stockCurrentPage === 1}
                                            className="h-8 px-2"
                                        >
                                            <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                                            Hal {stockCurrentPage} / {Math.ceil(stockData.data.length / stockRowsPerPage)}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setStockCurrentPage(p => Math.min(Math.ceil(stockData.data.length / stockRowsPerPage), p + 1))}
                                            disabled={stockCurrentPage >= Math.ceil(stockData.data.length / stockRowsPerPage)}
                                            className="h-8 px-2"
                                        >
                                            <SafeIcon name="ChevronRight" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
