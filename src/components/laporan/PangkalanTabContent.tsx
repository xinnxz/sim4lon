'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import AnimatedNumber from '@/components/common/AnimatedNumber'
import {
    reportsApi,
    type PangkalanReportResponse,
    type SubsidiConsumersResponse
} from '@/lib/api'
import { toast } from 'sonner'
import { exportToPDF, exportToExcel, formatCurrencyExport, formatDateExport, createFooterRow } from '@/lib/export-utils'

interface PangkalanTabContentProps {
    dateRange: { start: string; end: string }
    isLoading: boolean
    onSummaryLoad?: (totalPangkalan: number) => void
}

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

type SubTabType = 'subsidi' | 'nonsubsidi'

export default function PangkalanTabContent({ dateRange, isLoading: initialLoading, onSummaryLoad }: PangkalanTabContentProps) {
    // Read sub-tab from URL hash or default to 'subsidi'
    const getInitialSubTab = (): SubTabType => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '')
            if (hash === 'pangkalan-nonsubsidi') return 'nonsubsidi'
        }
        return 'subsidi'
    }

    const [pangkalanData, setPangkalanData] = useState<PangkalanReportResponse | null>(null)
    const [consumersData, setConsumersData] = useState<SubsidiConsumersResponse | null>(null)
    const [selectedPangkalanId, setSelectedPangkalanId] = useState<string>('')
    const [isLoading, setIsLoading] = useState(initialLoading)
    const [isLoadingConsumers, setIsLoadingConsumers] = useState(false)

    // Sub-tab state
    const [activeSubTab, setActiveSubTab] = useState<SubTabType>(getInitialSubTab)

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [regionFilter, setRegionFilter] = useState<string>('ALL')

    // Pagination
    const rowsPerPageOptions = [10, 25, 50]
    const [pangkalanRowsPerPage, setPangkalanRowsPerPage] = useState(10)
    const [pangkalanCurrentPage, setPangkalanCurrentPage] = useState(1)

    // Sorting states
    type SortField = 'name' | 'region' | 'transactions' | 'tabung' | 'revenue'
    const [sortBy, setSortBy] = useState<SortField>('tabung') // Default sort by tabung (ranking)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Handle sort toggle
    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
        setPangkalanCurrentPage(1)
    }

    // Get sort icon
    const getSortIcon = (field: SortField) => {
        if (sortBy !== field) return 'ArrowUpDown'
        return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'
    }

    // Handle sub-tab change with URL hash
    const handleSubTabChange = (value: SubTabType) => {
        setActiveSubTab(value)
        setPangkalanCurrentPage(1) // Reset pagination
        if (typeof window !== 'undefined') {
            const newHash = value === 'nonsubsidi' ? '#pangkalan-nonsubsidi' : '#pangkalan'
            window.history.replaceState(null, '', newHash)
        }
    }

    // Fetch pangkalan data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const data = await reportsApi.getPangkalanReport(dateRange.start, dateRange.end)
                setPangkalanData(data)
                setSelectedPangkalanId('')
                setConsumersData(null)
                // Notify parent of total pangkalan
                if (onSummaryLoad && data?.summary?.total_pangkalan) {
                    onSummaryLoad(data.summary.total_pangkalan)
                }
            } catch (error: any) {
                toast.error(error.message || 'Gagal memuat data pangkalan')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [dateRange.start, dateRange.end, onSummaryLoad])

    // Fetch consumers for selected pangkalan (subsidi only)
    const fetchConsumers = async (pangkalanId: string) => {
        if (!pangkalanId) {
            setConsumersData(null)
            return
        }

        setIsLoadingConsumers(true)
        try {
            const data = await reportsApi.getSubsidiConsumers(pangkalanId, dateRange.start, dateRange.end)
            setConsumersData(data)
        } catch (error: any) {
            toast.error(error.message || 'Gagal memuat data konsumen')
        } finally {
            setIsLoadingConsumers(false)
        }
    }

    const handlePangkalanSelect = (pangkalanId: string) => {
        setSelectedPangkalanId(pangkalanId)
        fetchConsumers(pangkalanId)
    }

    // Helper function to extract kabupaten from full region string
    const extractKabupaten = (region: string): string => {
        // Format: "Kec. X, Kab. Y" or "Kab. Y" or just "Y"
        const kabMatch = region.match(/Kab(?:upaten)?\.?\s*([^\,]+)/i);
        if (kabMatch) return `Kab. ${kabMatch[1].trim()}`;

        const kotaMatch = region.match(/Kota\.?\s*([^\,]+)/i);
        if (kotaMatch) return `Kota ${kotaMatch[1].trim()}`;

        // If no pattern matches, return original
        return region;
    }

    // Get unique kabupaten for filter (extracted from region)
    const kabupatenList = useMemo(() => {
        if (!pangkalanData?.data) return []
        const kabupatenSet = new Set<string>()
        pangkalanData.data.forEach(p => {
            if (p.region && p.region !== '-') {
                kabupatenSet.add(extractKabupaten(p.region))
            }
        })
        return Array.from(kabupatenSet).sort()
    }, [pangkalanData])

    // Filter and sort data based on active sub-tab and user sorting
    const filteredData = useMemo(() => {
        if (!pangkalanData?.data) return []

        let filtered = [...pangkalanData.data]

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.code.toLowerCase().includes(query) ||
                p.region.toLowerCase().includes(query)
            )
        }

        // Apply kabupaten filter
        if (regionFilter !== 'ALL') {
            filtered = filtered.filter(p => extractKabupaten(p.region) === regionFilter)
        }

        // Dynamic sorting based on sortBy and sortOrder
        const multiplier = sortOrder === 'asc' ? 1 : -1
        filtered.sort((a, b) => {
            const aTransactions = activeSubTab === 'subsidi' ? a.total_consumer_orders : a.total_nonsubsidi_orders
            const bTransactions = activeSubTab === 'subsidi' ? b.total_consumer_orders : b.total_nonsubsidi_orders
            const aTabung = activeSubTab === 'subsidi' ? a.total_tabung_to_consumers : a.total_nonsubsidi_tabung
            const bTabung = activeSubTab === 'subsidi' ? b.total_tabung_to_consumers : b.total_nonsubsidi_tabung
            const aRevenue = activeSubTab === 'subsidi' ? a.total_revenue : a.total_nonsubsidi_revenue
            const bRevenue = activeSubTab === 'subsidi' ? b.total_revenue : b.total_nonsubsidi_revenue

            switch (sortBy) {
                case 'name':
                    return multiplier * a.name.localeCompare(b.name)
                case 'region':
                    return multiplier * (a.region || '').localeCompare(b.region || '')
                case 'transactions':
                    return multiplier * (aTransactions - bTransactions)
                case 'tabung':
                    return multiplier * (aTabung - bTabung)
                case 'revenue':
                    return multiplier * (aRevenue - bRevenue)
                default:
                    return 0
            }
        })

        return filtered
    }, [pangkalanData, searchQuery, regionFilter, activeSubTab, sortBy, sortOrder])

    // Paginated data
    const paginatedData = useMemo(() => {
        const start = (pangkalanCurrentPage - 1) * pangkalanRowsPerPage
        return filteredData.slice(start, start + pangkalanRowsPerPage)
    }, [filteredData, pangkalanCurrentPage, pangkalanRowsPerPage])

    const totalPages = Math.ceil(filteredData.length / pangkalanRowsPerPage)

    // Export handlers
    const getPeriodLabel = () => {
        const start = new Date(dateRange.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        const end = new Date(dateRange.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        return `${start} - ${end}`
    }

    const handleExportPDF = async () => {
        try {
            const subTabLabel = activeSubTab === 'subsidi' ? 'Subsidi (3kg)' : 'Non-Subsidi (5.5kg+)'
            const title = `Laporan Pangkalan - ${subTabLabel}`
            const period = getPeriodLabel()
            const filename = `laporan-pangkalan-${activeSubTab}-${new Date().toISOString().split('T')[0]}`

            const columns = [
                { header: 'Kode', key: 'code', width: 12 },
                { header: 'Pangkalan', key: 'name', width: 25 },
                { header: 'Wilayah', key: 'region', width: 25 },
                { header: 'Transaksi', key: 'transactions', width: 12, align: 'center' as const },
                { header: 'Tabung', key: 'tabung', width: 12, align: 'center' as const },
                { header: 'Pendapatan', key: 'revenue', width: 18, align: 'right' as const },
            ]

            const data = filteredData.map(item => ({
                code: item.code,
                name: item.name,
                region: item.region || '-',
                transactions: activeSubTab === 'subsidi' ? item.total_consumer_orders : item.total_nonsubsidi_orders,
                tabung: activeSubTab === 'subsidi' ? item.total_tabung_to_consumers : item.total_nonsubsidi_tabung,
                revenue: formatCurrencyExport(activeSubTab === 'subsidi' ? item.total_revenue : item.total_nonsubsidi_revenue),
            }))

            const summary = activeSubTab === 'subsidi'
                ? [
                    { label: 'Total Pangkalan', value: pangkalanData?.summary.total_pangkalan || 0 },
                    { label: 'Total Transaksi Subsidi', value: pangkalanData?.summary.total_orders_subsidi || 0 },
                    { label: 'Total Tabung Subsidi', value: pangkalanData?.summary.total_tabung_subsidi || 0 },
                    { label: 'Total Pendapatan Subsidi', value: formatCurrencyExport(pangkalanData?.summary.total_revenue_subsidi || 0) },
                ]
                : [
                    { label: 'Total Pangkalan', value: pangkalanData?.summary.total_pangkalan || 0 },
                    { label: 'Total Transaksi Non-Subsidi', value: pangkalanData?.summary.total_nonsubsidi_orders || 0 },
                    { label: 'Total Tabung Non-Subsidi', value: pangkalanData?.summary.total_nonsubsidi_tabung || 0 },
                    { label: 'Total Pendapatan Non-Subsidi', value: formatCurrencyExport(pangkalanData?.summary.total_nonsubsidi_revenue || 0) },
                ]

            // Footer rows dengan total
            const footerRows = activeSubTab === 'subsidi'
                ? [
                    createFooterRow('TOTAL', {
                        name: `${pangkalanData?.summary.total_pangkalan || 0} Pangkalan`,
                        region: '',
                        transactions: pangkalanData?.summary.total_orders_subsidi || 0,
                        tabung: pangkalanData?.summary.total_tabung_subsidi || 0,
                        revenue: formatCurrencyExport(pangkalanData?.summary.total_revenue_subsidi || 0),
                    }, 'code'),
                ]
                : [
                    createFooterRow('TOTAL', {
                        name: `${pangkalanData?.summary.total_pangkalan || 0} Pangkalan`,
                        region: '',
                        transactions: pangkalanData?.summary.total_nonsubsidi_orders || 0,
                        tabung: pangkalanData?.summary.total_nonsubsidi_tabung || 0,
                        revenue: formatCurrencyExport(pangkalanData?.summary.total_nonsubsidi_revenue || 0),
                    }, 'code'),
                ]

            console.log('[PangkalanExport] Starting PDF export...')
            console.log('[PangkalanExport] Data count:', data.length)

            await exportToPDF(data, columns, summary, { title, period, filename }, footerRows)

            console.log('[PangkalanExport] exportToPDF completed')
            toast.success('PDF berhasil diexport!')
        } catch (error) {
            console.error('[PangkalanExport] Export PDF error:', error)
            toast.error('Gagal export PDF')
        }
    }

    const handleExportExcel = () => {
        try {
            const subTabLabel = activeSubTab === 'subsidi' ? 'Subsidi (3kg)' : 'Non-Subsidi (5.5kg+)'
            const title = `Laporan Pangkalan - ${subTabLabel}`
            const period = getPeriodLabel()
            const filename = `laporan-pangkalan-${activeSubTab}-${new Date().toISOString().split('T')[0]}`

            const columns = [
                { header: 'Kode', key: 'code', width: 12 },
                { header: 'Pangkalan', key: 'name', width: 25 },
                { header: 'Wilayah', key: 'region', width: 25 },
                { header: 'Transaksi', key: 'transactions', width: 12 },
                { header: 'Tabung', key: 'tabung', width: 12 },
                { header: 'Pendapatan', key: 'revenue', width: 18 },
            ]

            const data = filteredData.map(item => ({
                code: item.code,
                name: item.name,
                region: item.region || '-',
                transactions: activeSubTab === 'subsidi' ? item.total_consumer_orders : item.total_nonsubsidi_orders,
                tabung: activeSubTab === 'subsidi' ? item.total_tabung_to_consumers : item.total_nonsubsidi_tabung,
                revenue: activeSubTab === 'subsidi' ? item.total_revenue : item.total_nonsubsidi_revenue,
            }))

            const summary = activeSubTab === 'subsidi'
                ? [
                    { label: 'Total Pangkalan', value: pangkalanData?.summary.total_pangkalan || 0 },
                    { label: 'Total Transaksi Subsidi', value: pangkalanData?.summary.total_orders_subsidi || 0 },
                    { label: 'Total Tabung Subsidi', value: pangkalanData?.summary.total_tabung_subsidi || 0 },
                    { label: 'Total Pendapatan Subsidi', value: pangkalanData?.summary.total_revenue_subsidi || 0 },
                ]
                : [
                    { label: 'Total Pangkalan', value: pangkalanData?.summary.total_pangkalan || 0 },
                    { label: 'Total Transaksi Non-Subsidi', value: pangkalanData?.summary.total_nonsubsidi_orders || 0 },
                    { label: 'Total Tabung Non-Subsidi', value: pangkalanData?.summary.total_nonsubsidi_tabung || 0 },
                    { label: 'Total Pendapatan Non-Subsidi', value: pangkalanData?.summary.total_nonsubsidi_revenue || 0 },
                ]

            // Footer rows dengan total untuk Excel
            const footerRows = activeSubTab === 'subsidi'
                ? [
                    createFooterRow('TOTAL', {
                        name: `${pangkalanData?.summary.total_pangkalan || 0} Pangkalan`,
                        region: '',
                        transactions: pangkalanData?.summary.total_orders_subsidi || 0,
                        tabung: pangkalanData?.summary.total_tabung_subsidi || 0,
                        revenue: pangkalanData?.summary.total_revenue_subsidi || 0,
                    }, 'code'),
                ]
                : [
                    createFooterRow('TOTAL', {
                        name: `${pangkalanData?.summary.total_pangkalan || 0} Pangkalan`,
                        region: '',
                        transactions: pangkalanData?.summary.total_nonsubsidi_orders || 0,
                        tabung: pangkalanData?.summary.total_nonsubsidi_tabung || 0,
                        revenue: pangkalanData?.summary.total_nonsubsidi_revenue || 0,
                    }, 'code'),
                ]

            exportToExcel(data, columns, summary, { title, period, filename }, footerRows)
            toast.success('Excel berhasil diexport!')
        } catch (error) {
            console.error('Export Excel error:', error)
            toast.error('Gagal export Excel')
        }
    }

    return (
        <div className="space-y-6">
            {/* ===== CORE SUMMARY CARDS (Always Visible) ===== */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-emerald-500" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Overview Pangkalan</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow">
                        <div className="p-5 relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Pangkalan</p>
                                    <p className="text-3xl font-bold text-primary mt-2">
                                        {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_pangkalan || 0} delay={100} />}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Pangkalan aktif</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30" style={{ boxShadow: '0 4px 12px -2px hsl(152 100% 30% / 0.3)' }}>
                                    <SafeIcon name="Store" className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-primary to-emerald-300" />
                        </div>
                    </Tilt3DCard>
                    <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow">
                        <div className="p-5 relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Transaksi</p>
                                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mt-2">
                                        {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_all_orders || 0} delay={200} />}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Semua tipe LPG</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30" style={{ boxShadow: '0 4px 12px -2px rgba(20,184,166,0.3)' }}>
                                    <SafeIcon name="ShoppingCart" className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" />
                        </div>
                    </Tilt3DCard>
                    <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow">
                        <div className="p-5 relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tabung</p>
                                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                                        {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_all_tabung || 0} delay={300} />}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Keseluruhan jenis tabung</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30" style={{ boxShadow: '0 4px 12px -2px rgba(16,185,129,0.3)' }}>
                                    <SafeIcon name="Boxes" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300" />
                        </div>
                    </Tilt3DCard>
                    <Tilt3DCard className="glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow">
                        <div className="p-5 relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Pendapatan</p>
                                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
                                        {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_all_revenue || 0} delay={400} isCurrency />}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Revenue keseluruhan</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30" style={{ boxShadow: '0 4px 12px -2px hsl(48 100% 50% / 0.3)' }}>
                                    <SafeIcon name="Wallet" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300" />
                        </div>
                    </Tilt3DCard>
                </div>
            </div>

            {/* ===== SUB-TAB SWITCHER ===== */}
            <div className="flex gap-2">
                <Button
                    variant={activeSubTab === 'subsidi' ? 'default' : 'outline'}
                    className={activeSubTab === 'subsidi'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg'
                        : 'hover:bg-green-50 dark:hover:bg-green-900/20'}
                    onClick={() => handleSubTabChange('subsidi')}
                >
                    <SafeIcon name="Shield" className="w-4 h-4 mr-2" />
                    LPG Subsidi (3kg)
                    <Badge variant="secondary" className="ml-2 bg-white/20 text-inherit">
                        {pangkalanData?.summary.total_tabung_subsidi || 0}
                    </Badge>
                </Button>
                <Button
                    variant={activeSubTab === 'nonsubsidi' ? 'default' : 'outline'}
                    className={activeSubTab === 'nonsubsidi'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg'
                        : 'hover:bg-amber-50 dark:hover:bg-amber-900/20'}
                    onClick={() => handleSubTabChange('nonsubsidi')}
                >
                    <SafeIcon name="Flame" className="w-4 h-4 mr-2" />
                    LPG Non-Subsidi
                    <Badge variant="secondary" className="ml-2 bg-white/20 text-inherit">
                        {pangkalanData?.summary.total_nonsubsidi_tabung || 0}
                    </Badge>
                </Button>
            </div>

            {/* ===== SUB-TAB SPECIFIC CARDS ===== */}
            {activeSubTab === 'subsidi' ? (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Distribusi Subsidi (3kg)</h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">Audit Focus</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-1">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transaksi Subsidi</p>
                                        <p className="text-3xl font-bold text-green-600 mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_orders_subsidi || 0} delay={100} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Transaksi 3kg</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30">
                                        <SafeIcon name="ShoppingBag" className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-green-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-2">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tabung Subsidi</p>
                                        <p className="text-3xl font-bold text-teal-600 mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_tabung_subsidi || 0} delay={200} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Tabung 3kg terdistribusi</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30">
                                        <SafeIcon name="Package" className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-3">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendapatan Subsidi</p>
                                        <p className="text-2xl font-bold text-lime-600 mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_revenue_subsidi || 0} delay={300} isCurrency />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Revenue 3kg</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-lime-100 to-lime-200 dark:from-lime-900/30 dark:to-lime-800/30">
                                        <SafeIcon name="CircleDollarSign" className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-300 via-lime-500 to-lime-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-4">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Konsumen Aktif</p>
                                        <p className="text-3xl font-bold text-purple-600 mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.active_consumers || 0} delay={400} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Pembeli subsidi</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                                        <SafeIcon name="Users" className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-300" />
                            </div>
                        </Tilt3DCard>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">LPG Non-Subsidi (5.5kg+)</h3>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">Business</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-1">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transaksi Non-Subsidi</p>
                                        <p className="text-3xl font-bold text-amber-600 mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_nonsubsidi_orders || 0} delay={100} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Tabung Non-Subsidi</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30">
                                        <SafeIcon name="ShoppingBag" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-2">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tabung Non-Subsidi</p>
                                        <p className="text-3xl font-bold text-orange-600 mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_nonsubsidi_tabung || 0} delay={200} />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Tabung terjual</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30">
                                        <SafeIcon name="Flame" className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-3">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendapatan Non-Subsidi</p>
                                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                                            {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_nonsubsidi_revenue || 0} delay={300} isCurrency />}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Revenue non-3kg</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30">
                                        <SafeIcon name="CircleDollarSign" className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300" />
                            </div>
                        </Tilt3DCard>
                        <Tilt3DCard className="glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-4">
                            <div className="p-5 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Pangkalan</p>
                                        <p className="text-lg font-bold text-primary mt-2 truncate max-w-[120px]">
                                            {isLoading ? '...' : (() => {
                                                const sorted = [...(pangkalanData?.data || [])].sort((a, b) => b.total_nonsubsidi_tabung - a.total_nonsubsidi_tabung);
                                                return sorted[0]?.name || '-';
                                            })()}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Penjualan terbanyak</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30">
                                        <SafeIcon name="Trophy" className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-primary to-emerald-300" />
                            </div>
                        </Tilt3DCard>
                    </div>
                </div>
            )}

            {/* ===== FILTER BAR ===== */}
            <Card className="glass-card">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <SafeIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari pangkalan..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setPangkalanCurrentPage(1); }}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Wilayah:</span>
                            <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setPangkalanCurrentPage(1); }}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Semua</SelectItem>
                                    {kabupatenList.map((r: string) => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Tampilkan:</span>
                            <Select value={pangkalanRowsPerPage.toString()} onValueChange={(v) => { setPangkalanRowsPerPage(Number(v)); setPangkalanCurrentPage(1); }}>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {rowsPerPageOptions.map(opt => (
                                        <SelectItem key={opt} value={opt.toString()}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Export Buttons */}
                        <div className="flex items-center gap-2 ml-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isLoading || !pangkalanData?.data?.length}
                                onClick={handleExportPDF}
                                className="border-red-300 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 hover:border-red-400 transition-all shadow-sm hover:shadow-md"
                            >
                                <SafeIcon name="FileText" className="h-4 w-4 mr-2" />
                                Export PDF
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isLoading || !pangkalanData?.data?.length}
                                onClick={handleExportExcel}
                                className="border-green-300 text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:border-green-400 transition-all shadow-sm hover:shadow-md"
                            >
                                <SafeIcon name="FileSpreadsheet" className="h-4 w-4 mr-2" />
                                Export Excel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ===== PANGKALAN TABLE ===== */}
            <Card className="chart-card-premium rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${activeSubTab === 'subsidi' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                <CardTitle className="text-lg font-semibold">
                                    {activeSubTab === 'subsidi' ? 'Ranking Pangkalan (Subsidi)' : 'Ranking Pangkalan (Non-Subsidi)'}
                                </CardTitle>
                            </div>
                            <CardDescription className="mt-1">
                                {activeSubTab === 'subsidi'
                                    ? 'Performa distribusi LPG 3kg bersubsidi per pangkalan'
                                    : 'Performa penjualan LPG non-subsidi per pangkalan'}
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className={activeSubTab === 'subsidi' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400'}>
                            <SafeIcon name="Trophy" className="h-3 w-3 mr-1" />
                            Top: {pangkalanData?.summary.top_pangkalan || '-'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/30">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none"
                                            onClick={() => handleSort('name')}
                                        >
                                            <span className="flex items-center gap-1">
                                                Pangkalan
                                                <SafeIcon name={getSortIcon('name')} className="h-3.5 w-3.5" />
                                            </span>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none"
                                            onClick={() => handleSort('region')}
                                        >
                                            <span className="flex items-center gap-1">
                                                Wilayah
                                                <SafeIcon name={getSortIcon('region')} className="h-3.5 w-3.5" />
                                            </span>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none"
                                            onClick={() => handleSort('transactions')}
                                        >
                                            <span className="flex items-center justify-center gap-1">
                                                Transaksi
                                                <SafeIcon name={getSortIcon('transactions')} className="h-3.5 w-3.5" />
                                            </span>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none"
                                            onClick={() => handleSort('tabung')}
                                        >
                                            <span className="flex items-center justify-center gap-1">
                                                Tabung
                                                <SafeIcon name={getSortIcon('tabung')} className="h-3.5 w-3.5" />
                                            </span>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none"
                                            onClick={() => handleSort('revenue')}
                                        >
                                            <span className="flex items-center justify-end gap-1">
                                                Pendapatan
                                                <SafeIcon name={getSortIcon('revenue')} className="h-3.5 w-3.5" />
                                            </span>
                                        </th>
                                        {activeSubTab === 'subsidi' && (
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Konsumen</th>
                                        )}
                                        {activeSubTab === 'subsidi' && (
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item, index) => {
                                        const globalIndex = (pangkalanCurrentPage - 1) * pangkalanRowsPerPage + index
                                        const orders = activeSubTab === 'subsidi' ? item.total_consumer_orders : item.total_nonsubsidi_orders
                                        const tabung = activeSubTab === 'subsidi' ? item.total_tabung_to_consumers : item.total_nonsubsidi_tabung
                                        const revenue = activeSubTab === 'subsidi' ? item.total_revenue : item.total_nonsubsidi_revenue

                                        return (
                                            <tr key={item.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${globalIndex === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        globalIndex === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                                                            globalIndex === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {globalIndex + 1}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-medium text-sm">{item.name}</p>
                                                        <p className="text-xs text-muted-foreground">{item.code}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">{item.region || '-'}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant="secondary" className={activeSubTab === 'subsidi' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}>
                                                        {orders}
                                                    </Badge>
                                                </td>
                                                <td className={`px-4 py-3 text-center font-semibold ${activeSubTab === 'subsidi' ? 'text-teal-600 dark:text-teal-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                    {tabung}
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">{formatCurrency(revenue)}</td>
                                                {activeSubTab === 'subsidi' && (
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-1 text-sm">
                                                            <span className="text-purple-600 dark:text-purple-400 font-medium">{item.active_consumers}</span>
                                                            <span className="text-muted-foreground">/</span>
                                                            <span className="text-muted-foreground">{item.total_registered_consumers}</span>
                                                        </div>
                                                    </td>
                                                )}
                                                {activeSubTab === 'subsidi' && (
                                                    <td className="px-4 py-3 text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handlePangkalanSelect(item.id)}
                                                            className={`h-8 px-3 ${selectedPangkalanId === item.id ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}`}
                                                        >
                                                            <SafeIcon name="Eye" className="h-4 w-4 mr-1" />
                                                            Audit
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <SafeIcon name="Store" className="h-12 w-12 mb-3 opacity-30" />
                            <p>Tidak ada data pangkalan</p>
                            {searchQuery && <p className="text-xs mt-1">Coba ubah filter pencarian</p>}
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredData.length > pangkalanRowsPerPage && (
                        <div className="flex items-center justify-between p-4 border-t border-border/50">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {((pangkalanCurrentPage - 1) * pangkalanRowsPerPage) + 1} - {Math.min(pangkalanCurrentPage * pangkalanRowsPerPage, filteredData.length)} dari {filteredData.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPangkalanCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={pangkalanCurrentPage <= 1}
                                    className="h-8 px-2"
                                >
                                    <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                                    Hal {pangkalanCurrentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPangkalanCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={pangkalanCurrentPage >= totalPages}
                                    className="h-8 px-2"
                                >
                                    <SafeIcon name="ChevronRight" className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ===== CONSUMER AUDIT SECTION (Subsidi Only) ===== */}
            {activeSubTab === 'subsidi' && (
                <Card className="chart-card-premium rounded-2xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                    <CardTitle className="text-lg font-semibold">Audit Konsumen Subsidi</CardTitle>
                                </div>
                                <CardDescription className="mt-1">
                                    Data pembeli gas subsidi 3kg untuk verifikasi
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Pilih Pangkalan:</span>
                                <Select value={selectedPangkalanId} onValueChange={handlePangkalanSelect}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Pilih pangkalan..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pangkalanData?.data.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {!selectedPangkalanId ? (
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <SafeIcon name="Search" className="h-12 w-12 mb-3 opacity-30" />
                                <p>Pilih pangkalan untuk melihat data konsumen</p>
                            </div>
                        ) : isLoadingConsumers ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : consumersData && consumersData.data.length > 0 ? (
                            <>
                                {/* Consumer Summary */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/20 border-b border-border/50">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{consumersData.summary.total_consumers}</p>
                                        <p className="text-xs text-muted-foreground">Total Konsumen</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{consumersData.summary.registered_consumers}</p>
                                        <p className="text-xs text-muted-foreground">Terdaftar</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-orange-600">{consumersData.summary.total_transactions}</p>
                                        <p className="text-xs text-muted-foreground">Transaksi</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-600">{consumersData.summary.total_tabung}</p>
                                        <p className="text-xs text-muted-foreground">Tabung</p>
                                    </div>
                                </div>

                                {/* Consumer Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border/50 bg-muted/30">
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">NIK</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">No. HP</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipe</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pembelian</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tabung</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Terakhir</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {consumersData.data.map((consumer) => (
                                                <tr key={consumer.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${consumer.consumer_type === 'WARUNG' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                }`}>
                                                                {consumer.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-medium text-sm">{consumer.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{consumer.nik || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-muted-foreground">{consumer.phone || '-'}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant="outline" className={
                                                            consumer.consumer_type === 'WARUNG' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                consumer.consumer_type === 'RUMAH_TANGGA' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                    'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                                        }>
                                                            {consumer.consumer_type === 'WARUNG' ? 'Warung' :
                                                                consumer.consumer_type === 'RUMAH_TANGGA' ? 'RT' : 'Walk-in'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            {consumer.total_purchases}x
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-semibold text-teal-600 dark:text-teal-400">{consumer.total_tabung}</td>
                                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                                        {formatDate(consumer.last_purchase)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <SafeIcon name="Users" className="h-12 w-12 mb-3 opacity-30" />
                                <p>Tidak ada data konsumen subsidi</p>
                                <p className="text-xs mt-1">di pangkalan ini dalam periode yang dipilih</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
