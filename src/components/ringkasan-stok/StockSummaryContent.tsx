
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StockSummaryCards from '@/components/ringkasan-stok/StockSummaryCards'
import StockConsumptionChart from '@/components/ringkasan-stok/StockConsumptionChart'
import SafeIcon from '@/components/common/SafeIcon'

export default function StockSummaryContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showManageProducts, setShowManageProducts] = useState(false)

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Stok LPG</h1>
          <p className="text-muted-foreground mt-1">
            Pantau dan kelola ketersediaan LPG. Klik <strong>Edit</strong> pada card untuk update stok.
          </p>
        </div>
        {/* Admin Management Button */}
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => window.location.href = '/kelola-produk-lpg'}
        >
          <SafeIcon name="Settings" className="h-4 w-4 mr-2" />
          Kelola Produk LPG
        </Button>
      </div>

      {/* Stock Cards with Inline Edit */}
      <StockSummaryCards refreshTrigger={refreshTrigger} />

      {/* Stock Consumption Chart */}
      <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
        <Card className="border-2 shadow-soft">
          <CardHeader className="pb-2 pt-4 px-6">
            <CardTitle className="text-base font-bold">Grafik Pemakaian Mingguan</CardTitle>
            <CardDescription className="text-xs">Tren pemakaian stok LPG dalam 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <StockConsumptionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
