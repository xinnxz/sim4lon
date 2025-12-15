'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import {
    reportsApi,
    type SalesReportResponse,
    type PaymentsReportResponse,
    type StockMovementResponse
} from '@/lib/api'
import { toast } from 'sonner'
import { exportToPDF, exportToExcel, formatCurrencyExport, formatDateExport } from '@/lib/export-utils'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

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
    const [activeTab, setActiveTab] = useState('sales')
    const [datePreset, setDatePreset] = useState<DatePreset>('month')
    const [customStart, setCustomStart] = useState('')
    const [customEnd, setCustomEnd] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Pagination states
    const rowsPerPageOptions = [10, 25, 50]
    const [salesRowsPerPage, setSalesRowsPerPage] = useState(10)
    const [salesCurrentPage, setSalesCurrentPage] = useState(1)
    const [paymentsRowsPerPage, setPaymentsRowsPerPage] = useState(10)
    const [paymentsCurrentPage, setPaymentsCurrentPage] = useState(1)
    const [stockRowsPerPage, setStockRowsPerPage] = useState(10)
    const [stockCurrentPage, setStockCurrentPage] = useState(1)

    // Report data
    const [salesData, setSalesData] = useState<SalesReportResponse | null>(null)
    const [paymentsData, setPaymentsData] = useState<PaymentsReportResponse | null>(null)
    const [stockData, setStockData] = useState<StockMovementResponse | null>(null)

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

            const [sales, payments, stock] = await Promise.all([
                reportsApi.getSalesReport(range.start, range.end),
                reportsApi.getPaymentsReport(range.start, range.end),
                reportsApi.getStockMovementReport(range.start, range.end),
            ])

            setSalesData(sales)
            setPaymentsData(payments)
            setStockData(stock)
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
            case 'SELESAI': return 'bg-green-100 text-green-800'
            case 'DIKIRIM': return 'bg-blue-100 text-blue-800'
            case 'DIPROSES': return 'bg-yellow-100 text-yellow-800'
            case 'MENUNGGU_PEMBAYARAN': return 'bg-orange-100 text-orange-800'
            case 'DIBATALKAN': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
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

    // Prepare chart data - Sales trend by date with target line
    const salesChartData = useMemo(() => {
        if (!salesData?.data) return []
        const groupedByDate: Record<string, { date: string; total: number; count: number; target: number }> = {}

        salesData.data.forEach(item => {
            const dateKey = new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { date: dateKey, total: 0, count: 0, target: dailySalesTarget }
            }
            groupedByDate[dateKey].total += item.total
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

    // Payment method breakdown for bar chart
    const paymentMethodData = useMemo(() => {
        if (!paymentsData?.summary.method_breakdown) return []
        return Object.entries(paymentsData.summary.method_breakdown).map(([method, data]) => ({
            name: method,
            count: data.count,
            amount: data.amount / 1000000, // In millions for readability
        }))
    }, [paymentsData])

    // Payment trend by date
    const paymentChartData = useMemo(() => {
        if (!paymentsData?.data) return []
        const groupedByDate: Record<string, { date: string; amount: number; count: number }> = {}

        paymentsData.data.forEach(item => {
            const dateKey = new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { date: dateKey, amount: 0, count: 0 }
            }
            groupedByDate[dateKey].amount += item.amount
            groupedByDate[dateKey].count += 1
        })

        return Object.values(groupedByDate).reverse()
    }, [paymentsData])

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

    const handleExportPDF = () => {
        try {
            const tabTitles = { sales: 'Penjualan', payments: 'Pembayaran', stock: 'Stok' }
            const title = `Laporan ${tabTitles[activeTab as keyof typeof tabTitles]}`
            const period = getPeriodLabel()
            const filename = `laporan-${activeTab}-${new Date().toISOString().split('T')[0]}`

            if (activeTab === 'sales' && salesData) {
                const columns = [
                    { header: 'Tanggal', key: 'date', width: 15 },
                    { header: 'Kode', key: 'code', width: 12 },
                    { header: 'Pangkalan', key: 'pangkalan', width: 25 },
                    { header: 'Total', key: 'total', width: 18 },
                    { header: 'Status', key: 'status', width: 15 },
                ]
                const data = salesData.data.map(item => ({
                    ...item,
                    date: formatDateExport(item.date),
                    total: formatCurrencyExport(item.total),
                    status: statusLabels[item.status] || item.status,
                }))
                const summary = [
                    { label: 'Total Pesanan', value: salesData.summary.total_orders },
                    { label: 'Total Pendapatan', value: formatCurrencyExport(salesData.summary.total_revenue) },
                    { label: 'Rata-rata Pesanan', value: formatCurrencyExport(salesData.summary.average_order) },
                    { label: 'Pesanan Selesai', value: salesData.summary.status_breakdown?.SELESAI || 0 },
                ]
                exportToPDF(data, columns, summary, { title, period, filename })
            } else if (activeTab === 'payments' && paymentsData) {
                const columns = [
                    { header: 'Tanggal', key: 'date', width: 15 },
                    { header: 'Invoice', key: 'invoice_number', width: 15 },
                    { header: 'Pangkalan', key: 'pangkalan', width: 25 },
                    { header: 'Jumlah', key: 'amount', width: 18 },
                    { header: 'Metode', key: 'method', width: 12 },
                    { header: 'Dicatat Oleh', key: 'recorded_by', width: 15 },
                ]
                const data = paymentsData.data.map(item => ({
                    ...item,
                    date: formatDateExport(item.date),
                    amount: formatCurrencyExport(item.amount),
                }))
                const summary = [
                    { label: 'Jumlah Pembayaran', value: paymentsData.summary.total_payments },
                    { label: 'Total Diterima', value: formatCurrencyExport(paymentsData.summary.total_amount) },
                    { label: 'Rata-rata Pembayaran', value: formatCurrencyExport(paymentsData.summary.average_payment) },
                ]
                exportToPDF(data, columns, summary, { title, period, filename })
            } else if (activeTab === 'stock' && stockData) {
                const columns = [
                    { header: 'Tanggal', key: 'date', width: 15 },
                    { header: 'Produk', key: 'product', width: 20 },
                    { header: 'Tipe', key: 'type', width: 10 },
                    { header: 'Qty', key: 'qty', width: 10 },
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
                exportToPDF(data, columns, summary, { title, period, filename })
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
                    { header: 'Tanggal', key: 'date' },
                    { header: 'Kode', key: 'code' },
                    { header: 'Pangkalan', key: 'pangkalan' },
                    { header: 'Subtotal', key: 'subtotal' },
                    { header: 'Pajak', key: 'tax' },
                    { header: 'Total', key: 'total' },
                    { header: 'Status', key: 'status' },
                ]
                const data = salesData.data.map(item => ({
                    ...item,
                    date: formatDateExport(item.date),
                    status: statusLabels[item.status] || item.status,
                }))
                const summary = [
                    { label: 'Total Pesanan', value: salesData.summary.total_orders },
                    { label: 'Total Pendapatan', value: salesData.summary.total_revenue },
                    { label: 'Rata-rata Pesanan', value: salesData.summary.average_order },
                ]
                exportToExcel(data, columns, summary, { title, period, filename })
            } else if (activeTab === 'payments' && paymentsData) {
                const columns = [
                    { header: 'Tanggal', key: 'date' },
                    { header: 'Invoice', key: 'invoice_number' },
                    { header: 'Order', key: 'order_code' },
                    { header: 'Pangkalan', key: 'pangkalan' },
                    { header: 'Jumlah', key: 'amount' },
                    { header: 'Metode', key: 'method' },
                    { header: 'Catatan', key: 'note' },
                    { header: 'Dicatat Oleh', key: 'recorded_by' },
                ]
                const data = paymentsData.data.map(item => ({
                    ...item,
                    date: formatDateExport(item.date),
                }))
                const summary = [
                    { label: 'Jumlah Pembayaran', value: paymentsData.summary.total_payments },
                    { label: 'Total Diterima', value: paymentsData.summary.total_amount },
                    { label: 'Rata-rata Pembayaran', value: paymentsData.summary.average_payment },
                ]
                exportToExcel(data, columns, summary, { title, period, filename })
            } else if (activeTab === 'stock' && stockData) {
                const columns = [
                    { header: 'Tanggal', key: 'date' },
                    { header: 'Produk', key: 'product' },
                    { header: 'Tipe', key: 'type' },
                    { header: 'Qty', key: 'qty' },
                    { header: 'Keterangan', key: 'note' },
                    { header: 'Dicatat Oleh', key: 'recorded_by' },
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
                exportToExcel(data, columns, summary, { title, period, filename })
            }
            toast.success('Excel berhasil diexport!')
        } catch (error) {
            toast.error('Gagal export Excel')
        }
    }

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Period Filter */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                                <SafeIcon name="Calendar" className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">Periode</span>
                            </div>
                            <Select value={datePreset} onValueChange={handlePresetChange}>
                                <SelectTrigger className="w-[180px] bg-background border-border/50 hover:border-primary/50 transition-colors">
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

                            {datePreset === 'custom' && (
                                <div className="flex gap-2 items-center bg-muted/30 p-2 rounded-lg border border-border/50">
                                    <Input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        className="w-[140px] h-9 bg-background"
                                    />
                                    <SafeIcon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        className="w-[140px] h-9 bg-background"
                                    />
                                    <Button size="sm" onClick={handleCustomDateApply} className="h-9">
                                        <SafeIcon name="Check" className="h-4 w-4 mr-1" />
                                        Terapkan
                                    </Button>
                                </div>
                            )}

                            {/* Refresh Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={fetchReports}
                                disabled={isLoading}
                                className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                            >
                                <SafeIcon
                                    name="RefreshCw"
                                    className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                                />
                            </Button>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isLoading}
                                onClick={handleExportPDF}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                            >
                                <SafeIcon name="FileText" className="h-4 w-4 mr-2" />
                                Export PDF
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isLoading}
                                onClick={handleExportExcel}
                                className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
                            >
                                <SafeIcon name="FileSpreadsheet" className="h-4 w-4 mr-2" />
                                Export Excel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="inline-flex h-auto gap-1 rounded-xl bg-slate-200/80 p-1.5 border border-slate-300 shadow-sm">
                    <TabsTrigger
                        value="sales"
                        className="relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 text-slate-600 data-[state=active]:bg-green-100 data-[state=active]:text-green-800 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-green-200 hover:bg-green-50 hover:text-green-700"
                    >
                        <SafeIcon name="ShoppingCart" className="h-4 w-4" />
                        <span>Penjualan</span>
                        {salesData && salesData.summary.total_orders > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs font-medium bg-green-200/20 text-green-800">
                                {salesData.summary.total_orders}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="payments"
                        className="relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 text-slate-600 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                        <SafeIcon name="CreditCard" className="h-4 w-4" />
                        <span>Pembayaran</span>
                        {paymentsData && paymentsData.summary.total_payments > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs font-medium bg-blue-200/20 text-blue-800">
                                {paymentsData.summary.total_payments}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="stock"
                        className="relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 text-slate-600 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                    >
                        <SafeIcon name="Package" className="h-4 w-4" />
                        <span>Stok</span>
                        {stockData && stockData.summary.movement_count > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs font-medium bg-orange-200/20 text-orange-800">
                                {stockData.summary.movement_count}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Sales Tab */}
                <TabsContent value="sales" className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Tilt3DCard className="animate-fadeInUp">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Total Pesanan</CardTitle>
                                    <div className="p-2 rounded-lg bg-blue-50">
                                        <SafeIcon name="ShoppingCart" className="h-4 w-4 text-blue-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' : salesData?.summary.total_orders || 0}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Pesanan dalam periode</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Total Pendapatan</CardTitle>
                                    <div className="p-2 rounded-lg bg-green-50">
                                        <SafeIcon name="TrendingUp" className="h-4 w-4 text-green-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' : formatCurrency(salesData?.summary.total_revenue || 0)}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Revenue keseluruhan</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Rata-rata Pesanan</CardTitle>
                                    <div className="p-2 rounded-lg bg-purple-50">
                                        <SafeIcon name="Calculator" className="h-4 w-4 text-purple-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' : formatCurrency(salesData?.summary.average_order || 0)}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Per transaksi</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Pertumbuhan</CardTitle>
                                    <div className={`p-2 rounded-lg ${growthPercentage >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                        <SafeIcon name={growthPercentage >= 0 ? "TrendingUp" : "TrendingDown"} className={`h-4 w-4 ${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {isLoading ? '...' : `${growthPercentage >= 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Vs target harian</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                    </div>

                    {/* Sales Charts */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Line Chart - Trend Penjualan */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Tren Penjualan</CardTitle>
                                        <CardDescription>
                                            Total pendapatan per hari dalam periode ini
                                        </CardDescription>
                                    </div>
                                    {/* Edit Target Button */}
                                    {!isEditingTarget ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs gap-1"
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
                            </CardHeader>
                            <CardContent>
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
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                            <YAxis
                                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}Jt`}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                                                labelFormatter={(label) => `Tanggal: ${label}`}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="total"
                                                name="Penjualan Aktual"
                                                stroke={CHART_COLORS.primary}
                                                strokeWidth={2}
                                                dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="target"
                                                name="Target Penjualan"
                                                stroke={CHART_COLORS.secondary}
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pie Chart - Status Pesanan */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Status Pesanan</CardTitle>
                                <CardDescription>
                                    Distribusi pesanan berdasarkan status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
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
                                            <Pie
                                                data={salesByStatusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={4}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                                            >
                                                {salesByStatusData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => [value, 'Pesanan']} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
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
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tanggal</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Kode</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Pangkalan</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Total</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center">
                                                    <SafeIcon name="Loader2" className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                                </td>
                                            </tr>
                                        ) : salesData?.data.length === 0 ? (
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
                                            salesData?.data
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

                {/* Payments Tab */}
                <TabsContent value="payments" className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Tilt3DCard className="animate-fadeInUp">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Jumlah Pembayaran</CardTitle>
                                    <div className="p-2 rounded-lg bg-blue-50">
                                        <SafeIcon name="Receipt" className="h-4 w-4 text-blue-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' : paymentsData?.summary.total_payments || 0}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Total transaksi</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Total Diterima</CardTitle>
                                    <div className="p-2 rounded-lg bg-green-50">
                                        <SafeIcon name="DollarSign" className="h-4 w-4 text-green-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' : formatCurrency(paymentsData?.summary.total_amount || 0)}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Pembayaran diterima</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Rata-rata Pembayaran</CardTitle>
                                    <div className="p-2 rounded-lg bg-purple-50">
                                        <SafeIcon name="Calculator" className="h-4 w-4 text-purple-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' : formatCurrency(paymentsData?.summary.average_payment || 0)}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Per transaksi</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Metode Terbanyak</CardTitle>
                                    <div className="p-2 rounded-lg bg-orange-50">
                                        <SafeIcon name="CreditCard" className="h-4 w-4 text-orange-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' :
                                            Object.entries(paymentsData?.summary.method_breakdown || {})
                                                .sort(([, a], [, b]) => b.count - a.count)[0]?.[0] || '-'
                                        }
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Metode populer</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                    </div>

                    {/* Payment Charts */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Line Chart - Trend Pembayaran */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Tren Pembayaran</CardTitle>
                                <CardDescription>
                                    Total pembayaran per hari dalam periode ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : paymentChartData.length === 0 ? (
                                    <div className="h-[300px] flex flex-col items-center justify-center gap-2">
                                        <SafeIcon name="LineChart" className="h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-muted-foreground">Tidak ada data trend</p>
                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={paymentChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                            <YAxis
                                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}Jt`}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                formatter={(value: number) => [formatCurrency(value), 'Jumlah']}
                                                labelFormatter={(label) => `Tanggal: ${label}`}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                name="Pembayaran"
                                                stroke={CHART_COLORS.accent}
                                                strokeWidth={2}
                                                dot={{ fill: CHART_COLORS.accent, strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bar Chart - Metode Pembayaran */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
                                <CardDescription>
                                    Distribusi jumlah & total per metode
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : paymentMethodData.length === 0 ? (
                                    <div className="h-[300px] flex flex-col items-center justify-center gap-2">
                                        <SafeIcon name="BarChart3" className="h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-muted-foreground">Tidak ada data metode</p>
                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={paymentMethodData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                tickFormatter={(v) => `${v}Jt`}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                formatter={(value: number, name: string) =>
                                                    name === 'Total (Juta)' ? [`Rp ${(value).toFixed(1)}M`, name] : [value, name]
                                                }
                                            />
                                            <Legend />
                                            <Bar yAxisId="left" dataKey="count" name="Jumlah" fill={CHART_COLORS.primary} />
                                            <Bar yAxisId="right" dataKey="amount" name="Total (Juta)" fill={CHART_COLORS.secondary} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payments Table */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SafeIcon name="Receipt" className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle className="text-lg">Detail Pembayaran</CardTitle>
                                </div>
                                {paymentsData && paymentsData.data.length > 0 && (
                                    <Badge variant="secondary" className="bg-muted px-2 py-1">
                                        {paymentsData.data.length} pembayaran
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-t border-border">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tanggal</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invoice</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Pangkalan</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Jumlah</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Metode</th>
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
                                        ) : paymentsData?.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <SafeIcon name="CreditCard" className="h-10 w-10 text-muted-foreground/50" />
                                                        <p className="text-muted-foreground">Tidak ada data pembayaran</p>
                                                        <p className="text-sm text-muted-foreground/70">Coba ubah filter periode</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            paymentsData?.data
                                                .slice((paymentsCurrentPage - 1) * paymentsRowsPerPage, paymentsCurrentPage * paymentsRowsPerPage)
                                                .map((item) => (
                                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                        <td className="px-4 py-3 text-sm">{formatDate(item.date)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium font-mono text-blue-600">{item.invoice_number}</td>
                                                        <td className="px-4 py-3 text-sm">{item.pangkalan}</td>
                                                        <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">{formatCurrency(item.amount)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge variant="outline">{item.method}</Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-muted-foreground">{item.recorded_by}</td>
                                                    </tr>
                                                ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Controls */}
                            {paymentsData && paymentsData.data.length > 0 && (
                                <div className="p-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Tampilkan</span>
                                        <Select value={String(paymentsRowsPerPage)} onValueChange={(v) => { setPaymentsRowsPerPage(Number(v)); setPaymentsCurrentPage(1); }}>
                                            <SelectTrigger className="w-[70px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rowsPerPageOptions.map((opt) => (
                                                    <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span>dari {paymentsData.data.length} data</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPaymentsCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={paymentsCurrentPage === 1}
                                            className="h-8 px-2"
                                        >
                                            <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                                            Hal {paymentsCurrentPage} / {Math.ceil(paymentsData.data.length / paymentsRowsPerPage)}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPaymentsCurrentPage(p => Math.min(Math.ceil(paymentsData.data.length / paymentsRowsPerPage), p + 1))}
                                            disabled={paymentsCurrentPage >= Math.ceil(paymentsData.data.length / paymentsRowsPerPage)}
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

                {/* Stock Tab */}
                <TabsContent value="stock" className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                        <Tilt3DCard className="animate-fadeInUp">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Total Masuk</CardTitle>
                                    <div className="p-2 rounded-lg bg-green-50">
                                        <SafeIcon name="ArrowDownCircle" className="h-4 w-4 text-green-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        +{isLoading ? '...' : stockData?.summary.total_in || 0}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Stok masuk</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Total Keluar</CardTitle>
                                    <div className="p-2 rounded-lg bg-red-50">
                                        <SafeIcon name="ArrowUpCircle" className="h-4 w-4 text-red-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        -{isLoading ? '...' : stockData?.summary.total_out || 0}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Stok keluar</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Perubahan Bersih</CardTitle>
                                    <div className="p-2 rounded-lg bg-blue-50">
                                        <SafeIcon name="TrendingUp" className="h-4 w-4 text-blue-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${(stockData?.summary.net_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {isLoading ? '...' : (stockData?.summary.net_change || 0) >= 0 ? '+' : ''}{stockData?.summary.net_change || 0}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Selisih masuk/keluar</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Saldo Akhir</CardTitle>
                                    <div className="p-2 rounded-lg bg-purple-50">
                                        <SafeIcon name="Package" className="h-4 w-4 text-purple-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' : stockData?.summary.current_balance || 0}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Stok saat ini</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-foreground/70">Jumlah Transaksi</CardTitle>
                                    <div className="p-2 rounded-lg bg-orange-50">
                                        <SafeIcon name="Activity" className="h-4 w-4 text-orange-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {isLoading ? '...' : stockData?.summary.movement_count || 0}
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-1">Pergerakan stok</p>
                                </CardContent>
                            </Card>
                        </Tilt3DCard>
                    </div>

                    {/* Stock Charts */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Line Chart - Trend Stok */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Grafik Pergerakan Stok</CardTitle>
                                <CardDescription>
                                    Stok masuk dan keluar per hari dalam periode ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
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
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="masuk"
                                                name="Masuk"
                                                stroke={CHART_COLORS.primary}
                                                strokeWidth={2}
                                                dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="keluar"
                                                name="Keluar"
                                                stroke={CHART_COLORS.secondary}
                                                strokeWidth={2}
                                                dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bar Chart - Stok per Produk */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Pemakaian Berdasarkan Jenis</CardTitle>
                                <CardDescription>
                                    Distribusi stok masuk/keluar per produk
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
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
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis type="number" tick={{ fontSize: 12 }} />
                                            <YAxis dataKey="product" type="category" tick={{ fontSize: 11 }} width={100} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="masuk" name="Masuk" fill={CHART_COLORS.primary} />
                                            <Bar dataKey="keluar" name="Keluar" fill={CHART_COLORS.secondary} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
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
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tanggal</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Produk</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Tipe</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Qty</th>
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
                                        ) : stockData?.data.length === 0 ? (
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
                                            stockData?.data
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
