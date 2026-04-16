'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// Pie chart colors
const PIE_COLORS = ['#10b981', '#14b8a6', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1']

interface PangkalanTabContentProps {
    dateRange: { start: string; end: string }
    isLoading: boolean
    onSummaryLoad?: (totalPangkalan: number) => void
    exportRef?: React.MutableRefObject<{
        exportAllPDF: () => Promise<void>
        exportAllExcel: () => void
    } | null>
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

export default function PangkalanTabContent({ dateRange, isLoading: initialLoading, onSummaryLoad, exportRef }: PangkalanTabContentProps) {
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
    const [isRefreshing, setIsRefreshing] = useState(false)

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

    // Fetch pangkalan data function (reusable for refresh)
    const fetchPangkalanData = async (showRefreshState = false) => {
        if (showRefreshState) setIsRefreshing(true)
        else setIsLoading(true)
        try {
            const data = await reportsApi.getPangkalanReport(dateRange.start, dateRange.end)
            setPangkalanData(data)
            setSelectedPangkalanId('')
            setConsumersData(null)
            // Notify parent of total pangkalan
            if (onSummaryLoad && data?.summary?.total_pangkalan) {
                onSummaryLoad(data.summary.total_pangkalan)
            }
            if (showRefreshState) toast.success('Data berhasil diperbarui')
        } catch (error: any) {
            toast.error(error.message || 'Gagal memuat data pangkalan')
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    // Initial fetch
    useEffect(() => {
        fetchPangkalanData()
    }, [dateRange.start, dateRange.end])

    // Refresh handler
    const handleRefresh = () => {
        fetchPangkalanData(true)
    }

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

    // Helper function to extract kecamatan from full region string
    const extractKecamatan = (region: string): string => {
        // Format: "Kec. X, Kab. Y" or "Kecamatan X, Kabupaten Y"
        const kecMatch = region.match(/Kec(?:amatan)?\\.?\\s*([^\\,]+)/i);
        if (kecMatch) return `Kec. ${kecMatch[1].trim()}`;

        // If no kecamatan found, try to return first part before comma
        const parts = region.split(',');
        if (parts.length > 0) return parts[0].trim();

        // If no pattern matches, return original
        return region;
    }

    // Get unique kecamatan for filter (extracted from region)
    const kecamatanList = useMemo(() => {
        if (!pangkalanData?.data) return []
        const kecamatanSet = new Set<string>()
        pangkalanData.data.forEach(p => {
            if (p.region && p.region !== '-') {
                kecamatanSet.add(extractKecamatan(p.region))
            }
        })
        return Array.from(kecamatanSet).sort()
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

        // Apply kecamatan filter
        if (regionFilter !== 'ALL') {
            filtered = filtered.filter(p => extractKecamatan(p.region) === regionFilter)
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
            const subTabLabel = activeSubTab === 'subsidi' ? 'Subsidi (3kg)' : 'Non-Subsidi'
            const title = `Laporan Pangkalan - ${subTabLabel}`
            const period = getPeriodLabel()
            const filename = `laporan-pangkalan-${activeSubTab}-${new Date().toISOString().split('T')[0]}`

            const columns = [
                { header: 'No.', key: 'no', width: 6, align: 'center' as const },
                { header: 'Kode', key: 'code', width: 12 },
                { header: 'Pangkalan', key: 'name', width: 22 },
                { header: 'Wilayah', key: 'region', width: 22 },
                { header: 'Transaksi', key: 'transactions', width: 10, align: 'center' as const },
                { header: 'Tabung', key: 'tabung', width: 10, align: 'center' as const },
                { header: 'Pendapatan', key: 'revenue', width: 18, align: 'right' as const },
            ]

            const data = filteredData.map((item, index) => ({
                no: index + 1,
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
            const subTabLabel = activeSubTab === 'subsidi' ? 'Subsidi (3kg)' : 'Non-Subsidi'
            const title = `Laporan Pangkalan - ${subTabLabel}`
            const period = getPeriodLabel()
            const filename = `laporan-pangkalan-${activeSubTab}-${new Date().toISOString().split('T')[0]}`

            const columns = [
                { header: 'No.', key: 'no', width: 6 },
                { header: 'Kode', key: 'code', width: 12 },
                { header: 'Pangkalan', key: 'name', width: 22 },
                { header: 'Wilayah', key: 'region', width: 22 },
                { header: 'Transaksi', key: 'transactions', width: 10 },
                { header: 'Tabung', key: 'tabung', width: 10 },
                { header: 'Pendapatan', key: 'revenue', width: 18 },
            ]

            const data = filteredData.map((item, index) => ({
                no: index + 1,
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

    // Export ALL data (tanpa filter)
    const handleExportAllPDF = async () => {
        if (!pangkalanData?.data?.length) return
        try {
            const title = `Laporan Pangkalan - Semua Data`
            const period = getPeriodLabel()
            const filename = `laporan-pangkalan-all-${new Date().toISOString().split('T')[0]}`

            const columns = [
                { header: 'No.', key: 'no', width: 6, align: 'center' as const },
                { header: 'Kode', key: 'code', width: 10 },
                { header: 'Pangkalan', key: 'name', width: 20 },
                { header: 'Wilayah', key: 'region', width: 20 },
                { header: 'Subsidi', key: 'tabung_subsidi', width: 10, align: 'center' as const },
                { header: 'Non-Subsidi', key: 'tabung_nonsubsidi', width: 10, align: 'center' as const },
                { header: 'Total', key: 'tabung_total', width: 8, align: 'center' as const },
                { header: 'Pendapatan', key: 'revenue', width: 16, align: 'right' as const },
            ]

            const data = pangkalanData.data.map((item, index) => ({
                no: index + 1,
                code: item.code,
                name: item.name,
                region: item.region || '-',
                tabung_subsidi: item.total_tabung_to_consumers,
                tabung_nonsubsidi: item.total_nonsubsidi_tabung,
                tabung_total: item.total_all_tabung,
                revenue: formatCurrencyExport(item.total_all_revenue),
            }))

            const summary = [
                { label: 'Total Pangkalan', value: pangkalanData.summary.total_pangkalan },
                { label: 'Total Tabung Subsidi', value: pangkalanData.summary.total_tabung_subsidi },
                { label: 'Total Tabung Non-Subsidi', value: pangkalanData.summary.total_nonsubsidi_tabung },
                { label: 'Total Pendapatan', value: formatCurrencyExport(pangkalanData.summary.total_all_revenue) },
            ]

            const footerRows = [
                createFooterRow('TOTAL', {
                    name: `${pangkalanData.summary.total_pangkalan} Pangkalan`,
                    region: '',
                    tabung_subsidi: pangkalanData.summary.total_tabung_subsidi,
                    tabung_nonsubsidi: pangkalanData.summary.total_nonsubsidi_tabung,
                    tabung_total: pangkalanData.summary.total_all_tabung,
                    revenue: formatCurrencyExport(pangkalanData.summary.total_all_revenue),
                }, 'code'),
            ]

            await exportToPDF(data, columns, summary, { title, period, filename }, footerRows)
            toast.success('PDF semua data berhasil diexport!')
        } catch (error) {
            console.error('Export All PDF error:', error)
            toast.error('Gagal export PDF')
        }
    }

    const handleExportAllExcel = () => {
        if (!pangkalanData?.data?.length) return
        try {
            const title = `Laporan Pangkalan - Semua Data`
            const period = getPeriodLabel()
            const filename = `laporan-pangkalan-all-${new Date().toISOString().split('T')[0]}`

            const columns = [
                { header: 'No.', key: 'no', width: 6 },
                { header: 'Kode', key: 'code', width: 10 },
                { header: 'Pangkalan', key: 'name', width: 22 },
                { header: 'Wilayah', key: 'region', width: 22 },
                { header: 'Tabung Subsidi', key: 'tabung_subsidi', width: 12 },
                { header: 'Tabung Non-Subsidi', key: 'tabung_nonsubsidi', width: 15 },
                { header: 'Total Tabung', key: 'tabung_total', width: 10 },
                { header: 'Pendapatan', key: 'revenue', width: 15 },
            ]

            const data = pangkalanData.data.map((item, index) => ({
                no: index + 1,
                code: item.code,
                name: item.name,
                region: item.region || '-',
                tabung_subsidi: item.total_tabung_to_consumers,
                tabung_nonsubsidi: item.total_nonsubsidi_tabung,
                tabung_total: item.total_all_tabung,
                revenue: item.total_all_revenue,
            }))

            const summary = [
                { label: 'Total Pangkalan', value: pangkalanData.summary.total_pangkalan },
                { label: 'Total Tabung Subsidi', value: pangkalanData.summary.total_tabung_subsidi },
                { label: 'Total Tabung Non-Subsidi', value: pangkalanData.summary.total_nonsubsidi_tabung },
                { label: 'Total Pendapatan', value: pangkalanData.summary.total_all_revenue },
            ]

            const footerRows = [
                createFooterRow('TOTAL', {
                    name: `${pangkalanData.summary.total_pangkalan} Pangkalan`,
                    region: '',
                    tabung_subsidi: pangkalanData.summary.total_tabung_subsidi,
                    tabung_nonsubsidi: pangkalanData.summary.total_nonsubsidi_tabung,
                    tabung_total: pangkalanData.summary.total_all_tabung,
                    revenue: pangkalanData.summary.total_all_revenue,
                }, 'code'),
            ]

            exportToExcel(data, columns, summary, { title, period, filename }, footerRows)
            toast.success('Excel semua data berhasil diexport!')
        } catch (error) {
            console.error('Export All Excel error:', error)
            toast.error('Gagal export Excel')
        }
    }

    // Export Consumer Audit PDF
    const handleExportConsumerPDF = async () => {
        if (!consumersData?.data?.length) return
        try {
            const pangkalanName = consumersData.summary.pangkalan_name
            const title = `Audit Konsumen Subsidi - ${pangkalanName}`
            const period = getPeriodLabel()
            const filename = `audit-konsumen-${consumersData.summary.pangkalan_code}-${new Date().toISOString().split('T')[0]}`

            const columns = [
                { header: 'No.', key: 'no', width: 6, align: 'center' as const },
                { header: 'Nama', key: 'name', width: 22 },
                { header: 'NIK', key: 'nik', width: 18 },
                { header: 'No. HP', key: 'phone', width: 14 },
                { header: 'Tipe', key: 'type', width: 10 },
                { header: 'Pembelian', key: 'purchases', width: 10, align: 'center' as const },
                { header: 'Tabung', key: 'tabung', width: 8, align: 'center' as const },
                { header: 'Terakhir', key: 'last_purchase', width: 12 },
            ]

            const data = consumersData.data.map((c, index) => ({
                no: index + 1,
                name: c.name,
                nik: c.nik || '-',
                phone: c.phone || '-',
                type: c.consumer_type === 'WARUNG' ? 'Warung' : c.consumer_type === 'RUMAH_TANGGA' ? 'RT' : 'Walk-in',
                purchases: c.total_purchases,
                tabung: c.total_tabung,
                last_purchase: formatDateExport(c.last_purchase),
            }))

            const summary = [
                { label: 'Pangkalan', value: pangkalanName },
                { label: 'Total Konsumen', value: consumersData.summary.total_consumers },
                { label: 'Terdaftar', value: consumersData.summary.registered_consumers },
                { label: 'Total Transaksi', value: consumersData.summary.total_transactions },
                { label: 'Total Tabung', value: consumersData.summary.total_tabung },
            ]

            const footerRows = [
                createFooterRow('TOTAL', {
                    nik: '',
                    phone: '',
                    type: '',
                    purchases: consumersData.summary.total_transactions,
                    tabung: consumersData.summary.total_tabung,
                    last_purchase: '',
                }, 'name'),
            ]

            await exportToPDF(data, columns, summary, { title, period, filename }, footerRows)
            toast.success('PDF Audit Konsumen berhasil diexport!')
        } catch (error) {
            console.error('Export Consumer PDF error:', error)
            toast.error('Gagal export PDF')
        }
    }

    // Export Consumer Audit Excel
    const handleExportConsumerExcel = () => {
        if (!consumersData?.data?.length) return
        try {
            const pangkalanName = consumersData.summary.pangkalan_name
            const title = `Audit Konsumen Subsidi - ${pangkalanName}`
            const period = getPeriodLabel()
            const filename = `audit-konsumen-${consumersData.summary.pangkalan_code}-${new Date().toISOString().split('T')[0]}`

            const columns = [
                { header: 'No.', key: 'no', width: 6 },
                { header: 'Nama', key: 'name', width: 22 },
                { header: 'NIK', key: 'nik', width: 18 },
                { header: 'No. HP', key: 'phone', width: 14 },
                { header: 'Tipe', key: 'type', width: 10 },
                { header: 'Pembelian', key: 'purchases', width: 10 },
                { header: 'Tabung', key: 'tabung', width: 8 },
                { header: 'Terakhir', key: 'last_purchase', width: 12 },
            ]

            const data = consumersData.data.map((c, index) => ({
                no: index + 1,
                name: c.name,
                nik: c.nik || '-',
                phone: c.phone || '-',
                type: c.consumer_type === 'WARUNG' ? 'Warung' : c.consumer_type === 'RUMAH_TANGGA' ? 'RT' : 'Walk-in',
                purchases: c.total_purchases,
                tabung: c.total_tabung,
                last_purchase: formatDateExport(c.last_purchase),
            }))

            const summary = [
                { label: 'Pangkalan', value: pangkalanName },
                { label: 'Total Konsumen', value: consumersData.summary.total_consumers },
                { label: 'Terdaftar', value: consumersData.summary.registered_consumers },
                { label: 'Total Transaksi', value: consumersData.summary.total_transactions },
                { label: 'Total Tabung', value: consumersData.summary.total_tabung },
            ]

            const footerRows = [
                createFooterRow('TOTAL', {
                    nik: '',
                    phone: '',
                    type: '',
                    purchases: consumersData.summary.total_transactions,
                    tabung: consumersData.summary.total_tabung,
                    last_purchase: '',
                }, 'name'),
            ]

            exportToExcel(data, columns, summary, { title, period, filename }, footerRows)
            toast.success('Excel Audit Konsumen berhasil diexport!')
        } catch (error) {
            console.error('Export Consumer Excel error:', error)
            toast.error('Gagal export Excel')
        }
    }

    // Expose export functions to parent via ref
    useEffect(() => {
        if (exportRef) {
            exportRef.current = {
                exportAllPDF: handleExportAllPDF,
                exportAllExcel: handleExportAllExcel,
            }
        }
    }, [pangkalanData])

    // Compute kecamatan distribution for pie chart
    const wilayahDistribution = useMemo(() => {
        if (!pangkalanData?.data) return []
        const distribution: Record<string, { name: string; tabung: number; revenue: number }> = {}
        pangkalanData.data.forEach(p => {
            const kecamatan = extractKecamatan(p.region) || 'Lainnya'
            if (!distribution[kecamatan]) {
                distribution[kecamatan] = { name: kecamatan, tabung: 0, revenue: 0 }
            }
            distribution[kecamatan].tabung += activeSubTab === 'subsidi' ? p.total_tabung_to_consumers : p.total_nonsubsidi_tabung
            distribution[kecamatan].revenue += activeSubTab === 'subsidi' ? p.total_revenue : p.total_nonsubsidi_revenue
        })
        return Object.values(distribution).sort((a, b) => b.tabung - a.tabung)
    }, [pangkalanData, activeSubTab])

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* ===== CORE SUMMARY CARDS ===== */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
                <Tilt3DCard className="glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow">
                    <div className="p-3 sm:p-5 relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Pangkalan</p>
                                <p className="text-xl sm:text-3xl font-bold text-primary mt-1 sm:mt-2">
                                    {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_pangkalan || 0} delay={100} />}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Pangkalan aktif</p>
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30" style={{ boxShadow: '0 4px 12px -2px hsl(152 100% 30% / 0.3)' }}>
                                <SafeIcon name="Store" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-emerald-300 via-primary to-emerald-300" />
                    </div>
                </Tilt3DCard>
                <Tilt3DCard className="glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow">
                    <div className="p-3 sm:p-5 relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Transaksi</p>
                                <p className="text-xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400 mt-1 sm:mt-2">
                                    {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_all_orders || 0} delay={200} />}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Semua tipe LPG</p>
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30" style={{ boxShadow: '0 4px 12px -2px rgba(20,184,166,0.3)' }}>
                                <SafeIcon name="ShoppingCart" className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 dark:text-teal-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" />
                    </div>
                </Tilt3DCard>
                <Tilt3DCard className="glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow">
                    <div className="p-3 sm:p-5 relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tabung</p>
                                <p className="text-xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2">
                                    {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_all_tabung || 0} delay={300} />}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">Keseluruhan jenis tabung</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 sm:hidden">Semua jenis</p>
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30" style={{ boxShadow: '0 4px 12px -2px rgba(16,185,129,0.3)' }}>
                                <SafeIcon name="Boxes" className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300" />
                    </div>
                </Tilt3DCard>
                <Tilt3DCard className="glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow">
                    <div className="p-3 sm:p-5 relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Pendapatan</p>
                                <p className="text-lg sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 sm:mt-2">
                                    {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_all_revenue || 0} delay={400} isCurrency />}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">Revenue keseluruhan</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 sm:hidden">Revenue total</p>
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30" style={{ boxShadow: '0 4px 12px -2px hsl(48 100% 50% / 0.3)' }}>
                                <SafeIcon name="Wallet" className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300" />
                    </div>
                </Tilt3DCard>
            </div>

            {/* ===== SUB-TAB SWITCHER ===== */}
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-2 min-w-max">
                    <Button
                        variant={activeSubTab === 'subsidi' ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 sm:h-10 text-xs sm:text-sm ${activeSubTab === 'subsidi'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg'
                            : 'hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                        onClick={() => handleSubTabChange('subsidi')}
                    >
                        <SafeIcon name="Shield" className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">LPG Subsidi (3kg)</span>
                        <span className="sm:hidden">Subsidi 3kg</span>
                        <Badge variant="secondary" className="ml-1.5 sm:ml-2 bg-white/20 text-inherit text-[10px] sm:text-xs">
                            {pangkalanData?.summary.total_tabung_subsidi || 0}
                        </Badge>
                    </Button>
                    <Button
                        variant={activeSubTab === 'nonsubsidi' ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 sm:h-10 text-xs sm:text-sm ${activeSubTab === 'nonsubsidi'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg'
                            : 'hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                        onClick={() => handleSubTabChange('nonsubsidi')}
                    >
                        <SafeIcon name="Flame" className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">LPG Non-Subsidi</span>
                        <span className="sm:hidden">Non-Subsidi</span>
                        <Badge variant="secondary" className="ml-1.5 sm:ml-2 bg-white/20 text-inherit text-[10px] sm:text-xs">
                            {pangkalanData?.summary.total_nonsubsidi_tabung || 0}
                        </Badge>
                    </Button>
                </div>
            </div>

            {/* ===== PERIOD BADGE ===== */}
            <div className="flex items-center flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700 text-xs">
                    <SafeIcon name="Calendar" className="h-3 w-3 mr-1" />
                    Periode: {getPeriodLabel()}
                </Badge>
            </div>

            {/* ===== BREAKDOWN TABUNG BY TYPE ===== */}
            {isLoading ? (
                <div className="glass-card rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="rounded-lg p-2 sm:p-3 text-center bg-muted/30">
                                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-1 rounded-lg" />
                                <Skeleton className="h-6 w-12 mx-auto mb-1" />
                                <Skeleton className="h-3 w-8 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : pangkalanData?.summary.tabung_by_type && (
                <div className="glass-card rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <SafeIcon name="Package" className="h-4 w-4 text-primary" />
                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Breakdown Tabung per Jenis</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {[
                            { label: '3kg', value: pangkalanData.summary.tabung_by_type.kg3, color: 'bg-green-100 dark:bg-green-900/30', image: '/images/products/lpg-3kg.png' },
                            { label: '5.5kg', value: pangkalanData.summary.tabung_by_type.kg5, color: 'bg-blue-100 dark:bg-blue-900/30', image: '/images/products/lpg-5kg.png' },
                            { label: '12kg', value: pangkalanData.summary.tabung_by_type.kg12, color: 'bg-amber-100 dark:bg-amber-900/30', image: '/images/products/lpg-12kg.png' },
                            { label: '50kg', value: pangkalanData.summary.tabung_by_type.kg50, color: 'bg-orange-100 dark:bg-orange-900/30', image: '/images/products/lpg-50kg.png' },
                            { label: '220gr', value: pangkalanData.summary.tabung_by_type.gr220, color: 'bg-purple-100 dark:bg-purple-900/30', image: '/images/products/bright-gas-220gr.png' },
                        ].map((item, index) => (
                            <div key={item.label} className={`rounded-lg p-2 sm:p-3 text-center ${item.color}`}>
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-1 object-contain"
                                />
                                <p className="text-lg sm:text-xl font-bold text-foreground">
                                    <AnimatedNumber value={item.value} delay={index * 100} />
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== PIE CHART + DISTRIBUTION CARDS LAYOUT (DESKTOP: SIDE-BY-SIDE) ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* LEFT: PIE CHART */}
                {isLoading ? (
                    <Card className="glass-card rounded-2xl overflow-hidden">
                        <CardHeader className="pb-2 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-2 h-2 rounded-full" />
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="ml-auto h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-56 mt-1" />
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4">
                            <div className="h-[220px] sm:h-[280px] flex items-center justify-center">
                                <div className="relative">
                                    {/* Circular skeleton for pie chart */}
                                    <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-full" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-full" />
                                    </div>
                                </div>
                            </div>
                            {/* Legend skeleton */}
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <Skeleton className="w-3 h-3 rounded" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : wilayahDistribution.length > 0 && (
                    <Card className="glass-card rounded-2xl overflow-hidden">
                        <CardHeader className="pb-2 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <CardTitle className="text-base sm:text-lg font-semibold">Distribusi per Kecamatan</CardTitle>
                                <Badge variant="outline" className="ml-auto text-[10px] sm:text-xs">
                                    {activeSubTab === 'subsidi' ? 'Subsidi' : 'Non-Subsidi'}
                                </Badge>
                            </div>
                            <CardDescription className="text-xs sm:text-sm">
                                Distribusi tabung berdasarkan kecamatan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4">
                            <div className="h-[220px] sm:h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={wilayahDistribution}
                                            dataKey="tabung"
                                            nameKey="name"
                                            cx="50%"
                                            cy="45%"
                                            outerRadius={60}
                                            label={({ name, percent }) => `${name.replace('Kec. ', '').replace('Kab. ', '').replace('Kota ', '').slice(0, 8)}${name.length > 8 ? '..' : ''} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={true}
                                            fontSize={10}
                                        >
                                            {wilayahDistribution.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number, name: string) => [value.toLocaleString('id-ID') + ' Tabung', name]}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={(value) => <span className="text-[10px] sm:text-xs">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* RIGHT: DISTRIBUTION CARDS */}
                {isLoading ? (
                    <Card className="glass-card rounded-2xl overflow-hidden h-full">
                        <CardHeader className="pb-2 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-2 h-2 rounded-full" />
                                <Skeleton className="h-5 w-36" />
                                <Skeleton className="ml-auto h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-48 mt-1" />
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4">
                            <div className="grid gap-3 sm:gap-4 grid-cols-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <Skeleton className="h-3 w-16 mb-2" />
                                                <Skeleton className="h-7 w-20 mb-1" />
                                                <Skeleton className="h-3 w-12" />
                                            </div>
                                            <Skeleton className="h-10 w-10 rounded-lg" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/30" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : activeSubTab === 'subsidi' ? (
                    <Card className="glass-card rounded-2xl overflow-hidden h-full">
                        <CardHeader className="pb-2 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <CardTitle className="text-base sm:text-lg font-semibold">Distribusi Subsidi (3kg)</CardTitle>
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200 text-[10px] sm:text-xs dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">Audit Focus</Badge>
                            </div>
                            <CardDescription className="text-xs sm:text-sm">
                                Ringkasan penyaluran LPG subsidi 3kg
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4">
                            <div className="grid gap-3 sm:gap-4 grid-cols-2">
                                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transaksi</p>
                                            <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                                                {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_orders_subsidi || 0} delay={100} />}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Transaksi 3kg</p>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30">
                                            <SafeIcon name="ShoppingBag" className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-300 via-green-500 to-green-300" />
                                </div>
                                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tabung</p>
                                            <p className="text-xl sm:text-2xl font-bold text-teal-600 mt-1">
                                                {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_tabung_subsidi || 0} delay={200} />}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Terdistribusi</p>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30">
                                            <SafeIcon name="Package" className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 dark:text-teal-400" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" />
                                </div>
                                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendapatan</p>
                                            <p className="text-lg sm:text-xl font-bold text-lime-600 mt-1">
                                                {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_revenue_subsidi || 0} delay={300} isCurrency />}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Revenue 3kg</p>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-lime-100 to-lime-200 dark:from-lime-900/30 dark:to-lime-800/30">
                                            <SafeIcon name="CircleDollarSign" className="h-4 w-4 sm:h-5 sm:w-5 text-lime-600 dark:text-lime-400" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-lime-300 via-lime-500 to-lime-300" />
                                </div>
                                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Konsumen</p>
                                            <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                                                {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.active_consumers || 0} delay={400} />}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Pembeli subsidi</p>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                                            <SafeIcon name="Users" className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="glass-card rounded-2xl overflow-hidden h-full">
                        <CardHeader className="pb-2 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <CardTitle className="text-base sm:text-lg font-semibold">LPG Non-Subsidi</CardTitle>
                                <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200 text-[10px] sm:text-xs dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">Business</Badge>
                            </div>
                            <CardDescription className="text-xs sm:text-sm">
                                Ringkasan penjualan LPG non-subsidi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4">
                            <div className="grid gap-3 sm:gap-4 grid-cols-2">
                                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transaksi</p>
                                            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                                                {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_nonsubsidi_orders || 0} delay={100} />}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Non-Subsidi</p>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30">
                                            <SafeIcon name="ShoppingBag" className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
                                </div>
                                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tabung</p>
                                            <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">
                                                {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_nonsubsidi_tabung || 0} delay={200} />}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Terjual</p>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30">
                                            <SafeIcon name="Flame" className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300" />
                                </div>
                                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendapatan</p>
                                            <p className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                                {isLoading ? '...' : <AnimatedNumber value={pangkalanData?.summary.total_nonsubsidi_revenue || 0} delay={300} isCurrency />}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Revenue</p>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30">
                                            <SafeIcon name="CircleDollarSign" className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300" />
                                </div>
                                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Pangkalan</p>
                                            <p className="text-lg sm:text-xl font-bold text-red-600 mt-1 truncate max-w-[100px]">
                                                {isLoading ? '...' : (filteredData[0]?.name?.split(' ').slice(0, 2).join(' ') || '-')}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Terbanyak</p>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30">
                                            <SafeIcon name="Award" className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-300 via-red-500 to-red-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ===== FILTER BAR ===== */}
            <Card className="glass-card">
                <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                        <div className="flex-1 min-w-[120px] sm:min-w-[200px]">
                            <div className="relative">
                                <SafeIcon name="Search" className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari pangkalan..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setPangkalanCurrentPage(1); }}
                                    className="pl-8 sm:pl-9 h-8 sm:h-10 text-xs sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">Kecamatan:</span>
                            <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setPangkalanCurrentPage(1); }}>
                                <SelectTrigger className="w-[100px] sm:w-[140px] h-8 sm:h-10 text-xs sm:text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Semua</SelectItem>
                                    {kecamatanList.map((r: string) => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
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
                        {/* Export Filtered Data - untuk export data sesuai tab aktif */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading || !filteredData?.length}
                                    className="h-8 text-xs gap-1 border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
                                >
                                    <SafeIcon name="Download" className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Export</span>
                                    <SafeIcon name="ChevronDown" className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                                    <SafeIcon name="FileText" className="h-4 w-4 mr-2 text-red-500" />
                                    {activeSubTab === 'subsidi' ? 'Subsidi PDF' : 'Non-Subsidi PDF'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                                    <SafeIcon name="FileSpreadsheet" className="h-4 w-4 mr-2 text-green-500" />
                                    {activeSubTab === 'subsidi' ? 'Subsidi Excel' : 'Non-Subsidi Excel'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-muted-foreground">Pilih Pangkalan:</span>
                                <Select value={selectedPangkalanId} onValueChange={handlePangkalanSelect}>
                                    <SelectTrigger className="w-[180px] sm:w-[200px]">
                                        <SelectValue placeholder="Pilih pangkalan..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pangkalanData?.data.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* Export Consumer Buttons */}
                                {consumersData?.data?.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleExportConsumerPDF}
                                            disabled={isLoadingConsumers}
                                            className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                        >
                                            <SafeIcon name="FileText" className="h-3.5 w-3.5 mr-1" />
                                            PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleExportConsumerExcel}
                                            disabled={isLoadingConsumers}
                                            className="h-8 text-xs border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                                        >
                                            <SafeIcon name="FileSpreadsheet" className="h-3.5 w-3.5 mr-1" />
                                            Excel
                                        </Button>
                                    </div>
                                )}
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
