/**
 * RiwayatPenjualanPage - Riwayat Penjualan
 * 
 * PENJELASAN:
 * Halaman untuk melihat history penjualan dengan filter dan pagination.
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import { consumerOrdersApi, type ConsumerOrder, type ConsumerPaymentStatus } from '@/lib/api'
import { toast } from 'sonner'

export default function RiwayatPenjualanPage() {
    const [orders, setOrders] = useState<ConsumerOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [paymentFilter, setPaymentFilter] = useState<string>('all')

    const fetchOrders = async () => {
        try {
            setIsLoading(true)
            const options = paymentFilter !== 'all'
                ? { paymentStatus: paymentFilter as ConsumerPaymentStatus }
                : undefined
            const response = await consumerOrdersApi.getAll(page, 10, options)
            setOrders(response.data)
            setTotalPages(response.meta.totalPages)
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            toast.error('Gagal memuat data penjualan')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [page, paymentFilter])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const handleMarkAsPaid = async (order: ConsumerOrder) => {
        try {
            await consumerOrdersApi.update(order.id, { payment_status: 'LUNAS' })
            toast.success('Status diubah menjadi Lunas')
            fetchOrders()
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengubah status')
        }
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Riwayat Penjualan</h1>
                    <p className="text-muted-foreground">Lihat semua transaksi penjualan</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <a href="/pangkalan/penjualan/catat">
                        <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                        Catat Penjualan
                    </a>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="LUNAS">Lunas</SelectItem>
                        <SelectItem value="HUTANG">Hutang</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders List */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <SafeIcon name="ShoppingCart" className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Belum ada penjualan</p>
                            <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                                <a href="/pangkalan/penjualan/catat">
                                    <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                                    Catat Penjualan Pertama
                                </a>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <SafeIcon name="ShoppingBag" className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {order.consumers?.name || order.consumer_name || 'Walk-in'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.code} • {order.lpg_type} × {order.qty} • {formatDate(order.sale_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                                            <Badge
                                                variant={order.payment_status === 'LUNAS' ? 'default' : 'destructive'}
                                                className={order.payment_status === 'LUNAS' ? 'bg-green-100 text-green-700' : ''}
                                            >
                                                {order.payment_status === 'LUNAS' ? 'Lunas' : 'Hutang'}
                                            </Badge>
                                        </div>
                                        {order.payment_status === 'HUTANG' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleMarkAsPaid(order)}
                                            >
                                                <SafeIcon name="Check" className="mr-1 h-3 w-3" />
                                                Lunasi
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Halaman {page} dari {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        <SafeIcon name="ChevronRight" className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
