'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import StockSummaryCards from '@/components/ringkasan-stok/StockSummaryCards'
import WeeklyConsumptionChart from '@/components/ringkasan-stok/WeeklyConsumptionChart'
import UpdateStokModal from '@/components/ringkasan-stok/UpdateStokModal'
import ManageLPGTypesModal from '@/components/ringkasan-stok/ManageLPGTypesModal'
import SafeIcon from '@/components/common/SafeIcon'
import { lpgProductsApi, type LpgProductWithStock } from '@/lib/api'

export default function RingkasanStokPageContent() {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showManageLPGModal, setShowManageLPGModal] = useState(false)
  const [stats, setStats] = useState({ total: 0, subsidi: 0, nonSubsidi: 0, products: 0 })
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch stats for header
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const products = await lpgProductsApi.getWithStock()
        const total = products.reduce((sum, p) => sum + (p.stock?.current || 0), 0)
        const subsidi = products.filter(p => p.category === 'SUBSIDI').reduce((sum, p) => sum + (p.stock?.current || 0), 0)
        const nonSubsidi = products.filter(p => p.category === 'NON_SUBSIDI').reduce((sum, p) => sum + (p.stock?.current || 0), 0)
        setStats({ total, subsidi, nonSubsidi, products: products.length })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }
    fetchStats()
  }, [refreshTrigger])

  const handleProductUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleManageLPGClick = () => {
    setShowManageLPGModal(true)
  }

  return (
    <>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6 p-6">
          {/* Compact Header with Stats - Enhanced Background */}
          <div
            className="rounded-2xl p-4 animate-fadeInUp border border-green-200/30"
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(16,185,129,0.08) 50%, rgba(5,150,105,0.05) 100%)',
              boxShadow: '0 4px 20px -4px rgba(34,197,94,0.15), inset 0 1px 1px rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex flex-col xl:flex-row xl:items-center gap-4">
              {/* Left: Title + Total */}
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600" style={{ boxShadow: '0 4px 12px -2px rgba(34,197,94,0.4)' }}>
                  <SafeIcon name="Package" className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                      Stok LPG
                    </h1>
                    <span className="text-3xl font-bold text-primary">{stats.total.toLocaleString('id-ID')}</span>
                    <span className="text-sm text-muted-foreground">unit</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kelola stok LPG subsidi dan non-subsidi
                  </p>
                </div>
              </div>

              {/* Center: Stats Badges */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10">
                  <span className="text-xs text-muted-foreground">Subsidi</span>
                  <span className="text-lg font-bold text-green-600">{stats.subsidi.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10">
                  <span className="text-xs text-muted-foreground">Non-Subsidi</span>
                  <span className="text-lg font-bold text-blue-600">{stats.nonSubsidi.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10">
                  <span className="text-xs text-muted-foreground">Produk</span>
                  <span className="text-lg font-bold text-purple-600">{stats.products}</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <a href="/penerimaan">
                  <Button variant="outline" size="sm" className="gap-1.5 hover:bg-green-50 hover:text-green-700 hover:border-green-300">
                    <SafeIcon name="PackagePlus" className="h-4 w-4" />
                    <span className="hidden sm:inline">Penerimaan</span>
                  </Button>
                </a>
                <a href="/in-out-agen">
                  <Button variant="outline" size="sm" className="gap-1.5 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300">
                    <SafeIcon name="ArrowLeftRight" className="h-4 w-4" />
                    <span className="hidden sm:inline">In/Out</span>
                  </Button>
                </a>
                <Button
                  onClick={handleManageLPGClick}
                  size="sm"
                  className="gap-1.5 bg-gradient-to-r from-primary to-primary/80"
                >
                  <SafeIcon name="Settings2" className="h-4 w-4" />
                  <span className="hidden sm:inline">Kelola</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stock Summary Cards (without top summary) */}
          <StockSummaryCards showSummary={false} refreshTrigger={refreshTrigger} />

          {/* Weekly Consumption Chart - Syncs with active products */}
          <WeeklyConsumptionChart refreshTrigger={refreshTrigger} />
        </div>
      </main>

      {/* Update Stok Modal */}
      <UpdateStokModal
        open={showUpdateModal}
        onOpenChange={setShowUpdateModal}
      />

      {/* Manage LPG Types Modal */}
      <ManageLPGTypesModal
        open={showManageLPGModal}
        onOpenChange={setShowManageLPGModal}
        onProductUpdate={handleProductUpdate}
      />
    </>
  )
}