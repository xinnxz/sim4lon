import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SafeIcon from '@/components/common/SafeIcon'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import { penerimaanApi, type InOutAgenResponse } from '@/lib/api'
import { toast } from 'sonner'
import AnimatedNumber from '@/components/common/AnimatedNumber'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import pertaminaLogo from '@/assets/logo-pertamina.png'
import { getAgenProfileFromAPI } from '@/lib/pertamina-export'

// Helper to load image as base64
const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(img, 0, 0)
                resolve(canvas.toDataURL('image/png'))
            } else {
                reject(new Error('Cannot get canvas context'))
            }
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = url
    })
}

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

    // Get month label for export
    const getMonthLabel = () => {
        const [year, month] = selectedMonth.split('-')
        return new Date(parseInt(year), parseInt(month) - 1, 1)
            .toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    }

    // Handle Download PDF for pivot table - Pertamina Format
    const handleDownloadPDF = async () => {
        if (!data) {
            toast.error('Tidak ada data untuk di-download')
            return
        }

        try {
            toast.loading('Generating PDF...', { id: 'pdf-export' })

            const doc = new jsPDF({ orientation: 'landscape' })
            const pageWidth = doc.internal.pageSize.getWidth()
            const margin = 14

            // Get agen profile from API
            const agenProfile = await getAgenProfileFromAPI()

            // ========== HEADER PERTAMINA ==========
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(10)
            doc.text('PT. Pertamina (Persero)', margin, 12)
            doc.setFontSize(8)
            doc.text('Jl.Medan Merdeka Timur No. 1A Jakarta 10110', margin, 17)
            doc.text('Telp: 021 3815111 FAX: 021 3633585', margin, 22)

            // Add Pertamina logo at top-right corner
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const logoData = pertaminaLogo as any
                const logoUrl: string = typeof logoData === 'string' ? logoData : logoData.src
                const logoBase64 = await loadImageAsBase64(logoUrl)
                doc.addImage(logoBase64, 'PNG', pageWidth - 70, 8, 55, 13)
            } catch (logoError) {
                console.warn('[PDF Export] Could not load Pertamina logo:', logoError)
            }

            // ========== TITLE ==========
            const [year, month] = selectedMonth.split('-')
            const monthName = new Date(parseInt(year), parseInt(month) - 1, 1)
                .toLocaleDateString('id-ID', { month: 'long' }).toUpperCase()

            doc.setFontSize(11)
            doc.setFont('helvetica', 'bold')
            doc.text(`LAPORAN IN OUT AGEN PERIODE ${monthName} ${year}`, pageWidth / 2, 35, { align: 'center' })

            // ========== INFO AGEN ==========
            let yPos = 45
            doc.setFontSize(8)
            doc.setFont('helvetica', 'normal')

            const agenFields = [
                { label: 'Nama Agen', value: agenProfile.nama_agen },
                { label: 'Alamat Agen', value: agenProfile.alamat_agen },
                { label: 'Email', value: agenProfile.email },
                { label: 'No. Sold To', value: agenProfile.no_siid },
                { label: 'Wilayah', value: agenProfile.wilayah },
            ]

            agenFields.forEach(field => {
                doc.text(`${field.label}`, margin, yPos)
                doc.text(`:`, margin + 25, yPos)
                doc.text(field.value, margin + 28, yPos)
                yPos += 4
            })

            // ========== TABLE ==========
            yPos += 5

            // Helper untuk mendapatkan nama hari singkat dalam bahasa Indonesia
            const getDayName = (date: Date): string => {
                const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
                return days[date.getDay()]
            }

            // Build table headers with date + day format (like Perencanaan)
            const headers = ['Field', ...dayHeaders.map(d => {
                const date = new Date(parseInt(year), parseInt(month) - 1, d)
                const dayName = getDayName(date)
                return `${String(d).padStart(2, '0')}\n${dayName}`
            })]

            // Build table data
            const tableData = ROWS.map(row => {
                const rowData = [row.label]
                dayHeaders.forEach(day => {
                    const dayData = data.daily[day]
                    const value = dayData ? dayData[row.key as keyof typeof dayData] : 0
                    rowData.push(value.toLocaleString())
                })
                return rowData
            })

            autoTable(doc, {
                startY: yPos,
                head: [headers],
                body: tableData,
                theme: 'grid',
                styles: {
                    fontSize: 6,
                    cellPadding: 1.5,
                    halign: 'center',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                },
                headStyles: {
                    fillColor: [128, 0, 0], // Maroon like Pertamina
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 6,
                },
                columnStyles: { 0: { halign: 'left', cellWidth: 22 } },
                alternateRowStyles: { fillColor: [255, 255, 255] },
            })

            doc.save(`Laporan_InOut_Agen_${selectedMonth}.pdf`)
            toast.success('PDF berhasil di-download!', { id: 'pdf-export' })
        } catch (error) {
            console.error('PDF export error:', error)
            toast.error('Gagal export PDF', { id: 'pdf-export' })
        }
    }

    // Handle Download Excel for pivot table
    const handleDownloadExcel = () => {
        if (!data) {
            toast.error('Tidak ada data untuk di-download')
            return
        }

        try {
            toast.loading('Generating Excel...', { id: 'excel-export' })

            const wb = XLSX.utils.book_new()
            const wsData: (string | number)[][] = []

            // Title
            wsData.push([`Laporan In Out Agen - ${getMonthLabel()}`])
            wsData.push([])

            // Summary
            wsData.push(['Ringkasan'])
            wsData.push(['Stok Awal Bulan', data.stok_awal_bulan || 0])
            wsData.push(['Total Penerimaan', data.total_penerimaan || 0])
            wsData.push(['Total Penyaluran', data.total_penyaluran || 0])
            wsData.push(['Stok Akhir Bulan', data.stok_akhir_bulan || 0])
            wsData.push([])

            // Table headers
            const headers = ['Field', ...dayHeaders.map(d => String(d).padStart(2, '0'))]
            wsData.push(headers)

            // Table data
            ROWS.forEach(row => {
                const rowData: (string | number)[] = [row.label]
                dayHeaders.forEach(day => {
                    const dayData = data.daily[day]
                    const value = dayData ? dayData[row.key as keyof typeof dayData] : 0
                    rowData.push(value)
                })
                wsData.push(rowData)
            })

            const ws = XLSX.utils.aoa_to_sheet(wsData)

            // Set column widths
            ws['!cols'] = [{ wch: 15 }, ...dayHeaders.map(() => ({ wch: 6 }))]

            XLSX.utils.book_append_sheet(wb, ws, 'In Out Agen')
            XLSX.writeFile(wb, `Laporan_InOut_Agen_${selectedMonth}.xlsx`)

            toast.success('Excel berhasil di-download!', { id: 'excel-export' })
        } catch (error) {
            console.error('Excel export error:', error)
            toast.error('Gagal export Excel', { id: 'excel-export' })
        }
    }

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
                                    <p className="text-xl font-bold"><AnimatedNumber value={data?.stok_awal_bulan || 0} delay={100} /></p>
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
                                    <p className="text-xl font-bold text-green-600"><AnimatedNumber value={data?.total_penerimaan || 0} delay={200} /></p>
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
                                    <p className="text-xl font-bold text-orange-600"><AnimatedNumber value={data?.total_penyaluran || 0} delay={300} /></p>
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
                                    <p className="text-xl font-bold text-purple-600"><AnimatedNumber value={data?.stok_akhir_bulan || 0} delay={400} /></p>
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
                                        // Use class-based colors that support dark mode
                                        const bgClasses: Record<string, string> = {
                                            blue: 'bg-blue-50',
                                            green: 'bg-green-50',
                                            orange: 'bg-orange-50',
                                            purple: 'bg-purple-50'
                                        }
                                        const dotColors: Record<string, string> = {
                                            blue: 'bg-blue-500',
                                            green: 'bg-green-500',
                                            orange: 'bg-orange-500',
                                            purple: 'bg-purple-500'
                                        }
                                        return (
                                            <tr key={row.key} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                                <td
                                                    className={`sticky left-0 z-10 px-4 py-3 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${bgClasses[row.color]}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${dotColors[row.color]}`} />
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
