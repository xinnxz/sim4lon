/**
 * DSS Alert Section - Decision Support System Alerts
 * 
 * Theme-Matched Version - Sesuai dengan dashboard theme
 * Uses: bg-card, gradients, rounded-2xl, shadow-lg
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SafeIcon from '@/components/common/SafeIcon';
import { dashboardApi, type DSSAlertsData, type LowStockAlert, type PaymentOverdueAlert } from '@/lib/api';

/**
 * Skeleton loading dengan shimmer effect
 */
function DSSAlertSkeleton() {
    return (
        <div className="space-y-5">
            {/* Header skeleton */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
                <div className="space-y-2">
                    <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-32 bg-muted/50 rounded animate-pulse" />
                </div>
            </div>

            {/* Health + Stats skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 h-40 bg-muted rounded-2xl animate-pulse" />
                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Alert cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-48 bg-muted rounded-2xl animate-pulse" />
                <div className="h-48 bg-muted rounded-2xl animate-pulse" />
            </div>
        </div>
    );
}

/**
 * Health Score Ring - Animated SVG dengan gradient
 */
function HealthScoreRing({ score }: { score: number }) {
    const size = 120;
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    const getColor = (score: number) => {
        if (score >= 80) return { main: 'text-emerald-500', bg: 'from-emerald-500 to-teal-500', label: 'Excellent' };
        if (score >= 60) return { main: 'text-amber-500', bg: 'from-amber-500 to-yellow-500', label: 'Good' };
        if (score >= 40) return { main: 'text-orange-500', bg: 'from-orange-500 to-red-500', label: 'Fair' };
        return { main: 'text-red-500', bg: 'from-red-500 to-rose-500', label: 'Critical' };
    };

    const colors = getColor(score);

    return (
        <Card className="bg-card dark:bg-card shadow-lg rounded-2xl border-0 overflow-hidden">
            {/* Floating orb decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2" />

            <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-6">
                    {/* Ring */}
                    <div className="relative" style={{ width: size, height: size }}>
                        <svg className="transform -rotate-90" width={size} height={size}>
                            <defs>
                                <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" className={colors.main.replace('text-', 'stop-')} />
                                    <stop offset="100%" className={colors.main.replace('text-', 'stop-')} style={{ stopOpacity: 0.6 }} />
                                </linearGradient>
                            </defs>
                            {/* Background ring */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                className="text-muted"
                            />
                            {/* Progress ring */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={`${progress} ${circumference}`}
                                className={`${colors.main} transition-all duration-1000 ease-out`}
                            />
                        </svg>
                        {/* Center number */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl font-bold ${colors.main}`}>{score}</span>
                            <span className="text-xs text-muted-foreground font-medium">{colors.label}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">Health Score</h3>
                        <p className="text-sm text-muted-foreground">
                            {score >= 80
                                ? 'Semua sistem berjalan optimal'
                                : score >= 60
                                    ? 'Ada beberapa hal perlu diperhatikan'
                                    : 'Diperlukan tindakan segera'
                            }
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Stat Card - Matching KPI card style
 */
function StatCard({ label, value, icon, gradient, textColor }: {
    label: string;
    value: number;
    icon: string;
    gradient: string;
    textColor: string;
}) {
    return (
        <div className={`group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${gradient} text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}>
            {/* Floating orb */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <SafeIcon name={icon} className="w-4 h-4 opacity-80" />
                    <span className="text-xs opacity-80">{label}</span>
                </div>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}

/**
 * Alert Item - Clean design
 */
function AlertItem({
    severity,
    title,
    subtitle,
    badge,
    detail,
    recommendation
}: {
    severity: 'critical' | 'warning';
    title: string;
    subtitle: string;
    badge: string;
    detail?: string;
    recommendation: string;
}) {
    const isCritical = severity === 'critical';

    return (
        <div className={`group p-4 rounded-xl border transition-all hover:shadow-md ${isCritical
            ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
            }`}>
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{title}</p>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
                <Badge variant={isCritical ? 'destructive' : 'secondary'} className="shrink-0">
                    {badge}
                </Badge>
            </div>

            {detail && (
                <p className={`text-sm font-medium mb-2 ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {detail}
                </p>
            )}

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                <SafeIcon name="Lightbulb" className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                <span>{recommendation}</span>
            </div>
        </div>
    );
}

/**
 * Alert Section Card
 */
function AlertSectionCard({
    title,
    icon,
    iconBg,
    iconColor,
    count,
    criticalCount,
    children,
    emptyMessage,
    isEmpty
}: {
    title: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    count: number;
    criticalCount: number;
    children?: React.ReactNode;
    emptyMessage: string;
    isEmpty: boolean;
}) {
    if (isEmpty) {
        return (
            <Card className="bg-card dark:bg-card shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                            <SafeIcon name={icon} className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <p className="font-semibold text-foreground">{title}</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl">
                        <SafeIcon name="CheckCircle2" className="w-5 h-5" />
                        <span className="text-sm font-medium">{emptyMessage}</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card dark:bg-card shadow-lg rounded-2xl border-0 overflow-hidden">
            <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                            <SafeIcon name={icon} className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {criticalCount > 0 && (
                            <Badge variant="destructive" className="animate-pulse">
                                {criticalCount} critical
                            </Badge>
                        )}
                        <Badge variant="secondary">
                            {count} total
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                {children}
            </CardContent>
        </Card>
    );
}

/**
 * Main DSS Alert Section Component
 */
export default function DSSAlertSection() {
    const [data, setData] = useState<DSSAlertsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showStockAlerts, setShowStockAlerts] = useState(true);

    useEffect(() => {
        // Read stockAlerts setting from localStorage
        const savedStockAlerts = localStorage.getItem('app_stockAlerts');
        setShowStockAlerts(savedStockAlerts !== 'false'); // Default to true if not set

        fetchDSSAlerts();
    }, []);

    const fetchDSSAlerts = async () => {
        try {
            if (data) setIsRefreshing(true);
            else setLoading(true);
            setError(null);
            const result = await dashboardApi.getDSSAlerts();
            setData(result);
        } catch (err) {
            console.error('Failed to fetch DSS alerts:', err);
            setError('Gagal memuat data DSS alerts');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    if (loading) {
        return <DSSAlertSkeleton />;
    }

    if (error || !data) {
        return (
            <Card className="bg-card shadow-lg rounded-2xl border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <SafeIcon name="AlertCircle" className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">{error || 'Data tidak tersedia'}</p>
                    <Button onClick={fetchDSSAlerts} variant="outline">
                        <SafeIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                        Coba Lagi
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const hasAlerts = (showStockAlerts && data.lowStockAlerts.length > 0) || data.paymentOverdueAlerts.length > 0;
    const visibleAlertCount = (showStockAlerts ? data.lowStockAlerts.length : 0) + data.paymentOverdueAlerts.length;
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
            {/* Header - matching dashboard header style */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent" />
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Perlu Tindakan!
                            {hasAlerts && (
                                <Badge variant="destructive" className="animate-pulse text-xs">
                                    {visibleAlertCount} alerts
                                </Badge>
                            )}
                        </h2>
                        <p className="text-sm text-muted-foreground/80">AI-powered operational insights</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchDSSAlerts()}
                    disabled={isRefreshing}
                >
                    <SafeIcon name="RefreshCw" className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Loading...' : 'Refresh'}
                </Button>
            </div>


            {/* Health Score + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Health Score - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <HealthScoreRing score={data.summary.overallHealthScore} />
                </div>

                {/* Quick Stats - Takes 3 columns */}
                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard
                        label="Pending"
                        value={data.summary.pendingOrdersCount}
                        icon="ClipboardList"
                        gradient="from-cyan-500 to-blue-600"
                        textColor="text-white"
                    />
                    <StatCard
                        label="Urgent"
                        value={data.summary.urgentOrdersCount}
                        icon="Truck"
                        gradient="from-purple-500 to-violet-600"
                        textColor="text-white"
                    />
                    <StatCard
                        label="Low Stock"
                        value={data.summary.totalLowStockProducts}
                        icon="Package"
                        gradient="from-amber-500 to-orange-600"
                        textColor="text-white"
                    />
                    <StatCard
                        label="Overdue"
                        value={data.summary.totalOverduePayments}
                        icon="AlertCircle"
                        gradient="from-rose-500 to-red-600"
                        textColor="text-white"
                    />
                </div>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Low Stock Alerts - Conditional based on settings */}
                {showStockAlerts ? (
                    <AlertSectionCard
                        title="Low Stock Alerts"
                        icon="Package"
                        iconBg="bg-amber-100 dark:bg-amber-500/20"
                        iconColor="text-amber-600 dark:text-amber-400"
                        count={data.lowStockAlerts.length}
                        criticalCount={data.lowStockAlerts.filter(a => a.severity === 'critical').length}
                        isEmpty={data.lowStockAlerts.length === 0}
                        emptyMessage="Semua stok dalam kondisi aman"
                    >
                        {data.lowStockAlerts.map(alert => (
                            <AlertItem
                                key={alert.id}
                                severity={alert.severity}
                                title={alert.name}
                                subtitle={`Stok: ${alert.currentStock} unit`}
                                badge={alert.severity === 'critical' ? 'Kritis' : 'Warning'}
                                recommendation={alert.recommendation}
                            />
                        ))}
                    </AlertSectionCard>
                ) : (
                    <Card className="bg-card dark:bg-card shadow-lg rounded-2xl border-0 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                    <SafeIcon name="Package" className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <p className="font-semibold text-foreground">Low Stock Alerts</p>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-3 rounded-xl">
                                <SafeIcon name="EyeOff" className="w-5 h-5" />
                                <span className="text-sm">Notifikasi stok dinonaktifkan dari Pengaturan</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Payment Overdue Alerts */}
                <AlertSectionCard
                    title="Payment Overdue"
                    icon="Wallet"
                    iconBg="bg-red-100 dark:bg-red-500/20"
                    iconColor="text-red-600 dark:text-red-400"
                    count={data.paymentOverdueAlerts.length}
                    criticalCount={data.paymentOverdueAlerts.filter(a => a.severity === 'critical').length}
                    isEmpty={data.paymentOverdueAlerts.length === 0}
                    emptyMessage="Tidak ada pembayaran terlambat"
                >
                    {data.paymentOverdueAlerts.map(alert => (
                        <AlertItem
                            key={alert.orderId}
                            severity={alert.severity}
                            title={alert.pangkalanName}
                            subtitle={alert.orderCode}
                            badge={`${alert.daysOverdue} hari`}
                            detail={`Sisa: ${formatCurrency(alert.totalAmount - alert.amountPaid)}`}
                            recommendation={alert.recommendation}
                        />
                    ))}
                </AlertSectionCard>
            </div>

            {/* Footer */}
            <div className="text-xs text-muted-foreground text-right">
                Last updated: {new Date(data.generatedAt).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })}
            </div>
        </div>
    );
}
