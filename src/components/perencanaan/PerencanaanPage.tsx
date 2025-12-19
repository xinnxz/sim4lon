import { useState, useEffect, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SafeIcon from '@/components/common/SafeIcon'
import { perencanaanApi, pangkalanApi, lpgProductsApi, type PerencanaanRekapitulasiResponse, type Pangkalan, type LpgProduct } from '@/lib/api'
import { toast } from 'sonner'

export default function PerencanaanPage() {
    const [activeTab, setActiveTab] = useState<'form' | 'rekapitulasi'>('rekapitulasi')
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [kondisi, setKondisi] = useState<string>('NORMAL')
    const [tipePembayaran, setTipePembayaran] = useState<string>('ALL')
    const [selectedLpgType, setSelectedLpgType] = useState<string>('kg3')
    const [rekapData, setRekapData] = useState<PerencanaanRekapitulasiResponse | null>(null)
    const [pangkalans, setPangkalans] = useState<Pangkalan[]>([])
    const [lpgProducts, setLpgProducts] = useState<LpgProduct[]>([])
    const [isLoading, setIsLoading] = useState(false)

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

    // LPG Type options - from API or fallback
    const lpgTypeOptions = useMemo(() => {
        if (lpgProducts.length > 0) {
            return lpgProducts.map(p => {
                const lpgType = `kg${p.size_kg}`.replace('.', '')
                return {
                    value: lpgType,
                    label: p.name,
                    description: p.category === 'SUBSIDI' ? 'Subsidi' : 'Non-Subsidi'
                }
            })
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
            toast.error('Gagal memuat data rekapitulasi')
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch pangkalans
    const fetchPangkalans = async () => {
        try {
            const response = await pangkalanApi.getAll(1, 100)
            setPangkalans(response.data)
        } catch (error) {
            console.error('Error fetching pangkalans:', error)
        }
    }

    useEffect(() => {
        fetchLpgProducts()
        fetchPangkalans()
    }, [])

    useEffect(() => {
        fetchRekapitulasi()
    }, [selectedMonth, kondisi, selectedLpgType])

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
        if (!rekapData) return { totalPangkalan: 0, totalAlokasi: 0, totalRealisasi: 0, sisaAlokasi: 0 }
        return {
            totalPangkalan: rekapData.data.length,
            totalAlokasi: rekapData.data.reduce((sum, r) => sum + r.alokasi, 0),
            totalRealisasi: rekapData.data.reduce((sum, r) => sum + r.total_normal + r.total_fakultatif, 0),
            sisaAlokasi: rekapData.data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
        }
    }, [rekapData])

    // Today's date
    const today = new Date().getDate()
    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    const isCurrentMonth = selectedMonth === currentMonth

    // Highlight end-of-week days (Sunday)
    const isSunday = (dayInfo: { day: number; dayName: string; isSunday: boolean }): boolean => dayInfo.isSunday

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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                                            rekapData?.data.map((row, idx) => (
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
                                                    <td className="px-3 py-2 text-center font-medium bg-green-500/5">{row.total_normal.toLocaleString()}</td>
                                                    <td className="px-3 py-2 text-center font-medium bg-blue-500/5">{row.total_fakultatif.toLocaleString()}</td>
                                                    <td className={`px-3 py-2 text-center font-medium bg-orange-500/5 ${row.sisa_alokasi < 0 ? 'text-red-500' : ''}`}>
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
                                                    const weekClass = isSunday(dayInfo) ? 'bg-red-100 dark:bg-red-900/30' : ''
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

                {/* Form Tab */}
                <TabsContent value="form">
                    <Card className="chart-card-premium">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <CardTitle className="text-lg font-semibold">Input Perencanaan</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="text-center py-12 text-muted-foreground">
                                <SafeIcon name="Construction" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">Fitur Input Form</p>
                                <p className="text-sm">Coming soon - Editable grid untuk input perencanaan harian</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
