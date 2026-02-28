/**
 * DailySummaryCard - Kartu Ringkasan Harian
 * 
 * Menampilkan ringkasan penjualan hari ini:
 * - Total penjualan & jumlah transaksi
 * - Breakdown per tipe LPG
 * - Total pengeluaran hari ini
 * - Laba kotor (penjualan - pengeluaran)
 * 
 * Tampil di Dashboard dengan data real-time.
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { getLpgName, getLpgColor } from '@/lib/lpg-config'
import { formatCurrency } from '@/lib/format'

interface SaleBreakdown {
    lpg_type: string
    qty: number
    total: number
}

interface DailySummaryCardProps {
    /** Total penjualan hari ini (Rp) */
    totalSales: number
    /** Jumlah transaksi hari ini */
    transactionCount: number
    /** Breakdown penjualan per tipe LPG */
    salesBreakdown: SaleBreakdown[]
    /** Total pengeluaran hari ini (Rp) */
    totalExpenses: number
    /** Apakah data sedang loading */
    isLoading?: boolean
}

export default function DailySummaryCard({
    totalSales,
    transactionCount,
    salesBreakdown,
    totalExpenses,
    isLoading = false,
}: DailySummaryCardProps) {
    const profit = totalSales - totalExpenses
    const isProfitable = profit >= 0

    if (isLoading) {
        return (
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-slate-200 rounded w-1/3" />
                        <div className="h-8 bg-slate-200 rounded w-1/2" />
                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    // No data yet
    if (transactionCount === 0 && totalExpenses === 0) {
        return null // Don't show if no activity today
    }

    return (
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            {/* Background orbs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <CardHeader className="pb-2 relative">
                <CardTitle className="text-sm font-medium opacity-80 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/10">
                        <SafeIcon name="CalendarCheck" className="h-4 w-4" />
                    </div>
                    📊 Ringkasan Hari Ini
                </CardTitle>
            </CardHeader>

            <CardContent className="relative space-y-4">
                {/* Main Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Total Penjualan */}
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Penjualan</p>
                        <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalSales)}</p>
                        <p className="text-[10px] opacity-50 mt-1">{transactionCount} transaksi</p>
                    </div>

                    {/* Total Pengeluaran */}
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Pengeluaran</p>
                        <p className="text-lg font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
                    </div>

                    {/* Laba */}
                    <div className={`rounded-xl p-3 ${isProfitable ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Laba Kotor</p>
                        <p className={`text-lg font-bold ${isProfitable ? 'text-emerald-300' : 'text-red-300'}`}>
                            {isProfitable ? '+' : ''}{formatCurrency(profit)}
                        </p>
                    </div>
                </div>

                {/* LPG Breakdown */}
                {salesBreakdown.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs opacity-50 uppercase tracking-wider">Detail Penjualan</p>
                        <div className="flex flex-wrap gap-2">
                            {salesBreakdown.map(item => (
                                <Badge
                                    key={item.lpg_type}
                                    variant="secondary"
                                    className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg px-3 py-1.5"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full mr-1.5 shrink-0"
                                        style={{ backgroundColor: getLpgColor(item.lpg_type) }}
                                    />
                                    {getLpgName(item.lpg_type)}: {item.qty} tabung
                                    <span className="ml-1.5 opacity-60">({formatCurrency(item.total)})</span>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
