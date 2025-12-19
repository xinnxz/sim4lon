import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { penerimaanApi, type PenerimaanStok, type PaginatedResponse } from '@/lib/api'
import { toast } from 'sonner'

export default function PenerimaanPage() {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [data, setData] = useState<PaginatedResponse<PenerimaanStok> | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const result = await penerimaanApi.getAll({ bulan: selectedMonth, page, limit: 25 })
            setData(result)
        } catch (error) {
            toast.error('Gagal memuat data penerimaan')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedMonth, page])

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <Card className="glass-card">
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

                        <Button variant="outline" onClick={fetchData} disabled={isLoading}>
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

            {/* Data Table */}
            <Card className="chart-card-premium">
                <CardHeader className="border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <CardTitle className="text-lg font-semibold">Rekapitulasi Penerimaan</CardTitle>
                        <Badge variant="outline" className="ml-auto">
                            {data?.meta.total || 0} Entries
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                    <th className="px-4 py-3 text-left font-medium">No SO</th>
                                    <th className="px-4 py-3 text-left font-medium">No LO</th>
                                    <th className="px-4 py-3 text-left font-medium">Nama Material</th>
                                    <th className="px-4 py-3 text-center font-medium">Qty Pcs</th>
                                    <th className="px-4 py-3 text-center font-medium">Qty Kg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8">
                                            <SafeIcon name="Loader2" className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            <span className="text-muted-foreground">Memuat data...</span>
                                        </td>
                                    </tr>
                                ) : data?.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data penerimaan untuk bulan ini
                                        </td>
                                    </tr>
                                ) : (
                                    data?.data.map((item) => (
                                        <tr key={item.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">{formatDate(item.tanggal)}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{item.no_so}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{item.no_lo}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-blue-600">{item.nama_material}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium">{item.qty_pcs.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center font-medium">{Number(item.qty_kg).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data && data.meta.totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
                            <span className="text-sm text-muted-foreground">
                                Showing {((page - 1) * 25) + 1} to {Math.min(page * 25, data.meta.total)} of {data.meta.total} entries
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <SafeIcon name="ChevronLeft" className="w-4 h-4" />
                                </Button>
                                <span className="text-sm px-2">{page} / {data.meta.totalPages}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(data.meta.totalPages, p + 1))}
                                    disabled={page === data.meta.totalPages}
                                >
                                    <SafeIcon name="ChevronRight" className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
