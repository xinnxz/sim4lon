
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import StockActions from '@/components/ringkasan-stok/StockActions'
import KPISummaryCards from '@/components/ringkasan-stok/KPISummaryCards'
import StockSummaryCards from '@/components/ringkasan-stok/StockSummaryCards'
import StockConsumptionChart from '@/components/ringkasan-stok/StockConsumptionChart'
import UpdateStokModal from '@/components/ringkasan-stok/UpdateStokModal'
import ManageLPGTypesModal from '@/components/ringkasan-stok/ManageLPGTypesModal'

export default function StockSummaryContent() {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showManageLPGModal, setShowManageLPGModal] = useState(false)

  const handleUpdateStokClick = () => {
    setShowUpdateModal(true)
  }

  const handleManageLPGClick = () => {
    setShowManageLPGModal(true)
  }

  return (
    <>
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Stok LPG</h1>
            <p className="text-muted-foreground mt-1">Pantau ketersediaan LPG berdasarkan jenis tabung</p>
          </div>
        </div>

        {/* Action Buttons */}
        <StockActions 
          onUpdateClick={handleUpdateStokClick}
          onManageLPGClick={handleManageLPGClick}
        />

        {/* KPI Summary Cards */}
        <KPISummaryCards />

        {/* Stock Detail Cards */}
        <StockSummaryCards />

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

      {/* Update Stok Modal */}
      <UpdateStokModal 
        open={showUpdateModal} 
        onOpenChange={setShowUpdateModal}
      />

      {/* Manage LPG Types Modal */}
      <ManageLPGTypesModal 
        open={showManageLPGModal} 
        onOpenChange={setShowManageLPGModal}
      />
    </>
  )
}
