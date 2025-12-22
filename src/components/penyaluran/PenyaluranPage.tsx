import { useState, useEffect, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SafeIcon from '@/components/common/SafeIcon'
import { penyaluranApi, lpgProductsApi, pangkalanApi, type PenyaluranRekapitulasiResponse, type LpgProduct, type Pangkalan } from '@/lib/api'
import { toast } from 'sonner'
import AnimatedNumber from '@/components/common/AnimatedNumber'
import { exportPertaminaPDF, exportPertaminaExcel, getAgenProfileFromAPI, type RekapRow } from '@/lib/pertamina-export'
import PageHeader from '@/components/common/PageHeader'

export default function PenyaluranPage() {
    // Read initial tab from URL hash or default to 'rekapitulasi'
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '')
            if (['form', 'rekapitulasi'].includes(hash)) {
                return hash as 'form' | 'rekapitulasi'
            }
        }
        return 'rekapitulasi'
    }

    const [activeTab, setActiveTab] = useState<'form' | 'rekapitulasi'>(getInitialTab)

    // Update URL hash when tab changes
    const handleTabChange = (value: string) => {
        setActiveTab(value as 'form' | 'rekapitulasi')
        if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `#${value}`)
        }
    }
    // Main category: SUBSIDI or NON_SUBSIDI
    const [selectedCategory, setSelectedCategory] = useState<'SUBSIDI' | 'NON_SUBSIDI'>('SUBSIDI')
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [tipePembayaran, setTipePembayaran] = useState<string>('ALL')
    const [kondisi, setKondisi] = useState<string>('ALL')
    const [selectedLpgType, setSelectedLpgType] = useState<string>('kg3')
    const [rekapData, setRekapData] = useState<PenyaluranRekapitulasiResponse | null>(null)
    const [lpgProducts, setLpgProducts] = useState<LpgProduct[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Fakultatif Modal State
    const [showFakultatifModal, setShowFakultatifModal] = useState(false)
    const [pangkalanList, setPangkalanList] = useState<Pangkalan[]>([])
    const [isSavingFakultatif, setIsSavingFakultatif] = useState(false)
    const [fakultatifForm, setFakultatifForm] = useState({
        pangkalan_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        jumlah: '',
        catatan: ''
    })

    // Fetch LPG products dynamically
    const fetchLpgProducts = async () => {
        try {
            const products = await lpgProductsApi.getAll()
            // Filter only active products
            setLpgProducts(products.filter(p => p.is_active))
        } catch (error) {
            console.error('Error fetching LPG products:', error)
            // Fallback to default options if API fails
            setLpgProducts([])
        }
    }

    // Check if current selection is Subsidi (for conditional rendering)
    const isSubsidi = selectedCategory === 'SUBSIDI'

    // LPG Type options - filtered by selected category
    const lpgTypeOptions = useMemo(() => {
        // Helper function to convert size_kg to Prisma lpg_type ENUM NAME
        // Prisma client uses enum names (gr220, kg3, kg5, kg12, kg50), NOT @map values
        const sizeToLpgType = (size: number): string => {
            if (size <= 0.3) return 'gr220'        // 220gr Bright Gas Can
            if (Math.abs(size - 3) < 0.1) return 'kg3'
            if (Math.abs(size - 5.5) < 0.1 || Math.abs(size - 5) < 0.1) return 'kg5'
            if (Math.abs(size - 12) < 0.1) return 'kg12'
            if (Math.abs(size - 50) < 0.1) return 'kg50'
            return `kg${Math.floor(size)}` // Fallback
        }

        if (lpgProducts.length > 0) {
            // Filter by selected category
            const filteredProducts = lpgProducts.filter(p =>
                selectedCategory === 'SUBSIDI' ? p.category === 'SUBSIDI' : p.category !== 'SUBSIDI'
            )
            return filteredProducts.map(p => {
                const lpgType = sizeToLpgType(Number(p.size_kg))
                return {
                    value: lpgType,
                    label: p.name,
                    description: p.category === 'SUBSIDI' ? 'Subsidi' : 'Non-Subsidi'
                }
            })
        }
        // Fallback if no products from API
        return selectedCategory === 'SUBSIDI'
            ? [{ value: 'kg3', label: 'LPG 3 KG', description: 'Subsidi' }]
            : []
    }, [lpgProducts, selectedCategory])

    // Set default selected LPG type when options or category change
    useEffect(() => {
        if (lpgTypeOptions.length > 0 && !lpgTypeOptions.find(o => o.value === selectedLpgType)) {
            setSelectedLpgType(lpgTypeOptions[0].value)
        }
    }, [lpgTypeOptions])

    const fetchRekapitulasi = async () => {
        setIsLoading(true)
        try {
            const data = await penyaluranApi.getRekapitulasi(selectedMonth, tipePembayaran !== 'ALL' ? tipePembayaran : undefined, selectedLpgType)
            setRekapData(data)
        } catch (error) {
            console.error('Error fetching penyaluran rekapitulasi:', error)
            // Set empty data silently (normal for types without sales history)
            const [year, month] = selectedMonth.split('-').map(Number)
            const daysInMonth = new Date(year, month, 0).getDate()
            setRekapData({
                bulan: selectedMonth,
                days_in_month: daysInMonth,
                data: []
            })
            // No toast - empty data is normal for types without sales
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLpgProducts()
    }, [])

    // Fetch pangkalan list when modal opens
    useEffect(() => {
        if (showFakultatifModal && pangkalanList.length === 0) {
            pangkalanApi.getAll(1, 100, undefined, true).then(res => {
                setPangkalanList(res.data)
            }).catch(err => {
                console.error('Failed to fetch pangkalan:', err)
                toast.error('Gagal memuat daftar pangkalan')
            })
        }
    }, [showFakultatifModal])

    // Handle fakultatif form submit
    const handleSaveFakultatif = async () => {
        if (!fakultatifForm.pangkalan_id) {
            toast.error('Pilih pangkalan terlebih dahulu')
            return
        }
        if (!fakultatifForm.jumlah || parseInt(fakultatifForm.jumlah) <= 0) {
            toast.error('Jumlah harus lebih dari 0')
            return
        }
        if (!fakultatifForm.catatan.trim()) {
            toast.error('Catatan/alasan wajib diisi untuk penyaluran fakultatif')
            return
        }

        setIsSavingFakultatif(true)
        try {
            await penyaluranApi.createFakultatif({
                pangkalan_id: fakultatifForm.pangkalan_id,
                tanggal: fakultatifForm.tanggal,
                lpg_type: selectedLpgType,
                jumlah: parseInt(fakultatifForm.jumlah),
                kondisi: 'FAKULTATIF',
                catatan: fakultatifForm.catatan
            })
            toast.success('Penyaluran fakultatif berhasil disimpan')
            setShowFakultatifModal(false)
            setFakultatifForm({ pangkalan_id: '', tanggal: new Date().toISOString().split('T')[0], jumlah: '', catatan: '' })
            fetchRekapitulasi()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan penyaluran fakultatif')
        } finally {
            setIsSavingFakultatif(false)
        }
    }

    useEffect(() => {
        fetchRekapitulasi()
    }, [selectedMonth, tipePembayaran, selectedLpgType])

    // Handle Download PDF
    const handleDownloadPDF = async () => {
        if (!rekapData || rekapData.data.length === 0) {
            toast.error('Tidak ada data untuk di-download')
            return
        }

        try {
            toast.loading('Generating PDF...', { id: 'pdf-export' })

            // Convert data to RekapRow format
            const exportData: RekapRow[] = rekapData.data.map(row => ({
                id_registrasi: row.id_registrasi,
                nama_pangkalan: row.nama_pangkalan,
                alokasi: row.alokasi,
                daily: row.daily,
                total_normal: row.total_normal,
                total_fakultatif: row.total_fakultatif,
                sisa_alokasi: row.sisa_alokasi,
                grand_total: row.grand_total
            }))

            // Get agen profile from API (with fallback to defaults)
            const agenProfile = await getAgenProfileFromAPI()

            await exportPertaminaPDF({
                bulan: selectedMonth,
                data: exportData,
                daysInMonth: rekapData.days_in_month,
                agenProfile: agenProfile,
                tipe: 'penyaluran',
                lpgType: selectedLpgType,
                category: selectedCategory
            })

            toast.success('PDF berhasil di-download!', { id: 'pdf-export' })
        } catch (error) {
            console.error('PDF export error:', error)
            toast.error('Gagal export PDF', { id: 'pdf-export' })
        }
    }

    // Handle Download Excel
    const handleDownloadExcel = async () => {
        if (!rekapData || rekapData.data.length === 0) {
            toast.error('Tidak ada data untuk di-download')
            return
        }

        try {
            toast.loading('Generating Excel...', { id: 'excel-export' })

            // Convert data to RekapRow format
            const exportData: RekapRow[] = rekapData.data.map(row => ({
                id_registrasi: row.id_registrasi,
                nama_pangkalan: row.nama_pangkalan,
                alokasi: row.alokasi,
                daily: row.daily,
                total_normal: row.total_normal,
                total_fakultatif: row.total_fakultatif,
                sisa_alokasi: row.sisa_alokasi,
                grand_total: row.grand_total
            }))

            // Get agen profile from API (with fallback to defaults)
            const agenProfile = await getAgenProfileFromAPI()

            await exportPertaminaExcel({
                bulan: selectedMonth,
                data: exportData,
                daysInMonth: rekapData.days_in_month,
                agenProfile: agenProfile,
                tipe: 'penyaluran',
                lpgType: selectedLpgType,
                category: selectedCategory
            })

            toast.success('Excel berhasil di-download!', { id: 'excel-export' })
        } catch (error) {
            console.error('Excel export error:', error)
            toast.error('Gagal export Excel', { id: 'excel-export' })
        }
    }

    // Ref for horizontal scroll container
    const tableScrollRef = useRef<HTMLDivElement>(null)

    // Non-passive wheel event listener with scroll boundary pass-through
    useEffect(() => {
        const container = tableScrollRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY === 0) return

            // Check scroll boundaries
            const atLeftEdge = container.scrollLeft <= 0
            const atRightEdge = container.scrollLeft >= container.scrollWidth - container.clientWidth - 1

            const scrollingUp = e.deltaY < 0   // Scroll up = go left in table
            const scrollingDown = e.deltaY > 0 // Scroll down = go right in table

            // Scroll Boundary Pass-through:
            // - At left edge + scrolling up → release to page (scroll page up)
            // - At right edge + scrolling down → release to page (scroll page down)
            if ((atLeftEdge && scrollingUp) || (atRightEdge && scrollingDown)) {
                // Don't prevent default - let page scroll naturally
                return
            }

            // Otherwise, convert vertical to horizontal
            e.preventDefault()
            e.stopPropagation()
            container.scrollLeft += e.deltaY
        }

        container.addEventListener('wheel', handleWheel, { passive: false })
        return () => container.removeEventListener('wheel', handleWheel)
    }, [])

    const monthOptions = useMemo(() => {
        const options = []
        const now = new Date()
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
            options.push({ value, label })
        }
        return options
    }, [])

    // Generate day headers with day names
    const dayHeaders = useMemo(() => {
        if (!rekapData) return []
        const [year, month] = selectedMonth.split('-').map(Number)
        return Array.from({ length: rekapData.days_in_month }, (_, i) => {
            const day = i + 1
            const date = new Date(year, month - 1, day)
            const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
            return { day, dayName: dayNames[date.getDay()], isSunday: date.getDay() === 0 }
        })
    }, [rekapData, selectedMonth])

    // Calculate summary stats
    const summaryStats = useMemo(() => {
        if (!rekapData) return { totalPangkalan: 0, totalAlokasi: 0, totalRealisasi: 0, sisaAlokasi: 0, overAlokasi: 0, nearLimit: 0 }
        const overAlokasi = rekapData.data.filter(r => r.sisa_alokasi < 0).length
        const nearLimit = rekapData.data.filter(r => r.sisa_alokasi >= 0 && r.sisa_alokasi <= r.alokasi * 0.2 && r.alokasi > 0).length
        return {
            totalPangkalan: rekapData.data.length,
            totalAlokasi: rekapData.data.reduce((sum, r) => sum + r.alokasi, 0),
            totalRealisasi: rekapData.data.reduce((sum, r) => sum + r.grand_total, 0),
            sisaAlokasi: rekapData.data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
            overAlokasi,
            nearLimit,
        }
    }, [rekapData])

    const today = new Date().getDate()
    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    const isCurrentMonth = selectedMonth === currentMonth

    // Highlight Sundays
    const isSunday = (dayInfo: { day: number; dayName: string; isSunday: boolean }): boolean => dayInfo.isSunday

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Penyaluran"
                subtitle="Input dan rekapitulasi penyaluran harian"
            />

            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="glass-card p-1 mb-4">
                    <TabsTrigger value="rekapitulasi" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                        <SafeIcon name="Table" className="w-4 h-4 mr-2" />
                        Rekapitulasi
                    </TabsTrigger>
                    <TabsTrigger value="form" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                        <SafeIcon name="Edit" className="w-4 h-4 mr-2" />
                        Input Form
                    </TabsTrigger>
                </TabsList>

                {/* Category Tabs: Subsidi / Non-Subsidi */}
                <div className="flex gap-2 mb-3">
                    <Button
                        variant={selectedCategory === 'SUBSIDI' ? 'default' : 'outline'}
                        className={selectedCategory === 'SUBSIDI'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-lg'
                            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}
                        onClick={() => setSelectedCategory('SUBSIDI')}
                    >
                        <SafeIcon name="Shield" className="w-4 h-4 mr-2" />
                        LPG Subsidi
                    </Button>
                    <Button
                        variant={selectedCategory === 'NON_SUBSIDI' ? 'default' : 'outline'}
                        className={selectedCategory === 'NON_SUBSIDI'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg'
                            : 'hover:bg-amber-50 dark:hover:bg-amber-900/20'}
                        onClick={() => setSelectedCategory('NON_SUBSIDI')}
                    >
                        <SafeIcon name="Flame" className="w-4 h-4 mr-2" />
                        LPG Non-Subsidi
                    </Button>
                </div>

                {/* LPG Type Sub-Tabs (filtered by category) */}
                {lpgTypeOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {lpgTypeOptions.map(opt => (
                            <Button
                                key={opt.value}
                                variant={selectedLpgType === opt.value ? 'default' : 'outline'}
                                size="sm"
                                className={selectedLpgType === opt.value
                                    ? isSubsidi
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0'
                                    : 'hover:bg-muted'}
                                onClick={() => setSelectedLpgType(opt.value)}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                        Tidak ada produk LPG {selectedCategory === 'SUBSIDI' ? 'Subsidi' : 'Non-Subsidi'} yang aktif
                    </div>
                )}

                {/* Filter Bar */}
                <Card className="glass-card mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Bulan:</span>
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="w-44">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {monthOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Only show Kondisi and Tipe filters for Subsidi */}
                                {selectedCategory === 'SUBSIDI' && (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">Kondisi:</span>
                                            <Select value={kondisi} onValueChange={setKondisi}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ALL">Semua</SelectItem>
                                                    <SelectItem value="NORMAL">Normal</SelectItem>
                                                    <SelectItem value="FAKULTATIF">Fakultatif</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">Tipe:</span>
                                            <Select value={tipePembayaran} onValueChange={setTipePembayaran}>
                                                <SelectTrigger className="w-28">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ALL">Semua</SelectItem>
                                                    <SelectItem value="CASHLESS">Cashless</SelectItem>
                                                    <SelectItem value="CASH">Cash</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 sm:ml-auto">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => setShowFakultatifModal(true)}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                >
                                    <SafeIcon name="Plus" className="w-4 h-4 mr-1" />
                                    Tambah Fakultatif
                                </Button>

                                <Button variant="outline" size="sm" onClick={fetchRekapitulasi} disabled={isLoading}>
                                    <SafeIcon name="RefreshCw" className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <SafeIcon name="Download" className="w-4 h-4 mr-1" />
                                            Download
                                            <SafeIcon name="ChevronDown" className="w-3 h-3 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={handleDownloadPDF}>
                                            <SafeIcon name="FileText" className="w-4 h-4 mr-2" />
                                            Download PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDownloadExcel}>
                                            <SafeIcon name="FileSpreadsheet" className="w-4 h-4 mr-2" />
                                            Download Excel
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rekapitulasi Tab */}
                <TabsContent value="rekapitulasi">
                    {/* Summary Cards */}
                    <div className={`mb-6 ${isSubsidi ? 'grid gap-4 grid-cols-2 lg:grid-cols-5' : 'flex flex-wrap gap-4'}`}>
                        <Card className="glass-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10">
                                        <SafeIcon name="Building2" className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Pangkalan</p>
                                        <p className="text-xl font-bold"><AnimatedNumber value={summaryStats.totalPangkalan} delay={100} /></p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {isSubsidi && (
                            <Card className="glass-card">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-green-500/10">
                                            <SafeIcon name="Target" className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Alokasi</p>
                                            <p className="text-xl font-bold"><AnimatedNumber value={summaryStats.totalAlokasi} delay={200} /></p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <Card className="glass-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-purple-500/10">
                                        <SafeIcon name="TrendingUp" className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Penyaluran</p>
                                        <p className="text-xl font-bold text-purple-600"><AnimatedNumber value={summaryStats.totalRealisasi} delay={300} /></p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {isSubsidi && (
                            <Card className="glass-card">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-orange-500/10">
                                            <SafeIcon name="AlertCircle" className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Sisa Alokasi</p>
                                            <p className={`text-xl font-bold ${summaryStats.sisaAlokasi < 0 ? 'text-red-500' : 'text-orange-600'}`}>
                                                <AnimatedNumber value={summaryStats.sisaAlokasi} delay={400} />
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        {isSubsidi && (
                            <Card className={`glass-card ${summaryStats.overAlokasi > 0 ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${summaryStats.overAlokasi > 0 ? 'bg-red-500/20' : 'bg-green-500/10'}`}>
                                            <SafeIcon name={summaryStats.overAlokasi > 0 ? "AlertTriangle" : "CheckCircle"} className={`w-5 h-5 ${summaryStats.overAlokasi > 0 ? 'text-red-500' : 'text-green-500'}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Status Alokasi</p>
                                            <div className="flex items-center gap-2">
                                                {summaryStats.overAlokasi > 0 ? (
                                                    <span className="text-sm font-bold text-red-500">⚠️ {summaryStats.overAlokasi} Over</span>
                                                ) : (
                                                    <span className="text-sm font-bold text-green-500">✅ Aman</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <Card className="chart-card-premium">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <CardTitle className="text-lg font-semibold">Rekapitulasi Penyaluran</CardTitle>
                                <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-600 border-green-500/30">
                                    {tipePembayaran === 'ALL' ? 'Semua' : tipePembayaran}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div
                                ref={tableScrollRef}
                                className="overflow-x-auto scrollbar-thin-auto"
                                style={{ scrollBehavior: 'auto' }}
                            >
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 sticky top-0 z-20">
                                        <tr>
                                            <th className="sticky left-0 z-30 bg-muted px-3 py-3 text-left font-medium min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">ID Registrasi</th>
                                            <th className="sticky left-[120px] z-30 bg-muted px-3 py-3 text-left font-medium min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Nama Pangkalan</th>
                                            <th className="px-3 py-3 text-center font-medium min-w-[60px]">Status</th>
                                            {isSubsidi && <th className="px-3 py-3 text-center font-medium min-w-[70px]">Alokasi</th>}
                                            {dayHeaders.map(dayInfo => {
                                                const weekClass = isSunday(dayInfo) ? 'bg-red-100 dark:bg-red-900/30' : ''
                                                const todayClass = isCurrentMonth && dayInfo.day === today ? 'bg-primary/20 text-primary font-bold' : ''
                                                return (
                                                    <th
                                                        key={dayInfo.day}
                                                        className={`px-2 py-2 text-center font-medium min-w-[45px] ${weekClass} ${todayClass}`}
                                                    >
                                                        <div className="text-xs">{String(dayInfo.day).padStart(2, '0')}</div>
                                                        <div className={`text-[10px] ${isSunday(dayInfo) ? 'text-red-500' : 'text-muted-foreground'}`}>{dayInfo.dayName}</div>
                                                    </th>
                                                )
                                            })}
                                            {isSubsidi && <th className="px-3 py-3 text-center font-medium bg-green-500/10 min-w-[80px]">Total Normal</th>}
                                            {isSubsidi && <th className="px-3 py-3 text-center font-medium bg-blue-500/10 min-w-[80px]">Total Fakultatif</th>}
                                            {isSubsidi && <th className="px-3 py-3 text-center font-medium bg-orange-500/10 min-w-[80px]">Sisa Alokasi</th>}
                                            <th className="px-3 py-3 text-center font-medium bg-purple-500/10 min-w-[80px]">{isSubsidi ? 'Grand Total' : 'Total'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={dayHeaders.length + 8} className="text-center py-8">
                                                    <SafeIcon name="Loader2" className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                    <span className="text-muted-foreground">Memuat data...</span>
                                                </td>
                                            </tr>
                                        ) : rekapData?.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={dayHeaders.length + 8} className="text-center py-8 text-muted-foreground">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        ) : (
                                            rekapData?.data.map((row) => (
                                                <tr key={row.pangkalan_id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                                    <td className="sticky left-0 z-10 bg-background px-3 py-2 font-mono text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{row.id_registrasi}</td>
                                                    <td className="sticky left-[120px] z-10 bg-background px-3 py-2 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{row.nama_pangkalan}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
                                                            {row.status}
                                                        </Badge>
                                                    </td>
                                                    {isSubsidi && <td className="px-3 py-2 text-center font-medium">{row.alokasi.toLocaleString()}</td>}
                                                    {dayHeaders.map(dayInfo => {
                                                        const value = row.daily[dayInfo.day] || 0
                                                        const weekClass = isSunday(dayInfo) ? 'bg-red-50 dark:bg-red-900/20' : ''
                                                        const todayClass = isCurrentMonth && dayInfo.day === today ? 'bg-primary/10' : ''
                                                        return (
                                                            <td
                                                                key={dayInfo.day}
                                                                className={`px-2 py-2 text-center ${weekClass} ${todayClass}`}
                                                            >
                                                                {value === 0 ? (
                                                                    <span className="text-muted-foreground/40">-</span>
                                                                ) : (
                                                                    <span className="font-medium">{value}</span>
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                    {isSubsidi && <td className="px-3 py-2 text-center font-medium bg-green-500/5">{row.total_normal.toLocaleString()}</td>}
                                                    {isSubsidi && <td className="px-3 py-2 text-center font-medium bg-blue-500/5">{row.total_fakultatif.toLocaleString()}</td>}
                                                    {isSubsidi && (
                                                        <td className={`px-3 py-2 text-center font-bold ${row.sisa_alokasi < 0
                                                            ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                                                            : 'bg-orange-500/5'
                                                            }`}>
                                                            {row.sisa_alokasi < 0 && '⚠️ '}
                                                            {row.sisa_alokasi.toLocaleString()}
                                                        </td>
                                                    )}
                                                    <td className="px-3 py-2 text-center font-bold bg-purple-500/5">{row.grand_total.toLocaleString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {rekapData && rekapData.data.length > 0 && (
                                        <tfoot className="bg-muted/70 font-bold sticky bottom-0 z-20">
                                            <tr>
                                                <td className="sticky left-0 z-30 bg-muted px-3 py-3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" colSpan={2}>Total</td>
                                                <td className="px-3 py-3"></td>
                                                {isSubsidi && (
                                                    <td className="px-3 py-3 text-center">
                                                        {rekapData.data.reduce((sum, r) => sum + r.alokasi, 0).toLocaleString()}
                                                    </td>
                                                )}
                                                {dayHeaders.map(dayInfo => {
                                                    const weekClass = isSunday(dayInfo) ? 'bg-red-100 dark:bg-red-900/30' : ''
                                                    const todayClass = isCurrentMonth && dayInfo.day === today ? 'bg-primary/20' : ''
                                                    const total = rekapData.data.reduce((sum, r) => sum + (r.daily[dayInfo.day] || 0), 0)
                                                    return (
                                                        <td key={dayInfo.day} className={`px-2 py-3 text-center ${weekClass} ${todayClass}`}>
                                                            {total === 0 ? <span className="text-muted-foreground/40">-</span> : total.toLocaleString()}
                                                        </td>
                                                    )
                                                })}
                                                {isSubsidi && (
                                                    <td className="px-3 py-3 text-center bg-green-500/10">
                                                        {rekapData.data.reduce((sum, r) => sum + r.total_normal, 0).toLocaleString()}
                                                    </td>
                                                )}
                                                {isSubsidi && (
                                                    <td className="px-3 py-3 text-center bg-blue-500/10">
                                                        {rekapData.data.reduce((sum, r) => sum + r.total_fakultatif, 0).toLocaleString()}
                                                    </td>
                                                )}
                                                {isSubsidi && (
                                                    <td className="px-3 py-3 text-center bg-orange-500/10">
                                                        {rekapData.data.reduce((sum, r) => sum + r.sisa_alokasi, 0).toLocaleString()}
                                                    </td>
                                                )}
                                                <td className="px-3 py-3 text-center bg-purple-500/10">
                                                    {rekapData.data.reduce((sum, r) => sum + r.grand_total, 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Form Tab */}
                <TabsContent value="form">
                    <Card className="chart-card-premium">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <CardTitle className="text-lg font-semibold">Input Penyaluran</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="text-center py-12 text-muted-foreground">
                                <SafeIcon name="Construction" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">Fitur Input Form</p>
                                <p className="text-sm">Coming soon - Kaleum nya lieur keneh. 😭</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Fakultatif Modal */}
            <Dialog open={showFakultatifModal} onOpenChange={setShowFakultatifModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <SafeIcon name="AlertCircle" className="w-5 h-5 text-amber-500" />
                            Tambah Penyaluran Fakultatif
                        </DialogTitle>
                        <DialogDescription>
                            Input penyaluran di luar kuota normal. Catatan wajib diisi sebagai alasan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Pangkalan */}
                        <div className="space-y-2">
                            <Label htmlFor="fak-pangkalan">
                                Pangkalan <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={fakultatifForm.pangkalan_id}
                                onValueChange={(v) => setFakultatifForm({ ...fakultatifForm, pangkalan_id: v })}
                            >
                                <SelectTrigger id="fak-pangkalan">
                                    <SelectValue placeholder="Pilih pangkalan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {pangkalanList.map(p => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.code} - {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* LPG Type (read-only, shows current selection) */}
                        <div className="space-y-2">
                            <Label>Jenis LPG</Label>
                            <div className="px-3 py-2 rounded-md border bg-muted/50 text-sm">
                                {lpgTypeOptions.find(o => o.value === selectedLpgType)?.label || selectedLpgType}
                            </div>
                        </div>

                        {/* Tanggal */}
                        <div className="space-y-2">
                            <Label htmlFor="fak-tanggal">
                                Tanggal <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="fak-tanggal"
                                type="date"
                                value={fakultatifForm.tanggal}
                                onChange={(e) => setFakultatifForm({ ...fakultatifForm, tanggal: e.target.value })}
                            />
                        </div>

                        {/* Jumlah */}
                        <div className="space-y-2">
                            <Label htmlFor="fak-jumlah">
                                Jumlah (Tabung) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="fak-jumlah"
                                type="number"
                                min="1"
                                value={fakultatifForm.jumlah}
                                onChange={(e) => setFakultatifForm({ ...fakultatifForm, jumlah: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        {/* Catatan (required) */}
                        <div className="space-y-2">
                            <Label htmlFor="fak-catatan">
                                Catatan/Alasan <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="fak-catatan"
                                value={fakultatifForm.catatan}
                                onChange={(e) => setFakultatifForm({ ...fakultatifForm, catatan: e.target.value })}
                                placeholder="Contoh: Permintaan darurat untuk event..."
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                Wajib diisi sebagai audit trail
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowFakultatifModal(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleSaveFakultatif}
                            disabled={isSavingFakultatif || !fakultatifForm.pangkalan_id || !fakultatifForm.jumlah || !fakultatifForm.catatan.trim()}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        >
                            {isSavingFakultatif ? (
                                <SafeIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <SafeIcon name="Check" className="w-4 h-4 mr-2" />
                            )}
                            Simpan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
