
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'
import PemakaianStokChart from './PemakaianStokChart'
import ReportNavigation from './ReportNavigation'

export default function PemakaianStokContent() {
  const [period, setPeriod] = useState('30')

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Pemakaian Stok</h1>
          <p className="text-muted-foreground mt-1">
            Analisis pemakaian stok LPG berdasarkan periode waktu
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <a href="./dashboard-laporan.html">
            <SafeIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Kembali
          </a>
        </Button>
      </div>

      {/* Report Navigation Tabs */}
      <ReportNavigation currentPage="pemakaian_stok" />

      {/* Period Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Periode</CardTitle>
          <CardDescription>
            Pilih periode untuk melihat data pemakaian stok
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Periode</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Hari Terakhir</SelectItem>
                  <SelectItem value="14">14 Hari Terakhir</SelectItem>
                  <SelectItem value="30">30 Hari Terakhir</SelectItem>
                  <SelectItem value="90">90 Hari Terakhir</SelectItem>
                  <SelectItem value="365">1 Tahun Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full sm:w-auto">
              <SafeIcon name="RefreshCw" className="mr-2 h-4 w-4" />
              Perbarui
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <PemakaianStokChart period={period} />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Pemakaian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tabung dalam periode ini
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rata-rata Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81.7</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tabung per hari
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pemakaian Tertinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pada 15 Januari 2025
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by Type */}
      <Card className="animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
        <CardHeader>
          <CardTitle>Pemakaian Berdasarkan Jenis LPG</CardTitle>
          <CardDescription>
            Distribusi pemakaian untuk setiap jenis tabung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">LPG 3kg</span>
                <span className="text-sm font-bold">1,200 tabung (49%)</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '49%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">LPG 12kg</span>
                <span className="text-sm font-bold">900 tabung (37%)</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '37%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">LPG 50kg</span>
                <span className="text-sm font-bold">350 tabung (14%)</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-chart-3 h-2 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
