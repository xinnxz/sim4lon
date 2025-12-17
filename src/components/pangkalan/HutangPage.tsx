/**
 * HutangPage - Halaman Tracking Hutang/Piutang
 * 
 * Menampilkan daftar penjualan dengan status HUTANG
 * dan memungkinkan untuk melunasi hutang
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { consumerOrdersApi, type ConsumerOrder } from '@/lib/api'
import { toast } from 'sonner'

export default function HutangPage() {
    const [orders, setOrders] = useState<ConsumerOrder[]>([])
    const [totalHutang, setTotalHutang] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            setIsLoading(true)
            const response = await consumerOrdersApi.getAll(1, 100, { paymentStatus: 'HUTANG' })
            setOrders(response.data)

            // Calculate total
            const total = response.data.reduce((sum, order) => sum + order.total_amount, 0)
            setTotalHutang(total)
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            toast.error('Gagal memuat data hutang')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleMarkAsPaid = async (order: ConsumerOrder) => {
        try {
            await consumerOrdersApi.update(order.id, { payment_status: 'LUNAS' })
            toast.success('Berhasil dilunasi!')
            fetchOrders()
        } catch (error: any) {
            toast.error(error.message || 'Gagal melunasi')
        }
    }

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
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hutang</h1>
                <p className="text-slate-500">Daftar piutang yang belum lunas</p>
            </div>

            {/* Total Card */}
            <Card className="mb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm mb-1">Total Hutang</p>
                            <p className="text-4xl font-bold">{formatCurrency(totalHutang)}</p>
                            <p className="text-orange-100 text-sm mt-2">
                                {orders.length} transaksi belum lunas
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <SafeIcon name="Receipt" className="h-8 w-8" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* List */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Daftar Hutang</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <SafeIcon name="CheckCircle" className="h-16 w-16 mx-auto mb-4 text-green-500" />
                            <p className="text-lg font-medium">Tidak ada hutang!</p>
                            <p className="text-sm">Semua transaksi sudah lunas</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                            <SafeIcon name="User" className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {order.consumers?.name || order.consumer_name || 'Walk-in'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {order.lpg_type} × {order.qty} • {formatDate(order.sale_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-orange-600">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                Hutang
                                            </Badge>
                                        </div>
                                        <Button
                                            onClick={() => handleMarkAsPaid(order)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <SafeIcon name="Check" className="mr-1 h-4 w-4" />
                                            Lunasi
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
