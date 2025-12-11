
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SafeIcon from '@/components/common/SafeIcon'
import StatusPembayaranChart from '@/components/status-pembayaran/StatusPembayaranChart'
import PaymentSummaryCards from '@/components/status-pembayaran/PaymentSummaryCards'
import PaymentDetailTable from '@/components/status-pembayaran/PaymentDetailTable'
import ReportNavigation from '@/components/pemakaian-stok/ReportNavigation'

const mockPaymentData = {
  summary: {
    totalOrders: 156,
    paidAmount: 45000000,
    unpaidAmount: 12500000,
    pendingAmount: 8750000,
    paidPercentage: 72,
    unpaidPercentage: 20,
    pendingPercentage: 8,
  },
  details: [
    {
      id: 'ORD-001',
      pangkalan: 'Pangkalan Maju Jaya',
      amount: 5000000,
      status: 'Lunas',
      date: '2024-01-15',
      dueDate: '2024-01-20',
    },
    {
      id: 'ORD-002',
      pangkalan: 'Pangkalan Sejahtera',
      amount: 3500000,
      status: 'Belum Dibayar',
      date: '2024-01-14',
      dueDate: '2024-01-21',
    },
    {
      id: 'ORD-004',
      pangkalan: 'Pangkalan Utama',
      amount: 4200000,
      status: 'Lunas',
      date: '2024-01-12',
      dueDate: '2024-01-19',
    },
    {
      id: 'ORD-005',
      pangkalan: 'Pangkalan Maju Jaya',
      amount: 1800000,
      status: 'Belum Dibayar',
      date: '2024-01-11',
      dueDate: '2024-01-22',
    },
  ]
}

export default function PaymentStatusPage() {
  const [dateRange, setDateRange] = useState('month')


  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Status Pembayaran</h1>
          <p className="text-muted-foreground mt-1">
            Ringkasan status pembayaran pesanan dan analisis keuangan
          </p>
        </div>
        <Button
          variant="outline"
          asChild
          className="w-full sm:w-auto"
        >
          <a href="./dashboard-laporan.html">
            <SafeIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Kembali
          </a>
        </Button>
      </div>

      {/* Report Navigation Tabs */}
      <ReportNavigation currentPage="status_pembayaran" />

      {/* Summary Cards */}
      <PaymentSummaryCards data={mockPaymentData.summary} />

      {/* Main Content */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Grafik</TabsTrigger>
          <TabsTrigger value="details">Detail Pembayaran</TabsTrigger>
        </TabsList>

        {/* Chart Tab */}
        <TabsContent value="chart" className="space-y-6">
          <Card className="animate-fadeInUp">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Distribusi Status Pembayaran</CardTitle>
                  <CardDescription>
                    Persentase pesanan berdasarkan status pembayaran
                  </CardDescription>
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="week">Minggu Ini</option>
                  <option value="month">Bulan Ini</option>
                  <option value="quarter">Kuartal Ini</option>
                  <option value="year">Tahun Ini</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <StatusPembayaranChart data={mockPaymentData.summary} />
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockPaymentData.summary.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pesanan dalam periode ini
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Rata-rata Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {(mockPaymentData.summary.paidAmount / mockPaymentData.summary.totalOrders / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per pesanan
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tingkat Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockPaymentData.summary.paidPercentage}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pesanan yang sudah dibayar
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="animate-fadeInUp">
            <CardHeader>
              <CardTitle>Detail Pembayaran</CardTitle>
              <CardDescription>
                Daftar lengkap status pembayaran untuk setiap pesanan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentDetailTable data={mockPaymentData.details} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
