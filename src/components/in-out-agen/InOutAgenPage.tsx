import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import { penerimaanApi, type InOutAgenResponse } from '@/lib/api'
import { toast } from 'sonner'

export default function InOutAgenPage() {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [data, setData] = useState<InOutAgenResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const result = await penerimaanApi.getInOutAgen(selectedMonth)
            setData(result)
        } catch (error) {
            toast.error('Gagal memuat data In/Out Agen')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedMonth])

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
        if (!data) return []
        return Array.from({ length: data.days_in_month }, (_, i) => i + 1)
    }, [data])

    const today = new Date().getDate()
    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    const isCurrentMonth = selectedMonth === currentMonth

    const ROWS = [
        { key: 'stok_awal', label: 'Stok Awal', color: 'blue' },
        { key: 'penerimaan', label: 'Penerimaan', color: 'green' },
        { key: 'penyaluran', label: 'Penyaluran', color: 'orange' },
        { key: 'stok_akhir', label: 'Stok Akhir', color: 'purple' },
    ]

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Tilt3DCard>
                    <Card className="glass-card h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10">
                                    <SafeIcon name="PackagePlus" className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Stok Awal Bulan</p>
                                    <p className="text-xl font-bold">{data?.stok_awal_bulan.toLocaleString() || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Tilt3DCard>

                <Tilt3DCard>
                    <Card className="glass-card h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-green-500/10">
                                    <SafeIcon name="ArrowDownCircle" className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Penerimaan</p>
                                    <p className="text-xl font-bold text-green-600">{data?.total_penerimaan.toLocaleString() || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Tilt3DCard>

                <Tilt3DCard>
                    <Card className="glass-card h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-orange-500/10">
                                    <SafeIcon name="ArrowUpCircle" className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Penyaluran</p>
                                    <p className="text-xl font-bold text-orange-600">{data?.total_penyaluran.toLocaleString() || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Tilt3DCard>

                <Tilt3DCard>
                    <Card className="glass-card h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-500/10">
                                    <SafeIcon name="PackageOpen" className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Stok Akhir Bulan</p>
                                    <p className="text-xl font-bold text-purple-600">{data?.stok_akhir_bulan.toLocaleString() || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Tilt3DCard>
            </div>

            {/* Filter Bar */}
            <Card className="glass-card">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

                        <div className="flex items-center gap-2 sm:ml-auto">
                            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
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

            {/* In-Out Table */}
            <Card className="chart-card-premium">
                <CardHeader className="border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <CardTitle className="text-lg font-semibold">In Out Agen</CardTitle>
                        <Badge variant="outline" className="ml-auto">
                            {data?.days_in_month || 0} Hari
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div
                        className="overflow-x-auto cursor-grab active:cursor-grabbing"
                        onWheel={(e) => {
                            // Convert vertical scroll to horizontal scroll
                            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                                e.preventDefault()
                                e.currentTarget.scrollLeft += e.deltaY
                            }
                        }}
                    >
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 sticky top-0 z-20">
                                <tr>
                                    <th className="sticky left-0 z-30 bg-muted px-4 py-3 text-left font-medium min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Field</th>
                                    {dayHeaders.map(day => {
                                        const todayClass = isCurrentMonth && day === today ? 'bg-primary/20 text-primary font-bold' : ''
                                        return (
                                            <th
                                                key={day}
                                                className={`px-2 py-3 text-center font-medium min-w-[50px] ${todayClass}`}
                                            >
                                                {String(day).padStart(2, '0')}
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={dayHeaders.length + 1} className="text-center py-8">
                                            <SafeIcon name="Loader2" className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            <span className="text-muted-foreground">Memuat data...</span>
                                        </td>
                                    </tr>
                                ) : (
                                    ROWS.map(row => {
                                        // Use solid background colors for sticky columns
                                        const bgColors: Record<string, string> = {
                                            blue: '#eff6ff',    // blue-50
                                            green: '#f0fdf4',   // green-50
                                            orange: '#fff7ed',  // orange-50
                                            purple: '#faf5ff'   // purple-50
                                        }
                                        const dotColors: Record<string, string> = {
                                            blue: 'rgb(59, 130, 246)',
                                            green: 'rgb(34, 197, 94)',
                                            orange: 'rgb(249, 115, 22)',
                                            purple: 'rgb(168, 85, 247)'
                                        }
                                        return (
                                            <tr key={row.key} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                                <td
                                                    className="sticky left-0 z-10 bg-background px-4 py-3 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                                                    style={{ backgroundColor: bgColors[row.color] }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColors[row.color] }} />
                                                        {row.label}
                                                    </div>
                                                </td>
                                                {dayHeaders.map(day => {
                                                    const dayData = data?.daily[day]
                                                    const value = dayData ? dayData[row.key as keyof typeof dayData] : 0
                                                    const todayClass = isCurrentMonth && day === today ? 'bg-primary/10 font-bold' : ''
                                                    return (
                                                        <td
                                                            key={day}
                                                            className={`px-2 py-3 text-center ${todayClass} ${value === 0 && row.key !== 'stok_akhir' ? 'text-muted-foreground' : ''}`}
                                                        >
                                                            {value.toLocaleString()}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
