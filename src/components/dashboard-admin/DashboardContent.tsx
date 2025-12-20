
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import CreateOrderButton from './CreateOrderButton'
import DashboardKPICards from './DashboardKPICards'
import SalesChart from './charts/SalesChart'
import StockChart from './charts/StockChart'
import ProfitChart from './charts/ProfitChart'
import PangkalanOrderChart from './charts/PangkalanOrderChart'
import RecentActivitySection from './RecentActivitySection'
import ChartContainer from './ChartContainer'

/**
 * Floating Particles - Decorative ambient particles
 * 8 particles dengan various sizes dan warna untuk efek premium
 */
function FloatingParticles() {
  return (
    <div className="particles-container">
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
    </div>
  )
}

export default function DashboardContent() {
  return (
    <div id="is6jwg" className="relative flex-1 space-y-8 p-4 sm:p-6 lg:p-8 mesh-gradient-bg min-h-screen overflow-hidden">
      {/* Floating Particles Background Decoration */}
      <FloatingParticles />

      {/* Header with Premium Animated Gradient */}
      <div className="relative z-10 flex flex-col gap-3 sm:gap-4 animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent animate-lineGrow" />
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gradient-animated">
              Dashboard
            </h1>
          </div>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl pl-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          Selamat datang kembali! Berikut adalah ringkasan operasional Anda hari ini.
        </p>
      </div>

      {/* Create Order Button */}
      <div className="relative z-10 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <CreateOrderButton />
      </div>


      {/* KPI Cards */}
      <div className="relative z-10">
        <DashboardKPICards />
      </div>

      {/* Sales Chart */}
      <div className="relative z-10">
        <ChartContainer animationDelay="0.5s">
          {(isVisible) => (
            <div className="w-full animate-fadeInUp chart-sales" style={{ animationDelay: '0.3s' }}>
              <Card className="chart-card-premium border-0">
                <CardHeader className="pb-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <CardTitle id="i1oio5" className="text-lg sm:text-xl font-semibold">Pesanan Mingguan</CardTitle>
                  </div>
                  <CardDescription id="iwkknt" className="text-xs sm:text-sm">Ringkasan pemesanan gas 7 hari terakhir</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-4">
                  <div className="w-full h-64 sm:h-72 lg:h-80">
                    <SalesChart isVisible={isVisible} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* Stock & Profit Charts */}
      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChartContainer animationDelay="0.6s">
          {(isVisible) => (
            <div className="animate-fadeInUp chart-stock" style={{ animationDelay: '0.4s' }}>
              <Card className="chart-card-premium border-0">
                <CardHeader className="pb-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <CardTitle id="ixkzi5" className="text-lg font-semibold">Pemakaian LPG</CardTitle>
                  </div>
                  <CardDescription id="ico6v7" className="text-xs sm:text-sm">Konsumsi stok per hari minggu ini</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-4">
                  <div className="w-full h-64 sm:h-72">
                    <StockChart isVisible={isVisible} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ChartContainer>
        <ChartContainer animationDelay="0.65s">
          {(isVisible) => (
            <div className="animate-fadeInUp chart-profit" style={{ animationDelay: '0.45s' }}>
              <Card className="chart-card-premium border-0">
                <CardHeader className="pb-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <CardTitle className="text-lg font-semibold">Keuntungan</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">Profit harian (Penjualan - Modal)</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-4">
                  <div className="w-full h-64 sm:h-72">
                    <ProfitChart isVisible={isVisible} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* Pangkalan Orders & Recent Activity - Side by Side */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pangkalan Order Chart */}
        <ChartContainer animationDelay="0.7s">
          {(isVisible) => (
            <div className="animate-fadeInUp h-full" style={{ animationDelay: '0.5s' }}>
              <Card className="h-full chart-card-premium border-0 flex flex-col">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <CardTitle className="text-lg font-semibold">Top Pangkalan</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">3 pangkalan dengan order terbanyak</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-4 pt-4 flex flex-col">
                  <div className="w-full flex-1 min-h-[240px]">
                    <PangkalanOrderChart isVisible={isVisible} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ChartContainer>

        {/* Recent Activity */}
        <ChartContainer animationDelay="0.75s">
          {(isVisible) => (
            <div className="animate-fadeInUp h-full" style={{ animationDelay: '0.55s' }}>
              <RecentActivitySection />
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
