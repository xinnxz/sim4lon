import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SafeIcon from '@/components/common/SafeIcon'
import { penyaluranApi, type PenyaluranRekapitulasiResponse } from '@/lib/api'
import { toast } from 'sonner'

export default function PenyaluranPage() {
    const [activeTab, setActiveTab] = useState<'form' | 'rekapitulasi'>('rekapitulasi')
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [tipePembayaran, setTipePembayaran] = useState<string>('ALL')
    const [rekapData, setRekapData] = useState<PenyaluranRekapitulasiResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchRekapitulasi = async () => {
        setIsLoading(true)
        try {
            const data = await penyaluranApi.getRekapitulasi(selectedMonth, tipePembayaran !== 'ALL' ? tipePembayaran : undefined)
            setRekapData(data)
        } catch (error) {
            toast.error('Gagal memuat data rekapitulasi')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRekapitulasi()
    }, [selectedMonth, tipePembayaran])

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

    const dayHeaders = useMemo(() => {
        if (!rekapData) return []
        return Array.from({ length: rekapData.days_in_month }, (_, i) => i + 1)
    }, [rekapData])

    const today = new Date().getDate()
    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    const isCurrentMonth = selectedMonth === currentMonth

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'form' | 'rekapitulasi')}>
                <TabsList className="glass-card p-1 mb-6">
                    <TabsTrigger value="rekapitulasi" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                        <SafeIcon name="Table" className="w-4 h-4 mr-2" />
                        Rekapitulasi
                    </TabsTrigger>
                    <TabsTrigger value="form" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                        <SafeIcon name="Edit" className="w-4 h-4 mr-2" />
                        Input Form
                    </TabsTrigger>
                </TabsList>

                {/* Filter Bar */}
                <Card className="glass-card mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Bulan:</span>
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-48">
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
                                <span className="text-sm text-muted-foreground">Tipe:</span>
                                <Select value={tipePembayaran} onValueChange={setTipePembayaran}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Semua</SelectItem>
                                        <SelectItem value="CASHLESS">Cashless</SelectItem>
                                        <SelectItem value="CASH">Cash</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button variant="outline" onClick={fetchRekapitulasi} disabled={isLoading}>
                                <SafeIcon name="RefreshCw" className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>

                            <Button variant="outline" className="ml-auto">
                                <SafeIcon name="Download" className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Rekapitulasi Tab */}
                <TabsContent value="rekapitulasi">
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
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 sticky top-0">
                                        <tr>
                                            <th className="sticky left-0 bg-muted/50 px-3 py-3 text-left font-medium min-w-[120px]">ID Registrasi</th>
                                            <th className="sticky left-[120px] bg-muted/50 px-3 py-3 text-left font-medium min-w-[180px]">Nama Pangkalan</th>
                                            <th className="px-3 py-3 text-center font-medium min-w-[60px]">Status</th>
                                            <th className="px-3 py-3 text-center font-medium min-w-[70px]">Alokasi</th>
                                            {dayHeaders.map(day => (
                                                <th
                                                    key={day}
                                                    className={`px-2 py-3 text-center font-medium min-w-[45px] ${isCurrentMonth && day === today ? 'bg-primary/20 text-primary font-bold' : ''
                                                        }`}
                                                >
                                                    {String(day).padStart(2, '0')}
                                                </th>
                                            ))}
                                            <th className="px-3 py-3 text-center font-medium bg-green-500/10 min-w-[80px]">Total</th>
                                            <th className="px-3 py-3 text-center font-medium bg-orange-500/10 min-w-[80px]">Sisa Alokasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={dayHeaders.length + 6} className="text-center py-8">
                                                    <SafeIcon name="Loader2" className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                    <span className="text-muted-foreground">Memuat data...</span>
                                                </td>
                                            </tr>
                                        ) : rekapData?.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={dayHeaders.length + 6} className="text-center py-8 text-muted-foreground">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        ) : (
                                            rekapData?.data.map((row) => (
                                                <tr key={row.pangkalan_id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                                    <td className="sticky left-0 bg-background/95 px-3 py-2 font-mono text-xs">{row.id_registrasi}</td>
                                                    <td className="sticky left-[120px] bg-background/95 px-3 py-2 font-medium">{row.nama_pangkalan}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
                                                            {row.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-medium">{row.alokasi.toLocaleString()}</td>
                                                    {dayHeaders.map(day => {
                                                        const value = row.daily[day] || 0
                                                        return (
                                                            <td
                                                                key={day}
                                                                className={`px-2 py-2 text-center ${isCurrentMonth && day === today ? 'bg-primary/10' : ''
                                                                    } ${value === 0 ? 'text-red-500' : ''}`}
                                                            >
                                                                {value}
                                                            </td>
                                                        )
                                                    })}
                                                    <td className="px-3 py-2 text-center font-bold bg-green-500/5">{row.total.toLocaleString()}</td>
                                                    <td className={`px-3 py-2 text-center font-medium bg-orange-500/5 ${row.sisa_alokasi < 0 ? 'text-red-500' : ''}`}>
                                                        {row.sisa_alokasi.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {rekapData && rekapData.data.length > 0 && (
                                        <tfoot className="bg-muted/70 font-bold">
                                            <tr>
                                                <td className="sticky left-0 bg-muted/70 px-3 py-3" colSpan={2}>Total</td>
                                                <td className="px-3 py-3"></td>
                                                <td className="px-3 py-3 text-center">
                                                    {rekapData.data.reduce((sum, r) => sum + r.alokasi, 0).toLocaleString()}
                                                </td>
                                                {dayHeaders.map(day => (
                                                    <td key={day} className={`px-2 py-3 text-center ${isCurrentMonth && day === today ? 'bg-primary/20' : ''}`}>
                                                        {rekapData.data.reduce((sum, r) => sum + (r.daily[day] || 0), 0).toLocaleString()}
                                                    </td>
                                                ))}
                                                <td className="px-3 py-3 text-center bg-green-500/10">
                                                    {rekapData.data.reduce((sum, r) => sum + r.total, 0).toLocaleString()}
                                                </td>
                                                <td className="px-3 py-3 text-center bg-orange-500/10">
                                                    {rekapData.data.reduce((sum, r) => sum + r.sisa_alokasi, 0).toLocaleString()}
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
                                <p className="text-sm">Coming soon - Editable grid untuk input penyaluran harian</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
