/**
 * DSS Advanced Section - Reorder Point & Sales Trend
 * 
 * Fitur DSS Lanjutan:
 * - Reorder Point Calculator: Kapan harus pesan ulang ke SPBE
 * - Sales Trend Analysis: Pola penjualan dan peak days
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SafeIcon from '@/components/common/SafeIcon';
import {
    dashboardApi,
    type ReorderPointData,
    type ReorderPointItem,
    type SalesTrendData
} from '@/lib/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';

// ============================================================
// SKELETON LOADERS
// ============================================================

function DSSAdvancedSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-80 bg-muted rounded-2xl animate-pulse" />
                <div className="h-80 bg-muted rounded-2xl animate-pulse" />
            </div>
        </div>
    );
}

// ============================================================
// REORDER POINT CARD
// ============================================================

function ReorderPointCard({ data }: { data: ReorderPointData }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'critical': return 'bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-500/30';
            case 'warning': return 'bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30';
            case 'overstocked': return 'bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30';
            default: return 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'critical': return <Badge variant="destructive">Kritis</Badge>;
            case 'warning': return <Badge className="bg-amber-500 text-white">Perlu Pesan</Badge>;
            case 'overstocked': return <Badge variant="secondary">Stok Berlebih</Badge>;
            default: return <Badge className="bg-emerald-500 text-white">Aman</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'critical': return <SafeIcon name="AlertTriangle" className="w-5 h-5 text-red-500" />;
            case 'warning': return <SafeIcon name="Clock" className="w-5 h-5 text-amber-500" />;
            case 'overstocked': return <SafeIcon name="PackagePlus" className="w-5 h-5 text-blue-500" />;
            default: return <SafeIcon name="CheckCircle2" className="w-5 h-5 text-emerald-500" />;
        }
    };

    return (
        <Card className="bg-card shadow-lg rounded-2xl border-0 overflow-hidden h-[520px] flex flex-col">
            <CardHeader className="pb-3 border-b shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <SafeIcon name="Calculator" className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold">Reorder Point</CardTitle>
                            <p className="text-xs text-muted-foreground">Kapan harus pesan ulang?</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {data.summary.criticalCount > 0 && (
                            <Badge variant="destructive" className="animate-pulse">
                                {data.summary.criticalCount} kritis
                            </Badge>
                        )}
                        {data.summary.warningCount > 0 && (
                            <Badge className="bg-amber-500 text-white">
                                {data.summary.warningCount} perlu pesan
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                {data.data.map((item: ReorderPointItem) => (
                    <div
                        key={item.productId}
                        className={`p-4 rounded-xl border transition-all hover:shadow-md ${getStatusColor(item.status)}`}
                    >
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                <div>
                                    <p className="font-semibold text-foreground">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Stok: {item.currentStock} unit | ROP: {item.reorderPoint} unit
                                    </p>
                                </div>
                            </div>
                            {getStatusBadge(item.status)}
                        </div>

                        {/* Progress bar showing stock vs reorder point */}
                        <div className="mb-2">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${item.status === 'critical' ? 'bg-red-500' :
                                        item.status === 'warning' ? 'bg-amber-500' :
                                            item.status === 'overstocked' ? 'bg-blue-500' : 'bg-emerald-500'
                                        }`}
                                    style={{
                                        width: `${Math.min((item.currentStock / (item.reorderPoint * 2)) * 100, 100)}%`
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs text-center mb-2">
                            <div className="bg-muted/50 rounded-lg p-2">
                                <p className="text-muted-foreground">Avg/Hari</p>
                                <p className="font-semibold">{item.avgDailyDemand}</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-2">
                                <p className="text-muted-foreground">Habis Dalam</p>
                                <p className="font-semibold">{item.daysUntilStockout} hari</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-2">
                                <p className="text-muted-foreground">Saran Pesan</p>
                                <p className="font-semibold">{item.suggestedOrderQty} unit</p>
                            </div>
                        </div>

                        {item.needsReorder && (
                            <div className="flex items-start gap-2 text-xs bg-muted/50 p-2 rounded-lg">
                                <SafeIcon name="Lightbulb" className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                                <span className="text-muted-foreground">{item.recommendation}</span>
                            </div>
                        )}
                    </div>
                ))}

                {data.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <SafeIcon name="Package" className="w-12 h-12 mb-2 opacity-50" />
                        <p>Tidak ada produk untuk dianalisis</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================================
// SALES TREND CARD
// ============================================================

function SalesTrendCard({ data }: { data: SalesTrendData }) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

    const formatShortCurrency = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
        return value.toString();
    };

    const getGrowthColor = (rate: number) => {
        if (rate > 0) return 'text-emerald-500';
        if (rate < 0) return 'text-red-500';
        return 'text-muted-foreground';
    };

    const getGrowthIcon = (rate: number) => {
        if (rate > 0) return 'TrendingUp';
        if (rate < 0) return 'TrendingDown';
        return 'Minus';
    };

    return (
        <Card className="bg-card shadow-lg rounded-2xl border-0 overflow-hidden h-[520px] flex flex-col">
            <CardHeader className="pb-3 border-b shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <SafeIcon name="TrendingUp" className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold">Tren Penjualan</CardTitle>
                            <p className="text-xs text-muted-foreground">Analisis 4 minggu terakhir</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 ${getGrowthColor(data.statistics.growthRate)}`}>
                        <SafeIcon name={getGrowthIcon(data.statistics.growthRate)} className="w-4 h-4" />
                        <span className="font-semibold">
                            {data.statistics.growthRate > 0 ? '+' : ''}{data.statistics.growthRate}%
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-hide">
                {/* Insights */}
                <div className="space-y-2">
                    {data.insights.map((insight, index) => (
                        <div
                            key={index}
                            className="text-sm bg-muted/50 p-2 rounded-lg"
                        >
                            {insight}
                        </div>
                    ))}
                </div>

                {/* Weekly Pattern Chart */}
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.weeklyPattern}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 11 }}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                tick={{ fontSize: 10 }}
                                tickFormatter={formatShortCurrency}
                            />
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                labelFormatter={(label) => `Hari ${label}`}
                            />
                            <Bar
                                dataKey="avgSales"
                                name="Rata-rata Penjualan"
                                fill="#8b5cf6"
                                radius={[4, 4, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={800}
                                animationEasing="ease-out"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Peak Days */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <SafeIcon name="Flame" className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Hari Tersibuk</span>
                        </div>
                        {data.peakDays.slice(0, 2).map((peak, index) => (
                            <p key={index} className="text-sm">
                                <span className="font-semibold">{peak.day}</span>
                                <span className="text-muted-foreground"> • {formatShortCurrency(peak.avgSales)}/hari</span>
                            </p>
                        ))}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-500/10 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <SafeIcon name="Moon" className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Hari Sepi</span>
                        </div>
                        {data.lowDays.slice(0, 2).map((low, index) => (
                            <p key={index} className="text-sm">
                                <span className="font-semibold">{low.day}</span>
                                <span className="text-muted-foreground"> • {formatShortCurrency(low.avgSales)}/hari</span>
                            </p>
                        ))}
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Total Penjualan</p>
                        <p className="font-semibold text-sm">{formatShortCurrency(data.statistics.totalSales)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Total Order</p>
                        <p className="font-semibold text-sm">{data.statistics.totalOrders}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Avg/Hari</p>
                        <p className="font-semibold text-sm">{formatShortCurrency(data.statistics.avgDailySales)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Avg Order/Hari</p>
                        <p className="font-semibold text-sm">{data.statistics.avgDailyOrders}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DSSAdvancedSection() {
    const [reorderData, setReorderData] = useState<ReorderPointData | null>(null);
    const [trendData, setTrendData] = useState<SalesTrendData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            if (reorderData || trendData) setIsRefreshing(true);
            else setLoading(true);
            setError(null);

            const [reorder, trend] = await Promise.all([
                dashboardApi.getReorderPoint(),
                dashboardApi.getSalesTrend()
            ]);

            setReorderData(reorder);
            setTrendData(trend);
        } catch (err) {
            console.error('Failed to fetch DSS advanced data:', err);
            setError('Gagal memuat data DSS lanjutan');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    if (loading) {
        return <DSSAdvancedSkeleton />;
    }

    if (error) {
        return (
            <Card className="bg-card shadow-lg rounded-2xl border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <SafeIcon name="AlertCircle" className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={fetchData} variant="outline">
                        <SafeIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                        Coba Lagi
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500" />
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Prediksi Penjualan
                        </h2>
                        <p className="text-sm text-muted-foreground/80">Reorder Point & Tren Penjualan</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchData}
                    disabled={isRefreshing}
                >
                    <SafeIcon name="RefreshCw" className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Loading...' : 'Refresh'}
                </Button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {reorderData && (
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <ReorderPointCard data={reorderData} />
                    </div>
                )}
                {trendData && (
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <SalesTrendCard data={trendData} />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="text-xs text-muted-foreground text-right">
                Last updated: {new Date(reorderData?.generatedAt || trendData?.generatedAt || '').toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })}
            </div>
        </div>
    );
}
