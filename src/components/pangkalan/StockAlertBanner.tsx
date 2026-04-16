/**
 * StockAlertBanner - Banner Peringatan Stok Rendah
 * 
 * Menampilkan alert di atas dashboard saat ada stok LPG yang
 * di bawah threshold. Bisa dismiss per sesi.
 * 
 * @example
 * <StockAlertBanner stockLevels={stockData} />
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { getLpgName, getLpgColor } from '@/lib/lpg-config'

// Default threshold per LPG type
const DEFAULT_THRESHOLDS: Record<string, number> = {
    'kg3': 20,
    '3kg': 20,
    'kg5': 10,
    '5kg': 10,
    'kg12': 5,
    '12kg': 5,
    'kg50': 3,
    '50kg': 3,
    'gr220': 10,
    '220gr': 10,
}

interface StockLevel {
    lpg_type: string
    qty: number
}

interface StockAlertBannerProps {
    stockLevels: StockLevel[]
    /** Custom threshold per type, defaults provided */
    thresholds?: Record<string, number>
    /** Callback saat tombol "Tambah Stok" ditekan */
    onAddStock?: () => void
}

export default function StockAlertBanner({
    stockLevels,
    thresholds = DEFAULT_THRESHOLDS,
    onAddStock,
}: StockAlertBannerProps) {
    const [isDismissed, setIsDismissed] = useState(false)

    if (isDismissed) return null

    // Find low stock items
    const lowStockItems = stockLevels.filter(s => {
        const threshold = thresholds[s.lpg_type] || 10
        return s.qty <= threshold && s.qty > 0
    })

    const emptyStockItems = stockLevels.filter(s => s.qty <= 0)

    if (lowStockItems.length === 0 && emptyStockItems.length === 0) return null

    const hasEmpty = emptyStockItems.length > 0
    const isCritical = hasEmpty || lowStockItems.some(s => s.qty <= 3)

    return (
        <div className={`relative overflow-hidden rounded-2xl border-2 p-4 mb-4 animate-fadeInDown ${isCritical
            ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
            : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
            }`}>
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 ${isCritical ? 'bg-red-100/50' : 'bg-amber-100/50'
                }`} />

            <div className="relative flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${isCritical
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                    <SafeIcon
                        name={isCritical ? 'AlertTriangle' : 'AlertCircle'}
                        className={`h-5 w-5 ${isCritical ? 'text-red-600 animate-pulse' : 'text-amber-600'}`}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${isCritical ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'
                        }`}>
                        {isCritical ? '⚠️ Stok Kritis!' : '📦 Stok Menipis'}
                    </h4>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {/* Empty stock */}
                        {emptyStockItems.map(s => (
                            <span
                                key={s.lpg_type}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                {getLpgName(s.lpg_type)}: HABIS
                            </span>
                        ))}

                        {/* Low stock */}
                        {lowStockItems.map(s => (
                            <span
                                key={s.lpg_type}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLpgColor(s.lpg_type) }} />
                                {getLpgName(s.lpg_type)}: {s.qty} sisa
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                        {onAddStock && (
                            <Button
                                size="sm"
                                onClick={onAddStock}
                                className={`rounded-lg text-xs h-8 ${isCritical
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                                    }`}
                            >
                                <SafeIcon name="PackagePlus" className="h-3.5 w-3.5 mr-1" />
                                Tambah Stok
                            </Button>
                        )}
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="text-xs text-slate-500 hover:text-slate-700 underline"
                        >
                            Tutup
                        </button>
                    </div>
                </div>

                {/* Dismiss X */}
                <button
                    onClick={() => setIsDismissed(true)}
                    className="p-1 rounded-lg hover:bg-black/5 shrink-0"
                >
                    <SafeIcon name="X" className="h-4 w-4 text-slate-400" />
                </button>
            </div>
        </div>
    )
}
