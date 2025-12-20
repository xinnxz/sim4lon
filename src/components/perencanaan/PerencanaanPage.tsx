import { useState, useEffect, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon'
import { perencanaanApi, lpgProductsApi, type PerencanaanRekapitulasiResponse, type LpgProduct } from '@/lib/api'
import { toast } from 'sonner'

export default function PerencanaanPage() {
    const [activeTab, setActiveTab] = useState<'form' | 'rekapitulasi'>('rekapitulasi')
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [kondisi, setKondisi] = useState<string>('ALL')
    const [tipePembayaran, setTipePembayaran] = useState<string>('ALL')
    const [selectedLpgType, setSelectedLpgType] = useState<string>('kg3')
    const [rekapData, setRekapData] = useState<PerencanaanRekapitulasiResponse | null>(null)
    const [lpgProducts, setLpgProducts] = useState<LpgProduct[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showGenerateDialog, setShowGenerateDialog] = useState(false)
    const [generateOverwrite, setGenerateOverwrite] = useState(false)

    // Editable Grid State - stores {key: {normal, fakultatif}}
    const [editedCells, setEditedCells] = useState<Record<string, { normal: number; fakultatif: number }>>({})
    const [isSaving, setIsSaving] = useState(false)

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false)
    const [editModalData, setEditModalData] = useState<{
        pangkalanId: string
        pangkalanName: string
        day: number
        tanggal: string
        normal: number
        fakultatif: number
    } | null>(null)

    // Fetch LPG products dynamically
    const fetchLpgProducts = async () => {
        try {
            const products = await lpgProductsApi.getAll()
            setLpgProducts(products.filter(p => p.is_active))
        } catch (error) {
            console.error('Error fetching LPG products:', error)
            setLpgProducts([])
        }
    }

    // LPG Type options - ONLY SUBSIDI for Perencanaan (best practice)
    const lpgTypeOptions = useMemo(() => {
        // Helper function to convert size_kg to Prisma lpg_type enum value
        const sizeToLpgType = (size: number): string => {
            if (size === 0.22 || size === 0.220) return 'gr220'
            if (size === 3) return 'kg3'
            if (size === 5.5) return 'kg5'  // 5.5kg → kg5 (not kg55!)
            if (size === 12) return 'kg12'
            if (size === 50) return 'kg50'
            return `kg${Math.floor(size)}` // Fallback
        }

        if (lpgProducts.length > 0) {
            // Filter only SUBSIDI types for Perencanaan
            const subsidiTypes = lpgProducts
                .filter(p => p.category === 'SUBSIDI')
                .map(p => {
                    const lpgType = sizeToLpgType(Number(p.size_kg))
                    return {
                        value: lpgType,
                        label: p.name,
                        description: 'Subsidi'
                    }
                })
            return subsidiTypes.length > 0 ? subsidiTypes : [{ value: 'kg3', label: 'LPG 3 KG', description: 'Subsidi' }]
        }
        return [{ value: 'kg3', label: 'LPG 3 KG', description: 'Subsidi' }]
    }, [lpgProducts])

    // Set default LPG type when options change
    useEffect(() => {
        if (lpgTypeOptions.length > 0 && !lpgTypeOptions.find(o => o.value === selectedLpgType)) {
            setSelectedLpgType(lpgTypeOptions[0].value)
        }
    }, [lpgTypeOptions])

    // Fetch rekapitulasi data
    const fetchRekapitulasi = async () => {
        setIsLoading(true)
        try {
            const data = await perencanaanApi.getRekapitulasi(selectedMonth, kondisi !== 'ALL' ? kondisi : undefined, selectedLpgType)
            setRekapData(data)
        } catch (error) {
            console.error('Error fetching rekapitulasi:', error)
            // Set empty data instead of showing error (normal for non-3kg types)
            setRekapData({
                bulan: selectedMonth,
                days_in_month: new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate(),
                data: []
            })
            // Only show error toast for actual server errors, not empty data
            if (error instanceof Error && !error.message.includes('404')) {
                toast.error('Gagal memuat data rekapitulasi')
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-generate perencanaan from alokasi_bulanan
    const handleAutoGenerate = async () => {
        setShowGenerateDialog(false)
        setIsGenerating(true)
        try {
            const result = await perencanaanApi.autoGenerate({
                bulan: selectedMonth,
                lpg_type: selectedLpgType,
                kondisi: kondisi !== 'ALL' ? kondisi as 'NORMAL' | 'FAKULTATIF' : 'NORMAL',
                overwrite: generateOverwrite
            })
            toast.success(result.message, {
                description: `${result.details.created_records} entries dibuat untuk ${result.details.total_pangkalan - result.details.skipped_no_alokasi} pangkalan`
            })
            fetchRekapitulasi() // Refresh data
            setGenerateOverwrite(false) // Reset overwrite state
        } catch (error) {
            toast.error('Gagal generate perencanaan otomatis')
        } finally {
            setIsGenerating(false)
        }
    }

    useEffect(() => {
        fetchLpgProducts()
    }, [])

    // Open edit modal for a cell
    const openEditModal = (pangkalanId: string, pangkalanName: string, day: number, originalValue: number) => {
        const [year, month] = selectedMonth.split('-').map(Number)
        const tanggal = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString().split('T')[0]
        const key = `${pangkalanId}_${tanggal}`

        // Get existing edited value or use original (default as normal)
        const existing = editedCells[key]

        setEditModalData({
            pangkalanId,
            pangkalanName,
            day,
            tanggal,
            normal: existing?.normal ?? originalValue,
            fakultatif: existing?.fakultatif ?? 0
        })
        setShowEditModal(true)
    }

    // Save modal data
    const handleModalSave = () => {
        if (!editModalData) return

        const key = `${editModalData.pangkalanId}_${editModalData.tanggal}`
        setEditedCells(prev => ({
            ...prev,
            [key]: { normal: editModalData.normal, fakultatif: editModalData.fakultatif }
        }))
        setShowEditModal(false)
        setEditModalData(null)
    }

    // Remove edit (revert to original)
    const handleRemoveEdit = () => {
        if (!editModalData) return

        const key = `${editModalData.pangkalanId}_${editModalData.tanggal}`
        setEditedCells(prev => {
            const newCells = { ...prev }
            delete newCells[key]
            return newCells
        })
        setShowEditModal(false)
        setEditModalData(null)
    }

    // Check if a cell has been edited
    const isCellEdited = (pangkalanId: string, day: number) => {
        const [year, month] = selectedMonth.split('-').map(Number)
        const tanggal = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString().split('T')[0]
        const key = `${pangkalanId}_${tanggal}`
        return key in editedCells
    }

    // Get edited value for a cell (returns total: normal + fakultatif)
    const getEditedValue = (pangkalanId: string, day: number, original: number) => {
        const [year, month] = selectedMonth.split('-').map(Number)
        const tanggal = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString().split('T')[0]
        const key = `${pangkalanId}_${tanggal}`
        if (key in editedCells) {
            return editedCells[key].normal + editedCells[key].fakultatif
        }
        return original
    }

    // Get edited cell data (normal + fakultatif)
    const getEditedCell = (pangkalanId: string, day: number) => {
        const [year, month] = selectedMonth.split('-').map(Number)
        const tanggal = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString().split('T')[0]
        const key = `${pangkalanId}_${tanggal}`
        return editedCells[key] || null
    }

    // Save all edited cells
    const handleSaveChanges = async () => {
        const keys = Object.keys(editedCells)
        if (keys.length === 0) return

        setIsSaving(true)
        try {
            // Group by pangkalan_id for bulk update
            const updates: Record<string, { tanggal: string; jumlah: number; jumlah_normal: number; jumlah_fakultatif: number }[]> = {}
            for (const key of keys) {
                const [pangkalanId, tanggal] = key.split('_')
                if (!updates[pangkalanId]) updates[pangkalanId] = []
                const cellData = editedCells[key]
                updates[pangkalanId].push({
                    tanggal,
                    jumlah: cellData.normal + cellData.fakultatif,
                    jumlah_normal: cellData.normal,
                    jumlah_fakultatif: cellData.fakultatif
                })
            }

            // Use bulkUpdate for each pangkalan
            for (const [pangkalanId, data] of Object.entries(updates)) {
                await perencanaanApi.bulkUpdate({
                    pangkalan_id: pangkalanId,
                    tanggal_awal: data[0].tanggal,
                    tanggal_akhir: data[data.length - 1].tanggal,
                    data: data.map(d => ({
                        tanggal: d.tanggal,
                        jumlah: d.jumlah,
                        jumlah_normal: d.jumlah_normal,
                        jumlah_fakultatif: d.jumlah_fakultatif
                    }))
                })
            }

            toast.success(`${keys.length} perubahan berhasil disimpan`)
            setEditedCells({})
            fetchRekapitulasi()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan perubahan')
        } finally {
            setIsSaving(false)
        }
    }

    useEffect(() => {
        fetchRekapitulasi()
    }, [selectedMonth, kondisi, selectedLpgType])

    // Generate day headers for the month (memoized for performance)
    const { dayHeaders, isCurrentMonth, today, daysInMonth } = useMemo(() => {
        const [year, month] = selectedMonth.split('-').map(Number)
        const startOfMonth = new Date(year, month - 1, 1)
        const _daysInMonth = new Date(year, month, 0).getDate()
        const now = new Date()
        const _isCurrentMonth = now.getFullYear() === year && now.getMonth() === month - 1
        const _today = now.getDate()

        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        const headers: { day: number; dayName: string; isSunday: boolean }[] = []
        for (let d = 1; d <= _daysInMonth; d++) {
            const date = new Date(year, month - 1, d)
            const dayOfWeek = date.getDay()
            headers.push({
                day: d,
                dayName: dayNames[dayOfWeek],
                isSunday: dayOfWeek === 0
            })
        }
        return { dayHeaders: headers, isCurrentMonth: _isCurrentMonth, today: _today, daysInMonth: _daysInMonth }
    }, [selectedMonth])

    // Computed rekap data with real-time edits (performance optimized)
    const computedRekapData = useMemo(() => {
        if (!rekapData) return null

        return {
            ...rekapData,
            data: rekapData.data.map(row => {
                // Start with original totals from API
                let totalNormal = row.total_normal || 0
                let totalFakultatif = row.total_fakultatif || 0

                // Adjust for edited cells
                for (const dayInfo of dayHeaders) {
                    const [year, month] = selectedMonth.split('-').map(Number)
                    const tanggal = new Date(Date.UTC(year, month - 1, dayInfo.day, 12, 0, 0)).toISOString().split('T')[0]
                    const key = `${row.pangkalan_id}_${tanggal}`

                    const editedCell = editedCells[key]
                    if (editedCell) {
                        // Get original value for this day
                        const originalValue = row.daily[dayInfo.day] || 0

                        // Subtract original from totals (we assume original was counted as NORMAL in API for simplicity)
                        totalNormal -= originalValue

                        // Add edited values to appropriate totals
                        totalNormal += editedCell.normal
                        totalFakultatif += editedCell.fakultatif
                    }
                }

                const grandTotal = totalNormal + totalFakultatif
                const sisaAlokasi = row.alokasi - grandTotal

                return {
                    ...row,
                    total_normal: totalNormal,
                    total_fakultatif: totalFakultatif,
                    sisa_alokasi: sisaAlokasi,
                    grand_total: grandTotal
                }
            })
        }
    }, [rekapData, editedCells, dayHeaders, selectedMonth])

    // Ref for horizontal scroll container
    const tableScrollRef = useRef<HTMLDivElement>(null)

    // Non-passive wheel event listener with scroll boundary pass-through
    useEffect(() => {
        const container = tableScrollRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY === 0) return

            const atLeftEdge = container.scrollLeft <= 0
            const atRightEdge = container.scrollLeft >= container.scrollWidth - container.clientWidth - 1

            const scrollingUp = e.deltaY < 0
            const scrollingDown = e.deltaY > 0

            // Scroll boundary pass-through
            if ((atLeftEdge && scrollingUp) || (atRightEdge && scrollingDown)) {
                return // Let page scroll
            }

            e.preventDefault()
            e.stopPropagation()
            container.scrollLeft += e.deltaY
        }

        container.addEventListener('wheel', handleWheel, { passive: false })
        return () => container.removeEventListener('wheel', handleWheel)
    }, [])

    // Generate month options
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

    // Calculate summary stats (uses computedRekapData for real-time values)
    const summaryStats = useMemo(() => {
        const data = computedRekapData?.data || rekapData?.data || []
        if (data.length === 0) return { totalPangkalan: 0, totalAlokasi: 0, totalRealisasi: 0, sisaAlokasi: 0, overAlokasi: 0, nearLimit: 0 }
        const overAlokasi = data.filter(r => r.sisa_alokasi < 0).length
        // Sisa >= 0 dianggap Aman, hanya sisa < 0 yang Over
        const nearLimit = 0 // Tidak ada warning, hanya Over atau Aman
        return {
            totalPangkalan: data.length,
            totalAlokasi: data.reduce((sum, r) => sum + r.alokasi, 0),
            totalRealisasi: data.reduce((sum, r) => sum + r.total_normal + r.total_fakultatif, 0),
            sisaAlokasi: data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
            overAlokasi,
            nearLimit,
        }
    }, [computedRekapData, rekapData])

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'form' | 'rekapitulasi')}>
                <TabsList className="glass-card p-1 mb-4">
                    <TabsTrigger value="rekapitulasi" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
                        <SafeIcon name="Table" className="w-4 h-4 mr-2" />
                        Rekapitulasi
                    </TabsTrigger>
                    <TabsTrigger value="form" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
                        <SafeIcon name="Edit" className="w-4 h-4 mr-2" />
                        Input Form
                    </TabsTrigger>
                </TabsList>

                {/* LPG Type Sub-Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {lpgTypeOptions.map(opt => (
                        <Button
                            key={opt.value}
                            variant={selectedLpgType === opt.value ? 'default' : 'outline'}
                            size="sm"
                            className={selectedLpgType === opt.value
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
                                : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}
                            onClick={() => setSelectedLpgType(opt.value)}
                        >
                            {opt.label}
                            <span className="ml-1 text-xs opacity-70">({opt.description})</span>
                        </Button>
                    ))}
                </div>

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
                            </div>

                            <div className="flex items-center gap-2 sm:ml-auto">
                                <Button variant="outline" size="sm" onClick={fetchRekapitulasi} disabled={isLoading}>
                                    <SafeIcon name="RefreshCw" className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>

                                <AlertDialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            disabled={isGenerating}
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                        >
                                            <SafeIcon name="Wand2" className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                                            {isGenerating ? 'Generating...' : 'Generate Otomatis'}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Generate Perencanaan Otomatis</AlertDialogTitle>
                                            <AlertDialogDescription className="space-y-3">
                                                <p>Generate perencanaan otomatis untuk bulan <strong>{selectedMonth}</strong>?</p>
                                                <p>Ini akan membuat rencana harian berdasarkan alokasi bulanan setiap pangkalan.</p>

                                                {/* Overwrite Checkbox */}
                                                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                                    <input
                                                        type="checkbox"
                                                        id="overwrite-checkbox"
                                                        checked={generateOverwrite}
                                                        onChange={(e) => setGenerateOverwrite(e.target.checked)}
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="overwrite-checkbox" className="text-sm font-medium cursor-pointer">
                                                        Timpa data yang sudah ada
                                                    </label>
                                                </div>

                                                {generateOverwrite ? (
                                                    <p className="text-red-500 text-sm">⚠️ Data yang sudah ada AKAN DITIMPA. Data lama akan dihapus.</p>
                                                ) : (
                                                    <p className="text-amber-500 text-sm">ℹ️ Data yang sudah ada TIDAK akan ditimpa.</p>
                                                )}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setGenerateOverwrite(false)}>Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleAutoGenerate}>
                                                Generate
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <Button variant="outline" size="sm">
                                    <SafeIcon name="Download" className="w-4 h-4 mr-1" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rekapitulasi Tab */}
                <TabsContent value="rekapitulasi">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <Card className="glass-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10">
                                        <SafeIcon name="Building2" className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Pangkalan</p>
                                        <p className="text-xl font-bold">{summaryStats.totalPangkalan}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-500/10">
                                        <SafeIcon name="Target" className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Alokasi</p>
                                        <p className="text-xl font-bold">{summaryStats.totalAlokasi.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-purple-500/10">
                                        <SafeIcon name="TrendingUp" className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Realisasi</p>
                                        <p className="text-xl font-bold text-purple-600">{summaryStats.totalRealisasi.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-orange-500/10">
                                        <SafeIcon name="AlertCircle" className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Sisa Alokasi</p>
                                        <p className={`text-xl font-bold ${summaryStats.sisaAlokasi < 0 ? 'text-red-500' : 'text-orange-600'}`}>
                                            {summaryStats.sisaAlokasi.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className={`glass-card ${summaryStats.overAlokasi > 0 ? 'border-red-500/50 bg-red-500/5' : summaryStats.nearLimit > 0 ? 'border-yellow-500/50 bg-yellow-500/5' : ''}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${summaryStats.overAlokasi > 0 ? 'bg-red-500/20' : 'bg-yellow-500/10'}`}>
                                        <SafeIcon name="AlertTriangle" className={`w-5 h-5 ${summaryStats.overAlokasi > 0 ? 'text-red-500' : 'text-yellow-500'}`} />
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
                    </div>
                    <Card className="chart-card-premium">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <CardTitle className="text-lg font-semibold">Rekapitulasi Perencanaan</CardTitle>
                                <Badge variant="outline" className="ml-auto">
                                    {rekapData?.data.length || 0} Pangkalan
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div
                                ref={tableScrollRef}
                                className="overflow-x-auto scrollbar-thin"
                                style={{ scrollBehavior: 'auto' }}
                            >
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 sticky top-0 z-20">
                                        <tr>
                                            <th className="sticky left-0 z-30 bg-muted px-3 py-3 text-left font-medium min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">ID Registrasi</th>
                                            <th className="sticky left-[120px] z-30 bg-muted px-3 py-3 text-left font-medium min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Nama Pangkalan</th>
                                            <th className="px-3 py-3 text-center font-medium min-w-[60px]">Status</th>
                                            <th className="px-3 py-3 text-center font-medium min-w-[70px]">Alokasi</th>
                                            {dayHeaders.map(dayInfo => {
                                                const weekClass = dayInfo.isSunday ? 'bg-red-100 dark:bg-red-900/30' : ''
                                                const todayClass = isCurrentMonth && dayInfo.day === today ? 'bg-primary/20 text-primary font-bold' : ''
                                                return (
                                                    <th
                                                        key={dayInfo.day}
                                                        className={`px-2 py-2 text-center font-medium min-w-[45px] ${weekClass} ${todayClass}`}
                                                    >
                                                        <div className="text-xs">{String(dayInfo.day).padStart(2, '0')}</div>
                                                        <div className={`text-[10px] ${dayInfo.isSunday ? 'text-red-500' : 'text-muted-foreground'}`}>{dayInfo.dayName}</div>
                                                    </th>
                                                )
                                            })}
                                            <th className="px-3 py-3 text-center font-medium bg-green-500/10 min-w-[80px]">Total Normal</th>
                                            <th className="px-3 py-3 text-center font-medium bg-blue-500/10 min-w-[80px]">Total Fakultatif</th>
                                            <th className="px-3 py-3 text-center font-medium bg-orange-500/10 min-w-[80px]">Sisa Alokasi</th>
                                            <th className="px-3 py-3 text-center font-medium bg-purple-500/10 min-w-[80px]">Grand Total</th>
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
                                            (computedRekapData?.data || []).map((row, idx) => (
                                                <tr key={row.pangkalan_id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                                    <td className="sticky left-0 z-10 bg-background px-3 py-2 font-mono text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{row.id_registrasi}</td>
                                                    <td className="sticky left-[120px] z-10 bg-background px-3 py-2 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{row.nama_pangkalan}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
                                                            {row.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-medium">{row.alokasi.toLocaleString()}</td>
                                                    {dayHeaders.map(dayInfo => {
                                                        // Use edited value if available
                                                        const value = getEditedValue(row.pangkalan_id, dayInfo.day, row.daily[dayInfo.day] || 0)
                                                        const isEdited = isCellEdited(row.pangkalan_id, dayInfo.day)
                                                        const weekClass = dayInfo.isSunday ? 'bg-red-50 dark:bg-red-900/20' : ''
                                                        const todayClass = isCurrentMonth && dayInfo.day === today ? 'bg-primary/10' : ''
                                                        const editedClass = isEdited ? 'bg-amber-500/20' : ''
                                                        return (
                                                            <td
                                                                key={dayInfo.day}
                                                                className={`px-2 py-2 text-center ${weekClass} ${todayClass} ${editedClass}`}
                                                            >
                                                                {value === 0 ? (
                                                                    <span className="text-muted-foreground/40">-</span>
                                                                ) : (
                                                                    <span className={`font-medium ${isEdited ? 'text-amber-600' : ''}`}>{value}</span>
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                    <td className="px-3 py-2 text-center font-medium bg-green-500/5">{row.total_normal.toLocaleString()}</td>
                                                    <td className="px-3 py-2 text-center font-medium bg-blue-500/5">{row.total_fakultatif.toLocaleString()}</td>
                                                    <td className={`px-3 py-2 text-center font-bold ${row.sisa_alokasi < 0
                                                        ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                                                        : row.sisa_alokasi <= row.alokasi * 0.2 && row.alokasi > 0
                                                            ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                                                            : 'bg-orange-500/5'
                                                        }`}>
                                                        {row.sisa_alokasi < 0 && '⚠️ '}
                                                        {row.sisa_alokasi.toLocaleString()}
                                                    </td>
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
                                                <td className="px-3 py-3 text-center">
                                                    {rekapData.data.reduce((sum, r) => sum + r.alokasi, 0).toLocaleString()}
                                                </td>
                                                {dayHeaders.map(dayInfo => {
                                                    const weekClass = dayInfo.isSunday ? 'bg-red-100 dark:bg-red-900/30' : ''
                                                    const todayClass = isCurrentMonth && dayInfo.day === today ? 'bg-primary/20' : ''
                                                    const total = rekapData.data.reduce((sum, r) => sum + (r.daily[dayInfo.day] || 0), 0)
                                                    return (
                                                        <td key={dayInfo.day} className={`px-2 py-3 text-center ${weekClass} ${todayClass}`}>
                                                            {total === 0 ? <span className="text-muted-foreground/40">-</span> : total.toLocaleString()}
                                                        </td>
                                                    )
                                                })}
                                                <td className="px-3 py-3 text-center bg-green-500/10">
                                                    {rekapData.data.reduce((sum, r) => sum + r.total_normal, 0).toLocaleString()}
                                                </td>
                                                <td className="px-3 py-3 text-center bg-blue-500/10">
                                                    {rekapData.data.reduce((sum, r) => sum + r.total_fakultatif, 0).toLocaleString()}
                                                </td>
                                                <td className="px-3 py-3 text-center bg-orange-500/10">
                                                    {rekapData.data.reduce((sum, r) => sum + r.sisa_alokasi, 0).toLocaleString()}
                                                </td>
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

                {/* Form Tab - Editable Grid */}
                <TabsContent value="form">
                    <Card className="chart-card-premium">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <CardTitle className="text-lg font-semibold">Edit Perencanaan</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    {Object.keys(editedCells).length > 0 && (
                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/50">
                                            {Object.keys(editedCells).length} perubahan belum disimpan
                                        </Badge>
                                    )}
                                    {Object.keys(editedCells).length > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditedCells({})}
                                            disabled={isSaving}
                                        >
                                            <SafeIcon name="X" className="w-4 h-4 mr-2" />
                                            Batal
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleSaveChanges}
                                        disabled={isSaving || Object.keys(editedCells).length === 0}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500"
                                    >
                                        {isSaving ? (
                                            <SafeIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <SafeIcon name="Save" className="w-4 h-4 mr-2" />
                                        )}
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </div>
                            {/* UX Hint */}
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                                <SafeIcon name="Info" className="w-4 h-4" />
                                Klik pada cell untuk mengedit jumlah perencanaan. Perubahan akan disimpan setelah klik tombol "Simpan Perubahan".
                            </p>
                        </CardHeader>
                        <CardContent className="p-4">
                            {!rekapData || rekapData.data.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <SafeIcon name="AlertCircle" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium">Tidak ada data</p>
                                    <p className="text-sm">Gunakan "Generate Otomatis" untuk membuat rencana awal</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2 sticky left-0 bg-background z-10 min-w-[200px]">Pangkalan</th>
                                                {dayHeaders.map(dayInfo => (
                                                    <th
                                                        key={dayInfo.day}
                                                        className={`text-center p-1 min-w-[60px] ${dayInfo.isSunday ? 'bg-red-500/10 text-red-500' : ''} ${isCurrentMonth && dayInfo.day === today ? 'bg-blue-500/20' : ''}`}
                                                    >
                                                        <div className="text-xs">{dayInfo.dayName}</div>
                                                        <div>{dayInfo.day}</div>
                                                    </th>
                                                ))}
                                                <th className="text-center p-2 min-w-[70px] bg-blue-500/10 text-blue-600 font-semibold">Total Normal</th>
                                                <th className="text-center p-2 min-w-[70px] bg-amber-500/10 text-amber-600 font-semibold">Total Fakultatif</th>
                                                <th className="text-center p-2 min-w-[70px] bg-green-500/10 text-green-600 font-semibold">Sisa Alokasi</th>
                                                <th className="text-center p-2 min-w-[70px] bg-purple-500/10 text-purple-600 font-semibold">Grand Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(computedRekapData?.data || []).map(row => (
                                                <tr key={row.pangkalan_id} className="border-b hover:bg-muted/50">
                                                    <td className="p-2 sticky left-0 bg-background z-10 font-medium">
                                                        <div className="text-xs text-muted-foreground">{row.id_registrasi}</div>
                                                        <div>{row.nama_pangkalan}</div>
                                                    </td>
                                                    {dayHeaders.map(dayInfo => {
                                                        const originalValue = row.daily[dayInfo.day] || 0
                                                        const currentValue = getEditedValue(row.pangkalan_id, dayInfo.day, originalValue)
                                                        const isEdited = isCellEdited(row.pangkalan_id, dayInfo.day)
                                                        const editedCell = getEditedCell(row.pangkalan_id, dayInfo.day)
                                                        const hasFakultatif = editedCell && editedCell.fakultatif > 0
                                                        const isSunday = dayInfo.isSunday

                                                        // Display logic: show N + F format if fakultatif exists
                                                        const displayValue = isEdited && editedCell
                                                            ? (editedCell.fakultatif > 0
                                                                ? `${editedCell.normal}+${editedCell.fakultatif}F`
                                                                : editedCell.normal)
                                                            : (currentValue === 0 ? '-' : currentValue)

                                                        return (
                                                            <td
                                                                key={dayInfo.day}
                                                                className={`p-1 text-center ${isSunday ? 'bg-red-500/5' : ''} ${isCurrentMonth && dayInfo.day === today ? 'bg-blue-500/10' : ''}`}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => !isSunday && openEditModal(row.pangkalan_id, row.nama_pangkalan, dayInfo.day, originalValue)}
                                                                    disabled={isSunday}
                                                                    className={`min-w-14 h-8 px-1 rounded text-center text-xs transition-all ${hasFakultatif
                                                                        ? 'bg-amber-500/20 border border-amber-500 text-amber-700 font-semibold'
                                                                        : isEdited
                                                                            ? 'bg-blue-500/20 border border-blue-500 text-blue-700 font-semibold'
                                                                            : 'bg-transparent hover:bg-muted border border-transparent'
                                                                        } ${isSunday ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-sm'}`}
                                                                >
                                                                    {displayValue}
                                                                </button>
                                                            </td>
                                                        )
                                                    })}
                                                    {/* Summary Columns */}
                                                    <td className="text-center p-2 font-semibold bg-blue-500/5 text-blue-600">{row.total_normal}</td>
                                                    <td className="text-center p-2 font-semibold bg-amber-500/5 text-amber-600">{row.total_fakultatif}</td>
                                                    <td className={`text-center p-2 font-semibold ${row.sisa_alokasi >= 0 ? 'bg-green-500/5 text-green-600' : 'bg-red-500/10 text-red-600'}`}>{row.sisa_alokasi}</td>
                                                    <td className="text-center p-2 font-bold bg-purple-500/5 text-purple-600">{row.grand_total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <SafeIcon name="Edit" className="w-5 h-5 text-blue-500" />
                            Input Perencanaan
                        </DialogTitle>
                    </DialogHeader>
                    {editModalData && (
                        <div className="space-y-4">
                            {/* Pangkalan & Tanggal Info */}
                            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Pangkalan</span>
                                    <span className="font-medium">{editModalData.pangkalanName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tanggal</span>
                                    <span className="font-medium">{editModalData.day} {new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                                </div>
                                {/* Show total */}
                                <div className="flex justify-between text-sm border-t border-border/50 pt-1 mt-1">
                                    <span className="text-muted-foreground">Total</span>
                                    <span className="font-semibold text-green-600">{editModalData.normal + editModalData.fakultatif} tabung</span>
                                </div>
                            </div>

                            {/* Dual Input: Normal + Fakultatif */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Normal Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="edit-normal" className="text-sm font-medium flex items-center gap-1">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        Normal
                                    </Label>
                                    <Input
                                        id="edit-normal"
                                        type="number"
                                        min="0"
                                        value={editModalData.normal}
                                        onChange={(e) => setEditModalData(prev => prev ? { ...prev, normal: parseInt(e.target.value) || 0 } : null)}
                                        className="w-full text-lg font-semibold border-blue-200 focus:border-blue-500"
                                        autoFocus
                                    />
                                    <p className="text-[10px] text-muted-foreground">Kuota reguler</p>
                                </div>

                                {/* Fakultatif Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="edit-fakultatif" className="text-sm font-medium flex items-center gap-1">
                                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                        Fakultatif
                                    </Label>
                                    <Input
                                        id="edit-fakultatif"
                                        type="number"
                                        min="0"
                                        value={editModalData.fakultatif}
                                        onChange={(e) => setEditModalData(prev => prev ? { ...prev, fakultatif: parseInt(e.target.value) || 0 } : null)}
                                        className="w-full text-lg font-semibold border-amber-200 focus:border-amber-500"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Tambahan ekstra</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex gap-2 sm:justify-between">
                        <div>
                            {editModalData && isCellEdited(editModalData.pangkalanId, editModalData.day) && (
                                <Button variant="destructive" onClick={handleRemoveEdit} className="bg-red-500 hover:bg-red-600">
                                    <SafeIcon name="Trash2" className="w-4 h-4 mr-2" />
                                    Hapus Perubahan
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowEditModal(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleModalSave} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                                <SafeIcon name="Check" className="w-4 h-4 mr-2" />
                                Simpan
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
