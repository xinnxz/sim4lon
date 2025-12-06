'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import StockActions from '@/components/ringkasan-stok/StockActions'
import StockSummaryCards from '@/components/ringkasan-stok/StockSummaryCards'
import WeeklyConsumptionChart from '@/components/ringkasan-stok/WeeklyConsumptionChart'
import UpdateStokModal from '@/components/ringkasan-stok/UpdateStokModal'
import SafeIcon from '@/components/common/SafeIcon'

export default function RingkasanStokPageContent() {
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const handleUpdateStokClick = () => {
    setShowUpdateModal(true)
  }

  return (
    <>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6 p-6" style={{ margin: '0px 20px 0px 30px' }}>
          {/* Back Button */}
          <div className="flex items-center gap-2 mb-2">
            <a href="./dashboard-admin.html" className="text-primary hover:underline flex items-center gap-1">
              <SafeIcon name="ArrowLeft" className="h-4 w-4" />
              Kembali
            </a>
          </div>

          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight" style={{ margin: '0px 0px 0px 10px' }}>
              Stok LPG
            </h1>
            <StockActions onUpdateClick={handleUpdateStokClick} />
          </div>

          {/* Stock Summary Cards */}
          <StockSummaryCards />

          {/* Weekly Consumption Chart */}
          <WeeklyConsumptionChart />
        </div>
      </main>

      {/* Update Stok Modal */}
      <UpdateStokModal 
        open={showUpdateModal} 
        onOpenChange={setShowUpdateModal}
      />
    </>
  )
}