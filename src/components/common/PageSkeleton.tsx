/**
 * PageSkeleton - Reusable Skeleton Loading Component
 * 
 * Menampilkan skeleton placeholder saat data sedang di-load.
 * Mendukung beberapa variant sesuai tipe halaman.
 * 
 * @example
 * // Di halaman penjualan/stok/konsumen:
 * if (isLoading) return <PageSkeleton variant="table" />
 * 
 * // Di dashboard:
 * if (isLoading) return <PageSkeleton variant="dashboard" />
 */

'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Shimmer animation class
const shimmer = "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded"

// Single skeleton line
function SkeletonLine({ width = "w-full", height = "h-4" }: { width?: string; height?: string }) {
    return <div className={`${shimmer} ${width} ${height} rounded-md`} />
}

// Skeleton stat card  
function SkeletonStatCard({ gradient = false }: { gradient?: boolean }) {
    return (
        <Card className={`relative overflow-hidden ${gradient ? 'bg-gradient-to-br from-slate-200 to-slate-300' : 'bg-white'} shadow-sm border-0`}>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <div className={`${shimmer} w-8 h-8 rounded-lg`} />
                    <SkeletonLine width="w-24" height="h-3" />
                </div>
            </CardHeader>
            <CardContent>
                <SkeletonLine width="w-32" height="h-8" />
                <SkeletonLine width="w-16" height="h-3" />
            </CardContent>
        </Card>
    )
}

// Skeleton table row
function SkeletonTableRow() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-slate-100">
            <div className={`${shimmer} w-10 h-10 rounded-xl shrink-0`} />
            <div className="flex-1 space-y-2">
                <SkeletonLine width="w-3/4" height="h-4" />
                <SkeletonLine width="w-1/2" height="h-3" />
            </div>
            <SkeletonLine width="w-20" height="h-6" />
        </div>
    )
}

// Skeleton chart area
function SkeletonChart() {
    return (
        <Card className="bg-white shadow-sm border-0 overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <div className={`${shimmer} w-8 h-8 rounded-lg`} />
                    <SkeletonLine width="w-40" height="h-5" />
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className={`${shimmer} w-full h-[200px] rounded-xl`} />
            </CardContent>
        </Card>
    )
}

// ===== Main PageSkeleton Component =====

type SkeletonVariant = 'dashboard' | 'table' | 'cards' | 'form' | 'detail'

interface PageSkeletonProps {
    /** Tipe skeleton sesuai layout halaman */
    variant?: SkeletonVariant
    /** Jumlah stat cards di atas */
    statCards?: number
    /** Jumlah baris tabel/list */
    rows?: number
    /** Tampilkan chart skeleton */
    showChart?: boolean
    /** Custom title di header */
    title?: string
}

export default function PageSkeleton({
    variant = 'table',
    statCards = 4,
    rows = 5,
    showChart = false,
    title,
}: PageSkeletonProps) {
    return (
        <div className="space-y-6 pb-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3">
                <div className={`${shimmer} w-1.5 h-12 rounded-full`} />
                <div className="space-y-2">
                    <SkeletonLine width={title ? "w-48" : "w-32"} height="h-7" />
                    <SkeletonLine width="w-56" height="h-4" />
                </div>
            </div>

            {/* Stat Cards */}
            {(variant === 'dashboard' || variant === 'table' || variant === 'cards') && (
                <div className={`grid gap-4 grid-cols-2 lg:grid-cols-${statCards}`}>
                    {Array.from({ length: statCards }).map((_, i) => (
                        <SkeletonStatCard key={i} gradient={i === 0} />
                    ))}
                </div>
            )}

            {/* Chart */}
            {(variant === 'dashboard' || showChart) && <SkeletonChart />}

            {/* Table/List */}
            {(variant === 'table' || variant === 'dashboard') && (
                <Card className="bg-white shadow-sm border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`${shimmer} w-8 h-8 rounded-lg`} />
                                <SkeletonLine width="w-32" height="h-5" />
                            </div>
                            <SkeletonLine width="w-24" height="h-8" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {Array.from({ length: rows }).map((_, i) => (
                            <SkeletonTableRow key={i} />
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Cards Grid */}
            {variant === 'cards' && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: rows }).map((_, i) => (
                        <Card key={i} className="bg-white shadow-sm border-0 overflow-hidden">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`${shimmer} w-12 h-12 rounded-full`} />
                                    <div className="flex-1 space-y-2">
                                        <SkeletonLine width="w-3/4" height="h-4" />
                                        <SkeletonLine width="w-1/2" height="h-3" />
                                    </div>
                                </div>
                                <SkeletonLine width="w-full" height="h-10" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Form */}
            {variant === 'form' && (
                <Card className="bg-white shadow-sm border-0 overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <SkeletonLine width="w-24" height="h-4" />
                                <SkeletonLine width="w-full" height="h-10" />
                            </div>
                        ))}
                        <SkeletonLine width="w-32" height="h-10" />
                    </CardContent>
                </Card>
            )}

            {/* Detail */}
            {variant === 'detail' && (
                <Card className="bg-white shadow-sm border-0 overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`${shimmer} w-16 h-16 rounded-xl`} />
                            <div className="flex-1 space-y-2">
                                <SkeletonLine width="w-48" height="h-6" />
                                <SkeletonLine width="w-32" height="h-4" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <SkeletonLine width="w-20" height="h-3" />
                                    <SkeletonLine width="w-full" height="h-5" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

// Export sub-components for granular use
export { SkeletonLine, SkeletonStatCard, SkeletonTableRow, SkeletonChart }
