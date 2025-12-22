'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import StockSummaryCards from '@/components/ringkasan-stok/StockSummaryCards'
import WeeklyConsumptionChart from '@/components/ringkasan-stok/WeeklyConsumptionChart'
// UpdateStokModal removed - inline edit on cards replaces this
import ManageLPGTypesModal from '@/components/ringkasan-stok/ManageLPGTypesModal'
import SafeIcon from '@/components/common/SafeIcon'
import AnimatedNumber from '@/components/common/AnimatedNumber'
import { lpgProductsApi, type LpgProductWithStock } from '@/lib/api'

/**
 * Loading skeleton untuk header dengan shimmer effect
 */
const HeaderSkeleton = () => (
  <div className="rounded-2xl p-4 animate-pulse border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5">
    <div className="flex flex-col xl:flex-row xl:items-center gap-4">
      {/* Left: Title + Total */}
      <div className="flex items-center gap-4 flex-1">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/50 to-accent/50 w-[52px] h-[52px]" />
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-muted rounded animate-shimmer" />
            <div className="h-9 w-32 bg-muted rounded animate-shimmer" />
            <div className="h-4 w-10 bg-muted rounded animate-shimmer" />
          </div>
          <div className="h-4 w-56 bg-muted rounded animate-shimmer" />
        </div>
      </div>

      {/* Center: Stats Badges Skeleton */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <div className="h-3 w-12 bg-muted rounded animate-shimmer" />
            <div className="h-5 w-14 bg-muted rounded animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Right: Actions Skeleton */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-24 bg-muted rounded-lg animate-shimmer" />
        ))}
      </div>
    </div>
  </div>
)

export default function RingkasanStokPageContent() {
  // showUpdateModal removed - inline edit on cards replaces this
  const [showManageLPGModal, setShowManageLPGModal] = useState(false)
  const [stats, setStats] = useState({ total: 0, subsidi: 0, nonSubsidi: 0, products: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch stats for header
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const products = await lpgProductsApi.getWithStock()
        const total = products.reduce((sum, p) => sum + (p.stock?.current || 0), 0)
        const subsidi = products.filter(p => p.category === 'SUBSIDI').reduce((sum, p) => sum + (p.stock?.current || 0), 0)
        const nonSubsidi = products.filter(p => p.category === 'NON_SUBSIDI').reduce((sum, p) => sum + (p.stock?.current || 0), 0)
        setStats({ total, subsidi, nonSubsidi, products: products.length })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setIsLoading(false)
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
          {isLoading ? (
            <HeaderSkeleton />
          ) : (
            <div className="rounded-2xl p-4 animate-fadeInUp border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 shadow-lg backdrop-blur-sm">
              <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                {/* Left: Title + Total */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                    <SafeIcon name="Package" className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl font-bold tracking-tight text-foreground">
                        Stok LPG
                      </h1>
                      <span className="text-3xl font-bold text-primary">
                        <AnimatedNumber value={stats.total} delay={100} />
                      </span>
                      <span className="text-sm text-muted-foreground">unit</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Kelola stok LPG subsidi dan non-subsidi
                    </p>
                  </div>
                </div>

                {/* Center: Stats Badges with AnimatedNumber */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
                    <span className="text-xs text-muted-foreground">Subsidi</span>
                    <span className="text-lg font-bold text-primary">
                      <AnimatedNumber value={stats.subsidi} delay={200} />
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 dark:bg-accent/20">
                    <span className="text-xs text-muted-foreground">Non-Subsidi</span>
                    <span className="text-lg font-bold text-accent">
                      <AnimatedNumber value={stats.nonSubsidi} delay={300} />
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 dark:bg-muted/30">
                    <span className="text-xs text-muted-foreground">Produk</span>
                    <span className="text-lg font-bold text-foreground">
                      <AnimatedNumber value={stats.products} delay={400} />
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <a href="/penerimaan">
                    <Button variant="outline" size="sm" className="gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/50">
                      <SafeIcon name="PackagePlus" className="h-4 w-4" />
                      <span className="hidden sm:inline">Penerimaan</span>
                    </Button>
                  </a>
                  <a href="/in-out-agen">
                    <Button variant="outline" size="sm" className="gap-1.5 hover:bg-accent/10 hover:text-accent hover:border-accent/50">
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
          )}

          {/* Stock Summary Cards (without top summary) */}
          <StockSummaryCards showSummary={false} refreshTrigger={refreshTrigger} />

          {/* Weekly Consumption Chart - Syncs with active products */}
          <WeeklyConsumptionChart refreshTrigger={refreshTrigger} />
        </div>
      </main>

      {/* Update Stok Modal removed - inline edit on cards replaces this */}

      {/* Manage LPG Types Modal */}
      <ManageLPGTypesModal
        open={showManageLPGModal}
        onOpenChange={setShowManageLPGModal}
        onProductUpdate={handleProductUpdate}
      />
    </>
  )
}