/**
 * LaporanPangkalanPage - Halaman Laporan Penjualan
 * 
 * LOGIKA PERHITUNGAN (Best Practice):
 * - Harga Modal: Rp 16.000 (harga beli dari agen/refill)
 * - Harga Jual: Rp 18.000 (harga jual ke konsumen)
 * - Margin per unit: Rp 2.000
 * - Laba = Qty × (Harga Jual - Harga Modal)
 * 
 * Contoh: 178 tabung × Rp 2.000 = Rp 356.000
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from 'recharts'

// Konstanta harga
const HARGA_MODAL = 16000  // Harga beli dari agen
const HARGA_JUAL = 18000   // Harga jual ke konsumen
const MARGIN_PER_UNIT = HARGA_JUAL - HARGA_MODAL  // Rp 2.000

// Data penjualan per transaksi (referensi Excel)
const transaksiData = [
    // Tanggal 2 Desember - Refill 167 tabung
    { tanggal: '12/2/2025', pelanggan: 'MADURA', qty: 40 },
    { tanggal: '12/2/2025', pelanggan: 'TEH IMAS', qty: 4 },
    { tanggal: '12/2/2025', pelanggan: 'MANG DARA', qty: 5 },
    { tanggal: '12/2/2025', pelanggan: 'ARIS', qty: 105 },
    { tanggal: '12/2/2025', pelanggan: 'MADURA', qty: 11 },
    { tanggal: '12/2/2025', pelanggan: 'MADURA', qty: 4 },
    // Total 2 Des: 169 tabung, Pengeluaran: 200.000

    // Tanggal 3 Desember - Refill 158 tabung
    { tanggal: '12/3/2025', pelanggan: 'ARIS', qty: 80 },
    { tanggal: '12/3/2025', pelanggan: 'MADURA', qty: 10 },
    { tanggal: '12/3/2025', pelanggan: 'BU TITIN', qty: 25 },
    { tanggal: '12/3/2025', pelanggan: 'RI KUTA', qty: 5 },
    { tanggal: '12/3/2025', pelanggan: 'BU RW', qty: 23 },
    { tanggal: '12/3/2025', pelanggan: 'YULI OBIL', qty: 5 },
    { tanggal: '12/3/2025', pelanggan: 'MADURA', qty: 10 },
    // Total 3 Des: 158 tabung, Pengeluaran: 200.000

    // Tanggal 4 Desember - Refill 192 tabung
    { tanggal: '12/4/2025', pelanggan: 'ARIS', qty: 100 },
    { tanggal: '12/4/2025', pelanggan: 'MADURA', qty: 73 },
    { tanggal: '12/4/2025', pelanggan: 'MADURA', qty: 19 },
    // Total 4 Des: 192 tabung, Pengeluaran: 200.000

    // Tanggal 6 Desember - Refill 191 tabung
    { tanggal: '12/6/2025', pelanggan: 'MADURA', qty: 36 },
    { tanggal: '12/6/2025', pelanggan: 'ARIS', qty: 70 },
    { tanggal: '12/6/2025', pelanggan: 'ROHMAN ODU', qty: 8 },
    { tanggal: '12/6/2025', pelanggan: 'LUKMAN', qty: 11 },
    // Total 6 Des: 125 tabung, Pengeluaran: 200.000
]

// Pengeluaran per tanggal
const pengeluaranPerTanggal: Record<string, number> = {
    '12/2/2025': 200000,
    '12/3/2025': 200000,
    '12/4/2025': 200000,
    '12/6/2025': 200000,
}

// Process data: tambah kolom kalkulasi
const processedData = transaksiData.map((row) => ({
    ...row,
    modal: row.qty * HARGA_MODAL,
    totalHarga: row.qty * HARGA_JUAL,
    marginKotor: row.qty * MARGIN_PER_UNIT,
}))

// Aggregate by date for chart
const aggregateByDate = () => {
    const grouped: Record<string, { qty: number; modal: number; penjualan: number; margin: number; pengeluaran: number }> = {}

    processedData.forEach((row) => {
        if (!grouped[row.tanggal]) {
            grouped[row.tanggal] = { qty: 0, modal: 0, penjualan: 0, margin: 0, pengeluaran: pengeluaranPerTanggal[row.tanggal] || 0 }
        }
        grouped[row.tanggal].qty += row.qty
        grouped[row.tanggal].modal += row.modal
        grouped[row.tanggal].penjualan += row.totalHarga
        grouped[row.tanggal].margin += row.marginKotor
    })

    // Calculate laba bersih
    return Object.entries(grouped).map(([tanggal, data]) => ({
        tanggal: tanggal.replace('12/', '').replace('/2025', ' Des'),
        qty: data.qty,
        modal: data.modal,
        penjualan: data.penjualan,
        marginKotor: data.margin,
        pengeluaran: data.pengeluaran,
        labaBersih: data.margin - data.pengeluaran,
    }))
}

const chartData = aggregateByDate()

export default function LaporanPangkalanPage() {
    const [periode, setPeriode] = useState('bulan-ini')

    // Calculate grand totals
    const totals = processedData.reduce((acc, row) => ({
        qty: acc.qty + row.qty,
        modal: acc.modal + row.modal,
        penjualan: acc.penjualan + row.totalHarga,
        marginKotor: acc.marginKotor + row.marginKotor,
    }), { qty: 0, modal: 0, penjualan: 0, marginKotor: 0 })

    const totalPengeluaran = Object.values(pengeluaranPerTanggal).reduce((a, b) => a + b, 0)
    const labaBersih = totals.marginKotor - totalPengeluaran

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatCurrencyShort = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`
        if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`
        return value.toString()
    }

    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laporan Penjualan</h1>
                    <p className="text-slate-500">Perhitungan laba: Qty × (Harga Jual - Modal)</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={periode} onValueChange={setPeriode}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hari-ini">Hari Ini</SelectItem>
                            <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
                            <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
                            <SelectItem value="bulan-lalu">Bulan Lalu</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <SafeIcon name="Download" className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Info Harga */}
            <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <SafeIcon name="Info" className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-800 dark:text-blue-200">
                                <strong>Harga Modal:</strong> {formatCurrency(HARGA_MODAL)}/tabung
                            </span>
                        </div>
                        <div className="text-blue-800 dark:text-blue-200">
                            <strong>Harga Jual:</strong> {formatCurrency(HARGA_JUAL)}/tabung
                        </div>
                        <div className="text-green-700 dark:text-green-300">
                            <strong>Margin/unit:</strong> {formatCurrency(MARGIN_PER_UNIT)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Total Penjualan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totals.penjualan)}</div>
                        <p className="text-blue-100 text-xs mt-1">{totals.qty} tabung</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-600 to-slate-700 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Total Modal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totals.modal)}</div>
                        <p className="text-slate-300 text-xs mt-1">Biaya pembelian</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Margin Kotor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totals.marginKotor)}</div>
                        <p className="text-emerald-100 text-xs mt-1">Sebelum pengeluaran</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalPengeluaran)}</div>
                        <p className="text-orange-100 text-xs mt-1">Biaya operasional</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Laba Bersih</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(labaBersih)}</div>
                        <p className="text-green-100 text-xs mt-1">Margin - Pengeluaran</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
                {/* Bar Chart: Penjualan vs Modal */}
                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle>Penjualan vs Modal</CardTitle>
                        <CardDescription>Perbandingan per hari</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                    <XAxis dataKey="tanggal" stroke="#64748B" fontSize={12} />
                                    <YAxis stroke="#64748B" fontSize={12} tickFormatter={formatCurrencyShort} />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0]?.payload as any
                                                return (
                                                    <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg border border-slate-700 min-w-[200px]">
                                                        <p className="font-bold text-sm mb-2 border-b border-slate-600 pb-1">{label}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-300">📦 Qty:</span>
                                                                <span className="font-medium">{data?.qty || 0} tabung</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-blue-300">💰 Penjualan:</span>
                                                                <span className="font-medium text-blue-400">{formatCurrency(data?.penjualan || 0)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-300">🏷️ Modal:</span>
                                                                <span className="font-medium">{formatCurrency(data?.modal || 0)}</span>
                                                            </div>
                                                            <div className="flex justify-between pt-1 border-t border-slate-600">
                                                                <span className="text-green-300">✨ Margin Kotor:</span>
                                                                <span className="font-bold text-green-400">{formatCurrency(data?.marginKotor || 0)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="penjualan" name="Penjualan" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="modal" name="Modal" fill="#64748B" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Line Chart: Laba Bersih */}
                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle>Trend Laba Bersih</CardTitle>
                        <CardDescription>Laba = (Qty × Margin) - Pengeluaran</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                    <XAxis dataKey="tanggal" stroke="#64748B" fontSize={12} />
                                    <YAxis stroke="#64748B" fontSize={12} tickFormatter={formatCurrencyShort} />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0]?.payload as any
                                                return (
                                                    <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg border border-slate-700 min-w-[200px]">
                                                        <p className="font-bold text-sm mb-2 border-b border-slate-600 pb-1">{label}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-300">📦 Qty:</span>
                                                                <span className="font-medium">{data?.qty || 0} tabung</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-emerald-300">💚 Margin Kotor:</span>
                                                                <span className="font-medium text-emerald-400">{formatCurrency(data?.marginKotor || 0)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-orange-300">💸 Pengeluaran:</span>
                                                                <span className="font-medium text-orange-400">{formatCurrency(data?.pengeluaran || 0)}</span>
                                                            </div>
                                                            <div className="flex justify-between pt-1 border-t border-slate-600">
                                                                <span className="text-green-300">✨ Laba Bersih:</span>
                                                                <span className="font-bold text-green-400">{formatCurrency(data?.labaBersih || 0)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Line type="monotone" dataKey="marginKotor" name="Margin Kotor" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
                                    <Line type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#F97316" strokeWidth={2} dot={{ r: 3, fill: '#F97316' }} strokeDasharray="5 5" />
                                    <Line type="monotone" dataKey="labaBersih" name="Laba Bersih" stroke="#22C55E" strokeWidth={3} dot={{ fill: '#22C55E', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-sm text-slate-600">Margin Kotor</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <span className="text-sm text-slate-600">Pengeluaran</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm text-slate-600">Laba Bersih</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Per Tanggal */}
            <Card className="bg-white dark:bg-slate-800 shadow-lg mb-6">
                <CardHeader>
                    <CardTitle>Ringkasan Per Tanggal</CardTitle>
                    <CardDescription>Perhitungan laba harian</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50 dark:bg-slate-900">
                                    <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                                    <th className="text-right py-3 px-4 font-semibold">Qty</th>
                                    <th className="text-right py-3 px-4 font-semibold">Modal</th>
                                    <th className="text-right py-3 px-4 font-semibold">Penjualan</th>
                                    <th className="text-right py-3 px-4 font-semibold text-emerald-600">Margin Kotor</th>
                                    <th className="text-right py-3 px-4 font-semibold text-orange-600">Pengeluaran</th>
                                    <th className="text-right py-3 px-4 font-semibold text-green-600">Laba Bersih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.map((row, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <td className="py-3 px-4 font-medium">{row.tanggal}</td>
                                        <td className="py-3 px-4 text-right">{row.qty}</td>
                                        <td className="py-3 px-4 text-right">{formatCurrency(row.modal)}</td>
                                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(row.penjualan)}</td>
                                        <td className="py-3 px-4 text-right text-emerald-600">{formatCurrency(row.marginKotor)}</td>
                                        <td className="py-3 px-4 text-right text-orange-600">{formatCurrency(row.pengeluaran)}</td>
                                        <td className="py-3 px-4 text-right font-bold text-green-600">{formatCurrency(row.labaBersih)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                                    <td className="py-3 px-4">TOTAL</td>
                                    <td className="py-3 px-4 text-right">{totals.qty}</td>
                                    <td className="py-3 px-4 text-right">{formatCurrency(totals.modal)}</td>
                                    <td className="py-3 px-4 text-right text-blue-600">{formatCurrency(totals.penjualan)}</td>
                                    <td className="py-3 px-4 text-right text-emerald-600">{formatCurrency(totals.marginKotor)}</td>
                                    <td className="py-3 px-4 text-right text-orange-600">{formatCurrency(totalPengeluaran)}</td>
                                    <td className="py-3 px-4 text-right text-green-600">{formatCurrency(labaBersih)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Transaksi */}
            <Card className="bg-white dark:bg-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle>Detail Transaksi</CardTitle>
                    <CardDescription>Rincian penjualan per pelanggan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50 dark:bg-slate-900">
                                    <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                                    <th className="text-left py-3 px-4 font-semibold">Pelanggan</th>
                                    <th className="text-right py-3 px-4 font-semibold">Qty</th>
                                    <th className="text-right py-3 px-4 font-semibold">Modal (×{formatCurrency(HARGA_MODAL)})</th>
                                    <th className="text-right py-3 px-4 font-semibold">Total (×{formatCurrency(HARGA_JUAL)})</th>
                                    <th className="text-right py-3 px-4 font-semibold text-green-600">Margin (×{formatCurrency(MARGIN_PER_UNIT)})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedData.map((row, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <td className="py-3 px-4 text-slate-600">{row.tanggal}</td>
                                        <td className="py-3 px-4 font-medium">{row.pelanggan}</td>
                                        <td className="py-3 px-4 text-right">{row.qty}</td>
                                        <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(row.modal)}</td>
                                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(row.totalHarga)}</td>
                                        <td className="py-3 px-4 text-right font-bold text-green-600">{formatCurrency(row.marginKotor)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
